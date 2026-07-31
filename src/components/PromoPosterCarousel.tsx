import React, { useState, useEffect, useRef } from 'react';
import { PromoPoster, Product, SiteSettings } from '../types';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Tag } from 'lucide-react';

interface PromoPosterCarouselProps {
  posters: PromoPoster[];
  siteSettings: SiteSettings;
  products: Product[];
  onOpenCheckout: (productId?: string) => void;
}

export const PromoPosterCarousel: React.FC<PromoPosterCarouselProps> = ({
  posters,
  siteSettings,
  products,
  onOpenCheckout
}) => {
  // Safe ON/OFF Check
  if (siteSettings.showPromotionalPosters === false) {
    return null;
  }

  // Filter and sort active posters
  const activePosters = (posters || [])
    .filter((p) => p.isActive)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (activePosters.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Keep index in range if posters list changes
  useEffect(() => {
    if (currentIndex >= activePosters.length) {
      setCurrentIndex(0);
    }
  }, [activePosters.length, currentIndex]);

  // Auto-rotate every 4.5 seconds
  useEffect(() => {
    if (activePosters.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePosters.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [activePosters.length, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activePosters.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activePosters.length) % activePosters.length);
  };

  // Touch Swipe handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  const currentPoster = activePosters[currentIndex] || activePosters[0];
  const linkedProduct = products.find((p) => p.id === currentPoster.productId);

  const handlePosterClick = () => {
    if (currentPoster.productId) {
      onOpenCheckout(currentPoster.productId);
    } else {
      onOpenCheckout();
    }
  };

  return (
    <section 
      aria-label="Promotional Offers"
      className="w-full pt-3 pb-2 sm:pt-4 sm:pb-3"
    >
      <div className="w-[92%] sm:w-full max-w-5xl mx-auto px-0 sm:px-4">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[165px] sm:h-[190px] md:h-[200px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-purple-500/25 shadow-xl shadow-purple-950/20 group select-none transition-all"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-slate-900 to-cyan-900/30 pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Background Image / Pattern if available */}
          {currentPoster.imageUrl ? (
            <div className="absolute inset-0 z-0">
              <img
                src={currentPoster.imageUrl}
                alt={currentPoster.title}
                className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            </div>
          ) : null}

          {/* Slide Content */}
          <div className="relative z-10 w-full h-full flex items-center justify-between px-4 sm:px-8 py-3">
            <div className="max-w-[70%] sm:max-w-[65%] space-y-1.5 sm:space-y-2">
              {/* Special Tag/Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-400/30 text-[10px] sm:text-xs font-bold text-cyan-300 tracking-wider uppercase backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                <span>Special Deal • SubX Nepal</span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-tight line-clamp-1 drop-shadow-md">
                {currentPoster.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 leading-snug">
                {currentPoster.subtitle}
              </p>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  onClick={handlePosterClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-purple-600/30 hover:shadow-cyan-500/40 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{currentPoster.buttonText || 'Claim Offer'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Graphic / Price / Brand Card */}
            <div className="flex-shrink-0 ml-2">
              {linkedProduct ? (
                <div 
                  onClick={handlePosterClick}
                  className="cursor-pointer p-3 sm:p-4 rounded-2xl bg-slate-800/80 border border-white/10 hover:border-purple-400/40 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center mb-1 text-white shadow-md">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-400 line-clamp-1">
                    {linkedProduct.brand || linkedProduct.title}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-emerald-400">
                    NPR {linkedProduct.plans[0]?.priceNpr || 'Best'}
                  </span>
                </div>
              ) : (
                <div 
                  onClick={handlePosterClick}
                  className="cursor-pointer p-2.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-purple-900/60 to-cyan-900/60 border border-purple-400/30 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-lg hover:scale-105 transition-all"
                >
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center mb-1">
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-cyan-300 uppercase tracking-widest">
                    SubX Nepal
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Left Arrow Button */}
          {activePosters.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-white/10 text-white opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity z-20 focus:outline-none"
              aria-label="Previous Poster"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Right Arrow Button */}
          {activePosters.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-white/10 text-white opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity z-20 focus:outline-none"
              aria-label="Next Poster"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Pagination Dots */}
          {activePosters.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-950/50 backdrop-blur-sm border border-white/5">
              {activePosters.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-5 bg-gradient-to-r from-purple-400 to-cyan-400'
                      : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to poster ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
