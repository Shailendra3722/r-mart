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
                className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
            >
                <Bell size={24} />
                {unreadUserNotificationCount > 0 && (
                    <>
                        {/* Pulsing dot indicator */}
                        <span className="absolute top-1 right-1 animate-ping inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                        {/* Static badge with count */}
                        <span className="absolute top-1 right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {unreadUserNotificationCount > 9 ? '9+' : unreadUserNotificationCount}
                        </span>
                    </>
                )}
            </button>

            {isOpen && <NotificationPanel onClose={() => setIsOpen(false)} />}
        </div>
    );
}
