import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

/**
 * GET /api/notifications
 * Fetch user notifications from Firestore
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const limitCount = parseInt(searchParams.get('limit') || '50');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Query notifications for this user
        const notificationsRef = collection(db, 'notifications');
        const notificationsQuery = query(
            notificationsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const notificationsSnapshot = await getDocs(notificationsQuery);

        const notifications = notificationsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                type: data.type,
                title: data.title,
                message: data.message,
                read: data.read || false,
                createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                actionUrl: data.actionUrl,
                actionLabel: data.actionLabel,
                imageUrl: data.imageUrl,
                relatedId: data.relatedId,
                relatedType: data.relatedType
            };
        });

        // Calculate unread count
        const unreadCount = notifications.filter(n => !n.read).length;

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount,
            total: notifications.length
        });

    } catch (error: any) {
        console.error('Fetch notifications error:', error);
        return NextResponse.json(
            { success: false, error: `Failed to fetch notifications: ${error.message}` },
            { status: 500 }
        );
    }
}
