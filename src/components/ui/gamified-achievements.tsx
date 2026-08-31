import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  Award,
  Medal,
  Bookmark,
  Sparkles,
  Zap,
  ShieldCheck,
  Eye,
  X,
  Flame,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';

export interface AchievementItem {
  id?: string;
  title: string;
  host: string;
  category: string;
  icon: string;
  color?: string;
  tier?: string;
  xp?: string;
  stars?: number;
  year?: string;
  image?: string;
  credentialId?: string;
  skills?: string[];
  description?: string;
}

export interface GamifiedAchievementsProps {
  achievements?: AchievementItem[];
  certifications?: AchievementItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Star,
  Award,
  Medal,
  Bookmark,
  FileCheck2,
};

export const GamifiedAchievements: React.FC<GamifiedAchievementsProps> = ({
  achievements = [],
  certifications = [],
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'certifications'>('achievements');
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [inspectedItem, setInspectedItem] = useState<AchievementItem | null>(null);

  // Active items list based on tab
  const displayItems = activeTab === 'achievements' ? achievements : certifications;

  // Total XP calculation
  const totalAchievementsXP = achievements.reduce((acc, curr) => {
    const num = parseInt(curr.xp?.replace(/[^0-9]/g, '') || '500', 10);
    return acc + num;
  }, 0);

  const totalCertXP = certifications.reduce((acc, curr) => {
    const num = parseInt(curr.xp?.replace(/[^0-9]/g, '') || '500', 10);
    return acc + num;
  }, 0);

  const totalXP = totalAchievementsXP + totalCertXP;

  // Reset active index when switching tabs
  const handleTabChange = (tab: 'achievements' | 'certifications') => {
    setActiveTab(tab);
    setActiveIdx(0);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInspectedItem(null);
    };
    if (inspectedItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [inspectedItem]);

  const handleNext = () => {
    if (!displayItems.length) return;
    setActiveIdx((prev) => (prev + 1) % displayItems.length);
  };

  const handlePrev = () => {
    if (!displayItems.length) return;
    setActiveIdx((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  return (
    <div className="relative w-full space-y-6 max-w-6xl mx-auto">
      {/* ================= Gamer HUD Top Bar with Tab Switcher ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2"
      >
        {/* Left: Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTabChange('achievements')}
            className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white shadow-lg shadow-pink-500/30 scale-105 border border-pink-400/40'
                : 'bg-slate-900/90 text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Prestasi & Lomba ({achievements.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('certifications')}
            className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'certifications'
                ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-sky-500/30 scale-105 border border-sky-400/40'
                : 'bg-slate-900/90 text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Sertifikat Pelatihan & Seminar ({certifications.length})</span>
          </button>
        </div>

        {/* Right: XP Badge & Navigation */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-sky-400 font-bold flex items-center gap-1 bg-sky-500/10 px-3.5 py-1.5 rounded-full border border-sky-500/20">
            <Zap className="w-3.5 h-3.5 fill-sky-400" />
            +{totalXP.toLocaleString()} Total XP
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-pink-600 hover:border-pink-500 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="Previous blade"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-pink-600 hover:border-pink-500 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="Next blade"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ================= Expanding Holographic Trophy & Certificate Blades ================= */}
      <div className="relative w-full h-[370px] sm:h-[400px] md:h-[380px] flex flex-col md:flex-row gap-2.5 sm:gap-3.5 overflow-hidden rounded-[2.5rem] p-3 sm:p-4 bg-gradient-to-b from-[#0a0d18] via-[#060812] to-[#04050a] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
        {displayItems.map((item, idx) => {
          const isExpanded = activeIdx === idx;
          const IconComponent = iconMap[item.icon] || (activeTab === 'certifications' ? FileCheck2 : Trophy);
          const isPink = item.color === 'pink';
          const isBlue = item.color === 'blue';

          return (
            <motion.div
              key={item.id || idx}
              layout
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => setActiveIdx(idx)}
              className={`relative overflow-hidden rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer group select-none border ${
                isExpanded
                  ? activeTab === 'certifications'
                    ? 'flex-[3.5] sm:flex-[4] border-sky-500/60 shadow-[0_0_35px_rgba(56,189,248,0.35)]'
                    : 'flex-[3.5] sm:flex-[4] border-pink-500/60 shadow-[0_0_35px_rgba(236,72,153,0.35)]'
                  : 'flex-[0.8] md:flex-[0.9] border-white/10 hover:border-white/25 opacity-70 hover:opacity-95'
              }`}
            >
              {/* Full-bleed Visual Image with Cinematic Lighting */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover object-center transition-transform duration-1000 ease-out filter ${
                      isExpanded
                        ? 'scale-110 brightness-[0.75] contrast-105'
                        : 'scale-100 brightness-[0.45] grayscale-[0.2]'
                    }`}
                  />
                )}

                {/* Cyber Gradient Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-t ${
                    isExpanded
                      ? 'from-slate-950 via-slate-950/70 to-slate-950/20 opacity-95'
                      : 'from-slate-950 via-slate-950/85 to-slate-950/60 opacity-90'
                  }`}
                />
              </div>

              {/* ============ COLLAPSED STATE (Vertical Sleek Blade) ============ */}
              {!isExpanded && (
                <div className="relative z-10 w-full h-full flex flex-row md:flex-col justify-between items-center p-2.5 md:py-4 md:px-2.5">
                  {/* Floating Top Icon */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-lg ${
                      isPink
                        ? 'bg-pink-500/20 text-pink-400 border-pink-500/40'
                        : isBlue
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>

                  {/* Vertical Title Indicator (Desktop) / Horizontal (Mobile) */}
                  <div className="hidden md:block flex-1 py-2">
                    <p
                      className="text-[11px] font-bold text-slate-300 tracking-wider uppercase font-heading whitespace-nowrap"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      {item.title}
                    </p>
                  </div>

                  <p className="md:hidden text-xs font-bold text-slate-300 truncate max-w-[200px]">
                    {item.title}
                  </p>

                  {/* Bottom Tier Pill */}
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/10 text-pink-300 border border-white/15">
                    {item.year}
                  </span>
                </div>
              )}

              {/* ============ EXPANDED STATE (Rich Wide Interactive Banner) ============ */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 w-full h-full flex flex-col justify-between p-4 sm:p-5 md:p-6"
                >
                  {/* Top Header Tags */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase backdrop-blur-md shadow-md border ${
                          item.tier === 'LEGENDARY' || item.tier === 'PROFESSIONAL'
                            ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-amber-500/20'
                            : item.tier === 'DIAMOND' || item.tier === 'SPECIALIST'
                            ? 'bg-cyan-500/25 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20'
                            : 'bg-pink-500/25 text-pink-300 border-pink-500/50 shadow-pink-500/20'
                        }`}
                      >
                        ✦ {item.tier || 'VERIFIED'}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-950/80 backdrop-blur-md border border-white/15 text-sky-300 shadow-md flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-sky-400 text-sky-400" />
                        {item.xp || '+800 XP'}
                      </span>

                      {item.credentialId && (
                        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900/90 text-slate-400 border border-white/10">
                          ID: {item.credentialId}
                        </span>
                      )}
                    </div>

                    {/* Trophy/Certificate Icon Halo */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xl border ${
                        isPink
                          ? 'bg-pink-500/25 text-pink-300 border-pink-500/50 shadow-pink-500/30'
                          : isBlue
                          ? 'bg-blue-500/25 text-blue-300 border-blue-500/50 shadow-blue-500/30'
                          : 'bg-cyan-500/25 text-cyan-300 border-cyan-500/50 shadow-cyan-500/30'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Middle / Bottom Content Details */}
                  <div className="space-y-2 pt-2">
                    {/* Category & Star rating */}
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 backdrop-blur-md border border-white/10">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(item.stars || 5)].map((_, sIdx) => (
                          <Star key={sIdx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">({item.year})</span>
                    </div>

                    {/* Headline Title */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight font-heading drop-shadow-md line-clamp-1 sm:line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Host / Issuer */}
                    <p className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                      <span>{activeTab === 'certifications' ? 'Penyelenggara / Issuer' : 'Host'}: {item.host}</span>
                    </p>

                    {/* Skills pills if certification */}
                    {item.skills && (
                      <div className="flex flex-wrap gap-1">
                        {item.skills.map((sk, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/90 text-sky-300 border border-slate-700/80"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Backstory Description */}
                    {item.description && (
                      <p className="text-xs text-slate-300 leading-relaxed max-w-xl line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Action Button */}
                    <div className="pt-1 flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedItem(item);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'certifications'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-pink-600 hover:to-rose-600 shadow-blue-500/30'
                            : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-blue-600 hover:to-indigo-600 shadow-pink-500/30'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>
                          {activeTab === 'certifications'
                            ? 'Lihat Sertifikat & Kredensial'
                            : 'Inspect Full Holographic Certificate'}
                        </span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ================= Interactive Holographic Inspection Modal ================= */}
      <AnimatePresence>
        {inspectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0"
              onClick={() => setInspectedItem(null)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto glow-card bg-[#0b0f19]/98 border-2 border-pink-500/40 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.35)] z-10 p-5 sm:p-7 space-y-5 my-auto"
            >
              {/* Holographic Header Background Graphic */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-bl-full pointer-events-none -z-10"></div>

              {/* Close Button */}
              <button
                onClick={() => setInspectedItem(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-pink-600 hover:border-pink-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 z-20"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Badges */}
              <div className="space-y-1.5 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 shadow-md">
                    ✦ {inspectedItem.tier || 'VERIFIED CERTIFICATE'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-sky-400" />
                    {inspectedItem.xp || '+800 XP'}
                  </span>
                  {inspectedItem.credentialId && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-900 border border-white/10 text-slate-300">
                      ID: {inspectedItem.credentialId}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading pt-1 leading-tight">
                  {inspectedItem.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-sky-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Penyelenggara / Host: {inspectedItem.host}</span>
                </p>
              </div>

              {/* High-res Image Spotlight (Centered object-contain so certificate is never cropped) */}
              {inspectedItem.image && (
                <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950 flex items-center justify-center">
                  {/* Backdrop ambient blur */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30 scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${inspectedItem.image})` }}
                  />

                  {/* Centered Certificate Preview */}
                  <img
                    src={inspectedItem.image}
                    alt={inspectedItem.title}
                    className="relative z-10 max-w-full max-h-full object-contain mx-auto transition-all duration-500 drop-shadow-2xl"
                  />

                  {/* Badge info overlay at bottom */}
                  <div className="absolute bottom-2.5 left-3 z-20 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 flex items-center gap-1 text-amber-400 shadow-md">
                    {[...Array(inspectedItem.stars || 5)].map((_, sIdx) => (
                      <Star key={sIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[10px] font-bold text-white ml-1">AUTHENTICATED CREDENTIAL</span>
                  </div>
                </div>
              )}

              {/* Verified Skills */}
              {inspectedItem.skills && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Kompetensi / Skills Terverifikasi:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {inspectedItem.skills.map((sk, skIdx) => (
                      <span
                        key={skIdx}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700/80 text-sky-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quest Story & Description */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                <p className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Keterangan & Deskripsi Program</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {inspectedItem.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamifiedAchievements;
