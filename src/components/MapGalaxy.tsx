import { copyText } from '../utils/clipboard';
import { COUNTRY_LESSONS } from '../data/countryLessons';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  Sparkles, 
  Compass, 
  Users, 
  Globe2, 
  BookOpen, 
  Award,
  Layers,
  CheckCircle2,
  Share2,
  Palette,
  MapPin,
  Check,
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';
import { LanguageNode, LanguageFamilyId } from '../types';
import { EUROPEAN_LANGUAGES, LANGUAGE_FAMILIES, GALAXY_CONNECTIONS } from '../data/languages';
import { EUROPE_COUNTRY_PATHS, EuropeanCountryPath } from '../data/europeMapPaths';
import { EUROPE_BACKGROUND_PATH } from '../data/europeGeometry';
import { CountryFlag } from './CountryFlag';
import { soundEffects } from '../utils/soundEffects';

type ColorThemeMode = 'ui-palette' | 'family' | 'screenshot-blue';

interface MapGalaxyProps {
  onSpeakPhrase?: (text: string, langCode: string) => void;
}

export const MapGalaxy: React.FC<MapGalaxyProps> = ({ onSpeakPhrase }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageNode | null>(COUNTRY_LESSONS.get('FR') || null);
  const [hoveredCountry, setHoveredCountry] = useState<EuropeanCountryPath | null>(null);
  const [activeFamilyFilter, setActiveFamilyFilter] = useState<LanguageFamilyId | 'ALL'>('ALL');
  const [colorTheme, setColorTheme] = useState<ColorThemeMode>('ui-palette');
  const [showConnections, setShowConnections] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [playingPhraseIndex, setPlayingPhraseIndex] = useState<number | null>(null);
  const [exploredCountries, setExploredCountries] = useState<Set<string>>(new Set(['FR', 'DE', 'ES', 'IT']));
  const [copiedState, setCopiedState] = useState<boolean>(false);

  // Filter languages by family
  const filteredLanguages = useMemo(() => {
    if (activeFamilyFilter === 'ALL') return EUROPEAN_LANGUAGES;
    return EUROPEAN_LANGUAGES.filter(lang => lang.family === activeFamilyFilter);
  }, [activeFamilyFilter]);

  const countryLanguageMap = COUNTRY_LESSONS;

  // Count how many countries belong to each language family
  const familyCountryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of EUROPE_COUNTRY_PATHS) {
      if (c.family) {
        counts[c.family] = (counts[c.family] || 0) + 1;
      }
    }
    return counts;
  }, []);

  const handleFamilyFilterChange = (famId: LanguageFamilyId | 'ALL') => {
    soundEffects.playTap();
    setActiveFamilyFilter(famId);

    if (famId !== 'ALL') {
      // Find the first country in this family and select it so details update immediately
      const firstCountry = EUROPE_COUNTRY_PATHS.find(c => c.family === famId);
      if (firstCountry) {
        const lang = countryLanguageMap.get(firstCountry.code);
        if (lang) {
          setSelectedLanguage(lang);
        }
      }
    }
  };

  // Handle clicking on a country on the map
  const handleCountryClick = (country: EuropeanCountryPath) => {
    soundEffects.playNodePing(880);
    // Mark as explored
    setExploredCountries(prev => new Set(prev).add(country.code));

    // Find corresponding language
    const lang = countryLanguageMap.get(country.code);
    
    if (lang) {
      setSelectedLanguage(lang);
    }
  };

  // Handle clicking on a node
  const handleNodeClick = (lang: LanguageNode) => {
    soundEffects.playNodePing(750);
    setExploredCountries(prev => new Set(prev).add(lang.countryCode));
    setSelectedLanguage(lang);
  };

  const handlePlayAudio = (phraseText: string, audioLang: string, index: number) => {
    setPlayingPhraseIndex(index);
    soundEffects.playNodePing(750);
    if (onSpeakPhrase) {
      onSpeakPhrase(phraseText, audioLang);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phraseText);
      utterance.lang = audioLang;
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingPhraseIndex(null);
      utterance.onerror = () => setPlayingPhraseIndex(null);
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => {
      setPlayingPhraseIndex(null);
    }, 3000);
  };

  const handleShare = async () => {
    if (!selectedLanguage) return;
    const shareText = `Explore ${selectedLanguage.name} on the European Day of Languages Map! Greeting: "${selectedLanguage.edlGreeting.native}" (${selectedLanguage.edlGreeting.translation})`;
    if (await copyText(shareText)) {
      setCopiedState(true);
      soundEffects.playCorrect();
      setTimeout(() => setCopiedState(false), 2000);
    }
  };

  // Resolve country fill color based on active color theme and family filtering
  const getCountryFill = (country: EuropeanCountryPath) => {
    const isSelected = selectedLanguage?.countryCode === country.code;
    const isHovered = hoveredCountry?.id === country.id;
    const isMatchingFamily = activeFamilyFilter === 'ALL' || country.family === activeFamilyFilter;

    // Filter dimming: non-matching countries become clean subtle muted slate
    if (!isMatchingFamily) {
      return '#f1f5f9';
    }

    if (isSelected) return '#1cb0f6';
    if (isHovered) return '#38bdf8';

    // When a specific family is active, tint countries with that family's official theme color
    if (activeFamilyFilter !== 'ALL') {
      const famInfo = country.family ? LANGUAGE_FAMILIES[country.family] : null;
      if (famInfo?.color) return famInfo.color;
    }

    return country.uiPaletteColor;
  };

  const getCountryStroke = (country: EuropeanCountryPath) => {
    const isSelected = selectedLanguage?.countryCode === country.code;
    const isMatchingFamily = activeFamilyFilter === 'ALL' || country.family === activeFamilyFilter;

    if (!isMatchingFamily) {
      return '#e2e8f0';
    }

    if (isSelected) return '#0c7ab1';
    if (activeFamilyFilter !== 'ALL') return '#ffffff';
    return country.uiPaletteBorder;
  };

  const getCountryOpacity = (country: EuropeanCountryPath) => {
    const isMatchingFamily = activeFamilyFilter === 'ALL' || country.family === activeFamilyFilter;
    if (!isMatchingFamily) {
      return 0.22;
    }
    return 1;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Controls & Theme Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Title and stats */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-12 h-12 rounded-2xl bg-[#ddf4ff] border-2 border-[#1cb0f6] flex items-center justify-center text-[#1cb0f6] shadow-sm shrink-0">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-[#3c3c3c] tracking-tight">
                  European Language Continent Map
                </h2>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#d7ffb8] text-[#3c8c02] border border-[#58cc02]/40">
                  {EUROPE_COUNTRY_PATHS.length} Countries
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#fff5cc] text-[#b38000] border border-[#ffc800]/40 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#ff9600]" />
                  <span>{exploredCountries.size} Explored</span>
                </span>
              </div>
              <p className="text-xs font-bold text-[#777777]">
                Explore Europe’s countries. Flag markers show their capital locations.
              </p>
            </div>
          </div>

          {/* Map display controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Family Paths */}
            <button
              onClick={() => setShowConnections(!showConnections)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 border-2 border-b-4 transition-all ${
                showConnections
                  ? 'bg-[#58cc02] border-[#46a302] text-white'
                  : 'bg-white border-[#e5e5e5] text-[#777777]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showConnections ? 'Paths: ON' : 'Paths: OFF'}</span>
            </button>

            {/* Toggle Labels */}
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 border-2 border-b-4 transition-all ${
                showLabels
                  ? 'bg-[#ffc800] border-[#e6b400] text-[#4d3200]'
                  : 'bg-white border-[#e5e5e5] text-[#777777]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showLabels ? 'Labels: ON' : 'Labels: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Language Family Filter Ribbon */}
        <div className="flex flex-wrap items-center gap-2 pb-1 pt-1">
          <button
            onClick={() => handleFamilyFilterChange('ALL')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all border-2 border-b-4 cursor-pointer ${
              activeFamilyFilter === 'ALL'
                ? 'bg-[#1cb0f6] border-[#1899d6] text-white shadow-sm scale-105'
                : 'bg-white border-[#e5e5e5] border-b-[#cecece] text-[#777777] hover:border-[#1cb0f6] hover:text-[#1cb0f6]'
            }`}
          >
            All Europe ({EUROPE_COUNTRY_PATHS.length})
          </button>

          {Object.values(LANGUAGE_FAMILIES).map((fam) => {
            const isSelected = activeFamilyFilter === fam.id;
            const count = familyCountryCounts[fam.id] || 0;
            return (
              <button
                key={fam.id}
                onClick={() => handleFamilyFilterChange(fam.id)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all border-2 border-b-4 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'scale-105 shadow-sm text-white'
                    : 'bg-white border-[#e5e5e5] border-b-[#cecece] text-[#777777] hover:text-[#3c3c3c]'
                }`}
                style={{
                  backgroundColor: isSelected ? fam.color : undefined,
                  borderColor: isSelected ? fam.color : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: isSelected ? '#ffffff' : fam.color }}
                />
                <span>{fam.name} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Active Language Family Deep Dive & Quick Country Selector */}
        {activeFamilyFilter !== 'ALL' && LANGUAGE_FAMILIES[activeFamilyFilter] && (
          <div className="p-3 sm:p-4 rounded-2xl bg-[#f8fafc] border-2 border-[#e2e8f0] flex flex-col gap-2.5 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-xs"
                  style={{ backgroundColor: LANGUAGE_FAMILIES[activeFamilyFilter].color }}
                />
                <h3 className="text-sm font-black text-[#1e293b]">
                  {LANGUAGE_FAMILIES[activeFamilyFilter].name}
                </h3>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white border border-[#cbd5e1] text-[#475569]">
                  {familyCountryCounts[activeFamilyFilter] || 0} Countries on Map
                </span>
                <span className="hidden sm:inline text-xs text-[#94a3b8] font-bold">
                  • {LANGUAGE_FAMILIES[activeFamilyFilter].ancestor}
                </span>
              </div>

              <button
                onClick={() => handleFamilyFilterChange('ALL')}
                className="text-xs font-black text-[#1cb0f6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset / Show All Europe
              </button>
            </div>

            <p className="text-xs text-[#64748b] font-medium leading-relaxed">
              {LANGUAGE_FAMILIES[activeFamilyFilter].description}
            </p>

            {/* Quick-jump country chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-extrabold uppercase text-[#94a3b8] tracking-wider mr-1">
                Select Country:
              </span>
              {EUROPE_COUNTRY_PATHS.filter(c => c.family === activeFamilyFilter).map((c) => {
                const isCurrent = selectedLanguage?.countryCode === c.code;
                return (
                  <button
                    key={`fam-chip-${c.id}`}
                    onClick={() => handleCountryClick(c)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isCurrent
                        ? 'bg-[#1cb0f6] text-white border-[#0c7ab1] shadow-xs scale-105'
                        : 'bg-white text-[#334155] border-[#cbd5e1] hover:border-[#1cb0f6] hover:text-[#1cb0f6]'
                    }`}
                  >
                    <CountryFlag code={c.code} size="sm" className="scale-90" />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Map Stage */}
      <div className="relative w-full rounded-3xl bg-[#ffffff] border-2 border-b-4 border-[#e5e5e5] shadow-sm overflow-hidden p-2 sm:p-3 flex flex-col items-center">
        {/* Soft background grid matching Duolingo / screenshot aesthetic */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#d0e4ff_1px,transparent_1px)] [background-size:18px_18px]" />

        {/* View Mode 1: Interactive Vector SVG Map */}
          <div className="relative w-full max-w-3xl aspect-[880/1020] select-none">
            <svg
              viewBox="0 0 880 1020"
              className="w-full h-full filter drop-shadow-sm"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Glow filter for selected/hovered countries */}
                <filter id="duoGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* 3D drop shadow for nodes */}
                <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
                </filter>
              </defs>

              <rect width="880" height="1020" fill="#eaf4fb" rx="16" />
              <path d={EUROPE_BACKGROUND_PATH} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.6" fillRule="evenodd" />

              {/* European Country Polygons */}
              <g className="countries-layer">
                {EUROPE_COUNTRY_PATHS.map((country) => {
                  const isSelected = selectedLanguage?.countryCode === country.code;
                  const isHovered = hoveredCountry?.id === country.id;
                  const fillColor = getCountryFill(country);
                  const strokeColor = getCountryStroke(country);
                  const opacity = getCountryOpacity(country);

                  return (
                    <g
                      key={country.id}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => handleCountryClick(country)}
                      onMouseEnter={() => setHoveredCountry(country)}
                      onMouseLeave={() => setHoveredCountry(null)}
                    >
                      {/* Main Country Polygon */}
                      <path
                        d={country.path}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 1.8 : isHovered ? 1.2 : 0.6}
                        fillRule="evenodd"
                        fillOpacity={opacity}
                        className="transition-all duration-200"
                        style={{
                          filter: isSelected ? 'url(#duoGlow)' : undefined,
                        }}
                      />

                      {/* Sub-paths (Islands, Enclaves, Overseas Territories) */}
                      {country.subPaths && country.subPaths.map((sub, idx) => (
                        <path
                          key={idx}
                          d={sub}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={isSelected ? 3 : 1.5}
                          fillOpacity={opacity}
                        />
                      ))}
                    </g>
                  );
                })}
              </g>

              {/* Constellation Connecting Paths Between Related European Languages */}
              {showConnections && (
                <g className="connections pointer-events-none">
                  {GALAXY_CONNECTIONS.map((conn, idx) => {
                    const sourceLang = EUROPEAN_LANGUAGES.find(l => l.id === conn.fromId);
                    const targetLang = EUROPEAN_LANGUAGES.find(l => l.id === conn.toId);
                    if (!sourceLang || !targetLang) return null;

                    const isFiltered = activeFamilyFilter === 'ALL' || 
                      (sourceLang.family === activeFamilyFilter && targetLang.family === activeFamilyFilter);
                    if (!isFiltered) return null;

                    const sourceCountry = EUROPE_COUNTRY_PATHS.find(c => c.code === sourceLang.countryCode);
                    const targetCountry = EUROPE_COUNTRY_PATHS.find(c => c.code === targetLang.countryCode);
                    if (!sourceCountry || !targetCountry) return null;

                    const famInfo = LANGUAGE_FAMILIES[sourceLang.family];
                    const strokeColor = famInfo ? famInfo.color : '#58cc02';

                    return (
                      <line
                        key={idx}
                        x1={sourceCountry.cx}
                        y1={sourceCountry.cy}
                        x2={targetCountry.cx}
                        y2={targetCountry.cy}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                        strokeDasharray="5 5"
                        strokeOpacity="0.4"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>
              )}

              {/* Country Language Checkpoint Nodes (Duolingo Style 3D Badges) */}
              <g className="checkpoint-nodes">
                {EUROPE_COUNTRY_PATHS.map((country) => {
                  const lang = countryLanguageMap.get(country.code) || 
                    EUROPEAN_LANGUAGES.find(l => l.id === country.languageId);
                  const isSelected = selectedLanguage?.countryCode === country.code;
                  const isHovered = hoveredCountry?.id === country.id;
                  const isExplored = exploredCountries.has(country.code);
                  const isMatchingFamily = activeFamilyFilter === 'ALL' || country.family === activeFamilyFilter;

                  const cx = country.cx;
                  const cy = country.cy;

                  return (
                    <g
                      key={`node-${country.id}`}
                      role="button"
                      tabIndex={isMatchingFamily ? 0 : -1}
                      aria-label={`${country.name}: ${country.capital}`}
                      onKeyDown={(event) => {
                        if (isMatchingFamily && (event.key === 'Enter' || event.key === ' ')) {
                          event.preventDefault();
                          handleCountryClick(country);
                        }
                      }}
                      className={`cursor-pointer transition-all duration-200 ${
                        isMatchingFamily ? 'opacity-100' : 'opacity-15 pointer-events-none'
                      }`}
                      onClick={() => isMatchingFamily && handleCountryClick(country)}
                      onMouseEnter={() => isMatchingFamily && setHoveredCountry(country)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      transform={`translate(${cx}, ${cy})`}
                    >
                      <title>{`${country.name} — ${country.capital}`}</title>
                      {/* Active Selection Pulsing Radar Ring */}
                      {isSelected && (
                        <circle
                          cx="0"
                          cy="0"
                          r="16"
                          fill="none"
                          stroke="#1cb0f6"
                          strokeWidth="3.5"
                          strokeDasharray="6 4"
                          className="animate-spin-slow"
                        />
                      )}

                      {/* 3D Tactile Base Shadow */}
                      <circle
                        cx="0"
                        cy="3"
                        r={isSelected ? 11 : 8}
                        fill="#b0b0b0"
                        opacity="0.6"
                      />

                      {/* Node Button Circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 11 : 8}
                        fill={isSelected ? '#58cc02' : isExplored ? '#ffffff' : '#f7f7f7'}
                        stroke={isSelected ? '#46a302' : isExplored ? '#ffc800' : '#e5e5e5'}
                        strokeWidth={isSelected ? 3 : 2}
                        filter="url(#nodeShadow)"
                      />

                      {/* Country Flag */}
                      <foreignObject
                        x={isSelected ? -9 : -6}
                        y={isSelected ? -7 : -4}
                        width={isSelected ? 18 : 12}
                        height={isSelected ? 14 : 8}
                        className="pointer-events-none flex items-center justify-center"
                      >
                        <CountryFlag code={country.code} size="sm" className="rounded-sm !w-full !h-full" />
                      </foreignObject>

                      {/* Country / Language Name Pill */}
                      {(showLabels || isHovered || isSelected) && (
                        <g transform={`translate(0, ${isSelected ? 24 : 18})`}>
                          <rect
                            x="-32"
                            y="0"
                            width="64"
                            height="17"
                            rx="8.5"
                            fill={isSelected ? '#3c3c3c' : '#ffffff'}
                            stroke={isSelected ? '#3c3c3c' : '#e5e5e5'}
                            strokeWidth="1.5"
                            className="drop-shadow-xs"
                          />
                          <text
                            x="0"
                            y="12"
                            textAnchor="middle"
                            fill={isSelected ? '#ffffff' : '#3c3c3c'}
                            fontSize="9"
                            fontWeight="800"
                            fontFamily="Nunito, sans-serif"
                          >
                            {country.name.length > 10 ? country.code : country.name}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

        <p className="relative text-xs text-slate-500 mt-2 mb-1">
          Map data: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer" className="underline">Natural Earth</a> · Markers at capitals
        </p>
        {/* Floating Country Hover Tooltip */}
        <AnimatePresence>
          {hoveredCountry && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                left: `${Math.min(Math.max((hoveredCountry.cx / 880) * 100, 15), 82)}%`,
                top: `${Math.max((hoveredCountry.cy / 1020) * 100 - 10, 4)}%`,
              }}
              className="absolute z-30 pointer-events-none -translate-x-1/2 p-3 rounded-2xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-xl flex items-center gap-3 min-w-[210px]"
            >
              <CountryFlag code={hoveredCountry.code} size="lg" className="rounded-md shadow-xs" />
              <div>
                <div className="font-black text-sm text-[#3c3c3c] flex items-center gap-1.5">
                  <span>{hoveredCountry.name}</span>
                  <span className="text-[10px] font-bold text-[#afafaf]">({hoveredCountry.code})</span>
                </div>
                <div className="text-xs font-extrabold text-[#58cc02] flex items-center gap-1">
                  <span>{hoveredCountry.languageName || 'National Language'}</span>
                </div>
                <div className="text-[10px] font-bold text-[#777777]">
                  Capital: {hoveredCountry.capital}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Legend Footer Bar */}
        <div className="relative w-full mt-2 pt-2 border-t-2 border-[#e5e5e5] flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[#777777]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black text-[#3c3c3c]">Palette Guide:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdfe0] text-[#ff4b4b] border border-[#ff4b4b]/30 text-[11px] font-black">
              ● Red: Romance
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fff5cc] text-[#b38000] border border-[#ffc800]/30 text-[11px] font-black">
              ● Yellow: Germanic
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ddf4ff] text-[#1899d6] border border-[#1cb0f6]/30 text-[11px] font-black">
              ● Blue: Slavic
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d7ffb8] text-[#3c8c02] border border-[#58cc02]/30 text-[11px] font-black">
              ● Green: Celtic/Hellenic
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f3e5f5] text-[#7b1fa2] border border-[#ba68c8]/30 text-[11px] font-black">
              ● Purple: Uralic
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span>Click any territory to start practice</span>
            <Sparkles className="w-3.5 h-3.5 text-[#ffc800] fill-[#ffc800]" />
          </div>
        </div>
      </div>

      {/* Selected Language Lesson Card (Duolingo Style) */}
      {selectedLanguage && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col gap-6 relative">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#e5e5e5]">
            <div className="flex min-w-0 items-center gap-4">
              <CountryFlag code={selectedLanguage.countryCode} size="xl" className="ring-4 ring-[#e5e5e5] shadow-sm" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#d7ffb8] text-[#3c8c02] border border-[#58cc02]/30">
                    {LANGUAGE_FAMILIES[selectedLanguage.family]?.name}
                  </span>
                  {selectedLanguage.globalRank && (
                    <span className="text-xs font-bold text-[#afafaf]">Global Rank #{selectedLanguage.globalRank}</span>
                  )}
                  <span className="text-xs font-extrabold text-[#1cb0f6] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedLanguage.country} · {selectedLanguage.capital}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#3c3c3c] tracking-tight mt-1">
                  {selectedLanguage.name}{' '}
                  <span className="text-lg font-extrabold text-[#777777]">
                    ({selectedLanguage.nativeName})
                  </span>
                </h3>
              </div>
            </div>

            {/* Total Speakers Badge & Share */}
            <div className="flex items-center gap-3">
              {selectedLanguage.nativeSpeakers && <div className="flex items-center gap-2 bg-[#fff5cc] border-2 border-[#ffc800] px-4 py-2 rounded-2xl">
                <Users className="w-4 h-4 text-[#ff9600]" />
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase text-[#996b00] block">Speakers</span>
                  <span className="text-sm font-black text-[#4d3200]">{selectedLanguage.nativeSpeakers}</span>
                </div>
              </div>}

              <button
                onClick={handleShare}
                className="p-3 rounded-2xl bg-white border-2 border-b-4 border-[#e5e5e5] text-[#777777] hover:border-[#1cb0f6] hover:text-[#1cb0f6] transition-all"
                title="Copy greeting and share"
              >
                {copiedState ? <Check className="w-5 h-5 text-[#58cc02]" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Interactive Speech & European Day of Languages Greeting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EDL Greeting Box */}
            <div className="p-4 rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] flex flex-col justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#1cb0f6] block mb-1">
                  European Day of Languages Greeting:
                </span>
                <p className="text-lg font-black text-[#3c3c3c]">
                  "{selectedLanguage.edlGreeting.native}"
                </p>
                <p className="text-xs font-extrabold text-[#777777] italic mt-0.5">
                  [{selectedLanguage.edlGreeting.phonetic}]
                </p>
                <p className="text-xs font-bold text-[#1cb0f6] mt-1">
                  Translation: "{selectedLanguage.edlGreeting.translation}"
                </p>
              </div>

              <button
                onClick={() => handlePlayAudio(
                  selectedLanguage.edlGreeting.native, 
                  selectedLanguage.samplePhrases[0]?.audioLang || 'en-GB', 
                  99
                )}
                disabled={playingPhraseIndex === 99}
                className="w-full py-3 px-4 duo-btn-blue flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-black"
              >
                <Volume2 className={`w-4 h-4 fill-white ${playingPhraseIndex === 99 ? 'animate-bounce' : ''}`} />
                <span>{playingPhraseIndex === 99 ? 'Speaking...' : 'Listen to Greeting'}</span>
              </button>
            </div>

            {/* Essential Phrases List */}
            <div className="p-4 rounded-2xl bg-[#ffffff] border-2 border-[#e5e5e5] flex flex-col gap-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#1cb0f6] block">
                Common Phrases ({selectedLanguage.samplePhrases.length}):
              </span>
              <p className="text-[10px] text-slate-500">Pronunciation guides are approximate. Audio depends on your device’s available voices.</p>
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                {selectedLanguage.samplePhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#f7f7f7] border border-[#e5e5e5] flex items-center justify-between gap-2 hover:border-[#1cb0f6] transition-all"
                  >
                    <div>
                      <div className="text-xs font-black text-[#3c3c3c]">
                        {phrase.text}{' '}
                        <span className="text-[10px] font-normal text-[#777777] italic">
                          [{phrase.phonetic}]
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-[#58cc02]">
                        "{phrase.translation}"
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlayAudio(phrase.text, phrase.audioLang, idx)}
                      disabled={playingPhraseIndex === idx}
                      className="p-2 rounded-lg bg-[#ddf4ff] border border-[#1cb0f6] text-[#1cb0f6] hover:bg-[#1cb0f6] hover:text-white transition-all shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Linguistic Traits & Historical Origin */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#ff9600] uppercase">
                <BookOpen className="w-4 h-4" />
                <span>Linguistic Features</span>
              </div>
              <ul className="flex flex-col gap-1.5 text-xs text-[#4d4d4d] font-bold">
                {selectedLanguage.linguisticTraits.map((trait, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#58cc02] shrink-0 mt-0.5" />
                    <span>{trait}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#1cb0f6] uppercase">
                <Globe2 className="w-4 h-4" />
                <span>Historical Origin</span>
              </div>
              <p className="text-xs text-[#555555] font-semibold leading-relaxed">
                {selectedLanguage.historicalOrigin}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fff5cc] border-2 border-[#ffc800] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#996b00] uppercase">
                <Sparkles className="w-4 h-4 text-[#ff9600]" />
                <span>Did You Know?</span>
              </div>
              <p className="text-xs text-[#4d3200] font-bold leading-relaxed">
                {selectedLanguage.funFact}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
