import React from 'react';
import { Truck, ShieldCheck, HelpCircle, Mail, MessageCircle } from 'lucide-react';
import { Page } from '../types';
import { Button } from '../components/Button';

interface SupportPageProps {
  onNavigate: (page: Page) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const supportOptions = [
    { icon: HelpCircle, title: 'FAQ', desc: 'Common questions regarding our products and process.', page: 'faq' as Page },
    { icon: Truck, title: 'Shipping & Returns', desc: 'Delivery times, international shipping, and return policies.', page: 'shipping' as Page },
    { icon: ShieldCheck, title: 'Warranty', desc: 'Details on our lifetime craftsmanship guarantee.', page: 'warranty' as Page },
    { icon: MessageCircle, title: 'Care Guide', desc: 'How to maintain the beauty of your wood.', page: 'care' as Page },
    { icon: Mail, title: 'Contact Us', desc: 'Reach out directly to our support team.', page: 'contact' as Page },
  ];

  return (
    <div className="pt-32 pb-24 bg-dark min-h-screen animate-reveal">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-4 block">Help Center</span>
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">How can we assist you?</h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-20">
          Our commitment to you extends beyond the workshop. Explore our resources or get in touch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {supportOptions.map((opt) => (
            <div 
              key={opt.title}
              onClick={() => onNavigate(opt.page)}
              className="bg-white/5 p-8 rounded-sm border border-white/5 hover:border-gold-400/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer text-left"
            >
              <opt.icon size={32} className="text-gold-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">{opt.title}</h3>
              <p className="text-gray-400 text-sm mb-6 h-12">{opt.desc}</p>
              <span className="text-xs uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors flex items-center gap-2">
                Learn More <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-wood-900/20 rounded-sm border border-white/5">
           <h2 className="text-3xl font-serif text-white mb-4">Still need help?</h2>
           <p className="text-gray-400 mb-8">Our artisans are available Monday through Friday, 9am - 6pm PST.</p>
           <Button onClick={() => onNavigate('contact')}>Get in Touch</Button>
        </div>
      </div>
    </div>
  );
};
