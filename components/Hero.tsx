import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
  background?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title = "Shape of Nature's Soul",
  subtitle = "Timeless wooden masterpieces handcrafted for the modern sanctuary.",
  image,
  background = "/images/hero_bg.png"
}) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={background}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-60 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="block text-gold-400 uppercase tracking-[0.3em] mb-6 text-sm md:text-base animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Est. 1984 &bull; Artisan Crafted
        </span>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <span dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br/>') }} />
        </h1>

        <p className="text-gray-400 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.6s' }}>
          {subtitle}
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <Button variant="primary" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Collection
          </Button>
          <Button variant="outline">
            Our Story
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
        <span className="text-[10px] uppercase tracking-widest text-gray-500">Scroll</span>
        <ArrowDown className="text-gold-400" size={20} />
      </div>
    </section>
  );
};
