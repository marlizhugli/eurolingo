export type LanguageFamilyId = 
  | 'Romance' 
  | 'Germanic' 
  | 'Slavic' 
  | 'Hellenic' 
  | 'Celtic' 
  | 'Finno-Ugric' 
  | 'Basque' 
  | 'Baltic' 
  | 'Albanian'
  | 'Turkic';

export interface LanguageFamilyInfo {
  id: LanguageFamilyId;
  name: string;
  color: string;
  accentHex: string;
  badgeBg: string;
  description: string;
  ancestor: string;
}

export interface SamplePhrase {
  text: string;
  phonetic: string;
  translation: string;
  audioLang: string;
}

export interface LanguageNode {
  id: string;
  name: string;
  nativeName: string;
  country: string;
  countryCode: string;
  capital: string;
  x: number; // SVG coordinate 0-1000
  y: number; // SVG coordinate 0-800
  family: LanguageFamilyId;
  branch: string;
  nativeSpeakers?: string;
  globalRank?: number;
  countriesSpoken: string[];
  alphabet: string;
  linguisticTraits: string[];
  samplePhrases: SamplePhrase[];
  edlGreeting: {
    native: string;
    translation: string;
    phonetic: string;
  };
  historicalOrigin: string;
  funFact: string;
}

export interface IdiomToken {
  word: string;
  pos: string; // Part of speech (e.g., Noun, Verb, Prep)
  gloss: string;
}

export interface IdiomItem {
  id: string;
  language: string;
  languageCode: string;
  countryCode: string;
  idiomNative: string;
  phonetic: string;
  literalEnglish: string;
  contextualMeaning: string;
  culturalOrigin: string;
  visualTheme: string;
  tokens: IdiomToken[];
  confidenceScore: number;
  audioLang: string;
}

export interface TongueTwister {
  id: string;
  language: string;
  countryCode: string;
  title: string;
  text: string;
  phonetic: string;
  literalTranslation: string;
  difficulty: 'Easy' | 'Medium' | 'Cyber-Expert';
  langCode: string;
  soundHint: string;
}

export interface FalseFriendQuestion {
  id: string;
  foreignWord: string;
  language: string;
  countryCode: string;
  partOfSpeech: string;
  falseEnglishLookalike: string;
  actualMeaning: string;
  options: string[];
  correctOptionIndex: number;
  sampleSentence: string;
  sentenceTranslation: string;
  etymologyHint: string;
  humorousTakeaway: string;
}
