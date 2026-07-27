import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, MessageCircle, Sparkles } from 'lucide-react';
import { FAQ_ITEMS } from '../data/initialData';
import { generateGeneralWhatsAppUrl } from '../utils/helpers';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-16 bg-[#0b0f17] text-white border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>GOT QUESTIONS? WE HAVE ANSWERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Frequently Asked <span className="text-cyan-400">Questions</span>
          </h2>
          <p className="text-sm text-slate-300">
            Everything you need to know about buying digital subscriptions in Nepal with SubX Nepal.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions (e.g. eSewa, delivery time, warranty)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-slate-800 text-cyan-400 transition-transform ${isOpen ? 'rotate-180 bg-cyan-500/20' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center space-y-3">
          <h4 className="font-extrabold text-base text-white">Have more questions before ordering?</h4>
          <p className="text-xs text-slate-300">Our customer support team is available 24/7 on WhatsApp to answer any queries!</p>
          <a
            href={generateGeneralWhatsAppUrl("Hi SubX Nepal, I have a question about digital subscriptions.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950 text-emerald-500" />
            <span>Chat on WhatsApp (+977 9765617156)</span>
          </a>
        </div>

      </div>
    </section>
  );
};
