"use client";

import { Bell } from 'lucide-react';
import { useState } from 'react';
import { NotificationPanel } from './NotificationPanel';

interface NotificationBellProps {
    unreadCount: number;
    onOpen?: () => void;
}

export function NotificationBell({ unreadCount, onOpen }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && onOpen) {
            onOpen();
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className="relative p-1 text-slate-400 hover:text-slate-500 transition-colors"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <>
                        <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Panel */}
                    <NotificationPanel onClose={() => setIsOpen(false)} />
                </>
            )}
        </div>
    );
}
