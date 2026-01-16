import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { productService } from '../services/productService';
import { Button } from '../components/Button';

export const AdminCategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        const data = await productService.getCategories();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this category?')) return;
        const token = localStorage.getItem('accessToken');
        if (!token) return alert('Session expired');
        try {
            await productService.deleteCategory(id, token);
            fetchCategories();
        } catch (e) {
            console.error(e);
            alert('Failed to delete');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) return alert('Session expired');

        try {
            await productService.createCategory({ name, slug: name.toLowerCase().replace(/ /g, '-') }, token);
            setIsModalOpen(false);
            setName('');
            fetchCategories();
        } catch (e) {
            console.error(e);
            alert('Failed to create');
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-white">Categories</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <span className="flex items-center gap-2">
                        <Plus size={18} /> Add Category
                    </span>
                </Button>
            </div>

            {loading ? <div>Loading...</div> : (
                <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Slug</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{cat.name}</td>
                                    <td className="p-4 text-gray-400">{cat.slug}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-dark border border-white/10 w-full max-w-md p-8 rounded-lg shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                        <h2 className="text-xl font-serif text-white mb-6">Add Category</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Name</label>
                                <input className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-gold-400 outline-none"
                                    value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit">Create</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
