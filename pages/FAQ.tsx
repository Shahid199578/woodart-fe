import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-gold-400 transition-colors group"
      >
        <span className="text-lg font-serif text-white group-hover:text-gold-400 transition-colors">{question}</span>
        {isOpen ? <ChevronUp className="text-gold-400" size={20} /> : <ChevronDown className="text-gray-500" size={20} />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export const FAQPage: React.FC = () => {
  const faqs = [
    { q: "How do I care for my live-edge table?", a: "Dust regularly with a soft cloth. For deeper cleaning, use a damp cloth with mild soap, followed immediately by a dry cloth. Apply a high-quality beeswax conditioner every 6 months to maintain the wood's luster." },
    { q: "Where is your wood sourced from?", a: "We source 100% of our timber from sustainable forests or reclaimed structures in the Pacific Northwest. We believe in breathing new life into old wood." },
    { q: "Can I customize a piece?", a: "Absolutely. Many of our pieces are made-to-order. Please contact us via the Contact page to discuss dimensions, wood types, and finishes for your custom commission." },
    { q: "Do you ship internationally?", a: "Yes, we ship to over 30 countries. International shipping rates are calculated at checkout. Please note that duties and taxes are the responsibility of the recipient." },
    { q: "What is your return policy?", a: "We accept returns within 30 days of delivery for items in original condition. Custom commissioned pieces are final sale. Return shipping costs are deducted from the refund." },
    { q: "Is there a warranty?", a: "All A TO Z WoodArt furniture comes with a lifetime structural warranty. This covers joinery failure and wood cracking due to craftsmanship." }
  ];

  return (
    <div className="pt-32 pb-24 bg-dark min-h-screen animate-reveal">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-gray-400 text-center mb-16">Answers to common inquiries about our craft and service.</p>

        <div className="bg-white/5 rounded-sm p-8 border border-white/5">
          {faqs.map((item, idx) => <FAQItem key={idx} question={item.q} answer={item.a} />)}
        </div>
      </div>
    </div>
  );
};
