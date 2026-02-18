"use client";

import { use } from 'react';
import { useStore } from '@/context/StoreContext';
import { Package, Truck, Check, Clock, MapPin, CreditCard, ArrowLeft, Phone, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const statusSteps = [
    { key: 'Pending', label: 'Order Placed', icon: Package, desc: 'Your order has been placed successfully' },
    { key: 'Processing', label: 'Confirmed', icon: Check, desc: 'Seller has confirmed your order' },
    { key: 'Shipped', label: 'Shipped', icon: Truck, desc: 'Your order is on the way' },
    { key: 'Delivered', label: 'Delivered', icon: Check, desc: 'Order delivered to your address' },
];

function getStepIndex(status: string) {
    if (status === 'Cancelled') return -1;
    const idx = statusSteps.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const { orders } = useStore();
    const resolvedParams = use(params);
    const order = orders.find(o => o.id === resolvedParams.id);

    if (!order) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
                <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">This order doesn&apos;t exist or has been removed.</p>
                <Link href="/orders" className="mt-6 rounded-xl bg-primary px-6 py-2.5 font-medium text-white hover:bg-emerald-700">
                    View All Orders
                </Link>
            </div>
        );
    }

    const currentStep = getStepIndex(order.status);
    const isCancelled = order.status === 'Cancelled';
    const orderDate = new Date(order.date);
    const estimatedDelivery = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-3xl">
            <Link href="/orders" className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Link>

            {/* Order Header */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 mb-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Order #{order.id.replace(/^ORD-/, '')}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Placed on {orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{order.total}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">{order.paymentMethod}</span>
                            <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${order.paymentStatus === 'Paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 mb-6">
                <h2 className="font-bold text-slate-900 dark:text-white mb-1">Order Status</h2>
                {!isCancelled && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Estimated delivery by {estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                    </p>
                )}

                {isCancelled ? (
                    <div className="flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                        <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-2">
                            <Package className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="font-semibold text-red-700 dark:text-red-400">Order Cancelled</p>
                            <p className="text-sm text-red-600/70 dark:text-red-400/70">This order has been cancelled. Refund will be processed within 5-7 business days.</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        {statusSteps.map((step, index) => {
                            const isCompleted = index <= currentStep;
                            const isCurrent = index === currentStep;
                            const StepIcon = step.icon;

                            return (
                                <div key={step.key} className="flex gap-4">
                                    {/* Line + Circle */}
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.15, type: 'spring', stiffness: 300 }}
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${isCompleted
                                                ? 'bg-primary border-primary text-white'
                                                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
                                                } ${isCurrent ? 'ring-4 ring-primary/20 dark:ring-primary/30' : ''}`}
                                        >
                                            <StepIcon className="h-5 w-5" />
                                        </motion.div>
                                        {index < statusSteps.length - 1 && (
                                            <div className={`w-0.5 flex-1 min-h-[40px] ${index < currentStep ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="pb-8">
                                        <motion.p
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.15 + 0.1 }}
                                            className={`font-semibold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
                                        >
                                            {step.label}
                                        </motion.p>
                                        <p className={`text-sm ${isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>
                                            {step.desc}
                                        </p>
                                        {isCurrent && isCompleted && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-1 inline-block text-xs font-semibold text-primary"
                                            >
                                                Current Status
                                            </motion.span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Tracking Info */}
                {order.trackingId && (
                    <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">📦 Tracking Details</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-blue-600/70 dark:text-blue-400/70">Courier:</span>
                                <span className="ml-1 font-medium text-blue-800 dark:text-blue-300">{order.courier}</span>
                            </div>
                            <div>
                                <span className="text-blue-600/70 dark:text-blue-400/70">Tracking ID:</span>
                                <span className="ml-1 font-medium text-blue-800 dark:text-blue-300">{order.trackingId}</span>
                            </div>
                            {order.awbNumber && (
                                <div>
                                    <span className="text-blue-600/70 dark:text-blue-400/70">AWB:</span>
                                    <span className="ml-1 font-medium text-blue-800 dark:text-blue-300">{order.awbNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Order Items */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 mb-6">
                <h2 className="font-bold text-slate-900 dark:text-white mb-4">Items ({order.items.length})</h2>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 py-3">
                            <div className="h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">₹{item.price * item.quantity}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                    <h2 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> Delivery Address
                    </h2>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{order.shippingAddress.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{order.shippingAddress.address}</p>
                    {order.shippingAddress.landmark && <p className="text-sm text-slate-500 dark:text-slate-400">{order.shippingAddress.landmark}</p>}
                    <p className="text-sm text-slate-500 dark:text-slate-400">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {order.shippingAddress.mobile}
                    </p>
                </div>
            )}
        </div>
    );
}
