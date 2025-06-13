import mongoose from 'mongoose';
import Product from './models/Product.js';

// MongoDB bağlantısı
const MONGODB_URI = 'mongodb://127.0.0.1:27017/skinai_db';

const sampleProducts = [
    {
        name: 'Vitamin C Glow Serumu',
        description: 'Cildi aydınlatan ve yaşlanma karşıtı etki sağlayan %20 Vitamin C serumu. Koyu lekeları azaltır ve cilde doğal bir parlaklık verir.',
        type: 'Serum',
        badge: 'Çok Satan',
        rating: 4.8,
        reviewCount: 156
    },
    {
        name: 'Hydrating Night Moisture Cream',
        description: 'Gece boyunca yoğun nemlendirme sağlayan, hyaluronic asit ve ceramide içeren besleyici krem. Cildi gece boyunca yeniler.',
        type: 'Nemlendirici',
        badge: 'Yeni',
        rating: 4.6,
        reviewCount: 89
    },
    {
        name: 'Gentle Foam Face Cleanser',
        description: 'Hassas ciltler için özel formüle edilmiş, nazik köpük temizleyici. Cildi kurutmadan derinlemesine temizler.',
        type: 'Temizleyici',
        badge: null,
        rating: 4.4,
        reviewCount: 203
    },
    {
        name: 'Anti-Aging Eye Cream',
        description: 'Göz çevresindeki ince çizgileri ve kırışıklıkları azaltan, peptit ve retinol içeren özel göz kremi.',
        type: 'Göz Kremi',
        badge: 'Önerilenler',
        rating: 4.7,
        reviewCount: 112
    },
    {
        name: 'SPF 50+ Mineral Sunscreen',
        description: 'Geniş spektrumlu, su geçirmez, mineral bazlı güneş koruyucu. Hassas ciltler için idealdir.',
        type: 'Güneş Koruma',
        badge: null,
        rating: 4.9,
        reviewCount: 267
    },
    {
        name: 'Clay Detox Mask',
        description: 'Cildi toksinlerden arındıran, gözenekleri temizleyen ve sıkılaştıran kil maskesi. Haftada 2 kez kullanım önerilir.',
        type: 'Maske',
        badge: 'Popüler',
        rating: 4.3,
        reviewCount: 78
    }
];

async function addSampleProducts() {
    try {
        // MongoDB'ye bağlan
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('MongoDB\'ye bağlanıldı...');
        
        // Mevcut ürünleri sil (temiz başlangıç için)
        await Product.deleteMany({});
        console.log('Mevcut ürünler silindi...');
        
        // Yeni ürünleri ekle
        const addedProducts = await Product.insertMany(sampleProducts);
        console.log(`${addedProducts.length} ürün başarıyla eklendi!`);
        
        // Eklenen ürünleri listele
        addedProducts.forEach(product => {
            console.log(`- ${product.name} (${product.type}) - ${product.rating}/5`);
        });
        
        mongoose.connection.close();
        console.log('MongoDB bağlantısı kapatıldı.');
        
    } catch (error) {
        console.error('Hata:', error);
        process.exit(1);
    }
}

// Scripti çalıştır
addSampleProducts(); 