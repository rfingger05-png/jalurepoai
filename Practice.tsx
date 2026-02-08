
import React, { useState, useEffect } from 'react';
import { Vocab, PracticeSession } from '../types';

interface PracticeProps {
  vocabs: Vocab[];
}

const Practice: React.FC<PracticeProps> = ({ vocabs }) => {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [quizList, setQuizList] = useState<Vocab[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [modeFilter, setModeFilter] = useState<'all' | 'chapter' | 'additional'>('all');

  const startPractice = (type: PracticeSession['type']) => {
    let filtered = vocabs;

    if (modeFilter === 'chapter') {
      if (selectedChapters.length > 0) {
        filtered = filtered.filter(v => v.chapterId && selectedChapters.includes(v.chapterId));
      } else {
        filtered = filtered.filter(v => !!v.chapterId);
      }
    } else if (modeFilter === 'additional') {
      filtered = filtered.filter(v => !v.chapterId);
    }
    // 'all' mode uses all vocabs

    if (filtered.length === 0) {
      alert('Tidak ada kosakata untuk kriteria ini!');
      return;
    }

    // Shuffle and pick top 10
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizList(shuffled);
    setSession({ type, chapterIds: selectedChapters, includeAdditional: modeFilter !== 'chapter' });
    setCurrentIndex(0);
    setShowAnswer(false);
    setScore(0);
    setIsFinished(false);
  };

  const handleNext = (correct: boolean) => {
    if (correct) setScore(score + 1);
    
    if (currentIndex + 1 < quizList.length) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
    }
  };

  const toggleChapter = (id: number) => {
    setSelectedChapters(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center animate-in zoom-in-95 duration-300">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-900/50">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold mb-2">Latihan Selesai!</h2>
        <p className="text-slate-400 mb-8">Kerja bagus, pertahankan semangat belajarmu!</p>
        <div className="text-6xl font-black text-blue-500 mb-8">{score} / {quizList.length}</div>
        <button 
          onClick={() => setSession(null)}
          className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-all"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  if (session && quizList.length > 0) {
    const current = quizList[currentIndex];
    
    return (
      <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div className="flex items-center justify-between text-slate-400 text-sm">
          <span>Progress: {currentIndex + 1} / {quizList.length}</span>
          <span>Score: {score}</span>
        </div>
        
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / quizList.length) * 100}%` }}
          ></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center min-h-[400px] flex flex-col justify-center relative overflow-hidden">
          {session.type === 'image' && current.imageUrl ? (
            <div className="mb-8">
              <img src={current.imageUrl} alt="Quiz" className="h-48 mx-auto rounded-2xl object-cover shadow-lg" />
            </div>
          ) : session.type === 'reverse' ? (
            <h3 className="text-4xl font-bold mb-8 text-blue-400">{current.meaning}</h3>
          ) : (
            <h3 className="text-4xl font-bold mb-8">{current.word}</h3>
          )}

          {showAnswer ? (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <div className="text-2xl font-bold text-slate-100 mb-8">
                {session.type === 'reverse' ? current.word : current.meaning}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleNext(false)}
                  className="flex-1 bg-slate-800 hover:bg-red-950 hover:text-red-400 border border-slate-700 py-4 rounded-2xl font-bold transition-all"
                >
                  Salah
                </button>
                <button 
                  onClick={() => handleNext(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all shadow-lg"
                >
                  Benar
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowAnswer(true)}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-4 rounded-2xl font-bold transition-all"
            >
              Lihat Jawaban
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Mode Latihan</h2>
        <p className="text-slate-400">Pilih materi dan jenis latihan yang kamu inginkan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h4 className="font-bold mb-6 flex items-center">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filter Materi
          </h4>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setModeFilter('all')}
                className={`w-full p-3 rounded-xl border text-left flex items-center transition-all ${modeFilter === 'all' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500'}`}
              >
                <div className={`w-3 h-3 rounded-full mr-3 ${modeFilter === 'all' ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                <span className="font-medium">Semua Materi</span>
              </button>
              <button 
                onClick={() => setModeFilter('additional')}
                className={`w-full p-3 rounded-xl border text-left flex items-center transition-all ${modeFilter === 'additional' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500'}`}
              >
                <div className={`w-3 h-3 rounded-full mr-3 ${modeFilter === 'additional' ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                <span className="font-medium">Hanya Kosakata Tambahan</span>
              </button>
              <button 
                onClick={() => setModeFilter('chapter')}
                className={`w-full p-3 rounded-xl border text-left flex items-center transition-all ${modeFilter === 'chapter' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500'}`}
              >
                <div className={`w-3 h-3 rounded-full mr-3 ${modeFilter === 'chapter' ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                <span className="font-medium">Materi Bab Spesifik</span>
              </button>
            </div>

            {modeFilter === 'chapter' && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <p className="text-sm font-medium text-slate-400 mb-3">Pilih Bab:</p>
                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {Array.from({ length: 60 }, (_, i) => i + 1).map(id => (
                    <button
                      key={id}
                      onClick={() => toggleChapter(id)}
                      className={`p-2 rounded-lg text-xs font-bold transition-all ${
                        selectedChapters.includes(id) ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => startPractice('meaning')}
            className="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all text-left group"
          >
            <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h5 className="font-bold">Tebak Arti</h5>
              <p className="text-xs text-slate-500">Kata → Arti</p>
            </div>
          </button>
          
          <button 
            onClick={() => startPractice('reverse')}
            className="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all text-left group"
          >
            <div className="w-12 h-12 bg-purple-600/20 text-purple-500 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
            </div>
            <div>
              <h5 className="font-bold">Dibalik</h5>
              <p className="text-xs text-slate-500">Arti → Kata</p>
            </div>
          </button>

          <button 
            onClick={() => startPractice('image')}
            className="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all text-left group"
          >
            <div className="w-12 h-12 bg-emerald-600/20 text-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h5 className="font-bold">Tebak Gambar</h5>
              <p className="text-xs text-slate-500">Gambar → Kata</p>
            </div>
          </button>

          <button 
            onClick={() => startPractice('random')}
            className="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all text-left group"
          >
            <div className="w-12 h-12 bg-orange-600/20 text-orange-500 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h5 className="font-bold">Random Mode</h5>
              <p className="text-xs text-slate-500">Campuran semua jenis</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Practice;
