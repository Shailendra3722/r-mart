import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notification } from '@/models';

/**
 * GET /api/notifications
 * Fetch all notifications or only unread ones
 */
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const targetAudience = searchParams.get('targetAudience') || 'admin';
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        let query: any = {};

        // Filter by target audience
        if (targetAudience === 'admin' || targetAudience === 'user') {
            query.targetAudience = { $in: [targetAudience, 'both'] };
        }

        // Filter by user ID for user-specific notifications
        if (userId) {
            query.userId = userId;
        }

        // Filter unread only
        if (unreadOnly) {
            query.isRead = false;
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(100);
        const unreadCount = await Notification.countDocuments({
            ...query,
            isRead: false
        });

        return NextResponse.json({
            notifications,
            unreadCount,
            total: notifications.length
        });
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/notifications
 * Create a new notification manually
 */
export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { type, title, message, userId, targetAudience, relatedId, relatedType, actionUrl, actionLabel, imageUrl } = body;

        // Validate required fields
        if (!type || !title || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: type, title, message' },
                { status: 400 }
            );
        }

        const notificationData = {
            id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type,
            title,
            message,
            userId,
            targetAudience: targetAudience || 'admin',
            relatedId,
            relatedType,
            actionUrl,
            actionLabel,
            imageUrl,
            isRead: false,
            createdAt: new Date()
        };

        const notification = await Notification.create(notificationData);

        return NextResponse.json(notification, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create notification:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create notification' },
            { status: 500 }
        );
    }
}
