import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { generateGeneralWhatsAppUrl, WHATSAPP_NUMBER } from '../utils/helpers';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
      {/* Mini Popover Preview - Only visible when toggled */}
      {showTooltip && (
        <div className="relative max-w-xs p-3.5 rounded-2xl bg-[#0f172a]/95 border border-emerald-500/50 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-800 border border-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
                SX
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
            </div>

            <div className="text-xs space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-emerald-400">SubX Nepal Support</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">Online</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-snug">
                Namaste! Need instant help with ChatGPT, YouTube Premium, Netflix, or Canva? Chat with us!
              </p>
              <a
                href={generateGeneralWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-400 hover:text-emerald-300 pt-1"
              >
                <span>Start WhatsApp Chat</span>
                <Send className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-extrabold shadow-xl backdrop-blur-md hover:bg-slate-800 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Support 24/7</span>
        </button>

        <a
          href={generateGeneralWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="relative group flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
          title="Chat on WhatsApp"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 pointer-events-none" />
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-emerald-600" />
        </a>
      </div>
    </div>
  );
};
