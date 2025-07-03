// js/main.js
import { state } from './state.js';
import * as ui from './ui.js';
import * as recorder from './recorder.js';
import * as api from './api.js';
import { APP_CONFIG } from '../config.js';

const STORAGE_KEYS = {
    CV: 'interviewAssistant_cvContent',
    DETAILS: 'interviewAssistant_additionalDetails'
};

function saveToStorage(key, value) {
    try { localStorage.setItem(key, value); } 
    catch (e) { console.error("Failed to save to local storage:", e); }
}

function loadFromStorage(key) {
    try { return localStorage.getItem(key) || ''; } 
    catch (e) { console.error("Failed to load from local storage:", e); return ''; }
}

async function processRecording(audioBlob) {
    const transcribedText = await api.transcribeAudio(audioBlob);
    
    if (transcribedText && transcribedText.trim()) {
        ui.addMessage(transcribedText, true);

        let streamableMessageElement;
        
        await api.getAIResponseStream(transcribedText, {
            onStreamStart: () => {
                streamableMessageElement = ui.createStreamableMessage();
                ui.showTeleprompter();
            },
            onStreamUpdate: (chunk) => {
                ui.appendToMessage(streamableMessageElement, chunk);
                ui.appendToTeleprompter(chunk);
            },
            onStreamEnd: (fullText) => {
                const inputTokens = Math.ceil(transcribedText.length / 4);
                const outputTokens = Math.ceil(fullText.length / 4);
                const costData = api.calculateCost(inputTokens, outputTokens);
                state.totalCost += costData.cost;
                ui.updateTotalCostDisplay(state.totalCost);
                ui.addCostToMessage(streamableMessageElement, costData);
                ui.updateButtonStates();
            }
        });
    } else if (transcribedText) {
        ui.showError('No speech was detected in the audio.');
        ui.updateButtonStates();
    }
}

// --- THIS FUNCTION IS NOW FIXED ---
async function handleAnalyzeScreenshot() {
    ui.setStatus('Capturing screen...', 'processing');
    const image = await recorder.captureScreenshot();
    
    if (!image) {
        ui.updateButtonStates();
        return;
    }

    // REMOVED the prompt(). The AI will now get a standard instruction.
    const question = `This is a screenshot from my current view in the interview. Please analyze it and provide a concise, relevant, and professional comment or answer based on its content, speaking as me, the candidate. Identify the key information and respond appropriately.`;

    // Updated the user-facing message to be more generic.
    ui.addMessage(`📷 Analyzing screen content...`, true);

    let streamableMessageElement;
    
    await api.getVisionResponseStream(question, image, {
        onStreamStart: (imageInputTokens) => {
            streamableMessageElement = ui.createStreamableMessage();
            ui.showTeleprompter();
            onStreamStart.imageInputTokens = imageInputTokens; 
        },
        onStreamUpdate: (chunk) => {
            ui.appendToMessage(streamableMessageElement, chunk);
            ui.appendToTeleprompter(chunk);
        },
        onStreamEnd: (fullText) => {
            const inputTokens = onStreamStart.imageInputTokens;
            const outputTokens = Math.ceil(fullText.length / 4);
            const costData = api.calculateCost(inputTokens, outputTokens);
            state.totalCost += costData.cost;
            ui.updateTotalCostDisplay(state.totalCost);
            ui.addCostToMessage(streamableMessageElement, costData);
            ui.updateButtonStates();
        }
    });
}

function handleSetupInput() {
    const elements = ui.getElements();
    if (!elements.apiKeyInput.disabled) {
        state.apiKey = elements.apiKeyInput.value.trim();
    }
    state.cvContent = elements.cvInput.value.trim();
    state.additionalDetails = elements.additionalDetailsInput.value.trim();
    
    saveToStorage(STORAGE_KEYS.CV, state.cvContent);
    saveToStorage(STORAGE_KEYS.DETAILS, state.additionalDetails);
    ui.updateButtonStates();
}

function initialize() {
    const elements = ui.getElements();

    if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.encodedApiKey && APP_CONFIG.encodedApiKey !== 'PASTE_YOUR_ENCODED_API_KEY_HERE') {
        try {
            state.apiKey = atob(APP_CONFIG.encodedApiKey);
            elements.apiKeyInput.value = '********';
            elements.apiKeyInput.disabled = true;
        } catch (e) { ui.showError("Invalid API key in config.js."); }
    }

    state.cvContent = loadFromStorage(STORAGE_KEYS.CV);
    state.additionalDetails = loadFromStorage(STORAGE_KEYS.DETAILS);
    elements.cvInput.value = state.cvContent;
    elements.additionalDetailsInput.value = state.additionalDetails;

    const { 
        apiKeyInput, cvInput, additionalDetailsInput, recordMicBtn, 
        recordTabBtn, stopBtn, panelToggle, teleprompterCloseBtn, analyzeScreenshotBtn
    } = elements;
    
    apiKeyInput.addEventListener('input', handleSetupInput);
    cvInput.addEventListener('input', handleSetupInput);
    additionalDetailsInput.addEventListener('input', handleSetupInput);
    recordMicBtn.addEventListener('click', () => recorder.startRecording('mic', processRecording));
    recordTabBtn.addEventListener('click', () => recorder.startRecording('tab', processRecording));
    stopBtn.addEventListener('click', recorder.stopRecording);
    panelToggle.addEventListener('click', ui.toggleSetupPanel);
    teleprompterCloseBtn.addEventListener('click', ui.hideTeleprompter);
    analyzeScreenshotBtn.addEventListener('click', handleAnalyzeScreenshot);

    handleSetupInput();
    ui.updateTotalCostDisplay(state.totalCost);
}

initialize();