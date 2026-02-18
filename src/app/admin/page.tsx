"use client";

import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area, LineChart, Line } from "recharts";
import { IndianRupee, ShoppingBag, Package, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";

// Define COLORS for the pie chart
const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#3b82f6', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
    const { products, orders } = useStore();

    // Calculate Real Stats
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
    const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
    const totalProducts = products.length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const avgOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;

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
        const dailyOrders = orders.filter(o => o.date.startsWith(date)).length;
        return {
            name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            sales: dailyTotal,
            orders: dailyOrders,
        };
    });

    // Monthly Revenue Data (simulated growth)
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
            name: d.toLocaleDateString('en-US', { month: 'short' }),
            revenue: Math.round(totalSales * (0.4 + i * 0.15) + Math.random() * 500),
            customers: Math.round(10 + i * 8 + Math.random() * 5),
        };
    });

    // Order Status Distribution
    const statusDistribution = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => ({
        name: status,
        value: orders.filter(o => o.status === status).length
    })).filter(s => s.value > 0);

    // Live order feed (latest 5)
    const latestOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Processing': 'bg-blue-100 text-blue-800',
            'Shipped': 'bg-purple-100 text-purple-800',
            'Delivered': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-slate-100 text-slate-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <span className="text-xs text-slate-500">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-emerald-100 p-3">
                            <IndianRupee className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Total Revenue</p>
                            <h3 className="text-xl font-bold text-slate-900">₹{totalSales.toLocaleString()}</h3>
                            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                                <ArrowUpRight className="h-3 w-3" /> +12% vs last week
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-3">
                            <ShoppingBag className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Active Orders</p>
                            <h3 className="text-xl font-bold text-slate-900">{activeOrders}</h3>
                            <p className="text-[10px] text-slate-500">{deliveredOrders} delivered</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-purple-100 p-3">
                            <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Products</p>
                            <h3 className="text-xl font-bold text-slate-900">{totalProducts}</h3>
                            <p className="text-[10px] text-slate-500">{categoryData.length} categories</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-orange-100 p-3">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Avg. Order</p>
                            <h3 className="text-xl font-bold text-slate-900">₹{avgOrderValue}</h3>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-pink-100 p-3">
                            <Users className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Customers</p>
                            <h3 className="text-xl font-bold text-slate-900">{orders.length}</h3>
                            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                                <ArrowUpRight className="h-3 w-3" /> Growing
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Revenue Trend (Area Chart) */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Revenue Trend</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} fontSize={12} />
                                <Tooltip formatter={(value: any) => [`₹${value}`, 'Revenue']} />
                                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} fill="url(#revenueGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weekly Sales (Bar Chart) */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Weekly Sales</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                                    formatter={(value: any, name?: string) => [name === 'sales' ? `₹${value}` : value, name === 'sales' ? 'Sales' : 'Orders']}
                                />
                                <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Category Distribution */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Categories</h3>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} fontSize={11} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Growth (Line Chart) */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Customer Growth</h3>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip />
                                <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Order Feed */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">Live Orders</h3>
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Live
                        </span>
                    </div>
                    <div className="space-y-3 max-h-[240px] overflow-y-auto">
                        {latestOrders.length > 0 ? latestOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                <div>
                                    <p className="text-xs font-bold text-slate-900">#{order.id.replace(/^ORD-/, '').slice(0, 8)}</p>
                                    <p className="text-[10px] text-slate-500">{new Date(order.date).toLocaleTimeString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900">₹{order.total}</p>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-400 text-center py-8">No orders yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
