import { NextResponse } from 'next/server';
import { razorpayInstance } from '@/lib/razorpay';

export async function POST(req: Request) {
    try {
        const { amount, currency = 'INR', orderId } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const razorpay = await razorpayInstance();

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: orderId,
            payment_capture: 1 // Auto capture payment
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        });

    } catch (error: any) {
        console.error('Payment creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create payment order' },
            { status: 500 }
        );
    }
}
