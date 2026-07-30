import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  MessageCircle, 
  Clock, 
  Sparkles, 
  Menu, 
  X, 
  LayoutDashboard, 
  SearchCheck, 
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { FULL_WHATSAPP_PHONE, WHATSAPP_NUMBER, generateGeneralWhatsAppUrl } from '../utils/helpers';

interface HeaderProps {
  onOpenCheckout: (productId?: string) => void;
  onOpenOrderTracker: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenOrderTracker,
  searchQuery,
  setSearchQuery
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070a12]/90 backdrop-blur-xl border-b border-white/10 text-white shadow-2xl">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#070a12] rounded-[10px] flex items-center justify-center font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                S<span className="text-emerald-400">X</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-white font-sans">
                  Sub<span className="text-emerald-400">X</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  NEPAL
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider">PREMIUM DIGITAL STORE</span>
            </div>
          </a>
        </div>

        {/* Center Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-sm relative">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Gemini, YouTube, Netflix, CapCut..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-white/10 focus:border-emerald-500 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
          <button onClick={() => scrollToSection('products')} className="hover:text-emerald-400 transition-colors">
            Subscriptions
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-400 transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollToSection('trust-guarantee')} className="hover:text-emerald-400 transition-colors">
            Payment & Trust
          </button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-emerald-400 transition-colors">
            FAQ
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenOrderTracker}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <SearchCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Track Order</span>
          </button>

          <a
            href={generateGeneralWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span className="hidden sm:inline">WhatsApp Order</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1420] border-b border-white/10 px-4 pt-3 pb-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-2">
            <button 
              onClick={() => scrollToSection('products')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-slate-200"
            >
              <span>Explore Products</span>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </button>
            <button 
              onClick={onOpenOrderTracker}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-cyan-300"
            >
              <span>Track Order</span>
              <SearchCheck className="w-4 h-4 text-cyan-400" />
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-slate-200"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-slate-200"
            >
              <span>FAQ</span>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-center">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: +977 {WHATSAPP_NUMBER}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
