import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/models';

const MONGODB_URI = process.env.MONGODB_URI;

export async function PUT(req: Request) {
    if (!MONGODB_URI) {
        return NextResponse.json({ success: false, error: 'Database configuration error' }, { status: 500 });
    }

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGODB_URI);
        }

        const body = await req.json();
        const { uid, photoURL } = body;

        if (!uid || !photoURL) {
            return NextResponse.json({ success: false, error: 'User ID and Photo URL are required' }, { status: 400 });
        }

        const updatedUser = await User.findOneAndUpdate(
            { uid },
            { photoURL },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
    }
}
