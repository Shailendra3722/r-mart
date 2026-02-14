import dbConnect from './db';
import { Notification } from '@/models';

export type NotificationType = 'order' | 'payment' | 'delivery' | 'account' | 'product' | 'system';
export type RelatedType = 'order' | 'product' | 'user' | 'payment';
export type TargetAudience = 'admin' | 'user' | 'both';

interface CreateNotificationParams {
    type: NotificationType;
    title: string;
    message: string;
    userId?: string;
    targetAudience?: TargetAudience;
    relatedId?: string;
    relatedType?: RelatedType;
    actionUrl?: string;
    actionLabel?: string;
    imageUrl?: string;
}

/**
 * Create and save a notification to the database
 */
export async function createNotification(params: CreateNotificationParams) {
    try {
        await dbConnect();

        const notificationData = {
            id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: params.type,
            title: params.title,
            message: params.message,
            userId: params.userId,
            targetAudience: params.targetAudience || 'admin',
            relatedId: params.relatedId,
            relatedType: params.relatedType,
            actionUrl: params.actionUrl,
            actionLabel: params.actionLabel,
            imageUrl: params.imageUrl,
            isRead: false,
            createdAt: new Date()
        };

        const notification = await Notification.create(notificationData);
        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
        return null;
    }
}

/**
 * Create an order-related notification
 */
export async function createOrderNotification(
    orderId: string,
    customerName: string,
    total: number,
    type: 'new' | 'status_update',
    status?: string
) {
    let title = '';
    let message = '';

    if (type === 'new') {
        title = 'New Order Received';
        message = `Order #${orderId.replace('ORD-', '')} placed by ${customerName} - ₹${total}`;
    } else if (type === 'status_update') {
        title = 'Order Status Updated';
        message = `Order #${orderId.replace('ORD-', '')} is now ${status}`;
    }

    return createNotification({
        type: 'order',
        title,
        message,
        relatedId: orderId,
        relatedType: 'order'
    });
}

/**
 * Create a product-related notification (e.g., low stock)
 */
export async function createProductNotification(
    productId: string,
    productName: string,
    stock: number
) {
    return createNotification({
        type: 'product',
        title: 'Low Stock Alert',
        message: `${productName} is running low (${stock} items remaining)`,
        relatedId: productId,
        relatedType: 'product'
    });
}

/**
 * Create a low stock alert notification
 */
export async function createLowStockAlert(productId: string, productName: string, stock: number) {
    // Only alert if stock is below 10
    if (stock < 10) {
        return createProductNotification(productId, productName, stock);
    }
    return null;
}

/**
 * Create a user-related notification (e.g., new user registration)
 */
export async function createUserNotification(userId: string, userName: string) {
    return createNotification({
        type: 'account',
        title: 'New User Registered',
        message: `${userName} has joined R Mart`,
        targetAudience: 'admin',
        relatedId: userId,
        relatedType: 'user'
    });
}

/**
 * Create a system notification
 */
export async function createSystemNotification(title: string, message: string) {
    return createNotification({
        type: 'system',
        title,
        message
    });
}

// ============================================
// USER NOTIFICATION FUNCTIONS
// ============================================

/**
 * Create order confirmation notification for user
 */
export async function createUserOrderConfirmation(
    orderId: string,
    userId: string,
    customerName: string,
    total: number
) {
    return createNotification({
        type: 'order',
        title: 'Order Confirmed! 🎉',
        message: `Thank you ${customerName}! Your order #${orderId.replace('ORD-', '')} for ₹${total} has been confirmed.`,
        userId,
        targetAudience: 'user',
        relatedId: orderId,
        relatedType: 'order',
        actionUrl: `/orders/${orderId}`,
        actionLabel: 'View Order'
    });
}

/**
 * Create order status update notification for user
 */
export async function createUserOrderStatusUpdate(
    orderId: string,
    userId: string,
    status: string,
    trackingId?: string
) {
    let title = '';
    let message = '';
    let actionLabel = 'View Order';
    let actionUrl = `/orders/${orderId}`;

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
            actionLabel = 'View Order';
            break;
        case 'Cancelled':
            title = 'Order Cancelled';
            message = `Your order #${orderId.replace('ORD-', '')} has been cancelled. Refund will be processed if applicable.`;
            break;
        default:
            title = 'Order Status Updated';
            message = `Your order #${orderId.replace('ORD-', '')} status: ${status}`;
    }

    return createNotification({
        type: 'order',
        title,
        message,
        userId,
        targetAudience: 'user',
        relatedId: orderId,
        relatedType: 'order',
        actionUrl,
        actionLabel
    });
}

/**
 * Create delivery update notification
 */
