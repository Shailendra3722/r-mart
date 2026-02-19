import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Subscriber } from '@/models';

const MONGODB_URI = process.env.MONGODB_URI;

export async function POST(req: Request) {
    if (!MONGODB_URI) {
        return NextResponse.json({ success: false, error: 'Database configuration error' }, { status: 500 });
    }

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGODB_URI);
        }

        const body = await req.json();
        const { email } = body;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json({ success: false, error: 'Please enter a valid email' }, { status: 400 });
        }

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            if (!existing.isActive) {
                existing.isActive = true;
                await existing.save();
                return NextResponse.json({ success: true, message: 'Welcome back! You have been resubscribed.' }, { status: 200 });
            }
            return NextResponse.json({ success: false, error: 'You are already subscribed!' }, { status: 400 });
        }

        await Subscriber.create({
            email,
            subscribedAt: new Date(),
            isActive: true
        });

        return NextResponse.json({ success: true, message: 'Thank you for subscribing!' }, { status: 201 });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json({ success: false, error: 'Failed to subscribe' }, { status: 500 });
    }
}
