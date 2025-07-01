// demo_website/demo.js
document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const generateButton = document.getElementById('generateButton');
    const statusDiv = document.getElementById('status');
    const resultDiv = document.getElementById('result');

    // Determine the target origin for postMessage
    // If it's a file:// URL, window.origin might be "null" or just null.
    // In such cases, for postMessage to work when sending to the same window's content script,
    // we must use '*' or the actual file origin if available and consistent.
    // Using '*' is simpler for file:// but less secure if the page were hosted.
    // For a local server (http://localhost:xxxx), window.origin will be set correctly.
    const targetOrigin = (window.location.protocol === 'file:') ? '*' : window.origin;

    generateButton.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) {
            alert("Please enter some text.");
            return;
        }

        statusDiv.textContent = 'Status: Sending text to extension...';
        resultDiv.textContent = '';

        // Send message TO content script, which will forward to background
        // Use targetOrigin determined above
        window.postMessage({
            type: 'DEMO_PAGE_PROCESS_TEXT',
            text: text
        }, targetOrigin);
    });

    // Listen for messages FROM content script (which got them from background)
    window.addEventListener('message', (event) => {
        // For file:/// an event.origin check can be problematic ("null").
        // The event.source === window check is more reliable here to ensure
        // the message is from a script within the same window (like our content script).
        if (event.source !== window || !event.data) {
            return;
        }

        const { type, payload } = event.data;

        if (type === 'EXTENSION_STATUS_UPDATE') {
            statusDiv.textContent = `Status: ${payload.message}`;
        } else if (type === 'EXTENSION_RESULT') {
            statusDiv.textContent = 'Status: Processing complete!';
            resultDiv.textContent = payload.humanizedText;
        } else if (type === 'EXTENSION_ERROR') {
            statusDiv.textContent = `Status: Error - ${payload.error}`;
            resultDiv.textContent = '';
        } else if (type === 'CONTENT_SCRIPT_READY') {
            statusDiv.textContent = 'Status: Extension connected. Ready.';
            generateButton.disabled = false;
        }
    });

    // Initial check if content script is there
    // The content script will post 'CONTENT_SCRIPT_READY'
    statusDiv.textContent = "Status: Initializing... Waiting for extension connection.";
    generateButton.disabled = true; // Enable once content script confirms

    // A small message if not on HTTP/HTTPS, guiding the user.
    if (window.location.protocol === 'file:') {
        console.warn("Demo page is running via file://. For best results and security, please serve it over HTTP/HTTPS using a local server.");
        const fileWarning = document.createElement('p');
        fileWarning.style.color = 'orange';
        fileWarning.innerHTML = '<strong>Note:</strong> You are running this demo from a local file. For full functionality and a more realistic test environment, please serve it using a local web server (e.g., `http-server` with Node.js).';
        statusDiv.parentNode.insertBefore(fileWarning, statusDiv);
    }
});