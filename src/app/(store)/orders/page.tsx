"use client";

import { useStore } from "@/context/StoreContext";
import { Package, Truck, Check, X, Clock } from "lucide-react";
import Link from "next/link";

export default function UserOrdersPage() {
    const { orders } = useStore();

    if (orders.length === 0) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-6">
                    <Package className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">No Orders Yet</h2>
                <p className="mt-2 text-slate-500">You haven't placed any orders yet.</p>
                <Link href="/products" className="mt-6 rounded-md bg-primary px-6 py-2.5 font-medium text-white hover:bg-emerald-700">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-2xl font-bold text-slate-900">Your Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4 sm:px-6">
                            <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Order Placed</p>
                                    <p className="text-sm font-medium text-slate-900">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Total</p>
                                    <p className="text-sm font-medium text-slate-900">₹{order.total}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Order ID</p>
                                    <p className="text-sm font-medium text-slate-900">#{order.id.replace(/^ORD-/, '')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {order.status === 'Delivered' && <Check className="h-5 w-5 text-green-600" />}
                                {order.status === 'Cancelled' && <X className="h-5 w-5 text-red-600" />}
                                {order.status === 'Pending' && <Clock className="h-5 w-5 text-orange-600" />}
                                {order.status === 'Shipped' && <Truck className="h-5 w-5 text-blue-600" />}
                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-orange-100 text-orange-800'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 sm:px-6">
                            <ul className="divide-y divide-slate-100">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="flex py-4">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover object-center"
                                                onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                                            />
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm font-medium text-slate-900">
                                                        <Link href={`/products/${item.id}`} className="hover:underline">{item.name}</Link>
                                                    </h3>
                                                    <p className="text-sm font-medium text-slate-900">₹{item.price}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
                                                <p className="text-sm text-slate-500">{item.selectedSize} / {item.selectedColor}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
