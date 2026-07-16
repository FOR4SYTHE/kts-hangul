import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Loader2, Copy, Check, History, X, ArrowLeftRight, Download, Lightbulb, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import SupremeLens from './SupremeLens';

// ============================================================================
// SUPREME ARCHITECT: LIVE CAMERA STAMP MACHINE (AWWWARDS SOTD FINAL)
// ============================================================================

const generateStampPath = (width: number, height: number) => {
  const r = 5; const spacing = 20; let path = `M 0,0 `;
  for (let x = spacing; x <= width; x += spacing) { path += `L ${x - (spacing / 2) - r},0 A ${r},${r} 0 0,0 ${x - (spacing / 2) + r},0 L ${x},0 `; }
  for (let y = spacing; y <= height; y += spacing) { path += `L ${width},${y - (spacing / 2) - r} A ${r},${r} 0 0,0 ${width},${y - (spacing / 2) + r} L ${width},${y} `; }
  for (let x = width - spacing; x >= 0; x -= spacing) { path += `L ${x + (spacing / 2) + r},${height} A ${r},${r} 0 0,0 ${x + (spacing / 2) - r},${height} L ${x},${height} `; }
  for (let y = height - spacing; y >= 0; y -= spacing) { path += `L 0,${y + (spacing / 2) + r} A ${r},${r} 0 0,0 0,${y + (spacing / 2) - r} L 0,${y} `; }
  path += `Z`; return path;
};

const MAX_ARCHIVE = 18;

const seededRandom = (seed: number) => {
  const x = Math.sin(seed + 1.1) * 10000;
  return x - Math.floor(x);
};

const renderDoodles = (idx: number) => {
  const elements = [];
  const doodle1 = generateSingleDoodle(idx, 1);
  if (doodle1) elements.push(doodle1);
  const doodle2 = generateSingleDoodle(idx, 2);
  if (doodle2) elements.push(doodle2);
  const doodle3 = generateSingleDoodle(idx, 3);
  if (doodle3) elements.push(doodle3);
  const doodle4 = generateSingleDoodle(idx, 4);
  if (doodle4) elements.push(doodle4);
  return elements;
};

