// Modified removeSection function to track section removals
function removeSection(sectionId) {
    const section = document.getElementById(sectionId);
    const groupContainer = section.parentElement.parentElement; // Get the main group container
    const type = sectionId.split('-')[0]; // Get section type
    
    // Store all section data before removal
    const sectionContent = section.innerHTML;
    const sectionData = formData[type].find(item => item.id === sectionId);
    const groupContent = groupContainer.querySelector('.group-content');
    const sectionIndex = Array.from(groupContent.children).indexOf(section);
    
    // Push to history
    pushToHistory({
        type: 'removeSection',
        sectionId: sectionId,
        sectionType: type,
        sectionContent: sectionContent,
        sectionData: JSON.parse(JSON.stringify(sectionData)), // Deep copy
        groupContainer: groupContainer,
        sectionIndex: sectionIndex
    });
    
    // Remove from DOM
    section.remove();
    
    // Remove from formData
    formData[type] = formData[type].filter(item => item.id !== sectionId);
    
    // Check if group content is empty
    if (groupContent && groupContent.querySelectorAll('.section-form').length === 0) {
        groupContainer.remove(); // Remove the entire group container
    }
    
    generateResume();
}

// Modified addSection function to track section additions
function addSection(type) {
    const formContainer = document.getElementById('formContainer');
    const sectionId = `${type}-${sectionCounter[type]++}`;
    
    // First, check if group container exists
    let groupContainer = document.querySelector(`.${type}-group`);
    
    // If group container doesn't exist, create it
    if (!groupContainer) {
        groupContainer = document.createElement('div');
        groupContainer.className = `section-group ${type}-group`;
        groupContainer.innerHTML = `
            <div class="group-header" onclick="toggleGroup('${type}')">
                <h3>${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                <span class="group-toggle-icon">▼</span>
            </div>
            <div class="group-content" id="group-content-${type}">
            </div>
        `;
        formContainer.appendChild(groupContainer);
    }
    
    // Get the group content
    const groupContent = groupContainer.querySelector('.group-content');
    
    const form = document.createElement('div');
    form.className = 'section-form';
    form.id = sectionId;
    
    let formContent = getFormContent(type, sectionId);
    
    form.innerHTML = `
        <div class="section-header" onclick="toggleSection('${sectionId}')">
            <span class="drag-handle">⋮⋮</span>
            <span class="section-title">${type.charAt(0).toUpperCase() + type.slice(1)} ${sectionCounter[type]}</span>
            <span class="toggle-icon">▼</span>
        </div>
        <div class="section-content" id="content-${sectionId}">
            ${formContent}
            <button class="remove-btn" onclick="removeSection('${sectionId}')">Remove Section</button>
        </div>
    `;
    
    groupContent.appendChild(form);
    
    // Store the action for potential undo
    pushToHistory({
        type: 'addSection',
        sectionId: sectionId,
        sectionType: type
    });
    
    makeGroupsDraggable();
    makeDraggable();
    generateResume(sectionOrder);

    // Add input event listeners for dynamic title updates
    const titleInput = form.querySelector('input[name="title"]');
    const schoolInput = form.querySelector('input[name="school"]');
    const categoryInput = form.querySelector('input[name="category"]');
    const nameInput = form.querySelector('input[name="name"]');

    // Track field changes
    const trackFieldChange = (input) => {
        if (!input) return;
        
        // Add the initial value tracker
        input.dataset.initialValue = input.value;
        
        input.addEventListener('focus', function() {
            // Store the starting value when focus begins
            this.dataset.initialValue = this.value;
        });
        
        input.addEventListener('blur', function() {
            // If value changed, store the change
            if (this.dataset.initialValue !== this.value) {
                pushToHistory({
                    type: 'fieldChange',
                    sectionId: sectionId,
                    fieldName: this.name,
                    oldValue: this.dataset.initialValue,
                    newValue: this.value,
                    inputElement: this
                });
                // Update the stored value
                this.dataset.initialValue = this.value;
            }
        });
    };

    // Apply field change tracking to all inputs and textareas in the section
    form.querySelectorAll('input, textarea').forEach(input => {
        trackFieldChange(input);
    });

    if (titleInput) {
        titleInput.addEventListener('input', () => updateSectionTitle(sectionId, type, titleInput.value));
    }
    if (schoolInput) {
        schoolInput.addEventListener('input', () => updateSectionTitle(sectionId, type, schoolInput.value));
    }
    if (categoryInput) {
        categoryInput.addEventListener('input', () => updateSectionTitle(sectionId, type, categoryInput.value));
    }
    if (nameInput) {
        nameInput.addEventListener('input', () => updateSectionTitle(sectionId, type, nameInput.value));
    }
}


