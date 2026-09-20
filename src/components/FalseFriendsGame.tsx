import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Timer, 
  Flame, 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  BookOpen,
  ArrowRight,
  Heart,
  X
} from 'lucide-react';
import { FalseFriendQuestion } from '../types';
import { FALSE_FRIENDS_DECK } from '../data/falseFriends';
import { CountryFlag } from './CountryFlag';
import { DuoOwl } from './DuoOwl';
import { soundEffects } from '../utils/soundEffects';

const QUESTION_DURATION = 20; // 20s per question for friendly Duolingo pace

// Helper to shuffle the 4 options of a question randomly so the correct answer appears in a random position (0, 1, 2, or 3)
const shuffleQuestionOptions = (q: FalseFriendQuestion): FalseFriendQuestion => {
  const correctText = q.options[q.correctOptionIndex];
  const shuffledOptions = [...q.options];

  // Fisher-Yates shuffle
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }

  const newCorrectIndex = shuffledOptions.indexOf(correctText);
  return {
    ...q,
    options: shuffledOptions,
    correctOptionIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0,
  };
};

export const FalseFriendsGame: React.FC = () => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'FEEDBACK' | 'GAMEOVER'>('IDLE');
  const [deck, setDeck] = useState<FalseFriendQuestion[]>(() => {
    return [...FALSE_FRIENDS_DECK]
      .sort(() => 0.5 - Math.random())
      .map(shuffleQuestionOptions);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_DURATION);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(5);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [answersHistory, setAnswersHistory] = useState<{
    question: FalseFriendQuestion;
    userOption: number;
    isCorrect: boolean;
    pointsGained: number;
  }[]>([]);

  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem('edl_false_friends_highscore'));
      return Number.isFinite(saved) && saved > 0 ? saved : 0;
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
    return 0;
  });

  const answerLocked = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start new game
  const startGame = () => {
    const shuffled = [...FALSE_FRIENDS_DECK]
      .sort(() => 0.5 - Math.random())
      .map(shuffleQuestionOptions);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setHearts(5);
    setAnswersHistory([]);
    setSelectedOption(null);
    setTimeLeft(QUESTION_DURATION);
    answerLocked.current = false;
    setGameState('PLAYING');
    soundEffects.playNodePing(587);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentIndex]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    if (timeLeft === 0) handleAnswer(-1);
    else if (timeLeft <= 4) soundEffects.playTick();
  }, [timeLeft, gameState]);

  // Answer handler
  const handleAnswer = (optionIndex: number) => {
    if (gameState !== 'PLAYING' || answerLocked.current) return;
    answerLocked.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = deck[currentIndex];
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQ.correctOptionIndex;

    let points = 0;
    if (isCorrect) {
      soundEffects.playCorrect();
      const streakBonusMultiplier = 1 + streak * 0.25;
      points = Math.round(100 * streakBonusMultiplier);
      const newScore = score + points;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        try {
          localStorage.setItem('edl_false_friends_highscore', String(newScore));
        } catch {
          // Keep the score usable for this session when storage is blocked.
        }
      }
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
    } else {
      soundEffects.playGlitch();
      setStreak(0);
      setHearts((h) => Math.max(0, h - 1));
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        question: currentQ,
        userOption: optionIndex,
        isCorrect,
        pointsGained: points,
      },
    ]);

    setGameState('FEEDBACK');
  };

  // Next question or game over
  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (hearts <= 0) {
      // Out of hearts
      setGameState('GAMEOVER');
      soundEffects.playVictory();
      return;
    }

    if (currentIndex + 1 < deck.length && currentIndex + 1 < 8) {
      setCurrentIndex((c) => c + 1);
      setTimeLeft(QUESTION_DURATION);
      answerLocked.current = false;
    setGameState('PLAYING');
      soundEffects.playNodePing(660);
    } else {
      setGameState('GAMEOVER');
      soundEffects.playVictory();
    }
  };

  const currentQ = deck[currentIndex];
  const progressPercent = Math.round(((currentIndex) / 8) * 100);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Bar with Gamified Stats */}
      <div className="p-4 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <DuoOwl size="md" mood={gameState === 'FEEDBACK' && selectedOption === currentQ?.correctOptionIndex ? 'cheering' : 'happy'} className="shrink-0" />
          <div>
            <h2 className="text-lg font-black text-[#3c3c3c] tracking-tight flex flex-wrap items-center gap-2">
              "False Friends" European Challenge
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#d7ffb8] text-[#3c8c02] border border-[#58cc02]/30">
                Quiz Unit
              </span>
            </h2>
            <p className="text-xs font-bold text-[#777777]">
              Spot the deceptive European words that look like English words, but mean something completely different!
            </p>
          </div>
        </div>

        {/* Global Controls & High Score Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#fff5cc] border-2 border-[#ffc800] text-xs font-black">
            <Trophy className="w-4 h-4 text-[#ff9600]" />
            <span className="text-[#996b00]">High Score:</span>
            <span className="text-[#4d3200]">{highScore}</span>
          </div>

          <button
            onClick={() => {
              const muted = soundEffects.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2 rounded-2xl bg-white border-2 border-b-4 border-[#e5e5e5] text-[#777777] hover:border-[#1cb0f6] transition-colors"
            title="Audio Mute/Unmute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#ff4b4b]" /> : <Volume2 className="w-4 h-4 text-[#58cc02]" />}
          </button>
        </div>
      </div>

      {/* Game State Flow */}
      {gameState === 'IDLE' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col items-center text-center gap-6 max-w-2xl mx-auto my-2">
          <DuoOwl size="xl" mood="cheering" className="drop-shadow-md" />

          <div className="space-y-1.5">
            <h3 className="text-3xl font-black text-[#3c3c3c] tracking-tight">
              CAN YOU DODGE THE FALSE FRIENDS?
            </h3>
            <p className="text-sm font-bold text-[#777777] leading-relaxed max-w-lg mx-auto">
              In European languages, <strong className="text-[#3c8c02]">false friends</strong> (faux amis) look almost identical to English words, but have shockingly different definitions!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left">
            <div className="p-3.5 rounded-2xl bg-[#d7ffb8] border-2 border-[#58cc02] text-xs font-bold">
              <span className="text-[#3c8c02] font-black block mb-0.5">TRAP 01</span>
              Spanish: <span className="font-black text-[#3c3c3c]">"Embarazada"</span> means pregnant, NOT embarrassed!
            </div>
            <div className="p-3.5 rounded-2xl bg-[#fff5cc] border-2 border-[#ffc800] text-xs font-bold">
              <span className="text-[#b38000] font-black block mb-0.5">TRAP 02</span>
              German: <span className="font-black text-[#3c3c3c]">"Gift"</span> means poison, NOT a birthday present!
            </div>
            <div className="p-3.5 rounded-2xl bg-[#ddf4ff] border-2 border-[#1cb0f6] text-xs font-bold">
              <span className="text-[#1899d6] font-black block mb-0.5">TRAP 03</span>
              French: <span className="font-black text-[#3c3c3c]">"Actuellement"</span> means currently, NOT actually!
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full sm:w-auto px-10 py-4 duo-btn-blue text-base uppercase tracking-wider shadow-md"
          >
            Start Quiz Round
          </button>
        </div>
      )}

      {(gameState === 'PLAYING' || gameState === 'FEEDBACK') && currentQ && (
        <div className="max-w-2xl w-full mx-auto flex flex-col gap-4">
          {/* Duolingo Progress Bar + Hearts Header */}
          <div className="flex items-center gap-4 px-2">
            <button
              onClick={() => setGameState('IDLE')}
              className="text-[#afafaf] hover:text-[#3c3c3c] p-1 transition-colors"
              title="Quit Lesson"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>

            {/* Blue Progress Track Bar */}
            <div className="flex-1 h-4 bg-[#e5e5e5] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-[#1cb0f6] rounded-full transition-all duration-300 relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-0.5 right-1 w-2 h-1 bg-white/40 rounded-full" />
              </div>
            </div>

            {/* Hearts Count (Duolingo Style) */}
            <div className="flex items-center gap-1">
              <Heart className="w-5 h-5 text-[#ff4b4b] fill-[#ff4b4b]" />
              <span className="font-black text-[#ff4b4b] text-base">{hearts}</span>
            </div>
          </div>

          {/* Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col gap-6">
            {/* Mascot with Question Prompt */}
            <div className="flex items-start gap-3">
              <DuoOwl size="md" mood={gameState === 'FEEDBACK' ? (selectedOption === currentQ.correctOptionIndex ? 'cheering' : 'wink') : 'happy'} />
              <div className="p-3.5 bg-[#f7f7f7] border-2 border-[#e5e5e5] rounded-2xl duo-speech-bubble flex-1">
                <span className="text-xs font-black uppercase text-[#1cb0f6] block mb-0.5">
                  Select the correct meaning:
                </span>
                <p className="text-sm font-extrabold text-[#3c3c3c]">
                  In <strong className="text-[#1cb0f6]">{currentQ.language}</strong>, what does this word mean?
                </p>
              </div>
            </div>

            {/* Word Centerpiece */}
            <div className="flex flex-col items-center text-center gap-1.5 py-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f7f7f7] border border-[#e5e5e5] text-xs font-black">
                <CountryFlag code={currentQ.countryCode} size="sm" />
                <span className="text-[#3c3c3c]">{currentQ.language}</span>
                <span className="text-[#afafaf]">•</span>
                <span className="text-[#777777]">{currentQ.partOfSpeech}</span>
              </div>

              <h3 className="text-4xl sm:text-5xl font-black text-[#3c3c3c] tracking-tight mt-1">
                "{currentQ.foreignWord}"
              </h3>

              <div className="text-xs font-bold text-[#afafaf] bg-[#f7f7f7] px-3 py-1 rounded-xl border border-[#e5e5e5]">
                Warning: deceptively looks like <strong className="text-[#ff9600]">"{currentQ.falseEnglishLookalike}"</strong>!
              </div>
            </div>

            {/* Multiple Choice Cards (Duolingo Style 3D tactile buttons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctOptionIndex;
                const isFeedback = gameState === 'FEEDBACK';

                let cardStyle = 'bg-white border-2 border-b-4 border-[#e5e5e5] text-[#3c3c3c] hover:border-[#1cb0f6] hover:bg-[#ddf4ff]/40';

                if (isFeedback) {
                  if (isCorrect) {
                    cardStyle = 'bg-[#d7ffb8] border-2 border-b-4 border-[#58cc02] text-[#1e5000] font-black';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'bg-[#ffdfe0] border-2 border-b-4 border-[#ff4b4b] text-[#ea2b2b] font-black';
                  } else {
                    cardStyle = 'bg-white border-2 border-b-4 border-[#e5e5e5] text-[#afafaf] opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isFeedback}
                    className={`p-4 rounded-2xl text-left text-sm font-black transition-all flex items-center justify-between gap-3 ${cardStyle}`}
                  >
                    <span>{option}</span>
                    {isFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-[#58cc02] shrink-0" />
                    )}
                    {isFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-[#ff4b4b] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duolingo Classic Bottom Action Drawer */}
          <AnimatePresence>
            {gameState === 'FEEDBACK' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className={`p-5 rounded-3xl border-2 border-b-4 flex flex-col gap-3 shadow-sm ${
                  selectedOption === currentQ.correctOptionIndex
                    ? 'bg-[#d7ffb8] border-[#58cc02]'
                    : 'bg-[#ffdfe0] border-[#ff4b4b]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {selectedOption === currentQ.correctOptionIndex ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-[#58cc02]" />
                          <h4 className="text-lg font-black text-[#1e5000]">Nicely done! 🎉</h4>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-[#ff4b4b]" />
                          <h4 className="text-lg font-black text-[#ea2b2b]">You got caught in the trap!</h4>
                        </>
                      )}
                    </div>

                    <p className="text-xs font-extrabold mt-1 text-[#3c3c3c]">
                      <strong>Actual Meaning:</strong> {currentQ.actualMeaning}
                    </p>
                    <p className="text-xs font-bold text-[#777777] italic mt-0.5">
                      "{currentQ.sentenceTranslation}"
                    </p>
                  </div>

                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-white border border-[#e5e5e5] text-[#3c3c3c]">
                    {selectedOption === currentQ.correctOptionIndex ? '+100 XP' : '0 XP'}
                  </span>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className={`w-full py-3.5 uppercase tracking-wider text-sm ${
                    selectedOption === currentQ.correctOptionIndex ? 'duo-btn-green' : 'duo-btn-red'
                  }`}
                >
                  Continue
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Game Over Summary Report */}
      {gameState === 'GAMEOVER' && (
        <div className="p-8 rounded-3xl bg-white border-2 border-b-4 border-[#e5e5e5] shadow-sm flex flex-col items-center text-center gap-6 max-w-2xl mx-auto my-2">
          <DuoOwl size="xl" mood="cheering" className="drop-shadow-md" />

          <div className="space-y-1">
            <h3 className="text-3xl font-black text-[#3c3c3c] tracking-tight">
              LESSON COMPLETE! 🎉
            </h3>
            <p className="text-xs font-bold text-[#777777]">
              European Day of Languages False Friends Drill Finished
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <div className="p-4 rounded-2xl bg-[#fff5cc] border-2 border-[#ffc800] text-center">
              <span className="text-[10px] font-black uppercase text-[#996b00]">Total XP</span>
              <div className="text-2xl font-black text-[#4d3200] mt-0.5">{score}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#d7ffb8] border-2 border-[#58cc02] text-center">
              <span className="text-[10px] font-black uppercase text-[#3c8c02]">Accuracy</span>
              <div className="text-2xl font-black text-[#1e5000] mt-0.5">
                {answersHistory.length > 0 ? Math.round((answersHistory.filter(a => a.isCorrect).length / answersHistory.length) * 100) : 0}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#d7ffb8] border-2 border-[#58cc02] text-center">
              <span className="text-[10px] font-black uppercase text-[#3c8c02]">Top Streak</span>
              <div className="text-2xl font-black text-[#ea2b2b] mt-0.5">{highestStreak}x</div>
            </div>
          </div>

          {/* Etymology Recap List */}
          <div className="w-full space-y-2 text-left max-h-48 overflow-y-auto pr-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#777777]">
              Word Traps Review:
            </span>
            {answersHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#f7f7f7] border border-[#e5e5e5] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <CountryFlag code={item.question.countryCode} size="sm" />
                  <span className="font-black text-[#3c3c3c]">{item.question.foreignWord}</span>
                  <span className="text-[#afafaf]">→</span>
                  <span className="text-[#58cc02] font-black">{item.question.actualMeaning}</span>
                </div>
                {item.isCorrect ? (
                  <span className="text-[#58cc02] font-black text-xs">+100 XP</span>
                ) : (
                  <span className="text-[#ff4b4b] font-black text-xs">Trapped</span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 duo-btn-blue text-sm uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Another Round
          </button>
        </div>
      )}
    </div>
  );
};
