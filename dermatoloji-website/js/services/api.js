// API istekleri için temel URL
const API_URL = 'http://localhost:5000/api';

// API istekleri için yardımcı fonksiyonlar
const api = {
    // Ürünler
    async getProducts() {
        const response = await fetch(`${API_URL}/products`);
        return response.json();
    },

    async getProduct(id) {
        const response = await fetch(`${API_URL}/products/${id}`);
        return response.json();
    },

    // Yorumlar
    async getReviews(productId) {
        const response = await fetch(`${API_URL}/reviews/${productId}`);
        return response.json();
    },

    async addReview(productId, reviewData) {
        const response = await fetch(`${API_URL}/reviews/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        return response.json();
    },

    // Şikayetler
    async submitComplaint(complaintData) {
        const response = await fetch(`${API_URL}/complaints`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(complaintData)
        });
        return response.json();
    },

    // Kullanıcı işlemleri
    async login(credentials) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        return response.json();
    },

    async register(userData) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    }
};

export default api; 