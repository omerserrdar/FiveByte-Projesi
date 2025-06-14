/**
 * DermaSkin - Main JavaScript File
 * This file contains common functionality used across the website
 * Author: Manus AI
 * Date: April 22, 2025
 */

import { authAPI, productAPI, reviewAPI, complaintAPI } from './api.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize user dropdown
    initUserDropdown();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize FAQ accordions if they exist
    if (document.querySelector('.faq-item')) {
        initFaqAccordions();
    }
    
    // Load featured products on homepage
    if (document.querySelector('.featured-products')) {
        loadFeaturedProducts();
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

        complaintForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                subject: document.getElementById('name').value,
                message: document.getElementById('complaint').value
            };

            try {
                const response = await complaintAPI.submitComplaint(formData);
                if (response.success) {
                    alert('Şikayetiniz başarıyla gönderildi.');
                    complaintForm.reset();
                    complaintModal.style.display = 'none';
                } else {
                    alert('Şikayet gönderilirken bir hata oluştu.');
                }
            } catch (error) {
                console.error('Şikayet gönderme hatası:', error);
                alert('Şikayet gönderilirken bir hata oluştu.');
            }
        });
    }

    // Daha Fazla Yorum Göster Butonu İşlevselliği
    initShowMoreReviews();
    
    // Mobil menü işlevselliği
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Favori butonları işlevselliği
    const favoriteButtons = document.querySelectorAll('.add-favorite');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.closest('.product-card').dataset.productId;
            try {
                const response = await productAPI.addToFavorites(productId);
                if (response.success) {
                    button.querySelector('i').classList.toggle('far');
                    button.querySelector('i').classList.toggle('fas');
                }
            } catch (error) {
                console.error('Favorilere eklenirken hata:', error);
            }
        });
    });

    // Yorumları gösterme/gizleme işlevselliği
    const showMoreButton = document.querySelector('.show-more-reviews');
    const hiddenReviews = document.querySelectorAll('.review.hidden');
    
    if (showMoreButton && hiddenReviews.length > 0) {
        showMoreButton.addEventListener('click', function() {
            hiddenReviews.forEach(review => {
                review.classList.remove('hidden');
            });
            showMoreButton.style.display = 'none';
        });
    }

    // Profilim ve Favorilerim butonlarına işlevsellik ekle
    attachProfileAndFavoritesListeners();
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
 * Initialize user dropdown functionality with click-based controls
 */
function initUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userMenu && userDropdown) {
        // Click to toggle dropdown
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });
        
        // Prevent dropdown from closing when clicking inside it
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target)) {
                userMenu.classList.remove('active');
            }
        });
        
        // Close dropdown when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                userMenu.classList.remove('active');
            }
        });
        
        // Enhanced dropdown link handling with visual feedback
        const dropdownLinks = userDropdown.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add loading animation
                const originalText = this.textContent;
                this.style.opacity = '0.6';
                this.style.pointerEvents = 'none';
                
                // Restore after short delay (allows for page transition)
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                }, 1000);
                
                // Close dropdown
                userMenu.classList.remove('active');
            });
        });
        
        // Add hover delay for mobile compatibility
        let hoverTimeout;
        userMenu.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) { // Only on desktop
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    userMenu.classList.add('active');
                }, 200);
            }
        });
        
        userMenu.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) { // Only on desktop
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    userMenu.classList.remove('active');
                }, 300);
            }
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
            // Close other items
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

