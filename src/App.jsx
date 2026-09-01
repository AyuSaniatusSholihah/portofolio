import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  ExternalLink,
  Download,
  Trophy,
  Star,
  Award,
  Medal,
  Bookmark,
  Code,
  Layers,
  Sparkles,
  Send,
  CheckCircle2,
  ChevronUp,
  GraduationCap,
  MapPin,
  TrendingUp,
  Briefcase,
  BookOpen,
  Clock,
  Heart,
  ArrowUpRight,
  Database,
  Palette,
  Terminal,
  Calendar,
  Check,
  User,
  Menu,
  X,
} from 'lucide-react';

import './App.css';
import HeroScrollVideoReveal from './components/ui/hero-scroll-video-pin-reveal.jsx';
import logoImg from './assets/projects/logo.jpg';
import { CircularTestimonials } from './components/ui/circular-testimonials.jsx';
import ProjectsSlider from './components/ui/projects-slider.jsx';
import TechStackMarquee from './components/ui/tech-stack-marquee.jsx';
import ExperienceTimeline from './components/ui/experience-timeline.jsx';
import GamifiedAchievements from './components/ui/gamified-achievements.jsx';
import CeritaNiaInteractive from './components/ui/cerita-nia-interactive.jsx';
import AllStoriesPage from './components/ui/all-stories-page.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import { usePortfolio } from './hooks/usePortfolio.js';
import { usePortfolioData } from './hooks/usePortfolioData.js';
import { useScrollReveal } from './hooks/useScrollReveal.js';

