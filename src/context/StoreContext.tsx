"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialProducts, Product } from '@/lib/data';
import { useAuth } from './AuthContext';

type CartItem = Product & {
    cartId: string;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
};

export type Order = {
    id: string; // MongoDB _id or custom ID
    customerName: string;
    customerMobile: string;
    items: CartItem[];
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    date: string;
    paymentMethod: string;
    paymentStatus: 'Paid' | 'Pending' | 'Failed';
    transactionId?: string;
    shippingAddress: {
        name: string;
        mobile: string;
        address: string;
        landmark?: string;
        city: string;
        state: string;
        pincode: string;
    };
    // Logistics Fields
    courier?: string; // e.g., 'E-kart', 'Xpressbees'
    trackingId?: string;
    awbNumber?: string;
};

export type Notification = {
    id: string;
    type: 'order' | 'payment' | 'delivery' | 'account' | 'product' | 'system';
    title: string;
    message: string;
    userId?: string;
    targetAudience?: 'admin' | 'user' | 'both';
    relatedId?: string;
    relatedType?: 'order' | 'product' | 'user' | 'payment';
    actionUrl?: string;
    actionLabel?: string;
    imageUrl?: string;
    isRead: boolean;
    createdAt: string | Date;
};

type StoreContextType = {
    products: Product[];
    cart: CartItem[];
    orders: Order[];
    wishlist: Product[];
    notifications: Notification[];
    userNotifications: Notification[];
    unreadCount: number;
    unreadUserNotificationCount: number;
    itemCount: number;
    cartTotal: number;
    isLoading: boolean;
    addProduct: (product: Omit<Product, 'id'>) => Promise<{ success: boolean; error?: string }>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addToCart: (product: Product, size: string, color: string) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, delta: number) => void;
    clearCart: () => void;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: string) => void;
    placeOrder: (customerDetails: any, paymentMethod: string, transactionId?: string) => Promise<void>;
    updateOrderStatus: (id: string, status: Order['status'], logisticsData?: { courier: string; trackingId: string; awbNumber: string }) => Promise<void>;
    fetchNotifications: () => Promise<void>;
    fetchUserNotifications: () => Promise<void>;
    markNotificationAsRead: (id: string) => Promise<void>;
    markAllNotificationsAsRead: () => Promise<void>;
    markUserNotificationAsRead: (id: string) => Promise<void>;
    markAllUserNotificationsAsRead: () => Promise<void>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load Wishlist from LocalStorage
    useEffect(() => {
        const savedWishlist = localStorage.getItem('rmart-wishlist');
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    }, []);

    // Save Wishlist to LocalStorage
    useEffect(() => {
        localStorage.setItem('rmart-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Load Cart from LocalStorage (Cart should remain client-side for guests)
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save Cart to LocalStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // FETCH DATA FROM API
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Products
            const prodRes = await fetch('/api/products');
            if (prodRes.ok) {
                const prodData = await prodRes.json();
                // If DB is empty or returns an error object without array, use initialProducts
                if (!Array.isArray(prodData) || prodData.length === 0) {
                    setProducts(initialProducts);
                    // Optional: Seed DB here if needed
                } else {
                    setProducts(prodData);
                }
            } else {
                setProducts(initialProducts);
            }

            // Fetch Orders (Admin sees all, User sees theirs - handled by API)
            // For now fetching all, refined in future
            try {
                const orderRes = await fetch('/api/orders');
                if (orderRes.ok) {
                    const orderData = await orderRes.json();
                    if (!Array.isArray(orderData) || orderData.length === 0) {
                        setOrders(initialOrders);
                    } else {
                        setOrders(orderData);
                    }
                } else {
                    setOrders(initialOrders);
                }
            } catch {
                setOrders(initialOrders);
            }
        } catch (error) {
            // Smooth Fallbacks for all divisions
            setProducts(initialProducts);
            setOrders(initialOrders);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]); // Re-run when user changes


    // --- API ACTIONS ---

    const addProduct = async (newProductData: Omit<Product, 'id'>) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newProductData,
                    id: Math.random().toString(36).substr(2, 9)
                }),
            });
            if (res.ok) {
                const savedProduct = await res.json();
                setProducts((prev) => [savedProduct, ...prev]);
                return { success: true };
            } else {
                const errorData = await res.json();
                console.error("Failed to add product:", errorData.error);
                return { success: false, error: errorData.error || 'Server error occurred' };
            }
        } catch (error: any) {
            console.error("Add Product Error:", error);
            return { success: false, error: 'Network or Server Error' };
        }
    };

    const updateProduct = async (id: string, updatedData: Partial<Product>) => {
        // Optimistic update
        setProducts((prev) =>
            prev.map((product) => (product.id === id ? { ...product, ...updatedData } : product))
        );

        try {
            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updatedData }),
            });
            if (!res.ok) {
                console.error('Failed to update product on server');
                await fetchData(); // Revert on failure
            }
        } catch (error) {
            console.error('Update Product Error:', error);
            await fetchData();
        }
    };

    const deleteProduct = async (id: string) => {
        // Optimistic delete
        setProducts((prev) => prev.filter((p) => p.id !== id));

        try {
            const res = await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) {
                console.error('Failed to delete product on server');
                await fetchData(); // Revert on failure
            }
        } catch (error) {
            console.error('Delete Product Error:', error);
            await fetchData();
        }
    };

    const placeOrder = async (customerDetails: any, paymentMethod: string, transactionId?: string) => {
        const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const finalTotal = cartTotal > 100 ? cartTotal - 100 : cartTotal; // Discount logic

        const newOrder = {
            id: `ORD-${Math.floor(Math.random() * 100000)}`,
            userId: user?.uid || 'guest', // Link to user
            customerName: customerDetails.name || 'Guest User',
            customerMobile: customerDetails.mobile || 'N/A',
            shippingAddress: {
                name: customerDetails.name,
                mobile: customerDetails.mobile,
                address: customerDetails.address,
                landmark: customerDetails.landmark,
                city: customerDetails.city,
                state: customerDetails.state,
                pincode: customerDetails.pincode
            },
            items: cart.map(item => ({
                id: item.id,
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor
            })),
            total: finalTotal,
            status: 'Pending',
            date: new Date().toISOString(),
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
            transactionId: transactionId || ''
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });

            if (res.ok) {
                const savedOrder = await res.json();
                setOrders((prev) => [savedOrder, ...prev]);
                clearCart();
            } else {
                const errorData = await res.json();
                console.error("Failed to place order:", errorData);
                alert(`Failed to place order: ${errorData.error || 'Unknown Server Error'}`);
            }
        } catch (error) {
            console.error("Place Order Network Error:", error);
            alert("Failed to place order due to network issue. Please check console.");
        }
    };

    const updateOrderStatus = async (id: string, status: Order['status'], logisticsData?: { courier: string; trackingId: string; awbNumber: string }) => {
        // Optimistic update
        setOrders((prev) =>
            prev.map((order) => (order.id === id ? { ...order, status, ...logisticsData } : order))
        );

        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, ...logisticsData }),
            });

            if (!res.ok) {
                // Revert if failed
                console.error("Failed to update status on server");
                // Ideally refresh orders here or revert state
            }
        } catch (error) {
            console.error("Update Status Network Error:", error);
        }
    };

    // --- NOTIFICATION ACTIONS ---

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markNotificationAsRead = async (id: string) => {
        try {
            // Optimistic update
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );

            const res = await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: true }),
            });

            if (!res.ok) {
                console.error('Failed to mark notification as read');
                // Revert on failure
                await fetchNotifications();
            }
        } catch (error) {
            console.error('Mark notification as read error:', error);
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            // Optimistic update
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );

            const res = await fetch('/api/notifications/mark-all-read', {
                method: 'PATCH',
            });

            if (!res.ok) {
                console.error('Failed to mark all notifications as read');
                // Revert on failure
                await fetchNotifications();
            }
        } catch (error) {
            console.error('Mark all notifications as read error:', error);
        }
    };

    // --- USER NOTIFICATION ACTIONS ---

    const fetchUserNotifications = async () => {
        if (!user?.uid) return;

        try {
            const res = await fetch(`/api/notifications?userId=${user.uid}&targetAudience=user`);
            if (res.ok) {
                const data = await res.json();
                setUserNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Failed to fetch user notifications:', error);
        }
    };

    const markUserNotificationAsRead = async (id: string) => {
        try {
            // Optimistic update
            setUserNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );

            const res = await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: true }),
            });

            if (!res.ok) {
                console.error('Failed to mark user notification as read');
                await fetchUserNotifications();
            }
        } catch (error) {
            console.error('Mark user notification as read error:', error);
        }
    };

    const markAllUserNotificationsAsRead = async () => {
        if (!user?.uid) return;

        try {
            // Optimistic update
            setUserNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );

            const res = await fetch('/api/notifications/mark-all-read', {
                method: 'PATCH',
            });

            if (!res.ok) {
                console.error('Failed to mark all user notifications as read');
                await fetchUserNotifications();
            }
        } catch (error) {
            console.error('Mark all user notifications as read error:', error);
        }
    };

    // --- WISHLIST ACTIONS ---

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            if (prev.some(p => p.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlist((prev) => prev.filter((p) => p.id !== id));
    };

    // --- CART ACTIONS (Client Side) ---

    const addToCart = (product: Product, selectedSize: string, selectedColor: string) => {
        setCart((prev) => {
            const existingItem = prev.find(
                (item) => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
            );

            if (existingItem) {
                return prev.map((item) =>
                    item.cartId === existingItem.cartId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [
                ...prev,
                {
                    ...product,
                    cartId: Math.random().toString(36).substr(2, 9),
                    selectedSize,
                    selectedColor,
                    quantity: 1,
                },
            ];
        });
    };

    const removeFromCart = (cartId: string) => {
        setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    };

    const updateQuantity = (cartId: string, delta: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.cartId === cartId) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCart([]);

    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const unreadUserNotificationCount = userNotifications.filter((n) => !n.isRead).length;

    return (
        <StoreContext.Provider
            value={{
                products,
                cart,
                orders,
                wishlist,
                notifications,
                userNotifications,
                unreadCount,
                unreadUserNotificationCount,
                itemCount,
                cartTotal,
                isLoading,
                addProduct,
                updateProduct,
                deleteProduct,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                addToWishlist,
                removeFromWishlist,
                placeOrder,
                updateOrderStatus,
                fetchNotifications,
                fetchUserNotifications,
                markNotificationAsRead,
                markAllNotificationsAsRead,
                markUserNotificationAsRead,
                markAllUserNotificationsAsRead,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
