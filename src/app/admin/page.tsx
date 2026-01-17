"use client";

import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { IndianRupee, ShoppingBag, Package, TrendingUp } from "lucide-react";
import { useStore } from "@/context/StoreContext";

// Define COLORS for the pie chart
const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

export default function AdminDashboard() {
    const { products, orders } = useStore();

    // Calculate Real Stats
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
    const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
    const totalProducts = products.length;

    // Calculate Category Distribution
    const categoryCount = products.reduce((acc: any, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});

    const categoryData = Object.keys(categoryCount).map(key => ({
        name: key,
        value: categoryCount[key]
    }));

    // Calculate Daily Sales (Last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const salesData = last7Days.map(date => {
        const dailyTotal = orders
            .filter(o => o.date.startsWith(date))
            .reduce((sum, order) => sum + order.total, 0);
        return { name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), sales: dailyTotal };
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-emerald-100 p-3">
                            <IndianRupee className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Sales</p>
                            <h3 className="text-2xl font-bold text-slate-900">₹{totalSales.toLocaleString()}</h3>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-3">
                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Active Orders</p>
                            <h3 className="text-2xl font-bold text-slate-900">{activeOrders}</h3>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-purple-100 p-3">
                            <Package className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Products</p>
                            <h3 className="text-2xl font-bold text-slate-900">{totalProducts}</h3>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-orange-100 p-3">
                            <TrendingUp className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Growth</p>
                            <h3 className="text-2xl font-bold text-slate-900">+12%</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Sales Chart */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Weekly Sales</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    formatter={(value: any) => [`₹${value}`, 'Sales']}
                                />
                                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Category Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
