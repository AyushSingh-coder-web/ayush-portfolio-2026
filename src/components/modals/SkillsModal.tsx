import React, { useState } from 'react';
import { X, Code2, Layers, Cpu, Wrench, Search, Sparkles } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../data/portfolioData';
import { audioManager } from '../../utils/audio';

interface SkillsModalProps {
  onClose: () => void;
  onNavigateToZone?: (zoneId: 'about' | 'projects' | 'achievements' | 'nexora' | 'contact') => void;
}

export const SkillsModal: React.FC<SkillsModalProps> = ({ onClose, onNavigateToZone }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categoryIcons: { [key: string]: React.ReactNode } = {
    'Frontend Engineering': <Code2 className="w-4 h-4 text-sky-400" />,
    'Creative & 3D Development': <Sparkles className="w-4 h-4 text-purple-400" />,
    'Programming & Computer Science': <Cpu className="w-4 h-4 text-emerald-400" />,
    'Developer Tooling & Workflow': <Wrench className="w-4 h-4 text-amber-400" />
  };

  const filteredCategories = SKILL_CATEGORIES.map((cat) => {
    const matchesCategory = activeCategory === 'All' || cat.name === activeCategory;
    if (!matchesCategory) return null;

    const filteredSkills = cat.skills.filter((s) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.useCase.toLowerCase().includes(q)
      );
    });

    if (filteredSkills.length === 0) return null;
    return { ...cat, skills: filteredSkills };
  }).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-sky-400 font-mono font-medium">Zone 02 • Technology Wall</div>
              <h2 className="text-xl font-bold text-neutral-100 font-heading">Developer Tech Stack & Tooling</h2>
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

        {/* Filter Bar & Search */}
        <div className="px-6 py-3 bg-neutral-950/70 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                audioManager.playClick();
                setActiveCategory('All');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === 'All'
                  ? 'bg-sky-500 text-neutral-950 font-semibold'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Tech ({SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0)})
            </button>
            {SKILL_CATEGORIES.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  audioManager.playClick();
                  setActiveCategory(c.name);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === c.name
                    ? 'bg-sky-500 text-neutral-950 font-semibold'
                    : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tech, use cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          {filteredCategories.map((category) => (
            <div key={category!.name} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-2">
                {categoryIcons[category!.name]}
                <h3 className="text-sm font-bold text-neutral-200 font-heading">{category!.name}</h3>
                <span className="text-xs text-neutral-500 font-mono ml-auto">{category!.description}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category!.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/90 hover:border-sky-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-neutral-100 text-sm font-heading">{skill.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-800 text-neutral-300">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{skill.description}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-neutral-800/60">
                      <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">Use Case</div>
                      <div className="text-xs text-sky-300/90 font-medium mt-0.5">{skill.useCase}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-neutral-400 font-mono">
            Location: Left Wall, Interactive Digital Code Board
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToZone && (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onNavigateToZone('projects');
                }}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
              >
                Go to Workstation (Projects) →
              </button>
            )}
            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-neutral-950 transition-colors"
            >
              Resume Game (ESC)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
