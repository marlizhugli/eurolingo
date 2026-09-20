import type { LanguageFamilyId, LanguageNode } from '../types';
import { EUROPE_GEOMETRY } from './europeGeometry';

interface LanguageLesson {
  id: string;
  name: string;
  nativeName: string;
  country: string;
  countryCode: string;
  capital: string;
  family: LanguageFamilyId;
  branch: string;
  alphabet: string;
  audioLang: string;
  // Pronunciation guides are approximate English-friendly hints, not IPA.
  phrases: [string, string, string][];
  greeting: [string, string];
  traits: string[];
  history: string;
  fact: string;
}

const lessons: LanguageLesson[] = [
  {
    id: 'norwegian', name: 'Norwegian', nativeName: 'Norsk', country: 'Norway', countryCode: 'NO', capital: 'Oslo',
    family: 'Germanic', branch: 'North Germanic', alphabet: 'Latin, including æ, ø and å', audioLang: 'nb-NO',
    phrases: [['Hei!', 'hay', 'Hello!'], ['Takk!', 'tahk', 'Thank you!'], ['God morgen!', 'goo MOR-en', 'Good morning!']],
    greeting: ['Gratulerer med den europeiske språkdagen!', 'grah-too-LEH-rer meh den eh-oo-roh-PAY-iske SPRAWK-dah-gen'],
    traits: ['Two written standards: Bokmål and Nynorsk', 'Definite articles commonly attach to nouns', 'Many dialects use contrasting pitch accents'],
    history: 'Norwegian developed from Old Norse. Bokmål grew out of the Danish writing tradition, while Nynorsk was developed from Norwegian dialects in the nineteenth century.',
    fact: 'Norwegian dialects are widely used in everyday public life. These beginner phrases use Bokmål.'
  },
  {
    id: 'icelandic', name: 'Icelandic', nativeName: 'Íslenska', country: 'Iceland', countryCode: 'IS', capital: 'Reykjavík',
    family: 'Germanic', branch: 'North Germanic', alphabet: 'Latin, including þ, ð, æ and ö', audioLang: 'is-IS',
    phrases: [['Halló!', 'hah-LOH', 'Hello!'], ['Takk!', 'tahk', 'Thank you!'], ['Góðan dag!', 'GOH-than dahg', 'Good day!']],
    greeting: ['Gleðilegan evrópskan tungumáladag!', 'GLEH-thih-leh-gan ev-ROHP-skan TOON-goo-mow-la-dahg'],
    traits: ['Four grammatical cases', 'Three grammatical genders', 'Inflected nouns and verbs preserve many Old Norse features'],
    history: 'Icelandic developed from the Old Norse brought to Iceland by medieval settlers. Its written tradition includes the Icelandic sagas.',
    fact: 'The letters þ and ð represent different “th” sounds, as in English “think” and “this”.'
  },
  {
    id: 'danish', name: 'Danish', nativeName: 'Dansk', country: 'Denmark', countryCode: 'DK', capital: 'Copenhagen',
    family: 'Germanic', branch: 'North Germanic', alphabet: 'Latin, including æ, ø and å', audioLang: 'da-DK',
    phrases: [['Hej!', 'hi', 'Hello!'], ['Tak!', 'tahk', 'Thank you!'], ['Godmorgen!', 'goh-MOR-en', 'Good morning!']],
    greeting: ['Glædelig europæisk sprogdag!', 'GLEH-theh-lee eh-oo-roh-PAY-isk SPROH-dah'],
    traits: ['Common and neuter grammatical genders', 'Definite articles commonly attach to nouns', 'Stød is a distinctive laryngeal feature in many varieties'],
    history: 'Danish developed from East Norse, alongside Swedish, and has a long history of contact with Low German.',
    fact: 'Danish, Norwegian and Swedish are closely related, although their pronunciations can differ considerably.'
  },
  {
    id: 'slovak', name: 'Slovak', nativeName: 'Slovenčina', country: 'Slovakia', countryCode: 'SK', capital: 'Bratislava',
    family: 'Slavic', branch: 'West Slavic', alphabet: 'Latin with diacritics', audioLang: 'sk-SK',
    phrases: [['Ahoj!', 'AH-hoy', 'Hello!'], ['Ďakujem!', 'DYA-koo-yem', 'Thank you!'], ['Dobrý deň!', 'DOH-bree dyen', 'Good day!']],
    greeting: ['Šťastný Európsky deň jazykov!', 'SHTYAST-nee eh-OO-rohp-skee dyen YAH-zi-kov'],
    traits: ['Six productive grammatical cases', 'Stress normally falls on the first syllable', 'Long and short vowels distinguish words'],
    history: 'Slovak is a West Slavic language closely related to Czech. Its modern literary standard took shape in the nineteenth century.',
    fact: 'Slovak and Slovenian have similar English names, but belong to different branches of Slavic.'
  },
  {
    id: 'estonian', name: 'Estonian', nativeName: 'Eesti', country: 'Estonia', countryCode: 'EE', capital: 'Tallinn',
    family: 'Finno-Ugric', branch: 'Finnic (Uralic)', alphabet: 'Latin, including õ, ä, ö and ü', audioLang: 'et-EE',
    phrases: [['Tere!', 'TEH-reh', 'Hello!'], ['Aitäh!', 'AI-tah', 'Thank you!'], ['Head aega!', 'heh-ahd AI-gah', 'Goodbye!']],
    greeting: ['Head Euroopa keeltepäeva!', 'heh-ahd EH-oo-roh-pah KEHL-teh-pae-vah'],
    traits: ['Fourteen grammatical cases', 'No grammatical gender', 'Three degrees of sound length'],
    history: 'Estonian is a Finnic language related to Finnish. Its vocabulary also reflects centuries of contact with German and neighboring languages.',
    fact: 'Despite Estonia’s Baltic location, Estonian belongs to the Uralic family, unlike Latvian and Lithuanian.'
  },
  {
    id: 'latvian', name: 'Latvian', nativeName: 'Latviešu', country: 'Latvia', countryCode: 'LV', capital: 'Riga',
    family: 'Baltic', branch: 'East Baltic', alphabet: 'Latin with macrons, carons and consonant diacritics', audioLang: 'lv-LV',
    phrases: [['Sveiki!', 'SVAY-kee', 'Hello!'], ['Paldies!', 'PAHL-dyehs', 'Thank you!'], ['Labrīt!', 'lahb-REET', 'Good morning!']],
    greeting: ['Priecīgu Eiropas Valodu dienu!', 'PRYEH-tsee-goo AY-roh-pahs VAH-loh-doo DYEH-noo'],
    traits: ['Two grammatical genders', 'A rich noun case system', 'Vowel length can distinguish words'],
    history: 'Latvian developed from eastern Baltic varieties and has a long history of contact with neighboring Finnic and Germanic languages.',
    fact: 'Latvian and Lithuanian are the two surviving Baltic languages.'
  },
  {
    id: 'belarusian', name: 'Belarusian', nativeName: 'Беларуская', country: 'Belarus', countryCode: 'BY', capital: 'Minsk',
    family: 'Slavic', branch: 'East Slavic', alphabet: 'Primarily Cyrillic; also a historical Latin tradition', audioLang: 'be-BY',
    phrases: [['Прывітанне!', 'prih-vee-TAHN-nyeh', 'Hello!'], ['Дзякуй!', 'DZYA-kooy', 'Thank you!'], ['Добры дзень!', 'DOH-bri dzyen', 'Good day!']],
    greeting: ['З Еўрапейскім днём моў!', 'z yew-rah-PAY-skim dnyom mow'],
    traits: ['Six grammatical cases', 'The letter ў represents a non-syllabic “u” sound', 'Spelling reflects several unstressed-vowel changes'],
    history: 'Belarusian is an East Slavic language with roots in the Ruthenian written tradition of the Grand Duchy of Lithuania.',
    fact: 'Belarusian and Russian are both used in Belarus; they are distinct East Slavic languages.'
  },
  {
    id: 'slovenian', name: 'Slovenian', nativeName: 'Slovenščina', country: 'Slovenia', countryCode: 'SI', capital: 'Ljubljana',
    family: 'Slavic', branch: 'South Slavic', alphabet: 'Latin, including č, š and ž', audioLang: 'sl-SI',
    phrases: [['Živjo!', 'ZHEEV-yoh', 'Hello!'], ['Hvala!', 'HVAH-lah', 'Thank you!'], ['Dober dan!', 'DOH-ber dahn', 'Good day!']],
    greeting: ['Vesel evropski dan jezikov!', 'veh-SEL ev-ROHP-skee dahn yeh-ZEE-kov'],
    traits: ['Singular, dual and plural grammatical numbers', 'Six grammatical cases', 'Three grammatical genders'],
    history: 'Slovenian developed within the South Slavic dialect continuum. The Freising manuscripts are an early record of its linguistic ancestry.',
    fact: 'Slovenian has special dual forms for talking about exactly two people or things.'
  },
  {
    id: 'bosnian', name: 'Bosnian', nativeName: 'Bosanski', country: 'Bosnia and Herzegovina', countryCode: 'BA', capital: 'Sarajevo',
    family: 'Slavic', branch: 'South Slavic', alphabet: 'Latin and Cyrillic', audioLang: 'bs-BA',
    phrases: [['Zdravo!', 'ZDRAH-voh', 'Hello!'], ['Hvala!', 'HVAH-lah', 'Thank you!'], ['Dobar dan!', 'DOH-bar dahn', 'Good day!']],
    greeting: ['Sretan Evropski dan jezika!', 'SREH-tan ev-ROHP-skee dahn YEH-zee-kah'],
    traits: ['Seven grammatical cases', 'Three grammatical genders', 'Closely related to Croatian, Serbian and Montenegrin'],
    history: 'Bosnian is a South Slavic standard based on Shtokavian dialects. Its vocabulary reflects contact with Ottoman Turkish and other languages.',
    fact: 'Bosnian, Croatian and Serbian are all used in Bosnia and Herzegovina.'
  },
  {
    id: 'serbian', name: 'Serbian', nativeName: 'Српски / Srpski', country: 'Serbia', countryCode: 'RS', capital: 'Belgrade',
    family: 'Slavic', branch: 'South Slavic', alphabet: 'Cyrillic and Latin', audioLang: 'sr-RS',
    phrases: [['Здраво! / Zdravo!', 'ZDRAH-voh', 'Hello!'], ['Хвала! / Hvala!', 'HVAH-lah', 'Thank you!'], ['Добар дан! / Dobar dan!', 'DOH-bar dahn', 'Good day!']],
    greeting: ['Срећан Европски дан језика!', 'SREH-chan ev-ROHP-skee dahn YEH-zee-kah'],
    traits: ['Seven grammatical cases', 'Both Cyrillic and Latin scripts are widely used', 'Perfective and imperfective verb pairs'],
    history: 'Modern literary Serbian draws on Shtokavian dialects. Vuk Karadžić played an important role in nineteenth-century language and spelling reform.',
    fact: 'A Serbian text can often be transliterated between its Cyrillic and Latin alphabets letter by letter.'
  },
  {
    id: 'bulgarian', name: 'Bulgarian', nativeName: 'Български', country: 'Bulgaria', countryCode: 'BG', capital: 'Sofia',
    family: 'Slavic', branch: 'South Slavic', alphabet: 'Cyrillic (30 letters)', audioLang: 'bg-BG',
    phrases: [['Здравей!', 'zdrah-VEY', 'Hello!'], ['Благодаря!', 'blah-goh-dah-RYAH', 'Thank you!'], ['Добър ден!', 'DOH-bur den', 'Good day!']],
    greeting: ['Честит Европейски ден на езиците!', 'ches-TEET ev-roh-PAY-skee den nah eh-ZEE-tsee-teh'],
    traits: ['Definite articles attach to nouns and adjectives', 'Most noun case endings have disappeared', 'A rich verb tense and aspect system'],
    history: 'Bulgarian developed from the Slavic varieties of the eastern Balkans. Medieval Bulgarian literary centers helped spread Slavic literacy.',
    fact: 'Bulgarian and Macedonian share several grammatical features with neighboring Balkan languages.'
  },
  {
    id: 'macedonian', name: 'Macedonian', nativeName: 'Македонски', country: 'North Macedonia', countryCode: 'MK', capital: 'Skopje',
    family: 'Slavic', branch: 'South Slavic', alphabet: 'Cyrillic (31 letters)', audioLang: 'mk-MK',
    phrases: [['Здраво!', 'ZDRAH-voh', 'Hello!'], ['Благодарам!', 'blah-GOH-dah-ram', 'Thank you!'], ['Добар ден!', 'DOH-bar den', 'Good day!']],
    greeting: ['Среќен Европски ден на јазиците!', 'SREH-kyen ev-ROHP-skee den nah YAH-zee-tsee-teh'],
    traits: ['Three sets of definite articles distinguish proximity', 'Most nouns do not inflect for case', 'Standard stress usually falls on the third-last syllable'],
    history: 'Macedonian developed from South Slavic dialects in the Balkans. Its modern standard and alphabet were codified in 1945.',
    fact: 'Macedonian uses the distinctive Cyrillic letters ќ and ѓ.'
  },
  {
    id: 'turkish', name: 'Turkish', nativeName: 'Türkçe', country: 'Türkiye', countryCode: 'TR', capital: 'Ankara',
    family: 'Turkic', branch: 'Oghuz', alphabet: 'Latin (29 letters)', audioLang: 'tr-TR',
    phrases: [['Merhaba!', 'mehr-hah-BAH', 'Hello!'], ['Teşekkür ederim!', 'teh-shek-KOOR eh-deh-REEM', 'Thank you!'], ['Günaydın!', 'gew-nai-DUHN', 'Good morning!']],
    greeting: ['Avrupa Diller Günü kutlu olsun!', 'av-ROO-pah deel-LER gew-NEW koot-LOO ol-SOON'],
    traits: ['Vowel harmony', 'Suffixes build grammatical meaning', 'No grammatical gender'],
    history: 'Turkish is an Oghuz Turkic language that developed in Anatolia. The Latin-based alphabet replaced the Ottoman Arabic-based script in 1928.',
    fact: 'Turkish distinguishes dotted i from dotless ı, in both lowercase and uppercase.'
  },
];

export const ADDITIONAL_LANGUAGES: LanguageNode[] = lessons.map((lesson) => ({
  id: lesson.id, name: lesson.name, nativeName: lesson.nativeName,
  country: lesson.country, countryCode: lesson.countryCode, capital: lesson.capital,
  x: EUROPE_GEOMETRY[lesson.countryCode].cx, y: EUROPE_GEOMETRY[lesson.countryCode].cy,
  family: lesson.family, branch: lesson.branch, alphabet: lesson.alphabet,
  countriesSpoken: [lesson.country], linguisticTraits: lesson.traits,
  samplePhrases: lesson.phrases.map(([text, phonetic, translation]) => ({ text, phonetic, translation, audioLang: lesson.audioLang })),
  edlGreeting: { native: lesson.greeting[0], phonetic: lesson.greeting[1], translation: 'Happy European Day of Languages!' },
  historicalOrigin: lesson.history, funFact: lesson.fact,
}));
