import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Loader2, Copy, Check, History, X, ArrowLeftRight, Download, Lightbulb, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SupremeLens from './SupremeLens';
import {
  playTapSound,
  playOpenLensSound,
  playResultBamSound
} from './utils/sounds';

// Character Components

const LeftWing = () => (
  <motion.svg width="90" height="90" viewBox="0 0 100 100" className="overflow-visible"
    animate={{ rotate: [0, -10, 0], y: [0, -4, 0] }}
    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
    <path d="M 90 50 C 40 10, 10 30, 20 60 C 25 75, 45 80, 60 70 C 45 85, 65 90, 80 80 C 75 90, 85 92, 90 90 C 85 75, 88 60, 90 50 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 80 52 C 50 30, 30 45, 40 65" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
    <path d="M 82 62 C 60 50, 48 62, 55 72" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
    <path d="M 85 72 C 70 65, 62 72, 70 80" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
  </motion.svg>
);

const RightWing = () => (
  <motion.svg width="90" height="90" viewBox="0 0 100 100" className="overflow-visible"
    animate={{ rotate: [0, 10, 0], y: [0, -4, 0] }}
    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
    <path d="M 10 50 C 60 10, 90 30, 80 60 C 75 75, 55 80, 40 70 C 55 85, 35 90, 20 80 C 25 90, 15 92, 10 90 C 15 75, 12 60, 10 50 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 20 52 C 50 30, 70 45, 60 65" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
    <path d="M 18 62 C 40 50, 52 62, 45 72" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
    <path d="M 15 72 C 30 65, 38 72, 30 80" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
  </motion.svg>
);

const Sparkle = () => (
  <motion.svg width="60" height="60" viewBox="0 0 100 100"
    animate={{ rotate: [0, 90, 180], scale: [0.8, 1.1, 0.8] }}
    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
    <path d="M 50 10 C 50 40, 60 50, 90 50 C 60 50, 50 60, 50 90 C 50 60, 40 50, 10 50 C 40 50, 50 40, 50 10 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="5" strokeLinejoin="round" />
  </motion.svg>
);

const UKFlag = ({ className = "" }: { className?: string }) => (
  <svg width="32" height="24" viewBox="0 0 28 20" className={`inline-block rounded-[3px] shadow-[2px_2px_0px_0px_#1A1A1A] bg-[#1e3a8a] ${className}`}>
    <path d="M-2 -2L30 22M-2 22L30 -2" stroke="white" strokeWidth="4" />
    <path d="M-2 -2L30 22M-2 22L30 -2" stroke="#ef4444" strokeWidth="2" />
    <path d="M14 0V20M0 10H28" stroke="white" strokeWidth="6" />
    <path d="M14 0V20M0 10H28" stroke="#ef4444" strokeWidth="4" />
    <rect width="28" height="20" fill="none" stroke="#1A1A1A" strokeWidth="4" />
  </svg>
);

const KRFlag = ({ className = "" }: { className?: string }) => (
  <svg width="32" height="24" viewBox="0 0 28 20" className={`inline-block rounded-[3px] shadow-[2px_2px_0px_0px_#1A1A1A] bg-white ${className}`}>
    <g stroke="#1A1A1A" strokeWidth="1">
      <g transform="translate(6, 5) rotate(32)">
        <path d="M -2 -2.5 L -2 2.5 M 0 -2.5 L 0 2.5 M 2 -2.5 L 2 2.5" />
      </g>
      <g transform="translate(22, 5) rotate(148)">
        <path d="M -2 -2.5 L -2 -0.5 M -2 0.5 L -2 2.5 M 0 -2.5 L 0 2.5 M 2 -2.5 L 2 -0.5 M 2 0.5 L 2 2.5" />
      </g>
      <g transform="translate(6, 15) rotate(-32)">
        <path d="M -2 -2.5 L -2 2.5 M 0 -2.5 L 0 -0.5 M 0 0.5 L 0 2.5 M 2 -2.5 L 2 2.5" />
      </g>
      <g transform="translate(22, 15) rotate(-148)">
        <path d="M -2 -2.5 L -2 -0.5 M -2 0.5 L -2 2.5 M 0 -2.5 L 0 -0.5 M 0 0.5 L 0 2.5 M 2 -2.5 L 2 -0.5 M 2 0.5 L 2 2.5" />
      </g>
    </g>
    <g transform="translate(14, 10) rotate(32)">
      <circle cx="0" cy="0" r="4.5" fill="#ef4444" />
      <path d="M -4.5 0 A 2.25 2.25 0 0 0 0 0 A 2.25 2.25 0 0 1 4.5 0 A 4.5 4.5 0 0 1 -4.5 0 Z" fill="#3b82f6" />
    </g>
    <rect width="28" height="20" fill="none" stroke="#1A1A1A" strokeWidth="4" />
  </svg>
);

