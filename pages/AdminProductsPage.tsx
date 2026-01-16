import React, { useState, useEffect } from 'react';
import { Plus, X, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { Button } from '../components/Button';
import { ImageUploader } from '../components/ImageUploader';

export const AdminProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        stock_quantity: 1,
        b2b_price: '',
        moq: 1,
        is_new: false
    });

    // New Category State
    const [categories, setCategories] = useState<string[]>([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data);
        setLoading(false);
    };

    const fetchCategories = async () => {
        const cats = await productService.getCategories();
        if (cats.length > 0) {
            setCategories(cats.map((c: any) => c.name));
        } else {
            setCategories(['Furniture', 'Decor', 'Kitchen', 'Lighting', 'Tools']); // Fallback defaults
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: categories[0] || 'Furniture',
            image_url: '',
            stock_quantity: 1,
            is_new: false
        });
        setEditingId(null);
    };

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            image_url: product.imageUrl || product.image_url || '',
            stock_quantity: product.stock_quantity || 0,
            b2b_price: (product as any).b2b_price || '',
            moq: (product as any).moq || 1,
            is_new: product.isNew || false
        });
        setEditingId(product.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        const token = localStorage.getItem('accessToken');
        if (!token) return alert('Session expired');
        try {
            await productService.deleteProduct(id, token);
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        const token = localStorage.getItem('accessToken');
        if (!token) return alert('Session expired');

        try {
            const newCat = await productService.createCategory({
                name: newCategoryName,
                slug: newCategoryName.toLowerCase().replace(/ /g, '-')
            }, token);

            // Update categories list and select the new one
            const updatedCats = [...categories, newCat.name];
            setCategories(updatedCats);
            setFormData({ ...formData, category: newCat.name });

            setNewCategoryName('');
            setIsAddingCategory(false);
        } catch (e) {
            console.error(e);
            alert('Failed to create category');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) return alert('Session expired');

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                b2b_price: formData.b2b_price ? parseFloat(formData.b2b_price) : null
            };

            if (editingId) {
                await productService.updateProduct(editingId, payload, token);
            } else {
                await productService.createProduct(payload, token);
            }

            setIsModalOpen(false);
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error('Operation failed', error);
            alert('Operation failed');
        }
    };

    return (
        <div className="max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-white">Products</h1>
                <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    <span className="flex items-center gap-2">
                        <Plus size={18} /> Add Product
                    </span>
                </Button>
            </div>

            {loading ? (
                <div>Loading Catalog...</div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-sm overflow-hidden shrink-0">
                                            <img
                                                src={product.imageUrl || product.image_url || '/images/wood-texture.png'}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.currentTarget.src = '/images/wood-texture.png'; }}
                                            />
                                        </div>
                                        <span className="font-medium text-white">{product.name}</span>
                                    </td>
                                    <td className="p-4 text-gray-400">{product.category}</td>
                                    <td className="p-4 text-gold-400">₹{product.price}</td>
                                    <td className="p-4 text-white">{product.stock_quantity || '-'}</td>
                                    <td className="p-4">
                                        {product.isNew && <span className="bg-gold-500/20 text-gold-400 text-xs px-2 py-1 rounded-sm">NEW</span>}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* CREATE/EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-dark border border-white/10 w-full max-w-2xl p-8 rounded-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => { setIsModalOpen(false); resetForm(); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-serif text-white mb-6">
                            {editingId ? 'Edit Masterpiece' : 'Add New Masterpiece'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Name</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-gold-400 outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 flex justify-between">
                                        Category
                                        <button type="button" onClick={() => setIsAddingCategory(!isAddingCategory)} className="text-gold-400 text-xs hover:underline">
                                            {isAddingCategory ? 'Select Existing' : '+ Add New'}
                                        </button>
                                    </label>

                                    {isAddingCategory ? (
                                        <div className="flex gap-2">
                                            <input
                                                className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-gold-400 outline-none"
                                                placeholder="New Category Name"
                                                value={newCategoryName}
                                                onChange={e => setNewCategoryName(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCreateCategory}
                                                className="bg-gold-500 text-black px-4 rounded-sm font-medium hover:bg-gold-400"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-gold-400 outline-none"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Description</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-gold-400 outline-none h-24"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-gold-400 outline-none"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Stock</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-gold-400 outline-none"
                                        value={formData.stock_quantity}
                                        onChange={e => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-8">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_new}
                                        onChange={e => setFormData({ ...formData, is_new: e.target.checked })}
                                        className="w-5 h-5 accent-gold-400"
                                    />
                                    <label className="text-white">Mark as New</label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                                <div className="space-y-2">
                                    <label className="text-sm text-gold-400">B2B Price (Wholesale)</label>
                                    <input
                                        type="number"
                                        placeholder="Optional"
                                        className="w-full bg-white/5 border border-gold-500/30 p-3 rounded-sm text-white focus:border-gold-400 outline-none"
                                        value={formData.b2b_price}
                                        onChange={e => setFormData({ ...formData, b2b_price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gold-400">Minimum Order Qty (MOQ)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full bg-white/5 border border-gold-500/30 p-3 rounded-sm text-white focus:border-gold-400 outline-none"
                                        value={formData.moq}
                                        onChange={e => setFormData({ ...formData, moq: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Image</label>
                                <ImageUploader
                                    value={formData.image_url}
                                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                                    onUpload={(file) => productService.uploadImage(file, localStorage.getItem('accessToken') || '')}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <Button type="submit">
                                    {editingId ? 'Update Masterpiece' : 'Create Artifact'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
