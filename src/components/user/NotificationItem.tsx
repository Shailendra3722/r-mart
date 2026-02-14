'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag, CreditCard, Truck, User, Package, Bell, Tag } from 'lucide-react';

interface Notification {
    id: string;
    type: 'order' | 'payment' | 'delivery' | 'account' | 'product' | 'system';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    actionUrl?: string;
    actionLabel?: string;
    imageUrl?: string;
}

interface NotificationItemProps {
    notification: Notification;
    onRead: () => void;
}

export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
    const router = useRouter();

    // Get icon based on notification type
    const getIcon = () => {
        switch (notification.type) {
            case 'order':
                return <ShoppingBag className="text-blue-600" size={20} />;
            case 'payment':
                return <CreditCard className="text-green-600" size={20} />;
            case 'delivery':
                return <Truck className="text-purple-600" size={20} />;
            case 'account':
                return <User className="text-orange-600" size={20} />;
            case 'product':
                return <Tag className="text-pink-600" size={20} />;
            default:
                return <Bell className="text-gray-600" size={20} />;
        }
    };

    // Get background color based on type
    const getBgColor = () => {
        switch (notification.type) {
            case 'order':
                return 'bg-blue-50';
            case 'payment':
                return 'bg-green-50';
            case 'delivery':
                return 'bg-purple-50';
            case 'account':
                return 'bg-orange-50';
            case 'product':
                return 'bg-pink-50';
            default:
                return 'bg-gray-50';
        }
    };

    // Format timestamp to relative time
    const getRelativeTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) return new Date(date).toLocaleDateString();
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    const handleClick = () => {
        onRead();
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50/50' : ''
                }`}
        >
            <div className="flex gap-3">
                {/* Icon or Image */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getBgColor()} flex items-center justify-center`}>
                    {notification.imageUrl ? (
                        <img
                            src={notification.imageUrl}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        getIcon()
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                            {notification.title}
                        </p>
                        {!notification.isRead && (
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                            {getRelativeTime(notification.createdAt)}
                        </span>
                        {notification.actionLabel && (
                            <span className="text-xs text-blue-600 font-medium">
                                {notification.actionLabel} →
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
