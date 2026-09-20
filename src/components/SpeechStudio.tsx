import { AlbaniaDialectMap } from './AlbaniaDialectMap';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  BookOpen,
  HelpCircle,
  Check,
  X,
  RotateCcw,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

// 36 Shkronjat e Alfabetit Shqip
interface AlphabetLetter {
  letter: string;
  exampleWord: string;
  exampleMeaning: string;
  phoneticTip: string;
}

const ALBANIAN_ALPHABET: AlphabetLetter[] = [
  { letter: 'A', exampleWord: 'Atdhe', exampleMeaning: 'Homeland / Motherland', phoneticTip: 'Zanore e hapur, si "a" te fjala "baba".' },
  { letter: 'B', exampleWord: 'Besa', exampleMeaning: 'Pledge of honor', phoneticTip: 'Bashkëtingëllore e zëshme buzore, si në "bukë".' },
  { letter: 'C', exampleWord: 'Cilësi', exampleMeaning: 'Quality', phoneticTip: 'Shqiptohet si "ts" te "tsunami" ose "pizza".' },
  { letter: 'Ç', exampleWord: 'Çelës', exampleMeaning: 'Key', phoneticTip: 'Shqiptohet si "ch" te "chocolate".' },
  { letter: 'D', exampleWord: 'Dritë', exampleMeaning: 'Light', phoneticTip: 'Bashkëtingëllore e zëshme dhëmbore, si te "diell".' },
  { letter: 'Dh', exampleWord: 'Dhuratë', exampleMeaning: 'Gift / Present', phoneticTip: 'Shqiptohet si "th" angleze e butë te "the" / "weather".' },
  { letter: 'E', exampleWord: 'Era', exampleMeaning: 'Wind / Scent', phoneticTip: 'Zanore e mesme e përparme, si "e" te "det".' },
  { letter: 'Ë', exampleWord: 'Ëndërr', exampleMeaning: 'Dream', phoneticTip: 'Zanore neutrale qendrore (schwa /ə/).' },
  { letter: 'F', exampleWord: 'Fjalë', exampleMeaning: 'Word', phoneticTip: 'Bashkëtingëllore e shurdhët buzore-dhëmbore, si te "flutur".' },
  { letter: 'G', exampleWord: 'Gur', exampleMeaning: 'Stone', phoneticTip: 'Bashkëtingëllore e zëshme qiellzore, si te "gojë".' },
  { letter: 'Gj', exampleWord: 'Gjuhë', exampleMeaning: 'Language / Tongue', phoneticTip: 'Tingull i butë i qiellzës së mesme, i ngjashëm me "d" para "y".' },
  { letter: 'H', exampleWord: 'Hënë', exampleMeaning: 'Moon', phoneticTip: 'Tingull i fytit i ngrohtë dhe i butë, si te "hark".' },
  { letter: 'I', exampleWord: 'Iliri', exampleMeaning: 'Illyria', phoneticTip: 'Zanore e ngushtë e përparme, si te "yll" pa rrumbullakim buzësh.' },
  { letter: 'J', exampleWord: 'Jeta', exampleMeaning: 'Life', phoneticTip: 'Gjysmëzanore, shqiptohet si "y" te "yes" në anglisht.' },
  { letter: 'K', exampleWord: 'Kala', exampleMeaning: 'Castle / Fortress', phoneticTip: 'Bashkëtingëllore e shurdhët, e theksuar si te "komb".' },
  { letter: 'L', exampleWord: 'Lule', exampleMeaning: 'Flower', phoneticTip: 'L e lehtë qiellzore, maja e gjuhës prek dhëmbët e sipërm.' },
  { letter: 'Ll', exampleWord: 'Llambë', exampleMeaning: 'Lamp', phoneticTip: 'L e thellë dhe e errët (velare), si "ball" në anglisht.' },
  { letter: 'M', exampleWord: 'Mollë', exampleMeaning: 'Apple', phoneticTip: 'Bashkëtingëllore hundore buzore, si te "mëmë".' },
  { letter: 'N', exampleWord: 'Nënë', exampleMeaning: 'Mother', phoneticTip: 'Bashkëtingëllore hundore dhëmbore, si te "natë".' },
  { letter: 'Nj', exampleWord: 'Njeri', exampleMeaning: 'Human / Person', phoneticTip: 'Shqiptohet si "gn" te "lasagna" ose "ñ" në spanjisht.' },
  { letter: 'O', exampleWord: 'Oqean', exampleMeaning: 'Ocean', phoneticTip: 'Zanore e prapme e rrumbullakuar, si te "ora".' },
  { letter: 'P', exampleWord: 'Pushtet', exampleMeaning: 'Power / Reign', phoneticTip: 'Bashkëtingëllore e shurdhët buzore, si te "pishë".' },
  { letter: 'Q', exampleWord: 'Qytet', exampleMeaning: 'City', phoneticTip: 'Tingull i veçantë qiellzor i shurdhët, i butë, paraardhës i gj-së.' },
  { letter: 'R', exampleWord: 'Rrugë', exampleMeaning: 'Road / Path (r e butë)', phoneticTip: 'R e thjeshtë me një rrahje të shpejtë të majës së gjuhës.' },
  { letter: 'Rr', exampleWord: 'Rreze', exampleMeaning: 'Ray / Beam', phoneticTip: 'R e shumëfishtë e dridhur (trill), si "rr" në spanjisht.' },
  { letter: 'S', exampleWord: 'Syri', exampleMeaning: 'Eye', phoneticTip: 'Bashkëtingëllore fërkimore e shurdhët, si te "shtëpi".' },
  { letter: 'Sh', exampleWord: 'Shqiponjë', exampleMeaning: 'Eagle', phoneticTip: 'Shqiptohet si "sh" te "ship" në anglisht.' },
  { letter: 'T', exampleWord: 'Toka', exampleMeaning: 'Earth / Soil', phoneticTip: 'Bashkëtingëllore shpërthyese dhëmbore, si te "trëndafil".' },
  { letter: 'Th', exampleWord: 'Thikë', exampleMeaning: 'Knife', phoneticTip: 'Shqiptohet si "th" te "think" në anglisht.' },
  { letter: 'U', exampleWord: 'Ura', exampleMeaning: 'Bridge', phoneticTip: 'Zanore e ngushtë e prapme, si te "ujë".' },
  { letter: 'V', exampleWord: 'Vullnet', exampleMeaning: 'Willpower', phoneticTip: 'Bashkëtingëllore e zëshme buzore-dhëmbore, si te "valë".' },
  { letter: 'X', exampleWord: 'Xixë', exampleMeaning: 'Spark', phoneticTip: 'Bashkëtingëllore e zëshme, tingëllon si "dz" te "adze".' },
  { letter: 'Xh', exampleWord: 'Xham', exampleMeaning: 'Glass / Windowpane', phoneticTip: 'Shqiptohet si "j" te "juice" në anglisht.' },
  { letter: 'Y', exampleWord: 'Yll', exampleMeaning: 'Star', phoneticTip: 'Zanore e ngushtë e përparme e rrumbullakuar, si "u" frëngjisht te "lune".' },
  { letter: 'Z', exampleWord: 'Zemër', exampleMeaning: 'Heart', phoneticTip: 'Bashkëtingëllore e zëshme fërkimore, si te "zë".' },
  { letter: 'Zh', exampleWord: 'Zhavorr', exampleMeaning: 'Gravel', phoneticTip: 'Shqiptohet si "s" te "pleasure" ose "j" në frëngjisht.' },
];

