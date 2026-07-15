import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Loader2, Copy, Check, History, X, ArrowLeftRight, Download, Lightbulb, Camera } from 'lucide-react'; // Added Camera
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import SupremeLens from './SupremeLens'; // Added SupremeLens component

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

// Simple seeded random function to keep scrapbook layouts consistent across renders
const seededRandom = (seed: number) => {
  const x = Math.sin(seed + 1.1) * 10000;
  return x - Math.floor(x);
};

const renderDoodles = (idx: number) => {
  const elements = [];
  // Pass 1: Structural (Binder clips, Paper clips, Tape) - Top edge priority
  const doodle1 = generateSingleDoodle(idx, 1);
  if (doodle1) elements.push(doodle1);
  // Pass 2: Contextual Text (Torn paper scraps, Location pins, Stacked text)
  const doodle2 = generateSingleDoodle(idx, 2);
  if (doodle2) elements.push(doodle2);
  // Pass 3: Decorative SVGs (Thick stroke Stars, Smiley, Butterfly, Coffee, Hearts)
  const doodle3 = generateSingleDoodle(idx, 3);
  if (doodle3) elements.push(doodle3);
  // Pass 4: Wildcard Connectors (Dotted trails, Zig-zags bridging the photos)
  const doodle4 = generateSingleDoodle(idx, 4);
  if (doodle4) elements.push(doodle4);
  return elements;
};

