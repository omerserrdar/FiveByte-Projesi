// API temel URL'si
const API_URL = 'http://localhost:3000/api';

// Token'ı localStorage'dan al
const getToken = () => localStorage.getItem('token');

// API istekleri için temel headers
const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// Kullanıcı İşlemleri
export const authAPI = {
    // Kullanıcı kaydı
    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Kayıt hatası:', error);
            throw error;
        }
    },

    // Kullanıcı girişi
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('Giriş hatası:', error);
            throw error;
        }
    },

    // Kullanıcı çıkışı
    logout: () => {
        localStorage.removeItem('token');
    }
};

// Ürün İşlemleri
export const productAPI = {
    // Tüm ürünleri getir
    getAllProducts: async () => {
        try {
            const response = await fetch(`${API_URL}/products`, {
                headers: getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Ürünleri getirme hatası:', error);
            throw error;
        }
    },

    // Tek ürün getir
    getProduct: async (id) => {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                headers: getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Ürün getirme hatası:', error);
            throw error;
        }
    }
};

// Yorum İşlemleri
export const reviewAPI = {
    // Ürüne yorum ekle
    addReview: async (productId, reviewData) => {
        try {
            const response = await fetch(`${API_URL}/reviews/${productId}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(reviewData)
            });
            return await response.json();
        } catch (error) {
            console.error('Yorum ekleme hatası:', error);
            throw error;
        }
    },

    // Ürün yorumlarını getir
    getReviews: async (productId) => {
        try {
            const response = await fetch(`${API_URL}/reviews/${productId}`, {
                headers: getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Yorumları getirme hatası:', error);
            throw error;
        }
    }
};

// Şikayet İşlemleri
export const complaintAPI = {
    // Şikayet gönder
    submitComplaint: async (complaintData) => {
        try {
            const response = await fetch(`${API_URL}/complaints`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(complaintData)
            });
            return await response.json();
        } catch (error) {
            console.error('Şikayet gönderme hatası:', error);
            throw error;
        }
    }
}; 