// jsonVersion.js

let defaultJson = {
  "personal": [
    {
      "name": "Harsh Raj",
      "email": "harshrjto@gmail.com",
      "phone": "+91 8750798260",
      "github": "github.com/harshkgpian",
      "linkedin": "linkedin.com/in/harsh-raj",
      "website": "LinkedInAutoApply.com"
    }
  ],
  "education": [
    {
      "school": "Indian Institute of Technology, Kharagpur",
      "degree": "Master of Technology in Aerospace Engineering",
      "duration": "November 2020 - Present",
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
      "title": "Full-Stack Founder & Developer",
      "company": "LinkedInAutoApply.com",
      "duration": "January 2024 - Present",
      "location": "Remote",
      "bullets": [
        "Engineered and launched LinkedInAutoApply.com, a full-stack platform using Node.js and React for automated job applications.",
        "Integrated a secure Razorpay payment gateway to efficiently manage user subscriptions and transactions.",
        "Architected a scalable backend with Firebase for robust data storage and real-time application updates.",
        "Leveraged Python and Generative AI for intelligent resume parsing and personalized application message generation."
      ],
      "tags": [
        "Node.js",
        "React",
        "Razorpay API",
        "Firebase",
        "Python",
        "Generative AI",
        "Full-Stack Development",
        "SaaS",
        "Automated Solutions"
      ]
    },
    {
      "title": "Data Science Intern / AI Engineering Intern",
      "company": "GradStem",
      "duration": "May 2023 - June 2023",
      "location": "Remote",
      "bullets": [
        "Developed Python scripts for Indeed API integration, classifying thousands of job listings efficiently.",
        "Applied Artificial Intelligence techniques for precise technical and non-technical job classification.",
        "Utilized OpenAI GPT-4o API for resume personalization, improving Applicant Tracking System (ATS) compatibility.",
        "Automated job applications on Greenhouse/Workday using JavaScript, Selenium, Python, and Generative AI."
      ],
      "tags": [
        "Python",
        "Artificial Intelligence",
        "OpenAI GPT-4o",
        "ATS Optimization",
        "JavaScript",
        "Selenium",
        "Generative AI",
        "Data Science",
        "API Integration"
      ]
    },
    {
      "title": "Deep Learning / Computer Vision Intern",
      "company": "Artenal Robotics",
      "duration": "May 2022 - August 2022",
      "location": "Vancouver, Canada",
      "bullets": [
        "Applied TensorFlow for object detection, recognition, and developing new orientation detection algorithms.",
        "Custom trained Convolutional Neural Network (CNN) models like YOLO v5/v6 using Python.",
        "Utilized advanced transfer learning techniques for enhanced AI software development and efficiency.",
        "Created an efficient image annotation app with Python's Tkinter library, streamlining project workflows."
      ],
      "tags": [
        "TensorFlow",
        "Object Detection",
        "Artificial Intelligence",
        "Python",
        "CNN",
        "YOLO",
        "Deep Learning",
        "Computer Vision",
        "Transfer Learning"
      ]
    }
  ],
  "projects": [
    {
      "title": "Nexus - Smart Scheduler (Voice Agent)",
      "subtitle": "Self Project",
      "duration": "July 2024",
      "location": "Personal",
      "bullets": [
        "Developed a conversational AI scheduling assistant with text and real-time voice modes, integrating Google Calendar.",
        "Implemented 'See, Then Act' logic ensuring no conflicting schedule suggestions for optimal planning.",
        "Utilized OpenAI Realtime API for low-latency, conversational voice interactions with server-side turn detection.",
        "Built with Node.js, Express.js, Vanilla HTML, CSS, JavaScript, and OpenAI Chat API (gpt-4.1-nano)."
      ],
      "tags": [
        "Node.js",
        "Express.js",
        "JavaScript",
        "HTML",
        "CSS",
        "OpenAI API",
        "Google Calendar API",
        "Artificial Intelligence",
        "Generative AI",
        "Voice AI",
        "API Integration"
      ]
    },
    {
      "title": "WhatsApp Automation Tool",
      "subtitle": "Independent Software Development Project",
      "duration": "January 2024 - Present",
      "location": "Remote",
      "bullets": [
        "Developed an Electron desktop app with `whatsapp-web.js` for end-to-end WhatsApp messaging automation.",
        "Implemented bulk messaging, auto-responders, contact scraping, and scheduling using JavaScript for lead outreach.",
        "Engineered CLI and REST API hooks for seamless integration into existing business workflows efficiently.",
        "Packaged the application with an auto-updating installer feature for enhanced user experience."
      ],
      "tags": [
        "Electron",
        "JavaScript",
        "Node.js",
        "Automation",
        "REST API",
        "Software Development",
        "CLI Tools"
      ]
    },
    {
      "title": "Virtual AI Girlfriend",
      "subtitle": "Self Project",
      "duration": "July 2024",
      "location": "Personal",
      "bullets": [
        "Developed a web app (HTML, JS, CSS, Node.js) simulating interactive virtual partner conversations.",
        "Integrated Groq API with LLAMA 3 models for dynamic, context-aware conversational responses.",
        "Ensured multi-language support and created a visually appealing chat interface with customizable partner personalities.",
        "Conducted thorough unit testing for critical components of the Generative AI system."
      ],
      "tags": [
        "HTML",
        "JavaScript",
        "Node.js",
        "Generative AI",
        "Groq API",
        "LLAMA 3",
        "Artificial Intelligence",
        "Unit Testing",
        "Conversational AI"
      ]
    },
    {
      "title": "Perplexity AI-Like System",
      "subtitle": "Self Project",
      "duration": "July 2024",
      "location": "Personal",
      "bullets": [
        "Developed a Python system where an LLM uses Google Search API to find and scrape web content.",
        "Utilized BeautifulSoup for efficient and precise web scraping and data extraction.",
        "Implemented Retrieval-Augmented Generation (RAG) for synthesizing scraped, up-to-date information.",
        "Utilized Groq API for faster LLM inference, significantly improving system performance and efficiency."
      ],
      "tags": [
        "Python",
        "LLM",
        "BeautifulSoup",
        "Artificial Intelligence",
        "RAG",
        "Generative AI",
        "Groq API",
        "Web Scraping",
        "Information Retrieval"
      ]
    },
    {
      "title": "Aerial Image Segmentation with PyTorch",
      "subtitle": "Self Project",
      "duration": "July 2022",
      "location": "Personal",
      "bullets": [
        "Developed a custom Python dataset class, applying image-mask augmentation via Albumentations for road segmentation.",
        "Harnessed a pre-trained U-Net model from the PyTorch Segmentation Model library effectively.",
        "Streamlined model training with efficient training/evaluation functions in this software development initiative.",
        "Conducted comprehensive unit testing to ensure the reliability of segmentation model components."
      ],
      "tags": [
        "Python",
        "PyTorch",
        "U-Net",
        "Albumentations",
        "Unit Testing",
        "Deep Learning",
        "Image Segmentation",
        "Computer Vision"
      ]
    },
    {
      "title": "Rock Paper Scissors Game",
      "subtitle": "Self Project",
      "duration": "May 2023 - June 2023",
      "location": "Personal",
      "bullets": [
        "Built a real-time 'Rock, Paper, Scissors' web app, training deep learning models using Python.",
        "Utilized webcam images with JavaScript and TensorFlow.js for real-time AI integration.",
        "Leveraged TensorFlow and transfer learning for user-driven model training with real-time predictions.",
        "Enabled model download for user convenience, extending utility of the trained deep learning model."
      ],
      "tags": [
        "Python",
        "JavaScript",
        "TensorFlow.js",
        "Deep Learning",
        "Artificial Intelligence",
        "Web Development",
        "Real-time Applications"
      ]
    },
    {
      "title": "VTOL and Fixed Wing Hybrid Drone Design",
      "subtitle": "Flight Testing Lab Project",
      "duration": "August 2022 - November 2022",
      "location": "IIT Kharagpur",
      "bullets": [
        "Designed and simulated a hybrid VTOL and fixed-wing drone using MATLAB/SIMULINK and Simscape library.",
        "Conducted comprehensive analysis of drone’s flight characteristics and aerodynamic performance in OpenVSP.",
        "Designed and implemented PID control systems for transitions between hover and horizontal flight."
      ],
      "tags": [
        "MATLAB",
        "SIMULINK",
        "Simscape",
        "OpenVSP",
        "PID Control",
        "Aerospace Engineering",
        "Drone Design",
        "Simulation"
      ]
    }
  ],
  "leadership": [
    {
      "title": "Physics Olympiad Mentor",
      "organization": "IIT Kharagpur (Extended Online)",
      "duration": "August 2022 - Present",
      "location": "IIT Kharagpur",
      "bullets": [
        "Recorded and delivered comprehensive physics lectures to prepare students for national Physics Olympiads.",
        "Provided expert guidance and mentorship, improving understanding of complex physics concepts effectively."
      ],
      "tags": [
        "Mentorship",
        "Teaching",
        "Physics Education",
        "Academic Support"
      ]
    },
    {
      "title": "Football Team Player & Training Organizer",
      "organization": "Inter IIT Sports Competition",
      "duration": "November 2020 - May 2023",
      "location": "IIT Kharagpur",
      "bullets": [
        "Represented IIT Kharagpur as a football player in the prestigious Inter IIT sports competition.",
        "Organized and conducted rigorous training sessions for over 30 players, enhancing team skills."
      ],
      "tags": [
        "Leadership",
        "Teamwork",
        "Sports Coaching",
        "Event Organization",
        "Athletics"
      ]
    }
  ],
  "skills": [
    {
      "category": "Languages and Tools",
      "skills": [
        "Python",
        "Java",
        "C/C++",
        "JavaScript",
        "Node.js",
        "Electron",
        "TensorFlow",
        "PyTorch",
        "Keras",
        "Scikit-learn",
        "OpenCV",
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Seaborn",
        "SQL",
        "BeautifulSoup",
        "Selenium",
        "Firebase",
        "Razorpay API",
        "Groq API",
        "OpenAI API",
        "MATLAB",
        "SIMULINK",
        "Simscape",
        "OpenVSP",
        "Tkinter"
      ]
    },
    {
      "category": "AI & Data Analysis",
      "skills": [
        "Generative AI",
        "Artificial Intelligence",
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing (NLP)",
        "Data Visualization",
        "Web Scraping",
        "Retrieval-Augmented Generation (RAG)",
        "Transformers",
        "Computer Vision",
        "Object Detection",
        "Image Segmentation",
        "Transfer Learning",
        "Conversational AI"
      ]
    },
    {
      "category": "Software Development Practices",
      "skills": [
        "Software Development",
        "Unit Testing",
        "Code Reviews",
        "Documentation",
        "REST API Development",
        "Agile Methodologies",
        "Full-Stack Development",
        "System Design",
        "API Integration"
      ]
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
