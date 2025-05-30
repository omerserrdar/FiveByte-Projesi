const API_URL = 'http://localhost:5000/api';

// API istekleri için yardımcı fonksiyonlar
const api = {
    // Auth işlemleri
    async login(email, password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
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
    },

    // Ürün işlemleri
    async getProducts() {
        const response = await fetch(`${API_URL}/products`);
        return response.json();
    },

    async getProductById(id) {
        const response = await fetch(`${API_URL}/products/${id}`);
        return response.json();
    },

    // Yorum işlemleri
    async addReview(productId, reviewData) {
        const response = await fetch(`${API_URL}/reviews/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(reviewData)
        });
        return response.json();
    },

    // Şikayet işlemleri
    async submitComplaint(complaintData) {
        const response = await fetch(`${API_URL}/complaints`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(complaintData)
        });
        return response.json();
    }
};

export default api; 