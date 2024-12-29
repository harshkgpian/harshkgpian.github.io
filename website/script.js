const SERVER_URL = "http://localhost:3110/api";
const RENDER_SERVER_URL = "https://job-assistant-database.onrender.com";


async function fetchData(userEmail) {
    console.log(userEmail);
    const apiUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=AiT1p2nQ0ZV9rUBLI52HHHG5XJ7kVEJlP1d-lTbyAqqSXlGY08wCPqVKL-BtDNjorxGwdJMSo9cdg1ZukQOy2LGcz1eqxd_km5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKsYlWJMwu0w5zbXRJ-rxYqNQuLYzF_Is_LNu88l3d5PV_9QDiPLTNuCV3SvLnlCh-yhADb7bFOnGoNDd_1e4w-AjxSldXHqdg&lib=M-rHMzv28XkGpAlJt7kY9N7BL8y2cZgtr";
  
    try {
      const response = await fetch(apiUrl);
  
      if (response.ok) {
        const data = await response.json();
  
        // Find the user by email
        const user = data.find(item => item.user === userEmail);
  
        if (user) {
          const { jobsAppliedDaily, jobsAppliedMonthly } = user;
  
          console.log(`User: ${userEmail}`);
          console.log(`Jobs Applied Daily: ${jobsAppliedDaily}`);
          console.log(`Jobs Applied Monthly: ${jobsAppliedMonthly}`);
  
          return { jobsAppliedDaily, jobsAppliedMonthly };
        } else {
          console.error("User not found.");
        }
      } else {
        console.error("Error fetching data: ", response.status);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
    
}

// Utility function to check server connection
async function checkServerConnection() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');

    try {
        const response = await fetch(`${SERVER_URL}/ping`);
        const data = await response.json();

        if (data.status === "ok") {
            console.log("Server is connected.");
            statusDot.classList.remove('disconnected');
            statusDot.classList.add('connected');
            statusText.textContent = "Server Connected";
            return true;
        }
        throw new Error('Server status not ok');
    } catch (error) {
        console.error("Server connection error:", error);
        statusDot.classList.remove('connected');
        statusDot.classList.add('disconnected');
        statusText.textContent = "Server Disconnected";
        showCustomAlert("Server is not running. Please start the server.");
        return false;
    }
}




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
checkServerConnection().then((connected) => {
    if (!connected) {
        showCustomAlert("Server is not running. Please start the server.");
    }
    });
  const pdfBrowseButton = document.getElementById("browsePdf");
  const pdfPathInput = document.getElementById("pdfPath");

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
//   handleBrowse(keyBrowseButton, validationCodeInput, ".key", "upload-key"); // Add other key file extensions if needed
});
document.addEventListener("DOMContentLoaded", () => {
    // Get references to all sections and nav buttons
    const sections = {
        mainApp: document.getElementById("mainApp"),
        helpSection: document.querySelector(".info-section"),
        terminalContainer: document.querySelector(".terminal-container"),
    };
    
    const navButtons = document.querySelectorAll(".nav-btn");

    // Function to show a specific section
    function showSection(sectionId) {
        Object.keys(sections).forEach((key) => {
            sections[key].style.display = key === sectionId ? "block" : "none";
        });

        // Update active button
        navButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.getAttribute("data-view") === sectionId);
        });
    }

    // Attach click events to nav buttons
    navButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const sectionId = btn.getAttribute("data-view");
            showSection(sectionId);
        });
    });

    // Show mainApp section initially
    showSection("mainApp");
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

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    // Function to activate a specific tab
    function activateTab(tabId) {
        tabs.forEach((tab) => {
            tab.classList.toggle("active", tab.getAttribute("data-tab") === tabId);
        });

        tabContents.forEach((content) => {
            content.style.display = content.id === tabId ? "block" : "none";
        });
    }

    // Add event listeners to tabs
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabId = tab.getAttribute("data-tab");
            activateTab(tabId);
        });
    });

    // Open the "How to Use" tab by default
    activateTab("usage");
});


let tempEmail = ''; // Temporary storage for email
let tempPassword = ''; // Temporary storage for password
let tempCode = ''; // Temporary storage for verification code

