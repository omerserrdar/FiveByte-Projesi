import express from 'express';
import Complaint from '../models/Complaint.js';

const router = express.Router();

// Şikayet gönder
router.post('/', async (req, res) => {
    try {
        const { name, email, complaint } = req.body;

        const newComplaint = new Complaint({
            name,
            email,
            complaint
        });

        await newComplaint.save();
        res.json({ success: true, message: 'Şikayetiniz başarıyla gönderildi' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Tüm şikayetleri getir (sadece admin)
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Şikayet durumunu güncelle (sadece admin)
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;

        let complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Şikayet bulunamadı' });
        }

        complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

export default router; 