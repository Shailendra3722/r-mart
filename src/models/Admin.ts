import mongoose, { Schema, model, models } from 'mongoose';

const adminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In a real app, hash this!
    name: { type: String, default: 'Admin' },
    sessionToken: { type: String }, // For server-side session verification
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Admin = models.Admin || model('Admin', adminSchema);
