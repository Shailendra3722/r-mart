'use client';

import { useStore } from '@/context/StoreContext';
import NotificationItem from './NotificationItem';
import { Sparkles } from 'lucide-react';

interface NotificationPanelProps {
    onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
    const { userNotifications, markUserNotificationAsRead, markAllUserNotificationsAsRead } = useStore();

    const handleMarkAllRead = async () => {
        await markAllUserNotificationsAsRead();
    };

    return (
        <div className="absolute right-0 mt-3 w-[420px] z-50 animate-[slideDown_0.3s_ease-out]">
            {/* Glassmorphism Container */}
            <div className="backdrop-blur-2xl bg-white/95 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-white/20 overflow-hidden">
                {/* Premium Header with Gradient */}
                <div className="relative px-6 py-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-b border-white/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                <Sparkles className="text-white" size={18} />
                            </div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900 bg-clip-text text-transparent">
                                Notifications
                            </h3>
                        </div>
                        {userNotifications.some(n => !n.isRead) && (
                            <button
                                onClick={handleMarkAllRead}
                                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>

                {/* Notification List with Custom Scrollbar */}
                <div className="max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent hover:scrollbar-thumb-indigo-300">
                    {userNotifications.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                                <Sparkles className="text-indigo-600" size={32} />
                            </div>
                            <p className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
                                All Clear!
                            </p>
                            <p className="text-sm text-gray-500 font-medium">
                                You're all caught up — enjoy your day! ✨
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100/50">
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

                {/* Premium Footer */}
                {userNotifications.length > 10 && (
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-indigo-50/80 border-t border-white/50 backdrop-blur-sm">
                        <a
                            href="/notifications"
                            className="block text-center text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                            onClick={onClose}
                        >
                            View All Notifications →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

<style jsx global>{`
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb {
        background: #c7d2fe;
        border-radius: 10px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: #a5b4fc;
    }
`}</style>
