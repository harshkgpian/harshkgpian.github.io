// js/recorder.js
import { state } from './state.js';
import * as ui from './ui.js';
// import { processRecording } from './main.js'; // <-- REMOVED to break circular dependency

async function getStream(sourceType) {
    if (sourceType === 'mic') {
        return await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    if (sourceType === 'tab') {
        if (!state.isTabConnected || !state.persistentTabStream) {
            ui.setStatus('Select tab to connect...', 'processing');
            const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            
            const audioTracks = displayStream.getAudioTracks();
            const videoTracks = displayStream.getVideoTracks();

            if (audioTracks.length === 0) {
                ui.showError("No audio found. Ensure you checked 'Share tab audio'.");
                videoTracks.forEach(track => track.stop());
                return null;
            }
            if (videoTracks.length === 0) {
                ui.showError("No video found. A video track is required for screenshots.");
                 audioTracks.forEach(track => track.stop());
                return null;
            }
            
            state.persistentTabStream = new MediaStream(audioTracks);
            state.persistentVideoTrack = videoTracks[0];
            state.isTabConnected = true;

            state.persistentVideoTrack.onended = () => {
                state.isTabConnected = false;
                state.persistentTabStream = null;
                state.persistentVideoTrack = null;
                ui.updateButtonStates();
            };
        }
        return state.persistentTabStream;
    }
    return null;
}

// MODIFIED: This function now accepts a callback for when recording stops.
export async function startRecording(sourceType, onStopCallback) {
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

        // MODIFIED: Call the provided callback instead of the imported function.
        state.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
            if (audioBlob.size > 100 && onStopCallback) {
                onStopCallback(audioBlob);
            } else if (!onStopCallback) {
                 ui.showError('Recording callback not provided.');
            } else {
                ui.showError('No audio was recorded.');
            }
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
    ui.setStatus('Processing...', 'processing');
    ui.updateButtonStates();
}

export async function captureScreenshot() {
    if (!state.isTabConnected || !state.persistentVideoTrack) {
        ui.showError("Tab with video is not connected.");
        return null;
    }

    try {
        const imageCapture = new ImageCapture(state.persistentVideoTrack);
        const imageBitmap = await imageCapture.grabFrame();
        
        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageBitmap, 0, 0);

        return {
            base64: canvas.toDataURL('image/jpeg', 0.9),
            width: imageBitmap.width,
            height: imageBitmap.height,
        };

    } catch (error) {
        console.error("Screenshot failed:", error);
        ui.showError(`Could not capture screenshot: ${error.message}`);
        return null;
    }
}