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
    images: { type: [String], default: [] }, // Array of additional image URLs
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
    paymentMethod: { type: String, required: true }, // 'COD' | 'Online'
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    razorpayOrderId: { type: String }, // Razorpay order ID
    razorpayPaymentId: { type: String }, // Razorpay payment ID
    razorpaySignature: { type: String }, // For verification
    paidAt: { type: Date }, // Timestamp when payment completed
    transactionId: { type: String },
    customerName: { type: String },
    customerMobile: { type: String },
    // Logistics
    courier: { type: String },
    trackingId: { type: String },
    awbNumber: { type: String }
});

// --- Notification Schema ---
const notificationSchema = new Schema({
    id: { type: String, required: true, unique: true },
    type: {
        type: String,
        enum: ['order', 'payment', 'delivery', 'account', 'product', 'system'],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },

    // User/Admin targeting
    userId: { type: String }, // If set, notification is for specific user
    targetAudience: {
        type: String,
        enum: ['admin', 'user', 'both'],
        default: 'admin'
    },

    // Related entities
    relatedId: { type: String }, // Reference to Order ID, Product ID, User ID, etc.
    relatedType: {
        type: String,
        enum: ['order', 'product', 'user', 'payment']
    },

    // Metadata
    isRead: { type: Boolean, default: false },
    actionUrl: { type: String }, // Deep link for "View Order", "Track Shipment", etc.
    actionLabel: { type: String }, // "View Order", "Track Package", "Update Profile"
    imageUrl: { type: String }, // Product image for product notifications

    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date } // Optional expiry for time-sensitive notifications
});

// Indexes for efficient user queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ targetAudience: 1, createdAt: -1 });

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
export const Notification = models.Notification || model('Notification', notificationSchema);
