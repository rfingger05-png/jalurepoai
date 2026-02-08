
import React from 'react';
import { Vocab } from '../types';

interface ChapterDetailProps {
  chapterId: number;
  vocabs: Vocab[];
  onBack: () => void;
}

const ChapterDetail: React.FC<ChapterDetailProps> = ({ chapterId, vocabs, onBack }) => {
  const chVocabs = vocabs.filter(v => v.chapterId === chapterId);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={onBack}
          className="bg-slate-900 border border-slate-800 p-2 rounded-xl hover:bg-slate-800 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-3xl font-bold">Bab {chapterId}</h2>
          <p className="text-slate-400">Total {chVocabs.length} kosakata dalam bab ini</p>
        </div>
      </div>

      {chVocabs.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
          <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-slate-500">Belum ada kosakata di bab ini.</p>
          <p className="text-slate-600 text-sm mt-1">Gunakan menu Setoran untuk menambahkannya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chVocabs.map((v) => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
              {v.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img src={v.imageUrl} alt={v.word} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                </div>
              )}
              <div className="p-6">
                <h4 className="text-2xl font-bold mb-1">{v.word}</h4>
                <p className="text-blue-400 font-medium">{v.meaning}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterDetail;
