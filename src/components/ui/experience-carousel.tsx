import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, Building2 } from 'lucide-react';

export interface ExperienceItem {
  role: string;
  organization: string;
  orgSubtitle?: string;
  period: string;
  type: string;
  highlights: string[];
  description?: string;
  image?: string;
}

export interface ExperienceCarouselProps {
  experiences?: ExperienceItem[];
}

const experienceImages = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
];

export const ExperienceCarousel: React.FC<ExperienceCarouselProps> = ({ experiences = [] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft: sLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(sLeft > 10);
      setCanScrollRight(sLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [experiences]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 360;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
    checkScroll();
  };

  return (
    <div className="relative w-full space-y-4">
      {/* Navigation Controls & Hint */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
          <span>Geser atau klik tombol panah untuk melihat pengalaman</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
              canScrollLeft
                ? 'bg-slate-900 border-white/20 text-white hover:bg-pink-600 hover:border-pink-500 shadow-lg cursor-pointer hover:scale-110 active:scale-95'
                : 'bg-slate-950/50 border-white/5 text-slate-600 cursor-not-allowed opacity-50'
            }`}
            aria-label="Previous experience"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
              canScrollRight
                ? 'bg-slate-900 border-white/20 text-white hover:bg-pink-600 hover:border-pink-500 shadow-lg cursor-pointer hover:scale-110 active:scale-95'
                : 'bg-slate-950/50 border-white/5 text-slate-600 cursor-not-allowed opacity-50'
            }`}
            aria-label="Next experience"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-6 overflow-x-auto pb-6 pt-2 select-none no-scrollbar cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {experiences.map((exp, idx) => {
          const bgImg = exp.image || experienceImages[idx % experienceImages.length];

          return (
            <div
              key={idx}
              className="relative flex-shrink-0 w-[300px] sm:w-[350px] md:w-[380px] h-[450px] sm:h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:border-pink-500/50 hover:shadow-[0_20px_45px_rgba(236,72,153,0.25)] group"
            >
              {/* Background Image with Zoom on Hover */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={bgImg}
                  alt={exp.organization}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-115 filter brightness-[0.75] group-hover:brightness-[0.85]"
                />
                {/* Cinematic Glass Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-[#07080d]/80 to-slate-950/30 group-hover:via-[#07080d]/70 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-pink-950/20 mix-blend-overlay transition-colors duration-500"></div>
              </div>

              {/* Floating Top Header Badges */}
              <div className="absolute top-5 inset-x-5 flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-300 shadow-lg">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>{exp.type}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-300 shadow-lg">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>{exp.period}</span>
                </div>
              </div>

              {/* Bottom Details Content */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 flex flex-col justify-end z-10 space-y-3.5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-pink-300 transition-colors leading-tight font-heading">
                    {exp.organization}
                  </h3>
                  <p className="text-sm font-semibold text-sky-400 mt-1">
                    {exp.role}
                  </p>
                  {exp.orgSubtitle && (
                    <p className="text-xs text-slate-400 mt-0.5">{exp.orgSubtitle}</p>
                  )}
                </div>

                {/* Description */}
                {exp.description && (
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                    {exp.description}
                  </p>
                )}

                {/* Highlight Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.highlights.map((item, hIdx) => (
                    <span
                      key={hIdx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 group-hover:border-pink-500/30 group-hover:text-pink-200 transition-colors inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-pink-400" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceCarousel;
