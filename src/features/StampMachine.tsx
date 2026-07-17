/**
 * ARCHIVED — Stamp Machine feature.
 *
 * This file was extracted from App.tsx on 2026-07-17.
 * It is NOT imported or rendered anywhere in the live app.
 * Preserved here for future reuse.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import {
  playSnapStampSound,
  playSaveBookSound,
} from '../utils/sounds';

// ============================================================================
// LIVE CAMERA STAMP MACHINE
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

export const StampMachine = ({ onClose }: { onClose: () => void }) => {
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
  // Was recalculated on every render (punch state changes, tab switches, modal open/close).
  // The shape never changes, so build it once.
  const stampPath = useMemo(() => generateStampPath(stampWidth, stampHeight), []);

  const [archive, setArchive] = useState<{ date: string, data: string }[]>(() => {
    try { const saved = localStorage.getItem('supreme_stamps_archive'); return saved ? JSON.parse(saved) : []; }
    catch { return []; }
  });

  // Doodle decorations only depend on each item's position in the archive, so they only
  // need to be recomputed when the archive itself changes — not on every re-render
  // (opening the stamp modal, switching tabs, etc. were previously re-running all the
  // seeded-random doodle generation for every saved stamp).
  const archiveDoodles = useMemo(() => archive.map((_, idx) => renderDoodles(idx)), [archive]);

  useEffect(() => {
    if (activeTab === 'archive') {
      if (videoRef.current?.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [activeTab]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        let hadActiveStream = false;
        if (videoRef.current?.srcObject) {
          hadActiveStream = true;
          const oldStream = videoRef.current.srcObject as MediaStream;
          oldStream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
        // Only settle-delay when we just tore down a live stream (e.g. retake).
        // On first mount, or when returning from the Book tab where the stream
        // was already released, skip straight to re-acquiring the camera.
        if (hadActiveStream) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied", err);
        setHasCameraError(true);
      }
    };
    if (punchState === 'viewfinder' && activeTab === 'camera') startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [punchState, activeTab]);

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
              onPointerDown={() => {
                if (punchState === 'viewfinder' && !hasCameraError) {
                  playSnapStampSound();
                  handlePunch();
                }
              }}
              animate={punchState === 'punching' ? { scale: 0.95, y: 15 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`absolute inset-0 rounded-[48px] bg-gradient-to-br from-[#E5E7EB] via-[#9CA3AF] to-[#4B5563] shadow-[inset_0_4px_15px_rgba(255,255,255,0.7),0_30px_60px_rgba(0,0,0,0.9)] border-[4px] border-[#374151] flex items-center justify-center z-10 ${punchState === 'viewfinder' ? 'cursor-pointer' : ''}`}
            >
              <div
                className="relative w-[260px] h-[340px] bg-[#0a0a0a] rounded shadow-[inset_0_15px_40px_rgba(0,0,0,1)] border-[2px] border-[#1f2937] overflow-hidden group"
                style={{ transform: 'translateZ(0)' }}
              >
                {hasCameraError ? (
                  <label className="cursor-pointer text-gray-500 font-black text-center p-6 hover:text-white transition-colors w-full h-full flex flex-col items-center justify-center gap-3">
                    <span className="tracking-widest text-sm">CAMERA UNAVAILABLE<br />TAP TO UPLOAD</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFallbackUpload} />
                  </label>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-90" style={{ transform: facingMode === 'user' ? 'scaleX(-1) translateZ(0)' : 'translateZ(0)', willChange: 'transform' }} />
                    {hqImage && punchState === 'punching' && (
                      <img src={hqImage} className="absolute inset-0 w-full h-full object-cover z-10" alt="frozen frame" />
                    )}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 55%, #0a0a0a 100%)' }} />
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
            onClick={() => { playSaveBookSound(); handleSaveToArchive(); }}
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
                    {archiveDoodles[idx]}
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
                        <img src={entry.data} alt="" decoding="async" loading="lazy" className="w-full h-full object-cover grayscale-[0.1] contrast-[1.1]" />
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
                      <img src={archive[selectedStampIndex].data} decoding="async" className="w-full h-full object-cover" crossOrigin="anonymous" />
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

export default StampMachine;
