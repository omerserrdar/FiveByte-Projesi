/**
 * DermaSkin - Products JavaScript File
 * This file contains functionality for the products page
 * Author: Manus AI
 * Date: April 22, 2025
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize products functionality if on the products page
    if (document.querySelector('.products-section')) {
        initProductsPage();
    }
});

/**
 * Initialize the products page functionality
 */
function initProductsPage() {
    // Initialize filters
    initFilters();
    
    // Initialize product details modal
    initProductModal();
    
    // Initialize product rating system
    initRatingSystem();
    
    // Initialize pagination
    initPagination();
}

/**
 * Initialize product filtering functionality
 */
function initFilters() {
    const skinTypeFilter = document.getElementById('skinTypeFilter');
    const productTypeFilter = document.getElementById('productTypeFilter');
    const searchInput = document.getElementById('searchProducts');
    const searchBtn = document.querySelector('.search-btn');
    const productsContainer = document.getElementById('products-container');
    const productCards = document.querySelectorAll('.product-card');
    
    // Apply filters function
    function applyFilters() {
        const skinType = skinTypeFilter ? skinTypeFilter.value : 'all';
        const productType = productTypeFilter ? productTypeFilter.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        let visibleCount = 0;
        
        // Loop through all product cards
        productCards.forEach(card => {
            // Get data attributes
            const cardSkinType = card.getAttribute('data-skin-type');
            const cardProductType = card.getAttribute('data-product-type');
            
            // Get product name and description for search
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDesc = card.querySelector('.product-description') ? 
                                card.querySelector('.product-description').textContent.toLowerCase() : '';
            
            // Check if card matches all filters
            const matchesSkinType = skinType === 'all' || cardSkinType === skinType;
            const matchesProductType = productType === 'all' || cardProductType === productType;
            const matchesSearch = searchTerm === '' || 
                                 productName.includes(searchTerm) || 
                                 productDesc.includes(searchTerm);
            
            // Show or hide card based on filters
            if (matchesSkinType && matchesProductType && matchesSearch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show message if no products match filters
        const noResultsMessage = document.querySelector('.no-results-message');
        if (visibleCount === 0) {
            if (!noResultsMessage) {
                const message = document.createElement('div');
                message.className = 'no-results-message';
                message.innerHTML = `
                    <p>Arama kriterlerinize uygun ürün bulunamadı.</p>
                    <button class="btn btn-outline reset-filters">Filtreleri Sıfırla</button>
                `;
                productsContainer.appendChild(message);
                
                // Add event listener to reset button
                const resetBtn = message.querySelector('.reset-filters');
                resetBtn.addEventListener('click', resetFilters);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }
    
    // Reset filters function
    function resetFilters() {
        if (skinTypeFilter) skinTypeFilter.value = 'all';
        if (productTypeFilter) productTypeFilter.value = 'all';
        if (searchInput) searchInput.value = '';
        
        applyFilters();
    }
    
    // Add event listeners to filters
    if (skinTypeFilter) {
        skinTypeFilter.addEventListener('change', applyFilters);
    }
    
    if (productTypeFilter) {
        productTypeFilter.addEventListener('change', applyFilters);
    }
    
    // Add event listener to search button
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
    
    // Add event listener to search input for enter key
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }
}

/**
 * Initialize product details modal
 */
function initProductModal() {
    const productModal = document.getElementById('product-modal');
    const detailButtons = document.querySelectorAll('.product-actions .btn-primary');
    const closeModal = document.querySelector('.close-modal');
    
    // Open modal when clicking on product detail button
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product data from parent card
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('.product-image img').src;
            const productTitle = productCard.querySelector('h3').textContent;
            const productType = productCard.querySelector('.product-type').textContent;
            const productRating = productCard.querySelector('.product-rating').innerHTML;
            const productDescription = productCard.querySelector('.product-description').textContent;
            
            // Set modal content
            document.getElementById('modal-product-image').src = productImage;
            document.getElementById('modal-product-title').textContent = productTitle;
            document.getElementById('modal-product-type').textContent = productType;
            document.getElementById('modal-product-rating').innerHTML = productRating;
            document.getElementById('modal-product-description').textContent = productDescription;
            
            // Sample data for ingredients and usage (would come from database in real app)
            document.getElementById('modal-product-ingredients').textContent = 'Aqua, Glycerin, Butylene Glycol, Niacinamide, Dimethicone, Cetearyl Alcohol, Cetearyl Glucoside, Sodium Hyaluronate, Panthenol, Tocopheryl Acetate, Allantoin, Xanthan Gum, Disodium EDTA, Phenoxyethanol, Ethylhexylglycerin, Parfum.';
            document.getElementById('modal-product-usage').textContent = 'Temiz cilde sabah ve akşam ince bir tabaka halinde uygulayın. Göz çevresinden kaçının. Düzenli güneş koruyucu kullanımı ile destekleyin.';
            
            // Show modal
            productModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close modal when clicking on X button
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            productModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        });
    }
    
    // Close modal when clicking outside of modal content
    window.addEventListener('click', function(e) {
        if (e.target === productModal) {
            productModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
    });
}

/**
 * Initialize product rating system
 */
function initRatingSystem() {
    const ratingStars = document.querySelectorAll('.rating-select i');
    const reviewForm = document.getElementById('review-form');
    const loginRequired = document.querySelector('.login-required');
    
    // Simulate logged in state (would be determined by backend in real app)
    const isLoggedIn = false; // Change to true to test review form
    
    // Show appropriate UI based on login state
    if (isLoggedIn) {
        if (reviewForm) reviewForm.style.display = 'block';
        if (loginRequired) loginRequired.style.display = 'none';
    } else {
        if (reviewForm) reviewForm.style.display = 'none';
        if (loginRequired) loginRequired.style.display = 'block';
    }
    
    // Initialize star rating functionality
    if (ratingStars.length > 0) {
        let selectedRating = 0;
        
        ratingStars.forEach((star, index) => {
            // Mouse enter event - highlight stars
            star.addEventListener('mouseenter', function() {
                // Reset all stars
                ratingStars.forEach(s => s.className = 'far fa-star');
                
                // Highlight stars up to current
                for (let i = 0; i <= index; i++) {
                    ratingStars[i].className = 'fas fa-star';
                }
            });
            
            // Mouse leave event - reset to selected rating
            star.addEventListener('mouseleave', function() {
                // Reset all stars
                ratingStars.forEach(s => s.className = 'far fa-star');
                
                // Highlight stars up to selected rating
                for (let i = 0; i < selectedRating; i++) {
                    ratingStars[i].className = 'fas fa-star';
                }
            });
            
            // Click event - set rating
            star.addEventListener('click', function() {
                selectedRating = index + 1;
                
                // Reset all stars
                ratingStars.forEach(s => s.className = 'far fa-star');
                
                // Highlight stars up to selected rating
                for (let i = 0; i < selectedRating; i++) {
                    ratingStars[i].className = 'fas fa-star';
                }
                
                // Show notification
                showNotification(`${selectedRating} yıldız seçtiniz`, 'success');
            });
        });
    }
    
    // Handle review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const reviewText = document.getElementById('review-text').value.trim();
            
            if (!reviewText) {
                showNotification('Lütfen bir yorum yazın.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Yorumunuz gönderildi ve incelendikten sonra yayınlanacak.', 'success');
            
            // Reset form
            reviewForm.reset();
            
            // Reset stars
            ratingStars.forEach(s => s.className = 'far fa-star');
        });
    }
}

/**
 * Initialize pagination
 */
function initPagination() {
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    
    if (paginationButtons.length > 0) {
        paginationButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // In a real app, this would load new products from server
                // For demo, just show notification
                if (!this.classList.contains('next')) {
                    showNotification(`Sayfa ${this.textContent} gösteriliyor`, 'info');
                } else {
                    showNotification('Sonraki sayfa gösteriliyor', 'info');
                }
            });
        });
    }
}

/**
 * Initialize favorite functionality
 */
function initFavorites() {
    const favoriteButtons = document.querySelectorAll('.add-favorite');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            // Toggle favorite state
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#f8c7cc'; // Heart color
                showNotification('Ürün favorilere eklendi', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                showNotification('Ürün favorilerden çıkarıldı', 'info');
            }
        });
    });
}
