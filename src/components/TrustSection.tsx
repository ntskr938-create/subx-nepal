import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Headphones, 
  RefreshCw, 
  Lock, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PAYMENT_METHODS } from '../data/initialData';
import { generateGeneralWhatsAppUrl } from '../utils/helpers';

export const TrustSection: React.FC = () => {
  return (
    <div id="trust-guarantee" className="py-16 bg-[#0b0f17] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 4 Pillars of Guarantee */}
        <div>
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              WHY SUBX NEPAL?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built on Trust, Speed, and <span className="text-emerald-400">Authenticity</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              We provide genuine digital subscription services in Nepal backed by complete warranty protection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white">100% Genuine Accounts</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All subscriptions are officially activated through legitimate merchant channels. Zero risk of suspension or interruption.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white">5-15 Min Instant Delivery</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our dedicated support team processes orders rapidly. Receive credentials directly on your WhatsApp and Email.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white">24/7 Nepali Support</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Have questions or need help? Chat directly with our friendly Nepali support team anytime on WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white">Full Duration Warranty</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We provide 100% replacement warranty for the entire duration of your plan (1 Month, 6 Months, or 1 Year).
              </p>
            </div>

          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0f172a] to-emerald-950/40 border border-emerald-500/30">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              4 EASY STEPS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How to Buy a Subscription on SubX Nepal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-extrabold text-sm text-white">Select Product</h4>
              <p className="text-xs text-slate-300">Choose Google Gemini, YouTube, CapCut, or Netflix plan.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-extrabold text-sm text-white">Pay via eSewa / Khalti</h4>
              <p className="text-xs text-slate-300">Transfer exact NPR amount to 9765617156 or Bank.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-extrabold text-sm text-white">Send Txn Code</h4>
              <p className="text-xs text-slate-300">Submit transaction code on checkout or WhatsApp.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto">
                4
              </div>
              <h4 className="font-extrabold text-sm text-white">Instant Delivery</h4>
              <p className="text-xs text-slate-300">Receive credentials via WhatsApp within 5-15 minutes!</p>
            </div>

          </div>
        </div>

        {/* Accepted Payment Methods Banner */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-extrabold text-base text-white">Accepted Local Payment Methods in Nepal</h4>
            <p className="text-xs text-slate-300">Fast, fee-free transfers directly from your favorite wallet or banking app.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
              🟢 eSewa
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs font-bold">
              🟣 Khalti
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-bold">
              🏦 Mobile Banking
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold">
              📱 FonePay QR
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
