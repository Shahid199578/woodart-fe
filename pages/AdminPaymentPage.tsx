import React, { useState, useEffect } from 'react';
import { API_URLS } from '../services/apiConfig';
import { Save } from 'lucide-react';

export const AdminPaymentPage: React.FC = () => {
    const [config, setConfig] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch(`${API_URLS.PAYMENT}/config/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    setConfig(data[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch Payment config", error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Check if we are updating (PUT) or creating (POST)
            // But simplify for now: ListCreate in backend returns list.
            // If we have an ID, we PUT, else POST.
            // Actually, for single config, POSTing a new one makes it the active one.

            await fetch(`${API_URLS.PAYMENT}/config/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });
            setMessage('Payment Configuration Saved!');
            fetchConfig(); // Refresh to get the latest active one
        } catch (error) {
            setMessage('Failed to save configuration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-serif text-white mb-8">Payment Configuration</h1>

            <div className="bg-white/5 border border-white/10 rounded-sm p-8 space-y-6">
                <p className="text-gray-400 text-sm">
                    Configure your Razorpay API keys here. These will be used for processing payments.
                </p>

                {message && <div className="p-4 bg-green-500/10 text-green-400 rounded-sm">{message}</div>}

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs uppercase tracking-wider">Key ID</label>
                        <input
                            type="text"
                            value={config.key_id || ''}
                            onChange={e => setConfig({ ...config, key_id: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-sm py-3 px-4 text-white focus:border-gold-400 focus:outline-none"
                            placeholder="rzp_test_..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs uppercase tracking-wider">Key Secret</label>
                        <input
                            type="password"
                            value={config.key_secret || ''}
                            onChange={e => setConfig({ ...config, key_secret: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-sm py-3 px-4 text-white focus:border-gold-400 focus:outline-none"
                            placeholder="Your Secret Key"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={config.is_active ?? true}
                            onChange={e => setConfig({ ...config, is_active: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                        />
                        <label className="text-gray-400 text-sm">Active</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gold-500 text-black px-8 py-3 uppercase tracking-widest font-bold hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Save Configuration'}
                    </button>
                </form>
            </div>
        </div>
    );
};
