import React, { useState } from 'react';
import { X, PhoneCall, Send, Github, Linkedin, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { DEVELOPER_INFO } from '../../data/portfolioData';
import { audioManager } from '../../utils/audio';

interface ContactModalProps {
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedStatus, setSubmittedStatus] = useState<'idle' | 'success'>('idle');

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }
    if (!formData.subject.trim()) errs.subject = 'Please enter a subject.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please write a message with at least 10 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    audioManager.playClick();

    // Prepare mailto link with encoded parameters to guarantee real user transmission
    const mailtoUrl = `mailto:arvenwebstudio@gmail.com?subject=${encodeURIComponent(
      `[Portfolio Inquiry] ${formData.subject}`
    )}&body=${encodeURIComponent(
      `Sender Name: ${formData.name}\nSender Email: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    // Trigger user mail client or fallback
    window.location.href = mailtoUrl;
    setSubmittedStatus('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium">Zone 06 • Vintage Telephone Desk</div>
              <h2 className="text-xl font-bold text-neutral-100 font-heading">Get In Touch with Ayush Singh</h2>
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
          {/* Social / Profiles Fast Access */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={DEVELOPER_INFO.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-600 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-200 group-hover:text-white">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-mono">GitHub Profile</div>
                <div className="text-sm font-bold text-neutral-100 font-heading">AyushSingh-coder-web</div>
              </div>
            </a>

            <a
              href={DEVELOPER_INFO.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-sky-500/50 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-950/40 border border-sky-800/40 flex items-center justify-center text-sky-400 group-hover:text-sky-300">
                <Linkedin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-mono">LinkedIn Network</div>
                <div className="text-sm font-bold text-neutral-100 font-heading">ayush-web-dev</div>
              </div>
            </a>
          </div>

          {/* Contact Form */}
          {submittedStatus === 'success' ? (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-heading">Email Client Dispatched!</h3>
              <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                Your message details have been pre-filled into your default mail application to ensure verified direct delivery to Ayush's inbox.
              </p>
              <button
                onClick={() => setSubmittedStatus('idle')}
                className="mt-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                  {errors.name && <p className="text-[11px] text-red-400 font-mono">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sarah@example.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                  {errors.email && <p className="text-[11px] text-red-400 font-mono">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Frontend Project Inquiry / Hackathon Collaboration"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                {errors.subject && <p className="text-[11px] text-red-400 font-mono">{errors.subject}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Your Message *</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about your idea, timeline, or inquiry..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
                />
                {errors.message && <p className="text-[11px] text-red-400 font-mono">{errors.message}</p>}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-transform hover:scale-102 shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Inquiry
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <span>Location: Right Wall, Side Table Telephone</span>
          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium"
          >
            Resume Game (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
