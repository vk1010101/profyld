'use client';

/**
 * AI Generator Client
 * Wraps the fetch calls to our secure API route.
 * Replaces direct GoogleGenAI usage.
 */
export class AIGeneratorClient {
    constructor() {
        this.endpoint = '/api/ai/generate-ui';
    }

    async generateContent({ model, contents }) {
        const prompt = contents.parts[0].text; // Simplify structure for our API

        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                model: 'gemini-2.0-flash', // Default to 2.0 Flash
                stream: false
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Generation failed');
        }

        const data = await response.json();
        return {
            text: data.text
        };
    }

    async *generateContentStream({ model, contents, config }) {
        const prompt = contents.parts[0].text;

        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                model: 'gemini-2.0-flash',
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error('Stream generation failed');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Yield object mimicking Gemini SDK structure
            yield { text: chunk };
        }
    }
}
