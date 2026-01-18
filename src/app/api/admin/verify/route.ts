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
        const { email, sessionToken } = await req.json();

        if (!email || !sessionToken) {
            return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 401 });
        }

        // Verify Token
        if (admin.sessionToken !== sessionToken) {
            return NextResponse.json({ success: false, error: 'Session expired or invalid' }, { status: 401 });
        }

        return NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name, sessionToken } });

    } catch (error) {
        console.error('Session Verify Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
