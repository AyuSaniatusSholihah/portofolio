import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Heart,
  Bookmark,
  Coffee,
  ChevronRight,
} from 'lucide-react';

export interface StoryItem {
  id: number | string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  snippet: string;
  image?: string;
  tagColor?: string;
  mood?: string;
  gradient?: string;
  fullContent?: string[];
}

export interface CeritaNiaInteractiveProps {
  stories?: StoryItem[];
  onSeeMore?: () => void;
}

export const CeritaNiaInteractive: React.FC<CeritaNiaInteractiveProps> = ({
  stories = [],
  onSeeMore,
}) => {
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [likedStories, setLikedStories] = useState<Record<string | number, boolean>>({});
  const [bookmarkedStories, setBookmarkedStories] = useState<Record<string | number, boolean>>({});

  // Display top 4 featured stories on landing
  const featuredStories = stories.slice(0, 4);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedStory(null);
    };
    if (selectedStory) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedStory]);

  const toggleLike = (id: string | number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedStories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id: string | number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedStories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative w-full space-y-8 max-w-6xl mx-auto">
      {/* ================= Modeled Interactive Journal Cards Grid ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredStories.map((story, idx) => {
          const isLiked = !!likedStories[story.id];
          const isBookmarked = !!bookmarkedStories[story.id];

          return (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedStory(story)}
              className="relative group cursor-pointer flex flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#0e1322] via-[#090d19] to-[#05070e] border border-white/10 hover:border-pink-500/50 shadow-xl hover:shadow-[0_20px_40px_rgba(236,72,153,0.2)] transition-all duration-500 select-none"
            >
              {/* Atmospheric Background Ambient Light */}
              <div
                className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-bl ${
                  story.tagColor === 'pink'
                    ? 'from-pink-500'
                    : story.tagColor === 'blue'
                    ? 'from-sky-500'
                    : story.tagColor === 'indigo'
                    ? 'from-indigo-500'
                    : 'from-amber-500'
                } to-transparent pointer-events-none`}
              />

              {/* Card Header Visual Image with Curved Mask */}
              <div className="relative w-full h-44 overflow-hidden rounded-t-[1.8rem] bg-slate-950">
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover object-center group-hover:scale-115 transition-transform duration-700 filter brightness-[0.8] group-hover:brightness-100"
                  />
                )}

                {/* Dark Gradient Veil */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d19] via-slate-950/40 to-transparent"></div>

                {/* Top Floating Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  {/* Mood Tag */}
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/15 shadow-md">
                    {story.mood || 'Refleksi'}
                  </span>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleBookmark(story.id, e)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
                      isBookmarked
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-950/70 text-slate-300 hover:text-white border border-white/15'
                    }`}
                    aria-label="Bookmark story"
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Category Pill Tag floating at bottom left of cover */}
                <div className="absolute bottom-2.5 left-3 z-10">
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                      story.tagColor === 'pink'
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                        : story.tagColor === 'blue'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : story.tagColor === 'indigo'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {story.category}
                  </span>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors font-heading leading-snug line-clamp-2">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {story.snippet}
                  </p>
                </div>

                {/* Card Footer: Metadata & Action */}
                <div className="pt-3 border-t border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {story.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {story.readTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Read Action Link */}
                    <span className="text-xs font-bold text-pink-400 group-hover:text-pink-300 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Baca Cerita</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    {/* Like Heart Counter */}
                    <button
                      onClick={(e) => toggleLike(story.id, e)}
                      className={`text-xs flex items-center gap-1 transition-colors ${
                        isLiked ? 'text-rose-500 font-bold' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                      <span>{isLiked ? 'Disukai' : 'Suka'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================= See More Stories Action Banner ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-white/10 glow-card shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center flex-shrink-0 shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">
              Ingin membaca lebih banyak tulisan & artikel?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Jelajahi seluruh arsip cerita, tutorial teknologi, dan catatan keseharian Nia ({stories.length} cerita).
            </p>
          </div>
        </div>

        <button
          onClick={onSeeMore}
          className="px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer flex-shrink-0 whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <span>Lihat Semua Cerita & Artikel (See More)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ================= Interactive Story Reader Modal ================= */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-2xl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setSelectedStory(null)}
            />

            {/* Modal Reader Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glow-card bg-[#0b0f19]/95 border-2 border-pink-500/30 rounded-[2.5rem] shadow-2xl z-10 p-6 sm:p-8 space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-pink-600 hover:border-pink-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 z-20"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Details */}
              <div className="space-y-2 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                    {selectedStory.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
                    {selectedStory.mood || 'Refleksi'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 ml-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    {selectedStory.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight pt-1">
                  {selectedStory.title}
                </h2>

                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Oleh Nia (Ayu Saniatus Sholihah)</span>
                  <span>•</span>
                  <span>{selectedStory.date}</span>
                </p>
              </div>

              {/* Story Visual Banner */}
              {selectedStory.image && (
                <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-slate-900">
                  <img
                    src={selectedStory.image}
                    alt={selectedStory.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                </div>
              )}

              {/* Story Article Paragraphs */}
              <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
                {selectedStory.fullContent ? (
                  selectedStory.fullContent.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-slate-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-300 leading-relaxed">{selectedStory.snippet}</p>
                )}
              </div>

              {/* Author Reflection Box Footer */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5 text-xs text-slate-300">
                <Coffee className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-white">Catatan Kecil Penulis:</p>
                  <p className="text-slate-400 leading-relaxed">
                    Terima kasih telah membaca sebagian kecil perjalananku. Semoga cerita ini dapat memberi inspirasi atau sudut pandang baru dalam belajar dan berkarya!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CeritaNiaInteractive;
