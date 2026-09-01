import React, { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  Lock,
  Unlock,
  Sparkles,
  User,
  FolderGit2,
  Briefcase,
  Trophy,
  BookOpen,
  Cpu,
  Mail,
  ExternalLink,
  ArrowLeft,
  X,
  Search,
  CheckCircle2,
  Sliders,
  FileCode2,
  Database,
  Image as ImageIcon,
} from 'lucide-react';
import {
  usePortfolioData,
  savePortfolioData,
  exportPortfolioDataJSON,
  generatePortfolioContentJS,
} from '../../hooks/usePortfolioData.js';
import { ImageUploadInput } from './ImageUploadInput.jsx';
import { MediaLibraryTab } from './MediaLibraryTab.jsx';

export default function AdminDashboard({ onBackToPortfolio }) {
  const { content, resetContent } = usePortfolioData();
  const [formData, setFormData] = useState(content);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('nia_admin_session') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const ADMIN_PIN = localStorage.getItem('nia_admin_pin') || 'nia123';

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Cloud Database connection state
  const [dbStatus, setDbStatus] = useState('checking'); // 'connected' | 'unconfigured' | 'checking'
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // UI Toast State
  const [toast, setToast] = useState(null);

  // Check DB status on mount
  useEffect(() => {
    async function checkDb() {
      try {
        const res = await fetch('/api/portfolio');
        const json = await res.json();
        if (json.source === 'database') {
          setDbStatus('connected');
        } else {
          setDbStatus('unconfigured');
        }
      } catch (e) {
        setDbStatus('unconfigured');
      }
    }
    checkDb();
  }, []);

  // Search & Filter state for lists
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilterGroup, setProjectFilterGroup] = useState('ALL');

  // Modal Editing States
  const [editingProject, setEditingProject] = useState(null); // null or object
  const [editingExp, setEditingExp] = useState(null);
  const [editingAch, setEditingAch] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [editingStory, setEditingStory] = useState(null);

  // Sync formData when content changes externally
  useEffect(() => {
    setFormData(content);
  }, [content]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('nia_admin_session', 'true');
      setPinError('');
      showToast('Selamat datang di Admin Studio Nia! ✨');
    } else {
      setPinError('PIN salah');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nia_admin_session');
    setPinInput('');
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const result = await savePortfolioData(formData);
      if (result.cloudSaved) {
        setDbStatus('connected');
        showToast('Semua data berhasil disimpan ke Cloud Database & Browser! Perubahan kini aktif di semua link Vercel! 🌐✨');
      } else if (result.success) {
        showToast('Data tersimpan di browser lokal. (Untuk menyimpan ke semua pengunjung link Vercel, hubungkan DATABASE_URL di Vercel).', 'info');
      } else {
        showToast('Gagal menyimpan data.', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat menyimpan data.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch('/api/seed');
      const json = await res.json();
      if (json.success) {
        setDbStatus('connected');
        showToast('Database berhasil diinisialisasi & di-seed dengan sukses! 🎉');
        // Refresh data
        window.location.reload();
      } else {
        showToast(json.message || 'Gagal inisialisasi DB. Pastikan DATABASE_URL sudah diset.', 'error');
      }
    } catch (err) {
      showToast('Gagal menghubungi /api/seed: ' + err.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mengembalikan semua data ke data bawaan awal (default)? Data kustom akan direset.'
      )
    ) {
      resetContent();
      showToast('Data berhasil di-reset ke nilai default.');
    }
  };

  const handleExportJSON = () => {
    exportPortfolioDataJSON(formData);
    showToast('File JSON backup berhasil diunduh! 📥');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result);
        setFormData((prev) => ({
          ...prev,
          ...importedData,
        }));
        savePortfolioData({
          ...formData,
          ...importedData,
        });
        showToast('Data berhasil diimpor dan disimpan! 🎉');
      } catch (err) {
        showToast('File JSON tidak valid atau rusak.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyCode = () => {
    const jsCode = generatePortfolioContentJS(formData);
    navigator.clipboard
      .writeText(jsCode)
      .then(() => {
        showToast('Kode portfolioContent.js berhasil disalin ke clipboard! 📋');
      })
      .catch(() => {
        showToast('Gagal menyalin kode.', 'error');
      });
  };

  // ----------------------------------------------------
  // PIN LOGIN GATE
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080d] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background glow elements */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-500/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/30 mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-heading">
              Admin Studio Portfolio
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Masukkan PIN Admin untuk mengelola konten dan data portofolio Nia
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Security PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-center tracking-widest text-lg font-mono transition-all"
                autoFocus
              />
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Buka Admin Studio</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToPortfolio}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Portofolio</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN DASHBOARD LAYOUT
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce-short">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-950/50'
                : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0a0b12]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center shadow-md shadow-pink-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white font-heading">
                Admin Studio Nia
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                LIVE SYNC
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Input & kelola semua konten portofolio secara manual
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-pink-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            title="Simpan perubahan ke Cloud Database & LocalStorage (Live)"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>

          <button
            onClick={onBackToPortfolio}
            className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Buka tampilan portofolio"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Lihat Web</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer hidden md:inline-flex"
            title="Salin kode JavaScript untuk portfolioContent.js"
          >
            <Copy className="w-3.5 h-3.5 text-indigo-400" />
            <span>Copy Code</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Export Backup JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          <label
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer inline-flex items-center"
            title="Import Backup JSON"
          >
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-rose-950/50 hover:text-rose-300 text-slate-300 border border-white/10 transition-all cursor-pointer"
            title="Reset ke Default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 border border-white/10 transition-all cursor-pointer"
            title="Kunci / Keluar Admin"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <nav className="bg-[#0b0d17] border-b border-white/5 px-4 sm:px-8 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
        {[
          { id: 'overview', label: 'Ringkasan', icon: Sliders },
          { id: 'profile', label: 'Profil & Bio', icon: User },
          { id: 'projects', label: 'Projek', icon: FolderGit2 },
          { id: 'experiences', label: 'Pengalaman', icon: Briefcase },
          { id: 'achievements', label: 'Prestasi & Sertif', icon: Trophy },
          { id: 'media', label: 'Media & Upload DB', icon: Database },
          { id: 'stories', label: 'Cerita Nia', icon: BookOpen },
          { id: 'skills', label: 'Keahlian (Skills)', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500/20 to-indigo-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Banner info */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-indigo-950/30 to-pink-950/20 border border-white/10 relative overflow-hidden shadow-xl">
              <div className="max-w-2xl space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nia Portfolio Control Panel</span>
                  </div>

                  {/* Database Cloud Status Badge */}
                  {dbStatus === 'connected' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Cloud Database Terhubung (Vercel/Neon)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span>Mode Lokal Browser (Database belum tersambung)</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white font-heading">
                  Halo, {formData.name || 'Nia'}! 👋
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Selamat datang di panel admin portofolio. Kamu bisa menambah, mengubah, atau menghapus projek, pengalaman, prestasi, serta cerita Nia kapan pun dengan mudah.
                </p>

                {dbStatus === 'unconfigured' && (
                  <div className="pt-2">
                    <button
                      onClick={handleTriggerSeed}
                      disabled={isSeeding}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>{isSeeding ? 'Menginisialisasi...' : 'Hubungkan & Inisialisasi Database Cloud'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Metric Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('projects')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Projek
                  </span>
                  <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">
                  {formData.projects?.length || 0}
                </p>
                <p className="text-[11px] text-pink-400 mt-1">Kelola projek →</p>
              </div>

              <div
                onClick={() => setActiveTab('experiences')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pengalaman
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">
                  {formData.experiences?.length || 0}
                </p>
                <p className="text-[11px] text-indigo-400 mt-1">
                  Kelola pengalaman →
                </p>
              </div>

              <div
                onClick={() => setActiveTab('achievements')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Prestasi & Cert
                  </span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">
                  {(formData.achievements?.length || 0) +
                    (formData.certifications?.length || 0)}
                </p>
                <p className="text-[11px] text-amber-400 mt-1">
                  Lihat prestasi →
                </p>
              </div>

              <div
                onClick={() => setActiveTab('stories')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-sky-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Cerita Nia
                  </span>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">
                  {formData.stories?.length || 0}
                </p>
                <p className="text-[11px] text-sky-400 mt-1">Tulis artikel →</p>
              </div>
            </div>

            {/* Quick Actions & Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Aksi Cepat Tambah Data</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setEditingProject({
                        title: '',
                        description: '',
                        category: 'Web App',
                        categoryGroup: 'Projek Kuliah',
                        status: 'Completed',
                        type: 'Frontend',
                        impact: '',
                        link: 'https://',
                        github: 'https://github.com/',
                        tech: ['React', 'Tailwind CSS'],
                        highlights: ['UI Interaktif'],
                      });
                      setActiveTab('projects');
                    }}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-pink-500/15 border border-white/5 hover:border-pink-500/30 text-left transition-all cursor-pointer group"
                  >
                    <FolderGit2 className="w-5 h-5 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-white">+ Tambah Projek</p>
                    <p className="text-[10px] text-slate-400">
                      Upload projek terbaru
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setEditingExp({
                        id: `exp-${Date.now()}`,
                        year: '2026',
                        role: '',
                        organization: '',
                        orgSubtitle: '',
                        period: '2026 – Present',
                        type: 'Active',
                        highlights: [],
                        description: '',
                        projectsDone: [],
                        techUsed: [],
                      });
                      setActiveTab('experiences');
                    }}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-indigo-500/15 border border-white/5 hover:border-indigo-500/30 text-left transition-all cursor-pointer group"
                  >
                    <Briefcase className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-white">
                      + Tambah Pengalaman
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Organisasi / magang
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setEditingAch({
                        id: `ach-${Date.now()}`,
                        title: '',
                        host: '',
                        category: 'Competition',
                        icon: 'Trophy',
                        color: 'pink',
                        tier: 'LEGENDARY',
                        xp: '+800 XP',
                        stars: 5,
                        year: '2026',
                        description: '',
                      });
                      setActiveTab('achievements');
                    }}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 text-left transition-all cursor-pointer group"
                  >
                    <Trophy className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-white">
                      + Tambah Prestasi
                    </p>
                    <p className="text-[10px] text-slate-400">Juara & award</p>
                  </button>

                  <button
                    onClick={() => {
                      setEditingStory({
                        id: `story-${Date.now()}`,
                        title: '',
                        excerpt: '',
                        fullStory: '',
                        category: 'Perjalanan & Refleksi',
                        date: new Date().toLocaleDateString('id-ID', {
                          month: 'short',
                          year: 'numeric',
                        }),
                        readTime: '3 min read',
                        tags: ['Refleksi', 'Coding'],
                      });
                      setActiveTab('stories');
                    }}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-sky-500/15 border border-white/5 hover:border-sky-500/30 text-left transition-all cursor-pointer group"
                  >
                    <BookOpen className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-white">
                      + Tulis Cerita
                    </p>
                    <p className="text-[10px] text-slate-400">Cerita Nia baru</p>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-sky-400" />
                    <span>Panduan Penyimpanan Konten</span>
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Live Auto-Apply</strong>: Setiap kali klik "Simpan Perubahan", data langsung aktif pada portofolio di browser Anda.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Copy Code</strong>: Gunakan tombol "Copy Code" di atas jika ingin menyalin format JavaScript untuk file <code>src/data/portfolioContent.js</code>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Export/Import JSON</strong>: Download backup data untuk disimpan atau di-restore kapan saja.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onBackToPortfolio}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-pink-400" />
                    <span>Buka dan Periksa Tampilan Portofolio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PROFILE & BIO */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  Informasi Profil & Bio
                </h2>
                <p className="text-xs text-slate-400">
                  Ubah data identitas, biografi hero, dan tautan sosial media
                </p>
              </div>
              <button
                onClick={handleSaveAll}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-pink-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Profil</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Data Pokok */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-pink-300 uppercase tracking-wider">
                  Data Identitas
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Nama Panggilan (Nickname)
                    </label>
                    <input
                      type="text"
                      value={formData.nickname || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, nickname: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Role / Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.roleTitle || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, roleTitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Universitas
                      </label>
                      <input
                        type="text"
                        value={formData.university || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            university: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Jurusan / Program Studi
                      </label>
                      <input
                        type="text"
                        value={formData.major || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, major: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Tahun Akademik
                      </label>
                      <input
                        type="text"
                        value={formData.academicYear || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            academicYear: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Lokasi (City / Country)
                      </label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Link Resume / CV (Google Drive / Link)
                    </label>
                    <input
                      type="text"
                      value={formData.resumeLink || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          resumeLink: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-4">
                    <ImageUploadInput
                      label="Foto Profil Utama (Hero Section)"
                      category="profile"
                      value={formData.profilePhoto || ''}
                      onChange={(url) => setFormData({ ...formData, profilePhoto: url })}
                      helperText="Foto ini tampil di hero spotlight lingkaran utama."
                    />

                    <ImageUploadInput
                      label="Foto Tambahan (About Section)"
                      category="profile"
                      value={formData.aboutPhoto || ''}
                      onChange={(url) => setFormData({ ...formData, aboutPhoto: url })}
                      helperText="Foto ini tampil di kartu biografi About me."
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Biografi & Teks */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
                  Biografi & Cerita Singkat
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Bio Hero Section (Short)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.bioShort || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, bioShort: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      About Section (Long Narrative)
                    </label>
                    <textarea
                      rows={5}
                      value={formData.aboutLong || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, aboutLong: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Exploring Tags (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={(formData.exploringTags || []).join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          exploringTags: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Web Development, UI/UX Design, Data..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Social & Contact Links */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">
                  Tautan Kontak & Media Sosial
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Email URL (e.g. mailto:ayu@gmail.com)
                    </label>
                    <input
                      type="text"
                      value={formData.contactLinks?.email || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactLinks: {
                            ...formData.contactLinks,
                            email: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Email Teks Tampilan (Display)
                    </label>
                    <input
                      type="text"
                      value={formData.contactLinks?.emailDisplay || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactLinks: {
                            ...formData.contactLinks,
                            emailDisplay: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={formData.contactLinks?.github || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactLinks: {
                            ...formData.contactLinks,
                            github: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={formData.contactLinks?.linkedin || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactLinks: {
                            ...formData.contactLinks,
                            linkedin: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      value={formData.contactLinks?.instagram || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactLinks: {
                            ...formData.contactLinks,
                            instagram: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Instagram Handle (@username)
                    </label>
                    <input
                      type="text"
                      value={formData.contactLinks?.instagramDisplay || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactLinks: {
                            ...formData.contactLinks,
                            instagramDisplay: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PROJECTS */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  Kelola Projek Portofolio
                </h2>
                <p className="text-xs text-slate-400">
                  Total {formData.projects?.length || 0} projek terdaftar
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setEditingProject({
                      title: '',
                      description: '',
                      category: 'Web App',
                      categoryGroup: 'Projek Kuliah',
                      status: 'Completed',
                      type: 'Frontend',
                      impact: '',
                      link: 'https://',
                      github: 'https://github.com/',
                      tech: ['React', 'Tailwind CSS'],
                      highlights: ['UI Interaktif'],
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-500/25 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Projek Baru</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari judul atau tech..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'Projek Kuliah', 'Projek Lomba', 'Projek Real'].map(
                  (group) => (
                    <button
                      key={group}
                      onClick={() => setProjectFilterGroup(group)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        projectFilterGroup === group
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                          : 'text-slate-400 hover:text-white bg-slate-950/60'
                      }`}
                    >
                      {group === 'ALL' ? 'Semua Kategori' : group}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(formData.projects || [])
                .filter((p) => {
                  const matchGroup =
                    projectFilterGroup === 'ALL' ||
                    p.categoryGroup === projectFilterGroup;
                  const matchSearch =
                    !projectSearch ||
                    p.title
                      ?.toLowerCase()
                      .includes(projectSearch.toLowerCase()) ||
                    p.description
                      ?.toLowerCase()
                      .includes(projectSearch.toLowerCase()) ||
                    p.tech?.some((t) =>
                      t.toLowerCase().includes(projectSearch.toLowerCase())
                    );
                  return matchGroup && matchSearch;
                })
                .map((proj, idx) => {
                  const originalIndex = formData.projects.indexOf(proj);
                  return (
                    <div
                      key={proj.title + idx}
                      className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-pink-500/30 transition-all flex flex-col justify-between group space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/25">
                            {proj.categoryGroup || 'Projek'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {proj.status || 'Active'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-pink-300 transition-colors">
                          {proj.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>

                        {/* Tech pills */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(proj.tech || []).slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                          {(proj.tech || []).length > 4 && (
                            <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                              +{(proj.tech || []).length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action footer */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-sky-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <div className="flex items-center gap-1 ml-auto">
                          <button
                            onClick={() =>
                              setEditingProject({
                                ...proj,
                                _originalIndex: originalIndex,
                              })
                            }
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Projek"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Hapus projek "${proj.title}"?`
                                )
                              ) {
                                const updated = formData.projects.filter(
                                  (_, i) => i !== originalIndex
                                );
                                setFormData({
                                  ...formData,
                                  projects: updated,
                                });
                                savePortfolioData({
                                  ...formData,
                                  projects: updated,
                                });
                                showToast('Projek berhasil dihapus.');
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Hapus Projek"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Edit / Add Project */}
            {editingProject && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 my-8">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-pink-400" />
                      <span>
                        {editingProject._originalIndex !== undefined
                          ? 'Edit Projek'
                          : 'Tambah Projek Baru'}
                      </span>
                    </h3>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Judul Projek
                      </label>
                      <input
                        type="text"
                        value={editingProject.title || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                        placeholder="Contoh: SIM UNS Official Portal"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Kategori Group
                      </label>
                      <select
                        value={editingProject.categoryGroup || 'Projek Kuliah'}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            categoryGroup: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                      >
                        <option value="Projek Kuliah">Projek Kuliah</option>
                        <option value="Projek Lomba">Projek Lomba</option>
                        <option value="Projek Real">Projek Real</option>
                        <option value="Projek Pribadi">Projek Pribadi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Kategori Sub / Label
                      </label>
                      <input
                        type="text"
                        value={editingProject.category || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                        placeholder="Web App / ML Model / IoT"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Deskripsi Projek
                      </label>
                      <textarea
                        rows={3}
                        value={editingProject.description || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                        placeholder="Jelaskan tujuan dan fitur utama projek..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Live Demo URL / Link
                      </label>
                      <input
                        type="text"
                        value={editingProject.link || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            link: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        GitHub Repository URL
                      </label>
                      <input
                        type="text"
                        value={editingProject.github || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            github: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                        placeholder="https://github.com/..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Tech Stack (Pisahkan dengan koma)
                      </label>
                      <input
                        type="text"
                        value={(editingProject.tech || []).join(', ')}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            tech: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                        placeholder="React, Tailwind CSS, Node.js, PostgreSQL..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Status Pengerjaan
                      </label>
                      <input
                        type="text"
                        value={editingProject.status || 'Completed'}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            status: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Tipe / Role
                      </label>
                      <input
                        type="text"
                        value={editingProject.type || 'Fullstack'}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Impact / Dampak Utama
                      </label>
                      <input
                        type="text"
                        value={editingProject.impact || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            impact: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                        placeholder="Contoh: Digunakan oleh 500+ mahasiswa aktif"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-white/10">
                      <ImageUploadInput
                        label="Cover Gambar Projek (Upload / URL)"
                        category="project"
                        value={editingProject.image || ''}
                        onChange={(url) =>
                          setEditingProject({
                            ...editingProject,
                            image: url,
                          })
                        }
                        placeholder="https://images.unsplash.com/... atau pilih file"
                        helperText="Gambar cover ini akan langsung tampil pada kartu carousel slider projek."
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!editingProject.title) {
                          alert('Judul projek tidak boleh kosong!');
                          return;
                        }
                        const currentList = [...(formData.projects || [])];
                        if (editingProject._originalIndex !== undefined) {
                          const idx = editingProject._originalIndex;
                          delete editingProject._originalIndex;
                          currentList[idx] = editingProject;
                        } else {
                          currentList.unshift(editingProject);
                        }
                        setFormData({ ...formData, projects: currentList });
                        savePortfolioData({
                          ...formData,
                          projects: currentList,
                        });
                        setEditingProject(null);
                        showToast('Projek berhasil disimpan! 🎉');
                      }}
                      className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Simpan Projek
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: EXPERIENCES */}
        {/* ======================================================== */}
        {activeTab === 'experiences' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  Kelola Riwayat Pengalaman & Organisasi
                </h2>
                <p className="text-xs text-slate-400">
                  Total {formData.experiences?.length || 0} pengalaman tercatat
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingExp({
                    id: `exp-${Date.now()}`,
                    year: '2026',
                    role: '',
                    organization: '',
                    orgSubtitle: '',
                    period: '2026 – Present',
                    type: 'Active',
                    highlights: ['Tanggung Jawab Utama'],
                    description: '',
                    projectsDone: [],
                    techUsed: ['React', 'Git'],
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Pengalaman Baru</span>
              </button>
            </div>

            {/* Experiences list */}
            <div className="space-y-4">
              {(formData.experiences || []).map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                        {exp.period || exp.year}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {exp.organization}
                      </span>
                      {exp.orgSubtitle && (
                        <span className="text-xs text-slate-400">
                          • {exp.orgSubtitle}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-indigo-300">
                      {exp.role}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {exp.description}
                    </p>

                    {/* Highlights / Responsibilities */}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {exp.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 border border-white/5"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 sm:self-center">
                    <button
                      onClick={() =>
                        setEditingExp({ ...exp, _originalIndex: idx })
                      }
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit Pengalaman"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Hapus pengalaman "${exp.role} di ${exp.organization}"?`
                          )
                        ) {
                          const updated = formData.experiences.filter(
                            (_, i) => i !== idx
                          );
                          setFormData({ ...formData, experiences: updated });
                          savePortfolioData({
                            ...formData,
                            experiences: updated,
                          });
                          showToast('Pengalaman berhasil dihapus.');
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Edit Experience */}
            {editingExp && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 my-8">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      <span>
                        {editingExp._originalIndex !== undefined
                          ? 'Edit Pengalaman'
                          : 'Tambah Pengalaman'}
                      </span>
                    </h3>
                    <button
                      onClick={() => setEditingExp(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Role / Jabatan
                      </label>
                      <input
                        type="text"
                        value={editingExp.role || ''}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            role: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Head of Web Development"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Organisasi / Instansi
                      </label>
                      <input
                        type="text"
                        value={editingExp.organization || ''}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            organization: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="SIM UNS"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Sub Judul Organisasi / Divisi
                      </label>
                      <input
                        type="text"
                        value={editingExp.orgSubtitle || ''}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            orgSubtitle: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Sekolah Ilmiah Mahasiswa"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Periode / Rentang Waktu
                      </label>
                      <input
                        type="text"
                        value={editingExp.period || ''}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            period: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Jan 2026 – Jul 2026"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Deskripsi Tanggung Jawab
                      </label>
                      <textarea
                        rows={3}
                        value={editingExp.description || ''}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Highlights / Poin Utama (Pisahkan dengan koma)
                      </label>
                      <input
                        type="text"
                        value={(editingExp.highlights || []).join(', ')}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            highlights: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Lead Web Developer, Event Coordinator..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Teknologi / Tools Digunakan (Pisahkan koma)
                      </label>
                      <input
                        type="text"
                        value={(editingExp.techUsed || []).join(', ')}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            techUsed: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="React, Figma, Google Workspace..."
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-white/10">
                      <ImageUploadInput
                        label="Foto Dokumentasi / Kegiatan (Upload / Drag & Drop)"
                        category="experience"
                        value={
                          editingExp.gallery && editingExp.gallery.length > 0
                            ? editingExp.gallery[0]
                            : editingExp.image || ''
                        }
                        onChange={(url) =>
                          setEditingExp({
                            ...editingExp,
                            image: url,
                            gallery: url ? [url] : [],
                          })
                        }
                        placeholder="https://... atau pilih foto kegiatan dari perangkat"
                        helperText="Foto kegiatan ini akan tampil di galeri modal linimasa pengalaman."
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingExp(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!editingExp.role || !editingExp.organization) {
                          alert('Role dan Organisasi harus diisi!');
                          return;
                        }
                        const currentList = [
                          ...(formData.experiences || []),
                        ];
                        if (editingExp._originalIndex !== undefined) {
                          const idx = editingExp._originalIndex;
                          delete editingExp._originalIndex;
                          currentList[idx] = editingExp;
                        } else {
                          currentList.unshift(editingExp);
                        }
                        setFormData({
                          ...formData,
                          experiences: currentList,
                        });
                        savePortfolioData({
                          ...formData,
                          experiences: currentList,
                        });
                        setEditingExp(null);
                        showToast('Pengalaman berhasil disimpan! 🎉');
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Simpan Pengalaman
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: ACHIEVEMENTS & CERTS */}
        {/* ======================================================== */}
        {activeTab === 'achievements' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Section 1: Prestasi Lomba */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Daftar Prestasi & Penghargaan Lomba</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Total {formData.achievements?.length || 0} prestasi
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingAch({
                      id: `ach-${Date.now()}`,
                      title: '',
                      host: '',
                      category: 'Essay / Research',
                      icon: 'Trophy',
                      color: 'pink',
                      tier: 'LEGENDARY',
                      xp: '+850 XP',
                      stars: 5,
                      year: '2026',
                      description: '',
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Prestasi</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.achievements || []).map((ach, idx) => (
                  <div
                    key={ach.id || idx}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-amber-500/30 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300">
                        {ach.year} • {ach.tier || 'AWARD'}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {ach.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">{ach.host}</p>
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {ach.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() =>
                          setEditingAch({ ...ach, _originalIndex: idx })
                        }
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus prestasi "${ach.title}"?`)) {
                            const updated = formData.achievements.filter(
                              (_, i) => i !== idx
                            );
                            setFormData({
                              ...formData,
                              achievements: updated,
                            });
                            savePortfolioData({
                              ...formData,
                              achievements: updated,
                            });
                            showToast('Prestasi berhasil dihapus.');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Sertifikasi */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Daftar Sertifikasi Kompetensi</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Total {formData.certifications?.length || 0} sertifikat
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingCert({
                      id: `cert-${Date.now()}`,
                      title: '',
                      host: '',
                      category: 'Web Development',
                      icon: 'Award',
                      color: 'blue',
                      tier: 'PROFESSIONAL',
                      xp: '+800 XP',
                      stars: 5,
                      year: '2026',
                      credentialId: '',
                      skills: [],
                      description: '',
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Sertifikat</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.certifications || []).map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-sky-500/30 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/15 text-sky-300">
                        {cert.year} • {cert.category}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {cert.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">{cert.host}</p>
                      {cert.credentialId && (
                        <p className="text-[10px] font-mono text-slate-500">
                          ID: {cert.credentialId}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() =>
                          setEditingCert({ ...cert, _originalIndex: idx })
                        }
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(`Hapus sertifikat "${cert.title}"?`)
                          ) {
                            const updated = formData.certifications.filter(
                              (_, i) => i !== idx
                            );
                            setFormData({
                              ...formData,
                              certifications: updated,
                            });
                            savePortfolioData({
                              ...formData,
                              certifications: updated,
                            });
                            showToast('Sertifikat berhasil dihapus.');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Edit Achievement */}
            {editingAch && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Kelola Prestasi Lomba</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Nama Prestasi / Juara
                      </label>
                      <input
                        type="text"
                        value={editingAch.title || ''}
                        onChange={(e) =>
                          setEditingAch({
                            ...editingAch,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        placeholder="Contoh: First Runner-Up National Essay"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">
                          Penyelenggara / Host
                        </label>
                        <input
                          type="text"
                          value={editingAch.host || ''}
                          onChange={(e) =>
                            setEditingAch({
                              ...editingAch,
                              host: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Tahun</label>
                        <input
                          type="text"
                          value={editingAch.year || '2026'}
                          onChange={(e) =>
                            setEditingAch({
                              ...editingAch,
                              year: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">
                        Deskripsi Prestasi
                      </label>
                      <textarea
                        rows={2}
                        value={editingAch.description || ''}
                        onChange={(e) =>
                          setEditingAch({
                            ...editingAch,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <ImageUploadInput
                        label="Foto Piala / Sertifikat Prestasi (Upload / URL)"
                        category="achievement"
                        value={editingAch.image || ''}
                        onChange={(url) =>
                          setEditingAch({
                            ...editingAch,
                            image: url,
                          })
                        }
                        placeholder="https://... atau pilih foto dari perangkat"
                        helperText="Foto ini tampil saat pengunjung mengklik 'Inspect Holographic Certificate'."
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingAch(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const list = [...(formData.achievements || [])];
                        if (editingAch._originalIndex !== undefined) {
                          const idx = editingAch._originalIndex;
                          delete editingAch._originalIndex;
                          list[idx] = editingAch;
                        } else {
                          list.unshift(editingAch);
                        }
                        setFormData({ ...formData, achievements: list });
                        savePortfolioData({
                          ...formData,
                          achievements: list,
                        });
                        setEditingAch(null);
                        showToast('Prestasi berhasil disimpan!');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-xs font-bold text-white"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Edit Cert */}
            {editingCert && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Kelola Sertifikat Kompetensi</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Nama Sertifikasi
                      </label>
                      <input
                        type="text"
                        value={editingCert.title || ''}
                        onChange={(e) =>
                          setEditingCert({
                            ...editingCert,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        placeholder="Contoh: Full-Stack Web Development Bootcamp"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">
                          Penerbit / Host
                        </label>
                        <input
                          type="text"
                          value={editingCert.host || ''}
                          onChange={(e) =>
                            setEditingCert({
                              ...editingCert,
                              host: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Tahun</label>
                        <input
                          type="text"
                          value={editingCert.year || '2026'}
                          onChange={(e) =>
                            setEditingCert({
                              ...editingCert,
                              year: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">
                        Credential ID / Link
                      </label>
                      <input
                        type="text"
                        value={editingCert.credentialId || ''}
                        onChange={(e) =>
                          setEditingCert({
                            ...editingCert,
                            credentialId: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        placeholder="DCD-FSW-2025-0891"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">
                        Deskripsi Singkat
                      </label>
                      <textarea
                        rows={2}
                        value={editingCert.description || ''}
                        onChange={(e) =>
                          setEditingCert({
                            ...editingCert,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <ImageUploadInput
                        label="Foto / Dokumen Sertifikat (Upload / URL)"
                        category="certificate"
                        value={editingCert.image || ''}
                        onChange={(url) =>
                          setEditingCert({
                            ...editingCert,
                            image: url,
                          })
                        }
                        placeholder="https://... atau upload file sertifikat"
                        helperText="Gambar sertifikat beresolusi tinggi akan tampil di modal inspeksi sertifikasi."
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingCert(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const list = [...(formData.certifications || [])];
                        if (editingCert._originalIndex !== undefined) {
                          const idx = editingCert._originalIndex;
                          delete editingCert._originalIndex;
                          list[idx] = editingCert;
                        } else {
                          list.unshift(editingCert);
                        }
                        setFormData({ ...formData, certifications: list });
                        savePortfolioData({
                          ...formData,
                          certifications: list,
                        });
                        setEditingCert(null);
                        showToast('Sertifikat berhasil disimpan!');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-500 text-xs font-bold text-white"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: CERITA NIA (STORIES) */}
        {/* ======================================================== */}
        {activeTab === 'stories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  Kelola Cerita & Artikel Nia
                </h2>
                <p className="text-xs text-slate-400">
                  Total {formData.stories?.length || 0} artikel dipublikasikan
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingStory({
                    id: `story-${Date.now()}`,
                    title: '',
                    excerpt: '',
                    fullStory: '',
                    category: 'Perjalanan & Refleksi',
                    date: new Date().toLocaleDateString('id-ID', {
                      month: 'short',
                      year: 'numeric',
                    }),
                    readTime: '3 min read',
                    tags: ['Refleksi', 'Informatika'],
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/25 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tulis Cerita Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.stories || []).map((story, idx) => (
                <div
                  key={story.id || idx}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-sky-500/30 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-sky-500/15 text-sky-300">
                        {story.category}
                      </span>
                      <span className="text-slate-400">
                        {story.date} • {story.readTime}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">
                      {story.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {story.excerpt || story.fullStory}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {(story.tags || []).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          setEditingStory({ ...story, _originalIndex: idx })
                        }
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(`Hapus cerita "${story.title}"?`)
                          ) {
                            const updated = formData.stories.filter(
                              (_, i) => i !== idx
                            );
                            setFormData({ ...formData, stories: updated });
                            savePortfolioData({
                              ...formData,
                              stories: updated,
                            });
                            showToast('Cerita berhasil dihapus.');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Edit Story */}
            {editingStory && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 my-8">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-400" />
                      <span>
                        {editingStory._originalIndex !== undefined
                          ? 'Edit Cerita'
                          : 'Tulis Cerita Baru'}
                      </span>
                    </h3>
                    <button
                      onClick={() => setEditingStory(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Judul Cerita
                      </label>
                      <input
                        type="text"
                        value={editingStory.title || ''}
                        onChange={(e) =>
                          setEditingStory({
                            ...editingStory,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                        placeholder="Contoh: Menemukan Semangat Baru di Dunia Riset & Web"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">
                          Kategori
                        </label>
                        <input
                          type="text"
                          value={editingStory.category || ''}
                          onChange={(e) =>
                            setEditingStory({
                              ...editingStory,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">
                          Tanggal Publikasi
                        </label>
                        <input
                          type="text"
                          value={editingStory.date || ''}
                          onChange={(e) =>
                            setEditingStory({
                              ...editingStory,
                              date: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">
                          Waktu Baca
                        </label>
                        <input
                          type="text"
                          value={editingStory.readTime || '3 min read'}
                          onChange={(e) =>
                            setEditingStory({
                              ...editingStory,
                              readTime: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Kutipan Singkat (Excerpt)
                      </label>
                      <textarea
                        rows={2}
                        value={editingStory.excerpt || ''}
                        onChange={(e) =>
                          setEditingStory({
                            ...editingStory,
                            excerpt: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        placeholder="Ringkasan 1-2 kalimat untuk preview..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Isi Lengkap Cerita (Full Story)
                      </label>
                      <textarea
                        rows={6}
                        value={editingStory.fullStory || ''}
                        onChange={(e) =>
                          setEditingStory({
                            ...editingStory,
                            fullStory: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white leading-relaxed resize-y"
                        placeholder="Tuliskan kisah perjalanan, pengalaman, atau pesan inspiratifmu di sini..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Tags (Pisahkan dengan koma)
                      </label>
                      <input
                        type="text"
                        value={(editingStory.tags || []).join(', ')}
                        onChange={(e) =>
                          setEditingStory({
                            ...editingStory,
                            tags: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                        placeholder="Refleksi, Organisasi, WebDev..."
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <ImageUploadInput
                        label="Foto Cover Cerita (Upload / Drag & Drop)"
                        category="story"
                        value={editingStory.image || ''}
                        onChange={(url) =>
                          setEditingStory({
                            ...editingStory,
                            image: url,
                          })
                        }
                        placeholder="https://... atau pilih cover cerita dari perangkat"
                        helperText="Foto cover ini akan tampil pada kartu blog Cerita Nia."
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingStory(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!editingStory.title) {
                          alert('Judul cerita harus diisi!');
                          return;
                        }
                        const list = [...(formData.stories || [])];
                        if (editingStory._originalIndex !== undefined) {
                          const idx = editingStory._originalIndex;
                          delete editingStory._originalIndex;
                          list[idx] = editingStory;
                        } else {
                          list.unshift(editingStory);
                        }
                        setFormData({ ...formData, stories: list });
                        savePortfolioData({
                          ...formData,
                          stories: list,
                        });
                        setEditingStory(null);
                        showToast('Cerita berhasil disimpan! 🎉');
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-xs font-bold text-white cursor-pointer"
                    >
                      Simpan Cerita
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: SKILLS & STACK */}
        {/* ======================================================== */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  Keahlian & Tech Stack
                </h2>
                <p className="text-xs text-slate-400">
                  Kelola daftar keahlian pada section About dan Tech Stack
                </p>
              </div>
              <button
                onClick={handleSaveAll}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Keahlian</span>
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-pink-300 uppercase tracking-wider">
                About Skills Highlight Tags
              </h3>
              <p className="text-xs text-slate-400">
                Poin keahlian yang ditampilkan dalam kotak grid di bagian About
              </p>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Daftar Skill (Pisahkan dengan koma)
                </label>
                <textarea
                  rows={3}
                  value={(formData.aboutSkills || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aboutSkills: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {(formData.aboutSkills || []).map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.aboutSkills || []).filter(
                          (_, idx) => idx !== i
                        );
                        setFormData({ ...formData, aboutSkills: updated });
                      }}
                      className="hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* ======================================================== */}
        {/* TAB 8: MEDIA & UPLOAD DB */}
        {/* ======================================================== */}
        {activeTab === 'media' && <MediaLibraryTab />}
      </main>
    </div>
  );
}
