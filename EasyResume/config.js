// config.js
const RESUME_CONFIG = {
    page: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        margins: {
            top: 15,
            right: 7,
            bottom: 15,
            left: 7
        }
    },
    fonts: {
        header: {
            style: 'times',
            weight: 'bold',
            size: 20,
            color: '#000000'
        },
        sectionHeader: {
            style: 'times',
            weight: 'bold',
            size: 12,
            color: '#000000'
        },
        sectionTitle: {
            style: 'times',
            weight: 'bold',
            size: 11,
            color: '#000000'
        },
        normal: {
            style: 'times',
            weight: 'normal',
            size: 11,
            color: '#000000'
        },
        small: {
            style: 'times',
            weight: 'bolditalic',
            size: 9,
            color: '#000000'
        }
    },
    spacing: {
        sectionGap: 3,
        headerGap: 6,
        lineGap: 5,
        paragraphGap: 2,
        indentation: 2,
        skillIndentation: 42
    },
    formatting: {
        textAlign: {
            header: 'center',
            section: 'left'
        },
        maxLineWidth: 180,
        dateAlignment: 'right',
        bulletStyle: '•'
    },
    divider: {
        style: 'line',
        color: '#000000',
        width: 0.2,
        spacing: 3
    },
    sections: {
        header: {
            contactSeparator: ' | ',
            icons: {
                size: 3,
                spacing: 1,
                contactSpacing: 4,
                verticalOffset: 0.75,
                urls: {
                    email: "https://cdn-icons-png.flaticon.com/128/712/712040.png",
                    phone: "https://cdn-icons-png.flaticon.com/128/25/25377.png",
                    linkedin: "https://cdn-icons-png.flaticon.com/128/61/61109.png",
                    github: "https://cdn-icons-png.flaticon.com/128/733/733609.png"
                }
            }
        },
    },
    limits: {
        maxBulletPoints: 6
    }
};

// Load config from localStorage if available, otherwise use default
let currentConfig = loadConfigFromLocalStorage() || RESUME_CONFIG;

// Function to load configuration from localStorage
function loadConfigFromLocalStorage() {
    const savedConfig = localStorage.getItem('resumeConfig');
    if (savedConfig) {
        try {
            return JSON.parse(savedConfig);
        } catch (e) {
            console.error('Error parsing saved config:', e);
            return null;
        }
    }
    return null;
}

// Function to save configuration to localStorage
function saveConfigToLocalStorage() {
    try {
        localStorage.setItem('resumeConfig', JSON.stringify(currentConfig));
        console.log('Configuration saved to localStorage');
    } catch (e) {
        console.error('Error saving config to localStorage:', e);
    }
}

function openConfigModal() {
    const modal = document.getElementById('configModal');
    modal.style.display = 'block';
    loadCurrentConfig();
    window.addEventListener('keypress', function(e) {    
        if (e.key === 'Enter') {
            saveConfig();
        }
    });
}

function closeConfigModal() {
    document.getElementById('configModal').style.display = 'none';
}

function loadCurrentConfig() {
    document.getElementById('pageFormat').value = currentConfig.page.format;

    // Margin Settings
    document.getElementById('marginRight').value = currentConfig.page.margins.right;
    document.getElementById('marginLeft').value = currentConfig.page.margins.left;
    // Font Settings
    document.getElementById('headerFont').value = currentConfig.fonts.header.style;
    document.getElementById('headerWeight').value = currentConfig.fonts.header.weight;
    document.getElementById('headerSize').value = currentConfig.fonts.header.size;
    document.getElementById('headerColor').value = currentConfig.fonts.header.color;
    
    document.getElementById('sectionTitleFont').value = currentConfig.fonts.sectionTitle.style;
    document.getElementById('sectionTitleWeight').value = currentConfig.fonts.sectionTitle.weight;
    document.getElementById('sectionTitleSize').value = currentConfig.fonts.sectionTitle.size;
    document.getElementById('sectionTitleColor').value = currentConfig.fonts.sectionTitle.color;
    
    document.getElementById('sectionHeaderFont').value = currentConfig.fonts.sectionHeader.style;
    document.getElementById('sectionHeaderWeight').value = currentConfig.fonts.sectionHeader.weight;
    document.getElementById('sectionHeaderSize').value = currentConfig.fonts.sectionHeader.size;
    document.getElementById('sectionHeaderColor').value = currentConfig.fonts.sectionHeader.color;
    
    document.getElementById('normalFont').value = currentConfig.fonts.normal.style;
    document.getElementById('normalWeight').value = currentConfig.fonts.normal.weight;
    document.getElementById('normalSize').value = currentConfig.fonts.normal.size;
    document.getElementById('normalColor').value = currentConfig.fonts.normal.color;
    
    document.getElementById('smallFont').value = currentConfig.fonts.small.style;
    document.getElementById('smallWeight').value = currentConfig.fonts.small.weight;
    document.getElementById('smallSize').value = currentConfig.fonts.small.size;
    document.getElementById('smallColor').value = currentConfig.fonts.small.color;
    
    // Spacing Settings
    document.getElementById('sectionGap').value = currentConfig.spacing.sectionGap;
    document.getElementById('headerGap').value = currentConfig.spacing.headerGap;
    document.getElementById('lineGap').value = currentConfig.spacing.lineGap;
    document.getElementById('paragraphGap').value = currentConfig.spacing.paragraphGap;
    document.getElementById('indentation').value = currentConfig.spacing.indentation;
    document.getElementById('skillIndentation').value = currentConfig.spacing.skillIndentation;
    
    // Formatting Settings
    document.getElementById('headerAlign').value = currentConfig.formatting.textAlign.header;
    document.getElementById('sectionAlign').value = currentConfig.formatting.textAlign.section;
    document.getElementById('bulletStyle').value = currentConfig.formatting.bulletStyle;
    
    // Divider Settings
    document.getElementById('dividerStyle').value = currentConfig.divider.style;
    document.getElementById('dividerColor').value = currentConfig.divider.color;
    document.getElementById('dividerWidth').value = currentConfig.divider.width;
    document.getElementById('iconSize').value = currentConfig.sections.header.icons.size;
    document.getElementById('iconSpacing').value = currentConfig.sections.header.icons.spacing;
    document.getElementById('contactSpacing').value = currentConfig.sections.header.icons.contactSpacing;
    document.getElementById('iconVerticalOffset').value = currentConfig.sections.header.icons.verticalOffset;
}

