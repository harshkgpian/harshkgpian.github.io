// js/recorder.js
import { state } from './state.js';
import * as ui from './ui.js';
import { processRecording } from './main.js';

async function getStream(sourceType) {
    if (sourceType === 'mic') {
        return await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    if (sourceType === 'tab') {
        if (!state.isTabConnected || !state.persistentTabStream) {
            ui.setStatus('Select tab to connect...');
            const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            if (displayStream.getAudioTracks().length === 0) {
                ui.showError("No audio found. Ensure you checked 'Share tab audio'.");
                return null;
            }
            state.persistentTabStream = new MediaStream(displayStream.getAudioTracks());
            state.isTabConnected = true;
            // When the user manually stops sharing via the browser UI
            state.persistentTabStream.getAudioTracks()[0].onended = () => {
                state.isTabConnected = false;
                state.persistentTabStream = null;
                ui.updateButtonStates();
            };
        }
        return state.persistentTabStream;
    }
    return null;
}

export async function startRecording(sourceType) {
    if (state.isRecording) return;
    
    try {
        const stream = await getStream(sourceType);
        if (!stream) {
            ui.updateButtonStates();
            return;
        }

        state.isRecording = true;
        state.currentSource = sourceType;
        state.audioChunks = [];
        ui.updateButtonStates();

        state.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        
        state.mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) state.audioChunks.push(event.data);
        };

        state.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
            if (audioBlob.size > 100) {
                processRecording(audioBlob);
            } else {
                ui.showError('No audio was recorded.');
            }
            // If it was a mic recording, we need to stop the track. For tab, we leave it open.
            if (sourceType === 'mic') {
                stream.getTracks().forEach(track => track.stop());
            }
        };

        state.mediaRecorder.start();

    } catch (error) {
        ui.showError(`Could not start recording: ${error.message}`);
        state.isRecording = false;
        ui.updateButtonStates();
    }
}

export function stopRecording() {
    if (!state.isRecording || !state.mediaRecorder) return;
    
    state.mediaRecorder.stop();
    state.isRecording = false;
    ui.setStatus('Processing...');
    ui.updateButtonStates();
}