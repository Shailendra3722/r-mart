import { NextResponse } from 'next/server';
import { Admin } from '@/models/Admin';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

export async function PUT(req: Request) {
    try {
        await connectDB();
        const { currentEmail, currentPassword, newEmail, newPassword } = await req.json();

        // 1. Verify Current Admin
        const admin = await Admin.findOne({ email: currentEmail });

        if (!admin) {
            return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
        }

        if (admin.password !== currentPassword) {
            return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 401 });
        }

        // 2. Update
        if (newEmail) admin.email = newEmail;
        if (newPassword) admin.password = newPassword;
        admin.updatedAt = new Date();

        await admin.save();

        return NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name } });

    } catch (error) {
        console.error('Admin Update Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
