import express from 'express';
import auth from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

// Tüm ürünleri getir
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Tek ürün getir
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Yeni ürün ekle (sadece admin)
router.post('/', auth, async (req, res) => {
    try {
        const { name, type, description, price, badge } = req.body;

        const newProduct = new Product({
            name,
            type,
            description,
            price,
            badge
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Ürün güncelle (sadece admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, type, description, price, badge } = req.body;

        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, type, description, price, badge },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Ürün sil (sadece admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
        }

        await product.remove();
        res.json({ success: true, message: 'Ürün silindi' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

export default router; 