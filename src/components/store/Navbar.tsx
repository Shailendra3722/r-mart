"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, User, ChevronDown, ShieldCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
    const { itemCount } = useStore();
    const { user, isAuthenticated, logout, verifyEmail } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

                {/* Logo & Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden p-1 text-slate-600 focus:outline-none"
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
                    <form onSubmit={handleSearch} className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-md border-0 bg-slate-100 py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            placeholder="Search for products, brands and more"
                        />
                    </form>
                </div>

                {/* Right Actions (Desktop) */}
                <div className="hidden lg:flex items-center gap-6">
                    {/* User Login/Profile */}
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white pl-2 pr-4 py-1 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                <img
                                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.mobile || user?.name || 'User')}&background=0D8ABC&color=fff`}
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full bg-slate-100"
                                />
                                <span className="text-sm font-semibold text-slate-700 block flex flex-col items-start leading-tight">
                                    <span>{user?.name || 'Account'}</span>
                                    {user?.emailVerified ? (
                                        <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
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
                                    <div className="absolute right-0 top-full z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-sm font-medium text-slate-900">{user?.name || 'R Mart Customer'}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.mobile || user?.email}</p>
                                        </div>
                                        <Link
                                            href="/orders"
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className="rounded bg-white px-8 py-1.5 text-sm font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600 border border-slate-200">
                                Login
                            </button>
                        </Link>
                    )}

                    <Link href="/orders" className="font-semibold text-slate-900 hover:text-emerald-600">
                        Orders
                    </Link>

                    <Link href="/cart" className="flex items-center gap-2 font-semibold text-slate-900">
                        <div className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border border-white">
                                    {itemCount}
                                </span>
                            )}
                        </div>
                        <span>Cart</span>
                    </Link>
                </div>

                {/* Mobile Cart Icon (Always Visible) */}
                <div className="flex lg:hidden items-center gap-4">
                    <Link href="/cart" className="relative p-2 text-slate-900">
                        <ShoppingBag className="h-6 w-6" />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Menu & Search - Visible when open or on small screens */}
            <div className={`lg:hidden border-t border-slate-100 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="p-4 space-y-4">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search for products..."
                        />
                    </form>

                    {/* Mobile Navigation Links */}
                    <nav className="flex flex-col space-y-2">
                        {isAuthenticated ? (
                            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50">
                                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
                                    <img
                                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.mobile || user?.name || 'User')}&background=0D8ABC&color=fff`}
                                        alt="Profile"
                                        className="h-10 w-10 rounded-full bg-white"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{user?.name || 'Account'}</p>
                                        <p className="text-xs text-slate-500">{user?.email || user?.mobile}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-2 text-sm font-medium text-slate-700 hover:text-primary"
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-2 text-sm font-medium text-red-600 hover:text-red-700"
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

                        <div className="h-px bg-slate-100 my-2"></div>

                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700">
                            Home
                        </Link>
                        <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700">
                            All Products
                        </Link>
                        <Link href="/products?category=Men" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700">
                            Men's Fashion
                        </Link>
                        <Link href="/products?category=Women" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700">
                            Women's Fashion
                        </Link>
                        <Link href="/products?category=Kids" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700">
                            Kids Collection
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
