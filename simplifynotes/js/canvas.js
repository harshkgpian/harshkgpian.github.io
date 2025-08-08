// js/canvas.js
import { elements } from './config.js';

const { canvas } = elements;
const ctx = canvas.getContext("2d");

let lastPoint = { x: 0, y: 0 };
const DAMPING_FACTOR = 0.5;

let state = {
  isDrawing: false,
  isEraser: false,
  isRightMouseDown: false,
  currentPage: 1,
  currentStroke: null,
  pages: [[]],
  undoStack: [[]],
  redoStack: [[]],
  backgroundImage: null,
};

const setupCanvasScaling = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
};

const getRawCoordinates = (e) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

const getSmoothedCoordinates = (e) => {
    const rawPoint = getRawCoordinates(e);
    const smoothedX = lastPoint.x + (rawPoint.x - lastPoint.x) * (1 - DAMPING_FACTOR);
    const smoothedY = lastPoint.y + (rawPoint.y - lastPoint.y) * (1 - DAMPING_FACTOR);
    lastPoint = { x: smoothedX, y: smoothedY };
    return { x: smoothedX, y: smoothedY };
};


/**
 * Draws a single stroke on the canvas. Now handles composite operations.
 * @param {object} stroke The stroke object to draw.
 */
const drawStroke = (stroke) => {
  if (!stroke || stroke.points.length < 2) return;

  // === MODIFIED: Set the correct composite operation ===
  // 'source-over' is the default: new drawings go on top.
  // 'destination-out' erases, revealing what's underneath.
  ctx.globalCompositeOperation = stroke.isEraser ? 'destination-out' : 'source-over';
  
  ctx.beginPath();
  // For the eraser, the color doesn't matter, but we set it for the pencil.
  ctx.strokeStyle = stroke.isEraser ? 'rgba(0,0,0,1)' : stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length - 1; i++) {
    const midPoint = {
      x: (stroke.points[i].x + stroke.points[i + 1].x) / 2,
      y: (stroke.points[i].y + stroke.points[i + 1].y) / 2,
    };
    ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, midPoint.x, midPoint.y);
  }
  ctx.lineTo(stroke.points[stroke.points.length - 1].x, stroke.points[stroke.points.length - 1].y);
  ctx.stroke();

  // IMPORTANT: Reset to default after drawing the stroke
  ctx.globalCompositeOperation = 'source-over';
};

const clearCanvas = () => {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
};

