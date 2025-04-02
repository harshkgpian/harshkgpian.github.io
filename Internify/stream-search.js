/**
 * improved-stream-search.js - Enhanced Academic Stream Search functionality for Internship Website
 * Provides accurate matching of internships to academic fields using relevance scoring
 */

document.addEventListener('DOMContentLoaded', () => {
    // Enhanced stream definitions with primary, secondary, and negative keywords
    const streamDefinitions = {
      "Computer Science": {
        // Primary keywords are highly relevant to this field (high matching score)
        primaryKeywords: [
          "computer science", "software engineer", "software developer", "full stack", "frontend developer", 
          "backend developer", "web developer", "mobile developer", "app developer", "data scientist", 
          "machine learning engineer", "artificial intelligence", "devops engineer", "cloud engineer", 
          "game developer"
        ],
        // Secondary keywords provide supporting evidence (medium matching score)
        secondaryKeywords: [
          "javascript", "python", "java", "c++", "c#", "programming", "coding", "html", "css", 
          "react", "node", "angular", "vue", "database", "sql", "nosql", "mongodb", "aws", 
          "azure", "git", "github", "algorithms", "data structures", "api", "restful", "sde", "cs"
        ],
        // Minimum match requirement - internship must contain at least one primary keyword
        // OR at least two secondary keywords to be considered
        minPrimaryMatches: 1,
        minSecondaryMatches: 2,
        // Negative keywords help exclude false matches (e.g., "technical writing" shouldn't match CS)
        negativeKeywords: [
          "electrical circuit", "mechanical design", "civil construction", "chemical process",
          "biomedical", "genetic", "aeronautical", "content writer", "seo specialist",
          "marketing", "data entry", "customer service", "sales", "accounting", "finance",
          "administrative", "virtual assistant", "social media manager"
        ],
        // Context pairs: if keyword1 appears near keyword2, it's highly relevant
        contextPairs: [
          ["software", "developer"], 
          ["web", "developer"],
          ["code", "develop"],
          ["app", "development"],
          ["data", "science"],
          ["frontend", "developer"],
          ["backend", "developer"]
        ]
      },
      "Mechanical Engineering": {
        primaryKeywords: [
          "mechanical engineer", "mechanical design", "product design engineer", "thermal engineer",
          "hvac engineer", "manufacturing engineer", "robotics engineer", "automotive engineer",
          "mechanical systems", "aerospace engineer", "hardware engineer"
        ],
        secondaryKeywords: [
          "cad", "cam", "solidworks", "autocad", "thermodynamics", "fluid mechanics", "hvac", 
          "manufacturing", "production", "machining", "cnc", "3d printing", "robotics", "automation", 
          "mechanical design", "product design", "thermal", "automotive", "finite element analysis", 
          "fea", "dynamics", "kinematics", "mechatronics", "inventor", "catia", "mech"
        ],
        minPrimaryMatches: 1,
        minSecondaryMatches: 2,
        negativeKeywords: [
          "software developer", "web development", "app developer", "frontend", "backend",
          "electrical circuit", "pcb", "civil construction", "chemical process", "genetic",
          "content writer", "seo", "marketing", "data entry", "customer service", "sales",
          "accounting", "virtual assistant", "social media", "administrative", "receptionist",
          "coordinator", "hr", "human resources"
        ],
        contextPairs: [
          ["mechanical", "engineer"],
          ["mechanical", "design"],
          ["product", "design"],
          ["thermal", "analysis"],
          ["mechanical", "systems"]
        ]
      },
      "Electrical Engineering": {
        primaryKeywords: [
          "electrical engineer", "electronics engineer", "embedded systems engineer", "power systems engineer",
          "control systems engineer", "circuit design", "pcb design", "vlsi design", "hardware engineer",
          "rf engineer", "communication systems"
        ],
        secondaryKeywords: [
          "electrical", "electronics", "circuitry", "embedded systems", "vlsi", "verilog", "hdl", 
          "microcontrollers", "power systems", "control systems", "signal processing", "communications", 
          "rf", "arduino", "raspberry pi", "iot", "electric machines", "power electronics", 
          "renewable energy", "semiconductor", "digital electronics", "analog", "ee"
        ],
        minPrimaryMatches: 1,
        minSecondaryMatches: 2,
        negativeKeywords: [
          "software developer", "web development", "mechanical design", "civil construction",
          "chemical process", "genetic", "aerospace"
        ],
        contextPairs: [
          ["electrical", "engineer"],
          ["embedded", "systems"],
          ["circuit", "design"],
          ["pcb", "design"],
          ["power", "systems"]
        ]
      },
      "Civil Engineering": {
        primaryKeywords: [
          "civil engineer", "structural engineer", "construction engineer", "geotechnical engineer",
          "transportation engineer", "environmental engineer", "water resources engineer",
          "urban planner", "site engineer"
        ],
        secondaryKeywords: [
          "civil", "structural", "construction", "building", "architecture", 
          "autocad", "revit", "bim", "surveying", "geotechnical", "transportation", 
          "environmental engineering", "water resources", "infrastructure", "project management", 
          "structural analysis", "concrete design", "steel design", "highways", "bridges", 
          "dams", "urban planning", "sustainability", "gis", "staad pro", "etabs"
        ],
        minPrimaryMatches: 1,
        minSecondaryMatches: 2,
        negativeKeywords: [
          "software developer", "electrical circuit", "mechanical design",
          "chemical process", "genetic", "aerospace"
        ],
        contextPairs: [
          ["civil", "engineer"],
          ["structural", "design"],
          ["construction", "manager"],
          ["site", "engineer"],
          ["urban", "planning"]
        ]
      },
      "Aerospace Engineering": {
        primaryKeywords: [
          "aerospace engineer", "aeronautical engineer", "aircraft design", "spacecraft design",
          "propulsion engineer", "avionics engineer", "flight test engineer", "aerodynamics engineer",
          "satellite systems", "rocket engineer", "flight dynamics"
        ],
        secondaryKeywords: [
          "aerospace", "aeronautical", "aviation", "aircraft", "spacecraft", "rocket", 
          "propulsion", "aerodynamics", "avionics", "flight mechanics", "satellite", 
          "space systems", "computational fluid dynamics", "cfd", "composites", 
          "aeroelasticity", "orbital mechanics", "airframe", "astronautics", "nasa", "isro", 
          "wind tunnel", "aero", "drone"
        ],
        minPrimaryMatches: 1,
        minSecondaryMatches: 2,
        negativeKeywords: [
          "software developer", "web development", "electrical circuit", "civil construction",
          "chemical process", "genetic", "content writer", "seo", "marketing", "data entry",
          "customer service", "sales", "accounting", "virtual assistant", "social media",
          "administrative", "receptionist", "recruiter", "hr assistant", "digital marketing"
        ],
        contextPairs: [
          ["aerospace", "engineer"],
          ["aircraft", "design"],
          ["spacecraft", "design"],
          ["propulsion", "systems"],
          ["aerodynamic", "analysis"]
        ]
      },
      "Chemical Engineering": {
        primaryKeywords: [
          "chemical engineer", "process engineer", "biochemical engineer", "petroleum engineer",
          "pharmaceutical engineer", "materials engineer", "polymer engineer", "chemical process design"
        ],
        secondaryKeywords: [
          "chemical", "chemistry", "process", "process engineering", 
          "petrochemical", "refinery", "reactor design", "thermodynamics", "fluid dynamics", 
          "heat transfer", "mass transfer", "unit operations", "aspen", "hysys", "chemcad", 
          "biochemical", "pharmaceutical", "polymer", "materials science", "process control", 
          "separation processes", "reaction engineering", "fermentation", "distillation"
        ],
        minPrimaryMatches: 1,
        minSecondaryMatches: 2,
        negativeKeywords: [
          "software developer", "electrical circuit", "mechanical design", "civil construction", 
          "aerospace"
        ],
        contextPairs: [
          ["chemical", "engineer"],
          ["process", "engineer"],
          ["petroleum", "engineer"],
          ["reactor", "design"],
          ["process", "control"]
        ]
      },
      "Biotechnology": {
        primaryKeywords: [
          "biotechnology engineer", "biomedical engineer", "bioinformatics scientist", 
          "genomics researcher", "pharmaceutical researcher", "bioprocess engineer", 
          "clinical research", "biologist", "molecular biologist"
        ],
        secondaryKeywords: [
          "biotechnology", "biotech", "biomedical", "biology", "life sciences", "molecular biology", 
          "genetic engineering", "genomics", "proteomics", "bioinformatics", "biochemistry", 
          "microbiology", "immunology", "pharmaceutical", "bioprocess", "biomaterials", 
          "tissue engineering", "cell culture", "recombinant dna", "crispr", "bioreactor", 
          "biomedicine", "bio"
        ],
        minPrimaryMatches: 1,
        minSecondaryMatches: 2,
        negativeKeywords: [
          "software developer", "electrical circuit", "mechanical design", "civil construction",
          "aerospace"
        ],
        contextPairs: [
          ["biomedical", "engineer"],
          ["biotechnology", "researcher"],
          ["pharmaceutical", "research"],
          ["genetic", "engineering"],
          ["clinical", "research"]
        ]
      },
      "Management & Business": {
        primaryKeywords: [
          "business analyst", "financial analyst", "marketing manager", "hr intern", 
          "business development", "operations manager", "supply chain analyst", 
          "project manager", "consultant", "management trainee"
        ],
        secondaryKeywords: [
          "management", "business", "marketing", "finance", "accounting", "human resources", 
          "hr", "operations", "supply chain", "logistics", "consulting", "analytics", 
          "business development", "sales", "market research", "digital marketing", "seo", 
          "social media", "content", "brand", "e-commerce", "startup", "entrepreneurship", 
          "mba", "investment", "strategy", "administration", "commerce"
        ],
        minPrimaryMatches: 1,
        minSecondaryMatches: 2,
        negativeKeywords: [
          "software developer", "electrical circuit", "mechanical design", "civil construction",
          "chemical process", "genetic", "aerospace", "content writer", "seo", "marketing",
          "data entry", "customer service", "sales", "accounting", "virtual assistant",
          "social media", "administrative", "receptionist", "recruiter", "hr assistant"
        ],
        contextPairs: [
          ["business", "analyst"],
          ["marketing", "manager"],
          ["financial", "analysis"],
          ["supply", "chain"],
          ["human", "resources"]
        ]
      },
      "Design": {
        primaryKeywords: [
          "ui designer", "ux designer", "product designer", "graphic designer", 
          "industrial designer", "web designer", "interaction designer", "visual designer",
          "motion designer", "3d artist", "interior designer", "fashion designer"
        ],
        secondaryKeywords: [
          "design", "graphic design", "ui", "ux", "user interface", "user experience", 
          "product design", "industrial design", "web design", "visual design", "interaction design", 
          "animation", "illustration", "photoshop", "illustrator", "indesign", "figma", 
          "sketch", "adobe", "typography", "branding", "creative", "art direction", 
          "motion graphics", "3d design", "interior design", "fashion design"
        ],
        minPrimaryMatches: 1,
        minSecondaryMatches: 3, // Design needs more secondary matches due to term overlap
        negativeKeywords: [
          "software developer", "electrical circuit", "mechanical engineer", "civil construction",
          "chemical process", "genetic", "aerospace"
        ],
        contextPairs: [
          ["ui", "designer"],
          ["ux", "designer"],
          ["graphic", "designer"],
          ["product", "designer"],
          ["visual", "designer"]
        ]
      },
      "Content & Communication": {
        primaryKeywords: [
          "content writer", "copywriter", "technical writer", "editor", "journalist",
          "communications specialist", "public relations", "media coordinator",
          "social media manager", "content strategist"
        ],
        secondaryKeywords: [
          "content", "content writing", "copywriting", "editing", "proofreading", "journalism", 
          "media", "communication", "content creation", "social media", "blog", "seo writing", 
          "technical writing", "creative writing", "scriptwriting", "public relations", "pr", 
          "advertising", "digital media", "content strategy", "content marketing"
        ],
        minPrimaryMatches: 1,
        minSecondaryMatches: 2,
        negativeKeywords: [
          "software developer", "electrical circuit", "mechanical design", "civil construction",
          "chemical process", "genetic", "aerospace"
        ],
        contextPairs: [
          ["content", "writer"],
          ["technical", "writer"],
          ["social", "media"],
          ["public", "relations"],
          ["digital", "content"]
        ]
      }
    };
  
    /**
     * Calculates a relevance score for an internship based on a weighted algorithm
     * @param {Object} internship - The internship data object
     * @param {Object} streamKeywords - The keywords definition for a specific stream
     * @return {Object} - Score details and matches found
     */
    function calculateRelevanceScore(internship, streamKeywords) {
      // Quick rejection for common non-relevant job titles
      const jobTitle = (internship.jobTitle || '').toLowerCase();
      const quickRejectTitles = [
        "data entry", "virtual assistant", "content writer", "seo specialist", 
        "digital marketing", "social media", "customer service", "sales representative",
        "marketing intern", "accountant", "recruiter", "hr intern"
      ];
      
      // Immediately reject if the job title contains common non-technical roles
      // This speeds up processing and improves accuracy
      for (const rejectTitle of quickRejectTitles) {
        if (jobTitle.includes(rejectTitle)) {
          return {
            score: -999,
            matches: { primary: [], secondary: [], negative: [rejectTitle], contextPairs: [] },
            meetsCriteria: false,
            explanation: `Quick rejected based on job title containing "${rejectTitle}"`
          };
        }
      }
      
      const textToSearch = [
        jobTitle,
        (internship.companyName || '').toLowerCase(),
        (internship.description || '').toLowerCase(),
        ...(internship.skills || []).map(skill => skill.toLowerCase())
      ].join(' ');
      
      // Track matches for debugging and explanation
      const matches = {
        primary: [],
        secondary: [],
        negative: [],
        contextPairs: []
      };
      
      // Search for primary keywords (high value matches)
      streamKeywords.primaryKeywords.forEach(keyword => {
        if (textToSearch.includes(keyword.toLowerCase())) {
          matches.primary.push(keyword);
        }
      });
      
      // Search for secondary keywords (supporting evidence)
      streamKeywords.secondaryKeywords.forEach(keyword => {
        if (textToSearch.includes(keyword.toLowerCase())) {
          matches.secondary.push(keyword);
        }
      });
      
      // Check for negative keywords (indicators this isn't a match)
      streamKeywords.negativeKeywords.forEach(keyword => {
        if (textToSearch.includes(keyword.toLowerCase())) {
          matches.negative.push(keyword);
        }
      });
      
      // Check for context pairs (words appearing together strongly indicate relevance)
      streamKeywords.contextPairs.forEach(([word1, word2]) => {
        // Look for both words within 10 words of each other
        const pattern = new RegExp(`\\b${word1}\\b[\\s\\S]{0,50}\\b${word2}\\b|\\b${word2}\\b[\\s\\S]{0,50}\\b${word1}\\b`, 'i');
        if (pattern.test(textToSearch)) {
          matches.contextPairs.push(`${word1} + ${word2}`);
        }
      });
      
      // Calculate final score
      let score = 0;
      
      // Primary keywords are worth 10 points each
      score += matches.primary.length * 10;
      
      // Secondary keywords are worth 3 points each
      score += matches.secondary.length * 3;
      
      // Context pairs are worth 15 points each
      score += matches.contextPairs.length * 15;
      
      // Negative keywords are worth -100 points each (increased penalty to ensure exclusion)
      score -= matches.negative.length * 100;
      
      // If any negative keywords are found in the title, immediately disqualify with a large penalty
      titleText = (internship.jobTitle || '').toLowerCase();
      streamKeywords.negativeKeywords.forEach(keyword => {
        if (titleText.includes(keyword.toLowerCase())) {
          score -= 500; // Huge penalty for negative keyword in title
          matches.negative.push(`TITLE: ${keyword}`);
        }
      });
      
      // Title matches get extra weight
      titleText = (internship.jobTitle || '').toLowerCase();
      matches.primary.forEach(keyword => {
        if (titleText.includes(keyword.toLowerCase())) {
          score += 30; // Huge bonus for primary keyword in title
        }
      });
      
      matches.secondary.forEach(keyword => {
        if (titleText.includes(keyword.toLowerCase())) {
          score += 8; // Good bonus for secondary keyword in title
        }
      });
      
      // Check if the internship meets minimum relevance criteria
      const meetsCriteria = (
        (matches.primary.length >= streamKeywords.minPrimaryMatches) ||
        (matches.secondary.length >= streamKeywords.minSecondaryMatches)
      ) && (matches.negative.length === 0) && (score > 6); // Require score > 6 and no negative keywords
      
      // Final result
      return {
        score,
        matches,
        meetsCriteria,
        // For debugging and UI feedback
        explanation: `Primary: ${matches.primary.length}/${streamKeywords.minPrimaryMatches} required, 
                      Secondary: ${matches.secondary.length}/${streamKeywords.minSecondaryMatches} required, 
                      Context pairs: ${matches.contextPairs.length}, 
                      Negative: ${matches.negative.length} (0 allowed)`
      };
    }
  
    // Function to filter listings by selected stream with improved scoring
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
  
      // Store the current filtered results to apply filters on this subset
      // This prevents resetting to all internships when stream filter is active
      let dataToFilter = window.cachedFilteredData || window.allInternships;
      
      if (!Array.isArray(dataToFilter) || dataToFilter.length === 0) {
        dataToFilter = window.allInternships;
      }
  
      // Show loading message
      listingsContainer.innerHTML = `<div class="loading">Finding the best ${selectedStream} internships for you...</div>`;
  
      // Get keywords for the selected stream
      const streamKeywords = streamDefinitions[selectedStream];
      if (!streamKeywords) return;
  
      // Make sure we have internships to filter
      if (!dataToFilter || !Array.isArray(dataToFilter)) {
        console.error("No internship data available to filter");
        listingsContainer.innerHTML = '<div class="loading">Error: Unable to access internship data</div>';
        return;
      }
  
      console.log(`Filtering ${dataToFilter.length} internships for ${selectedStream}...`);
  
      // Filter and score internships based on the improved relevance algorithm
      const scoredInternships = dataToFilter.map(internship => {
        const relevance = calculateRelevanceScore(internship, streamKeywords);
        return {
          ...internship,
          relevance
        };
      }).filter(internship => internship.relevance.meetsCriteria && internship.relevance.score > 6);
      
      // Sort by relevance score (highest first)
      scoredInternships.sort((a, b) => b.relevance.score - a.relevance.score);
      
      // Log statistics for debugging
      console.log(`Found ${scoredInternships.length} matches for ${selectedStream} after relevance scoring`);
      
      // If available, extract top matches to show to user
      const topMatches = scoredInternships.slice(0, 3);
      if (topMatches.length > 0) {
        console.log("Top matches:", topMatches.map(i => ({
          title: i.jobTitle,
          score: i.relevance.score,
          primaryMatches: i.relevance.matches.primary,
          contextPairs: i.relevance.matches.contextPairs
        })));
      }
      
      // Store the stream-filtered results in a special variable
      // This allows other filters to work on these results
      window.streamFilteredInternships = scoredInternships;
      
      // If we can't use the main script's populateCards function, create our own
      if (typeof window.populateCards !== 'function') {
        console.warn("Using fallback display method since populateCards is not available");
        displayFilteredResults(scoredInternships, selectedStream);
      } else {
        // Remove relevance data before passing to populateCards (to prevent conflicts)
        const cleanedInternships = scoredInternships.map(({ relevance, ...rest }) => rest);
        window.populateCards(cleanedInternships);
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
      internships.forEach((internship) => {
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
        
        // Add relevance score indicator if available (for debugging)
        const relevanceDisplay = internship.relevance ? 
            `<span class="relevance-score" title="${internship.relevance.explanation}">Relevance: ${internship.relevance.score}</span>` : '';
        
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
                ${relevanceDisplay}
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
        <div class="results-count">Found <span>${internships.length}</span> relevant ${streamName} internships</div>
      `;
      
      listingsContainer.appendChild(resultHeader);
      listingsContainer.appendChild(fragment);
    }
  
    // Initialize the stream search functionality with improved filter handling
    function initStreamSearch() {
      // Wait for the stream filter to be available in the DOM
      const streamFilter = document.getElementById('streamFilter');
      if (!streamFilter) {
        console.error("Stream filter element not found");
        return;
      }
  
      console.log("Enhanced stream search initialized");
  
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
      
      // Override main script filters to work with stream filtering
      overrideMainFilters();
      
      // Hook into other filter elements to maintain stream filtering
      const otherFilters = [
        document.getElementById('searchInput'),
        document.getElementById('skillsInput'),
        document.getElementById('timeFilter'),
        document.getElementById('locationFilter'),
        document.getElementById('stipendSort'),
        document.getElementById('stipendRange')
      ].filter(Boolean);
      
      // For each filter input/select, make sure it preserves our stream filtering
      otherFilters.forEach(filter => {
        const eventType = filter.tagName === 'INPUT' ? 'input' : 'change';
        
        // Add event listener that ensures stream filter is maintained
        filter.addEventListener(eventType, () => {
          const selectedStream = document.getElementById('streamFilter')?.value;
          if (selectedStream) {
            console.log("Maintaining stream filter after other filter change");
          }
        }, true); // Capture phase to run before the main handler
      });
      
      // Optionally add a button to improve UX
      const filtersSection = document.querySelector('.filters-section');
      if (filtersSection) {
        const refreshButton = document.createElement('button');
        refreshButton.className = 'refresh-button';
        refreshButton.textContent = 'Refresh Results';
        refreshButton.addEventListener('click', filterByStream);
        filtersSection.appendChild(refreshButton);
      }
    }
  
    // Run initialization when the page is loaded
    // Use a small delay to ensure the main script has initialized
    setTimeout(() => {
      initStreamSearch();
      
      // Set up MutationObserver to detect when the filters section is added to the DOM
      // This handles cases where the page loads dynamically
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length) {
            const streamFilter = document.getElementById('streamFilter');
            if (streamFilter && !streamFilter._initialized) {
              console.log("Stream filter detected in DOM via MutationObserver");
              streamFilter._initialized = true;
              streamFilter.addEventListener('change', filterByStream);
              overrideMainFilters();
            }
          }
        }
      });
      
      // Start observing changes to the body
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Check if any stream is already selected (page refresh case)
      const streamFilter = document.getElementById('streamFilter');
      if (streamFilter && streamFilter.value) {
        console.log("Stream already selected on page load:", streamFilter.value);
        filterByStream();
      }
    }, 1000);
  });