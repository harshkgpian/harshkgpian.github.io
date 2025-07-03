// js/recorder.js
import { state } from './state.js';
import * as ui from './ui.js';

// --- NEW DEDICATED CONNECT FUNCTION ---
export async function connectToTab() {
    if (state.isRecording || state.isTabConnected) return;
    ui.setStatus('Select tab to connect...', 'processing');

    try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        if (displayStream.getAudioTracks().length === 0) {
            ui.showError("No audio found. Ensure you checked 'Share tab audio'.");
            displayStream.getTracks().forEach(track => track.stop());
            return;
        }

        const audioTrack = displayStream.getAudioTracks()[0];
        state.persistentTabStream = new MediaStream([audioTrack]);
        state.isTabConnected = true;

        // When the user manually stops sharing via the browser UI
        audioTrack.onended = () => {
            state.isTabConnected = false;
            state.persistentTabStream = null;
            ui.updateButtonStates();
        };
        
        // Stop the video track immediately as we don't need it for audio recording
        displayStream.getVideoTracks().forEach(track => track.stop());

        ui.updateButtonStates();

    } catch(error) {
        ui.showError(`Could not connect to tab: ${error.message}`);
        ui.updateButtonStates();
    }
}


export async function startRecording(sourceType, onStopCallback) {
    if (state.isRecording) return;
    
    let stream;
    if (sourceType === 'mic') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } else if (sourceType === 'tab-audio') {
        if (!state.isTabConnected || !state.persistentTabStream) {
            ui.showError("Tab audio not connected.");
            return;
        }
        stream = state.persistentTabStream;
    } else {
        ui.showError("Unknown recording source.");
        return;
    }

    if (!stream) {
        ui.showError("Failed to get audio stream.");
        return;
    }

    state.isRecording = true;
    state.currentSource = sourceType === 'mic' ? 'Mic' : 'Tab Audio';
    state.audioChunks = [];
    ui.updateButtonStates();

    state.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    
    state.mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) state.audioChunks.push(event.data);
    };

    state.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
        if (audioBlob.size > 100 && onStopCallback) {
            onStopCallback(audioBlob);
        } else if (audioBlob.size <= 100) {
            ui.showError('No audio was recorded.');
            ui.updateButtonStates();
        }
        // IMPORTANT: Only stop tracks if it's a mic recording.
        if (sourceType === 'mic') {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    state.mediaRecorder.start();
}

export function stopRecording() {
    if (!state.isRecording || !state.mediaRecorder) return;
    state.mediaRecorder.stop();
    state.isRecording = false;
    ui.setStatus('Processing...', 'processing');
}