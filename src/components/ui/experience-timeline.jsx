import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Building2,
  Sparkles,
  Eye,
  X,
  CheckCircle2,
  Layers,
  Wrench,
  ChevronRight,
  ChevronLeft,
  Images,
} from 'lucide-react';

export const ExperienceTimeline = ({ experiences = [] }) => {
  const [selectedExp, setSelectedExp] = useState(null);
  const [activeGalleryImg, setActiveGalleryImg] = useState(0);

  // Group experiences by Year
  const groupedByYear = experiences.reduce((acc, exp) => {
    const year = exp.year || (exp.period && exp.period.includes('2026') ? '2026' : '2025');
    if (!acc[year]) acc[year] = [];
    acc[year].push(exp);
    return acc;
  }, {});

  const years = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a));

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedExp(null);
    };
    if (selectedExp) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedExp]);

  const openModal = (exp) => {
    setSelectedExp(exp);
    setActiveGalleryImg(0);
  };

  // Reusable Single Timeline Card
  const renderCard = (exp, side = 'left', delay = 0) => {
    const defaultGallery = exp.gallery || [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    ];
    const isLeft = side === 'left';

    return (
      <motion.div
        key={exp.id || exp.role}
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="relative group w-full"
      >
        {/* Horizontal Connector Pin to Center Line (Desktop) */}
        <div
          className={`hidden md:block absolute top-6 w-5 h-0.5 bg-gradient-to-r from-sky-400 to-pink-400 opacity-40 group-hover:opacity-100 transition-opacity ${
            isLeft ? '-right-5' : '-left-5'
          }`}
        ></div>

        {/* Compact Card Content */}
        <div
          className={`glow-card rounded-2xl border border-white/10 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl relative overflow-hidden ${
            isLeft ? 'hover:border-pink-500/50' : 'hover:border-sky-500/50'
          }`}
        >
          <div className="space-y-2.5">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                <Calendar className="w-2.5 h-2.5 text-sky-400" />
                <span>{exp.period}</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  isLeft
                    ? 'bg-pink-500/10 text-pink-300 border-pink-500/20'
                    : 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                }`}
              >
                {exp.type}
              </span>
            </div>

            {/* Title & Organization */}
            <div>
              <h3
                className={`text-base sm:text-lg font-bold text-white transition-colors font-heading leading-tight ${
                  isLeft ? 'group-hover:text-pink-300' : 'group-hover:text-sky-300'
                }`}
              >
                {exp.role}
              </h3>
              <p className="text-xs font-semibold text-sky-400 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>{exp.organization}</span>
                {exp.orgSubtitle && (
                  <span className="text-[11px] text-slate-500 font-normal">
                    • {exp.orgSubtitle}
                  </span>
                )}
              </p>
            </div>

            {/* Description snippet */}
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {exp.description}
            </p>

            {/* Highlights Tags */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {exp.highlights?.map((h, hIdx) => (
                <span
                  key={hIdx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900/90 border border-slate-700/80 text-slate-300 inline-flex items-center gap-1"
                >
                  <Sparkles
                    className={`w-2.5 h-2.5 flex-shrink-0 ${
                      isLeft ? 'text-pink-400' : 'text-sky-400'
                    }`}
                  />
                  <span>{h}</span>
                </span>
              ))}
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
              {defaultGallery.length > 0 && (
                <div
                  onClick={() => openModal(exp)}
                  className="relative w-14 h-9 rounded-lg overflow-hidden border border-white/15 cursor-pointer hover:scale-105 transition-transform flex-shrink-0 shadow-sm"
                >
                  <img
                    src={defaultGallery[0]}
                    alt={exp.organization}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <span className="px-1 py-0.2 rounded bg-slate-950/80 text-[9px] font-bold text-white flex items-center gap-0.5">
                      <Images className="w-2 h-2 text-pink-400" />
                      {defaultGallery.length}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => openModal(exp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all inline-flex items-center gap-1 hover:scale-105 active:scale-95 cursor-pointer ml-auto ${
                  isLeft
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-pink-600 hover:to-rose-600 hover:shadow-pink-500/25'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-blue-600 hover:to-indigo-600 hover:shadow-sky-500/25'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Lihat Projek</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full space-y-12 py-4 max-w-5xl mx-auto">
      {years.map((year) => {
        const items = groupedByYear[year];
        const leftItems = items.filter((_, i) => i % 2 === 0);
        const rightItems = items.filter((_, i) => i % 2 === 1);

        return (
          <div key={year} className="space-y-6">
            {/* Centered Compact Year Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="flex justify-center items-center relative z-20"
            >
              <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 via-pink-500/25 to-indigo-500/20 border border-pink-500/40 text-white font-bold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(236,72,153,0.3)] backdrop-blur-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>
                <span className="font-heading font-black tracking-wider text-sm">{year}</span>
                <span className="text-pink-400 text-[10px]">• MILESTONES</span>
              </div>
            </motion.div>

            {/* Staggered Dual Column (Zig-Zag Setengah Tinggi Tanpa Gap Kosong) */}
            <div className="relative w-full">
              {/* Central Glowing Vertical Neon Line (Desktop) / Left Line (Mobile) */}
              <div className="absolute top-0 bottom-0 left-3 md:left-1/2 md:-translate-x-1/2 w-0.5 bg-gradient-to-b from-sky-500 via-pink-500 to-indigo-500 opacity-40 z-0"></div>

              {/* Desktop: Staggered Dual Columns (Interleaved Half-height offset) */}
              <div className="hidden md:grid md:grid-cols-2 gap-x-12 items-start relative z-10">
                {/* Left Column (Items 0, 2, 4...) */}
                <div className="space-y-6">
                  {leftItems.map((exp, idx) => renderCard(exp, 'left', idx * 0.1))}
                </div>

                {/* Right Column (Items 1, 3, 5...) - Offset down by ~50% card height so it weaves continuously! */}
                <div className="space-y-6 pt-16 lg:pt-20">
                  {rightItems.map((exp, idx) => renderCard(exp, 'right', idx * 0.1 + 0.15))}
                </div>
              </div>

              {/* Mobile: Clean Vertical Stack with line on left */}
              <div className="md:hidden space-y-6 pl-8 relative z-10">
                {items.map((exp, idx) => renderCard(exp, idx % 2 === 0 ? 'left' : 'right', idx * 0.08))}
              </div>
            </div>
          </div>
        );
      })}

      {/* ================= Interactive Documentation Modal ================= */}
      <AnimatePresence>
        {selectedExp && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 pt-3 sm:pt-5 pb-6 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto">
            {/* Backdrop Click Outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0"
              onClick={() => setSelectedExp(null)}
            />

            {/* Modal Container with Scale & Fade Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto glow-card bg-[#0b0f19]/98 border border-white/20 rounded-3xl shadow-2xl z-10 p-5 sm:p-7 space-y-4 my-0"
            >
              {/* Header with Close button */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      {selectedExp.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-sky-400" />
                      {selectedExp.period}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                    {selectedExp.role}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-sky-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>{selectedExp.organization}</span>
                    {selectedExp.orgSubtitle && (
                      <span className="text-slate-400 font-normal">
                        ({selectedExp.orgSubtitle})
                      </span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedExp(null)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-pink-600 hover:border-pink-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Projects & Key Responsibilities Done (Prominently at Top) */}
              {selectedExp.projectsDone && selectedExp.projectsDone.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-pink-400" />
                      <span>Projek & Tanggung Jawab Utama yang Dilakukan</span>
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
                      {selectedExp.projectsDone.length} Key Projects
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {selectedExp.projectsDone.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-2.5 hover:border-sky-500/40 hover:bg-white/[0.07] transition-all shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold text-slate-100 leading-snug">
                          {proj}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack & Tools Used */}
              {selectedExp.techUsed && selectedExp.techUsed.length > 0 && (
                <div className="space-y-1.5 pt-0.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-sky-400" />
                    <span>Tools & Teknologi yang Digunakan</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExp.techUsed.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700/80 text-sky-300 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Section */}
              {selectedExp.gallery && selectedExp.gallery.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5 text-sky-400" />
                      <span>Galeri Dokumentasi & Foto Kegiatan</span>
                    </p>
                    <span className="text-[11px] font-medium text-slate-400">
                      {activeGalleryImg + 1} / {selectedExp.gallery.length} foto
                    </span>
                  </div>

                  {/* Centered Main Image Display with Next/Prev Controls */}
                  <div className="relative w-full h-48 sm:h-64 md:h-72 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950 flex items-center justify-center group select-none">
                    {/* Blurred backdrop image glow */}
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30 scale-110 pointer-events-none"
                      style={{
                        backgroundImage: `url(${selectedExp.gallery[activeGalleryImg] || selectedExp.gallery[0]})`,
                      }}
                    />

                    {/* Centered Main Image */}
                    <img
                      src={selectedExp.gallery[activeGalleryImg] || selectedExp.gallery[0]}
                      alt="Dokumentasi kegiatan"
                      className="relative z-10 max-w-full max-h-full object-contain mx-auto transition-all duration-500 drop-shadow-2xl"
                    />

                    {/* Prev Button */}
                    {selectedExp.gallery.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGalleryImg((prev) =>
                            prev === 0 ? selectedExp.gallery.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-pink-600 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95 z-20 cursor-pointer"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}

                    {/* Next Button */}
                    {selectedExp.gallery.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGalleryImg((prev) =>
                            prev === selectedExp.gallery.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-pink-600 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95 z-20 cursor-pointer"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    {/* Centered Bottom Floating Pill Counter */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-[11px] font-bold text-white border border-white/15 shadow-md z-20">
                      Foto {activeGalleryImg + 1} dari {selectedExp.gallery.length}
                    </div>
                  </div>

                  {/* Centered Thumbnail Switcher */}
                  {selectedExp.gallery.length > 1 && (
                    <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
                      {selectedExp.gallery.map((img, iIdx) => (
                        <div
                          key={iIdx}
                          onClick={() => setActiveGalleryImg(iIdx)}
                          className={`relative w-14 sm:w-18 h-10 sm:h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0 ${
                            activeGalleryImg === iIdx
                              ? 'border-pink-500 scale-105 shadow-md shadow-pink-500/30'
                              : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                          }`}
                        >
                          <img
                            src={img}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Full Summary Description */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-200">Ringkasan Pengalaman:</p>
                <p>{selectedExp.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceTimeline;