// Daha Fazla Yorum Göster Butonu İşlevselliği
function initShowMoreReviews() {
    const showMoreButtons = document.querySelectorAll('.show-more-reviews');
    
    showMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const reviewsContainer = productCard.querySelector('.product-reviews');
            const reviews = reviewsContainer.querySelectorAll('.review');
            const hiddenReviews = Array.from(reviews).filter(review => review.classList.contains('hidden'));
            
            // Eğer gizli yorum varsa göster
            if (hiddenReviews.length > 0) {
                // İlk 2 gizli yorumu göster
                hiddenReviews.slice(0, 2).forEach(review => {
                    review.classList.remove('hidden');
                });
                
                // Eğer hala gizli yorum kaldıysa butonu güncelle
                if (hiddenReviews.length > 2) {
                    this.textContent = `Daha Fazla Yorum Göster (${hiddenReviews.length - 2} kaldı)`;
                } else {
                    // Tüm yorumlar gösterildiyse butonu gizle
                    this.style.display = 'none';
                }
            } else {
                // Gizli yorum kalmadıysa butonu gizle
                this.style.display = 'none';
            }
        });
    });
}

// Sayfa yüklendiğinde ürünleri getir
document.addEventListener('DOMContentLoaded', async () => {
    // Ana sayfada sadece öne çıkan ürünleri göster
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        loadFeaturedProducts();
    } else {
        // Diğer sayfalarda tüm ürünleri göster
        try {
            const response = await productAPI.getAllProducts();
            const products = response.success && response.data ? response.data : [];
            updateProductCards(products);
        } catch (error) {
            console.error('Ürünler yüklenirken hata:', error);
        }
    }
});

// Öne çıkan ürünleri yükle
async function loadFeaturedProducts() {
    try {
        const response = await productAPI.getAllProducts();
        
        // API response format kontrolü
        const allProducts = response.success && response.data ? response.data : [];
        
        if (allProducts.length === 0) {
            console.warn('Ürün bulunamadı');
            return;
        }
        
        // Öne çıkan ürünleri filtrele (featured=true olan veya badge="Öne Çıkan" olan)
        const featuredProducts = allProducts.filter(product => 
            product.featured === true || 
            product.badge === "Öne Çıkan" ||
            product.name === "Bepantol Cilt Bakım Kremi" || // Bepantol'u öne çıkan olarak işaretle
            product.name.toLowerCase().includes('avene') // Avène ürünlerini de öne çıkan olarak işaretle
        ).slice(0, 6); // Maksimum 6 ürün göster
        
        updateFeaturedProductCards(featuredProducts);
    } catch (error) {
        console.error('Öne çıkan ürünler yüklenirken hata:', error);
    }
}

// Öne çıkan ürün kartlarını güncelle
function updateFeaturedProductCards(products) {
    const productCards = document.getElementById('products-container');
    if (!productCards) return;

    // Önce mevcut ürünleri temizle
    productCards.innerHTML = '';

    products.forEach(product => {
        const card = createFeaturedProductCard(product);
        productCards.appendChild(card);
    });
    
    // Kalp butonlarına event listener ekle
    initializeFavoriteButtons();
}

// Öne çıkan ürün kartı oluştur
function createFeaturedProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product._id;
    card.dataset.productType = product.type;

    // Bepantol ve Avène için görsel göster
    const shouldShowImage = product.imageUrl && (
        product.name.toLowerCase().includes('bepantol') ||
        product.name.toLowerCase().includes('avene') ||
        product.name.toLowerCase().includes('avène')
    );
    
    const imageHTML = shouldShowImage 
        ? `<div class="product-image">
               <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
           </div>` 
        : '';

    card.innerHTML = `
        <div class="product-badge">${product.badge || 'Öne Çıkan'}</div>
        <button class="add-favorite" onclick="toggleFavorite('${product._id}', this)">
            <i class="far fa-heart"></i>
        </button>
        ${imageHTML}
        <div class="product-info">
            <h3>${product.name}</h3>
            ${product.type ? `<p class="product-type">${product.type}</p>` : ''}
            ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
            <div class="product-rating">
                ${createRatingStars(product.rating || 0)}
                <span>(${product.reviewCount || 0} değerlendirme)</span>
            </div>
            <div class="product-actions">
                <button class="btn btn-outline view-reviews" onclick="showProductReviews('${product._id}', '${product.name}')">
                    <i class="fas fa-comments"></i> Yorumlar
                </button>
            </div>
        </div>
    `;

    return card;
}

