import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notification } from '@/models';

/**
 * PATCH /api/notifications/mark-all-read
 * Mark all notifications as read
 */
export async function PATCH(request: Request) {
    try {
        await dbConnect();

        const result = await Notification.updateMany(
            { isRead: false },
            { $set: { isRead: true } }
        );

        return NextResponse.json({
            success: true,
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Failed to mark notifications as read:', error);
        return NextResponse.json(
            { error: 'Failed to update notifications' },
            { status: 500 }
        );
    }
}
