import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { notificationService, Notification } from '../../services/notificationService';

export const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        const data = await notificationService.getNotifications(token);
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const markRead = async (id: number) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        await notificationService.markAsRead(id, token);
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-stone-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black/20">
                        <h3 className="text-white font-serif text-sm">Notifications</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-xs">No notifications</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map(n => (
                                    <div key={n.id} className={`p-3 hover:bg-white/5 transition-colors ${n.is_read ? 'opacity-50' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className={`w-1 shrink-0 rounded-full ${n.type === 'error' ? 'bg-red-500' :
                                                n.type === 'success' ? 'bg-green-500' :
                                                    n.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                                }`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white font-medium truncate">{n.title}</p>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.message}</p>
                                                <p className="text-[10px] text-gray-600 mt-2">{new Date(n.created_at).toLocaleTimeString()}</p>
                                            </div>
                                            {!n.is_read && (
                                                <button onClick={() => markRead(n.id)} className="text-gold-400 hover:text-white self-start" title="Mark Read">
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
