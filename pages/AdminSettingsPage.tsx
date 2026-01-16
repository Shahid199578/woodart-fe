import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';
import { Save, Mail, Shield, User as UserIcon, CreditCard, Bot } from 'lucide-react';
import { API_URLS } from '../services/apiConfig';

interface AdminSettingsPageProps {
    user: User | null;
    onUserUpdate: (user: User) => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ user, onUserUpdate }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'email' | 'payment' | 'ai'>('profile');

    // Profile State
    const [profileData, setProfileData] = useState({
        full_name: '', brand_name: '', gst_number: '', mobile: '',
        business_address: '', warehouse_address: '', password: ''
    });

    // Email Config State
    const [emailConfig, setEmailConfig] = useState({
        email_host: 'smtp.gmail.com', email_port: 587, email_use_tls: true,
        email_host_user: '', email_host_password: '', default_from_email: ''
    });

    // Payment Config State (Razorpay)
    const [paymentConfig, setPaymentConfig] = useState({
        key_id: '', key_secret: '', is_active: true
    });

    // AI Config State
    const [aiConfig, setAiConfig] = useState({
        google_api_key: '', is_active: true
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (user) {
            setProfileData({
                full_name: user.full_name || '',
                brand_name: (user as any).brand_name || '',
                gst_number: (user as any).gst_number || '',
                mobile: (user as any).mobile || '',
                business_address: (user as any).business_address || '',
                warehouse_address: (user as any).warehouse_address || '',
                password: ''
            });
        }
        fetchConfigs();
    }, [user]);

    const fetchConfigs = async () => {
        if (!token) return;
        try {
            // Email Config
            const emailRes = await fetch(`${API_URLS.NOTIFICATION}/config/email/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (emailRes.ok) setEmailConfig(await emailRes.json());

            // Payment Config
            const payRes = await fetch(`${API_URLS.PAYMENT}/admin/config/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (payRes.ok) {
                const data = await payRes.json();
                if (data && data.length > 0) setPaymentConfig(data[0]);
            }

            // AI Config
            const aiRes = await fetch(`${API_URLS.AI}/config/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (aiRes.ok) setAiConfig(await aiRes.json());
        } catch (e) {
            console.error(e);
        }
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updated = await userService.updateProfile(profileData, token || '');
            onUserUpdate(updated);
            setMessage('Profile Saved!');
        } catch (e) { setMessage('Failed to save profile.'); }
        setLoading(false);
    };

    const handleEmailSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch(`${API_URLS.NOTIFICATION}/config/email/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(emailConfig)
            });
            setMessage('Email Config Saved!');
        } catch (e) { setMessage('Failed to save email config.'); }
        setLoading(false);
    };

    const handlePaymentSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch(`${API_URLS.PAYMENT}/admin/config/`, {
                method: 'POST', // or PUT depending on backend logic, assume POST creates new active
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(paymentConfig)
            });
            setMessage('Payment Config Saved!');
        } catch (e) { setMessage('Failed to save payment config.'); }
        setLoading(false);
    };

    const handleAISave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch(`${API_URLS.AI}/config/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(aiConfig)
            });
            setMessage('AI Config Saved!');
        } catch (e) { setMessage('Failed to save AI config.'); }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl pb-20">
            <h1 className="text-3xl font-serif text-white mb-8">Settings & Integrations</h1>

            <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'profile' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400'}`}>
                    <UserIcon size={18} /> Profile
                </button>
                <button onClick={() => setActiveTab('email')} className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'email' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400'}`}>
                    <Mail size={18} /> Email Config
                </button>
                <button onClick={() => setActiveTab('payment')} className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'payment' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400'}`}>
                    <CreditCard size={18} /> Payment Gateway
                </button>
                <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'ai' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400'}`}>
                    <Bot size={18} /> AI Config
                </button>
            </div>

            {message && <div className="p-4 mb-6 bg-green-500/10 text-green-400">{message}</div>}

            {activeTab === 'profile' && (
                <form onSubmit={handleProfileSave} className="bg-white/5 p-8 rounded border border-white/10 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">Full Name</label>
                            <input className="w-full bg-black/20 border border-white/10 p-3 text-white" value={profileData.full_name} onChange={e => setProfileData({ ...profileData, full_name: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">Brand Name</label>
                            <input className="w-full bg-black/20 border border-white/10 p-3 text-white" value={profileData.brand_name} onChange={e => setProfileData({ ...profileData, brand_name: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">GST Number</label>
                            <input className="w-full bg-black/20 border border-white/10 p-3 text-white" value={profileData.gst_number} onChange={e => setProfileData({ ...profileData, gst_number: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">Mobile</label>
                            <input className="w-full bg-black/20 border border-white/10 p-3 text-white" value={profileData.mobile} onChange={e => setProfileData({ ...profileData, mobile: e.target.value })} />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <label className="text-xs text-gray-400 uppercase">Business Address</label>
                            <textarea className="w-full bg-black/20 border border-white/10 p-3 text-white" value={profileData.business_address} onChange={e => setProfileData({ ...profileData, business_address: e.target.value })} />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <label className="text-xs text-gray-400 uppercase">Change Password</label>
                            <input type="password" className="w-full bg-black/20 border border-white/10 p-3 text-white" placeholder="New Password" value={profileData.password} onChange={e => setProfileData({ ...profileData, password: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="bg-gold-500 text-black px-6 py-2 font-bold uppercase hover:bg-white transition-colors">Save Profile</button>
                </form>
            )}

            {activeTab === 'email' && (
                <form onSubmit={handleEmailSave} className="bg-white/5 p-8 rounded border border-white/10 space-y-6">
                    <h3 className="text-xl text-white font-serif">Email SMTP Settings</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">SMTP Host</label>
                            <input className="w-full bg-black/20 border border-white/10 p-3 text-white" value={emailConfig.email_host} onChange={e => setEmailConfig({ ...emailConfig, email_host: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">SMTP Port</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 p-3 text-white" value={emailConfig.email_port} onChange={e => setEmailConfig({ ...emailConfig, email_port: parseInt(e.target.value) })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">Username</label>
                            <input className="w-full bg-black/20 border border-white/10 p-3 text-white" value={emailConfig.email_host_user} onChange={e => setEmailConfig({ ...emailConfig, email_host_user: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">Password</label>
                            <input type="password" className="w-full bg-black/20 border border-white/10 p-3 text-white" value={emailConfig.email_host_password} onChange={e => setEmailConfig({ ...emailConfig, email_host_password: e.target.value })} />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <label className="text-xs text-gray-400 uppercase">Default From Email</label>
                            <input className="w-full bg-black/20 border border-white/10 p-3 text-white" value={emailConfig.default_from_email} onChange={e => setEmailConfig({ ...emailConfig, default_from_email: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <input type="checkbox" checked={emailConfig.email_use_tls} onChange={e => setEmailConfig({ ...emailConfig, email_use_tls: e.target.checked })} className="accent-gold-500" />
                            <label className="text-white">Use TLS</label>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="bg-gold-500 text-black px-6 py-2 font-bold uppercase hover:bg-white transition-colors">Save Email Settings</button>
                </form>
            )}

            {activeTab === 'payment' && (
                <form onSubmit={handlePaymentSave} className="bg-white/5 p-8 rounded border border-white/10 space-y-6">
                    <h3 className="text-xl text-white font-serif">Razorpay Configuration</h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">Key ID</label>
                            <input className="w-full bg-black/20 border border-white/10 p-3 text-white" value={paymentConfig.key_id} onChange={e => setPaymentConfig({ ...paymentConfig, key_id: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">Key Secret</label>
                            <input type="password" className="w-full bg-black/20 border border-white/10 p-3 text-white" value={paymentConfig.key_secret} onChange={e => setPaymentConfig({ ...paymentConfig, key_secret: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={paymentConfig.is_active} onChange={e => setPaymentConfig({ ...paymentConfig, is_active: e.target.checked })} className="accent-gold-500" />
                            <label className="text-white">Is Active</label>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="bg-gold-500 text-black px-6 py-2 font-bold uppercase hover:bg-white transition-colors">Save Razorpay Keys</button>
                </form>
            )}

            {activeTab === 'ai' && (
                <form onSubmit={handleAISave} className="bg-white/5 p-8 rounded border border-white/10 space-y-6">
                    <h3 className="text-xl text-white font-serif">Gemini AI Configuration</h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase">Google API Key</label>
                            <input type="password" className="w-full bg-black/20 border border-white/10 p-3 text-white" value={aiConfig.google_api_key} onChange={e => setAiConfig({ ...aiConfig, google_api_key: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={aiConfig.is_active} onChange={e => setAiConfig({ ...aiConfig, is_active: e.target.checked })} className="accent-gold-500" />
                            <label className="text-white">Is Active</label>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="bg-gold-500 text-black px-6 py-2 font-bold uppercase hover:bg-white transition-colors">Save AI Key</button>
                </form>
            )}
        </div>
    );
};