function saveConfig() {
    currentConfig = {
        page: {
            unit: 'mm',
            format: document.getElementById('pageFormat').value,
            orientation: 'portrait',
            margins: {
                top: 15,
                right: Number(document.getElementById('marginRight').value),
                bottom: 15,
                left: Number(document.getElementById('marginLeft').value)
            }
        },
        fonts: {
            header: {
                style: document.getElementById('headerFont').value,
                weight: document.getElementById('headerWeight').value,
                size: Number(document.getElementById('headerSize').value),
                color: document.getElementById('headerColor').value
            },
            sectionHeader: {
                style: document.getElementById('sectionHeaderFont').value,
                weight: document.getElementById('sectionHeaderWeight').value,
                size: Number(document.getElementById('sectionHeaderSize').value),
                color: document.getElementById('sectionHeaderColor').value
            },
            sectionTitle: {
                style: document.getElementById('sectionTitleFont').value,
                weight: document.getElementById('sectionTitleWeight').value,
                size: Number(document.getElementById('sectionTitleSize').value),
                color: document.getElementById('sectionTitleColor').value
            },
            normal: {
                style: document.getElementById('normalFont').value,
                weight: document.getElementById('normalWeight').value,
                size: Number(document.getElementById('normalSize').value),
                color: document.getElementById('normalColor').value
            },
            small: {
                style: document.getElementById('smallFont').value,
                weight: document.getElementById('smallWeight').value,
                size: Number(document.getElementById('smallSize').value),
                color: document.getElementById('smallColor').value
            }
        },
        spacing: {
            sectionGap: Number(document.getElementById('sectionGap').value),
            headerGap: Number(document.getElementById('headerGap').value),
            lineGap: Number(document.getElementById('lineGap').value),
            paragraphGap: Number(document.getElementById('paragraphGap').value),
            indentation: Number(document.getElementById('indentation').value),
            skillIndentation: Number(document.getElementById('skillIndentation').value)
        },
        formatting: {
            textAlign: {
                header: document.getElementById('headerAlign').value,
                section: document.getElementById('sectionAlign').value
            },
            maxLineWidth: 180,
            dateAlignment: 'right',
            bulletStyle: document.getElementById('bulletStyle').value
        },
        divider: {
            style: document.getElementById('dividerStyle').value,
            color: document.getElementById('dividerColor').value,
            width: Number(document.getElementById('dividerWidth').value),
            spacing: 3
        },
        sections: {
            header: {
                contactSeparator: ' | ',
                icons: {
                    size: Number(document.getElementById('iconSize').value),
                    spacing: Number(document.getElementById('iconSpacing').value),
                    contactSpacing: Number(document.getElementById('contactSpacing').value),
                    verticalOffset: Number(document.getElementById('iconVerticalOffset').value),
                    urls: {
                        email: "https://cdn-icons-png.flaticon.com/128/712/712040.png",
                        phone: "https://cdn-icons-png.flaticon.com/128/25/25377.png",
                        linkedin: "https://cdn-icons-png.flaticon.com/128/61/61109.png",
                        github: "https://cdn-icons-png.flaticon.com/128/733/733609.png"
                    }
                }
            },
        },
        limits: {
            maxBulletPoints: 6
        }
    };

    // Save to localStorage
    saveConfigToLocalStorage();

    // Close modal
    document.getElementById('configModal').style.display = 'none';
    
    // Regenerate resume with new configuration
    generateResume();
    setTimeout(updateAllBulletWidthInfo, 100); 
}

// Add a function to reset config to defaults
function resetConfig() {
    if (confirm('Are you sure you want to reset all configuration to defaults?')) {
        localStorage.removeItem('resumeConfig');
        currentConfig = RESUME_CONFIG;
        loadCurrentConfig();
        generateResume();
        setTimeout(updateAllBulletWidthInfo, 100);
    }
}