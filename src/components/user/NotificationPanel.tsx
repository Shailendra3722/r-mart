'use client';

import { useStore } from '@/context/StoreContext';
import NotificationItem from './NotificationItem';

interface NotificationPanelProps {
    onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
    const { userNotifications, markUserNotificationAsRead, markAllUserNotificationsAsRead } = useStore();

    const handleMarkAllRead = async () => {
        await markAllUserNotificationsAsRead();
    };

    return (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                {userNotifications.some(n => !n.isRead) && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notification List */}
            <div className="max-h-[500px] overflow-y-auto">
                {userNotifications.length === 0 ? (
                    <div className="px-4 py-12 text-center text-gray-500">
                        <p className="text-lg mb-2">🔔 No notifications</p>
                        <p className="text-sm">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {userNotifications.slice(0, 10).map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={() => {
                                    markUserNotificationAsRead(notification.id);
                                    if (notification.actionUrl) {
                                        onClose();
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {userNotifications.length > 10 && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-center">
                    <a
                        href="/notifications"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        onClick={onClose}
                    >
                        View all notifications
                    </a>
                </div>
            )}
        </div>
    );
}
