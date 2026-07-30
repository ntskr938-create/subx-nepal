import React from 'react';
import { ShoppingBag, SearchCheck, MessageCircle } from 'lucide-react';
import { generateGeneralWhatsAppUrl } from '../utils/helpers';

interface MobileBottomNavProps {
  onOpenOrderTracker: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenOrderTracker
}) => {
  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f17]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 flex items-center justify-around text-slate-300">
      <button
        onClick={scrollToProducts}
        className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-300 hover:text-emerald-400"
      >
        <ShoppingBag className="w-5 h-5 text-emerald-400" />
        <span>Store Catalog</span>
      </button>

      <button
        onClick={onOpenOrderTracker}
        className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-300 hover:text-cyan-400"
      >
        <SearchCheck className="w-5 h-5 text-cyan-400" />
        <span>Track Order</span>
      </button>

      <a
        href={generateGeneralWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-emerald-400"
      >
        <div className="p-1 rounded-full bg-emerald-500 text-slate-950">
          <MessageCircle className="w-4 h-4 fill-slate-950 text-emerald-500" />
        </div>
        <span>WhatsApp Order</span>
      </a>
    </div>
  );
};
