
export interface Vocab {
  id: string;
  word: string;
  meaning: string;
  chapterId?: number; // 1-60, or undefined for "Additional"
  imageUrl?: string;
  createdAt: number;
}

export interface Grammar {
  id: string;
  title: string;
  content: string;
  examples: string[];
  createdAt: number;
}

export interface Chapter {
  id: number;
  title: string;
}

export interface PracticeSession {
  type: 'meaning' | 'image' | 'reverse' | 'random';
  chapterIds: number[]; // empty means all or specific additional
  includeAdditional: boolean;
}

export interface AppState {
  vocabs: Vocab[];
  grammars: Grammar[];
  progress: Record<number, number>; // chapterId -> percentage
}