// Dy dialektet: Krahasimi
interface DialectRow {
  tosk: string;
  geg: string;
  meaning: string;
}

const DIALECT_EXAMPLES: DialectRow[] = [
  { tosk: 'dua të shkoj', geg: 'due me shku', meaning: 'I want to go' },
  { tosk: 'kam ardhur', geg: 'kam ardhë', meaning: 'I have arrived' },
  { tosk: 'punoj / punuar', geg: 'punoj / punue', meaning: 'to work / worked' },
  { tosk: 'dritare', geg: 'penxhere / dritare', meaning: 'window' },
  { tosk: 'rërë', geg: 'ranë', meaning: 'sand (rotacizëm: r / n)' },
  { tosk: 'syri im', geg: 'syni jem', meaning: 'my eye' },
];

// Fjalë që s'përkthehen lehtë
interface UntranslatableWord {
  id: string;
  word: string;
  phonetic: string;
  meaningShort: string;
  explanation: string;
}

const UNTRANSLATABLE_WORDS: UntranslatableWord[] = [
  {
    id: 'besa',
    word: 'Besa',
    phonetic: 'bɛ́.sa',
    meaningShort: 'Fjala e nderit, premtimi i patundshëm dhe besnikëria',
    explanation: 'Një kod moral i lashtë shqiptar që garanton mikpritje dhe mbrojtje absolute, madje edhe me çmimin e jetës. Kur jepet besa, fjala nuk shkelet kurrë.'
  },
  {
    id: 'mikpritja',
    word: 'Mikpritja',
    phonetic: 'mik.pɾít.ja',
    meaningShort: 'Shtëpia e shqiptarit i përket Zotit dhe mikut',
    explanation: 'Sipas Kanunit të lashtë, miku trajtohet me nderin më të lartë. Vizitori në vatër ka mbrojtje dhe bujari të pakushtëzuar nga i zoti i shtëpisë.'
  },
  {
    id: 'gjaku',
    word: 'Gjaku',
    phonetic: 'ɟá.ku',
    meaningShort: 'Lidhja e thellë e prejardhjes, nderit dhe rrënjëve',
    explanation: 'Përdoret përtej kuptimit biologjik; nënkupton farefisin, fisnikërinë e karakterit, prejardhjen historike dhe unitetin e pandashëm familjar.'
  },
  {
    id: 'mall',
    word: 'Mall',
    phonetic: 'maɫ',
    meaningShort: 'Një mallëngjim i thellë, dashuri dhe dëshirë e zjarrtë për dikë ose vendlindjen',
    explanation: 'I ngjashëm me "saudade" portugeze ose "sehnsucht" gjermane. Është dhimbja dhe bukuria e dëshirës për të parë një njeri të shtrenjtë apo vendlindjen.'
  },
  {
    id: 'hallall',
    word: 'Hallall',
    phonetic: 'ha.ɫáɫ',
    meaningShort: 'I merituar me djersë të pastër, i bekuar dhe me zemër të hapur',
    explanation: 'Edhe pse me origjinë etimologjike orientale, në shqip nënkupton urimin më të sinqertë për mundin e bërë: "Të qoftë hallall!", i merituar me nder.'
  },
  {
    id: 'ngjyra',
    word: 'Ngjyra',
    phonetic: 'ɲɟý.ɾa',
    meaningShort: 'Toni, nuanca shpirtërore dhe karakteri autentik i një njeriu apo fjale',
    explanation: 'Përveç ngjyrës vizuale, në traditën shqiptare përshkruan gjallërinë, thellësinë e zërit, peshën e fjalës dhe bukurinë e pashoqe të shprehjes.'
  },
];

