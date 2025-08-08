// js/ui.js
import { elements } from './config.js';
import * as canvas from './canvas.js';
import * as file from './fileHandler.js';
// Import the new pinger controls
import * as recorder from './recorder.js';

const updatePageInfo = () => {
    const { currentPage, pages } = canvas.getState();
    const totalPages = Math.max(pages.length, 1);
    elements.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    elements.prevPageBtn.disabled = currentPage === 1;
    elements.nextPageBtn.disabled = currentPage >= 200;
};

const setupToolButtons = () => {
    elements.pencilBtn.addEventListener('click', () => {
        canvas.setTool('pencil');
        elements.pencilBtn.classList.add('active');
        elements.eraserBtn.classList.remove('active');
    });

    elements.eraserBtn.addEventListener('click', () => {
        canvas.setTool('eraser');
        elements.eraserBtn.classList.add('active');
        elements.pencilBtn.classList.remove('active');
    });
};

const setupCanvasEventListeners = () => {
    const { canvas: canvasEl } = elements;

    canvasEl.addEventListener('pointerdown', (e) => {
        // === MODIFIED: Stop the pinger when drawing starts ===
        if (recorder.isRecording()) {
            recorder.stopPinger();
        }

        if (e.button === 2) {
            canvas.setRightMouseDown(true);
            canvas.setTool('eraser');
        }
        canvas.startDrawing(e);
    });

    canvasEl.addEventListener('pointermove', canvas.draw);

    const onPointerUpOrOut = () => {
        const wasDrawing = canvas.getState().isDrawing;
        
        if (canvas.getRightMouseDown()) {
            canvas.setRightMouseDown(false);
            canvas.setTool('pencil');
        }
        canvas.stopDrawing();

        // === MODIFIED: Restart the pinger when drawing stops ===
        // This ensures the last drawn frame is held.
        if (recorder.isRecording() && wasDrawing) {
            recorder.startPinger();
        }
    };

    canvasEl.addEventListener('pointerup', onPointerUpOrOut);
    canvasEl.addEventListener('pointerout', onPointerUpOrOut);
    canvasEl.addEventListener('contextmenu', (e) => e.preventDefault());
};

const setupActionButtons = () => {
    elements.undoBtn.addEventListener('click', canvas.undo);
    elements.redoBtn.addEventListener('click', canvas.redo);
    elements.clearBtn.addEventListener('click', () => {
        canvas.clearPage();
        updatePageInfo();
    });
    elements.savePdfBtn.addEventListener('click', () => file.saveDrawing(false));
};

const setupRecording = () => {
    elements.recordBtn.addEventListener('click', async () => {
        if (recorder.isRecording()) {
            // The stopRecording function in the recorder module now handles the 1s delay
            recorder.stopRecording();
            elements.recordBtn.classList.remove('recording');
            elements.recordBtn.innerHTML = '🎤 Start Recording';
        } else {
            try {
                await recorder.startRecording(); 
                elements.recordBtn.classList.add('recording');
                elements.recordBtn.innerHTML = '■ Stop Recording';
            } catch (error) {
                alert(error.message);
                console.error(error);
            }
        }
    });
};

/**
 * NEW: Sets up event listeners for the background controls.
 */
const setupBackgroundControls = () => {
    // When "Add Background" is clicked, trigger the hidden file input
    elements.addBackgroundBtn.addEventListener('click', () => {
        elements.backgroundInput.click();
    });

    // When a file is selected in the hidden input
    elements.backgroundInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageDataUrl = event.target.result;
            // Save to localStorage for persistence
            localStorage.setItem('canvasBackground', imageDataUrl);
            // Set it on the canvas for the current session
            canvas.setBackgroundImage(imageDataUrl);
        };
        reader.readAsDataURL(file);

        // Reset the input value to allow re-selecting the same file
        e.target.value = '';
    });

    // When "Remove BG" is clicked
    elements.removeBackgroundBtn.addEventListener('click', () => {
        localStorage.removeItem('canvasBackground');
        canvas.removeBackgroundImage();
    });
};

const setupPageControls = () => {
    elements.prevPageBtn.addEventListener('click', () => {
        canvas.changePage('prev');
        updatePageInfo();
    });
    elements.nextPageBtn.addEventListener('click', () => {
        canvas.changePage('next');
        updatePageInfo();
    });
};

const setupCanvasSizeModal = () => {
    elements.customCanvasBtn.addEventListener('click', () => {
        elements.canvasSizeModal.style.display = 'flex';
    });
    elements.cancelCanvasSizeBtn.addEventListener('click', () => {
        elements.canvasSizeModal.style.display = 'none';
    });
    elements.confirmCanvasSizeBtn.addEventListener('click', () => {
        const newWidth = parseInt(elements.canvasWidthInput.value, 10);
        const newHeight = parseInt(elements.canvasHeightInput.value, 10);
        if (newWidth && newHeight) {
            canvas.setCanvasSize(newWidth, newHeight);
            updatePageInfo();
        }
        elements.canvasSizeModal.style.display = 'none';
    });
    elements.setBrowserSizeBtn.addEventListener('click', () => {
      canvas.adjustCanvasToWindowSize(false);
    });
};

const setupKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        const isCtrl = e.ctrlKey || e.metaKey;

        if (isCtrl && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            e.shiftKey ? canvas.redo() : canvas.undo();
        } else if (isCtrl && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            canvas.redo();
        } else if (isCtrl && e.key.toLowerCase() === 's') {
            e.preventDefault();
            file.saveDrawing(e.shiftKey);
        }
    });
};

const setupWindowResize = () => {
  let resizeTimeout;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
          canvas.adjustCanvasToWindowSize();
          updatePageInfo();
      }, 250);
  });
};

export const initUI = () => {
    setupToolButtons();
    setupCanvasEventListeners();
    setupActionButtons();
    setupRecording();
    setupBackgroundControls(); // Add the new setup function here
    setupPageControls();
    setupCanvasSizeModal();
    setupKeyboardShortcuts();
    setupWindowResize();
    updatePageInfo();
};