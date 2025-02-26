// jsonVersion.js

const demoJSON = {
    "personal": [
      {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "phone": "+1 555-555-5555",
        "linkedin": "https://www.linkedin.com/in/john-doe/",
        "github": "https://github.com/johndoe"
      }
    ],
    "summary": [
      {
        "summary": "Dedicated software engineer with over 8 years of experience in full-stack development, focusing on building scalable web applications. Proven ability to design, develop, and deploy complex software solutions. Skilled in optimizing processes and implementing AI tools to streamline workflows. Passionate about writing clean, maintainable code and contributing to open-source projects."
      }
    ],
    "education": [
      {
        "school": "MIT",
        "degree": "B.Sc in Computer Science",
        "duration": "September 2012 - June 2016",
        "location": "Cambridge, MA, USA",
        "scoreType": "GPA",
        "gpa": "3.75/4"
      },
      {
        "school": "Stanford University",
        "degree": "M.Sc in Software Engineering",
        "duration": "September 2016 - June 2018",
        "location": "Stanford, CA, USA",
        "scoreType": "GPA",
        "gpa": "3.9/4"
      }
    ],
    "experience": [
      {
        "title": "TechCorp Solutions",
        "titleLink": "https://techcorpsolutions.com",
        "subtitle": "Software Engineer",
        "duration": "July 2018 - Present",
        "location": "San Francisco, CA, USA",
        "bullets": [
          "Led the development of a cloud-based SaaS platform, increasing customer retention by 40%.",
          "Worked closely with cross-functional teams to design and implement new product features.",
          "Introduced Agile methodologies to the development team, improving productivity by 25%.",
          "Built and maintained RESTful APIs for mobile and web applications.",
          "Collaborated with DevOps to automate deployment pipelines, reducing deployment time by 50%."
        ],
        "tags": [
          "Full-Stack Development",
          "Cloud Computing",
          "Agile Methodologies",
          "API Development",
          "DevOps",
          "Performance Optimization"
        ]
      },
      {
        "title": "CodeForge Technologies",
        "titleLink": "https://codeforge.com",
        "subtitle": "Junior Software Developer",
        "duration": "June 2016 - June 2018",
        "location": "New York, NY, USA",
        "bullets": [
          "Developed and maintained several web applications, increasing user engagement by 20%.",
          "Participated in the design and implementation of features for e-commerce platforms.",
          "Contributed to the backend development of high-traffic websites using Java and Spring Boot.",
          "Collaborated with QA engineers to write unit tests and ensure code quality.",
          "Improved codebase by refactoring legacy code and introducing design patterns."
        ],
        "tags": [
          "Web Development",
          "Java",
          "Spring Boot",
          "Unit Testing",
          "E-commerce",
          "Backend Development"
        ]
      }
    ],
    "projects": [
      {
        "title": "AI-Powered Code Review Tool",
        "titleLink": "",
        "subtitle": "Lead Developer",
        "duration": "2022",
        "location": "San Francisco, CA, USA",
        "bullets": [
          "Developed an AI-based code review tool using machine learning algorithms to identify bugs and suggest optimizations.",
          "Integrated the tool into the CI/CD pipeline to automate the review process and reduce human errors."
        ],
        "tags": [
          "AI Tools",
          "Machine Learning",
          "Code Optimization",
          "CI/CD Integration"
        ]
      },
      {
        "title": "Project Management Dashboard",
        "titleLink": "",
        "subtitle": "Frontend Developer",
        "duration": "2021",
        "location": "New York, NY, USA",
        "bullets": [
          "Designed and implemented a project management dashboard to track team performance and project milestones.",
          "Utilized React and Redux for building dynamic and interactive user interfaces."
        ],
        "tags": [
          "React",
          "Frontend Development",
          "Project Management Tools"
        ]
      }
    ],
    "skills": [
      {
        "category": "Software Development",
        "skills": [
          "Full-Stack Development",
          "Cloud Computing",
          "API Development",
          "Agile Methodologies",
          "Machine Learning"
        ]
      },
      {
        "category": "Technical Skills",
        "skills": [
          "JavaScript",
          "Python",
          "Java",
          "React",
          "Node.js",
          "SQL",
          "AWS",
          "Docker"
        ]
      },
      {
        "category": "Languages",
        "skills": [
          "English",
          "Spanish"
        ]
      }
    ],
    "publications": [
      {
        "title": "Building Scalable Systems with Cloud Computing",
        "titleLink": "https://cloudcomputingpublication.com",
        "subtitle": "Author",
        "duration": "2020",
        "location": "USA",
        "bullets": [
          "Wrote a comprehensive guide on building scalable systems using cloud technologies.",
          "Discussed best practices for managing cloud resources and optimizing for cost and performance."
        ],
        "tags": [
          "Cloud Computing",
          "Scalability",
          "System Design"
        ]
      }
    ]
}