document.querySelectorAll('.autoApplyBtn').forEach((button) => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log("Form Submitted");

        // Get the submit button
        const submitButton = e.target;
        const originalButtonText = submitButton.innerHTML;

    // Disable button and show loading state  
    submitButton.disabled = true;  
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';  

    const formData = {      
        credentials: {      
            path: document.getElementById('pdfPath').value,
            curCTC: document.getElementById('currentCTC').value,
            noticePeriod: document.getElementById('noticePeriod').value,
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
            // validationCode: tempCode     
        }      
    };      
    console.log(formData);

    // Validate form data
    if (!formData.credentials.path) {      
        showCustomAlert('Please fill in all required fields');  
        submitButton.disabled = false;  
        submitButton.innerHTML = originalButtonText;  
        return;      
    }  

    try {
        // if (credentialsData.success) {
            console.log('Credentials Updated/Saved Successfully');
            const appContainer = document.getElementById('mainApp'); // Replace 'mainApp' with your main app container's ID
            appContainer.style.display = 'block';
            signUpModal.style.display = 'none';

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
        // } else {
        //     showCustomAlert(`Error: ${credentialsData.message}`);
        // }

    } catch (error) {
        console.error('Error:', error);
        showCustomAlert('An error occurred while processing your request.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});
});
async function loadSavedData() {
    try {
        // Fetch saved data directly using fetch
        const response = await fetch(`${SERVER_URL}/load-saved-data`); // Assuming this API exists on your backend
        const data = await response.json();
        console.log(data);
        console.log("Data", data.data);

        if (data.success && data.data) {
            const { credentials, searchParams, key } = data.data;
            console.log("searchParams", searchParams);

            // Load values with fallback to default if data is missing
            document.getElementById('pdfPath').value = credentials?.path || '';
            document.getElementById('jobTitle').value = searchParams?.jobTitle || 'Data Science';
            document.getElementById('location').value = searchParams?.location || 'India';
            document.getElementById('email').value = key?.email || '';
            document.getElementById('password').value = key?.password || '';
            document.getElementById('noticePeriod').value = credentials?.noticePeriod || '30';

            document.getElementById('currentCTC').value = credentials?.curCTC || '800000';
            document.getElementById('expectedCTC').value = credentials?.expCTC || '1200000';
            

            if (searchParams?.filters) {
                document.getElementById('experienceLevel').value = searchParams.filters?.experienceLevel;
                document.getElementById('workType').value = searchParams.filters?.workType ;
                document.getElementById('datePosted').value = searchParams.filters?.datePosted;
                document.getElementById('easyApply').checked = searchParams.filters?.easyApply !== undefined ? searchParams.filters.easyApply : true;
            }

            // Only proceed with saving credentials if the necessary data exists
            if (key?.email && key?.password && key?.validationCode) {
                console.log('Found saved credentials, attempting to save...');
                const saveResponse = await fetch(`${SERVER_URL}/save-credentials`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: key.email,
                        password: key.password,
                        verificationCode: key.validationCode // Use empty string if verificationCode is missing
                    })
                });

                const saveData = await saveResponse.json();

                if (saveData.success) {
                    console.log('Credentials saved successfully!');
                    // On success, show the main app and hide the sign-up modal
                    const appContainer = document.getElementById('mainApp'); // Replace 'mainApp' with your main app container's ID
                    appContainer.style.display = 'block';
                    const signUpModal = document.getElementById('signUpModal'); // Replace with actual modal ID
                    signUpModal.style.display = 'none';
                        // Get reference to the button
                    const button = document.getElementById('buyButton');
                    const icon = button.querySelector('i');  

                    if (!saveData.isTrialMode) {
                        // If the user is NOT in trial mode (i.e., they are a premium user)
                        button.textContent = 'PREMIUM'; // Change button text to 'Premium'
                        button.style.backgroundColor = '#6feb96'; // Change button color to green
                        button.disabled = true; // Disable the button
                    } 

                } else {
                    console.error('Error saving credentials:', saveData.message);
                    showCustomAlert('Error saving credentials.');
                }
            } else {
                console.log('Missing email or password, skipping save credentials step.');
            }
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
        showCustomAlert('Error loading saved data.');
    }
}




// Load saved data when page loads   
document.addEventListener('DOMContentLoaded', async () => {
    checkServerConnection().then((connected) => {
        if (!connected) {
          showCustomAlert("Server is not running. Please start the server.");
        }
      });
    await loadSavedData();

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
                const stats = await fetchData(userEmail); 
                console.log(stats);
    
                if (stats) {

                    updateJobStats(stats.jobsAppliedDaily, stats.jobsAppliedMonthly);
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


// Show the login modal initially
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('signUpModal');  
    const appContainer = document.getElementById('mainApp'); // Replace 'mainApp' with your main app container's ID

    // Ensure the main app is hidden initially
    appContainer.style.display = 'none';

    // Display the login modal
    loginModal.style.display = 'block';
});

// Step 1: Sign Up - Request API Key
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
            // Store email and password for the next step
            tempEmail = email;
            tempPassword = password;

            // Success, show verification code modal
            showCustomAlert('Account created successfully! Please enter the verification code.');
            document.getElementById('signUpModal').style.display = 'none'; // Hide Sign-Up modal
            document.getElementById('verificationModal').style.display = 'block'; // Show Verification modal
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

        // Clear form
        document.getElementById('requestKeyForm').reset();
    }
});

