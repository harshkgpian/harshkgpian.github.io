// js/api.js
import { state } from './state.js';
import * as ui from './ui.js';

export async function transcribeAudio(audioBlob) {
    // ... (This function remains unchanged)
    ui.setStatus('Transcribing...');
    const formData = new FormData();
    formData.append('file', audioBlob, 'interview_audio.webm');
    formData.append('model', 'whisper-1');

    try {
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${state.apiKey}` },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || `API Error: ${response.status}`);
        return data.text;
    } catch (error) {
        ui.showError(`Transcription failed: ${error.message}`);
        return null;
    }
}

export async function getAIResponse(text) {
    ui.showTyping();
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${state.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert interview coach acting as the user. Your goal is to provide natural, confident, and concise answers to interview questions.

                        **YOUR PERSONA:**
                        - You are the candidate. Always speak in the first person ("I", "my", "we").
                        - Your tone should be professional yet conversational and personable. Avoid robotic language and excessive jargon.
                        - You are confident but humble.

                        **YOUR TASK:**
                        1.  Analyze the interviewer's question provided by the user.
                        2.  Formulate a high-quality answer based on the provided "CV Content" and "Additional Context".
                        3.  If the question is completely unrelated to a professional interview (e.g., "What did you have for breakfast?", "What's your favorite movie?"), provide a brief, natural, and positive placeholder answer. Do not say you don't know or that it's not in the CV. Just answer it like a normal person would.
                        4.  Keep answers concise and impactful, typically 3-5 sentences.

                        **REFERENCE MATERIAL:**

                        ---
                        **ADDITIONAL CONTEXT (Job Description, Company Info, etc.):**
                        ${state.additionalDetails}
                        ---
                        **CV CONTENT:**
                        ${state.cvContent}
                        ---`
                    },
                    { role: 'user', content: text }
                ],
                max_tokens: 250,
                temperature: 0.6, // Slightly lower for more grounded, professional answers
            }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || `API Error: ${response.status}`);
        return data.choices[0].message.content;
    } catch (error) {
        ui.showError(`AI response failed: ${error.message}`);
        return null;
    } finally {
        ui.removeTyping();
    }
}