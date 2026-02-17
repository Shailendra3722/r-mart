import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const limitCount = parseInt(searchParams.get('limit') || '10');
        const sortBy = searchParams.get('sortBy') || 'newest'; // 'newest' | 'highest'

        if (!productId) {
            return NextResponse.json(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Query reviews for this product
        const reviewsRef = collection(db, 'reviews');
        let reviewQuery = query(
            reviewsRef,
            where('productId', '==', productId)
        );

        // Add sorting
        if (sortBy === 'highest') {
            reviewQuery = query(reviewQuery, orderBy('rating', 'desc'), orderBy('createdAt', 'desc'));
        } else {
            reviewQuery = query(reviewQuery, orderBy('createdAt', 'desc'));
        }

        // Add limit
        reviewQuery = query(reviewQuery, limit(limitCount));

        const reviewsSnapshot = await getDocs(reviewQuery);

        const reviews = reviewsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                productId: data.productId,
                userId: data.userId,
                userName: data.userName,
                userPhoto: data.userPhoto,
                rating: data.rating,
                reviewText: data.reviewText,
                createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                helpful: data.helpful || 0
            };
        });

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

        return NextResponse.json({
            success: true,
            reviews,
            total: reviews.length,
            avgRating: Number(avgRating.toFixed(1))
        });

    } catch (error: any) {
        console.error('Fetch reviews error:', error);
        return NextResponse.json(
            { success: false, error: `Failed to fetch reviews: ${error.message}` },
            { status: 500 }
        );
    }
}
