import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Youtube, 
  Video, 
  Tv, 
  Bot, 
  Palette, 
  Music, 
  Cpu, 
  MessageCircle, 
  ShoppingBag, 
  Zap, 
  Star, 
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Category, Product, ProductPlan } from '../types';
import { formatNpr, generateGeneralWhatsAppUrl } from '../utils/helpers';

interface ProductCatalogProps {
  products: Product[];
  onOpenCheckout: (productId: string, planId?: string) => void;
  searchQuery: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onOpenCheckout,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});

  const categories: Category[] = ['All', 'AI Tools', 'Streaming', 'Design & Video', 'Productivity'];

  const handlePlanChange = (productId: string, planId: string) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [productId]: planId
    }));
  };

  // Icon mapping (supports uploaded Base64 images, URLs, and preset Lucide icons)
  const renderIcon = (logoIcon: string) => {
    if (
      !logoIcon ||
      logoIcon.startsWith('http://') || 
      logoIcon.startsWith('https://') || 
      logoIcon.startsWith('data:') || 
      logoIcon.startsWith('/')
    ) {
      if (!logoIcon) return <Sparkles className="w-6 h-6 text-emerald-400" />;
      return (
        <img 
          src={logoIcon} 
          alt="Product Logo" 
          className="w-full h-full object-cover rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105" 
          referrerPolicy="no-referrer" 
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }} 
        />
      );
    }
    const iconKey = logoIcon.toLowerCase();
    if (iconKey.includes('bot') || iconKey.includes('chatgpt')) {
      return <Bot className="w-6 h-6 text-emerald-400" />;
    }
    if (iconKey.includes('tv') || iconKey.includes('netflix')) {
      return <Tv className="w-6 h-6 text-red-500" />;
    }
    if (iconKey.includes('palette') || iconKey.includes('canva')) {
      return <Palette className="w-6 h-6 text-purple-300" />;
    }
    if (iconKey.includes('youtube')) {
      return <Youtube className="w-6 h-6 text-red-400" />;
    }
    if (iconKey.includes('music') || iconKey.includes('spotify')) {
      return <Music className="w-6 h-6 text-emerald-300" />;
    }
    if (iconKey.includes('video') || iconKey.includes('prime')) {
      return <Video className="w-6 h-6 text-cyan-300" />;
    }
    if (iconKey.includes('cpu')) {
      return <Cpu className="w-6 h-6 text-amber-400" />;
    }
    if (iconKey.includes('gemini') || iconKey.includes('sparkles')) {
      return <Sparkles className="w-6 h-6 text-amber-300" />;
    }
    return <Sparkles className="w-6 h-6 text-emerald-400" />;
  };

  // Filter products by category & search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.title.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.features.some(f => f.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-16 bg-[#0b0f17] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>OFFICIAL SUBSCRIPTION MARKETPLACE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Subscription Plan</span>
          </h2>
          <p className="text-sm text-slate-300">
            Instant 5-15 minute delivery in Nepal. Authentic accounts with warranty guarantee.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-emerald-500/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count Info */}
        {searchQuery && (
          <div className="mb-6 text-xs text-slate-400 flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-white/10">
            <span>Showing results for "<strong className="text-emerald-400">{searchQuery}</strong>" ({filteredProducts.length} found)</span>
          </div>
        )}

        {/* Empty Search State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-white/10 space-y-4">
            <p className="text-slate-400 text-sm">No subscription found matching "{searchQuery}".</p>
            <p className="text-xs text-slate-400">Looking for a specific subscription not listed? Contact us directly on WhatsApp!</p>
            <a 
              href={generateGeneralWhatsAppUrl(`I am looking for a subscription: ${searchQuery}`)} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const currentPlanId = selectedPlans[product.id] || product.selectedPlanId;
            const currentPlan = product.plans.find((p) => p.id === currentPlanId) || product.plans[0];

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl bg-[#121824] border border-white/10 hover:border-emerald-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/40 hover:-translate-y-1"
              >
                {/* Badge Tag */}
                {product.badge && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-[10px] font-black tracking-wider uppercase text-slate-950 shadow-md">
                    {product.badge}
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#090d16] border border-white/15 p-2 flex items-center justify-center shadow-xl relative overflow-hidden group-hover:border-emerald-400/50 transition-all shrink-0">
                        {renderIcon(product.logoIcon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block truncate">
                          {product.brand}
                        </span>
                        <h3 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors leading-snug truncate">
                          {product.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Stock Status & Rating */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/5">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Zap className="w-3 h-3 fill-emerald-400" />
                      <span>{product.stockStatus}</span>
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Duration Plan Selector */}
                  <div className="mb-4">
                    <label className="text-[11px] font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                      Select Plan / Duration:
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {product.plans.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => handlePlanChange(product.id, plan.id)}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all border ${
                            currentPlan.id === plan.id
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-slate-900/80 border-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${currentPlan.id === plan.id ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                            <span>{plan.name}</span>
                          </span>
                          <span className="font-semibold text-white">
                            {formatNpr(plan.priceNpr)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feature Checkmarks */}
                  <div className="space-y-2 mb-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Included Features:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Price & Buy Actions */}
                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Total Price:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-emerald-400">
                          {formatNpr(currentPlan.priceNpr)}
                        </span>
                        {currentPlan.originalPriceNpr && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatNpr(currentPlan.originalPriceNpr)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-300 flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-white/10">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{product.deliveryTime}</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenCheckout(product.id, currentPlan.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>Buy Now</span>
                    </button>

                    <a
                      href={generateGeneralWhatsAppUrl(`Hi SubX Nepal, I want to buy ${product.title} (${currentPlan.duration}) for ${formatNpr(currentPlan.priceNpr)}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-500 text-slate-900" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
