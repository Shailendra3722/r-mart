
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models';

export async function GET() {
    try {
        await dbConnect();
        // Simple count check
        const count = await Order.countDocuments({});
        return NextResponse.json({
            status: 'ok',
            message: 'Connected to MongoDB',
            orderCount: count
        });
    } catch (error: any) {
        console.error("Health Check Error:", error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to DB',
            details: error.message
        }, { status: 500 });
    }
}
