
import { Vocab, Grammar, AppState } from '../types';

const STORAGE_KEY = 'linguist_pro_db';

const defaultState: AppState = {
  vocabs: [],
  grammars: [],
  progress: {},
};

export const db = {
  get: (): AppState => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultState;
  },
  save: (state: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  addVocab: (vocab: Omit<Vocab, 'id' | 'createdAt'>) => {
    const state = db.get();
    const newVocab: Vocab = {
      ...vocab,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    state.vocabs.push(newVocab);
    db.save(state);
    return newVocab;
  },
  updateVocab: (id: string, updates: Partial<Vocab>) => {
    const state = db.get();
    state.vocabs = state.vocabs.map(v => v.id === id ? { ...v, ...updates } : v);
    db.save(state);
  },
  deleteVocab: (id: string) => {
    const state = db.get();
    state.vocabs = state.vocabs.filter(v => v.id !== id);
    db.save(state);
  },
  addGrammar: (grammar: Omit<Grammar, 'id' | 'createdAt'>) => {
    const state = db.get();
    const newGrammar: Grammar = {
      ...grammar,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    state.grammars.push(newGrammar);
    db.save(state);
    return newGrammar;
  },
  updateGrammar: (id: string, updates: Partial<Grammar>) => {
    const state = db.get();
    state.grammars = state.grammars.map(g => g.id === id ? { ...g, ...updates } : g);
    db.save(state);
  },
  deleteGrammar: (id: string) => {
    const state = db.get();
    state.grammars = state.grammars.filter(g => g.id !== id);
    db.save(state);
  }
};
