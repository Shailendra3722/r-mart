"use client";

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Search, Filter, Eye, MoreHorizontal } from 'lucide-react';

export default function OrdersPage() {
    const { orders, updateOrderStatus } = useStore();

    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Logistics Modal State
    const [isShipModalOpen, setIsShipModalOpen] = useState(false);
    const [orderToShip, setOrderToShip] = useState<any>(null);
    const [logisticsData, setLogisticsData] = useState({ courier: 'E-kart', trackingId: '', awbNumber: '' });

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleStatusChange = (orderId: string, newStatus: string) => {
        if (newStatus === 'Shipped') {
            setOrderToShip(orders.find(o => o.id === orderId));
            setIsShipModalOpen(true);
        } else {
            updateOrderStatus(orderId, newStatus as any);
        }
    };

    const submitShipment = async () => {
        if (!orderToShip) return;
        if (!logisticsData.trackingId) return alert("Please enter a Tracking ID");

        await updateOrderStatus(orderToShip.id, 'Shipped', logisticsData);
        setIsShipModalOpen(false);
        setOrderToShip(null);
        setLogisticsData({ courier: 'E-kart', trackingId: '', awbNumber: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-md bg-white border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    ⟳ Force Refresh
                </button>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search orders, customers..."
                        className="w-full rounded-md border-0 py-2 pl-10 pr-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary"
                    />
                </div>
                <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Order ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Customer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Status
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No orders found.
                                </td>
                            </tr>
                        ) : orders.map((order) => (
                            <tr key={order.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                                    #{order.id.replace(/^ORD-/, '')}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                                            {order.customerName.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-slate-900">{order.customerName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                    {new Date(order.date).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                                    ₹{order.total}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`rounded-full px-2 py-1 text-xs font-semibold leading-5 border-0 cursor-pointer focus:ring-2 focus:ring-primary ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleViewDetails(order)}
                                        className="text-slate-400 hover:text-primary"
                                        title="View Details"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Ship Order Modal */}
            {isShipModalOpen && orderToShip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Ship Order #{orderToShip.id.replace(/^ORD-/, '')}</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Courier</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={logisticsData.courier}
                                    onChange={(e) => setLogisticsData({ ...logisticsData, courier: e.target.value })}
                                >
                                    <option value="E-kart">E-kart</option>
                                    <option value="Xpressbees">Xpressbees</option>
                                    <option value="Delhivery">Delhivery</option>
                                    <option value="BlueDart">BlueDart</option>
                                    <option value="DTDC">DTDC</option>
                                    <option value="Shadowfax">Shadowfax</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tracking ID / AWB</label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter Tracking Number"
                                    value={logisticsData.trackingId}
                                    onChange={(e) => setLogisticsData({ ...logisticsData, trackingId: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setIsShipModalOpen(false)}
                                    className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitShipment}
                                    className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Confirm Shipment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {isDetailsModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center bg-slate-50 rounded-t-lg">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
                                <p className="text-sm text-slate-500">ID: #{selectedOrder.id.replace(/^ORD-/, '')}</p>
                            </div>
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer & Shipping Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Customer Info</h3>
                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex justify-between">
                                            <span>Name:</span>
                                            <span className="font-medium text-slate-900">{selectedOrder.customerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Mobile:</span>
                                            <span className="font-medium text-slate-900">{selectedOrder.customerMobile || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payment:</span>
                                            <span className="font-medium text-slate-900">{selectedOrder.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Shipping Address</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {selectedOrder.shippingAddress?.address}<br />
                                        {selectedOrder.shippingAddress?.landmark && <>{selectedOrder.shippingAddress.landmark}<br /></>}
                                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Ordered Items</h3>
                                <div className="rounded-lg border border-slate-200 overflow-hidden">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Product</th>
                                                <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">Size/Color</th>
                                                <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">Qty</th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 bg-white">
                                            {selectedOrder.items.map((item: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-slate-200">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                                                                />
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm text-slate-500">
                                                        {item.selectedSize} / {item.selectedColor}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm text-slate-900 font-medium">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-slate-900 font-medium">
                                                        ₹{item.price * item.quantity}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-slate-50">
                                            <tr>
                                                <td colSpan={3} className="px-4 py-3 text-right text-sm font-bold text-slate-900">Total Amount</td>
                                                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">₹{selectedOrder.total}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 rounded-b-lg flex justify-end">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
