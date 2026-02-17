import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export type NotificationType = 'order' | 'payment' | 'delivery' | 'account' | 'product' | 'system';

interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    actionLabel?: string;
    imageUrl?: string;
    relatedId?: string;
    relatedType?: string;
}

/**
 * Create and save a notification to Firestore
 */
export async function createFirestoreNotification(params: CreateNotificationParams) {
    try {
        const notificationData = {
            userId: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            read: false,
            createdAt: serverTimestamp(),
            actionUrl: params.actionUrl || null,
            actionLabel: params.actionLabel || null,
            imageUrl: params.imageUrl || null,
            relatedId: params.relatedId || null,
            relatedType: params.relatedType || null,
        };

        const docRef = await addDoc(collection(db, 'notifications'), notificationData);
        return { success: true, notificationId: docRef.id };
    } catch (error: any) {
        console.error('Failed to create Firestore notification:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Create order confirmation notification for buyer
 */
export async function createUserOrderConfirmation(
    orderId: string,
    userId: string,
    customerName: string,
    total: number
) {
    return createFirestoreNotification({
        userId,
        type: 'order',
        title: 'Order Confirmed! 🎉',
        message: `Thank you ${customerName}! Your order #${orderId.replace('ORD-', '')} for ₹${total} has been confirmed.`,
        actionUrl: `/orders`,
        actionLabel: 'View Order',
        relatedId: orderId,
        relatedType: 'order'
    });
}

/**
 * Create new order notification for admin/seller
 */
export async function createNewOrderNotification(
    orderId: string,
    adminUserId: string,
    customerName: string,
    total: number
) {
    return createFirestoreNotification({
        userId: adminUserId,
        type: 'order',
        title: 'New Order Received! 🛍️',
        message: `Order #${orderId.replace('ORD-', '')} from ${customerName} - ₹${total}`,
        actionUrl: `/admin/orders`,
        actionLabel: 'View Order',
        relatedId: orderId,
        relatedType: 'order'
    });
}

/**
 * Create order status update notification
 */
export async function createOrderStatusNotification(
    orderId: string,
    userId: string,
    status: string,
    trackingId?: string
) {
    let title = '';
    let message = '';
    let actionLabel = 'View Order';

    switch (status) {
        case 'Processing':
            title = 'Order is Being Prepared 📦';
            message = `We're preparing your order #${orderId.replace('ORD-', '')}. It will be shipped soon!`;
            break;
        case 'Shipped':
            title = 'Order Shipped! 🚚';
            message = `Great news! Your order #${orderId.replace('ORD-', '')} has been shipped and is on its way.`;
            if (trackingId) {
                actionLabel = 'Track Shipment';
                message += ` Tracking ID: ${trackingId}`;
            }
            break;
        case 'Delivered':
            title = 'Order Delivered! ✅';
            message = `Your order #${orderId.replace('ORD-', '')} has been delivered successfully. Thank you for shopping with us!`;
            break;
        case 'Cancelled':
            title = 'Order Cancelled';
            message = `Your order #${orderId.replace('ORD-', '')} has been cancelled. Refund will be processed if applicable.`;
            break;
        default:
            title = 'Order Status Updated';
            message = `Your order #${orderId.replace('ORD-', '')} status: ${status}`;
    }

    return createFirestoreNotification({
        userId,
        type: 'order',
        title,
        message,
        actionUrl: `/orders`,
        actionLabel,
        relatedId: orderId,
        relatedType: 'order'
    });
}

/**
 * Create back in stock notification
 */
export async function createBackInStockNotification(
    userId: string,
    productId: string,
    productName: string,
    productImage?: string
) {
    return createFirestoreNotification({
        userId,
        type: 'product',
        title: 'Back in Stock! 🎉',
        message: `${productName} is now available! Grab it before it's gone again.`,
        actionUrl: `/products/${productId}`,
        actionLabel: 'View Product',
        imageUrl: productImage,
        relatedId: productId,
        relatedType: 'product'
    });
}

/**
 * Create payment success notification
 */
export async function createPaymentSuccessNotification(
    orderId: string,
    userId: string,
    amount: number,
    paymentMethod: string
) {
    return createFirestoreNotification({
        userId,
        type: 'payment',
        title: 'Payment Successful ✓',
        message: `Your payment of ₹${amount} via ${paymentMethod} has been processed successfully.`,
        actionUrl: `/orders`,
        actionLabel: 'View Order',
        relatedId: orderId,
        relatedType: 'payment'
    });
}

/**
 * Create welcome notification for new user
 */
export async function createWelcomeNotification(userId: string, userName: string) {
    return createFirestoreNotification({
        userId,
        type: 'account',
        title: `Welcome to R Mart, ${userName}! 👋`,
        message: 'Explore our collection of premium clothing and enjoy a seamless shopping experience.',
        actionUrl: '/products',
        actionLabel: 'Start Shopping'
    });
}
