"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, MapPin, Settings, ShieldCheck, Mail, Phone, Edit3, Plus, Trash2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

type Address = {
    id: string;
    name: string;
    mobile: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
};

export default function AccountPage() {
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'settings'>('profile');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
        name: '', mobile: '', address: '', landmark: '', city: '', state: '', pincode: ''
    });

    useEffect(() => {
        const saved = localStorage.getItem('rmart-addresses');
        if (saved) setAddresses(JSON.parse(saved));
    }, []);

    const saveAddresses = (updated: Address[]) => {
        setAddresses(updated);
        localStorage.setItem('rmart-addresses', JSON.stringify(updated));
    };

    const handleAddAddress = () => {
        const addr: Address = {
            ...newAddress,
            id: Math.random().toString(36).substr(2, 9),
            isDefault: addresses.length === 0
        };
        saveAddresses([...addresses, addr]);
        setShowAddForm(false);
        setNewAddress({ name: '', mobile: '', address: '', landmark: '', city: '', state: '', pincode: '' });
    };

    const handleDeleteAddress = (id: string) => {
        saveAddresses(addresses.filter(a => a.id !== id));
    };

    const handleSetDefault = (id: string) => {
        saveAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 rounded-full bg-slate-100 dark:bg-slate-800 p-6">
                    <User className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Login Required</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Please login to view your account</p>
                <Link href="/login" className="mt-6 rounded-xl bg-primary px-8 py-3 font-bold text-white hover:bg-emerald-700 transition-colors">
                    Login Now
                </Link>
            </div>
        );
    }

    const tabs = [
        { id: 'profile' as const, label: 'Profile', icon: User },
        { id: 'addresses' as const, label: 'Addresses', icon: MapPin },
        { id: 'settings' as const, label: 'Settings', icon: Settings },
    ];

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Account</h1>

            {/* Tabs */}
            <div className="flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                            <img
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=059669&color=fff&size=80`}
                                alt="Avatar"
                                className="h-16 w-16 rounded-full ring-4 ring-emerald-50 dark:ring-emerald-900/30"
                            />
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || 'R Mart Customer'}</h2>
                                {user?.emailVerified && (
                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Verified Account
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                                    <Mail className="h-3.5 w-3.5" /> Email
                                </div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.email || 'Not set'}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                                    <Phone className="h-3.5 w-3.5" /> Phone
                                </div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.mobile || user?.phoneNumber || 'Not set'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <Link href="/orders" className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:border-primary dark:hover:border-primary transition-colors text-center">
                            <span className="text-2xl">📦</span>
                            <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">My Orders</p>
                        </Link>
                        <Link href="/wishlist" className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:border-primary dark:hover:border-primary transition-colors text-center">
                            <span className="text-2xl">❤️</span>
                            <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Wishlist</p>
                        </Link>
                        <Link href="/notifications" className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:border-primary dark:hover:border-primary transition-colors text-center">
                            <span className="text-2xl">🔔</span>
                            <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Notifications</p>
                        </Link>
                    </div>
                </motion.div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {addresses.map(addr => (
                        <div key={addr.id} className={`rounded-xl border bg-white dark:bg-slate-800 p-4 ${addr.isDefault ? 'border-primary ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-700'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-slate-900 dark:text-white">{addr.name}</p>
                                        {addr.isDefault && <span className="text-[10px] font-bold text-primary bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">DEFAULT</span>}
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{addr.address}</p>
                                    {addr.landmark && <p className="text-sm text-slate-500 dark:text-slate-400">{addr.landmark}</p>}
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{addr.city}, {addr.state} - {addr.pincode}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">📱 {addr.mobile}</p>
                                </div>
                                <div className="flex gap-2">
                                    {!addr.isDefault && (
                                        <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-primary hover:underline">Set Default</button>
                                    )}
                                    <button onClick={() => handleDeleteAddress(addr.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {showAddForm ? (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Add New Address</h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input value={newAddress.name} onChange={e => setNewAddress(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                                <input value={newAddress.mobile} onChange={e => setNewAddress(p => ({ ...p, mobile: e.target.value }))} placeholder="Phone Number" className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                                <input value={newAddress.address} onChange={e => setNewAddress(p => ({ ...p, address: e.target.value }))} placeholder="Address" className="sm:col-span-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                                <input value={newAddress.landmark} onChange={e => setNewAddress(p => ({ ...p, landmark: e.target.value }))} placeholder="Landmark (Optional)" className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                                <input value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} placeholder="City" className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                                <input value={newAddress.state} onChange={e => setNewAddress(p => ({ ...p, state: e.target.value }))} placeholder="State" className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                                <input value={newAddress.pincode} onChange={e => setNewAddress(p => ({ ...p, pincode: e.target.value }))} placeholder="Pincode" className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button onClick={handleAddAddress} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-colors">
                                    <Save className="h-4 w-4" /> Save Address
                                </button>
                                <button onClick={() => setShowAddForm(false)} className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors"
                        >
                            <Plus className="h-4 w-4" /> Add New Address
                        </button>
                    )}
                </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Notification Preferences</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Order Updates', desc: 'Get notified about order status changes' },
                                { label: 'Promotional Offers', desc: 'Receive deals and discount notifications' },
                                { label: 'Product Alerts', desc: 'Back in stock and price drop alerts' },
                            ].map((item, i) => (
                                <label key={i} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
                                </label>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