// Helper function to detect and register custom sections
function detectCustomSections() {
    // Look through the JSON for sections that might not be in the default config
    const standardSections = ['personal', 'summary', 'education', 'experience', 'projects', 'competitions', 'skills'];
    
    // Find custom sections in the demo JSON
    const customSections = Object.keys(demoJSON).filter(key => !standardSections.includes(key));
    
    // Register each custom section
    customSections.forEach(sectionKey => {
        // Format section name for display (capitalize first letter)
        const sectionTitle = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
        
        // Check if we need to add to sectionCounter
        if (typeof sectionCounter !== 'undefined' && sectionCounter[sectionKey] === undefined) {
            sectionCounter[sectionKey] = 0;
        }
        
        // Check if we need to add to formData
        if (typeof formData !== 'undefined' && formData[sectionKey] === undefined) {
            formData[sectionKey] = [];
        }
        
        // Register the custom section in the config
        if (typeof updateConfigWithCustomSection === 'function') {
            updateConfigWithCustomSection(sectionKey, sectionTitle);
        } else {
            console.warn('updateConfigWithCustomSection function not found');
        }
        
        // Add button for the custom section if it doesn't exist
        createSectionButton(sectionKey, sectionTitle);
    });
    
    return customSections;
}

// Function to create buttons for custom sections
function createSectionButton(sectionKey, sectionTitle) {
    // Check if button already exists
    const existingButton = document.querySelector(`.add-btn[data-section="${sectionKey}"]`);
    if (existingButton) {
        return; // Don't create duplicates
    }
    
    // Create a new button and add it to the sidebar
    const sidebar = document.querySelector(".action-buttons");
    if (sidebar) {
        const newButton = document.createElement("button");
        newButton.className = "add-btn";
        newButton.setAttribute('data-section', sectionKey); // Mark with section type
        newButton.textContent = `Add ${sectionTitle}`;
        newButton.onclick = function() {
            if (typeof addSection === 'function') {
                addSection(sectionKey);
            } else {
                console.warn('addSection function not found');
            }
        };
        
        sidebar.appendChild(newButton);
    } else {
        console.warn('Sidebar element not found');
    }
}

// Function to clear all existing data before loading demo
function clearAllData() {
    // Get form container element and check if it exists
    const formContainer = document.getElementById('formContainer');
    if (formContainer) {
        formContainer.innerHTML = '';
    } else {
        console.warn('Form container element not found');
    }
    
    // Clear resume preview if it exists
    const resumeElement = document.getElementById('resume');
    if (resumeElement) {
        resumeElement.innerHTML = '';
    } else {
        console.warn('Resume element not found');
    }
    
    // Get all section types from the JSON
    const allSectionTypes = Object.keys(demoJSON);
    
    // Clear formData object
    if (typeof formData !== 'undefined') {
        // Reset formData with all section types
        formData = {
            personal: [],
            education: [],
            experience: [],
            projects: [],
            competitions: [],
            skills: []
        };
        
        // Add custom section types from JSON
        allSectionTypes.forEach(type => {
            if (!formData[type]) {
                formData[type] = [];
            }
        });
    } else {
        console.warn('formData variable not defined yet');
    }
    
    // Reset section counters
    if (typeof sectionCounter !== 'undefined') {
        sectionCounter = {
            personal: 0,
            education: 0,
            experience: 0,
            projects: 0,
            skills: 0,
            competitions: 0
        };
        
        // Add custom section types from JSON
        allSectionTypes.forEach(type => {
            if (!sectionCounter[type]) {
                sectionCounter[type] = 0;
            }
        });
    } else {
        console.warn('sectionCounter variable not defined yet');
    }
}

