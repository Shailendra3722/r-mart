import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * PATCH /api/notifications/[id]
 * Mark a single notification as read
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const notificationId = resolvedParams.id;

        const notificationRef = doc(db, 'notifications', notificationId);
        await updateDoc(notificationRef, {
            read: true
        });

        return NextResponse.json({
            success: true,
            message: 'Notification marked as read'
        });

    } catch (error: any) {
        console.error('Mark as read error:', error);
        return NextResponse.json(
            { success: false, error: `Failed to mark notification as read: ${error.message}` },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/notifications/[id]
 * Delete a notification
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const notificationId = resolvedParams.id;

        const notificationRef = doc(db, 'notifications', notificationId);
        await deleteDoc(notificationRef);

        return NextResponse.json({
            success: true,
            message: 'Notification deleted'
        });

    } catch (error: any) {
        console.error('Delete notification error:', error);
        return NextResponse.json(
            { success: false, error: `Failed to delete notification: ${error.message}` },
            { status: 500 }
        );
    }
}
