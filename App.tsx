import React, { useState, useEffect } from 'react';
import VideoGenerator from './components/VideoGenerator';
import ImageEditor from './components/ImageEditor';
import StoryboardGenerator from './components/StoryboardGenerator';
import ApiKeyGuard from './components/ApiKeyGuard';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VIDEO_GENERATION);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ApiKeyGuard>
      <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500/30">
        
        {/* Header */}
        <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight">Gemini Studio</span>
            </div>
            
            <nav className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab(AppTab.VIDEO_GENERATION)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === AppTab.VIDEO_GENERATION
                    ? 'bg-gray-700 text-white shadow ring-1 ring-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Veo Video
              </button>
              <button
                onClick={() => setActiveTab(AppTab.IMAGE_EDITING)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === AppTab.IMAGE_EDITING
                    ? 'bg-gray-700 text-white shadow ring-1 ring-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Nano Image
              </button>
              <button
                onClick={() => setActiveTab(AppTab.STORYBOARD)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === AppTab.STORYBOARD
                    ? 'bg-gray-700 text-white shadow ring-1 ring-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                🎬 Storyboard
              </button>
            </nav>
          </div>
          
          {/* Offline Banner */}
          {!isOnline && (
            <div className="bg-red-900/90 border-b border-red-700 text-white px-4 py-2 text-center text-sm font-medium backdrop-blur animate-fade-in flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
              </svg>
              You are currently offline. Generation features are disabled.
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="transition-opacity duration-300 ease-in-out">
            {activeTab === AppTab.VIDEO_GENERATION ? (
              <section>
                 <div className="mb-6">
                   <h1 className="text-3xl font-bold text-white mb-2">Video Generation</h1>
                   <p className="text-gray-400 max-w-2xl">
                     Create high-definition videos from text prompts or animate your existing images using the 
                     <span className="text-purple-400 font-medium"> Veo 3.1</span> model.
                   </p>
                 </div>
                 <VideoGenerator isOffline={!isOnline} />
              </section>
            ) : activeTab === AppTab.IMAGE_EDITING ? (
              <section>
                <div className="mb-6">
                   <h1 className="text-3xl font-bold text-white mb-2">Magic Image Editor</h1>
                   <p className="text-gray-400 max-w-2xl">
                     Upload a photo and use natural language to edit it instantly with the power of 
                     <span className="text-yellow-400 font-medium"> Gemini 2.5 Flash Image</span>.
                   </p>
                 </div>
                <ImageEditor isOffline={!isOnline} />
              </section>
            ) : (
              <section>
                <div className="mb-6">
                   <h1 className="text-3xl font-bold text-white mb-2">Storyboard Generator</h1>
                   <p className="text-gray-400 max-w-2xl">
                     Create multi-shot video sequences with individual prompts, durations, and transitions.
                   </p>
                 </div>
                <StoryboardGenerator isOffline={!isOnline} />
              </section>
            )}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-gray-800 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
                <p>Powered by Google Gemini API & Veo</p>
            </div>
        </footer>

      </div>
    </ApiKeyGuard>
  );
};

export default App;