# 🌟 SkinAI - Akıllı Cilt Bakım Asistanı

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</div>

---

## 📖 Proje Hakkında

**SkinAI**, kullanıcıların cilt tiplerini analiz ederek kişiselleştirilmiş cilt bakım ürünü önerileri sunan akıllı bir web uygulamasıdır. Yapay zeka destekli analiz sistemi ile kullanıcılara en uygun cilt bakım rutinini önerir.

### 🎯 Temel Misyon
Herkes için doğru cilt bakım ürünlerini bulmayı kolaylaştırmak ve cilt sağlığını geliştirmek.

---

## ✨ Özellikler

### 🔍 **Akıllı Cilt Analizi**
- Detaylı cilt tipi belirleme anketi
- Kişiselleştirilmiş ürün önerileri
- Cilt ihtiyaçlarına göre filtreleme

### 🛍️ **Ürün Yönetimi**
- Geniş cilt bakım ürünleri veritabanı
- Ürün detayları ve kullanıcı yorumları
- Favori ürünleri kaydetme
- Fiyat karşılaştırması

### 👤 **Kullanıcı Deneyimi**
- Güvenli kullanıcı kayıt/giriş sistemi
- Kişisel profil yönetimi
- Geçmiş analizleri görüntüleme
- Mobil uyumlu responsive tasarım

### 🤖 **AI Destekli Asistan**
- 24/7 cilt bakım danışmanlığı
- Akıllı chatbot desteği
- Kişiselleştirilmiş öneriler
- Sık sorulan sorulara anında yanıt

### 📊 **Deneyim Paylaşımı**
- Kullanıcı yorumları ve puanlamaları
- Ürün deneyimlerini paylaşma
- Topluluk önerileri

---

## 🛠️ Teknoloji Yığını

### **Backend**
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - Dynamic interactions
- **Font Awesome** - Icon library
- **Responsive Design** - Mobile-first approach

---

## 📁 Proje Yapısı

```
FiveByte-Projesi/
│
├── 📂 dermatoloji-website/          # Frontend uygulaması
│   ├── 📂 css/
│   │   └── main.css                 # Ana stil dosyası
│   ├── 📂 js/
│   │   ├── main.js                  # Ortak JavaScript fonksiyonları
│   │   ├── skintest.js              # Cilt tipi testi
│   │   ├── products.js              # Ürün yönetimi
│   │   └── chatbot.js               # AI asistan
│   ├── 📂 images/                   # Görsel dosyaları
│   ├── 📂 routes/                   # API rotaları
│   ├── 📂 models/                   # MongoDB modelleri
│   ├── 📂 middleware/               # Express middleware
│   ├── index.html                   # Ana sayfa
│   ├── login.html                   # Giriş sayfası
│   ├── register.html                # Kayıt sayfası
│   ├── skintest.html                # Cilt testi sayfası
│   ├── products.html                # Ürünler sayfası
│   ├── chatbot.html                 # AI asistan sayfası
│   ├── profile.html                 # Kullanıcı profili
│   ├── about.html                   # Hakkımızda sayfası
│   ├── server.js                    # Express server
│   └── package.json                 # Backend bağımlılıkları
│
├── package.json                     # Ana proje bağımlılıkları
├── server.js                        # Ana server dosyası
└── README.md                        # Bu dosya
```

---

## 🚀 Kurulum ve Çalıştırma

### 📋 Ön Gereksinimler

- **Node.js** (v14 veya üzeri)
- **MongoDB** (v4.4 veya üzeri)
- **npm** veya **yarn** paket yöneticisi

### 🔧 Kurulum Adımları

1. **Projeyi klonlayın:**
   ```bash
   git clone https://github.com/kullanici-adi/FiveByte-Projesi.git
   cd FiveByte-Projesi
   ```

2. **Backend bağımlılıklarını yükleyin:**
   ```bash
   npm install
   ```

3. **Frontend bağımlılıklarını yükleyin:**
   ```bash
   cd dermatoloji-website
   npm install
   ```

4. **Ortam değişkenlerini ayarlayın:**
   ```bash
   # .env dosyası oluşturun ve aşağıdaki değişkenleri ekleyin
   MONGODB_URI=mongodb://localhost:27017/dermaskin
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

5. **MongoDB'yi başlatın:**
   ```bash
   # MongoDB servisini başlatın (sistem/kurulum tipine göre)
   mongod
   ```

6. **Uygulamayı çalıştırın:**
   
   **Development modunda:**
   ```bash
   # Ana dizinde
   npm run dev
   
   # veya dermatoloji-website dizininde
   cd dermatoloji-website
   npm run dev
   ```
   
   **Production modunda:**
   ```bash
   npm start
   ```

7. **Tarayıcınızda açın:**
   ```
   http://localhost:3000
   ```

---

## 📱 Kullanım Kılavuzu

### 🎯 **Yeni Kullanıcılar İçin**
1. Ana sayfadan "Kayıt Ol" butonuna tıklayın
2. Gerekli bilgileri doldurun ve hesabınızı oluşturun
3. E-posta adresinizi doğrulayın
4. Cilt tipi testini tamamlayın
5. Size özel ürün önerilerini görüntüleyin

### 👤 **Mevcut Kullanıcılar İçin**
1. "Giriş Yap" ile hesabınıza erişin
2. Profilinizi güncelleyin
3. Yeni cilt analizleri yapın
4. Favori ürünlerinizi yönetin
5. AI asistan ile sohbet edin

---

## 🔒 Güvenlik

- **JWT tabanlı kimlik doğrulama**
- **bcrypt ile şifre hashleme**
- **CORS koruması**
- **Güvenli dosya yükleme**
- **Input validation ve sanitization**

---

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak isterseniz:

1. Bu repository'yi fork edin
2. Yeni bir feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

---

## 📝 Lisans

Bu proje MIT lisansı altında dağıtılmaktadır. Detaylar için `LICENSE` dosyasına bakın.

---

## 👥 Geliştirici Ekibi

**FiveByte Team** - Akıllı cilt bakım çözümleri geliştiren tutkulu bir ekip

---

## 📞 İletişim

- **Email:** info@dermaskin.com
- **Website:** https://dermaskin.com
- **GitHub:** https://github.com/kullanici-adi/FiveByte-Projesi

---

## 🙏 Teşekkürler

Bu projeyi mümkün kılan tüm açık kaynak kütüphane geliştiricilerine ve topluluğa teşekkürler.

---

<div align="center">
  <img src="https://img.shields.io/badge/Yapılmış_❤️_ile-Türkiye'de-red?style=for-the-badge" alt="Made with ❤️ in Turkey">
</div>