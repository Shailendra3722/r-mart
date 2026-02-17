"use client";

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import NotificationDropdown from './NotificationDropdown';

interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    actionUrl?: string;
    actionLabel?: string;
    imageUrl?: string;
}

export default function NotificationBell() {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !user?.uid) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        //Set up real-time listener for notifications (limited to latest 10)
        const notificationsRef = collection(db, 'notifications');
        const q = query(
            notificationsRef,
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(10) // Limit to 10 most recent notifications
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    userId: data.userId,
                    type: data.type,
                    title: data.title,
                    message: data.message,
                    read: data.read || false,
                    createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                    actionUrl: data.actionUrl,
                    actionLabel: data.actionLabel,
                    imageUrl: data.imageUrl
                };
            });

            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.read).length);
            setLoading(false);
        }, (error) => {
            console.error('Notification listener error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthenticated, user?.uid]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-700 hover:text-primary transition-colors focus:outline-none"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <NotificationDropdown
                        notifications={notifications}
                        loading={loading}
                        onClose={() => setIsOpen(false)}
                        onRefresh={() => { }}
                    />
                </>
            )}
        </div>
    );
}
