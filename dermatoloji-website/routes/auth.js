import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Kayıt ol
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // E-posta kontrolü
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Bu e-posta adresi zaten kayıtlı' });
        }

        // Yeni kullanıcı oluştur
        user = new User({
            name,
            email,
            password
        });

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // JWT token oluştur
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ success: true, token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Giriş yap
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı kontrol et
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Geçersiz kimlik bilgileri' });
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Geçersiz kimlik bilgileri' });
        }

        // JWT token oluştur
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                // Şifreyi göndermeden kullanıcı bilgisini ekle
                const { password, ...userData } = user.toObject();
                res.json({ success: true, token, user: userData });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

export default router; 