import React, { useState } from 'react';
import { Sparkles, Layers, Cpu, Database, Palette, Wrench, Globe, Check } from 'lucide-react';

export const TechStackMarquee = ({ categories = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Flatten items with category tags
  const allItems = categories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      category: cat.title,
    }))
  );

  // Split into 2 rows for opposite scrolling effect (for ALL view)
  const half = Math.ceil(allItems.length / 2);
  const row1 = allItems.slice(0, half);
  const row2 = allItems.slice(half);

  // Duplicate for seamless infinite loop
  const duplicatedRow1 = [...row1, ...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2, ...row2];

  const getIconUrl = (item) => {
    if (item.iconUrl) return item.iconUrl;
    if (!item.slug) return null;
    if (item.slug === 'canva') {
      return 'https://cdn.simpleicons.org/canva/00C4CC';
    }
    if (
      item.slug === 'googledocs' ||
      item.slug === 'docs' ||
      item.slug === 'gmail' ||
      item.slug === 'gsuite'
    ) {
      return 'https://cdn.simpleicons.org/googledocs/4285F4';
    }
    if (
      item.slug === 'googlesheets' ||
      item.slug === 'sheets' ||
      item.slug === 'excel'
    ) {
      return 'https://cdn.simpleicons.org/googlesheets/34A853';
    }
    return `https://skillicons.dev/icons?i=${item.slug}&theme=dark`;
  };

  const getCategoryIcon = (title) => {
    switch (title) {
      case 'Languages':
        return <Cpu className="w-3.5 h-3.5 text-pink-400" />;
      case 'Web Development':
        return <Globe className="w-3.5 h-3.5 text-sky-400" />;
      case 'Database':
        return <Database className="w-3.5 h-3.5 text-amber-400" />;
      case 'Design':
        return <Palette className="w-3.5 h-3.5 text-purple-400" />;
      case 'Productivity':
        return <Wrench className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const renderCard = (item, index, colorClass = 'pink') => {
    const iconSrc = getIconUrl(item);

    return (
      <div
        key={`${item.name}-${index}`}
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg hover:border-pink-500/50 hover:bg-slate-800/90 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/20 flex-shrink-0 group cursor-default"
      >
        <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform">
          {iconSrc ? (
            <img
              src={iconSrc}
              alt={item.name}
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                if (!e.target.dataset.triedFallback && item.slug) {
                  e.target.dataset.triedFallback = 'true';
                  e.target.src = `https://go-skill-icons.vercel.app/api/icons?i=${item.slug}&theme=dark`;
                } else {
                  e.target.style.display = 'none';
                }
              }}
            />
          ) : (
            <span className="text-xs font-bold text-pink-400">#</span>
          )}
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition-colors whitespace-nowrap">
            {item.label}
          </p>
          <p className="text-[9px] sm:text-[10px] font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">
            {item.category}
          </p>
        </div>
      </div>
    );
  };

  const filteredItems =
    selectedCategory === 'ALL'
      ? allItems
      : allItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="w-full space-y-5">
      {/* Top Header Category Chips Inside Box */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{allItems.length} Tools & Technologies</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium hidden md:inline">
            • Klik kategori untuk filter cepat
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-white/5'
            }`}
          >
            Semua (Marquee)
          </button>
          {categories.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setSelectedCategory(cat.title)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.title
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-white/5'
              }`}
            >
              {getCategoryIcon(cat.title)}
              <span>{cat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content View (Framed inside container) */}
      {selectedCategory === 'ALL' ? (
        <>
          {/* Mobile View: Compact Visible Badge Grid (< md) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:hidden gap-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-500/30">
            {allItems.map((item, idx) => {
              const iconSrc = getIconUrl(item);
              return (
                <div
                  key={`mobile-${item.name}-${idx}`}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/90 border border-white/10 hover:border-pink-500/40 shadow-sm transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center p-1 shrink-0">
                    {iconSrc ? (
                      <img
                        src={iconSrc}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          if (!e.target.dataset.triedFallback && item.slug) {
                            e.target.dataset.triedFallback = 'true';
                            e.target.src = `https://go-skill-icons.vercel.app/api/icons?i=${item.slug}&theme=dark`;
                          } else {
                            e.target.style.display = 'none';
                          }
                        }}
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-pink-400">#</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">
                      {item.label}
                    </p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider truncate">
                      {item.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View: Dual Infinite Horizontal Running Marquee (md+) */}
          <div className="hidden md:block space-y-4 overflow-hidden py-1">
            {/* Track 1: Scrolling Left */}
            <div className="relative w-full overflow-hidden marquee-mask">
              <div className="animate-marquee flex gap-3.5 w-max hover:[animation-play-state:paused] py-1">
                {duplicatedRow1.map((item, idx) => renderCard(item, idx, 'pink'))}
              </div>
            </div>

            {/* Track 2: Scrolling Right (Reverse) */}
            <div className="relative w-full overflow-hidden marquee-mask">
              <div className="animate-marquee-reverse flex gap-3.5 w-max hover:[animation-play-state:paused] py-1">
                {duplicatedRow2.map((item, idx) => renderCard(item, idx, 'blue'))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Filtered Category Grid inside Box */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-2 animate-fadeIn max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-500/30">
          {filteredItems.map((item, idx) => renderCard(item, idx))}
        </div>
      )}

      {/* Bottom Summary Tags Bar inside Box */}
      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-pink-400 font-bold">Featured:</span>
          {['Laravel', 'PHP', 'React', 'MySQL', 'Python', 'Figma', 'Google Docs & Sheets'].map(
            (badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[10px]"
              >
                {badge}
              </span>
            )
          )}
        </div>
        <span className="text-slate-500 text-[10px]">
          {selectedCategory === 'ALL'
            ? 'Hover mouse untuk pause animasi marquee'
            : `Menampilkan ${filteredItems.length} tool di ${selectedCategory}`}
        </span>
      </div>
    </div>
  );
};

export default TechStackMarquee;
