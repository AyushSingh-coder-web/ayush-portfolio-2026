import React, { useState } from 'react';
import { X, ExternalLink, Github, Sparkles, Award, CheckCircle2, ArrowRight, Layers, Globe } from 'lucide-react';
import { PROJECTS } from '../../data/portfolioData';
import { ProjectItem } from '../../types/portfolio';
import { audioManager } from '../../utils/audio';

interface ProjectsModalProps {
  onClose: () => void;
  onNavigateToZone?: (zoneId: 'about' | 'skills' | 'achievements' | 'nexora' | 'contact') => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({ onClose, onNavigateToZone }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS[0].id);
  const selectedProject = PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        audioManager.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Render high-fidelity abstract project-themed thumbnails
  const renderThumbnail = (proj: ProjectItem) => {
    switch (proj.id) {
      case 'paisapilot':
        return (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-emerald-950/70 via-neutral-950 to-neutral-900 border border-emerald-500/30 p-4 flex flex-col justify-between font-mono text-xs relative overflow-hidden group">
            {/* Ambient Background Aura */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2 z-10">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PaisaPilot Finance Engine
              </span>
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                PROMPT RUN #4
              </span>
            </div>

            {/* Visual Telemetry */}
            <div className="grid grid-cols-3 gap-2 my-2 text-center z-10">
              <div className="bg-neutral-900/80 p-2 rounded-lg border border-emerald-500/20">
                <div className="text-[9px] text-neutral-400">Total Net Worth</div>
                <div className="text-emerald-300 font-bold text-sm mt-0.5">₹ 2,45,800</div>
              </div>
              <div className="bg-neutral-900/80 p-2 rounded-lg border border-emerald-500/20">
                <div className="text-[9px] text-neutral-400">Savings Rate</div>
                <div className="text-sky-400 font-bold text-sm mt-0.5">+ 28.4%</div>
              </div>
              <div className="bg-neutral-900/80 p-2 rounded-lg border border-emerald-500/20">
                <div className="text-[9px] text-neutral-400">Budget Pulse</div>
                <div className="text-amber-300 font-bold text-sm mt-0.5">Optimized</div>
              </div>
            </div>

            {/* Micro Waveform Graph */}
            <div className="flex items-end gap-1 h-6 px-1 z-10">
              {[30, 45, 60, 40, 75, 90, 85, 95, 80, 100].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-emerald-500/40 to-emerald-400 rounded-t"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-emerald-900/40 pt-2 z-10">
              <span>Gen-Z Budget Tracking</span>
              <span className="text-emerald-400 font-semibold">LIVE ON NETLIFY ↗</span>
            </div>
          </div>
        );

      case 'pips-midnight-observatory':
        return (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-neutral-950 border border-purple-500/30 p-4 flex flex-col justify-between font-mono text-xs relative overflow-hidden group">
            {/* Ambient Cosmic Aura */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 z-10">
              <span className="text-purple-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Pip's Cosmic Observatory
              </span>
              <span className="text-[10px] text-purple-300 font-semibold bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/30">
                haX.baby #16
              </span>
            </div>

            {/* Concentric Celestial Orbit Graphic */}
            <div className="flex items-center justify-center py-1 z-10 relative">
              <div className="w-20 h-20 rounded-full border border-purple-400/30 flex items-center justify-center relative">
                <div className="w-14 h-14 rounded-full border border-dashed border-sky-400/40 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-[0_0_12px_#f59e0b]" />
                </div>
                {/* Orbiting Moon */}
                <div className="absolute top-1 right-2 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-purple-900/50 pt-2 z-10">
              <span>Interactive 3D WebGL Telescope</span>
              <span className="text-purple-300 font-semibold">CELESTIAL MAPS ↗</span>
            </div>
          </div>
        );

      case 'aquaflow':
        return (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-cyan-950/70 via-sky-950/50 to-neutral-950 border border-cyan-500/30 p-4 flex flex-col justify-between font-mono text-xs relative overflow-hidden group">
            {/* Ambient Water Aura */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2 z-10">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                AquaFlow Smart Irrigation
              </span>
              <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/30">
                IoT Telemetry
              </span>
            </div>

            {/* Water Flow / Valve Status */}
            <div className="grid grid-cols-3 gap-2 my-2 text-center z-10">
              <div className="bg-neutral-900/80 p-2 rounded-lg border border-cyan-500/20">
                <div className="text-[9px] text-neutral-400">Soil Moisture</div>
                <div className="text-cyan-300 font-bold text-sm mt-0.5">64.2%</div>
              </div>
              <div className="bg-neutral-900/80 p-2 rounded-lg border border-cyan-500/20">
                <div className="text-[9px] text-neutral-400">Valve Flow</div>
                <div className="text-emerald-400 font-bold text-sm mt-0.5">3.8 L/min</div>
              </div>
              <div className="bg-neutral-900/80 p-2 rounded-lg border border-cyan-500/20">
                <div className="text-[9px] text-neutral-400">Water Saved</div>
                <div className="text-sky-300 font-bold text-sm mt-0.5">420 Liters</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-cyan-900/40 pt-2 z-10">
              <span>Automated Valve Schedules</span>
              <span className="text-cyan-400 font-semibold">SMART SIMULATION ↗</span>
            </div>
          </div>
        );

      case 'notice-decoder-setu':
        return (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-blue-950/70 via-indigo-950/50 to-neutral-950 border border-blue-500/30 p-4 flex flex-col justify-between font-mono text-xs relative overflow-hidden group">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-blue-900/40 pb-2 z-10">
              <span className="text-blue-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Notice Decoder Setu
              </span>
              <span className="text-[10px] text-amber-300 font-semibold bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/30">
                SETU 2026 #7
              </span>
            </div>

            {/* AI Text Parsing Simulation */}
            <div className="space-y-1.5 my-2 z-10">
              <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800 text-[10px] text-neutral-300 truncate">
                <span className="text-neutral-500">Circular Input:</span> "Sub: Final examination & capstone filing..."
              </div>
              <div className="p-2 rounded bg-blue-950/50 border border-blue-800/40 text-[10px] flex justify-between items-center">
                <span className="text-blue-300 font-semibold">Extracted Deadline:</span>
                <span className="text-amber-300 font-bold">Friday, 11:59 PM IST</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-blue-900/40 pt-2 z-10">
              <span>National Finalist GovTech Project</span>
              <span className="text-blue-400 font-semibold">SIMPLIFY NOTICES ↗</span>
            </div>
          </div>
        );

      case 'glow':
        return (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-amber-950/80 via-orange-950/50 to-neutral-950 border border-amber-500/30 p-4 flex flex-col justify-between font-mono text-xs relative overflow-hidden group">
            {/* Ambient Festive Aura */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-2 z-10">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                GLOW Diwali Gift Finder
              </span>
              <span className="text-[10px] text-amber-300 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                Festive Explorer
              </span>
            </div>

            {/* Diya & Illumination Festive Graphic */}
            <div className="flex items-center justify-center gap-4 py-2 z-10">
              <div className="flex flex-col items-center">
                {/* Diya Flame */}
                <div className="w-4 h-6 rounded-t-full bg-gradient-to-t from-orange-500 to-yellow-200 shadow-[0_0_12px_#f59e0b] animate-pulse" />
                {/* Clay Diya Base */}
                <div className="w-10 h-3 rounded-b-full bg-orange-700 border-t border-amber-300" />
              </div>
              <div className="text-[11px] text-amber-200">
                <div className="font-bold">Festive Recommendations</div>
                <div className="text-[10px] text-neutral-400">Personalized cultural gifting</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-amber-900/40 pt-2 z-10">
              <span>Interactive Celebration Guide</span>
              <span className="text-amber-400 font-semibold">HOLIDAY EDITION ✦</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Main Showcase Modal Card */}
      <div className="relative w-full max-w-5xl bg-neutral-950 border border-cyan-500/40 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono font-bold flex items-center gap-2">
                <span>Featured Project Gallery</span>
                <span className="text-neutral-600">•</span>
                <span className="text-purple-400">Interactive Wall Exhibition</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-wide">
                Projects Showcase
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
              Press <kbd className="text-amber-300 font-bold">ESC</kbd> to exit
            </span>
            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
              }}
              className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
              title="Close Showcase (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Two-Column Master / Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-neutral-800/80">
          
          {/* Left Column: 5 Colorful Project Cards List */}
          <div className="md:col-span-5 p-4 sm:p-5 overflow-y-auto space-y-3 max-h-[38vh] md:max-h-[64vh]">
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono font-semibold px-1 flex items-center justify-between">
              <span>Select Project (5 Real Builds)</span>
              <span className="text-cyan-400 text-[11px]">{PROJECTS.length} Live</span>
            </div>

            {PROJECTS.map((proj) => {
              const isSelected = selectedProject.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    audioManager.playClick();
                    setSelectedProjectId(proj.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-neutral-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-neutral-900/50 border-neutral-800 hover:bg-neutral-900/80 hover:border-neutral-700'
                  }`}
                >
                  {/* Selected Indicator Strip */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-purple-500" />
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-base text-neutral-100 font-heading group-hover:text-cyan-300 transition-colors">
                      {proj.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-950 text-neutral-400 border border-neutral-800">
                      {proj.category.split('&')[0]}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  {proj.achievement && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-300 font-semibold font-mono">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{proj.achievement}</span>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-neutral-950 text-neutral-300 font-mono border border-neutral-800">
                        {t}
                      </span>
                    ))}
                    {proj.technologies.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-950 text-neutral-500 font-mono">
                        +{proj.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Project Inspection Detail */}
          <div className="md:col-span-7 p-5 sm:p-6 overflow-y-auto space-y-5 max-h-[50vh] md:max-h-[64vh] bg-neutral-900/40">
            
            {/* Project Header & Badges */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-heading mt-0.5">
                  {selectedProject.title}
                </h3>
              </div>

              {selectedProject.achievement ? (
                <div className="px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Award className="w-4 h-4 text-amber-400" />
                  {selectedProject.achievement}
                </div>
              ) : (
                <div className="px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  {selectedProject.status}
                </div>
              )}
            </div>

            {/* Illustrative Architecture & Mockup Thumbnail */}
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono mb-2 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Project Visual Blueprint & Telemetry</span>
              </div>
              {renderThumbnail(selectedProject)}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                Project Overview
              </div>
              <p className="text-sm text-neutral-200 leading-relaxed bg-neutral-950/70 p-4 rounded-2xl border border-neutral-800">
                {selectedProject.description}
              </p>
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Architecture & Technologies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-xs text-neutral-200 font-mono font-medium shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons: Live Demo and GitHub */}
            <div className="pt-2 flex flex-wrap gap-3">
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-transform hover:scale-102 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-neutral-950" />
                  View Live Project ↗
                </a>
              )}

              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-100 font-bold text-xs sm:text-sm flex items-center gap-2 border border-neutral-700 hover:border-neutral-600 transition-colors shadow-md cursor-pointer"
                >
                  <Github className="w-4 h-4 text-purple-400" />
                  GitHub Repository
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 bg-neutral-950 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-neutral-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Interactive Project Wall • Ayush Singh Portfolio</span>
          </div>

          <div className="flex items-center gap-2.5">
            {onNavigateToZone && (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onNavigateToZone('achievements');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>View Trophy Hall</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
              }}
              className="px-5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold transition-colors cursor-pointer"
            >
              Resume Game (ESC)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
