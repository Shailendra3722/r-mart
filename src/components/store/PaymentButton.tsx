"use client";

import { useState } from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentButtonProps {
    amount: number;
    orderId: string;
    onSuccess: (paymentDetails: any) => void;
    onFailure: (error: string) => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentButton({ amount, orderId, onSuccess, onFailure }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Load Razorpay script
            const res = await loadRazorpayScript();
            if (!res) {
                throw new Error('Failed to load Razorpay');
            }

            // Create order on backend
            const response = await fetch('/api/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, orderId }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to create payment order');
            }

            // Setup Razorpay options
            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'R Mart',
                description: `Order #${orderId}`,
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        // Verify payment on backend
                        const verifyRes = await fetch('/api/payments/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                orderId,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            onSuccess(verifyData.order);
                        } else {
                            throw new Error(verifyData.error || 'Payment verification failed');
                        }
                    } catch (error: any) {
                        onFailure(error.message);
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#4F46E5', // Indigo-600
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        onFailure('Payment cancelled');
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error: any) {
            console.error('Payment error:', error);
            onFailure(error.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            <CreditCard size={20} />
            {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
        </button>
    );
}
