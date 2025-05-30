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

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dermaskin')
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import reviewRoutes from './routes/reviews.js';
import complaintRoutes from './routes/complaints.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/complaints', complaintRoutes);

// Frontend dosyalarını serve et
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
}); 