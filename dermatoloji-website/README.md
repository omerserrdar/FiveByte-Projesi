# DermaSkin - Dermatoloji Web Sitesi

Bu proje, kullanıcıların cilt tipine göre ürünler bulmasına ve bu ürünler hakkında bilgi edinmesine yardımcı olan bir dermatoloji web sitesidir.

## Özellikler

- **Anasayfa:** Cilt sağlığı hakkında genel bilgiler ve öne çıkan ürünler
- **Kullanıcı Kayıt/Giriş Sistemi:** E-posta ve şifre ile kayıt ve giriş (frontend)
- **Cilt Tipi Testi:** Kullanıcının cilt tipini belirlemek için interaktif test
- **Ürün Önerileri:** Cilt tipine göre filtrelenmiş ürün listesi
- **Yorumlar Bölümü:** Ürünlere yorum yapma ve puanlama sistemi
- **Yapay Zekâ Destekli Asistan:** Cilt bakımı konusunda sorulara yanıt veren chatbot
- **Mobil Uyumluluk:** Tüm ekran boyutlarına uygun responsive tasarım

## Teknolojiler

- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome (ikonlar için)

## Dosya Yapısı

```
dermatoloji-website/
│
├── css/
│   └── main.css          # Ana stil dosyası
│
├── js/
│   ├── main.js           # Ortak JavaScript fonksiyonları
│   ├── skintest.js       # Cilt tipi testi için JavaScript
│   ├── products.js       # Ürün filtreleme ve detaylar için JavaScript
│   └── chatbot.js        # Chatbot işlevselliği için JavaScript
│
├── images/               # Görsel dosyaları için klasör
│
├── index.html            # Anasayfa
├── login.html            # Giriş/Kayıt sayfası
├── skintest.html         # Cilt tipi testi sayfası
├── products.html         # Ürünler sayfası
├── chatbot.html          # Cilt asistanı sayfası
└── about.html            # Hakkımızda sayfası
```

## Kurulum

1. Dosyaları bir web sunucusuna yükleyin veya yerel bir web sunucusu üzerinde çalıştırın.
2. Tarayıcınızda `index.html` dosyasını açın.

## Notlar

- Bu proje yalnızca frontend içerir, backend işlevselliği yoktur.
- Gerçek bir uygulamada, kullanıcı kimlik doğrulama ve veri saklama için backend gereklidir.
- Chatbot, gerçek bir yapay zeka API'si yerine önceden tanımlanmış yanıtlar kullanmaktadır.

## Özelleştirme

- Renk şeması `css/main.css` dosyasındaki `:root` değişkenlerinden değiştirilebilir.
- Ürün verileri gerçek bir veritabanı yerine HTML içinde tanımlanmıştır, gerçek bir uygulamada dinamik olarak yüklenmelidir.

## Geliştirici

Bu web sitesi, Manus AI tarafından oluşturulmuştur.