const generateSingleDoodle = (idx: number, pass: number) => {
  const seed = idx * 100 + pass;
  const rand = seededRandom(seed);

  // Advanced Z-Index strategy: Mix of extreme under-layering, mid-layering, and top-clipping
  const zLayer = seededRandom(seed + 1);
  let zClass = 'z-0'; // Default bottom
  if (zLayer > 0.7) zClass = 'z-40'; // High overlap
  else if (zLayer > 0.4) zClass = 'z-20'; // Mid overlap

  const rotation = seededRandom(seed + 2) * 35 - 17.5;
  const fontPick = seededRandom(seed + 3) > 0.5 ? "'Gloria Hallelujah', cursive" : "'Permanent Marker', cursive";

  // ---------------------------------------------------------
  // PASS 1: STRUCTURAL BINDERS & TAPE (Top Edge Anchor)
  // ---------------------------------------------------------
  if (pass === 1) {
    if (rand < 0.15) return null; // 15% empty for breathing room
    const leftPos = '50%'; // Perfectly centered horizontally

    if (rand < 0.5) {
      // Premium Black Binder Clip (Awwwards/Editorial Vibe)
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
      // Elongated Paperclip
      return (
        <div key={seed} className="absolute z-50 pointer-events-none drop-shadow-md" style={{ top: '-6%', left: leftPos, transform: `translateX(-50%) rotate(${rotation}deg)` }}>
          <svg width="32" height="65" viewBox="0 0 40 80" fill="none" stroke="#1A1A1A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 25 20 L 25 60 C 25 75, 5 75, 5 60 L 5 15 C 5 5, 35 5, 35 15 L 35 70 C 35 90, -5 90, -5 70 L -5 30" />
          </svg>
        </div>
      );
    } else {
      // Raw Torn Tape Edge
      return (
        <div key={seed} className="absolute z-40 bg-[#F6F5F2]/80 backdrop-blur-md shadow-sm pointer-events-none border border-black/10 flex items-center justify-center overflow-hidden" style={{ width: '100px', height: '26px', top: '-4%', left: leftPos, transform: `translateX(-50%) rotate(${rotation}deg)` }}>
          <div className="w-full h-full opacity-15" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, #1A1A1A 3px, #1A1A1A 6px)' }}></div>
        </div>
      );
    }
  }

  // ---------------------------------------------------------
  // PASS 2: TYPOGRAPHY, SCRAPS, & LOCATION PINS
  // ---------------------------------------------------------
  if (pass === 2) {
    if (rand < 0.2) return null;
    const topPos = `${seededRandom(seed + 1) * 110 - 5}%`;
    const leftPos = `${seededRandom(seed + 2) * 120 - 10}%`;
    const textRand = seededRandom(seed + 4);

    if (textRand < 0.35) {
      // Contextual Pin / Timestamps
      const locations = ["📍 Wonosobo", "📍 Dieng", "10 Nov 2023", "📍 MNL", "company visit", "safety first"];
      const text = locations[Math.floor(seededRandom(seed + 5) * locations.length)];
      return (
        <div key={seed} className={`absolute ${zClass} text-[#1A1A1A] font-bold text-[16px] whitespace-nowrap pointer-events-none drop-shadow-md`} style={{ top: topPos, left: leftPos, transform: `rotate(${rotation * 0.6}deg)`, fontFamily: fontPick, letterSpacing: '0.5px' }}>
          {text}
        </div>
      );
    } else if (textRand < 0.65) {
      // Hand-cut Paper Scrap
      const notes = ["hot tea is necessary", "perlu kesini lagi", "a day in my life", "w/@linuu", "sehari jadi"];
      const text = notes[Math.floor(seededRandom(seed + 5) * notes.length)];
      return (
        <div key={seed} className={`absolute ${zClass} bg-[#F6F5F2] px-4 py-1.5 shadow-[3px_4px_8px_rgba(0,0,0,0.18)] pointer-events-none flex flex-col items-center border-[1px] border-[#1A1A1A]/10`} style={{ top: topPos, left: leftPos, transform: `rotate(${rotation}deg)` }}>
          <span className="text-[#1A1A1A] text-[14px] whitespace-nowrap font-black tracking-wide" style={{ fontFamily: "'Gloria Hallelujah', cursive" }}>{text}</span>
        </div>
      );
    } else {
      // Stacked Vertical Typography (Premium Streetwear alignment)
      return (
        <div key={seed} className={`absolute ${zClass} text-[#1A1A1A] font-black text-[15px] flex flex-col leading-[0.9] pointer-events-none opacity-90`} style={{ top: topPos, left: leftPos, transform: `rotate(${rotation}deg)`, fontFamily: "'Permanent Marker', cursive" }}>
          <span>how cool</span>
          <span>how cool</span>
          <span>how cool</span>
        </div>
      );
    }
  }

  // ---------------------------------------------------------
  // PASS 3: THICK STROKE PREMIUM SVGS
  // ---------------------------------------------------------
  if (pass === 3) {
    if (rand < 0.25) return null;
    const topPos = `${seededRandom(seed + 1) * 110 - 5}%`;
    const leftPos = `${seededRandom(seed + 2) * 120 - 10}%`;

    const doodleTypes = [
      // 0: Perfect Smiley 
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><circle cx="50" cy="50" r="42" /><path d="M 35 40 L 35 48 M 65 40 L 65 48" strokeWidth="7" /><path d="M 30 65 Q 50 82 70 65" strokeWidth="5.5" /></svg>,
      // 1: 3-Star Cluster
      <svg width="65" height="65" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 25 10 L 30 25 L 45 30 L 30 35 L 25 50 L 20 35 L 5 30 L 20 25 Z" /><path d="M 75 30 L 78 40 L 88 43 L 78 46 L 75 56 L 72 46 L 62 43 L 72 40 Z" strokeWidth="3.5" /><path d="M 50 65 L 52 72 L 59 74 L 52 76 L 50 83 L 48 76 L 41 74 L 48 72 Z" strokeWidth="3.5" /></svg>,
      // 2: Outline Butterfly
      <svg width="55" height="55" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M 50 20 L 50 80" strokeWidth="6.5" /><path d="M 50 35 C 10 10, 5 50, 50 50 Z" /><path d="M 50 35 C 90 10, 95 50, 50 50 Z" /><path d="M 50 50 C 20 50, 20 85, 50 75 Z" /><path d="M 50 50 C 80 50, 80 85, 50 75 Z" /><path d="M 50 20 Q 35 5 30 15 M 50 20 Q 65 5 70 15" strokeWidth="3.5" /></svg>,
      // 3: PH Sun 
      <svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><circle cx="50" cy="50" r="16" /><path d="M 50 5 L 50 24 M 50 95 L 50 76 M 5 50 L 24 50 M 95 50 L 76 50 M 18 18 L 31 31 M 82 82 L 69 69 M 18 82 L 31 69 M 82 18 L 69 31" strokeWidth="5.5" /></svg>,
      // 4: Minimalist Flower
      <svg width="45" height="45" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="50" cy="50" r="11" /><path d="M 50 40 C 30 -10, 70 -10, 50 40 Z" /><path d="M 50 60 C 30 110, 70 110, 50 60 Z" /><path d="M 40 50 C -10 30, -10 70, 40 50 Z" /><path d="M 60 50 C 110 30, 110 70, 60 50 Z" /></svg>,
      // 5: Coffee Cup
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M 25 40 L 25 70 C 25 85, 65 85, 65 70 L 65 40 Z" strokeWidth="5.5" /><path d="M 15 80 C 15 90, 75 90, 75 80" /><path d="M 65 45 C 80 45, 80 65, 65 65" strokeWidth="5" /><path d="M 35 30 Q 40 15 35 5 M 45 30 Q 50 15 45 5 M 55 30 Q 60 15 55 5" strokeWidth="3.5" /></svg>,
      // 6: Fluid Heart
      <svg width="38" height="38" viewBox="0 0 100 100" fill="none" stroke="#1A1A1A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 50 30 C 50 30 45 5 25 5 C -5 5 -5 45 50 95 C 105 45 105 5 75 5 C 55 5 50 30 50 30 Z" /></svg>
    ];

    const svg = doodleTypes[Math.floor(seededRandom(seed + 6) * doodleTypes.length)];
    return (
      <div key={seed} className={`absolute ${zClass} pointer-events-none drop-shadow-sm opacity-90`} style={{ top: topPos, left: leftPos, transform: `rotate(${rotation * 1.5}deg)` }}>
        {svg}
      </div>
    );
  }

  // ---------------------------------------------------------
  // PASS 4: SPATIAL CONNECTORS (Spanning multiple items)
  // ---------------------------------------------------------
  if (pass === 4) {
    if (rand < 0.45) return null;
    const topPos = `${seededRandom(seed + 1) * 80 + 10}%`;
    const leftPos = `${seededRandom(seed + 2) * 80 + 10}%`;
    const connectorRand = seededRandom(seed + 3);

    if (connectorRand < 0.35) {
      // Overlapping Smiley Face
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
      // Overlapping Butterfly
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
      // Directional Indicator Arrow
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

    // HQ Render
    canvas.width = targetW * 3; canvas.height = targetH * 3;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (facingMode === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
      ctx.drawImage(video, sX, sY, sW, sH, 0, 0, canvas.width, canvas.height);
      setHqImage(canvas.toDataURL('image/jpeg', 1.0));

      // Low-Res Render
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
    setTimeout(() => setPunchState('done'), 600); // Exact mechanical delay
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

      {/* Texture Layer for Scrapbook */}
      {activeTab === 'archive' && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      )}

      {/* Cartoon Sketch Close X */}
      <button onClick={onClose} className={`absolute top-8 right-8 z-50 transition-transform active:scale-90 ${activeTab === 'archive' ? 'text-[#1A1A1A] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]' : 'text-[#F6F5F2] hover:text-[#BF0D3E] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]'}`}>
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 20 20 L 80 80 M 80 20 L 20 80" />
        </svg>
      </button>

      <canvas ref={canvasRef} className="hidden" />

      {/* ---------------- CAMERA / MACHINE VIEW ---------------- */}
      {activeTab === 'camera' && (
        <div className="relative w-[340px] h-[420px] flex items-center justify-center mt-4">

          {/* Heavy Metallic Die-Punch Frame (Disappears instantly on 'done') */}
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

                    {/* Anti-Flicker: Instantly overlay the captured image during the punch hold */}
                    {hqImage && punchState === 'punching' && (
                      <img src={hqImage} className="absolute inset-0 w-full h-full object-cover z-10" alt="frozen frame" />
                    )}

                    {/* Fixed Scalloped Teeth Overlay - Removed active CSS to prevent glitching */}
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

          {/* Cartoon Flip Camera Button */}
          {punchState === 'viewfinder' && !hasCameraError && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setFacingMode(prev => prev === 'environment' ? 'user' : 'environment'); }}
              className="absolute -bottom-24 right-4 z-50 text-[#1A1A1A] bg-[#F6F5F2] border-[4px] border-[#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#FED141] transition-colors"
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

          {/* The Final Punched Stamp Output */}
          {hqImage && punchState === 'done' && (
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 1 }}
              animate={{ scale: 1.05, y: -20, rotate: -2, filter: 'drop-shadow(0px 30px 40px rgba(0,0,0,0.9))', opacity: 1 }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.6 }}
              className="absolute z-30 flex items-center justify-center"
            >
              {/* ISOLATED EXPORT WRAPPER: ref goes here to avoid transform clipping */}
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

      {/* ---------------- RETAKE / SAVE CONTROLS ---------------- */}
      {punchState === 'done' && activeTab === 'camera' && (
        <div className="mt-20 flex flex-row justify-center gap-5 w-full max-w-sm z-30 px-2">
          {/* RETAKE */}
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setHqImage(null); setArchiveImage(null); setPunchState('viewfinder'); }}
            className="w-[90px] h-[90px] bg-[#F6F5F2] text-[#1A1A1A] border-[4px] border-[#1A1A1A] rounded-[25px_10px_25px_10px/10px_25px_10px_25px] shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-col items-center justify-center gap-2 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 25 50 C 25 30 40 15 60 15 C 75 15 85 25 90 35" />
              <path d="M 90 20 L 90 35 L 75 35" />
              <path d="M 75 50 C 75 70 60 85 40 85 C 25 85 15 75 10 65" />
              <path d="M 10 80 L 10 65 L 25 65" />
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-widest leading-none" style={{ fontFamily: "'Mali', cursive" }}>Retake</span>
          </motion.button>

          {/* EXPORT */}
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="w-[90px] h-[90px] bg-[#1A1A1A] text-[#F6F5F2] border-[4px] border-[#1A1A1A] rounded-[10px_25px_10px_25px/25px_10px_25px_10px] shadow-[4px_4px_0px_0px_#F6F5F2] flex flex-col items-center justify-center gap-2 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 50 15 L 50 60" />
              <path d="M 30 40 L 50 60 L 70 40" />
              <path d="M 20 85 L 80 85" />
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-widest leading-none" style={{ fontFamily: "'Mali', cursive" }}>Export</span>
          </motion.button>

          {/* SAVE TO BOOK */}
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleSaveToArchive}
            className="w-[90px] h-[90px] bg-[#FED141] text-[#1A1A1A] border-[4px] border-[#1A1A1A] rounded-[20px_20px_20px_20px/20px_20px_20px_20px] shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-col items-center justify-center gap-2 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 15 25 C 25 15, 40 15, 50 25 C 60 15, 75 15, 85 25 L 85 80 C 75 70, 60 70, 50 80 C 40 70, 25 70, 15 80 Z" />
              <path d="M 50 25 L 50 80" />
              {/* Plus Sign */}
              <path d="M 32 45 L 32 65 M 22 55 L 42 55" />
              {/* Squiggles */}
              <path d="M 60 45 Q 68 40 75 45 M 60 60 Q 68 55 75 60" />
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-widest leading-none" style={{ fontFamily: "'Mali', cursive" }}>Save</span>
          </motion.button>
        </div>
      )}

      {/* ---------------- SCRAPBOOK ARCHIVE VIEW ---------------- */}
      {activeTab === 'archive' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
          className="absolute inset-0 pt-24 pb-36 px-4 overflow-y-auto flex flex-col items-center z-20"
        >
          <div className="relative mb-12">
            <h2 className="text-[#1A1A1A] font-black text-[2.5rem] uppercase tracking-widest text-center" style={{ fontFamily: "'Permanent Marker', cursive", transform: 'rotate(-2deg)' }}>
              Collections
            </h2>
            <div
              className="absolute -bottom-6 left-1/2 bg-[#1A1A1A] text-[#F4F0EB] text-xs font-black uppercase tracking-widest px-4 py-1"
              style={{ transform: 'translateX(-50%) rotate(2deg)' }}
            >
              {archive.length}/{MAX_ARCHIVE} Memories
            </div>
          </div>

          {archive.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-[4px] border-dashed border-[#1A1A1A]/30 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] w-full max-w-sm mt-8 transform rotate-1">
              <p className="text-[#1A1A1A]/50 font-black text-center uppercase tracking-widest leading-relaxed">No stamps collected yet.<br />Punch some memories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 w-full max-w-2xl px-2">
              {archive.map((entry, idx) => (
                <React.Fragment key={idx}>
                  {(idx === 0 || archive[idx - 1].date !== entry.date) && (
                    <div className="col-span-2 sm:col-span-3 w-full text-left mt-6 mb-2 pb-2 relative overflow-visible">
                      <span className="text-[#1A1A1A] font-bold text-lg uppercase tracking-widest inline-block" style={{ fontFamily: "'Mali', cursive", transform: 'rotate(-1deg)' }}>
                        {entry.date}
                      </span>
                      {/* Pen Scribbled Line */}
                      <svg className="absolute bottom-0 left-0 w-full h-2 opacity-30" preserveAspectRatio="none" viewBox="0 0 100 10" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 2 5 C 20 2, 40 8, 60 4 C 80 0, 95 6, 98 4" />
                      </svg>
                    </div>
                  )}
                  <div className="flex flex-col items-center relative z-10">
                    {/* Random Scrapbook Doodles! */}
                    {renderDoodles(idx)}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedStampIndex(idx)}
                      className="relative aspect-[260/340] w-full flex items-center justify-center drop-shadow-[4px_6px_8px_rgba(0,0,0,0.15)] hover:scale-105 hover:z-50 transition-transform cursor-pointer"
                      style={{ transform: `rotate(${seededRandom(idx * 8) * 6 - 3}deg)` }}
                    >
                      {/* Masking Tape Overlay - Only show if Pass 1 didn't generate a top binder/clip */}
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

      {/* ---------------- CENTERED BOTTOM NAVIGATION BAR ---------------- */}
      {punchState !== 'punching' && (
        <div className="absolute inset-x-0 bottom-8 flex justify-center z-[9999] pointer-events-none">
          <div className="flex bg-[#E5E7EB] border-[4px] border-[#1A1A1A] rounded-full p-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] pointer-events-auto">
            <button
              onClick={() => { setActiveTab('camera'); setPunchState('viewfinder'); setHqImage(null); }}
              className={`w-[120px] flex items-center justify-center gap-2 py-3 rounded-full transition-colors duration-200 ${activeTab === 'camera' ? 'bg-[#1A1A1A] text-[#F6F5F2]' : 'text-[#1A1A1A] hover:bg-[#D1D5DB]'}`}
            >
              {/* Cartoon Sketch Stamp Icon */}
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                {/* Stamp Base */}
                <path d="M 20 80 Q 50 90 80 80 L 80 65 L 20 65 Z" />
                {/* Stamp Stem */}
                <path d="M 40 65 L 45 35 M 60 65 L 55 35" />
                {/* Stamp Knob */}
                <path d="M 35 35 L 65 35 C 70 15, 30 15, 35 35 Z" />
              </svg>
              <span className="text-[14px] font-bold uppercase tracking-widest mt-1" style={{ fontFamily: "'Mali', cursive", transform: 'rotate(-2deg)' }}>Stamp</span>
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`w-[120px] flex items-center justify-center gap-2 py-3 rounded-full transition-colors duration-200 ${activeTab === 'archive' ? 'bg-[#1A1A1A] text-[#F6F5F2]' : 'text-[#1A1A1A] hover:bg-[#D1D5DB]'}`}
            >
              {/* Cartoon Sketch Book Icon */}
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 15 25 C 25 15, 40 15, 50 25 C 60 15, 75 15, 85 25 L 85 80 C 75 70, 60 70, 50 80 C 40 70, 25 70, 15 80 Z" />
                <path d="M 50 25 L 50 80" />
                <path d="M 25 45 Q 32 40 40 45" />
                <path d="M 25 60 Q 32 55 40 60" />
                <path d="M 60 45 Q 68 40 75 45" />
                <path d="M 60 60 Q 68 55 75 60" />
              </svg>
              <span className="text-[14px] font-bold uppercase tracking-widest mt-1" style={{ fontFamily: "'Mali', cursive", transform: 'rotate(2deg)' }}>Book</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- STAMP ZOOM MODAL ---------------- */}
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
              {/* Larger Stamp Display */}
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

              {/* Action Buttons */}
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
                  {/* Cartoon Download Icon */}
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
                  {/* Cartoon Trash Icon */}
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
const Sampaguita = () => (
  <motion.svg width="120" height="120" viewBox="0 0 100 100"
    animate={{ rotate: [0, 5, -5, 0], scale: [0.98, 1.05, 0.98] }}
    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    className="overflow-visible"
  >
    {/* Petals */}
    <g fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round">
      {[0, 72, 144, 216, 288].map(angle => (
        <path key={angle} d="M 50 50 C 15 -15, 85 -15, 50 50" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
      ))}
    </g>

    {/* Spikes / Stamen */}
    <g stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round">
      {[36, 108, 180, 252, 324].map(angle => (
        <line key={angle} x1="50" y1="50" x2="50" y2="20" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
      ))}
    </g>

    {/* Center Face */}
    <circle cx="50" cy="50" r="18" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" />

    {/* Blushes */}
    <circle cx="38" cy="53" r="3" fill="#FFB6C1" />
    <circle cx="62" cy="53" r="3" fill="#FFB6C1" />

    {/* Eyes */}
    <ellipse cx="43" cy="47" rx="3.5" ry="5.5" fill="#1A1A1A" />
    <ellipse cx="57" cy="47" rx="3.5" ry="5.5" fill="#1A1A1A" />

    {/* Eye Highlights */}
    <circle cx="42" cy="45" r="1.5" fill="#FFF" />
    <circle cx="56" cy="45" r="1.5" fill="#FFF" />

    {/* Smile */}
    <path d="M 41 55 Q 50 63 59 55" fill="none" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" />
  </motion.svg>
);

const Butterfly = () => (
  <motion.svg width="90" height="90" viewBox="0 0 100 100"
    animate={{ y: [0, -8, 0], rotate: [-2, 4, -2] }}
    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
    <path d="M 50 50 C 20 20, 10 50, 45 55 C 10 70, 30 90, 50 60 C 70 90, 90 70, 55 55 C 90 50, 80 20, 50 50 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="5" strokeLinejoin="round" />
    <circle cx="35" cy="40" r="4" fill="#1A1A1A" />
    <circle cx="65" cy="40" r="4" fill="#1A1A1A" />
    <circle cx="40" cy="70" r="3" fill="#1A1A1A" />
    <circle cx="60" cy="70" r="3" fill="#1A1A1A" />
    <rect x="47" y="35" width="6" height="40" rx="3" fill="#1A1A1A" />
    <path d="M 48 35 Q 40 20 35 25 M 52 35 Q 60 20 65 25" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
);

const CartoonCamera = () => (
  <motion.svg width="90" height="90" viewBox="0 0 100 100"
    whileHover={{ scale: 1.05, rotate: 3 }}
    whileTap={{ scale: 0.95, rotate: -5 }}
    className="overflow-visible"
  >
    {/* Red Shutter Button */}
    <path d="M 22 42 L 34 38 L 32 33 L 20 37 Z" fill="#EF4444" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />

    {/* Camera Body */}
    <path d="M 16 46 C 16 42, 28 38, 38 34 C 44 28, 52 28, 58 34 C 68 38, 84 42, 84 46 C 88 60, 86 74, 80 78 C 70 84, 30 84, 20 78 C 12 74, 12 60, 16 46 Z" fill="#2C2825" stroke="#1A1A1A" strokeWidth="5" strokeLinejoin="round" />

    {/* Yellow Flash */}
    <rect x="68" y="48" width="6" height="4" rx="2" fill="#EAB308" />

    {/* Lens Outer Grey Ring */}
    <circle cx="48" cy="58" r="20" fill="#6B7280" stroke="#1A1A1A" strokeWidth="4" />

    {/* Lens Inner Blue Glass */}
    <circle cx="48" cy="58" r="14" fill="#38BDF8" stroke="#1A1A1A" strokeWidth="3" />

    {/* Glass Glare / Scribbles */}
    <path d="M 40 52 C 45 49, 52 52, 54 54" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    <path d="M 38 58 C 42 56, 48 59, 48 59" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
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

const PHFlag = ({ className = "" }: { className?: string }) => (
  <svg width="32" height="24" viewBox="0 0 28 20" className={`inline-block rounded-[3px] shadow-[2px_2px_0px_0px_#1A1A1A] bg-white ${className}`}>
    <rect width="28" height="10" fill="#3b82f6" />
    <rect y="10" width="28" height="10" fill="#ef4444" />
    <polygon points="-2,-2 14,10 -2,22" fill="white" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="4.5" cy="10" r="2.5" fill="#eab308" stroke="#1A1A1A" strokeWidth="1" />
    <rect width="28" height="20" fill="none" stroke="#1A1A1A" strokeWidth="4" />
  </svg>
);

// --- SVGs for Baybayin Mode ---
const TribalSun = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-80">
    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="50" cy="50" r="8" fill="currentColor" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <path key={angle} d="M 50 30 L 50 10 M 45 15 L 50 10 L 55 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
    ))}
  </svg>
);

const TribalPetroglyph1 = () => (
  <svg width="100" height="150" viewBox="0 0 100 150" className="text-[#2C2825] opacity-15">
    {/* Wave & Sun Motif */}
    <path d="M 20 40 L 35 55 L 50 40 L 65 55 L 80 40 M 20 55 L 35 70 L 50 55 L 65 70 L 80 55" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="100" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
      <line key={angle} x1="50" y1="80" x2="50" y2="72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: '50px 100px', transform: `rotate(${angle}deg)` }} />
    ))}
    <path d="M 40 10 L 50 20 L 60 10 M 50 20 L 50 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TribalPetroglyph2 = () => (
  <svg width="80" height="180" viewBox="0 0 80 180" className="text-[#2C2825] opacity-15">
    {/* Centipede (Alupihan) & Diamond Motif */}
    <path d="M 40 20 L 25 35 M 40 20 L 55 35 M 40 35 L 25 50 M 40 35 L 55 50 M 40 50 L 25 65 M 40 50 L 55 65 M 40 20 L 40 65" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 40 90 L 55 105 L 40 120 L 25 105 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="40" cy="105" r="4" fill="currentColor" />
    <path d="M 30 140 L 40 130 L 50 140 M 30 155 L 40 145 L 50 155 M 30 170 L 40 160 L 50 170 M 40 130 L 40 170" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Baybayin Converter Logic ---
