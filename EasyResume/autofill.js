// jsonVersion.js

const demoJSON = {
    personal: [
        {
            name: "JOHN DOE",
            email: "johndoe@email.com",
            phone: "+1 555-123-4567",
            github: "github.com/johndoe-aero",
            linkedin: "linkedin.com/in/john-doe-aero"
        }
    ],
    education: [
        {
            school: "Massachusetts Institute of Technology",
            degree: "Master of Science in Aeronautics and Astronautics",
            duration: "2022-2024",
            location: "Cambridge, MA, USA",
            scoreType: "CGPA",
            gpa: "3.92/4.0"
        },
        {
            school: "Lincoln High School",
            degree: "High School Diploma - Advanced Placement",
            duration: "2019",
            location: "Boston, MA, USA",
            scoreType: "Percentage",
            gpa: "4.0/4.0"
        }
    ],
    experience: [
        {
            title: "NASA Ames Research Center",
            titleLink: "https://www.nasa.gov/ames",
            subtitle: "Propulsion Systems Intern",
            duration: "May 2023 - August 2023",
            location: "Mountain View, CA",
            bullets: [
                "Developed advanced computational models for electric propulsion systems using MATLAB, achieving 25% improved accuracy.",
                "Conducted comprehensive performance analysis of hybrid propulsion systems through Statistical Analysis and modeling.",
                "Implemented predictive maintenance algorithms using Machine Learning, reducing system downtime by 40% through analytics."
            ],
            tags: ["MATLAB", "SIMULINK", "Machine Learning", "Statistical Analysis"]
        },
        {
            title: "General Electric Aviation",
            titleLink: "https://www.ge.com/aviation",
            subtitle: "Turbine Design Engineering Intern",
            duration: "June 2023 - July 2023",
            location: "Cincinnati, OH",
            bullets: [
                "Designed and implemented optimization algorithms for turbine blade cooling systems using Python and NumPy libraries.",
                "Performed comprehensive thermal analysis using ANSYS and Fluent for next-generation engine component validation.",
                "Developed automated reporting system for turbine performance metrics, improving analysis efficiency by 50% using CFD."
            ],
            tags: ["Python", "CFD", "ANSYS", "Fluent", "NumPy"]
        },
        {
            title: "Boeing Research & Technology",
            subtitle: "Autonomous Systems Intern",
            duration: "May 2022 - Aug 2022",
            location: "Seattle, WA",
            bullets: [
                "Implemented advanced Computer Vision algorithms for autonomous aircraft navigation systems with 95% accuracy rate.",
                "Developed and optimized deep learning models for obstacle detection using PyTorch and TensorFlow frameworks.",
                "Created comprehensive GUI-based testing platform using Python and OpenCV for vision system validation and testing."
            ],
            tags: ["PyTorch", "Python", "Computer Vision", "TensorFlow", "OpenCV"]
        }
    ],
    projects: [
        {
            title: "Advanced Turbofan Engine Design with Variable Bypass",
            titleLink: "https://github.com/johndoe-aero/turbofan-design",
            subtitle: "Graduate Thesis Project",
            duration: "January 2024 - Present",
            bullets: [
                "Designed a novel turbofan architecture using CFD, achieving 15% improved fuel efficiency, performance optimization.",
                "Conducted detailed analysis using ANSYS CFX and FEA for performance validation, ensuring accuracy and optimization.",
                "Optimized variable bypass mechanism using advanced Computational Methods for multiple flight conditions performance."
            ],
            tags: ["Python", "CFD", "ANSYS CFX", "FEA", "Computational Methods"]
        },
        {
            title: "Autonomous VTOL Aircraft Control System",
            titleLink: "https://github.com/johndoe-aero/vtol-control",
            subtitle: "Advanced Controls Project",
            duration: "Sept 2022 - Dec 2022",
            bullets: [
                "Developed adaptive control system for VTOL aircraft using MATLAB and SIMULINK for enhanced stability performance.",
                "Implemented advanced Control Systems algorithms for transition phase optimization in complex dynamic flight conditions.",
                "Validated system performance through Hardware-in-the-Loop simulation, ensuring real-time control, precision, reliability."
            ],
            tags: ["MATLAB", "SIMULINK", "Control Systems", "VTOL", "Hardware-in-the-Loop"]
        }
    ],
    skills: [
        {
            category: "Languages and Tools",
            skills: ["Python", "MATLAB", "C++", "ANSYS", "PyTorch", "TensorFlow", "OpenCV", "CAD", "CFD", "FEA"]
        }
    ],
    competitions: [
        {
            title: "NASA University Student Design Challenge",
            titleLink: "https://www.nasa.gov/stem/studentchallenge",
            subtitle: "First Place Winner",
            duration: "Jan 2023 - May 2023",
            location: "Washington, DC",
            bullets: [
                "Led team in designing innovative Electric Propulsion system architecture, achieving 30% improved efficiency metrics.",
                "Presented winning concept using System Design methodology at NASA headquarters, receiving recognition for innovation.",
                "Developed comprehensive simulation framework using MATLAB and SIMULINK for performance validation and testing."
            ],
            tags: ["Electric Propulsion", "System Design", "MATLAB", "SIMULINK"]
        },
        {
            title: "AIAA Design Competition",
            subtitle: "Distinguished Paper Award",
            duration: "March 2023 - Present",
            location: "Orlando, FL",
            bullets: [
                "Authored comprehensive paper on novel approach to supersonic aircraft noise reduction using advanced CFD techniques.",
                "Presented groundbreaking Aeroacoustics research findings at AIAA Aviation Forum, receiving distinguished recognition."
            ],
            tags: ["Aeroacoustics", "CFD", "Technical Writing"]
        }
    ]
};

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
    
    // Clear formData object
    if (typeof formData !== 'undefined') {
        formData = {
            personal: [],
            education: [],
            experience: [],
            projects: [],
            skills: [],
            competitions: []
        };
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
    } else {
        console.warn('sectionCounter variable not defined yet');
    }
}

