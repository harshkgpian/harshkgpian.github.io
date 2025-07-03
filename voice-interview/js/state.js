// js/state.js
export const state = {
    apiKey: '',
    cvContent: '',
    additionalDetails: '',
    isRecording: false,
    // --- ADDED BACK for persistent connection ---
    isTabConnected: false,
    persistentTabStream: null,
    // ------------------------------------------
    mediaRecorder: null,
    audioChunks: [],
    currentSource: null,
    totalCost: 0.0,
};