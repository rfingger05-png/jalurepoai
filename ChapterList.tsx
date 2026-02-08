
import React from 'react';
import { Vocab } from '../types';

interface ChapterListProps {
  vocabs: Vocab[];
  onSelectChapter: (id: number) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({ vocabs, onSelectChapter }) => {
  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 60 }, (_, i) => {
          const chId = i + 1;
          const chVocabs = vocabs.filter(v => v.chapterId === chId);
          const hasContent = chVocabs.length > 0;
          const imageCount = chVocabs.filter(v => !!v.imageUrl).length;

          return (
            <button
              key={chId}
              onClick={() => onSelectChapter(chId)}
              className={`relative overflow-hidden p-4 rounded-2xl border text-left transition-all active:scale-95 group ${
                hasContent 
                  ? 'bg-slate-900 border-slate-700 hover:border-blue-500 shadow-lg' 
                  : 'bg-slate-900/30 border-slate-800 opacity-60'
              }`}
            >
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-blue-500 mb-1">CHAPTER</p>
                <h3 className="text-2xl font-bold">{chId}</h3>
                <div className="mt-4 flex items-center text-[10px] font-medium text-slate-400 gap-3">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {chVocabs.length}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {imageCount}
                  </span>
                </div>
              </div>
              
              {/* Animated background on hover */}
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterList;