const toBaybayin = (text: string) => {
  if (!text) return "";
  let str = text.toLowerCase();
  str = str.replace(/f/g, 'p').replace(/v/g, 'b').replace(/z/g, 's').replace(/j/g, 'dy').replace(/c/g, 'k').replace(/x/g, 'ks').replace(/q/g, 'k');
  const vowels: Record<string, string> = { 'a': '\u1700', 'e': '\u1701', 'i': '\u1701', 'o': '\u1702', 'u': '\u1702' };
  const consonants: Record<string, string> = { 'k': '\u1703', 'g': '\u1704', 'ng': '\u1705', 't': '\u1706', 'd': '\u1707', 'r': '\u1707', 'n': '\u1708', 'p': '\u1709', 'b': '\u170A', 'm': '\u170B', 'y': '\u170C', 'l': '\u170E', 'w': '\u170F', 's': '\u1710', 'h': '\u1711' };
  let result = ""; let i = 0;
  while (i < str.length) {
    let char = str[i];
    let nextChar = str[i + 1]; let twoChar = char + (nextChar || "");

    if (twoChar === 'ng' && consonants['ng']) {
      let third = str[i + 2];
      if (vowels[third]) {
        if (third === 'a') result += consonants['ng'];
        else if (third === 'e' || third === 'i') result += consonants['ng'] + '\u1712';
        else if (third === 'o' || third === 'u') result += consonants['ng'] + '\u1713';
        i += 3;
      } else { result += consonants['ng'] + '\u1714'; i += 2; }
      continue;
    }
    if (consonants[char]) {
      if (vowels[nextChar]) {
        if (nextChar === 'a') result += consonants[char];
        else if (nextChar === 'e' || nextChar === 'i') result += consonants[char] + '\u1712';
        else if (nextChar === 'o' || nextChar === 'u') result += consonants[char] + '\u1713';
        i += 2;
      } else {
        result += consonants[char] + '\u1714'; i += 1;
      }
    } else if (vowels[char]) {
      result += vowels[char]; i += 1;
    }
    else { result += char; i += 1; }
  }
  return result;
};

