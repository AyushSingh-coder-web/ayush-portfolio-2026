import React, { useState } from 'react';
import { X, Award, Trophy, Star, Shield, Sparkles, CheckCircle, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ACHIEVEMENTS, PROJECTS } from '../../data/portfolioData';
import { AchievementItem } from '../../types/portfolio';
import { audioManager } from '../../utils/audio';

interface AchievementsModalProps {
  onClose: () => void;
  onNavigateToZone?: (zoneId: 'about' | 'skills' | 'projects' | 'nexora' | 'contact') => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose, onNavigateToZone }) => {
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem>(ACHIEVEMENTS[0]);

  const triggerCelebration = () => {
    audioManager.playInteract();
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const getTrophyIcon = (type: string) => {
    switch (type) {
      case 'gold':
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'silver':
        return <Award className="w-6 h-6 text-sky-400" />;
      case 'award':
        return <Shield className="w-6 h-6 text-emerald-400" />;
      default:
        return <Star className="w-6 h-6 text-purple-400" />;
    }
  };

  // Find linked project if available
  const linkedProject = PROJECTS.find((p) => p.title.toLowerCase() === selectedAchievement.project.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium">Zone 04 • Glass Trophy Cabinet</div>
              <h2 className="text-xl font-bold text-neutral-100 font-heading">Milestones & Competition Achievements</h2>
            </div>
          </div>
          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Trophy Cabinet Shelf Display (Horizontal cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ACHIEVEMENTS.map((ach) => {
              const isSelected = ach.id === selectedAchievement.id;
              return (
                <div
                  key={ach.id}
                  onClick={() => {
                    setSelectedAchievement(ach);
                    triggerCelebration();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-850 border-amber-500/80 shadow-xl ring-1 ring-amber-500/50 scale-[1.02]'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                        {getTrophyIcon(ach.trophyType)}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 text-amber-400">
                        {ach.rank}
                      </span>
                    </div>

                    <h4 className="font-bold text-neutral-100 text-sm font-heading">{ach.event}</h4>
                    <div className="text-xs text-neutral-400 mt-1 font-mono">{ach.project}</div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{ach.category}</span>
                    <span className="text-amber-400 font-medium">Inspect ↗</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Milestone Deep-Dive Card */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-amber-500/30 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  {selectedAchievement.category} Milestone
                </span>
                <h3 className="text-2xl font-bold text-white font-heading mt-0.5">
                  {selectedAchievement.event}
                </h3>
                <div className="text-sm text-neutral-400 mt-1">
                  Featured Project Submission: <span className="text-white font-semibold">{selectedAchievement.project}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-amber-400 font-heading">
                  {selectedAchievement.rank}
                </div>
                {selectedAchievement.scoreOrMetric && (
                  <div className="text-xs font-mono text-neutral-400 mt-0.5">
                    {selectedAchievement.scoreOrMetric}
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-900/60 p-4 rounded-xl border border-neutral-800/80">
              {selectedAchievement.details}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Independently verified competition records & submission links</span>
              </div>

              {linkedProject && linkedProject.liveUrl && (
                <a
                  href={linkedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View {linkedProject.title} Live Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-neutral-400 font-mono">
            Location: Right Wall, Floor-Standing Glass Cabinet
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToZone && (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onNavigateToZone('nexora');
                }}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
              >
                Go to Nexora Studio Corner →
              </button>
            )}
            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-neutral-950 transition-colors"
            >
              Resume Game (ESC)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
