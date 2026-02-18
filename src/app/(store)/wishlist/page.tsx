"use client";

import { useStore } from '@/context/StoreContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, addToCart } = useStore();

    const handleMoveToCart = (product: any) => {
        addToCart(product, 'M', product.colors?.[0] || 'White');
        removeFromWishlist(product.id);
    };

    if (wishlist.length === 0) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="mb-6 rounded-full bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/30 dark:to-red-900/30 p-8"
                >
                    <Heart className="h-16 w-16 text-red-400" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-slate-900 dark:text-white"
                >
                    Your Wishlist is Empty
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-2 text-slate-500 dark:text-slate-400 max-w-sm"
                >
                    Save items you love by tapping the heart icon. Your favorites will show up here.
                </motion.p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <Link
                        href="/products"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none"
                    >
                        Explore Products <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Wishlist</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
                </div>
                <Link href="/products" className="text-sm font-medium text-primary hover:underline">
                    Continue Shopping →
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <AnimatePresence mode="popLayout">
                    {wishlist.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                        >
                            {/* Remove Button */}
                            <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="absolute right-2 top-2 z-10 rounded-full bg-white/90 dark:bg-slate-900/90 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>

                            {/* Discount Badge */}
                            {product.discount && product.discount > 0 && (
                                <span className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                    -{product.discount}%
                                </span>
                            )}

                            {/* Image */}
                            <Link href={`/products/${product.id}`}>
                                <div className="aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                                    <Image
                                        src={product.image || '/placeholder.png'}
                                        alt={product.name}
                                        width={300}
                                        height={400}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                            </Link>

                            {/* Info */}
                            <div className="p-3">
                                <Link href={`/products/${product.id}`}>
                                    <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate hover:text-primary">{product.name}</h3>
                                </Link>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{product.category}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">₹{product.price}</span>
                                    {product.discount && product.discount > 0 && (
                                        <span className="text-xs text-slate-400 line-through">₹{Math.round(product.price * (1 + product.discount / 100))}</span>
                                    )}
                                </div>

                                {/* Move to Cart */}
                                <button
                                    onClick={() => handleMoveToCart(product)}
                                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all"
                                >
                                    <ShoppingBag className="h-3.5 w-3.5" />
                                    Move to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
