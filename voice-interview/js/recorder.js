// js/recorder.js
import { state } from './state.js';
import * as ui from './ui.js';

export async function connectToTab() {
    if (state.isRecording || state.isTabConnected) return;
    ui.setStatus('Select tab to connect...', 'processing');

    try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        const audioTrack = displayStream.getAudioTracks()[0];
        const videoTrack = displayStream.getVideoTracks()[0];

        if (!audioTrack) {
            ui.showError("No audio found. Ensure you checked 'Share tab audio'.");
            displayStream.getTracks().forEach(track => track.stop());
            return;
        }
        
        // Store streams separately
        state.persistentTabStream = new MediaStream([audioTrack]);
        if (videoTrack) {
            state.persistentVideoStream = new MediaStream([videoTrack]);
        }
        
        state.isTabConnected = true;

        // A single handler for when the user stops sharing via the browser UI.
        // The 'ended' event will fire on all tracks from the source stream.
        audioTrack.onended = () => {
            state.isTabConnected = false;
            state.persistentTabStream = null;
            state.persistentVideoStream = null;
            ui.updateButtonStates();
        };

        ui.updateButtonStates();

    } catch(error) {
        ui.showError(`Could not connect to tab: ${error.message}`);
        ui.updateButtonStates();
    }
}

export function takeScreenshot() {
    return new Promise((resolve, reject) => {
        if (!state.persistentVideoStream) {
            return reject(new Error("Video stream not available. Is a tab connected?"));
        }

        const videoTrack = state.persistentVideoStream.getVideoTracks()[0];
        if (!videoTrack) {
            return reject(new Error("No video track found in the stream."));
        }

        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        video.srcObject = state.persistentVideoStream;
        video.muted = true;

        video.onloadedmetadata = () => video.play();

        video.onplay = () => {
            const { width, height } = videoTrack.getSettings();
            if (!width || !height) {
                reject(new Error("Video dimensions are not available."));
                return;
            }
            canvas.width = width;
            canvas.height = height;

            context.drawImage(video, 0, 0, width, height);
            const base64Image = canvas.toDataURL('image/jpeg');
            
            video.pause();
            video.srcObject = null;
            video.remove();
            canvas.remove();

            resolve({ base64: base64Image, width, height });
        };

        video.onerror = (e) => {
            reject(new Error("Error loading video for screenshot."));
            video.remove();
            canvas.remove();
        };
    });
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