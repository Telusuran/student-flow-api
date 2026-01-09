import dotenv from 'dotenv';
import path from 'path';

// Load env from one level up (api root)
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('No GEMINI_API_KEY found in .env');
        process.exit(1);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log(`Fetching models from: ${url.replace(apiKey, 'HIDDEN_KEY')}...`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response:', text);
            return;
        }

        const data = await response.json() as { models?: any[] };
        console.log('Available Models:');
        if (data && Array.isArray(data.models)) {
            data.models.forEach((m: any) => {
                if (m.supportedGenerationMethods?.includes('generateContent')) {
                    console.log(`- ${m.name} (Display: ${m.displayName})`);
                }
            });
        } else {
            console.log('No models found in response:', data);
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

listModels();
