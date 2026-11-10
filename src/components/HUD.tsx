import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Compass,
  MapPin,
  Pause,
  ChevronDown,
  ChevronUp,
  Monitor,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Film,
  Send
} from 'lucide-react';
import { INTERACTIVE_ZONES } from '../data/portfolioData';
import { InteractiveZone, ZoneId } from '../types/portfolio';
import { audioManager } from '../utils/audio';

interface HUDProps {
  currentZone: InteractiveZone | null;
  visitedZones: Set<ZoneId>;
  playerPos: { x: number; z: number; yaw: number };
  isPointerLocked?: boolean;
  onRequestPointerLock?: () => void;
  onInteract: () => void;
  onPause: () => void;
  onTeleport: (zoneId: ZoneId) => void;
  onSwitchTo2D: () => void;
  onStartStoryPlay?: () => void;
  onOpenConnect?: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  onJoystickMove?: (x: number, z: number) => void;
}

export const HUD: React.FC<HUDProps> = ({
  currentZone,
  visitedZones,
  playerPos,
  isPointerLocked = false,
  onRequestPointerLock,
  onInteract,
  onPause,
  onTeleport,
  onSwitchTo2D,
  onStartStoryPlay,
  onOpenConnect,
  soundMuted,
  onToggleSound,
  onJoystickMove
}) => {
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [showControlsHelp, setShowControlsHelp] = useState(false);
  const [volume, setVolume] = useState<number>(() => Math.round(audioManager.getVolume() * 100));
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Dual-Zone Minimap coordinate mapping:
  // Studio room is X: -7 to +7 (14m wide), Z: -10 to +10 (20m long)
  // Corridor is X: -1.9 to +1.9 (3.8m wide), Z: +10 to +24 (14m long)
  // Total Z range is 34m (-10 to +24)
  const mapWidth = 130;
  const mapHeight = 210;
  const roomCutoffY = (20 / 34) * mapHeight; // ~123.5px where the double gate is located

  const normX = ((playerPos.x + 7) / 14) * mapWidth;
  const normY = Math.max(0, Math.min(mapHeight, ((playerPos.z + 10) / 34) * mapHeight));

  const isInCorridor = playerPos.z > 9.8;

  // Virtual Joystick touch state
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!onJoystickMove || e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touch = e.touches[0];
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const maxRadius = rect.width / 2;
    const nx = Math.max(-1, Math.min(1, dx / maxRadius));
    const ny = Math.max(-1, Math.min(1, dy / maxRadius));
    onJoystickMove(nx, ny);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onJoystickMove) onJoystickMove(0, 0);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col justify-between">
      {/* FLOATING CINEMATIC INTRO BANNER (Visible when player starts in corridor) */}
      {playerPos.z > 13.5 && (
        <div className="absolute top-24 sm:top-28 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center px-4 w-full max-w-md transition-all duration-700">
          <div className="px-6 py-4 rounded-2xl bg-neutral-950/85 border border-amber-500/35 shadow-[0_0_35px_rgba(245,158,11,0.22)] backdrop-blur-md space-y-1.5 animate-fadeIn">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AYUSH SINGH • 3D EXPERIENCE</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white font-heading tracking-wide">
              WELCOME TO MY DIGITAL UNIVERSE
            </h2>
            <p className="text-xs text-neutral-300 font-medium">
              Walk forward to explore the world behind the code.
            </p>
            <div className="pt-1.5 flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-400">
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-amber-300 font-bold">W / ↑</span>
              <span>Walk forward toward double gates</span>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR: Header, Zone Badge, Exploration Meter, Actions */}
      <header className="p-4 sm:p-6 flex items-start justify-between gap-3 pointer-events-auto">
        {/* Left: Studio Info & Current Zone */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 bg-neutral-900/90 border border-neutral-800 px-3.5 py-2 rounded-xl shadow-lg">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs font-heading">
              AS
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">AYUSH SINGH • 3D STUDIO</div>
              <div className="text-xs font-bold text-white font-heading">THE DIGITAL UNIVERSE</div>
            </div>
          </div>

          {/* Current Zone Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-neutral-900/90 border border-neutral-800/90 px-3 py-1.5 rounded-lg shadow-md text-xs">
              <span className={`w-2 h-2 rounded-full ${isInCorridor ? 'bg-sky-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-neutral-400 font-mono">Zone:</span>
              <span className="font-semibold text-neutral-100 font-heading">
                {currentZone ? currentZone.name : isInCorridor ? 'Entrance Corridor' : 'Central Exploration Area'}
              </span>
            </div>

            {/* Mouse-look mode status badge */}
            <button
              onClick={() => {
                if (onRequestPointerLock) {
                  audioManager.playClick();
                  onRequestPointerLock();
                }
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-colors shadow-md cursor-pointer ${
                isPointerLocked
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-neutral-900/90 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Click to activate full mouse-look cursor lock"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPointerLocked ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
              <span>{isPointerLocked ? 'Mouse-Look Locked (ESC to free)' : 'Click Canvas for Mouse-Look'}</span>
            </button>
          </div>
        </div>

        {/* Right: Actions, Audio, Story Play, Connect & Minimap */}
        <div className="flex flex-col items-end gap-2.5">
          <div className="flex items-center gap-2">
            {/* Story Play Button */}
            <button
              onClick={() => {
                audioManager.playClick();
                onStartStoryPlay?.();
              }}
              className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
              title="Start Cinematic Corridor Experience"
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-heading">Story Play</span>
            </button>

            {/* Connect Button */}
            <button
              onClick={() => {
                audioManager.playClick();
                onOpenConnect?.();
              }}
              className="px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 text-xs font-semibold text-indigo-300 flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
              title="Open Connect & Inquiries"
            >
              <Send className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-heading">Connect</span>
            </button>

            {/* Audio Toggle & Volume Control */}
            <div className="relative">
              <button
                onClick={() => {
                  audioManager.playClick();
                  onToggleSound();
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowVolumeSlider(!showVolumeSlider);
                }}
                className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors shadow-lg cursor-pointer flex items-center gap-1.5"
                title={soundMuted ? 'Unmute Audio (or click slider button)' : `Audio: ${volume}% (Click to mute, click ... for volume slider)`}
              >
                {!soundMuted ? (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                )}
              </button>

              {/* Volume Slider Trigger Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audioManager.playClick();
                  setShowVolumeSlider(!showVolumeSlider);
                }}
                className="absolute -bottom-2 -right-1 px-1 py-0.2 rounded bg-neutral-800 border border-neutral-700 text-[9px] font-mono text-neutral-400 hover:text-amber-400 cursor-pointer"
                title="Adjust Audio Volume"
              >
                {soundMuted ? '0%' : `${volume}%`}
              </button>

              {/* Volume Slider Popover */}
              {showVolumeSlider && (
                <div className="absolute top-12 right-0 w-48 p-3 rounded-xl bg-neutral-950/95 border border-neutral-800 shadow-2xl backdrop-blur-md z-50 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                    <span>Atmosphere Volume</span>
                    <span className="text-amber-400 font-bold">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {
                      const newVol = parseInt(e.target.value, 10);
                      setVolume(newVol);
                      audioManager.setVolume(newVol / 100);
                      if (soundMuted && newVol > 0) {
                        onToggleSound();
                      }
                    }}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        audioManager.playClick();
                        onToggleSound();
                      }}
                      className="text-[10px] text-neutral-400 hover:text-white"
                    >
                      {soundMuted ? 'Unmute' : 'Mute'}
                    </button>
                    <button
                      onClick={() => setShowVolumeSlider(false)}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick 2D Mode */}
            <button
              onClick={() => {
                audioManager.playClick();
                onSwitchTo2D();
              }}
              className="px-3 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-sky-400 flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
              title="Switch to 2D Mode"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">2D Portfolio</span>
            </button>

            {/* Pause Menu */}
            <button
              onClick={() => {
                audioManager.playClick();
                onPause();
              }}
              className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors shadow-lg cursor-pointer"
              title="Pause Game (ESC)"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>

          {/* Dual-Zone Architectural Minimap */}
          <div className="relative bg-neutral-950/95 border border-neutral-800 rounded-xl p-2 shadow-2xl hidden sm:block">
            <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 mb-1 px-1">
              <span>MINIMAP</span>
              <span className="text-amber-400">{visitedZones.size}/6 ZONES</span>
            </div>

            {/* Minimap Canvas Area (130px x 210px) */}
            <div
              className="relative rounded-lg bg-neutral-900/90 border border-neutral-800 overflow-hidden cursor-crosshair"
              style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}
              title="Click any zone on minimap to fast-travel"
            >
              {/* Main Studio Room Area (Top portion) */}
              <div
                className="absolute bg-neutral-800/40 border-b border-amber-500/30"
                style={{
                  left: 0,
                  top: 0,
                  width: `${mapWidth}px`,
                  height: `${roomCutoffY}px`
                }}
              />

              {/* Central Area Rug */}
              <div
                className="absolute bg-neutral-800/80 border border-amber-900/40 rounded"
                style={{
                  left: '35px',
                  top: '36px',
                  width: '60px',
                  height: '65px'
                }}
              />

              {/* Double Gate Threshold Line */}
              <div
                className="absolute bg-amber-400/80 z-10"
                style={{
                  left: '48px',
                  top: `${roomCutoffY}px`,
                  width: '34px',
                  height: '2px'
                }}
                title="Double Entrance Gate"
              />

              {/* Entrance Corridor Area (Bottom portion, narrower width) */}
              <div
                className="absolute bg-neutral-950 border-x border-b border-neutral-700/80"
                style={{
                  left: '48px',
                  top: `${roomCutoffY}px`,
                  width: '34px',
                  height: `${mapHeight - roomCutoffY}px`
                }}
              >
                {/* Corridor Runner Rug */}
                <div
                  className="absolute bg-amber-900/30 rounded"
                  style={{
                    left: '7px',
                    top: '4px',
                    width: '20px',
                    height: `${mapHeight - roomCutoffY - 8}px`
                  }}
                />
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[6px] font-mono text-amber-500/80 uppercase tracking-tighter">
                  START
                </div>
              </div>

              {/* 6 Zone Hotspots on Minimap */}
              {INTERACTIVE_ZONES.map((z) => {
                const zx = ((z.position[0] + 7) / 14) * mapWidth;
                const zy = ((z.position[2] + 10) / 34) * mapHeight;
                const isVisited = visitedZones.has(z.id);
                const isCurrent = currentZone?.id === z.id;

                return (
                  <div
                    key={z.id}
                    onClick={() => {
                      audioManager.playClick();
                      onTeleport(z.id);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125 z-10 ${
                      isCurrent
                        ? 'bg-amber-400 ring-2 ring-amber-300'
                        : isVisited
                        ? 'bg-emerald-500/80 border border-emerald-300'
                        : 'bg-neutral-700 border border-neutral-500'
                    }`}
                    style={{ left: `${zx}px`, top: `${zy}px` }}
                    title={`Teleport to ${z.name}`}
                  >
                    <span className="text-[7px] font-bold text-neutral-950 font-mono">
                      {z.id[0].toUpperCase()}
                    </span>
                  </div>
                );
              })}

              {/* Player dot and orientation arrow */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-75"
                style={{
                  left: `${normX}px`,
                  top: `${normY}px`
                }}
              >
                <div
                  className="w-4 h-4 flex items-center justify-center"
                  style={{ transform: `rotate(${-playerPos.yaw}rad)` }}
                >
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-cyan-400 filter drop-shadow-[0_0_4px_#38bdf8]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CENTER INTERACTION BANNER (Appears when near an object) */}
      <div className="flex flex-col items-center justify-center p-4">
        {currentZone && (
          <div className="pointer-events-auto animate-bounceSlow cursor-pointer" onClick={onInteract}>
            <div className="px-5 py-3 rounded-2xl bg-neutral-900/95 border-2 border-amber-400 text-neutral-100 shadow-[0_0_24px_rgba(245,158,11,0.35)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 font-black text-sm flex items-center justify-center font-mono">
                E
              </div>
              <div>
                <div className="text-xs font-bold font-heading text-amber-300">{currentZone.prompt}</div>
                <div className="text-[11px] text-neutral-400">{currentZone.subtitle} • Click or Press [E]</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS & DOCK */}
      <div className="p-4 sm:p-6 flex flex-col items-center pointer-events-auto">
        {/* Mobile On-Screen Virtual Joystick (visible on touch devices) */}
        <div className="sm:hidden w-full flex justify-between items-end mb-4 px-2">
          <div
            className="w-28 h-28 rounded-full bg-neutral-900/80 border-2 border-neutral-700/80 flex items-center justify-center relative touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/80 border border-amber-300 shadow-md pointer-events-none" />
            <span className="absolute bottom-1 text-[9px] font-mono text-neutral-500">MOVE</span>
          </div>

          {currentZone && (
            <button
              onClick={onInteract}
              className="w-18 h-18 rounded-full bg-amber-500 text-neutral-950 font-black text-lg border-2 border-white shadow-xl flex items-center justify-center active:scale-95"
            >
              [E]
            </button>
          )}
        </div>

        {/* Collapsible Studio Dock */}
        <div className="w-full max-w-3xl flex flex-col items-center">
          {/* Collapse Drawer Toggle Button */}
          <button
            onClick={() => setDockCollapsed(!dockCollapsed)}
            className="px-3.5 py-1 rounded-t-xl bg-neutral-900/90 border-t border-x border-neutral-800 text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{dockCollapsed ? 'Expand Dock' : 'Hide Dock'}</span>
          </button>

          {!dockCollapsed && (
            <div className="w-full bg-neutral-900/95 border border-neutral-800 rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Keyboard Controls Reminder */}
              <div className="hidden md:flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700">WASD</span>
                <span>Move</span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700 ml-1">Mouse</span>
                <span>Look</span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700 ml-1">Shift</span>
                <span>Sprint</span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700 ml-1">E</span>
                <span>Interact</span>
              </div>

              {/* Fast Travel Quick Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
                {INTERACTIVE_ZONES.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => {
                      audioManager.playClick();
                      onTeleport(z.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors shrink-0 ${
                      currentZone?.id === z.id
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    {z.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Help Button */}
              <button
                onClick={() => setShowControlsHelp(!showControlsHelp)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                title="Controls & Guide"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controls Help Overlay Modal */}
      {showControlsHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 pointer-events-auto">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white font-heading text-lg">Studio Controls & Guide</h3>
              <button onClick={() => setShowControlsHelp(false)} className="text-neutral-400 hover:text-white">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-300 font-mono">
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-amber-400">WASD / Arrow Keys</span>
                <span>Move Character</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-amber-400">Mouse Drag / Touch</span>
                <span>Rotate 3rd-Person Camera</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-amber-400">Left Shift</span>
                <span>Sprint</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-amber-400">Spacebar</span>
                <span>Hop / Jump</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-amber-400">[E] Key or Click</span>
                <span>Interact with Nearby Object</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-amber-400">ESC Key</span>
                <span>Pause Menu / Close Panel</span>
              </div>
            </div>

            <button
              onClick={() => setShowControlsHelp(false)}
              className="w-full py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
