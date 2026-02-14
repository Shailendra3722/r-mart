'use client';

import { useStore } from '@/context/StoreContext';
import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

export default function NotificationBell() {
    const { unreadUserNotificationCount, fetchUserNotifications } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleBellClick = async () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Fetch latest notifications when opening
            await fetchUserNotifications();
        }
    };

    return (
        <div className="relative" ref={bellRef}>
            <button
                onClick={handleBellClick}
                className="relative p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 group"
                aria-label="Notifications"
            >
                <Bell size={24} className="group-hover:scale-110 transition-transform duration-300" />
                {unreadUserNotificationCount > 0 && (
                    <>
                        {/* Animated pulsing ring */}
                        <span className="absolute top-1.5 right-1.5 inline-flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-75"></span>
                        </span>
                        {/* Premium gradient badge */}
                        <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold leading-none text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                            {unreadUserNotificationCount > 9 ? '9+' : unreadUserNotificationCount}
                        </span>
                    </>
                )}
            </button>

            {isOpen && <NotificationPanel onClose={() => setIsOpen(false)} />}
        </div>
    );
}
