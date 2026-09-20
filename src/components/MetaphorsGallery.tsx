import { copyText } from '../utils/clipboard';
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Volume2, 
  Search, 
  Shuffle, 
  BookOpen, 
  Eye, 
  Quote, 
  Check, 
  Globe2,
  Share2,
  Bookmark,
  RotateCcw
} from 'lucide-react';
import { IdiomItem } from '../types';
import { EUROPEAN_IDIOMS } from '../data/idioms';
import { CountryFlag } from './CountryFlag';
import { DuoOwl } from './DuoOwl';
import { soundEffects } from '../utils/soundEffects';

export const MetaphorsGallery: React.FC = () => {
  const [selectedIdiom, setSelectedIdiom] = useState<IdiomItem>(EUROPEAN_IDIOMS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [shuffledOrder, setShuffledOrder] = useState<IdiomItem[] | null>(null);
  const [showMore, setShowMore] = useState(false);
  const featuredCardRef = useRef<HTMLDivElement>(null);

  // Map each language to its representative idiom
  const langIdiomMap = useMemo(() => {
    const map = new Map<string, IdiomItem>();
    EUROPEAN_IDIOMS.forEach(i => {
      if (!map.has(i.language)) {
        map.set(i.language, i);
      }
    });
    return map;
  }, []);

  // Unique languages
  const availableLanguages = useMemo(() => {
    const langs = Array.from(new Set(EUROPEAN_IDIOMS.map(i => i.language)));
    return ['ALL', ...langs];
  }, []);

  // Filtered / displayed idioms
  const displayedIdioms = useMemo(() => {
    const baseList = shuffledOrder || EUROPEAN_IDIOMS;
    return baseList.filter(item => {
      const matchesLang = selectedLanguageFilter === 'ALL' || item.language === selectedLanguageFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.idiomNative.toLowerCase().includes(query) ||
        item.literalEnglish.toLowerCase().includes(query) ||
        item.contextualMeaning.toLowerCase().includes(query) ||
        item.language.toLowerCase().includes(query) ||
        item.culturalOrigin.toLowerCase().includes(query);

      return matchesLang && matchesSearch;
    });
  }, [shuffledOrder, selectedLanguageFilter, searchQuery]);

  const visibleIdioms = showMore ? displayedIdioms : displayedIdioms.slice(0, 3);

  // Handle clicking on language button
  const handleLanguageFilterClick = (lang: string) => {
    soundEffects.playTap();
    setSelectedLanguageFilter(lang);
    setShowMore(false);

    if (lang !== 'ALL') {
      const targetIdiom = langIdiomMap.get(lang);
      if (targetIdiom) {
        setSelectedIdiom(targetIdiom);
      }
    } else {
      // Show default starter idiom (French)
      setSelectedIdiom(EUROPEAN_IDIOMS[0]);
    }

    // Smoothly ensure the featured card is visible
    featuredCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // Change with other metaphors (shuffle entire collection)
  const handleShuffleOtherMetaphors = () => {
    soundEffects.playTap();
    const pool = [...EUROPEAN_IDIOMS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    setShuffledOrder(pool);
    setShowMore(false);
    setSelectedIdiom(pool[0]);
    featuredCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // Show all collection
  const handleShowAll = () => {
    soundEffects.playTap();
    setShuffledOrder(null);
    setSelectedLanguageFilter('ALL');
    setShowMore(false);
  };

  // Audio pronunciation
  const handlePronounce = (idiom: IdiomItem) => {
    setPlayingId(idiom.id);
    soundEffects.playNodePing(560);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(idiom.idiomNative);
      utterance.lang = idiom.audioLang;
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingId(null), 1500);
    }
  };

  // Copy idiom text
  const handleCopy = async (idiom: IdiomItem) => {
    const textToCopy = `"${idiom.idiomNative}" (${idiom.language}) - Literal: "${idiom.literalEnglish}" | Meaning: "${idiom.contextualMeaning}"`;
    if (!await copyText(textToCopy)) return;
    setCopiedId(idiom.id);
    soundEffects.playNodePing(720);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Random metaphor shuffle
  const handleRandomMetaphor = () => {
    soundEffects.playNodePing(640);
    const randomIndex = Math.floor(Math.random() * EUROPEAN_IDIOMS.length);
    setSelectedIdiom(EUROPEAN_IDIOMS[randomIndex]);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner & Search (Duolingo Style) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <DuoOwl size="md" mood="wink" className="shrink-0" />
          <div>
            <h2 className="text-lg font-black text-[#3c3c3c] tracking-tight flex flex-wrap items-center gap-2">
              European Metaphors & Quirky Sayings
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#fff5cc] text-[#b38000] border border-[#ffc800]/40">
                {EUROPEAN_IDIOMS.length} Expressions
              </span>
            </h2>
            <p className="text-xs font-bold text-[#777777]">
              European cultures express humor, wisdom, and daily life through colorful figurative pictures!
            </p>
          </div>
        </div>

        {/* Action Controls: Search & Surprise Me */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#afafaf] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search idioms, words, food..."
              className="w-full pl-9 pr-3.5 py-2 text-xs font-bold rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] text-[#3c3c3c] placeholder-[#afafaf] focus:outline-none focus:border-[#1cb0f6] focus:bg-white"
            />
          </div>

          <button
            onClick={handleRandomMetaphor}
            className="px-4 py-2.5 duo-btn-yellow text-xs flex items-center gap-1.5 uppercase tracking-wider shrink-0"
            title="Random Metaphor"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Surprise Me</span>
          </button>
        </div>
      </div>

      {/* Language Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pb-1 pt-1">
        {availableLanguages.map((lang) => {
          const isSelected = selectedLanguageFilter === lang;
          const idiomInfo = langIdiomMap.get(lang);
          return (
            <button
              key={lang}
              onClick={() => handleLanguageFilterClick(lang)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all border-2 border-b-4 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#1cb0f6] border-[#1899d6] text-white shadow-sm scale-105'
                  : 'bg-white border-[#e5e5e5] border-b-[#cecece] text-[#777777] hover:border-[#1cb0f6] hover:text-[#3c3c3c]'
              }`}
            >
              {lang === 'ALL' ? (
                <Globe2 className="w-3.5 h-3.5" />
              ) : idiomInfo ? (
                <CountryFlag code={idiomInfo.countryCode} size="sm" className="scale-90" />
              ) : null}
              <span>{lang === 'ALL' ? 'All European Tongues' : lang}</span>
            </button>
          );
        })}
      </div>

      {/* Featured Metaphor Card (Duolingo Style Spotlight) */}
      <div 
        ref={featuredCardRef}
        className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm relative flex flex-col md:flex-row gap-6 items-start justify-between"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIdiom.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col gap-4 w-full"
          >
            <div className="flex items-center gap-3.5">
              <CountryFlag code={selectedIdiom.countryCode} size="xl" className="ring-4 ring-[#e5e5e5] shadow-sm" />
              <div>
                <span className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider block">
                  {selectedIdiom.language} Expression
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#3c3c3c] tracking-tight mt-0.5">
                  "{selectedIdiom.idiomNative}"
                </h3>
              </div>
            </div>

            <div className="text-xs font-extrabold text-[#777777] bg-[#f7f7f7] px-3.5 py-1.5 rounded-xl border border-[#e5e5e5] inline-block w-fit">
              Pronunciation: [{selectedIdiom.phonetic}]
            </div>

            {/* Literal Translation vs Actual Meaning Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Literal Translation in Pink / Red Box */}
              <div className="p-4 rounded-2xl bg-[#ffdfe0] border-2 border-[#ff4b4b] shadow-xs">
                <span className="text-[10px] uppercase font-black tracking-wider text-[#ff4b4b] flex items-center gap-1.5 mb-1">
                  <Eye className="w-3.5 h-3.5" /> Literal Word-For-Word Translation:
                </span>
                <p className="text-base font-black text-[#4b4b4b] leading-snug">
                  "{selectedIdiom.literalEnglish}"
                </p>
              </div>

              {/* Actual Meaning in Green Box */}
              <div className="p-4 rounded-2xl bg-[#d7ffb8] border-2 border-[#58cc02] shadow-xs">
                <span className="text-[10px] uppercase font-black tracking-wider text-[#3c8c02] flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> What It Actually Means:
                </span>
                <p className="text-base font-black text-[#1e5000] leading-snug">
                  "{selectedIdiom.contextualMeaning}"
                </p>
              </div>
            </div>

            {/* Cultural Folklore Origin */}
            <div className="p-4 rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] text-xs text-[#4b4b4b] space-y-1">
              <span className="text-[11px] font-black text-[#ff9600] uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Cultural Story & Folklore:
              </span>
              <p className="text-[#5a5a5a] font-bold leading-relaxed text-xs">
                {selectedIdiom.culturalOrigin}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right Action Buttons in Duolingo 3D Button Style */}
        <div className="flex flex-row md:flex-col items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => handlePronounce(selectedIdiom)}
            disabled={playingId === selectedIdiom.id}
            className="w-full md:w-auto px-6 py-3.5 duo-btn-blue text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            title="Listen to native pronunciation"
          >
            <Volume2 className={`w-4 h-4 fill-white ${playingId === selectedIdiom.id ? 'animate-bounce' : ''}`} />
            <span>{playingId === selectedIdiom.id ? 'Speaking...' : 'Pronounce Phrase'}</span>
          </button>
        </div>
      </div>

      {/* Grid of All European Metaphor Cards */}
      <div className="flex flex-col gap-3.5 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 pb-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h4 className="text-base font-black text-[#3c3c3c] tracking-wide flex items-center gap-2">
              Metaphor Collection
            </h4>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#f0f0f0] text-[#666666]">
              {displayedIdioms.length} expressions
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleShuffleOtherMetaphors}
              className="px-3.5 py-2 duo-btn-blue text-xs font-black flex items-center gap-1.5 uppercase tracking-wider cursor-pointer shadow-xs"
              title="Change and shuffle with other metaphors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Change Metaphors</span>
            </button>

            {(shuffledOrder || selectedLanguageFilter !== 'ALL') && (
              <button
                onClick={handleShowAll}
                className="px-3 py-2 rounded-2xl bg-white border-2 border-[#e5e5e5] border-b-4 border-b-[#cecece] text-xs font-black text-[#777777] hover:text-[#3c3c3c] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Show All ({EUROPEAN_IDIOMS.length})</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleIdioms.map((idiom) => {
            const isSelected = selectedIdiom.id === idiom.id;
            return (
              <div
                key={idiom.id}
                onClick={() => {
                  soundEffects.playNodePing(580);
                  setSelectedIdiom(idiom);
                  featuredCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                className={`p-5 rounded-2xl border-2 border-b-4 transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                  isSelected
                    ? 'bg-[#f7fcff] border-[#1cb0f6] border-b-[#1899d6] shadow-sm scale-102 ring-2 ring-[#1cb0f6]/30'
                    : 'bg-white border-[#e5e5e5] border-b-[#cecece] hover:border-[#1cb0f6]'
                }`}
              >

                {/* Card Header: Flag & Language */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <CountryFlag code={idiom.countryCode} size="md" />
                    <div>
                      <span className="text-[11px] font-black text-[#58cc02] block">
                        {idiom.language}
                      </span>
                      <h5 className="text-base font-black text-[#3c3c3c] mt-0.5">
                        "{idiom.idiomNative}"
                      </h5>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePronounce(idiom);
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-[#ddf4ff] border border-[#e5e5e5] hover:border-[#1cb0f6] text-[#1cb0f6] transition-colors cursor-pointer"
                    title="Pronounce"
                  >
                    <Volume2 className={`w-4 h-4 fill-current ${playingId === idiom.id ? 'animate-pulse' : ''}`} />
                  </button>
                </div>

                {/* Card Body: Literal vs Actual */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#ffdfe0] border border-[#ff4b4b]/30">
                    <span className="text-[9px] uppercase font-black text-[#ff4b4b] block">
                      Literal:
                    </span>
                    <span className="text-xs font-black text-[#4b4b4b] block mt-0.5">
                      "{idiom.literalEnglish}"
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#d7ffb8] border border-[#58cc02]/30">
                    <span className="text-[9px] uppercase font-black text-[#3c8c02] block">
                      Means:
                    </span>
                    <span className="text-xs font-black text-[#1e5000] block mt-0.5">
                      "{idiom.contextualMeaning}"
                    </span>
                  </div>
                </div>

                {/* Card Footer: Cultural Origin */}
                <p className="text-[11px] text-[#777777] line-clamp-2 font-bold italic pt-2 border-t border-[#e5e5e5]">
                  {idiom.culturalOrigin}
                </p>
              </div>
            );
          })}
        </div>

        {displayedIdioms.length > 3 && (
          <button
            type="button"
            onClick={() => {
              soundEffects.playTap();
              setShowMore((current) => !current);
            }}
            className="self-center mt-2 px-6 py-3 duo-btn-blue text-sm uppercase tracking-wider shadow-sm"
            aria-expanded={showMore}
          >
            {showMore ? 'Show Less' : `See More (${displayedIdioms.length - 3})`}
          </button>
        )}
      </div>
    </div>
  );
};
