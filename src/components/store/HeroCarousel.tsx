"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "../animations/FadeIn";

const slides = [
    {
        id: 1,
        title: "Festival Special Collection",
        subtitle: "Best Fashion for Your Family",
        description: "Bringing the latest trends from across India to your doorstep at prices you'll love.",
        cta: "Shop Collection",
        link: "/products",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200",
        color: "bg-emerald-900",
        accent: "text-lime-400"
    },
    {
        id: 2,
        title: "New Arrivals",
        subtitle: "Summer Vibes are Here",
        description: "Light, breathable fabrics perfect for the upcoming season. refresh your wardrobe now.",
        cta: "Explore Now",
        link: "/products?category=women",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200",
        color: "bg-blue-900",
        accent: "text-sky-300"
    },
    {
        id: 3,
        title: "Men's Premium",
        subtitle: "Upgrade Your Style",
        description: "Premium shirts, jeans, and accessories designed for the modern man.",
        cta: "Shop Men",
        link: "/products?category=men",
        image: "https://images.unsplash.com/photo-1488161628813-99425205f28d?auto=format&fit=crop&q=80&w=1200",
        color: "bg-slate-900",
        accent: "text-amber-400"
    },
    {
        id: 4,
        title: "Kid's Corner",
        subtitle: "Playful & Durable",
        description: "Comfortable clothing for your little ones that stands up to playtime.",
        cta: "For Kids",
        link: "/products?category=kids",
        image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=1200",
        color: "bg-purple-900",
        accent: "text-pink-300"
    },
    {
        id: 5,
        title: "Clearance Sale",
        subtitle: "Up to 70% Off",
        description: "Last chance to grab these styles before they are gone forever.",
        cta: "Grab Deal",
        link: "/products?category=sale",
        image: "https://images.unsplash.com/photo-1472851294608-4151053804d5?auto=format&fit=crop&q=80&w=1200",
        color: "bg-red-900",
        accent: "text-yellow-300"
    }
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    // Auto-slide every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    return (
        <div className="relative mx-2 mt-2 overflow-hidden rounded-xl sm:mx-4 group z-0">
            <div
                className="flex transition-transform duration-500 ease-out h-[400px] sm:h-[500px]"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className={`relative min-w-full flex-shrink-0 ${slide.color}`}
                    >
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={slide.image}
                                alt={slide.subtitle}
                                className="h-full w-full object-cover opacity-40"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="relative container mx-auto flex h-full flex-col justify-center px-6 text-white sm:px-12 lg:px-16">
                            <FadeIn direction="down" delay={0.1}>
                                <span className="mb-4 inline-block w-fit rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                                    {slide.title}
                                </span>
                            </FadeIn>

                            <FadeIn direction="left" delay={0.2}>
                                <h1 className="mb-4 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
                                    {slide.subtitle.split(' ').slice(0, 2).join(' ')} <br />
                                    <span className={slide.accent}>{slide.subtitle.split(' ').slice(2).join(' ')}</span>
                                </h1>
                            </FadeIn>

                            <FadeIn direction="up" delay={0.3}>
                                <p className="mb-8 max-w-xl text-lg text-white/90 sm:text-xl">
                                    {slide.description}
                                </p>
                            </FadeIn>

                            <FadeIn direction="up" delay={0.4}>
                                <div className="flex gap-4">
                                    <Link
                                        href={slide.link}
                                        className="flex items-center rounded-full bg-white px-8 py-3 text-base font-bold text-slate-900 transition-colors hover:bg-slate-100"
                                    >
                                        {slide.cta} <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows (Visible on Hover) */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-white/20 group-hover:opacity-100"
            >
                <ChevronLeft className="h-8 w-8" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-white/20 group-hover:opacity-100"
            >
                <ChevronRight className="h-8 w-8" />
            </button>

            {/* Dots Indicators */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${current === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/70"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
