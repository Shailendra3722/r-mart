"use client";

import Link from "next/link";
import { Shirt, ShoppingBag, Gift, Baby, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CategoryStrip() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const router = useRouter();

    const categories = [
        {
            name: "Men",
            icon: <Shirt className="h-6 w-6" />,
            href: "/products?category=Men",
            sub: [
                { name: "T-Shirts", href: "/products?category=Men&search=T-Shirt" },
                { name: "Shirts", href: "/products?category=Men&search=Shirt" },
                { name: "Jeans", href: "/products?category=Men&search=Jeans" },
                { name: "Lowers", href: "/products?category=Men&search=Lower" },
            ]
        },
        {
            name: "Women",
            icon: <Shirt className="h-6 w-6" />,
            href: "/products?category=Women",
            sub: [
                { name: "Dresses", href: "/products?category=Women&search=Dress" },
                { name: "Tops", href: "/products?category=Women&search=Top" },
                { name: "Jeans", href: "/products?category=Women&search=Jeans" },
                { name: "Ethnic", href: "/products?category=Women&search=Ethnic" },
            ]
        },
        {
            name: "Kids",
            icon: <Baby className="h-6 w-6" />,
            href: "/products?category=Kids",
            sub: [
                { name: "T-Shirts", href: "/products?category=Kids&search=T-Shirt" },
                { name: "Jeans", href: "/products?category=Kids&search=Jeans" },
                { name: "Sets", href: "/products?category=Kids&search=Set" },
                { name: "Dresses", href: "/products?category=Kids&search=Dress" },
            ]
        },
        { name: "New Arrivals", icon: <Gift className="h-6 w-6" />, href: "/products?sort=new" },
        { name: "Sale", icon: <ShoppingBag className="h-6 w-6" />, href: "/products?sort=sale" },
    ];

    return (
        <div className="w-full bg-white shadow-sm relative z-40">
            <div className="container mx-auto flex items-center justify-between gap-4 overflow-x-auto px-4 py-3 pb-4 sm:px-6 lg:justify-center lg:gap-12 lg:px-8 no-scrollbar">
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        className="group relative flex flex-col items-center gap-2 cursor-pointer"
                        onMouseEnter={() => setActiveCategory(cat.name)}
                        onMouseLeave={() => setActiveCategory(null)}
                        onClick={() => {
                            if (!cat.sub) router.push(cat.href);
                        }}
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover:bg-slate-100">
                            <div className="text-slate-700 group-hover:text-primary">
                                {cat.icon}
                            </div>
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-primary whitespace-nowrap">
                            {cat.name}
                        </span>

                        {/* Mega Menu / Dropdown */}
                        {cat.sub && activeCategory === cat.name && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                                {/* Triangle Arrow */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-slate-100"></div>

                                <div className="relative py-1 bg-white rounded-md">
                                    <Link
                                        href={cat.href}
                                        className="block px-4 py-2 text-sm font-bold text-primary hover:bg-slate-50 border-b border-slate-100"
                                    >
                                        View All {cat.name}
                                    </Link>
                                    {cat.sub.map((subItem) => (
                                        <Link
                                            key={subItem.name}
                                            href={subItem.href}
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
                                        >
                                            {subItem.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
