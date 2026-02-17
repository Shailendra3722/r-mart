"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import StarRating from '@/components/ui/StarRating';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

interface ReviewFormProps {
    productId: string;
    onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
    const { user, isAuthenticated } = useAuth();
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setRating(0);
                setReviewText('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (reviewText.trim().length < 10) {
            setError('Review must be at least 10 characters long');
            return;
        }

        if (reviewText.length > 500) {
            setError('Review must not exceed 500 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/reviews/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    userId: user?.uid,
                    userName: user?.name || 'Anonymous',
                    userPhoto: user?.photoURL,
                    rating,
                    reviewText: reviewText.trim()
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setError('');
                if (onReviewSubmitted) {
                    onReviewSubmitted();
                }
            } else {
                setError(data.error || 'Failed to submit review');
            }
        } catch (err: any) {
            console.error('Submit review error:', err);
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <p className="text-slate-600 mb-4">
                    Please sign in to write a review
                </p>
                <Link
                    href="/login"
                    className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>

            {success ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <p className="font-medium">Thank you! Your review has been submitted successfully.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Your Rating <span className="text-red-500">*</span>
                        </label>
                        <StarRating
                            rating={rating}
                            size="lg"
                            interactive={true}
                            onChange={setRating}
                        />
                        {rating > 0 && (
                            <p className="mt-1 text-sm text-slate-500">
                                {rating === 5 && "Excellent!"}
                                {rating === 4 && "Very Good"}
                                {rating === 3 && "Good"}
                                {rating === 2 && "Fair"}
                                {rating === 1 && "Poor"}
                            </p>
                        )}
                    </div>

                    {/* Review Text */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Your Review <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={4}
                            maxLength={500}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-slate-900"
                        />
                        <div className="flex justify-between mt-1">
                            <p className="text-xs text-slate-500">
                                Minimum 10 characters
                            </p>
                            <p className="text-xs text-slate-500">
                                {reviewText.length}/500
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                            <XCircle className="h-4 w-4 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Review'
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
