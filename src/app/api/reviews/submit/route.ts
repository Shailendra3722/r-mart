import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import dbConnect from '@/lib/db';
import { Product } from '@/models';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, userId, userName, userPhoto, rating, reviewText } = body;

        // Validation
        if (!productId || !userId || !rating || !reviewText) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        if (reviewText.trim().length < 10) {
            return NextResponse.json(
                { success: false, error: 'Review must be at least 10 characters long' },
                { status: 400 }
            );
        }

        if (reviewText.length > 500) {
            return NextResponse.json(
                { success: false, error: 'Review must not exceed 500 characters' },
                { status: 400 }
            );
        }

        // Check if user already reviewed this product
        const reviewsRef = collection(db, 'reviews');
        const existingReviewQuery = query(
            reviewsRef,
            where('productId', '==', productId),
            where('userId', '==', userId)
        );
        const existingReviews = await getDocs(existingReviewQuery);

        if (!existingReviews.empty) {
            return NextResponse.json(
                { success: false, error: 'You have already reviewed this product' },
                { status: 400 }
            );
        }

        // Create review in Firestore
        const reviewData = {
            productId,
            userId,
            userName: userName || 'Anonymous',
            userPhoto: userPhoto || null,
            rating: Number(rating),
            reviewText: reviewText.trim(),
            createdAt: serverTimestamp(),
            helpful: 0
        };

        const docRef = await addDoc(reviewsRef, reviewData);

        // Update product's average rating and review count in MongoDB
        await dbConnect();

        // Fetch all reviews for this product to calculate average
        const allReviewsQuery = query(reviewsRef, where('productId', '==', productId));
        const allReviewsSnapshot = await getDocs(allReviewsQuery);

        const reviews = allReviewsSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        })) as any[];

        const totalReviews = reviews.length;
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

        await Product.findOneAndUpdate(
            { id: productId },
            {
                avgRating: Number(avgRating.toFixed(1)),
                reviewCount: totalReviews
            }
        );

        return NextResponse.json({
            success: true,
            reviewId: docRef.id,
            avgRating: Number(avgRating.toFixed(1)),
            reviewCount: totalReviews
        });

    } catch (error: any) {
        console.error('Submit review error:', error);
        return NextResponse.json(
            { success: false, error: `Failed to submit review: ${error.message}` },
            { status: 500 }
        );
    }
}
