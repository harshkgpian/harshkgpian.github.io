// jsonVersion.js

const demoJSON = {
  "personal": [
    {
    "name": "Aniket Shah",
    "email": "aniketshah1994@gmail.com",
    "phone": "+91 7016522535",
    "linkedin": "https://www.linkedin.com/in/aniket-shah-506a50166/",
    }
    ],
    "summary": [
        {
          "summary": "Results-driven HR professional and entrepreneur with over 7 years of experience in human resources management and business leadership. Founded and scaled SOPify to 1 Cr annual revenue, demonstrating strong business acumen and team management skills. Proven track record in talent acquisition, employee engagement, and implementing HR technologies. SHRM-SCP and SPHR certified with expertise in strategic HR planning and digital transformation."
        }
    ],
  "education": [
    {
      "school": "NMIMS Mumbai",
      "degree": "MBA - HR",
      "duration": "June 2018 - March 2020",
      "location": "",
      "scoreType": "GPA",
      "gpa": "3.08/4"
    },
    {
      "school": "R.T.U",
      "degree": "B.Tech in Civil Engineering",
      "duration": "July 2012 - August 2016",
      "location": "",
      "scoreType": "Percentage",
      "gpa": "63.1%"
    }
  ],
  "experience": [
    {
      "title": "SOPify",
      "titleLink": "",
      "subtitle": "Founder",
      "duration": "December 2021 - Present",
      "location": "Pune (open to Relocate)",
      "bullets": [
        "Built and managed a team of 28, including 22 freelance writers, implementing an asset-light model that minimized costs while ensuring quality.",
        "Developed and executed a comprehensive social media strategy, enhancing visibility across multiple platforms.",
        "Integrated AI-driven tools like WhatsApp automation and custom GPTs for Statement of Purpose writing, improving service efficiency.",
        "Created a fully online, asset-light business model with rigorous quality assurance, maximizing profitability and scalability.",
        "Steered the company to achieve annual revenue of 1 Cr with profit margins reaching 60% through strategic initiatives.",
        "Secured partnerships with industry leaders in educational consulting through effective business development strategies."
      ],
      "tags": [
        "AI Tools",
        "Automation",
        "Social Media Strategy",
        "Content Management",
        "Business Development"
      ]
    },
    {
      "title": "Welspun",
      "titleLink": "",
      "subtitle": "Assistant Manager",
      "duration": "August 2020 - November 2021",
      "location": "",
      "bullets": [
        "Managed end-to-end Human Resources Activity for a diverse staff of 550 employees across multiple functions.",
        "Identified critical positions and created a robust pool of internal/external candidates based on key competencies.",
        "Managed end-to-end training schedules, ensuring strict adherence to the monthly training and development calendar.",
        "Handled recruitment from Junior to GM level, overseeing sourcing, interviewing, shortlisting, joining, and onboarding.",
        "Conducted Employee Engagement surveys and organized impactful activities such as outbound training and health challenges.",
        "Digitalized job descriptions to create a comprehensive digital library for assessment and development centers resources."
      ],
      "tags": [
        "HR Management",
        "Talent Acquisition",
        "Employee Engagement",
        "Training and Development",
        "Succession Planning"
      ]
    },
    {
      "title": "StoneCraft Developers",
      "titleLink": "",
      "subtitle": "Project Manager",
      "duration": "August 2016 - February 2018",
      "location": "",
      "bullets": [
        "Managed end-to-end construction activities, ensuring material quality through rigorous random quality checks conducted.",
        "Oversaw sales activities by actively engaging with potential clients to significantly drive overall business growth."
      ],
      "tags": [
        "Project Management",
        "Construction Management",
        "Quality Assurance"
      ]
    }
  ],
  "projects": [
    {
      "title": "Managerial Effectiveness Survey",
      "titleLink": "",
      "subtitle": "Creator & Implementer",
      "duration": "",
      "location": "",
      "bullets": [
        "Designed and implemented a comprehensive plant-wide employee sentiment survey to enhance engagement.",
        "Analyzed employee engagement data to develop actionable culture improvement recommendations effectively.",
        "Created a strategic communication plan with engaging road shows and town halls to drive meaningful change."
      ],
      "tags": [
        "Employee Engagement",
        "Data Analysis",
        "Strategic Communication"
      ]
    },
    {
      "title": "GET Attrition Intervention",
      "titleLink": "",
      "subtitle": "Lead Analyst",
      "duration": "",
      "location": "",
      "bullets": [
        "Conducted structured interviews with over 30 GETs across multiple batches to gather valuable insights.",
        "Analyzed feedback to improve retention strategies, resulting in a revised salary structure for all new GET batches."
      ],
      "tags": [
        "Retention Strategies",
        "Feedback Analysis",
        "Salary Structure"
      ]
    }
  ],
  "skills": [
    {
      "category": "Human Resources",
      "skills": [
        "Talent Management",
        "Succession Planning",
        "Performance Management",
        "Employee Engagement",
        "Training and Development"
      ]
    },
    {
      "category": "Technical Skills",
      "skills": [
        "Advanced Excel",
        "Success Factors",
        "AI Tools",
        "Automation",
        "HRIS"
      ]
    },
    {
      "category": "Languages",
      "skills": [
        "English",
        "Hindi",
        "Gujarati"
      ]
    }
  ],
  "certifications": [
    {
      "title": "SHRM-SCP",
      "issuer": "",
      "date": "",
      "url": ""
    },
    {
      "title": "SPHR",
      "issuer": "",
      "date": "",
      "url": ""
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