import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-dark animate-reveal">
      {/* Header Image */}
      <div className="relative h-[60vh] w-full overflow-hidden mb-24">
        <img
          src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=2000"
          alt="Woodworking workshop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="text-6xl md:text-7xl font-serif text-white text-center">Our Story</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl space-y-24">
        {/* Mission */}
        <section className="text-center">
          <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-6 block">The Atelier</span>
          <p className="text-2xl md:text-3xl font-serif text-white leading-relaxed">
            "We believe that true luxury lies in the time, patience, and soul poured into an object. In a world of mass production, we choose the path of the artisan."
          </p>
        </section>

        {/* The Process */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1622396636133-74301385cc8e?auto=format&fit=crop&q=80&w=1000" alt="Detail" className="rounded-sm shadow-xl" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-white">The Hand & The Chisel</h2>
            <p className="text-gray-400 leading-relaxed">
              Founded in 1984 by Master Silas, A TO Z WoodArt began as a small workshop in the Pacific Northwest. We source reclaimed and sustainable timber, allowing the wood's natural imperfections to guide our designs.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Every joint is hand-cut, every surface hand-planed. We use traditional joinery techniques that have stood the test of centuries, avoiding screws and nails where possible to allow the wood to breathe and move with the seasons.
            </p>
          </div>
        </section>

        {/* Team Teaser */}
        <section className="bg-white/5 p-12 rounded-sm border border-white/5 text-center">
          <h2 className="text-3xl font-serif text-white mb-6">Meet the Artisans</h2>
          <p className="text-gray-400 mb-8">
            Our team comprises master woodworkers, finishers, and designers dedicated to the craft.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-wood-800/50 rounded-full mx-auto w-24 overflow-hidden border-2 border-transparent hover:border-gold-400 transition-colors">
                <img src={`https://i.pravatar.cc/150?img=${10 + i}`} alt="Artisan" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
