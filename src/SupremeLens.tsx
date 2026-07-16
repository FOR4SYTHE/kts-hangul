import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { X, Info, Zap, ZapOff, RefreshCcw, Camera, Copy, Check, Sparkles } from 'lucide-react';


// Hand-drawn sparkle decoration
const CartoonSparkle = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" className="absolute -top-4 -right-4 animate-[spin_4s_linear_infinite]">
    <path d="M 50 10 C 50 40, 60 50, 90 50 C 60 50, 50 60, 50 90 C 50 60, 40 50, 10 50 C 40 50, 50 40, 50 10 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
  </svg>
);

interface SupremeLensProps {
  onClose: () => void;
  onCapturedChange?: (captured: boolean) => void;
}

export default function SupremeLens({ onClose, onCapturedChange }: SupremeLensProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultText, setResultText] = useState('');
  const [displayedText, setDisplayedText] = useState('');

  const [scanData, setScanData] = useState<{ text: string, lang: 'EN' | 'KO' } | null>(null);

  const [scanTime, setScanTime] = useState(0);
  const [lensCooldown, setLensCooldown] = useState<number | null>(null);
  const [isLensCopied, setIsLensCopied] = useState(false);

  // Hardware States
  const [flashOn, setFlashOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mode, setMode] = useState<'EN' | 'KO'>('EN');
  const [showInfo, setShowInfo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== 'EN' && mode !== 'KO') {
      setMode('EN');
    }
  }, [mode]);

  useEffect(() => {
    onCapturedChange?.(!!capturedImage);
  }, [capturedImage, onCapturedChange]);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    async function startCamera() {
      try {
        if (videoRef.current && videoRef.current.srcObject) {
          const oldStream = videoRef.current.srcObject as MediaStream;
          oldStream.getTracks().forEach(track => track.stop());
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', advanced: [{ zoom: 1 }] }
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }

    if (!capturedImage) {
      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedImage]);

  useEffect(() => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() || {};
      try {
        if (capabilities.torch !== undefined) {
          track.applyConstraints({ advanced: [{ torch: flashOn }] });
        }
        if (capabilities.zoom) {
          // @ts-ignore
          track.applyConstraints({ advanced: [{ zoom: zoomLevel }] });
        }
      } catch (e) {
        console.log("Hardware constraint not supported.");
      }
    }
  }, [flashOn, zoomLevel, stream]);

  // Dynamic Scan Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => setScanTime(prev => prev + 1), 1000);
    } else {
      setScanTime(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Rate Limit Cooldown Timer
  useEffect(() => {
    if (lensCooldown === null || lensCooldown <= 0) return;
    const timer = setTimeout(() => setLensCooldown(prev => (prev ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [lensCooldown]);

  // GSAP Animation Lifecycle Fix
  useEffect(() => {
    if (isProcessing && scanlineRef.current) {
      // Start the scanline at the top, then animate down
      gsap.fromTo(scanlineRef.current,
        { y: 0 },
        { y: window.innerHeight * 0.7, duration: 1.5, repeat: -1, yoyo: true, ease: "linear" }
      );
    }
  }, [isProcessing]);

  const translateCachedText = async (text: string, direction: 'en-ko' | 'ko-en') => {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: text, direction })
    });

    if (response.status === 503) {
      throw new Error("503");
    }

    if (response.status === 429) {
      const data = await response.json();
      setLensCooldown(data.retryAfter ?? 3600);
      throw new Error("429");
    }

    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return data.translation;
  };

  const handleSnap = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // --- BEYOND PLUS ULTRA DOWNSCALING ---
    const MAX_WIDTH = 600;
    const scale = MAX_WIDTH / video.videoWidth;

    canvas.width = MAX_WIDTH;
    canvas.height = video.videoHeight * scale;
    const ctx = canvas.getContext('2d');

    // Draw the image using the original video dimensions for the source, 
    // and the scaled canvas dimensions for the destination.
    if (zoomLevel > 1) {
      const srcW = video.videoWidth / zoomLevel;
      const srcH = video.videoHeight / zoomLevel;
      const srcX = (video.videoWidth - srcW) / 2;
      const srcY = (video.videoHeight - srcH) / 2;
      ctx?.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);
    } else {
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // Heavy compression guarantees the Vercel payload is tiny
    const base64Image = canvas.toDataURL('image/jpeg', 0.4);
    setCapturedImage(base64Image);
    setIsProcessing(true);

    if (stream) stream.getTracks().forEach(track => track.stop());

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, mode })
      });

      if (response.status === 503) {
        setResultText("ORACLE OVERLOADED: GOOGLE SERVERS BUSY. PLEASE TRY AGAIN LATER.");
        return;
      }

      if (response.status === 429) {
        const data = await response.json();
        setLensCooldown(data.retryAfter ?? 3600);
        return; // Stop execution, cooldown triggered
      }

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      let text = data.translation || data.text || "";

      // BEYOND PLUS ULTRA: Strip markdown asterisks and hashtags for a premium, clean look
      text = text.replace(/[*#]/g, '');

      const extractedLang = mode;
      setScanData({ text, lang: extractedLang });

      setResultText(text);
    } catch (error) {
      setResultText("Error communicating with the oracle.");
    } finally {
      setIsProcessing(false);
      // Let the useEffect handle the GSAP cleanup automatically, or force kill it here:
      if (scanlineRef.current) {
        gsap.killTweensOf(scanlineRef.current);
        gsap.set(scanlineRef.current, { clearProps: "all" });
      }
    }
  };

  const handleCopyLens = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setIsLensCopied(true);
      setTimeout(() => setIsLensCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  useEffect(() => {
    if (resultText && !isProcessing) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(resultText.slice(0, i));
        i += 2;
        if (i > resultText.length) clearInterval(interval);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [resultText, isProcessing]);

  const getWaitingMessage = (time: number) => {
    if (time > 25) return "ALMOST THERE, PROMISE... 😅";
    if (time > 20) return "STILL THINKING (IT'S A TOUGH ONE) 🤔";
    if (time > 15) return "HANG IN THERE... ⏳";
    if (time > 10) return "DECODING THE VIBES... ✨";
    if (time > 5) return "ANALYZING PIXELS... 🔍";
    return "SCANNING... 👁️";
  };

  const isErrorState = resultText.includes("ORACLE OVERLOADED") || resultText.includes("Error communicating");

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-50 flex flex-col font-sans overflow-hidden"
    >
      {/* LAYER 1: Deep Twilight Indigo-Purple Base */}
      <div className="absolute inset-0 -z-30 bg-[#12324F]" />

      {/* LAYER 2: Seigaiha Wave Overlay */}
      <div
        className="absolute inset-0 -z-20 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='50' viewBox='0 0 100 50'%3E%3Crect width='100' height='50' fill='%2312324F'/%3E%3Cdefs%3E%3Cg id='w'%3E%3Ccircle cx='0' cy='0' r='48' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='40' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='32' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='24' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='16' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='8' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3C/g%3E%3C/defs%3E%3Cuse href='%23w' x='-50' y='-25'/%3E%3Cuse href='%23w' x='50' y='-25'/%3E%3Cuse href='%23w' x='150' y='-25'/%3E%3Cuse href='%23w' x='0' y='0'/%3E%3Cuse href='%23w' x='100' y='0'/%3E%3Cuse href='%23w' x='-50' y='25'/%3E%3Cuse href='%23w' x='50' y='25'/%3E%3Cuse href='%23w' x='150' y='25'/%3E%3Cuse href='%23w' x='0' y='50'/%3E%3Cuse href='%23w' x='100' y='50'/%3E%3Cuse href='%23w' x='-50' y='75'/%3E%3Cuse href='%23w' x='50' y='75'/%3E%3Cuse href='%23w' x='150' y='75'/%3E%3C/svg%3E")`,
          backgroundSize: '76px 38px',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* LAYER 3: Film Grain Overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.18] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />


      {/* CARTOON TOP DASHBOARD */}
      <div className="w-full flex justify-between items-center p-4 pt-10 relative z-30">

        {/* Left Side: Info & Flash */}
        <div className="flex gap-3 w-1/3 justify-start">
          <button onClick={() => setShowInfo(true)} className="w-12 h-12 bg-[#F6F5F2] rounded-3xl border-[4px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center text-[#1A1A1A]">
            <Info strokeWidth={4} size={22} />
          </button>

          {/* Cartoon Slide Toggle for Flash */}
          <button
            onClick={() => setFlashOn(!flashOn)}
            className={`relative w-20 h-12 rounded-full border-[4px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all p-1 flex items-center overflow-hidden ${flashOn ? 'bg-[#FED141]' : 'bg-[#EF4444]'}`}
          >
            <motion.div
              animate={{ x: flashOn ? 25 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="w-8 h-8 bg-[#F6F5F2] border-[3px] border-[#1A1A1A] rounded-full flex items-center justify-center z-10 shrink-0"
            >
              {flashOn ? <Zap fill="#1A1A1A" size={16} /> : <ZapOff size={16} />}
            </motion.div>
          </button>
        </div>

        {/* Center: Mode Pill */}
        <div className="flex justify-center w-1/3">
          <div className="flex bg-[#F6F5F2] border-[4px] border-[#1A1A1A] p-[3px] rounded-full shadow-[5px_5px_0px_0px_#1A1A1A] z-10 relative select-none">
            {['EN', 'KO'].map((m) => {
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  onClick={async () => {
                    const newMode = m as 'EN' | 'KO';
                    if (newMode === mode) return;

                    if (!capturedImage || !scanData) {
                      setMode(newMode);
                      return;
                    }

                    setMode(newMode);
                    setDisplayedText('');
                    setResultText('');

                    const targetLang = newMode;
                    let finalRawText = scanData.text;

                    if (scanData.lang !== targetLang) {
                      setIsProcessing(true);
                      try {
                        const direction = scanData.lang === 'EN' ? 'en-ko' : 'ko-en';
                        finalRawText = await translateCachedText(scanData.text, direction);
                        setScanData({ text: finalRawText, lang: targetLang });
                      } catch (e: any) {
                        console.error(e);
                        if (e.message === "429") {
                          return; // Stop execution, cooldown triggered
                        }
                        if (e.message === "503") {
                          finalRawText = "ORACLE OVERLOADED: GOOGLE SERVERS BUSY. PLEASE TRY AGAIN LATER.";
                        } else {
                          finalRawText = "Error communicating with the oracle.";
                        }
                      } finally {
                        setIsProcessing(false);
                      }
                    }

                    setResultText(finalRawText);
                  }}
                  className="relative flex-1 w-16 px-4 py-2 rounded-full font-bubbly font-extrabold text-sm uppercase transition-colors duration-150 z-10 flex items-center justify-center outline-none"
                  style={{ color: isActive ? '#F6F5F2' : '#1A1A1A' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-[#1A1A1A] rounded-full -z-10 shadow-[inset_0px_4px_0px_rgba(255,255,255,0.2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Close */}
        <div className="flex justify-end w-1/3">
          <button onClick={onClose} className="w-12 h-12 bg-[#F6F5F2] rounded-3xl border-[4px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center text-[#1A1A1A]">
            <X strokeWidth={4} size={24} />
          </button>
        </div>

      </div>

      {/* MASSIVE VIEWFINDER (Fills Space) */}
      <div className="relative flex-grow mx-4 my-2 bg-black rounded-[32px] border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden flex flex-col">
        {!capturedImage ? (
          <video ref={videoRef} autoPlay playsInline style={{ transform: `scale(${zoomLevel})` }} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out" />
        ) : (
          <img src={capturedImage} alt="Snap" className="absolute inset-0 w-full h-full object-cover" />
        )}

        {/* Hand-drawn style Grid Overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-50">
          <div className="border-r-[2px] border-b-[2px] border-dashed border-white/70"></div>
          <div className="border-r-[2px] border-b-[2px] border-dashed border-white/70"></div>
          <div className="border-b-[2px] border-dashed border-white/70"></div>
          <div className="border-r-[2px] border-b-[2px] border-dashed border-white/70"></div>
          <div className="border-r-[2px] border-b-[2px] border-dashed border-white/70"></div>
          <div className="border-b-[2px] border-dashed border-white/70"></div>
          <div className="border-r-[2px] border-dashed border-white/70"></div>
          <div className="border-r-[2px] border-dashed border-white/70"></div>
          <div></div>
        </div>

        {/* Header embedded inside the camera for space saving */}
        <div className="absolute top-4 left-0 w-full flex justify-center pointer-events-none z-10">
          <h2 className="text-3xl font-title uppercase text-white tracking-widest" style={{ filter: 'drop-shadow(4px 4px 0px #1A1A1A)', WebkitTextStroke: '2px #1A1A1A' }}>
            SUPREME LENS
          </h2>
        </div>

        {isProcessing && (
          <>
            <div className="absolute inset-0 bg-black/50 z-10" />
            <div ref={scanlineRef} className="absolute top-0 left-0 w-full h-4 bg-[#FED141] shadow-[0_0_20px_#FED141] opacity-80 z-20" />
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-6">

              <div className="relative flex justify-center items-center w-full mb-4">
                {/* Reusing your animated sparkle for a premium loading feel */}
                <div className="absolute -top-10 -right-4 scale-75 opacity-80">
                  <CartoonSparkle />
                </div>
                <span className="text-white font-title text-3xl md:text-4xl tracking-widest uppercase text-center animate-pulse" style={{ WebkitTextStroke: '2px #1A1A1A' }}>
                  {getWaitingMessage(scanTime)}
                </span>
              </div>

              {scanTime > 0 && (
                <span className="text-[#FED141] font-black text-xl tracking-widest border-[3px] border-[#1A1A1A] bg-[#1A1A1A]/80 px-5 py-1.5 rounded-full shadow-[4px_4px_0px_#1A1A1A]">
                  {scanTime}s
                </span>
              )}
            </div>
          </>
        )}

        {/* Cooldown Overlay */}
        {lensCooldown && !isProcessing && (
          <div className="absolute inset-0 bg-black/80 z-40 flex flex-col items-center justify-center">
            <span className="text-6xl mb-4">⏳</span>
            <span className="text-white font-title text-3xl tracking-widest uppercase text-center" style={{ WebkitTextStroke: '1px #1A1A1A' }}>
              LENS COOLING DOWN
            </span>
            <span className="text-[#FED141] font-black text-4xl mt-2">
              {lensCooldown}s
            </span>
          </div>
        )}

        {/* Hidden Canvas for capturing image */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* CARTOON BOTTOM DASHBOARD */}
      <div className="w-full px-6 pb-10 pt-4 flex justify-between items-center relative z-30">

        {/* Left: Retake Button */}
        <div className="w-20">
          {capturedImage && (
            <button onClick={() => { setCapturedImage(null); setResultText(''); setDisplayedText(''); setScanData(null); }} className="w-16 h-16 bg-[#F6F5F2] rounded-3xl border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center justify-center text-[#1A1A1A] transition-all">
              <RefreshCcw strokeWidth={4} size={24} />
            </button>
          )}
        </div>

        {/* Center: Giant Cartoon Shutter Button */}
        {!capturedImage ? (
          <div className="relative">
            <CartoonSparkle />
            <button onClick={handleSnap} className="w-[100px] h-[100px] bg-[#FED141] hover:bg-[#E5BC3A] rounded-full border-[6px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center outline-none">
              <div className="w-14 h-14 rounded-full border-[5px] border-[#1A1A1A] bg-[#F6F5F2]"></div>
            </button>
          </div>
        ) : (
          <div className="w-[100px] h-[100px]" />
        )}

        {/* Right: iPhone-style Discrete Zoom Switch (Cartoonified) */}
        <div className="w-20 flex justify-end">
          {!capturedImage && (
            <div className="bg-[#F6F5F2] border-[4px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-3xl flex flex-col p-1 gap-1">
              {[3, 2, 1].map((z) => (
                <button
                  key={z}
                  onClick={() => setZoomLevel(z)}
                  className={`w-10 h-10 rounded-full font-bubbly font-extrabold text-sm transition-all flex items-center justify-center ${zoomLevel === z
                    ? 'bg-[#1A1A1A] text-[#FED141]'
                    : 'text-[#1A1A1A] hover:bg-gray-200'
                    }`}
                >
                  {z}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TEXT OUTPUT BOARD */}
      <AnimatePresence>
        {displayedText && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-[20%] left-6 right-6 bg-[#D3D6CB] border-[6px] border-[#1A1A1A] rounded-[32px] p-6 shadow-[8px_8px_0px_0px_#1A1A1A] z-40 max-h-[40vh] flex flex-col">

            {/* Copy Button Header */}
            {!isErrorState && (
              <div className="w-full flex justify-end mb-2">
                <button
                  onClick={handleCopyLens}
                  className="flex items-center gap-2 bg-[#E8E6D9] hover:bg-[#D9D7C8] text-[#1A1A1A] px-4 py-2 border-[3px] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] rounded-xl text-xs font-bubbly font-extrabold uppercase transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  {isLensCopied ? <Check className="w-4 h-4 text-green-600" strokeWidth={4} /> : <Copy className="w-4 h-4" strokeWidth={4} />}
                  {isLensCopied ? 'COPIED' : 'COPY'}
                </button>
              </div>
            )}

            <div className="overflow-y-auto pr-2">
              <p className="text-[#1A1A1A] leading-relaxed whitespace-pre-wrap text-2xl font-qtpi">
                {displayedText}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INFO MODAL */}
      <AnimatePresence>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-[#F6F5F2] border-[6px] border-[#1A1A1A] p-8 rounded-[32px] shadow-[8px_8px_0px_0px_#1A1A1A] relative max-w-sm w-full">
              <button onClick={() => setShowInfo(false)} className="absolute top-4 right-4 w-10 h-10 bg-white border-[4px] border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] rounded-full flex items-center justify-center active:translate-y-[3px] active:translate-x-[3px] active:shadow-none transition-all">
                <X strokeWidth={4} />
              </button>
              <h3 className="text-3xl font-title uppercase mb-6 text-[#1A1A1A] border-b-[4px] border-[#1A1A1A] pb-2 inline-block">LENS GUIDE</h3>
              <ul className="space-y-6 text-lg font-bubbly font-extrabold text-[#1A1A1A] uppercase tracking-tight">
                <li className="flex items-center gap-4"><Zap strokeWidth={4} className="text-[#EF4444]" /> Hardware Flash Toggle</li>
                <li className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-[#1A1A1A] text-[#FED141] rounded-lg">EN/KO</span>
                    <span>Translation Engine</span>
                  </div>
                  <div className="pl-16 text-sm font-sans font-extrabold text-[#1A1A1A]/70 normal-case tracking-normal space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-[#1A1A1A] text-[#FED141] rounded text-[10px] font-bubbly">EN</span>
                      <span>Translate scan to English</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-[#1A1A1A] text-[#FED141] rounded text-[10px] font-bubbly">KO</span>
                      <span>Translate scan to Korean</span>
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-4"><span className="w-8 h-8 rounded-full border-[4px] border-[#1A1A1A] flex items-center justify-center text-sm bg-white">1x</span> Camera Zoom Scale</li>
                <li className="flex items-center gap-4"><Camera strokeWidth={4} className="text-[#38BDF8]" /> Snap to translate!</li>
                <li className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-4">
                    <Sparkles strokeWidth={4} size={22} className="text-[#FED141] fill-[#FED141]" />
                    <span>Stamp Cam (Fun Feature)</span>
                  </div>
                  <div className="pl-10 text-xs font-sans font-extrabold text-[#1A1A1A]/70 normal-case tracking-normal">
                    An extra feature you can try for fun! Snap custom photos and turn them into printable postage stamps to save in your collection book.
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}