"use client";

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, Check, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, placeOrder } = useStore();
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);
    const [showPinInput, setShowPinInput] = useState(false);
    const [pin, setPin] = useState('');
    const [validationError, setValidationError] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    // Address State
    const [addressDetails, setAddressDetails] = useState({
        name: '',
        mobile: '',
        pincode: '',
        city: '',
        state: '',
        address: '',
        landmark: ''
    });

    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Indian States List
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
    ];

    // Validation function
    const validateAddress = () => {
        if (!addressDetails.name.trim()) {
            setValidationError('Please enter your full name');
            return false;
        }
        if (addressDetails.mobile.length !== 10) {
            setValidationError('Please enter a valid 10-digit mobile number');
            return false;
        }
        if (addressDetails.pincode.length !== 6) {
            setValidationError('Please enter a valid 6-digit pincode');
            return false;
        }
        if (!addressDetails.city.trim()) {
            setValidationError('Please enter your city');
            return false;
        }
        if (!addressDetails.state) {
            setValidationError('Please select your state');
            return false;
        }
        if (!addressDetails.address.trim()) {
            setValidationError('Please enter your complete address');
            return false;
        }
        if (!addressDetails.landmark.trim()) {
            setValidationError('Please enter a landmark for delivery');
            return false;
        }
        setValidationError('');
        return true;
    };

    // Get current location
    const handleUseCurrentLocation = async () => {
        if (!navigator.geolocation) {
            setValidationError('Geolocation is not supported by your browser');
            return;
        }

        setIsLoadingLocation(true);
        setValidationError('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Note: OpenStreetMap Nominatim API (free, no API key required)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    if (data.address) {
                        setAddressDetails(prev => ({
                            ...prev,
                            address: data.display_name || '',
                            city: data.address.city || data.address.town || data.address.village || '',
                            state: data.address.state || '',
                            pincode: data.address.postcode || '',
                            landmark: data.address.suburb || data.address.neighbourhood || ''
                        }));
                    }
                } catch (error) {
                    console.error('Geocoding error:', error);
                    setValidationError('Failed to get address from location. Please enter manually.');
                } finally {
                    setIsLoadingLocation(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                setValidationError('Unable to access your location. Please enable location services.');
                setIsLoadingLocation(false);
            }
        );
    };

    const handleCheckout = () => {
        if (!showPinInput) {
            setShowPinInput(true);
            return;
        }

        if (!validateAddress()) {
            return;
        }

        if (pin.length !== 4) {
            alert("Please enter a valid 4-digit PIN");
            return;
        }

        // Simulating success after payment
        setTimeout(() => {
            placeOrder(addressDetails, 'Cash on Delivery');
            setSuccess(true);
        }, 2000);
    };

    if (success) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Order Placed Successfully!</h1>
                <p className="mt-4 text-slate-500">Thank you for shopping with R Mart. Your order #RM-{Math.floor(Math.random() * 10000)} has been confirmed.</p>
                <Link href="/" className="mt-8 rounded-full bg-primary px-8 py-3 font-semibold text-white hover:bg-emerald-700">
                    Continue Shopping
                </Link>
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-6">
                    <ShoppingBag className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
                <p className="mt-2 text-slate-500">Looks like you haven't added anything yet.</p>
                <Link href="/products" className="mt-6 rounded-md bg-primary px-6 py-2.5 font-medium text-white hover:bg-emerald-700">
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-bold text-slate-900">
                {step === 1 ? 'Shopping Cart' : step === 2 ? 'Delivery Address' : 'Payment Method'}
            </h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                <section aria-labelledby="cart-heading" className="lg:col-span-7">
                    {step === 1 && (
                        <ul role="list" className="divide-y divide-slate-200 border-b border-t border-slate-200">
                            {cart.map((item) => (
                                <li key={item.cartId} className="flex py-6 sm:py-10">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 sm:h-32 sm:w-32">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full bg-slate-200 object-cover object-center"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder.png'
                                            }}
                                        />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm">
                                                        <Link href={`/products/${item.id}`} className="font-medium text-slate-700 hover:text-slate-800">{item.name}</Link>
                                                    </h3>
                                                </div>
                                                <div className="mt-1 flex text-sm">
                                                    <p className="text-slate-500">{item.selectedColor}</p>
                                                    <p className="ml-4 border-l border-slate-200 pl-4 text-slate-500">{item.selectedSize}</p>
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-slate-900">₹{item.price}</p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => updateQuantity(item.cartId, -1)} className="rounded-md border p-1 hover:bg-slate-50"><Minus className="h-4 w-4" /></button>
                                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.cartId, 1)} className="rounded-md border p-1 hover:bg-slate-50"><Plus className="h-4 w-4" /></button>
                                                </div>
                                                <div className="absolute right-0 top-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.cartId)}
                                                        className="-m-2 inline-flex p-2 text-slate-400 hover:text-slate-500"
                                                    >
                                                        <span className="sr-only">Remove</span>
                                                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {step === 2 && (
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            {/* Location Button */}
                            <button
                                type="button"
                                onClick={handleUseCurrentLocation}
                                disabled={isLoadingLocation}
                                className="mb-4 w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-70"
                            >
                                {isLoadingLocation ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Getting Location...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Use Current Location
                                    </>
                                )}
                            </button>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Full Name</label>
                                    <input
                                        type="text"
                                        value={addressDetails.name}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="e.g. Rahul Sharma"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={addressDetails.mobile}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, mobile: e.target.value.replace(/\D/g, '') })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="10-digit mobile number"
                                        maxLength={10}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Pincode</label>
                                    <input
                                        type="text"
                                        value={addressDetails.pincode}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, pincode: e.target.value.replace(/\D/g, '') })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Enter 6-digit pincode"
                                        maxLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">City *</label>
                                    <input
                                        type="text"
                                        value={addressDetails.city}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, city: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Enter your city"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">State *</label>
                                    <select
                                        value={addressDetails.state}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    >
                                        <option value="">-- Select State --</option>
                                        {indianStates.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Address (House No, Building, Street, Area)</label>
                                    <textarea
                                        rows={3}
                                        value={addressDetails.address}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, address: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Full address"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Village / Landmark (Required for delivery)</label>
                                    <input
                                        type="text"
                                        value={addressDetails.landmark}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, landmark: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Describe a famous building, shop, or temple nearby"
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            {validationError && (
                                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                    <p className="text-sm text-red-800 font-medium">{validationError}</p>
                                    <p className="text-xs text-red-600 mt-1">Please go back and complete all required address fields</p>
                                </div>
                            )}

                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Payment Method</h3>

                            {/* Online Payment Options */}
                            <div className="space-y-3">
                                {/* Google Pay */}
                                <div
                                    onClick={() => {
                                        if (!validateAddress()) return;
                                        setSelectedPayment('Google Pay');
                                        setShowPaymentModal(true);
                                    }}
                                    className="cursor-pointer rounded-lg border-2 border-slate-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md"
                                >
                                    <div className="flex items-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                                            <span className="text-2xl">💳</span>
                                        </div>
                                        <div className="ml-4">
                                            <span className="block font-semibold text-slate-900">Google Pay</span>
                                            <span className="text-xs text-slate-600">Pay securely via GPay</span>
                                        </div>
                                        <span className="ml-auto rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-800">INSTANT</span>
                                    </div>
                                </div>

                                {/* PhonePe */}
                                <div
                                    onClick={() => {
                                        if (!validateAddress()) return;
                                        setSelectedPayment('PhonePe');
                                        setShowPaymentModal(true);
                                    }}
                                    className="cursor-pointer rounded-lg border-2 border-slate-200 bg-white p-4 transition-all hover:border-purple-500 hover:shadow-md"
                                >
                                    <div className="flex items-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                                            <span className="text-2xl">📱</span>
                                        </div>
                                        <div className="ml-4">
                                            <span className="block font-semibold text-slate-900">PhonePe</span>
                                            <span className="text-xs text-slate-600">Pay via PhonePe UPI</span>
                                        </div>
                                        <span className="ml-auto rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-800">INSTANT</span>
                                    </div>
                                </div>

                                {/* Paytm */}
                                <div
                                    onClick={() => {
                                        if (!validateAddress()) return;
                                        setSelectedPayment('Paytm');
                                        setShowPaymentModal(true);
                                    }}
                                    className="cursor-pointer rounded-lg border-2 border-slate-200 bg-white p-4 transition-all hover:border-cyan-500 hover:shadow-md"
                                >
                                    <div className="flex items-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50">
                                            <span className="text-2xl">💰</span>
                                        </div>
                                        <div className="ml-4">
                                            <span className="block font-semibold text-slate-900">Paytm</span>
                                            <span className="text-xs text-slate-600">Pay using Paytm Wallet</span>
                                        </div>
                                        <span className="ml-auto rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-800">INSTANT</span>
                                    </div>
                                </div>

                                {/* UPI ID */}
                                <div
                                    onClick={() => {
                                        if (!validateAddress()) return;
                                        setSelectedPayment('UPI ID');
                                        setShowPaymentModal(true);
                                    }}
                                    className="cursor-pointer rounded-lg border-2 border-slate-200 bg-white p-4 transition-all hover:border-orange-500 hover:shadow-md"
                                >
                                    <div className="flex items-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                                            <span className="text-2xl">🔗</span>
                                        </div>
                                        <div className="ml-4">
                                            <span className="block font-semibold text-slate-900">UPI ID</span>
                                            <span className="text-xs text-slate-600">Pay using any UPI app</span>
                                        </div>
                                    </div>
                                </div>

                                {/* COD Option */}
                                <div
                                    onClick={() => {
                                        if (!validateAddress()) return;
                                        placeOrder(addressDetails, 'Cash on Delivery');
                                        setSuccess(true);
                                    }}
                                    className="cursor-pointer rounded-lg border-2 border-emerald-600 bg-emerald-50 p-4 transition-all hover:bg-emerald-100"
                                >
                                    <div className="flex items-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                            <span className="text-2xl">💵</span>
                                        </div>
                                        <div className="ml-4">
                                            <span className="block font-semibold text-slate-900">Cash on Delivery (COD)</span>
                                            <span className="text-xs text-slate-600">Pay when you receive the order</span>
                                        </div>
                                        <span className="ml-auto rounded bg-emerald-200 px-2 py-1 text-xs font-bold text-emerald-800">RECOMMENDED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Order summary */}
                <section
                    aria-labelledby="summary-heading"
                    className="mt-16 rounded-lg bg-slate-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
                >
                    {/* ... (Summary content remains same) ... */}
                    <h2 id="summary-heading" className="text-lg font-medium text-slate-900">
                        Order summary
                    </h2>

                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                            <dt className="flex items-center text-sm text-slate-600">
                                <span>Subtotal</span>
                            </dt>
                            <dd className="text-sm font-medium text-slate-900">₹{cartTotal}</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                            <dt className="flex text-sm text-slate-600">
                                <span>Shipping estimate</span>
                            </dt>
                            <dd className="text-sm font-medium text-green-600">Free</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                            <dt className="flex text-sm text-slate-600">
                                <span>Discount</span>
                            </dt>
                            <dd className="text-sm font-medium text-green-600">
                                {cartTotal > 0 ? '-₹100' : '₹0'}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                            <dt className="text-base font-medium text-slate-900">Order total</dt>
                            <dd className="text-base font-medium text-slate-900">
                                ₹{cartTotal > 100 ? cartTotal - 100 : cartTotal > 0 ? 0 : 0}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-6">
                        {step === 1 && (
                            <button
                                onClick={() => setStep(2)}
                                className="w-full rounded-md border border-transparent bg-emerald-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            >
                                Proceed to Address <ArrowRight className="inline ml-2 h-4 w-4" />
                            </button>
                        )}

                        {step === 2 && (
                            <div className="space-y-3">
                                {validationError && (
                                    <div className="rounded-md bg-red-50 p-3 border border-red-200">
                                        <p className="text-sm text-red-800 font-medium">{validationError}</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        if (validateAddress()) {
                                            setStep(3);
                                        }
                                    }}
                                    className="w-full rounded-md border border-transparent bg-emerald-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                >
                                    Proceed to Payment <ArrowRight className="inline ml-2 h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full text-sm text-slate-500 hover:text-slate-900"
                                >
                                    Back to Cart
                                </button>
                            </div>
                        )}

                        {/* Step 3 Button Removed as it is now inside the main section for PIN */}

                    </div>
                    <p className="mt-4 text-center text-xs text-slate-500">
                        100% Secure Checkout with 7-Day Returns
                    </p>
                </section>
            </div>

            {/* UPI Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">Complete Payment</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
                        </div>
                        {paymentProcessing ? (
                            <div className="text-center">
                                <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                                <p className="text-sm text-slate-600">Verifying payment...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* QR Code Display */}
                                <div className="flex justify-center">
                                    <div className="overflow-hidden rounded-lg border-2 border-slate-200">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="/payment-qr.jpg"
                                            alt="Payment QR Code"
                                            className="h-64 w-64 object-contain"
                                            onError={(e) => {
                                                // Fallback if image fails, though it shouldn't as we placed it in public
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-lg bg-blue-50 p-4 text-left">
                                    <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 text-xs">1</span>
                                        Scan & Pay
                                    </h4>
                                    <p className="text-sm text-blue-800 ml-7">Scan the QR code above using {selectedPayment} or any UPI app to pay <strong>₹{cartTotal > 100 ? cartTotal - 100 : cartTotal}</strong>.</p>
                                </div>

                                <div className="rounded-lg bg-yellow-50 p-4 text-left">
                                    <h4 className="font-semibold text-yellow-900 flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-200 text-xs">2</span>
                                        Enter Transaction ID
                                    </h4>
                                    <p className="text-sm text-yellow-800 ml-7 mb-2">After payment, enter the 12-digit UTR / Reference No. below:</p>
                                    <input
                                        type="text"
                                        placeholder="Enter UTR / Transaction ID"
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary"
                                        onChange={(e) => {
                                            // Basic validation or state update could go here if we tracked it separately, 
                                            // but for now we'll just use a ref or local var if needed, 
                                            // or simpler: just stick it in a state
                                            (window as any).tempTransactionId = e.target.value;
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        const txId = (window as any).tempTransactionId;
                                        if (!txId || txId.length < 4) {
                                            alert("Please enter a valid Transaction ID / UTR Number to verify payment.");
                                            return;
                                        }
                                        setPaymentProcessing(true);
                                        setTimeout(() => {
                                            placeOrder(addressDetails, selectedPayment, txId);
                                            setPaymentProcessing(false);
                                            setShowPaymentModal(false);
                                            setSuccess(true);
                                        }, 2000);
                                    }}
                                    className="w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                                >
                                    Verify & Place Order
                                </button>
                                <button onClick={() => setShowPaymentModal(false)} className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

