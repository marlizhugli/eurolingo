import { copyText } from '../utils/clipboard';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  X, 
  Minus, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Copy, 
  Check, 
  Globe2,
  MessageCircle,
  HelpCircle,
  Languages
} from 'lucide-react';
import { DuoOwl } from './DuoOwl';
import { soundEffects } from '../utils/soundEffects';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface BirdChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const SUGGESTIONS = [
  'Why is Sept 26 celebrated?',
  'Say "Hello" in 6 European languages',
  'Teach me a funny French idiom',
  'Can we practice Italian conversation?',
  'What are false friends in Spanish & English?',
  'Which European language has no relatives?'
];

export const BirdChatbot: React.FC<BirdChatbotProps> = ({
  isOpen,
  onToggle,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: "Hello! 🦬 Welcome! I am **Lingo**, your friendly European bison mascot celebrating the **European Day of Languages** (September 26).\n\nYou can ask me anything about European languages, practice conversations in German, French, Spanish, Italian, or Ukrainian, or ask for quirky cultural idioms. What would you like to explore?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [birdMood, setBirdMood] = useState<'happy' | 'cheering' | 'thinking' | 'wink'>('happy');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Clean markdown stars
      const clean = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.95;
      utterance.pitch = 0.95; // Friendly warm pitch for bison mascot
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    if (await copyText(text)) {
      setCopiedId(id);
      soundEffects.playCorrect();
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputValue).trim();
    if (!content || isLoading) return;

    soundEffects.playTap();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: content,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);
    setBirdMood('thinking');

    try {
      // Send conversation history to server
      const payload = {
        messages: newHistory.map((m) => ({
          role: m.role,
          text: m.text,
        })),
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.headers.get('content-type')?.includes('application/json')) {
        throw new Error('The chat server is unavailable. Run npm run dev and open http://localhost:3000.');
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Chat request failed (${res.status}). Please try again.`);
      }
      const botReply = data.reply || "I didn't get a response. Could you ask again?";

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: botReply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      soundEffects.playCorrect();
      setBirdMood('cheering');
      setTimeout(() => setBirdMood('happy'), 3000);

      if (autoSpeak) {
        speakText(botReply);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      soundEffects.playWrong();
      setBirdMood('happy');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'model',
          text: err instanceof Error && err.message !== 'Failed to fetch'
            ? err.message
            : 'I could not reach the chat server. Please check your connection and try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    soundEffects.playTap();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: "Chat history refreshed. What European language topic or simple conversation shall we start?",
        timestamp: new Date(),
      },
    ]);
  };

  const renderFormattedText = (raw: string) => {
    // Basic inline markdown: bold, list items, linebreaks
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      // Bold replacer
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      const cleanLine = isBullet ? line.trim().substring(2) : line;
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-extrabold text-[#1cb0f6]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1">
            <span className="text-[#58cc02] font-black leading-none mt-1.5">•</span>
            <span className="flex-1">{formattedLine}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="mb-1 leading-relaxed last:mb-0">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button on the Right Corner */}
      <div className="fixed bottom-5 right-5 z-40 flex items-end justify-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative"
            >
              {/* Little speech hint prompt */}
              <div className="absolute -top-12 right-0 bg-white border-2 border-b-4 border-[#e5e5e5] px-3 py-1.5 rounded-2xl shadow-md whitespace-nowrap pointer-events-none hidden sm:flex items-center gap-1.5 animate-bounce">
                <Sparkles className="w-3.5 h-3.5 text-[#ffc800] fill-[#ffc800]" />
                <span className="text-xs font-black text-[#4b4b4b]">
                  Ask Lingo!
                </span>
                <span className="w-2 h-2 bg-white border-r-2 border-b-2 border-[#e5e5e5] transform rotate-45 absolute -bottom-1.5 right-6" />
              </div>

              <button
                id="floating-bird-chatbot-trigger"
                onClick={() => {
                  soundEffects.playTap();
                  onToggle();
                }}
                className="group relative flex h-14 w-14 items-center justify-center gap-0 p-0 sm:h-auto sm:w-auto sm:gap-3 sm:px-4 sm:py-3 rounded-full bg-[#1cb0f6] hover:bg-[#159de0] border-2 border-b-4 border-[#1899d6] text-white shadow-xl hover:shadow-2xl transition-all duration-200 active:border-b-2 active:translate-y-0.5 cursor-pointer"
                title="Chat with Lingo the Bison"
                aria-label="Open Lingo chat"
              >
                <div className="relative flex items-center justify-center">
                  <DuoOwl size="sm" mood="wink" />
                </div>
                <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-[#ffc800] border-2 border-white rounded-full animate-pulse sm:top-1 sm:right-1" />
                <div className="hidden sm:flex items-center text-left leading-none pr-1">
                  <span className="text-sm font-black tracking-tight">
                    Lingo
                  </span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Window on the Right Corner */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[420px] max-h-[85dvh] h-[620px] bg-white rounded-3xl border-2 border-b-4 border-[#e5e5e5] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Top Tactical Header */}
            <div className="bg-[#1cb0f6] border-b-4 border-[#1899d6] px-4 py-3 text-white flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <DuoOwl size="sm" mood={birdMood} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#ffc800] border-2 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight leading-none">
                    Lingo
                  </h3>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1">
                {/* Voice Read Aloud Toggle */}
                <button
                  onClick={() => {
                    soundEffects.playTap();
                    setAutoSpeak(!autoSpeak);
                  }}
                  className={`p-1.5 rounded-xl border transition-all ${
                    autoSpeak
                      ? 'bg-white text-[#1cb0f6] border-white'
                      : 'bg-[#1899d6]/70 text-white/80 border-[#0c7ab1] hover:bg-[#1899d6]'
                  }`}
                  title={autoSpeak ? 'Disable auto voice playback' : 'Enable auto voice playback'}
                >
                  {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Reset History */}
                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-xl bg-[#1899d6]/70 text-white/80 border border-[#0c7ab1] hover:bg-[#1899d6] transition-all"
                  title="Clear chat history"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Minimize / Close */}
                <button
                  onClick={() => {
                    soundEffects.playTap();
                    onClose();
                  }}
                  className="p-1.5 rounded-xl bg-[#1899d6]/70 text-white/80 border border-[#0c7ab1] hover:bg-[#ff4b4b] hover:border-[#ea2b2b] hover:text-white transition-all ml-1"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body - Message History */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f7f7f7] select-text">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="shrink-0 mb-1">
                        <DuoOwl size="sm" mood={birdMood} />
                      </div>
                    )}

                    <div
                      className={`min-w-0 break-words relative max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                        isUser
                          ? 'bg-[#1cb0f6] border-2 border-b-4 border-[#1899d6] text-white rounded-br-sm shadow-sm'
                          : 'bg-white border-2 border-b-4 border-[#e5e5e5] text-[#3c3c3c] rounded-bl-sm shadow-sm'
                      }`}
                    >
                      {/* Message Content */}
                      <div className="leading-relaxed">
                        {renderFormattedText(msg.text)}
                      </div>

                      {/* Bot Action: Copy */}
                      {!isUser && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#f0f0f0] text-[11px] text-[#777777]">
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="flex items-center gap-1 hover:text-[#1cb0f6] transition-colors cursor-pointer ml-auto"
                            title="Copy reply text"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#1cb0f6]" />
                                <span className="text-[#1cb0f6]">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Thinking / Typing Indicator */}
              {isLoading && (
                <div className="flex items-end gap-2.5 justify-start">
                  <div className="shrink-0 mb-1">
                    <DuoOwl size="sm" mood="thinking" />
                  </div>
                  <div className="bg-white border-2 border-b-4 border-[#e5e5e5] px-4 py-3 rounded-2xl rounded-bl-sm text-xs text-[#777777] font-bold flex items-center gap-2 shadow-sm">
                    <span className="text-[#1cb0f6] font-black">Lingo is thinking</span>
                    <span className="flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-[#1cb0f6] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#1cb0f6] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#1cb0f6] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="bg-white border-t border-[#e5e5e5] px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-black uppercase text-[#afafaf] shrink-0 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-[#ffc800] fill-[#ffc800]" />
                Tips:
              </span>
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sug)}
                  disabled={isLoading}
                  className="shrink-0 text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-[#f0f0f0] hover:bg-[#e5e5e5] text-[#4b4b4b] border border-[#dcdcdc] transition-all hover:border-[#1cb0f6] hover:text-[#1cb0f6] whitespace-nowrap active:scale-95 disabled:opacity-50"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t-2 border-[#e5e5e5]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative min-w-0 flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask questions or chat in any language..."
                    disabled={isLoading}
                    className="w-full bg-[#f7f7f7] border-2 border-[#e5e5e5] rounded-2xl py-2.5 pl-3.5 pr-10 text-xs sm:text-sm font-bold text-[#3c3c3c] placeholder:text-[#afafaf] focus:outline-none focus:border-[#1cb0f6] focus:bg-white transition-all disabled:opacity-60"
                  />
                  {inputValue.trim() && (
                    <button
                      type="button"
                      onClick={() => setInputValue('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#afafaf] hover:text-[#4b4b4b]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl border-2 border-b-4 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    inputValue.trim() && !isLoading
                      ? 'bg-[#1cb0f6] border-[#1899d6] text-white hover:brightness-105 active:border-b-2 active:translate-y-0.5'
                      : 'bg-[#e5e5e5] border-[#cecece] text-[#afafaf] cursor-not-allowed'
                  }`}
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
