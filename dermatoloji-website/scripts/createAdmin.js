import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    try {
        // MongoDB bağlantısı
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dermaskin');
        console.log('MongoDB bağlantısı başarılı');

        // Admin kullanıcısı bilgileri
        const adminData = {
            name: 'Admin',
            email: 'admin@dermaskin.com',
            password: 'admin123',
            role: 'admin'
        };

        // E-posta kontrolü
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin kullanıcısı zaten mevcut');
            process.exit(0);
        }

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Admin kullanıcısını oluştur
        const admin = new User({
            ...adminData,
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin kullanıcısı başarıyla oluşturuldu');
        console.log('E-posta:', adminData.email);
        console.log('Şifre:', adminData.password);

        process.exit(0);
    } catch (error) {
        console.error('Hata:', error);
        process.exit(1);
    }
};

createAdmin(); 