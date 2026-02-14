import { NextResponse } from 'next/server';
import { Admin } from '@/models/Admin';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, resetCode, newPassword } = await req.json();

        if (!email || !resetCode || !newPassword) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Find admin
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return NextResponse.json({ success: false, error: 'Admin account not found' }, { status: 404 });
        }

        // Check if reset code exists
        if (!admin.resetCode) {
            return NextResponse.json({ success: false, error: 'No reset code found. Please request a new one.' }, { status: 400 });
        }

        // Check if reset code matches
        if (admin.resetCode !== resetCode) {
            return NextResponse.json({ success: false, error: 'Invalid reset code' }, { status: 400 });
        }

        // Check if reset code is expired
        if (!admin.resetCodeExpiry || admin.resetCodeExpiry < new Date()) {
            return NextResponse.json({ success: false, error: 'Reset code has expired. Please request a new one.' }, { status: 400 });
        }

        // Update password
        admin.password = newPassword;
        admin.hasCustomPassword = true;
        admin.resetCode = undefined;
        admin.resetCodeExpiry = undefined;
        admin.updatedAt = new Date();

        await admin.save();

        console.log('✅ Password successfully reset for:', email);

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
