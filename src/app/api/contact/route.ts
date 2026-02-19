import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Contact } from '@/models';

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
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
        }

        const newContact = await Contact.create({
            name,
            email,
            subject,
            message,
            read: false,
            createdAt: new Date()
        });

        return NextResponse.json({ success: true, id: newContact._id }, { status: 201 });
    } catch (error) {
        console.error('Contact submission error:', error);
        return NextResponse.json({ success: false, error: 'Failed to submit message' }, { status: 500 });
    }
}
