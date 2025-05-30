import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
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

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint; 