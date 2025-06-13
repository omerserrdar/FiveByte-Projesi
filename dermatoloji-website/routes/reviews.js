import express from 'express';
import auth from '../middleware/auth.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

const router = express.Router();

// Ürüne yorum ekle
router.post('/:productId', async (req, res) => {
    try {
        const { rating, comment, userEmail, userName } = req.body;
        const productId = req.params.productId;

        // Temel validasyon
        if (!rating || !comment || !userEmail || !userName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tüm alanlar zorunludur' 
            });
        }

        // Rating kontrolü
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Puan 1-5 arasında olmalıdır' 
            });
        }

        // Yorum uzunluğu kontrolü
        if (comment.length < 3 || comment.length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Yorum 3-1000 karakter arasında olmalıdır'
            });
        }

        // Aynı kullanıcının aynı ürüne daha önce yorum yapıp yapmadığını kontrol et
        const existingReview = await Review.findOne({ productId, userEmail });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'Bu ürün için zaten bir yorumunuz var'
            });
        }

        // Yeni yorum oluştur
        const review = new Review({
            productId,
            userEmail,
            userName,
            rating: parseInt(rating),
            comment: comment.trim()
        });

        // Yorumu kaydet
        await review.save();

        // Başarılı yanıt
        res.json({ 
            success: true, 
            data: review,
            message: 'Yorum başarıyla eklendi!' 
        });

    } catch (err) {
        console.error('Yorum ekleme hatası:', err);
        
        // MongoDB duplicate key hatası
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Bu ürün için zaten bir yorumunuz var'
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası' 
        });
    }
});

// Ürün yorumlarını getir
router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        
        // Yorumları getir (en yeniden en eskiye)
        const reviews = await Review.find({ productId })
            .sort({ createdAt: -1 });
        
        res.json({ 
            success: true, 
            data: reviews 
        });
    } catch (err) {
        console.error('Yorumları getirme hatası:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası' 
        });
    }
});

// Yorumu güncelle
router.put('/:reviewId', async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const reviewId = req.params.reviewId;
        const userEmail = req.body.userEmail; // Kullanıcı emaili request'ten al

        // Yorumu bul
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: 'Yorum bulunamadı' 
            });
        }

        // Yorum sahibi kontrolü
        if (review.userEmail !== userEmail) {
            return res.status(401).json({ 
                success: false, 
                message: 'Bu yorumu düzenleme yetkiniz yok' 
            });
        }

        // Validasyonlar
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Puan 1-5 arasında olmalıdır'
            });
        }

        if (comment && (comment.length < 3 || comment.length > 1000)) {
            return res.status(400).json({
                success: false,
                message: 'Yorum 3-1000 karakter arasında olmalıdır'
            });
        }

        // Yorumu güncelle
        review.rating = rating || review.rating;
        review.comment = comment ? comment.trim() : review.comment;
        await review.save();

        res.json({ 
            success: true, 
            data: review,
            message: 'Yorum başarıyla güncellendi' 
        });

    } catch (err) {
        console.error('Yorum güncelleme hatası:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası' 
        });
    }
});

// Yorumu sil
router.delete('/:reviewId', async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const userEmail = req.body.userEmail; // Kullanıcı emaili request'ten al

        // Yorumu bul
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: 'Yorum bulunamadı' 
            });
        }

        // Yorum sahibi kontrolü
        if (review.userEmail !== userEmail) {
            return res.status(401).json({ 
                success: false, 
                message: 'Bu yorumu silme yetkiniz yok' 
            });
        }

        // Yorumu sil
        await review.deleteOne();

        res.json({ 
            success: true, 
            message: 'Yorum başarıyla silindi' 
        });

    } catch (err) {
        console.error('Yorum silme hatası:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası' 
        });
    }
});

export default router; 