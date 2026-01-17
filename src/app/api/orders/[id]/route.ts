
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models';

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const params = await props.params;
        const { id } = params;
        const body = await request.json();
        const { status, paymentStatus } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (body.courier) updateData.courier = body.courier;
        if (body.trackingId) updateData.trackingId = body.trackingId;
        if (body.awbNumber) updateData.awbNumber = body.awbNumber;

        // Use custom id (ORD-...) or _id depending on what frontend sends
        // Ideally we should use _id for Mongo, but our frontend uses custom IDs heavily
        // Let's try to match custom ID first
        let updatedOrder = await Order.findOneAndUpdate(
            { id: id },
            updateData,
            { new: true }
        );

        // If not found by custom ID, try _id if it looks like an ObjectId
        if (!updatedOrder && id.match(/^[0-9a-fA-F]{24}$/)) {
            updatedOrder = await Order.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );
        }

        if (!updatedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Order Update Error:", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
