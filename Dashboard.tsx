
import React from 'react';
import { AppState } from '../types';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const totalVocab = state.vocabs.length;
  const totalImages = state.vocabs.filter(v => !!v.imageUrl).length;
  
  const chapterProgress = Array.from({ length: 60 }, (_, i) => {
    const chId = i + 1;
    const vocabCount = state.vocabs.filter(v => v.chapterId === chId).length;
    return { chId, count: vocabCount };
  });

  const activeChapters = chapterProgress.filter(cp => cp.count > 0).length;

  return (
    <div className="flex flex-col space-y-6 pb-20">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500 shadow-xl">
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total Kosakata</p>
          <h3 className="text-4xl font-bold mt-2">{totalVocab}</h3>
          <p className="text-blue-200 text-sm mt-1">Item tersimpan</p>
        </div>
        <div className="flex-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Gambar</p>
          <h3 className="text-4xl font-bold mt-2 text-blue-400">{totalImages}</h3>
          <p className="text-slate-500 text-sm mt-1">Visualisasi aktif</p>
        </div>
        <div className="flex-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Progress Bab</p>
          <h3 className="text-4xl font-bold mt-2 text-white">{activeChapters}<span className="text-slate-600 text-2xl font-normal">/60</span></h3>
          <p className="text-slate-500 text-sm mt-1">Bab dengan konten</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
          Visualisasi Progress Bab
        </h4>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {chapterProgress.map((cp) => (
            <div 
              key={cp.chId} 
              className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition-all relative ${
                cp.count > 0 
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold' 
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
              title={`Bab ${cp.chId}: ${cp.count} kosakata`}
            >
              <span className="text-[10px] opacity-50 uppercase mb-0.5">CH</span>
              <span className="text-sm">{cp.chId}</span>
              {cp.count > 0 && <span className="absolute bottom-1 w-1 h-1 bg-blue-400 rounded-full"></span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
