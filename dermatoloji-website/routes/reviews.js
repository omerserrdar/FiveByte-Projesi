import express from 'express';
import auth from '../middleware/auth.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

const router = express.Router();

// Ürüne yorum ekle
router.post('/:productId', async (req, res) => {
    try {
        const { rating, comment, userName, isAnonymous } = req.body;
        const productId = req.params.productId;

        // Temel validasyon
        if (!rating || !comment) {
            return res.status(400).json({ 
                success: false, 
                message: 'Puan ve yorum zorunludur' 
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
        if (comment.length < 3 || comment.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Yorum 3-500 karakter arasında olmalıdır'
            });
        }

        // Kullanıcı adı kontrolü (anonim değilse zorunlu)
        let finalUserName = 'Anonim Kullanıcı';
        let anonymous = true;

        if (userName && userName.trim()) {
            finalUserName = userName.trim();
            anonymous = false;
        } else if (isAnonymous === false) {
            return res.status(400).json({
                success: false,
                message: 'Kullanıcı adı gerekli'
            });
        }

        // Yeni yorum oluştur
        const review = new Review({
            productId,
            userName: finalUserName,
            rating: parseInt(rating),
            comment: comment.trim(),
            isAnonymous: anonymous
        });

        // Yorumu kaydet
        await review.save();

        // Başarılı yanıt
        res.json({ 
            success: true, 
            data: review,
            message: 'Yorumunuz başarıyla eklendi!' 
        });

    } catch (err) {
        console.error('Yorum ekleme hatası:', err);
        
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

// Admin için yorum silme (isteğe bağlı)
router.delete('/:reviewId', async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        // Yorumu bul ve sil
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: 'Yorum bulunamadı' 
            });
        }

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