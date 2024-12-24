const SERVER_URL = "http://localhost:3110/api";

// Utility function to check server connection
async function checkServerConnection() {
  try {
    const response = await fetch(`${SERVER_URL}/ping`);
    const data = await response.json();

    if (data.status === "ok") {
      console.log("Server is connected.");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Server connection error:", error);
    return false;
  }
}


checkServerConnection().then((connected) => {
    if (!connected) {
      showCustomAlert("Server is not running. Please start the server.");
    }
  });

  function showCustomAlert(message) {
    const customAlert = document.getElementById('customAlert');
    const customAlertMessage = document.getElementById('customAlertMessage');
    const customAlertButton = document.getElementById('customAlertButton');
  
    customAlertMessage.textContent = message;
    customAlert.style.display = 'block';
  
    customAlertButton.onclick = () => {
      customAlert.style.display = 'none';
    };
  }
  
  
document.addEventListener("DOMContentLoaded", () => {
  const pdfBrowseButton = document.getElementById("browsePdf");
  const keyBrowseButton = document.getElementById("browsekey");
  const pdfPathInput = document.getElementById("pdfPath");
  const keyPathInput = document.getElementById("keyPath");

  const handleBrowse = (browseButton, pathInput, fileType, uploadEndpoint) => {
    browseButton.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      if (fileType) input.accept = fileType;

      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          pathInput.value = file.name;

          const formData = new FormData();
          formData.append("file", file);

          try {
            const response = await fetch(`${SERVER_URL}/${uploadEndpoint}`, {
              method: "POST",
              body: formData,
            });

            const data = await response.json();
            if (response.ok) {
              console.log(`${fileType || "File"} Uploaded Successfully:`, data.message);
              showCustomAlert(`File uploaded successfully!`);
            } else {
              console.error("Error uploading file:", data.error);
              showCustomAlert(`Error: ${data.error}`);
            }
          } catch (error) {
            console.error("Error sending file to server:", error);
            showCustomAlert(`Failed to upload the file.`);
          }
        } else {
          showCustomAlert("No file selected!");
        }
      };

      input.click();
    });
  };

  // Add event listeners for both buttons
  handleBrowse(pdfBrowseButton, pdfPathInput, ".pdf", "upload-pdf");
  handleBrowse(keyBrowseButton, keyPathInput, ".key", "upload-key"); // Add other key file extensions if needed
});

document.addEventListener('DOMContentLoaded', function() {
    // Get all container elements
    const landingPage = document.querySelector('.landing-page');
    const gettingStartedContainer = document.querySelector('.getting-started-container');
    const profileContainer = document.querySelector('.profile-container');
    const contentSections = document.querySelectorAll('.content-section');

    // Hide all sections initially except landing page
    contentSections.forEach(section => section.style.display = 'none');
    gettingStartedContainer.style.display = 'none';
    profileContainer.style.display = 'none';
    landingPage.style.display = 'block';

    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Add active class to clicked link
            e.target.classList.add('active');

            // Hide ALL possible sections
            landingPage.style.display = 'none';
            gettingStartedContainer.style.display = 'none';
            profileContainer.style.display = 'none';
            contentSections.forEach(section => section.style.display = 'none');

            // Show selected section
            const sectionId = e.target.getAttribute('href').substring(1);
            if (sectionId === 'home') {
                landingPage.style.display = 'block';
            } else {
                document.getElementById(sectionId).style.display = 'block';
            }
        });
    });

    // Handle internal navigation buttons
    const getStartedBtns = document.querySelectorAll('#getStartedBtn, #getStartedBtnTop');
    const profileBtns = document.querySelectorAll('#profileBtn, #profileBtnTop');
    const homeBtns = document.querySelectorAll('#homeBtn1, #homeBtn2');

    function showContainer(containerToShow) {
        // Hide all containers and content sections
        landingPage.style.display = 'none';
        gettingStartedContainer.style.display = 'none';
        profileContainer.style.display = 'none';
        contentSections.forEach(section => section.style.display = 'none');

        // Show the selected container
        containerToShow.style.display = 'block';

        // Update nav active state
        navLinks.forEach(link => link.classList.remove('active'));
        if (containerToShow === landingPage) {
            document.querySelector('a[href="#home"]').classList.add('active');
        }
    }

    getStartedBtns.forEach(btn => {
        btn.addEventListener('click', () => showContainer(gettingStartedContainer));
    });

    profileBtns.forEach(btn => {
        btn.addEventListener('click', () => showContainer(profileContainer));
    });

    homeBtns.forEach(btn => {
        btn.addEventListener('click', () => showContainer(landingPage));
    });

    // Rest of your existing event listeners...
});

