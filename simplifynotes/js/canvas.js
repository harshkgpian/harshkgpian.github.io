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
  erasedStrokes: new Set(), // Track strokes to be erased
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
 * Check if a point is on a stroke path within tolerance
 */
const isPointOnStroke = (point, stroke, tolerance = 10) => {
  if (!stroke || !stroke.points || stroke.points.length < 2) return false;
  
  for (let i = 0; i < stroke.points.length - 1; i++) {
    const p1 = stroke.points[i];
    const p2 = stroke.points[i + 1];
    
    // Calculate distance from point to line segment
    const A = point.x - p1.x;
    const B = point.y - p1.y;
    const C = p2.x - p1.x;
    const D = p2.y - p1.y;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = p1.x;
      yy = p1.y;
    } else if (param > 1) {
      xx = p2.x;
      yy = p2.y;
    } else {
      xx = p1.x + param * C;
      yy = p1.y + param * D;
    }
    
    const dx = point.x - xx;
    const dy = point.y - yy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Consider stroke width for better hit detection
    const effectiveTolerance = Math.max(tolerance, stroke.width / 2 + 5);
    
    if (distance <= effectiveTolerance) {
      return true;
    }
  }
  
  return false;
};

/**
 * Draws a single stroke on the canvas
 */
const drawStroke = (stroke) => {
  if (!stroke || stroke.points.length < 2 || stroke.isErased) return;

  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
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
};

/**
 * Draw eraser preview - shows what will be erased
 */
const drawEraserPreview = (point) => {
  if (!state.isEraser) return;
  
  const pageIndex = state.currentPage - 1;
  if (!state.pages[pageIndex]) return;
  
  // Find strokes that would be erased
  const strokesToHighlight = state.pages[pageIndex].filter(stroke => 
    !stroke.isErased && isPointOnStroke(point, stroke)
  );
  
  // Draw highlighted strokes in red to show what will be erased
  strokesToHighlight.forEach(stroke => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = stroke.width + 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
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
  });
  
  // Draw eraser cursor
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  const size = parseInt(elements.sizeSelect.value, 10);
  const eraserSize = Math.max(size * 6, 24);
  
  ctx.beginPath();
  ctx.arc(point.x, point.y, eraserSize / 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);
};

const clearCanvas = () => {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
};

export const renderPage = () => {
  clearCanvas();

  // Always draw white background first
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Then draw background image if it exists
  if (state.backgroundImage) {
    const dpr = window.devicePixelRatio || 1;
    ctx.drawImage(state.backgroundImage, 0, 0, canvas.width / dpr, canvas.height / dpr);
  }

  // Draw all non-erased strokes
  const pageIndex = state.currentPage - 1;
  if (state.pages[pageIndex]) {
    state.pages[pageIndex].forEach(stroke => {
      if (!stroke.isErased) {
        drawStroke(stroke);
      }
    });
  }
};

export const startDrawing = (e) => {
  state.isDrawing = true;
  lastPoint = getRawCoordinates(e);
  const point = lastPoint;

  if (state.isEraser) {
    // For eraser, start marking strokes for deletion
    state.erasedStrokes.clear();
    eraseAtPoint(point);
  } else {
    // For pencil, create new stroke
    const size = parseInt(elements.sizeSelect.value, 10);
    state.currentStroke = {
      id: Date.now() + Math.random(), // Unique ID for each stroke
      points: [point],
      color: elements.colorSelect.value,
      width: size,
      isErased: false,
    };
  }
};

