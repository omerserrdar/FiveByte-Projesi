import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Beklemede', 'İnceleniyor', 'Çözüldü'],
        default: 'Beklemede'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Complaint', complaintSchema); 