const generateSingleDoodle = (idx: number, pass: number) => {
  const seed = idx * 100 + pass;
  const rand = seededRandom(seed);
  const zLayer = seededRandom(seed + 1);
  let zClass = 'z-0';
  if (zLayer > 0.7) zClass = 'z-40';
  else if (zLayer > 0.4) zClass = 'z-20';

  const rotation = seededRandom(seed + 2) * 35 - 17.5;
  const fontPick = seededRandom(seed + 3) > 0.5 ? "'Gloria Hallelujah', cursive" : "'Permanent Marker', cursive";

  if (pass === 1) {
    if (rand < 0.15) return null;
    const leftPos = '50%';
    if (rand < 0.5) {
      return (
        <div key={seed} className="absolute z-50 pointer-events-none drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)]" style={{ top: '-10%', left: leftPos, transform: `translateX(-50%) rotate(${rotation * 0.15}deg)` }}>
          <svg width="45" height="55" viewBox="0 0 60 80" fill="none" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 20 40 L 10 10 C 8 5 25 5 30 15" strokeWidth="4" fill="none" />
            <path d="M 40 40 L 50 10 C 52 5 35 5 30 15" strokeWidth="4" fill="none" />
            <path d="M 15 35 L 45 35 L 48 70 L 12 70 Z" fill="#1A1A1A" strokeWidth="2" />
            <path d="M 18 35 L 22 70 M 42 35 L 38 70" stroke="#333" strokeWidth="1.5" />
          </svg>
        </div>
      );
    } else if (rand < 0.75) {
      return (
        <div key={seed} className="absolute z-50 pointer-events-none drop-shadow-md" style={{ top: '-6%', left: leftPos, transform: `translateX(-50%) rotate(${rotation}deg)` }}>
          <svg width="32" height="65" viewBox="0 0 40 80" fill="none" stroke="#1A1A1A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 25 20 L 25 60 C 25 75, 5 75, 5 60 L 5 15 C 5 5, 35 5, 35 15 L 35 70 C 35 90, -5 90, -5 70 L -5 30" />
          </svg>
        </div>
      );
    } else {
      return (
        <div key={seed} className="absolute z-40 bg-[#F6F5F2]/80 backdrop-blur-md shadow-sm pointer-events-none border border-black/10 flex items-center justify-center overflow-hidden" style={{ width: '100px', height: '26px', top: '-4%', left: leftPos, transform: `translateX(-50%) rotate(${rotation}deg)` }}>
          <div className="w-full h-full opacity-15" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, #1A1A1A 3px, #1A1A1A 6px)' }}></div>
        </div>
      );
    }
  }

  if (pass === 2) {
    if (rand < 0.2) return null;
    const topPos = `${seededRandom(seed + 1) * 110 - 5}%`;
    const leftPos = `${seededRandom(seed + 2) * 120 - 10}%`;
    const textRand = seededRandom(seed + 4);

    if (textRand < 0.35) {
      const locations = ["📍 Wonosobo", "📍 Dieng", "10 Nov 2023", "📍 MNL", "company visit", "safety first"];
      const text = locations[Math.floor(seededRandom(seed + 5) * locations.length)];
      return (
        <div key={seed} className={`absolute ${zClass} text-[#1A1A1A] font-bold text-[16px] whitespace-nowrap pointer-events-none drop-shadow-md`} style={{ top: topPos, left: leftPos, transform: `rotate(${rotation * 0.6}deg)`, fontFamily: fontPick, letterSpacing: '0.5px' }}>
          {text}
        </div>
      );
    } else if (textRand < 0.65) {
      const notes = ["hot tea is necessary", "perlu kesini lagi", "a day in my life", "w/@linuu", "sehari jadi"];
      const text = notes[Math.floor(seededRandom(seed + 5) * notes.length)];
      return (
        <div key={seed} className={`absolute ${zClass} bg-[#F6F5F2] px-4 py-1.5 shadow-[3px_4px_8px_rgba(0,0,0,0.18)] pointer-events-none flex flex-col items-center border-[1px] border-[#1A1A1A]/10`} style={{ top: topPos, left: leftPos, transform: `rotate(${rotation}deg)` }}>
          <span className="text-[#1A1A1A] text-[14px] whitespace-nowrap font-black tracking-wide" style={{ fontFamily: "'Gloria Hallelujah', cursive" }}>{text}</span>
        </div>
      );
    } else {
      return (
        <div key={seed} className={`absolute ${zClass} text-[#1A1A1A] font-black text-[15px] flex flex-col leading-[0.9] pointer-events-none opacity-90`} style={{ top: topPos, left: leftPos, transform: `rotate(${rotation}deg)`, fontFamily: "'Permanent Marker', cursive" }}>
          <span>how cool</span>
          <span>how cool</span>
          <span>how cool</span>
        </div>
      );
    }
  }

  if (pass === 3) {
    if (rand < 0.25) return null;
    const topPos = `${seededRandom(seed + 1) * 110 - 5}%`;
    const leftPos = `${seededRandom(seed + 2) * 120 - 10}%`;

    const doodleTypes = [
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><circle cx="50" cy="50" r="42" /><path d="M 35 40 L 35 48 M 65 40 L 65 48" strokeWidth="7" /><path d="M 30 65 Q 50 82 70 65" strokeWidth="5.5" /></svg>,
      <svg width="65" height="65" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 25 10 L 30 25 L 45 30 L 30 35 L 25 50 L 20 35 L 5 30 L 20 25 Z" /><path d="M 75 30 L 78 40 L 88 43 L 78 46 L 75 56 L 72 46 L 62 43 L 72 40 Z" strokeWidth="3.5" /><path d="M 50 65 L 52 72 L 59 74 L 52 76 L 50 83 L 48 76 L 41 74 L 48 72 Z" strokeWidth="3.5" /></svg>,
      <svg width="55" height="55" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M 50 20 L 50 80" strokeWidth="6.5" /><path d="M 50 35 C 10 10, 5 50, 50 50 Z" /><path d="M 50 35 C 90 10, 95 50, 50 50 Z" /><path d="M 50 50 C 20 50, 20 85, 50 75 Z" /><path d="M 50 50 C 80 50, 80 85, 50 75 Z" /><path d="M 50 20 Q 35 5 30 15 M 50 20 Q 65 5 70 15" strokeWidth="3.5" /></svg>,
      <svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><circle cx="50" cy="50" r="16" /><path d="M 50 5 L 50 24 M 50 95 L 50 76 M 5 50 L 24 50 M 95 50 L 76 50 M 18 18 L 31 31 M 82 82 L 69 69 M 18 82 L 31 69 M 82 18 L 69 31" strokeWidth="5.5" /></svg>,
      <svg width="45" height="45" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="50" cy="50" r="11" /><path d="M 50 40 C 30 -10, 70 -10, 50 40 Z" /><path d="M 50 60 C 30 110, 70 110, 50 60 Z" /><path d="M 40 50 C -10 30, -10 70, 40 50 Z" /><path d="M 60 50 C 110 30, 110 70, 60 50 Z" /></svg>,
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M 25 40 L 25 70 C 25 85, 65 85, 65 70 L 65 40 Z" strokeWidth="5.5" /><path d="M 15 80 C 15 90, 75 90, 75 80" /><path d="M 65 45 C 80 45, 80 65, 65 65" strokeWidth="5" /><path d="M 35 30 Q 40 15 35 5 M 45 30 Q 50 15 45 5 M 55 30 Q 60 15 55 5" strokeWidth="3.5" /></svg>,
      <svg width="38" height="38" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 50 30 C 50 30 45 5 25 5 C -5 5 -5 45 50 95 C 105 45 105 5 75 5 C 55 5 50 30 50 30 Z" /></svg>
    ];

    const svg = doodleTypes[Math.floor(seededRandom(seed + 6) * doodleTypes.length)];
    return (
      <div key={seed} className={`absolute ${zClass} pointer-events-none drop-shadow-sm opacity-90`} style={{ top: topPos, left: leftPos, transform: `rotate(${rotation * 1.5}deg)` }}>
        {svg}
      </div>
    );
  }

  if (pass === 4) {
    if (rand < 0.45) return null;
    const topPos = `${seededRandom(seed + 1) * 80 + 10}%`;
    const leftPos = `${seededRandom(seed + 2) * 80 + 10}%`;
    const connectorRand = seededRandom(seed + 3);

    if (connectorRand < 0.35) {
      return (
        <div key={seed} className="absolute z-50 pointer-events-none drop-shadow-md" style={{ top: topPos, left: '-10%', transform: `rotate(${rotation * 1.5}deg)` }}>
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="50" cy="50" r="42" />
            <path d="M 35 40 L 35 48 M 65 40 L 65 48" strokeWidth="7" />
            <path d="M 30 65 Q 50 82 70 65" strokeWidth="5.5" />
          </svg>
        </div>
      );
    } else if (connectorRand < 0.75) {
      return (
        <div key={seed} className={`absolute z-40 pointer-events-none opacity-90`} style={{ top: '-10%', left: leftPos, transform: `rotate(${rotation}deg)` }}>
          <svg width="75" height="75" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 50 20 L 50 80" strokeWidth="6.5" />
            <path d="M 50 35 C 10 10, 5 50, 50 50 Z" />
            <path d="M 50 35 C 90 10, 95 50, 50 50 Z" />
            <path d="M 50 50 C 20 50, 20 85, 50 75 Z" />
            <path d="M 50 50 C 80 50, 80 85, 50 75 Z" />
            <path d="M 50 20 Q 35 5 30 15 M 50 20 Q 65 5 70 15" strokeWidth="3.5" />
          </svg>
        </div>
      );
    } else {
      return (
        <div key={seed} className={`absolute ${zClass} pointer-events-none drop-shadow-sm`} style={{ top: topPos, left: leftPos, transform: `rotate(${rotation * 2.5}deg)` }}>
          <svg width="65" height="65" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 20 80 Q 50 50 80 20 M 60 20 L 80 20 L 80 40" />
          </svg>
        </div>
      );
    }
  }

  return null;
};

