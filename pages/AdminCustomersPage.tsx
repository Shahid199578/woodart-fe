import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { User } from '../types';

export const AdminCustomersPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;
            const data = await userService.getUsers(token);
            setUsers(data);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    return (
        <div className="max-w-7xl">
            <h1 className="text-3xl font-serif text-white mb-8">Artisans & Clients</h1>

            <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-gray-500">#{u.id}</td>
                                <td className="p-4 text-white font-medium">{u.full_name || 'N/A'}</td>
                                <td className="p-4 text-gray-400">{u.email}</td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-sm ${u.role === 'admin' ? 'bg-gold-500/20 text-gold-400' : 'bg-white/10 text-gray-300'}`}>
                                        {u.role || 'Customer'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">{new Date(u.date_joined).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
