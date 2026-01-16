import React from 'react';
import { Plus, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative w-full perspective-1000">
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-wood-900/10 border border-white/5 transition-all duration-500 group-hover:shadow-[0_20px_50px_-12px_rgba(184,134,11,0.15)] group-hover:-translate-y-2 group-hover:border-gold-500/30">

        {/* Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={product.imageUrl || '/images/wood-texture.png'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { e.currentTarget.src = '/images/wood-texture.png'; }}
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

          {/* Shine Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
        </div>

        {/* Badges */}
        {product.isNew && (
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-sm text-sm font-light">
            New
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-[2px]">
          <button
            onClick={() => onAddToCart(product)}
            className="mx-2 w-12 h-12 bg-white text-dark rounded-full flex items-center justify-center hover:bg-gold-400 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
            title="Add to Cart"
          >
            <Plus size={24} />
          </button>
          <button
            className="mx-2 w-12 h-12 bg-dark/80 text-white rounded-full flex items-center justify-center hover:bg-dark transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
            title="View Details"
          >
            <Eye size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {product.category}
          </p>
          <h3 className="text-xl text-white font-serif mb-1 group-hover:text-glow transition-all duration-300">
            {product.name}
          </h3>
          <p className="text-gray-300 font-light group-hover:text-white transition-colors">
            ₹{product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};
