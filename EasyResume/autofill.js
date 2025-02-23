// jsonVersion.js

const demoJSON = {
    personal: [
        {
            name: "Harsh Raj",
            email: "harshrjto@gmail.com",
            phone: "+91 8750798260",
            links: {
                github: "github.com/harshkgpian",
                linkedin: "linkedin.com/in/harsh-raj"
            }
        }
    ],
    education: [
        {
            school: "Indian Institute of Technology, Kharagpur",
            degree: "Master of Technology in Aerospace Engineering",
            duration: "2022-2024",
            location: "West Bengal, India",
            gpa: "8.64/10"
        },
        {
            school: "Bharat National Public School",
            degree: "Class XII - Central Board of Secondary Education",
            duration: "2019",
            location: "Delhi, India",
            gpa: "9/10"
        }
    ],
    experience: [
        {
            title: "DRDO",
            subtitle: "Propulsion Research Intern",
            duration: "May 2023 - June 2023",
            location: "Bengaluru",
            bullets: [
                "Designed engine starting system for 5th Generation AMCA Fighter Aircraft using MATLAB/SIMULINK",
                "Evaluated pressure loss in APU, ATS, and Engine connections through statistical health monitoring models",
                "Implemented diagnostics models for APU performance optimization and system health assessment"
            ],
            tags: ["MATLAB", "SIMULINK", "Statistical Analysis"]
        },
        {
            title: "Aerostrovilos Pvt. Ltd",
            subtitle: "Turbomachinery and Python Developer Intern",
            duration: "June 2023 - July 2023",
            location: "IIT Madras, Chennai",
            bullets: [
                "Developed Python program for Radial Inflow Turbines performance prediction using loss correlations",
                "Performed CFD analysis in Fluent and evaluated turbine creep life using ANSYS Mechanical",
                "Generated detailed contour plots from CSV data for comprehensive turbine analysis"
            ],
            tags: ["Python", "CFD", "ANSYS", "Fluent"]
        },
        {
            title: "Artenal Robotics",
            subtitle: "Computer Vision Intern",
            duration: "May 2022 - Aug 2022",
            location: "Vancouver, Canada",
            bullets: [
                "Implemented TensorFlow-based object detection and orientation detection algorithms for robotics applications",
                "Custom trained YOLO v5/v6 CNN models using advanced transfer learning techniques",
                "Developed KTkinter-based image annotation application for streamlined workflow management"
            ],
            tags: ["TensorFlow", "Python", "YOLO", "CNN", "KTkinter"]
        }
    ],
    projects: [
        {
            title: "Mixed Flow Compressor with Crossover Diffuser for UAVs",
            subtitle: "M.Tech Project",
            duration: "July 2024 - Present",
            bullets: [
                "Designed compressor achieving 3.8 pressure ratio and 85% efficiency using Python-based meanline methodology",
                "Performed CFD analysis using BladeGen, Turbogrid, and CFX for comprehensive stage optimization",
                "Optimized crossover diffuser design for optimal pressure recovery under diameter constraints"
            ],
            tags: ["Python", "CFD", "BladeGen", "Turbogrid", "CFX"]
        },
        {
            title: "VTOL and Fixed Wing Hybrid Drone Design",
            subtitle: "Flight Testing Lab Project",
            duration: "Aug 2022 - Nov 2022",
            bullets: [
                "Developed MATLAB/SIMULINK simulation with Simscape for hybrid VTOL and fixed-wing drone",
                "Implemented PID control systems for flight mode transitions using OpenVSP",
                "Analyzed aerodynamic performance and flight characteristics through comprehensive simulation"
            ],
            tags: ["MATLAB", "SIMULINK", "Simscape", "OpenVSP", "PID Control"]
        }
    ],
    skills: [
        {
            category: "Languages and Tools",
            skills: ["C/C++", "Python", "OpenCV", "Matplotlib", "TensorFlow", "SimScape", "JS", "PyTorch", "CFD", "FEM"]
        },
        {
            category: "Software",
            skills: ["MATLAB/SIMULINK", "Solidworks", "ANSYS", "OpenFOAM", "GasTurb", "OpenVSP", "Vrep(CoppeliaSim)"]
        }
    ],
    competitions: [
        {
            title: "AIAA Jet Engine Design Competition",
            subtitle: "Top 3 Recognition",
            duration: "Dec 2022 - Apr 2023",
            location: "Boston, USA",
            bullets: [
                "Designed Hybrid-Electric Propulsion System with Fuselage Boundary Layer Ingestion",
                "Presented at AIAA AVIATION Forum and received recognition for technical excellence",
                "Optimized gas turbine systems for improved efficiency through advanced aerodynamics"
            ]
        },
        {
            title: "ASME GtIndia Conference",
            subtitle: "Research Paper Presenter",
            duration: "June 2023 - Present",
            location: "Bengaluru, India",
            bullets: [
                "Co-authored research paper on Strategic Design for BLI Engine-Based Hybrid Propulsion",
                "Presented findings at prestigious ASME GTIndia 2023 conference"
            ]
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

    // Populate Experience
    demoJSON.experience.forEach(experience => {
        addSection('experience');
        const sectionId = `experience-${sectionCounter.experience - 1}`;
        const section = document.getElementById(sectionId);
        
        Object.entries(experience).forEach(([key, value]) => {
            if (key === 'bullets') {
                const textarea = section.querySelector('textarea[name="bullets"]');
                if (textarea) {
                    textarea.value = value.join('\n');
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


    // Populate Projects
    demoJSON.projects.forEach(project => {
        addSection('projects');
        const sectionId = `projects-${sectionCounter.projects - 1}`;
        const section = document.getElementById(sectionId);
        
        Object.entries(project).forEach(([key, value]) => {
            if (key === 'bullets') {
                const textarea = section.querySelector('textarea[name="bullets"]');
                if (textarea) {
                    textarea.value = value.join('\n');
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

    // Populate Competitions
    demoJSON.competitions.forEach(competition => {
        addSection('competitions');
        const sectionId = `competitions-${sectionCounter.competitions - 1}`;
        const section = document.getElementById(sectionId);
        
        Object.entries(competition).forEach(([key, value]) => {
            if (key === 'bullets') {
                const textarea = section.querySelector('textarea[name="bullets"]');
                if (textarea) {
                    textarea.value = value.join('\n');
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