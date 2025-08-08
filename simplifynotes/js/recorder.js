// js/recorder.js
import { getCanvasContext } from './canvas.js';
import * as waveform from './waveform.js';

let mediaRecorder;
let recordedChunks = [];
let audioStream;
let videoStream;

/**
 * The Pinger Object.
 * This is the core solution based on your provided code. It ensures a constant
 * stream of video frames even when the canvas is static.
 */
const pinger = {
    snapshot: null,
    intervalId: null,

    /**
     * Takes a snapshot of the current canvas and starts a loop
     * that repeatedly draws that snapshot. This forces frame generation.
     */
    async start() {
        if (this.intervalId) return; // Already running

        const { canvas, ctx } = getCanvasContext();
        if (!canvas || !ctx) return;
        
        // 1. Take a snapshot
        const img = new Image();
        img.src = canvas.toDataURL();
        await new Promise(resolve => { img.onload = resolve; });
        this.snapshot = img;

        // 2. Start the redraw loop (the "pinger")
        const frameRate = 60;
        this.intervalId = setInterval(() => {
            if (this.snapshot) {
                ctx.drawImage(this.snapshot, 0, 0, canvas.width / (window.devicePixelRatio||1), canvas.height / (window.devicePixelRatio||1));
            }
        }, 1000 / frameRate);
    },

    /**
     * Stops the redraw loop.
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.snapshot = null;
        }
    }
};

// --- Exported Pinger Controls for UI ---
// These will be called when the user starts/stops drawing with the mouse.
export const startPinger = () => pinger.start();
export const stopPinger = () => pinger.stop();
// -----------------------------------------


export const isRecording = () => {
  return mediaRecorder && mediaRecorder.state === 'recording';
};

const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
};

const downloadVideo = () => {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `canvas-recording-${new Date().toISOString()}.webm`;
  
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);

  recordedChunks = [];
};

export const startRecording = async () => {
  if (isRecording()) return;

  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const { canvas } = getCanvasContext();
    videoStream = canvas.captureStream(60);

    const combinedStream = new MediaStream([
      ...videoStream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    waveform.init(audioStream);
    waveform.start();

    const options = { 
      mimeType: 'video/webm; codecs=vp9,opus',
      videoBitsPerSecond: 8000000,
      audioBitsPerSecond: 128000,
    };
    
    mediaRecorder = new MediaRecorder(combinedStream, options);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = downloadVideo;
    
    mediaRecorder.start();
    
    // Start the pinger immediately to ensure frames are generated even if the user does nothing.
    pinger.start();

    console.log('High-quality recording started with robust frame pinger.');

  } catch (err) {
    console.error("Could not start recording:", err);
    if (audioStream) audioStream.getTracks().forEach(track => track.stop());
    throw new Error('Microphone access was denied. Cannot record audio.');
  }
};

export const stopRecording = () => {
  if (!isRecording()) return;
  
  console.log('Stopping recording with a 1-second padded outro...');

  // The pinger is already running, so it's already holding the last frame.
  // We just need to wait 1 second before stopping everything.
  setTimeout(() => {
    // Stop the pinger loop
    pinger.stop();

    // Now, stop the recorder itself. The onstop event will handle the download.
    if(mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
    
    waveform.stop();
    if (audioStream) audioStream.getTracks().forEach(track => track.stop());
    if (videoStream) videoStream.getTracks().forEach(track => track.stop());

    console.log('Recording stopped.');
  }, 1000); // 1-second padded outro
};