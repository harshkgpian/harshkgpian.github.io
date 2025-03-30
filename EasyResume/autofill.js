// jsonVersion.js

let defaultJson = {
  "personal": [
    {
      "name": "Harsh Raj",
      "email": "harshrjto@gmail.com",
      "phone": "+91 8750798260",
      "linkedin": "linkedin.com/in/harsh-raj",
      "github": "github.com/harshkgpian"
    }
  ],
  "summary": [
    {
      "summary": "Highly motivated Aerospace Engineering M.Tech candidate with a strong foundation in design, analysis, and simulation of aerospace systems. Experienced in developing PLC programs and utilizing SCADA systems for automation. Proven ability to collaborate effectively within cross-functional teams and experience in renewable energy systems."
    }
  ],
  "education": [
    {
      "school": "Indian Institute of Technology, Kharagpur",
      "degree": "Master of Technology in Aerospace Engineering",
      "duration": "November 2020 – Present",
      "location": "West Bengal, India",
      "scoreType": "CGPA",
      "gpa": "8.64/10"
    },
    {
      "school": "Bharat National Public School",
      "degree": "Class XII - Central Board of Secondary Education",
      "duration": "May 2019",
      "location": "Delhi, India",
      "scoreType": "Percentage",
      "gpa": "90%"
    }
  ],
  "experience": [
    {
      "title": "Aeronautical Development Agency",
      "subtitle": "Propulsion Research Intern",
      "duration": "May 2023 – June 2023",
      "location": "Bengaluru",
      "bullets": [
        "Conducted preliminary design and analysis of an engine starting system for a 5th Generation AMCA Fighter Aircraft.",
        "Utilized MATLAB/SIMULINK to evaluate pressure loss in valves and ducts connecting the APU, ATS, and Engine.",
        "Proposed a statistical approach for health monitoring of the APU using different prognostic and diagnostic models."
      ],
      "tags": ["MATLAB/SIMULINK"]
    },
    {
      "title": "Aerostrovilos Pvt. Ltd",
      "subtitle": "Turbomachinery and Python Developer Intern",
      "duration": "June 2023 – July 2023",
      "location": "IIT Madras, Chennai",
      "bullets": [
        "Developed a Python program for Off-design Performance Prediction of Radial Inflow Turbines using loss correlations.",
        "Researched seals used in micro gas turbines and assisted in performing CFD analysis of the seal in Fluent.",
        "Evaluated the creep life of the radial turbine and generated contour plots in ANSYS Mechanical using CSV data."
      ],
      "tags": ["Python", "CFD", "ANSYS"]
    },
    {
      "title": "Artenal Robotics",
      "subtitle": "Computer Vision Intern",
      "duration": "May 2022 – Aug 2022",
      "location": "Vancouver, Canada",
      "bullets": [
        "Utilized TensorFlow for object detection and recognition, along with the development of orientation detection algorithms.",
        "Custom trained CNN models, specializing in YOLO v5/v6, leveraging advanced transfer learning techniques.",
        "Created an efficient image annotation app using Python’s Tkinter library, enhancing project workflows."
      ],
      "tags": ["TensorFlow", "YOLO v5/v6", "Python"]
    }
  ],
  "projects": [
    {
      "title": "Design of Mixed Flow Compressor with Crossover Diffuser for UAVs",
      "duration": "July 2024 – Present",
      "bullets": [
        "Designed a compressor with a pressure ratio of 3.8, 85% efficiency, and 4.3 kg/s mass flow for UAV applications.",
        "Developed a meanline design methodology using turbomachinery principles and convergence criteria in Python.",
        "Performed parametric studies using airfoil mapping to create 3D models of the compressor and crossover diffuser.",
        "Utilized BladeGen, Turbogrid, and CFX for generating mesh and performing CFD analysis of the combined stage.",
        "Optimized the stage for diameter constraint and achieved optimal pressure recovery in the crossover diffuser."
      ],
      "tags": ["CFD", "Python", "BladeGen", "Turbogrid", "CFX"]
    },
    {
      "title": "VTOL and Fixed Wing Hybrid Drone Design",
      "duration": "Aug 2022 – Nov 2022",
      "bullets": [
        "Designed and simulated a hybrid VTOL and fixed-wing drone using MATLAB/SIMULINK with the Simscape library.",
        "Conducted comprehensive analysis of the drone’s flight characteristics and aerodynamic performance in OpenVSP.",
        "Designed and implemented PID control systems to facilitate transitions between hover and horizontal flight modes."
      ],
      "tags": ["MATLAB/SIMULINK", "OpenVSP"]
    },
    {
      "title": "Piezo-Electric Droplet Generator",
      "duration": "Aug 2022 – Nov 2022",
      "bullets": [
        "Designed a Piezoelectric Droplet Generator to understand how different fuels burn and behave in combustion processes.",
        "Utilized 3D printing techniques to fabricate critical components from CAD models developed in SOLIDWORKS.",
        "Configured and integrated electrical connections using Arduino, for precision and control in droplet generation."
      ],
      "tags": ["SOLIDWORKS", "Arduino"]
    },
    {
      "title": "Aerial Image Segmentation with PyTorch",
      "duration": "July 2022",
      "bullets": [
        "Developed a custom dataset class and applied image-mask augmentation using Albumentations.",
        "Utilized a pre-trained U-Net model from the PyTorch Segmentation Model library for the Massachusetts Roads Segmentation Dataset.",
        "Streamlined model training by creating efficient training and evaluation functions."
      ],
      "tags": ["PyTorch", "Albumentations"]
    }
  ],
  "conferences": [
    {
      "title": "AIAA Jet Engine Design Competition",
      "duration": "Dec 2022 – Apr 2023",
      "location": "Boston, USA",
      "bullets": [
        "Proposed an industry-level solution for a Hybrid-Electric Propulsion System incorporating Fuselage Boundary Layer Ingestion.",
        "Presented the solution at the AIAA AVIATION Forum and received top 3 recognition for the technical report.",
        "Designed high-efficiency compressors using advanced turbomachinery aerodynamics principles."
      ],
      "tags": ["compressors"]
    },
    {
      "title": "ASME GtIndia Conference",
      "duration": "June 2023 – Present",
      "location": "Bengaluru, India",
      "bullets": [
        "Co-authored a research paper on ”Strategic Design for BLI Engine-Based Hybrid Propulsion” at ASME GTIndia 2023."
      ],
      "tags": ["BLI Engine"]
    }
  ],
  "skills": [
    {
      "category": "Languages and Tools",
      "skills": [
        "C/C++",
        "Python",
        "OpenCV",
        "Matplotlib",
        "TensorFlow",
        "SimScape",
        "JS",
        "PyTorch",
        "CFD",
        "FEM"
      ]
    },
    {
      "category": "Softwares",
      "skills": [
        "MATLAB/SIMULINK",
        "Solidworks",
        "ANSYS",
        "OpenFOAM",
        "GasTurb",
        "OpenVSP",
        "Vrep(CoppeliaSim)"
      ]
    }
  ],
  "leadership": [
    {
      "title": "Lead Aerospace Engineering team",
      "organization": "Calculatoratoz.com",
      "duration": null,
      "location": null,
      "bullets": [
        "Managed and deployed over 500 aerospace calculators."
      ],
      "tags": []
    }
  ]
}

