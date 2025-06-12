/**
 * DermaSkin - Products JavaScript File
 * This file contains functionality for the products page
 * Author: Manus AI
 * Date: April 22, 2025
 */

// API endpoint'leri
const API_BASE_URL = 'http://localhost:5000/api/products';

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

// Ürünleri getir
async function fetchProducts(skinType = null, productType = null) {
    try {
        let url = API_BASE_URL;
        if (skinType && productType) {
            url = `${API_BASE_URL}/filter?skinType=${skinType}&productType=${productType}`;
        } else if (skinType) {
            url = `${API_BASE_URL}/skin-type/${skinType}`;
        } else if (productType) {
            url = `${API_BASE_URL}/product-type/${productType}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        // Hata durumunda kullanıcıya bilgi ver
        document.getElementById('products-container').innerHTML = 
            '<div class="error-message">Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>';
    }
}

// Ürünleri görüntüle
function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<div class="no-products">Ürün bulunamadı.</div>';
        return;
    }

    products.forEach(product => {
        const productCard = `
            <div class="product-card">
                <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name || ''}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
                <h3>${product.name || ''}</h3>
                ${product.type ? `<p class="product-type">${product.type}</p>` : ''}
                ${product.description ? `<p class="description">${product.description}</p>` : ''}
                <div class="product-rating">
                    ${createRatingStars(product.rating || 0)}
                    <span>(${product.reviewCount || 0})</span>
                </div>
                <button class="details-btn" onclick="showProductDetails('${product._id || product.id}')">
                    Detayları Gör
                </button>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

// Ürün detaylarını göster
function showProductDetails(product) {
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="product-details">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <p class="product-type">${product.type}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    ${createRatingStars(product.rating)}
                    <span>(${product.reviewCount} değerlendirme)</span>
                </div>
                <div class="product-usage">
                    <h3>Kullanım Önerisi</h3>
                    <p id="modal-product-usage">${product.usage || 'Kullanım önerisi bulunmuyor.'}</p>
                </div>
            </div>
        </div>
        <div class="product-reviews">
            <h3>Kullanıcı Yorumları</h3>
            <div class="reviews-container" id="modal-product-reviews">
                <div class="loading">Yorumlar yükleniyor...</div>
            </div>
            
            <!-- Add Review Form (Only for logged in users) -->
            <div class="add-review-form">
                <h4>Yorum Ekle</h4>
                <p class="login-required">Yorum yapabilmek için <a href="login.html">giriş yapmalısınız</a>.</p>
                <form id="review-form" style="display: none;">
                    <div class="form-group">
                        <label>Puanınız</label>
                        <div class="rating-select">
                            <i class="far fa-star" data-rating="1"></i>
                            <i class="far fa-star" data-rating="2"></i>
                            <i class="far fa-star" data-rating="3"></i>
                            <i class="far fa-star" data-rating="4"></i>
                            <i class="far fa-star" data-rating="5"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="review-text">Yorumunuz</label>
                        <textarea id="review-text" rows="4" placeholder="Bu ürün hakkında düşüncelerinizi paylaşın..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Yorum Gönder</button>
                </form>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Yorumları yükle
    loadProductReviews(product._id);
    
    // Yorum formunu göster/gizle
    const reviewForm = document.getElementById('review-form');
    const loginRequired = document.querySelector('.login-required');
    
    if (isLoggedIn()) {
        reviewForm.style.display = 'block';
        loginRequired.style.display = 'none';
    } else {
        reviewForm.style.display = 'none';
        loginRequired.style.display = 'block';
    }
}

// Ürün yorumlarını yükle
async function loadProductReviews(productId) {
    try {
        const response = await reviewAPI.getReviews(productId);
        if (response.success) {
            const reviewsContainer = document.getElementById('modal-product-reviews');
            reviewsContainer.innerHTML = ''; // Mevcut yorumları temizle
            
            if (response.data.length === 0) {
                reviewsContainer.innerHTML = '<p class="no-reviews">Henüz yorum yapılmamış.</p>';
                return;
            }

            response.data.forEach(review => {
                const reviewElement = createReviewElement(review);
                reviewsContainer.appendChild(reviewElement);
            });
        }
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
        showNotification('Yorumlar yüklenirken bir hata oluştu.', 'error');
    }
}

// Yorum elementi oluştur
function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review';
    
    const date = new Date(review.createdAt).toLocaleDateString('tr-TR');
    
    reviewDiv.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <span class="reviewer-name">${review.user?.name || 'Anonim'}</span>
                <span class="review-date">${date}</span>
            </div>
            <div class="review-rating">
                ${createRatingStars(review.rating)}
            </div>
        </div>
        <div class="review-content">
            <p>${review.comment}</p>
        </div>
    `;
    
    return reviewDiv;
}

// Yıldız derecelendirmesi oluştur
function createRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Filtreleme işlevleri
function filterProducts() {
    const skinType = document.getElementById('skin-type-filter').value;
    const productType = document.getElementById('product-type-filter').value;
    fetchProducts(skinType, productType);
}

// Sayfa yüklendiğinde tüm ürünleri getir
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    
    // Filtre değişikliklerini dinle
    document.getElementById('skin-type-filter').addEventListener('change', filterProducts);
    document.getElementById('product-type-filter').addEventListener('change', filterProducts);
});

// Yorum gönderme işlevi
async function submitReview(productId, rating, comment) {
    try {
        const response = await reviewAPI.addReview(productId, { rating, comment });
        if (response.success) {
            showNotification('Yorumunuz başarıyla eklendi.', 'success');
            // Yorumları yeniden yükle
            await loadProductReviews(productId);
            return true;
        }
    } catch (error) {
        console.error('Yorum eklenirken hata:', error);
        showNotification('Yorum eklenirken bir hata oluştu.', 'error');
        return false;
    }
}

// Yorum formunu başlat
function initReviewForm(productId) {
    const reviewForm = document.getElementById('review-form');
    const ratingStars = document.querySelectorAll('.rating-select i');
    let selectedRating = 0;

    // Yıldız tıklama olayları
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            selectedRating = rating;
            
            // Yıldızları güncelle
            ratingStars.forEach((s, index) => {
                if (index < rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
    });

    // Form gönderme
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const comment = document.getElementById('review-text').value.trim();
        
        if (!selectedRating) {
            showNotification('Lütfen bir puan seçin.', 'error');
            return;
        }
        
        if (!comment) {
            showNotification('Lütfen bir yorum yazın.', 'error');
            return;
        }
        
        const success = await submitReview(productId, selectedRating, comment);
        
        if (success) {
            // Formu sıfırla
            reviewForm.reset();
            selectedRating = 0;
            ratingStars.forEach(s => s.className = 'far fa-star');
        }
    });
}
