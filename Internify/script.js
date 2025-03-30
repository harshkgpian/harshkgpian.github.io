// Helper function to check for very recent postings
function isVeryRecent(timeStr) {
    if (!timeStr) return false;
    
    // Check for "few hours", "hour ago", etc.
    if (timeStr.toLowerCase().includes('hour') || 
        timeStr.toLowerCase().includes('few') || 
        timeStr.toLowerCase().includes('minute')) {
        return true;
    }
    
    // For numeric time checks - but don't fail if parseTimeAgo isn't defined yet
    try {
        // Only attempt this if the function exists
        if (typeof parseTimeAgo === 'function') {
            return parseTimeAgo(timeStr) <= 24;
        }
        return false;
    } catch (e) {
        return false;
    }
}document.addEventListener('DOMContentLoaded', () => {
const listingsContainer = document.getElementById('internshipListings');
const searchInput = document.getElementById('searchInput');
const skillsInput = document.getElementById('skillsInput');
const timeFilter = document.getElementById('timeFilter');
const locationFilter = document.getElementById('locationFilter');
const stipendSort = document.getElementById('stipendSort');
const stipendRange = document.getElementById('stipendRange');
let allInternships = [];
let isInitialLoad = true;

// Direct data source URL
const dataSourceUrl = 'https://harshkgpian.github.io/internships.json';

// Function to fetch data from source
async function fetchDataFromSource() {
    try {
        showLoading();
        
        // Try to fetch with a proxy if direct fetch fails
        let response;
        try {
            // First attempt: direct fetch
            response = await fetch(dataSourceUrl, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
        } catch (directFetchError) {
            console.warn('Direct fetch failed, trying with a CORS proxy:', directFetchError);
            
            // Second attempt: using a CORS proxy
            // Note: This is a public proxy service and may have rate limits
            const corsProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(dataSourceUrl);
            response = await fetch(corsProxyUrl);
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        allInternships = await response.json();
        console.log(`Loaded ${allInternships.length} internships`);
        
        filterAndSortData();
    } catch (error) {
        showError('Error loading data: ' + error.message);
        console.error('Error fetching data:', error);
        
        // If we have some data already, keep using it rather than showing an error
        if (allInternships.length > 0) {
            filterAndSortData();
        } else {
            // Show sample data if we can't load any real data
            loadSampleData();
        }
    } finally {
        isInitialLoad = false;
    }
}

// Function to load sample data if we can't fetch actual data
function loadSampleData() {
    // Sample data for demonstration purposes
    allInternships = [
        {
            jobTitle: "Web Development Intern",
            companyName: "TechSolutions",
            location: "Remote",
            duration: "3 Months",
            stipend: "₹10,000",
            postedTime: "1 day ago",
            skills: ["HTML", "CSS", "JavaScript", "React"],
            detailsUrl: "#"
        },
        {
            jobTitle: "UI/UX Design Intern",
            companyName: "DesignHub",
            location: "Bangalore",
            duration: "6 Months",
            stipend: "₹15,000",
            postedTime: "3 hours ago",
            skills: ["Figma", "Adobe XD", "Sketch", "UI Design"],
            detailsUrl: "#"
        },
        {
            jobTitle: "Content Writing Intern",
            companyName: "MediaGroup",
            location: "Work from home",
            duration: "2 Months",
            stipend: "₹5,000",
            postedTime: "2 days ago",
            skills: ["Content Writing", "Editing", "SEO"],
            detailsUrl: "#"
        }
    ];
    
    filterAndSortData();
}

// Function to show loading state
function showLoading() {
    if (isInitialLoad) {
        listingsContainer.innerHTML = '<div class="loading">Loading internship listings...</div>';
    }
}

// Function to show error message
function showError(message) {
    listingsContainer.innerHTML = `<div class="loading">${message}</div>`;
}

// More efficient card creation - Using document fragments
function populateCards(data) {
    // Always clear and repopulate on filter changes
    
    // Clear the container
    while (listingsContainer.firstChild) {
        listingsContainer.removeChild(listingsContainer.firstChild);
    }
    
    if (data.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'loading';
        noResults.textContent = 'No internships found for this filter';
        listingsContainer.appendChild(noResults);
        return;
    }
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Only render visible cards at first (virtual rendering)
    const initialRenderCount = Math.min(data.length, 20);
    
    for (let i = 0; i < initialRenderCount; i++) {
        const card = createCardElement(data[i], i);
        fragment.appendChild(card);
    }
    
    listingsContainer.appendChild(fragment);
    
    // Lazy load remaining cards if there are more
    if (data.length > initialRenderCount) {
        setTimeout(() => {
            const remainingFragment = document.createDocumentFragment();
            for (let i = initialRenderCount; i < data.length; i++) {
                const card = createCardElement(data[i], i);
                remainingFragment.appendChild(card);
            }
            listingsContainer.appendChild(remainingFragment);
        }, 100);
    }
}

// Extract card creation to a separate function
function createCardElement(internship, index) {
    const card = document.createElement('div');
    card.className = 'job-card';
    
    // Format the skills for display
    let skillsHTML = '';
    if (internship.skills && internship.skills.length > 0) {
        const visibleSkills = internship.skills.slice(0, 3);
        skillsHTML = visibleSkills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
        
        if (internship.skills.length > 3) {
            skillsHTML += `<span class="skill-tag">+${internship.skills.length - 3} more</span>`;
        }
    }
    
    // Check if this is a recent posting (less than 24 hours)
    const isRecent = isVeryRecent(internship.postedTime) || 
                     (internship.postedTime || '').toLowerCase().includes('few hours');
    const postedTimeClass = isRecent ? 'posted-time recent' : 'posted-time';
    
    // Check if remote
    const isRemote = (internship.location || '').toLowerCase().includes('remote') || 
                     (internship.location || '').toLowerCase().includes('work from home');
    const locationDisplay = isRemote ? 
        `<div class="location">${internship.location}<span class="remote-badge">Remote</span></div>` : 
        `<div class="location">${internship.location || 'Not specified'}</div>`;
    
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
    
    return card;
}

// Function to parse time string to hours ago (optimized)
function parseTimeAgo(timeStr) {
    if (!timeStr || timeStr === 'N/A') return Infinity;
    
    // Cache for parsed times
    if (!parseTimeAgo.cache) parseTimeAgo.cache = new Map();
    if (parseTimeAgo.cache.has(timeStr)) {
        return parseTimeAgo.cache.get(timeStr);
    }
    
    const match = timeStr.match(/(\d+)\s*(hour|day|week|month)/i);
    if (!match) return Infinity;
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    let result;
    switch (unit) {
        case 'hour': result = value; break;
        case 'day': result = value * 24; break;
        case 'week': result = value * 24 * 7; break;
        case 'month': result = value * 24 * 30; break;
        default: result = Infinity;
    }
    
    parseTimeAgo.cache.set(timeStr, result);
    return result;
}

// Function to parse stipend to number (optimized)
function parseStipend(stipendStr) {
    if (!stipendStr || stipendStr === 'N/A' || stipendStr.toLowerCase().includes('unpaid')) return 0;
    
    // Cache for parsed stipends
    if (!parseStipend.cache) parseStipend.cache = new Map();
    if (parseStipend.cache.has(stipendStr)) {
        return parseStipend.cache.get(stipendStr);
    }
    
    const match = stipendStr.match(/[\d,]+/);
    const result = match ? parseInt(match[0].replace(/,/g, '')) : 0;
    
    parseStipend.cache.set(stipendStr, result);
    return result;
}

// Binary search for better performance in sorting
function binaryInsert(arr, item, compFunc) {
    let low = 0;
    let high = arr.length;
    
    while (low < high) {
        const mid = (low + high) >>> 1;
        if (compFunc(arr[mid], item) < 0) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    
    arr.splice(low, 0, item);
}

// Function to filter and sort data with optimizations
function filterAndSortData() {
    // Use a more efficient approach for filtering
    let filteredData = [];
    
    // Extract filter values once
    const searchTerm = searchInput.value.toLowerCase();
    const skillsTerm = skillsInput.value.toLowerCase();
    const timeValue = timeFilter.value;
    const locationValue = locationFilter.value;
    const sortValue = stipendSort.value;
    const stipendRangeValue = stipendRange.value;
    
    // Pre-compute time filter hours limit
    const hoursLimit = timeValue !== 'all' ? {
        'hours': 6,
        'day': 24,
        'week': 168
    }[timeValue] : Infinity;
    
    // Pre-compute stipend range values
    let stipendMin = 0;
    let stipendMax = Infinity;
    
    if (stipendRangeValue !== 'all' && stipendRangeValue !== 'unpaid' && stipendRangeValue !== '15000+') {
        const [min, max] = stipendRangeValue.split('-').map(Number);
        stipendMin = min;
        stipendMax = max;
    } else if (stipendRangeValue === '15000+') {
        stipendMin = 15000;
    }
    
    // For better performance, use a single loop for filtering
    for (let i = 0; i < allInternships.length; i++) {
        const internship = allInternships[i];
        
        // Search filter
        if (searchTerm && !(
            (internship.jobTitle || '').toLowerCase().includes(searchTerm) || 
            (internship.companyName || '').toLowerCase().includes(searchTerm)
        )) {
            continue;
        }
        
        // Skills filter
        if (skillsTerm) {
            const hasSkill = (internship.skills && internship.skills.some(skill => 
                skill.toLowerCase().includes(skillsTerm)
            )) || 
            (internship.description && internship.description.toLowerCase().includes(skillsTerm)) ||
            (internship.jobTitle && internship.jobTitle.toLowerCase().includes(skillsTerm));
            
            if (!hasSkill) continue;
        }
        
        // Time filter
        if (timeValue !== 'all' && parseTimeAgo(internship.postedTime) > hoursLimit) {
            continue;
        }
        
        // Location filter
        if (locationValue !== 'all') {
            const loc = (internship.location || '').toLowerCase();
            const isRemote = loc.includes('remote') || loc.includes('work from home');
            
            if ((locationValue === 'remote' && !isRemote) || 
                (locationValue === 'onsite' && isRemote)) {
                continue;
            }
        }
        
        // Stipend range filter
        if (stipendRangeValue !== 'all') {
            const stipendAmount = parseStipend(internship.stipend);
            
            if (stipendRangeValue === 'unpaid') {
                if (stipendAmount !== 0 && !(internship.stipend || '').toLowerCase().includes('unpaid')) {
                    continue;
                }
            } else if (stipendAmount < stipendMin || stipendAmount > stipendMax) {
                continue;
            }
        }
        
        // If we get here, the internship passed all filters
        filteredData.push(internship);
    }
    
    // Sort the data if needed
    if (sortValue !== 'none' && filteredData.length > 0) {
        if (sortValue === 'high-to-low') {
            filteredData.sort((a, b) => parseStipend(b.stipend) - parseStipend(a.stipend));
        } else {
            filteredData.sort((a, b) => parseStipend(a.stipend) - parseStipend(b.stipend));
        }
    }
    
    // Always update the display with the filtered data
    cachedFilteredData = filteredData;
    populateCards(filteredData);
}

// Super efficient debounce function
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Use requestAnimationFrame for smooth UI updates
function debouncedFilter() {
    requestAnimationFrame(() => {
        const startTime = performance.now();
        filterAndSortData();
        console.log(`Filtering took ${performance.now() - startTime} ms`);
    });
}

// Initialize the application
async function init() {
    // Event listeners with immediate response for selects and debounced for text inputs
    const debouncedFilterFn = debounce(debouncedFilter, 300);
    searchInput.addEventListener('input', debouncedFilterFn);
    skillsInput.addEventListener('input', debouncedFilterFn);
    
    // Immediately filter on dropdown changes for better responsiveness
    timeFilter.addEventListener('change', filterAndSortData);
    locationFilter.addEventListener('change', filterAndSortData);
    stipendSort.addEventListener('change', filterAndSortData);
    stipendRange.addEventListener('change', filterAndSortData);
    
    // Initial data load
    try {
        await fetchDataFromSource();
    } catch (e) {
        console.error("Could not load initial data:", e);
        loadSampleData();
    }
    
    // Set up auto-refresh every 5 minutes to get latest data
    // But don't refresh if the tab is not visible to save bandwidth
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            fetchDataFromSource().catch(err => console.warn("Auto-refresh failed:", err));
        }
    }, 5 * 60 * 1000);
}

// Start the app
init();
});