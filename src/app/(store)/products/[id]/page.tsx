"use client";

import { useState, use } from 'react';
import { useStore } from '@/context/StoreContext';
import { Star, Check, ShieldCheck, Truck, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { products, addToCart } = useStore();
    const resolvedParams = use(params);
    const product = products.find(p => p.id === resolvedParams.id) || products[0];

    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('White');
    const [adding, setAdding] = useState(false);

    // If navigating directly and products context isn't ready or ID invalid, it falls back to first.
    // In a real app we would show loading or 404.

    const handleAddToCart = () => {
        setAdding(true);
        // Simulate network delay for UX
        setTimeout(() => {
            addToCart(product, selectedSize, selectedColor);
            setAdding(false);
            // Optional: Show toast
        }, 500);
    };

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <Link href="/products" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-primary">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to Products
            </Link>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                {/* Image gallery */}
                <div className="flex flex-col-reverse">
                    <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={product.image || '/placeholder.png'}
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                        />
                    </div>
                </div>

                {/* Product info */}
                <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{product.name}</h1>

                    <div className="mt-3">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl tracking-tight text-slate-900">₹{product.price}</p>
                    </div>

                    <div className="mt-3 flex items-center">
                        <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                                <Star
                                    key={rating}
                                    className="h-5 w-5 flex-shrink-0 text-yellow-400 fill-current"
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                        <p className="sr-only">5 out of 5 stars</p>
                        <span className="ml-3 text-sm font-medium text-emerald-600 hover:text-emerald-500">
                            117 reviews
                        </span>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Description</h3>
                        <p className="space-y-6 text-base text-slate-700">
                            The {product.name} is crafted for comfort and style. Perfect for everyday wear, this piece combines premium fabric with modern design to give you the best look for any occasion.
                        </p>
                    </div>

                    <div className="mt-6">
                        {/* Colors */}
                        <div>
                            <h3 className="text-sm font-medium text-slate-900">Color</h3>
                            <div className="mt-2 flex items-center space-x-3">
                                {(product.colors && product.colors.length > 0 ? product.colors : ['White', 'Black', 'Blue']).map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`relative h-8 w-8 rounded-full border border-slate-200 focus:outline-none ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                                            }`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    >
                                        <span className="sr-only">{color}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-slate-900">Size</h3>
                                <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">Size guide</a>
                            </div>
                            <div className="mt-2 grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                                {(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`group relative flex items-center justify-center rounded-md border py-3 text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none ${selectedSize === size
                                            ? 'bg-primary text-white border-transparent'
                                            : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-emerald-600 px-8 py-3 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-400"
                        >
                            {adding ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adding...</> : 'Add to Cart'}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <Truck className="h-5 w-5" /> Fast Delivery
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5" /> Secure Transaction
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