// Fakte: A e di?
interface FactItem {
  id: number;
  text: string;
  tag: string;
}

const FACTS: FactItem[] = [
  {
    id: 1,
    tag: 'Emri & Identiteti',
    text: 'Shqipëria në shqip quhet "Shqipëri", që zakonisht lidhet me fjalën "shqiponjë".'
  },
  {
    id: 2,
    tag: 'Libri i Parë',
    text: 'Libri më i vjetër i njohur i shtypur në shqip është "Meshari" i Gjon Buzukut (1555), i ruajtur në Bibliotekën e Vatikanit.'
  },
  {
    id: 3,
    tag: 'Dokumenti i Parë',
    text: 'Dokumenti më i vjetër i shkruar në shqip është "Formula e pagëzimit" (1462) nga Kryepeshkopi i Durrësit, Pal Engjëlli.'
  },
  {
    id: 4,
    tag: 'Fjalori & Trashëgimia',
    text: 'Shqipja ka fjalë të huazuara nga latinishtja, greqishtja, sllavishtja dhe turqishtja, por shtylla e saj mbetet e veçantë dhe unike në botë.'
  },
  {
    id: 5,
    tag: 'Degë e Veçantë',
    text: 'Në pemën gjuhësore indo-evropiane, shqipja qëndron si një degë plotësisht e pavarur, pa asnjë "motër" të afërt të mbijetuar.'
  }
];

