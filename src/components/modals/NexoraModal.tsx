import React from 'react';
import { X, Briefcase, Globe, Layout, Palette, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { NEXORA_INFO, DEVELOPER_INFO } from '../../data/portfolioData';
import { audioManager } from '../../utils/audio';

interface NexoraModalProps {
  onClose: () => void;
  onNavigateToContact: () => void;
}

export const NexoraModal: React.FC<NexoraModalProps> = ({ onClose, onNavigateToContact }) => {
  const serviceIcons = [
    <Globe className="w-5 h-5 text-indigo-400" />,
    <Layout className="w-5 h-5 text-sky-400" />,
    <Palette className="w-5 h-5 text-pink-400" />
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-neutral-900 via-indigo-950/40 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-indigo-400 font-mono font-medium">Zone 05 • Founder Studio Corner</div>
              <h2 className="text-xl font-bold text-neutral-100 font-heading">Nexora Web Solutions</h2>
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Brand Vision Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-neutral-950 to-neutral-950 border border-indigo-500/30 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium">
                Founder: {NEXORA_INFO.founder}
              </div>
              <h3 className="text-2xl font-black text-white font-heading">
                “{NEXORA_INFO.tagline}”
              </h3>
              <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed pt-1">
                {NEXORA_INFO.positioning}
              </p>
            </div>
          </div>

          {/* Core Services Grid */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <Layout className="w-4 h-4 text-indigo-400" /> Studio Services & Solutions
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {NEXORA_INFO.services.map((service, idx) => (
                <div
                  key={service.title}
                  className="p-5 rounded-xl bg-neutral-950/60 border border-neutral-800/90 hover:border-indigo-500/40 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                      {serviceIcons[idx]}
                    </div>
                    <h4 className="font-bold text-neutral-100 text-base font-heading">{service.title}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">Deliverables</div>
                    {service.deliverables.map((del) => (
                      <div key={del} className="flex items-center gap-1.5 text-xs text-neutral-300">
                        <Check className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Founder Principles */}
          <div className="p-5 rounded-xl bg-neutral-950/40 border border-neutral-800 space-y-3">
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Studio Engineering Values
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {NEXORA_INFO.values.map((val) => (
                <div key={val} className="flex items-center gap-2 text-xs text-neutral-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-neutral-400 font-mono">
            Location: Right Wall, Corner Office Setup
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioManager.playClick();
                onNavigateToContact();
              }}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-lg"
            >
              Start a Project with Nexora
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
            >
              Resume Game (ESC)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
