// js/main.js
import { initCanvas, setBackgroundImage } from './canvas.js';
import { initUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the core canvas and UI event listeners
  initCanvas();
  initUI();

  // === NEW: Check for and load a saved background on startup ===
  const savedBackground = localStorage.getItem('canvasBackground');
  if (savedBackground) {
    console.log('Found saved background, loading...');
    setBackgroundImage(savedBackground);
  }
});