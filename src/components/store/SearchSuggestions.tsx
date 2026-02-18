"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function SearchSuggestions() {
    const { products } = useStore();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('rmart-recent-searches');
        if (saved) setRecentSearches(JSON.parse(saved));
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const matchingProducts = query.trim().length >= 2
        ? products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6)
        : [];

    const trendingProducts = products.slice(0, 4);

    const saveSearch = (term: string) => {
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('rmart-recent-searches', JSON.stringify(updated));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            saveSearch(query.trim());
            router.push(`/products?search=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    const handleSelectProduct = (productId: string, productName: string) => {
        saveSearch(productName);
        router.push(`/products/${productId}`);
        setIsOpen(false);
        setQuery('');
    };

    const handleSelectSearch = (term: string) => {
        setQuery(term);
        saveSearch(term);
        router.push(`/products?search=${encodeURIComponent(term)}`);
        setIsOpen(false);
    };

    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('rmart-recent-searches');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const total = matchingProducts.length;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % total);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + total) % total);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            const p = matchingProducts[selectedIndex];
            handleSelectProduct(p.id, p.name);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const showDropdown = isOpen && (query.trim().length >= 2 || recentSearches.length > 0 || trendingProducts.length > 0);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1); }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="block w-full rounded-lg border-0 bg-slate-100 dark:bg-slate-800 py-2.5 pl-10 pr-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    placeholder="Search for products, brands and more"
                />
            </form>

            {showDropdown && (
                <div className="absolute top-full mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Search Results */}
                    {matchingProducts.length > 0 && (
                        <div className="p-2">
                            <p className="px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Products</p>
                            {matchingProducts.map((product, index) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleSelectProduct(product.id, product.name)}
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${index === selectedIndex ? 'bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                >
                                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-700">
                                        <Image
                                            src={product.image || '/placeholder.png'}
                                            alt={product.name}
                                            width={40}
                                            height={40}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{product.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{product.category} · ₹{product.price}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {query.trim().length >= 2 && matchingProducts.length === 0 && (
                        <div className="px-4 py-6 text-center">
                            <Search className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">No products found for &ldquo;{query}&rdquo;</p>
                        </div>
                    )}

                    {/* Recent Searches */}
                    {query.trim().length < 2 && recentSearches.length > 0 && (
                        <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between px-3 py-1.5">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recent Searches</p>
                                <button onClick={clearRecent} className="text-xs text-primary hover:underline">Clear</button>
                            </div>
                            {recentSearches.map((term, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelectSearch(term)}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{term}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Trending */}
                    {query.trim().length < 2 && trendingProducts.length > 0 && (
                        <div className="p-2">
                            <p className="px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> Trending
                            </p>
                            {trendingProducts.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleSelectProduct(product.id, product.name)}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-slate-700">
                                        <Image src={product.image || '/placeholder.png'} alt={product.name} width={32} height={32} className="h-full w-full object-cover" />
                                    </div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{product.name}</span>
                                    <span className="text-xs text-slate-400 ml-auto">₹{product.price}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
