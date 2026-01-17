"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Loader2, ArrowRight, User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
    const { signupWithEmail } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) return setError('Please enter your name');
        if (!formData.email.trim()) return setError('Please enter your email');
        if (formData.password.length < 6) return setError('Password must be at least 6 characters');

        setIsLoading(true);
        const result = await signupWithEmail(formData.email, formData.password, formData.name);
        setIsLoading(false);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.error || 'Signup failed. Please try again.');
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
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Join us and experience the best shopping.
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="sr-only">Full Name</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="relative block w-full rounded-lg border-0 bg-slate-50 py-3 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>
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
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="relative block w-full rounded-lg border-0 bg-slate-50 py-3 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                                        placeholder="Password (min 6 chars)"
                                        minLength={6}
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
                                className="group relative flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-3 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign up
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
