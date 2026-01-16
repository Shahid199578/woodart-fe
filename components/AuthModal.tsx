import React, { useState } from 'react';
import { X, User as UserIcon, LogOut, Mail, Lock, Check } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, user, onLogin, onLogout }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (view === 'register') {
        await authService.register(email, name, password, name); // Using name as username for now
        setView('login');
        alert("Account created! Please sign in."); // Simple feedback
      } else {
        const data = await authService.login(email, password);
        // Verify role from /me or decode token. For now, we assume success and fetch profile
        const profile = await authService.getProfile(); // Assuming /me returns full profile including role
        if (profile) {
          onLogin({ name: profile.full_name || name, email: profile.email, role: profile.role });
          onClose();
        }
      }
    } catch (err) {
      alert("Authentication failed. Please check credentials.");
    }
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-dark border border-white/10 p-8 rounded-lg shadow-2xl animate-reveal overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {user ? (
          // Profile View
          <div className="text-center space-y-6 py-6">
            <div className="w-24 h-24 mx-auto bg-wood-800 rounded-full flex items-center justify-center border-2 border-gold-400/30">
              <UserIcon size={40} className="text-gold-400" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-white mb-1">Welcome, {user.full_name || user.username || 'Artisan'}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-sm">
                <span className="text-gray-300 text-sm">Member Status</span>
                <span className="text-gold-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Check size={12} /> Gold Tier
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-sm">
                <span className="text-gray-300 text-sm">Recent Orders</span>
                <span className="text-white text-sm">0</span>
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout} className="w-full border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-400">
              <span className="flex items-center gap-2">
                <LogOut size={16} /> Sign Out
              </span>
            </Button>
          </div>
        ) : (
          // Login/Register View
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-white mb-2">
                {view === 'login' ? 'Welcome Back' : 'Join the Atelier'}
              </h2>
              <p className="text-gray-400 text-sm">
                {view === 'login' ? 'Access your curated collection' : 'Begin your journey with handcrafted excellence'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {view === 'register' && (
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-3 text-gray-500 group-focus-within:text-gold-400 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors"
                    required
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-gray-500 group-focus-within:text-gold-400 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-gold-400 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors"
                  required
                />
              </div>

              <Button type="submit" className="w-full justify-center mt-6">
                {view === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">
                {view === 'login' ? "Don't have an account? " : "Already a member? "}
              </span>
              <button
                onClick={() => setView(view === 'login' ? 'register' : 'login')}
                className="text-gold-400 hover:text-gold-300 font-bold underline decoration-transparent hover:decoration-gold-400 transition-all"
              >
                {view === 'login' ? 'Register' : 'Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
