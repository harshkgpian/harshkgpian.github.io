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
            subtitle: "Propulsion Systems Intern",
            duration: "May 2023 - August 2023",
            location: "Mountain View, CA",
            bullets: [
                "Developed computational models for electric propulsion systems using MATLAB simulation environment",
                "Conducted performance analysis of hybrid propulsion systems through Statistical Analysis and modeling",
                "Created predictive maintenance algorithms using Machine Learning and Data Analytics"
            ],
            tags: ["MATLAB", "SIMULINK", "Machine Learning", "Statistical Analysis"]
        },
        {
            title: "General Electric Aviation",
            subtitle: "Turbine Design Engineering Intern",
            duration: "June 2023 - July 2023",
            location: "Cincinnati, OH",
            bullets: [
                "Designed optimization algorithms for turbine blade cooling systems using Python and NumPy",
                "Performed thermal analysis using ANSYS and Fluent for next-generation engine components",
                "Developed automated reporting system for turbine performance metrics using CFD analysis tools"
            ],
            tags: ["Python", "CFD", "ANSYS", "Fluent", "NumPy"]
        },
        {
            title: "Boeing Research & Technology",
            subtitle: "Autonomous Systems Intern",
            duration: "May 2022 - Aug 2022",
            location: "Seattle, WA",
            bullets: [
                "Implemented Computer Vision algorithms for autonomous aircraft navigation systems",
                "Developed deep learning models for obstacle detection using PyTorch and TensorFlow",
                "Created GUI-based testing platform using Python and OpenCV for vision system validation"
            ],
            tags: ["PyTorch", "Python", "Computer Vision", "TensorFlow", "OpenCV"]
        }
    ],
    projects: [
        {
            title: "Advanced Turbofan Engine Design with Variable Bypass",
            subtitle: "Graduate Thesis Project",
            duration: "January 2024 - Present",
            bullets: [
                "Designed novel turbofan architecture using Python and CFD achieving 15% improved fuel efficiency",
                "Conducted detailed analysis using ANSYS CFX and FEA for performance validation",
                "Optimized variable bypass mechanism using Computational Methods for multiple flight conditions"
            ],
            tags: ["Python", "CFD", "ANSYS CFX", "FEA", "Computational Methods"]
        },
        {
            title: "Autonomous VTOL Aircraft Control System",
            subtitle: "Advanced Controls Project",
            duration: "Sept 2022 - Dec 2022",
            bullets: [
                "Developed adaptive control system for VTOL aircraft using MATLAB and SIMULINK",
                "Implemented Control Systems algorithms for transition phase optimization",
                "Validated system performance through Hardware-in-the-Loop simulation"
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
            subtitle: "First Place Winner",
            duration: "Jan 2023 - May 2023",
            location: "Washington, DC",
            bullets: [
                "Led team in designing innovative Electric Propulsion system architecture",
                "Presented winning concept using System Design methodology at NASA headquarters",
                "Developed comprehensive simulation framework using MATLAB and SIMULINK"
            ],
            tags: ["Electric Propulsion", "System Design", "MATLAB", "SIMULINK"]
        },
        {
            title: "AIAA Design Competition",
            subtitle: "Distinguished Paper Award",
            duration: "March 2023 - Present",
            location: "Orlando, FL",
            bullets: [
                "Authored paper on novel approach to supersonic aircraft noise reduction using CFD",
                "Presented Aeroacoustics research findings at AIAA Aviation Forum 2023"
            ],
            tags: ["Aeroacoustics", "CFD", "Technical Writing"]
        }
    ]
};
function populateFromDemoJSON() {
    // Clear existing form data
    document.getElementById('formContainer').innerHTML = '';
    
    // Reset section counters
    sectionCounter = {
        personal: 0,
        education: 0,
        experience: 0,
        projects: 0,
        skills: 0,
        competitions: 0
    };

    // Populate Personal Information, Education, Experience, and Skills
    demoJSON.personal.forEach(personalInfo => {
        addSection('personal');
        const sectionId = `personal-${sectionCounter.personal - 1}`;
        const section = document.getElementById(sectionId);
        
        Object.entries(personalInfo).forEach(([key, value]) => {
            const input = section.querySelector(`input[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        });
        updateFormData(sectionId);
    });

    // Populate Education
    demoJSON.education.forEach(education => {
        addSection('education');
        const sectionId = `education-${sectionCounter.education - 1}`;
        const section = document.getElementById(sectionId);
        
        Object.entries(education).forEach(([key, value]) => {
            const input = section.querySelector(`input[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        });
        updateFormData(sectionId);
    });

// Modify populateFromDemoJSON() to handle individual bullet points

// For Experience sections
demoJSON.experience.forEach(experience => {
    addSection('experience');
    const sectionId = `experience-${sectionCounter.experience - 1}`;
    const section = document.getElementById(sectionId);
    
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
        } else {
            const input = section.querySelector(`input[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        }
    });
    updateFormData(sectionId);
});

// Similar changes for Projects section
demoJSON.projects.forEach(project => {
    addSection('projects');
    const sectionId = `projects-${sectionCounter.projects - 1}`;
    const section = document.getElementById(sectionId);
    
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
});

// And for Competitions section
demoJSON.competitions.forEach(competition => {
    addSection('competitions');
    const sectionId = `competitions-${sectionCounter.competitions - 1}`;
    const section = document.getElementById(sectionId);
    
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
}); 
    
    // Populate Skills
    demoJSON.skills.forEach(skillCategory => {
        addSection('skills');
        const sectionId = `skills-${sectionCounter.skills - 1}`;
        const section = document.getElementById(sectionId);
        
        // Set category
        const categoryInput = section.querySelector('input[name="category"]');
        if (categoryInput) {
            categoryInput.value = skillCategory.category;
        }

        // Add skills
        const skillsContainer = section.querySelector('.skills-container');
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
        updateFormData(sectionId);
    });

    // Generate resume preview
    console.log('Demo data loaded', sectionOrder);
    generateResume(sectionOrder);
}

// Function to load demo data
function loadDemoData() {
    populateFromDemoJSON();
}

window.onload = function() {
    loadDemoData();
    generateResume(sectionOrder);
};