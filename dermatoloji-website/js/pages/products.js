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
            <div class="product-card" data-product-id="${product._id || product.id}">
                <h3>${product.name}</h3>
                <p class="product-type">${product.type}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} TL</div>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-rating">
                    Puan: ${product.rating ? product.rating.toFixed(1) : 'Henüz puan yok'}
                    (${product.reviewCount || 0} değerlendirme)
                </div>
                <button class="btn btn-outline add-favorite" data-product-id="${product._id || product.id}">
                  <i class="far fa-heart"></i>
                </button>
            </div>
        `).join('');

        // Favori butonlarına event ekle
        this.initFavoriteButtons();
    }

    initFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll('.add-favorite');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const icon = button.querySelector('i');
                const productId = button.getAttribute('data-product-id');
                // Kullanıcı bilgisi localStorage'dan alınır
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.email) {
                    alert('Favorilere eklemek için giriş yapmalısınız!');
                    return;
                }
                // Favori ekle/çıkar
                if (icon.classList.contains('far')) {
                    // Favoriye ekle
                    const res = await api.addFavorite(user.email, { productId });
                    if (res.success) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        icon.style.color = '#f8c7cc';
                    } else {
                        alert('Favorilere eklenemedi: ' + (res.message || 'Hata'));
                    }
                } else {
                    // Favoriden çıkar
                    const res = await api.removeFavorite(user.email, { productId });
                    if (res.success) {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        icon.style.color = '';
                    } else {
                        alert('Favorilerden çıkarılamadı: ' + (res.message || 'Hata'));
                    }
                }
            });
        });
    }
}

// Sayfa yüklendiğinde ürünleri göster
document.addEventListener('DOMContentLoaded', () => {
    new ProductsPage();
}); 