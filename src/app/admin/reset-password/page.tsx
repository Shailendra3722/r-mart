"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Key, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email');

    const [email, setEmail] = useState(emailParam || '');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password length
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/admin/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, resetCode, newPassword }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push('/admin/login');
                }, 2000);
            } else {
                setError(data.error || 'Failed to reset password');
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
                    <Key className="h-6 w-6" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                    Enter Reset Code
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Check your server console for the 6-digit code
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow-xl sm:rounded-lg sm:px-10">
                    {success ? (
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-slate-900">Password Reset Successfully!</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                You can now login with your new password.
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Redirecting to login...
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
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        placeholder="admin@rmart.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="resetCode" className="block text-sm font-medium text-slate-700">
                                    Reset Code
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="resetCode"
                                        name="resetCode"
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={resetCode}
                                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                                        className="block w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm text-center text-2xl font-mono tracking-widest"
                                        placeholder="000000"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    Enter the 6-digit code from server console
                                </p>
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                                    New Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                                    Confirm New Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
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
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-slate-500">
                                    Didn't receive a code?{' '}
                                    <Link href="/admin/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Request new code
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
