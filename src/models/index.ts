import mongoose, { Schema, model, models } from 'mongoose';

// --- Product Schema ---
const productSchema = new Schema({
    id: { type: String, required: true, unique: true }, // Keeping string ID for compatibility
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// --- Order Schema ---
const orderSchema = new Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true }, // Links to Firebase UID or local user ID
    date: { type: String, required: true }, // ISO string
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    total: { type: Number, required: true },
    items: [{
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        selectedSize: { type: String },
        selectedColor: { type: String }
    }],
    shippingAddress: {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        pincode: { type: String, required: true },
        address: { type: String, required: true },
        landmark: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true }, // 'COD' | 'UPI' | 'Card'
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Pending' },
    transactionId: { type: String },
    customerName: { type: String },
    customerMobile: { type: String }
});

// --- User Schema ---
const userSchema = new Schema({
    uid: { type: String, required: true, unique: true }, // Firebase UID
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    photoURL: { type: String },
    joinedAt: { type: Date, default: Date.now },
    provider: { type: String } // 'google', 'phone', 'email', 'anonymous'
});

// Export Models
// Use models.ModelName || model('ModelName', schema) to prevent overwriting during hot reloads
export const Product = models.Product || model('Product', productSchema);
export const Order = models.Order || model('Order', orderSchema);
export const User = models.User || model('User', userSchema);