function addCustomSection() {
    // Create a modal dialog instead of using prompt
    const modal = document.createElement("div");
    modal.className = "custom-modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.zIndex = "1000";
    
    modal.innerHTML = `
        <div class="modal-content" style="margin: 20px auto; max-width: 500px;">
            <h3>Add New Section</h3>
            <input type="text" id="sectionNameInput" placeholder="Enter section name">
            <div class="modal-buttons">
                <button id="cancelBtn">Cancel</button>
                <button id="submitBtn">Add Section</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus the input field
    const inputField = document.getElementById("sectionNameInput");
    inputField.focus();
    
    // Handle submit button click
    document.getElementById("submitBtn").addEventListener("click", function() {
        const sectionName = inputField.value;
        if (sectionName && sectionName.trim() !== "") {
            const formattedName = sectionName.toLowerCase().replace(/\s+/g, '_');
            
            // Create a new button and add it to the sidebar
            const sidebar = document.querySelector(".action-buttons");
            const newButton = document.createElement("button");
            newButton.className = "add-btn";
            newButton.textContent = `Add ${sectionName}`;
            newButton.onclick = function() {
                addSection(formattedName);
            };
            
            sidebar.appendChild(newButton);
            
            // Update the config
            updateConfigWithCustomSection(formattedName, sectionName);
            
            // Remove the modal
            document.body.removeChild(modal);
        }
    });
    
    // Handle cancel button click
    document.getElementById("cancelBtn").addEventListener("click", function() {
        document.body.removeChild(modal);
    });
    
    // Close modal if user clicks outside of it
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Helper function to update section name in the UI
function updateSectionName(sectionId, newName) {
    const sectionHeader = document.querySelector(`#section-${sectionId} .section-header h2`);
    if (sectionHeader && newName) {
        sectionHeader.textContent = newName;
    }
}

function toggleSection(sectionId) {
    const content = document.getElementById(`content-${sectionId}`);
    const header = content.previousElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    content.classList.toggle('expanded');
    icon.textContent = content.classList.contains('expanded') ? '▼' : '▶';
}

function addSkillField(sectionId) {
    const skillsContainer = document.getElementById(`skills-${sectionId}`);
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    skillItem.innerHTML = `
        <input type="text" name="skill" placeholder="Enter skill" onchange="updateFormData('${sectionId}'); generateResume();">
    `;
    skillsContainer.appendChild(skillItem);
}


