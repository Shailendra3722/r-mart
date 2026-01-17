"use client";

import { useStore } from "@/context/StoreContext";
import { Download, Calendar } from "lucide-react";

export default function ReportsPage() {
    const { orders } = useStore();

    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
    const averageOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

    // Group by Payment Method
    const paymentMethodStats = orders.reduce((acc: any, order) => {
        acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Sales Reports</h1>
                <button className="flex items-center gap-2 rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Download className="h-4 w-4" />
                    Export CSV
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500">Gross Revenue</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">₹{totalSales.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500">Total Orders</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{orders.length}</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500">Avg. Order Value</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">₹{Math.round(averageOrderValue).toLocaleString()}</p>
                </div>
            </div>

            <div className="rounded-lg bg-white shadow-sm border border-slate-200">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h3 className="text-base font-semibold text-slate-900">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Order ID</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Payment</th>
                                <th className="px-6 py-3 font-medium">Amount</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {orders.length > 0 ? (
                                orders.slice(0, 10).map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-slate-900">{order.customerName}</td>
                                        <td className="px-6 py-4 text-slate-500">{order.paymentMethod}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">₹{order.total}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No transactions recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
