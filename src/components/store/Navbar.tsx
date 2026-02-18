"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, User, ChevronDown, ShieldCheck, Heart, Sun, Moon } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/notifications/NotificationBell";
import { SearchSuggestions } from "@/components/store/SearchSuggestions";

export function Navbar() {
    const { itemCount, wishlist } = useStore();
    const { user, isAuthenticated, logout, verifyEmail } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800/50 transition-colors">
            <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

                {/* Logo & Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden p-1 text-slate-600 dark:text-slate-300 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <ChevronDown className="h-6 w-6 rotate-180 transition-transform" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        {/* Logo Icon */}
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold italic leading-none text-primary">R Mart</span>
                        </div>
                    </Link>
                </div>

                {/* Search Bar - Center (Desktop) */}
                <div className="hidden max-w-xl flex-1 sm:block">
                    <SearchSuggestions />
                </div>

                {/* Right Actions (Desktop) */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* User Login/Profile */}
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-2 pr-4 py-1 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                <img
                                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.mobile || user?.name || 'User')}&background=0D8ABC&color=fff`}
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700"
                                />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 block flex flex-col items-start leading-tight">
                                    <span>{user?.name || 'Account'}</span>
                                    {user?.emailVerified ? (
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                            <ShieldCheck className="w-3 h-3" />
                                            Verified
                                        </span>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                verifyEmail();
                                            }}
                                            className="text-[10px] text-amber-600 flex items-center gap-0.5 hover:text-amber-800 hover:underline"
                                        >
                                            <ShieldCheck className="w-3 h-3" />
                                            Verify Email
                                        </button>
                                    )}
                                </span>
                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full z-20 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-slate-700 focus:outline-none">
                                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || 'R Mart Customer'}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.mobile || user?.email}</p>
                                        </div>
                                        <Link
                                            href="/account"
                                            className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            My Account
                                        </Link>
                                        <Link
                                            href="/orders"
                                            className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            My Orders
                                        </Link>
                                        <Link
                                            href="/wishlist"
                                            className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            My Wishlist
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className="rounded bg-white dark:bg-slate-800 px-8 py-1.5 text-sm font-bold text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 border border-slate-200 dark:border-slate-700">
                                Login
                            </button>
                        </Link>
                    )}

                    {/* Notification Bell */}
                    <NotificationBell />

                    {/* Wishlist */}
                    <Link href="/wishlist" className="relative p-1 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <Heart className="h-5 w-5" />
                        {wishlist.length > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border border-white dark:border-slate-900">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>

                    <Link href="/orders" className="font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400">
                        Orders
                    </Link>

                    <Link href="/cart" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                        <div className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border border-white dark:border-slate-900">
                                    {itemCount}
                                </span>
                            )}
                        </div>
                        <span>Cart</span>
                    </Link>
                </div>

                {/* Mobile Icons (Cart & User) */}
                <div className="flex lg:hidden items-center gap-2">
                    {/* Dark Mode Toggle - Mobile */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-600 dark:text-slate-300"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* User / Login Icon */}
                    <Link href={isAuthenticated ? "/account" : "/login"} className="p-2 text-slate-900 dark:text-white">
                        {isAuthenticated ? (
                            <img
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.mobile || user?.name || 'User')}&background=0D8ABC&color=fff`}
                                alt="Profile"
                                className="h-6 w-6 rounded-full"
                            />
                        ) : (
                            <User className="h-6 w-6" />
                        )}
                    </Link>

                    {/* Wishlist - Mobile */}
                    <Link href="/wishlist" className="relative p-2 text-slate-900 dark:text-white">
                        <Heart className="h-5 w-5" />
                        {wishlist.length > 0 && (
                            <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>

                    {/* Cart Icon */}
                    <Link href="/cart" className="relative p-2 text-slate-900 dark:text-white">
                        <ShoppingBag className="h-6 w-6" />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Menu & Search - Visible when open or on small screens */}
            <div className={`lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="p-4 space-y-4">
                    {/* Mobile Search */}
                    <SearchSuggestions />

                    {/* Mobile Navigation Links */}
                    <nav className="flex flex-col space-y-2">
                        {isAuthenticated ? (
                            <div className="border border-slate-100 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
                                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                                    <img
                                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.mobile || user?.name || 'User')}&background=0D8ABC&color=fff`}
                                        alt="Profile"
                                        className="h-10 w-10 rounded-full bg-white"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || 'Account'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || user?.mobile}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/account"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary"
                                >
                                    My Account
                                </Link>
                                <Link
                                    href="/orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary"
                                >
                                    My Orders
                                </Link>
                                <Link
                                    href="/wishlist"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary"
                                >
                                    My Wishlist ❤️
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                            >
                                Login / Sign Up
                            </Link>
                        )}

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            Home
                        </Link>
                        <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            All Products
                        </Link>
                        <Link href="/products?category=Men" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            Men&apos;s Fashion
                        </Link>
                        <Link href="/products?category=Women" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            Women&apos;s Fashion
                        </Link>
                        <Link href="/products?category=Kids" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            Kids Collection
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
