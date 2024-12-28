// script.js
// document.addEventListener('DOMContentLoaded', function() {
//     const paymentButtons = document.querySelectorAll('.payment-button');
//     const modal = document.getElementById('paymentModal');
//     const closeBtn = document.querySelector('.close');
//     const paymentMethods = document.querySelectorAll('.payment-method');
//     const upiSection = document.querySelector('.upi-section');
//     const cardSection = document.querySelector('.card-section');
//     const copyUpiBtn = document.querySelector('.copy-upi');
//     const downloadSection = document.getElementById('download');

//     // Initially hide the download section
//     if (downloadSection) {
//         downloadSection.style.display = 'none';
//     }

//     // Open modal when clicking payment buttons
//     paymentButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             modal.style.display = 'block';
//         });
//     });

//     // Close modal
//     closeBtn.addEventListener('click', () => {
//         modal.style.display = 'none';
//     });

//     // Close modal when clicking outside
//     window.addEventListener('click', (e) => {
//         if (e.target === modal) {
//             modal.style.display = 'none';
//         }
//     });

//     // Switch between payment methods
//     paymentMethods.forEach(method => {
//         method.addEventListener('click', () => {
//             paymentMethods.forEach(m => m.classList.remove('active'));
//             method.classList.add('active');
            
//             if (method.classList.contains('upi')) {
//                 upiSection.style.display = 'block';
//                 cardSection.style.display = 'none';
//             } else {
//                 upiSection.style.display = 'none';
//                 cardSection.style.display = 'block';
//             }
//         });
//     });

//     // Copy UPI ID
//     copyUpiBtn.addEventListener('click', () => {
//         const upiId = document.querySelector('.upi-id p').textContent.split(': ')[1];
//         navigator.clipboard.writeText(upiId);
//         copyUpiBtn.textContent = 'Copied!';
//         setTimeout(() => {
//             copyUpiBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
//         }, 2000);
//     });

//     // Handle card payment form submission
//     const cardPaymentForm = document.getElementById('cardPaymentForm');
//     if (cardPaymentForm) {
//         cardPaymentForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             // Add your payment processing logic here
            
//             // For demo purposes, show success and reveal download section
//             alert('Payment successful! You can now download the application.');
//             modal.style.display = 'none';
//             if (downloadSection) {
//                 downloadSection.style.display = 'block';
//             }
//         });
//     }
//     // Smooth scrolling for navigation links
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', function (e) {
//             e.preventDefault();
//             document.querySelector(this.getAttribute('href')).scrollIntoView({
//                 behavior: 'smooth'
//             });
//         });
//     });

//     // Active navigation highlight
//     const sections = document.querySelectorAll('section');
//     const navItems = document.querySelectorAll('.nav-item');

//     window.addEventListener('scroll', () => {
//         let current = '';
//         sections.forEach(section => {
//             const sectionTop = section.offsetTop;
//             const sectionHeight = section.clientHeight;
//             if (pageYOffset >= sectionTop - 60) {
//                 current = section.getAttribute('id');
//             }
//         });

//         navItems.forEach(item => {
//             item.classList.remove('active');
//             if (item.getAttribute('href').slice(1) === current) {
//                 item.classList.add('active');
//             }
//         });
//     });

//     // Download button click tracking
//     document.querySelector('.download-button').addEventListener('click', function() {
//         // You can add analytics tracking here
//         console.log('Download initiated');
//     });
// });

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