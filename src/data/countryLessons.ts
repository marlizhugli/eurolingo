import type { LanguageNode } from '../types';
import { EUROPEAN_LANGUAGES } from './languages';
import { EUROPE_COUNTRY_PATHS } from './europeMapPaths';

// Shared languages retain the selected country's identity and local context.
const COUNTRY_CONTEXT: Record<string, Partial<LanguageNode>> = {
  AT: {
    name: 'German (Austria)',
    nativeName: 'Deutsch (Österreich)',
    linguisticTraits: ['Austrian Standard German is a variety of Standard German', 'Regional vocabulary differs from usage in Germany', 'Bavarian and Alemannic dialects are also spoken'],
    samplePhrases: [
      { text: 'Grüß Gott!', phonetic: 'grooss got', translation: 'Hello! (traditional greeting)', audioLang: 'de-AT' },
      { text: 'Servus!', phonetic: 'ZEHR-voos', translation: 'Hi! / Bye! (informal)', audioLang: 'de-AT' },
      { text: 'Danke!', phonetic: 'DAHN-keh', translation: 'Thank you!', audioLang: 'de-AT' },
    ],
    historicalOrigin: 'Austria shares the German language’s history, while developing its own standard usage and regional dialect traditions.',
    funFact: 'In Austria, an apricot is commonly called a Marille; Aprikose is usual in much of Germany.',
  },
  CH: {
    name: 'German (Switzerland)',
    nativeName: 'Deutsch (Schweiz)',
    linguisticTraits: ['German, French, Italian and Romansh are Switzerland’s national languages', 'Swiss German refers to a group of spoken Alemannic dialects', 'Swiss Standard German is used in much formal writing'],
    samplePhrases: [
      { text: 'Grüezi!', phonetic: 'GREW-eh-tsee', translation: 'Hello! (Swiss German)', audioLang: 'de-CH' },
      { text: 'Danke!', phonetic: 'DAHN-keh', translation: 'Thank you!', audioLang: 'de-CH' },
      { text: 'Guten Tag!', phonetic: 'GOO-ten tahk', translation: 'Good day! (Standard German)', audioLang: 'de-CH' },
    ],
    historicalOrigin: 'Switzerland brings together Germanic and Romance language regions. This introductory lesson focuses on German in Switzerland.',
    funFact: 'Swiss Standard German uses ss where other Standard German varieties may write ß.',
  },
  BE: {
    name: 'French (Belgium)', nativeName: 'Français (Belgique)',
    linguisticTraits: ['Dutch, French and German are Belgium’s official languages', 'Belgian French has distinctive vocabulary and number words', 'This lesson introduces French; Belgium is multilingual'],
    historicalOrigin: 'Belgium lies at a meeting point of Germanic and Romance language regions. Its French-speaking communities share the wider history of French.',
    funFact: 'Belgian French commonly uses septante for seventy and nonante for ninety.',
  },
  MD: {
    name: 'Romanian (Moldova)', nativeName: 'Română',
    historicalOrigin: 'Romanian in Moldova belongs to the Eastern Romance tradition. It shares its standard written language with Romanian in Romania.',
    funFact: 'Romanian is a Romance language, related to Italian, French, Spanish and Portuguese.',
  },
  SJ: {
    historicalOrigin: 'Svalbard is a Norwegian Arctic archipelago. This introductory lesson presents Norwegian in the context of its administrative center, Longyearbyen.',
    funFact: 'Svalbard is a territory of Norway, not a separate country. Its settlements include multilingual communities.',
  },
};

export const COUNTRY_LESSONS = new Map<string, LanguageNode>(
  EUROPE_COUNTRY_PATHS.map((country) => {
    const language = EUROPEAN_LANGUAGES.find((lesson) => lesson.id === country.languageId);
    if (!language) throw new Error(`Missing language lesson for ${country.name}: ${country.languageId}`);
    const context = COUNTRY_CONTEXT[country.code];
    return [country.code, {
      ...language,
      ...context,
      country: country.name,
      countryCode: country.code,
      capital: country.capital,
      x: country.cx,
      y: country.cy,
      samplePhrases: context?.samplePhrases || language.samplePhrases.map((phrase) => ({
        ...phrase,
        audioLang: country.code === 'BE' ? 'fr-BE' : phrase.audioLang,
      })),
    }];
  }),
);
