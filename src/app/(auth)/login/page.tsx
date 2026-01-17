"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Loader2, Lock, ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const { loginWithGoogle, loginWithEmail } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        const result = await loginWithEmail(email, password);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.error || 'Login failed');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const success = await loginWithGoogle();
            if (success) {
                router.push('/');
            } else {
                setError('Google login failed.');
                setIsLoading(false);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold italic text-slate-900">R Mart</span>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Login directly with your email to start shopping.
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="relative block w-full rounded-lg border-0 bg-slate-50 py-3 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                                        placeholder="Email address"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="relative block w-full rounded-lg border-0 bg-slate-50 py-3 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                                        placeholder="Password"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 text-center animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative flex w-full justify-center rounded-lg bg-slate-900 px-3 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-70 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        type="button"
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                    >
                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M12.0003 20.45c4.656 0 8.568-3.235 9.684-7.59h-2.14c-.958 3.23-3.953 5.59-7.544 5.59-4.4 0-7.98-3.58-7.98-7.98 0-4.4 3.58-7.98 7.98-7.98 3.633 0 6.647 2.413 7.575 5.698h2.152c-1.127-4.38-5.05-7.698-9.727-7.698-5.522 0-10 4.478-10 10s4.478 10 10 10z"
                                fill="#EA4335"
                            />
                            <path
                                d="M20.484 12c0-.662-.06-1.306-.166-1.928H12v3.744h4.86c-.19 1.157-.866 2.15-1.802 2.822v2.24h2.82c1.65-1.52 2.606-3.76 2.606-6.878z"
                                fill="#4285F4"
                            />
                            <path
                                d="M5.98 14.54c-.26-.78-.4-1.61-.4-2.46s.14-1.68.4-2.46l-2.6-2.02c-.88 1.76-1.38 3.75-1.38 5.86s.5 4.1 1.38 5.86l2.6-2.02z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.02c2.22 0 4.24.78 5.82 2.06l2.84-2.84C18.66 2.42 15.54 1.3 12 1.3 7.32 1.3 3.4 3.98 1.48 7.6l2.6 2.02c.96-2.86 3.66-4.6 6.92-4.6z"
                                fill="#34A853"
                            />
                        </svg>
                        Google
                    </button>

                    <p className="text-center text-sm text-slate-600">
                        New to R Mart?{' '}
                        <Link href="/signup" className="font-semibold text-primary hover:text-emerald-700 transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