let demoJSON = defaultJson;


// Helper function to detect and register custom sections
function detectCustomSections() {
    // Look through the JSON for sections that might not be in the default config
    const standardSections = ['personal', 'summary', 'education', 'experience', 'projects', 'skills'];
    
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
    console.log('Creating button for custom section:', sectionKey);
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
            } else if (sectionType === 'summary') {
                titleField = { value: 'Professional Summary' }; // Static title for summary
            } else if (sectionType === 'skills') {
                titleField = section.querySelector('input[name="category"]');
            } else if (sectionType === 'personal') {
                titleField = section.querySelector('input[name="name"]');
            }  else {
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

function loadDefaultData() {
    try {
        // Clear any existing data before loading demo
        clearAllData();
        
        // Populate with demo data
        demoJSON = defaultJson;
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
        
    return updatedJSON;
  }
  
  
// Remove the JSON buttons function completely
function addJSONButtons() {
    // This function is now empty - we're removing the buttons
  }
  
  // Save to localStorage when JSON is updated
  function saveToLocalStorage() {
    const updatedJSON = createUpdatedJSON();
    const updatedsectionOrder = getSectionOrder();
    localStorage.setItem('sectionOrder', updatedsectionOrder);
    localStorage.setItem('resumeData', JSON.stringify(updatedJSON));
  }
  
  // Modified window.onload function
  window.onload = function() {
    try {
      // Check if there's data in localStorage
      const savedData = localStorage.getItem('resumeData');
      const savedOrder = localStorage.getItem('sectionOrder');
      
      if (savedData && savedOrder) {
        // Use the saved data
        demoJSON = JSON.parse(savedData);
        sectionOrder = savedOrder.split(',');
        console.log('sectionOrder from localStorage:', sectionOrder);
        console.log('Loaded data from localStorage');
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
