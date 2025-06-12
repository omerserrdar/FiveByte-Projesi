import api from '../services/api.js';

class AuthPage {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.tabButtons = document.querySelectorAll('.tab-btn');
        
        this.init();
    }

    init() {
        // Tab değiştirme işlemleri
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });

        // Form gönderme işlemleri
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));

        // Sayfa yüklendiğinde URL'deki hash'e göre tab'ı seç
        const hash = window.location.hash;
        if (hash === '#register') {
            this.switchTab('register');
        }
    }

    switchTab(tabName) {
        // Tab butonlarını güncelle
        this.tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabName);
        });

        // Formları güncelle
        this.loginForm.classList.toggle('active', tabName === 'login');
        this.registerForm.classList.toggle('active', tabName === 'register');

        // URL'yi güncelle
        window.location.hash = tabName;
    }

    async handleLogin(e) {
        e.preventDefault();
        
        // Sabit admin bilgileri
        const email = "admin@skinai.com";
        const password = "admin123";

        try {
            const response = await api.login({ email, password });
            
            if (response.success) {
                // Token'ı localStorage'a kaydet
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                
                // Başarı mesajı göster
                this.showMessage(this.loginForm, 'Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
                
                // Ana sayfaya yönlendir
                setTimeout(() => {
                    window.appInstance && window.appInstance.updateHeader();
                    window.location.href = '/';
                }, 1500);
            } else {
                this.showMessage(this.loginForm, response.message || 'Giriş başarısız!', 'error');
            }
        } catch (error) {
            this.showMessage(this.loginForm, 'Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        // Şifre kontrolü
        if (password !== passwordConfirm) {
            this.showMessage(this.registerForm, 'Şifreler eşleşmiyor!', 'error');
            return;
        }

        try {
            const response = await api.register({ name, email, password });
            
            if (response.success) {
                // Başarı mesajı göster
                this.showMessage(this.registerForm, 'Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
                
                // Giriş formuna geç
                setTimeout(() => {
                    this.switchTab('login');
                }, 1500);
            } else {
                this.showMessage(this.registerForm, response.message || 'Kayıt başarısız!', 'error');
            }
        } catch (error) {
            this.showMessage(this.registerForm, 'Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        }
    }

    showMessage(form, message, type) {
        // Önceki mesajları temizle
        const existingMessage = form.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Yeni mesaj oluştur
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        messageElement.textContent = message;

        // Mesajı forma ekle
        form.insertBefore(messageElement, form.firstChild);

        // 3 saniye sonra mesajı kaldır
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}

// Sayfa yüklendiğinde AuthPage'i başlat
document.addEventListener('DOMContentLoaded', () => {
    new AuthPage();
}); 