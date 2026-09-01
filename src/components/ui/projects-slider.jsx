import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Sparkles,
  Layers,
  CheckCircle2,
  FolderGit2,
  ArrowRight,
} from 'lucide-react';

const defaultStockImages = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
];

export const ProjectsSlider = ({ projects = [], selectedCategory = 'Semua' }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter projects by categoryGroup or category
  const filteredProjects =
    selectedCategory === 'Semua' || selectedCategory === 'All'
      ? projects
      : projects.filter((p) => {
          const group = (p.categoryGroup || p.type || '').toLowerCase();
          const cat = (p.category || '').toLowerCase();
          const target = selectedCategory.toLowerCase();
          return group.includes(target) || cat.includes(target);
        });

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

      // Estimate current index for indicator
      const cardWidth = 320;
      const index = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(Math.min(index, filteredProjects.length - 1));
    }
  };

  useEffect(() => {
    checkScroll();
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedCategory, filteredProjects.length]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth > 640 ? 380 : 300;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  if (filteredProjects.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900/60 border border-white/10 text-center space-y-3">
        <FolderGit2 className="w-10 h-10 text-slate-500 mx-auto" />
        <p className="text-sm font-semibold text-slate-300">
          Tidak ada projek ditemukan pada kategori ini.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-5">
      {/* Slider Header / Controls Bar */}
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            Menampilkan <strong className="text-white">{filteredProjects.length}</strong> projek
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-[11px] text-pink-400 font-semibold hidden sm:inline">
            Geser untuk melihat semua →
          </span>
        </div>

        {/* Arrow Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
              canScrollLeft
                ? 'bg-slate-900 border border-white/15 text-white hover:bg-pink-600 hover:border-pink-500 shadow-pink-500/10'
                : 'bg-slate-950/50 border border-white/5 text-slate-600 cursor-not-allowed opacity-40'
            }`}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
              canScrollRight
                ? 'bg-slate-900 border border-white/15 text-white hover:bg-pink-600 hover:border-pink-500 shadow-pink-500/10'
                : 'bg-slate-950/50 border border-white/5 text-slate-600 cursor-not-allowed opacity-40'
            }`}
            aria-label="Next project"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Swipeable / Scrollable Projects Track */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-none cursor-grab active:cursor-grabbing select-none"
        style={{ scrollBehavior: 'smooth' }}
      >
        {filteredProjects.map((proj, idx) => {
          const coverImage = proj.image || defaultStockImages[idx % defaultStockImages.length];

          return (
            <motion.div
              key={proj.title + idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="w-[280px] sm:w-[360px] flex-shrink-0 snap-start flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#0e1322] via-[#090d19] to-[#05070e] border border-white/10 hover:border-pink-500/50 shadow-xl hover:shadow-[0_20px_40px_rgba(236,72,153,0.2)] transition-all duration-500 overflow-hidden group"
            >
              {/* Top Project Thumbnail Cover */}
              <div className="relative w-full h-40 sm:h-48 overflow-hidden rounded-t-3xl bg-slate-950">
                <img
                  src={coverImage}
                  alt={proj.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-[0.8] group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d19] via-slate-950/40 to-transparent"></div>

                {/* Floating Category Pill */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-pink-300 border border-pink-500/30 shadow-md">
                    {proj.categoryGroup || proj.type || 'Projek'}
                  </span>
                </div>

                {/* Status / Category tag */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-950/80 backdrop-blur-md text-sky-300 border border-sky-500/30 shadow-md">
                    {proj.category || 'Web App'}
                  </span>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-pink-300 transition-colors font-heading leading-snug line-clamp-2">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Tech stack pills */}
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {(proj.tech || []).slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900 border border-slate-700/80 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {(proj.tech || []).length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                        +{(proj.tech || []).length - 4}
                      </span>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    {proj.link ? (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-pink-500/20 inline-flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                      >
                        <span>Demo Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Demo internal</span>
                    )}

                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all hover:scale-105 active:scale-95"
                        title="Lihat Source Code GitHub"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center items-center gap-1.5 pt-2">
        {filteredProjects.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === i
                ? 'w-6 bg-gradient-to-r from-pink-500 to-sky-500'
                : 'w-1.5 bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSlider;
