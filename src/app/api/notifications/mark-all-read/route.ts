import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

/**
 * POST /api/notifications/mark-all-read
 * Mark all notifications as read for a user
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get all unread notifications for this user
        const notificationsRef = collection(db, 'notifications');
        const q = query(
            notificationsRef,
            where('userId', '==', userId),
            where('read', '==', false)
        );

        const snapshot = await getDocs(q);

        // Use batch to update all notifications
        const batch = writeBatch(db);
        snapshot.docs.forEach(doc => {
            batch.update(doc.ref, { read: true });
        });

        await batch.commit();

        return NextResponse.json({
            success: true,
            updatedCount: snapshot.size
        });

    } catch (error: any) {
        console.error('Mark all as read error:', error);
        return NextResponse.json(
            { success: false, error: `Failed to mark notifications as read: ${error.message}` },
            { status: 500 }
        );
    }
}
