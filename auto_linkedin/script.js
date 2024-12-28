
// Add to your existing script.js
document.querySelector('.download-button').addEventListener('click', function(e) {
    // Track download click
    console.log('Download initiated from Google Drive');
    
    // Optional: Show a message to user
    const downloadStarted = document.createElement('div');
    downloadStarted.className = 'download-notification';
    downloadStarted.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <p>Download starting from Google Drive...</p>
        </div>
    `;
    document.body.appendChild(downloadStarted);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        downloadStarted.remove();
    }, 5000);
});
