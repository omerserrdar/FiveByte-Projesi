import api from '../services/api.js';

class ProductsPage {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        try {
            const response = await api.getProducts();
            if (response.success) {
                this.products = response.data;
                this.renderProducts();
            } else {
                console.error('Ürünler yüklenirken hata oluştu:', response.message);
            }
        } catch (error) {
            console.error('Ürünler yüklenirken hata oluştu:', error);
        }
    }

    renderProducts() {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;

        productsContainer.innerHTML = this.products.map(product => `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p class="product-type">${product.type}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} TL</div>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-rating">
                    Puan: ${product.rating ? product.rating.toFixed(1) : 'Henüz puan yok'}
                    (${product.reviewCount || 0} değerlendirme)
                </div>
            </div>
        `).join('');
    }
}

// Sayfa yüklendiğinde ürünleri göster
document.addEventListener('DOMContentLoaded', () => {
    new ProductsPage();
}); 