const PhParticles = ({ triggerKey }: { triggerKey: string }) => (
  <div key={triggerKey} className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
    {/* Left Star */}
    <motion.svg initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 1 }} animate={{ scale: [0, 1.5, 1.5, 0], x: -80, y: -50, rotate: -120, opacity: [1, 1, 1, 0] }} transition={{ duration: 0.7, ease: "easeOut" }} className="absolute w-8 h-8 text-[#FED141] fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></motion.svg>
    {/* Right Star */}
    <motion.svg initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 1 }} animate={{ scale: [0, 1.5, 1.5, 0], x: 80, y: -50, rotate: 120, opacity: [1, 1, 1, 0] }} transition={{ duration: 0.7, ease: "easeOut" }} className="absolute w-8 h-8 text-[#FED141] fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></motion.svg>
    {/* Top Sun */}
    <motion.svg initial={{ scale: 0, y: 0, rotate: -45, opacity: 1 }} animate={{ scale: [0, 2, 2, 0], y: -90, rotate: 45, opacity: [1, 1, 1, 0] }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute w-12 h-12 text-[#FED141] fill-current" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="20" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
        <polygon key={angle} points="50,15 54,28 46,28" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
      ))}
    </motion.svg>
  </div>
);

export default function App() {
  // App Mode State
  const [appMode, setAppMode] = useState<'translator' | 'baybayin'>('translator');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextMode, setNextMode] = useState<'translator' | 'baybayin'>('translator');

  // Lens State (Added for Supreme Lens)
  const [isLensOpen, setIsLensOpen] = useState(false);
  const [showStampMachine, setShowStampMachine] = useState(false);
  const [lensHasCapture, setLensHasCapture] = useState(false);

  // Translator States
  const [englishWord, setEnglishWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fun Fact States
  const [funFact, setFunFact] = useState<string | null>(null);
  const [isLoadingFunFact, setIsLoadingFunFact] = useState(false);

  const [example, setExample] = useState<{ tagalogSentence?: string; englishTranslation?: string } | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [exampleAudioUrl, setExampleAudioUrl] = useState<string | null>(null);

  const [isCopied, setIsCopied] = useState(false);
  const [isExampleCopied, setIsExampleCopied] = useState(false);

  const [history, setHistory] = useState<{ english: string, tagalog: string, direction?: 'en-tl' | 'tl-en' }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [direction, setDirection] = useState<'en-tl' | 'tl-en'>('en-tl');
  const [inputMode, setInputMode] = useState<'word' | 'conversation'>('word');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [exampleCooldown, setExampleCooldown] = useState<number | null>(null);

  // Baybayin States
  const [baybayinMode, setBaybayinMode] = useState<'encode' | 'decode'>('encode');
  const [decodeTarget, setDecodeTarget] = useState<'TL' | 'EN'>('TL');
  const [decodedCache, setDecodedCache] = useState<{ TL?: string, EN?: string }>({});
  const [isDecoding, setIsDecoding] = useState(false);

  const [baybayinInput, setBaybayinInput] = useState('');
  const [baybayinOutput, setBaybayinOutput] = useState('');
  const [isBaybayinCopied, setIsBaybayinCopied] = useState(false);

  const [isArtMode, setIsArtMode] = useState(false);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [artBgIndex, setArtBgIndex] = useState(1);

  const [baybayinHistory, setBaybayinHistory] = useState<{ input: string, output: string }[]>([]);
  const [showBaybayinHistory, setShowBaybayinHistory] = useState(false);

  const englishSuggestions = ['hello', 'how are you?', 'thank you', 'good morning', 'I love you'];
  const tagalogSuggestions = ['kumusta', 'salamat', 'magandang umaga', 'mahal kita', 'paalam'];

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

  const currentPlaceholder = direction === 'en-tl'
    ? englishSuggestions[placeholderIndex % englishSuggestions.length]
    : tagalogSuggestions[placeholderIndex % tagalogSuggestions.length];

  const handleModeSwitch = (mode: 'translator' | 'baybayin') => {
    if (mode === appMode) return;
    setNextMode(mode);
    setIsTransitioning(true);
    setTimeout(() => {
      setAppMode(mode);
      setIsTransitioning(false);
    }, 800);
  };

  const handleSwap = () => {
    setDirection(prev => prev === 'en-tl' ? 'tl-en' : 'en-tl');
    setEnglishWord(''); // New strict clear
    setTranslation('');
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
    setExample(null);
    setFunFact(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);
  };

  const handleGenerateBaybayin = () => {
    if (!baybayinInput.trim()) return;
    const output = toBaybayin(baybayinInput);
    setBaybayinOutput(output);
    setBaybayinHistory(prev => [{ input: baybayinInput, output: output }, ...prev]);
    setIsArtMode(false);
  };

  const handleDecodeBaybayin = async (targetOverride?: 'TL' | 'EN') => {
    if (!baybayinInput.trim()) return;

    const target = targetOverride || decodeTarget;
    if (targetOverride) setDecodeTarget(target);

    if (decodedCache[target]) {
      setBaybayinOutput(decodedCache[target]!);
      return;
    }

    setIsDecoding(true);
    setBaybayinOutput('');
    try {
      const direction = target === 'TL' ? 'bay-tl' : 'bay-en';
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: baybayinInput, direction })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.translation) {
        setDecodedCache(prev => ({ ...prev, [target]: data.translation }));
        setBaybayinOutput(data.translation);
        if (!targetOverride) {
          setBaybayinHistory(prev => [{ input: baybayinInput, output: data.translation }, ...prev]);
        }
        setIsArtMode(false);
      }
    } catch (error: any) {
      console.error('Decode error:', error);
      if (error.message === 'server_busy') {
        setBaybayinOutput("ORACLE OVERLOADED: GOOGLE SERVERS BUSY. PLEASE TRY AGAIN LATER.");
      } else if (error.message === 'rate_limited') {
        setBaybayinOutput("Error: Rate Limited");
      } else {
        setBaybayinOutput("Error communicating with the oracle.");
      }
    } finally {
      setIsDecoding(false);
    }
  };

  const baybayinRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = () => {
    if (!baybayinRef.current) return;
    toPng(baybayinRef.current, { 
      cacheBust: true, 
      pixelRatio: 4, 
      // skipFonts removed to allow Baybayin font embedding
      style: { transform: 'scale(1) rotate(0deg) translateY(0px)' } 
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `sinaunang-baybayin-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Failed to export image', err));
  };

  const handleMorphToArt = () => {
    if (isArtMode) return;
    setIsGeneratingArt(true);
    // Fake loading sequence
    setTimeout(() => {
      setArtBgIndex(Math.floor(Math.random() * 11) + 1);
      setIsArtMode(true);
      setIsGeneratingArt(false);
    }, 3500); // 3.5 second anticipation
  };

  const handleCopyBaybayin = async () => {
    if (!baybayinOutput) return;
    try {
      await navigator.clipboard.writeText(baybayinOutput);
      setIsBaybayinCopied(true);
      setTimeout(() => setIsBaybayinCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
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
    if (!example?.tagalogSentence) return;
    try {
      await navigator.clipboard.writeText(example.tagalogSentence);
      setIsExampleCopied(true);
      setTimeout(() => setIsExampleCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const prefetchAudio = async (text: string, setter: React.Dispatch<React.SetStateAction<string | null>>, lang: string = 'fil-PH') => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang })
      });
      if (res.ok) {
        const blob = await res.blob();
        setter(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error('Audio prefetch failed', err);
    }
  };

  const fetchFunFact = async (english: string, tagalog: string) => {
    setIsLoadingFunFact(true);
    setFunFact(null);
    try {
      const res = await fetch('/api/funfact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ englishWord: english, tagalogWord: tagalog })
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
        setHistory(prev => {
          const newEntry = { english: englishWord, tagalog: data.translation, direction };
          const filtered = prev.filter(item => item.english.toLowerCase() !== englishWord.toLowerCase());
          return [newEntry, ...filtered].slice(0, 10);
        });

        prefetchAudio(data.translation, setAudioUrl, direction === 'en-tl' ? 'fil-PH' : 'en-US');
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
    recognition.lang = direction === 'en-tl' ? 'en-US' : 'fil-PH';
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
          englishWord: direction === 'en-tl' ? englishWord : translation,
          tagalogWord: direction === 'tl-en' ? englishWord : translation,
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
      const targetSentence = data.targetSentence || data.tagalogSentence;

      if (targetSentence) {
        setExample({
          tagalogSentence: targetSentence,
          englishTranslation: data.sourceTranslation || data.englishTranslation
        });
        prefetchAudio(targetSentence, setExampleAudioUrl, direction === 'en-tl' ? 'fil-PH' : 'en-US');
      }
    } catch (error) {
      console.error('Example generation error:', error);
    } finally {
      setIsLoadingExample(false);
    }
  };

  return (
    <>
      <h1 className="sr-only">Baybayin Translate — Elite Tagalog & Filipino Image Translator</h1>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Permanent+Marker&family=Knewave&family=Neucha&display=swap');
          .font-title { font-family: 'Permanent Marker', cursive; }
          .font-box { font-family: 'Gloria Hallelujah', cursive; }
          .font-tribal-title { font-family: 'Knewave', cursive; }
          .font-tribal-text { font-family: 'Neucha', cursive; }
        `}
      </style>

      {/* Loading Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${nextMode === 'baybayin' ? 'bg-[#12100E]' : 'bg-[#EEF2FF]'}`}
          >
            {nextMode === 'baybayin' ? (
              <div className="flex flex-col items-center text-white">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
                  className="mb-8"
                >
                  <TribalSun />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="font-tribal-title text-2xl tracking-[0.2em] opacity-80"
                >
                  PAG-UKIT NG BAYBAYIN...
                </motion.p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-[#1A1A1A]">
                <motion.div
                  animate={{ y: [0, -20, 0], scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="mb-8 bg-white border-[6px] border-[#1A1A1A] p-6 rounded-[20px] shadow-[8px_8px_0px_0px_#1A1A1A]"
                >
                  <Sparkle />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="font-black text-2xl uppercase tracking-widest text-center"
                >
                  RETURNING TO TAGALOG SUPREME TRANSLATOR...
                </motion.p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Container */}
      <main
        className={`min-h-[100dvh] font-sans p-6 pb-[calc(4.5rem+env(safe-area-inset-bottom))] flex flex-col items-center justify-start overflow-x-hidden relative ${appMode === 'translator' ? 'text-[#1A1A1A] selection:bg-[#93C5FD]' : 'text-[#2C2825] selection:bg-[#D4C3A3]'}`}
      >
        <motion.div
          className="fixed inset-0 -z-10 pointer-events-none"
          animate={isGeneratingArt ? {
            filter: "invert(1) hue-rotate(180deg)",
            backgroundPositionY: ["0px", "100px", "0px", "-100px", "0px"]
          } : {
            filter: "invert(0) hue-rotate(0deg)",
            backgroundPositionY: "0px"
          }}
          transition={isGeneratingArt ? {
            backgroundPositionY: { repeat: Infinity, duration: 3.5, ease: "linear" },
            filter: { duration: 0.4 }
          } : { duration: 0.4 }}
          style={appMode === 'translator'
            ? { backgroundColor: '#EEF2FF', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0zM20 20h20v20H20z\' fill=\'%23E0E7FF\' fill-opacity=\'0.6\'/%3E%3C/svg%3E")' }
            : { backgroundColor: '#F6F5F2', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'240\' height=\'240\' viewBox=\'0 0 240 240\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg stroke=\'%232C2825\' stroke-width=\'2\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\' opacity=\'0.06\'%3E%3Ccircle cx=\'120\' cy=\'120\' r=\'12\'/%3E%3Cpath d=\'M 120 100 L 120 92 M 120 140 L 120 148 M 100 120 L 92 120 M 140 120 L 148 120\' stroke-width=\'3\'/%3E%3Cpath d=\'M 106 106 L 98 98 M 134 134 L 142 142 M 106 134 L 98 142 M 134 106 L 142 98\' stroke-width=\'2\'/%3E%3Cpath d=\'M 110 70 L 120 80 L 130 70 M 110 60 L 120 70 L 130 60 M 110 50 L 120 60 L 130 50\'/%3E%3Cpath d=\'M 110 170 L 120 160 L 130 170 M 110 180 L 120 170 L 130 180 M 110 190 L 120 180 L 130 190\'/%3E%3Cpath d=\'M 40 100 L 50 110 L 40 120 L 30 110 Z\'/%3E%3Cpath d=\'M 40 130 L 50 140 L 40 150 L 30 140 Z\'/%3E%3Cpath d=\'M 25 80 L 35 90 L 45 80 L 55 90 M 25 90 L 35 100 L 45 90 L 55 100\'/%3E%3Cpath d=\'M 200 100 L 210 110 L 200 120 L 190 110 Z\'/%3E%3Cpath d=\'M 200 130 L 210 140 L 200 150 L 190 140 Z\'/%3E%3Cpath d=\'M 185 80 L 195 90 L 205 80 L 215 90 M 185 90 L 195 100 L 205 90 L 215 100\'/%3E%3Ccircle cx=\'120\' cy=\'30\' r=\'1.5\' fill=\'%232C2825\'/%3E%3Ccircle cx=\'120\' cy=\'210\' r=\'1.5\' fill=\'%232C2825\'/%3E%3Ccircle cx=\'40\' cy=\'60\' r=\'1.5\' fill=\'%232C2825\'/%3E%3Ccircle cx=\'200\' cy=\'190\' r=\'1.5\' fill=\'%232C2825\'/%3E%3C/g%3E%3C/svg%3E"), url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")' }
          }
        />

        {/* Top Controls */}
        <div className="w-full max-w-4xl flex justify-between items-center z-40 mb-2 relative">
          <button
            onClick={() => handleModeSwitch(appMode === 'translator' ? 'baybayin' : 'translator')}
            className={`flex items-center justify-center w-12 h-12 transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none rounded-[255px_15px_225px_15px/15px_225px_15px_255px] ${appMode === 'translator'
              ? 'bg-[#1A1A1A] border-[4px] border-[#1A1A1A] text-[#FED141] shadow-[4px_4px_0px_0px_#0032A0] hover:bg-gray-800'
              : 'bg-[#F6F5F2] border-[4px] border-[#2C2825] text-[#2C2825] shadow-[4px_4px_0px_0px_#2C2825] hover:bg-[#EAE6DF]'
              }`}
            title={appMode === 'translator' ? 'Reveal the past...' : 'Return to translator'}
          >
            {appMode === 'translator' ? (
              <svg width="26" height="26" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 50 15 Q 60 35 85 50 Q 60 65 50 85 Q 40 65 15 50 Q 40 35 50 15 Z" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
                <path d="M 30 30 Q 35 35 40 40" />
                <path d="M 70 30 Q 65 35 60 40" />
                <path d="M 30 70 Q 35 65 40 60" />
                <path d="M 70 70 Q 65 65 60 60" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 50 45 Q 60 10 70 20 Q 60 35 55 50" />
                <path d="M 55 50 Q 90 30 85 45 Q 65 55 50 55" />
                <path d="M 50 55 Q 80 85 65 90 Q 45 65 45 50" />
                <path d="M 45 50 Q 15 80 10 65 Q 35 45 50 45" />
                <path d="M 50 45 Q 15 15 30 10 Q 45 35 55 50" />
                <circle cx="50" cy="50" r="12" fill="currentColor" />
              </svg>
            )}
          </button>

          {appMode === 'translator' ? (
            <button
              onClick={() => setShowHistory(true)}
              className="w-12 h-12 bg-white border-[4px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-gray-50"
              title="History"
            >
              <History className="w-5 h-5 stroke-[4] text-[#1A1A1A]" />
            </button>
          ) : (
            <button
              onClick={() => setShowBaybayinHistory(true)}
              className="w-12 h-12 bg-[#F6F5F2] border-[4px] border-[#2C2825] shadow-[4px_4px_0px_0px_#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-[#EAE6DF]"
              title="Baybayin History"
            >
              <History className="w-6 h-6 stroke-[3] text-[#2C2825]" />
            </button>
          )}
        </div>

        {/* History Modal (Translator) */}
        {showHistory && appMode === 'translator' && (
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
                      setDirection(item.direction || 'en-tl');
                      setEnglishWord(item.english);
                      setTranslation(item.tagalog);
                      setShowHistory(false);
                      setExample(null);
                      setFunFact(null);
                      setAudioUrl(null);
                      setExampleAudioUrl(null);
                    }}>
                      <span className="text-sm font-black text-gray-500 uppercase">{item.direction === 'tl-en' ? 'Tagalog' : 'English'}: {item.english}</span>
                      <span className="text-xl font-box text-[#1A1A1A]">{item.tagalog}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Modal (Baybayin) */}
        {showBaybayinHistory && appMode === 'baybayin' && (
          <div className="fixed inset-0 bg-[#F6F5F2]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#F6F5F2] border-[6px] border-[#2C2825] shadow-[12px_12px_0px_0px_#2C2825] rounded-[255px_25px_225px_25px/25px_225px_25px_255px] p-6 w-full max-w-md relative max-h-[80vh] flex flex-col">
              <button
                onClick={() => setShowBaybayinHistory(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-[#F6F5F2] border-[4px] border-[#2C2825] shadow-[4px_4px_0px_0px_#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-[#EAE6DF] z-10"
              >
                <X className="w-6 h-6 stroke-[3] text-[#2C2825]" />
              </button>
              <h2 className="text-2xl font-tribal-title text-[#2C2825] mb-6 uppercase tracking-wider pr-12">Script History</h2>
              <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                {baybayinHistory.length === 0 ? (
                  <p className="text-[#2C2825]/60 font-tribal-text text-xl text-center italic py-8 uppercase tracking-widest">No scripts carved yet.</p>
                ) : (
                  baybayinHistory.map((item, index) => (
                    <div key={index} className="bg-[#F6F5F2] border-[4px] border-[#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-4 flex flex-col gap-2 cursor-pointer hover:bg-[#EAE6DF] transition-colors" onClick={() => {
                      setBaybayinInput(item.input);
                      setBaybayinOutput(item.output);
                      setShowBaybayinHistory(false);
                    }}>
                      <span className="text-lg font-tribal-text text-[#2C2825]/60 uppercase tracking-widest">{item.input}</span>
                      <span className="text-4xl text-[#2C2825] text-left" style={{ fontFamily: "'Noto Sans Tagalog', sans-serif" }}>{item.output}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Translator Mode Layout */}
        {appMode === 'translator' && (
          <div className="w-full max-w-md z-10 flex flex-col items-center pt-4 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="w-full flex flex-col items-center justify-center relative mb-12 mt-6 select-none">
              <div className="relative inline-block transform -rotate-3 text-center">
                <div className="absolute -top-14 -left-12 sm:-top-20 sm:-left-16 z-0 pointer-events-none">
                  <Sampaguita />
                </div>
                <h1
                  className="text-[2.9rem] sm:text-[4rem] md:text-[5.5rem] font-title leading-[1.05] tracking-normal sm:tracking-wide relative z-10"
                  style={{
                    filter: 'drop-shadow(6px 6px 0px #1A1A1A)',
                    WebkitTextStroke: '3px #1A1A1A'
                  }}
                >
                  <span className="text-[#0032A0]">TAGALOG</span><br />
                  <span className="text-[#BF0D3E]">TRANSLATOR</span><br />
                  <span className="text-[#FED141]">SUPREME</span>
                </h1>
              </div>
            </div>

            {/* Input Box */}
            <div className="w-full space-y-3 z-10 relative mb-8">
              <div className="flex bg-[#F6F5F2] border-[4px] border-[#1A1A1A] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] p-1 mb-4 shadow-[4px_4px_0px_0px_#1A1A1A] self-start z-10 w-full sm:w-auto">
                <button onClick={() => handleInputModeChange('word')} className={`flex-1 px-4 py-2 text-sm font-black uppercase rounded-lg transition-colors ${inputMode === 'word' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-gray-200'}`}>Word</button>
                <button onClick={() => handleInputModeChange('conversation')} className={`flex-1 px-4 py-2 text-sm font-black uppercase rounded-lg transition-colors ${inputMode === 'conversation' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-gray-200'}`}>Conversation</button>
              </div>
              <div className="flex items-center justify-between px-2 mb-2">
                <AnimatePresence mode="wait">
                  <motion.label
                    key={direction}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    htmlFor="english-input"
                    className="text-xl font-black text-white tracking-widest uppercase"
                    style={{ textShadow: '3px 3px 0px #1A1A1A', WebkitTextStroke: '1.5px #1A1A1A' }}
                  >
                    {direction === 'en-tl' ? 'English Word' : 'Tagalog Word'}
                  </motion.label>
                </AnimatePresence>
                <button
                  onClick={handleSwap}
                  className="flex items-center justify-center gap-2 bg-[#FFE5B4] border-[3px] border-[#1A1A1A] rounded-[10px_20px_10px_20px/20px_10px_20px_10px] px-3 py-2 text-sm font-black uppercase hover:bg-[#FFDAB9] active:translate-y-[2px] active:translate-x-[2px] shadow-[3px_3px_0px_0px_#1A1A1A] active:shadow-none transition-all"
                  title="Swap Translation Direction"
                >
                  {direction === 'en-tl' ? (
                    <><UKFlag className="-rotate-3" /> EN <ArrowLeftRight className="w-4 h-4 stroke-[3]" /> <PHFlag className="rotate-3" /> TL</>
                  ) : (
                    <><PHFlag className="-rotate-3" /> TL <ArrowLeftRight className="w-4 h-4 stroke-[3]" /> <UKFlag className="rotate-3" /> EN</>
                  )}
                </button>
              </div>
              <div className="bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-6 flex items-center relative min-h-[100px]">
                <textarea
                  id="english-input"
                  value={englishWord}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (inputMode === 'conversation' && val.length > 500) return;
                    setEnglishWord(val);
                    setErrorMsg(null);
                    if (val.trim() === '') {
                      setTranslation('');
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
                  className={`flex-1 bg-transparent outline-none placeholder:text-gray-300 w-full text-[#1A1A1A] resize-none transition-all duration-300 ${inputMode === 'conversation' ? 'min-h-[120px] text-lg font-sans font-bold leading-relaxed' : 'min-h-[3rem] text-2xl font-box overflow-hidden'}`}
                  placeholder={inputMode === 'conversation' ? 'Type a full sentence or paragraph here...' : `e.g. ${currentPlaceholder}`}
                />
                {inputMode === 'conversation' && <span className="absolute bottom-2 right-24 text-xs font-black text-gray-400">{englishWord.length}/500</span>}
                <button
                  onClick={handleMicClick}
                  className={`w-14 h-14 ml-3 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-shrink-0 items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${isRecording ? 'bg-[#ffcdd2]' : 'bg-[#e8f5e9] hover:bg-[#c8e6c9]'}`}
                  title="Speak to translate"
                >
                  <Mic className="w-7 h-7 stroke-[4] text-[#1A1A1A]" />
                </button>
              </div>

              <motion.div className="absolute -bottom-16 -right-4 z-20 pointer-events-none" animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                <Sparkle />
              </motion.div>
            </div>

            {/* Translate Button */}
            <div className="relative self-center z-10 w-full mb-12 mt-4">
              <motion.button
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.96, x: 4, y: 4, boxShadow: "0px 0px 0px 0px #1A1A1A" }}
                animate={{ backgroundColor: isLoading ? ["#F6F5F2", "#FED141", "#BF0D3E", "#0032A0", "#F6F5F2"] : "#F6F5F2" }}
                transition={{ backgroundColor: isLoading ? { repeat: Infinity, duration: 0.6, ease: "linear" } : { duration: 0.1 } }}
                onClick={handleTranslate}
                disabled={isLoading || !englishWord.trim()}
                className="w-full text-[#1A1A1A] text-3xl font-black py-5 border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[100px_25px_100px_25px/25px_100px_25px_100px] disabled:opacity-70 disabled:cursor-not-allowed min-h-[64px] uppercase tracking-wider flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-10 h-10 animate-spin stroke-[4]" />
                ) : (
                  'Translate!'
                )}
              </motion.button>

              {errorMsg && (
                <div className="mt-6 p-4 bg-red-100 border-[4px] border-[#1A1A1A] rounded-xl text-[#1A1A1A] font-black flex items-start gap-3 shadow-[4px_4px_0px_0px_#1A1A1A]">
                  <X className="w-6 h-6 shrink-0 mt-0.5 text-red-500" />
                  <span className="flex-1 uppercase">{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Output Box */}
            {(translation || isLoading) && (
              <div className="w-full space-y-3 z-10 relative mb-12 animate-in fade-in slide-in-from-bottom-6 duration-300">
                <div className="flex items-center justify-between px-2 mb-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={direction}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-xl font-black text-white tracking-widest uppercase"
                      style={{ textShadow: '3px 3px 0px #1A1A1A', WebkitTextStroke: '1.5px #1A1A1A' }}
                    >
                      {direction === 'en-tl' ? 'Tagalog Translation' : 'English Translation'}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <motion.div className="absolute -left-12 top-10 -z-10" animate={{ rotate: [0, -8, 0], x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 3.5 }}>
                    <Butterfly />
                  </motion.div>

                  <motion.div
                    key={translation ? `result-${translation.substring(0, 10)}` : 'empty'}
                    initial={translation && !isLoading ? { scale: 0.8, rotate: -3, backgroundColor: "#FED141", opacity: 0 } : { opacity: 1, backgroundColor: "#F6F5F2" }}
                    animate={{ scale: 1, rotate: 0, backgroundColor: "#F6F5F2", opacity: 1 }}
                    transition={translation && !isLoading ? {
                      scale: { type: "spring", bounce: 0.7, duration: 0.6 },
                      backgroundColor: { duration: 0.5, ease: "easeOut", delay: 0.1 },
                      opacity: { duration: 0.2 }
                    } : { duration: 0.2 }}
                    className="relative border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[125px_25px_125px_25px/25px_125px_25px_125px] p-8 flex flex-col items-center justify-center min-h-[180px]"
                  >
                    {translation && !isLoading && <PhParticles triggerKey={translation} />}
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center w-full animate-pulse">
                        <div className="h-12 bg-gray-300 border-[4px] border-[#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] w-3/4 mb-6 opacity-50"></div>
                        <div className="h-12 bg-gray-300 border-[4px] border-[#15px_225px_15px_255px/255px_15px_225px_15px] w-32 opacity-50"></div>
                      </div>
                    ) : (
                      <>
                        <div className={`w-full ${inputMode === 'conversation' ? 'max-h-[250px] overflow-y-auto pr-4 mb-6' : 'mb-8'}`}>
                          <span className={`${inputMode === 'conversation' ? 'text-lg md:text-xl font-sans font-bold normal-case text-left block' : 'text-3xl md:text-4xl font-box uppercase text-center'} text-[#1A1A1A] break-words w-full`}>
                            {translation}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                          {inputMode === 'word' && (
                            <button
                              onClick={() => handleSpeak(audioUrl)}
                              disabled={!audioUrl}
                              className="flex items-center gap-3 bg-white hover:bg-gray-50 text-[#1A1A1A] px-6 py-3 border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] text-lg font-black uppercase transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-wait min-h-[56px]"
                            >
                              <Volume2 className="w-6 h-6 stroke-[4]" />
                              SPEAK
                            </button>
                          )}
                          <button
                            onClick={handleCopy}
                            className="flex items-center justify-center w-14 h-14 bg-white hover:bg-gray-50 text-[#1A1A1A] border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
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

            {/* Fun Fact Card */}
            {inputMode === 'word' && (funFact || isLoadingFunFact) && !isLoading && (
              <div className="w-full z-10 relative mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#FFE5B4] border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-6 pt-8 relative transform -rotate-1">
                  <span className="absolute -top-4 left-6 bg-[#1A1A1A] text-[#FFE5B4] text-sm font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[2px_2px_0px_0px_#FFE5B4] flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 stroke-[3]" /> DID YOU KNOW?
                  </span>
                  {isLoadingFunFact ? (
                    <div className="animate-pulse space-y-2 mt-2">
                      <div className="h-3.5 bg-[#1A1A1A]/20 rounded-full w-full"></div>
                      <div className="h-3.5 bg-[#1A1A1A]/20 rounded-full w-5/6"></div>
                      <div className="h-3.5 bg-[#1A1A1A]/20 rounded-full w-3/4"></div>
                    </div>
                  ) : (
                    <p className="text-xl font-box text-[#1A1A1A] leading-snug">
                      {funFact}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Example Section */}
            {inputMode === 'word' && translation && !isLoading && (
              <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-300">

                {/* Cooldown UI or normal button */}
                {!example && (
                  exampleCooldown ? (
                    <div className="w-full bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[25px_125px_25px_125px/125px_25px_125px_25px] p-6 mb-8 flex flex-col items-center gap-2 text-center">
                      <span className="text-5xl font-black text-[#1A1A1A]">⏳ {exampleCooldown}s</span>
                      <p className="text-lg font-black text-[#1A1A1A] uppercase tracking-tight leading-tight">
                        Sentence examples on cooldown!
                      </p>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                        You can keep translating words in the meantime ✌️
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleShowExample}
                      disabled={isLoadingExample}
                      className="w-full bg-white hover:bg-gray-50 text-[#1A1A1A] text-xl font-black py-5 px-6 border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[25px_125px_25px_125px/125px_25px_125px_25px] transition-all duration-150 active:translate-x-[8px] active:translate-y-[8px] active:shadow-none disabled:opacity-70 flex items-center justify-center mb-8 min-h-[64px] uppercase"
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
                      <span className="text-xl font-black text-white tracking-widest uppercase" style={{ textShadow: '3px 3px 0px #1A1A1A', WebkitTextStroke: '1.5px #1A1A1A' }}>
                        Context
                      </span>
                    </div>
                    <div className="bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[50px] p-8 flex flex-col items-center justify-center relative min-h-[160px]">
                      <p className="text-2xl font-box mb-6 break-words text-[#1A1A1A] text-center w-full leading-tight uppercase">
                        {example.tagalogSentence}
                      </p>
                      <p className="text-xl font-box mb-8 text-[#1A1A1A] text-center w-full bg-gray-50 px-4 py-2 border-[4px] border-[#1A1A1A] rounded-xl transform -rotate-2 shadow-[4px_4px_0px_0px_#1A1A1A]">
                        "{example.englishTranslation}"
                      </p>
                      <div className="flex items-center gap-4 flex-wrap justify-center">
                        <button
                          onClick={() => handleSpeak(exampleAudioUrl)}
                          disabled={!exampleAudioUrl}
                          className="flex items-center gap-3 bg-white hover:bg-gray-50 text-[#1A1A1A] px-6 py-3 border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] text-lg font-black uppercase transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-wait min-h-[56px]"
                        >
                          <Volume2 className="w-6 h-6 stroke-[4]" />
                          SPEAK
                        </button>
                        <button
                          onClick={handleCopyExample}
                          className="flex items-center justify-center w-14 h-14 bg-white hover:bg-gray-50 text-[#1A1A1A] border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                          title="Copy to clipboard"
                        >
                          {isExampleCopied ? <Check className="w-6 h-6 stroke-[4] text-green-500" /> : <Copy className="w-6 h-6 stroke-[4]" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Baybayin Mode Layout */}
        {appMode === 'baybayin' && (
          <div
            className={`w-full max-w-md z-10 flex flex-col items-center pt-8 pb-12 animate-in fade-in duration-500 relative ${isGeneratingArt ? 'text-[#F6F5F2]' : 'text-[#1A1A1A]'}`}
          >

            {/* Background Petroglyphs */}
            <div className="absolute top-0 left-[-60px]"><TribalPetroglyph1 /></div>
            <div className="absolute top-[40%] right-[-70px]"><TribalPetroglyph2 /></div>

            {/* Header */}
            <div className="text-center relative z-10 w-full mb-12 flex flex-col items-center">
              <div className="flex items-center gap-4 mb-2 opacity-90">
                <div className="w-6 h-1.5 bg-[#2C2825] rounded-sm"></div>
                <span className="font-tribal-text text-xl md:text-2xl tracking-[0.3em] uppercase text-[#2C2825] font-black">
                  Sinaunang
                </span>
                <div className="w-6 h-1.5 bg-[#2C2825] rounded-sm"></div>
              </div>

              <h1 className="text-[4rem] md:text-[5rem] font-tribal-title text-[#F6F5F2] text-center leading-[1] tracking-wider uppercase mb-1"
                style={{
                  WebkitTextStroke: '2px #2C2825',
                  filter: 'drop-shadow(6px 6px 0px #2C2825)'
                }}>
                Baybayin
              </h1>

              <div className="flex items-center gap-4 mt-4 opacity-90">
                <div className="w-10 h-1 bg-[#2C2825] rounded-sm"></div>
                <span className="font-tribal-text text-lg md:text-xl tracking-[0.2em] uppercase text-[#2C2825] font-bold">
                  Script Generator
                </span>
                <div className="w-10 h-1 bg-[#2C2825] rounded-sm"></div>
              </div>

              {/* Mode Toggle */}
              <div className="flex mt-8 bg-transparent border-[4px] border-[#2C2825] p-1 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                <button
                  onClick={() => { setBaybayinMode('encode'); setBaybayinInput(''); setBaybayinOutput(''); setDecodedCache({}); setIsArtMode(false); setIsGeneratingArt(false); }}
                  className={`px-4 py-2 font-tribal-text font-bold uppercase tracking-widest transition-colors rounded-xl ${baybayinMode === 'encode' ? 'bg-[#2C2825] text-[#F6F5F2]' : 'text-[#2C2825] hover:bg-[#2C2825]/10'}`}
                >
                  CARVE (To Baybayin)
                </button>
                <button
                  onClick={() => { setBaybayinMode('decode'); setBaybayinInput(''); setBaybayinOutput(''); setDecodedCache({}); setIsArtMode(false); setIsGeneratingArt(false); }}
                  className={`px-4 py-2 font-tribal-text font-bold uppercase tracking-widest transition-colors rounded-xl ${baybayinMode === 'decode' ? 'bg-[#2C2825] text-[#F6F5F2]' : 'text-[#2C2825] hover:bg-[#2C2825]/10'}`}
                >
                  DECODE (From Baybayin)
                </button>
              </div>
            </div>

            {/* Input Box */}
            <div className="w-full space-y-3 z-10 relative mb-10">
              <label htmlFor="baybayin-input" className="text-2xl font-tribal-text text-[#2C2825] uppercase tracking-[0.1em] px-2 block font-bold">
                {baybayinMode === 'decode' ? 'Paste Baybayin Characters' : 'Enter Word or Name'}
              </label>
              <div className="bg-transparent border-[8px] border-[#2C2825] p-6 relative">
                <input
                  id="baybayin-input"
                  type="text"
                  value={baybayinInput}
                  onChange={(e) => {
                    setBaybayinInput(e.target.value);
                    setBaybayinOutput('');
                    setDecodedCache({});
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (baybayinMode === 'decode' ? handleDecodeBaybayin() : handleGenerateBaybayin())}
                  className="flex-1 bg-transparent text-3xl font-tribal-text font-bold outline-none placeholder:text-[#2C2825]/40 w-full text-[#2C2825]"
                  placeholder={baybayinMode === 'decode' ? 'e.g. \u170E\u1700\u170C\u1700' : 'e.g. malaya'}
                />
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#F6F5F2] border-r-4 border-b-4 border-[#2C2825] transform rotate-45"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#F6F5F2] border-l-4 border-t-4 border-[#2C2825] transform rotate-45"></div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => baybayinMode === 'decode' ? handleDecodeBaybayin() : handleGenerateBaybayin()}
              disabled={!baybayinInput.trim() || isDecoding}
              className="w-full bg-[#2C2825] hover:bg-[#1A1815] text-[#F6F5F2] text-3xl font-tribal-text font-bold py-6 border-4 border-transparent active:border-[#2C2825] active:bg-transparent active:text-[#2C2825] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mb-12 uppercase tracking-widest flex items-center justify-center"
            >
              {isDecoding ? <Loader2 className="w-8 h-8 mr-3 animate-spin stroke-[4]" /> : null}
              {baybayinMode === 'decode' ? 'DECODE SCRIPT!' : 'Generate Characters!'}
            </button>

            {/* Output Box */}
            {baybayinOutput && (
              <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-300">
                <motion.div
                  ref={baybayinRef}
                  animate={isGeneratingArt ? { x: [-2, 2, -2, 2, 0], transition: { repeat: Infinity, duration: 0.2 } } : {}}
                  className={`relative flex flex-col items-center justify-center transition-all duration-500 w-full min-h-[200px] sm:min-h-[250px] ${ 
                    isArtMode 
                      ? 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] p-[24px]' 
                      : 'bg-[#F6F5F2] border-[8px] border-[#2C2825] p-[2.5rem]'
                  }`}
                >
                  {/* ISOLATED MASK LAYER: Only cuts the background, leaving image and text perfectly solid */}
                  {isArtMode && (
                    <div 
                      className="absolute inset-0 z-0 bg-[#F6F5F2]"
                      style={{
                        WebkitMaskImage: 'linear-gradient(black, black), radial-gradient(circle at 10px 10px, transparent 5px, black 5.5px)',
                        maskImage: 'linear-gradient(black, black), radial-gradient(circle at 10px 10px, transparent 5px, black 5.5px)',
                        WebkitMaskSize: 'calc(100% - 20px) calc(100% - 20px), 20px 20px',
                        maskSize: 'calc(100% - 20px) calc(100% - 20px), 20px 20px',
                        WebkitMaskPosition: 'center, -10px -10px',
                        maskPosition: 'center, -10px -10px',
                        WebkitMaskRepeat: 'no-repeat, round',
                        maskRepeat: 'no-repeat, round',
                        WebkitMaskComposite: 'source-over',
                        maskComposite: 'add',
                      }}
                    />
                  )}
                  
                  {/* The Tiny Floating Trigger Button (Hidden during Art Mode or Loading) */}
                  {!isArtMode && !isGeneratingArt && baybayinMode === 'encode' && (
                    <motion.button 
                      onClick={handleMorphToArt}
                      className="absolute -right-3 -top-3 z-50 bg-[#F6F5F2] border-[3px] border-[#1A1A1A] w-10 h-10 rounded-sm flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#F6F5F2] transition-colors shadow-[2px_2px_0px_0px_#1A1A1A] text-[#1A1A1A]"
                      title="Imprint Art Background"
                      animate={{ rotate: [0, -15, 15, -15, 15, 0], scale: [1, 1.1, 1.1, 1] }}
                      transition={{ duration: 0.6, delay: 1, repeat: 2, repeatDelay: 3 }}
                    >
                      <motion.span 
                        initial={{ opacity: 0, y: 0 }} 
                        animate={{ opacity: [0, 1, 1, 0], y: [0, -35, -35, -35] }} 
                        transition={{ duration: 3.5, delay: 0.5, ease: "easeOut" }} 
                        className="absolute left-1/2 -translate-x-1/2 text-xs font-black text-[#BF0D3E] whitespace-nowrap pointer-events-none drop-shadow-md"
                      >
                        TRY ME!
                      </motion.span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"/>
                      </svg>
                    </motion.button>
                  )}
                  
                  {/* Loading State Overlay */}
                  {isGeneratingArt && (
                    <div className="absolute inset-0 z-40 bg-[#F6F5F2]/80 backdrop-blur-sm flex items-center justify-center font-black uppercase text-[#1A1A1A] animate-pulse">
                      Visualizing...
                    </div>
                  )}

                  {/* Art Mode Inner Wrapper (Z-10: Sits safely ON TOP of the mask) */}
                  {isArtMode && (
                    <div className="absolute inset-[24px] border-[2px] border-[#1A1A1A] overflow-hidden z-10 bg-white shadow-inner">
                      <img src={`/art/${artBgIndex}.webp`} alt="Art Background" className="absolute inset-0 w-full h-full object-cover opacity-90" crossOrigin="anonymous" />
                      <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                  )}

                  {/* Original Tape Corners (Hide in Art Mode) */}
                  {!isArtMode && (
                    <>
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#F6F5F2] border-l-8 border-b-8 border-[#2C2825] transform -rotate-12 z-20"></div>
                      <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#F6F5F2] border-r-8 border-t-8 border-[#2C2825] transform -rotate-12 z-20"></div>
                    </>
                  )}

                  {baybayinMode === 'decode' && !isArtMode && (
                    <div className="absolute top-4 border-[4px] border-[#2C2825] shadow-[4px_4px_0px_#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex p-1 mb-6 z-20">
                      {['TL', 'EN'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleDecodeBaybayin(lang as 'TL' | 'EN')}
                          className={`px-4 py-1.5 rounded-xl font-tribal-text font-bold text-lg tracking-widest transition-all ${decodeTarget === lang
                            ? 'bg-[#2C2825] text-[#F6F5F2]'
                            : 'text-[#2C2825] hover:bg-[#2C2825]/10'
                            }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* The Baybayin Characters (Adaptive Color) */}
                  <div className={`relative z-20 flex flex-wrap justify-center items-center gap-2 w-full ${isArtMode
                      ? 'text-[#F6F5F2] drop-shadow-[0_4px_12px_rgba(0,0,0,1)]'
                      : 'text-[#2C2825]'
                    }`}>
                    {/* DO NOT TOUCH: The actual Baybayin text MUST remain Noto Sans Tagalog */}
                    {baybayinMode === 'encode' ? (
                      <span className="text-7xl mb-10 text-center break-words w-full block" style={{ fontFamily: "'Noto Sans Tagalog', sans-serif" }}>
                        {baybayinOutput}
                      </span>
                    ) : (
                      <span className="text-4xl mt-12 mb-10 text-center break-words w-full block font-tribal-text tracking-widest uppercase font-bold">
                        {baybayinOutput}
                      </span>
                    )}
                  </div>

                </motion.div>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={handleCopyBaybayin}
                    className="flex items-center gap-3 bg-transparent hover:bg-[#2C2825] hover:text-[#F6F5F2] text-[#2C2825] px-6 py-4 border-4 border-[#2C2825] text-xl font-tribal-text font-bold uppercase transition-colors duration-150 tracking-wider w-full justify-center"
                  >
                    {isBaybayinCopied ? <Check className="w-6 h-6 stroke-[3]" /> : <Copy className="w-6 h-6 stroke-[3]" />}
                    {isBaybayinCopied ? 'COPIED!' : 'COPY CHARACTERS'}
                  </button>
                  {baybayinMode === 'encode' && (
                    <button
                      onClick={handleDownloadImage}
                      className="flex items-center gap-3 bg-transparent hover:bg-[#2C2825] hover:text-[#F6F5F2] text-[#2C2825] px-6 py-4 border-4 border-[#2C2825] text-xl font-tribal-text font-bold uppercase transition-colors duration-150 tracking-wider w-full justify-center"
                    >
                      <Download className="w-6 h-6 stroke-[3]" />
                      SAVE AS IMAGE
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Action Button - Fixed bottom center (Standalone Cartoon Lens) */}
        <div className="absolute bottom-6 left-0 w-full flex justify-center z-40 pointer-events-none">
          <button
            onClick={() => setIsLensOpen(true)}
            className="pointer-events-auto cursor-pointer drop-shadow-[4px_4px_0px_#1A1A1A] hover:drop-shadow-[6px_6px_0px_#1A1A1A] active:drop-shadow-[0px_0px_0px_#1A1A1A] transition-all duration-150 outline-none bg-transparent border-none p-0"
            title="Supreme Lens"
          >
            <CartoonCamera />
          </button>
        </div>

        {/* Mount Supreme Lens Overlay */}
        <AnimatePresence>
          {isLensOpen && (
            <SupremeLens
              onClose={() => { setIsLensOpen(false); setLensHasCapture(false); }}
              onCapturedChange={setLensHasCapture}
            />
          )}
        </AnimatePresence>

        {/* The Stamp Gallery Button - Hidden when Stamp Machine is active */}
        {isLensOpen && !showStampMachine && !lensHasCapture && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStampMachine(true)}
            className="fixed bottom-12 left-8 z-[9999] bg-[#E5E7EB] text-[#1A1A1A] w-[68px] h-[68px] rounded-xl border-[3px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex items-center justify-center overflow-hidden hover:bg-[#D1D5DB] transition-colors"
            title="Open Stamp Gallery"
          >
            {/* Gallery Thumbnail Vibe */}
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