function populateSection(sectionType, sectionData) {
    if (!sectionData || !Array.isArray(sectionData) || sectionData.length === 0) {
        return;
    }

    sectionData.forEach(itemData => {
        addSection(sectionType);
        const sectionId = `${sectionType}-${sectionCounter[sectionType] - 1}`;
        const section = document.getElementById(sectionId);
        
        if (section) {
            Object.entries(itemData).forEach(([key, value]) => {
                if (key === 'bullets') {
                    // Find the bullets container
                    const bulletsContainer = section.querySelector(`#bullets-${sectionId}`);
                    if (bulletsContainer) {
                        // Clear any default bullet points
                        bulletsContainer.innerHTML = '';
                        
                        // Add each bullet point as a separate field
                        value.forEach(bulletText => {
                            addBulletField(sectionId, bulletsContainer, bulletText);
                        });
                    }
                } else if (key === 'tags') {
                    const input = section.querySelector('input[name="tags"]');
                    if (input) {
                        input.value = Array.isArray(value) ? value.join(', ') : value;
                    }
                } else if (key === 'skills') {
                    // Handle skills array for skills section
                    const skillsContainer = section.querySelector('.skills-container');
                    if (skillsContainer) {
                        value.forEach((skill, index) => {
                            if (index === 0) {
                                const firstSkillInput = skillsContainer.querySelector('input[name="skill"]');
                                if (firstSkillInput) {
                                    firstSkillInput.value = skill;
                                }
                            } else {
                                addSkillField(sectionId);
                                const inputs = skillsContainer.querySelectorAll('input[name="skill"]');
                                inputs[inputs.length - 1].value = skill;
                            }
                        });
                    }
                } else if (key === 'summary' && sectionType === 'summary') {
                    // Special handling for summary text
                    const textarea = section.querySelector('textarea[name="summary"]');
                    if (textarea) {
                        textarea.value = value;
                    }
                } else {
                    const input = section.querySelector(`input[name="${key}"]`);
                    const textarea = section.querySelector(`textarea[name="${key}"]`);
                    if (input) {
                        input.value = value;
                    } else if (textarea) {
                        textarea.value = value;
                    }
                }
            });
            updateFormData(sectionId);
            
            // Update section title
            let titleField = null;
            if (sectionType === 'education') {
                titleField = section.querySelector('input[name="school"]');
            } else if (sectionType === 'skills') {
                titleField = section.querySelector('input[name="category"]');
            } else if (sectionType === 'personal') {
                titleField = section.querySelector('input[name="name"]');
            } else if (sectionType === 'summary') {
                titleField = { value: 'Professional Summary' }; // Static title for summary
            } else {
                titleField = section.querySelector('input[name="title"]');
            }
            
            if (titleField && titleField.value) {
                updateSectionTitle(sectionId, sectionType, titleField.value);
            }
        }
    });
}


function populateFromDemoJSON() {
    try {
        // First, detect and register any custom sections from the JSON
        const customSections = detectCustomSections();
        console.log('Detected custom sections:', customSections);
        
        // Update section order to include custom sections
        if (typeof sectionOrder !== 'undefined') {
            customSections.forEach(section => {
                if (!sectionOrder.includes(section)) {
                    sectionOrder.push(section);
                }
            });
            console.log('Updated section order:', sectionOrder);
        }
        
        // Populate all sections using our helper function
        Object.entries(demoJSON).forEach(([sectionType, sectionData]) => {
            if (sectionType !== 'skills') { // Skills needs special handling
                populateSection(sectionType, sectionData);
            }
        });
        
        // Special handling for Skills section
        if (demoJSON.skills && Array.isArray(demoJSON.skills)) {
            demoJSON.skills.forEach(skillCategory => {
                addSection('skills');
                const sectionId = `skills-${sectionCounter.skills - 1}`;
                const section = document.getElementById(sectionId);
                
                if (section) {
                    // Set category
                    const categoryInput = section.querySelector('input[name="category"]');
                    if (categoryInput) {
                        categoryInput.value = skillCategory.category;
                    }

                    // Add skills
                    const skillsContainer = section.querySelector('.skills-container');
                    if (skillsContainer) {
                        skillCategory.skills.forEach((skill, index) => {
                            if (index === 0) {
                                // Use existing first skill input
                                const firstSkillInput = skillsContainer.querySelector('input[name="skill"]');
                                if (firstSkillInput) {
                                    firstSkillInput.value = skill;
                                }
                            } else {
                                // Add new skill input for remaining skills
                                addSkillField(sectionId);
                                const inputs = skillsContainer.querySelectorAll('input[name="skill"]');
                                inputs[inputs.length - 1].value = skill;
                            }
                        });
                    }
                    updateFormData(sectionId);
                }
            });
        }

        // Generate resume preview
        console.log('Demo data loaded', sectionOrder);
        if (typeof generateResume === 'function' && typeof sectionOrder !== 'undefined') {
            generateResume(sectionOrder);
        } else {
            console.warn('generateResume function or sectionOrder not found');
        }
    } catch (error) {
        console.error('Error loading demo data:', error);
    }
}

// Function to load demo data
function loadDemoData() {
    try {
        // Clear any existing data before loading demo
        clearAllData();
        
        // Populate with demo data
        populateFromDemoJSON();
    } catch (error) {
        console.error('Error in loadDemoData:', error);
    }
}

window.onload = function() {
    try {
        // Make sure we're not referencing any undefined variables or functions
        if (typeof loadDemoData === 'function') {
            loadDemoData();
        } else {
            console.error('loadDemoData function not defined');
        }
        
        // Initialize all sections as collapsed if the function exists
        if (typeof initializeCollapsedGroups === 'function') {
            initializeCollapsedGroups();
        } else {
            console.warn('initializeCollapsedGroups function not found');
        }
    } catch (error) {
        console.error('Error in window.onload:', error);
    }
};