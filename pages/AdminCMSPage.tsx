import React, { useState, useEffect } from 'react';
import { API_URLS } from '../services/apiConfig';
import { Save, Plus, Trash, X } from 'lucide-react';
import { RichTextEditor } from '../components/RichTextEditor';

export const AdminCMSPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'policies' | 'faqs'>('general');
    const [config, setConfig] = useState<any>({});
    const [policies, setPolicies] = useState<any[]>([]);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const configRes = await fetch(`${API_URLS.ADMIN}/dashboard/config/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const configData = await configRes.json();
            setConfig(configData);

            const policiesRes = await fetch(`${API_URLS.ADMIN}/dashboard/policies/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPolicies(await policiesRes.json());

            const faqsRes = await fetch(`${API_URLS.ADMIN}/dashboard/faqs/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFaqs(await faqsRes.json());
        } catch (error) {
            console.error("Failed to fetch CMS data", error);
        }
    };

    const [newPolicy, setNewPolicy] = useState({ title: '', content: '' });
    const [newFaq, setNewFaq] = useState({ question: '', answer: '', order: 0 });
    const [editPolicy, setEditPolicy] = useState<any>(null);
    const [editFaq, setEditFaq] = useState<any>(null);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

    // Image Previews
    const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
    const [heroBgPreview, setHeroBgPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'hero_image_url' | 'hero_background_url') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setConfig({ ...config, [field]: file });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                if (field === 'hero_image_url') setHeroImagePreview(reader.result as string);
                else setHeroBgPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfigSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const id = config.id || 1; // Default ID if not present
            const formData = new FormData();
            formData.append('hero_title', config.hero_title || '');
            formData.append('hero_subtitle', config.hero_subtitle || '');
            formData.append('contact_email', config.contact_email || '');
            formData.append('contact_phone', config.contact_phone || '');
            formData.append('b2b_partial_payment_percentage', config.b2b_partial_payment_percentage?.toString() || '50');

            // Append files if they are File objects (not URL strings)
            if (config.hero_image_url instanceof File) {
                formData.append('hero_image_url', config.hero_image_url);
            }
            if (config.hero_background_url instanceof File) {
                formData.append('hero_background_url', config.hero_background_url);
            }

            await fetch(`${API_URLS.ADMIN}/dashboard/config/${id}/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                    // Do NOT set Content-Type here; browser sets it with boundary for FormData
                },
                body: formData
            });
            setMessage('Configuration Saved!');
        } catch (error) {
            console.error(error);
            setMessage('Failed to save configuration.');
        } finally {
            setLoading(false);
        }
    };

    // --- Policies Logic ---
    const handlePolicySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        const isEdit = !!editPolicy;
        const url = isEdit ? `${API_URLS.ADMIN}/dashboard/policies/${editPolicy.id}/` : `${API_URLS.ADMIN}/dashboard/policies/`;
        const method = isEdit ? 'PUT' : 'POST';
        const body = isEdit ? editPolicy : newPolicy;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                setNewPolicy({ title: '', content: '' });
                setEditPolicy(null);
                setIsPolicyModalOpen(false);
                fetchData(); // Refresh list
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deletePolicy = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        await fetch(`${API_URLS.ADMIN}/dashboard/policies/${id}/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
    };

    // --- FAQ Logic ---
    const handleFaqSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        const isEdit = !!editFaq;
        const url = isEdit ? `${API_URLS.ADMIN}/dashboard/faqs/${editFaq.id}/` : `${API_URLS.ADMIN}/dashboard/faqs/`;
        const method = isEdit ? 'PUT' : 'POST';
        const body = isEdit ? editFaq : newFaq;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                setNewFaq({ question: '', answer: '', order: 0 });
                setEditFaq(null);
                fetchData();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteFaq = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        await fetch(`${API_URLS.ADMIN}/dashboard/faqs/${id}/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
    };

    return (
        <div className="max-w-6xl pb-20">
            <h1 className="text-3xl font-serif text-white mb-8">Content Management</h1>

            <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
                {['general', 'policies', 'faqs'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-sm transition-colors capitalize ${activeTab === tab ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {message && <div className="p-4 mb-6 bg-green-500/10 text-green-400 rounded-sm">{message}</div>}

            {activeTab === 'general' && (
                <form onSubmit={handleConfigSave} className="bg-white/5 p-8 rounded-sm space-y-6 border border-white/10">
                    <h2 className="text-xl text-white font-serif mb-4">Site Configuration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs uppercase">Hero Title</label>
                            <input
                                className="w-full bg-black/20 border border-white/10 p-3 text-white focus:border-gold-400"
                                value={config.hero_title || ''}
                                onChange={e => setConfig({ ...config, hero_title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs uppercase">Hero Subtitle</label>
                            <input
                                className="w-full bg-black/20 border border-white/10 p-3 text-white focus:border-gold-400"
                                value={config.hero_subtitle || ''}
                                onChange={e => setConfig({ ...config, hero_subtitle: e.target.value })}
                            />
                        </div>

                        {/* Image Uploads */}
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs uppercase">Hero Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full bg-black/20 border border-white/10 p-3 text-white focus:border-gold-400"
                                onChange={e => handleFileChange(e, 'hero_image_url')}
                            />
                            {(heroImagePreview || config.hero_image_url) && (
                                <img
                                    src={heroImagePreview || (typeof config.hero_image_url === 'string' ? config.hero_image_url : '')}
                                    className="h-24 w-auto object-cover mt-2 rounded border border-white/10"
                                    alt="Hero Preview"
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs uppercase">Hero Background</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full bg-black/20 border border-white/10 p-3 text-white focus:border-gold-400"
                                onChange={e => handleFileChange(e, 'hero_background_url')}
                            />
                            {(heroBgPreview || config.hero_background_url) && (
                                <img
                                    src={heroBgPreview || (typeof config.hero_background_url === 'string' ? config.hero_background_url : '')}
                                    className="h-24 w-auto object-cover mt-2 rounded border border-white/10"
                                    alt="Background Preview"
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs uppercase">Contact Email</label>
                            <input
                                className="w-full bg-black/20 border border-white/10 p-3 text-white focus:border-gold-400"
                                value={config.contact_email || ''}
                                onChange={e => setConfig({ ...config, contact_email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs uppercase">Contact Phone</label>
                            <input
                                className="w-full bg-black/20 border border-white/10 p-3 text-white focus:border-gold-400"
                                value={config.contact_phone || ''}
                                onChange={e => setConfig({ ...config, contact_phone: e.target.value })}
                            />
                        </div>

                        {/* B2B Settings */}
                        <div className="col-span-full pt-4 border-t border-white/10 mt-4">
                            <h3 className="text-white font-serif mb-4">B2B Settings</h3>
                            <div className="space-y-2 max-w-md">
                                <label className="text-gray-400 text-xs uppercase flex justify-between">
                                    <span>Partial Payment Percentage (%)</span>
                                    <span className="text-gold-400 font-bold">{config.b2b_partial_payment_percentage || 50}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    step="5"
                                    className="w-full accent-gold-500 cursor-pointer"
                                    value={config.b2b_partial_payment_percentage || 50}
                                    onChange={e => setConfig({ ...config, b2b_partial_payment_percentage: parseInt(e.target.value) })}
                                />
                                <p className="text-xs text-gray-500">Clients will pay this percentage upfront for B2B bulk orders.</p>
                            </div>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="bg-gold-500 text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2">
                        <Save size={18} /> Save Config
                    </button>
                </form>
            )}

            {activeTab === 'policies' && (
                <div className="space-y-8">
                    <div className="flex justify-end">
                        <button onClick={() => { setNewPolicy({ title: '', content: '' }); setEditPolicy(null); setIsPolicyModalOpen(true); }} className="bg-gold-500 text-black px-4 py-2 font-bold uppercase text-sm hover:bg-white transition-colors flex items-center gap-2">
                            <Plus size={16} /> New Policy
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {policies.map(policy => (
                            <div key={policy.id} className="bg-white/5 p-6 rounded-sm border border-white/5 flex justify-between items-start">
                                <div>
                                    <h4 className="text-white font-bold mb-2">{policy.title}</h4>
                                    <div className="text-gray-400 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: policy.content }} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditPolicy(policy); setIsPolicyModalOpen(true); }} className="text-gold-400 hover:text-white text-xs uppercase">Edit</button>
                                    <button onClick={() => deletePolicy(policy.id)} className="text-red-400 hover:text-white"><Trash size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isPolicyModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                            <div className="bg-dark border border-white/10 w-full max-w-4xl p-8 rounded-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
                                <button onClick={() => setIsPolicyModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                                <h2 className="text-2xl font-serif text-white mb-6">{editPolicy ? 'Edit Policy' : 'New Policy'}</h2>

                                <form onSubmit={handlePolicySubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 uppercase">Policy Title</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-400 outline-none"
                                            value={editPolicy ? editPolicy.title : newPolicy.title}
                                            onChange={e => editPolicy ? setEditPolicy({ ...editPolicy, title: e.target.value }) : setNewPolicy({ ...newPolicy, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 uppercase">Content</label>
                                        <RichTextEditor
                                            value={editPolicy ? editPolicy.content : newPolicy.content}
                                            onChange={val => editPolicy ? setEditPolicy({ ...editPolicy, content: val }) : setNewPolicy({ ...newPolicy, content: val })}
                                            className="h-96"
                                        />
                                        {/* Spacer to pushing buttons down below editor */}
                                        <div className="h-10"></div>
                                    </div>
                                    <div className="pt-8 flex justify-end gap-4">
                                        <button type="button" onClick={() => setIsPolicyModalOpen(false)} className="px-6 py-2 text-gray-400 hover:text-white">Cancel</button>
                                        <button type="submit" className="bg-gold-500 text-black px-8 py-2 font-bold uppercase hover:bg-white transition-colors">
                                            {editPolicy ? 'Update Policy' : 'Save Policy'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'faqs' && (
                <div className="space-y-8">
                    <form onSubmit={handleFaqSubmit} className="bg-white/5 p-6 rounded-sm space-y-4 border border-white/10">
                        <h3 className="text-lg text-white font-serif">{editFaq ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                        <input
                            placeholder="Question"
                            className="w-full bg-black/20 border border-white/10 p-3 text-white"
                            value={editFaq ? editFaq.question : newFaq.question}
                            onChange={e => editFaq ? setEditFaq({ ...editFaq, question: e.target.value }) : setNewFaq({ ...newFaq, question: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Answer"
                            rows={3}
                            className="w-full bg-black/20 border border-white/10 p-3 text-white"
                            value={editFaq ? editFaq.answer : newFaq.answer}
                            onChange={e => editFaq ? setEditFaq({ ...editFaq, answer: e.target.value }) : setNewFaq({ ...newFaq, answer: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Sort Order"
                            className="w-full bg-black/20 border border-white/10 p-3 text-white"
                            value={editFaq ? editFaq.order : newFaq.order}
                            onChange={e => editFaq ? setEditFaq({ ...editFaq, order: parseInt(e.target.value) }) : setNewFaq({ ...newFaq, order: parseInt(e.target.value) })}
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="bg-gold-500 text-black px-4 py-2 font-bold uppercase text-sm hover:bg-white transition-colors flex items-center gap-2">
                                <Plus size={16} /> {editFaq ? 'Update' : 'Add'} FAQ
                            </button>
                            {editFaq && (
                                <button type="button" onClick={() => setEditFaq(null)} className="bg-gray-700 text-white px-4 py-2 uppercase text-sm">Cancel</button>
                            )}
                        </div>
                    </form>

                    <div className="grid gap-4">
                        {faqs.map(faq => (
                            <div key={faq.id} className="bg-white/5 p-6 rounded-sm border border-white/5 flex justify-between items-start">
                                <div>
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-xs bg-gold-400/20 text-gold-400 px-2 py-0.5 rounded">#{faq.order}</span>
                                        {faq.question}
                                    </h4>
                                    <p className="text-gray-400 text-sm">{faq.answer}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditFaq(faq)} className="text-gold-400 hover:text-white text-xs uppercase">Edit</button>
                                    <button onClick={() => deleteFaq(faq.id)} className="text-red-400 hover:text-white"><Trash size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
