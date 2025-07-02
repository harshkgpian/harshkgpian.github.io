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
    const humanizedResultTextarea = document.getElementById('humanizedResult');
    
    // Step 3 Elements
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

    // --- FUNCTIONS ---

    // ** NEW: A dedicated function to check if the Step 2 "Next" button should be enabled. **
    const checkStep2NextButtonState = () => {
        // Enable the button if the humanized result textarea has content, disable it if not.
        const hasContent = humanizedResultTextarea.value.trim() !== '';
        goToStep3Btn.disabled = !hasContent;
    };

    // Function to navigate between steps
    const goToStep = (stepNumber) => {
        stepContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`step${stepNumber}`).classList.add('active');
        steps.forEach(step => {
            const stepData = parseInt(step.dataset.step, 10);
            step.classList.toggle('active', stepData <= stepNumber);
        });
    };

    // Save/Load user details
    const saveUserData = () => {
        localStorage.setItem('sopUserData', JSON.stringify({
            name: userNameInput.value,
            course: courseNameInput.value,
            university: universityNameInput.value
        }));
    };

    const loadUserData = () => {
        const savedData = JSON.parse(localStorage.getItem('sopUserData') || '{}');
        userNameInput.value = savedData.name || '';
        courseNameInput.value = savedData.course || '';
        universityNameInput.value = savedData.university || '';
    };

    // Update the preview pane in Step 3
    const updatePreview = () => {
        const name = userNameInput.value;
        const course = courseNameInput.value;
        const university = universityNameInput.value;
        const humanizedText = humanizedResultTextarea.value;

        previewName.textContent = name;
        previewCourse.textContent = course;
        previewUniversity.textContent = university;
        previewSignatureName.textContent = name;
        
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
        const contentParagraphs = humanizedResultTextarea.value.split('\n')
            .filter(p => p.trim() !== '')
            .map(p => `<p>${p.replace(/</g, "<").replace(/>/g, ">")}</p>`)
            .join('');

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
        
        const fullHTML = `
            <!DOCTYPE html><html><head><meta charset="UTF-8"><style>${styles}</style></head>
            <body>
            <div class="title">STATEMENT OF PURPOSE</div>
            <div class="info">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Course:</strong> ${course}</p>
                <p><strong>University:</strong> ${university}</p>
            </div>
            <div class="content">${contentParagraphs}</div>
            <div class="signature"><p><strong>Regards,</strong></p><p><strong>${name}</strong></p></div>
            </body></html>`;

        const filename = `SOP_${name.replace(/\s+/g, '_')}_${course.replace(/\s+/g, '_')}.doc`;

        try {
            const blob = new Blob([fullHTML], { type: 'application/msword' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export document. See console for details.');
        }
    };

    // --- EVENT LISTENERS ---

    // ** CHANGED: Check button state on manual input **
    humanizedResultTextarea.addEventListener('input', checkStep2NextButtonState);

    // Navigation
    goToStep2Btn.addEventListener('click', () => {
        if (detailsForm.checkValidity()) {
            saveUserData();
            goToStep(2);
            // ** ADDED: Check button state when arriving at Step 2 **
            checkStep2NextButtonState(); 
        } else {
            detailsForm.reportValidity();
        }
    });

    backToStep1Btn.addEventListener('click', () => goToStep(1));

    goToStep3Btn.addEventListener('click', () => {
        updatePreview();
        goToStep(3);
    });

    backToStep2Btn.addEventListener('click', () => {
        goToStep(2);
        // ** ADDED: Check button state when coming back to Step 2 **
        checkStep2NextButtonState(); 
    });

    // Export button
    exportButton.addEventListener('click', exportToWord);

    // --- EXTENSION COMMUNICATION LOGIC ---
    humanizeButton.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) {
            alert("Please paste your draft text first.");
            return;
        }
        statusDiv.textContent = 'Status: Sending text to extension...';
        
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
            humanizedResultTextarea.value = payload.humanizedText;
            // ** CHANGED: This now correctly triggers the check **
            checkStep2NextButtonState(); 
        } else if (type === 'EXTENSION_ERROR') {
            statusDiv.textContent = `Status: Error - ${payload.error}. You can paste text manually into the result box.`;
        } else if (type === 'CONTENT_SCRIPT_READY') {
            statusDiv.textContent = 'Status: Extension connected. Ready to humanize.';
        }
    });

    // --- INITIALIZATION ---
    loadUserData();
    goToStep(1);
});