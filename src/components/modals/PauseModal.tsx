import React from 'react';
import { Play, Volume2, VolumeX, Monitor, Compass, MapPin, X } from 'lucide-react';
import { INTERACTIVE_ZONES } from '../../data/portfolioData';
import { GraphicsQuality, ZoneId } from '../../types/portfolio';
import { audioManager } from '../../utils/audio';

interface PauseModalProps {
  onResume: () => void;
  onTeleport: (zoneId: ZoneId) => void;
  onSwitchTo2D: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  graphicsQuality: GraphicsQuality;
  onChangeGraphicsQuality: (q: GraphicsQuality) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onTeleport,
  onSwitchTo2D,
  soundMuted,
  onToggleSound,
  graphicsQuality,
  onChangeGraphicsQuality
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-mono">Game Paused</div>
              <h2 className="text-xl font-bold text-neutral-100 font-heading">The Digital Universe</h2>
            </div>
          </div>
          <button
            onClick={() => {
              audioManager.playClick();
              onResume();
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          {/* Resume Big Button */}
          <button
            onClick={() => {
              audioManager.playClick();
              onResume();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-101 shadow-lg cursor-pointer"
          >
            <Play className="w-4 h-4 fill-neutral-950" />
            Resume Exploration (ESC)
          </button>

          {/* Quick Teleport to Zones */}
          <div className="space-y-2.5">
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Fast Travel to Zone
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INTERACTIVE_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => {
                    audioManager.playClick();
                    onTeleport(zone.id);
                    onResume();
                  }}
                  className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800 hover:border-amber-500/60 text-left text-xs text-neutral-200 transition-colors"
                >
                  <div className="font-semibold truncate">{zone.title}</div>
                  <div className="text-[10px] text-neutral-500 truncate mt-0.5">{zone.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Settings: Audio & Graphics Quality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Audio Toggle */}
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-neutral-200">Studio Audio</div>
                <div className="text-[11px] text-neutral-400">Footsteps & Room Ambience</div>
              </div>
              <button
                onClick={() => {
                  audioManager.playClick();
                  onToggleSound();
                }}
                className={`p-2 rounded-lg border transition-colors ${
                  !soundMuted
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                {!soundMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Graphics Selector */}
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-200">Graphics Quality</span>
                <span className="text-[10px] font-mono uppercase text-amber-400">{graphicsQuality}</span>
              </div>
              <div className="flex rounded-lg bg-neutral-900 p-0.5 border border-neutral-800">
                {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      audioManager.playClick();
                      onChangeGraphicsQuality(q);
                    }}
                    className={`flex-1 py-1 text-[11px] font-mono rounded capitalize transition-all ${
                      graphicsQuality === q
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Switch to Quick 2D Portfolio */}
          <div className="pt-2">
            <button
              onClick={() => {
                audioManager.playClick();
                onSwitchTo2D();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Monitor className="w-4 h-4 text-sky-400" />
              Switch to Quick 2D Portfolio Mode (Direct Access)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
