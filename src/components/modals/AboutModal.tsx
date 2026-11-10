import React from 'react';
import { X, GraduationCap, Award, Compass, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { DEVELOPER_INFO } from '../../data/portfolioData';
import { audioManager } from '../../utils/audio';

interface AboutModalProps {
  onClose: () => void;
  onNavigateToZone?: (zoneId: 'skills' | 'projects' | 'achievements' | 'nexora' | 'contact') => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, onNavigateToZone }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with decorative badge */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400/90 font-mono font-medium">Zone 01 • Personal Identity</div>
              <h2 className="text-xl font-bold text-neutral-100 font-heading">About Ayush Singh</h2>
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

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-neutral-300 text-sm leading-relaxed">
          {/* Hero Bio Card */}
          <div className="p-5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-neutral-800 to-purple-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg relative group">
              <span className="font-heading font-black text-2xl sm:text-3xl tracking-wider bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent select-none">
                AS
              </span>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-neutral-900 flex items-center justify-center" title="Online / Building">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-bold text-white font-heading">{DEVELOPER_INFO.name}</span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  NIET CSE ’29
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                  CGPA: 9.31
                </span>
              </div>
              <p className="text-neutral-400 text-xs">
                {DEVELOPER_INFO.roles.join(' • ')}
              </p>
              <p className="text-neutral-300 text-xs sm:text-sm pt-1">
                "{DEVELOPER_INFO.intro}"
              </p>
            </div>
          </div>

          {/* Academic Background */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" /> Academic Foundation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-neutral-850/80 border border-neutral-800">
                <div className="text-xs text-neutral-400">Degree & Specialization</div>
                <div className="font-semibold text-neutral-100 mt-1">{DEVELOPER_INFO.education.degree}</div>
                <div className="text-xs text-neutral-400 mt-1">{DEVELOPER_INFO.education.institution}</div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-850/80 border border-neutral-800">
                <div className="text-xs text-neutral-400">Academic Standing</div>
                <div className="font-semibold text-emerald-400 mt-1 font-mono text-base">Cumulative GPA: 9.31 / 10</div>
                <div className="text-xs text-neutral-400 mt-1">Graduation: {DEVELOPER_INFO.education.graduation}</div>
              </div>
            </div>
          </div>

          {/* Personal Journey Statement */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" /> Engineering Mindset
            </h3>
            <div className="p-4 rounded-xl bg-neutral-850/60 border border-neutral-800 text-neutral-300">
              <p>{DEVELOPER_INFO.education.bio}</p>
            </div>
          </div>

          {/* Core Strengths */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-neutral-850/50 border border-neutral-800/80">
              <div className="font-semibold text-neutral-200 text-xs flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-3.5 h-3.5" /> Creative Frontend
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">
                Obsessed with high tactile responsiveness, modern typography, and Three.js spatial experiences.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-850/50 border border-neutral-800/80">
              <div className="font-semibold text-neutral-200 text-xs flex items-center gap-1.5 text-blue-300">
                <Award className="w-3.5 h-3.5" /> Hackathon Sprints
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">
                Ranked #4 in PROMPT RUN, #7 in SETU 2026, and top 7% in haX.baby global creative jam.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-850/50 border border-neutral-800/80">
              <div className="font-semibold text-neutral-200 text-xs flex items-center gap-1.5 text-emerald-300">
                <ExternalLink className="w-3.5 h-3.5" /> Nexora Web Solutions
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">
                Founder of an independent web agency engineering production-grade websites and design systems.
              </p>
            </div>
          </div>
        </div>

        {/* Footer with fast jump */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-neutral-400 font-mono">
            Location: Left Wall, Studio Entrance Area
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToZone && (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onNavigateToZone('skills');
                }}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
              >
                Go to Skills Wall →
              </button>
            )}
            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-neutral-950 transition-colors"
            >
              Resume Exploration (ESC)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
