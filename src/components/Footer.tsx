import React from 'react';
import { MessageCircle, ShieldCheck, Heart, Sparkles, Phone, Mail, MapPin } from 'lucide-react';
import { WHATSAPP_NUMBER, generateGeneralWhatsAppUrl } from '../utils/helpers';

interface FooterProps {
  onOpenOrderTracker: () => void;
  onToggleAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrderTracker, onToggleAdmin }) => {
  return (
    <footer className="bg-[#070a10] border-t border-white/10 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-[#070a10] rounded-[11px] flex items-center justify-center font-black text-lg text-emerald-400">
                  SX
                </div>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  Sub<span className="text-emerald-400">X</span> Nepal
                </span>
                <span className="text-[10px] text-slate-400 block tracking-wider">PREMIUM DIGITAL MARKETPLACE</span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed max-w-sm">
              Nepal’s premier destination for genuine digital subscriptions. Get Google Gemini AI, YouTube Premium, CapCut Pro, and Netflix 4K with instant 5-15 minute delivery across Nepal.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 font-semibold pt-1">
              <Phone className="w-4 h-4" />
              <span>WhatsApp Hotline: +977 {WHATSAPP_NUMBER}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Popular Subscriptions</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Google Gemini AI 1 Year</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">YouTube Premium (NPR 499/mo)</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">CapCut Premium Creator Pass</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Netflix 4K Ultra HD</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">ChatGPT Plus GPT-4o</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Customer Care & Portal</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={onOpenOrderTracker} className="hover:text-emerald-400 transition-colors text-left">
                  🔍 Track Order Status
                </button>
              </li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">⚡ How To Buy Guide</a></li>
              <li><a href="#trust-guarantee" className="hover:text-emerald-400 transition-colors">🛡️ Payment & Guarantee Policy</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">❓ Frequently Asked Questions</a></li>
              <li>
                <a 
                  href={generateGeneralWhatsAppUrl()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1 pt-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>24/7 WhatsApp Support Chat</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Payment Badges & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 <strong>SubX Nepal</strong>. All rights reserved. Nepal Digital Services.
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-medium">Accepted Payments:</span>
            <span className="bg-slate-900 border border-white/10 px-2 py-0.5 rounded text-emerald-300 font-bold">eSewa</span>
            <span className="bg-slate-900 border border-white/10 px-2 py-0.5 rounded text-purple-300 font-bold">Khalti</span>
            <span className="bg-slate-900 border border-white/10 px-2 py-0.5 rounded text-blue-300 font-bold">Bank Transfer</span>
          </div>

          <button
            onClick={onToggleAdmin}
            className="text-slate-500 hover:text-amber-400 transition-colors underline"
          >
            Admin Portal
          </button>
        </div>

      </div>
    </footer>
  );
};
