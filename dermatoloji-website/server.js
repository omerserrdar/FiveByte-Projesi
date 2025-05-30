import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

// ES modules için __dirname tanımlama
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Çevre değişkenlerini yükle
dotenv.config();

const app = express();

// MongoDB bağlantı seçenekleri
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dermaskin', mongooseOptions)
    .then(() => {
        console.log('MongoDB bağlantısı başarılı');
    })
    .catch(err => {
        console.error('MongoDB bağlantı hatası:', err);
        process.exit(1); // Bağlantı hatası durumunda uygulamayı sonlandır
    });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import reviewRoutes from './routes/reviews.js';
import complaintRoutes from './routes/complaints.js';

// API rotalarını tanımla
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/complaints', complaintRoutes);

// Frontend dosyalarını serve et
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Hata yakalama middleware'i
app.use((err, req, res, next) => {
    console.error('Hata:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Sunucu hatası!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
}).on('error', (err) => {
    console.error('Sunucu başlatma hatası:', err);
    process.exit(1);
}); 