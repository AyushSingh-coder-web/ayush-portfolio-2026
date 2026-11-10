import React, { useState } from 'react';
import { Play, Monitor, Volume2, VolumeX, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { DEVELOPER_INFO } from '../data/portfolioData';
import { GraphicsQuality } from '../types/portfolio';
import { audioManager } from '../utils/audio';

interface IntroScreenProps {
  onEnter3D: () => void;
  onStartStoryPlay: () => void;
  onOpenConnect: () => void;
  onEnter2D: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  graphicsQuality: GraphicsQuality;
  onChangeGraphicsQuality: (q: GraphicsQuality) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onEnter3D,
  onStartStoryPlay,
  onOpenConnect,
  onEnter2D,
  soundMuted,
  onToggleSound,
  graphicsQuality,
  onChangeGraphicsQuality
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950 text-neutral-100 select-none overflow-hidden">
      {/* Subtle architectural grid backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Atmospheric warm ambient glow in center */}
      <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center space-y-7 p-6 sm:p-8 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl backdrop-blur-md">
        {/* Top Developer Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Portfolio Game</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-heading">
            {DEVELOPER_INFO.name}
          </h1>
          <div className="text-lg sm:text-xl font-bold text-amber-400 tracking-wider font-heading">
            {DEVELOPER_INFO.worldTitle}
          </div>
          <p className="text-sm text-neutral-300 font-medium">
            "{DEVELOPER_INFO.tagline}"
          </p>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            "{DEVELOPER_INFO.intro}"
          </p>
        </div>

        {/* Developer Quick Credentials */}
        <div className="grid grid-cols-3 gap-2.5 py-1 text-left">
          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
            <div className="text-[10px] text-neutral-400 font-mono">Education</div>
            <div className="font-bold text-xs text-neutral-200 mt-0.5">NIET CSE '29</div>
            <div className="text-[10px] text-emerald-400 font-mono">CGPA 9.31</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
            <div className="text-[10px] text-neutral-400 font-mono">Competitive</div>
            <div className="font-bold text-xs text-neutral-200 mt-0.5">4 Hackathon Ranks</div>
            <div className="text-[10px] text-amber-400 font-mono">PROMPT RUN #4</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
            <div className="text-[10px] text-neutral-400 font-mono">Venture</div>
            <div className="font-bold text-xs text-neutral-200 mt-0.5">Nexora Web</div>
            <div className="text-[10px] text-indigo-400 font-mono">Founder</div>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Premier Story Play Button */}
          <button
            onClick={() => {
              audioManager.playInteract();
              audioManager.startAmbient();
              onStartStoryPlay();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-sm tracking-wide uppercase font-heading flex items-center justify-center gap-3 transition-transform hover:scale-101 shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
          >
            <Play className="w-5 h-5 fill-neutral-950" />
            <span>Story Play — Cinematic Corridor Intro</span>
          </button>

          {/* Secondary 2-Button Row: Direct Explore & Connect */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                audioManager.playInteract();
                audioManager.startAmbient();
                onEnter3D();
              }}
              className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Explore Studio</span>
            </button>

            <button
              onClick={() => {
                audioManager.playClick();
                onOpenConnect();
              }}
              className="py-3 px-4 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-700/60 text-indigo-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Connect</span>
            </button>
          </div>

          <button
            onClick={() => {
              audioManager.playClick();
              onEnter2D();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Monitor className="w-4 h-4 text-sky-400" />
            <span>Quick 2D Portfolio (Standard Web View)</span>
          </button>
        </div>

        {/* Settings Bar: Audio & Graphics */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          {/* Audio toggle */}
          <button
            onClick={() => {
              audioManager.playClick();
              onToggleSound();
            }}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            {!soundMuted ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
            <span className="font-mono text-[11px]">{!soundMuted ? 'Sound Active' : 'Muted'}</span>
          </button>

          {/* Graphics Quality */}
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span>Graphics:</span>
            {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
              <button
                key={q}
                onClick={() => {
                  audioManager.playClick();
                  onChangeGraphicsQuality(q);
                }}
                className={`px-2 py-0.5 rounded uppercase ${
                  graphicsQuality === q ? 'bg-amber-500 text-neutral-950 font-bold' : 'hover:text-white'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
