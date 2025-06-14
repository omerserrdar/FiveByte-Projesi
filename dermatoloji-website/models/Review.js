import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: {
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
        maxlength: 500
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index sadece productId üzerinden
reviewSchema.index({ productId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review; 