import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import dbConnect from '@/lib/db';
import { Order } from '@/models';

export async function POST(req: Request) {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            orderId // Our database order ID
        } = await req.json();

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify Razorpay signature
        const isValid = verifyRazorpaySignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
        }

        // Update order in database
        await dbConnect();
        const order = await Order.findOne({ id: orderId });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Update payment details
        order.paymentStatus = 'Paid';
        order.razorpayOrderId = razorpayOrderId;
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;
        order.paidAt = new Date();
        order.status = 'Processing'; // Move order to processing after payment

        await order.save();

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            order: {
                id: order.id,
                status: order.status,
                paymentStatus: order.paymentStatus
            }
        });

    } catch (error: any) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { error: error.message || 'Payment verification failed' },
            { status: 500 }
        );
    }
}
