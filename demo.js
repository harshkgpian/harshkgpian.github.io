// Update sectionCounter and formData
let sectionCounter = {
    personal: 0,
    education: 0,
    experience: 0,
    projects: 0,
    competitions: 0,
    skills: 0,
    general: 0,  // For any other custom sections
};

const formData = {
    personal: [],
    education: [],
    experience: [],
    projects: [],
    competitions: [],
    skills: [],
    general: []  // For any other custom sections
};

let sectionOrder = ['header', 'education', 'experience', 'projects', 'competitions', 'skills'];

const RESUME_CONFIG = {
    page: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        margins: {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15
        }
    },
    fonts: {
        header: {
            style: 'times',
            weight: 'bold',
            size: 20,
            color: '#000000'
        },
        sectionHeader: {
            style: 'times',
            weight: 'bold',
            size: 12,
            color: '#000000'
        },
        normal: {
            style: 'times',
            weight: 'normal',
            size: 11,
            color: '#000000'
        },
        small: {
            style: 'times',
            weight: 'normal',
            size: 9,
            color: '#000000'
        }
    },
    spacing: {
        sectionGap: 3,
        headerGap: 2,
        lineGap: 5,
        paragraphGap: 2,
        indentation: 2
    },
    formatting: {
        textAlign: {
            header: 'center',
            section: 'left'
        },
        maxLineWidth: 180,
        dateAlignment: 'right',
        bulletStyle: '-'
    },
    divider: {
        style: 'line',
        color: '#000000',
        width: 0.2,
        spacing: 3
    },
    sections: {
        header: {
            spacing: 5,
            contactSeparator: ' | ',
            icons: {
                size: 3,
                spacing: 1,
                contactSpacing: 2,
                verticalOffset: 0.75,
                urls: {
                    email: "https://cdn-icons-png.flaticon.com/128/712/712040.png",
                    phone: "https://cdn-icons-png.flaticon.com/128/25/25377.png",
                    linkedin: "https://cdn-icons-png.flaticon.com/128/61/61109.png",
                    github: "https://cdn-icons-png.flaticon.com/128/733/733609.png"
                }
            }
        },
        experience: {
            companyStyle: 'bold',
            dateStyle: 'bold',
            locationStyle: 'italic'
        },
        education: {
            schoolStyle: 'bold',
            dateStyle: 'normal',
            locationStyle: 'italic',
            showGPA: true,
            showHonors: false
        }
    },
    limits: {
        maxBulletPoints: 6
    }
};
// Add currentConfig at the top with other global variables
let currentConfig = RESUME_CONFIG;

let dragSrcEl = null;

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
let dragSrcGroup = null;
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

