
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Setoran from './components/Setoran';
import ChapterList from './components/ChapterList';
import ChapterDetail from './components/ChapterDetail';
import Practice from './components/Practice';
import Grammar from './components/Grammar';
import { db } from './services/db';
import { AppState } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [appState, setAppState] = useState<AppState>(db.get());

  const refreshState = useCallback(() => {
    setAppState(db.get());
  }, []);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setSelectedChapter(null); // Reset chapter view when changing tabs
  };

  const handleSelectChapter = (id: number) => {
    setSelectedChapter(id);
  };

  const renderContent = () => {
    if (selectedChapter !== null && activeTab === 'bab') {
      return (
        <ChapterDetail 
          chapterId={selectedChapter} 
          vocabs={appState.vocabs} 
          onBack={() => setSelectedChapter(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={appState} />;
      case 'setoran':
        return <Setoran onRefresh={refreshState} vocabs={appState.vocabs} />;
      case 'bab':
        return <ChapterList vocabs={appState.vocabs} onSelectChapter={handleSelectChapter} />;
      case 'grammar':
        return <Grammar grammars={appState.grammars} onRefresh={refreshState} />;
      case 'practice':
        return <Practice vocabs={appState.vocabs} />;
      default:
        return <Dashboard state={appState} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </Layout>
  );
};

export default App;
