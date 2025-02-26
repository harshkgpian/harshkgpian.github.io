// Edit Mode Manager - to be added to your script.js
class EditModeManager {
  constructor(resumeBuilder) {
    this.resumeBuilder = resumeBuilder;
    this.isEditMode = false;
    this.currentContent = null;
    this.editingSection = null;
    this.editingIndex = null;
    this.editingField = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Create a container for the PDF viewer that will overlay clickable areas
    const viewerContainer = document.getElementById('pdf-container');
    if (!viewerContainer) return;
    
    // Create an overlay div that will contain clickable regions
    const overlay = document.createElement('div');
    overlay.id = 'pdf-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none'; // Allow clicks to pass through by default
    viewerContainer.style.position = 'relative';
    viewerContainer.appendChild(overlay);
    
    // Setup toggle for edit mode
    const editModeToggle = document.createElement('button');
    editModeToggle.textContent = 'Toggle Edit Mode';
    editModeToggle.className = 'btn btn-primary';
    editModeToggle.style.position = 'absolute';
    editModeToggle.style.top = '10px';
    editModeToggle.style.right = '10px';
    editModeToggle.style.zIndex = '1000';
    viewerContainer.appendChild(editModeToggle);
    
    editModeToggle.addEventListener('click', () => {
      this.toggleEditMode();
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    const overlay = document.getElementById('pdf-overlay');
    
    if (this.isEditMode) {
      overlay.style.pointerEvents = 'auto';
      this.generateClickableRegions();
      // Visual indicator that edit mode is active
      overlay.style.border = '2px dashed blue';
      overlay.style.background = 'rgba(0, 0, 255, 0.05)';
    } else {
      overlay.style.pointerEvents = 'none';
      overlay.innerHTML = ''; // Remove all clickable regions
      overlay.style.border = 'none';
      overlay.style.background = 'transparent';
    }
  }

  generateClickableRegions() {
    const overlay = document.getElementById('pdf-overlay');
    overlay.innerHTML = ''; // Clear existing regions
    
    // Get the content from the resumeBuilder
    const content = this.resumeBuilder.content;
    
    // Create clickable regions for all sections with bullets
    ['experience', 'projects', 'competitions'].forEach(section => {
      if (content[section] && Array.isArray(content[section])) {
        content[section].forEach((entry, entryIndex) => {
          if (entry.bullets && entry.bullets.length > 0) {
            entry.bullets.forEach((bullet, bulletIndex) => {
              // Calculate position based on PDF rendering
              // This is a simplified example - actual positions would need to be mapped from PDF coordinates
              const bulletRegion = this.calculateBulletPosition(section, entryIndex, bulletIndex);
              this.createClickableRegion(overlay, bulletRegion, section, entryIndex, bulletIndex, bullet);
            });
          }
        });
      }
    });
  }
  
  calculateBulletPosition(section, entryIndex, bulletIndex) {
    // This function would need to map the PDF coordinates to screen coordinates
    // For demonstration, we'll create a simplified positioning algorithm
    // In a real implementation, you would calculate this based on the PDF rendering
    
    // Calculate y-position based on section, entry, and bullet index
    // This is just a placeholder - real implementation would need to use the PDF's actual layout
    const baseY = 150 + (entryIndex * 100) + (bulletIndex * 20);
    
    return {
      top: baseY,
      left: 50,
      width: 500,
      height: 18
    };
  }
  
  createClickableRegion(overlay, position, section, entryIndex, bulletIndex, bulletText) {
    const region = document.createElement('div');
    region.className = 'clickable-bullet';
    region.style.position = 'absolute';
    region.style.top = `${position.top}px`;
    region.style.left = `${position.left}px`;
    region.style.width = `${position.width}px`;
    region.style.height = `${position.height}px`;
    region.style.cursor = 'pointer';
    region.style.backgroundColor = 'rgba(255, 255, 0, 0.1)'; // Subtle highlighting
    region.style.border = '1px solid rgba(255, 255, 0, 0.3)';
    
    // Add data attributes for identifying the bullet
    region.dataset.section = section;
    region.dataset.entryIndex = entryIndex;
    region.dataset.bulletIndex = bulletIndex;
    
    // Add tooltip to show the bullet text
    region.title = bulletText;
    
    region.addEventListener('click', () => {
      this.editBullet(section, entryIndex, bulletIndex, bulletText);
    });
    
    overlay.appendChild(region);
  }
  
  editBullet(section, entryIndex, bulletIndex, currentText) {
    // Create modal for editing
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'editBulletModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'editBulletModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editBulletModalLabel">Edit Bullet Point</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <textarea id="bulletEditArea" class="form-control" rows="4">${currentText}</textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="saveBulletBtn">Save</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show the modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // Handle save
    document.getElementById('saveBulletBtn').addEventListener('click', () => {
      const newText = document.getElementById('bulletEditArea').value;
      this.updateBullet(section, entryIndex, bulletIndex, newText);
      modalInstance.hide();
      
      // Remove modal from DOM after hiding
      modal.addEventListener('hidden.bs.modal', function () {
        document.body.removeChild(modal);
      });
    });
    
    // Handle modal close
    modal.addEventListener('hidden.bs.modal', function () {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    });
  }
  
  updateBullet(section, entryIndex, bulletIndex, newText) {
    // Update the content in the resumeBuilder
    this.resumeBuilder.content[section][entryIndex].bullets[bulletIndex] = newText;
    
    // Re-render the PDF
    this.resumeBuilder.renderContent(this.resumeBuilder.content);
    
    // If still in edit mode, regenerate clickable regions
    if (this.isEditMode) {
      this.generateClickableRegions();
    }
  }
}

// Modifications to existing template.js to support the edit mode
// Add this to the end of your ResumeBuilder class

// Method to get current content
getContent() {
  return this.content;
}

// Method to update content and re-render
updateContent(newContent) {
  this.content = newContent;
  this.renderContent(this.content);
}

// Add initialization code to your script.js
document.addEventListener('DOMContentLoaded', function() {
  // Initialize your resumeBuilder as you normally would
  const resumeBuilder = new ResumeBuilder();
  
  // Then initialize the edit mode manager
  const editManager = new EditModeManager(resumeBuilder);
  
  // Expose the edit manager to the global scope if needed
  window.editManager = editManager;
});