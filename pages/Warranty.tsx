import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';

export const WarrantyPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-dark min-h-screen animate-reveal">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <ShieldCheck size={64} className="text-gold-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">Lifetime Structural Warranty</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We stand behind every joint, tenon, and surface we create. Our warranty is a promise of enduring quality.
          </p>
        </div>

        <div className="bg-white/5 p-8 rounded-sm border border-white/5 mb-12">
          <h2 className="text-2xl font-serif text-white mb-6">What is Covered</h2>
          <ul className="space-y-4">
            {[
              "Structural failure of joinery (tenons, dovetails, biscuits).",
              "Cracking or splitting of wood caused by material defects or improper curing.",
              "Hardware failure (hinges, drawer slides) under normal use.",
              "Finish delamination or peeling (excluding normal wear)."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-400">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-serif text-white mb-4">Exclusions</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Our warranty does not cover normal wear and tear, damage from misuse, accidents, exposure to extreme humidity or temperature changes, or unauthorized repairs. Variations in wood grain and color are natural characteristics and are not considered defects.
          </p>
          <p className="text-gray-400 leading-relaxed">
            To make a claim, please contact our support team with your order number and photos of the issue.
          </p>
        </div>
      </div>
    </div>
  );
};
