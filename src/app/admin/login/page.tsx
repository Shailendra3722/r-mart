"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const { loginAdmin } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await loginAdmin(email, password);
        if (success) {
            router.push('/admin'); // Redirect to admin dashboard
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-900">
                    <Lock className="h-6 w-6" />
                </Link>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                    Admin Portal Access
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow-xl sm:rounded-lg sm:px-10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link href="/admin/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </Link>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
