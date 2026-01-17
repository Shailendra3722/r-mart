"use client";

import { useStore } from "@/context/StoreContext";
import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function CustomersPage() {
    const { orders } = useStore();
    const [searchTerm, setSearchTerm] = useState("");

    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Customers and Merge with Orders
    useEffect(() => {
        const fetchCustomers = async () => {
            setIsLoading(true);
            const customersMap = new Map();

            try {
                // 1. Fetch Registered Users from MongoDB
                const res = await fetch('/api/users');
                if (res.ok) {
                    const registeredUsers = await res.json();
                    registeredUsers.forEach((user: any) => {
                        // Use mobile or email as unique key (prefer mobile if available)
                        // Note: MongoDB User model has `uid`, `email`, `mobile`
                        const key = user.mobile || user.email || user.uid;
                        if (key) {
                            customersMap.set(key, {
                                id: user.uid, // Firebase UID
                                name: user.name || 'Unknown',
                                mobile: user.mobile || '-',
                                email: user.email || '-',
                                totalOrders: 0,
                                totalSpent: 0,
                                joinedAt: user.createdAt || new Date().toISOString(),
                                lastOrderDate: null,
                                avatar: user.photoURL
                            });
                        }
                    });
                }
            } catch (error) {
                console.error("Failed to fetch registered users:", error);
            }

            // 2. Merge with Order Data (from StoreContext which is already fetched from API)
            orders.forEach((order) => {
                // Try to find customer by mobile first, then by matching user ID if we stored it
                // Ideally orders should store userId, but for now matching by mobile is the legacy way we used
                // Better approach: Check if we have userId in order? Yes `userId` field added to order schema

                let key = order.customerMobile;
                // If order has userId and it's not 'guest', try to find by that too? 
                // For simplicity, let's Stick to Mobile as the primary key for "Guest + Registered" unification for now

                if (!customersMap.has(key)) {
                    // New customer from order (wasn't registered or different mobile)
                    customersMap.set(key, {
                        id: `guest-${key}`,
                        name: order.customerName,
                        mobile: order.customerMobile,
                        email: '-',
                        totalOrders: 0,
                        totalSpent: 0,
                        joinedAt: order.date,
                        lastOrderDate: null,
                        avatar: null
                    });
                }

                const customer = customersMap.get(key);
                if (customer) {
                    customer.totalOrders += 1;
                    customer.totalSpent += order.total;

                    // Update last order date
                    if (!customer.lastOrderDate || new Date(order.date) > new Date(customer.lastOrderDate)) {
                        customer.lastOrderDate = order.date;
                    }
                }
            });

            setCustomers(Array.from(customersMap.values()));
            setIsLoading(false);
        };

        fetchCustomers();
    }, [orders]);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Customers</h1>

            <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search customers by name or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border-0 py-2 pl-10 pr-4 text-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Mobile</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Total Orders</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Total Spent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Last Order</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                                        <p>Loading customers...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 flex-shrink-0">
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src={customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random`}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{customer.name}</div>
                                                <div className="text-xs text-slate-500">{customer.email !== '-' ? customer.email : ''}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{customer.mobile}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{customer.totalOrders}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-green-600">₹{customer.totalSpent.toLocaleString()}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                        {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : <span className="text-slate-400 italic">No orders</span>}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No customers found. Place some orders first!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
