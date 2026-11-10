import { ProjectItem, AchievementItem, SkillCategory, InteractiveZone } from '../types/portfolio';

export const DEVELOPER_INFO = {
  name: 'Ayush Singh',
  worldTitle: 'THE DIGITAL UNIVERSE',
  tagline: 'Explore the mind behind the code.',
  intro: 'One developer. Many ideas. An entire universe of possibilities.',
  roles: ['Frontend Developer', 'Creative Builder', 'Founder — Nexora Web Solutions'],
  education: {
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'NIET (Noida Institute of Engineering & Technology)',
    graduation: 'Class of 2029',
    cgpa: '9.31',
    bio: 'I am a computer science student, frontend developer and creative builder who enjoys turning ideas into interactive digital experiences. I explore modern technologies, develop practical projects and continuously challenge myself through hackathons.'
  },
  links: {
    github: 'https://github.com/AyushSingh-coder-web',
    linkedin: 'https://linkedin.com/in/ayush-web-dev',
  }
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'paisapilot',
    title: 'PaisaPilot',
    category: 'Personal Finance & Expense Tracker',
    description: 'A personal finance and expense tracking project.',
    achievement: 'PROMPT RUN — Rank #4',
    technologies: ['React', 'Tailwind CSS', 'JavaScript', 'Chart.js', 'Vite'],
    liveUrl: 'https://paisapilotgenz.netlify.app/',
    githubUrl: 'https://github.com/AyushSingh-coder-web/PaisaPilot',
    highlightColor: '#10b981', // emerald
    status: 'Hackathon Award Winner'
  },
  {
    id: 'pips-midnight-observatory',
    title: "Pip's Midnight Observatory",
    category: 'Celestial & Astronomy Digital Experience',
    description: 'An interactive celestial and astronomy-themed digital experience.',
    achievement: 'haX.baby — Rank #16 out of 228',
    technologies: ['Three.js', 'JavaScript', 'WebGL', 'GSAP', 'CSS3D'],
    liveUrl: 'https://pip-midnight-journey.netlify.app/',
    githubUrl: 'https://github.com/AyushSingh-coder-web/Pips-Midnight-Observatory-The-Dreamiverse',
    highlightColor: '#8b5cf6', // purple
    status: 'Top 7% Worldwide'
  },
  {
    id: 'aquaflow',
    title: 'AquaFlow',
    category: 'Smart Irrigation & Water Management',
    description: 'A smart irrigation and water management project.',
    technologies: ['React', 'Tailwind CSS', 'IoT Simulation', 'JavaScript'],
    liveUrl: 'https://aquaflow-smart.netlify.app/',
    highlightColor: '#06b6d4', // cyan
    status: 'Active Live Project'
  },
  {
    id: 'notice-decoder-setu',
    title: 'Notice Decoder Setu',
    category: 'AI Government Notice Simplification',
    description: 'An AI-powered government notice simplification project.',
    achievement: 'SETU 2026 — Rank #7',
    technologies: ['React', 'Tailwind CSS', 'NLP Integration', 'JavaScript'],
    liveUrl: 'https://notice-decoder-setu.netlify.app/',
    highlightColor: '#3b82f6', // blue
    status: 'Top 10 Finalist'
  },
  {
    id: 'glow',
    title: 'GLOW',
    category: 'Diwali Gift Finder',
    description: 'A festive Diwali gift recommendation engine curated with smooth micro-interactions and gifting logic.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Festive UI'],
    liveUrl: 'https://glow-diwali-gift-finder.vercel.app/',
    highlightColor: '#f59e0b', // amber
    status: 'Festive Showcase Project'
  }
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'prompt-run',
    event: 'PROMPT RUN Hackathon',
    rank: 'Rank #4',
    project: 'PaisaPilot',
    category: 'Hackathon',
    details: 'Achieved 4th place overall competing against cross-institution engineering teams with the financial wellness product PaisaPilot.',
    scoreOrMetric: 'Top 5 Placement',
    badgeColor: '#eab308', // gold
    trophyType: 'gold'
  },
  {
    id: 'setu-2026',
    event: 'SETU 2026 Innovation Challenge',
    rank: 'Rank #7',
    project: 'Notice Decoder Setu',
    category: 'Competition',
    details: 'Placed 7th overall out of more than 520 registered participant teams across the nation for automated circular comprehension.',
    scoreOrMetric: '520+ Registrations',
    badgeColor: '#3b82f6', // electric blue
    trophyType: 'silver'
  },
  {
    id: 'frontend-arena',
    event: 'Frontend Arena League',
    rank: 'Rank #11 out of 159',
    project: 'Speed & Architecture Sprint',
    category: 'Competition',
    details: 'Rigorous frontend development sprint evaluating design fidelity, responsive layouts, web performance, and clean code standards.',
    scoreOrMetric: 'Score: 95.38 / 100',
    badgeColor: '#10b981', // emerald
    trophyType: 'award'
  },
  {
    id: 'hax-baby',
    event: 'haX.baby Global Creative Jam',
    rank: 'Rank #16 out of 228',
    project: "Pip's Midnight Observatory",
    category: 'Hackathon',
    details: 'Recognized for world-building, creative WebGL implementation, and visual direction among 228 global submissions.',
    scoreOrMetric: 'Top 7% of 228 submissions',
    badgeColor: '#8b5cf6', // purple
    trophyType: 'bronze'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Frontend Engineering',
    description: 'Building responsive, high-performance user interfaces with modern tooling and design systems.',
    skills: [
      { name: 'React', level: 'Advanced', icon: 'Code2', description: 'Component architecture, custom hooks, state flows, and modular UI.', useCase: 'Interactive web applications & SPA dashboards' },
      { name: 'JavaScript (ES6+)', level: 'Advanced', icon: 'FileCode', description: 'Modern syntax, asynchronous paradigms, event-driven DOM manipulation.', useCase: 'Core application logic and dynamic interactivity' },
      { name: 'Tailwind CSS', level: 'Advanced', icon: 'Palette', description: 'Utility-first styling, design system tokens, responsive ergonomics.', useCase: 'Rapid production-grade UI design & layouts' },
      { name: 'HTML5 & Semantic Markup', level: 'Advanced', icon: 'Layout', description: 'Clean document outlines, accessibility (a11y), and SEO-friendly structures.', useCase: 'Foundational web standards and markup' },
      { name: 'CSS3 & Modern Layouts', level: 'Advanced', icon: 'Layers', description: 'Flexbox, CSS Grid, keyframes, transitions, and custom variables.', useCase: 'Complex fluid layouts and micro-interactions' },
      { name: 'Bootstrap', level: 'Proficient', icon: 'Grid', description: 'Grid layouts, rapid prototyping, and responsive utility components.', useCase: 'Structured responsive scaffolds' }
    ]
  },
  {
    name: 'Creative & 3D Development',
    description: 'Pushing web boundaries with procedural 3D environments, physics, and cinematic motion.',
    skills: [
      { name: 'Three.js & WebGL', level: 'Proficient', icon: 'Box', description: 'PBR materials, procedural geometry, lighting rigs, custom shaders, and camera control.', useCase: '3D portfolios, games, and spatial web experiences' },
      { name: 'GSAP (GreenSock)', level: 'Proficient', icon: 'Sparkles', description: 'Timeline orchestration, ScrollTrigger, stagger animations, and physics easing.', useCase: 'Cinematic page transitions and interactive micro-animations' },
      { name: 'Swiper.js', level: 'Advanced', icon: 'MoveHorizontal', description: 'Touch-enabled sliders, 3D coverflow carousels, responsive pagination.', useCase: 'Showcase carousels and multi-step UI flows' }
    ]
  },
  {
    name: 'Programming & Computer Science',
    description: 'Algorithmic foundations, data structures, and computer science fundamentals.',
    skills: [
      { name: 'Python', level: 'Proficient', icon: 'Terminal', description: 'Scripting, algorithmic problem solving, automation, and basic AI integrations.', useCase: 'Data processing, backend logic, and problem-solving' },
      { name: 'C Language', level: 'Academic Core', icon: 'Cpu', description: 'Memory management, pointers, low-level data structures, and computer systems.', useCase: 'Systems programming fundamentals & academic rigor' },
      { name: 'Java', level: 'Proficient', icon: 'Server', description: 'Object-oriented programming, class hierarchies, interfaces, and algorithms.', useCase: 'Enterprise OOP architectures and modular systems' }
    ]
  },
  {
    name: 'Developer Tooling & Workflow',
    description: 'Modern developer toolchains, source control, and production builds.',
    skills: [
      { name: 'Git', level: 'Advanced', icon: 'GitBranch', description: 'Branch management, merge workflows, conflict resolution, and commit hygiene.', useCase: 'Collaborative development and version control' },
      { name: 'GitHub', level: 'Advanced', icon: 'Github', description: 'Repository hosting, GitHub Actions, project boards, and open source collaboration.', useCase: 'Project delivery, documentation, and showcase' },
      { name: 'VS Code', level: 'Advanced', icon: 'Monitor', description: 'Configured development environment, debugging tools, linters, and extensions.', useCase: 'Primary high-velocity coding workflow' }
    ]
  }
];

