// Featured Products for Homepage
class FeaturedProducts {
    constructor() {
        this.featuredProducts = [
            {
                id: 101,
                name: 'Premium Vitamin C Serum',
                type: 'Serum',
                description: 'Cildi aydınlatan ve yaşlanma karşıtı etki sağlayan %20 Vitamin C serumu.',
                category: 'serums',
                rating: 4.8,
                reviewCount: 245,
                badge: 'Çok Satan'
            },
            {
                id: 102,
                name: 'Hydrating Night Cream',
                type: 'Nemlendirici',
                description: 'Gece boyunca yoğun nemlendirme sağlayan, hyaluronic asit içeren krem.',
                category: 'moisturizers',
                rating: 4.6,
                reviewCount: 189,
                badge: 'Yeni'
            },
            {
                id: 103,
                name: 'Gentle Foam Cleanser',
                type: 'Temizleyici',
                description: 'Hassas ciltler için özel formüle edilmiş, nazik köpük temizleyici.',
                category: 'cleansers',
                rating: 4.7,
                reviewCount: 156,
                badge: null
            },
            {
                id: 104,
                name: 'SPF 50+ Sunscreen',
                type: 'Güneş Koruma',
                description: 'Geniş spektrumlu, su geçirmez, hafif dokulu güneş koruyucu.',
                category: 'sunscreens',
                rating: 4.9,
                reviewCount: 312,
                badge: 'Önerilenler'
            }
        ];
        this.init();
    }

    init() {
        this.renderFeaturedProducts();
    }

    renderFeaturedProducts() {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;

        productsContainer.innerHTML = this.featuredProducts.map(product => `
            <div class="product-card" data-skin-type="all" data-product-type="${product.category}" data-product-id="${product.id}">
                <button class="add-favorite" onclick="toggleFavorite(${product.id}, this)">
                    <i class="far fa-heart"></i>
                </button>
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-type">${product.type}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        ${this.generateStars(product.rating)}
                        <span>${product.rating}/5 (${product.reviewCount} yorum)</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Initialize favorites for featured products
        if (window.initializeFavorites) {
            window.initializeFavorites();
        }
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHtml = '';

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }

        return starsHtml;
    }
}

// Initialize featured products on homepage
document.addEventListener('DOMContentLoaded', () => {
    // Only run on homepage (check if products-container exists)
    if (document.getElementById('products-container')) {
        new FeaturedProducts();
    }
}); 