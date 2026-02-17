"use client";

import { Package, CreditCard, Truck, User, ShoppingBag, Bell } from 'lucide-react';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    imageUrl?: string;
}

interface NotificationItemProps {
    notification: Notification;
    onClick: () => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <Package className="h-5 w-5 text-blue-600" />;
            case 'payment':
                return <CreditCard className="h-5 w-5 text-green-600" />;
            case 'delivery':
                return <Truck className="h-5 w-5 text-purple-600" />;
            case 'account':
                return <User className="h-5 w-5 text-slate-600" />;
            case 'product':
                return <ShoppingBag className="h-5 w-5 text-pink-600" />;
            default:
                return <Bell className="h-5 w-5 text-slate-400" />;
        }
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    };

    return (
        <button
            onClick={onClick}
            className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 ${!notification.read ? 'bg-blue-50/50' : ''
                }`}
        >
            <div className="flex gap-3">
                {/* Icon or Image */}
                <div className="flex-shrink-0 mt-0.5">
                    {notification.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={notification.imageUrl}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                            {getIcon(notification.type)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                            {notification.title}
                        </p>
                        {!notification.read && (
                            <span className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-600 mt-1" />
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
