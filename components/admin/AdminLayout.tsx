import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Page, User } from '../../types';
import { Bell, User as UserIcon, LogOut } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: Page;
    onNavigate: (page: Page) => void;
    user: User | null;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activePage, onNavigate, user }) => {
    return (
        <div className="min-h-screen bg-dark text-gray-200 flex">
            <AdminSidebar activePage={activePage} onNavigate={onNavigate} />

            <main className="flex-1 ml-64 p-8">
                {/* Top Header */}
                <header className="flex justify-between items-center mb-12 pb-6 border-b border-white/5">
                    <div>
                        <h2 className="text-sm font-serif text-gold-400 uppercase tracking-widest">Master Craftsman</h2>
                        <p className="text-2xl font-light text-white">{user?.name || 'Admin'}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <NotificationBell />

                        <div className="relative group">
                            <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:border-gold-400 transition-colors">
                                <UserIcon size={20} className="text-gold-400" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-dark border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('accessToken');
                                            localStorage.removeItem('user');
                                            window.location.href = '/login';
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};
