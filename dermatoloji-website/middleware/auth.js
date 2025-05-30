import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    // Token'ı header'dan al
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Token yoksa
    if (!token) {
        return res.status(401).json({ success: false, message: 'Yetkilendirme token\'ı bulunamadı' });
    }

    try {
        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Geçersiz token' });
    }
};

export default auth; 