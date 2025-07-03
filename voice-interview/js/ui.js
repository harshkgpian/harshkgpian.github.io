// js/ui.js
import { state } from './state.js';

const elements = {
    mainContent: document.getElementById('mainContent'),
    controlPanel: document.getElementById('controlPanel'),
    conversation: document.getElementById('conversation'),
    
    recordMicBtn: document.getElementById('recordMicBtn'),
    recordTabBtn: document.getElementById('recordTabBtn'),
    analyzeScreenshotBtn: document.getElementById('analyzeScreenshotBtn'),
    stopBtn: document.getElementById('stopBtn'),
    
    teleprompter: document.getElementById('teleprompter'),
    teleprompterContent: document.getElementById('teleprompterContent'),
    teleprompterCloseBtn: document.getElementById('teleprompterCloseBtn'),
    
    panelToggle: document.getElementById('panelToggle'),
    setupSection: document.getElementById('setupSection'),
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

    elements.recordMicBtn.style.display = isRecording ? 'none' : 'inline-block';
    elements.recordTabBtn.style.display = isRecording || isTabConnected ? 'none' : 'inline-block';
    elements.analyzeScreenshotBtn.style.display = isRecording || !isTabConnected ? 'none' : 'inline-block';
    elements.stopBtn.style.display = isRecording ? 'inline-block' : 'none';

    if (!isRecording) {
        elements.recordMicBtn.disabled = !isReady;
        elements.recordTabBtn.disabled = !isReady;
        elements.analyzeScreenshotBtn.disabled = !isReady;

        if (!isReady) {
            setStatus('Enter details to begin', 'normal');
        } else if (isTabConnected) {
            setStatus('Ready. Record audio or analyze screen.', 'normal');
        } else {
            setStatus('Ready to connect tab.', 'normal');
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