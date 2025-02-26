class ResumeBuilder {
    constructor(config = RESUME_CONFIG) {
        this.config = config;
        this.content = {};
        this.initDocument();
    }

    initDocument() {
        this.doc = new window.jspdf.jsPDF({
            unit: this.config.page.unit,
            format: this.config.page.format,
            orientation: this.config.page.orientation
        });
        this.currentY = this.config.page.margins.top;
        this.pageWidth = this.doc.internal.pageSize.width;
        this.contentWidth = this.pageWidth - (this.config.page.margins.left + this.config.page.margins.right);
    }

    // Modify the renderContent method to include skills
    
    addProfessionalSummary(summary) {
        // Check if summary is a string, otherwise convert it
        const summaryText = typeof summary === 'string' ? summary : 
                            (summary && summary.toString ? summary.toString() : '');
        
        if (!summaryText || summaryText.trim() === '') return;
        
        this.checkAndAddPage();
        
        // Add section header
        this.addSection('PROFESSIONAL SUMMARY', null);
        
        // Render the summary text with proper wrapping
        this.setFont('normal');
        const summaryLines = this.doc.splitTextToSize(
            summaryText,
            this.contentWidth
        );
        
        summaryLines.forEach(line => {
            this.checkAndAddPage();
            this.doc.text(line, this.config.page.margins.left, this.currentY);
            this.currentY += this.config.spacing.lineGap;
        });
        
        this.currentY += this.config.spacing.paragraphGap;
    }

    // Update the renderContent method to include the professional summary section
    renderContent(content, sectionOrder = ['header', 'summary', 'education', 'experience', 'projects', 'competitions', 'skills']) {
        console.log("Content received:", content);
        this.content = content;
        
        this.doc = new window.jspdf.jsPDF({
            unit: this.config.page.unit,
            format: this.config.page.format,
            orientation: this.config.page.orientation
        });
        
        this.currentY = this.config.page.margins.top;

        // Iterate through the section order and render each section if it exists
        sectionOrder.forEach(section => {
            switch(section.toLowerCase()) {
                case 'header':
                    if (content.header) {
                        this.addHeader(content.header.name, content.header.contacts);
                    }
                    break;

                case 'summary':
                    // Safely handle summary data, even if it's an object
                    if (content.summary) {
                        const summaryText = typeof content.summary === 'string' ? 
                            content.summary : 
                            (content.summary.toString ? content.summary.toString() : '');
                        
                        if (summaryText.trim() !== '') {
                            this.addProfessionalSummary(summaryText);
                        }
                    }
                    break;

                case 'education':
                    // Rest of cases remain the same
                    // ...
                    if (content.education && content.education.length > 0) {
                        this.addSection('EDUCATION', null);
                        content.education.forEach(edu => {
                            this.addEducation(
                                edu.school,
                                edu.degree,
                                edu.duration,
                                edu.location,
                                edu.gpa,
                                edu.scoreType
                            );
                        });
                    }
                    break;

                case 'skills':
                    if (content.skills && Object.keys(content.skills).length > 0) {
                        this.addSkills(content.skills);
                    }
                    break;

                default:
                    // Handle experience, projects, competitions, and any other sections
                    if (content[section] && Array.isArray(content[section])) {
                        this.addGeneralSection(section.toUpperCase(), content[section]);
                    }
                    break;
            }
        });
    }

    setFont(type) {
        const font = this.config.fonts[type];
        this.doc.setFont(font.style, font.weight);
        this.doc.setFontSize(font.size);
        this.doc.setTextColor(font.color);
    }

    checkAndAddPage() {
        const pageHeight = this.doc.internal.pageSize.height;
        if (this.currentY + this.config.page.margins.bottom > pageHeight) {
            this.doc.addPage();
            this.currentY = this.config.page.margins.top;
        }
    }
    
    addHeader(name, contacts) {
        const headerConfig = this.config.sections.header;
        const iconConfig = headerConfig.icons;
        
        this.setFont('header');
        this.checkAndAddPage();
        if (this.config.formatting.textAlign.header === 'center') {
            this.doc.text(name, this.pageWidth / 2, this.currentY, { align: 'center' });
        } else {
            this.doc.text(name, this.config.page.margins.left, this.currentY);
        }
        this.currentY += this.config.spacing.headerGap;

        if (contacts && contacts.length > 0) {
            this.checkAndAddPage();
            this.setFont('small');
            
            // Find different types of contacts
            const emailContact = contacts.find(contact => contact.includes('@'));
            const phoneContact = contacts.find(contact => /[\d-+()]{7,}/.test(contact));
            const linkedinContact = contacts.find(contact => contact.includes('linkedin'));
            const githubContact = contacts.find(contact => contact.includes('github'));
            const otherContacts = contacts.filter(contact => 
                !contact.includes('@') && 
                !/[\d-+()]{7,}/.test(contact) && 
                !contact.includes('linkedin') && 
                !contact.includes('github')
            );

            try {
                // Calculate total width first
                let totalWidth = 0;
                const contactsToAdd = [
                    { contact: emailContact, key: 'email' },
                    { contact: phoneContact, key: 'phone' },
                    { contact: linkedinContact, key: 'linkedin' },
                    { contact: githubContact, key: 'github' }
                ].filter(item => item.contact);

                // Format the display text for each contact type
                contactsToAdd.forEach(item => {
                    if (item.contact) {
                        // Create display versions of contacts
                        if (item.key === 'linkedin') {
                            // Extract username from LinkedIn URL
                            item.displayText = item.contact.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '')
                                .replace(/\/$/, ''); // Remove trailing slash if present
                        } else if (item.key === 'github') {
                            // Extract username from GitHub URL
                            item.displayText = item.contact.replace(/https?:\/\/(www\.)?github\.com\//, '')
                                .replace(/\/$/, ''); // Remove trailing slash if present
                        } else if (item.key === 'phone') {
                            // Remove spaces from phone numbers
                            item.displayText = item.contact.replace(/\s+/g, '');
                        } else {
                            item.displayText = item.contact;
                        }
                        
                        // Calculate width for this contact
                        totalWidth += iconConfig.size + iconConfig.spacing; // Icon width + spacing
                        totalWidth += this.doc.getTextWidth(item.displayText) + iconConfig.contactSpacing; // Text width + spacing
                    }
                });

                // Calculate width for other contacts
                if (otherContacts.length > 0) {
                    const otherContactsText = otherContacts.join(headerConfig.contactSeparator);
                    totalWidth += this.doc.getTextWidth(otherContactsText);
                }

                // Calculate starting X position to center everything
                let currentX = this.config.formatting.textAlign.header === 'center'
                    ? (this.pageWidth / 2) - (totalWidth / 2)
                    : this.config.page.margins.left;

                const addContactWithIcon = (contactObj) => {
                    if (contactObj.contact) {
                        // Add icon
                        this.doc.addImage(
                            iconConfig.urls[contactObj.key],
                            'PNG',
                            currentX,
                            this.currentY - (iconConfig.size * iconConfig.verticalOffset),
                            iconConfig.size,
                            iconConfig.size
                        );
                        currentX += iconConfig.size + iconConfig.spacing;
                        
                        // Display the formatted text version
                        const displayText = contactObj.displayText;
                        
                        // Create appropriate links
                        if (contactObj.key === 'linkedin') {
                            // Create LinkedIn hyperlink
                            const url = contactObj.contact.startsWith('http') ? contactObj.contact : 
                                    `https://linkedin.com/in/${displayText}`;
                            
                            const linkWidth = this.doc.getTextWidth(displayText);
                            this.doc.text(displayText, currentX, this.currentY);
                            this.doc.link(currentX, this.currentY - 5, linkWidth, 10, { url });
                        } 
                        else if (contactObj.key === 'github') {
                            // Create GitHub hyperlink
                            const url = contactObj.contact.startsWith('http') ? contactObj.contact : 
                                    `https://github.com/${displayText}`;
                            
                            const linkWidth = this.doc.getTextWidth(displayText);
                            this.doc.text(displayText, currentX, this.currentY);
                            this.doc.link(currentX, this.currentY - 5, linkWidth, 10, { url });
                        } 
                        else if (contactObj.key === 'email') {
                            // Create mailto link for email
                            const linkWidth = this.doc.getTextWidth(displayText);
                            this.doc.text(displayText, currentX, this.currentY);
                            this.doc.link(currentX, this.currentY - 5, linkWidth, 10, { url: `mailto:${contactObj.contact}` });
                        }
                        else if (contactObj.key === 'phone') {
                            // Create tel link for phone
                            const linkWidth = this.doc.getTextWidth(displayText);
                            this.doc.text(displayText, currentX, this.currentY);
                            this.doc.link(currentX, this.currentY - 5, linkWidth, 10, { url: `tel:${contactObj.contact.replace(/\s+/g, '')}` });
                        }  
                        else {
                            this.doc.text(displayText, currentX, this.currentY);
                        }
                        
                        currentX += this.doc.getTextWidth(displayText) + iconConfig.contactSpacing;
                    }
                };

                // Add contacts with their respective icons
                contactsToAdd.forEach(item => addContactWithIcon(item));

                // Add remaining contacts if any
                if (otherContacts.length > 0) {
                    const otherContactsText = otherContacts.join(headerConfig.contactSeparator);
                    this.doc.text(otherContactsText, currentX, this.currentY);
                }

            } catch (error) {
                console.error('Error loading icons:', error);
                // Fallback: show all contacts without icons
                if (this.config.formatting.textAlign.header === 'center') {
                    this.doc.text(contacts.join(headerConfig.contactSeparator), 
                        this.pageWidth / 2, this.currentY, { align: 'center' });
                } else {
                    this.doc.text(contacts.join(headerConfig.contactSeparator), 
                        this.config.page.margins.left, this.currentY);
                }
            }
            
            this.currentY += this.config.spacing.headerGap;
        }
    }
    
    addSection(title, content) {
        this.checkAndAddPage();
        this.setFont('sectionHeader');
        this.doc.text(title.toUpperCase(), this.config.page.margins.left, this.currentY);
        this.currentY += this.config.spacing.sectionGap;

        if (this.config.divider.style === 'line') {
            this.addDivider();
        }

        if (content) {
            this.setFont('normal');
            const lines = this.doc.splitTextToSize(content, this.config.formatting.maxLineWidth);
            lines.forEach(line => {
                this.checkAndAddPage();
                this.doc.text(line, this.config.page.margins.left, this.currentY);
                this.currentY += this.config.spacing.lineGap;
            });
        }
        
        this.currentY += this.config.spacing.sectionGap;
    }


    addEducation(school, degree, duration, location, gpa = null, scoreType) {
        console.log('Adding education:', school, degree, duration, location, gpa, scoreType);

        this.checkAndAddPage();
        
        // Render school name
        this.setFont('sectionTitle');
        this.doc.text(school, this.config.page.margins.left, this.currentY);
        
        // Render duration if available
        if (duration && this.config.formatting.dateAlignment === 'right') {
            this.setFont('sectionTitle');
            this.doc.text(duration, 
                this.pageWidth - this.config.page.margins.right - this.doc.getTextWidth(duration), 
                this.currentY
            );
        }
        
        this.currentY += this.config.spacing.lineGap;

        // Render degree and GPA
        this.checkAndAddPage();
        this.setFont('small');
        this.doc.text(degree, this.config.page.margins.left, this.currentY);
        
        // Add GPA/score if available
        if (gpa !== null) {
            const degreeWidth = this.doc.getTextWidth(degree);
            const scoreLabel = scoreType ? `${scoreType}: ` : 'CGPA: ';
            console.log(scoreLabel, scoreType, "Hi");
            const gpaText = ` | ${scoreLabel}${gpa}`;
            
            // Switch to bold font for GPA
            this.setFont('small');
            this.doc.text(
                gpaText,
                this.config.page.margins.left + degreeWidth,
                this.currentY
            );
        }
        
        // Render location
        if (location) {
            this.setFont('small');
            this.doc.text(location, 
                this.pageWidth - this.config.page.margins.right - this.doc.getTextWidth(location), 
                this.currentY
            );
        }
        
        this.currentY += this.config.spacing.lineGap;

        // Render honors if available

        this.currentY += this.config.spacing.paragraphGap;
    }

    addSkills(skillsObject) {
        if (!skillsObject || Object.keys(skillsObject).length === 0) return;
    
        // Add SKILLS header
        this.addSection('SKILLS', null);
        
        // Calculate max category width to find the consistent starting position for skills
        const categoryWidth = this.config.spacing.skillIndentation; // Fixed width for all categories (in points)
        const skillStartX = this.config.page.margins.left + categoryWidth;
        
        Object.entries(skillsObject).forEach(([category, skills], index) => {
            if (!skills || skills.length === 0) return;
    
            this.checkAndAddPage();
            
            // Store current font properties
            this.setFont('normal');
            const currentFont = this.doc.getFont();
            const currentFontSize = this.doc.getFontSize();
            
            // Add category in bold using the same font
            this.doc.setFont(currentFont.fontName, 'bold');
            const categoryText = `${category}: `;
            
            // Check if category width exceeds the allowed indentation
            const categoryTextWidth = this.doc.getTextWidth(categoryText);
            
            if (categoryTextWidth > categoryWidth) {
                // For long categories, wrap within the category column
                const wrappedCategory = this.doc.splitTextToSize(categoryText, categoryWidth);
                
                // Draw the first line of the category
                this.doc.text(
                    wrappedCategory[0],
                    this.config.page.margins.left,
                    this.currentY
                );
                
                // Draw the skills at the fixed position on the first line
                this.doc.setFont(currentFont.fontName, currentFont.fontStyle);
                const skillsText = skills.join(', ');
                const availableWidth = this.contentWidth - categoryWidth;
                const wrappedSkills = this.doc.splitTextToSize(skillsText, availableWidth);
                
                this.doc.text(
                    wrappedSkills[0],
                    skillStartX,
                    this.currentY
                );
                
                // Draw the remaining category lines (if any)
                if (wrappedCategory.length > 1) {
                    for (let i = 1; i < wrappedCategory.length; i++) {
                        this.currentY += this.config.spacing.lineGap;
                        this.checkAndAddPage();
                        this.doc.setFont(currentFont.fontName, 'bold');
                        this.doc.text(
                            wrappedCategory[i],
                            this.config.page.margins.left,
                            this.currentY
                        );
                    }
                }
                
                // Draw the remaining skill lines (if any)
                if (wrappedSkills.length > 1) {
                    // Only add line gap if we haven't already due to category wrapping
                    if (wrappedCategory.length <= 1) {
                        this.currentY += this.config.spacing.lineGap;
                    }
                    
                    for (let i = 1; i < wrappedSkills.length; i++) {
                        if (i > 1 || wrappedCategory.length <= 1) {
                            this.currentY += this.config.spacing.lineGap;
                        }
                        this.checkAndAddPage();
                        this.doc.setFont(currentFont.fontName, currentFont.fontStyle);
                        this.doc.text(
                            wrappedSkills[i],
                            skillStartX,
                            this.currentY
                        );
                    }
                }
            } else {
                // Original behavior when category fits within indentation
                this.doc.text(
                    categoryText,
                    this.config.page.margins.left,
                    this.currentY
                );
                
                // Switch back to normal weight for skills
                this.doc.setFont(currentFont.fontName, currentFont.fontStyle);
                
                // Add skills with fixed starting position
                const skillsText = skills.join(', ');
                const availableWidth = this.contentWidth - categoryWidth;
                const wrappedSkills = this.doc.splitTextToSize(skillsText, availableWidth);
                
                // Position for first line of skills (same line as category)
                this.doc.text(
                    wrappedSkills[0],
                    skillStartX,
                    this.currentY
                );
                
                // If there are additional wrapped lines
                if (wrappedSkills.length > 1) {
                    wrappedSkills.slice(1).forEach(line => {
                        this.currentY += this.config.spacing.lineGap;
                        this.checkAndAddPage();
                        this.doc.text(
                            line,
                            skillStartX,
                            this.currentY
                        );
                    });
                }
            }
    
            // Add more space between skill categories
            this.currentY += this.config.spacing.lineGap;
        });
    
        // Add final spacing after skills section
        this.currentY += this.config.spacing.sectionGap;
    }
    addGeneralSection(sectionTitle, entries) {
        if (!entries || entries.length === 0) return;
    
        // Add section header
        this.addSection(sectionTitle.toUpperCase(), null);
    
        entries.forEach(entry => {
            const {
                title,
                titleLink,
                subtitle,
                subtitleLink,
                duration,
                location,
                description,
                bullets,
                tags
            } = entry;
    
            this.checkAndAddPage();
    
            // Render title with hyperlink if available
            this.setFont('sectionTitle');
            
            // Fix for title hyperlink
            // Render title with hyperlink if available
            this.setFont('sectionTitle');

            if (titleLink) {
                // Save current text color
                const currentTextColor = this.doc.getTextColor();
                
                // Change text color for links (use blue or any color you prefer)
                // this.doc.setTextColor(0, 0, 255); // RGB for blue
                
                // Optional: add underline
                this.doc.setLineWidth(0.05);
                const titleWidth = this.doc.getTextWidth(title);
                
                // Render text
                this.doc.text(title, this.config.page.margins.left, this.currentY);
                
                // Add underline
                this.doc.line(
                    this.config.page.margins.left,
                    this.currentY + 1, // Position slightly below text
                    this.config.page.margins.left + titleWidth,
                    this.currentY + 1
                );
                
                // Add clickable link
                this.doc.link(
                    this.config.page.margins.left, 
                    this.currentY - 10,
                    titleWidth, 
                    15,
                    { url: titleLink }
                );
                
                // Restore original text color
                this.doc.setTextColor(currentTextColor);
            } else {
                this.doc.text(title, this.config.page.margins.left, this.currentY);
            }
    
            // Render duration on the right if available
            if (duration && this.config.formatting.dateAlignment === 'right') {
                this.doc.text(
                    duration,
                    this.pageWidth - this.config.page.margins.right - this.doc.getTextWidth(duration),
                    this.currentY
                );
            }
            this.currentY += this.config.spacing.lineGap;
    
            // Render subtitle and location
            if (subtitle || location) {
                this.checkAndAddPage();
                if (subtitle) {
                    this.setFont('small');
                    // Fix for subtitle hyperlink
                    if (subtitleLink) {
                        // First render the text
                        this.doc.text(subtitle, this.config.page.margins.left, this.currentY);
                        
                        // Then add a clickable link area over the text
                        const subtitleWidth = this.doc.getTextWidth(subtitle);
                        this.doc.link(
                            this.config.page.margins.left, 
                            this.currentY - 5, // Position link slightly above text
                            subtitleWidth, 
                            10, // Make link area tall enough to be clickable
                            { url: subtitleLink }
                        );
                    } else {
                        this.doc.text(subtitle, this.config.page.margins.left, this.currentY);
                    }
                }
                if (location) {
                    this.setFont('small');
                    this.doc.text(
                        location,
                        this.pageWidth - this.config.page.margins.right - this.doc.getTextWidth(location),
                        this.currentY
                    );
                }
                this.currentY += this.config.spacing.lineGap;
            }
    
            // Helper function to render text with bold tags
            const renderTextWithBoldTags = (text, xPos, tags) => {
                if (!tags || tags.length === 0) {
                    this.doc.text(text, xPos, this.currentY);
                    return;
                }
    
                // Store current font properties
                const currentFont = this.doc.getFont();
                const currentFontSize = this.doc.getFontSize();
    
                // Create regex pattern from tags
                const tagPattern = new RegExp(`(${tags.join('|')})`, 'gi');
                const parts = text.split(tagPattern);
    
                let currentX = xPos;
                parts.forEach(part => {
                    const matchesTag = tags.some(tag => 
                        part.toLowerCase() === tag.toLowerCase()
                    );
    
                    if (matchesTag) {
                        // Apply bold style while maintaining font size
                        this.doc.setFont(currentFont.fontName, 'bold');
                        this.doc.setFontSize(currentFontSize);
                    } else {
                        // Restore original font style
                        this.doc.setFont(currentFont.fontName, currentFont.fontStyle);
                        this.doc.setFontSize(currentFontSize);
                    }
    
                    this.doc.text(part, currentX, this.currentY);
                    currentX += this.doc.getTextWidth(part);
                });
    
                // Restore original font settings
                this.doc.setFont(currentFont.fontName, currentFont.fontStyle);
                this.doc.setFontSize(currentFontSize);
            };
    
            // Render description if available
            if (description) {
                this.checkAndAddPage();
                this.setFont('normal');
                const descriptionLines = this.doc.splitTextToSize(
                    description,
                    this.contentWidth
                );
                descriptionLines.forEach(line => {
                    renderTextWithBoldTags(line, this.config.page.margins.left, tags);
                    this.currentY += this.config.spacing.lineGap;
                });
            }
    
            // Render bullet points if available
            if (bullets && bullets.length > 0) {
                this.setFont('normal');
                bullets.forEach(bullet => {
                    // Get total available width for bullet text
                    const availableWidth = this.contentWidth - this.config.spacing.indentation;
                    
                    // Calculate the actual width of the bullet text with current font
                    this.setFont('normal'); // Ensure we're using the correct font for measurement
                    
                    // Split bullet text to fit available width
                    const bulletText = this.doc.splitTextToSize(
                        bullet.trim(),
                        availableWidth
                    );

                    bulletText.forEach((line, index) => {
                        this.checkAndAddPage();
                        if (index === 0) {
                            this.doc.text(
                                this.config.formatting.bulletStyle,
                                this.config.page.margins.left,
                                this.currentY
                            );
                        }
                        renderTextWithBoldTags(
                            line,
                            this.config.page.margins.left + this.config.spacing.indentation,
                            tags
                        );
                        this.currentY += this.config.spacing.lineGap;
                    });
                });
            }
    
            this.currentY += this.config.spacing.paragraphGap;
        });
    }

    addDivider() {
        this.checkAndAddPage();
        this.doc.setDrawColor(this.config.divider.color);
        this.doc.setLineWidth(this.config.divider.width);
        this.doc.line(
            this.config.page.margins.left,
            this.currentY,
            this.pageWidth - this.config.page.margins.right,
            this.currentY
        );
        this.currentY += this.config.divider.spacing;
    }

    getDataUrl() {
        return this.doc.output('dataurlstring');
    }

    save(filename) {
        this.doc.save(filename);
    }
}




