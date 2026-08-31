import React from 'react';

export const TechStackMarquee = ({ categories = [] }) => {
  // Flatten items with category tags
  const allItems = categories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      category: cat.title,
    }))
  );

  // Split into 2 rows for opposite scrolling effect
  const half = Math.ceil(allItems.length / 2);
  const row1 = allItems.slice(0, half);
  const row2 = allItems.slice(half);

  // Duplicate for seamless infinite loop
  const duplicatedRow1 = [...row1, ...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2, ...row2];

  const renderCard = (item, index, colorClass = 'pink') => {
    return (
      <div
        key={`${item.name}-${index}`}
        className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg hover:border-pink-500/50 hover:bg-slate-800/90 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/20 flex-shrink-0 group cursor-default"
      >
        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform">
          {item.slug ? (
            <img
              src={`https://go-skill-icons.vercel.app/api/icons?i=${item.slug}&theme=dark`}
              alt={item.name}
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-xs font-bold text-pink-400">#</span>
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors whitespace-nowrap">
            {item.label}
          </p>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">
            {item.category}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-4 space-y-6 overflow-hidden">
      {/* Track 1: Scrolling Left */}
      <div className="relative w-full overflow-hidden marquee-mask">
        <div className="animate-marquee flex gap-4 w-max hover:[animation-play-state:paused] py-2">
          {duplicatedRow1.map((item, idx) => renderCard(item, idx, 'pink'))}
        </div>
      </div>

      {/* Track 2: Scrolling Right (Reverse) */}
      <div className="relative w-full overflow-hidden marquee-mask">
        <div className="animate-marquee-reverse flex gap-4 w-max hover:[animation-play-state:paused] py-2">
          {duplicatedRow2.map((item, idx) => renderCard(item, idx, 'blue'))}
        </div>
      </div>
    </div>
  );
};

export default TechStackMarquee;
