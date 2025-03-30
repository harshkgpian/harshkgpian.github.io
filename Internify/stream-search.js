/**
 * stream-search.js - Academic Stream Search functionality for Internship Website
 * Helps users find internships relevant to their academic field (Engineering, CS, etc.)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Stream definitions with keywords for each field
    const streamDefinitions = {
      "Computer Science": {
        keywords: [
          "computer science", "software", "web development", "app development", "mobile", 
          "frontend", "backend", "full stack", "fullstack", "javascript", "python", "java", 
          "c++", "programming", "coding", "developer", "html", "css", "react", "node", 
          "angular", "vue", "database", "sql", "nosql", "mongodb", "devops", "cloud", 
          "aws", "azure", "machine learning", "deep learning", "ai", "artificial intelligence",
          "data science", "algorithms", "git", "github", "software engineer", "sde", "cs"
        ]
      },
      "Mechanical Engineering": {
        keywords: [
          "mechanical", "mechanical engineering", "cad", "cam", "solidworks", "autocad", 
          "thermodynamics", "fluid mechanics", "hvac", "manufacturing", "production", 
          "machining", "cnc", "3d printing", "robotics", "automation", "mechanical design", 
          "product design", "thermal", "automotive", "aerospace", "finite element analysis", 
          "fea", "computational fluid dynamics", "cfd", "dynamics", "kinematics", "mechatronics", 
          "inventor", "catia", "iot", "mech"
        ]
      },
      "Electrical Engineering": {
        keywords: [
          "electrical", "electrical engineering", "electronics", "circuitry", "pcb design", 
          "embedded systems", "vlsi", "verilog", "hdl", "microcontrollers", "power systems", 
          "control systems", "signal processing", "communications", "rf", "circuit design", 
          "arduino", "raspberry pi", "iot", "electric machines", "power electronics", 
          "renewable energy", "semiconductor", "digital electronics", "analog", "ee"
        ]
      },
      "Civil Engineering": {
        keywords: [
          "civil", "civil engineering", "structural", "construction", "building", "architecture", 
          "autocad", "revit", "bim", "surveying", "geotechnical", "transportation", 
          "environmental engineering", "water resources", "infrastructure", "project management", 
          "structural analysis", "concrete design", "steel design", "highways", "bridges", 
          "dams", "urban planning", "sustainability", "gis", "staad pro", "etabs"
        ]
      },
      "Aerospace Engineering": {
        keywords: [
          "aerospace", "aeronautical", "aviation", "aircraft", "spacecraft", "rocket", 
          "propulsion", "aerodynamics", "avionics", "flight mechanics", "satellite", 
          "space systems", "computational fluid dynamics", "cfd", "structures", "composites", 
          "aeroelasticity", "orbital mechanics", "aircraft design", "spacecraft design", 
          "airframe", "astronautics", "nasa", "isro", "wind tunnel", "aero", "drone"
        ]
      },
      "Chemical Engineering": {
        keywords: [
          "chemical", "chemical engineering", "chemistry", "process", "process engineering", 
          "petrochemical", "refinery", "reactor design", "thermodynamics", "fluid dynamics", 
          "heat transfer", "mass transfer", "unit operations", "aspen", "hysys", "chemcad", 
          "biochemical", "pharmaceutical", "polymer", "materials science", "process control", 
          "separation processes", "reaction engineering", "fermentation", "distillation"
        ]
      },
      "Biotechnology": {
        keywords: [
          "biotechnology", "biotech", "biomedical", "biology", "life sciences", "molecular biology", 
          "genetic engineering", "genomics", "proteomics", "bioinformatics", "biochemistry", 
          "microbiology", "immunology", "pharmaceutical", "bioprocess", "biomaterials", 
          "tissue engineering", "cell culture", "recombinant dna", "crispr", "bioreactor", 
          "biomedicine", "bio"
        ]
      },
      "Management & Business": {
        keywords: [
          "management", "business", "marketing", "finance", "accounting", "human resources", 
          "hr", "operations", "supply chain", "logistics", "consulting", "analytics", 
          "business development", "sales", "market research", "digital marketing", "seo", 
          "social media", "content", "brand", "e-commerce", "startup", "entrepreneurship", 
          "mba", "investment", "strategy", "administration", "commerce"
        ]
      },
      "Design": {
        keywords: [
          "design", "graphic design", "ui", "ux", "user interface", "user experience", 
          "product design", "industrial design", "web design", "visual design", "interaction design", 
          "animation", "illustration", "photoshop", "illustrator", "indesign", "figma", 
          "sketch", "adobe", "typography", "branding", "creative", "art direction", 
          "motion graphics", "3d design", "interior design", "fashion design"
        ]
      },
      "Content & Communication": {
        keywords: [
          "content", "content writing", "copywriting", "editing", "proofreading", "journalism", 
          "media", "communication", "content creation", "social media", "blog", "seo writing", 
          "technical writing", "creative writing", "scriptwriting", "public relations", "pr", 
          "advertising", "digital media", "content strategy", "content marketing"
        ]
      }
    };
  
    // Function to filter listings by selected stream
    function filterByStream() {
      const selectedStream = document.getElementById('streamFilter').value;
      const listingsContainer = document.getElementById('internshipListings');
      
      if (!selectedStream) {
        // If "All Streams" is selected, reset any stream filtering
        if (window.allInternships && window.allInternships.length > 0) {
          // Show all internships using the main script's filtering
          if (typeof window.filterAndSortData === 'function') {
            window.filterAndSortData();
          }
        }
        return;
      }
  
      // Show loading message
      listingsContainer.innerHTML = `<div class="loading">Finding the best ${selectedStream} internships for you...</div>`;
  
      // Get keywords for the selected stream
      const streamKeywords = streamDefinitions[selectedStream]?.keywords || [];
      if (streamKeywords.length === 0) return;
  
      // Make sure window.allInternships exists
      if (!window.allInternships || !Array.isArray(window.allInternships)) {
        console.error("allInternships is not available on the window object or is not an array");
        listingsContainer.innerHTML = '<div class="loading">Error: Unable to access internship data</div>';
        return;
      }
  
      console.log(`Filtering ${window.allInternships.length} internships for ${selectedStream}...`);
  
      // Filter internships based on stream keywords
      const streamFilteredInternships = window.allInternships.filter(internship => {
        // Search in job title
        const titleMatch = streamKeywords.some(keyword => 
          (internship.jobTitle || '').toLowerCase().includes(keyword)
        );
        
        // Search in skills
        const skillsMatch = internship.skills && streamKeywords.some(keyword => 
          internship.skills.some(skill => skill.toLowerCase().includes(keyword))
        );
        
        // Search in description (if available)
        const descriptionMatch = internship.description && streamKeywords.some(keyword => 
          internship.description.toLowerCase().includes(keyword)
        );
        
        // Search in company name (sometimes relevant)
        const companyMatch = streamKeywords.some(keyword => 
          (internship.companyName || '').toLowerCase().includes(keyword)
        );
        
        return titleMatch || skillsMatch || descriptionMatch || companyMatch;
      });
  
      console.log(`Found ${streamFilteredInternships.length} matches for ${selectedStream}`);
  
      // If we can't use the main script's populateCards function, create our own
      if (typeof window.populateCards !== 'function') {
        console.warn("Using fallback display method since populateCards is not available");
        displayFilteredResults(streamFilteredInternships, selectedStream);
      } else {
        window.populateCards(streamFilteredInternships);
      }
    }
  
    // Fallback function to display results if populateCards is not available
    function displayFilteredResults(internships, streamName) {
      const listingsContainer = document.getElementById('internshipListings');
      
      if (internships.length === 0) {
        listingsContainer.innerHTML = `<div class="loading">No internships found for ${streamName}</div>`;
        return;
      }
      
      // Clear the container
      listingsContainer.innerHTML = '';
      
      // Create a document fragment for better performance
      const fragment = document.createDocumentFragment();
      
      // Display the internships
      internships.forEach((internship, index) => {
        const card = document.createElement('div');
        card.className = 'job-card';
        
        // Check if remote
        const isRemote = (internship.location || '').toLowerCase().includes('remote') || 
                        (internship.location || '').toLowerCase().includes('work from home');
        const locationText = (internship.location || 'Not specified').replace('Work from home', 'WFH').replace('Remote', '');
        const locationDisplay = isRemote ? 
            `<div class="location">${locationText}<span class="remote-badge">Rem</span></div>` : 
            `<div class="location">${locationText}</div>`;
        
        // Format skills
        let skillsHTML = '';
        if (internship.skills && internship.skills.length > 0) {
          const visibleSkills = internship.skills.slice(0, 2);
          skillsHTML = visibleSkills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
          ).join('');
          
          if (internship.skills.length > 2) {
            skillsHTML += `<span class="skill-tag">+${internship.skills.length - 2} more</span>`;
          }
        }
        
        // Check if recent
        const isRecent = (internship.postedTime || '').toLowerCase().includes('hour') || 
                        (internship.postedTime || '').toLowerCase().includes('few');
        const postedTimeClass = isRecent ? 'posted-time recent' : 'posted-time';
        
        card.innerHTML = `
            <div class="job-header">
                <div class="job-title">${internship.jobTitle || 'Untitled Position'}</div>
                <div class="company-name">${internship.companyName || 'Unknown Company'}</div>
            </div>
            <div class="job-body">
                <div class="job-info">
                    <div class="info-item">
                        <span class="info-label">Location</span>
                        ${locationDisplay}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Duration</span>
                        <span class="info-value">${internship.duration || 'Not specified'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Stipend</span>
                        <span class="info-value stipend">${internship.stipend || 'Not specified'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Posted</span>
                        <span class="info-value">${internship.postedTime || 'Unknown'}</span>
                    </div>
                </div>
                <div class="skills-container">
                    ${skillsHTML}
                </div>
            </div>
            <div class="job-footer">
                <span class="${postedTimeClass}">${isRecent ? 'New • ' : ''}${internship.postedTime || 'Unknown'}</span>
                <a href="${internship.detailsUrl || '#'}" target="_blank" class="apply-btn">Apply</a>
            </div>
        `;
        
        fragment.appendChild(card);
      });
      
      // Add a result count header
      const resultHeader = document.createElement('div');
      resultHeader.className = 'results-header';
      resultHeader.innerHTML = `
        <div class="results-count">Found <span>${internships.length}</span> ${streamName} internships</div>
      `;
      
      listingsContainer.appendChild(resultHeader);
      listingsContainer.appendChild(fragment);
    }
  
    // Initialize the stream search functionality
    function initStreamSearch() {
      // Wait for the stream filter to be available in the DOM
      const streamFilter = document.getElementById('streamFilter');
      if (!streamFilter) {
        console.error("Stream filter element not found");
        return;
      }
  
      console.log("Stream search initialized");
  
      // Add event listener to the stream filter
      streamFilter.addEventListener('change', () => {
        console.log("Stream filter changed to:", streamFilter.value);
        filterByStream();
      });
  
      // Add direct access to allInternships array from script.js
      if (!window.allInternships) {
        // Set up a watcher for when allInternships becomes available
        Object.defineProperty(window, 'allInternships', {
          set: function(newValue) {
            this._allInternships = newValue;
            console.log(`allInternships updated with ${newValue.length} items`);
          },
          get: function() {
            return this._allInternships || [];
          }
        });
      }
    }
  
    // Run initialization when the page is loaded
    // Use a small delay to ensure the main script has initialized
    setTimeout(initStreamSearch, 1000);
  });