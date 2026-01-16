import React from 'react';
import { TreePine, Recycle, HeartHandshake } from 'lucide-react';

export const SustainabilityPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-dark animate-reveal">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-12 text-center">Deep Roots</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
           {[
             { icon: TreePine, title: "Responsible Sourcing", text: "We only use wood from FSC-certified forests or reclaimed sources (barns, fallen trees)." },
             { icon: Recycle, title: "Zero Waste", text: "Sawdust is composted, and offcuts are turned into small goods or handles for our tools." },
             { icon: HeartHandshake, title: "Community First", text: "We invest 5% of profits into local reforestation projects in the Pacific Northwest." }
           ].map((item, idx) => (
             <div key={idx} className="bg-white/5 p-8 rounded-sm border border-white/5 hover:border-gold-400/30 transition-colors group">
                <item.icon size={48} className="text-gold-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.text}</p>
             </div>
           ))}
        </div>

        <div className="relative rounded-lg overflow-hidden h-96 mb-16">
           <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000" alt="Forest" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
           <div className="absolute bottom-8 left-8">
             <h2 className="text-3xl font-serif text-white mb-2">One Tree Planted</h2>
             <p className="text-gray-200">For every order over $500, we plant 10 trees.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
