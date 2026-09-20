import React, { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header, TabType } from './components/Header';
const MapGalaxy = lazy(() => import('./components/MapGalaxy').then((module) => ({ default: module.MapGalaxy })));
const MetaphorsGallery = lazy(() => import('./components/MetaphorsGallery').then((module) => ({ default: module.MetaphorsGallery })));
const SpeechStudio = lazy(() => import('./components/SpeechStudio').then((module) => ({ default: module.SpeechStudio })));
const FalseFriendsGame = lazy(() => import('./components/FalseFriendsGame').then((module) => ({ default: module.FalseFriendsGame })));
import { BirdChatbot } from './components/BirdChatbot';
import { soundEffects } from './utils/soundEffects';
import { Globe2, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleSpeakPhrase = (text: string, langCode: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7fc] text-[#3c3c3c] flex flex-col relative selection:bg-[#1cb0f6]/30 selection:text-[#1cb0f6]">
      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6 flex-1 relative z-10">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onToggleChat={() => setIsChatOpen((prev) => !prev)}
          isChatOpen={isChatOpen}
        />

        {/* Tab Module Content with Motion Transitions */}
        <main className="flex-1 w-full">
          <Suspense fallback={<p role="status" className="p-6 text-center text-slate-500">Loading section…</p>}>
          <AnimatePresence mode="wait">
            {activeTab === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MapGalaxy onSpeakPhrase={handleSpeakPhrase} />
              </motion.div>
            )}

            {activeTab === 'idiom' && (
              <motion.div
                key="idiom"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MetaphorsGallery />
              </motion.div>
            )}

            {activeTab === 'speech' && (
              <motion.div
                key="speech"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SpeechStudio />
              </motion.div>
            )}

            {activeTab === 'game' && (
              <motion.div
                key="game"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FalseFriendsGame />
              </motion.div>
            )}
          </AnimatePresence>
          </Suspense>
        </main>

        {/* Duolingo Style Clean Footer */}
        <footer className="mt-8 py-5 border-t-2 border-[#e5e5e5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#777777] font-bold">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#1cb0f6]" />
            <span className="text-[#3c3c3c] font-extrabold">European Day of Languages • 26 September</span>
            <span className="hidden md:inline">• Council of Europe</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Discover 200+ European Languages & Dialects</span>
            <Sparkles className="w-3.5 h-3.5 text-[#ffc800] fill-[#ffc800]" />
          </div>
        </footer>
      </div>

      {/* Floating Lingo Chatbot on the Right Corner */}
      <BirdChatbot
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen((prev) => !prev)}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
