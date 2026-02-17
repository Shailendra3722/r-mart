"use client";

import { useRouter } from 'next/navigation';
import { CheckCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import NotificationItem from './NotificationItem';

interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    actionUrl?: string;
    actionLabel?: string;
    imageUrl?: string;
}

interface NotificationDropdownProps {
    notifications: Notification[];
    loading: boolean;
    onClose: () => void;
    onRefresh: () => void;
}

export default function NotificationDropdown({
    notifications,
    loading,
    onClose,
    onRefresh
}: NotificationDropdownProps) {
    const router = useRouter();
    const [markingAllRead, setMarkingAllRead] = useState(false);

    const handleMarkAllRead = async () => {
        setMarkingAllRead(true);
        try {
            const userId = notifications[0]?.userId;
            if (!userId) return;

            const response = await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                onRefresh();
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        } finally {
            setMarkingAllRead(false);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read if unread
        if (!notification.read) {
            try {
                await fetch(`/api/notifications/${notification.id}`, {
                    method: 'PATCH'
                });
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }

        // Navigate to action URL if exists
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
            onClose();
        }
    };

    return (
        <div className="absolute right-0 top-full z-20 mt-2 w-80 sm:w-96 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                {notifications.length > 0 && notifications.some(n => !n.read) && (
                    <button
                        onClick={handleMarkAllRead}
                        disabled={markingAllRead}
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:text-emerald-700 disabled:opacity-50"
                    >
                        {markingAllRead ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <CheckCheck className="h-3 w-3" />
                        )}
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-sm text-slate-500">No notifications yet</p>
                        <p className="mt-1 text-xs text-slate-400">We'll notify you when something arrives!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClick={() => handleNotificationClick(notification)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="border-t border-slate-100 px-4 py-2 text-center">
                    <button
                        onClick={() => {
                            router.push('/notifications');
                            onClose();
                        }}
                        className="text-xs font-medium text-primary hover:text-emerald-700"
                    >
                        View All Notifications
                    </button>
                </div>
            )}
        </div>
    );
}
