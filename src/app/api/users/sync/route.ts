import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        const { uid, email, mobile } = body;

        if (!uid) {
            return NextResponse.json({ error: 'UID is required' }, { status: 400 });
        }

        // Upsert user (update if exists, insert if new)
        const user = await User.findOneAndUpdate(
            { uid: uid },
            { $set: body },
            { new: true, upsert: true }
        );

        return NextResponse.json(user);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
    }
}
