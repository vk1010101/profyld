import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';

const EXTRACTION_PROMPT = `You are a professional resume/CV parser. Extract structured information from the following resume text.

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just pure JSON):
{
  "name": "Full name of the person",
  "title": "Current job title or professional headline",
  "tagline": "A short professional tagline based on their experience",
  "bio": "A 2-3 sentence professional summary based on their experience",
  "contact_email": "Email address if found, or empty string",
  "experiences": [
    {
      "title": "Job title",
      "location": "Company name, City",
      "date_range": "Start - End (e.g., 'Jan 2020 - Present')",
      "description": "Brief description of the role",
      "bullet_points": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree name (e.g., 'Bachelor of Science in Computer Science')",
      "institution": "University/School name",
      "year_range": "Start - End year (e.g., '2016 - 2020')",
      "specialization": "Major or specialization if mentioned"
    }
  ],
  "skills": [
    {
      "name": "Skill name",
      "category": "technical or soft",
      "level": 80
    }
  ],
  "languages": ["Language 1 (Proficiency)", "Language 2 (Proficiency)"]
}

Important:
- Extract ALL experiences and education entries found
- For skills, estimate a level from 0-100 based on context clues
- If a field is not found, use empty string or empty array
- Keep bullet_points concise
- Bio should be professional and third-person

Resume text:
`;

export async function POST(request) {
    try {
        // --- RATE LIMITING ---
        const ip = getClientIP(request);
        const { allowed, remaining } = rateLimit(ip, RATE_LIMITS.parseCv.limit, RATE_LIMITS.parseCv.windowMs);
        if (!allowed) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please wait before trying again.' },
                { status: 429, headers: { 'X-RateLimit-Remaining': remaining.toString() } }
            );
        }

        // --- AUTH CHECK ---
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('[parse-cv] Starting CV parsing for user:', user.id);

        const body = await request.json();
        const { cvUrl, cvText } = body;

        if (!cvUrl && !cvText) {
            return NextResponse.json(
                { error: 'CV URL or text is required' },
                { status: 400 }
            );
        }

        // --- INPUT VALIDATION: Block local file paths (SSRF/LFI prevention) ---
        if (cvUrl) {
            if (cvUrl.match(/^[a-zA-Z]:\\/) || cvUrl.startsWith('/') || cvUrl.startsWith('file://')) {
                return NextResponse.json(
                    { error: 'Local file paths are not allowed. Please provide a valid URL.' },
                    { status: 400 }
                );
            }
            // Only allow HTTPS URLs
            try {
                const parsedUrl = new URL(cvUrl);
                if (parsedUrl.protocol !== 'https:') {
                    return NextResponse.json(
                        { error: 'Only HTTPS URLs are allowed.' },
                        { status: 400 }
                    );
                }
            } catch {
                return NextResponse.json(
                    { error: 'Invalid URL format.' },
                    { status: 400 }
                );
            }
        }

        // --- INPUT VALIDATION: Limit text size ---
        if (cvText && cvText.length > 50000) {
            return NextResponse.json(
                { error: 'CV text is too long. Maximum 50,000 characters.' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('[parse-cv] GEMINI_API_KEY is not defined');
            return NextResponse.json(
                { error: 'AI service not configured' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const validateData = (data) => {
            if (!Array.isArray(data.experiences)) data.experiences = [];
            if (!Array.isArray(data.education)) data.education = [];
            if (!Array.isArray(data.skills)) data.skills = [];
            return data;
        };

        // Fetch PDF from URL
        if (cvUrl && !cvText) {
            console.log('[parse-cv] Fetching PDF from URL:', cvUrl);
            const response = await fetch(cvUrl);
            if (!response.ok) {
                console.error('[parse-cv] Failed to fetch PDF:', response.statusText);
                return NextResponse.json(
                    { error: 'Failed to fetch CV file' },
                    { status: 400 }
                );
            }

            // Validate content size (max 20MB)
            const contentLength = parseInt(response.headers.get('content-length') || '0');
            if (contentLength > 20 * 1024 * 1024) {
                return NextResponse.json(
                    { error: 'File too large. Maximum 20MB.' },
                    { status: 400 }
                );
            }

            let pdfBuffer = await response.arrayBuffer();
            pdfBuffer = Buffer.from(pdfBuffer);

            const base64Pdf = pdfBuffer.toString('base64');

            try {
                const result = await model.generateContent([
                    {
                        inlineData: {
                            mimeType: 'application/pdf',
                            data: base64Pdf,
                        },
                    },
                    EXTRACTION_PROMPT,
                ]);

                const responseText = result.response.text();
                let extractedData = JSON.parse(responseText);
                extractedData = validateData(extractedData);

                return NextResponse.json({ success: true, data: extractedData });
            } catch (genError) {
                console.error('[parse-cv] Gemini error:', genError);
                if (genError.message?.includes('429')) {
                    return NextResponse.json(
                        { error: 'AI Service is currently busy. Please try again in 1 minute.', retryDelay: 60 },
                        { status: 429 }
                    );
                }
                return NextResponse.json(
                    { error: 'Failed to parse CV' },
                    { status: 500 }
                );
            }
        }

        // Parse from text
        if (cvText) {
            try {
                const result = await model.generateContent(EXTRACTION_PROMPT + cvText);
                const responseText = result.response.text();
                let extractedData = JSON.parse(responseText);
                extractedData = validateData(extractedData);

                return NextResponse.json({ success: true, data: extractedData });
            } catch (genError) {
                console.error('[parse-cv] Gemini error (text):', genError);
                if (genError.message?.includes('429')) {
                    return NextResponse.json(
                        { error: 'AI Service is currently busy. Please try again in 1 minute.', retryDelay: 60 },
                        { status: 429 }
                    );
                }
                return NextResponse.json(
                    { error: 'Failed to parse CV from text' },
                    { status: 500 }
                );
            }
        }

    } catch (error) {
        console.error('[parse-cv] Unhandled error:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
