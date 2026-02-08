
import React, { useState } from 'react';
import { Grammar as GrammarType } from '../types';
import { db } from '../services/db';

interface GrammarProps {
  grammars: GrammarType[];
  onRefresh: () => void;
}

const Grammar: React.FC<GrammarProps> = ({ grammars, onRefresh }) => {
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [exampleInput, setExampleInput] = useState('');
  const [examples, setExamples] = useState<string[]>([]);

  const handleAddExample = () => {
    if (exampleInput) {
      setExamples([...examples, exampleInput]);
      setExampleInput('');
    }
  };

  const handleSave = () => {
    if (!title || !content) return;
    
    if (isEditing && selectedGrammar) {
      db.updateGrammar(selectedGrammar.id, { title, content, examples });
    } else {
      db.addGrammar({ title, content, examples });
    }
    
    setIsAdding(false);
    setIsEditing(false);
    setSelectedGrammar(null);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus grammar ini?')) {
      db.deleteGrammar(id);
      setSelectedGrammar(null);
      onRefresh();
    }
  };

  if (isAdding || isEditing) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in slide-in-from-bottom-4 duration-300">
        <h2 className="text-2xl font-bold">{isEditing ? 'Edit' : 'Tambah'} Grammar</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Judul Grammar</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Present Continuous Tense"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Penjelasan</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none h-40 resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jelaskan cara penggunaan dan fungsinya..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Contoh Kalimat</label>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={exampleInput} 
                onChange={(e) => setExampleInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: I am studying now"
                onKeyPress={(e) => e.key === 'Enter' && handleAddExample()}
              />
              <button onClick={handleAddExample} className="bg-slate-700 hover:bg-slate-600 px-4 rounded-xl transition-all">Add</button>
            </div>
            <ul className="space-y-2">
              {examples.map((ex, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg text-sm border border-slate-700">
                  <span>{ex}</span>
                  <button onClick={() => setExamples(examples.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-4 pt-6">
            <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-500 font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">Simpan</button>
            <button onClick={() => { setIsAdding(false); setIsEditing(false); }} className="px-6 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl transition-all">Batal</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 overflow-hidden pb-10">
      {/* List Area */}
      <div className="md:w-1/3 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center">
             <span className="w-1.5 h-5 bg-blue-500 rounded-full mr-2"></span>
             Materi Grammar
          </h3>
          <button 
            onClick={() => { setIsAdding(true); setTitle(''); setContent(''); setExamples([]); }}
            className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-lg active:scale-95"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {grammars.map(g => (
            <button 
              key={g.id}
              onClick={() => setSelectedGrammar(g)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedGrammar?.id === g.id 
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-inner' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <h5 className="font-bold truncate">{g.title}</h5>
              <p className="text-xs truncate opacity-70 mt-1">{g.content}</p>
            </button>
          ))}
          {grammars.length === 0 && (
            <div className="py-20 text-center text-slate-600 text-sm flex flex-col items-center">
              <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Belum ada materi grammar.</span>
            </div>
          )}
        </div>
      </div>

      {/* Detail Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedGrammar ? (
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 overflow-y-auto shadow-2xl custom-scrollbar animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <h2 className="text-3xl font-bold">{selectedGrammar.title}</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => { 
                    setIsEditing(true); 
                    setTitle(selectedGrammar.title); 
                    setContent(selectedGrammar.content); 
                    setExamples(selectedGrammar.examples); 
                  }}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 text-slate-400 hover:text-white transition-all border border-slate-700"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(selectedGrammar.id)}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 text-slate-400 hover:text-white transition-all border border-slate-700"
                  title="Hapus"
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-lg">{selectedGrammar.content}</p>
            </div>
            {selectedGrammar.examples.length > 0 && (
              <div className="mt-10 space-y-4">
                <h4 className="font-bold text-xl text-blue-400 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contoh Kalimat:
                </h4>
                <ul className="grid grid-cols-1 gap-3">
                  {selectedGrammar.examples.map((ex, i) => (
                    <li key={i} className="p-5 bg-slate-800/40 rounded-2xl border-l-4 border-blue-500 shadow-sm">
                      <span className="text-slate-100 font-medium italic">"{ex}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 p-10">
             <svg className="w-20 h-20 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-bold mb-2">Pilih Materi Grammar</h3>
            <p className="text-center max-w-sm">Klik salah satu materi di sidebar untuk melihat penjelasan detail dan contoh kalimat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grammar;
