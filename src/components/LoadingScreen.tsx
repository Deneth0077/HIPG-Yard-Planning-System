'use client';

import React, { useState, useEffect } from 'react';
import { Ship, Shield, Cpu, Sparkles } from 'lucide-react';

export default function LoadingScreen({ onFinish }: { onFinish?: () => void }) {
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState('Initializing HIPG 3D Spatial Engine…');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(48);
      setStatusText('Assembling Ro-Ro Yards, Berths & Shipping Channels…');
    }, 200);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Synthesizing Instanced Vehicles & Container Stacks…');
    }, 450);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready — Entering Digital Twin');
    }, 700);

    const timer4 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 950);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050a14] text-white overflow-hidden select-none transition-opacity duration-700">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.12)_0%,transparent_70%)]" />

      {/* Futuristic Emblem */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_35px_rgba(0,212,255,0.25)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent animate-pulse" />
          <Ship className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
        </div>

        {/* Orbiting spinner ring */}
        <div className="absolute -inset-2 rounded-2xl border border-cyan-400/20 border-t-cyan-400 animate-spin" />
      </div>

      {/* Title */}
      <div className="text-center px-4 max-w-md">
        <div className="text-[11px] font-mono tracking-[0.25em] text-cyan-400 uppercase mb-1 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          HAMBANTOTA INTERNATIONAL PORT GROUP
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-100 uppercase">
          Ro-Ro Yard Planning System
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          3D Digital Twin · Operational Terminal Masterplan
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-72 sm:w-80 mt-8">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1.5">
          <span className="truncate pr-2">{statusText}</span>
          <span className="text-cyan-400 font-bold">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 border border-cyan-900/60 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-300 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,212,255,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-8 flex items-center gap-4 text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-400" /> HIPG SECURE
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-cyan-400" /> 60 FPS INSTANCED PIPELINE
        </span>
      </div>
    </div>
  );
}
