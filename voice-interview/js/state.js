// js/state.js
export const state = {
    apiKey: '',
    cvContent: '',
    additionalDetails: '',
    isRecording: false,
    isTabConnected: false,
    persistentTabStream: null,
    // Add a dedicated video track property for screenshots
    persistentVideoTrack: null, 
    mediaRecorder: null,
    audioChunks: [],
    currentSource: null,
    totalCost: 0.0, // <-- NEW: Track session cost in USD
};