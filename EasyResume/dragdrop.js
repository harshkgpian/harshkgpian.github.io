// dragdrop.js
let dragSrcEl = null;
let dragSrcGroup = null;

function makeDraggable() {
    const sections = document.querySelectorAll('.section-form');
    sections.forEach(section => {
        const dragHandle = section.querySelector('.drag-handle');
        if (dragHandle) {
            section.setAttribute('draggable', true);
            
            // Only attach dragstart to the handle
            dragHandle.addEventListener('mousedown', (e) => {
                section.draggable = true;
            });
            
            // Prevent text selection when dragging
            dragHandle.addEventListener('selectstart', (e) => {
                e.preventDefault();
            });

            // Make section not draggable when clicking elsewhere
            section.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('drag-handle')) {
                    section.draggable = false;
                }
            });

            section.addEventListener('dragstart', handleDragStart);
            section.addEventListener('dragover', handleDragOver);
            section.addEventListener('dragenter', handleDragEnter);
            section.addEventListener('dragleave', handleDragLeave);
            section.addEventListener('drop', handleDrop);
            section.addEventListener('dragend', handleDragEnd);
            
            // Reset draggable state after drag ends
            section.addEventListener('mouseup', () => {
                section.draggable = false;
            });
        }
    });
}

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl !== this) {
        const srcType = dragSrcEl.id.split('-')[0];
        const destType = this.id.split('-')[0];

        if (srcType === destType) {
            // Swap the sections
            const allSections = Array.from(document.querySelectorAll(`.section-form[id^="${srcType}"]`));
            const srcIndex = allSections.indexOf(dragSrcEl);
            const destIndex = allSections.indexOf(this);

            // Update the DOM
            if (destIndex > srcIndex) {
                this.parentNode.insertBefore(dragSrcEl, this.nextSibling);
            } else {
                this.parentNode.insertBefore(dragSrcEl, this);
            }

            // Update the formData array
            const temp = formData[srcType][srcIndex];
            formData[srcType][srcIndex] = formData[srcType][destIndex];
            formData[srcType][destIndex] = temp;

            generateResume(sectionOrder);
        }
    }
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.section-form').forEach(section => {
        section.classList.remove('drag-over');
    });
}

// Add these variables at the top
function makeGroupsDraggable() {
    const groups = document.querySelectorAll('.section-group');
    groups.forEach(group => {
        const header = group.querySelector('.group-header');
        header.setAttribute('draggable', true);
        header.addEventListener('dragstart', handleGroupDragStart);
        header.addEventListener('dragover', handleGroupDragOver);
        header.addEventListener('dragenter', handleGroupDragEnter);
        header.addEventListener('dragleave', handleGroupDragLeave);
        header.addEventListener('drop', handleGroupDrop);
        header.addEventListener('dragend', handleGroupDragEnd);
    });
}

function handleGroupDragStart(e) {
    dragSrcGroup = this.closest('.section-group');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    dragSrcGroup.classList.add('group-dragging');
}

function handleGroupDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleGroupDragEnter(e) {
    this.closest('.section-group').classList.add('group-drag-over');
}

function handleGroupDragLeave(e) {
    this.closest('.section-group').classList.remove('group-drag-over');
}

function handleGroupDrop(e) {
    e.stopPropagation();
    
    const destGroup = this.closest('.section-group');
    if (dragSrcGroup !== destGroup) {
        const formContainer = document.getElementById('formContainer');
        const groups = Array.from(formContainer.querySelectorAll('.section-group'));
        
        const srcIndex = groups.indexOf(dragSrcGroup);
        const destIndex = groups.indexOf(destGroup);
        
        // Update DOM
        if (destIndex > srcIndex) {
            destGroup.parentNode.insertBefore(dragSrcGroup, destGroup.nextSibling);
        } else {
            destGroup.parentNode.insertBefore(dragSrcGroup, destGroup);
        }
        
        // Update section order
        updateSectionOrder();
    }
    
    return false;
}

function handleGroupDragEnd(e) {
    dragSrcGroup.classList.remove('group-dragging');
    document.querySelectorAll('.section-group').forEach(group => {
        group.classList.remove('group-drag-over');
    });
    getSectionOrder(); // Add this line to see the order after each drag
}

function updateSectionOrder() {
    const groups = document.querySelectorAll('.section-group');
    sectionOrder = Array.from(groups).map(group => {
        const type = group.className.split(' ')[1].replace('-group', '');
        return type === 'personal' ? 'header' : type;
    });
    
    // Regenerate resume with new order
    generateResume(sectionOrder);
}

function toggleGroup(type) {
    const groupContent = document.getElementById(`group-content-${type}`);
    const groupHeader = groupContent.previousElementSibling;
    const icon = groupHeader.querySelector('.group-toggle-icon');
    
    groupContent.classList.toggle('collapsed');
    icon.textContent = groupContent.classList.contains('collapsed') ? '▶' : '▼';
}

function getSectionOrder() {
    const groups = document.querySelectorAll('.section-group');
    const currentOrder = Array.from(groups).map(group => {
        const type = group.className.split(' ')[1].replace('-group', '');
        // Convert 'personal' to 'header' to maintain consistency
        return type === 'personal' ? 'header' : type;
    });
    
    console.log('Current Section Order:', currentOrder);
    return currentOrder;
}

// Initialize groups to be collapsed by default
function initializeCollapsedGroups() {
    const groupContents = document.querySelectorAll('[id^="group-content-"]');
    groupContents.forEach(groupContent => {
        // Add collapsed class
        groupContent.classList.add('collapsed');
        
        // Update the toggle icon
        const groupHeader = groupContent.previousElementSibling;
        const icon = groupHeader.querySelector('.group-toggle-icon');
        if (icon) {
            icon.textContent = '▶';
        }
    });
}

window.onload = () => {
    // Initialize all groups as collapsed
    initializeCollapsedGroups();
    
    // Make elements draggable
    makeDraggable();
    makeGroupsDraggable();
    
    // Get initial section order
    getSectionOrder();
};