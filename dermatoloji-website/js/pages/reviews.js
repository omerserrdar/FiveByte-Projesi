import { reviewAPI } from '../api.js';

class ReviewSystem {
    constructor() {
        this.currentProductId = null;
        this.currentRating = 0;
        this.init();
    }

    init() {
        this.initProductModal();
        this.initRatingSystem();
        this.initReviewForm();
        this.initProductCardClicks();
    }

    // Product card tıklama eventi
    initProductCardClicks() {
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard && !e.target.closest('.add-favorite')) {
                const productId = productCard.dataset.productId;
                if (productId) {
                    this.openProductModal(productId);
                }
            }
        });
    }

    // Modal açma işlevi
    async openProductModal(productId) {
        this.currentProductId = productId;
        const modal = document.getElementById('product-modal');
        
        // Modal'ı göster
        modal.style.display = 'block';
        
        // Ürün bilgilerini yükle
        this.loadProductInfo(productId);
        
        // Yorumları yükle
        await this.loadReviews(productId);
        
        // Kullanıcı giriş durumunu kontrol et
        this.checkUserAuthStatus();
    }

    // Modal kapatma
    initProductModal() {
        const modal = document.getElementById('product-modal');
        const closeBtn = document.querySelector('.close-modal');
        
        // Close button event
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Outside click to close
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Ürün bilgilerini modal'a yükle
    loadProductInfo(productId) {
        // Basit product data (gerçek uygulamada API'den gelecek)
        const productData = this.getProductData(productId);
        
        document.getElementById('modal-product-title').textContent = productData.name;
        document.getElementById('modal-product-type').textContent = productData.type;
        document.getElementById('modal-product-description').textContent = productData.description;
        document.getElementById('modal-product-ingredients').textContent = productData.ingredients;
        document.getElementById('modal-product-usage').textContent = productData.usage;
        
        // Rating güncelle
        this.updateModalRating(productData.rating, productData.reviewCount);
    }

    // Product data mock (gerçek uygulamada API'den gelecek)
    getProductData(productId) {
        const products = {
            1: {
                name: 'Hydra Boost Nemlendirici',
                type: 'Nemlendirici',
                description: 'Kuru ciltler için yoğun nemlendirme sağlayan, hyaluronik asit içeren nemlendirici krem.',
                ingredients: 'Aqua, Hyaluronic Acid, Glycerin, Ceramides, Niacinamide',
                usage: 'Temizlenmiş cilde sabah ve akşam uygulayın. Dairesel hareketlerle masaj yapın.',
                rating: 4.5,
                reviewCount: 128
            },
            2: {
                name: 'Pure Clean Yüz Temizleyici',
                type: 'Temizleyici',
                description: 'Yağlı ve karma ciltler için özel olarak formüle edilmiş, yumuşak temizleyici jel.',
                ingredients: 'Aqua, Salicylic Acid, Tea Tree Oil, Aloe Vera, Glycerin',
                usage: 'Islak cilde uygulayın, köpürtün ve bol suyla durulayın. Günde 2 kez kullanın.',
                rating: 4.2,
                reviewCount: 95
            },
            3: {
                name: 'Calm Skin Serumu',
                type: 'Serum',
                description: 'Niacinamide ve panthenol içeren hassas ciltler için yatıştırıcı serum.',
                ingredients: 'Aqua, Niacinamide, Panthenol, Centella Asiatica, Hyaluronic Acid',
                usage: 'Temizlendikten sonra, nemlendirici öncesi uygulayın. 2-3 damla yeterlidir.',
                rating: 4.8,
                reviewCount: 42
            }
        };
        
        return products[productId] || {
            name: 'Ürün',
            type: 'Cilt Bakım',
            description: 'Ürün açıklaması',
            ingredients: 'İçerik listesi',
            usage: 'Kullanım talimatları',
            rating: 4.0,
            reviewCount: 0
        };
    }

    // Modal rating güncelle
    updateModalRating(rating, reviewCount) {
        const ratingContainer = document.getElementById('modal-product-rating');
        if (!ratingContainer) return;

        const stars = this.generateStarRating(rating);
        ratingContainer.innerHTML = `
            ${stars}
            <span>${rating}/5 (${reviewCount} yorum)</span>
        `;
    }

    // Star rating HTML oluştur
    generateStarRating(rating) {
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

    // Yorumları yükle
    async loadReviews(productId) {
        const reviewsContainer = document.getElementById('modal-product-reviews');
        if (!reviewsContainer) return;

        // Loading state
        reviewsContainer.innerHTML = `
            <div class="reviews-loading">
                <i class="fas fa-spinner"></i>
                <p>Yorumlar yükleniyor...</p>
            </div>
        `;

        try {
            const response = await reviewAPI.getReviews(productId);
            
            if (response.success && response.data.length > 0) {
                this.displayReviews(response.data);
            } else {
                this.displayNoReviews();
            }
        } catch (error) {
            console.error('Yorumlar yüklenemedi:', error);
            this.displayReviewError();
        }
    }

    // Yorumları görüntüle
    displayReviews(reviews) {
        const reviewsContainer = document.getElementById('modal-product-reviews');
        if (!reviewsContainer) return;

        const reviewsHTML = reviews.map(review => `
            <div class="review">
                <div class="review-header">
                    <div class="reviewer-info">
                        <span class="reviewer-name">${review.userName}</span>
                        <span class="review-date">${this.formatDate(review.createdAt)}</span>
                    </div>
                    <div class="review-rating">
                        ${this.generateStarRating(review.rating)}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.comment}</p>
                </div>
            </div>
        `).join('');

        reviewsContainer.innerHTML = reviewsHTML;
    }

    // Yorum yoksa göster
    displayNoReviews() {
        const reviewsContainer = document.getElementById('modal-product-reviews');
        if (!reviewsContainer) return;

        reviewsContainer.innerHTML = `
            <div class="no-reviews">
                <i class="far fa-comment"></i>
                <p>Henüz bu ürün için yorum yapılmamış. İlk yorumu siz yapın!</p>
            </div>
        `;
    }

    // Yorum yükleme hatası
    displayReviewError() {
        const reviewsContainer = document.getElementById('modal-product-reviews');
        if (!reviewsContainer) return;

        reviewsContainer.innerHTML = `
            <div class="no-reviews">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Yorumlar yüklenirken hata oluştu. Lütfen tekrar deneyin.</p>
            </div>
        `;
    }

    // Tarih formatlama
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Rating sistemi
    initRatingSystem() {
        const ratingStars = document.querySelectorAll('.rating-select i');
        
        ratingStars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.currentRating = index + 1;
                this.updateRatingDisplay();
            });
            
            star.addEventListener('mouseenter', () => {
                this.highlightStars(index + 1);
            });
        });
        
        document.querySelector('.rating-select')?.addEventListener('mouseleave', () => {
            this.updateRatingDisplay();
        });
    }

    // Rating görünümünü güncelle
    updateRatingDisplay() {
        const ratingStars = document.querySelectorAll('.rating-select i');
        ratingStars.forEach((star, index) => {
            if (index < this.currentRating) {
                star.classList.remove('far');
                star.classList.add('fas', 'selected');
            } else {
                star.classList.remove('fas', 'selected');
                star.classList.add('far');
            }
        });
    }

    // Yıldızları highlight et
    highlightStars(rating) {
        const ratingStars = document.querySelectorAll('.rating-select i');
        ratingStars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    // Kullanıcı authentication durumu kontrol et
    checkUserAuthStatus() {
        const user = JSON.parse(localStorage.getItem('user'));
        const loginRequired = document.querySelector('.login-required');
        const reviewForm = document.getElementById('review-form');
        
        if (user && user.email) {
            // Kullanıcı giriş yapmış
            if (loginRequired) loginRequired.style.display = 'none';
            if (reviewForm) reviewForm.style.display = 'block';
        } else {
            // Kullanıcı giriş yapmamış
            if (loginRequired) loginRequired.style.display = 'block';
            if (reviewForm) reviewForm.style.display = 'none';
        }
    }

    // Yorum formu işlemleri
    initReviewForm() {
        const reviewForm = document.getElementById('review-form');
        if (!reviewForm) return;

        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitReview();
        });
    }

    // Yorum gönder
    async submitReview() {
        const reviewText = document.getElementById('review-text').value.trim();
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Validasyon
        if (!this.currentRating) {
            alert('Lütfen bir puan seçin.');
            return;
        }
        
        if (!reviewText) {
            alert('Lütfen yorum metni girin.');
            return;
        }
        
        if (!user || !user.email) {
            alert('Yorum yapabilmek için giriş yapmalısınız.');
            return;
        }

        // Yorum verisi
        const reviewData = {
            rating: this.currentRating,
            comment: reviewText,
            userEmail: user.email,
            userName: user.name || user.email.split('@')[0]
        };

        try {
            // Loading state
            const submitBtn = document.querySelector('#review-form .btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Gönderiliyor...';
            submitBtn.disabled = true;

            // API çağrısı
            const response = await reviewAPI.addReview(this.currentProductId, reviewData);
            
            if (response.success) {
                // Başarı mesajı göster
                this.showSuccessMessage('Yorumunuz başarıyla eklendi!');
                
                // Formu temizle
                this.resetReviewForm();
                
                // Yorumları yeniden yükle
                await this.loadReviews(this.currentProductId);
            } else {
                alert('Yorum eklenirken hata oluştu: ' + (response.message || 'Bilinmeyen hata'));
            }
        } catch (error) {
            console.error('Yorum gönderme hatası:', error);
            alert('Yorum gönderilirken hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            // Button'ı eski haline getir
            const submitBtn = document.querySelector('#review-form .btn');
            submitBtn.textContent = 'Yorum Gönder';
            submitBtn.disabled = false;
        }
    }

    // Başarı mesajı göster
    showSuccessMessage(message) {
        // Varolan success mesajını kaldır
        const existingSuccess = document.querySelector('.review-success');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        // Yeni success mesajı oluştur
        const successDiv = document.createElement('div');
        successDiv.className = 'review-success';
        successDiv.textContent = message;
        
        // Form'un üstüne ekle
        const reviewForm = document.getElementById('review-form');
        reviewForm.parentNode.insertBefore(successDiv, reviewForm);
        
        // 5 saniye sonra kaldır
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Yorum formunu sıfırla
    resetReviewForm() {
        document.getElementById('review-text').value = '';
        this.currentRating = 0;
        this.updateRatingDisplay();
    }
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    new ReviewSystem();
});

export default ReviewSystem; 