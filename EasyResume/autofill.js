// jsonVersion.js

const demoJSON = {
    personal: [
        {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "(555) 123-4567",
            location: "San Francisco, CA"
        }
    ],
    education: [
        {
            school: "Stanford University",
            degree: "Master of Science in Computer Science",
            duration: "2020-2022",
            location: "Stanford, CA",
            gpa: "3.9"
        },
        {
            school: "University of California, Berkeley",
            degree: "Bachelor of Science in Computer Engineering",
            duration: "2016-2020",
            location: "Berkeley, CA",
            gpa: "3.8"
        }
    ],
experience: [
        {
            title: "Google",              // Changed from company
            subtitle: "Senior Software Engineer", // Changed from position
            duration: "2022-Present",
            location: "Mountain View, CA",
            bullets: [
                "Led development of cloud-based machine learning infrastructure serving 1M+ users",
                "Reduced system latency by 40% through innovative caching mechanisms",
                "Mentored 5 junior engineers and conducted technical interviews",
                "Implemented CI/CD pipeline reducing deployment time by 60%"
            ],
            tags: ["Python", "TensorFlow", "Kubernetes", "Docker", "CI/CD"]
        },
        {
            title: "Microsoft",
            subtitle: "Software Engineer",
            duration: "2020-2022",
            location: "Seattle, WA",
            bullets: [
                "Developed microservices architecture for Azure cloud services",
                "Optimized database queries resulting in 30% performance improvement",
                "Created automated testing framework with 90% code coverage",
                "Collaborated with cross-functional teams to deliver features on schedule"
            ],
            tags: ["Java", "Spring Boot", "Azure", "SQL", "Microservices"]
        }
    ],
    skills: [
        {
            category: "Programming Languages",
            skills: ["Python", "Java", "JavaScript", "C++", "TypeScript", "Go"]
        },
        {
            category: "Frameworks & Libraries",
            skills: ["React", "Node.js", "Django", "Spring Boot", "TensorFlow"]
        }
    ],
    projects: [
        {
            title: "AI-Powered Healthcare Platform",
            subtitle: "Lead Developer",
            duration: "Jan 2022 - Present",
            location: "Personal Project",
            description: "A machine learning platform for early disease detection",
            bullets: [
                "Developed deep learning models achieving 95% accuracy in disease prediction",
                "Implemented real-time data processing pipeline handling 10K+ requests/second",
                "Integrated with electronic health records systems via HL7 FHIR standard"
            ],
            links: [
                "github.com/johndoe/healthcare-ai",
                "healthcare-ai-demo.com"
            ],
            tags: ["Python", "TensorFlow", "Docker", "Kubernetes", "MongoDB"]
        },
        {
            title: "Smart Home Automation System",
            subtitle: "Project Owner",
            duration: "Jun 2021 - Dec 2021",
            location: "University Project",
            description: "IoT-based home automation system with voice control",
            bullets: [
                "Built a scalable IoT architecture supporting 50+ connected devices",
                "Implemented voice recognition with 98% accuracy using NLP",
                "Reduced energy consumption by 30% through smart scheduling JavaScript"
            ],
            tags: ["JavaScript", "Node.js", "MongoDB", "Raspberry Pi", "AWS IoT"]
        }
    ],
    competitions: [
        {
            title: "International Hackathon 2022",
            subtitle: "First Place Winner",
            duration: "March 2022",
            location: "Virtual Event",
            bullets: [
                "Led team of 4 developers to create an AI-powered waste sorting system",
                "Presented solution to panel of industry experts",
                "Won $10,000 prize and incubation opportunity"
            ]
        },
        {
            title: "ACM Programming Contest",
            subtitle: "Regional Finalist",
            duration: "November 2021",
            location: "San Francisco, CA",
            description: "Annual algorithmic programming competition",
            bullets: [
                "Solved 8 out of 10 complex algorithmic problems",
                "Ranked 3rd among 50 participating teams",
                "Advanced to national finals"
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