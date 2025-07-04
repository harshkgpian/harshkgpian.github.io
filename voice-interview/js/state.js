// js/state.js
export const state = {
    apiKey: '',
    cvContent: '',
    additionalDetails: '',
    isRecording: false,
    isTabConnected: false,
    persistentTabStream: null,
    // --- ADDED for screenshot feature ---
    persistentVideoStream: null, 
    // ------------------------------------
    mediaRecorder: null,
    audioChunks: [],
    currentSource: null,
    totalCost: 0.0,
};