import { productAPI } from '../api.js';

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

// Products Page for /products.html
class ProductsPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupFilters();
        this.setupSearch();
        this.renderProducts();
        this.renderPagination();
    }

    async loadProducts() {
        try {
            // Loading state göster
            this.showLoading();
            
            const response = await productAPI.getAllProducts();
            
            if (response.success) {
                this.products = response.data;
                this.filteredProducts = [...this.products];
                console.log('MongoDB\'den ürünler yüklendi:', this.products);
            } else {
                console.error('Ürünler yüklenemedi:', response.message);
                this.showError('Ürünler yüklenirken hata oluştu.');
            }
        } catch (error) {
            console.error('API hatası:', error);
            this.showError('Sunucu bağlantı hatası.');
        }
    }

    showLoading() {
        const productsGrid = document.querySelector('.products-grid .product-cards');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #4a90e2;"></i>
                    <p style="margin-top: 1rem; color: #666;">Ürünler yükleniyor...</p>
                </div>
            `;
        }
    }

    showError(message) {
        const productsGrid = document.querySelector('.products-grid .product-cards');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c;"></i>
                    <p style="margin-top: 1rem; color: #e74c3c;">${message}</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                        Tekrar Dene
                    </button>
                </div>
            `;
        }
    }

    renderProducts() {
        const productsGrid = document.querySelector('.products-grid .product-cards');
        if (!productsGrid) return;

        // Pagination için ürünleri ayır
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc;"></i>
                    <p style="margin-top: 1rem; color: #666;">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        
        // Initialize favorites
        if (window.initializeFavorites) {
            window.initializeFavorites();
        }
    }

    createProductCard(product) {
        return `
            <div class="product-card" data-skin-type="all" data-product-type="${this.getCategoryFromType(product.type)}" data-product-id="${product._id}">
                <button class="add-favorite" onclick="toggleFavorite('${product._id}', this)">
                    <i class="far fa-heart"></i>
                </button>
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-image ${product.imageUrl ? '' : 'no-image'}">
                    ${product.imageUrl ? 
                        `<img src="${product.imageUrl}" 
                             alt="${product.name}" 
                             onerror="this.parentElement.classList.add('no-image'); this.style.display='none';">` 
                        : ''
                    }
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-type">${product.type}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        ${this.generateStars(product.rating || 0)}
                        <span>${(product.rating || 0).toFixed(1)}/5 (${product.reviewCount || 0} yorum)</span>
                    </div>
                </div>
            </div>
        `;
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

    getCategoryFromType(type) {
        const categoryMap = {
            'nemlendirici': 'moisturizers',
            'temizleyici': 'cleansers',
            'serum': 'serums',
            'güneş koruma': 'sunscreens',
            'maske': 'skincare',
            'toner': 'skincare',
            'krem': 'moisturizers'
        };
        return categoryMap[type.toLowerCase()] || 'skincare';
    }

    setupFilters() {
        const skinTypeFilter = document.querySelector('select[data-filter="skin-type"]');
        const productTypeFilter = document.querySelector('select[data-filter="product-type"]');

        if (skinTypeFilter) {
            skinTypeFilter.addEventListener('change', () => this.applyFilters());
        }

        if (productTypeFilter) {
            productTypeFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }
    }

    applyFilters() {
        const skinTypeFilter = document.querySelector('select[data-filter="skin-type"]')?.value || 'all';
        const productTypeFilter = document.querySelector('select[data-filter="product-type"]')?.value || 'all';

        this.filteredProducts = this.products.filter(product => {
            const matchesSkinType = skinTypeFilter === 'all' || true; // Şimdilik all
            const matchesProductType = productTypeFilter === 'all' || 
                this.getCategoryFromType(product.type) === productTypeFilter;

            return matchesSkinType && matchesProductType;
        });

        this.currentPage = 1;
        this.renderProducts();
        this.renderPagination();
    }

    searchProducts(query) {
        if (!query.trim()) {
            this.applyFilters(); // Reset to filtered products
            return;
        }

        const searchTerm = query.toLowerCase();
        this.filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.type.toLowerCase().includes(searchTerm)
        );

        this.currentPage = 1;
        this.renderProducts();
        this.renderPagination();
    }

    renderPagination() {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="productsPageInstance.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        }

        // Page numbers
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            const isActive = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="pagination-btn ${isActive}" onclick="productsPageInstance.goToPage(${i})">${i}</button>`;
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn next" onclick="productsPageInstance.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
        this.renderPagination();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Global instance for pagination
let productsPageInstance = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on homepage or products page
    if (document.getElementById('products-container')) {
        // Homepage - load featured products
        new FeaturedProducts();
    } else if (document.querySelector('.products-grid')) {
        // Products page - load all products from MongoDB
        productsPageInstance = new ProductsPage();
    }
}); 