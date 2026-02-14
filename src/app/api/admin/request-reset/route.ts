import { NextResponse } from 'next/server';
import { Admin } from '@/models/Admin';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

// Generate 6-digit reset code
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
        }

        // Check if admin exists or create default admin
        let admin = await Admin.findOne({ email });

        if (!admin) {
            // If admin doesn't exist and it's the default email, create it
            if (email === 'admin@rmart.com') {
                admin = await Admin.create({
                    email: 'admin@rmart.com',
                    password: 'admin123',
                    name: 'Super Admin'
                });
            } else {
                return NextResponse.json({ success: false, error: 'Admin account not found' }, { status: 404 });
            }
        }

        // Generate reset code
        const resetCode = generateResetCode();
        const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        // Update admin with reset code
        admin.resetCode = resetCode;
        admin.resetCodeExpiry = resetCodeExpiry;
        await admin.save();

        // In production, send this via email
        // For demo, log it to console
        console.log('\n='.repeat(50));
        console.log('🔐 PASSWORD RESET CODE FOR:', email);
        console.log('📧 Code:', resetCode);
        console.log('⏰ Expires at:', resetCodeExpiry.toLocaleString());
        console.log('='.repeat(50) + '\n');

        return NextResponse.json({
            success: true,
            message: 'Reset code generated. Check server console for the code.',
            expiresIn: '15 minutes'
        });

    } catch (error) {
        console.error('Request Reset Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
