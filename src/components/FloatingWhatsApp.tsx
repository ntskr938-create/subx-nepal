import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { generateGeneralWhatsAppUrl, WHATSAPP_NUMBER } from '../utils/helpers';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
      {/* Mini Popover Preview */}
      {showTooltip && (
        <div className="relative max-w-xs p-3 rounded-2xl bg-slate-900/95 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-xl animate-bounce-slow">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
          
          <div className="flex items-start gap-2.5">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-extrabold text-slate-950 text-xs">
                SX
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
            </div>

            <div className="text-xs space-y-1">
              <div className="flex items-center gap-1">
                <span className="font-bold text-emerald-400">SubX Support</span>
                <span className="text-[10px] text-slate-400">Online</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-snug">
                Namaste! Need help with Google Gemini, YouTube, or Netflix? Chat with us now!
              </p>
              <a
                href={generateGeneralWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline pt-0.5"
              >
                <span>Start WhatsApp Chat</span>
                <Send className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href={generateGeneralWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-all duration-300 active:scale-95"
        title="Chat on WhatsApp"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30 pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-white text-emerald-600" />
      </a>
    </div>
  );
};
