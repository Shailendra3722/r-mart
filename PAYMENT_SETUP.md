# Payment Integration Setup Guide

## Overview
R Mart now supports online payments through Razorpay integration. This guide explains how to set up and use the payment system.

## Prerequisites

### 1. Install Razorpay Package
```bash
npm install razorpay
```

**Note:** If you encounter npm permission errors, contact your system administrator or try:
```bash
# Fix npm cache permissions
sudo chown -R $(whoami) ~/.npm
```

### 2. Get Razorpay API Keys

1. Create a Razorpay account at [https://dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Navigate to Settings → API Keys
3. Generate Test  Mode keys for development
4. Generate Live Mode keys for production

### 3. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay Test Keys (for development)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_secret_key_here
```

**For Vercel Deployment:**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add both variables for Production, Preview, and Development

## Payment Flow

### User Journey
1. User adds items to cart
2. Proceeds to checkout
3. Clicks "Pay Online" button
4. Razorpay checkout modal opens
5. User selects payment method (UPI/Cards/Wallets/Net Banking)
6. Completes payment
7. Payment is verified on backend
8. Order status updated to "Paid" → "Processing"
9. User redirected to success page

### Technical Flow
```
Frontend              Backend              Razorpay
   |                     |                     |
   |--Create Order------>|                     |
   |                     |--Create Order------>|
   |                     |<--Order ID----------|
   |<--Order Details-----|                     |
   |                                           |
   |--Open Checkout Modal------------------->|
   |<--Payment Success/Failure----------------|
   |                                           |
   |--Verify Payment---->|                     |
   |                     |--Verify Signature   |
   |                     |--Update Order       |
   |<--Confirmation------|                     |
   |                                           |
   |--Redirect to Success/Failure Page         |
```

## Components

### Backend APIs

#### `/api/payments/create`
- Creates Razorpay order
- Accepts: `{ amount, currency, orderId }`
- Returns: `{ orderId, amount, currency, keyId }`

#### `/api/payments/verify`
- Verifies payment signature
- Accepts: `{ razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId }`
- Returns: `{ success, order }`

### Frontend Components

#### `PaymentButton`
- Loads Razorpay checkout
- Handles payment flow
- Props: `{ amount, orderId, onSuccess, onFailure }`

#### Success/Failure Pages
- `/payment-success` - Shows confirmation and order details
- `/payment-failure` - Shows error and retry options

## Testing

### Test Cards (Razorpay Test Mode)

**Success:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: 4012 0010 3714 1112

### Test UPI IDs
- Success: `success@razorpay`
- Failure: `failure@razorpay`

## Usage Example

```tsx
import PaymentButton from '@/components/store/PaymentButton';

function CheckoutPage() {
    const handleSuccess = (order) => {
        router.push(`/payment-success?orderId=${order.id}`);
    };

    const handleFailure = (error) => {
        router.push(`/payment-failure?error=${error}`);
    };

    return (
        <PaymentButton
            amount={totalAmount}
            orderId={orderId}
            onSuccess={handleSuccess}
            onFailure={handleFailure}
        />
    );
}
```

## Security Notes

✅ **Signature Verification** - All payments are verified server-side
✅ **Environment Variables** - API keys never exposed to client
✅ **HTTPS Required** - Razorpay requires HTTPS in production
✅ **No Direct DB Access** - Payment updates go through API routes

## Troubleshooting

### Razorpay SDK Not Installed
**Error:** `Razorpay SDK not available`
**Fix:** Run `npm install razorpay`

### Missing API Keys
**Error:** `Razorpay credentials not configured`
**Fix:** Add keys to `.env.local` and restart dev server

### Payment Signature Invalid
**Error:** `Invalid payment signature`
**Fix:** Ensure `RAZORPAY_KEY_SECRET` matches the key used in Razorpay dashboard

### Script Loading Failed
**Error:** `Failed to load Razorpay`
**Fix:** Check internet connection and firewall settings

## Production Checklist

- [ ] Replace test API keys with live keys
- [ ] Add environment variables to Vercel
- [ ] Test with real payment methods
- [ ] Set up webhook for payment notifications
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Test refund flow
- [ ] Set up payment failure notifications

## Support

For Razorpay-specific issues:
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

For R Mart payment integration issues:
- Check server logs for detailed errors
- Verify API keys are correctly set
- Test in Razorpay test mode first