document.getElementById('userForm').addEventListener('submit', async (e) => {      
    e.preventDefault();      

    // Get the submit button  
    const submitButton = e.target.querySelector('.submit-btn');  
    const originalButtonText = submitButton.innerHTML;  

    // Disable button and show loading state  
    submitButton.disabled = true;  
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';  

    const formData = {      
        credentials: {      
            cookie: document.getElementById('liAtCookie').value,      
            path: document.getElementById('pdfPath').value,
            curCTC: document.getElementById('currentCTC').value,
            expCTC: document.getElementById('expectedCTC').value,
        },      
        searchParams: {      
            jobTitle: document.getElementById('jobTitle').value,      
            location: document.getElementById('location').value,      
            filters: {      
                easyApply: document.getElementById('easyApply').checked,      
                experienceLevel: document.getElementById('experienceLevel').value,      
                workType: document.getElementById('workType').value,  
                datePosted: document.getElementById('datePosted').value      
            }      
        },  
        key: {  
            email: document.getElementById('email').value,   
            password: document.getElementById('password').value,  
            keyFilePath: document.getElementById('keyPath').value      
        }      
    };      

    // Validate form data
    if (!formData.credentials.cookie || !formData.credentials.path || !formData.key.keyFilePath) {      
        showCustomAlert('Please fill in all required fields');  
        submitButton.disabled = false;  
        submitButton.innerHTML = originalButtonText;  
        return;      
    }  

    try {
        // First validate and save credentials
        const credentialsResponse = await fetch(`${SERVER_URL}/save-credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: formData.key.email,
                password: formData.key.password,
                keyPath: formData.key.keyFilePath
            })
        });

        const credentialsData = await credentialsResponse.json();
        
        if (credentialsData.success) {
            console.log('Credentials Updated/Saved Successfully');
            const loginButton = document.getElementById('setProfileButton');
            loginButton.innerHTML = '<i class="fas fa-check-circle"></i> You are Logged In';
            loginButton.classList.add('logged-in');

            // Now save the form data
            const formResponse = await fetch(`${SERVER_URL}/save-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await formResponse.json();
            
            if (!data.success) {
                showCustomAlert(`Error: ${data.message}`);
            }
        } else {
            showCustomAlert(`Error: ${credentialsData.message}`);
        }

    } catch (error) {
        console.error('Error:', error);
        showCustomAlert('An error occurred while processing your request.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});
// Load saved data when page loads   
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch saved data directly using fetch (Replace ipcRenderer with fetch)
        const response = await fetch(`${SERVER_URL}/load-saved-data`); // Assuming this API exists on your backend
        const data = await response.json();

        if (data.success && data.data) {
            const { credentials, searchParams, key } = data.data;

            document.getElementById('liAtCookie').value = credentials.cookie || '';
            document.getElementById('pdfPath').value = credentials.path || '';
            document.getElementById('jobTitle').value = searchParams.jobTitle || 'Data Science';
            document.getElementById('location').value = searchParams.location || 'India';
            document.getElementById('email').value = key.email || '';
            document.getElementById('password').value = key.password || '';
            document.getElementById('keyPath').value = key.keyFilePath || '';
            document.getElementById('currentCTC').value = credentials.curCTC || '800000';
            document.getElementById('expectedCTC').value = credentials.expCTC || '1200000';

            if (searchParams.filters) {
                document.getElementById('experienceLevel').value = searchParams.filters.experienceLevel || 'Entry level';
                document.getElementById('workType').value = searchParams.filters.workType || 'Remote';
                document.getElementById('datePosted').value = searchParams.filters.datePosted || 'Past Month';
                document.getElementById('easyApply').checked = searchParams.filters.easyApply !== undefined ? searchParams.filters.easyApply : true;
            }

            const loginButton = document.getElementById('setProfileButton');
            loginButton.innerHTML = '<i class="fas fa-check-circle"></i> You are Logged In';
            loginButton.classList.add('logged-in');
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }

    function updateJobStats(dailyCount, monthlyCount) {
        // Update daily stats
        const dailyJobCount = document.getElementById('dailyJobCount');
        const dailyProgress = document.getElementById('dailyProgress');
        const dailyPercentage = (dailyCount / 40) * 100;

        dailyJobCount.textContent = dailyCount || '0';
        dailyProgress.style.width = `${Math.min(dailyPercentage, 100)}%`;

        // Update color based on progress
        if (dailyPercentage >= 90) {
            dailyProgress.style.backgroundColor = '#ff4444';
        } else if (dailyPercentage >= 70) {
            dailyProgress.style.backgroundColor = '#ffa700';
        }

        // Update monthly stats
        const monthlyJobCount = document.getElementById('monthlyJobCount');
        const monthlyProgress = document.getElementById('monthlyProgress');
        const monthlyPercentage = (monthlyCount / 1000) * 100;

        monthlyJobCount.textContent = monthlyCount || '0';
        monthlyProgress.style.width = `${Math.min(monthlyPercentage, 100)}%`;

        // Update color based on progress
        if (monthlyPercentage >= 90) {
            monthlyProgress.style.backgroundColor = '#ff4444';
        } else if (monthlyPercentage >= 70) {
            monthlyProgress.style.backgroundColor = '#ffa700';
        }
    }

    // Enhanced loadAndUpdateStats with loading states
    async function loadAndUpdateStats() {
        showLoadingStats();
        try {
            const userEmail = document.getElementById('email').value;

            if (userEmail) {
                const {fetchData} = require('./fetchData');
                const response = await fetchData(userEmail);
                const stats = await response.json();

                if (stats.success) {
                    updateJobStats(stats.data.jobsAppliedDaily, stats.data.jobsAppliedMonthly);
                } else {
                    showStatsError();
                }
            } else {
                updateJobStats(0, 0);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            showStatsError();
        }
    }

    // Load stats when page loads
    loadAndUpdateStats();

    // Refresh stats every 5 minutes
    setInterval(loadAndUpdateStats, 5 * 60 * 1000);

    // Add listener for email changes
    document.getElementById('email').addEventListener('change', loadAndUpdateStats);

    // Add refresh button to stats
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh-stats-btn';
    refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshButton.title = 'Refresh Stats';
    document.querySelector('.stats-container').appendChild(refreshButton);

    refreshButton.addEventListener('click', () => {
        loadAndUpdateStats();
    });

    // Add loading indicator
    function showLoadingStats() {
        const dailyJobCount = document.getElementById('dailyJobCount');
        const monthlyJobCount = document.getElementById('monthlyJobCount');

        dailyJobCount.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        monthlyJobCount.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    // Add error handling UI
    function showStatsError() {
        const dailyJobCount = document.getElementById('dailyJobCount');
        const monthlyJobCount = document.getElementById('monthlyJobCount');

        dailyJobCount.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        monthlyJobCount.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }
});


document.querySelector('.help-btn').addEventListener('click', () => {
    document.querySelector('a[href="#cookie-guide"]').click();
});

const setProfileButton = document.getElementById('setProfileButton'); 
    

// Show the modal when the GET KEY button is clicked  
setProfileButton.addEventListener('click', () => {  
    loginModal.style.display = 'block';  
});  

// Close the modal when clicking outside the modal content  
window.addEventListener('click', (event) => {  
    if (event.target === loginModal) {  
        loginModal.style.display = 'none';  
    }  
});   

// Handle modal form submission  
document.getElementById('getKeyForm').addEventListener('submit', async (event) => {  
    event.preventDefault();  

    // Get all form values  
    const email = document.getElementById('email').value;  
    const password = document.getElementById('password').value;  
    const keyPath = document.getElementById('keyPath').value;  

    // Validate inputs
    if (!email || !password || !keyPath) {
        showCustomAlert('Please fill in all fields and select a key file.');
        return;
    }

    try {  
        const response = await fetch(`${SERVER_URL}/save-credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, keyPath })
        });

        const data = await response.json();
        
        if (data.success) {  
            console.log('Data Updated/Saved Successfully');  
            const loginButton = document.getElementById('setProfileButton');
            loginButton.innerHTML = '<i class="fas fa-check-circle"></i> You are Logged In';
            loginButton.classList.add('logged-in');
        } else {  
            showCustomAlert(`Error: ${data.message}`);  
        }  
    } catch (error) {  
        console.error('Error saving credentials:', error);  
        showCustomAlert('An error occurred while saving credentials.');  
    }  

    // Close the modal  
    document.getElementById('loginModal').style.display = 'none';  
});

    // Add this to your existing script.js

const requestKeyModal = document.getElementById('requestKeyModal');  
const passwordMismatch = document.getElementById('passwordMismatch');  
      
    // Show the modal when the Request Key button is clicked  
getKeyButton.addEventListener('click', () => {  
    requestKeyModal.style.display = 'block';  
});  
    
    // Close the modal when clicking outside the modal content  
window.addEventListener('click', (event) => {  
    if (event.target === requestKeyModal) {  
        requestKeyModal.style.display = 'none';  
        // Clear form and error message when closing  
        document.getElementById('requestKeyForm').reset();  
        passwordMismatch.style.display = 'none';  
    }  
});  
      
    // Real-time password validation  
document.getElementById('confirmPassword').addEventListener('input', function() {  
    const password = document.getElementById('requestPassword').value;  
    const confirmPass = this.value;  
        
    if (password !== confirmPass) {  
        passwordMismatch.style.display = 'block';  
    } else {  
        passwordMismatch.style.display = 'none';  
    }  
});  
      
document.getElementById('requestKeyForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    const email = document.getElementById('requestEmail').value;
    const password = document.getElementById('requestPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (password !== confirmPass) {
        passwordMismatch.style.display = 'block';
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        return;
    }

    try {
        const response = await fetch(`${SERVER_URL}/request-api-key`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            showCustomAlert('Account created successfully! You will receive your API key via email.');
        } else {
            showCustomAlert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error requesting API key:', error);
        showCustomAlert('An error occurred while creating the account.');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;

        // Clear form and close modal
        document.getElementById('requestKeyForm').reset();
        requestKeyModal.style.display = 'none';
        passwordMismatch.style.display = 'none';
    }
});
