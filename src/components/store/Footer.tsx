import Link from 'next/link';
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Brand & About */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold italic text-white">R Mart</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            R Mart is your go-to destination for affordable and stylish fashion.
                            We believe everyone deserves to look their best without breaking the bank.
                            Discover the latest trends for men, women, and kids with quality you can trust.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Column 2: Shop */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Shop</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/products?category=Men" className="hover:text-primary transition-colors">Men's Fashion</Link></li>
                            <li><Link href="/products?category=Women" className="hover:text-primary transition-colors">Women's Fashion</Link></li>
                            <li><Link href="/products?category=Kids" className="hover:text-primary transition-colors">Kids Collection</Link></li>
                            <li><Link href="/products?category=Accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">FAQs</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>123 Fashion Street, <br />Tech City, Bangalore - 560001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>support@rmart.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} R Mart India Private Limited. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