function populateFromDemoJSON() {
    try {
        // Clear existing form data - using the clearAllData function
        clearAllData();
        
        // Populate Personal Information, Education, Experience, and Skills
        demoJSON.personal.forEach(personalInfo => {
            addSection('personal');
            const sectionId = `personal-${sectionCounter.personal - 1}`;
            const section = document.getElementById(sectionId);
            
            if (section) {
                Object.entries(personalInfo).forEach(([key, value]) => {
                    const input = section.querySelector(`input[name="${key}"]`);
                    if (input) {
                        input.value = value;
                    }
                });
                updateFormData(sectionId);
            }
        });

        // Populate Education
        demoJSON.education.forEach(education => {
            addSection('education');
            const sectionId = `education-${sectionCounter.education - 1}`;
            const section = document.getElementById(sectionId);
            
            if (section) {
                Object.entries(education).forEach(([key, value]) => {
                    const input = section.querySelector(`input[name="${key}"]`);
                    if (input) {
                        input.value = value;
                    }
                });
                updateFormData(sectionId);
            }
        });

        // For Experience sections
        demoJSON.experience.forEach(experience => {
            addSection('experience');
            const sectionId = `experience-${sectionCounter.experience - 1}`;
            const section = document.getElementById(sectionId);
            
            if (section) {
                Object.entries(experience).forEach(([key, value]) => {
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
                            input.value = value.join(', ');
                        }
                    } else {
                        const input = section.querySelector(`input[name="${key}"]`);
                        if (input) {
                            input.value = value;
                        }
                    }
                });
                updateFormData(sectionId);
            }
        });

        // Similar changes for Projects section
        demoJSON.projects.forEach(project => {
            addSection('projects');
            const sectionId = `projects-${sectionCounter.projects - 1}`;
            const section = document.getElementById(sectionId);
            
            if (section) {
                Object.entries(project).forEach(([key, value]) => {
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
                            input.value = value.join(', ');
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
            }
        });

        // And for Competitions section
        demoJSON.competitions.forEach(competition => {
            addSection('competitions');
            const sectionId = `competitions-${sectionCounter.competitions - 1}`;
            const section = document.getElementById(sectionId);
            
            if (section) {
                Object.entries(competition).forEach(([key, value]) => {
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
                            input.value = value.join(', ');
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
            }
        }); 
        
        // Populate Skills
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

        // Generate resume preview - Use a try/catch to handle any potential errors
        try {
            console.log('Demo data loaded', sectionOrder);
            if (typeof generateResume === 'function' && typeof sectionOrder !== 'undefined') {
                generateResume(sectionOrder);
            } else {
                console.warn('generateResume function or sectionOrder not found');
            }
        } catch (error) {
            console.error('Error generating resume preview:', error);
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
        
        // Generate the resume if the function exists
        if (typeof generateResume === 'function' && typeof sectionOrder !== 'undefined') {
            generateResume(sectionOrder);
        } else {
            console.warn('generateResume function or sectionOrder not found');
        }
    } catch (error) {
        console.error('Error in window.onload:', error);
    }
};