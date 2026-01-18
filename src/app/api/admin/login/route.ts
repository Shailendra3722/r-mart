import { NextResponse } from 'next/server';
import { Admin } from '@/models/Admin';
import mongoose from 'mongoose';

// Connect to DB Helper (inline for now)
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) return; // Should handle this better
    await mongoose.connect(process.env.MONGODB_URI);
};

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        // 1. Check if ANY admin exists. If not, create default
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            if (email === 'admin@rmart.com' && password === 'admin123') {
                await Admin.create({
                    email: 'admin@rmart.com',
                    password: 'admin123',
                    name: 'Super Admin'
                });
                return NextResponse.json({ success: true, admin: { email: 'admin@rmart.com', name: 'Super Admin' } });
            }
        }

        // 2. Find Admin
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        // 3. Check Password (Direct comparison for now, should be bcrypt.compare in prod)
        if (admin.password !== password) {
            return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        // 4. Generate Session Token using Web Crypto API
        const sessionToken = crypto.randomUUID();
        admin.sessionToken = sessionToken;
        await admin.save();

        return NextResponse.json({
            success: true,
            admin: {
                email: admin.email,
                name: admin.name,
                sessionToken: sessionToken
            }
        });

    } catch (error) {
        console.error('Admin Login Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
