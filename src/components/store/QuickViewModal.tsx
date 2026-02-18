"use client";

import { useState } from 'react';
import { X, ShoppingBag, Heart, Star, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/data';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import Image from 'next/image';

type QuickViewModalProps = {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
};

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore();
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('');
    const [adding, setAdding] = useState(false);

    if (!product) return null;

    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
    const colors = product.colors && product.colors.length > 0 ? product.colors : ['White', 'Black', 'Blue'];
    const isWished = wishlist.some(w => w.id === product.id);

    const handleAddToCart = () => {
        setAdding(true);
        setTimeout(() => {
            addToCart(product, selectedSize, selectedColor || colors[0]);
            setAdding(false);
            onClose();
        }, 400);
    };

    const handleWishlist = () => {
        if (isWished) removeFromWishlist(product.id);
        else addToWishlist(product);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 rounded-full bg-white/80 dark:bg-slate-800/80 p-2 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-md"
                        >
                            <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Image */}
                            <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
                                <Image
                                    src={product.image || '/placeholder.png'}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 95vw, 400px"
                                    className="object-cover"
                                />
                                {product.discount && product.discount > 0 && (
                                    <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                                        -{product.discount}%
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-6 flex flex-col justify-between">
                                <div>
                                    <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{product.category}</p>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{product.name}</h2>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.avgRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">({product.reviewCount || 0})</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-end gap-3 mb-6">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{product.price}</span>
                                        {product.discount && product.discount > 0 && (
                                            <span className="text-sm text-slate-400 line-through">₹{Math.round(product.price * (1 + product.discount / 100))}</span>
                                        )}
                                    </div>

                                    {/* Colors */}
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Color</p>
                                        <div className="flex gap-2">
                                            {colors.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setSelectedColor(c)}
                                                    className={`h-8 w-8 rounded-full border-2 shadow-sm transition-all ${selectedColor === c ? 'border-primary ring-2 ring-primary/30' : 'border-slate-200 dark:border-slate-600'}`}
                                                    style={{ backgroundColor: c.toLowerCase() }}
                                                    title={c}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sizes */}
                                    <div className="mb-6">
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Size</p>
                                        <div className="flex gap-2">
                                            {sizes.map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => setSelectedSize(s)}
                                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${selectedSize === s
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-400'}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={adding}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-primary py-3 text-sm font-bold text-white hover:bg-slate-800 dark:hover:bg-emerald-700 transition-all disabled:opacity-70"
                                    >
                                        {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingBag className="h-4 w-4" /> Add to Cart</>}
                                    </button>
                                    <button
                                        onClick={handleWishlist}
                                        className={`w-12 flex items-center justify-center rounded-xl border transition-all ${isWished ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-500' : 'border-slate-200 dark:border-slate-600 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'}`}
                                    >
                                        <Heart className={`h-5 w-5 ${isWished ? 'fill-current' : ''}`} />
                                    </button>
                                </div>

                                <Link
                                    href={`/products/${product.id}`}
                                    onClick={onClose}
                                    className="block mt-3 text-center text-xs text-primary hover:underline font-medium"
                                >
                                    View Full Details →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
