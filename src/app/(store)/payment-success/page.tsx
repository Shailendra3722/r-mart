"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // Confetti effect or celebration animation can be added here
        console.log('Payment successful for order:', orderId);
    }, [orderId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Success Icon */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle className="text-white" size={48} />
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                </p>

                {/* Order ID */}
                {orderId && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-green-700 mb-1">Order ID</p>
                        <p className="text-lg font-mono font-bold text-green-900">{orderId}</p>
                    </div>
                )}

                {/* Order Details */}
                <div className="mb-8 text-left bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Package size={18} className="text-indigo-600" />
                        Next Steps
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Payment received and verified</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Order confirmation sent to your email</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-0.5">⏳</span>
                            <span>Your order will be dispatched within 24 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5">○</span>
                            <span>Track your order from "My Orders" page</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link
                        href={`/orders`}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        View Order Details
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
