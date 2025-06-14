import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Product from './models/Product.js';

// MongoDB bağlantısı
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/skinai_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB bağlantısı başarılı');
    } catch (error) {
        console.error('❌ MongoDB bağlantı hatası:', error);
        process.exit(1);
    }
};

// Görsel dosyası kontrolü
const isImageFile = (filename) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.includes(path.extname(filename).toLowerCase());
};

// Dosya adından ürün adı oluştur
const generateProductName = (filename) => {
    // Uzantıyı kaldır
    const nameWithoutExt = path.parse(filename).name;
    
    // Özel karakterleri temizle ve boşluklarla değiştir
    let productName = nameWithoutExt
        .replace(/[_-]/g, ' ')           // Alt çizgi ve tirelerı boşlukla değiştir
        .replace(/\d+/g, (match) => ` ${match}`) // Sayıları boşlukla ayır
        .replace(/([a-z])([A-Z])/g, '$1 $2')     // camelCase'i ayır
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Her kelimenin ilk harfini büyüt
        .join(' ')
        .trim();
    
    return productName || 'Ürün';
};

// Dosya adından kategori tahmin et
const guessCategory = (filename) => {
    const name = filename.toLowerCase();
    
    if (name.includes('krem') || name.includes('cream') || name.includes('nemlendirici') || name.includes('moisturizer')) {
        return 'Krem';
    }
    if (name.includes('serum')) {
        return 'Serum';
    }
    if (name.includes('temizleyici') || name.includes('cleanser') || name.includes('foam')) {
        return 'Temizleyici';
    }
    if (name.includes('toner') || name.includes('tonic')) {
        return 'Toner';
    }
    if (name.includes('maske') || name.includes('mask')) {
        return 'Maske';
    }
    if (name.includes('spf') || name.includes('sunscreen') || name.includes('güneş')) {
        return 'Güneş Koruma';
    }
    if (name.includes('göz') || name.includes('eye')) {
        return 'Göz Kremi';
    }
    
    return 'Cilt Bakım Ürünü';
};

// Varsayılan açıklama oluştur
const generateDescription = (productName, category) => {
    const descriptions = {
        'Krem': `${productName}, cildinizi besleyen ve nemlendiren özel formülü ile günlük bakımınızda güvenle kullanabileceğiniz etkili bir krem.`,
        'Serum': `${productName}, aktif bileşenleri ile cildinizi derinlemesine besleyen ve yenileyen konsantre bir serum.`,
        'Temizleyici': `${productName}, cildinizi nazikçe temizleyen ve doğal nem dengesini koruyan etkili bir temizleyici.`,
        'Toner': `${productName}, cildinizin pH dengesini koruyarak sonraki bakım ürünlerinin daha iyi emilimini sağlayan ferahlatıcı toner.`,
        'Maske': `${productName}, özel formülü ile cildinizi derinlemesine besleyen ve yenileyen bakım maskesi.`,
        'Güneş Koruma': `${productName}, zararlı UV ışınlarına karşı etkili koruma sağlayan ve cildinizi güvende tutan güneş koruyucu.`,
        'Göz Kremi': `${productName}, göz çevresi için özel olarak formüle edilmiş, ince çizgileri azaltmaya yardımcı olan bakım kremi.`
    };
    
    return descriptions[category] || `${productName}, cilt sağlığınız için özenle seçilmiş kaliteli bir bakım ürünü.`;
};

// Rastgele rating ve review count oluştur
const generateRandomRating = () => ({
    rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0 arası
    reviewCount: Math.floor(Math.random() * 200) + 20    // 20 - 220 arası
});

// Ürün oluştur
const createProductFromImage = async (filename, imagePath) => {
    const productName = generateProductName(filename);
    const category = guessCategory(filename);
    const description = generateDescription(productName, category);
    const { rating, reviewCount } = generateRandomRating();
    
    // Varsa aynı isimde ürünü kontrol et
    const existingProduct = await Product.findOne({ name: productName });
    if (existingProduct) {
        console.log(`⚠️  "${productName}" zaten mevcut, atlaniyor...`);
        return null;
    }
    
    const product = new Product({
        name: productName,
        type: category,
        description: description,
        rating: rating,
        reviewCount: reviewCount,
        badge: Math.random() > 0.7 ? 'Yeni' : null // %30 ihtimalle badge ekle
    });
    
    try {
        await product.save();
        console.log(`✅ Ürün oluşturuldu: ${productName} (${category})`);
        return product;
    } catch (error) {
        console.error(`❌ Ürün oluşturma hatası: ${productName}`, error.message);
        return null;
    }
};

// Ana fonksiyon
const autoAddProductsFromImages = async (imagesDirectory = './images') => {
    console.log('🚀 Otomatik ürün ekleme işlemi başlatılıyor...\n');
    
    // MongoDB'ye bağlan
    await connectDB();
    
    try {
        // Klasörün var olup olmadığını kontrol et
        if (!fs.existsSync(imagesDirectory)) {
            console.error(`❌ Klasör bulunamadı: ${imagesDirectory}`);
            console.log('💡 İpucu: Önce klasörü oluşturun ve içine görsel dosyaları ekleyin.');
            return;
        }
        
        // Klasördeki dosyaları oku
        const files = fs.readdirSync(imagesDirectory);
        const imageFiles = files.filter(file => isImageFile(file));
        
        if (imageFiles.length === 0) {
            console.log(`📂 ${imagesDirectory} klasöründe görsel dosyası bulunamadı.`);
            console.log('💡 Desteklenen formatlar: .jpg, .jpeg, .png, .gif, .bmp, .webp');
            return;
        }
        
        console.log(`📸 ${imageFiles.length} görsel dosyası bulundu:\n`);
        
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;
        
        // Her görsel için ürün oluştur
        for (const filename of imageFiles) {
            const imagePath = path.join(imagesDirectory, filename);
            const result = await createProductFromImage(filename, imagePath);
            
            if (result) {
                successCount++;
            } else if (result === null) {
                skipCount++;
            } else {
                errorCount++;
            }
        }
        
        // Sonuç raporu
        console.log('\n📊 İşlem Tamamlandı!');
        console.log('=====================================');
        console.log(`✅ Başarıyla eklenen: ${successCount}`);
        console.log(`⚠️  Atlanan (mevcut): ${skipCount}`);
        console.log(`❌ Hata olan: ${errorCount}`);
        console.log(`📁 Toplam işlenen: ${imageFiles.length}`);
        
        if (successCount > 0) {
            console.log('\n🎉 Yeni ürünler başarıyla veritabanına eklendi!');
            console.log('🌐 Ürünleri görmek için: http://localhost:3000/products.html');
        }
        
    } catch (error) {
        console.error('❌ Genel hata:', error);
    } finally {
        // MongoDB bağlantısını kapat
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB bağlantısı kapatıldı.');
    }
};

// Komut satırı argümanlarını kontrol et
const args = process.argv.slice(2);
const customDirectory = args[0];

// Script'i çalıştır
if (customDirectory) {
    autoAddProductsFromImages(customDirectory);
} else {
    console.log('📂 Varsayılan klasör kullanılıyor: ./images');
    console.log('💡 Farklı klasör kullanmak için: node auto-add-products.js "./path/to/images"\n');
    autoAddProductsFromImages();
} 