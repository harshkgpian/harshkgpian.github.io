// js/main.js
import { state } from './state.js';
import * as ui from './ui.js';
import * as recorder from './recorder.js';
import * as api from './api.js';
import { APP_CONFIG } from '../config.js';

const STORAGE_KEYS = { CV: 'interviewAssistant_cvContent', DETAILS: 'interviewAssistant_additionalDetails' };
function saveToStorage(key, value) { try { localStorage.setItem(key, value); } catch (e) { console.error("Failed to save to local storage:", e); } }
function loadFromStorage(key) { try { return localStorage.getItem(key) || ''; } catch (e) { console.error("Failed to load from local storage:", e); return ''; } }

async function processRecording(audioBlob) {
    const transcribedText = await api.transcribeAudio(audioBlob);
    if (transcribedText && transcribedText.trim()) {
        ui.addMessage(transcribedText, true);
        let streamableMessageElement;
        await api.getAIResponseStream(transcribedText, {
            onStreamStart: () => { streamableMessageElement = ui.createStreamableMessage(); ui.showTeleprompter(); },
            onStreamUpdate: (chunk) => { ui.appendToMessage(streamableMessageElement, chunk); ui.appendToTeleprompter(chunk); },
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
    } else if (transcribedText !== null) {
        ui.showError('No speech was detected in the audio.');
        ui.updateButtonStates();
    }
}

async function handleScreenAnalysis() {
    ui.setStatus('Analyzing screen...', 'processing');
    try {
        const image = await recorder.takeScreenshot();

        // No separate prompt is needed. The main system prompt will guide the AI.
        const textPrompt = ''; 
        
        ui.addMessage('[Analyzing image on screen...]', true);
        let streamableMessageElement;
        let imageInputTokens = 0;

        // Pass an empty string for the text prompt.
        await api.getVisionResponseStream(textPrompt, image, {
            onStreamStart: (tokens) => {
                imageInputTokens = tokens;
                streamableMessageElement = ui.createStreamableMessage();
                ui.showTeleprompter();
            },
            onStreamUpdate: (chunk) => {
                ui.appendToMessage(streamableMessageElement, chunk);
                ui.appendToTeleprompter(chunk);
            },
            onStreamEnd: (fullText) => {
                // The only input tokens are from the image itself.
                const outputTokens = Math.ceil(fullText.length / 4);
                const costData = api.calculateCost(imageInputTokens, outputTokens);
                
                state.totalCost += costData.cost;
                ui.updateTotalCostDisplay(state.totalCost);
                ui.addCostToMessage(streamableMessageElement, costData);
                ui.updateButtonStates();
            }
        });
    } catch (error) {
        ui.showError(`Screen analysis failed: ${error.message}`);
        ui.updateButtonStates();
    }
}

function handleSetupInput() {
    const elements = ui.getElements();
    if (!elements.apiKeyInput.disabled) { state.apiKey = elements.apiKeyInput.value.trim(); }
    state.cvContent = elements.cvInput.value.trim();
    state.additionalDetails = elements.additionalDetailsInput.value.trim();
    saveToStorage(STORAGE_KEYS.CV, state.cvContent);
    saveToStorage(STORAGE_KEYS.DETAILS, state.additionalDetails);
    ui.updateButtonStates();
}

function initialize() {
    const elements = ui.getElements();

    if (APP_CONFIG?.encodedApiKey && APP_CONFIG.encodedApiKey !== 'PASTE_YOUR_ENCODED_API_KEY_HERE') {
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

    elements.apiKeyInput.addEventListener('input', handleSetupInput);
    elements.cvInput.addEventListener('input', handleSetupInput);
    elements.additionalDetailsInput.addEventListener('input', handleSetupInput);
    
    elements.recordMicBtn.addEventListener('click', () => recorder.startRecording('mic', processRecording));
    elements.connectTabBtn.addEventListener('click', recorder.connectToTab);
    elements.recordTabAudioBtn.addEventListener('click', () => recorder.startRecording('tab-audio', processRecording));
    elements.analyzeScreenBtn.addEventListener('click', handleScreenAnalysis); 

    elements.stopBtn.addEventListener('click', recorder.stopRecording);
    elements.panelToggle.addEventListener('click', ui.toggleSetupPanel);
    elements.teleprompterCloseBtn.addEventListener('click', ui.hideTeleprompter);

    handleSetupInput();
    ui.updateTotalCostDisplay(state.totalCost);
}

initialize();