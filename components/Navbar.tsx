import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, User as UserIcon } from 'lucide-react';
import { CartItem, User, Page } from '../types';

interface NavbarProps {
  cartItems: CartItem[];
  user: User | null;
  activePage: Page;
  onNavigate: (page: Page) => void;
  onCartClick: () => void;
  onSearchClick: () => void;
  onUserClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  user,
  activePage,
  onNavigate,
  onCartClick,
  onSearchClick,
  onUserClick
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { name: string; value: Page }[] = [
    { name: 'Collections', value: 'collections' },
    { name: 'About', value: 'about' },
    { name: 'Sustainability', value: 'sustainability' },
    { name: 'Journal', value: 'journal' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${scrolled
        ? 'bg-dark/80 backdrop-blur-xl border-white/5 py-4 shadow-2xl'
        : 'bg-transparent border-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className="w-10 h-10 bg-gradient-to-br from-wood-500 to-wood-800 rounded-sm flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-500 shadow-lg shadow-gold-500/10">
            <span className="text-xl font-bold text-white transform group-hover:-rotate-45 transition-transform duration-500">A</span>
          </div>
          <span className={`text-2xl font-bold tracking-widest uppercase font-serif ${scrolled ? 'text-white' : 'text-white'}`}>
            A TO Z<span className="text-gold-400"> WoodArt</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.value)}
              className={`relative text-sm uppercase tracking-widest transition-colors duration-300 group ${activePage === item.value ? 'text-gold-400' : 'text-gray-300 hover:text-gold-400'
                }`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-gold-400 transition-all duration-300 ${activePage === item.value ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
          {user?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`relative text-sm uppercase tracking-widest transition-colors duration-300 group ${activePage === 'admin' ? 'text-gold-400' : 'text-gray-300 hover:text-gold-400'
                }`}
            >
              Admin
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-red-500 transition-all duration-300 ${activePage === 'admin' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <button
            onClick={onSearchClick}
            className="text-white/70 hover:text-white transition-colors duration-300 hover:scale-110"
          >
            <Search size={20} />
          </button>

          <button
            onClick={onUserClick}
            className={`text-white/70 hover:text-white transition-colors duration-300 hover:scale-110 flex items-center gap-2 ${user ? 'text-gold-400' : ''}`}
          >
            <UserIcon size={20} className={user ? "fill-gold-400/20 text-gold-400" : ""} />
            {user && <span className="hidden lg:block text-xs font-bold uppercase tracking-wider text-gold-400">{(user.full_name || user.username || user.email || '').split(' ')[0]}</span>}
          </button>

          <div className="relative cursor-pointer hover:scale-110 transition-transform" onClick={onCartClick}>
            <div className="relative group">
              <ShoppingBag className={`text-white transition-transform duration-300 ${totalItems > 0 ? 'group-hover:animate-pulse' : ''}`} size={24} />
              <div className="absolute inset-0 bg-gold-400/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-lg shadow-gold-500/50">
                {totalItems}
              </span>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-xl border-b border-white/10 overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.value)}
              className={`text-lg uppercase tracking-widest text-left ${activePage === item.value ? 'text-gold-400' : 'text-gray-300 hover:text-gold-400'}`}
            >
              {item.name}
            </button>
          ))}
          <div className="pt-4 border-t border-white/10 flex gap-4">
            <button onClick={() => { onUserClick(); setMobileMenuOpen(false); }} className="text-gray-300 flex items-center gap-2">
              <UserIcon size={18} /> {user ? 'Profile' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