// Modify updateSectionTitle function to include skills and personal sections
function updateSectionTitle(sectionId, type, value, additionalValue = '') {
    const section = document.getElementById(sectionId);
    const titleElement = section.querySelector('.section-title');
    
    if (value && value.trim() !== '') {
        switch(type) {
            case 'experience':
                titleElement.textContent = `Experience - ${value}`;
                break;
            case 'projects':
                titleElement.textContent = `Project - ${value}`;
                break;
            case 'education':
                titleElement.textContent = `Education - ${value}`;
                break;
            case 'competitions':
                titleElement.textContent = `Competition - ${value}`;
                break;
            case 'skills':
                titleElement.textContent = `Skills - ${value}`;
                break;
            case 'personal':
                titleElement.textContent = `Personal - ${value}`;
                break;
            default:
                titleElement.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${value}`;
        }
    } else {
        titleElement.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} ${sectionId.split('-')[1]}`;
    }
}

// Function to maximize a section (expand it and blur everything else)
function maximizeSection(sectionId) {
    const section = document.getElementById(sectionId);
    const formContainer = document.getElementById('formContainer');
    
    // Add classes for styling
    section.classList.add('maximized-section');
    formContainer.classList.add('blurred-background');
    
    // Hide all other sections
    const allSections = document.querySelectorAll('.section-form');
    allSections.forEach(s => {
        if (s.id !== sectionId) {
            s.classList.add('hidden-section');
        }
    });
    
    // Hide all group headers
    const groupHeaders = document.querySelectorAll('.group-header');
    groupHeaders.forEach(header => {
        header.classList.add('hidden-section');
    });
    
    // Focus on the first input field in the section
    const firstInput = section.querySelector('input, textarea');
    if (firstInput) {
        firstInput.focus();
    }
    
    // Add event listeners for escape and enter keys
    document.addEventListener('keydown', minimizeOnKeypress);
}

// Function to minimize the section on keypress (Escape or Enter)
function minimizeOnKeypress(event) {
    if (event.key === 'Escape' || event.key === 'Enter') {
        minimizeSection();
        // Remove the event listener
        document.removeEventListener('keydown', minimizeOnKeypress);
    }
}

// Function to minimize the section
function minimizeSection() {
    // Remove maximized class from all sections
    const maximizedSection = document.querySelector('.maximized-section');
    if (maximizedSection) {
        maximizedSection.classList.remove('maximized-section');
    }
    
    // Remove the blurred background
    const formContainer = document.getElementById('formContainer');
    formContainer.classList.remove('blurred-background');
    
    // Show all sections again
    const hiddenSections = document.querySelectorAll('.hidden-section');
    hiddenSections.forEach(section => {
        section.classList.remove('hidden-section');
    });
}

function updateBulletWidthInfo(inputElement) {
    // Get the relevant elements
    const bulletItem = inputElement.closest('.bullet-item');
    const widthInfoSpan = bulletItem.querySelector('.bullet-width-info');
    
    // Create a temporary ResumeBuilder instance with the CURRENT config
    const tempBuilder = new ResumeBuilder(currentConfig);
    
    // Set font to normal as used for bullets
    tempBuilder.setFont('normal');
    
    // Calculate available width for bullet text using current config
    const availableWidth = tempBuilder.contentWidth - tempBuilder.config.spacing.indentation;
    
    // Calculate actual width of the text
    const actualTextWidth = tempBuilder.doc.getTextWidth(inputElement.value.trim());
    
    // Calculate percentage and round to nearest integer
    const percentageUsed = Math.round((actualTextWidth / availableWidth) * 100);
    
    // Calculate word count
    const words = inputElement.value.trim().split(/\s+/).length;
    
    // Calculate average width per word
    const avgWidthPerWord = words > 0 ? actualTextWidth / words : 0;
    
    // Calculate words to add/remove
    let wordsToAdd = 0;
    if (percentageUsed < 100) {
        // Calculate how many words to add to reach optimal length (90-95%)
        const targetPercentage = 99; // Aim for 95% of available width
        const additionalWidthNeeded = (targetPercentage / 100 * availableWidth) - actualTextWidth;
        wordsToAdd = Math.round(additionalWidthNeeded / avgWidthPerWord);
    } else if (percentageUsed > 100) {
        // Calculate how many words to remove to fit
        const excessWidth = actualTextWidth - availableWidth;
        wordsToAdd = -Math.ceil(excessWidth / avgWidthPerWord); // Negative value = words to remove
    }
    
    // Update the display
    widthInfoSpan.textContent = `${percentageUsed}%`;
    
    // Add visual indicator for width and suggestion
    if (percentageUsed > 99) {
        widthInfoSpan.style.color = 'red';
        widthInfoSpan.textContent = `${percentageUsed}% (remove ~${Math.abs(wordsToAdd)} words)`;
    } else if (percentageUsed > 95) {
        widthInfoSpan.style.color = 'green';
        widthInfoSpan.textContent = `${percentageUsed}% (perfect length)`;
    } else {
        widthInfoSpan.style.color = 'orange';
        widthInfoSpan.textContent = `${percentageUsed}% (add ~${wordsToAdd} words)`;
    }
}


// Modify the addBulletField function to track bullet addition
function addBulletField(sectionId, container, existingText = '') {
    const bulletItem = document.createElement('div');
    bulletItem.className = 'bullet-item';
    bulletItem.innerHTML = `
        <div class="bullet-input-container">
            <input type="text" name="bullet" class="bullet-input" value="${existingText}" 
                   placeholder="Enter bullet point" 
                   oninput="updateBulletWidthInfo(this); updateFormData('${sectionId}');" 
                   onchange="generateResume();">
            <span class="bullet-width-info">0%</span>
            <button type="button" class="remove-bullet-btn" onclick="removeBullet(this)">×</button>
        </div>
    `;
    container.appendChild(bulletItem);
    
    // Track field changes for the newly added bullet
    const bulletInput = bulletItem.querySelector('.bullet-input');
    
    // Initialize width info if there's existing text
    if (existingText) {
        updateBulletWidthInfo(bulletInput);
    }
    
    // Track the addition for undo
    if (existingText === '') {  // Only track new bullets, not ones being restored
        pushToHistory({
            type: 'addBullet',
            sectionId: sectionId,
            bulletItem: bulletItem
        });
    }
    
    // Add change tracking
    bulletInput.dataset.initialValue = existingText;
    
    bulletInput.addEventListener('focus', function() {
        this.dataset.initialValue = this.value;
    });
    
    bulletInput.addEventListener('blur', function() {
        if (this.dataset.initialValue !== this.value) {
            pushToHistory({
                type: 'fieldChange',
                sectionId: sectionId,
                fieldName: 'bullet',
                oldValue: this.dataset.initialValue,
                newValue: this.value,
                inputElement: this
            });
            this.dataset.initialValue = this.value;
        }
    });
    
    return bulletItem;
}

// Modified removeBullet function to track removals
function removeBullet(button) {
    const bulletItem = button.parentElement.parentElement;
    const sectionId = bulletItem.closest('.section-content').id.replace('content-', '');
    const bulletInput = bulletItem.querySelector('.bullet-input');
    const bulletText = bulletInput.value;
    const bulletContainer = bulletItem.parentElement;
    const bulletIndex = Array.from(bulletContainer.children).indexOf(bulletItem);
    
    // Store the action for potential undo
    pushToHistory({
        type: 'removeBullet',
        sectionId: sectionId,
        bulletText: bulletText,
        container: bulletContainer,
        index: bulletIndex
    });
    
    // Remove the bullet
    bulletItem.remove();
    updateFormData(sectionId);
    generateResume();
}


// Add this at the end of the generateResume function
function updateAllBulletWidthInfo() {
    const bulletInputs = document.querySelectorAll('.bullet-input');
    bulletInputs.forEach(input => {
        updateBulletWidthInfo(input);
    });
}
 