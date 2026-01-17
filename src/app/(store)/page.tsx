"use client";

import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Clock, Zap } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { CategoryStrip } from "@/components/store/CategoryStrip";
import { HeroCarousel } from "@/components/store/HeroCarousel";

export default function LandingPage() {
  const { products } = useStore();
  // Set timer for 12 hours from now
  const targetDate = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);

  return (
    <div className="flex flex-col gap-6 pb-10 bg-slate-50">

      {/* Category Strip (Flipkart Style) */}
      <CategoryStrip />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Deals of the Day */}
      <section className="mx-2 rounded-xl bg-white p-4 shadow-sm sm:mx-4 sm:p-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800">Deals of the Day</h2>
            <div className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white animate-pulse">
              Ending Soon
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Time Left:</span>
            </div>
            <CountdownTimer targetDate={targetDate} />
            <Link href="/products" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
              VIEW ALL
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group relative block rounded-xl border border-slate-200 p-3 transition-all hover:shadow-lg">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-slate-100 relative">
                <div className="absolute left-2 top-2 z-10 rounded bg-green-600 px-2 py-1 text-[10px] font-bold text-white">
                  Special Offer
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image || '/placeholder.png'} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-sm font-medium text-slate-800 truncate">{product.name}</h3>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="text-sm text-green-600 font-bold">Min. 50% Off</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {product.category}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto mt-4 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Main Banner */}
          <Link href="/products?category=sale" className="group relative block overflow-hidden rounded-xl bg-emerald-600 md:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-transparent z-10"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800"
              alt="Big Sale"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <span className="mb-2 inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase text-slate-900">
                Limited Time
              </span>
              <h2 className="text-3xl font-bold text-white sm:text-5xl">Big Savings<br />On Fashion</h2>
              <button className="mt-6 rounded-full bg-white px-8 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50">
                Shop Now
              </button>
            </div>
          </Link>

          {/* Side Banners */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
            <Link href="/products?category=men" className="group relative block overflow-hidden rounded-xl bg-blue-600">
              <div className="absolute inset-0 bg-black/20 z-10 transition-colors group-hover:bg-black/30"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400"
                alt="Men's Collection"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-xl font-bold text-white">Men's Collection</h3>
                <p className="text-sm text-white/90">Up to 40% Off</p>
              </div>
            </Link>
            <Link href="/products?category=women" className="group relative block overflow-hidden rounded-xl bg-purple-600">
              <div className="absolute inset-0 bg-black/20 z-10 transition-colors group-hover:bg-black/30"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=400"
                alt="Women's Style"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-xl font-bold text-white">Women's Style</h3>
                <p className="text-sm text-white/90">New Arrivals</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 rounded-3xl bg-white px-8 py-12 shadow-sm sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-emerald-50 p-4">
              <Truck className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Direct to Village</h3>
            <p className="text-slate-500">Fast delivery to any pincode in India.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-emerald-50 p-4">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Secure Payments</h3>
            <p className="text-slate-500">100% safe transaction with UPI & COD.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-emerald-50 p-4">
              <Clock className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Easy Returns</h3>
            <p className="text-slate-500">Hassle-free 7 day replacement policy.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
