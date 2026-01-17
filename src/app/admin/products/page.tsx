"use client";

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Plus, Pencil, Trash2, Search, Filter, X } from 'lucide-react';

export default function ProductsPage() {
    const { products, addProduct, updateProduct, deleteProduct } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        category: string;
        price: string;
        discount: string;
        stock: string;
        status: string;
        image: string;
        images: string[];
        sizes: string[];
        colors: string[];
    }>({
        name: '',
        description: '',
        category: 'Men',
        price: '',
        discount: '',
        stock: '',
        status: 'In Stock',
        image: '/placeholder.png',
        images: [],
        sizes: [],
        colors: []
    });

    const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
    const AVAILABLE_COLORS = [
        { name: 'White', hex: '#ffffff' },
        { name: 'Black', hex: '#000000' },
        { name: 'Red', hex: '#ef4444' },
        { name: 'Blue', hex: '#3b82f6' },
        { name: 'Green', hex: '#22c55e' }
    ];

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            description: product.description || '',
            category: product.category,
            price: product.price.toString(),
            discount: product.discount?.toString() || '',
            stock: product.stock.toString(),
            status: product.status,
            image: product.image,
            images: product.images || [],
            sizes: product.sizes || [],
            colors: product.colors || []
        });
        setEditingId(product.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            name: '', description: '', category: 'Men', price: '', discount: '', stock: '', status: 'In Stock',
            image: '/placeholder.png', images: [], sizes: [], colors: []
        });
    }

    const toggleSelection = (item: string, list: string[], field: 'sizes' | 'colors') => {
        const newList = list.includes(item)
            ? list.filter(i => i !== item)
            : [...list, item];
        setFormData({ ...formData, [field]: newList });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Compress Image Logic
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality JPG

                    const currentImages = [...formData.images];
                    if (currentImages.length < 4) {
                        currentImages.push(compressedBase64);
                        // If it's the first image, make it the main image too
                        const mainImage = currentImages[0];
                        setFormData({ ...formData, images: currentImages, image: mainImage });
                    }
                };
            };
        }
    };

    const removeImage = (indexToRemove: number) => {
        const newImages = formData.images.filter((_, idx) => idx !== indexToRemove);
        setFormData({
            ...formData,
            images: newImages,
            // Update main image if we deleted the first one
            image: newImages.length > 0 ? newImages[0] : '/placeholder.png'
        });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const productData = {
            name: formData.name,
            description: formData.description,
            category: formData.category as 'Men' | 'Women' | 'Kids',
            price: parseInt(formData.price),
            discount: formData.discount ? parseInt(formData.discount) : undefined,
            stock: parseInt(formData.stock),
            status: formData.status as 'In Stock' | 'Low Stock' | 'Out of Stock',
            image: formData.image,
            images: formData.images,
            sizes: formData.sizes,
            colors: formData.colors
        };

        try {
            if (editingId) {
                await updateProduct(editingId, productData);
                handleCloseModal();
            } else {
                const result = await addProduct(productData);
                if (result.success) {
                    handleCloseModal();
                } else {
                    alert(`Error adding product: ${result.error}`);
                }
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProducts = categoryFilter === 'All'
        ? products
        : products.filter(p => p.category === categoryFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Product Management</h1>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setFormData({
                            name: '', description: '', category: 'Men', price: '', discount: '', stock: '', status: 'In Stock',
                            image: '/placeholder.png', images: [], sizes: [], colors: []
                        });
                    }}
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    <Plus className="h-4 w-4" />
                    Add New Product
                </button>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full rounded-md border-0 py-2 pl-10 pr-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-primary"
                >
                    <option value="All">All Categories</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Product Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-slate-100">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-slate-900">{product.name}</div>
                                            <div className="text-sm text-slate-500">ID: #{product.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{product.category}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">₹{product.price}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{product.stock}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                                        product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(product)} className="mr-4 text-slate-400 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                                    <button onClick={() => deleteProduct(product.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl my-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Product Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Add details about fabric quality, fit, and care..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Discount (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder="Optional"
                                        value={formData.discount}
                                        onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Stock</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="In Stock">In Stock</option>
                                        <option value="Low Stock">Low Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Sizes</label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {AVAILABLE_SIZES.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSelection(size, formData.sizes, 'sizes')}
                                            className={`px-3 py-1 rounded-md text-sm border ${formData.sizes.includes(size)
                                                ? 'bg-slate-900 text-white border-slate-900'
                                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Colors</label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {AVAILABLE_COLORS.map(color => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => toggleSelection(color.name, formData.colors, 'colors')}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm border ${formData.colors.includes(color.name)
                                                ? 'bg-slate-100 border-slate-500 ring-1 ring-slate-500'
                                                : 'bg-white border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <span
                                                className="w-4 h-4 rounded-full border border-slate-200"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className="text-slate-900">{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Product Images (Max 4, &lt; 1MB each)</label>
                                <div className="mt-2 grid grid-cols-4 gap-4">
                                    {/* Existing Images */}
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square overflow-hidden rounded-md border border-slate-300 group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt="Product" className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    {formData.images.length < 4 && (
                                        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100">
                                            <Plus className="h-6 w-6 text-slate-400" />
                                            <span className="mt-1 text-xs text-slate-500">Add</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-slate-500">First image will be the main display image.</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-md bg-primary py-2 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Saving...' : (editingId ? 'Update Product' : 'Save Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