export const NEXORA_INFO = {
  name: 'NEXORA WEB SOLUTIONS',
  tagline: 'Building meaningful digital experiences.',
  positioning: 'A founder-led web development and digital solutions studio focused on creating modern, responsive and effective digital experiences.',
  founder: 'Ayush Singh',
  services: [
    {
      title: 'Website Development',
      description: 'End-to-end custom website engineering with lightning-fast load times, solid SEO foundations, and bulletproof responsive design across every device.',
      deliverables: ['Custom React / Modern Frameworks', 'SEO & Performance Tuning', 'CMS / API Integrations', 'Domain & Cloud Deployment']
    },
    {
      title: 'Landing Page Development',
      description: 'High-converting, conversion-focused landing pages crafted for product launches, startups, campaigns, and high-impact brand statements.',
      deliverables: ['Conversion-Engineered UX', 'Interactive Micro-animations', 'Lead Capture Integrations', 'A/B Testing Readiness']
    },
    {
      title: 'UI/UX Design',
      description: 'Clean, intentional interface design with thoughtful typographic hierarchy, refined color palettes, and frictionless user flows.',
      deliverables: ['Design Systems & Component Kits', 'Interactive Prototypes', 'Responsive Layout Wireframes', 'Brand Identity Alignment']
    }
  ],
  values: [
    'Clean, maintainable code over quick hacks',
    'Human-centric design with zero visual clutter',
    'Uncompromising performance and responsiveness',
    'Transparent founder-to-client communication'
  ]
};

