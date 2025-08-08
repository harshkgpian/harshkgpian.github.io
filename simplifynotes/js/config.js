// js/config.js

export const elements = {
  // Canvas
  canvas: document.getElementById("drawingCanvas"),

  // Toolbar
  pencilBtn: document.getElementById('pencil'),
  eraserBtn: document.getElementById('eraser'),
  sizeSelect: document.getElementById('size'),
  colorSelect: document.getElementById('color'),
  undoBtn: document.getElementById('undo'),
  redoBtn: document.getElementById('redo'),
  clearBtn: document.getElementById('clear'),
  
  // Background Controls
  addBackgroundBtn: document.getElementById('addBackgroundBtn'),
  backgroundInput: document.getElementById('backgroundInput'),
  removeBackgroundBtn: document.getElementById('removeBackgroundBtn'),

  // Recording
  recordBtn: document.getElementById('recordBtn'),
  waveformCanvas: document.getElementById('waveformCanvas'),
  
  // File Operations
  savePdfBtn: document.getElementById('savePdf'),

  // Page Controls
  prevPageBtn: document.getElementById('prevPage'),
  nextPageBtn: document.getElementById('nextPage'),
  pageInfo: document.getElementById('pageInfo'),
  
  // Canvas Size Modal
  customCanvasBtn: document.getElementById('customCanvasBtn'),
  canvasSizeModal: document.getElementById('canvasSizeModal'),
  cancelCanvasSizeBtn: document.getElementById('cancelCanvasSize'),
  confirmCanvasSizeBtn: document.getElementById('confirmCanvasSize'),
  canvasWidthInput: document.getElementById('canvasWidth'),
  canvasHeightInput: document.getElementById('canvasHeight'),
  setBrowserSizeBtn: document.getElementById('setBrowserSize'),

  // Filename Modal
  filenameModal: document.getElementById('filenameModal'),
  filenameInput: document.getElementById('filenameInput'),
  cancelSaveBtn: document.getElementById('cancelSave'),
  confirmSaveBtn: document.getElementById('confirmSave'),
};