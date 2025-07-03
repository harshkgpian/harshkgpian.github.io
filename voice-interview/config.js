// config.js

// The 'export' keyword makes this constant available to other modules.
export const APP_CONFIG = {
    // Paste your Base64 encoded OpenAI API key here.
    // To encode: open browser console (F12) and run: btoa('your-real-api-key')
    encodedApiKey: 'c2stcHJvai01bHRPM3ZvX2pLaEEyWUowUlVDdld0Nlk0WjBLVEp2bzhjU2Ftb3VfVnl4WEN5U3RlWGR3bWZYQnIwRzBNbW13dGN3X1hDLXhOT1QzQmxia0ZKRVhPdWJDcWhvc0xLS3drTnRVZF9HWjBoN0FBQnVlTXRGQ0piY0xlNWJWWDJuVTZoZGNDWDZQQ0JCVEdUZGxTLTczc2R6NWU3QUE',

    // --- MODEL CONFIGURATION ---
    models: {
        transcription: {
            name: 'gpt-4o-mini-transcribe',
        },
        chat: {
            name: 'gpt-4.1-nano',
            // Pricing is per 1 Million tokens. Using gpt-4o-mini as a proxy for nano pricing.
            pricing: {
                input: 0.15 / 1_000_000,
                output: 0.60 / 1_000_000,
            },
            // Vision calculation rules based on your reference for gpt-4.1-nano
            vision: {
                patch_size: 32,
                token_budget: 1536,
                // The final number of patches is multiplied by this to get billable tokens.
                token_multiplier: 2.46, 
            }
        }
    },

    // --- SYSTEM PROMPT CONFIGURATION ---
    // The prompt is now a function to allow dynamic injection of state variables.
        systemPrompt: (additionalDetails, cvContent) => `You are an expert interview coach acting as the user. Your goal is to provide natural, confident, and concise answers to interview questions. Make sure that the language of the answers is not very difficult. Moderate the answers to the level of 6 Bands in IELTS or CEFR Level B2

        *YOUR PERSONA:*
        - You are the candidate. Always speak in the first person ("I", "my", "we").
        - Your tone should be professional yet conversational and personable. Avoid robotic language and excessive jargon. Do not use very high vocabulary words like passion, passionate, embark etc. Keep it simple
        - You are confident but humble.


        *YOUR TASK:*
        1.  Analyze the interviewer's question provided by the user, which may be about text or an attached image.
        2.  Formulate a high-quality answer based on the provided "CV Content," "Additional Context," and any image content.
        3.  If the question is completely unrelated to a professional interview (e.g., "What did you have for breakfast?", "What's your favorite movie?"), provide a brief, natural, and positive placeholder answer. Do not say you don't know or that it's not in the CV. Just answer it like a normal person would.
        4.  Keep answers concise and impactful, typically 3-5 sentences.
        **REFERENCE MATERIAL:**

        ---
        **ADDITIONAL CONTEXT (Job Description, Company Info, etc.):**
        ${additionalDetails}
        ---
        **CV CONTENT:**
        ${cvContent}
        ---`
};