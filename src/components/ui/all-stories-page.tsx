import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  Heart,
  Bookmark,
  Coffee,
} from 'lucide-react';
import { StoryItem } from './cerita-nia-interactive';

export interface AllStoriesPageProps {
  stories?: StoryItem[];
  onBack: () => void;
}

export const AllStoriesPage: React.FC<AllStoriesPageProps> = ({ stories = [], onBack }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [likedStories, setLikedStories] = useState<Record<string | number, boolean>>({});
  const [bookmarkedStories, setBookmarkedStories] = useState<Record<string | number, boolean>>({});

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Extract unique categories
  const categories = ['Semua', ...Array.from(new Set(stories.map((s) => s.category)))];

  // Filter stories based on category & search query
  const filteredStories = stories.filter((story) => {
    const matchesCat = selectedCategory === 'Semua' || story.category === selectedCategory;
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleLike = (id: string | number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedStories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id: string | number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedStories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#04060d] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* ================= Top Bar Navigation ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-pink-600 hover:border-pink-500 text-slate-300 hover:text-white transition-all text-xs font-bold shadow-md cursor-pointer active:scale-95 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              {stories.length} Total Cerita & Artikel
            </span>
          </div>
        </div>

        {/* ================= Hero Title & Search Header ================= */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 via-pink-500/20 to-indigo-500/20 border border-pink-500/30 text-white text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>ARSIP JURNAL & REFLEKSI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight">
            Cerita, Catatan, & Eksplorasi
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Kumpulan tulisan santai seputar perjalanan belajar teknologi, suka duka organisasi, tips perkuliahan, dan refleksi hidup.
          </p>

          {/* Search Bar Input */}
          <div className="relative w-full max-w-lg mx-auto pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 mt-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari cerita, topik, atau kata kunci..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs mt-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ================= Category Filter Chips ================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30 scale-105 border border-pink-400/40'
                  : 'bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ================= Stories Grid ================= */}
        {filteredStories.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 pt-4">
            {filteredStories.map((story, idx) => {
              const isLiked = !!likedStories[story.id];
              const isBookmarked = !!bookmarkedStories[story.id];

              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
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
                  <div className="relative w-full h-48 overflow-hidden rounded-t-[1.8rem] bg-slate-950">
                    {story.image && (
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover object-center group-hover:scale-115 transition-transform duration-700 filter brightness-[0.8] group-hover:brightness-100"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#090d19] via-slate-950/40 to-transparent"></div>

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/15 shadow-md">
                        {story.mood || 'Refleksi'}
                      </span>

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

                    {/* Category Pill Tag floating at bottom left */}
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
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors font-heading leading-snug">
                        {story.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                        {story.snippet}
                      </p>
                    </div>

                    {/* Card Footer: Metadata & Action */}
                    <div className="pt-3 border-t border-white/5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {story.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {story.readTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-pink-400 group-hover:text-pink-300 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Baca Cerita Lengkap</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>

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
        ) : (
          <div className="text-center py-16 space-y-3 glow-card rounded-3xl p-8 border border-white/10 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-base font-bold text-white">Tidak ada cerita ditemukan</p>
            <p className="text-xs text-slate-400">
              Coba gunakan kata kunci lain atau pilih kategori "Semua".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-500 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
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

export default AllStoriesPage;
