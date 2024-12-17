// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Active navigation highlight
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Download button click tracking
    document.querySelector('.download-button').addEventListener('click', function() {
        // You can add analytics tracking here
        console.log('Download initiated');
    });
});

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