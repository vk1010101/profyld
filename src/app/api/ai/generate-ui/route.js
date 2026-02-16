
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Using Gemini 2.5 Flash as requested (matching CV parser)
const MODEL_NAME = "gemini-2.5-flash";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const systemPrompt = `
        You are an expert UI designer for a portfolio builder.
        Your goal is to generate a clean, modern, and professional website section based on the user's request.

        CRITICAL: YOU MUST RETURN A SINGLE JSON OBJECT. DO NOT WRAP IT IN MARKDOWN OR CODE BLOCKS.
        
        The JSON object must have a "type" field matching one of the following block types, and a "config" object with the specific fields for that type.

        SUPPORTED BLOCK TYPES & SCHEMAS:

        1. "hero":
           {
             "type": "hero",
             "config": {
               "title": "Main Headline",
               "subtitle": "Subheadline or Role",
               "tagline": "Small top tagline",
               "backgroundType": "gradient" | "solid" | "image",
               "overlayOpacity": 0.5 (number 0-1)
             }
           }

        2. "about":
           {
             "type": "about",
             "config": {
               "sectionTitle": "About Me",
               "showBio": true,
               "showSkills": true,
               "showExperience": boolean,
               "showEducation": boolean
             }
           }

        3. "gallery":
           {
             "type": "gallery",
             "config": {
               "columns": 2 | 3 | 4,
               "aspectRatio": "1/1" | "4/3" | "16/9",
               "images": ["url1", "url2"] (Use placeholder images if needed: https://picsum.photos/400/300)
             }
           }
        
        4. "stats":
           {
             "type": "stats",
             "config": {
               "style": "minimal" | "cards",
               "items": [
                 { "value": "10+", "label": "Years Experience" },
                 { "value": "50+", "label": "Projects" }
               ]
             }
           }

        5. "html" (FALLBACK ONLY if request doesn't fit above types):
           {
             "type": "html",
             "config": {
               "html": "<section class='...'>...</section>" (Tailwind classes NOT supported, use inline styles or standard CSS)
             }
           }

        USER REQUEST: "${prompt}"
        
        Generate the best matching block type and configuration. Return ONLY the JSON string.
        `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return NextResponse.json(JSON.parse(text));

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate UI" }, { status: 500 });
    }
}
