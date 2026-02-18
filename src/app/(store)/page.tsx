"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, Clock, Zap, Star, ChevronRight, Heart, Eye, Mail } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { CategoryStrip } from "@/components/store/CategoryStrip";
import { HeroCarousel } from "@/components/store/HeroCarousel";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { Product } from "@/lib/data";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Priya Sharma", location: "Delhi", text: "Amazing quality! The fabric is so soft and the delivery was super fast. R Mart is now my go-to store.", rating: 5, avatar: "PS" },
  { name: "Rahul Verma", location: "Mumbai", text: "Best prices I've found online. The return policy is hassle-free. Highly recommend for budget shopping!", rating: 5, avatar: "RV" },
  { name: "Anita Patel", location: "Bangalore", text: "Love the kids' collection! My children adore the designs. Will definitely order again.", rating: 4, avatar: "AP" },
  { name: "Vikash Kumar", location: "Patna", text: "Ordered a formal shirt for office. Perfect fit and great stitching quality. превосходный experience!", rating: 5, avatar: "VK" },
];

const brands = ["Nike", "Adidas", "Puma", "Levi's", "H&M", "Zara", "Raymond", "Allen Solly", "Peter England", "Van Heusen"];

export default function LandingPage() {
  const { products, addToWishlist, removeFromWishlist, wishlist } = useStore();
  const targetDate = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rmart-recently-viewed');
    if (saved) {
      const ids: string[] = JSON.parse(saved);
      const viewed = ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
      setRecentlyViewed(viewed);
    }
  }, [products]);

  const newArrivals = products.slice(0, 6);
  const trending = [...products].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0)).slice(0, 8);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <CategoryStrip overlay={false} />
      <div className="relative">
        <HeroCarousel />
      </div>

      {/* Deals of the Day */}
      <section className="mx-2 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm sm:mx-4 sm:p-6 border border-slate-100 dark:border-slate-800">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">⚡ Deals of the Day</h2>
            <div className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white animate-pulse">
              Ending Soon
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Time Left:</span>
            </div>
            <CountdownTimer targetDate={targetDate} />
            <Link href="/products" className="rounded-md bg-blue-600 px-3 py-1.5 text-xs sm:text-sm font-bold text-white hover:bg-blue-700">
              VIEW ALL
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => {
            const isWished = wishlist.some(w => w.id === product.id);
            return (
              <div key={product.id} className="group relative block rounded-xl border border-slate-200 dark:border-slate-700 p-2 sm:p-3 transition-all hover:shadow-lg bg-white dark:bg-slate-800">
                {/* Wishlist + Quick View buttons */}
                <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => isWished ? removeFromWishlist(product.id) : addToWishlist(product)}
                    className={`rounded-full p-1.5 shadow-md transition-all ${isWished ? 'bg-red-50 dark:bg-red-900/30 text-red-500' : 'bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500'}`}
                  >
                    <Heart className={`h-4 w-4 ${isWished ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setQuickViewProduct(product)}
                    className="rounded-full bg-white dark:bg-slate-700 p-1.5 shadow-md text-slate-400 hover:text-primary transition-all"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                <Link href={`/products/${product.id}`}>
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700 relative">
                    <div className="absolute left-2 top-2 z-10 rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Special
                    </div>
                    <Image
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <h3 className="text-xs sm:text-sm font-medium text-slate-800 dark:text-white truncate">{product.name}</h3>
                    <div className="mt-1 flex items-center justify-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">₹{product.price}</span>
                      <span className="text-xs text-green-600 dark:text-green-400 font-bold">Min. 50% Off</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trending Now */}
      <section className="mx-2 sm:mx-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Trending Now</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            See All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {trending.map((product, i) => {
            const isWished = wishlist.some(w => w.id === product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex-shrink-0 w-[160px] sm:w-[200px]"
              >
                <div className="relative rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
                  <button
                    onClick={() => isWished ? removeFromWishlist(product.id) : addToWishlist(product)}
                    className={`absolute right-2 top-2 z-10 rounded-full p-1.5 transition-all ${isWished ? 'bg-red-50 dark:bg-red-900/30 text-red-500' : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-red-500'}`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isWished ? 'fill-current' : ''}`} />
                  </button>
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-700">
                      <Image
                        src={product.image || '/placeholder.png'}
                        alt={product.name}
                        width={200}
                        height={267}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-medium text-slate-800 dark:text-white truncate">{product.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">₹{product.price}</span>
                        {product.avgRating && product.avgRating > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded font-bold">
                            {product.avgRating.toFixed(1)} <Star className="h-2.5 w-2.5 fill-current" />
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto mt-4 px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Main Banner */}
          <Link href="/products?category=sale" className="group relative block overflow-hidden rounded-xl bg-emerald-600 md:col-span-2 h-[200px] sm:h-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-transparent z-10"></div>
            <Image
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800"
              alt="Big Sale"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 z-20">
              <span className="mb-2 inline-block rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase text-slate-900">
                Limited Time
              </span>
              <h2 className="text-2xl font-bold text-white sm:text-5xl">Big Savings<br />On Fashion</h2>
              <button className="mt-4 rounded-full bg-white px-6 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
                Shop Now
              </button>
            </div>
          </Link>

          {/* Side Banners */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-1">
            <Link href="/products?category=men" className="group relative block overflow-hidden rounded-xl bg-blue-600 h-[150px] sm:h-auto">
              <div className="absolute inset-0 bg-black/20 z-10 transition-colors group-hover:bg-black/30"></div>
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400"
                alt="Men's Collection"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 p-4 z-20">
                <h3 className="text-sm sm:text-xl font-bold text-white">Men</h3>
                <p className="hidden sm:block text-sm text-white/90">Up to 40% Off</p>
              </div>
            </Link>
            <Link href="/products?category=women" className="group relative block overflow-hidden rounded-xl bg-purple-600 h-[150px] sm:h-auto">
              <div className="absolute inset-0 bg-black/20 z-10 transition-colors group-hover:bg-black/30"></div>
              <Image
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=400"
                alt="Women's Style"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 p-4 z-20">
                <h3 className="text-sm sm:text-xl font-bold text-white">Women</h3>
                <p className="hidden sm:block text-sm text-white/90">New Arrivals</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-2 sm:mx-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">🆕 New Arrivals</h2>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {newArrivals.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/products/${product.id}`} className="group block rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
                <div className="aspect-[3/4] relative overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <span className="absolute left-2 top-2 z-10 rounded bg-violet-600 px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
                  <Image src={product.image || '/placeholder.png'} alt={product.name} fill sizes="(max-width: 640px) 50vw, 16vw" className="object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="p-2 text-center">
                  <h3 className="text-xs font-medium text-slate-800 dark:text-white truncate">{product.name}</h3>
                  <p className="text-sm font-bold text-primary mt-0.5">₹{product.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="mx-2 sm:mx-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 px-2">🏷️ Shop by Brand</h2>
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {brands.map((brand, i) => (
            <Link
              key={brand}
              href={`/products?search=${encodeURIComponent(brand)}`}
              className="flex-shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary dark:hover:text-primary hover:shadow-md transition-all"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="mx-2 sm:mx-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 px-2">💬 What Our Customers Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="mx-2 sm:mx-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 px-2">👀 Recently Viewed</h2>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {recentlyViewed.map(product => (
              <Link key={product.id} href={`/products/${product.id}`} className="flex-shrink-0 w-[140px] group">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700">
                  <Image src={product.image || '/placeholder.png'} alt={product.name} width={140} height={140} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-2 truncate">{product.name}</p>
                <p className="text-xs font-bold text-primary">₹{product.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="mx-2 sm:mx-4">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-emerald-500 p-6 sm:p-10 text-center text-white">
          <Mail className="h-10 w-10 mx-auto mb-3 opacity-80" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Stay in the Loop!</h2>
          <p className="text-sm opacity-90 mb-6 max-w-md mx-auto">Subscribe to get exclusive deals, new arrivals, and fashion tips delivered to your inbox.</p>
          {subscribed ? (
            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg font-bold">🎉 You&apos;re subscribed! Welcome aboard.</motion.p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button type="submit" className="rounded-lg bg-white text-primary px-5 py-2.5 text-sm font-bold hover:bg-emerald-50 transition-colors">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-2 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-white dark:bg-slate-800 px-2 py-4 shadow-sm sm:gap-8 sm:rounded-3xl sm:px-8 sm:py-12 border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 p-2 sm:mb-4 sm:p-4">
              <Truck className="h-5 w-5 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mb-1 text-[10px] sm:text-xl font-bold text-slate-900 dark:text-white">Fast Delivery</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 p-2 sm:mb-4 sm:p-4">
              <ShieldCheck className="h-5 w-5 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mb-1 text-[10px] sm:text-xl font-bold text-slate-900 dark:text-white">Secure Pay</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 p-2 sm:mb-4 sm:p-4">
              <Clock className="h-5 w-5 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mb-1 text-[10px] sm:text-xl font-bold text-slate-900 dark:text-white">Easy Returns</h3>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
