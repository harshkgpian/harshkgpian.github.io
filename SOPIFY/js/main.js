document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTIONS ---
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    
    // Step 1 Elements
    const detailsForm = document.getElementById('details-form');
    const userNameInput = document.getElementById('userName');
    const courseNameInput = document.getElementById('courseName');
    const universityNameInput = document.getElementById('universityName');
    
    // Step 2 Elements
    const inputText = document.getElementById('inputText');
    const humanizeButton = document.getElementById('humanizeButton');
    const statusDiv = document.getElementById('status');
    const humanizedResultDiv = document.getElementById('humanizedResult');
    
    // Step 3 Elements
    const previewContainer = document.getElementById('preview-container');
    const previewName = document.getElementById('preview-name');
    const previewCourse = document.getElementById('preview-course');
    const previewUniversity = document.getElementById('preview-university');
    const previewContent = document.getElementById('preview-content');
    const previewSignatureName = document.getElementById('preview-signature-name');
    
    // Navigation Buttons
    const goToStep2Btn = document.getElementById('go-to-step2');
    const backToStep1Btn = document.getElementById('back-to-step1');
    const goToStep3Btn = document.getElementById('go-to-step3');
    const backToStep2Btn = document.getElementById('back-to-step2');
    const exportButton = document.getElementById('exportButton');

    // --- STATE & DATA ---
    let humanizedText = '';

    // --- FUNCTIONS ---

    // Function to navigate between steps
    const goToStep = (stepNumber) => {
        // Update step content visibility
        stepContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`step${stepNumber}`).classList.add('active');

        // Update stepper UI
        steps.forEach(step => {
            const stepData = parseInt(step.dataset.step, 10);
            if (stepData <= stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    };

    // Save user details to localStorage
    const saveUserData = () => {
        const userData = {
            name: userNameInput.value,
            course: courseNameInput.value,
            university: universityNameInput.value
        };
        localStorage.setItem('sopUserData', JSON.stringify(userData));
    };

    // Load user details from localStorage
    const loadUserData = () => {
        const savedData = localStorage.getItem('sopUserData');
        if (savedData) {
            const userData = JSON.parse(savedData);
            userNameInput.value = userData.name || '';
            courseNameInput.value = userData.course || '';
            universityNameInput.value = userData.university || '';
        }
    };

    // Update the preview pane in Step 3
    const updatePreview = () => {
        const name = userNameInput.value;
        const course = courseNameInput.value;
        const university = universityNameInput.value;

        previewName.textContent = name;
        previewCourse.textContent = course;
        previewUniversity.textContent = university;
        previewSignatureName.textContent = name;
        
        // Clear previous content and format new content with paragraphs
        previewContent.innerHTML = '';
        const paragraphs = humanizedText.split('\n').filter(p => p.trim() !== '');
        paragraphs.forEach(pText => {
            const p = document.createElement('p');
            p.textContent = pText;
            previewContent.appendChild(p);
        });
    };
    
    // Export the document to a .doc file
    const exportToWord = () => {
        const name = userNameInput.value;
        const course = courseNameInput.value;
        const university = universityNameInput.value;

        // Create paragraphs from humanized text
        const contentParagraphs = humanizedText.split('\n')
            .filter(p => p.trim() !== '')
            .map(p => `<p>${p.replace(/</g, "<").replace(/>/g, ">")}</p>`)
            .join('');

        // Define the styles for the Word document
        const styles = `
            body { 
            font-family: 'Times New Roman', serif; 
            font-size: 12pt; 
            line-height: 1.4; 
            margin: 0.2in;
            }
            .title { 
            font-size: 12pt; 
            font-weight: bold; 
            text-align: center; 
            text-decoration: underline; 
            margin-bottom: 8pt;
            }
            .bold { font-weight: bold; }
            .info-line { margin-bottom: 2pt; }
            .content { text-align: justify; margin: 8pt 0; }
            .content p { margin-bottom: 6pt; font-size: 12pt; }
            .signature { margin-top: 10pt; font-size: 12pt; }
        `;
        
        // Construct the full HTML for the document
        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>${styles}</style>
            </head>
            <body>
                <div class="title">STATEMENT OF PURPOSE</div>
                <div class="info">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Course:</strong> ${course}</p>
                    <p><strong>University:</strong> ${university}</p>
                </div>
                <div class="content">
                    ${contentParagraphs}
                </div>
                <div class="signature">
                    <p>Regards,</p>
                    <p><strong>${name}</strong></p>
                </div>
            </body>
            </html>
        `;

        try {
            const blob = new Blob([fullHTML], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `SOP_${name.replace(/\s+/g, '_')}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export document. See console for details.');
        }
    };

    // --- EVENT LISTENERS ---

    // Navigation
    goToStep2Btn.addEventListener('click', () => {
        if (detailsForm.checkValidity()) {
            saveUserData();
            goToStep(2);
        } else {
            detailsForm.reportValidity();
        }
    });
    backToStep1Btn.addEventListener('click', () => goToStep(1));
    goToStep3Btn.addEventListener('click', () => {
        updatePreview();
        goToStep(3);
    });
    backToStep2Btn.addEventListener('click', () => goToStep(2));

    // Export button
    exportButton.addEventListener('click', exportToWord);

    // --- EXTENSION COMMUNICATION LOGIC (from your previous code) ---
    humanizeButton.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) {
            alert("Please paste your draft text first.");
            return;
        }
        statusDiv.textContent = 'Status: Sending text to extension...';
        humanizedResultDiv.textContent = '';
        goToStep3Btn.disabled = true; // Disable next until result is back

        const targetOrigin = (window.location.protocol === 'file:') ? '*' : window.origin;
        window.postMessage({ type: 'DEMO_PAGE_PROCESS_TEXT', text: text }, targetOrigin);
    });

    window.addEventListener('message', (event) => {
        if (event.source !== window || !event.data) return;

        const { type, payload } = event.data;

        if (type === 'EXTENSION_STATUS_UPDATE') {
            statusDiv.textContent = `Status: ${payload.message}`;
        } else if (type === 'EXTENSION_RESULT') {
            statusDiv.textContent = 'Status: Processing complete! You can now proceed.';
            humanizedText = payload.humanizedText; // Store result
            humanizedResultDiv.textContent = humanizedText;
            goToStep3Btn.disabled = false; // Enable the 'Next' button
        } else if (type === 'EXTENSION_ERROR') {
            statusDiv.textContent = `Status: Error - ${payload.error}`;
            goToStep3Btn.disabled = true;
        } else if (type === 'CONTENT_SCRIPT_READY') {
            statusDiv.textContent = 'Status: Extension connected. Ready to humanize.';
        }
    });

    // --- INITIALIZATION ---
    loadUserData();
    goToStep(1); // Start at step 1
});