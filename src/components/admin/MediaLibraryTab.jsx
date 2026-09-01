import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  Database,
  Sparkles,
  ExternalLink,
  X,
  AlertCircle,
} from 'lucide-react';

export const MediaLibraryTab = ({ onSelectImage = null }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'certificate',
    caption: '',
    url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/upload');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setImages(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch from /api/upload, using mock media items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus gambar ini dari database?')) return;
    try {
      await fetch(`/api/upload?id=${id}`, { method: 'DELETE' });
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      alert('Gagal menghapus gambar: ' + err.message);
    }
  };

  const handleFileChosen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadForm((prev) => ({
        ...prev,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
        url: event.target?.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.url) {
      setUploadError('Pilih file gambar atau masukkan URL terlebih dahulu!');
      return;
    }
    setUploadError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uploadForm.name || 'Gambar Baru',
          url: uploadForm.url,
          category: uploadForm.category,
          caption: uploadForm.caption,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setImages((prev) => [data.data, ...prev]);
        setUploadModalOpen(false);
        setUploadForm({ name: '', category: 'certificate', caption: '', url: '' });
      }
    } catch (err) {
      setUploadError('Gagal mengunggah ke database: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredImages = images.filter((img) => {
    const matchCat = activeCategory === 'all' || img.category === activeCategory;
    const matchQuery =
      !searchQuery ||
      (img.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.caption || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <Database className="w-5 h-5 text-pink-400" />
            <span>Database Galeri Media & Upload Gambar</span>
          </h2>
          <p className="text-xs text-slate-400">
            Kelola gambar sertifikat, cover projek, trofi lomba, dan aset media portofolio langsung di database
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Gambar ke DB</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-white/10">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'certificate', label: 'Sertifikat' },
            { id: 'project', label: 'Projek' },
            { id: 'achievement', label: 'Prestasi' },
            { id: 'profile', label: 'Profil' },
            { id: 'story', label: 'Cerita' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama gambar / deskripsi..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Memuat galeri gambar database...</div>
      ) : filteredImages.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-white/10 text-center space-y-3">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Belum ada gambar pada kategori ini</p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
          >
            Upload Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="rounded-2xl bg-slate-900/90 border border-white/10 hover:border-pink-500/40 transition-all overflow-hidden flex flex-col justify-between group shadow-lg"
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => setPreviewImage(img.url)}
                className="relative w-full h-36 bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="p-2 rounded-full bg-black/60 text-white">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>

                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-pink-300 border border-pink-500/30">
                    {img.category || 'General'}
                  </span>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1" title={img.name}>
                    {img.name}
                  </h4>
                  {img.caption && (
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{img.caption}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                  <button
                    onClick={() => handleCopyLink(img.url, img.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors flex-1 justify-center"
                    title="Salin URL Gambar"
                  >
                    {copiedId === img.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-pink-400" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Hapus dari database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-pink-400" />
                <span>Upload Gambar ke Database</span>
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nama / Judul Gambar</label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="Contoh: Sertifikat React Dicoding"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Kategori Media</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="certificate">Sertifikat</option>
                  <option value="project">Projek</option>
                  <option value="achievement">Prestasi / Trofi</option>
                  <option value="profile">Foto Profil</option>
                  <option value="story">Cerita Nia</option>
                  <option value="general">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">File Gambar</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-pink-500/40 rounded-2xl p-4 text-center cursor-pointer bg-slate-950/60 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChosen}
                    className="hidden"
                  />
                  <Upload className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-200">
                    Klik untuk pilih gambar dari perangkat
                  </p>
                  <p className="text-[10px] text-slate-500">Mendukung JPG, PNG, WEBP</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Atau Masukkan URL Gambar</label>
                <input
                  type="text"
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Keterangan / Caption</label>
                <input
                  type="text"
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
                  placeholder="Keterangan singkat..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              {uploadError && (
                <p className="text-rose-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{uploadError}</span>
                </p>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Mengunggah...' : 'Simpan ke Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] p-2 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden">
            <img
              src={previewImage}
              alt="Preview Full"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
