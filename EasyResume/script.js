let sectionCounter = {
    personal: 0,
    education: 0,
    experience: 0,
    projects: 0,
    competitions: 0,
    skills: 0,
    summary: 0,  // Add this if missing
    general: 0
};

let formData = {
    personal: [],
    education: [],
    experience: [],
    projects: [],
    competitions: [],
    skills: [],
    summary: [],  // Add this if missing
    general: []
};

let sectionOrder = ['header', 'summary', 'education', 'experience', 'projects', 'competitions', 'skills'];

let sectionConfigs = {
    'personal': { title: 'Personal Information', fields: [ 
        { name: 'name', label: 'Full Name', type: 'text' }, 
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone', type: 'tel' },
        { name: 'github', label: 'GitHub', type: 'text' },
        { name: 'linkedin', label: 'LinkedIn', type: 'text' }
    ]},
    'summary': { title: 'Summary', fields: [ 
        { name: 'summary', label: 'Professional Summary', type: 'textarea', rows: 4 }
    ]},
    'education': { title: 'Education', fields: [ 
        { name: 'school', label: 'School/University', type: 'text' },
        { name: 'degree', label: 'Degree', type: 'text' },
        { name: 'duration', label: 'Duration', type: 'text' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'scoreType', label: 'Score Type', type: 'text' },
        { name: 'gpa', label: 'Score', type: 'text' }
    ]},
    'experience': { title: 'Work Experience', fields: [ 
        { name: 'title', label: 'Company', type: 'text' },
        { name: 'titleLink', label: 'Position Related URL', type: 'text' },
        { name: 'subtitle', label: 'Position', type: 'text' },
        { name: 'duration', label: 'Duration', type: 'text' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
        { name: 'bullets', label: 'Bullet Points (one per line)', type: 'textarea', rows: 4 },
        { name: 'tags', label: 'Technologies Used (comma-separated)', type: 'text' }
    ]},
    'projects': { title: 'Project Details', fields: [ 
        { name: 'title', label: 'Project Title', type: 'text' },
        { name: 'titleLink', label: 'Project URL', type: 'text' },
        { name: 'subtitle', label: 'Role/Position', type: 'text' },
        { name: 'duration', label: 'Duration', type: 'text' },
        { name: 'location', label: 'Location/Context', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
        { name: 'bullets', label: 'Bullet Points (one per line)', type: 'textarea', rows: 4 },
        { name: 'tags', label: 'Technologies Used (comma-separated)', type: 'text' }
    ]},
    'competitions': { title: 'Competition Details', fields: [ 
        { name: 'title', label: 'Competition Name', type: 'text' },
        { name: 'titleLink', label: 'Competition URL', type: 'text' },
        { name: 'subtitle', label: 'Achievement/Position', type: 'text' },
        { name: 'duration', label: 'Date/Duration', type: 'text' },
        { name: 'location', label: 'Location/Platform', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
        { name: 'bullets', label: 'Bullet Points (one per line)', type: 'textarea', rows: 4 },
        { name: 'tags', label: 'Technologies/Skills Used (comma-separated)', type: 'text' }
    ]},
    'skills': { title: 'Skills', custom: true }
};

// Function to update sectionConfigs with a new custom section
function updateConfigWithCustomSection(sectionKey, sectionTitle) {
    if (!sectionKey || !sectionTitle) {
        console.error("Invalid section key or title.");
        return;
    }

    // Add the new section to formData if it doesn't exist
    if (!formData[sectionKey]) {
        formData[sectionKey] = [];
    }

    // Add the new section to sectionCounter if it doesn't exist
    if (sectionCounter[sectionKey] === undefined) {
        sectionCounter[sectionKey] = 0;
    }

    // Add the new section to sectionConfigs with default fields
    sectionConfigs[sectionKey] = {
        title: sectionTitle,
        fields: [
            { name: 'title', label: `${sectionTitle} Title`, type: 'text' },
            {name: 'titleLink', label: 'Title URL', type: 'text'},
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'duration', label: 'Duration', type: 'text' },
            { name: 'location', label: 'Location', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
            { name: 'bullets', label: 'Bullet Points (one per line)', type: 'textarea', rows: 4 },
            { name: 'tags', label: 'Tags (comma-separated)', type: 'text' }
        ]
    };

    // Update the section order to include the new section
    if (!sectionOrder.includes(sectionKey)) {
        sectionOrder.push(sectionKey);
    }

    console.log(`Added new section type: ${sectionKey}`);
    console.log(sectionConfigs);
}

// Add a function to handle bullet point fields
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
    
    // Initialize width info if there's existing text
    if (existingText) {
        updateBulletWidthInfo(bulletItem.querySelector('.bullet-input'));
    }
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

// Function to remove a bullet point
function removeBullet(button) {
    const bulletItem = button.parentElement.parentElement;
    const sectionId = bulletItem.closest('.section-content').id.replace('content-', '');
    bulletItem.remove();
    updateFormData(sectionId);
    generateResume();
}

// Modify getFormContent to use individual bullet point fields instead of textarea
function getFormContent(type, sectionId, sectionTitle = "Custom Section") {
    // If the section type doesn't exist in the config, create it
    if (!sectionConfigs[type]) {
        updateConfigWithCustomSection(type, sectionTitle);
    }

    const config = sectionConfigs[type];

    // Handle the special case for skills
    if (config.custom) {
        // Skills section code remains the same
        return `
            <h3>Skills</h3>
            <div class="form-group">
                <label>Category</label>
                <input type="text" name="category" onchange="updateFormData('${sectionId}'); generateResume();">
            </div>
            <div class="skills-container" id="skills-${sectionId}">
                <div class="skill-item">
                    <input type="text" name="skill" placeholder="Enter skill" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
            </div>
            <button class="add-skill-btn" onclick="addSkillField('${sectionId}')">Add Skill</button>
        `;
    }

    // Generate form for standard sections
    let formContent = `<h3>${config.title}</h3>`;

    config.fields.forEach(field => {
        if (field.name === 'bullets') {
            // Replace textarea with container for individual bullet points
            formContent += `
                <div class="form-group">
                    <label>${field.label}</label>
                    <div class="bullets-container" id="bullets-${sectionId}">
                        <!-- Bullet points will be added here -->
                    </div>
                    <button type="button" class="add-bullet-btn" onclick="addBulletField('${sectionId}', document.getElementById('bullets-${sectionId}'))">Add Bullet Point</button>
                </div>
            `;
        } else if (field.type === 'textarea') {
            formContent += `
                <div class="form-group">
                    <label>${field.label}</label>
                    <textarea name="${field.name}" rows="${field.rows}" onchange="updateFormData('${sectionId}'); generateResume();"></textarea>
                </div>
            `;
        } else {
            formContent += `
                <div class="form-group">
                    <label>${field.label}</label>
                    <input type="${field.type}" name="${field.name}" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
            `;
        }
    });

    return formContent;
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

// Modify addSection function to include listeners for skills and personal sections
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
    makeGroupsDraggable();
    makeDraggable();
    generateResume(sectionOrder);

    // Add input event listeners for dynamic title updates
    const titleInput = form.querySelector('input[name="title"]');
    const schoolInput = form.querySelector('input[name="school"]');
    const categoryInput = form.querySelector('input[name="category"]');
    const nameInput = form.querySelector('input[name="name"]');

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
function removeSection(sectionId) {
    const section = document.getElementById(sectionId);
    const groupContainer = section.parentElement.parentElement; // Get the main group container
    const type = sectionId.split('-')[0]; // Get section type
    
    section.remove();
    
    // Remove from formData
    formData[type] = formData[type].filter(item => item.id !== sectionId);
    
    // Check if group content is empty
    const groupContent = groupContainer.querySelector('.group-content');
    if (groupContent && groupContent.querySelectorAll('.section-form').length === 0) {
        groupContainer.remove(); // Remove the entire group container
    }
    
    generateResume();
}

function updateFormData(sectionId) {
    const section = document.getElementById(sectionId);
    const [type] = sectionId.split('-');
    
    // Ensure the section type exists in formData
    if (!formData[type]) {
        formData[type] = [];
        console.warn(`Created missing formData section for ${type}`);
    }
    
    const data = {
        id: sectionId,
        fields: {}
    };
    
    // Process all inputs except bullets
    const inputs = section.querySelectorAll('input:not([name="bullet"]), textarea');
    inputs.forEach(input => {
        if (input.name === 'skill') {
            if (!data.fields.skills) data.fields.skills = [];
            if (input.value) data.fields.skills.push(input.value);
        } else {
            data.fields[input.name] = input.value;
            
            // Add debug log for summary field
            if (type === 'summary' && input.name === 'summary') {
                console.log("Captured summary text:", input.value);
            }
            
            // Update section title when relevant fields are changed
            if ((input.name === 'title' && (type === 'experience' || type === 'projects' || type === 'competitions')) ||
                (input.name === 'school' && type === 'education') ||
                (input.name === 'category' && type === 'skills') ||
                (input.name === 'name' && type === 'personal')) {
                updateSectionTitle(sectionId, type, input.value);
            }
        }
    });
    
    // Process bullet points separately
    const bulletInputs = section.querySelectorAll('input[name="bullet"]');
    if (bulletInputs.length > 0) {
        data.fields.bullets = Array.from(bulletInputs)
            .map(input => input.value)
            .filter(value => value.trim() !== '');
    }
    
    const existingIndex = formData[type].findIndex(item => item.id === sectionId);
    if (existingIndex !== -1) {
        formData[type][existingIndex] = data;
    } else {
        formData[type].push(data);
    }
}


// Add this at the end of the generateResume function
function updateAllBulletWidthInfo() {
    const bulletInputs = document.querySelectorAll('.bullet-input');
    bulletInputs.forEach(input => {
        updateBulletWidthInfo(input);
    });
}
 

// Modify generateResume to handle custom sections
function generateResume(order = sectionOrder) {
    order = getSectionOrder();

    const builder = new ResumeBuilder(currentConfig);
    
    // Create a dynamic content object based on the sectionOrder
    const content = {
        header: null,
        summary: ''  // Initialize summary as empty string
    };
    
    // Initialize section arrays based on sectionConfigs
    Object.keys(sectionConfigs).forEach(sectionKey => {
        if (sectionKey !== 'personal' && sectionKey !== 'skills' && sectionKey !== 'summary') {
            content[sectionKey] = [];
        }
    });
    
    // Initialize skills as an object
    content.skills = {};

    // Handle header (personal) section
    if (formData.personal && formData.personal.length > 0) {
        const personal = formData.personal[0].fields;
        content.header = {
            name: personal.name || '',
            contacts: [
                personal.email,
                personal.phone,
                personal.github,
                personal.linkedin
            ].filter(Boolean)
        };
    }

    // Handle summary section with safety checks
    if (formData.summary && formData.summary.length > 0) {
        const summaryData = formData.summary[0].fields;
        if (summaryData && summaryData.summary) {
            content.summary = summaryData.summary;
            console.log("Summary content set to:", content.summary);
        }
    }

    // Rest of your code remains the same...

    // Process all section types including custom ones
    Object.keys(formData).forEach(sectionType => {
        if (sectionType === 'personal' || sectionType === 'summary') return; // Already handled above
        
        if (sectionType === 'skills') {
            if (formData.skills.length > 0) {
                content.skills = formData.skills.reduce((acc, skillSection) => {
                    if (skillSection.fields.category && skillSection.fields.skills) {
                        acc[skillSection.fields.category] = skillSection.fields.skills;
                    }
                    return acc;
                }, {});
            }
            return;
        }
        
        if (sectionType === 'education') {
            if (formData.education.length > 0) {
                content.education = formData.education.map(edu => ({
                    school: edu.fields.school || '',
                    degree: edu.fields.degree || '',
                    duration: edu.fields.duration || '',
                    location: edu.fields.location || '',
                    gpa: edu.fields.gpa || '',
                    scoreType: edu.fields.scoreType || ''
                }));
            }
            return;
        }
        
        // Handle all other sections (standard and custom)
        if (formData[sectionType] && formData[sectionType].length > 0 && sectionType !== 'education') {
            content[sectionType] = formData[sectionType].map(item => ({
                title: item.fields.title || '',
                titleLink: item.fields.titleLink || '',
                subtitle: item.fields.subtitle || '',
                subtitleLink: item.fields.subtitleLink || '',
                duration: item.fields.duration || '',
                location: item.fields.location || '',
                description: item.fields.description || '',
                bullets: Array.isArray(item.fields.bullets) ? item.fields.bullets : 
                         (typeof item.fields.bullets === 'string' ? item.fields.bullets.split('\n').filter(b => b.trim() !== '') : []),
                tags: item.fields.tags ? (typeof item.fields.tags === 'string' ? 
                     item.fields.tags.split(',').map(tag => tag.trim()) : item.fields.tags) : []
            }));
        }
    });

    // Ensure all required properties exist in content to prevent jsPDF errors
    if (!content.summary) content.summary = '';
    if (!content.education) content.education = [];
    if (!content.experience) content.experience = [];
    if (!content.projects) content.projects = [];
    if (!content.competitions) content.competitions = [];
    
    // Check for any custom sections in sectionOrder and ensure they exist in content
    order.forEach(section => {
        if (!content[section] && section !== 'header' && section !== 'skills') {
            content[section] = [];
        }
    });

    try {
        // Render all content at once
        builder.renderContent(content, order);
        
        const dataUrl = builder.getDataUrl();
        
        // Create a modified URL with zoom and fit parameters
        const enhancedUrl = dataUrl + "#view=FitH&toolbar=0";
        
        // Set the iframe source
        const pdfPreview = document.getElementById('pdfPreview');
        pdfPreview.src = enhancedUrl;
        
        // Add a script to handle resizing after the PDF loads
        pdfPreview.onload = function() {
            // Create a resize observer to dynamically adjust the PDF view
            const resizeObserver = new ResizeObserver(entries => {
                try {
                    // Try to access the iframe and adjust its content
                    if (pdfPreview.contentWindow && pdfPreview.contentWindow.PDFViewerApplication) {
                        pdfPreview.contentWindow.PDFViewerApplication.pdfViewer.currentScaleValue = 'page-width';
                    }
                } catch (e) {
                    console.log("Cannot access PDF viewer application");
                }
            });
            
            // Observe the preview container for size changes
            resizeObserver.observe(document.querySelector('.preview-container'));
        };

        updateAllBulletWidthInfo();
    } catch (error) {
        console.error("Error generating resume:", error);
        alert("There was an error generating the resume. Please check the console for details.");
    }
    
    return builder;
}

function downloadPDF() {
    const builder = generateResume();
    builder.save('resume.pdf');
}




document.querySelector('.btn-btn').addEventListener('click', preview);
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('configModal');
    const span = document.getElementsByClassName('close')[0];
    
    span.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});




window.onload = function() {
    addSection('personal');
    addSection('education');
    addGeneralSection('EXPERIENCE');
    generateResume(sectionOrder);
};