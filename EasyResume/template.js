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
    
    renderContent(content, sectionOrder = ['header', 'education', 'experience', 'projects', 'competitions','skills']) {
        console.log(content);
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
    
                case 'education':
                    if (content.education && content.education.length > 0) {
                        this.addSection('EDUCATION', null);
                        content.education.forEach(edu => {
                            this.addEducation(
                                edu.school,
                                edu.degree,
                                edu.duration,
                                edu.location,
                                edu.gpa,
                                edu.honors
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

    // Previous code remains the same until the setFont method...

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
        
        this.setFont('header');
        this.checkAndAddPage();
        if (this.config.formatting.textAlign.header === 'center') {
            this.doc.text(name, this.pageWidth / 2, this.currentY, { align: 'center' });
        } else {
            this.doc.text(name, this.config.page.margins.left, this.currentY);
        }
        this.currentY += headerConfig.spacing;

        if (contacts && contacts.length > 0) {
            this.checkAndAddPage();
            this.setFont('small');
            const contactText = contacts.join(headerConfig.contactSeparator);
            if (this.config.formatting.textAlign.header === 'center') {
                this.doc.text(contactText, this.pageWidth / 2, this.currentY, { align: 'center' });
            } else {
                this.doc.text(contactText, this.config.page.margins.left, this.currentY);
            }
            this.currentY += this.config.spacing.sectionGap;
        }
    }

    addSection(title, content) {
        this.checkAndAddPage();
        this.setFont('sectionHeader');
        this.doc.text(title.toUpperCase(), this.config.page.margins.left, this.currentY);
        this.currentY += this.config.spacing.headerGap;

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


    addEducation(school, degree, duration, location, gpa = null, honors = []) {
        const eduConfig = this.config.sections.education;

        this.checkAndAddPage();
        
        // Render school name
        this.setFont(eduConfig.schoolStyle === 'bold' ? 'sectionHeader' : 'normal');
        this.doc.text(school, this.config.page.margins.left, this.currentY);
        
        // Render duration if available
        if (duration && this.config.formatting.dateAlignment === 'right') {
            this.setFont(eduConfig.dateStyle === 'bold' ? 'sectionHeader' : 'normal');
            this.doc.text(duration, 
                this.pageWidth - this.config.page.margins.right - this.doc.getTextWidth(duration), 
                this.currentY
            );
        }
        
        this.currentY += this.config.spacing.lineGap;

        // Render degree and GPA
        this.checkAndAddPage();
        this.setFont('normal');
        this.doc.text(degree, this.config.page.margins.left, this.currentY);
        
        // Add GPA in bold if available
        if (gpa !== null && eduConfig.showGPA) {
            const degreeWidth = this.doc.getTextWidth(degree);
            const gpaText = ` | CGPA: ${gpa}`;
            
            // Switch to bold font for GPA
            this.setFont('normal');
            this.doc.text(
                gpaText,
                this.config.page.margins.left + degreeWidth,
                this.currentY
            );
        }
        
        // Render location
        if (location) {
            this.setFont(eduConfig.locationStyle === 'italic' ? 'small' : 'normal');
            this.doc.text(location, 
                this.pageWidth - this.config.page.margins.right - this.doc.getTextWidth(location), 
                this.currentY
            );
        }
        
        this.currentY += this.config.spacing.lineGap;

        // Render honors if available
        if (honors.length > 0 && eduConfig.showHonors) {
            this.setFont('normal');
            honors.forEach(honor => {
                const honorText = this.doc.splitTextToSize(
                    `• ${honor}`, 
                    this.contentWidth - this.config.spacing.indentation
                );
                
                honorText.forEach(line => {
                    this.checkAndAddPage();
                    this.doc.text(
                        line,
                        this.config.page.margins.left + this.config.spacing.indentation,
                        this.currentY
                    );
                    this.currentY += this.config.spacing.lineGap;
                });
            });
        }

        this.currentY += this.config.spacing.paragraphGap;
    }

    addSkills(skillsObject) {
        if (!skillsObject || Object.keys(skillsObject).length === 0) return;
    
        // Add SKILLS header
        this.addSection('SKILLS', null);
        
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
            const categoryWidth = this.doc.getTextWidth(categoryText);
            this.doc.text(
                categoryText,
                this.config.page.margins.left,
                this.currentY
            );
            
            // Switch back to normal weight for skills
            this.doc.setFont(currentFont.fontName, currentFont.fontStyle);
            
            // Add skills with proper spacing
            const skillsText = skills.join(', ');
            const availableWidth = this.contentWidth - categoryWidth;
            const wrappedSkills = this.doc.splitTextToSize(skillsText, availableWidth);
            
            // Position for first line of skills (same line as category)
            this.doc.text(
                wrappedSkills[0],
                this.config.page.margins.left + categoryWidth,
                this.currentY
            );
            
            // If there are additional wrapped lines
            if (wrappedSkills.length > 1) {
                wrappedSkills.slice(1).forEach(line => {
                    this.currentY += this.config.spacing.lineGap;
                    this.checkAndAddPage();
                    // Indent wrapped lines to align with first line of skills
                    this.doc.text(
                        line,
                        this.config.page.margins.left + categoryWidth,
                        this.currentY
                    );
                });
            }
    
            // Add more space between skill categories
            this.currentY += this.config.spacing.lineGap ;
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
                subtitle,
                duration,
                location,
                description,
                bullets,
                tags
            } = entry;
    
            this.checkAndAddPage();
    
            // Render title
            this.setFont('sectionHeader');
            this.doc.text(title, this.config.page.margins.left, this.currentY);
    
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
                    this.setFont('normal');
                    this.doc.text(subtitle, this.config.page.margins.left, this.currentY);
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
                    const bulletText = this.doc.splitTextToSize(
                        bullet.trim(),
                        this.contentWidth - this.config.spacing.indentation
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