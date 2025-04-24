/**
 * DermaSkin - Main JavaScript File
 * This file contains common functionality used across the website
 * Author: Manus AI
 * Date: April 22, 2025
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize FAQ accordions if they exist
    if (document.querySelector('.faq-item')) {
        initFaqAccordions();
    }

    // Şikayet Modal İşlevselliği
    const complaintBtn = document.getElementById('complaintBtn');
    const complaintModal = document.getElementById('complaintModal');
    const closeBtn = document.querySelector('.close');
    const complaintForm = document.getElementById('complaintForm');

    if (complaintBtn && complaintModal) {
        complaintBtn.addEventListener('click', () => {
            complaintModal.style.display = 'block';
        });

        closeBtn.addEventListener('click', () => {
            complaintModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === complaintModal) {
                complaintModal.style.display = 'none';
            }
        });

        complaintForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                complaint: document.getElementById('complaint').value
            };

            // Burada form verilerini backend'e gönderme işlemi yapılabilir
            console.log('Şikayet gönderildi:', formData);
            
            // Başarılı gönderim mesajı
            alert('Şikayetiniz başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
            
            // Formu temizle ve modalı kapat
            complaintForm.reset();
            complaintModal.style.display = 'none';
        });
    }
});

/**
 * Initialize mobile navigation functionality
 */
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle hamburger animation
            const bars = hamburger.querySelectorAll('.bar');
            if (hamburger.classList.contains('active')) {
                bars[0].style.transform = 'translateY(8px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Reset hamburger
                const bars = hamburger.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }
}

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
    // Add fade-in animation to sections when they come into view
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

/**
 * Show a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 * @param {number} duration - How long to show the notification in ms
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles to the notification container
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    
    // Add styles to the notification
    notification.style.backgroundColor = type === 'success' ? '#a5d8d6' : 
                                        type === 'error' ? '#f8c7cc' : 
                                        '#ffeaac';
    notification.style.color = '#333333';
    notification.style.padding = '12px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove notification after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

/**
 * Validate form inputs
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Remove any existing error messages
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Reset input style
        input.style.borderColor = '';
        
        // Check if input is required and empty
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            showInputError(input, 'Bu alan zorunludur.');
        }
        
        // Validate email format
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                isValid = false;
                showInputError(input, 'Geçerli bir e-posta adresi giriniz.');
            }
        }
        
        // Validate password length
        if (input.type === 'password' && input.value.trim() && input.value.length < 6) {
            isValid = false;
            showInputError(input, 'Şifre en az 6 karakter olmalıdır.');
        }
        
        // Validate password confirmation
        if (input.id === 'registerPasswordConfirm') {
            const password = document.getElementById('registerPassword');
            if (password && input.value !== password.value) {
                isValid = false;
                showInputError(input, 'Şifreler eşleşmiyor.');
            }
        }
    });
    
    return isValid;
}

/**
 * Show error message for an input
 * @param {HTMLElement} input - The input with error
 * @param {string} message - The error message
 */
function showInputError(input, message) {
    // Highlight input
    input.style.borderColor = '#f8c7cc';
    
    // Create error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e6a9af';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '5px';
    
    // Add error message after input
    const parent = input.parentElement;
    parent.appendChild(errorElement);
}

/**
 * Handle form submission with AJAX (simulated)
 * @param {HTMLFormElement} form - The form to submit
 * @param {Function} successCallback - Function to call on success
 */
function handleFormSubmit(form, successCallback) {
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Disable submit button and show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'İşleniyor...';
    
    // Simulate AJAX request
    setTimeout(() => {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        
        // Call success callback
        if (typeof successCallback === 'function') {
            successCallback();
        }
    }, 1500);
}

/**
 * Toggle password visibility
 * @param {string} inputId - The ID of the password input
 * @param {string} toggleId - The ID of the toggle button
 */
function togglePasswordVisibility(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(toggleId);
    
    if (passwordInput && toggleButton) {
        toggleButton.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            if (type === 'password') {
                toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
            } else {
                toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
            }
        });
    }
}