// Kuiz me 5 pyetje
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Sa shkronja ka alfabeti i gjuhës shqipe?',
    options: ['32 shkronja', '36 shkronja', '38 shkronja', '30 shkronja'],
    correctIndex: 1,
    explanation: 'Alfabeti shqip ka saktësisht 36 shkronja: 7 zanore dhe 29 bashkëtingëllore.'
  },
  {
    question: 'Në cilin qytet dhe vit u miratua alfabeti i sotëm i shqipes?',
    options: ['Në Vlorë, 1912', 'Në Manastir, nëntor 1908', 'Në Tiranë, 1972', 'Në Prizren, 1878'],
    correctIndex: 1,
    explanation: 'Alfabeti me shkronja latine u vendos në Kongresin historik të Manastirit, më 14-22 nëntor 1908.'
  },
  {
    question: 'Cili lumë shërben tradicionalisht si vijë ndarëse midis dy dialekteve (Gegërisht dhe Toskërisht)?',
    options: ['Lumi Drin', 'Lumi Shkumbin', 'Lumi Vjosa', 'Lumi Seman'],
    correctIndex: 1,
    explanation: 'Lumi Shkumbin në Shqipërinë e mesme ndan dialektin gegë në veri nga dialekti toskë në jug.'
  },
  {
    question: 'Cili është libri më i vjetër i njohur i shtypur në gjuhën shqipe?',
    options: ['"Meshari" i Gjon Buzukut (1555)', '"Çeta e Profetëve" e Pjetër Bogdanit (1685)', '"Historia e Skënderbeut" (1504)', '"Fjalori Latinisht-Shqip" i Frang Bardhit (1635)'],
    correctIndex: 0,
    explanation: '"Meshari" i klerikut Gjon Buzuku u shtyp në vitin 1555 dhe përfaqëson veprën më të hershme të njohur të shtypur në shqip.'
  },
  {
    question: 'Sa zanore ka sistemi fonetik i gjuhës shqipe standarde?',
    options: ['5 zanore', '6 zanore', '7 zanore (A, E, Ë, I, O, U, Y)', '8 zanore'],
    correctIndex: 2,
    explanation: 'Shqipja ka 7 zanore të qarta: A, E, Ë, I, O, U dhe Y.'
  }
];

