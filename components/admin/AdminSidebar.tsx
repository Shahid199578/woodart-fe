import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft, Settings, PenTool, Layers, Image } from 'lucide-react';
import { Page } from '../../types';

interface AdminSidebarProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage, onNavigate }) => {
    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, value: 'admin' },
        { name: 'Products', icon: Package, value: 'admin-products' },
        { name: 'Categories', icon: Layers, value: 'admin-categories' },
        { name: 'Partners', icon: Image, value: 'admin-partners' },
        { name: 'Orders', icon: ShoppingCart, value: 'admin-orders' },
        { name: 'Artisans', icon: Users, value: 'admin-users' },
        { name: 'Journal', icon: PenTool, value: 'admin-blog' },
        { name: 'Content', icon: Layers, value: 'admin-cms' },
        { name: 'Settings', icon: Settings, value: 'admin-settings' },
    ] as const;

    return (
        <div className="w-64 bg-wood-900 border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Brand */}
            <div className="p-8 border-b border-white/10">
                <h1 className="text-xl font-serif text-white tracking-widest">
                    A TO Z<span className="text-gold-400"> WoodArt</span>
                </h1>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Workshop OS</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.value}
                        onClick={() => onNavigate(item.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 ${activePage === item.value
                            ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <item.icon size={18} />
                        <span className="text-sm font-medium uppercase tracking-wide">{item.name}</span>
                    </button>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
                <button
                    onClick={() => onNavigate('home')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm">Back to Store</span>
                </button>
            </div>
        </div>
    );
};
