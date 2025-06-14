import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    badge: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
        default: null
    },
    featured: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    ingredients: [String],
    skinTypes: [String],
    benefits: [String],
    usage: String,
    warnings: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product; 