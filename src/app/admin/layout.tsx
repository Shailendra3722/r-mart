"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from "@/components/admin/Header";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAdminAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true); // Internal local check just in case

    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (loading) return; // Wait for auth check to finish
        if (isLoginPage) return;

        if (!isAdminAuthenticated) {
            router.push('/admin/login');
        }
    }, [isAdminAuthenticated, loading, router, isLoginPage]);

    // If it's the login page, render children without Sidebar/Header
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-2 text-sm text-slate-500">Verifying Admin Access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