// Favori butonlarını initialize et
function initializeFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.add-favorite');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    favoriteButtons.forEach(button => {
        const productCard = button.closest('.product-card');
        const productId = productCard.dataset.productId;
        
        if (favorites.includes(productId)) {
            button.classList.add('favorited');
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
        }
    });
}

// Ürün kartlarını güncelle
function updateProductCards(products) {
    const productCards = document.querySelector('.product-cards');
    if (!productCards) return;

    products.forEach(product => {
        const card = createProductCard(product);
        productCards.appendChild(card);
    });
}

// Ürün kartı oluştur
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product._id;

    card.innerHTML = `
        <div class="product-badge">${product.badge || ''}</div>
        <div class="product-info">
            <h3>${product.name || ''}</h3>
            ${product.type ? `<p class="product-type">${product.type}</p>` : ''}
            ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
            <div class="product-rating">
                ${createRatingStars(product.rating || 0)}
                <span>(${product.reviewCount || 0})</span>
            </div>
            <div class="product-actions">
                <button class="btn btn-outline add-favorite">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;

    return card;
}

// Yıldız derecelendirmesi oluştur
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

function attachProfileAndFavoritesListeners() {
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn && !profileBtn.hasAttribute('data-listener')) {
        profileBtn.setAttribute('data-listener', 'true');
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'profile.html';
        });
    }
    const favoritesBtn = document.getElementById('favoritesBtn');
    if (favoritesBtn && !favoritesBtn.hasAttribute('data-listener')) {
        favoritesBtn.setAttribute('data-listener', 'true');
        favoritesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'favorites.html';
        });
    }
}

class App {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        // Kullanıcı durumunu kontrol et
        this.checkAuthStatus();
        
        // Header'ı güncelle
        this.updateHeader();
        
        // Çıkış yapma işlemi
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Profil ve favoriler butonlarını başta da ekle
        attachProfileAndFavoritesListeners();
    }

    checkAuthStatus() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            this.user = JSON.parse(user);
        }
    }

    updateHeader() {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');
        
        if (this.user) {
            // Kullanıcı giriş yapmış
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                const userName = userMenu.querySelector('.user-name');
                if (userName) userName.textContent = this.user.name || this.user.email || 'Kullanıcı';
            }
        } else {
            // Kullanıcı giriş yapmamış
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
        
        // Header güncellendikten sonra tekrar listener ekle
        attachProfileAndFavoritesListeners();
    }

    handleLogout() {
        // LocalStorage'dan kullanıcı bilgilerini temizle
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Kullanıcı durumunu güncelle
        this.user = null;
        
        // Header'ı güncelle
        this.updateHeader();
        
        // Ana sayfaya yönlendir
        window.location.href = '/';
    }
}

// Girişten sonra header'ı güncellemek için global fonksiyon
window.updateHeaderAfterLogin = function() {
    if (window.appInstance && typeof window.appInstance.updateHeader === 'function') {
        window.appInstance.checkAuthStatus();
        window.appInstance.updateHeader();
    }
};

// Sayfa yüklendiğinde App'i başlat
let appInstance = null;
document.addEventListener('DOMContentLoaded', () => {
    window.appInstance = new App();
});

// Favorites Management System
function initializeFavorites() {
    // Load favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Update all heart buttons on page load
    document.querySelectorAll('.add-favorite').forEach(button => {
        const productId = parseInt(button.getAttribute('onclick').match(/\d+/)[0]);
        if (favorites.includes(productId)) {
            button.classList.add('favorited');
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
        }
    });
}

// Toggle favorite status
function toggleFavorite(productId, buttonElement) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    
    // Get product info
    const productCard = buttonElement.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productDescription = productCard.querySelector('.product-description')?.textContent || '';
    const productType = productCard.dataset.productType || 'product';
    
    const product = {
        id: productId,
        name: productName,
        description: productDescription,
        category: getCategoryFromType(productType),
        type: getDisplayType(productType),
        dateAdded: new Date().toISOString().split('T')[0]
    };
    
    if (favorites.includes(productId)) {
        // Remove from favorites
        favorites = favorites.filter(id => id !== productId);
        buttonElement.classList.remove('favorited');
        buttonElement.querySelector('i').classList.remove('fas');
        buttonElement.querySelector('i').classList.add('far');
        
        // Remove from user favorites
        if (userData.favorites) {
            userData.favorites = userData.favorites.filter(item => item.id !== productId);
        }
        
        showNotification('Ürün favorilerden kaldırıldı', 'info', 2000);
    } else {
        // Add to favorites
        favorites.push(productId);
        buttonElement.classList.add('favorited');
        buttonElement.querySelector('i').classList.remove('far');
        buttonElement.querySelector('i').classList.add('fas');
        
        // Add to user favorites
        if (!userData.favorites) {
            userData.favorites = [];
        }
        userData.favorites.push(product);
        
        // Trigger heart animation
        buttonElement.style.animation = 'favoriteAdded 0.6s ease-in-out';
        setTimeout(() => {
            buttonElement.style.animation = '';
        }, 600);
        
        showNotification('Ürün favorilere eklendi!', 'success', 2000);
    }
    
    // Update localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update favorites count in user data
    userData.totalFavorites = favorites.length;
    localStorage.setItem('user', JSON.stringify(userData));
}

// Helper function to map product types to categories
function getCategoryFromType(type) {
    const categoryMap = {
        'moisturizer': 'moisturizers',
        'moisturizers': 'moisturizers',
        'cleanser': 'cleansers',
        'cleansers': 'cleansers',
        'serum': 'serums',
        'serums': 'serums',
        'sunscreen': 'sunscreens',
        'sunscreens': 'sunscreens',
        'mask': 'skincare',
        'toner': 'skincare',
        'cream': 'moisturizers'
    };
    return categoryMap[type] || 'skincare';
}

// Helper function to get display type
function getDisplayType(type) {
    const typeMap = {
        'moisturizer': 'Nemlendirici',
        'cleanser': 'Temizleyici',
        'serum': 'Serum',
        'sunscreen': 'Güneş Koruma',
        'mask': 'Maske',
        'toner': 'Toner',
        'cream': 'Krem'
    };
    return typeMap[type] || 'Cilt Bakım Ürünü';
}

// ===== YORUM SİSTEMİ =====

// Ürün yorumlarını göster modal'ı
window.showProductReviews = async function(productId, productName) {
    try {
        // Modal var mı kontrol et, yoksa oluştur
        let modal = document.getElementById('review-modal');
        if (!modal) {
            createReviewModal();
            modal = document.getElementById('review-modal');
        }

        // Modal içeriğini güncelle
        const modalTitle = modal.querySelector('.modal-title');
        const reviewsContainer = modal.querySelector('.reviews-container');
        
        modalTitle.textContent = `${productName} - Yorumlar`;
        reviewsContainer.innerHTML = '<div class="loading">Yorumlar yükleniyor...</div>';
        
        // Modal'ı göster
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Yorumları yükle
        await loadProductReviews(productId);
        
        // Yorum formunu başlat
        initializeReviewForm(productId);
        
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
        showNotification('Yorumlar yüklenirken bir hata oluştu.', 'error');
    }
};

// Yorum modal'ını oluştur
function createReviewModal() {
    const modalHTML = `
        <div id="review-modal" class="product-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Ürün Yorumları</h3>
                    <span class="close-modal" onclick="closeReviewModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="reviews-section">
                        <div class="reviews-container">
                            <!-- Yorumlar buraya yüklenecek -->
                        </div>
                    </div>
                    
                    <div class="add-review-section">
                        <h4><i class="fas fa-edit"></i> Yorum Ekle</h4>
                        <form id="review-form">
                            <div class="form-group">
                                <label><i class="fas fa-star"></i> Puanınız:</label>
                                <div class="rating-input">
                                    <span class="star" data-rating="1">★</span>
                                    <span class="star" data-rating="2">★</span>
                                    <span class="star" data-rating="3">★</span>
                                    <span class="star" data-rating="4">★</span>
                                    <span class="star" data-rating="5">★</span>
                                </div>
                                <small class="rating-text">Ürünü değerlendirin</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="review-comment"><i class="fas fa-comment"></i> Yorumunuz:</label>
                                <textarea id="review-comment" rows="4" required placeholder="Bu ürün hakkında deneyiminizi paylaşın..." maxlength="500"></textarea>
                                <div class="char-counter">
                                    <span id="char-count">0</span>/500 karakter
                                </div>
                            </div>
                            
                            <div class="form-group name-section">
                                <div class="anonymous-option">
                                    <input type="checkbox" id="anonymous-check" checked>
                                    <label for="anonymous-check">
                                        <i class="fas fa-user-secret"></i> Anonim olarak yorum yap
                                    </label>
                                </div>
                                <div class="name-input" style="display: none;">
                                    <label for="user-name"><i class="fas fa-user"></i> Adınız:</label>
                                    <input type="text" id="user-name" placeholder="Adınızı girin">
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> Yorum Gönder
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Yorum modal'ını kapat
window.closeReviewModal = function() {
    const modal = document.getElementById('review-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Ürün yorumlarını yükle
async function loadProductReviews(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/reviews/${productId}`);
        const result = await response.json();
        
        const reviewsContainer = document.querySelector('#review-modal .reviews-container');
        
        if (result.success && result.data.length > 0) {
            const reviewsHTML = result.data.map((review, index) => {
                const displayName = review.isAnonymous || !review.userName || review.userName === 'Anonim Kullanıcı' 
                    ? `🕵️ Anonim Kullanıcı #${result.data.length - index}` 
                    : `👤 ${review.userName}`;
                    
                const timeAgo = getTimeAgo(new Date(review.createdAt));
                
                return `
                    <div class="review-item">
                        <div class="review-header">
                            <div class="reviewer-info">
                                <span class="reviewer-name">${displayName}</span>
                                <span class="review-date">${timeAgo}</span>
                            </div>
                            <div class="review-rating">
                                ${createRatingStars(review.rating)}
                                <span class="rating-text-small">${getRatingText(review.rating)}</span>
                            </div>
                        </div>
                        <div class="review-content">
                            <p>${review.comment}</p>
                        </div>
                    </div>
                `;
            }).join('');
            
            reviewsContainer.innerHTML = reviewsHTML;
        } else {
            reviewsContainer.innerHTML = '<div class="no-reviews">Henüz yorum yapılmamış. İlk yorumu siz yapın!</div>';
        }
        
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
        document.querySelector('#review-modal .reviews-container').innerHTML = 
            '<div class="error-message">Yorumlar yüklenirken bir hata oluştu.</div>';
    }
}

