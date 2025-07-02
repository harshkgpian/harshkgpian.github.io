// js/state.js
export const state = {
    apiKey: '',
    cvContent: '',
    additionalDetails: '', // <-- NEW
    isRecording: false,
    isTabConnected: false,
    persistentTabStream: null,
    mediaRecorder: null,
    audioChunks: [],
    currentSource: null,
};