import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';

// GET: Fetch all users (for Admin Panel)
export async function GET() {
    try {
        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 }); // Newest first
        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