// Yorum formunu başlat
function initializeReviewForm(productId) {
    const form = document.getElementById('review-form');
    const stars = document.querySelectorAll('.rating-input .star');
    const commentTextarea = document.getElementById('review-comment');
    const charCount = document.getElementById('char-count');
    const ratingText = document.querySelector('.rating-text');
    const anonymousCheck = document.getElementById('anonymous-check');
    const nameInput = document.querySelector('.name-input');
    let selectedRating = 0;
    
    // Character counter
    if (commentTextarea && charCount) {
        commentTextarea.addEventListener('input', () => {
            const count = commentTextarea.value.length;
            charCount.textContent = count;
            
            // Renk değişimi
            if (count > 450) {
                charCount.style.color = '#e74c3c';
            } else if (count > 350) {
                charCount.style.color = '#f39c12';
            } else {
                charCount.style.color = '#27ae60';
            }
        });
    }
    
    // Anonim checkbox kontrolü
    if (anonymousCheck && nameInput) {
        anonymousCheck.addEventListener('change', () => {
            if (anonymousCheck.checked) {
                nameInput.style.display = 'none';
                document.getElementById('user-name').required = false;
            } else {
                nameInput.style.display = 'block';
                document.getElementById('user-name').required = true;
            }
        });
    }
    
    // Yıldız rating sistemi
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            updateStarDisplay(stars, selectedRating);
            updateRatingText(selectedRating);
        });
        
        star.addEventListener('mouseenter', () => {
            updateStarDisplay(stars, index + 1);
            updateRatingText(index + 1);
        });
    });
    
    document.querySelector('.rating-input').addEventListener('mouseleave', () => {
        updateStarDisplay(stars, selectedRating);
        updateRatingText(selectedRating);
    });
    
    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (selectedRating === 0) {
            showNotification('Lütfen bir puan seçin!', 'error');
            return;
        }
        
        const comment = commentTextarea.value.trim();
        if (!comment) {
            showNotification('Lütfen yorumunuzu yazın!', 'error');
            return;
        }
        
        if (comment.length < 3) {
            showNotification('Yorum en az 3 karakter olmalıdır!', 'error');
            return;
        }
        
        const isAnonymous = anonymousCheck.checked;
        const userName = isAnonymous ? '' : document.getElementById('user-name').value.trim();
        
        if (!isAnonymous && !userName) {
            showNotification('Lütfen adınızı girin veya anonim seçeneğini işaretleyin!', 'error');
            return;
        }
        
        const formData = {
            rating: selectedRating,
            comment: comment,
            userName: userName,
            isAnonymous: isAnonymous
        };
        
        // Submit butonunu devre dışı bırak
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        
        try {
            const response = await fetch(`http://localhost:3000/api/reviews/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Yorumunuz başarıyla eklendi! 🎉', 'success');
                form.reset();
                selectedRating = 0;
                updateStarDisplay(stars, 0);
                updateRatingText(0);
                charCount.textContent = '0';
                charCount.style.color = '#27ae60';
                anonymousCheck.checked = true;
                nameInput.style.display = 'none';
                await loadProductReviews(productId); // Yorumları yeniden yükle
            } else {
                showNotification(result.message || 'Yorum eklenirken bir hata oluştu.', 'error');
            }
            
        } catch (error) {
            console.error('Yorum ekleme hatası:', error);
            showNotification('Bağlantı hatası! Lütfen tekrar deneyin.', 'error');
        } finally {
            // Submit butonunu tekrar aktif et
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Yıldız görünümünü güncelle
function updateStarDisplay(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#ffa500';
        } else {
            star.style.color = '#ddd';
        }
    });
}

// Rating text'ini güncelle
function updateRatingText(rating) {
    const ratingText = document.querySelector('.rating-text');
    if (!ratingText) return;
    
    const ratingTexts = {
        0: 'Ürünü değerlendirin',
        1: '😞 Çok kötü',
        2: '😐 Kötü', 
        3: '😊 Orta',
        4: '😍 İyi',
        5: '🤩 Mükemmel'
    };
    
    ratingText.textContent = ratingTexts[rating] || 'Ürünü değerlendirin';
}

// Rating text'i getir (kısa versiyon)
function getRatingText(rating) {
    const ratingTexts = {
        1: 'Çok Kötü',
        2: 'Kötü', 
        3: 'Orta',
        4: 'İyi',
        5: 'Mükemmel'
    };
    return ratingTexts[rating] || '';
}

// Zaman farkını hesapla
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);
    
    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffWeeks < 4) return `${diffWeeks} hafta önce`;
    
    return date.toLocaleDateString('tr-TR');
}

// Make functions globally accessible
window.toggleFavorite = toggleFavorite;
window.initializeFavorites = initializeFavorites;

// Initialize favorites when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeFavorites();
});
