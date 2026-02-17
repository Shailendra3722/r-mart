"use client";

import { useState, useEffect } from 'react';
import StarRating from '@/components/ui/StarRating';
import { User, Loader2 } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    userPhoto: string | null;
    rating: number;
    reviewText: string;
    createdAt: string;
    helpful: number;
}

interface ReviewsListProps {
    productId: string;
    refreshTrigger?: number;
}

export default function ReviewsList({ productId, refreshTrigger }: ReviewsListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [avgRating, setAvgRating] = useState(0);
    const [sortBy, setSortBy] = useState<'newest' | 'highest'>('newest');

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/reviews?productId=${productId}&sortBy=${sortBy}&limit=50`);
            const data = await response.json();

            if (data.success) {
                setReviews(data.reviews);
                setAvgRating(data.avgRating);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId, sortBy, refreshTrigger]);

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Header */}
            {reviews.length > 0 && (
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-slate-900">{avgRating.toFixed(1)}</span>
                            <div className="flex flex-col">
                                <StarRating rating={avgRating} size="sm" />
                                <span className="text-xs text-slate-500 mt-0.5">
                                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest')}
                        className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="newest">Newest First</option>
                        <option value="highest">Highest Rated</option>
                    </select>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">No reviews yet</p>
                    <p className="text-slate-400 text-sm mt-2">Be the first to review this product!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review, index) => (
                        <FadeIn
                            key={review.id}
                            direction="up"
                            delay={index * 0.05}
                            className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden flex-shrink-0">
                                        {review.userPhoto ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={review.userPhoto}
                                                alt={review.userName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{review.userName}</h4>
                                        <p className="text-xs text-slate-500">{getRelativeTime(review.createdAt)}</p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} size="sm" />
                            </div>
                            <p className="text-slate-700 leading-relaxed">{review.reviewText}</p>
                        </FadeIn>
                    ))}
                </div>
            )}
        </div>
    );
}
