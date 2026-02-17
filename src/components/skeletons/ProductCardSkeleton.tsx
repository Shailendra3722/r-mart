export default function ProductCardSkeleton() {
    return (
        <div className="group relative animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-slate-200 lg:aspect-none lg:h-80">
                <div className="h-full w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer"></div>
            </div>

            {/* Product Info Skeleton */}
            <div className="mt-4 flex justify-between">
                <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
            </div>

            {/* Button Skeleton */}
            <div className="mt-2 h-10 bg-slate-200 rounded-md"></div>
        </div>
    );
}
