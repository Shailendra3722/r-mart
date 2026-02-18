"use client";

import { useState, use, useRef, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Star, Check, ShieldCheck, Truck, ArrowLeft, Loader2, RotateCcw, Heart, Share2, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import TapButton from '@/components/animations/TapButton';
import FadeIn from '@/components/animations/FadeIn';
import ScaleHover from '@/components/animations/ScaleHover';
import StarRating from '@/components/ui/StarRating';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewsList from '@/components/reviews/ReviewsList';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { products, addToCart, addToWishlist, removeFromWishlist, wishlist } = useStore();
    const resolvedParams = use(params);
    const product = products.find(p => p.id === resolvedParams.id) || products[0];

    // Image Gallery State
    const galleryImages = product?.images && product.images.length > 0
        ? [product.image, ...product.images]
        : [product?.image, product?.image, product?.image, product?.image];

    const [activeImage, setActiveImage] = useState(product?.image);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('White');
    const [adding, setAdding] = useState(false);
    const [reviewRefresh, setReviewRefresh] = useState(0);

    // Image Zoom State
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const isWished = wishlist.some(w => w.id === product?.id);

    // Save to recently viewed
    useEffect(() => {
        if (!product?.id) return;
        const saved = JSON.parse(localStorage.getItem('rmart-recently-viewed') || '[]');
        const updated = [product.id, ...saved.filter((id: string) => id !== product.id)].slice(0, 10);
        localStorage.setItem('rmart-recently-viewed', JSON.stringify(updated));
    }, [product?.id]);

    const handleAddToCart = () => {
        setAdding(true);
        setTimeout(() => {
            addToCart(product, selectedSize, selectedColor);
            setAdding(false);
        }, 500);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!imageContainerRef.current) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: product.name,
                text: `Check out ${product.name} at ₹${product.price} on R Mart!`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Recommended products
    const recommendations = products
        .filter(p => p.category === product?.category && p.id !== product?.id)
        .slice(0, 4);

    if (!product) return null;

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <Link href="/products" className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Link>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">

                {/* --- Left Column: Image Gallery with Zoom --- */}
                <div className="flex flex-col gap-4">
                    {/* Main Image with Zoom */}
                    <div
                        ref={imageContainerRef}
                        className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 cursor-zoom-in group"
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                        onMouseMove={handleMouseMove}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={activeImage || '/placeholder.png'}
                            alt={product.name}
                            className={`h-full w-full object-cover object-center transition-transform duration-200 ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`}
                            style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                            onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                        />
                        {/* Zoom indicator */}
                        <div className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white transition-opacity ${isZoomed ? 'opacity-0' : 'opacity-100 group-hover:opacity-100'}`}>
                            <ZoomIn className="h-3 w-3" /> Hover to zoom
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-3 sm:gap-4">
                        {galleryImages.map((img, index) => (
                            <ScaleHover key={index} scale={1.05} className="cursor-pointer">
                                <div
                                    onClick={() => setActiveImage(img)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'} transition-all`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`View ${index + 1}`} className="h-full w-full object-cover" />
                                </div>
                            </ScaleHover>
                        ))}
                    </div>
                </div>

                {/* --- Right Column: Product Info --- */}
                <div className="mt-8 px-0 sm:mt-16 lg:mt-0">
                    <FadeIn direction="left" delay={0.1}>
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">{product.name}</h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 sm:mb-6 uppercase tracking-wide font-semibold">{product.category}</p>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.2}>
                        <div className="flex items-end gap-3 sm:gap-4 mb-6">
                            <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">₹{product.price}</p>
                            {product.discount && product.discount > 0 && (
                                <>
                                    <p className="text-xl text-slate-400 line-through mb-1">₹{Math.round(product.price * (1 + product.discount / 100))}</p>
                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">{product.discount}% OFF</span>
                                </>
                            )}
                        </div>
                    </FadeIn>

                    {/* Ratings Summary */}
                    <FadeIn direction="left" delay={0.3}>
                        <div className="flex items-center gap-4 mb-8">
                            <StarRating
                                rating={product.avgRating || 0}
                                size="md"
                                showNumber={true}
                            />
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                ({product.reviewCount || 0} {product.reviewCount === 1 ? 'Review' : 'Reviews'})
                            </span>
                        </div>
                    </FadeIn>

                    {/* Selectors */}
                    <FadeIn direction="up" delay={0.4}>
                        <div className="space-y-6 border-t border-b border-slate-100 dark:border-slate-700 py-6">
                            {/* Color Selector */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Select Color</h3>
                                <div className="flex items-center space-x-3">
                                    {(product.colors && product.colors.length > 0 ? product.colors : ['White', 'Black', 'Blue']).map((color) => (
                                        <ScaleHover key={color} scale={1.1}>
                                            <button
                                                onClick={() => setSelectedColor(color)}
                                                className={`h-10 w-10 rounded-full border-2 focus:outline-none shadow-sm ${selectedColor === color ? 'border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' : 'border-slate-200 dark:border-slate-600'}`}
                                                style={{ backgroundColor: color.toLowerCase() }}
                                                title={color}
                                            />
                                        </ScaleHover>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selector */}
                            <div>
                                <div className="flex justify-between mb-3">
                                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Select Size</h3>
                                    <button className="text-xs font-medium text-primary hover:underline">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-5 gap-3">
                                    {(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 text-sm font-bold rounded-lg border transition-all ${selectedSize === size
                                                ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Actions */}
                    <div className="mt-8 flex gap-4">
                        <TapButton
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="flex-1 flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white py-4 text-base font-bold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg shadow-slate-200 dark:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {adding ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Add to Cart'}
                        </TapButton>
                        <TapButton
                            onClick={() => isWished ? removeFromWishlist(product.id) : addToWishlist(product)}
                            className={`w-14 flex items-center justify-center rounded-xl border transition-all ${isWished
                                ? 'border-red-200 dark:border-red-800 text-red-500 bg-red-50 dark:bg-red-900/30'
                                : 'border-slate-200 dark:border-slate-600 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-100 dark:hover:border-red-800'
                                }`}
                        >
                            <Heart className={`h-6 w-6 ${isWished ? 'fill-current' : ''}`} />
                        </TapButton>
                        <TapButton
                            onClick={handleShare}
                            className="w-14 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-100 dark:hover:border-emerald-800 transition-all"
                        >
                            <Share2 className="h-5 w-5" />
                        </TapButton>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <Truck className="h-5 w-5 text-primary" />
                            <span>Free Delivery</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <RotateCcw className="h-5 w-5 text-primary" />
                            <span>7 Day Return</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <span>100% Original</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Secure Pay</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-12">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Product Details</h3>
                        <div className="prose prose-slate dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed">
                            <p>{product.description}</p>
                            <ul className="list-disc pl-5 mt-4 space-y-1">
                                <li>Premium Quality Fabric</li>
                                <li>Breathable & Comfortable</li>
                                <li>Perfect fit for all occasions</li>
                                <li>Easy machine wash</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">You May Also Like</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {recommendations.map(rec => (
                            <Link key={rec.id} href={`/products/${rec.id}`} className="group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all">
                                <div className="aspect-[3/4] relative overflow-hidden bg-slate-100 dark:bg-slate-700">
                                    <Image src={rec.image || '/placeholder.png'} alt={rec.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="p-3">
                                    <h3 className="text-sm font-medium text-slate-800 dark:text-white truncate">{rec.name}</h3>
                                    <p className="text-sm font-bold text-primary mt-1">₹{rec.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* --- Reviews Section --- */}
            <div className="mt-20 border-t border-slate-200 dark:border-slate-700 pt-16 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Customer Reviews</h2>

                {/* Review Form */}
                <div className="mb-12">
                    <ReviewForm
                        productId={product.id}
                        onReviewSubmitted={() => setReviewRefresh(prev => prev + 1)}
                    />
                </div>

                {/* Reviews List */}
                <ReviewsList
                    productId={product.id}
                    refreshTrigger={reviewRefresh}
                />
            </div>
        </div>
    );
}
