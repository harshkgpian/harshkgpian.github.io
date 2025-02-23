const RESUME_CONFIG = {
    // Page Configuration
    page: {
        unit: 'pt',  // Use points for precise control
        format: 'a4',
        orientation: 'portrait',
        margins: {
            top: 40,
            bottom: 40,
            left: 40,
            right: 40
        }
    },

    // Typography Configuration
    fonts: {
        header: {
            size: 24,
            style: 'helvetica',
            weight: 'bold',
            color: '#000000',
            lineHeight: 1.2
        },
        sectionHeader: {
            size: 14,
            style: 'helvetica',
            weight: 'bold',
            color: '#000000',
            lineHeight: 1.2
        },
        normal: {
            size: 11,
            style: 'helvetica',
            weight: 'normal',
            color: '#000000',
            lineHeight: 1.15
        },
        small: {
            size: 10,
            style: 'helvetica',
            weight: 'normal',
            color: '#444444',
            lineHeight: 1.1
        }
    },

    // Spacing Configuration
    spacing: {
        sectionGap: 20,      // Space between sections
        lineGap: 12,         // Space between lines
        bulletGap: 8,        // Space between bullet points
        paragraphGap: 15,    // Space between paragraphs
        headerGap: 15,       // Space after headers
        indentation: 10      // Indentation for bullet points
    },

    // Section Dividers
    divider: {
        style: 'line',       // 'line' or 'space'
        width: 0.5,          // Line width for dividers
        color: '#000000',    // Color of dividers
        spacing: 8           // Space around dividers
    },

    // Content Formatting
    formatting: {
        dateAlignment: 'right',
        bulletStyle: '',
        maxLineWidth: 500,    // Maximum width for text lines
        textAlign: {
            header: 'center',
            section: 'left',
            body: 'left'
        }
    },

    // Colors
    colors: {
        primary: '#000000',
        secondary: '#444444',
        accent: '#666666',
        links: '#0000EE'
    },

    // Section Specific Settings
    sections: {
        header: {
            spacing: 30,
            contactSeparator: ' | '
        },
        experience: {
            dateStyle: 'bold',
            companyStyle: 'bold',
            locationStyle: 'italic'
        },
        education: {
            dateStyle: 'normal',
            schoolStyle: 'bold',
            degreeStyle: 'italic'
        },
        skills: {
            style: 'comma',  // 'comma' or 'bullet'
            columns: 1
        }
    },

    // Content Limits
    limits: {
        maxBulletPoints: 6,    // Maximum bullet points per experience
        maxExperiences: 5,     // Maximum experiences to show
        maxEducation: 3,       // Maximum education entries
        maxSkills: 15,         // Maximum skills to list
        summaryLength: 500     // Maximum characters in summary
    }
};