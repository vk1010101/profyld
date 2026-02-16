import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';

const ANALYSIS_PROMPT = `You are an expert HR Manager and Technical Recruiter. Analyze the following CV data and provide a professional assessment.

Return ONLY a valid JSON object with this exact structure:
{
  "score": 85,
  "summary": "Short overall summary of the profile",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Area for improvement 1", "Area for improvement 2"],
  "suggestions": ["Actionable tip 1", "Actionable tip 2"],
  "roleFit": "Which roles this CV is best suited for"
}

CV Data:
`;

export async function POST(request) {
    try {
        // --- RATE LIMITING ---
        const ip = getClientIP(request);
        const { allowed, remaining } = rateLimit(ip, RATE_LIMITS.analyzeCv.limit, RATE_LIMITS.analyzeCv.windowMs);
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

        const body = await request.json();
        const { cvData } = body;

        if (!cvData) {
            return NextResponse.json({ error: 'CV data is required' }, { status: 400 });
        }

        // --- INPUT VALIDATION: Limit payload size ---
        const cvDataStr = JSON.stringify(cvData);
        if (cvDataStr.length > 100000) {
            return NextResponse.json({ error: 'CV data too large' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'AI Service not configured' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const result = await model.generateContent(ANALYSIS_PROMPT + cvDataStr);
        const responseText = result.response.text();
        const analysis = JSON.parse(responseText);

        return NextResponse.json({ success: true, analysis });
    } catch (error) {
        console.error('CV Analysis Error:', error);
        return NextResponse.json({ error: 'Failed to analyze CV' }, { status: 500 });
    }
}
