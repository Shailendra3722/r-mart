import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notification } from '@/models';

/**
 * PATCH /api/notifications/[id]
 * Mark a specific notification as read/unread
 */
export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const params = await props.params;

        const body = await request.json();
        const { isRead } = body;

        const notification = await Notification.findOneAndUpdate(
            { id: params.id },
            { $set: { isRead: isRead !== undefined ? isRead : true } },
            { new: true }
        );

        if (!notification) {
            return NextResponse.json(
                { error: 'Notification not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(notification);
    } catch (error) {
        console.error('Failed to update notification:', error);
        return NextResponse.json(
            { error: 'Failed to update notification' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/notifications/[id]
 * Delete a specific notification
 */
export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const params = await props.params;

        const notification = await Notification.findOneAndDelete({ id: params.id });

        if (!notification) {
            return NextResponse.json(
                { error: 'Notification not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete notification:', error);
        return NextResponse.json(
            { error: 'Failed to delete notification' },
            { status: 500 }
        );
    }
}
