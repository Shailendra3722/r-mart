"use client";

import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Package, User, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    type: 'order' | 'product' | 'user' | 'system';
    title: string;
    message: string;
    relatedId?: string;
    relatedType?: 'order' | 'product' | 'user';
    isRead: boolean;
    createdAt: string | Date;
}

interface NotificationItemProps {
    notification: Notification;
    onClose: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
    const router = useRouter();
    const { markNotificationAsRead } = useStore();

    const getIcon = () => {
        switch (notification.type) {
            case 'order':
                return <ShoppingBag className="h-5 w-5 text-blue-600" />;
            case 'product':
                return <Package className="h-5 w-5 text-purple-600" />;
            case 'user':
                return <User className="h-5 w-5 text-green-600" />;
            case 'system':
            default:
                return <Bell className="h-5 w-5 text-slate-600" />;
        }
    };

    const getRelativeTime = (date: string | Date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now.getTime() - notifDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notifDate.toLocaleDateString();
    };

    const handleClick = async () => {
        // Mark as read
        if (!notification.isRead) {
            await markNotificationAsRead(notification.id);
        }

        // Navigate to related item
        if (notification.relatedType === 'order') {
            router.push('/admin/orders');
        } else if (notification.relatedType === 'product') {
            router.push('/admin/products');
        }

        onClose();
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 ${!notification.isRead ? 'bg-blue-50/50' : ''
                }`}
        >
            <div className="flex gap-3">
                <div className={`mt-0.5 flex-shrink-0 rounded-full p-2 ${notification.type === 'order' ? 'bg-blue-100' :
                        notification.type === 'product' ? 'bg-purple-100' :
                            notification.type === 'user' ? 'bg-green-100' : 'bg-slate-100'
                    }`}>
                    {getIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {notification.title}
                        </p>
                        {!notification.isRead && (
                            <span className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-600 mt-1.5"></span>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600 line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        {getRelativeTime(notification.createdAt)}
                    </p>
                </div>
            </div>
        </button>
    );
}
