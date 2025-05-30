import express from 'express';
import auth from '../middleware/auth.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

const router = express.Router();

// Ürüne yorum ekle
router.post('/:productId', async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        // Ürünü kontrol et
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
        }

        // Yorumu oluştur
        const review = new Review({
            product: productId,
            rating,
            comment
        });

        await review.save();

        // Ürünün ortalama puanını güncelle
        const reviews = await Review.find({ product: productId });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        product.rating = totalRating / reviews.length;
        product.reviewCount = reviews.length;
        await product.save();

        res.json({ success: true, data: review });
    } catch (err) {
        console.error('Yorum ekleme hatası:', err);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Ürün yorumlarını getir
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (err) {
        console.error('Yorumları getirme hatası:', err);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Yorumu güncelle
router.put('/:id', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        let review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Yorum bulunamadı' });
        }

        // Kullanıcı kontrolü
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Yetkisiz işlem' });
        }

        review = await Review.findByIdAndUpdate(
            req.params.id,
            { rating, comment },
            { new: true }
        );

        // Ürünün ortalama puanını güncelle
        const reviews = await Review.find({ product: review.product });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Product.findByIdAndUpdate(review.product, {
            rating: averageRating,
            reviewCount: reviews.length
        });

        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Yorumu sil
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Yorum bulunamadı' });
        }

        // Kullanıcı kontrolü
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Yetkisiz işlem' });
        }

        await review.remove();

        // Ürünün ortalama puanını güncelle
        const reviews = await Review.find({ product: review.product });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        await Product.findByIdAndUpdate(review.product, {
            rating: averageRating,
            reviewCount: reviews.length
        });

        res.json({ success: true, message: 'Yorum silindi' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

export default router; 