"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, getDocs } from 'firebase/firestore';
import { Bell, CheckCheck, Loader2, Package, CreditCard, Truck, UserCheck, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

const typeIcons: Record<string, any> = {
    order: Package,
    payment: CreditCard,
    delivery: Truck,
    account: UserCheck,
    product: ShoppingBag,
};

function getTimeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

export default function NotificationsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingAllRead, setMarkingAllRead] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !user?.uid) {
            setLoading(false);
            return;
        }

        const notificationsRef = collection(db, 'notifications');
        const q = query(
            notificationsRef,
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
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
            setLoading(false);
        }, (error) => {
            console.error('Notification listener error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthenticated, user?.uid]);

    const handleMarkAsRead = async (notifId: string) => {
        try {
            const notifRef = doc(db, 'notifications', notifId);
            await updateDoc(notifRef, { read: true });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        if (!user?.uid) return;
        setMarkingAllRead(true);
        try {
            const notificationsRef = collection(db, 'notifications');
            const q = query(
                notificationsRef,
                where('userId', '==', user.uid),
                where('read', '==', false)
            );
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);
            snapshot.docs.forEach(d => {
                batch.update(d.ref, { read: true });
            });
            await batch.commit();
        } catch (error) {
            console.error('Error marking all as read:', error);
        } finally {
            setMarkingAllRead(false);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            await handleMarkAsRead(notification.id);
        }
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-6">
                    <Bell className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Sign In to View Notifications</h2>
                <p className="mt-2 text-slate-500">You need to be logged in to see your notifications.</p>
                <Link href="/login" className="mt-6 rounded-md bg-primary px-6 py-2.5 font-medium text-white hover:bg-emerald-700">
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-3xl">
            <div className="mb-6">
                <Link href="/" className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={markingAllRead}
                            className="flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                        >
                            {markingAllRead ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCheck className="h-4 w-4" />
                            )}
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-6">
                        <Bell className="h-12 w-12 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">No Notifications Yet</h2>
                    <p className="mt-2 text-sm text-slate-500">We&apos;ll notify you when something arrives!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification) => {
                        const IconComponent = typeIcons[notification.type] || Bell;
                        return (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex items-start gap-4 rounded-lg border p-4 transition-all cursor-pointer ${notification.read
                                        ? 'border-slate-100 bg-white hover:bg-slate-50'
                                        : 'border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50'
                                    }`}
                            >
                                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${notification.read ? 'bg-slate-100' : 'bg-emerald-100'
                                    }`}>
                                    <IconComponent className={`h-5 w-5 ${notification.read ? 'text-slate-500' : 'text-emerald-600'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className={`text-sm font-medium ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="flex-shrink-0 text-xs text-slate-400">
                                            {getTimeAgo(notification.createdAt)}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">{notification.message}</p>
                                    {notification.actionLabel && (
                                        <span className="mt-2 inline-block text-xs font-medium text-primary hover:text-emerald-700">
                                            {notification.actionLabel} →
                                        </span>
                                    )}
                                </div>
                                {!notification.read && (
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