export const INTERACTIVE_ZONES: InteractiveZone[] = [
  {
    id: 'about',
    name: 'Personal Identity Wall',
    title: 'BEYOND THE CODE',
    subtitle: 'THE PERSON BEHIND THE PROJECTS',
    position: [-5.6, 0, 4.0], // Left wall near entrance
    radius: 2.2,
    prompt: 'Press [E] — Beyond The Code',
    cameraTarget: [-5.5, 2.0, 4.0]
  },
  {
    id: 'skills',
    name: 'Technology Section',
    title: 'TECHNOLOGY',
    subtitle: 'TOOLS • SYSTEMS • EXPERIMENTATION',
    position: [-5.6, 0, -1.5], // Left wall toward middle
    radius: 2.2,
    prompt: 'Press [E] — Explore Technologies',
    cameraTarget: [-5.5, 2.0, -1.5]
  },
  {
    id: 'projects',
    name: 'Project Wall',
    title: 'Featured Projects Showcase',
    subtitle: '5 Verified Projects & Live Demos',
    position: [-4.2, 0, 8.5], // Symmetrical Project Gallery Wall (Front Wall Left Section)
    radius: 1.8,
    prompt: 'E — EXPLORE PROJECTS',
    cameraTarget: [-4.2, 2.2, 9.92]
  },
  {
    id: 'achievements',
    name: 'Hall of Fame',
    title: 'HALL OF FAME',
    subtitle: 'MILESTONES • BUILDS • RECOGNITION',
    position: [5.6, 0, -1.5], // Right wall glass cabinet
    radius: 2.2,
    prompt: 'Press [E] — Hall of Fame',
    cameraTarget: [5.5, 2.0, -1.5]
  },
  {
    id: 'nexora',
    name: "Founder's Studio Corner",
    title: 'Nexora Web Solutions',
    subtitle: 'Digital Agency & Web Services',
    position: [5.6, 0, -5.5], // Right-side corner
    radius: 2.2,
    prompt: 'Press [E] — Explore Nexora',
    cameraTarget: [5.5, 1.8, -5.5]
  },
  {
    id: 'contact',
    name: 'Communication Hub',
    title: "LET'S CONNECT",
    subtitle: "HAVE AN IDEA? LET'S BUILD SOMETHING GREAT.",
    position: [5.4, 0, 4.2], // Right wall near entrance
    radius: 2.2,
    prompt: 'Press [E] — Connect With Ayush',
    cameraTarget: [5.4, 1.6, 4.2]
  }
];