export const renderPage = () => {
  clearCanvas();

  if (state.backgroundImage) {
    const dpr = window.devicePixelRatio || 1;
    ctx.drawImage(state.backgroundImage, 0, 0, canvas.width / dpr, canvas.height / dpr);
  } else {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const pageIndex = state.currentPage - 1;
  if (state.pages[pageIndex]) {
    // Each stroke will set its own composite operation when drawn.
    state.pages[pageIndex].forEach(drawStroke);
  }
};

export const startDrawing = (e) => {
  state.isDrawing = true;
  lastPoint = getRawCoordinates(e);
  const point = lastPoint;

  const size = parseInt(elements.sizeSelect.value, 10);
  
  // === MODIFIED: The stroke object now knows if it's an eraser ===
  state.currentStroke = {
    points: [point],
    color: elements.colorSelect.value, // Color is stored but ignored by eraser
    width: state.isEraser ? Math.max(size * 6, 24) : size,
    isEraser: state.isEraser, // Crucial new property
  };
};

export const draw = (e) => {
  if (!state.isDrawing) return;
  const point = getSmoothedCoordinates(e);
  state.currentStroke.points.push(point);
  
  renderPage();
  drawStroke(state.currentStroke);
};

export const stopDrawing = () => {
  if (state.isDrawing && state.currentStroke && state.currentStroke.points.length > 1) {
    const pageIndex = state.currentPage - 1;
    if (!state.pages[pageIndex]) state.pages[pageIndex] = [];
    state.pages[pageIndex].push(state.currentStroke);
    
    if (!state.undoStack[pageIndex]) state.undoStack[pageIndex] = [];
    state.undoStack[pageIndex].push([...state.pages[pageIndex]]);
    state.redoStack[pageIndex] = [];
  }
  state.isDrawing = false;
  state.currentStroke = null;
};

export const setTool = (tool) => { state.isEraser = tool === 'eraser'; };
export const setRightMouseDown = (isDown) => { state.isRightMouseDown = isDown; };
export const getRightMouseDown = () => state.isRightMouseDown;

export const undo = () => {
  const pageIndex = state.currentPage - 1;
  if (state.undoStack[pageIndex] && state.undoStack[pageIndex].length > 1) {
    state.redoStack[pageIndex].push(state.pages[pageIndex]);
    state.pages[pageIndex] = [...state.undoStack[pageIndex].pop()];
    renderPage();
  } else if (state.undoStack[pageIndex] && state.undoStack[pageIndex].length === 1) {
    state.redoStack[pageIndex].push(state.pages[pageIndex]);
    state.pages[pageIndex] = [];
    renderPage();
  }
};

export const redo = () => {
  const pageIndex = state.currentPage - 1;
  if (state.redoStack[pageIndex] && state.redoStack[pageIndex].length > 0) {
    const nextState = state.redoStack[pageIndex].pop();
    state.undoStack[pageIndex].push(state.pages[pageIndex]);
    state.pages[pageIndex] = nextState;
    renderPage();
  }
};

export const clearPage = () => {
  const pageIndex = state.currentPage - 1;
  if (state.pages[pageIndex] && state.pages[pageIndex].length > 0) {
    state.undoStack[pageIndex].push([...state.pages[pageIndex]]);
    state.pages[pageIndex] = [];
    state.redoStack[pageIndex] = [];
    renderPage();
  }
};

export const changePage = (direction) => {
  if (direction === 'prev' && state.currentPage > 1) {
    state.currentPage--;
  } else if (direction === 'next') {
    state.currentPage++;
    if (state.currentPage > state.pages.length) {
      state.pages.push([]);
      state.undoStack.push([]);
      state.redoStack.push([]);
    }
  }
  renderPage();
};

export const setBackgroundImage = async (imageDataUrl) => {
  if (!imageDataUrl) {
      state.backgroundImage = null;
      renderPage();
      return;
  }
  try {
      const img = new Image();
      img.src = imageDataUrl;
      await img.decode(); 
      state.backgroundImage = img;
      renderPage();
  } catch (error) {
      console.error("Failed to load background image:", error);
      alert("The selected image could not be loaded. Please try a different one.");
      state.backgroundImage = null;
  }
};

export const removeBackgroundImage = () => {
  state.backgroundImage = null;
  renderPage();
};

const updateCanvasSizeAndScaling = () => {
    setupCanvasScaling();
    renderPage();
};

export const setCanvasSize = (width, height) => {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  resetState();
  updateCanvasSizeAndScaling();
};

export const adjustCanvasToWindowSize = (isInitial = false) => {
    const toolbarHeight = document.querySelector('.toolbar')?.offsetHeight || 80;
    const pageControlsHeight = document.querySelector('.page-controls')?.offsetHeight || 70;
    const verticalMargin = toolbarHeight + pageControlsHeight + 40;
    
    const newWidth = window.innerWidth - 40;
    const newHeight = window.innerHeight - verticalMargin;

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;

    if (isInitial) {
        resetState();
    }
    updateCanvasSizeAndScaling();
};

export const resetState = () => {
  state.currentPage = 1;
  state.pages = [[]];
  state.undoStack = [[]];
  state.redoStack = [[]];
  // Don't reset the background on size change, keep it persistent
};

export const getState = () => state;
export const getCanvasContext = () => ({ canvas, ctx });

export const initCanvas = () => {
  adjustCanvasToWindowSize(true);
};

export const renderPageForExport = (pageIndex) => {
  clearCanvas();
  if (state.backgroundImage) {
      const dpr = window.devicePixelRatio || 1;
      ctx.drawImage(state.backgroundImage, 0, 0, canvas.width / dpr, canvas.height / dpr);
  } else {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (state.pages[pageIndex]) {
    state.pages[pageIndex].forEach(drawStroke);
  }
};