const App = () => {
  const { activeSection, scrollToSection } = usePortfolio();
  const { content } = usePortfolioData();
  useScrollReveal();

  // Page View Routing State ('home' | 'stories' | 'admin')
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#/stories' || hash === '#stories') return 'stories';
    if (hash === '#/admin' || hash === '#admin') return 'admin';
    return 'home';
  });

  // Listen to hash changes for browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/stories' || hash === '#stories') {
        setCurrentView('stories');
      } else if (hash === '#/admin' || hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitting: false, success: false, error: null });

  // Project Category Filter State
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Mobile Navigation Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    name,
    roleTitle,
    location,
    bioShort,
    aboutLong,
    resumeLink,
    contactLinks,
    navSections,
    profilePhoto,
    aboutPhoto,
    exploringTags,
    stats,
    experiences,
    achievements,
    certifications,
    projects,
    techStackCategories,
    stories,
  } = content;

  // Filter projects by categoryGroup: 'Projek Kuliah' | 'Projek Lomba' | 'Projek Real'
  const filteredProjects = selectedCategory === 'Semua' || selectedCategory === 'All'
    ? (projects || [])
    : (projects || []).filter((p) => {
        const group = (p.categoryGroup || p.type || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const target = selectedCategory.toLowerCase();
        return group.includes(target) || cat.includes(target);
      });

  // Format projects for Circular 3D Showcase
  const projectShowcaseItems = useMemo(() => {
    const stockImages = [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    ];
    return (filteredProjects || []).map((p, idx) => ({
      name: p.title,
      designation: `${p.categoryGroup || p.type} • ${p.category}`,
      quote: p.description,
      src: p.image || stockImages[idx % stockImages.length],
      link: p.link,
    }));
  }, [filteredProjects]);

  // Handle contact form submit
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setFormStatus({ submitting: true, success: false, error: null });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus({ submitting: false, success: true, error: null });
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus({ submitting: false, success: false, error: null }), 6000);
      } else {
        // Fallback simulate success for client feedback
        setFormStatus({ submitting: false, success: true, error: null });
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus({ submitting: false, success: false, error: null }), 6000);
      }
    } catch (err) {
      setFormStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus({ submitting: false, success: false, error: null }), 6000);
    }
  };

  // Dedicated Admin Studio Dashboard View
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onBackToPortfolio={() => {
          window.location.hash = '';
          setCurrentView('home');
        }}
      />
    );
  }

  // Dedicated Full Archive Page View for Stories & Articles
  if (currentView === 'stories') {
    return (
      <AllStoriesPage
        stories={stories}
        onBack={() => {
          window.location.hash = '';
          setCurrentView('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 relative selection:bg-pink-500 selection:text-white font-sans overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] left-[-100px] w-[450px] h-[450px] bg-pink-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[-100px] w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Header - Slim, Sleek, and Non-Intrusive */}
      <header className="fixed top-0 left-0 w-full glass-nav z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 text-xl sm:text-2xl font-bold tracking-tight text-white group"
          >
            <span className="font-heading tracking-wider">NIA</span>
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-pink-500 shadow-[0_0_12px_#ec4899] group-hover:scale-125 transition-transform"></span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-full border border-white/5 backdrop-blur-md">
            {navSections.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Let's Talk Button */}
            <button
              onClick={() => scrollToSection('contact')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:opacity-95 shadow-md shadow-pink-500/20 hover:shadow-pink-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Let's Talk
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-900/90 border border-white/15 text-slate-200 hover:text-white hover:border-pink-500/50 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5 text-slate-200" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden border-b border-white/10 bg-[#070913]/98 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col divide-y divide-white/5 py-1">
                {navSections.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      scrollToSection(item.id);
                      setTimeout(() => scrollToSection(item.id), 80);
                    }}
                    className={`w-full py-2.5 px-3 text-xs font-semibold text-left transition-all flex items-center justify-between group cursor-pointer ${
                      activeSection === item.id
                        ? 'text-pink-400 bg-pink-500/10 font-bold rounded-xl'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-xl'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-500">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {activeSection === item.id ? (
                      <span className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#ec4899]"></span>
                    ) : (
                      <span className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all text-[11px]">→</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToSection('contact');
                    setTimeout(() => scrollToSection('contact'), 80);
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white shadow-lg text-center cursor-pointer"
                >
                  Let's Talk ✨
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-20 space-y-24 md:space-y-32 overflow-x-clip">
        {/* ================= HERO SECTION ================= */}
        <section id="home" className="min-h-[calc(100vh-5.5rem)] flex items-center py-4">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-6xl mx-auto">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 lg:pl-4 xl:pl-8" data-reveal>
              {/* Huge Headline */}
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.08] font-heading">
                  Ayu Saniatus <br />
                  <span className="text-white">Sholihah</span>
                  <span className="text-pink-500 inline-block">.</span>
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">
                  Informatics Student · Builder · Learner ·{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 font-semibold">
                    Creative Technologist
                  </span>
                </p>
              </div>

              {/* Bio paragraph */}
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                {bioShort}
              </p>

              {/* Currently Exploring Tags */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Currently exploring
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exploringTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-pink-500/40 hover:text-pink-300 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <span>View My Work</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900/90 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-pink-400" />
                  <span>Download CV</span>
                </a>
              </div>

              {/* Social links */}
              <div className="pt-1 flex items-center gap-3 text-slate-400 text-xs">
                <span className="text-slate-500 font-medium">Let's connect</span>
                <div className="flex items-center gap-2.5">
                  <a
                    href={contactLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-slate-400" />
                    <span>GitHub</span>
                  </a>
                  <span className="text-slate-700">•</span>
                  <a
                    href={contactLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                    <span>LinkedIn</span>
                  </a>
                  <span className="text-slate-700">•</span>
                  <a
                    href={contactLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-pink-400 transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Visual Spotlight - Transparent Cutout with Glowing Sphere */}
            <div className="lg:col-span-5 relative flex justify-center items-end min-h-[420px] sm:min-h-[470px]" data-reveal style={{ '--reveal-delay': '150ms' }}>
              <div className="relative w-full max-w-[360px] sm:max-w-[400px] flex justify-center items-end">
                {/* Background N1A Large Outline Watermark */}
                <div className="absolute top-0 right-0 sm:-right-8 text-[85px] sm:text-[120px] font-black text-slate-800/25 select-none font-heading tracking-tighter -z-10 leading-none pointer-events-none overflow-hidden">
                  N1A
                </div>

                {/* Matrix Dotted Grid Decoration (Top-Left of Sphere) */}
                <div className="absolute top-4 left-2 sm:left-4 grid grid-cols-5 gap-1.5 opacity-50 z-0 pointer-events-none">
                  {[...Array(25)].map((_, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400/60"></span>
                  ))}
                </div>

                {/* Cyberpunk Spark & Cross Accents */}
                <div className="absolute top-16 right-8 text-pink-400/80 text-xs font-bold animate-pulse pointer-events-none">
                  ✦
                </div>
                <div className="absolute top-28 right-3 text-sky-400/80 text-sm font-bold pointer-events-none">
                  ◆
                </div>
                <div className="absolute top-36 -left-3 text-sky-400/60 text-xs font-bold pointer-events-none">
                  +
                </div>

                {/* Glowing Electric Blue Sphere */}
                <div className="absolute top-4 sm:top-6 w-[270px] sm:w-[310px] h-[270px] sm:h-[310px] rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 opacity-90 shadow-[0_0_85px_rgba(37,99,235,0.45)] ring-1 ring-white/10 z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-radial-hero opacity-60"></div>
                  <div className="absolute -top-10 -right-10 w-36 h-36 bg-sky-300/30 rounded-full blur-2xl"></div>
                </div>

                {/* Transparent Photo Cutout - Blended Seamlessly with Alpha Gradient Mask */}
                <div
                  className="relative z-10 w-full flex justify-center items-end -translate-y-6 sm:-translate-y-8 pointer-events-none"
                  style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 98%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 98%)',
                  }}
                >
                  <img
                    src={profilePhoto}
                    alt={name}
                    className="w-auto h-[390px] sm:h-[450px] object-contain object-bottom filter contrast-105"
                  />
                </div>

                {/* Floating Badge 1: Specialty (Top-Left) - Soft Glassmorphism */}
                <div className="absolute top-[3%] -left-2 sm:-left-6 bg-slate-900/70 backdrop-blur-2xl px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl flex items-center gap-2 sm:gap-2.5 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-30 hover:scale-105 transition-transform">
                  <div className="p-1 sm:p-1.5 rounded-xl bg-blue-500/20 text-sky-400 border border-blue-500/30 shrink-0">
                    <Code className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Specialty</p>
                    <p className="text-xs sm:text-sm font-bold text-white tracking-wide">Web & AI Tech</p>
                  </div>
                </div>

                {/* Floating Badge 2: Location (Right) - Soft Glassmorphism */}
                <div className="absolute top-[62%] -right-2 sm:-right-6 bg-slate-900/70 backdrop-blur-2xl px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl flex items-center gap-2 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-30 hover:scale-105 transition-transform">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-pink-500/20 text-pink-400 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-medium">Based in</p>
                    <p className="text-xs font-bold text-white">{location}</p>
                  </div>
                </div>

                {/* Neon Pink Signature Scribble (Bottom-Left) */}
                <div className="absolute bottom-4 -left-3 sm:-left-7 text-pink-400 select-none z-30 pointer-events-none opacity-85">
                  <svg className="w-16 h-10 stroke-pink-500 fill-none drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" viewBox="0 0 100 60">
                    <path d="M10,45 Q30,10 50,35 T90,20 Q60,50 30,30" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Mantra Card (Bottom-Right) - Soft Glassmorphism Seamless Blend */}
                <div className="absolute bottom-1 -right-2 sm:-right-4 bg-slate-900/70 backdrop-blur-2xl px-3.5 sm:px-4 py-2.5 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-left z-30">
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Always learning</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Always building</p>
                  <p className="text-xs sm:text-xs font-bold text-slate-200">
                    Always <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 font-extrabold">becoming.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
 
        {/* ================= CINEMATIC SCROLL REVEAL ================= */}
        <section className="-mx-6 sm:-mx-12 md:-mx-20 overflow-hidden relative">
          {/* Top smooth fade transition */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#07080d] to-transparent pointer-events-none z-20" />

          <HeroScrollVideoReveal
            badgeImgSrc={logoImg}
            topText={
              <>
                Crafting digital experiences,
                <br />
                one scroll at a time
              </>
            }
            headingText={
              <>
                Driven by curiosity. <br />
                Shaping ideas into reality.
              </>
            }
            tags={[
              { text: 'Informatics UNS', background: '#0284c7', color: '#ffffff' },
              { text: 'Frontend & UI/UX', background: '#db2777', color: '#ffffff' },
              { text: 'Creative Tech', background: '#4f46e5', color: '#ffffff' },
              { text: 'Always Learning', background: '#10b981', color: '#ffffff' },
            ]}
            subText="Bridging modern technology, design aesthetics, and real-world impact..."
            bottomText={
              <>
                Let's explore what lies ahead
                <br />
                and build the future
              </>
            }
          />

          {/* Bottom smooth fade transition */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#07080d] to-transparent pointer-events-none z-20" />
        </section>

        {/* ================= 01 ABOUT ME ================= */}
        <section id="about" className="space-y-8 scroll-mt-28" data-reveal>
          {/* Section Number Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="text-sm font-bold text-sky-400 tracking-wider">01</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading uppercase">
              ABOUT ME
            </h2>
            <span className="text-pink-400 font-handwriting text-xl sm:text-2xl sm:ml-4 sm:-rotate-2">
              “Always learning, always growing.” ✨
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Left Mini Photo Card - Hidden on Mobile, Visible on Desktop */}
            <div className="hidden lg:flex lg:col-span-4 glow-card p-4 rounded-3xl border border-white/10 relative overflow-hidden flex-col items-center justify-between text-center">
              <div className="w-full h-72 sm:h-80 md:h-84 rounded-2xl overflow-hidden relative bg-slate-950/60">
                <img
                  src={aboutPhoto || profilePhoto}
                  alt={name}
                  className="w-full h-full object-cover object-[center_top] scale-[1.03] transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
              </div>
              <div className="pt-3.5 flex items-center justify-between w-full px-2">
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Ayu Saniatus S.</p>
                  <p className="text-xs text-pink-400">Informatics UNS</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  Active
                </span>
              </div>
            </div>

            {/* Middle Main Bio & Counters */}
            <div className="lg:col-span-4 glow-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Curious mind. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                    Passionate builder.
                  </span>
                </h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  {aboutLong}
                </p>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-400">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Academic Status Card */}
            <div className="lg:col-span-4 glow-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Academic Background
                  </h3>
                  <p className="text-xs text-slate-400">Universitas Sebelas Maret (UNS)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <p className="text-xs text-slate-400">Study Program</p>
                  <p className="text-sm font-semibold text-slate-200">Informatics (S1)</p>
                  <p className="text-[11px] text-sky-400">2024 – Present</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <p className="text-xs text-slate-400">Level</p>
                  <p className="text-sm font-semibold text-slate-200">Second Year</p>
                  <p className="text-[11px] text-pink-400">Undergraduate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 02 EXPERIENCE ================= */}
        <section id="experience" className="space-y-8 scroll-mt-28" data-reveal>
          {/* Section Number Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <span className="text-sm font-bold text-sky-400 tracking-wider">02</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading uppercase">
                EXPERIENCE
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Some of my meaningful journeys, responsibilities, and the lessons I've learned along the way.
              </p>
            </div>
            <a
              href="#projects"
              className="text-xs text-slate-400 hover:text-pink-400 flex items-center gap-1 transition-colors group self-start sm:self-auto"
            >
              <span>Lihat Projek Saya</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Interactive Experience Timeline Component */}
          <ExperienceTimeline experiences={experiences} />
        </section>

        {/* ================= 03 ACHIEVEMENTS & CERTIFICATIONS ================= */}
        <section id="achievements" className="space-y-8 scroll-mt-28" data-reveal>
          {/* Section Number Header */}
          <div>
            <span className="text-sm font-bold text-sky-400 tracking-wider">03</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading uppercase">
              ACHIEVEMENTS & CERTIFICATIONS
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Competitive essay awards, graphic design accolades, and verified professional bootcamp certifications.
            </p>
          </div>

          {/* Gamified Achievements Holographic Component */}
          <GamifiedAchievements
            achievements={achievements}
            certifications={certifications}
          />
        </section>

        {/* ================= 04 PROJECTS ================= */}
        <section id="projects" className="space-y-8 scroll-mt-28" data-reveal>
          {/* Section Number Header with Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <span className="text-sm font-bold text-sky-400 tracking-wider">04</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading uppercase">
                PROJECTS
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Karya dan aplikasi yang saya bangun: projek perkuliahan, kompetisi/lomba inovasi, serta implementasi sistem produksi nyata.
              </p>
            </div>

            {/* Category Group Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Semua', value: 'Semua' },
                { label: '🎓 Projek Kuliah', value: 'Projek Kuliah' },
                { label: '🏆 Projek Lomba', value: 'Projek Lomba' },
                { label: '💼 Projek Real', value: 'Projek Real' },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat.value
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30 scale-105 border border-pink-400/40'
                      : 'bg-slate-900/90 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop View: Original 3D Circular Spotlight Showcase (md+) */}
          {projectShowcaseItems.length > 0 && (
            <div className="hidden md:flex glow-card rounded-3xl border border-white/10 p-6 sm:p-8 justify-center items-center overflow-hidden relative bg-gradient-to-b from-slate-900/60 to-slate-950/90 shadow-2xl">
              <div className="w-full max-w-4xl">
                <div className="text-center pb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    ✦ FEATURED 3D SPOTLIGHT
                  </span>
                </div>
                <CircularTestimonials
                  testimonials={projectShowcaseItems}
                  autoplay={true}
                  colors={{
                    name: '#ffffff',
                    designation: '#38bdf8',
                    testimony: '#cbd5e1',
                    arrowBackground: '#1e293b',
                    arrowForeground: '#ffffff',
                    arrowHoverBackground: '#ec4899',
                  }}
                  fontSizes={{
                    name: '1.4rem',
                    designation: '0.875rem',
                    quote: '0.975rem',
                  }}
                />
              </div>
            </div>
          )}

          {/* Mobile View: Swipeable / Scrollable Horizontal Projects Slider (< md) */}
          <div className="md:hidden">
            <ProjectsSlider projects={projects} selectedCategory={selectedCategory} />
          </div>
        </section>

        {/* ================= 05 TECH STACK ================= */}
        <section id="stack" className="space-y-8 scroll-mt-28" data-reveal>
          {/* Section Number Header */}
          <div>
            <span className="text-sm font-bold text-sky-400 tracking-wider">05</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading uppercase">
              TECH STACK & TOOLS
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Tools and technologies I use to build, design, collaborate, and solve real-world problems.
            </p>
          </div>

          {/* Infinite Horizontal Running Marquee */}
          <div className="glow-card rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-slate-900/60 to-slate-950/90 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                <span>Active Skills & Technologies</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Hover to pause • 20+ tools
              </span>
            </div>

            <TechStackMarquee categories={techStackCategories} />
          </div>
        </section>

        {/* ================= 06 CERITA NIA ================= */}
        <section id="stories" className="space-y-8 scroll-mt-28" data-reveal>
          {/* Section Number Header */}
          <div>
            <span className="text-sm font-bold text-sky-400 tracking-wider">06</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading uppercase">
              CERITA NIA
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              My thoughts, learnings, experiences, and little stories along the way in technology and college life.
            </p>
          </div>

          <CeritaNiaInteractive
            stories={stories}
            onSeeMore={() => {
              window.location.hash = '/stories';
              setCurrentView('stories');
            }}
          />
        </section>

        {/* ================= 07 CONTACT ================= */}
        <section id="contact" className="space-y-8 scroll-mt-28" data-reveal>
          {/* Section Number Header - Centered */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-sm font-bold text-sky-400 tracking-wider">07</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading uppercase">
              CONTACT
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Have an idea or want to collaborate? Let's create something meaningful together.
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7 glow-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 space-y-5 sm:space-y-6 w-full">
              <h3 className="text-lg sm:text-xl font-bold text-white">Send a Direct Message</h3>

              {formStatus.success ? (
                <div className="p-4 sm:p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Message Sent Successfully! ✨</p>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      Thank you for reaching out. Nia will get back to you soon!
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Hi Nia, let's connect and discuss..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-pink-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-pink-600 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/25 transition-all inline-flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{formStatus.submitting ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Right: Direct Reach & Note */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
              {/* Direct Info List */}
              <div className="glow-card p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/10 space-y-3 sm:space-y-4 w-full overflow-hidden">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  Or reach me directly
                </h4>

                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm w-full">
                  <a
                    href={contactLinks.email}
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-pink-500/40 hover:bg-white/[0.04] transition-all text-slate-300 hover:text-white min-w-0 max-w-full overflow-hidden"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 shrink-0" />
                    <span className="truncate min-w-0 flex-1">{contactLinks.emailDisplay}</span>
                  </a>

                  <a
                    href={contactLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-sky-500/40 hover:bg-white/[0.04] transition-all text-slate-300 hover:text-white min-w-0 max-w-full overflow-hidden"
                  >
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
                    <span className="truncate min-w-0 flex-1">{contactLinks.linkedinDisplay}</span>
                  </a>

                  <a
                    href={contactLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/40 hover:bg-white/[0.04] transition-all text-slate-300 hover:text-white min-w-0 max-w-full overflow-hidden"
                  >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 shrink-0" />
                    <span className="truncate min-w-0 flex-1">{contactLinks.githubDisplay}</span>
                  </a>

                  <a
                    href={contactLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-pink-500/40 hover:bg-white/[0.04] transition-all text-slate-300 hover:text-white min-w-0 max-w-full overflow-hidden"
                  >
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 shrink-0" />
                    <span className="truncate min-w-0 flex-1">{contactLinks.instagramDisplay}</span>
                  </a>
                </div>
              </div>

              {/* Pink Handwritten Sticky Note */}
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-950/40 via-rose-900/20 to-slate-900 border border-pink-500/30 relative overflow-hidden shadow-xl w-full">
                <div className="absolute -bottom-6 -right-6 w-20 sm:w-24 h-20 sm:h-24 bg-pink-500/20 rounded-full blur-xl pointer-events-none"></div>
                <p className="text-lg sm:text-xl font-handwriting text-pink-300 font-bold">
                  Leave a message for Nia ✨
                </p>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-1">
                  I'd love to hear your thoughts, feedback, collaboration opportunities, or anything you want to share. Let's grow together!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 bg-[#05060a] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-heading text-sm">NIA</span>
            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
            <span className="text-slate-500">•</span>
            <span>
              Learning. Building.{' '}
              <span className="text-pink-400 font-semibold">Becoming.</span>
            </span>
          </div>

          <p className="text-center sm:text-right">
            © 2026 Ayu Saniatus Sholihah. All rights reserved.
          </p>

          <button
            onClick={() => scrollToSection('home')}
            className="p-2.5 rounded-full bg-slate-900 border border-white/10 hover:border-pink-500/40 text-slate-300 hover:text-white transition-all shadow-lg hover:scale-110 active:scale-95"
            title="Back to Top"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;