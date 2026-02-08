
import React, { useState } from 'react';
import { Vocab } from '../types';
import { db } from '../services/db';

interface SetoranProps {
  onRefresh: () => void;
  vocabs: Vocab[];
}

type SetoranMode = 'biasa' | 'gambar' | 'massal';

const Setoran: React.FC<SetoranProps> = ({ onRefresh, vocabs }) => {
  const [mode, setMode] = useState<SetoranMode>('biasa');
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [chapterId, setChapterId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [massText, setMassText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterChapter, setFilterChapter] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'massal' && !editingId) {
      const lines = massText.split('\n');
      let count = 0;
      lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const w = parts[0].trim();
          const m = parts[1].trim();
          if (w && m) {
            db.addVocab({
              word: w,
              meaning: m,
              chapterId: chapterId ? parseInt(chapterId) : undefined,
            });
            count++;
          }
        }
      });
      if (count > 0) {
        setMassText('');
        onRefresh();
        alert(`${count} kosakata berhasil ditambahkan secara massal.`);
      }
      return;
    }

    if (!word || !meaning) return;

    // Use current form values. If mode is "biasa", we force imageUrl to undefined 
    // UNLESS we are specifically editing and chose to keep it (but usually mode switch handles this)
    const data = {
      word,
      meaning,
      chapterId: chapterId ? parseInt(chapterId) : undefined,
      imageUrl: mode === 'gambar' ? (imageUrl || undefined) : undefined,
    };

    if (editingId) {
      db.updateVocab(editingId, data);
      setEditingId(null);
    } else {
      db.addVocab(data);
    }

    resetForm();
    onRefresh();
  };

  const resetForm = () => {
    setWord('');
    setMeaning('');
    setChapterId('');
    setImageUrl('');
    setMassText('');
    setEditingId(null);
  };

  const handleEdit = (v: Vocab) => {
    setEditingId(v.id);
    // Automatically switch mode based on content
    setMode(v.imageUrl ? 'gambar' : 'biasa');
    setWord(v.word);
    setMeaning(v.meaning);
    setChapterId(v.chapterId?.toString() || '');
    setImageUrl(v.imageUrl || '');
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Hapus seluruh kosakata ini?')) {
      db.deleteVocab(id);
      onRefresh();
    }
  };

  const handleDeleteImageOnly = (id: string) => {
    if (confirm('Hapus gambar saja dari kosakata ini?')) {
      db.updateVocab(id, { imageUrl: undefined });
      onRefresh();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredVocabs = filterChapter === 'all' 
    ? vocabs 
    : filterChapter === 'additional' 
      ? vocabs.filter(v => !v.chapterId)
      : vocabs.filter(v => v.chapterId === parseInt(filterChapter));

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Navigation Tabs - Representing the "3 Kolom" Choice */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          {(['biasa', 'gambar', 'massal'] as SetoranMode[]).map((m) => (
            <button
              key={m}
              disabled={!!editingId && m === 'massal'}
              onClick={() => { setMode(m); }}
              className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-30 ${
                mode === m ? 'text-blue-500 bg-blue-500/10 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {m === 'biasa' ? 'Setoran Biasa' : m === 'gambar' ? 'Setoran Gambar' : 'Setoran Massal'}
            </button>
          ))}
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {mode !== 'massal' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Kosakata / Word</label>
                      <input 
                        type="text" 
                        value={word} 
                        onChange={(e) => setWord(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Contoh: Apple"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Arti / Meaning</label>
                      <input 
                        type="text" 
                        value={meaning} 
                        onChange={(e) => setMeaning(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Contoh: Apel"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Input Massal (Format "kata : arti" per baris)</label>
                    <textarea 
                      value={massText}
                      onChange={(e) => setMassText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all h-44 resize-none font-mono text-sm leading-relaxed"
                      placeholder={`apple : apel\nbanana : pisang\ncat : kucing`}
                      required
                    ></textarea>
                  </div>
                )}
                
                <div className={mode === 'massal' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Pilih Bab (1-60)</label>
                  <select 
                    value={chapterId} 
                    onChange={(e) => setChapterId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Kosakata Tambahan (Tanpa Bab)</option>
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i+1} value={i+1}>Bab {i+1}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {mode === 'gambar' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Visualisasi Gambar</label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-4 bg-slate-800/50 hover:border-slate-500 transition-all min-h-[220px]">
                    {imageUrl ? (
                      <div className="relative group flex flex-col items-center">
                        <img src={imageUrl} alt="Preview" className="max-h-40 rounded-lg object-contain mb-3" />
                        <button 
                          type="button" 
                          onClick={() => setImageUrl('')}
                          className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Hapus Gambar</span>
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center group">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 text-slate-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-400 font-medium">Klik untuk Unggah Gambar</span>
                        <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-tighter">JPG, PNG, WEBP</p>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{editingId ? 'Simpan Perubahan' : mode === 'massal' ? 'Proses Massal' : 'Simpan Kosakata'}</span>
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-4 px-8 rounded-xl transition-all"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-bold flex items-center">
            <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
            Daftar Materi Tersimpan
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-bold uppercase">Filter:</span>
            <select 
              value={filterChapter} 
              onChange={(e) => setFilterChapter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Semua Materi</option>
              <option value="additional">Hanya Tambahan</option>
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i+1} value={i+1}>Bab {i+1}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVocabs.map((v) => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-blue-500/50 transition-all shadow-md hover:shadow-xl hover:shadow-blue-900/10">
              <div className="relative">
                {v.imageUrl && (
                  <div className="h-40 overflow-hidden relative">
                    <img src={v.imageUrl} alt={v.word} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                    <button 
                      onClick={() => handleDeleteImageOnly(v.id)}
                      className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md text-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      title="Hapus Gambar Saja"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${v.chapterId ? 'bg-blue-600/20 text-blue-500' : 'bg-slate-800 text-slate-500'}`}>
                      {v.chapterId ? `Bab ${v.chapterId}` : 'Tambahan'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xl text-white truncate mb-1">{v.word}</h4>
                  <p className="text-slate-400 font-medium text-sm truncate">{v.meaning}</p>
                  
                  <div className="flex mt-6 gap-2">
                    <button 
                      onClick={() => handleEdit(v)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white py-2 rounded-xl text-xs font-bold transition-all border border-slate-700 hover:border-blue-500"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(v.id)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 py-2 rounded-xl text-xs font-bold transition-all border border-slate-700 hover:border-red-900"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredVocabs.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-600 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="font-medium">Belum ada kosakata di filter ini.</p>
              <p className="text-xs mt-1">Silakan tambahkan melalui form di atas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setoran;