export async function createUserDeliveryUpdate(
    orderId: string,
    userId: string,
    message: string,
    deliveryDate?: string
) {
    return createNotification({
        type: 'delivery',
        title: 'Delivery Update 📍',
        message,
        userId,
        targetAudience: 'user',
        relatedId: orderId,
        relatedType: 'order',
        actionUrl: `/orders/${orderId}`,
        actionLabel: 'Track Package'
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
    return createNotification({
        type: 'payment',
        title: 'Payment Successful ✓',
        message: `Your payment of ₹${amount} via ${paymentMethod} has been processed successfully.`,
        userId,
        targetAudience: 'user',
        relatedId: orderId,
        relatedType: 'payment',
        actionUrl: `/orders/${orderId}`,
        actionLabel: 'View Order'
    });
}

/**
 * Create payment failed notification
 */
export async function createPaymentFailedNotification(
    orderId: string,
    userId: string,
    reason?: string
) {
    return createNotification({
        type: 'payment',
        title: 'Payment Failed ❌',
        message: `Payment failed for order #${orderId.replace('ORD-', '')}. ${reason || 'Please try again or use a different payment method.'}`,
        userId,
        targetAudience: 'user',
        relatedId: orderId,
        relatedType: 'payment',
        actionUrl: `/orders/${orderId}`,
        actionLabel: 'Retry Payment'
    });
}

/**
 * Create refund notification
 */
export async function createRefundNotification(
    orderId: string,
    userId: string,
    amount: number,
    status: 'initiated' | 'completed'
) {
    const title = status === 'initiated' ? 'Refund Initiated' : 'Refund Completed ✓';
    const message = status === 'initiated'
        ? `Refund of ₹${amount} has been initiated for order #${orderId.replace('ORD-', '')}. It will be credited within 5-7 business days.`
        : `Refund of ₹${amount} has been credited to your account.`;

    return createNotification({
        type: 'payment',
        title,
        message,
        userId,
        targetAudience: 'user',
        relatedId: orderId,
        relatedType: 'payment',
        actionUrl: `/orders/${orderId}`,
        actionLabel: 'View Order'
    });
}

/**
 * Create welcome notification for new user
 */
export async function createWelcomeNotification(userId: string, userName: string) {
    return createNotification({
        type: 'account',
        title: `Welcome to R Mart, ${userName}! 👋`,
        message: 'Explore our collection of premium clothing and enjoy a seamless shopping experience.',
        userId,
        targetAudience: 'user',
        actionUrl: '/shop',
        actionLabel: 'Start Shopping'
    });
}

/**
 * Create profile update notification
 */
export async function createProfileUpdateNotification(userId: string, updateType: string) {
    return createNotification({
        type: 'account',
        title: 'Profile Updated',
        message: `Your ${updateType} has been updated successfully.`,
        userId,
        targetAudience: 'user',
        actionUrl: '/profile',
        actionLabel: 'View Profile'
    });
}

/**
 * Create password change notification
 */
export async function createPasswordChangeNotification(userId: string) {
    return createNotification({
        type: 'account',
        title: 'Password Changed',
        message: 'Your password was changed successfully. If this wasn\'t you, please contact support immediately.',
        userId,
        targetAudience: 'user',
        actionUrl: '/profile/security',
        actionLabel: 'Security Settings'
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
    return createNotification({
        type: 'product',
        title: 'Back in Stock! 🎉',
        message: `${productName} is now available! Grab it before it's gone again.`,
        userId,
        targetAudience: 'user',
        relatedId: productId,
        relatedType: 'product',
        imageUrl: productImage,
        actionUrl: `/product/${productId}`,
        actionLabel: 'View Product'
    });
}

/**
 * Create price drop notification
 */
export async function createPriceDropNotification(
    userId: string,
    productId: string,
    productName: string,
    newPrice: number,
    oldPrice: number,
    productImage?: string
) {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

    return createNotification({
        type: 'product',
        title: `Price Drop Alert! 🏷️ ${discount}% OFF`,
        message: `${productName} is now ₹${newPrice} (was ₹${oldPrice}). Limited time offer!`,
        userId,
        targetAudience: 'user',
        relatedId: productId,
        relatedType: 'product',
        imageUrl: productImage,
        actionUrl: `/product/${productId}`,
        actionLabel: 'Buy Now'
    });
}

/**
 * Create cart reminder notification
 */
export async function createCartReminderNotification(userId: string, itemCount: number) {
    return createNotification({
        type: 'product',
        title: 'Don\'t Forget Your Cart! 🛒',
        message: `You have ${itemCount} item${itemCount > 1 ? 's' : ''} waiting in your cart. Complete your purchase now!`,
        userId,
        targetAudience: 'user',
        actionUrl: '/cart',
        actionLabel: 'View Cart'
    });
}

/**
 * Create review request notification
 */
export async function createReviewRequestNotification(
    userId: string,
    orderId: string,
    productName: string
) {
    return createNotification({
        type: 'order',
        title: 'How was your purchase? ⭐',
        message: `We'd love to hear your feedback on ${productName}. Share your experience!`,
        userId,
        targetAudience: 'user',
        relatedId: orderId,
        relatedType: 'order',
        actionUrl: `/orders/${orderId}/review`,
        actionLabel: 'Write Review'
    });
}
