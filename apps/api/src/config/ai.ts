import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// AI Provider Configuration
// Primary: Groq (free, fast)
// Fallback: Gemini (if Groq fails)

// Initialize Groq
const groqClient = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

// Initialize Gemini (fallback)
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

// Using gemini-1.5-flash-latest for the latest available version
const geminiModel = genAI?.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
    },
});

// Log which providers are available
if (groqClient) {
    console.log('✅ Groq AI provider initialized (primary)');
} else {
    console.warn('⚠️ GROQ_API_KEY not set');
}

if (geminiModel) {
    console.log('✅ Gemini AI provider initialized (fallback)');
} else {
    console.warn('⚠️ GEMINI_API_KEY not set');
}

export const isAIEnabled = () => !!(groqClient || geminiModel);

// Unified AI completion interface
interface AICompletionOptions {
    prompt: string;
    temperature?: number;
    maxTokens?: number;
    json?: boolean;
}

export async function generateAICompletion(options: AICompletionOptions): Promise<string> {
    const { prompt, temperature = 0.7, maxTokens = 2048, json = true } = options;

    // Try Groq first (faster and free)
    // Using llama-3.3-70b-versatile (latest available)
    if (groqClient) {
        try {
            const completion = await groqClient.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: json
                            ? 'You are a helpful assistant. Always respond with valid JSON only, no markdown formatting.'
                            : 'You are a helpful assistant.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature,
                max_tokens: maxTokens,
                response_format: json ? { type: 'json_object' } : undefined,
            });

            return completion.choices[0]?.message?.content || '';
        } catch (error: any) {
            console.error('Groq API error, falling back to Gemini:', error.message);
        }
    }

    // Fallback to Gemini
    if (geminiModel) {
        try {
            const result = await geminiModel.generateContent(prompt);
            let text = result.response.text();
            // Clean markdown code blocks if present
            if (json) {
                text = text.replace(/```json\n?|\n?```/g, '').trim();
            }
            return text;
        } catch (error: any) {
            console.error('Gemini API error:', error.message);
            throw new Error('Both AI providers failed');
        }
    }

    throw new Error('No AI provider available');
}

// Export for backward compatibility
export const geminiFlash = geminiModel;
export const geminiPro = geminiModel;
