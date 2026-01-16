import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { User } from '../types';

interface AdminDashboardProps {
    user: User | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.role === 'admin') {
                const data = await adminService.getStats();
                setStats(data);
            }
            setLoading(false);
        };
        fetchStats();
    }, [user]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="pt-32 px-8 text-center">
                <h1 className="text-3xl font-serif text-gold mb-4">Restricted Access</h1>
                <p>Only master craftsmen (Admins) may enter here.</p>
            </div>
        );
    }

    if (loading) return <div className="pt-32 px-8">Loading Workshop Data...</div>;

    return (

        <div className="max-w-7xl">
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                        <p className="text-gray-400 mb-1">Total Artisans (Users)</p>
                        <p className="text-3xl text-gold font-light">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                        <p className="text-gray-400 mb-1">Pending Orders</p>
                        <p className="text-3xl text-gold font-light">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                        <p className="text-gray-400 mb-1">Total Revenue</p>
                        <p className="text-3xl text-gold font-light">₹{stats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                        <p className="text-gray-400 mb-1">Low Stock Items</p>
                        <p className="text-3xl text-red-400 font-light">{stats.lowStockProducts}</p>
                    </div>
                </div>
            )}

            <div className="bg-white/5 p-8 border border-white/10 rounded-sm">
                <h2 className="text-2xl font-serif text-white mb-6">Recent Activity</h2>
                <p className="text-gray-400">System is active. No new alerts.</p>
            </div>
        </div>
    );
};
