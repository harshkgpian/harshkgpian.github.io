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


// Add currentConfig at the top with other global variables

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
                <div class="form-group">
                    <label>Technologies Used (comma-separated)</label>
                    <input type="text" name="tags" onchange="updateFormData('${sectionId}'); generateResume();">
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
            bullets: comp.fields.bullets || [],
            tags: comp.fields.tags ? comp.fields.tags.split(',').map(tag => tag.trim()) : []

        }));
    }

    // Render all content at once
    builder.renderContent(content, order);

    const dataUrl = builder.getDataUrl();
    document.getElementById('pdfPreview').src = dataUrl;
    return builder;
}
function downloadPDF() {
    const builder = generateResume();
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