import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Trophy,
  Award,
  Layers,
  Briefcase,
  GraduationCap,
  Send,
  Box,
  CheckCircle,
  Menu,
  X,
  Compass,
  Mail,
  ChevronRight,
  Check
} from 'lucide-react';
import {
  DEVELOPER_INFO,
  PROJECTS,
  ACHIEVEMENTS,
  SKILL_CATEGORIES,
  NEXORA_INFO
} from '../data/portfolioData';
import { audioManager } from '../utils/audio';

interface QuickPortfolioProps {
  onReturnTo3D: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

type SectionId = typeof NAV_ITEMS[number]['id'];

export const QuickPortfolio: React.FC<QuickPortfolioProps> = ({ onReturnTo3D }) => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll handler guaranteed to work in this fixed viewport scroll container
  const scrollToSection = (id: SectionId) => {
    audioManager.playClick();
    setMobileMenuOpen(false);
    setActiveSection(id);

    const element = document.getElementById(id);
    const container = containerRef.current;
    if (element && container) {
      const navHeight = 68; // Height of sticky navigation bar
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const targetScroll = container.scrollTop + (elementRect.top - containerRect.top) - navHeight;

      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  };

  // Track active section on scroll inside container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop + 140;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const elTop = el.offsetTop;
          if (scrollPos >= elTop) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Handle contact form dispatch
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    audioManager.playClick();
    const mailto = `mailto:arvenwebstudio@gmail.com?subject=${encodeURIComponent(`[Portfolio Contact] Inquiry from ${contactName}`)}&body=${encodeURIComponent(`Name: ${contactName}\nEmail: ${contactEmail}\n\n${contactMessage}`)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950 font-sans scroll-smooth"
    >
      {/* FIXED TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 transition-colors shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-neutral-900 border border-amber-500/40 flex items-center justify-center font-black text-amber-400 font-heading text-sm shadow-sm group-hover:border-amber-400 transition-colors">
              AS
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white font-heading group-hover:text-amber-400 transition-colors">
                AYUSH SINGH
              </div>
              <div className="text-[10px] text-neutral-400 font-mono hidden sm:block">
                The Digital Universe
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links (Visible on large screens) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30 shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Return to 3D & Mobile/Tablet Hamburger Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                audioManager.playClick();
                onReturnTo3D();
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-transform hover:scale-102 shadow-md cursor-pointer shrink-0"
              title="Enter interactive 3D studio world"
            >
              <Box className="w-4 h-4" />
              <span className="hidden sm:inline">Launch 3D Studio</span>
              <span className="sm:hidden">3D Mode</span>
            </button>

            {/* Mobile & Tablet Hamburger Toggle (Visible on screens < lg) */}
            <button
              onClick={() => {
                audioManager.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-700/80 text-neutral-200 hover:text-white lg:hidden transition-colors cursor-pointer flex items-center justify-center shadow-md"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE / TABLET NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 animate-fadeIn px-4 py-4 space-y-1 shadow-2xl">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 px-3 pb-2 border-b border-neutral-800/80 mb-2 flex items-center justify-between">
              <span>Navigation Menu</span>
              <span className="text-amber-400 font-mono text-[10px]">Ayush Singh Portfolio</span>
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}

            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3 text-xs text-neutral-400 font-mono px-2">
              <span>Noida, India • NIET</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* BACKDROP OVERLAY FOR MOBILE/TABLET MENU */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 top-16 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* CONTINUOUS SCROLLABLE CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-24">
        {/* 1. HOME / HERO SECTION */}
        <section id="home" className="space-y-6 pt-4 scroll-mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Frontend Developer • Creative 3D Web • Nexora Founder</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-heading">
              {DEVELOPER_INFO.name}
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-300 font-medium">
              {DEVELOPER_INFO.tagline}
            </p>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
              {DEVELOPER_INFO.education.bio}
            </p>
          </div>

          {/* Academic & Stats Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="text-xs text-neutral-400">Institution</div>
              <div className="font-bold text-neutral-200 text-sm mt-1">NIET, B.Tech CSE</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Class of 2029</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="text-xs text-neutral-400">Academic Standing</div>
              <div className="font-bold text-emerald-400 text-base mt-1 font-mono">CGPA: 9.31</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Top Tier Record</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="text-xs text-neutral-400">Hackathon Wins</div>
              <div className="font-bold text-amber-400 text-base mt-1 font-mono">4 Placements</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">PROMPT RUN, SETU, haX</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="text-xs text-neutral-400">Studio Agency</div>
              <div className="font-bold text-indigo-400 text-sm mt-1">Nexora Web</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Founder & Builder</div>
            </div>
          </div>

          {/* Social Profiles & CTA */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={DEVELOPER_INFO.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Github className="w-4 h-4 text-neutral-300" />
              <span>GitHub Profile ↗</span>
            </a>
            <a
              href={DEVELOPER_INFO.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-semibold flex items-center gap-2 transition-colors text-sky-400 shadow-sm"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn Profile ↗</span>
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Get in Touch</span>
            </button>
          </div>
        </section>

        {/* 2. ABOUT SECTION */}
        <section id="about" className="space-y-6 scroll-mt-20">
          <div className="border-b border-neutral-800 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Identity & Philosophy</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">About Ayush Singh</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <GraduationCap className="w-4 h-4" /> Academic Foundation
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  {DEVELOPER_INFO.education.degree}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {DEVELOPER_INFO.education.institution} • {DEVELOPER_INFO.education.graduation}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold">
                  <span>Cumulative Grade Point Average: 9.31 / 10.0</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 pt-2 leading-relaxed">
                  Maintains an exceptional academic record in algorithmic fundamentals, data structures, and computer organization while actively shipping production web solutions and leading hackathon sprint teams.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <Compass className="w-4 h-4" /> Engineering Mindset
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  "I treat every web experience as a cohesive digital product: striking visual polish, accessible ergonomics, tactile responsiveness, and performant code architecture. I bridge the gap between creative visual artistry and robust software engineering."
                </p>
              </div>
            </div>

            {/* Quick Fast Facts Card (Abstract Badge, No Personal Photo in 2D) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-heading font-black text-2xl text-amber-400">
                  AS
                </div>
                <div>
                  <h4 className="font-bold text-white text-base font-heading">Creative Engineer</h4>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">Based in Greater Noida, UP</div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Active open-source contributor and full-cycle web builder dedicated to immersive interactive experiences.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Specialization:</span>
                  <span className="text-neutral-200 font-medium">Modern Frontend & 3D</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Agency:</span>
                  <span className="text-indigo-300 font-medium">Nexora Web Solutions</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-medium">Available for select projects</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SKILLS SECTION */}
        <section id="skills" className="space-y-6 scroll-mt-20">
          <div className="border-b border-neutral-800 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400">Technical Foundation</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">Skills & Competencies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.name} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-400" />
                  <h3 className="text-lg font-bold text-neutral-100 font-heading">{cat.name}</h3>
                </div>
                <p className="text-xs text-neutral-400">{cat.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {cat.skills.map((s) => (
                    <div key={s.name} className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-neutral-200">{s.name}</span>
                        <span className="text-[10px] font-mono text-neutral-400">{s.level}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">{s.useCase}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. PROJECTS SECTION */}
        <section id="projects" className="space-y-6 scroll-mt-20">
          <div className="border-b border-neutral-800 pb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Verified Builds</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">Featured Projects</h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">5 Live Interactive Deployments</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wide">{proj.category}</span>
                      <h3 className="text-xl font-bold text-white font-heading mt-0.5">{proj.title}</h3>
                    </div>
                    {proj.achievement && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shrink-0">
                        <Award className="w-3.5 h-3.5" />
                        <span>{proj.achievement}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-950 text-neutral-400 border border-neutral-800">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-3 border-t border-neutral-800/80">
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo ↗</span>
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. ACHIEVEMENTS SECTION */}
        <section id="achievements" className="space-y-6 scroll-mt-20">
          <div className="border-b border-neutral-800 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Competitive Arena</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">Hackathon & Trophy Hall</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map((ach) => (
              <div key={ach.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-amber-400 font-heading">{ach.rank}</div>
                    <h4 className="font-bold text-neutral-100 text-sm mt-0.5">{ach.event}</h4>
                    <div className="text-xs text-neutral-400 font-mono mt-1">Project: {ach.project}</div>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/80 pt-3">
                  {ach.details}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. EXPERIENCE / NEXORA STUDIO SECTION */}
        <section id="experience" className="space-y-6 scroll-mt-20">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-950 border border-indigo-500/30 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Founder-Led Studio Experience</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">{NEXORA_INFO.name}</h2>
              <p className="text-lg text-indigo-300 italic font-heading">“{NEXORA_INFO.tagline}”</p>
              <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">{NEXORA_INFO.positioning}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {NEXORA_INFO.services.map((srv) => (
                <div key={srv.title} className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                  <h3 className="font-bold text-base text-white font-heading">{srv.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{srv.description}</p>
                  <div className="pt-2 border-t border-neutral-800/80 space-y-1">
                    {srv.deliverables.map((del) => (
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
        </section>

        {/* 7. CONTACT SECTION */}
        <section id="contact" className="space-y-6 scroll-mt-20">
          <div className="border-b border-neutral-800 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Direct Communication</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">Let's Connect</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-sm text-neutral-300 leading-relaxed">
                Interested in collaborating on a web product, hackathon sprint, or commissioning a bespoke build through Nexora Web Solutions? Send a direct dispatch below.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href={DEVELOPER_INFO.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center gap-3 transition-colors group"
                >
                  <Github className="w-5 h-5 text-neutral-300 group-hover:text-white" />
                  <div>
                    <div className="text-xs text-neutral-400 font-mono">GitHub</div>
                    <div className="text-sm font-bold text-white">AyushSingh-coder-web</div>
                  </div>
                </a>

                <a
                  href={DEVELOPER_INFO.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center gap-3 transition-colors group"
                >
                  <Linkedin className="w-5 h-5 text-sky-400 group-hover:text-sky-300" />
                  <div>
                    <div className="text-xs text-neutral-400 font-mono">LinkedIn</div>
                    <div className="text-sm font-bold text-white">ayush-web-dev</div>
                  </div>
                </a>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3 text-xs text-neutral-400">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Direct Inbox: arvenwebstudio@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white font-heading">Message Ready to Send!</h3>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                    Your email client has been opened with your inquiry prepared for Ayush at arvenwebstudio@gmail.com.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-neutral-400">Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-neutral-400">Email</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-400">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Project details, timeline or collaboration thoughts..."
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-500 resize-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-12 border-t border-neutral-800 flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono gap-4 pb-12">
          <div>© {new Date().getFullYear()} Ayush Singh • The Digital Universe</div>
          <button
            onClick={() => {
              audioManager.playClick();
              onReturnTo3D();
            }}
            className="text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>Launch Interactive 3D Room Experience</span>
            <Box className="w-3.5 h-3.5" />
          </button>
        </footer>
      </main>
    </div>
  );
};
