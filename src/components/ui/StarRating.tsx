"use client";

import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
    rating: number; // Current rating (0-5)
    size?: 'sm' | 'md' | 'lg'; // Size variant
    interactive?: boolean; // Whether stars are clickable
    onChange?: (rating: number) => void; // Callback when rating changes
    showNumber?: boolean; // Show numeric rating next to stars
}

export default function StarRating({
    rating,
    size = 'md',
    interactive = false,
    onChange,
    showNumber = false
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
    };

    const starSize = sizeClasses[size];
    const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

    const handleClick = (newRating: number) => {
        if (interactive && onChange) {
            onChange(newRating);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-150`}
                    >
                        <Star
                            className={`${starSize} ${star <= displayRating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-slate-300 fill-slate-100'
                                } transition-colors duration-150`}
                        />
                    </button>
                ))}
            </div>
            {showNumber && (
                <span className="ml-1 text-sm font-semibold text-slate-700">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
