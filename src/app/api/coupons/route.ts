import { NextResponse } from 'next/server';

// Built-in coupon codes — in production these would be in a database
const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number; minOrder: number; maxDiscount?: number; description: string }> = {
    'WELCOME10': { type: 'percent', value: 10, minOrder: 299, maxDiscount: 200, description: '10% off on your first order' },
    'RMART50': { type: 'flat', value: 50, minOrder: 499, description: '₹50 off on orders above ₹499' },
    'FIRSTORDER': { type: 'percent', value: 15, minOrder: 599, maxDiscount: 300, description: '15% off for new customers' },
    'SAVE100': { type: 'flat', value: 100, minOrder: 999, description: '₹100 off on orders above ₹999' },
    'MEGA20': { type: 'percent', value: 20, minOrder: 799, maxDiscount: 500, description: '20% off on mega orders' },
};

export async function POST(request: Request) {
    try {
        const { code, cartTotal } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
        }

        const coupon = COUPONS[code.toUpperCase().trim()];

        if (!coupon) {
            return NextResponse.json({ error: 'Invalid coupon code. Please check and try again.' }, { status: 400 });
        }

        if (cartTotal < coupon.minOrder) {
            return NextResponse.json({
                error: `Minimum order of ₹${coupon.minOrder} required for this coupon.`
            }, { status: 400 });
        }

        let discount = 0;
        if (coupon.type === 'percent') {
            discount = Math.round(cartTotal * coupon.value / 100);
            if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
            discount = coupon.value;
        }

        return NextResponse.json({
            success: true,
            code: code.toUpperCase().trim(),
            discount,
            description: coupon.description,
            type: coupon.type,
            value: coupon.value,
        });
    } catch (error) {
        console.error('Coupon validation error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
