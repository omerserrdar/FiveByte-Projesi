import express from 'express';
import Complaint from '../models/Complaint.js';

const router = express.Router();

// Şikayet gönder
router.post('/', async (req, res) => {
    try {
        const { subject, message } = req.body;

        const complaint = new Complaint({
            subject,
            message
        });

        await complaint.save();
        res.json({ success: true, data: complaint });
    } catch (err) {
        console.error('Şikayet gönderme hatası:', err);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Tüm şikayetleri getir
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json({ success: true, data: complaints });
    } catch (err) {
        console.error('Şikayetleri getirme hatası:', err);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Şikayet durumunu güncelle
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Şikayet bulunamadı' });
        }

        res.json({ success: true, data: complaint });
    } catch (err) {
        console.error('Şikayet güncelleme hatası:', err);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

export default router; 