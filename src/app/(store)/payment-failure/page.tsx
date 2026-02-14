"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailurePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const error = searchParams.get('error') || 'Payment processing failed';

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Failure Icon */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="text-white" size={48} />
                </div>

                {/* Failure Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Payment Failed
                </h1>
                <p className="text-gray-600 mb-6">
                    We couldn't process your payment. Please try again or use a different payment method.
                </p>

                {/* Error Details */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-700 mb-1">Error</p>
                        <p className="text-sm font-medium text-red-900">{error}</p>
                    </div>
                )}

                {/* Common Issues */}
                <div className="mb-8 text-left bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Common Issues</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Insufficient funds in account</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Card limit exceeded</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Incorrect card details or OTP</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Payment gateway timeout</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {orderId && (
                        <button
                            onClick={() => router.push(`/checkout?retry=${orderId}`)}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            <RefreshCcw size={18} />
                            Try Again
                        </button>
                    )}
                    <Link
                        href="/cart"
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Cart
                    </Link>
                    <Link
                        href="/"
                        className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Support Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Need help? Contact our support team at{' '}
                        <a href="mailto:support@rmart.com" className="text-indigo-600 hover:underline">
                            support@rmart.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