// Step 2: Verification - Save Credentials (with verification code)
document.getElementById('verificationForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const verificationCode = document.getElementById('verificationCode').value;

    if (!verificationCode) {
        showCustomAlert('Please enter the verification code.');
        return;
    }

    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    console.log(tempEmail, tempPassword, verificationCode);
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

    try {
        const response = await fetch(`${SERVER_URL}/save-credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({ email: tempEmail, password: tempPassword, verificationCode })
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            tempCode = verificationCode;

            // Success, show login button
            showCustomAlert('Account verified successfully! You can now log in.');

            // Hide the verification modal and show the login modal
            document.getElementById('verificationModal').style.display = 'none';
            document.getElementById('loginModal').style.display = 'block';
        } else {
            showCustomAlert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error verifying account:', error);
        showCustomAlert('An error occurred while verifying your account.');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;

        // Clear form
        document.getElementById('verificationForm').reset();
    }
});


// Step 3: Login form submission
document.getElementById('getKeyForm').addEventListener('submit', async (event) => {
    event.preventDefault();



    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    if (!email || !password) {
        showCustomAlert('Please fill in all fields.');
        return;
    }

    try {
        // Get saved data if available, otherwise use the temporary verification code
        const response = await fetch(`${SERVER_URL}/load-saved-data`);
        const data = await response.json();

        let codeToUse = tempCode; // Default to verificationCode from form

        if (data.success && data.data) {
            const { key } = data.data;
            if (key && key.validationCode) {
                codeToUse = key.validationCode; // Use saved code if available
            }
        }

        const saveResponse = await fetch(`${SERVER_URL}/save-credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                verificationCode: codeToUse
            })
        });


        const dataVeri = await saveResponse.json();

        if (dataVeri.success) {
            // Hide the login modal
            document.getElementById('loginModal').style.display = 'none';

            // Show the main app
            const appContainer = document.getElementById('mainApp'); // Replace 'mainApp' with your main app container's ID
            appContainer.style.display = 'block';
        } else {
            showCustomAlert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error saving credentials:', error);
        showCustomAlert('An error occurred while saving credentials.');
    }
});

// Password mismatch validation on sign-up
document.getElementById('confirmPassword').addEventListener('input', function () {
    const password = document.getElementById('requestPassword').value;
    const confirmPass = this.value;

    if (password !== confirmPass) {
        passwordMismatch.style.display = 'block';
    } else {
        passwordMismatch.style.display = 'none';
    }
});

// Show the modal when the Request Key button is clicked
document.getElementById('getKeyButton').addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signUpModal').style.display = 'block';
});

// Switch to the login modal from verification modal
document.getElementById('toLoginButton').addEventListener('click', function () {
    document.getElementById("signUpModal").style.display = "none";
    document.getElementById("loginModal").style.display = "block";
});

// Add this script at the end of your body tag
// document.addEventListener('DOMContentLoaded', function() {
//     const accountBtn = document.querySelector('.nav-account .nav-btn');
//     const terminalContainer = document.querySelector('.terminal-container');
    
//     accountBtn.addEventListener('click', function() {
//         // Toggle the display of terminal container
//         if (terminalContainer.style.display === 'none' || !terminalContainer.style.display) {
//             terminalContainer.style.display = 'block';
//             mainApp.style.display = 'none';
//         } else {
//             terminalContainer.style.display = 'none';
//         }
//     });
// });
//     // Get all form values

document.addEventListener("DOMContentLoaded", () => {
    const terminalOutput = document.getElementById("terminalOutput");

    // Function to fetch logs
    async function fetchLogs() {
        try {
            const response = await fetch(`${SERVER_URL}/logs`); // Ensure SERVER_URL matches your backend
            const data = await response.json();
            if (data.success) {
                terminalOutput.innerHTML = data.logs.map(log => `<p>${log}</p>`).join('');
                terminalOutput.scrollTop = terminalOutput.scrollHeight; // Auto-scroll to the bottom
            } else {
                console.error("Error fetching logs:", data.message);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    }

    // Fetch logs periodically
    setInterval(fetchLogs, 2000); // Adjust interval as needed
});


// Select the button

document.getElementById("buyButton").addEventListener("click", async () => {
    const email = document.getElementById('email').value; // Replace with your username
    console.log("Email Found", email);

    try {
      // Step 1: Request order details from the backend
      const orderResponse = await fetch(`${RENDER_SERVER_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const orderDetails = await orderResponse.json();
      console.log("Order Details", orderDetails);

      // Step 2: Initialize Razorpay payment
      const options = {
        key: 'rzp_live_9vAHdHkSzcXaEB', // Replace with your Razorpay key
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        name: 'Your Service Name',
        description: 'Premium Subscription',
        order_id: orderDetails.id, // Razorpay order ID
        handler: async (response) => {
          // Step 3: Send payment confirmation to the backend
          const confirmResponse = await fetch(`${RENDER_SERVER_URL}/confirm-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: email,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            }),
          });
          console.log("Response", confirmResponse);

          const confirmResult = await confirmResponse.json();

          if (confirmResult.success) {
            alert('Payment Successful! You are now a premium user. Restart the server to access premium features.');
          } else {
            alert('Payment verification failed. Please try again.');
          }
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  });



