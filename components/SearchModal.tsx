import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Package, TrendingUp } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductSelect: (product: Product) => void;
  onSearchSubmit: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductSelect,
  onSearchSubmit
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 5));
  }, [query, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(query);
    onClose();
  };

  const quickTags = ['Oak', 'Walnut', 'Chairs', 'Lighting', 'Decor'];

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-500 flex items-center justify-center ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Blurred Backdrop */}
      <div className="absolute inset-0 bg-dark/90 backdrop-blur-xl" onClick={onClose}></div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-gray-500 hover:text-white transition-transform hover:rotate-90 duration-300"
      >
        <X size={32} />
      </button>

      <div className="relative w-full max-w-3xl px-6 flex flex-col items-center">

        {/* Search Input Container */}
        <form onSubmit={handleSubmit} className="w-full relative group mb-12">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold-400 transition-colors duration-300" size={32} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the atelier..."
            className="w-full bg-transparent border-b border-white/10 py-6 pl-16 pr-16 text-4xl font-serif text-white placeholder-white/10 focus:outline-none transition-all"
          />
          {/* Animated Line */}
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-gold-500 to-wood-500 group-focus-within:w-full transition-all duration-700 ease-out"></div>

          <button
            type="submit"
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-gold-400 transition-all duration-300 ${query ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
          >
            <ArrowRight size={32} />
          </button>
        </form>

        {/* Quick Tags / Empty State */}
        {!query && (
          <div className="text-center animate-slide-up">
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">Popular Collections</p>
            <div className="flex flex-wrap justify-center gap-3">
              {quickTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); inputRef.current?.focus(); }}
                  className="px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-gold-500 hover:text-black hover:border-gold-500 text-gray-300 text-sm transition-all duration-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Results */}
        {results.length > 0 && (
          <div className="w-full space-y-2 animate-reveal">
            <div className="flex items-center gap-2 mb-4 text-gold-400 text-xs uppercase tracking-widest font-bold">
              <TrendingUp size={14} />
              <span>Matches Found</span>
            </div>
            {results.map((product, idx) => (
              <div
                key={product.id}
                onClick={() => {
                  onProductSelect(product);
                  onClose();
                }}
                style={{ animationDelay: `${idx * 0.05}s` }}
                className="flex items-center gap-6 p-4 rounded-sm hover:bg-white/5 cursor-pointer group transition-all duration-300 border-l-2 border-transparent hover:border-gold-400 animate-slide-up"
              >
                <div className="w-16 h-16 overflow-hidden rounded-sm bg-wood-800">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-serif text-white group-hover:text-gold-400 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {product.category}
                  </p>
                </div>
                <span className="text-white font-light group-hover:translate-x-[-10px] transition-transform duration-300">
                  ₹{product.price}
                </span>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              className="w-full py-4 text-center text-gray-500 hover:text-white text-sm uppercase tracking-widest mt-4 group"
            >
              View all results <span className="inline-block transition-transform group-hover:translate-x-1">-&gt;</span>
            </button>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="text-center text-gray-500 mt-8 animate-reveal">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p>No masterpieces found matching "{query}".</p>
          </div>
        )}
      </div>
    </div>
  );
};