export default function App() {
  const [isLensOpen, setIsLensOpen] = useState(false);
  const [lensHasCapture, setLensHasCapture] = useState(false);

  const [englishWord, setEnglishWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [conversationContext, setConversationContext] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [funFact, setFunFact] = useState<string | null>(null);
  const [isLoadingFunFact, setIsLoadingFunFact] = useState(false);

  const [example, setExample] = useState<{ koreanSentence?: string; englishTranslation?: string } | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [exampleAudioUrl, setExampleAudioUrl] = useState<string | null>(null);

  const [isCopied, setIsCopied] = useState(false);
  const [isExampleCopied, setIsExampleCopied] = useState(false);

  const [history, setHistory] = useState<{ english: string, korean: string, direction?: 'en-ko' | 'ko-en' }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [direction, setDirection] = useState<'en-ko' | 'ko-en'>('en-ko');
  const [inputMode, setInputMode] = useState<'word' | 'conversation'>('word');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [exampleCooldown, setExampleCooldown] = useState<number | null>(null);

  const translateButtonRef = useRef<HTMLDivElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const exampleSectionRef = useRef<HTMLDivElement>(null);


  const englishSuggestions = ['hello', 'how are you?', 'thank you', 'good morning', 'I love you'];
  const koreanSuggestions = ['안녕하세요', '감사합니다', '대박', '사랑해', '안녕'];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (exampleCooldown === null || exampleCooldown <= 0) return;
    const timer = setTimeout(() => setExampleCooldown(prev => (prev ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [exampleCooldown]);

  const currentPlaceholder = direction === 'en-ko'
    ? englishSuggestions[placeholderIndex % englishSuggestions.length]
    : koreanSuggestions[placeholderIndex % koreanSuggestions.length];

  const handleSwap = () => {
    setDirection(prev => prev === 'en-ko' ? 'ko-en' : 'en-ko');
    setEnglishWord('');
    setTranslation('');
    setConversationContext(null);
    setExample(null);
    setFunFact(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);
  };

  const handleInputModeChange = (mode: 'word' | 'conversation') => {
    if (mode === inputMode) return;
    setInputMode(mode);
    setEnglishWord('');
    setTranslation('');
    setConversationContext(null);
    setExample(null);
    setFunFact(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);
  };

  const handleCopy = async () => {
    if (!translation) return;
    try {
      await navigator.clipboard.writeText(translation);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleCopyExample = async () => {
    if (!example?.koreanSentence) return;
    try {
      await navigator.clipboard.writeText(example.koreanSentence);
      setIsExampleCopied(true);
      setTimeout(() => setIsExampleCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const prefetchAudio = async (text: string, setter: React.Dispatch<React.SetStateAction<string | null>>, lang: string = 'ko-KR', voice: string = 'female') => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang, voice })
      });
      if (res.ok) {
        const blob = await res.blob();
        setter(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error('Audio prefetch failed', err);
    }
  };

  const fetchFunFact = async (english: string, korean: string) => {
    setIsLoadingFunFact(true);
    setFunFact(null);
    try {
      const res = await fetch('/api/funfact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ englishWord: english, koreanWord: korean })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.fact) setFunFact(data.fact);
      }
    } catch (err) {
      console.error('Fun fact fetch failed', err);
    } finally {
      setIsLoadingFunFact(false);
    }
  };

  const handleTranslate = async () => {
    if (!englishWord.trim()) return;

    setIsLoading(true);
    setTranslation('');
    setExample(null);
    setFunFact(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: englishWord, direction, inputMode }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.translation) {
        setTranslation(data.translation);
        setTimeout(() => {
          resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
        playResultBamSound();
        setConversationContext(data.context || null);
        setHistory(prev => {
          const newEntry = { english: englishWord, korean: data.translation, direction };
          const filtered = prev.filter(item => item.english.toLowerCase() !== englishWord.toLowerCase());
          return [newEntry, ...filtered].slice(0, 10);
        });

        // en-ko: Korean female voice. ko-en: English male voice.
        prefetchAudio(data.translation, setAudioUrl, direction === 'en-ko' ? 'ko-KR' : 'en-US', direction === 'en-ko' ? 'female' : 'male');
        fetchFunFact(englishWord, data.translation);
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      setErrorMsg(error.message || 'Translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (url: string | null) => {
    if (url) {
      const audio = new Audio(url);
      audio.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = direction === 'en-ko' ? 'en-US' : 'ko-KR';
    recognition.interimResults = false;

    recognition.onstart = () => { setIsRecording(true); };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setEnglishWord(transcript);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };
    recognition.onend = () => { setIsRecording(false); };

    recognition.start();
  };

  const handleShowExample = async () => {
    if (!translation || exampleCooldown) return;
    setIsLoadingExample(true);

    try {
      const response = await fetch('/api/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          englishWord: direction === 'en-ko' ? englishWord : translation,
          koreanWord: direction === 'ko-en' ? englishWord : translation,
          direction
        }),
      });

      if (response.status === 429) {
        const data = await response.json();
        setExampleCooldown(data.retryAfter ?? 60);
        return;
      }

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      const targetSentence = data.targetSentence || data.koreanSentence;

      if (targetSentence) {
        setExample({
          koreanSentence: targetSentence,
          englishTranslation: data.sourceTranslation || data.englishTranslation
        });
        setTimeout(() => {
          exampleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
        // Example sentence: ko-en = English male, en-ko = Korean female.
        prefetchAudio(targetSentence, setExampleAudioUrl, direction === 'ko-en' ? 'en-US' : 'ko-KR', direction === 'ko-en' ? 'male' : 'female');
      }
    } catch (error) {
      console.error('Example generation error:', error);
    } finally {
      setIsLoadingExample(false);
    }
  };

  return (
    <>
      <h1 className="sr-only">Hangul Translate — Elite Korean & Filipino Image Translator</h1>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Permanent+Marker&family=Knewave&family=Neucha&display=swap');
          .font-bold { font-family: 'Permanent Marker', cursive; }
          .font-bold { font-family: 'Gloria Hallelujah', cursive; }
          .font-bold { font-family: 'Knewave', cursive; }
          .font-text text-xl { font-family: 'Neucha', cursive; }
        `}
      </style>

      <main
        className="min-h-[100dvh] font-sans p-6 pb-[calc(4.5rem+env(safe-area-inset-bottom))] flex flex-col items-center justify-start overflow-x-hidden relative text-[#1A1A1A] selection:bg-[#7D0A3C] selection:text-white"
      >
        {/* ============================================================================
            TWILIGHT BOLASAEK CANVAS (HARDWARE ACCELERATED & OPTIMIZED FOR MOBILE/TABLET)
            ============================================================================ */}
        {/* LAYER 1: Deep Twilight Indigo-Purple Base */}
        <div
          className="fixed w-[100vw] h-[120vh] top-[-10vh] left-0 -z-30 pointer-events-none bg-[#12324F]"
          style={{ transform: 'translateZ(0)' }} /* ◄ Forces hardware GPU acceleration */
        />

        {/* LAYER 2: Opaque Seigaiha Waves (GPU Layer Cached) */}
        <div
          className="fixed w-[100vw] h-[120vh] top-[-10vh] left-0 -z-20 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='50' viewBox='0 0 100 50'%3E%3Crect width='100' height='50' fill='%2312324F'/%3E%3Cdefs%3E%3Cg id='w'%3E%3Ccircle cx='0' cy='0' r='48' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='40' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='32' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='24' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='16' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='8' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3C/g%3E%3C/defs%3E%3Cuse href='%23w' x='-50' y='-25'/%3E%3Cuse href='%23w' x='50' y='-25'/%3E%3Cuse href='%23w' x='150' y='-25'/%3E%3Cuse href='%23w' x='0' y='0'/%3E%3Cuse href='%23w' x='100' y='0'/%3E%3Cuse href='%23w' x='-50' y='25'/%3E%3Cuse href='%23w' x='50' y='25'/%3E%3Cuse href='%23w' x='150' y='25'/%3E%3Cuse href='%23w' x='0' y='50'/%3E%3Cuse href='%23w' x='100' y='50'/%3E%3Cuse href='%23w' x='-50' y='75'/%3E%3Cuse href='%23w' x='50' y='75'/%3E%3Cuse href='%23w' x='150' y='75'/%3E%3C/svg%3E")`,
            backgroundSize: '76px 38px',
            backgroundRepeat: 'repeat',
            transform: 'translateZ(0)', /* ◄ Keeps layer composited in GPU memory */
            willChange: 'transform',
            contentVisibility: 'auto'   /* ◄ Browser containment rule to skip hidden paints */
          }}
        />

        {/* LAYER 3: Static Film Grain Overlay (Optimized Texture Map) */}
        <div
          className="fixed w-[100vw] h-[120vh] top-[-10vh] left-0 -z-10 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            transform: 'translateZ(0)'
          }}
        />

        <div className="w-full max-w-4xl flex justify-between items-center z-40 mb-2 relative">
          <button
            onClick={() => { playOpenLensSound(); setIsLensOpen(true); }}
            className="flex items-center justify-center w-12 h-12 transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none rounded-3xl doodle-shadow border-4 border-black text-white bg-[#CD2E3A] hover:bg-[#B0212E]"
            title="Supreme Lens"
          >
            <svg width="26" height="26" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="50" cy="50" r="10" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <g key={angle} style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }}>
                  <path d="M 46 41 C 30 15 40 2 50 2 C 60 2 70 15 54 41" />
                  <path d="M 47.5 39 C 42 22 46 12 50 12 C 54 12 58 22 52.5 39" />
                </g>
              ))}
            </svg>
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="w-12 h-12 bg-white border-4 border-black rounded-3xl doodle-shadow flex items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-gray-50"
            title="History"
          >
            <History className="w-5 h-5 stroke-[4] text-[#1A1A1A]" />
          </button>
        </div>

        {showHistory && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[25px] p-6 w-full max-w-md relative max-h-[80vh] flex flex-col">
              <button
                onClick={() => setShowHistory(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white border-[4px] border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] rounded-full flex items-center justify-center transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-gray-50 z-10"
              >
                <X className="w-5 h-5 stroke-[4] text-[#1A1A1A]" />
              </button>
              <h2 className="text-3xl font-black text-[#1A1A1A] mb-6 uppercase tracking-tight pr-12">History</h2>
              <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                {history.length === 0 ? (
                  <p className="text-gray-500 font-bold text-center italic py-8">No translation history yet.</p>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className="bg-gray-50 border-[4px] border-[#1A1A1A] rounded-xl p-4 flex flex-col gap-1 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                      setDirection(item.direction || 'en-ko');
                      setEnglishWord(item.english);
                      setTranslation(item.korean);
                      setShowHistory(false);
                      setExample(null);
                      setFunFact(null);
                      setAudioUrl(null);
                      setExampleAudioUrl(null);
                    }}>
                      <span className="text-sm font-black text-gray-500 uppercase">{item.direction === 'ko-en' ? 'Korean' : 'English'}: {item.english}</span>
                      <span className="text-xl font-bold text-[#1A1A1A]">{item.korean}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-md z-10 flex flex-col items-center pt-4 pb-12 animate-in fade-in duration-500 shrink-0">
          <div className="w-full flex flex-col items-center justify-center relative mb-12 mt-6 select-none">
            <div className="relative flex flex-col items-center justify-center w-full max-w-[290px] xs:max-w-[320px] sm:max-w-[380px] -mb-2">
              <svg viewBox="0 0 200 80" className="w-[320px] sm:w-[380px] h-auto -mb-[35px] z-10 overflow-visible translate-y-[10px]">
                <path id="curve" d="M 10 70 Q 100 0 190 70" fill="transparent" />
                <text width="200">
                  <textPath
                    href="#curve"
                    startOffset="50%"
                    textAnchor="middle"
                    className="text-[56px]"
                    style={{
                      fontFamily: "'East Sea Dokdo', cursive",
                      stroke: '#F6F5F2',
                      strokeWidth: '10px',
                      paintOrder: 'stroke fill',
                      strokeLinejoin: 'round',
                      strokeLinecap: 'round'
                    }}
                  >
                    <tspan fill="#CD2E3A">모던</tspan>
                    <tspan fill="none" stroke="none"> </tspan>
                    <tspan fill="#0047A0">한글</tspan>
                  </textPath>
                </text>
              </svg>
              <motion.img
                src="/kcharacters.webp"
                alt="Traditional Korean Dancers"
                className="w-[280px] sm:w-[340px] h-auto object-contain z-0 select-none"
                style={{
                  transform: 'translateZ(0)', /* ◄ Caches image texture directly into mobile GPU */
                  willChange: 'transform'     /* ◄ Bypasses layout thrashing on frame updates */
                }}
                animate={{
                  y: [0, -6, 0],
                  rotate: [0, 1.5, -1.5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="mt-1 flex flex-col items-center w-full px-4">
              <span className="text-[13px] xs:text-[15px] sm:text-[17px] tracking-[0.15em] sm:tracking-[0.25em] uppercase font-bold text-[#F6F5F2] whitespace-nowrap text-center drop-shadow-[2px_2px_0px_#1A1A1A]" style={{ fontFamily: "var(--font-pudding)" }}>
                — KOREAN TRANSLATOR SUPREME —
              </span>
            </div>
          </div>

          <div className="w-full space-y-3 z-10 relative mb-8">
            <div className="flex bg-[#F6F5F2] border-[4px] border-[#1A1A1A] p-[3px] rounded-full shadow-[5px_5px_0px_0px_#1A1A1A] self-start z-10 w-full sm:w-auto mb-6 shrink-0">
              <button
                onClick={() => handleInputModeChange('word')}
                className={`flex-1 px-2 sm:px-4 py-2.5 text-sm sm:text-base font-bubbly font-extrabold uppercase rounded-full transition-all duration-150 ${inputMode === 'word'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
                  }`}
              >
                Word
              </button>
              <button
                onClick={() => handleInputModeChange('conversation')}
                className={`flex-1 px-2 sm:px-4 py-2.5 text-sm sm:text-base font-bubbly font-extrabold uppercase rounded-full transition-all duration-150 ${inputMode === 'conversation'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
                  }`}
              >
                Conversation
              </button>
            </div>
            <div className="w-full flex items-center justify-between mb-3 sm:mb-4 px-1 sm:px-2 shrink-0">
              <AnimatePresence mode="wait">
                <motion.label
                  key={direction}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  htmlFor="english-input"
                  className="text-2xl font-sniglet font-extrabold text-white tracking-widest uppercase"
                  style={{ textShadow: '4px 4px 0px #1A1A1A', WebkitTextStroke: '2px #1A1A1A' }}
                >
                  {direction === 'en-ko' ? 'English Word' : 'Korean Word'}
                </motion.label>
              </AnimatePresence>
              <button
                onClick={handleSwap}
                className="flex items-center justify-center gap-3 bg-[#FED141] border-[6px] border-[#1A1A1A] rounded-none px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base font-bubbly font-extrabold uppercase hover:bg-[#E5BC3A] active:translate-y-[4px] active:translate-x-[4px] shadow-[6px_6px_0px_0px_#1A1A1A] active:shadow-none transition-all shrink-0"
                title="Swap Translation Direction"
              >
                {direction === 'en-ko' ? (
                  <><UKFlag className="-rotate-3" /> EN <ArrowLeftRight className="w-4 h-4 stroke-[3]" /> <KRFlag className="rotate-3" /> KR</>
                ) : (
                  <><KRFlag className="-rotate-3" /> KR <ArrowLeftRight className="w-4 h-4 stroke-[3]" /> <UKFlag className="rotate-3" /> EN</>
                )}
              </button>
            </div>
            <div className="drop-shadow-[8px_8px_0px_#1A1A1A] w-full shrink-0">
              <div className="bg-[#E8E6D9] border-[6px] border-[#1A1A1A] rounded-[32px] p-6 flex items-center relative min-h-[140px] z-10">
                <div className="absolute top-[100%] left-10 flex flex-col items-start z-10">
                  <div className="w-[24px] h-[6px] bg-[#E8E6D9]"></div>
                  <div className="w-[24px] h-[12px] bg-[#E8E6D9] border-x-[6px] border-[#1A1A1A]"></div>
                  <div className="w-[12px] h-[6px] bg-[#1A1A1A] ml-[12px]"></div>
                </div>
                <textarea
                  id="english-input"
                  value={englishWord}
                  onFocus={() => {
                    setTimeout(() => {
                      translateButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 350);
                  }}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (inputMode === 'conversation' && val.length > 500) {
                      val = val.substring(0, 500);
                    }
                    setEnglishWord(val);
                    setErrorMsg(null);
                    if (val.trim() === '') {
                      setTranslation('');
                      setConversationContext(null);
                      setExample(null);
                      setFunFact(null);
                      setAudioUrl(null);
                      setExampleAudioUrl(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleTranslate();
                    }
                  }}
                  className={`flex-1 bg-transparent outline-none placeholder:text-gray-400/70 w-full text-[#1A1A1A] resize-none transition-all duration-300 ${inputMode === 'conversation' ? 'min-h-[120px] text-2xl font-qtpi leading-relaxed' : 'min-h-[3rem] text-4xl font-qtpi overflow-hidden'}`}
                  placeholder={inputMode === 'conversation' ? 'Type a full sentence or paragraph here...' : `e.g. ${currentPlaceholder}`}
                />
                {inputMode === 'conversation' && <span className="absolute bottom-2 right-24 text-sm font-bubbly font-extrabold text-gray-500">{englishWord.length}/500</span>}
                <button
                  onClick={handleMicClick}
                  className={`w-14 h-14 ml-3 rounded-none border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-shrink-0 items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${isRecording ? 'bg-[#ffcdd2]' : 'bg-[#C6CDB9] hover:bg-[#B5BDA7]'}`}
                  title="Speak to translate"
                >
                  <Mic className="w-7 h-7 stroke-[4] text-[#1A1A1A]" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative self-center z-10 w-full mb-12 mt-4">
            <div ref={translateButtonRef} className="w-full shrink-0 flex items-center justify-center">
              <motion.button
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.96, x: 4, y: 4, boxShadow: "0px 0px 0px 0px #1A1A1A" }}
                animate={{ backgroundColor: isLoading ? ["#C6CDB9", "#F6F5F2", "#CD2E3A", "#0047A0", "#C6CDB9"] : "#C6CDB9" }}
                transition={{ backgroundColor: isLoading ? { repeat: Infinity, duration: 0.6, ease: "linear" } : { duration: 0.1 } }}
                onClick={() => { playTapSound(); handleTranslate(); }}
                disabled={isLoading || !englishWord.trim()}
                className="w-full text-[#1A1A1A] text-3xl sm:text-4xl font-bubbly font-extrabold py-4 sm:py-5 border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-none disabled:opacity-70 disabled:cursor-not-allowed min-h-[60px] uppercase tracking-wider flex items-center justify-center shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-10 h-10 animate-spin stroke-[4]" />
                ) : (
                  'Translate!'
                )}
              </motion.button>
            </div>
            <motion.div className="absolute -top-6 -right-5 z-20 pointer-events-none" animate={{ scale: [0.9, 1.2, 0.9], rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              <Sparkle />
            </motion.div>

            {errorMsg && (
              <div className="mt-6 p-4 bg-red-100 border-[4px] border-[#1A1A1A] rounded-xl text-[#1A1A1A] font-black flex items-start gap-3 shadow-[4px_4px_0px_0px_#1A1A1A]">
                <X className="w-6 h-6 shrink-0 mt-0.5 text-red-500" />
                <span className="flex-1 uppercase">{errorMsg}</span>
              </div>
            )}
          </div>

          <div ref={resultSectionRef} className="w-full">
            {(translation || isLoading) && (
              <div className="w-full space-y-3 z-10 relative mb-12 animate-in fade-in slide-in-from-bottom-6 duration-300">
                <div className="flex items-center justify-between px-2 mb-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={direction}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-2xl font-sniglet font-extrabold text-white tracking-widest uppercase"
                      style={{ textShadow: '4px 4px 0px #1A1A1A', WebkitTextStroke: '2px #1A1A1A' }}
                    >
                      {direction === 'en-ko' ? 'Korean Translation' : 'English Translation'}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="relative drop-shadow-[8px_8px_0px_#1A1A1A] w-full">
                  <div className="absolute -left-[72px] top-6 -z-10">
                    <LeftWing />
                  </div>
                  <div className="absolute -right-[72px] top-6 -z-10">
                    <RightWing />
                  </div>

                  <motion.div
                    key={translation ? `result-${translation.substring(0, 10)}` : 'empty'}
                    initial={translation && !isLoading ? { scale: 0.8, backgroundColor: "#FED141", opacity: 0 } : { opacity: 1, backgroundColor: "#D3D6CB" }}
                    animate={{ scale: 1, backgroundColor: "#D3D6CB", opacity: 1 }}
                    transition={translation && !isLoading ? {
                      scale: { type: "spring", stiffness: 400, damping: 15 },
                      backgroundColor: { duration: 0.5, ease: "easeOut", delay: 0.1 },
                      opacity: { duration: 0.2 }
                    } : { duration: 0.2 }}
                    className="relative border-[6px] border-[#1A1A1A] rounded-[32px] p-8 flex flex-col items-center justify-center min-h-[180px] z-10"
                  >
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center w-full animate-pulse">
                        <div className="h-12 bg-gray-300 border-[4px] border-[#1A1A1A] rounded-none w-3/4 mb-6 opacity-50"></div>
                        <div className="h-12 bg-gray-300 border-[4px] border-[#1A1A1A] rounded-none w-32 opacity-50"></div>
                      </div>
                    ) : (
                      <>
                        <div className={`w-full ${inputMode === 'conversation' ? 'max-h-[250px] overflow-y-auto pr-4 mb-6' : 'mb-8'}`}>
                          <span className={`${inputMode === 'conversation' ? 'text-2xl md:text-3xl font-qtpi normal-case text-left block' : 'text-4xl md:text-5xl font-qtpi uppercase text-center'} text-[#1A1A1A] break-words whitespace-pre-wrap w-full`}>
                            {translation}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                          {inputMode === 'word' && (
                            <button
                              onClick={() => handleSpeak(audioUrl)}
                              disabled={!audioUrl}
                              className="flex items-center gap-3 bg-[#E8E6D9] hover:bg-[#D9D7C8] text-[#1A1A1A] px-6 py-3 border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-none text-xl font-bubbly font-extrabold uppercase transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-wait min-h-[56px]"
                            >
                              <Volume2 className="w-6 h-6 stroke-[4]" />
                              SPEAK
                            </button>
                          )}
                          <button
                            onClick={handleCopy}
                            className="flex items-center justify-center w-14 h-14 bg-[#E8E6D9] hover:bg-[#D9D7C8] text-[#1A1A1A] border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-none transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                            title="Copy to clipboard"
                          >
                            {isCopied ? <Check className="w-6 h-6 stroke-[4] text-green-500" /> : <Copy className="w-6 h-6 stroke-[4]" />}
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            )}

            {inputMode === 'conversation' && conversationContext && !isLoading && (
              <div className="w-full z-10 relative mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="drop-shadow-[8px_8px_0px_#1A1A1A] w-full">
                  <div className="bg-[#B9D2B5] border-[6px] border-[#1A1A1A] rounded-none p-6 pt-8 relative z-10">
                    <div className="absolute right-[100%] bottom-10 flex flex-row items-end z-10">
                      <div className="w-[6px] h-[12px] bg-[#1A1A1A] mb-[12px]"></div>
                      <div className="w-[12px] h-[24px] bg-[#B9D2B5] border-y-[6px] border-[#1A1A1A]"></div>
                      <div className="w-[6px] h-[24px] bg-[#B9D2B5]"></div>
                    </div>
                    <span className="absolute -top-4 left-6 bg-[#1A1A1A] text-[#B9D2B5] text-lg font-sniglet font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-none shadow-[3px_3px_0px_0px_#B9D2B5] inline-flex w-max items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 100 100" className="shrink-0"><path d="M 50 10 C 50 40, 60 50, 90 50 C 60 50, 50 60, 50 90 C 50 60, 40 50, 10 50 C 40 50, 50 40, 50 10 Z" fill="#B9D2B5" stroke="#B9D2B5" strokeWidth="5" strokeLinejoin="round" /></svg> CONTEXT
                    </span>
                    <p className="text-2xl font-qtpi text-[#1A1A1A] leading-snug whitespace-pre-wrap">
                      {conversationContext}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {inputMode === 'word' && (funFact || isLoadingFunFact) && !isLoading && (
              <div className="w-full z-10 relative mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="drop-shadow-[8px_8px_0px_#1A1A1A] w-full">
                  <div className="bg-[#DBC27C] border-[6px] border-[#1A1A1A] rounded-none p-6 pt-8 relative z-10">
                    <div className="absolute right-[100%] bottom-10 flex flex-row items-end z-10">
                      <div className="w-[6px] h-[12px] bg-[#1A1A1A] mb-[12px]"></div>
                      <div className="w-[12px] h-[24px] bg-[#DBC27C] border-y-[6px] border-[#1A1A1A]"></div>
                      <div className="w-[6px] h-[24px] bg-[#DBC27C]"></div>
                    </div>
                    <span className="absolute -top-4 left-6 bg-[#1A1A1A] text-[#DBC27C] text-lg font-sniglet font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-none shadow-[3px_3px_0px_0px_#DBC27C] inline-flex w-max items-center gap-2">
                      <Lightbulb className="w-4 h-4 stroke-[3]" /> DID YOU KNOW?
                    </span>
                    {isLoadingFunFact ? (
                      <div className="animate-pulse space-y-2 mt-2">
                        <div className="h-3.5 bg-[#1A1A1A]/20 rounded-full w-full"></div>
                        <div className="h-3.5 bg-[#1A1A1A]/20 rounded-full w-5/6"></div>
                        <div className="h-3.5 bg-[#1A1A1A]/20 rounded-full w-3/4"></div>
                      </div>
                    ) : (
                      <p className="text-3xl font-qtpi text-[#1A1A1A] leading-snug">
                        {funFact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {inputMode === 'word' && translation && !isLoading && (
            <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-300">
              {!example && (
                exampleCooldown ? (
                  <div className="drop-shadow-[8px_8px_0px_#1A1A1A] w-full mb-8">
                    <div className="w-full bg-[#D3D6CB] border-[6px] border-[#1A1A1A] rounded-[32px] p-6 flex flex-col items-center gap-2 text-center relative z-10">
                      <div className="absolute top-[100%] right-10 flex flex-col items-end z-10">
                        <div className="w-[24px] h-[6px] bg-[#D3D6CB]"></div>
                        <div className="w-[24px] h-[12px] bg-[#D3D6CB] border-x-[6px] border-[#1A1A1A]"></div>
                        <div className="w-[12px] h-[6px] bg-[#1A1A1A] mr-[12px]"></div>
                      </div>
                      <span className="text-5xl font-bubbly font-extrabold text-[#1A1A1A]">⏳ {exampleCooldown}s</span>
                      <p className="text-2xl font-bubbly font-extrabold text-[#1A1A1A] uppercase tracking-tight leading-tight">
                        Sentence examples on cooldown!
                      </p>
                      <p className="text-lg font-bubbly font-extrabold text-gray-500 uppercase tracking-wide">
                        You can keep translating words in the meantime ✌️
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { playTapSound(); handleShowExample(); }}
                    disabled={isLoadingExample}
                    className="w-full bg-[#D3D6CB] hover:bg-[#C2C5BA] text-[#1A1A1A] text-2xl font-bubbly font-extrabold py-5 px-6 border-[6px] border-[1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-full transition-all duration-150 active:translate-x-[8px] active:translate-y-[8px] active:shadow-none disabled:opacity-70 flex items-center justify-center mb-8 min-h-[64px] uppercase"
                  >
                    {isLoadingExample ? (
                      <Loader2 className="w-8 h-8 mr-3 animate-spin stroke-[4]" />
                    ) : null}
                    Example Sentence
                  </button>
                )
              )}

              <div ref={exampleSectionRef} className="w-full">
                {example && (
                  <div className="w-full space-y-3 z-10 relative mb-8 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-2xl font-sniglet font-extrabold text-white tracking-widest uppercase" style={{ textShadow: '4px 4px 0px #1A1A1A', WebkitTextStroke: '2px #1A1A1A' }}>
                        Context
                      </span>
                    </div>
                    <div className="drop-shadow-[8px_8px_0px_#1A1A1A] w-full">
                      <div className="bg-[#D3D6CB] border-[6px] border-[#1A1A1A] rounded-none p-8 flex flex-col items-center justify-center relative min-h-[160px] z-10">
                        <div className="absolute bottom-[100%] left-10 flex flex-col items-start z-10">
                          <div className="w-[12px] h-[6px] bg-[#1A1A1A] ml-[12px]"></div>
                          <div className="w-[24px] h-[12px] bg-[#D3D6CB] border-x-[6px] border-[#1A1A1A]"></div>
                          <div className="w-[24px] h-[6px] bg-[#D3D6CB]"></div>
                        </div>
                        <p className="text-3xl font-sniglet font-normal mb-6 break-words text-[#1A1A1A] text-center w-full leading-tight uppercase">
                          {example.koreanSentence}
                        </p>
                        <p className="text-3xl font-sniglet font-normal mb-8 text-[#1A1A1A] text-center w-full bg-[#E8E6D9] px-4 py-2 border-[4px] border-[#1A1A1A] rounded-none shadow-[4px_4px_0px_0px_#1A1A1A]">
                          "{example.englishTranslation}"
                        </p>
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                          <button
                            onClick={() => handleSpeak(exampleAudioUrl)}
                            disabled={!exampleAudioUrl}
                            className="flex items-center gap-3 bg-[#E8E6D9] hover:bg-[#D9D7C8] text-[#1A1A1A] px-6 py-3 border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-none text-xl font-bubbly font-extrabold uppercase transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-wait min-h-[56px]"
                          >
                            <Volume2 className="w-6 h-6 stroke-[4]" />
                            SPEAK
                          </button>
                          <button
                            onClick={handleCopyExample}
                            className="flex items-center justify-center w-14 h-14 bg-[#E8E6D9] hover:bg-[#D9D7C8] text-[#1A1A1A] border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-none transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                            title="Copy to clipboard"
                          >
                            {isExampleCopied ? <Check className="w-6 h-6 stroke-[4] text-green-500" /> : <Copy className="w-6 h-6 stroke-[4]" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isLensOpen && (
            <SupremeLens
              onClose={() => { setIsLensOpen(false); setLensHasCapture(false); }}
              onCapturedChange={setLensHasCapture}
            />
          )}
        </AnimatePresence>

      </main>
    </>
  );
}
