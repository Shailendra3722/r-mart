"use client";

import { useState, useEffect, Suspense } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
    const searchParams = useSearchParams();
    const { products, addToCart } = useStore();

    // Initialize state from URL params
    const initialCategory = searchParams.get('category') || 'All';
    const initialSearch = searchParams.get('search') || '';

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedPrice, setSelectedPrice] = useState<string>('all');

    // Sync state if URL params change (e.g. navigation)
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setSelectedCategory(cat);
    }, [searchParams]);

    const searchQuery = initialSearch; // Use the parsed search query

    const getPriceRange = (selected: string): [number, number] | null => {
        if (selected === 'under500') return [0, 500];
        if (selected === '500-1000') return [500, 1000];
        if (selected === 'over1000') return [1000, 999999];
        return null;
    };

    const priceRange = getPriceRange(selectedPrice);

    const filteredProducts = products.filter(product => {
        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesName = product.name.toLowerCase().includes(query);
            const matchesCategory = product.category.toLowerCase().includes(query);
            if (!matchesName && !matchesCategory) return false;
        }

        // Category Filter
        if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
        }

        // Price Filter
        if (priceRange) {
            if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
        }

        return true;
    });

    const clearAllFilters = () => {
        setSelectedCategory('All');
        setSelectedPrice('all');
    };

    const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + (selectedPrice !== 'all' ? 1 : 0);

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'New Arrivals'}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
            </div>

            {/* Filters - Horizontal */}
            <div className="mb-8 rounded-lg bg-white p-4 shadow-sm border border-slate-200">
                <div className="space-y-4">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-3">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Men', 'Women', 'Kids'].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-3">Price Range</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedPrice('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPrice === 'all'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                All Prices
                            </button>
                            <button
                                onClick={() => setSelectedPrice('under500')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPrice === 'under500'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                Under ₹500
                            </button>
                            <button
                                onClick={() => setSelectedPrice('500-1000')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPrice === '500-1000'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                ₹500 - ₹1000
                            </button>
                            <button
                                onClick={() => setSelectedPrice('over1000')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPrice === 'over1000'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                Over ₹1000
                            </button>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {activeFiltersCount > 0 && (
                        <div className="pt-2 border-t border-slate-200">
                            <button
                                onClick={clearAllFilters}
                                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                <X className="h-4 w-4" />
                                Clear {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-lg text-slate-600">No products found matching your filters.</p>
                    <button
                        onClick={clearAllFilters}
                        className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="group relative">
                            <Link href={`/products/${product.id}`} className="block">
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-slate-200 lg:aspect-none group-hover:opacity-75 transition-opacity lg:h-80">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.image || '/placeholder.png'}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                        onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                                    />
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-700">
                                            {product.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">₹{product.price}</p>
                                </div>
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    addToCart(product, 'M', 'White');
                                }}
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
                            >
                                <ShoppingBag className="h-4 w-4" /> Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto p-8 text-center">Loading products...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
