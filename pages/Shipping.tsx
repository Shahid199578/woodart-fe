import React from 'react';
import { Truck, Globe, Package } from 'lucide-react';

export const ShippingPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-dark min-h-screen animate-reveal">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-12 text-center">Shipping & Returns</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white/5 rounded-sm">
            <Truck size={32} className="text-gold-400 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">White Glove Delivery</h3>
            <p className="text-gray-400 text-sm">Large furniture is delivered, unpacked, and assembled in your room of choice.</p>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-sm">
            <Globe size={32} className="text-gold-400 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">Global Shipping</h3>
            <p className="text-gray-400 text-sm">We securely crate and ship to over 30 countries worldwide.</p>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-sm">
            <Package size={32} className="text-gold-400 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">Secure Packaging</h3>
            <p className="text-gray-400 text-sm">Custom crates ensure your masterpiece arrives in pristine condition.</p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif text-white mb-4 border-b border-white/10 pb-2">Processing Time</h2>
            <p className="text-gray-400 leading-relaxed">
              In-stock items ship within 2-5 business days. Made-to-order pieces typically require 6-10 weeks for crafting and finishing before they are ready for shipment. You will receive updates throughout the creation process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4 border-b border-white/10 pb-2">Return Policy</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We want you to love your A TO Z WoodArt piece. If you are not completely satisfied, we accept returns on standard items within 30 days of delivery.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Item must be in original, unused condition.</li>
              <li>Return shipping costs are the responsibility of the customer.</li>
              <li>A 10% restocking fee applies to large furniture items.</li>
              <li>Custom commissioned pieces are final sale and cannot be returned.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
