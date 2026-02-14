'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag, CreditCard, Truck, User, Tag, Bell, Sparkles, ArrowRight } from 'lucide-react';
import { type Notification } from '@/context/StoreContext';

interface NotificationItemProps {
    notification: Notification;
    onRead: () => void;
}

export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
    const router = useRouter();

    // Get icon and gradient based on notification type
    const getIconConfig = () => {
        switch (notification.type) {
            case 'order':
                return {
                    icon: <ShoppingBag size={20} />,
                    gradient: 'from-blue-500 to-cyan-500',
                    bg: 'from-blue-50 to-cyan-50',
                    glow: 'group-hover:shadow-blue-200'
                };
            case 'payment':
                return {
                    icon: <CreditCard size={20} />,
                    gradient: 'from-emerald-500 to-teal-500',
                    bg: 'from-emerald-50 to-teal-50',
                    glow: 'group-hover:shadow-emerald-200'
                };
            case 'delivery':
                return {
                    icon: <Truck size={20} />,
                    gradient: 'from-purple-500 to-pink-500',
                    bg: 'from-purple-50 to-pink-50',
                    glow: 'group-hover:shadow-purple-200'
                };
            case 'account':
                return {
                    icon: <User size={20} />,
                    gradient: 'from-orange-500 to-red-500',
                    bg: 'from-orange-50 to-red-50',
                    glow: 'group-hover:shadow-orange-200'
                };
            case 'product':
                return {
                    icon: <Tag size={20} />,
                    gradient: 'from-pink-500 to-rose-500',
                    bg: 'from-pink-50 to-rose-50',
                    glow: 'group-hover:shadow-pink-200'
                };
            default:
                return {
                    icon: <Bell size={20} />,
                    gradient: 'from-gray-500 to-slate-500',
                    bg: 'from-gray-50 to-slate-50',
                    glow: 'group-hover:shadow-gray-200'
                };
        }
    };

    // Format timestamp to relative time
    const getRelativeTime = (date: string | Date) => {
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

    const iconConfig = getIconConfig();

    return (
        <div
            onClick={handleClick}
            className={`group relative px-5 py-4 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r ${iconConfig.bg} ${!notification.isRead ? 'bg-gradient-to-r from-indigo-50/30 to-purple-50/30' : ''
                }`}
        >
            {/* Unread Indicator Bar */}
            {!notification.isRead && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${iconConfig.gradient}`}></div>
            )}

            <div className="flex gap-4">
                {/* Icon or Image with Gradient Border */}
                <div className="relative flex-shrink-0">
                    {notification.imageUrl ? (
                        <div className={`w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-br ${iconConfig.gradient} shadow-md ${iconConfig.glow} transition-shadow duration-300`}>
                            <img
                                src={notification.imageUrl}
                                alt=""
                                className="w-full h-full object-cover rounded-[14px]"
                            />
                        </div>
                    ) : (
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${iconConfig.gradient} flex items-center justify-center shadow-md ${iconConfig.glow} transition-shadow duration-300 group-hover:scale-110 transform`}>
                            <div className="text-white">
                                {iconConfig.icon}
                            </div>
                        </div>
                    )}

                    {/* Sparkle effect for unread */}
                    {!notification.isRead && (
                        <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse">
                            <Sparkles size={10} className="text-white" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm leading-tight ${!notification.isRead
                            ? 'font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent'
                            : 'font-semibold text-gray-800'
                            }`}>
                            {notification.title}
                        </h4>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                        {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            {getRelativeTime(notification.createdAt)}
                        </span>

                        {notification.actionLabel && (
                            <span className={`inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r ${iconConfig.gradient} bg-clip-text text-transparent group-hover:gap-2 transition-all duration-300`}>
                                {notification.actionLabel}
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" style={{ color: 'currentColor', opacity: 0.8 }} />
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${iconConfig.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg`}></div>
        </div>
    );
}
