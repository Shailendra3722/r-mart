"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                // Redirect to reset page after 2 seconds
                setTimeout(() => {
                    router.push(`/admin/reset-password?email=${encodeURIComponent(email)}`);
                }, 2000);
            } else {
                setError(data.error || 'Failed to send reset code');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/admin/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
                    <ArrowLeft size={20} />
                    <span>Back to login</span>
                </Link>

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Mail className="h-6 w-6" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                    Reset Your Password
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Enter your email address and we'll generate a reset code
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow-xl sm:rounded-lg sm:px-10">
                    {success ? (
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-slate-900">Reset Code Sent!</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Check your server console for the 6-digit reset code.
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Redirecting to reset page...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        className="block w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        placeholder="admin@rmart.com"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Code'}
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-slate-500">
                                    Remember your password?{' '}
                                    <Link href="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