export const SpeechStudio: React.FC = () => {
  // State për shkronjën e zgjedhur në alfabet
  const [selectedLetter, setSelectedLetter] = useState<AlphabetLetter>(ALBANIAN_ALPHABET[3]); // Default 'Ç'
  // State për kartat e fjalëve që kthehen
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  // State për kuizin
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [activeFactIndex, setActiveFactIndex] = useState<number>(0);
  // State për fushën e fjalës së preferuar në fund
  const [playingVoice, setPlayingVoice] = useState<boolean>(false);

  // Kthimi i kartës së fjalëve
  const toggleCardFlip = (id: string) => {
    soundEffects.playTap();
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Shqiptimi i shkronjës ose fjalës me sintezë zëri
  const handlePronounce = (text: string) => {
    soundEffects.playNodePing(520);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlayingVoice(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'sq-AL';
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingVoice(false);
      utterance.onerror = () => setPlayingVoice(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Trajtimi i përgjigjeve të kuizit
  const handleSelectQuizOption = (optIndex: number) => {
    soundEffects.playTap();
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optIndex;
    setSelectedAnswers(updated);
  };

  const handleNextQuizQuestion = () => {
    soundEffects.playTap();
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuizSubmitted(true);
      soundEffects.playCorrect();
    }
  };

  const handleRestartQuiz = () => {
    soundEffects.playTap();
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setIsQuizSubmitted(false);
  };

  // Llogaritja e rezultatit
  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();

  return (
    <div className="w-full flex flex-col gap-8 pb-10 text-[#2b2b2b]">
      {/* ============================================================ */}
      {/* KREU / SLOGANI */}
      {/* ============================================================ */}
      <section
        aria-label="Kreu i Gjuhës Shqipe"
        className="p-6 sm:p-8 rounded-3xl bg-[#fdfbf7] border-2 border-b-4 border-[#ff4b4b]/30 shadow-sm relative overflow-hidden flex flex-col gap-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Shqiponja dykrenare ikonike */}
            <div className="mt-0.5 w-14 h-14 rounded-2xl bg-[#ff4b4b] flex items-center justify-center text-white shadow-md shrink-0 border-2 border-[#ea2b2b]">
              <span className="text-2xl font-black">🇦🇱</span>
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#ff4b4b] block">
                Trashëgimia Gjuhësore Evropiane
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mt-0.5">
                Gjuha Shqipe
              </h1>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-[#ff4b4b]/10 border border-[#ff4b4b]/20 text-[#ff4b4b] text-xs font-black self-start md:self-auto flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ff4b4b]" />
            <span>Fokus i Veçantë në Evropë</span>
          </div>
        </div>

        {/* Slogani zyrtar me stil të thellë */}
        <div className="p-4 rounded-2xl bg-white border border-[#eadfd1] shadow-xs">
          <p className="text-base sm:text-lg font-black text-[#ff4b4b] italic tracking-tight">
            "Një gjuhë, një traditë e lashtë, një zë i veçantë në Evropë."
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 1. HYRJE */}
      {/* ============================================================ */}
      <section
        aria-label="Hyrje në Gjuhën Shqipe"
        className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col gap-4"
      >
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#f0f0f0]">
          <span className="w-8 h-8 rounded-xl bg-[#ff4b4b] text-white flex items-center justify-center font-black text-sm">
            1
          </span>
          <h2 className="text-xl font-black text-[#111111] tracking-tight">
            Hyrje në Gjuhën Shqipe
          </h2>
        </div>

        <p className="text-base sm:text-lg font-bold text-[#444444] leading-relaxed">
          Shqipja është një degë më vete e familjes indo-evropiane, pa asnjë gjuhë tjetër të gjallë si "motër" të ngushtë. Flitet nga rreth 7-8 milionë njerëz në Shqipëri, Kosovë, Maqedoninë e Veriut, Mal të Zi, si dhe nga komunitete në Itali (arbëreshët), Greqi dhe në diasporë.
        </p>

        {/* Statistika të shpejta me ngjyrë të kuqe */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-[#fff5f5] border border-[#ffcccc] text-center">
            <div className="text-xl font-black text-[#ff4b4b]">7-8 Milionë</div>
            <div className="text-xs font-bold text-[#666666] mt-0.5">Folës në Botë</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#fff5f5] border border-[#ffcccc] text-center">
            <div className="text-xl font-black text-[#ff4b4b]">Degë e Pavarur</div>
            <div className="text-xs font-bold text-[#666666] mt-0.5">Indo-Evropiane</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#fff5f5] border border-[#ffcccc] text-center">
            <div className="text-xl font-black text-[#ff4b4b]">36 Shkronja</div>
            <div className="text-xs font-bold text-[#666666] mt-0.5">Alfabeti Latin</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#fff5f5] border border-[#ffcccc] text-center">
            <div className="text-xl font-black text-[#ff4b4b]">1908</div>
            <div className="text-xs font-bold text-[#666666] mt-0.5">Kongresi i Manastirit</div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. ALFABETI ME 36 SHKRONJA */}
      {/* ============================================================ */}
      <section
        aria-label="Alfabeti Shqip"
        className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col gap-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#ff4b4b] text-white flex items-center justify-center font-black text-sm">
              2
            </span>
            <div>
              <h2 className="text-xl font-black text-[#111111] tracking-tight">
                Alfabeti me 36 Shkronja
              </h2>
              <span className="text-xs font-bold text-[#777777]">
                Kliko mbi çdo shkronjë për të mësuar shqiptimin dhe shembullin
              </span>
            </div>
          </div>


        </div>

        {/* Rreshti i fakteve historike */}
        <div className="p-4 rounded-2xl bg-[#fff8eb] border-2 border-[#ffc800] text-xs font-bold text-[#704800] flex items-center gap-2.5">
          <Info className="w-5 h-5 text-[#ff9600] shrink-0" />
          <span>
            Alfabeti u miratua në Kongresin e Manastirit, në nëntor 1908. Ka 7 zanore dhe 29 bashkëtingëllore.
          </span>
        </div>

        {/* Rrjeti me të 36 shkronjat */}
        <div
          role="grid"
          aria-label="Tastierë interaktive me 36 shkronjat shqipe"
          className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2.5"
        >
          {ALBANIAN_ALPHABET.map((item) => {
            const isSelected = selectedLetter.letter === item.letter;
            let btnStyle = 'bg-white border-[#e5e5e5] text-[#333333] hover:border-[#ff4b4b]';

            if (isSelected) {
              btnStyle = 'bg-[#ff4b4b] border-[#ea2b2b] text-white shadow-md scale-105';
            }

            return (
              <button
                key={item.letter}
                onClick={() => {
                  soundEffects.playTap();
                  setSelectedLetter(item);
                }}
                className={`h-13 rounded-2xl border-2 border-b-4 flex flex-col items-center justify-center transition-all cursor-pointer select-none font-black ${btnStyle}`}
                title={`Shkronja ${item.letter} - Shembull: ${item.exampleWord}`}
                aria-pressed={isSelected}
              >
                <span className="text-lg leading-none">{item.letter}</span>
              </button>
            );
          })}
        </div>

        {/* Karta e detajuar kur klikohet një shkronjë */}
        <div className="p-5 rounded-3xl bg-[#fdfbf7] border-2 border-[#eadfd1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#ff4b4b] text-white flex items-center justify-center font-black text-3xl shadow-sm shrink-0">
              {selectedLetter.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#ff4b4b]">
                  Shkronja {selectedLetter.letter}
                </span>

              </div>
              <h3 className="text-xl font-black text-[#111111] mt-0.5">
                Shembull: <span className="text-[#ff4b4b]">"{selectedLetter.exampleWord}"</span> ({selectedLetter.exampleMeaning})
              </h3>
              <p className="text-xs font-bold text-[#555555] mt-1">
                {selectedLetter.phoneticTip}
              </p>
            </div>
          </div>


        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. DY DIALEKTET: GEGËRISHT DHE TOSKËRISHT */}
      {/* ============================================================ */}
      <section
        aria-label="Dialektet Shqipe"
        className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col gap-6"
      >
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#f0f0f0]">
          <span className="w-8 h-8 rounded-xl bg-[#ff4b4b] text-white flex items-center justify-center font-black text-sm">
            3
          </span>
          <div>
            <h2 className="text-xl font-black text-[#111111] tracking-tight">
              Dy Dialektet: Gegërisht dhe Toskërisht
            </h2>
            <span className="text-xs font-bold text-[#777777]">
              Lumi Shkumbin si vija historike dhe gjeografike ndarëse
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Harta gjeografike me ndarje dialektore të përafërt */}
          <div className="lg:col-span-5 p-5 rounded-3xl bg-[#fdfbf7] border-2 border-[#eadfd1] flex flex-col items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#777777] mb-2">
              Harta e Ndarjes Dialektore
            </h4>

            <div className="relative w-full max-w-[320px] h-[400px] flex items-center justify-center">
              <AlbaniaDialectMap />
            </div>

            <div className="w-full mt-3 text-center text-xs font-bold text-[#666666]">
              Veriu (Gegë) • Jugu (Toskë)
              <p className="mt-1 text-[10px] font-medium">Ndarja dialektore pranë Shkumbinit është e përafërt.</p>
            </div>
          </div>

          {/* Tabela krahasuese me 5-6 shembuj */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="overflow-x-auto rounded-2xl border-2 border-[#e5e5e5]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#111111] text-white">
                    <th className="p-3 sm:p-3.5 font-black">Toskërisht (Jug)</th>
                    <th className="p-3 sm:p-3.5 font-black text-[#ff8090]">Gegërisht (Veri)</th>
                    <th className="p-3 sm:p-3.5 font-black text-[#d0d0d0]">Kuptimi në Anglisht</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeee] bg-white font-bold">
                  {DIALECT_EXAMPLES.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#fbfbfb] transition-colors">
                      <td className="p-3 text-[#111111] font-black">"{row.tosk}"</td>
                      <td className="p-3 text-[#ff4b4b] font-black">"{row.geg}"</td>
                      <td className="p-3 text-[#666666] italic">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Shënimi rreth standardit 1972 */}
            <div className="p-4 rounded-2xl bg-[#fff5f5] border border-[#ffcccc] text-xs font-bold text-[#800010] flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-[#ff4b4b] shrink-0" />
              <span>
                Shqipja standarde bazohet kryesisht në toskërishten dhe u vendos në Kongresin e Drejtshkrimit, 1972.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FJALË QË S'PËRKTHEHEN LEHTË (6 KARTA) */}
      {/* ============================================================ */}
      <section
        aria-label="Fjalë që nuk përkthehen lehtë"
        className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col gap-4"
      >
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#f0f0f0]">
          <span className="w-8 h-8 rounded-xl bg-[#ff4b4b] text-white flex items-center justify-center font-black text-sm">
            4
          </span>
          <div>
            <h2 className="text-xl font-black text-[#111111] tracking-tight">
              Fjalë që s'përkthehen lehtë
            </h2>
            <span className="text-xs font-bold text-[#777777]">
              Kliko mbi kartë për ta kthyer dhe lexuar kuptimin e thellë shpirtëror
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {UNTRANSLATABLE_WORDS.map((w) => {
            const isFlipped = !!flippedCards[w.id];
            return (
              <div
                key={w.id}
                onClick={() => toggleCardFlip(w.id)}
                className="min-h-56 cursor-pointer select-none perspective"
                tabIndex={0}
                role="button"
                aria-label={`Karta ${w.word}, kliko për ta kthyer`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCardFlip(w.id);
                  }
                }}
              >
                <div className={`relative grid w-full min-h-56 h-full rounded-3xl transition-transform duration-500 transform-style-preserve-3d shadow-xs ${isFlipped ? 'rotate-y-180' : ''
                  }`}>
                  {/* Faqja e Parë: Fjala Shqipe */}
                  <div className="[grid-area:1/1] w-full h-full rounded-3xl bg-[#fdfbf7] border-2 border-b-4 border-[#eadfd1] hover:border-[#ff4b4b] p-6 flex flex-col justify-between backface-hidden transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#ff4b4b] bg-[#fff0f2] px-2.5 py-1 rounded-full border border-[#ff4b4b]/20">
                        Kthe Kartën
                      </span>
                      <Sparkles className="w-4 h-4 text-[#ffc800]" />
                    </div>

                    <div className="text-center my-auto">
                      <h3 className="text-3xl font-black text-[#111111] tracking-tight">
                        {w.word}
                      </h3>
                      <span className="text-xs font-bold text-[#777777] mt-1 block">
                        [{w.phonetic}]
                      </span>
                    </div>

                    <div className="text-center text-xs font-bold text-[#ff4b4b] flex items-center justify-center gap-1">
                      <span>Kliko për kuptimin</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Faqja e Prapme: Kuptimi dhe shpjegimi */}
                  <div className="[grid-area:1/1] w-full h-full rounded-3xl bg-[#111111] border-2 border-b-4 border-[#ff4b4b] text-white p-5 flex flex-col justify-between rotate-y-180 backface-hidden shadow-md">
                    <div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                        <span className="text-xs font-black text-[#ff667a] uppercase tracking-wider">
                          {w.word}
                        </span>
                        <span className="text-[10px] text-white/60 font-bold">Kuptimi</span>
                      </div>
                      <h4 className="text-xs font-black text-white mt-2 leading-snug">
                        {w.meaningShort}
                      </h4>
                    </div>

                    <p className="text-[11px] font-medium text-[#cccccc] leading-relaxed my-3">
                      {w.explanation}
                    </p>

                    <div className="text-[10px] font-bold text-white/50 text-right">
                      Kliko sërish për ta mbyllur
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. A E DI? (FAKTE NË KARTA QË DALIN NJË NGA NJË) */}
      {/* ============================================================ */}
      <section
        aria-label="Fakte: A e di?"
        className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col gap-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#ff4b4b] text-white flex items-center justify-center font-black text-sm">
              5
            </span>
            <div>
              <h2 className="text-xl font-black text-[#111111] tracking-tight">
                A e di?
              </h2>
              <span className="text-xs font-bold text-[#777777]">
                Fakte historike dhe gjuhësore të verifikueshme
              </span>
            </div>
          </div>

          {/* Numëruesi dhe navigimi */}
          <div className="flex items-center gap-2">
            {FACTS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  soundEffects.playTap();
                  setActiveFactIndex(i);
                }}
                className={`w-7 h-7 rounded-xl font-black text-xs transition-all cursor-pointer ${activeFactIndex === i
                  ? 'bg-[#ff4b4b] text-white shadow-xs'
                  : 'bg-[#f0f0f0] text-[#777777] hover:text-[#111111]'
                  }`}
                aria-label={`Fakti ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Karta e faktit aktiv me animacion të lehtë */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFactIndex}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            className="p-6 sm:p-7 rounded-3xl bg-[#fdfbf7] border-2 border-b-4 border-[#ff4b4b]/20 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-[#ff4b4b] bg-[#fff0f2] px-3 py-1 rounded-full border border-[#ff4b4b]/20">
                {FACTS[activeFactIndex].tag}
              </span>
              <span className="text-xs font-bold text-[#777777]">
                Fakti {activeFactIndex + 1} nga {FACTS.length}
              </span>
            </div>

            <p className="text-lg sm:text-xl font-black text-[#111111] leading-snug">
              "{FACTS[activeFactIndex].text}"
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  soundEffects.playTap();
                  setActiveFactIndex((prev) => (prev > 0 ? prev - 1 : FACTS.length - 1));
                }}
                className="px-4 py-2 rounded-xl bg-white border border-[#e5e5e5] text-xs font-black text-[#444444] hover:border-[#ff4b4b] cursor-pointer"
              >
                Më Parë
              </button>
              <button
                onClick={() => {
                  soundEffects.playTap();
                  setActiveFactIndex((prev) => (prev < FACTS.length - 1 ? prev + 1 : 0));
                }}
                className="px-4 py-2 rounded-xl bg-[#ff4b4b] text-white text-xs font-black hover:bg-[#a60d26] cursor-pointer shadow-xs"
              >
                Fakti Tjetër →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ============================================================ */}
      {/* 6. KUIZ I SHPEJTË (5 PYETJE) */}
      {/* ============================================================ */}
      <section
        aria-label="Kuiz i Shpejtë"
        className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col gap-6"
      >
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-[#f0f0f0]">
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#ff4b4b] text-white flex items-center justify-center font-black text-sm">
              6
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-black text-[#111111] tracking-tight">
                Kuiz i Shpejtë
              </h2>
              <span className="text-xs font-bold text-[#777777]">
                5 pyetje mbi historinë, alfabetin dhe dialektet
              </span>
            </div>
          </div>

          <span className="shrink-0 whitespace-nowrap text-xs font-black text-[#ff4b4b] bg-[#fff0f2] px-3 py-1.5 rounded-full border border-[#ff4b4b]/20">
            {isQuizSubmitted ? 'Rezultati Përfundimtar' : `Pyetja ${currentQuestionIndex + 1} / ${QUIZ_QUESTIONS.length}`}
          </span>
        </div>

        {!isQuizSubmitted ? (
          <div className="flex flex-col gap-5">
            {/* Pyetja */}
            <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#eadfd1]">
              <h3 className="text-base sm:text-lg font-black text-[#111111]">
                {QUIZ_QUESTIONS[currentQuestionIndex].question}
              </h3>
            </div>

            {/* Alternativat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectQuizOption(optIdx)}
                    className={`p-4 rounded-2xl border-2 border-b-4 text-left transition-all cursor-pointer font-black text-sm flex items-center justify-between gap-3 ${isSelected
                      ? 'bg-[#fff0f2] border-[#ff4b4b] border-b-[#ea2b2b] text-[#ff4b4b] shadow-sm'
                      : 'bg-white border-[#e5e5e5] border-b-[#cecece] text-[#333333] hover:border-[#ff4b4b]'
                      }`}
                  >
                    <span>{opt}</span>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#ff4b4b] bg-[#ff4b4b] text-white' : 'border-[#cccccc]'
                      }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Butoni për të vazhduar */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuizQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                className="px-6 py-3 rounded-2xl bg-[#ff4b4b] hover:bg-[#a60d26] disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-transform active:scale-95"
              >
                <span>{currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? 'Përfundo Kuizin' : 'Pyetja e Radhës'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Rezultati përfundimtar */
          <div className="p-6 rounded-3xl bg-[#fdfbf7] border-2 border-b-4 border-[#ff4b4b] flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#ff4b4b] text-white flex items-center justify-center shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#111111]">
                Rezultati: {score} nga {QUIZ_QUESTIONS.length} Pikë!
              </h3>
              <p className="text-sm font-bold text-[#555555] mt-1 max-w-md">
                {score === 5 && 'Shkëlqyeshëm! Njohuri të përsosura mbi historinë dhe pasurinë e gjuhës shqipe.'}
                {score >= 3 && score < 5 && 'Shumë mirë! Ke kuptuar thelbin e Kongresit të Manastirit dhe strukturës së shqipes.'}
                {score < 3 && 'Punë e mirë! Shqipja ka shumë thellësi historike. Provo përsëri për të arritur rezultatin maksimal.'}
              </p>
            </div>

            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 rounded-2xl bg-[#111111] hover:bg-[#333333] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Provo Përsëri</span>
            </button>
          </div>
        )}
      </section>

    </div>
  );
};
