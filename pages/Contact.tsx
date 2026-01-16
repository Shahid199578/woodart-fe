import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '../components/Button';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-dark min-h-screen animate-reveal">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-16 text-center">Get in Touch</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-serif text-white mb-6">Visit the Atelier</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                While we are primarily a workshop, we welcome visitors by appointment to view our material library and discuss custom projects.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-wood-800 p-3 rounded-sm">
                    <MapPin className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Location</h3>
                    <p className="text-gray-400">124 Artisan Way, District 9<br />Portland, Oregon 97209</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-wood-800 p-3 rounded-sm">
                    <Phone className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Phone</h3>
                    <p className="text-gray-400">1-800-WOODART (555-0199)</p>
                    <p className="text-gray-500 text-sm">Mon-Fri, 9am - 6pm PST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-wood-800 p-3 rounded-sm">
                    <Mail className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Email</h3>
                    <p className="text-gray-400">info@atozwoodart.com</p>
                    <p className="text-gray-400">sales@atozwoodart.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-wood-900/20 p-8 rounded-sm border border-white/5">
              <h3 className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-2">Trade Program</h3>
              <p className="text-gray-400 text-sm">
                Are you an interior designer or architect? Join our trade program for exclusive pricing and customization options.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/5 p-8 md:p-12 rounded-sm border border-white/5">
            <h2 className="text-2xl font-serif text-white mb-6">Send a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Name</label>
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-sm p-3 text-white focus:border-gold-400 outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Email</label>
                  <input type="email" className="w-full bg-black/40 border border-white/10 rounded-sm p-3 text-white focus:border-gold-400 outline-none transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Subject</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-sm p-3 text-gray-400 focus:border-gold-400 outline-none transition-colors">
                  <option>General Inquiry</option>
                  <option>Order Status</option>
                  <option>Custom Commission</option>
                  <option>Warranty Claim</option>
                  <option>Press & Media</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Message</label>
                <textarea rows={6} className="w-full bg-black/40 border border-white/10 rounded-sm p-3 text-white focus:border-gold-400 outline-none resize-none transition-colors"></textarea>
              </div>

              <Button className="w-full justify-center">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
