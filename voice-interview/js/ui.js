// js/ui.js
import { state } from './state.js';

const elements = {
    mainContent: document.getElementById('mainContent'),
    controlPanel: document.getElementById('controlPanel'),
    conversation: document.getElementById('conversation'),
    
    // Updated button references
    recordMicBtn: document.getElementById('recordMicBtn'),
    connectTabBtn: document.getElementById('connectTabBtn'),
    recordTabAudioBtn: document.getElementById('recordTabAudioBtn'),
    stopBtn: document.getElementById('stopBtn'),
    
    teleprompter: document.getElementById('teleprompter'),
    teleprompterContent: document.getElementById('teleprompterContent'),
    teleprompterCloseBtn: document.getElementById('teleprompterCloseBtn'),
    
    panelToggle: document.getElementById('panelToggle'),
    apiKeyInput: document.getElementById('apiKey'),
    cvInput: document.getElementById('cvContent'),
    additionalDetailsInput: document.getElementById('additionalDetails'),
    
    status: document.getElementById('status'),
    costTracker: document.getElementById('costTracker'),
};

export function getElements() { return elements; }

export function updateButtonStates() {
    const { isRecording, isTabConnected, apiKey, cvContent } = state;
    const isReady = apiKey && cvContent;

    if (isRecording) {
        // Hide all action buttons when recording
        elements.recordMicBtn.style.display = 'none';
        elements.connectTabBtn.style.display = 'none';
        elements.recordTabAudioBtn.style.display = 'none';
        elements.stopBtn.style.display = 'inline-block';
        setStatus(`Recording ${state.currentSource}...`, 'recording');
    } else {
        // Show action buttons, hide stop button
        elements.stopBtn.style.display = 'none';
        elements.recordMicBtn.style.display = 'inline-block';
        
        // Logic for tab buttons
        if (isTabConnected) {
            elements.connectTabBtn.style.display = 'none';
            elements.recordTabAudioBtn.style.display = 'inline-block';
        } else {
            elements.connectTabBtn.style.display = 'inline-block';
            elements.recordTabAudioBtn.style.display = 'none';
        }

        // Set disabled state
        elements.recordMicBtn.disabled = !isReady;
        elements.connectTabBtn.disabled = !isReady;
        elements.recordTabAudioBtn.disabled = !isReady;

        if (!isReady) {
            setStatus('Enter details to begin', 'normal');
        } else {
            setStatus('Ready to record or connect tab.', 'normal');
        }
    }
}



export function updateTotalCostDisplay(totalCost) {
    elements.costTracker.textContent = `Cost: $${totalCost.toFixed(5)}`;
}

export function addCostToMessage(messageElement, costData) {
    if (!messageElement || !costData) return;
    const costDiv = document.createElement('div');
    costDiv.className = 'message-timestamp';
    costDiv.textContent = `Tokens: ${costData.inputTokens} | Cost: ~$${costData.cost.toFixed(5)}`;
    messageElement.appendChild(costDiv);
}

export function toggleSetupPanel() {
    elements.controlPanel.classList.toggle('collapsed');
    elements.mainContent.classList.toggle('expanded');
    elements.teleprompter.classList.toggle('expanded');
}

export function showTeleprompter(initialText = '') {
    elements.teleprompterContent.textContent = initialText;
    elements.teleprompter.style.display = 'flex';
}

export function appendToTeleprompter(text) { elements.teleprompterContent.textContent += text; }

export function hideTeleprompter() { elements.teleprompter.style.display = 'none'; }

export function createStreamableMessage() {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message assistant';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    messageContainer.appendChild(contentDiv);

    elements.conversation.appendChild(messageContainer);
    return messageContainer;
}

export function appendToMessage(element, text) {
    if (element) {
        const contentDiv = element.querySelector('.message-content');
        if(contentDiv) contentDiv.textContent += text;
    }
}

export function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
    elements.conversation.appendChild(messageDiv);
}

export function showError(message) {
    setStatus(message, 'error');
}

export function setStatus(text, type = 'normal') {
    elements.status.textContent = text;
    elements.status.className = `status ${type}`;
}

export function showTyping() { setStatus('Assistant is thinking...', 'processing'); }