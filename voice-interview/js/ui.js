// js/ui.js
import { state } from './state.js';

// Grab all DOM elements once
const elements = {
    recordMicBtn: document.getElementById('recordMicBtn'),
    recordTabBtn: document.getElementById('recordTabBtn'),
    stopBtn: document.getElementById('stopBtn'),
    status: document.getElementById('status'),
    conversation: document.getElementById('conversation'),
    apiKeyInput: document.getElementById('apiKey'),
    cvInput: document.getElementById('cvContent'),
    additionalDetailsInput: document.getElementById('additionalDetails'), // <-- NEW
    teleprompter: document.getElementById('teleprompter'), // <-- NEW
    teleprompterContent: document.getElementById('teleprompterContent'), // <-- NEW
    teleprompterCloseBtn: document.getElementById('teleprompterCloseBtn'), // <-- NEW
    panelToggle: document.getElementById('panelToggle'), // <-- NEW
    setupSection: document.getElementById('setupSection'), // <-- NEW
};

export function getElements() {
    return elements;
}

export function updateButtonStates() {
    const { isRecording, isTabConnected, apiKey, cvContent } = state;
    const isReady = apiKey && cvContent;

    elements.recordMicBtn.style.display = isRecording ? 'none' : 'inline-block';
    elements.recordTabBtn.style.display = isRecording ? 'none' : 'inline-block';
    elements.stopBtn.style.display = isRecording ? 'inline-block' : 'none';

    if (isRecording) {
        elements.status.textContent = `Recording from ${state.currentSource}...`;
    } else {
        elements.recordMicBtn.disabled = !isReady;
        elements.recordTabBtn.disabled = !isReady;

        if (!isReady) {
            elements.status.textContent = 'Fill in Setup to begin';
        } else if (isTabConnected) {
            elements.recordTabBtn.textContent = '✅ Tab Connected';
            elements.status.textContent = 'Ready. Record from Mic or Tab.';
        } else {
            elements.recordTabBtn.textContent = '💻 Record Tab';
            elements.status.textContent = 'Ready to record';
        }
    }
}

// --- NEW TELEPROMPTER & PANEL FUNCTIONS ---
export function showTeleprompter(text) {
    elements.teleprompterContent.textContent = text;
    elements.teleprompter.style.display = 'flex';
}

export function hideTeleprompter() {
    elements.teleprompter.style.display = 'none';
}

export function toggleSetupPanel() {
    elements.setupSection.classList.toggle('closed');
    document.querySelector('.toggle-icon').classList.toggle('closed');
}

// --- MESSAGE & STATUS FUNCTIONS ---
export function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = text;
    elements.conversation.appendChild(messageDiv);
}

export function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = `Error: ${message}`;
    elements.conversation.appendChild(errorDiv);
}

let typingIndicator;
export function showTyping() {
    // We show typing in the main log, not the teleprompter
    if (typingIndicator) return;
    typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai-message typing';
    typingIndicator.id = 'typing-indicator';
    typingIndicator.textContent = 'Assistant is thinking';
    elements.conversation.appendChild(typingIndicator);
}

export function removeTyping() {
    if (typingIndicator) {
        typingIndicator.remove();
        typingIndicator = null;
    }
}

export function setStatus(text) {
    elements.status.textContent = text;
}