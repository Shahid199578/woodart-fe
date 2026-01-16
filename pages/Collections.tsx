import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { Filter, ChevronDown, RefreshCw, Search } from 'lucide-react';

interface CollectionsPageProps {
  onAddToCart: (product: Product) => void;
  initialSearchQuery?: string;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onAddToCart, initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await productService.getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    productService.getCategories().then(cats => {
      setCategories(['All', ...cats.map((c: any) => c.name)]);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [searchQuery, selectedCategory, sortOption]);

  return (
    <div className="pt-32 pb-24 px-4 md:px-12 min-h-screen bg-dark animate-reveal">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">The Collection</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our range of handcrafted artifacts, each a unique dialogue between nature and artisan.
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-12 flex flex-col lg:flex-row justify-between items-center gap-6 bg-white/5 p-6 rounded-sm border border-white/5 backdrop-blur-sm sticky top-24 z-30 shadow-2xl">
          {/* Search Input */}
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-sm py-2 pl-10 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center flex-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-sm text-sm uppercase tracking-wider transition-all duration-300 ${selectedCategory === cat
                  ? 'bg-gold-500 text-black font-bold shadow-lg shadow-gold-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative group w-full lg:w-auto flex justify-end">
            <button className="flex items-center gap-2 text-white bg-black/40 px-4 py-2 rounded-sm border border-white/10 hover:border-gold-400/50 transition-colors">
              <Filter size={14} className="text-gold-400" />
              <span className="text-sm uppercase tracking-wider">Sort</span>
              <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-dark border border-white/10 rounded-sm shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40">
              {[
                { label: 'Newest Arrivals', value: 'newest' },
                { label: 'Price: Low to High', value: 'price-asc' },
                { label: 'Price: High to Low', value: 'price-desc' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortOption(opt.value as any)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${sortOption === opt.value ? 'text-gold-400' : 'text-gray-400'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500">
            <RefreshCw size={48} className="mb-4 opacity-50" />
            <p className="text-xl font-serif mb-2">No artifacts found.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 text-gold-400 hover:text-white underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
