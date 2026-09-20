import React from 'react';
import {
  Compass,
  Quote,
  Mic,
  Gamepad2,
  BookOpen,
  Sparkles,
  MessageCircle,
  Bot
} from 'lucide-react';
import { DuoOwl } from './DuoOwl';
import { soundEffects } from '../utils/soundEffects';

export type TabType = 'map' | 'idiom' | 'speech' | 'game';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  onToggleChat,
  isChatOpen = false,
}) => {
  const tabs = [
    {
      id: 'map' as TabType,
      label: 'Europe Map',
      sublabel: 'Interactive Continent',
      icon: Compass,
      color: 'blue',
      activeClass: 'bg-[#1cb0f6] border-[#1899d6] text-white',
      badgeClass: 'bg-white/20 text-white',
    },
    {
      id: 'idiom' as TabType,
      label: 'Metaphors',
      sublabel: 'Cultural Idioms',
      icon: Quote,
      color: 'yellow',
      activeClass: 'bg-[#ffc800] border-[#e5a500] text-[#4d3200]',
      badgeClass: 'bg-white/30 text-[#4d3200]',
    },
    {
      id: 'speech' as TabType,
      label: 'Albanian Spotlight',
      sublabel: 'Gjuha Shqipe',
      icon: Sparkles,
      color: 'red',
      activeClass: 'bg-[#ff4b4b] border-[#ea2b2b] text-white',
      badgeClass: 'bg-white/20 text-white',
    },
    {
      id: 'game' as TabType,
      label: 'False Friends',
      sublabel: 'Glitch Quiz',
      icon: Gamepad2,
      color: 'green',
      activeClass: 'bg-[#58cc02] border-[#46a302] text-white',
      badgeClass: 'bg-white/20 text-white',
    },
  ];

  const handleTabChange = (tabId: TabType) => {
    soundEffects.playNodePing(540);
    setActiveTab(tabId);
  };

  const handleToggleSound = () => {
    const nextMute = soundEffects.toggleMute();
    setIsMuted(nextMute);
  };

  return (
    <header className="w-full flex flex-col gap-4">
      {/* Top Gamified Navbar */}
      <div className="w-full bg-white border-2 border-b-4 border-[#e5e5e5] rounded-3xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {/* Left Brand with Bison */}
        <div className="flex items-center gap-3">
          <DuoOwl size="md" mood="happy" />
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-[#1cb0f6]">
                Europa<span className="text-[#ffc800]">lingo</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#ddf4ff] text-[#0284c7] px-2 py-0.5 rounded-full border border-[#1cb0f6]/30">
                26 Sept
              </span>
            </div>
            <p className="text-xs font-bold text-[#777777]">
              European Day of Languages • Official Celebration
            </p>
          </div>
        </div>
      </div>

      {/* Mascot Speech Bubble & Section Ribbon (Duolingo Style Banner) */}
      <div className="bg-[#1cb0f6] border-b-4 border-[#1899d6] rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5 text-left">
          <DuoOwl size="lg" mood="cheering" className="shrink-0 drop-shadow-md" />
          <div className="bg-white text-[#3c3c3c] p-3 sm:p-3.5 rounded-2xl border-2 border-b-4 border-[#e5e5e5] relative duo-speech-bubble shadow-sm max-w-lg">
            <span className="text-[11px] font-black uppercase text-[#1cb0f6] tracking-wider block mb-0.5">
              EUROPEAN DAY OF LANGUAGES
            </span>
            <p className="text-xs sm:text-sm font-extrabold leading-snug text-[#4b4b4b]">
              "Happy European Day of Languages! Explore 200+ continental languages, quirky metaphors, authentic accents, and deceptive false friends!"
            </p>
          </div>
        </div>
      </div>

      {/* 4 Tactile Navigation Tabs */}
      <nav className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`min-w-0 py-3 px-2 sm:px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 border-2 border-b-4 transition-all ${isActive
                ? `${tab.activeClass} shadow-sm scale-102`
                : 'bg-white border-[#e5e5e5] border-b-[#cecece] text-[#777777] hover:bg-[#f7f7f7] hover:text-[#3c3c3c]'
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="flex flex-col items-start text-left leading-tight">
                <span className="font-black tracking-tight">{tab.label}</span>
                <span className={`text-[10px] font-semibold hidden md:inline opacity-80`}>
                  {tab.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
