import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Image as ImageIcon } from 'lucide-react';
import { productService } from '../services/productService';
import { Button } from '../components/Button';
import { ImageUploader } from '../components/ImageUploader';

export const AdminPartnersPage: React.FC = () => {
    const [partners, setPartners] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', logo_url: '', website_url: '' });

    const fetchPartners = async () => {
        setLoading(true);
        const data = await productService.getPartners();
        setPartners(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this partner?')) return;
        const token = localStorage.getItem('accessToken');
        if (!token) return alert('Session expired');
        try {
            await productService.deletePartner(id, token);
            fetchPartners();
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
            await productService.createPartner(formData, token);
            setIsModalOpen(false);
            setFormData({ name: '', logo_url: '', website_url: '' });
            fetchPartners();
        } catch (e) {
            console.error(e);
            alert('Failed to create');
        }
    };

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-white">Partners</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <span className="flex items-center gap-2">
                        <Plus size={18} /> Add Partner
                    </span>
                </Button>
            </div>

            {loading ? <div>Loading...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map(partner => (
                        <div key={partner.id} className="bg-white/5 border border-white/10 p-6 rounded-sm group relative">
                            <button onClick={() => handleDelete(partner.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={18} />
                            </button>
                            <div className="h-24 flex items-center justify-center mb-4 bg-black/20 rounded p-4">
                                <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <h3 className="text-white font-medium text-center">{partner.name}</h3>
                            {partner.website_url && <p className="text-gray-500 text-xs text-center mt-1 truncate">{partner.website_url}</p>}
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-dark border border-white/10 w-full max-w-md p-8 rounded-lg shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                        <h2 className="text-xl font-serif text-white mb-6">Add Partner</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Name</label>
                                <input className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-gold-400 outline-none"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Logo</label>
                                <ImageUploader
                                    value={formData.logo_url}
                                    onChange={(url) => setFormData({ ...formData, logo_url: url })}
                                    onUpload={(file) => productService.uploadImage(file, localStorage.getItem('accessToken') || '')}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Website (Optional)</label>
                                <input className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-gold-400 outline-none"
                                    value={formData.website_url} onChange={e => setFormData({ ...formData, website_url: e.target.value })} />
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
