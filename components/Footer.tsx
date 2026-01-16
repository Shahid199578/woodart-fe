import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Mail, Check } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleNav = (e: React.MouseEvent, page: Page) => {
    e.preventDefault();
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-serif text-white mb-6">A TO Z<span className="text-gold-400"> WoodArt</span></h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Celebrating the imperfections of nature through masterful craftsmanship. Every piece tells a story of time, earth, and hands.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gold-500 hover:text-black transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white uppercase tracking-widest font-bold mb-6 text-sm">Explore</h3>
            <ul className="space-y-4">
              <li><button onClick={(e) => handleNav(e, 'home')} className="text-gray-500 hover:text-gold-400 transition-colors">Home</button></li>
              <li><button onClick={(e) => handleNav(e, 'collections')} className="text-gray-500 hover:text-gold-400 transition-colors">Collections</button></li>
              <li><button onClick={(e) => handleNav(e, 'about')} className="text-gray-500 hover:text-gold-400 transition-colors">About Us</button></li>
              <li><button onClick={(e) => handleNav(e, 'journal')} className="text-gray-500 hover:text-gold-400 transition-colors">The Journal</button></li>
              <li><button onClick={(e) => handleNav(e, 'sustainability')} className="text-gray-500 hover:text-gold-400 transition-colors">Sustainability</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white uppercase tracking-widest font-bold mb-6 text-sm">Support</h3>
            <ul className="space-y-4">
              <li><button onClick={(e) => handleNav(e, 'faq')} className="text-gray-500 hover:text-gold-400 transition-colors text-left">FAQ</button></li>
              <li><button onClick={(e) => handleNav(e, 'shipping')} className="text-gray-500 hover:text-gold-400 transition-colors text-left">Shipping & Returns</button></li>
              <li><button onClick={(e) => handleNav(e, 'care')} className="text-gray-500 hover:text-gold-400 transition-colors text-left">Care Instructions</button></li>
              <li><button onClick={(e) => handleNav(e, 'warranty')} className="text-gray-500 hover:text-gold-400 transition-colors text-left">Warranty</button></li>
              <li><button onClick={(e) => handleNav(e, 'contact')} className="text-gray-500 hover:text-gold-400 transition-colors text-left">Contact Us</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white uppercase tracking-widest font-bold mb-6 text-sm">Newsletter</h3>
            <p className="text-gray-500 mb-4 text-sm">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex gap-2 relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribed}
                className="bg-white/5 border border-white/10 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-gold-400 w-full disabled:opacity-50 transition-all"
              />
              <button
                onClick={handleSubscribe}
                disabled={subscribed}
                className={`px-4 py-2 rounded-sm font-bold transition-all duration-300 min-w-[80px] flex items-center justify-center ${subscribed
                  ? 'bg-green-600 text-white'
                  : 'bg-gold-500 text-black hover:bg-gold-400'
                  }`}
              >
                {subscribed ? <Check size={18} /> : 'Join'}
              </button>
            </div>
            {subscribed && (
              <p className="text-green-500 text-xs mt-2 animate-slide-up">Welcome to the atelier.</p>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} A TO Z WoodArt. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
