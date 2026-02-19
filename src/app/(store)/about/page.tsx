"use client";

import FadeIn from '@/components/animations/FadeIn';
import { CheckCircle2, ShoppingBag, Users, Globe, Award } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <FadeIn>
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl mb-6">
                        We Are <span className="text-primary">R Mart</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                        Redefining online shopping with quality, affordability, and style. We are more than just a marketplace; we are a community of fashion enthusiasts.
                    </p>
                </div>
            </FadeIn>

            {/* Our Story Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                <FadeIn direction="right">
                    <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                        {/* Placeholder for About Us Image */}
                        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <ShoppingBag className="h-24 w-24 text-slate-400" />
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Fashion Store"
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => (e.target as HTMLImageElement).style.opacity = '0'}
                        />
                    </div>
                </FadeIn>
                <FadeIn direction="left" delay={0.2}>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Our Story</h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300">
                            <p>
                                Founded in 2024, R Mart started with a simple mission: to make premium fashion accessible to everyone. What began as a small collection of curated items has now grown into a comprehensive destination for trendy apparel and accessories.
                            </p>
                            <p>
                                We believe that style shouldn&apos;t come with a compromise. That&apos;s why we work directly with manufacturers to bring you high-quality products at prices that make sense.
                            </p>
                            <p>
                                Today, R Mart serves thousands of customers across India, delivering happiness one package at a time. Our commitment to customer satisfaction and product quality remains unchanged.
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Stats/Values Section */}
            <FadeIn direction="up" delay={0.3}>
                <div className="bg-slate-900 rounded-3xl p-8 md:p-12 mb-24 text-white">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">500+</div>
                            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Products</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">50+</div>
                            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Brands</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Support</div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Why Choose Us */}
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose R Mart?</h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    We strive to offer the best shopping experience possible.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                    {
                        icon: Award,
                        title: "High Quality",
                        desc: "Every product is quality checked before shipping to ensure you get the best."
                    },
                    {
                        icon: Globe,
                        title: "Nationwide Delivery",
                        desc: "We deliver to every pincode in India with our reliable logistics partners."
                    },
                    {
                        icon: Users,
                        title: "Customer First",
                        desc: "Our dedicated support team is always ready to assist you with any queries."
                    }
                ].map((item, i) => (
                    <FadeIn key={i} delay={i * 0.1} direction="up">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-center">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                                <item.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                        </div>
                    </FadeIn>
                ))}
            </div>

            {/* Team Section (Optional) */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">Meet The Creator</h2>
                <div className="flex justify-center">
                    <FadeIn delay={0.2}>
                        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg max-w-sm">
                            <div className="aspect-[4/5] w-full overflow-hidden bg-slate-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://ui-avatars.com/api/?name=Shailendra+Singh&background=059669&color=fff&size=512"
                                    alt="Shailendra Singh"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Shailendra Singh</h3>
                                <p className="text-primary font-medium mb-4">Founder & Developer</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Passionate about building scalable web applications and intuitive user experiences.
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

        </div>
    );
}
