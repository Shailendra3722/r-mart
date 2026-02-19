"use client";

import { useState } from 'react';
import { Plus, Minus, Search } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

type FAQItem = {
    question: string;
    answer: string;
    category: string;
};

const faqs: FAQItem[] = [
    {
        category: 'Orders',
        question: 'How can I track my order?',
        answer: 'You can track your order status in real-time by logging into your account and navigating to the "My Orders" section. You will also receive SMS and email updates at every stage of the delivery.'
    },
    {
        category: 'Orders',
        question: 'Can I cancel my order?',
        answer: 'Yes, you can cancel your order before it gets shipped directly from the "My Orders" page. If the order has already been shipped, you can refuse acceptance at the time of delivery.'
    },
    {
        category: 'Payments',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD) for most locations.'
    },
    {
        category: 'Payments',
        question: 'Is it safe to use my card on R Mart?',
        answer: 'Absolutely. We use Razorpay, a secure payment gateway that is PCI-DSS compliant. Your card details are never stored on our servers.'
    },
    {
        category: 'Shipping',
        question: 'Do you ship internationally?',
        answer: 'Currently, R Mart only ships within India. We are working on expanding our services to other countries soon.'
    },
    {
        category: 'Returns',
        question: 'What is your return policy?',
        answer: 'We offer a hassle-free 7-day return policy for all unused products with original tags and packaging intact. Refunds are processed within 5-7 business days after we receive the item.'
    },
    {
        category: 'Account',
        question: 'I forgot my password. What should I do?',
        answer: 'Click on the "Forgot Password" link on the login page. We will send you an OTP or a link to your registered email/phone to reset your password.'
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-3xl">
            <FadeIn>
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300">
                        Find answers to the most common questions about R Mart.
                    </p>
                </div>
            </FadeIn>

            {/* Search */}
            <FadeIn delay={0.1}>
                <div className="relative mb-12">
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 pl-12 pr-4 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
            </FadeIn>

            {/* FAQ List */}
            <div className="space-y-4">
                {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => (
                        <FadeIn key={index} delay={index * 0.05} direction="up">
                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                                >
                                    <span className="font-semibold text-slate-900 dark:text-white pr-8">
                                        {faq.question}
                                    </span>
                                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 transition-all ${openIndex === index ? 'bg-primary border-primary text-white rotate-180' : 'text-slate-500'}`}>
                                        {openIndex === index ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 mt-2 pt-4">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <p>No questions found matching &quot;{searchQuery}&quot;</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="text-primary mt-2 hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>

            {/* Still have questions */}
            <div className="mt-16 text-center border-t border-slate-200 dark:border-slate-700 pt-12">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Still have questions?</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Can&apos;t find the answer you&apos;re looking for? Please contact our friendly support team.
                </p>
                <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-emerald-600 transition-all"
                >
                    Contact Support
                </a>
            </div>
        </div>
    );
}