const eraseAtPoint = (point) => {
  const pageIndex = state.currentPage - 1;
  if (!state.pages[pageIndex]) return;
  
  let hasChanges = false;
  
  // Find and mark strokes for erasure
  state.pages[pageIndex].forEach(stroke => {
    if (!stroke.isErased && isPointOnStroke(point, stroke)) {
      stroke.isErased = true;
      state.erasedStrokes.add(stroke.id);
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    renderPage();
  }
};

export const draw = (e) => {
  if (!state.isDrawing) return;
  
  const point = getSmoothedCoordinates(e);
  
  if (state.isEraser) {
    eraseAtPoint(point);
  } else {
    // Add point to current stroke and draw
    state.currentStroke.points.push(point);
    renderPage();
    drawStroke(state.currentStroke);
  }
};

export const drawHover = (e) => {
  if (state.isDrawing || !state.isEraser) return;
  
  const point = getRawCoordinates(e);
  renderPage();
  drawEraserPreview(point);
};

export const stopDrawing = () => {
  if (!state.isDrawing) return;
  
  const pageIndex = state.currentPage - 1;
  
  if (state.isEraser) {
    // Save undo state if strokes were erased
    if (state.erasedStrokes.size > 0) {
      if (!state.undoStack[pageIndex]) state.undoStack[pageIndex] = [];
      state.undoStack[pageIndex].push(JSON.parse(JSON.stringify(state.pages[pageIndex])));
      state.redoStack[pageIndex] = [];
      state.erasedStrokes.clear();
    }
  } else {
    // Add completed stroke to page
    if (state.currentStroke && state.currentStroke.points.length > 1) {
      if (!state.pages[pageIndex]) state.pages[pageIndex] = [];
      state.pages[pageIndex].push(state.currentStroke);
      
      if (!state.undoStack[pageIndex]) state.undoStack[pageIndex] = [];
      state.undoStack[pageIndex].push(JSON.parse(JSON.stringify(state.pages[pageIndex])));
      state.redoStack[pageIndex] = [];
    }
  }
  
  state.isDrawing = false;
  state.currentStroke = null;
  renderPage();
};

export const setTool = (tool) => { 
  state.isEraser = tool === 'eraser';
  if (!state.isEraser) {
    renderPage(); // Clear any eraser preview
  }
};

export const setRightMouseDown = (isDown) => { state.isRightMouseDown = isDown; };
export const getRightMouseDown = () => state.isRightMouseDown;

export const undo = () => {
  const pageIndex = state.currentPage - 1;
  if (state.undoStack[pageIndex] && state.undoStack[pageIndex].length > 1) {
    if (!state.redoStack[pageIndex]) state.redoStack[pageIndex] = [];
    state.redoStack[pageIndex].push(JSON.parse(JSON.stringify(state.pages[pageIndex])));
    state.undoStack[pageIndex].pop(); // Remove current state
    state.pages[pageIndex] = JSON.parse(JSON.stringify(state.undoStack[pageIndex][state.undoStack[pageIndex].length - 1]));
    renderPage();
  } else if (state.undoStack[pageIndex] && state.undoStack[pageIndex].length === 1) {
    if (!state.redoStack[pageIndex]) state.redoStack[pageIndex] = [];
    state.redoStack[pageIndex].push(JSON.parse(JSON.stringify(state.pages[pageIndex])));
    state.pages[pageIndex] = [];
    renderPage();
  }
};

export const redo = () => {
  const pageIndex = state.currentPage - 1;
  if (state.redoStack[pageIndex] && state.redoStack[pageIndex].length > 0) {
    const nextState = state.redoStack[pageIndex].pop();
    if (!state.undoStack[pageIndex]) state.undoStack[pageIndex] = [];
    state.undoStack[pageIndex].push(JSON.parse(JSON.stringify(state.pages[pageIndex])));
    state.pages[pageIndex] = nextState;
    renderPage();
  }
};

export const clearPage = () => {
  const pageIndex = state.currentPage - 1;
  if (state.pages[pageIndex] && state.pages[pageIndex].length > 0) {
    if (!state.undoStack[pageIndex]) state.undoStack[pageIndex] = [];
    state.undoStack[pageIndex].push(JSON.parse(JSON.stringify(state.pages[pageIndex])));
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
  state.erasedStrokes.clear();
};

export const getState = () => state;
export const getCanvasContext = () => ({ canvas, ctx });

export const initCanvas = () => {
  // Set default size to 1280x720
  canvas.style.width = '1280px';
  canvas.style.height = '720px';
  resetState();
  updateCanvasSizeAndScaling();
};

export const renderPageForExport = (pageIndex) => {
  clearCanvas();
  
  // Always draw white background first
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Then draw background image if it exists
  if (state.backgroundImage) {
      const dpr = window.devicePixelRatio || 1;
      ctx.drawImage(state.backgroundImage, 0, 0, canvas.width / dpr, canvas.height / dpr);
  }

  // Draw all non-erased strokes
  if (state.pages[pageIndex]) {
    state.pages[pageIndex].forEach(stroke => {
      if (!stroke.isErased) {
        drawStroke(stroke);
      }
    });
  }
};