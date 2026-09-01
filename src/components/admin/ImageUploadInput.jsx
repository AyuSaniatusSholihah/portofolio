import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Check,
  Sparkles,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const ImageUploadInput = ({
  value = '',
  onChange,
  label = 'Upload Gambar',
  category = 'general',
  placeholder = 'https://... atau pilih file dari laptop',
  helperText = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Helper to resize & compress image before converting to base64
  const compressImage = (file, maxWidth = 1200, maxHeight = 900, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Clear canvas with transparency (no solid background)
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Preserve transparency for PNG
          if (file.type === 'image/png') {
            const dataUrl = canvas.toDataURL('image/png');
            resolve(dataUrl);
          } else {
            const dataUrl = canvas.toDataURL('image/webp', quality);
            resolve(dataUrl);
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('File harus berupa gambar (JPG, PNG, WEBP, GIF)');
      return;
    }

    setErrorMsg('');
    setIsUploading(true);

    try {
      // 1. Compress image to reasonable web size & Base64
      const compressedDataUrl = await compressImage(file);

      // 2. Pass to parent form
      onChange(compressedDataUrl);

      // 3. Optional async push to database uploaded_images table
      try {
        await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            url: compressedDataUrl,
            category,
            file_size: file.size,
            mime_type: file.type,
            caption: `Uploaded via Admin Studio (${category})`,
          }),
        });
      } catch (apiErr) {
        // Silently tolerate if local offline without database
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      setErrorMsg('Gagal memproses gambar. Coba file gambar lain.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleClear = () => {
    onChange('');
    setUrlInputValue('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
          <span>{label}</span>
        </label>

        {/* Option to toggle URL instead */}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Tutup Input URL' : 'Tempel Tautan URL'}</span>
        </button>
      </div>

      {/* If URL Mode is toggled open */}
      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2 animate-fadeIn">
          <input
            type="text"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs placeholder:text-slate-600 focus:border-pink-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Terapkan
          </button>
        </form>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Active Value Display or Direct Drag-and-Drop Area */}
      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-white/15 relative overflow-hidden group">
          {/* Thumbnail preview */}
          <div
            onClick={() => setPreviewOpen(true)}
            className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 cursor-pointer relative group/thumb shadow-md"
            title="Klik untuk memperbesar"
          >
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Info Details */}
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Gambar Berhasil Dipilih</span>
            </p>
            <p className="text-[10px] text-slate-400 truncate font-mono">
              {value.startsWith('data:') ? '✓ File Terkompresi & Siap Disimpan' : value}
            </p>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Ganti Gambar</span>
              </button>
            </div>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 text-xs transition-colors shrink-0 cursor-pointer"
            title="Hapus gambar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Direct Dropzone & Upload Button */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all relative overflow-hidden group ${
            isDragOver
              ? 'border-pink-500 bg-pink-500/10 scale-[1.01]'
              : 'border-white/15 hover:border-pink-500/50 bg-slate-950/60 hover:bg-slate-950'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 text-pink-300 border border-pink-500/30 group-hover:scale-110 transition-transform shadow-sm">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                {isUploading
                  ? 'Sedang Memproses & Mengoptimasi Gambar...'
                  : 'Klik atau Tarik (Drag & Drop) File Gambar di Sini'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Mendukung PNG, JPG, JPEG, WEBP (Otomatis dikompres & disimpan)
              </p>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] text-rose-400 flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorMsg}</span>
        </p>
      )}

      {helperText && !value && (
        <p className="text-[10px] text-slate-500 leading-relaxed">{helperText}</p>
      )}

      {/* Full Size Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] p-2 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={value}
              alt="Preview Full"
              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl"
            />
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadInput;