const StampMachine = ({ onClose }: { onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const zoomedStampRef = useRef<HTMLDivElement>(null);

  const [hqImage, setHqImage] = useState<string | null>(null);
  const [archiveImage, setArchiveImage] = useState<string | null>(null);

  const [punchState, setPunchState] = useState<'viewfinder' | 'punching' | 'done'>('viewfinder');
  const [hasCameraError, setHasCameraError] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [activeTab, setActiveTab] = useState<'camera' | 'archive'>('camera');
  const [selectedStampIndex, setSelectedStampIndex] = useState<number | null>(null);

  const stampWidth = 260;
  const stampHeight = 340;
  const stampPath = generateStampPath(stampWidth, stampHeight);

  const [archive, setArchive] = useState<{ date: string, data: string }[]>(() => {
    try { const saved = localStorage.getItem('supreme_stamps_archive'); return saved ? JSON.parse(saved) : []; }
    catch { return []; }
  });

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: facingMode } } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied", err);
        setHasCameraError(true);
      }
    };
    if (punchState === 'viewfinder' && activeTab === 'camera') startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [punchState, facingMode, activeTab]);

  const handleFallbackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setHqImage(result);
        setArchiveImage(result);
        setPunchState('done');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePunch = () => {
    if (!videoRef.current || !canvasRef.current || punchState !== 'viewfinder') return;
    const video = videoRef.current; const canvas = canvasRef.current;

    const targetW = 220; const targetH = 300;
    const targetRatio = targetW / targetH;
    const videoRatio = video.videoWidth / video.videoHeight;
    let sW = video.videoWidth; let sH = video.videoHeight;
    let sX = 0; let sY = 0;

    if (videoRatio > targetRatio) {
      sW = video.videoHeight * targetRatio;
      sX = (video.videoWidth - sW) / 2;
    } else {
      sH = video.videoWidth / targetRatio;
      sY = (video.videoHeight - sH) / 2;
    }

    canvas.width = targetW * 3; canvas.height = targetH * 3;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (facingMode === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
      ctx.drawImage(video, sX, sY, sW, sH, 0, 0, canvas.width, canvas.height);
      setHqImage(canvas.toDataURL('image/jpeg', 1.0));

      const lowResCanvas = document.createElement('canvas');
      lowResCanvas.width = targetW; lowResCanvas.height = targetH;
      const lrCtx = lowResCanvas.getContext('2d');
      if (lrCtx) {
        if (facingMode === 'user') { lrCtx.translate(lowResCanvas.width, 0); lrCtx.scale(-1, 1); }
        lrCtx.drawImage(video, sX, sY, sW, sH, 0, 0, lowResCanvas.width, lowResCanvas.height);
        setArchiveImage(lowResCanvas.toDataURL('image/jpeg', 0.6));
      }
    }

    setPunchState('punching');
    setTimeout(() => setPunchState('done'), 600);
  };

  const handleDownload = () => {
    if (!stampRef.current) return;
    toPng(stampRef.current, {
      cacheBust: true,
      pixelRatio: 4,
      skipFonts: true,
      width: stampWidth,
      height: stampHeight,
      style: { transform: 'scale(1) rotate(0deg) translateY(0px)' }
    })
      .then((dataUrl) => {
        const link = document.createElement('a'); link.download = `supreme-stamp-${Date.now()}.png`; link.href = dataUrl; link.click();
      });
  };

  const handleSaveToArchive = () => {
    if (!archiveImage) return;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    const newEntry = { date: today, data: archiveImage };
    const newArchive = [newEntry, ...archive].slice(0, MAX_ARCHIVE);
    setArchive(newArchive);
    localStorage.setItem('supreme_stamps_archive', JSON.stringify(newArchive));

    setHqImage(null);
    setArchiveImage(null);
    setPunchState('viewfinder');
    setActiveTab('archive');
  };

  return (
    <div className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center p-4 transition-colors duration-500 overflow-hidden ${activeTab === 'archive' ? 'bg-[#F4F0EB]' : 'bg-black/95 backdrop-blur-md'}`}>

      {activeTab === 'archive' && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      )}

      <button onClick={onClose} className={`absolute top-8 right-8 z-50 transition-transform active:scale-90 ${activeTab === 'archive' ? 'text-[#1A1A1A] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]' : 'text-[#F6F5F2] hover:text-[#BF0D3E] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]'}`}>
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 20 20 L 80 80 M 80 20 L 20 80" />
        </svg>
      </button>

      <canvas ref={canvasRef} className="hidden" />

      {activeTab === 'camera' && (
        <div className="relative w-[340px] h-[420px] flex items-center justify-center mt-4">
          {punchState !== 'done' && (
            <motion.div
              onPointerDown={punchState === 'viewfinder' && !hasCameraError ? handlePunch : undefined}
              animate={punchState === 'punching' ? { scale: 0.95, y: 15 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`absolute inset-0 rounded-[48px] bg-gradient-to-br from-[#E5E7EB] via-[#9CA3AF] to-[#4B5563] shadow-[inset_0_4px_15px_rgba(255,255,255,0.7),0_30px_60px_rgba(0,0,0,0.9)] border-[4px] border-[#374151] flex items-center justify-center z-10 ${punchState === 'viewfinder' ? 'cursor-pointer' : ''}`}
            >
              <div className="relative w-[260px] h-[340px] bg-[#0a0a0a] rounded shadow-[inset_0_15px_40px_rgba(0,0,0,1)] border-[2px] border-[#1f2937] overflow-hidden group">
                {hasCameraError ? (
                  <label className="cursor-pointer text-gray-500 font-black text-center p-6 hover:text-white transition-colors w-full h-full flex flex-col items-center justify-center gap-3">
                    <span className="tracking-widest text-sm">CAMERA UNAVAILABLE<br />TAP TO UPLOAD</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFallbackUpload} />
                  </label>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover opacity-90 transition-transform ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} />
                    {hqImage && punchState === 'punching' && (
                      <img src={hqImage} className="absolute inset-0 w-full h-full object-cover z-10" alt="frozen frame" />
                    )}
                    <div className="absolute inset-0 z-20 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] pointer-events-none">
                      <svg width="100%" height="100%" viewBox={`0 0 ${stampWidth} ${stampHeight}`} className="absolute inset-0 w-full h-full">
                        <path fill="#2a2a2a" fillRule="evenodd" d={`M -100,-100 L ${stampWidth + 100},-100 L ${stampWidth + 100},${stampHeight + 100} L -100,${stampHeight + 100} Z ${stampPath}`} />
                        <path fill="none" stroke="#555" strokeWidth="2" d={stampPath} />
                        <path fill="none" stroke="#000" strokeWidth="6" strokeOpacity="0.5" d={stampPath} />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {punchState === 'viewfinder' && !hasCameraError && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setFacingMode(prev => prev === 'environment' ? 'user' : 'environment'); }}
              className="absolute -bottom-24 right-4 z-50 text-[#1A1A1A] bg-[#F6F5F2] border-[4px] border-[#1A1A1A] rounded-3xl p-3 shadow-[4px_4px_0px_0px_#1A1A1A] hover:bg-[#FED141] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              title="Flip Camera"
            >
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 25 50 C 25 30 40 15 60 15 C 75 15 85 25 90 35" />
                <path d="M 90 20 L 90 35 L 75 35" />
                <path d="M 75 50 C 75 70 60 85 40 85 C 25 85 15 75 10 65" />
                <path d="M 10 80 L 10 65 L 25 65" />
              </svg>
            </motion.button>
          )}

          {hqImage && punchState === 'done' && (
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 1 }}
              animate={{ scale: 1.05, y: -20, rotate: -2, filter: 'drop-shadow(0px 30px 40px rgba(0,0,0,0.9))', opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute z-30 flex items-center justify-center"
            >
              <div ref={stampRef} className="relative flex items-center justify-center bg-transparent" style={{ width: stampWidth, height: stampHeight }}>
                <svg width={stampWidth} height={stampHeight} viewBox={`0 0 ${stampWidth} ${stampHeight}`} className="absolute inset-0">
                  <path fill="#F6F5F2" d={stampPath} />
                </svg>
                <div className="relative z-10 w-[220px] h-[300px] border-[2px] border-[#1A1A1A] overflow-hidden bg-white shadow-inner">
                  <img src={hqImage} alt="Custom Stamp" className="w-[220px] h-[300px] object-cover" crossOrigin="anonymous" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {punchState === 'done' && activeTab === 'camera' && (
        <div className="mt-20 flex flex-row justify-center gap-5 w-full max-w-sm z-30 px-2">
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setHqImage(null); setArchiveImage(null); setPunchState('viewfinder'); }}
            className="w-[90px] h-[90px] bg-[#F6F5F2] text-[#1A1A1A] border-[4px] border-[#1A1A1A] rounded-3xl shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-col items-center justify-center gap-2 transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 25 50 C 25 30 40 15 60 15 C 75 15 85 25 90 35" />
              <path d="M 90 20 L 90 35 L 75 35" />
              <path d="M 75 50 C 75 70 60 85 40 85 C 25 85 15 75 10 65" />
              <path d="M 10 80 L 10 65 L 25 65" />
            </svg>
            <span className="text-[12px] font-bubbly font-extrabold uppercase tracking-widest leading-none">Retake</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="w-[90px] h-[90px] bg-[#1A1A1A] text-[#F6F5F2] border-[4px] border-[#1A1A1A] rounded-3xl shadow-[4px_4px_0px_0px_#F6F5F2] flex flex-col items-center justify-center gap-2 transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 50 15 L 50 60" />
              <path d="M 30 40 L 50 60 L 70 40" />
              <path d="M 20 85 L 80 85" />
            </svg>
            <span className="text-[12px] font-bubbly font-extrabold uppercase tracking-widest leading-none">Export</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleSaveToArchive}
            className="w-[90px] h-[90px] bg-[#FED141] text-[#1A1A1A] border-[4px] border-[#1A1A1A] rounded-3xl shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-col items-center justify-center gap-2 transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 15 25 C 25 15, 40 15, 50 25 C 60 15, 75 15, 85 25 L 85 80 C 75 70, 60 70, 50 80 C 40 70, 25 70, 15 80 Z" />
              <path d="M 50 25 L 50 80" />
              <path d="M 32 45 L 32 65 M 22 55 L 42 55" />
              <path d="M 60 45 Q 68 40 75 45 M 60 60 Q 68 55 75 60" />
            </svg>
            <span className="text-[12px] font-bubbly font-extrabold uppercase tracking-widest leading-none">Save</span>
          </motion.button>
        </div>
      )}

      {activeTab === 'archive' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
          className="absolute inset-0 pt-24 pb-36 px-4 overflow-y-auto flex flex-col items-center z-20"
        >
          <div className="relative mb-12">
            <h2 className="text-[#1A1A1A] font-bubbly font-extrabold text-[2.5rem] uppercase tracking-widest text-center">
              Collections
            </h2>
            <div
              className="absolute -bottom-6 left-1/2 bg-[#1A1A1A] text-[#F4F0EB] text-xs font-bubbly font-extrabold uppercase tracking-widest px-4 py-1.5 shadow-[3px_3px_0px_0px_#FED141]"
              style={{ transform: 'translateX(-50%)' }}
            >
              {archive.length}/{MAX_ARCHIVE} Memories
            </div>
          </div>

          {archive.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-[4px] border-dashed border-[#1A1A1A]/30 rounded-[32px] w-full max-w-sm mt-8">
              <p className="text-[#1A1A1A]/50 font-bubbly font-extrabold text-center uppercase tracking-widest leading-relaxed">No stamps collected yet.<br />Punch some memories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 w-full max-w-2xl px-2">
              {archive.map((entry, idx) => (
                <React.Fragment key={idx}>
                  {(idx === 0 || archive[idx - 1].date !== entry.date) && (
                    <div className="col-span-2 sm:col-span-3 w-full text-left mt-6 mb-2 pb-2 relative overflow-visible">
                      <span className="text-[#1A1A1A] font-bubbly font-extrabold text-lg uppercase tracking-widest inline-block">
                        {entry.date}
                      </span>
                      <svg className="absolute bottom-0 left-0 w-full h-2 opacity-30" preserveAspectRatio="none" viewBox="0 0 100 10" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 2 5 C 20 2, 40 8, 60 4 C 80 0, 95 6, 98 4" />
                      </svg>
                    </div>
                  )}
                  <div className="flex flex-col items-center relative z-10">
                    {renderDoodles(idx)}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedStampIndex(idx)}
                      className="relative aspect-[260/340] w-full flex items-center justify-center drop-shadow-[4px_6px_8px_rgba(0,0,0,0.15)] hover:scale-105 hover:z-50 transition-transform cursor-pointer"
                      style={{ transform: `rotate(${seededRandom(idx * 8) * 6 - 3}deg)` }}
                    >
                      {seededRandom(idx * 100 + 1) < 0.15 && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/70 backdrop-blur-sm shadow-sm z-40 border border-black/5" style={{ transform: `rotate(${seededRandom(idx * 9) * 10 - 5}deg)` }}></div>
                      )}
                      <svg width="100%" height="100%" viewBox={`0 0 ${stampWidth} ${stampHeight}`} className="absolute inset-0">
                        <path fill="#F6F5F2" d={stampPath} />
                      </svg>
                      <div className="relative z-10 w-[84%] h-[88%] border-[2px] border-[#1A1A1A] overflow-hidden bg-white">
                        <img src={entry.data} className="w-full h-full object-cover grayscale-[0.1] contrast-[1.1]" />
                      </div>
                    </motion.div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {punchState !== 'punching' && (
        <div className="absolute inset-x-0 bottom-8 flex justify-center z-[9999] pointer-events-none">
          <div className="flex bg-[#F6F5F2] border-[4px] border-[#1A1A1A] p-[3px] rounded-full shadow-[5px_5px_0px_0px_#1A1A1A] pointer-events-auto">
            <button
              onClick={() => { setActiveTab('camera'); setPunchState('viewfinder'); setHqImage(null); }}
              className={`w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-full transition-all duration-150 ${activeTab === 'camera' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'}`}
            >
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 20 80 Q 50 90 80 80 L 80 65 L 20 65 Z" />
                <path d="M 40 65 L 45 35 M 60 65 L 55 35" />
                <path d="M 35 35 L 65 35 C 70 15, 30 15, 35 35 Z" />
              </svg>
              <span className="text-[14px] font-bubbly font-extrabold uppercase tracking-widest mt-1">Stamp</span>
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-full transition-all duration-150 ${activeTab === 'archive' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'}`}
            >
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 15 25 C 25 15, 40 15, 50 25 C 60 15, 75 15, 85 25 L 85 80 C 75 70, 60 70, 50 80 C 40 70, 25 70, 15 80 Z" />
                <path d="M 50 25 L 50 80" />
                <path d="M 25 45 Q 32 40 40 45" />
                <path d="M 25 60 Q 32 55 40 60" />
                <path d="M 60 45 Q 68 40 75 45" />
                <path d="M 60 60 Q 68 55 75 60" />
              </svg>
              <span className="text-[14px] font-bubbly font-extrabold uppercase tracking-widest mt-1">Book</span>
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedStampIndex !== null && archive[selectedStampIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedStampIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative flex items-center justify-center" style={{ width: stampWidth * 1.2, height: stampHeight * 1.2 }}>
                <div className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" style={{ transform: 'scale(1.2)' }}>
                  <div ref={zoomedStampRef} className="relative flex items-center justify-center bg-transparent" style={{ width: stampWidth, height: stampHeight }}>
                    <svg width={stampWidth} height={stampHeight} viewBox={`0 0 ${stampWidth} ${stampHeight}`} className="absolute inset-0">
                      <path fill="#F6F5F2" d={stampPath} />
                    </svg>
                    <div className="relative z-10 w-[220px] h-[300px] border-[2px] border-[#1A1A1A] overflow-hidden bg-white shadow-inner">
                      <img src={archive[selectedStampIndex].data} className="w-full h-full object-cover" crossOrigin="anonymous" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (!zoomedStampRef.current) return;
                    toPng(zoomedStampRef.current, {
                      cacheBust: true,
                      pixelRatio: 4,
                      skipFonts: true,
                      width: stampWidth,
                      height: stampHeight,
                      style: { transform: 'scale(1) rotate(0deg) translateY(0px)' }
                    }).then((dataUrl) => {
                      const link = document.createElement('a');
                      link.download = `supreme-collection-${Date.now()}.png`;
                      link.href = dataUrl;
                      link.click();
                    });
                  }}
                  className="w-[60px] h-[60px] bg-[#F6F5F2] hover:bg-[#FED141] text-[#1A1A1A] border-[4px] border-[#1A1A1A] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#1A1A1A] transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none"
                  title="Download"
                >
                  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 50 20 L 50 65" />
                    <path d="M 30 45 L 50 65 L 70 45" />
                    <path d="M 20 80 L 80 80" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const newArchive = [...archive];
                    newArchive.splice(selectedStampIndex, 1);
                    setArchive(newArchive);
                    localStorage.setItem('supreme_stamps_archive', JSON.stringify(newArchive));
                    setSelectedStampIndex(null);
                  }}
                  className="w-[60px] h-[60px] bg-[#F6F5F2] hover:bg-[#BF0D3E] hover:text-[#F6F5F2] text-[#1A1A1A] border-[4px] border-[#1A1A1A] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#1A1A1A] transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none"
                  title="Delete"
                >
                  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 30 30 L 70 30" />
                    <path d="M 45 30 L 45 20 L 55 20 L 55 30" />
                    <path d="M 35 30 L 40 80 L 60 80 L 65 30" />
                    <path d="M 45 45 L 45 65" />
                    <path d="M 55 45 L 55 65" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

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
  const [showStampMachine, setShowStampMachine] = useState(false);
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
            TWILIGHT BOLASAEK CANVAS
            ============================================================================ */}
        {/* LAYER 1: Deep Twilight Indigo-Purple Base Paint */}
        <div className="fixed inset-0 -z-30 pointer-events-none bg-[#12324F]" />

        {/* LAYER 2: Solid-Filled Seigaiha Waves (Superfine, Highly Subtle & Deep Twilight) */}
        <div
          className="fixed inset-0 -z-20 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='50' viewBox='0 0 100 50'%3E%3Crect width='100' height='50' fill='%2312324F'/%3E%3Cdefs%3E%3Cg id='w'%3E%3Ccircle cx='0' cy='0' r='48' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='40' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='32' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='24' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='16' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='8' fill='%2312324F' stroke='%231E4366' stroke-width='2.5'/%3E%3C/g%3E%3C/defs%3E%3Cuse href='%23w' x='-50' y='-25'/%3E%3Cuse href='%23w' x='50' y='-25'/%3E%3Cuse href='%23w' x='150' y='-25'/%3E%3Cuse href='%23w' x='0' y='0'/%3E%3Cuse href='%23w' x='100' y='0'/%3E%3Cuse href='%23w' x='-50' y='25'/%3E%3Cuse href='%23w' x='50' y='25'/%3E%3Cuse href='%23w' x='150' y='25'/%3E%3Cuse href='%23w' x='0' y='50'/%3E%3Cuse href='%23w' x='100' y='50'/%3E%3Cuse href='%23w' x='-50' y='75'/%3E%3Cuse href='%23w' x='50' y='75'/%3E%3Cuse href='%23w' x='150' y='75'/%3E%3C/svg%3E")`,
            backgroundSize: '76px 38px',
            backgroundRepeat: 'repeat'
          }}
        />

        {/* LAYER 3: Tactile Film Grain Overlay (Warm Cinematic Vignette Overlay) */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none opacity-[0.18] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />

        <div className="w-full max-w-4xl flex justify-between items-center z-40 mb-2 relative">
          <button
            onClick={() => setIsLensOpen(true)}
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

        <div className="w-full max-w-md z-10 flex flex-col items-center pt-4 pb-12 animate-in fade-in duration-500">
          <div className="w-full flex flex-col items-center justify-center relative mb-12 mt-6 select-none">
            <div className="relative flex flex-col items-center justify-center w-[360px] sm:w-[420px] -mb-2">
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
                  filter: 'brightness(0) drop-shadow(3px 0 0 #F6F5F2) drop-shadow(-3px 0 0 #F6F5F2) drop-shadow(0 3px 0 #F6F5F2) drop-shadow(0 -3px 0 #F6F5F2) drop-shadow(2px 2px 0 #F6F5F2) drop-shadow(-2px -2px 0 #F6F5F2) drop-shadow(2px -2px 0 #F6F5F2) drop-shadow(-2px 2px 0 #F6F5F2)'
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
            <div className="flex bg-[#F6F5F2] border-[4px] border-[#1A1A1A] p-[3px] rounded-full shadow-[5px_5px_0px_0px_#1A1A1A] self-start z-10 w-full sm:w-auto mb-6">
              <button
                onClick={() => handleInputModeChange('word')}
                className={`flex-1 px-8 py-2.5 text-xl font-bubbly font-extrabold uppercase rounded-full transition-all duration-150 ${inputMode === 'word'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
                  }`}
              >
                Word
              </button>
              <button
                onClick={() => handleInputModeChange('conversation')}
                className={`flex-1 px-8 py-2.5 text-xl font-bubbly font-extrabold uppercase rounded-full transition-all duration-150 ${inputMode === 'conversation'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
                  }`}
              >
                Conversation
              </button>
            </div>
            <div className="flex items-center justify-between px-2 mb-2">
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
                className="flex items-center justify-center gap-3 bg-[#FED141] border-[6px] border-[#1A1A1A] rounded-none px-4 py-2 text-xl font-bubbly font-extrabold uppercase hover:bg-[#E5BC3A] active:translate-y-[4px] active:translate-x-[4px] shadow-[6px_6px_0px_0px_#1A1A1A] active:shadow-none transition-all"
                title="Swap Translation Direction"
              >
                {direction === 'en-ko' ? (
                  <><UKFlag className="-rotate-3" /> EN <ArrowLeftRight className="w-4 h-4 stroke-[3]" /> <KRFlag className="rotate-3" /> KR</>
                ) : (
                  <><KRFlag className="-rotate-3" /> KR <ArrowLeftRight className="w-4 h-4 stroke-[3]" /> <UKFlag className="rotate-3" /> EN</>
                )}
              </button>
            </div>
            <div className="drop-shadow-[8px_8px_0px_#1A1A1A] w-full">
              <div className="bg-[#E8E6D9] border-[6px] border-[#1A1A1A] rounded-[32px] p-6 flex items-center relative min-h-[100px] z-10">
                <div className="absolute top-[100%] left-10 flex flex-col items-start z-10">
                  <div className="w-[24px] h-[6px] bg-[#E8E6D9]"></div>
                  <div className="w-[24px] h-[12px] bg-[#E8E6D9] border-x-[6px] border-[#1A1A1A]"></div>
                  <div className="w-[12px] h-[6px] bg-[#1A1A1A] ml-[12px]"></div>
                </div>
                <textarea
                  id="english-input"
                  value={englishWord}
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
            <motion.button
              whileHover={isLoading ? {} : { scale: 1.02 }}
              whileTap={isLoading ? {} : { scale: 0.96, x: 4, y: 4, boxShadow: "0px 0px 0px 0px #1A1A1A" }}
              animate={{ backgroundColor: isLoading ? ["#C6CDB9", "#F6F5F2", "#CD2E3A", "#0047A0", "#C6CDB9"] : "#C6CDB9" }}
              transition={{ backgroundColor: isLoading ? { repeat: Infinity, duration: 0.6, ease: "linear" } : { duration: 0.1 } }}
              onClick={handleTranslate}
              disabled={isLoading || !englishWord.trim()}
              className="w-full text-[#1A1A1A] text-4xl font-bubbly font-extrabold py-5 border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-none disabled:opacity-70 disabled:cursor-not-allowed min-h-[64px] uppercase tracking-wider flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-10 h-10 animate-spin stroke-[4]" />
              ) : (
                'Translate!'
              )}
            </motion.button>
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
                    onClick={handleShowExample}
                    disabled={isLoadingExample}
                    className="w-full bg-[#D3D6CB] hover:bg-[#C2C5BA] text-[#1A1A1A] text-2xl font-bubbly font-extrabold py-5 px-6 border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-full transition-all duration-150 active:translate-x-[8px] active:translate-y-[8px] active:shadow-none disabled:opacity-70 flex items-center justify-center mb-8 min-h-[64px] uppercase"
                  >
                    {isLoadingExample ? (
                      <Loader2 className="w-8 h-8 mr-3 animate-spin stroke-[4]" />
                    ) : null}
                    Example Sentence
                  </button>
                )
              )}

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

        {isLensOpen && !showStampMachine && !lensHasCapture && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStampMachine(true)}
            className="fixed bottom-12 left-8 z-[9999] bg-[#E5E7EB] text-[#1A1A1A] w-[68px] h-[68px] rounded-xl border-[3px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex items-center justify-center overflow-hidden hover:bg-[#D1D5DB] transition-colors"
            title="Open Stamp Gallery"
          >
            <div className="absolute inset-1 border-[2px] border-dashed border-[#9CA3AF] rounded-md pointer-events-none"></div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="z-10 text-[#4B5563]">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </motion.button>
        )}

        {showStampMachine && <StampMachine onClose={() => setShowStampMachine(false)} />}

      </main>
    </>
  );
}