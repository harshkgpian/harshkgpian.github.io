// js/main.js
import { state } from './state.js';
import * as ui from './ui.js';
import * as recorder from './recorder.js';
import * as api from './api.js';

// --- NEW: LOCAL STORAGE LOGIC ---

// Define keys to avoid typos
const STORAGE_KEYS = {
    CV: 'interviewAssistant_cvContent',
    DETAILS: 'interviewAssistant_additionalDetails'
};

// Helper function to save data to localStorage safely
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.error("Failed to save to local storage:", e);
        ui.showError("Could not save data. Private browsing mode may be active.");
    }
}

// Helper function to load data from localStorage
function loadFromStorage(key) {
    try {
        return localStorage.getItem(key) || ''; // Return empty string if nothing is stored
    } catch (e) {
        console.error("Failed to load from local storage:", e);
        return '';
    }
}

// --- END: LOCAL STORAGE LOGIC ---


export async function processRecording(audioBlob) {
    const transcribedText = await api.transcribeAudio(audioBlob);
    
    if (transcribedText && transcribedText.trim()) {
        ui.addMessage(transcribedText, true);
        const aiResponse = await api.getAIResponse(transcribedText);
        if (aiResponse) {
            ui.addMessage(aiResponse, false);
            ui.showTeleprompter(aiResponse);
        }
    } else if (transcribedText !== null) {
        ui.showError('No speech was detected in the audio.');
    }
    
    ui.setStatus('Ready. Record from Mic or connected Tab.');
}

function handleSetupInput() {
    const elements = ui.getElements();
    // Update state from the UI
    if (!elements.apiKeyInput.disabled) {
        state.apiKey = elements.apiKeyInput.value.trim();
    }
    state.cvContent = elements.cvInput.value.trim();
    state.additionalDetails = elements.additionalDetailsInput.value.trim();
    
    // --- NEW: Save the updated info to localStorage on every input
    saveToStorage(STORAGE_KEYS.CV, state.cvContent);
    saveToStorage(STORAGE_KEYS.DETAILS, state.additionalDetails);

    ui.updateButtonStates();
}

function initialize() {
    const elements = ui.getElements();

    // 1. Load API Key from config
    if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.encodedApiKey && APP_CONFIG.encodedApiKey !== 'PASTE_YOUR_ENCODED_API_KEY_HERE') {
        try {
            state.apiKey = atob(APP_CONFIG.encodedApiKey);
            elements.apiKeyInput.value = '********';
            elements.apiKeyInput.disabled = true;
        } catch (e) {
            ui.showError("Invalid API key in config.js.");
        }
    }

    // --- NEW: Load saved data from localStorage on startup ---
    state.cvContent = loadFromStorage(STORAGE_KEYS.CV);
    state.additionalDetails = loadFromStorage(STORAGE_KEYS.DETAILS);
    
    // --- NEW: Populate the text areas with the loaded data ---
    elements.cvInput.value = state.cvContent;
    elements.additionalDetailsInput.value = state.additionalDetails;


    // 2. Bind Event Listeners
    const { 
        apiKeyInput, cvInput, additionalDetailsInput, recordMicBtn, 
        recordTabBtn, stopBtn, panelToggle, teleprompterCloseBtn 
    } = elements;
    
    apiKeyInput.addEventListener('input', handleSetupInput);
    cvInput.addEventListener('input', handleSetupInput);
    additionalDetailsInput.addEventListener('input', handleSetupInput);

    recordMicBtn.addEventListener('click', () => recorder.startRecording('mic'));
    recordTabBtn.addEventListener('click', () => recorder.startRecording('tab'));
    stopBtn.addEventListener('click', recorder.stopRecording);
    
    panelToggle.addEventListener('click', ui.toggleSetupPanel);
    teleprompterCloseBtn.addEventListener('click', ui.hideTeleprompter);

    // 3. Initial State
    ui.toggleSetupPanel(); // Start with the panel closed
    handleSetupInput(); // Run once to sync state and update button readiness based on loaded data
}

// Start the application
initialize();