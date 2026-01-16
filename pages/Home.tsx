
import React from 'react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';
import { Product, Page } from '../types';
import { ArrowRight, Box, Hexagon, Zap, Shield, Play, Monitor, Smartphone, Wifi, Tv } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onAddToCart: (product: Product) => void;
}

import { API_URLS } from '../services/apiConfig';
import { ScrollReveal } from '../components/ScrollReveal';

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onAddToCart }) => {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [partners, setPartners] = React.useState<any[]>([]);
  const [siteConfig, setSiteConfig] = React.useState<any>({});

  React.useEffect(() => {
    const fetchData = async () => {
      const all = await productService.getProducts();
      setFeaturedProducts(all.slice(0, 3));

      const parts = await productService.getPartners();
      setPartners(parts);

      try {
        const configRes = await fetch(`${API_URLS.ADMIN}/dashboard/config/`);
        const configData = await configRes.json();
        setSiteConfig(configData);
      } catch (e) {
        console.error("Failed to fetch site config", e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      <Hero
        title={siteConfig.hero_title}
        subtitle={siteConfig.hero_subtitle}
        image={siteConfig.hero_image_url}
        background={siteConfig.hero_background_url || undefined}
      />

      {/* 2. Solutions / Why Choose Us */}
      <section className="py-24 relative">
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-dark/60 backdrop-blur-[2px]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal animation="slide-up">
            <div className="mb-16 text-center">
              <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-3 block">Solutions</span>
              <h2 className="text-4xl font-serif text-white">Refining Your Lifestyle</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Hexagon, title: 'Bespoke Design', desc: 'Tailored to your exact specifications.' },
              { icon: Shield, title: 'Lifetime Warranty', desc: 'Quality that stands the test of time.' },
              { icon: Zap, title: 'Smart Integration', desc: 'Seamlessly blends with modern tech.' },
              { icon: Box, title: 'White Glove Delivery', desc: 'Handled with care from our door to yours.' }
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100} animation="slide-up">
                <div className="group p-8 bg-black/40 border border-white/5 hover:border-gold-400/50 hover:bg-black/60 transition-all duration-500 hover:-translate-y-2 rounded-sm h-full backdrop-blur-sm">
                  <item.icon className="text-gold-400 mb-6 group-hover:scale-110 transition-transform duration-500" size={36} />
                  <h4 className="text-xl text-white mb-3 font-serif">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Smart Living Showcase */}
      <section className="min-h-screen flex flex-col md:flex-row bg-black/20">
        <div className="md:w-1/2 relative min-h-[600px] overflow-hidden group">
          <ScrollReveal animation="scale-up" duration={1000} className="w-full h-full">
            <img
              src="/images/smart_living.png"
              alt="Smart Living"
              className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110"
            />
          </ScrollReveal>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent md:hidden"></div>
        </div>

        <div className="md:w-1/2 p-12 md:p-24 flex flex-col justify-center bg-wood-900/40 backdrop-blur-md relative border-l border-white/5">
          {/* Decorative Orb */}
          <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>

          <ScrollReveal animation="slide-left" delay={200}>
            <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-4 block">Home Automation</span>
            <h2 className="text-5xl md:text-6xl font-serif text-white mb-8 leading-tight">
              Smart.<br />Integrated.<br />Seamless.
            </h2>
            <p className="text-gray-300 mb-10 max-w-md text-lg leading-relaxed font-light">
              Experience the perfect harmony of traditional craftsmanship and modern technology. Our furniture isn't just wood; it's an intelligent part of your home ecosystem.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="slide-up" delay={400}>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-12">
              <div className="flex items-center gap-4 text-white group">
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-gold-400/20 transition-colors"><Smartphone size={20} className="text-gold-400" /></div>
                <span className="text-sm tracking-wide">App Control</span>
              </div>
              <div className="flex items-center gap-4 text-white group">
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-gold-400/20 transition-colors"><Wifi size={20} className="text-gold-400" /></div>
                <span className="text-sm tracking-wide">IoT Ready</span>
              </div>
              <div className="flex items-center gap-4 text-white group">
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-gold-400/20 transition-colors"><Monitor size={20} className="text-gold-400" /></div>
                <span className="text-sm tracking-wide">Touch Surfaces</span>
              </div>
              <div className="flex items-center gap-4 text-white group">
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-gold-400/20 transition-colors"><Tv size={20} className="text-gold-400" /></div>
                <span className="text-sm tracking-wide">Hidden Media</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('collections')}
              className="text-white border-b border-gold-400 pb-2 hover:text-gold-400 hover:border-white transition-all uppercase tracking-widest text-sm font-semibold"
            >
              Discover The Series
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Process (Video Placeholder) */}
      <section className="relative h-[80vh] bg-fixed bg-cover bg-center flex items-center justify-center group" style={{ backgroundImage: "url('/images/process.png')" }}>
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-1000"></div>

        <div className="relative z-10 text-center px-4">
          <ScrollReveal animation="scale-up">
            <h2 className="text-white font-serif text-4xl md:text-6xl mb-12 drop-shadow-lg">The Art of Creation</h2>
            <button className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 hover:bg-gold-500 hover:border-gold-500 transition-all duration-300 group-hover:animate-pulse mx-auto">
              <Play fill="currentColor" className="ml-2" size={32} />
            </button>
            <p className="text-white/80 mt-6 uppercase tracking-[0.3em] text-sm">Watch the Process</p>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Featured Products */}
      <section className="py-32 relative bg-dark/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal animation="slide-up">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-3 block">New Arrivals</span>
                <h2 className="text-4xl font-serif text-white">Latest Masterpieces</h2>
              </div>
              <button
                onClick={() => onNavigate('collections')}
                className="text-white hover:text-gold-400 flex items-center gap-2 mt-6 md:mt-0 transition-colors group border border-white/10 px-6 py-3 hover:border-gold-400 rounded-sm"
              >
                View Full Collection
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 150} animation="slide-up">
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Portfolio / Gallery */}
      <section className="pb-32 bg-dark/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-serif text-white mb-16 text-center">In Situ</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[700px]">
            <ScrollReveal animation="fade-in" duration={1000} className="md:col-span-2 h-full">
              <div className="w-full h-full relative group overflow-hidden rounded-sm cursor-none">
                <img src="/images/portfolio_1.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" alt="Portfolio 1" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-10 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <h3 className="text-white text-3xl font-serif mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">The Horizon Villa</h3>
                  <p className="text-gold-400 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 uppercase">Los Angeles, CA</p>
                </div>
              </div>
            </ScrollReveal>

            <div className="md:col-span-1 grid grid-rows-2 gap-4 h-full">
              <ScrollReveal animation="slide-left" delay={200} className="h-full">
                <div className="relative group overflow-hidden rounded-sm h-full">
                  <img src="/images/smart_living.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" alt="Portfolio 2" />
                  <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-white text-xl font-serif">Urban Loft</h3>
                    <p className="text-gold-400 text-xs tracking-widest mt-1">New York, NY</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="slide-left" delay={400} className="h-full">
                <div className="relative group overflow-hidden rounded-sm h-full">
                  <img src="/images/process.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" alt="Portfolio 3" />
                  <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-white text-xl font-serif">Atelier Process</h3>
                    <p className="text-gold-400 text-xs tracking-widest mt-1">Milan, Italy</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Partners */}
      <section className="py-20 border-t border-white/5 bg-black/90 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <p className="text-center text-gray-500 text-xs uppercase tracking-[0.3em] mb-12">Trusted By Industry Leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
              {partners.length > 0 ? partners.map((partner, i) => (
                <div key={i} className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform duration-500 cursor-default opacity-60 hover:opacity-100 transition-opacity">
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="h-12 md:h-16 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
              )) : (
                <div className="text-gray-500 text-sm">No partners added yet.</div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
};
