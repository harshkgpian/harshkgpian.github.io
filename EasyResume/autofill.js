// jsonVersion.js

let demoJSON = {
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
        "summary": "Dedicated software engineer with 8 years of experience in full-stack development, focusing on building scalable applications. Proven ability to design, develop, and deploy software solutions. Skilled in optimizing processes and implementing AI tools to streamline workflows. Passionate about writing clean, maintainable code and contributing to open-source projects."
      }
    ],
    "education": [
      {
        "school": "Massachusetts Institute of Technology, MIT",
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
          "Led the development of a cloud-based SaaS platform, increasing customer retention by 40% and optimizing resource.",
          "Worked closely with cross-functional teams to design and implement new product features while maintaining code quality.",
          "Introduced Agile methodologies to the development team, improving productivity by 25% through effective sprint planning.",
          "Collaborated with DevOps to automate deployment pipelines, reducing deployment time by 50% through efficient CI/CD.",
          "Mentored junior developers and conducted code reviews, improving team code quality metrics by 35% over six months"
        ],
        "tags": [
          "cloud-based",
          "SaaS platform",
          "product features",
          "Agile methodologies",
          "DevOps",
          "deployment",
          "code reviews"
        ]
      },
      {
        "title": "CodeForge Technologies",
        "titleLink": "https://codeforge.com",
        "subtitle": "Junior Software Developer",
        "duration": "June 2016 - June 2018",
        "location": "New York, NY, USA",
        "bullets": [
          "Developed and maintained several web applications, increasing user engagement by 20% through intuitive interface design.",
          "Participated in the design and implementation of features for e-commerce platforms using modern payment integrations.",
          "Contributed to the backend development of high-traffic websites using Java with microservices architecture.",
          "Collaborated with QA engineers to write unit tests and ensure code quality through comprehensive test coverage.",
          "Improved codebase by refactoring legacy code and introducing design patterns for enhanced maintainability.",
          "Implemented automated testing strategies that reduced bug detection time by 40% and improved release reliability"
        ],
        "tags": [
          "web applications",
          "e-commerce",
          "microservices",
          "unit tests",
          "legacy code",
          "automated testing"
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
          "Developed an AI-based code review tool using ML, to identify bugs and suggest optimizations using neural networks.",
          "Integrated the tool into CI/CD pipeline to automate the review process and reduce human errors through pattern detection."
        ],
        "tags": [
          "AI-based",
          "code review",
          "ML",
          "neural networks",
          "CI/CD pipeline"
        ]
      },
      {
        "title": "Project Management Dashboard",
        "titleLink": "",
        "subtitle": "Frontend Developer",
        "duration": "2021",
        "location": "New York, NY, USA",
        "bullets": [
          "Designed a project management dashboard to track team performance and milestones using real-time data visualization.",
          "Utilized React and Redux for building dynamic and interactive user interfaces with advanced state management."
        ],
        "tags": [
          "project management",
          "data visualization",
          "React",
          "Redux",
          "user interfaces"
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
          "Wrote a comprehensive guide on building scalable systems using cloud technologies and distributed computing principles.",
          "Discussed best practices for managing cloud resources, optimizing cost and performance through automated management."
        ],
        "tags": [
          "scalable systems",
          "cloud technologies",
          "distributed computing",
          "cloud resources",
          "automated management"
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

// Function to create updated JSON from all form data
function createUpdatedJSON() {
    // Initialize the JSON structure with the same format as demoJSON
    const updatedJSON = {};
    
    // Collect data from all section types defined in sectionCounter
    Object.keys(sectionCounter).forEach(sectionType => {
      if (!updatedJSON[sectionType]) {
        updatedJSON[sectionType] = [];
      }
      
      // Skip if no data exists for this section type
      if (!formData[sectionType] || formData[sectionType].length === 0) {
        return;
      }
      
      // Process each item in this section type
      formData[sectionType].forEach(item => {
        const sectionData = {};
        
        // Handle special case for summary
        if (sectionType === 'summary') {
          if (item.fields.summary) {
            sectionData.summary = item.fields.summary;
          }
        } 
        // Handle special case for skills
        else if (sectionType === 'skills') {
          sectionData.category = item.fields.category || '';
          sectionData.skills = item.fields.skills || [];
        } 
        // Handle all other fields for standard and custom sections
        else {
          // Copy all fields except bullets and tags which need special handling
          Object.keys(item.fields).forEach(fieldName => {
            if (fieldName !== 'bullets' && fieldName !== 'tags' && fieldName !== 'skills') {
              sectionData[fieldName] = item.fields[fieldName] || '';
            }
          });
          
          // Handle bullets
          if (item.fields.bullets) {
            sectionData.bullets = Array.isArray(item.fields.bullets) ? 
              item.fields.bullets : 
              (typeof item.fields.bullets === 'string' ? 
                item.fields.bullets.split('\n').filter(b => b.trim() !== '') : []);
          }
          
          // Handle tags
          if (item.fields.tags) {
            sectionData.tags = typeof item.fields.tags === 'string' ? 
              item.fields.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : 
              (Array.isArray(item.fields.tags) ? item.fields.tags : []);
          }
        }
        
        // Only add non-empty section data
        if (Object.keys(sectionData).length > 0) {
          updatedJSON[sectionType].push(sectionData);
        }
      });
      
      // Remove empty arrays
      if (updatedJSON[sectionType].length === 0) {
        delete updatedJSON[sectionType];
      }
    });
    
    return updatedJSON;
  }
  
  // Function to log the updated JSON to console
  function logUpdatedJSON() {
    const updatedJSON = createUpdatedJSON();
    console.log('Updated Resume JSON:');
    console.log(JSON.stringify(updatedJSON, null, 2));
    
    // Provide feedback to the user
    alert('Resume JSON data has been logged to the console. Press F12 to open the developer console and view it.');
    
    return updatedJSON;
  }
  
  // Function to download the JSON file
  function downloadJSON() {
    const updatedJSON = createUpdatedJSON();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(updatedJSON, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "resume_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  
// Remove the JSON buttons function completely
function addJSONButtons() {
    // This function is now empty - we're removing the buttons
  }
  
  // Save to localStorage when JSON is updated
  function saveToLocalStorage() {
    const updatedJSON = createUpdatedJSON();
    localStorage.setItem('resumeData', JSON.stringify(updatedJSON));
  }
  
  // Modified window.onload function
  window.onload = function() {
    try {
      // Check if there's data in localStorage
      const savedData = localStorage.getItem('resumeData');
      
      if (savedData) {
        // Use the saved data
        demoJSON = JSON.parse(savedData);
      }
      
      // Load data (either from localStorage or the default demo)
      loadDemoData();
      
      // Setup event listener to save on form changes
      document.addEventListener('change', saveToLocalStorage);
      
      // Initialize collapsed sections if the function exists
      if (typeof initializeCollapsedGroups === 'function') {
        initializeCollapsedGroups();
      }
    } catch (error) {
      console.error('Error in window.onload:', error);
    }
  };