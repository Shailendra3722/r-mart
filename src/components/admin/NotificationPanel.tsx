"use client";

import { useStore, type Notification } from '@/context/StoreContext';
import { NotificationItem } from './NotificationItem';
import { CheckCheck } from 'lucide-react';

interface NotificationPanelProps {
    onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
    const { notifications, markAllNotificationsAsRead } = useStore();

    const handleMarkAllRead = async () => {
        await markAllNotificationsAsRead();
    };

    return (
        <div className="absolute right-0 top-12 z-50 w-96 max-h-[500px] overflow-hidden rounded-lg bg-white shadow-xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                {notifications.filter(n => !n.isRead).length > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[420px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-2 rounded-full bg-slate-100 p-3">
                            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-900">No notifications</p>
                        <p className="mt-1 text-xs text-slate-500">
                            You're all caught up!
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.slice(0, 10).map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClose={onClose}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 10 && (
                <div className="border-t border-slate-200 px-4 py-2 bg-slate-50">
                    <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
}
