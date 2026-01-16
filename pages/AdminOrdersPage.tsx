import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { orderService } from '../services/orderService';

export const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;
            const data = await orderService.getOrders(token);
            setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, []);

    return (
        <div className="max-w-7xl">
            <h1 className="text-3xl font-serif text-white mb-8">Order History</h1>

            <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4 text-left font-serif text-gold-400">Date</th>
                            <th className="p-4 text-left font-serif text-gold-400">Items</th>
                            <th className="p-4 text-left font-serif text-gold-400">Total</th>
                            <th className="p-4 text-left font-serif text-gold-400">Paid</th>
                            <th className="p-4 text-left font-serif text-gold-400">Due</th>
                            <th className="p-4 text-left font-serif text-gold-400">Status</th>
                            <th className="p-4 text-left font-serif text-gold-400">GST</th>
                            <th className="p-4 text-left font-serif text-gold-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map(order => (
                            <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 text-sm font-mono">#{order.id}
                                    {order.is_b2b && <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">B2B</span>}
                                </td>
                                <td className="p-4 text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-sm max-w-xs truncate">
                                    {order.items?.map((i: any) => `${i.quantity}x ${i.product_name}`).join(', ')}
                                </td>
                                <td className="p-4 text-sm font-bold">₹{order.total_amount}</td>
                                <td className="p-4 text-sm text-green-400">₹{order.paid_amount || order.total_amount}</td>
                                <td className="p-4 text-sm text-red-400 font-bold">{order.balance_due > 0 ? `₹${order.balance_due}` : '-'}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider ${order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'partial_paid' ? 'bg-orange-500/20 text-orange-400' :
                                                order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-gray-700 text-gray-300'
                                        }`}>
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-gray-400">{order.gst_number || '-'}</td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={async () => {
                                            try {
                                                const blob = await orderService.downloadInvoice(order.id, localStorage.getItem('accessToken') || '');
                                                const url = window.URL.createObjectURL(blob);
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.download = `Invoice_${order.id}.pdf`;
                                                document.body.appendChild(link);
                                                link.click();
                                                link.remove();
                                            } catch (e) {
                                                alert('Failed to download invoice');
                                            }
                                        }}
                                        className="text-gray-400 hover:text-white"
                                        title="Download Invoice"
                                    >
                                        <FileText size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
