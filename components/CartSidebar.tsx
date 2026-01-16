import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { Button } from './Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-dark border-l border-white/10 z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-wood-900/10">
          <h2 className="text-2xl font-serif text-white flex items-center gap-2">
            <ShoppingBag size={24} className="text-gold-400" />
            Your Selection
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <ShoppingBag size={48} className="mb-4 text-wood-600" />
              <p className="text-lg text-wood-200">Your cart is currently empty.</p>
              <p className="text-sm text-gray-500">Discover our handcrafted collection.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group animate-reveal">
                <div className="w-24 h-24 rounded-sm overflow-hidden bg-wood-800">
                  <img src={item.imageUrl || undefined} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-white">{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-400">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 w-max px-2 py-1 rounded-sm border border-white/5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-white font-mono w-4 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-wood-900/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 uppercase tracking-widest text-sm">Subtotal</span>
              <span className="text-2xl font-serif text-gold-400">₹{total.toFixed(2)}</span>
            </div>
            <Button className="w-full justify-center">
              Checkout Now
            </Button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Shipping & Taxes calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </>
  );
};
