// Razorpay server-side utility
// Note: Install razorpay package: npm install razorpay

let Razorpay: any;

// Dynamically import Razorpay only when needed (to avoid build issues)
const getRazorpay = async () => {
    if (!Razorpay) {
        try {
            const razorpayModule = await import('razorpay');
            Razorpay = razorpayModule.default;
        } catch (error) {
            console.error('Razorpay SDK not installed. Run: npm install razorpay');
            throw new Error('Razorpay SDK not available');
        }
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay credentials not configured');
    }

    return new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

export const razorpayInstance = getRazorpay;

// Verify Razorpay signature
export function verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
): boolean {
    const crypto = require('crypto');

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');

    return expectedSignature === razorpaySignature;
}
