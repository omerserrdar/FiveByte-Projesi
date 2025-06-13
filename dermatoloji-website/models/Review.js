import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Aynı kullanıcının aynı ürüne birden fazla yorum yapmasını engelle
reviewSchema.index({ productId: 1, userEmail: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review; 