function getFormContent(type, sectionId) {
    let formContent = '';
    
    switch(type) {
        case 'personal':
            formContent = `
                <h3>Personal Information</h3>
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" name="location" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>GitHub</label>
                    <input type="text" name="github" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>LinkedIn</label>
                    <input type="text" name="linkedin" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
            `;
            break;
            
        case 'education':
            formContent = `
                <h3>Education</h3>
                <div class="form-group">
                    <label>School/University</label>
                    <input type="text" name="school" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" name="degree" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" name="duration" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" name="location" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>GPA</label>
                    <input type="text" name="gpa" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
            `;
            break;
            
        case 'experience':
            formContent = `
                <h3>Work Experience</h3>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" name="title" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Position</label>
                    <input type="text" name="subtitle" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" name="duration" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" name="location" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Bullet Points (one per line)</label>
                    <textarea name="bullets" rows="4" onchange="updateFormData('${sectionId}'); generateResume();"></textarea>
                </div>
                <div class="form-group">
                    <label>Technologies Used (comma-separated)</label>
                    <input type="text" name="tags" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
            `;
            break;
        
        case 'projects':
            formContent = `
                <h3>Project Details</h3>
                <div class="form-group">
                    <label>Project Title</label>
                    <input type="text" name="title" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Role/Position</label>
                    <input type="text" name="subtitle" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" name="duration" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Location/Context</label>
                    <input type="text" name="location" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="2" onchange="updateFormData('${sectionId}'); generateResume();"></textarea>
                </div>
                <div class="form-group">
                    <label>Bullet Points (one per line)</label>
                    <textarea name="bullets" rows="4" onchange="updateFormData('${sectionId}'); generateResume();"></textarea>
                </div>
                <div class="form-group">
                    <label>Technologies Used (comma-separated)</label>
                    <input type="text" name="tags" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
            `;
            break;

        case 'competitions':
            formContent = `
                <h3>Competition Details</h3>
                <div class="form-group">
                    <label>Competition Name</label>
                    <input type="text" name="title" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Position/Achievement</label>
                    <input type="text" name="subtitle" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Date/Duration</label>
                    <input type="text" name="duration" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" name="location" onchange="updateFormData('${sectionId}'); generateResume();">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="2" onchange="updateFormData('${sectionId}'); generateResume();"></textarea>
                </div>
                <div class="form-group">
                    <label>Achievements (one per line)</label>
                    <textarea name="bullets" rows="4" onchange="updateFormData('${sectionId}'); generateResume();"></textarea>
                </div>
            `;
            break;
        case 'skills':
            formContent = `
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
            break;
        }
        
        return formContent;
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

function removeSection(sectionId) {
    const section = document.getElementById(sectionId);
    const groupContainer = section.parentElement;
    section.remove();
    
    // Remove from formData
    const [type] = sectionId.split('-');
    formData[type] = formData[type].filter(item => item.id !== sectionId);
    
    // Remove group container if empty
    if (groupContainer.querySelectorAll('.section-form').length === 0) {
        groupContainer.remove();
    }
    
    generateResume();
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
    
    let groupContainer = document.querySelector(`.${type}-group`);
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

// Modify updateFormData to include skills category and personal name updates
function updateFormData(sectionId) {
    const section = document.getElementById(sectionId);
    const [type] = sectionId.split('-');
    
    const data = {
        id: sectionId,
        fields: {}
    };
    
    const inputs = section.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.name === 'skill') {
            if (!data.fields.skills) data.fields.skills = [];
            if (input.value) data.fields.skills.push(input.value);
        } else if (input.name === 'bullets') {
            data.fields.bullets = input.value.split('\n').filter(bullet => bullet.trim() !== '');
        } else {
            data.fields[input.name] = input.value;
            
            // Update section title when relevant fields are changed
            if ((input.name === 'title' && (type === 'experience' || type === 'projects' || type === 'competitions')) ||
                (input.name === 'school' && type === 'education') ||
                (input.name === 'category' && type === 'skills') ||
                (input.name === 'name' && type === 'personal')) {
                updateSectionTitle(sectionId, type, input.value);
            }
        }
    });
    
    const existingIndex = formData[type].findIndex(item => item.id === sectionId);
    if (existingIndex !== -1) {
        formData[type][existingIndex] = data;
    } else {
        formData[type].push(data);
    }
}


function openConfigModal() {
    const modal = document.getElementById('configModal');
    modal.style.display = 'block';
    
    // Load current configuration
    loadCurrentConfig();
}

function loadCurrentConfig() {

    
    // Font Settings
    document.getElementById('headerFont').value = currentConfig.fonts.header.style;
    document.getElementById('headerSize').value = currentConfig.fonts.header.size;
    document.getElementById('headerColor').value = currentConfig.fonts.header.color;
    
    document.getElementById('sectionHeaderFont').value = currentConfig.fonts.sectionHeader.style;
    document.getElementById('sectionHeaderSize').value = currentConfig.fonts.sectionHeader.size;
    document.getElementById('sectionHeaderColor').value = currentConfig.fonts.sectionHeader.color;
    
    document.getElementById('normalFont').value = currentConfig.fonts.normal.style;
    document.getElementById('normalSize').value = currentConfig.fonts.normal.size;
    document.getElementById('normalColor').value = currentConfig.fonts.normal.color;
    
    document.getElementById('smallFont').value = currentConfig.fonts.small.style;
    document.getElementById('smallSize').value = currentConfig.fonts.small.size;
    document.getElementById('smallColor').value = currentConfig.fonts.small.color;
    
    // Spacing Settings
    document.getElementById('sectionGap').value = currentConfig.spacing.sectionGap;
    document.getElementById('headerGap').value = currentConfig.spacing.headerGap;
    document.getElementById('lineGap').value = currentConfig.spacing.lineGap;
    document.getElementById('paragraphGap').value = currentConfig.spacing.paragraphGap;
    document.getElementById('indentation').value = currentConfig.spacing.indentation;
    
    // Formatting Settings
    document.getElementById('headerAlign').value = currentConfig.formatting.textAlign.header;
    document.getElementById('sectionAlign').value = currentConfig.formatting.textAlign.section;
    document.getElementById('bulletStyle').value = currentConfig.formatting.bulletStyle;
    
    // Divider Settings
    document.getElementById('dividerStyle').value = currentConfig.divider.style;
    document.getElementById('dividerColor').value = currentConfig.divider.color;
    document.getElementById('dividerWidth').value = currentConfig.divider.width;
    document.getElementById('iconSize').value = currentConfig.sections.header.icons.size;
    document.getElementById('iconSpacing').value = currentConfig.sections.header.icons.spacing;
    document.getElementById('contactSpacing').value = currentConfig.sections.header.icons.contactSpacing;
    document.getElementById('iconVerticalOffset').value = currentConfig.sections.header.icons.verticalOffset;
    document.getElementById('emailIconUrl').value = currentConfig.sections.header.icons.urls.email;
    document.getElementById('phoneIconUrl').value = currentConfig.sections.header.icons.urls.phone;
    document.getElementById('linkedinIconUrl').value = currentConfig.sections.header.icons.urls.linkedin;
    document.getElementById('githubIconUrl').value = currentConfig.sections.header.icons.urls.github;
}

function saveConfig() {
    currentConfig = {
        page: {
            unit: 'mm',
            format: document.getElementById('pageFormat').value,
            orientation: 'portrait',
            margins: {
                top: 15,
                right: 15,
                bottom: 15,
                left: 15
            }
        },
        fonts: {
            header: {
                style: document.getElementById('headerFont').value,
                weight: 'bold',
                size: Number(document.getElementById('headerSize').value),
                color: document.getElementById('headerColor').value
            },
            sectionHeader: {
                style: document.getElementById('sectionHeaderFont').value,
                weight: 'bold',
                size: Number(document.getElementById('sectionHeaderSize').value),
                color: document.getElementById('sectionHeaderColor').value
            },
            normal: {
                style: document.getElementById('normalFont').value,
                weight: 'normal',
                size: Number(document.getElementById('normalSize').value),
                color: document.getElementById('normalColor').value
            },
            small: {
                style: document.getElementById('smallFont').value,
                weight: 'normal',
                size: Number(document.getElementById('smallSize').value),
                color: document.getElementById('smallColor').value
            }
        },
        spacing: {
            sectionGap: Number(document.getElementById('sectionGap').value),
            headerGap: Number(document.getElementById('headerGap').value),
            lineGap: Number(document.getElementById('lineGap').value),
            paragraphGap: Number(document.getElementById('paragraphGap').value),
            indentation: Number(document.getElementById('indentation').value)
        },
        formatting: {
            textAlign: {
                header: document.getElementById('headerAlign').value,
                section: document.getElementById('sectionAlign').value
            },
            maxLineWidth: 180,
            dateAlignment: 'right',
            bulletStyle: document.getElementById('bulletStyle').value
        },
        divider: {
            style: document.getElementById('dividerStyle').value,
            color: document.getElementById('dividerColor').value,
            width: Number(document.getElementById('dividerWidth').value),
            spacing: 3
        },
        sections: {
            header: {
                spacing: 5,
                contactSeparator: ' | ',
                icons: {
                    size: Number(document.getElementById('iconSize').value),
                    spacing: Number(document.getElementById('iconSpacing').value),
                    contactSpacing: Number(document.getElementById('contactSpacing').value),
                    verticalOffset: Number(document.getElementById('iconVerticalOffset').value),
                    urls: {
                        email: document.getElementById('emailIconUrl').value,
                        phone: document.getElementById('phoneIconUrl').value,
                        linkedin: document.getElementById('linkedinIconUrl').value,
                        github: document.getElementById('githubIconUrl').value
                    }
                }
            },
            experience: {
                companyStyle: 'bold',
                dateStyle: 'bold',
                locationStyle: 'italic'
            },
            education: {
                schoolStyle: 'bold',
                dateStyle: 'times',
                locationStyle: 'italic',
                showGPA: true,
                showHonors: false
            }
        },
        limits: {
            maxBulletPoints: 6
        }
    };

    // Close modal
    document.getElementById('configModal').style.display = 'none';
    
    // Regenerate resume with new configuration
    generateResume();
}

function generateResume(order = sectionOrder) {
    const builder = new ResumeBuilder(currentConfig);
    
    const content = {
        header: null,
        education: [],
        experience: [],    // Add these arrays
        projects: [],      // to the content object
        competitions: [],
        skills: {},

    };

    // Handle header (personal) section
    if (formData.personal.length > 0) {
        const personal = formData.personal[0].fields;
        content.header = {
            name: personal.name || '',
            contacts: [
                personal.email,
                personal.phone,
                personal.location,
                personal.github,
                personal.linkedin
            ].filter(Boolean)
        };
    }

    // Handle education section
    if (formData.education.length > 0) {
        content.education = formData.education.map(edu => ({
            school: edu.fields.school || '',
            degree: edu.fields.degree || '',
            duration: edu.fields.duration || '',
            location: edu.fields.location || '',
            gpa: edu.fields.gpa || ''
        }));
    }

    // Handle skills section
    if (formData.skills.length > 0) {
        content.skills = formData.skills.reduce((acc, skillSection) => {
            if (skillSection.fields.category && skillSection.fields.skills) {
                acc[skillSection.fields.category] = skillSection.fields.skills;
            }
            return acc;
        }, {});
    }

    // Add experience to content object
    if (formData.experience.length > 0) {
        content.experience = formData.experience.map(exp => ({
            title: exp.fields.title || '',
            subtitle: exp.fields.subtitle || '',
            duration: exp.fields.duration || '',
            location: exp.fields.location || '',
            description: exp.fields.description || '',
            bullets: exp.fields.bullets || [],
            tags: exp.fields.tags ? exp.fields.tags.split(',').map(tag => tag.trim()) : []
        }));
    }

    // Add projects to content object
    if (formData.projects.length > 0) {
        content.projects = formData.projects.map(proj => ({
            title: proj.fields.title || '',
            subtitle: proj.fields.subtitle || '',
            duration: proj.fields.duration || '',
            location: proj.fields.location || '',
            description: proj.fields.description || '',
            bullets: proj.fields.bullets || [],
            tags: proj.fields.tags ? proj.fields.tags.split(',').map(tag => tag.trim()) : []
        }));
    }

    // Add competitions to content object
    if (formData.competitions.length > 0) {
        content.competitions = formData.competitions.map(comp => ({
            title: comp.fields.title || '',
            subtitle: comp.fields.subtitle || '',
            duration: comp.fields.duration || '',
            location: comp.fields.location || '',
            description: comp.fields.description || '',
            bullets: comp.fields.bullets || []
        }));
    }

    // Render all content at once
    builder.renderContent(content, order);

    const dataUrl = builder.getDataUrl();
    document.getElementById('pdfPreview').src = dataUrl;
}
function downloadPDF(order = sectionOrder) {
    const builder = new ResumeBuilder(currentConfig);
    
    const content = {
        header: null,
        education: [],
        experience: [],    // Add these arrays
        projects: [],      // to the content object
        competitions: [],
        skills: {},

    };

    // Handle header (personal) section
    if (formData.personal.length > 0) {
        const personal = formData.personal[0].fields;
        content.header = {
            name: personal.name || '',
            contacts: [
                personal.email,
                personal.phone,
                personal.location,
                personal.github,
                personal.linkedin
            ].filter(Boolean)
        };
    }

    // Handle education section
    if (formData.education.length > 0) {
        content.education = formData.education.map(edu => ({
            school: edu.fields.school || '',
            degree: edu.fields.degree || '',
            duration: edu.fields.duration || '',
            location: edu.fields.location || '',
            gpa: edu.fields.gpa || ''
        }));
    }

    // Handle skills section
    if (formData.skills.length > 0) {
        content.skills = formData.skills.reduce((acc, skillSection) => {
            if (skillSection.fields.category && skillSection.fields.skills) {
                acc[skillSection.fields.category] = skillSection.fields.skills;
            }
            return acc;
        }, {});
    }

    // Add experience to content object
    if (formData.experience.length > 0) {
        content.experience = formData.experience.map(exp => ({
            title: exp.fields.title || '',
            subtitle: exp.fields.subtitle || '',
            duration: exp.fields.duration || '',
            location: exp.fields.location || '',
            description: exp.fields.description || '',
            bullets: exp.fields.bullets || [],
            tags: exp.fields.tags ? exp.fields.tags.split(',').map(tag => tag.trim()) : []
        }));
    }

    // Add projects to content object
    if (formData.projects.length > 0) {
        content.projects = formData.projects.map(proj => ({
            title: proj.fields.title || '',
            subtitle: proj.fields.subtitle || '',
            duration: proj.fields.duration || '',
            location: proj.fields.location || '',
            description: proj.fields.description || '',
            bullets: proj.fields.bullets || [],
            tags: proj.fields.tags ? proj.fields.tags.split(',').map(tag => tag.trim()) : []
        }));
    }

    // Add competitions to content object
    if (formData.competitions.length > 0) {
        content.competitions = formData.competitions.map(comp => ({
            title: comp.fields.title || '',
            subtitle: comp.fields.subtitle || '',
            duration: comp.fields.duration || '',
            location: comp.fields.location || '',
            description: comp.fields.description || '',
            bullets: comp.fields.bullets || []
        }));
    }

    // Render all content at once
    builder.renderContent(content, order);
    builder.save('resume.pdf');
}
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