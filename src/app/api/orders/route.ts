import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let query: any = {};
        if (userId) {
            query.userId = userId;
        }

        const orders = await Order.find(query).sort({ date: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newOrder = await Order.create(body);
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error: any) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({
            error: error.message || 'Failed to create order',
            details: error.errors // Details for validation errors
        }, { status: 500 });
    }
}
