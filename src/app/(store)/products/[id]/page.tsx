"use client";

import { useState, use } from 'react';
import { useStore } from '@/context/StoreContext';
import { Star, Check, ShieldCheck, Truck, ArrowLeft, Loader2, RotateCcw, User } from 'lucide-react';
import Link from 'next/link';
import TapButton from '@/components/animations/TapButton';
import FadeIn from '@/components/animations/FadeIn';
import ScaleHover from '@/components/animations/ScaleHover';

// Dummy Reviews Data
const reviews = [
    { id: 1, name: "Rahul S.", rating: 5, date: "2 days ago", comment: "Absolutely loved the quality! Fits perfectly and feels premium." },
    { id: 2, name: "Priya M.", rating: 4, date: "1 week ago", comment: "Great fabric, but delivery took a day longer than expected." },
    { id: 3, name: "Amit K.", rating: 5, date: "2 weeks ago", comment: "Best purchase I've made this month. Highly recommended!" },
];

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { products, addToCart } = useStore();
    const resolvedParams = use(params);
    const product = products.find(p => p.id === resolvedParams.id) || products[0];

    // Image Gallery State
    // If product.images exists, use it. Otherwise, create 4 duplicates of the main image for demo.
    const galleryImages = product.images && product.images.length > 0
        ? [product.image, ...product.images]
        : [product.image, product.image, product.image, product.image];

    const [activeImage, setActiveImage] = useState(product.image);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('White');
    const [adding, setAdding] = useState(false);

    const handleAddToCart = () => {
        setAdding(true);
        setTimeout(() => {
            addToCart(product, selectedSize, selectedColor);
            setAdding(false);
        }, 500);
    };

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <Link href="/products" className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Link>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">

                {/* --- Left Column: Image Gallery --- */}
                <div className="flex flex-col gap-4">
                    {/* Main Image */}
                    <FadeIn className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={activeImage || '/placeholder.png'}
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                        />
                    </FadeIn>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-3 sm:gap-4">
                        {galleryImages.map((img, index) => (
                            <ScaleHover key={index} scale={1.05} className="cursor-pointer">
                                <div
                                    onClick={() => setActiveImage(img)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-slate-300'} transition-all`}
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
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">{product.name}</h1>
                        <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 uppercase tracking-wide font-semibold">{product.category}</p>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.2}>
                        <div className="flex items-end gap-3 sm:gap-4 mb-6">
                            <p className="text-3xl sm:text-4xl font-bold text-slate-900">₹{product.price}</p>
                            {product.discount && product.discount > 0 && (
                                <>
                                    <p className="text-xl text-slate-400 line-through mb-1">₹{Math.round(product.price * (1 + product.discount / 100))}</p>
                                    <span className="text-sm font-bold text-emerald-600 mb-2 bg-emerald-50 px-2 py-1 rounded-md">{product.discount}% OFF</span>
                                </>
                            )}
                        </div>
                    </FadeIn>

                    {/* Ratings Summary */}
                    <FadeIn direction="left" delay={0.3}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center bg-yellow-400 text-white px-2 py-0.5 rounded text-sm font-bold">
                                4.5 <Star className="h-3 w-3 ml-1 fill-current" />
                            </div>
                            <span className="text-sm text-slate-500 border-b border-dashed border-slate-300 cursor-pointer hover:text-primary">
                                117 Verified Reviews
                            </span>
                        </div>
                    </FadeIn>

                    {/* Selectors */}
                    <FadeIn direction="up" delay={0.4}>
                        <div className="space-y-6 border-t border-b border-slate-100 py-6">
                            {/* Color Selector */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-900 mb-3">Select Color</h3>
                                <div className="flex items-center space-x-3">
                                    {(product.colors && product.colors.length > 0 ? product.colors : ['White', 'Black', 'Blue']).map((color) => (
                                        <ScaleHover key={color} scale={1.1}>
                                            <button
                                                onClick={() => setSelectedColor(color)}
                                                className={`h-10 w-10 rounded-full border-2 focus:outline-none shadow-sm ${selectedColor === color ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-slate-200'}`}
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
                                    <h3 className="text-sm font-medium text-slate-900">Select Size</h3>
                                    <button className="text-xs font-medium text-primary hover:underline">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-5 gap-3">
                                    {(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 text-sm font-bold rounded-lg border transition-all ${selectedSize === size
                                                ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
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
                            className="flex-1 flex items-center justify-center rounded-xl bg-slate-900 py-4 text-base font-bold text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {adding ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Add to Cart'}
                        </TapButton>
                        <TapButton className="w-14 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">
                            <Star className="h-6 w-6" />
                        </TapButton>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <Truck className="h-5 w-5 text-primary" />
                            <span>Free Delivery</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <RotateCcw className="h-5 w-5 text-primary" />
                            <span>7 Day Return</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <span>100% Original</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Secure Pay</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-12">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Product Details</h3>
                        <div className="prose prose-slate text-slate-600 leading-relaxed">
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

            {/* --- Reviews Section --- */}
            <div className="mt-20 border-t border-slate-200 pt-16 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Customer Reviews</h2>

                <div className="space-y-6">
                    {reviews.map((review) => (
                        <FadeIn key={review.id} direction="up" className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{review.name}</h4>
                                        <p className="text-xs text-slate-500">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex bg-slate-50 px-2 py-1 rounded">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-600 ml-13 pl-13">{review.comment}</p>
                        </FadeIn>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button className="text-primary font-semibold hover:underline">View All 117 Reviews</button>
                </div>
            </div>
        </div>
    );
}
