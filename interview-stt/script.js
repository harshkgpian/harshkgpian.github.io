// script.js

// --- DOM ELEMENTS ---
const recordMicBtn = document.getElementById('recordMicBtn');
const recordTabBtn = document.getElementById('recordTabBtn');
const status = document.getElementById('status');
const conversation = document.getElementById('conversation');
const apiKeyInput = document.getElementById('apiKey');
const cvInput = document.getElementById('cvContent');

// --- STATE MANAGEMENT ---
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let apiKey = '';
let cvContent = '';

// --- INITIALIZATION ---
function initialize() {
    // Try to get API key from config.js first
    if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.encodedApiKey && APP_CONFIG.encodedApiKey !== 'PASTE_YOUR_ENCODED_API_KEY_HERE') {
        try {
            apiKey = atob(APP_CONFIG.encodedApiKey);
            apiKeyInput.placeholder = 'API key loaded from config.js';
            apiKeyInput.disabled = true;
        } catch (e) {
            console.error("Failed to decode API key from config.js. It might not be a valid Base64 string.", e);
            showError("Error: Invalid API key in config.js. Please check the encoding.");
        }
    }

    // Event Listeners
    apiKeyInput.addEventListener('input', checkSetup);
    cvInput.addEventListener('input', checkSetup);
    recordMicBtn.addEventListener('click', () => toggleRecording('mic'));
    recordTabBtn.addEventListener('click', () => toggleRecording('tab'));

    checkSetup();
}

// --- CORE LOGIC ---

// Checks if the app is ready to record
function checkSetup() {
    if (!apiKey) { // Allow manual override if config is not used
        apiKey = apiKeyInput.value.trim();
    }
    cvContent = cvInput.value.trim();
    
    const isReady = apiKey && cvContent;
    
    recordMicBtn.disabled = !isReady;
    recordTabBtn.disabled = !isReady;
    
    if (isRecording) return;

    if (isReady) {
        status.textContent = 'Ready to record';
    } else if (!cvContent) {
        status.textContent = 'Enter CV to begin';
    } else {
        status.textContent = 'Enter API key to begin';
    }
}

// Handles starting/stopping the recording
function toggleRecording(sourceType) {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording(sourceType);
    }
}

// Gets the audio stream and starts the MediaRecorder
async function startRecording(sourceType) {
    let stream;
    try {
        if (sourceType === 'mic') {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } else if (sourceType === 'tab') {
            status.textContent = 'Select tab with interview audio...';
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });
            // We only need the audio track from the screen share
            if (displayStream.getAudioTracks().length === 0) {
                showError("No audio track found in the selected tab. Make sure to check 'Share tab audio'.");
                status.textContent = 'Ready to record';
                return;
            }
            stream = new MediaStream(displayStream.getAudioTracks());
        }

        isRecording = true;
        updateUIForRecording(true, sourceType);
        
        const options = { mimeType: 'audio/webm' };
        mediaRecorder = new MediaRecorder(stream, options);
        
        audioChunks = [];
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            stream.getTracks().forEach(track => track.stop()); // Stop all tracks
            if (audioBlob.size > 100) { // Check for minimal size
                await transcribeAudio(audioBlob);
            } else {
                showError('No audio recorded. Please try again.');
                status.textContent = 'Ready to record';
            }
        };
        
        mediaRecorder.start();
    } catch (error) {
        showError(`Error accessing audio source: ${error.message}`);
        console.error("Stream acquisition failed:", error);
        updateUIForRecording(false);
    }
}

// Stops the MediaRecorder
function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        updateUIForRecording(false);
        status.textContent = 'Processing...';
    }
}

// Transcribes the recorded audio using OpenAI Whisper API
async function transcribeAudio(audioBlob) {
    status.textContent = 'Transcribing...';
    const formData = new FormData();
    formData.append('file', audioBlob, 'interview_audio.webm');
    formData.append('model', 'whisper-1'); // Correct model for this endpoint

    try {
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}` },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || `API Error: ${response.status}`);
        }
        
        const transcribedText = data.text;
        
        if (transcribedText && transcribedText.trim()) {
            addMessage(transcribedText, true);
            await processWithAI(transcribedText);
        } else {
            showError('Could not detect any speech in the audio.');
        }
    } catch (error) {
        showError(`Transcription Error: ${error.message}`);
    } finally {
        status.textContent = 'Ready to record';
    }
}

// Sends the transcribed text to the Chat Completions API for a response
async function processWithAI(transcribedText) {
    showTyping();
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // A powerful and cost-effective model
                messages: [
                    {
                        role: 'system',
                        content: `You are an intelligent virtual interview assistant. Your task is to analyze the user's CV and answer interview questions based *only* on the information provided. The user will speak a question, and you must interpret it and provide a concise, professional answer as if you were the user in the interview.

RULES:
1.  **Infer the Question:** The user's input might be a paraphrased or informal version of a common interview question. Infer the standard question they are likely asking.
2.  **Answer from CV:** Formulate your answer strictly using the content from the provided CV. Do not invent experience or skills.
3.  **Speak as the User:** Your response should be in the first person ("I," "my," "we"), as if the user is speaking the answer themselves.
4.  **Be Concise and Professional:** Keep answers to the point, ideally around 3-4 sentences (~100 words).
5.  **No Metacommentary:** Do not say things like "Based on your CV..." or "The question you asked seems to be...". Just provide the direct answer.

CV CONTENT:
---
${cvContent}
---`
                    },
                    { role: 'user', content: transcribedText }
                ],
                max_tokens: 250,
                temperature: 0.5
            })
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || `API Error: ${response.status}`);
        }
        
        const aiResponse = data.choices[0].message.content;
        addMessage(aiResponse, false);

    } catch (error) {
        showError(`AI Processing Error: ${error.message}`);
    } finally {
        removeTyping();
    }
}


// --- UI HELPER FUNCTIONS ---

// Updates the recording buttons and status text
function updateUIForRecording(isRecordingActive, sourceType = null) {
    if (isRecordingActive) {
        const activeBtn = sourceType === 'mic' ? recordMicBtn : recordTabBtn;
        const inactiveBtn = sourceType === 'mic' ? recordTabBtn : recordMicBtn;

        activeBtn.textContent = '🛑 Stop Recording';
        activeBtn.classList.add('recording');
        inactiveBtn.disabled = true;
        status.textContent = 'Recording... Click stop when done.';
    } else {
        recordMicBtn.textContent = '🎤 Record Mic';
        recordTabBtn.textContent = '💻 Record Tab Audio';
        recordMicBtn.classList.remove('recording');
        recordTabBtn.classList.remove('recording');
        checkSetup(); // Re-enable buttons if setup is complete
    }
}

// Adds a message to the conversation view
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = text;
    // With flex-direction: column-reverse, appendChild places it at the visual top
    conversation.appendChild(messageDiv);
}

// Shows the "Assistant is thinking..." indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.textContent = 'Assistant is thinking';
    conversation.appendChild(typingDiv);
}

// Removes the typing indicator
function removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// Displays an error message in the conversation view
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    conversation.appendChild(errorDiv);
}

// --- START THE APP ---
initialize();