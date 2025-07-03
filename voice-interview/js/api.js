// js/api.js
import { state } from './state.js';
import * as ui from './ui.js';
// Import the centralized configuration
import { APP_CONFIG } from '../config.js';

const CHAT_MODEL_CONFIG = APP_CONFIG.models.chat;

/**
 * Calculates image input tokens for gpt-4.1-nano based on patch rules.
 * @param {number} width - The width of the image.
 * @param {number} height - The height of the image.
 * @returns {number} The billable token count for the image.
 */
function calculateImageTokens(width, height) {
    const { patch_size, token_budget, token_multiplier } = CHAT_MODEL_CONFIG.vision;

    let w = width;
    let h = height;

    let patches_w = Math.ceil(w / patch_size);
    let patches_h = Math.ceil(h / patch_size);

    // If the number of patches exceeds the budget, scale down the image.
    if (patches_w * patches_h > token_budget) {
        const shrink_factor = Math.sqrt((token_budget * (patch_size ** 2)) / (w * h));
        w = Math.floor(w * shrink_factor);
        h = Math.floor(h * shrink_factor);

        // Recalculate patches for the new dimensions.
        // The reference implies a second scaling step to fit whole patches.
        const temp_patches_w = Math.ceil(w / patch_size);
        const final_scale = (temp_patches_w - 1) / temp_patches_w;
        w = Math.floor(w * final_scale);
        h = Math.floor(h * final_scale);

        patches_w = Math.ceil(w / patch_size);
        patches_h = Math.ceil(h / patch_size);
    }
    
    const total_patches = patches_w * patches_h;
    // As per reference, multiply the final patch count by the model-specific multiplier.
    return total_patches * token_multiplier;
}

export function calculateCost(inputTokens, outputTokens = 0) {
    const pricing = CHAT_MODEL_CONFIG.pricing;
    if (!pricing) return { inputTokens, outputTokens, cost: 0 };

    const inputCost = inputTokens * pricing.input;
    const outputCost = outputTokens * pricing.output;
    
    return {
        inputTokens,
        outputTokens,
        cost: inputCost + outputCost,
    };
}

export async function transcribeAudio(audioBlob) {
    ui.setStatus('Transcribing...', 'processing');
    const formData = new FormData();
    formData.append('file', audioBlob, 'interview_audio.webm');
    // Use model name from config
    formData.append('model', APP_CONFIG.models.transcription.name);

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

async function handleStream(response, onStreamStart, onStreamUpdate, onStreamEnd) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    onStreamStart();

    let outputText = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.substring(6);
                if (data === '[DONE]') {
                    onStreamEnd(outputText);
                    return;
                }
                try {
                    const json = JSON.parse(data);
                    const content = json.choices[0]?.delta?.content || '';
                    if (content) {
                        outputText += content;
                        onStreamUpdate(content);
                    }
                } catch (e) { console.error('Error parsing stream data:', e); }
            }
        }
    }
     onStreamEnd(outputText);
}

// Function now reads model name and prompt from config
export async function getAIResponseStream(transcribedText, { onStreamStart, onStreamUpdate, onStreamEnd }) {
    ui.showTyping();
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${state.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: CHAT_MODEL_CONFIG.name,
                messages: [
                    {
                        role: 'system',
                        content: APP_CONFIG.systemPrompt(state.additionalDetails, state.cvContent)
                    },
                    { role: 'user', content: transcribedText }
                ],
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
        }
        await handleStream(response, onStreamStart, onStreamUpdate, onStreamEnd);
    } catch (error) {
        ui.showError(`AI response failed: ${error.message}`);
    }
}

// Function now reads model name and prompt from config
export async function getVisionResponseStream(textPrompt, image, { onStreamStart, onStreamUpdate, onStreamEnd }) {
    ui.showTyping();
    try {
        const imageInputTokens = calculateImageTokens(image.width, image.height);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${state.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: CHAT_MODEL_CONFIG.name,
                messages: [
                    {
                        role: 'system',
                        content: APP_CONFIG.systemPrompt(state.additionalDetails, state.cvContent)
                    },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: textPrompt },
                            { type: 'image_url', image_url: { url: image.base64, detail: 'high' } }
                        ],
                    }
                ],
                max_tokens: 1024,
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
        }
        
        const startCallback = () => onStreamStart(imageInputTokens);
        await handleStream(response, startCallback, onStreamUpdate, onStreamEnd);

    } catch (error) {
        ui.showError(`Vision request failed: ${error.message}`);
    }
}