import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Clock, 
  Users, 
  CreditCard,
  Gift
} from 'lucide-react';
import { WHATSAPP_NUMBER, generateGeneralWhatsAppUrl } from '../utils/helpers';
import { LIVE_ORDERS_FEED } from '../data/initialData';

interface HeroProps {
  onBuyNowClick: () => void;
  onOpenCheckoutWithProduct: (productId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onBuyNowClick, onOpenCheckoutWithProduct }) => {
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeedIndex((prev) => (prev + 1) % LIVE_ORDERS_FEED.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeFeed = LIVE_ORDERS_FEED[currentFeedIndex];

  return (
    <div className="relative overflow-hidden bg-[#0b0f17] border-b border-white/10 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-emerald-600/15 via-cyan-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-semibold text-emerald-300 shadow-xl shadow-emerald-950/40 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>SubX Nepal • Nepal’s #1 Verified Digital Store</span>
            </div>

            {/* Headline & Tagline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Elevate Your Digital Life with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  SubX Nepal
                </span>
              </h1>
              
              <p className="text-lg sm:text-2xl font-black text-emerald-400 font-sans tracking-wide">
                "Premium Digital Subscriptions at Best Prices"
              </p>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Unlock instant full-access subscriptions for <strong className="text-white">Google Gemini AI</strong>, <strong className="text-white">YouTube Premium</strong>, <strong className="text-white">CapCut Pro</strong>, <strong className="text-white">Netflix 4K</strong>, and <strong className="text-white">ChatGPT Plus</strong> in Nepal with zero hassle. Pay easily using <span className="text-emerald-400 font-semibold">eSewa</span>, <span className="text-purple-400 font-semibold">Khalti</span> & Bank Transfer.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onBuyNowClick}
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-base shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Browse Store Catalog</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-white/5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>5-15 Min</strong> Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>100% Genuine</strong> Guarantee</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-white/5">
                <CreditCard className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>eSewa & Khalti</strong> Accepted</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-white/5">
                <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                <span><strong>3,500+</strong> Happy Customers</span>
              </div>
            </div>

          </div>

          {/* Right Column: Featured Subscriptions Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0e1522] border border-emerald-500/30 p-5 sm:p-6 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl">
              
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-bold text-slate-300 ml-2">HOT DEAL SPOTLIGHT</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  SPECIAL OFFER
                </span>
              </div>

              {/* Spotlight Product 1: Google Gemini AI 1 Year */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-purple-950/80 border border-blue-500/30 mb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                      ✨
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">Google Gemini AI</h3>
                      <p className="text-[11px] text-slate-300">1 Year Full Premium Pass</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through block">NPR 3,999</span>
                    <span className="text-base font-extrabold text-emerald-400">NPR 1,299</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1 border-t border-white/10">
                  <span>AI Assistant • Cloud Benefits • Gemini 1.5 Pro</span>
                  <button 
                    onClick={() => onOpenCheckoutWithProduct('gemini-ai')}
                    className="text-xs font-bold text-cyan-300 hover:text-white underline"
                  >
                    Buy NPR 1299 →
                  </button>
                </div>
              </div>

              {/* Spotlight Grid: YouTube Premium & Netflix 4K */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* YouTube */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-red-500/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                      YT
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">YouTube Premium</h4>
                      <p className="text-[10px] text-red-400 font-semibold">NPR 499/mo</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onOpenCheckoutWithProduct('youtube-premium')}
                    className="w-full py-1 rounded bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-[11px] font-bold text-red-200 transition-colors"
                  >
                    Get YT Premium
                  </button>
                </div>

                {/* Netflix */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-red-600/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-red-700 flex items-center justify-center font-bold text-white text-xs">
                      N
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Netflix 4K UHD</h4>
                      <p className="text-[10px] text-red-400 font-semibold">NPR 499/mo</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onOpenCheckoutWithProduct('netflix-premium')}
                    className="w-full py-1 rounded bg-red-700/20 hover:bg-red-700/40 border border-red-600/30 text-[11px] font-bold text-red-200 transition-colors"
                  >
                    Get Netflix 4K
                  </button>
                </div>
              </div>

              {/* Live Ticker Feed Notification */}
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-semibold">Recent Customer Order</span>
                    <span>{activeFeed.timeAgo}</span>
                  </div>
                  <p className="font-medium text-slate-200 mt-0.5">
                    <strong>{activeFeed.customerName}</strong> ({activeFeed.city}) bought{' '}
                    <span className="text-cyan-300">{activeFeed.productTitle}</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
