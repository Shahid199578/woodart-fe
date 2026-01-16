import React from 'react';
import { Droplets, Sun, Wind } from 'lucide-react';

export const CarePage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-dark min-h-screen animate-reveal">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 text-center">Care & Maintenance</h1>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Wood is a living material that breathes and responds to its environment. Proper care ensures your heirloom lasts for generations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
           <img 
             src="https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&q=80&w=800" 
             alt="Oiling wood" 
             className="rounded-sm shadow-2xl opacity-80"
           />
           <div className="flex flex-col justify-center space-y-6">
             <div className="flex gap-4">
               <Droplets className="text-gold-400 flex-shrink-0" size={24} />
               <div>
                 <h3 className="text-xl font-bold text-white mb-2">Oiling & Feeding</h3>
                 <p className="text-gray-400 text-sm leading-relaxed">
                   We recommend applying a high-quality beeswax or tung oil every 6 months. This nourishes the wood fibers and maintains the rich, satin luster of the finish. Apply with a clean cotton cloth in the direction of the grain.
                 </p>
               </div>
             </div>
             <div className="flex gap-4">
               <Sun className="text-gold-400 flex-shrink-0" size={24} />
               <div>
                 <h3 className="text-xl font-bold text-white mb-2">Sunlight Exposure</h3>
                 <p className="text-gray-400 text-sm leading-relaxed">
                   Direct, prolonged sunlight can cause wood to fade or darken over time. While some patina is desirable, we suggest rotating decor on tables occasionally to ensure even aging.
                 </p>
               </div>
             </div>
             <div className="flex gap-4">
               <Wind className="text-gold-400 flex-shrink-0" size={24} />
               <div>
                 <h3 className="text-xl font-bold text-white mb-2">Humidity Control</h3>
                 <p className="text-gray-400 text-sm leading-relaxed">
                   Wood expands and contracts with moisture. Aim to keep your home's humidity between 40-60%. Avoid placing solid wood furniture directly next to heating vents or radiators.
                 </p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
