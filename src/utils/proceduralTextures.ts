import * as THREE from 'three';

/**
 * Ultra-High-Quality Procedural Texture Generators
 * Enforces SRGBColorSpace, proper anisotropy, and zero external 404 dependencies
 */

export function createWoodFloorTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep rich walnut base
  ctx.fillStyle = '#2e1c12';
  ctx.fillRect(0, 0, 1024, 1024);

  // Individual planks with natural grain, tone variation, and bevels
  const plankH = 64;
  const numPlanks = 1024 / plankH;

  for (let p = 0; p < numPlanks; p++) {
    const y = p * plankH;
    // Organic plank color variation
    const toneMod = Math.sin(p * 2.7) * 12 + Math.cos(p * 4.1) * 8;
    const r = Math.min(255, Math.max(20, Math.floor(58 + toneMod * 0.9)));
    const g = Math.min(255, Math.max(12, Math.floor(36 + toneMod * 0.7)));
    const b = Math.min(255, Math.max(6, Math.floor(22 + toneMod * 0.5)));

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, y, 1024, plankH);

    // Staggered vertical plank butt-joints
    const stagger = (p % 4) * 260;
    for (let x = -stagger; x < 1024; x += 360) {
      if (x > 0 && x < 1024) {
        ctx.fillStyle = 'rgba(10, 6, 3, 0.85)';
        ctx.fillRect(x, y, 2.5, plankH);
        // Bevel highlight
        ctx.fillStyle = 'rgba(120, 85, 55, 0.25)';
        ctx.fillRect(x + 2.5, y, 1.5, plankH);
      }
    }

    // Natural wood grain ripples
    ctx.strokeStyle = 'rgba(15, 8, 4, 0.22)';
    ctx.lineWidth = 1.2;
    for (let gIdx = 0; gIdx < 10; gIdx++) {
      ctx.beginPath();
      const gy = y + 3 + gIdx * 6;
      ctx.moveTo(0, gy);
      for (let x = 0; x < 1024; x += 40) {
        const noise = Math.sin(x * 0.03 + p * 1.5) * 2.2 + Math.cos(x * 0.08) * 1.0;
        ctx.lineTo(x, gy + noise);
      }
      ctx.stroke();
    }

    // Horizontal plank joint shadow & bevel highlight
    ctx.fillStyle = 'rgba(8, 4, 2, 0.92)';
    ctx.fillRect(0, y + plankH - 2.5, 1024, 2.5);
    ctx.fillStyle = 'rgba(140, 95, 60, 0.28)';
    ctx.fillRect(0, y, 1024, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

export function createRugTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep graphite & warm cream woven palette
  ctx.fillStyle = '#1c1d22';
  ctx.fillRect(0, 0, 1024, 1024);

  // Micro fabric weave noise
  ctx.fillStyle = 'rgba(230, 220, 200, 0.03)';
  for (let y = 0; y < 1024; y += 4) {
    for (let x = (y % 8 === 0 ? 0 : 2); x < 1024; x += 4) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Outer ornate gold-sand border
  ctx.strokeStyle = '#c5a068';
  ctx.lineWidth = 24;
  ctx.strokeRect(36, 36, 952, 952);

  // Greek key / geometric fret border
  ctx.strokeStyle = 'rgba(197, 160, 104, 0.6)';
  ctx.lineWidth = 4;
  ctx.strokeRect(70, 70, 884, 884);

  // Fine inner border
  ctx.strokeStyle = '#856f4d';
  ctx.lineWidth = 6;
  ctx.strokeRect(96, 96, 832, 832);

  // Diamond lattice field
  ctx.strokeStyle = 'rgba(215, 195, 165, 0.14)';
  ctx.lineWidth = 2.5;
  for (let d = -1024; d < 2048; d += 48) {
    ctx.beginPath();
    ctx.moveTo(d, 96);
    ctx.lineTo(d + 832, 928);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(d, 928);
    ctx.lineTo(d + 832, 96);
    ctx.stroke();
  }

  // Central medallion
  ctx.save();
  ctx.translate(512, 512);
  ctx.fillStyle = '#141519';
  ctx.beginPath();
  ctx.arc(0, 0, 240, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#c5a068';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(197, 160, 104, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 215, 0, Math.PI * 2);
  ctx.stroke();

  // Intricate 12-point star rosette
  for (let r = 0; r < 12; r++) {
    ctx.rotate((Math.PI * 2) / 12);
    ctx.fillStyle = 'rgba(197, 160, 104, 0.38)';
    ctx.beginPath();
    ctx.ellipse(0, 105, 24, 85, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c5a068';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Center golden jewel
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

export function createCodeMonitorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  // Modern Dark Theme IDE
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, 1280, 720);

  // Top Window Chrome / Titlebar
  ctx.fillStyle = '#161b22';
  ctx.fillRect(0, 0, 1280, 48);

  // Mac/Unix control dots
  const dotColors = ['#ff5f56', '#ffbd2e', '#27c93f'];
  dotColors.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(28 + i * 24, 24, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // Editor Tabs
  ctx.fillStyle = '#1f242c';
  ctx.fillRect(115, 8, 250, 40);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('⚡ DigitalUniverse.tsx', 135, 33);

  ctx.fillStyle = '#161b22';
  ctx.fillRect(370, 8, 210, 40);
  ctx.fillStyle = '#8b949e';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText('portfolio.config.ts', 390, 33);

  // Sidebar File Explorer
  ctx.fillStyle = '#161b22';
  ctx.fillRect(0, 48, 240, 672);
  ctx.fillStyle = '#8b949e';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('WORKSPACE : AYUSH_PORTFOLIO', 20, 85);
  ctx.fillStyle = '#c9d1d9';
  ctx.fillText('▾ src', 20, 115);
  ctx.fillText('  ▸ components', 30, 140);
  ctx.fillText('  ▸ experiences', 30, 165);
  ctx.fillStyle = '#58a6ff';
  ctx.fillText('  ★ PaisaPilot.tsx', 30, 190);
  ctx.fillText('  ★ PipsObservatory.tsx', 30, 215);
  ctx.fillText('  ★ NoticeSetu.tsx', 30, 240);
  ctx.fillText('  ★ NexoraStudio.tsx', 30, 265);
  ctx.fillStyle = '#8b949e';
  ctx.fillText('  ▸ utils', 30, 290);
  ctx.fillText('  📄 metadata.json', 30, 315);

  // Code Area
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(240, 48, 1040, 490);

  const codeSnippets = [
    { num: '01', text: 'import { Developer, Experience, Innovation } from "@ayush/core";', color: '#ff7b72' },
    { num: '02', text: 'import { ThreeCanvas, ShaderPass, WebGL } from "@ayush/3d";', color: '#ff7b72' },
    { num: '03', text: '', color: '' },
    { num: '04', text: 'export const AyushSingh: Developer = {', color: '#79c0ff' },
    { num: '05', text: '  name: "Ayush Singh",', color: '#a5d6ff' },
    { num: '06', text: '  degree: "B.Tech CSE @ NIET (Class of 2029)",', color: '#7ee787' },
    { num: '07', text: '  academicRecord: "CGPA: 9.31 / 10",', color: '#7ee787' },
    { num: '08', text: '  venture: "Founder of Nexora Web Solutions",', color: '#d2a8ff' },
    { num: '09', text: '  hackathons: [', color: '#c9d1d9' },
    { num: '10', text: '    { event: "PROMPT RUN", rank: "#4", project: "PaisaPilot" },', color: '#ffa657' },
    { num: '11', text: '    { event: "SETU 2026", rank: "#7", participants: "520+ teams" },', color: '#ffa657' },
    { num: '12', text: '    { event: "haX.baby", rank: "#16 / 228", project: "Pip\'s Observatory" }', color: '#ffa657' },
    { num: '13', text: '  ],', color: '#c9d1d9' },
    { num: '14', text: '  techStack: ["React", "Three.js", "Tailwind CSS", "GSAP", "Python", "Java"],', color: '#79c0ff' },
    { num: '15', text: '  status: "Exploring the mind behind the code in real-time 3D"', color: '#7ee787' },
    { num: '16', text: '};', color: '#79c0ff' }
  ];

  ctx.font = '16px "JetBrains Mono", monospace';
  codeSnippets.forEach((line, idx) => {
    const y = 88 + idx * 26;
    ctx.fillStyle = '#484f58';
    ctx.fillText(line.num, 260, y);
    ctx.fillStyle = line.color || '#c9d1d9';
    ctx.fillText(line.text, 305, y);
  });

  // Terminal Tray Footer
  ctx.fillStyle = '#090d13';
  ctx.fillRect(240, 538, 1040, 182);
  ctx.fillStyle = '#8b949e';
  ctx.font = '13px "JetBrains Mono", monospace';
  ctx.fillText('TERMINAL : ayush@studio: ~/universe $ npm run dev --host', 260, 568);
  ctx.fillStyle = '#3fb950';
  ctx.fillText('✓ Compiled successfully in 124ms • 60 FPS Studio Active', 260, 600);
  ctx.fillStyle = '#58a6ff';
  ctx.fillText('➜ Local:    http://localhost:3000/ [Interactive Developer Studio]', 260, 632);
  ctx.fillStyle = '#e3b341';
  ctx.fillText('➜ Action:   Approach any physical zone and press [E] to interact', 260, 664);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createLaptopScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 640, 400);

  // Gradient Top Bar
  const grad = ctx.createLinearGradient(0, 0, 640, 0);
  grad.addColorStop(0, '#0284c7');
  grad.addColorStop(0.5, '#6366f1');
  grad.addColorStop(1, '#a855f7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 48);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Manrope", sans-serif';
  ctx.fillText('AYUSH SINGH — PROJECT PORTAL', 24, 30);

  // Mini project tiles
  const projects = [
    { title: 'PaisaPilot', tag: 'PROMPT RUN #4', col: '#10b981' },
    { title: "Pip's Observatory", tag: 'haX.baby #16', col: '#8b5cf6' },
    { title: 'Notice Decoder Setu', tag: 'SETU 2026 #7', col: '#3b82f6' },
    { title: 'AquaFlow Smart', tag: 'IoT Irrigation', col: '#06b6d4' }
  ];

  projects.forEach((proj, idx) => {
    const x = 24 + (idx % 2) * 300;
    const y = 68 + Math.floor(idx / 2) * 145;

    ctx.fillStyle = '#1e293b';
    ctx.roundRect(x, y, 285, 130, 10);
    ctx.fill();

    ctx.fillStyle = proj.col;
    ctx.fillRect(x, y, 6, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 17px "Manrope", sans-serif';
    ctx.fillText(proj.title, x + 20, y + 36);

    ctx.fillStyle = proj.col;
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText(proj.tag, x + 20, y + 68);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Manrope", sans-serif';
    ctx.fillText('Live Demo Available ↗', x + 20, y + 102);
  });

  // Footer prompt
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 360, 640, 40);
  ctx.fillStyle = '#fbbf24';
  ctx.font = '13px "JetBrains Mono", monospace';
  ctx.fillText('PRESS [E] TO OPEN PROJECT TERMINAL', 150, 385);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createPortraitArtworkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 700;
  const ctx = canvas.getContext('2d')!;

  // Deep rich background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 700);
  bgGrad.addColorStop(0, '#1a1d24');
  bgGrad.addColorStop(1, '#0c0d10');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 700);

  // Geometric halo arcs
  ctx.save();
  ctx.translate(256, 270);
  ctx.strokeStyle = 'rgba(217, 180, 130, 0.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 175, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(-135, -135, 270, 270);

  // Stylized avatar head & shoulders
  ctx.fillStyle = '#262a38';
  ctx.beginPath();
  ctx.arc(0, -35, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#dfb892';
  ctx.beginPath();
  ctx.arc(0, -25, 56, 0, Math.PI * 2);
  ctx.fill();

  // Dark hair & glasses
  ctx.fillStyle = '#181513';
  ctx.beginPath();
  ctx.arc(0, -42, 58, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#181513';
  ctx.lineWidth = 4.5;
  ctx.strokeRect(-34, -28, 28, 20);
  ctx.strokeRect(6, -28, 28, 20);
  ctx.beginPath();
  ctx.moveTo(-6, -18);
  ctx.lineTo(6, -18);
  ctx.stroke();

  // Hoodie shoulders
  ctx.fillStyle = '#242836';
  ctx.beginPath();
  ctx.ellipse(0, 100, 130, 80, 0, 0, Math.PI);
  ctx.fill();
  ctx.restore();

  // Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 34px "Cabinet Grotesk", "Manrope", sans-serif';
  ctx.fillText('AYUSH SINGH', 256, 530);

  ctx.fillStyle = '#d4af37';
  ctx.font = '600 16px "Manrope", sans-serif';
  ctx.fillText('FRONTEND DEVELOPER & CREATIVE BUILDER', 256, 565);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '15px "Manrope", sans-serif';
  ctx.fillText('Founder — Nexora Web Solutions', 256, 595);

  ctx.fillStyle = '#64748b';
  ctx.font = '13px "JetBrains Mono", monospace';
  ctx.fillText('NIET CSE ’29 • CGPA 9.31 • 4x Hackathon Winner', 256, 635);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createNexoraLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f1117';
  ctx.fillRect(0, 0, 800, 400);

  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 5;
  ctx.strokeRect(16, 16, 768, 368);

  // Architectural Brand Emblem
  ctx.save();
  ctx.translate(160, 200);
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, -70);
  ctx.lineTo(60, 35);
  ctx.lineTo(-60, 35);
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.lineTo(-45, -40);
  ctx.lineTo(45, -40);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px "Cabinet Grotesk", sans-serif';
  ctx.fillText('NEXORA', 260, 160);

  ctx.fillStyle = '#818cf8';
  ctx.font = '600 22px "Manrope", sans-serif';
  ctx.fillText('WEB SOLUTIONS', 260, 200);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 16px "Manrope", sans-serif';
  ctx.fillText('“Building meaningful digital experiences.”', 260, 245);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText('FOUNDER: AYUSH SINGH • WEB & UI/UX STUDIO', 260, 290);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWelcomeSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 680;
  canvas.height = 180;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1a17';
  ctx.fillRect(0, 0, 680, 180);

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 660, 160);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 24px "Cabinet Grotesk", sans-serif';
  ctx.fillText('WELCOME TO MY DIGITAL UNIVERSE', 340, 65);

  ctx.fillStyle = '#d4af37';
  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.fillText('AYUSH SINGH • INTERACTIVE 3D STUDIO PORTFOLIO', 340, 102);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '13px "Manrope", sans-serif';
  ctx.fillText('CLICK SCENE FOR MOUSE-LOOK • WASD TO MOVE • [E] TO INTERACT', 340, 138);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCertificateTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 420;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#fefcf8';
  ctx.fillRect(0, 0, 600, 420);

  ctx.strokeStyle = '#b4975a';
  ctx.lineWidth = 7;
  ctx.strokeRect(18, 18, 564, 384);
  ctx.lineWidth = 1.8;
  ctx.strokeRect(28, 28, 544, 364);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 20px "Cabinet Grotesk", serif';
  ctx.fillText('NOIDA INSTITUTE OF ENGINEERING & TECHNOLOGY', 300, 75);

  ctx.fillStyle = '#78350f';
  ctx.font = 'italic 15px serif';
  ctx.fillText('Department of Computer Science & Engineering', 300, 105);

  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 24px serif';
  ctx.fillText('ACADEMIC EXCELLENCE RECOGNITION', 300, 155);

  ctx.fillStyle = '#292524';
  ctx.font = '14px serif';
  ctx.fillText('This honors credential is awarded to student engineer', 300, 190);

  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 28px serif';
  ctx.fillText('AYUSH SINGH', 300, 240);

  ctx.fillStyle = '#44403c';
  ctx.font = '16px serif';
  ctx.fillText('B.Tech CSE • Class of 2029 • Cumulative GPA: 9.31 / 10', 300, 280);

  // Golden Seal
  ctx.save();
  ctx.translate(300, 340);
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createRotaryDialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Obsidian dial base with gradient
  const bgGrad = ctx.createRadialGradient(128, 128, 10, 128, 128, 124);
  bgGrad.addColorStop(0, '#1c1f26');
  bgGrad.addColorStop(0.85, '#0b0d13');
  bgGrad.addColorStop(1, '#05070a');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(128, 128, 124, 0, Math.PI * 2);
  ctx.fill();

  // Cyan emissive inner ring
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(128, 128, 118, 0, Math.PI * 2);
  ctx.stroke();

  // Brass outer bezel
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(128, 128, 122, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  for (let i = 0; i <= 9; i++) {
    const angle = ((i + 1) * (Math.PI * 1.5)) / 10 - Math.PI * 0.4;
    const x = 128 + Math.cos(angle) * 78;
    const y = 128 + Math.sin(angle) * 78;

    // Glowing cyan finger hole
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`${i}`, x, y);
  }

  // Polished brushed brass center cap with engraved star
  const brassCenter = ctx.createRadialGradient(120, 120, 5, 128, 128, 40);
  brassCenter.addColorStop(0, '#fef08a');
  brassCenter.addColorStop(0.5, '#d4af37');
  brassCenter.addColorStop(1, '#92400e');
  ctx.fillStyle = brassCenter;
  ctx.beginPath();
  ctx.arc(128, 128, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWindowSceneryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm sunset sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#1e1b4b');
  grad.addColorStop(0.35, '#581c87');
  grad.addColorStop(0.65, '#ea580c');
  grad.addColorStop(0.85, '#fde047');
  grad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Distant mountain silhouette
  ctx.fillStyle = 'rgba(30, 20, 50, 0.7)';
  ctx.beginPath();
  ctx.moveTo(0, 360);
  for (let x = 0; x <= 1024; x += 64) {
    ctx.lineTo(x, 320 + Math.sin(x * 0.015) * 45);
  }
  ctx.lineTo(1024, 512);
  ctx.lineTo(0, 512);
  ctx.closePath();
  ctx.fill();

  // Skyline buildings with illuminated windows
  ctx.fillStyle = 'rgba(15, 17, 26, 0.94)';
  for (let x = 0; x < 1024; x += 28) {
    const h = 90 + Math.sin(x * 0.04) * 60 + (x % 7) * 30;
    ctx.fillRect(x, 512 - h, 25, h);

    // Glowing window grids
    ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
    for (let wy = 512 - h + 12; wy < 495; wy += 16) {
      if ((x + wy) % 5 === 0) {
        ctx.fillRect(x + 4, wy, 5, 8);
        ctx.fillRect(x + 14, wy, 5, 8);
      }
    }
    ctx.fillStyle = 'rgba(15, 17, 26, 0.94)';
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createGalleryArtTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  // Dark matte gallery background
  ctx.fillStyle = '#0f1118';
  ctx.fillRect(0, 0, 512, 720);

  // Gallery mat border
  ctx.strokeStyle = '#232733';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 700);

  // Inner border with accent pinstripe
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 456, 664);

  switch (index % 6) {
    case 0: {
      // 0: PaisaPilot — FinTech & Gen-Z Wealth AI
      ctx.fillStyle = '#051b14';
      ctx.fillRect(30, 30, 452, 660);

      // Gradient background glow
      const bg = ctx.createRadialGradient(256, 260, 20, 256, 260, 220);
      bg.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
      bg.addColorStop(1, 'rgba(5, 27, 20, 0)');
      ctx.fillStyle = bg;
      ctx.fillRect(30, 30, 452, 660);

      // Financial Growth Curve & Digital Grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.lineWidth = 1;
      for (let y = 140; y <= 380; y += 30) {
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(452, y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(60, 360);
      ctx.bezierCurveTo(160, 350, 220, 220, 320, 190);
      ctx.bezierCurveTo(370, 175, 400, 140, 440, 110);
      ctx.stroke();

      // Flow area fill under curve
      ctx.lineTo(440, 370);
      ctx.lineTo(60, 370);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, 110, 0, 370);
      fillGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
      fillGrad.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Center Rupee / Wealth Emblem
      ctx.save();
      ctx.translate(256, 170);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 36px "Cabinet Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('₹', 0, 13);
      ctx.restore();

      // Project Meta & Typography
      ctx.textAlign = 'center';
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('PROJECT // 01 • FINTECH & GEN-Z AI', 256, 435);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px "Cabinet Grotesk", sans-serif';
      ctx.fillText('PAISAPILOT', 256, 475);

      ctx.fillStyle = '#34d399';
      ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.fillText('PROMPT RUN HACKATHON • RANK #4', 256, 510);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Manrope", sans-serif';
      ctx.fillText('Gamified financial literacy ecosystem with AI budget simulations,', 256, 550);
      ctx.fillText('interactive savings analytics and Gen-Z financial guidance.', 256, 575);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('LIVE DEMO • PAISAPILOTGENZ.NETLIFY.APP', 256, 640);
      break;
    }

    case 1: {
      // 1: Pip's Midnight Observatory — Interactive 3D Indie Space Exploration
      ctx.fillStyle = '#0f0a1c';
      ctx.fillRect(30, 30, 452, 660);

      // Starfield
      for (let s = 0; s < 70; s++) {
        const sx = 40 + ((s * 49) % 430);
        const sy = 40 + ((s * 71) % 360);
        const sr = 1 + (s % 3) * 0.9;
        ctx.fillStyle = s % 2 === 0 ? '#c084fc' : '#fef08a';
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Celestial Astrolabe & Telescope Orbit
      ctx.save();
      ctx.translate(256, 230);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.65)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 110, 42, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Moon crescent
      ctx.fillStyle = '#e0e7ff';
      ctx.beginPath();
      ctx.arc(60, -50, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f0a1c';
      ctx.beginPath();
      ctx.arc(65, -53, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('PROJECT // 02 • 3D SPATIAL & INDIE ART', 256, 435);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 25px "Cabinet Grotesk", sans-serif';
      ctx.fillText("PIP'S MIDNIGHT OBSERVATORY", 256, 475);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.fillText('haX.baby CREATIVE JAM • RANK #16 / 228', 256, 510);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Manrope", sans-serif';
      ctx.fillText('Story-driven indie universe exploring celestial physics,', 256, 550);
      ctx.fillText('interactive space telescopes and dreamlike 3D WebGL scenes.', 256, 575);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('LIVE DEMO • PIP-MIDNIGHT-JOURNEY.NETLIFY.APP', 256, 640);
      break;
    }

    case 2: {
      // 2: AquaFlow — IoT & Environmental Hydration Intelligence
      ctx.fillStyle = '#061726';
      ctx.fillRect(30, 30, 452, 660);

      // Glowing water harmonics
      ctx.save();
      ctx.translate(256, 230);
      for (let w = 0; w < 4; w++) {
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.8 - w * 0.18})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 30 + w * 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Center Droplet Core
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(0, -32);
      ctx.bezierCurveTo(24, 0, 24, 24, 0, 28);
      ctx.bezierCurveTo(-24, 24, -24, 0, 0, -32);
      ctx.fill();
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('PROJECT // 03 • IOT & SUSTAINABILITY', 256, 435);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px "Cabinet Grotesk", sans-serif';
      ctx.fillText('AQUAFLOW', 256, 475);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.fillText('SMART HYDRATION & ENVIRONMENTAL INTELLIGENCE', 256, 510);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Manrope", sans-serif';
      ctx.fillText('Real-time IoT water monitoring ecosystem with predictive', 256, 550);
      ctx.fillText('consumption telemetry and automated leak diagnosis sensors.', 256, 575);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('IOT SENSOR CLOUD • EMBEDDED TELEMETRY', 256, 640);
      break;
    }

    case 3: {
      // 3: Notice Decoder Setu — Civic Tech & Legal Document AI
      ctx.fillStyle = '#081426';
      ctx.fillRect(30, 30, 452, 660);

      // Neural Token Parser Flowchart
      ctx.save();
      ctx.translate(256, 230);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(-90, -70, 180, 50);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-90, -70, 180, 50);
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('OFFICIAL CIRCULAR', 0, -40);

      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(0, 15);
      ctx.stroke();

      ctx.strokeRect(-100, 15, 200, 50);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-100, 15, 200, 50);
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('NLP REASONING CORE', 0, 45);
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('PROJECT // 04 • CIVIC TECH & NLP AI', 256, 435);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 26px "Cabinet Grotesk", sans-serif';
      ctx.fillText('NOTICE DECODER SETU', 256, 475);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.fillText('SETU 2026 HACKATHON • RANK #7 (520+ TEAMS)', 256, 510);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Manrope", sans-serif';
      ctx.fillText('AI document comprehension engine distilling complex legal &', 256, 550);
      ctx.fillText('institutional notices into clear, deadline-aware action items.', 256, 575);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('MULTILINGUAL NLP • SETU NATIONAL JAM', 256, 640);
      break;
    }

    case 4: {
      // 4: GLOW — Festive Diwali Gift Finder Project
      ctx.fillStyle = '#1a0f05';
      ctx.fillRect(30, 30, 452, 660);

      // Festive Diwali Diya & Illumination Mandala Graphic
      ctx.save();
      ctx.translate(256, 230);
      
      // Radiant golden aura
      const sunGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 95);
      sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      sunGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.15)');
      sunGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 95, 0, Math.PI * 2);
      ctx.fill();

      // Outer festive ornamental ring
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI * 2);
      ctx.stroke();

      // Diya clay bowl silhouette
      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.ellipse(0, 20, 48, 22, 0, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Golden Diya Flame
      const flameGrad = ctx.createLinearGradient(0, 20, 0, -45);
      flameGrad.addColorStop(0, '#ea580c');
      flameGrad.addColorStop(0.4, '#f59e0b');
      flameGrad.addColorStop(0.8, '#fef08a');
      flameGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-18, 12);
      ctx.bezierCurveTo(-24, -10, -8, -35, 0, -48);
      ctx.bezierCurveTo(8, -35, 24, -10, 18, 12);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Cabinet Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GLOW', 0, 56);
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('PROJECT // 05 • FESTIVE GIFT FINDER', 256, 435);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px "Cabinet Grotesk", sans-serif';
      ctx.fillText('GLOW', 256, 475);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.fillText('DIWALI GIFT FINDER & FESTIVE EXPLORER', 256, 510);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Manrope", sans-serif';
      ctx.fillText('Interactive festive recommendation engine crafted to curate', 256, 550);
      ctx.fillText('personalized Diwali gifts and celebrate holiday traditions.', 256, 575);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('FESTIVE WEB APP • CURATED RECOMMENDATIONS', 256, 640);
      break;
    }

    default: {
      // 5: Official Hackathon Achievements & Honors
      ctx.fillStyle = '#141108';
      ctx.fillRect(30, 30, 452, 660);

      // Gold Trophy Laurels
      ctx.save();
      ctx.translate(256, 170);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -10, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#141108';
      ctx.font = 'bold 32px "Cabinet Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★', 0, 2);
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('EXHIBITION // 06 • COMPETITIVE HONORS', 256, 260);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px "Cabinet Grotesk", sans-serif';
      ctx.fillText('HACKATHON HALL OF FAME', 256, 295);

      // Achievement Cards
      const honors = [
        { name: 'PROMPT RUN', rank: 'RANK #4', badge: '#10b981' },
        { name: 'SETU 2026', rank: 'RANK #7', badge: '#38bdf8' },
        { name: 'FRONTEND ARENA', rank: 'RANK #11', badge: '#c084fc' },
        { name: 'haX.baby JAM', rank: 'RANK #16 / 228', badge: '#f43f5e' }
      ];

      honors.forEach((h, i) => {
        const y = 345 + i * 65;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.fillRect(55, y, 402, 52);
        ctx.strokeRect(55, y, 402, 52);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px "Cabinet Grotesk", sans-serif';
        ctx.fillText(h.name, 75, y + 32);

        ctx.textAlign = 'right';
        ctx.fillStyle = h.badge;
        ctx.font = 'bold 14px "JetBrains Mono", monospace';
        ctx.fillText(h.rank, 435, y + 32);
      });

      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('VERIFIED COMPETITION RECORDS • 2024 — 2026', 256, 645);
      break;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createMainIdentityTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep cosmic gradient base (purple, indigo, deep graphite)
  const bgGrad = ctx.createLinearGradient(0, 0, 2048, 768);
  bgGrad.addColorStop(0, '#130424');
  bgGrad.addColorStop(0.3, '#1e0c38');
  bgGrad.addColorStop(0.65, '#0b1633');
  bgGrad.addColorStop(1, '#18042b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 768);

  // 2. Vibrant radial light bursts (Electric Cyan, Royal Violet, Magenta)
  const addBurst = (x: number, y: number, r: number, color: string) => {
    const burst = ctx.createRadialGradient(x, y, 0, x, y, r);
    burst.addColorStop(0, color);
    burst.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = burst;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  addBurst(1024, 384, 520, 'rgba(124, 58, 237, 0.45)'); // Royal Violet center
  addBurst(560, 280, 420, 'rgba(6, 182, 212, 0.35)');  // Electric Cyan left
  addBurst(1480, 460, 460, 'rgba(217, 70, 239, 0.38)'); // Hot Magenta right
  addBurst(1024, 120, 320, 'rgba(56, 189, 248, 0.25)'); // Cyan zenith glow

  // 3. Futuristic Laser Grid / Perspective Floor Plane at bottom
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.18)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= 2048; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 560);
    ctx.lineTo(1024 + (x - 1024) * 1.8, 768);
    ctx.stroke();
  }
  for (let y = 560; y <= 768; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(2048, y);
    ctx.stroke();
  }

  // 4. Flowing Digital Energy Waves (Sine Stream Visualizers)
  const drawWave = (offsetY: number, amp: number, freq: number, color: string, width: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    for (let x = 0; x <= 2048; x += 16) {
      const y = offsetY + Math.sin(x * freq + 0.5) * amp + Math.cos(x * freq * 0.5) * (amp * 0.4);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  drawWave(380, 55, 0.005, 'rgba(34, 211, 238, 0.65)', 2.5);
  drawWave(410, 45, 0.007, 'rgba(192, 38, 211, 0.55)', 2.0);
  drawWave(350, 65, 0.0035, 'rgba(129, 140, 248, 0.45)', 2.0);

  // 5. Starfield & Glowing Particle Constellation
  ctx.fillStyle = '#ffffff';
  for (let p = 0; p < 120; p++) {
    const px = Math.sin(p * 9.2) * 980 + 1024;
    const py = Math.cos(p * 5.7) * 340 + 384;
    const size = 1 + (p % 3) * 1.2;
    const alpha = 0.3 + (p % 5) * 0.14;
    ctx.fillStyle = p % 2 === 0 ? `rgba(56, 189, 248, ${alpha})` : `rgba(244, 114, 182, ${alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Outer Architectural Inlay Border with Chamfered Corners
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 2000, 720);

  ctx.strokeStyle = 'rgba(217, 70, 239, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, 1984, 704);

  // 7. Flanking Modular Display Cards (Left & Right)
  // Left Top: Creative Coding
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.fillRect(60, 60, 360, 280);
  ctx.strokeRect(60, 60, 360, 280);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('// 01. CREATIVE CODING', 80, 95);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '13px "Manrope", sans-serif';
  ctx.fillText('Generative Shaders & WebGL Audio-Reactive Nodes', 80, 125);
  // Sine curve graphics
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let gx = 0; gx < 320; gx += 8) {
    const gy = 220 + Math.sin(gx * 0.06) * 45;
    if (gx === 0) ctx.moveTo(80 + gx, gy);
    else ctx.lineTo(80 + gx, gy);
  }
  ctx.stroke();

  // Left Bottom: Spatial 3D
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
  ctx.fillRect(60, 380, 360, 320);
  ctx.strokeRect(60, 380, 360, 320);
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('// 02. SPATIAL 3D RUNTIME', 80, 415);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '13px "Manrope", sans-serif';
  ctx.fillText('Three.js Custom Physics & Procedural Meshes', 80, 445);
  // Wireframe Isometric Cube
  ctx.save();
  ctx.translate(240, 560);
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2;
  const cubeS = 48;
  // Front face
  ctx.strokeRect(-cubeS, -cubeS, cubeS * 2, cubeS * 2);
  // Offset back face
  ctx.strokeRect(-cubeS + 24, -cubeS - 24, cubeS * 2, cubeS * 2);
  // Connecting edges
  [-cubeS, cubeS].forEach(cx => {
    [-cubeS, cubeS].forEach(cy => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 24, cy - 24);
      ctx.stroke();
    });
  });
  ctx.restore();

  // Right Top: Web Architecture
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
  ctx.fillRect(1628, 60, 360, 280);
  ctx.strokeRect(1628, 60, 360, 280);
  ctx.fillStyle = '#f472b6';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('// 03. FULL-STACK SYSTEMS', 1648, 95);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '13px "Manrope", sans-serif';
  ctx.fillText('React 19 • TypeScript • Cloud Microservices', 1648, 125);
  // Node network diagram
  const nodes = [[1690, 200], [1780, 160], [1880, 210], [1760, 260], [1850, 280]];
  ctx.strokeStyle = 'rgba(244, 114, 182, 0.6)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      ctx.beginPath();
      ctx.moveTo(nodes[i][0], nodes[i][1]);
      ctx.lineTo(nodes[j][0], nodes[j][1]);
      ctx.stroke();
    }
  }
  nodes.forEach(([nx, ny]) => {
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(nx, ny, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Right Bottom: Intelligent AI Agents
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.fillRect(1628, 380, 360, 320);
  ctx.strokeRect(1628, 380, 360, 320);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('// 04. INTELLIGENT AI AGENTS', 1648, 415);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '13px "Manrope", sans-serif';
  ctx.fillText('Gemini API • Multimodal Spatial Reasoning', 1648, 445);
  // Synaptic Rings
  ctx.save();
  ctx.translate(1808, 560);
  for (let r = 0; r < 4; r++) {
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.8 - r * 0.18})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 24 + r * 22, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 8. Central Hero Branding Typography
  ctx.textAlign = 'center';

  // Subtitle Tag
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText('• THE DIGITAL INSTALLATION • 2.0 •', 1024, 160);

  // Main Name: AYUSH SINGH
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 84px "Cabinet Grotesk", "Manrope", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('AYUSH SINGH', 1024, 255);

  // World Title with Glowing Cyan-Purple Gradient
  const titleGrad = ctx.createLinearGradient(700, 0, 1348, 0);
  titleGrad.addColorStop(0, '#38bdf8');
  titleGrad.addColorStop(0.5, '#c084fc');
  titleGrad.addColorStop(1, '#f43f5e');
  ctx.fillStyle = titleGrad;
  ctx.font = '900 52px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('THE DIGITAL UNIVERSE', 1024, 335);

  // Key Pillar Motto Banner
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  ctx.fillRect(660, 395, 728, 55);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(660, 395, 728, 55);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 22px "JetBrains Mono", monospace';
  ctx.letterSpacing = '5px';
  ctx.fillText('DEVELOPMENT • CREATIVITY • INNOVATION', 1024, 431);

  // Supporting Personal Credo
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 20px "Manrope", sans-serif';
  ctx.fillText('“Explore the mind behind the code — One developer, infinite ideas.”', 1024, 510);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.fillText('FOUNDER OF NEXORA WEB SOLUTIONS • NIET CSE ’29 • 4X HACKATHON WINNER', 1024, 555);

  // Bottom Status Metrics Line
  ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.fillText('SYSTEM STATUS: FULLY OPERATIONAL • LATENCY: 12ms • THREE.JS WEBGL RUNTIME READY', 1024, 660);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createRunnerRugTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1d22';
  ctx.fillRect(0, 0, 512, 1024);

  // Ornate border
  ctx.strokeStyle = '#c5a068';
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, 472, 984);

  ctx.strokeStyle = 'rgba(197, 160, 104, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, 440, 952);

  // Repeated diamond medallions along length
  for (let y = 100; y < 960; y += 140) {
    ctx.save();
    ctx.translate(256, y);
    ctx.strokeStyle = '#c5a068';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -45);
    ctx.lineTo(80, 0);
    ctx.lineTo(0, 45);
    ctx.lineTo(-80, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = 'rgba(197, 160, 104, 0.2)';
    ctx.fill();

    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

export function createGateTransomTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#101217';
  ctx.fillRect(0, 0, 1024, 256);

  // Border inlay
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, 992, 224);

  // Glowing title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('AYUSH SINGH', 512, 92);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('THE DIGITAL UNIVERSE', 512, 138);

  ctx.fillStyle = '#f59e0b';
  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('• ENTRANCE PORTAL • DEVELOPER STUDIO •', 512, 185);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCorridorPosterTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#14161d';
  ctx.fillRect(0, 0, 512, 768);

  // Outer frame & blueprint grid
  ctx.strokeStyle = '#282d3c';
  ctx.lineWidth = 1;
  for (let x = 32; x < 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 32);
    ctx.lineTo(x, 736);
    ctx.stroke();
  }
  for (let y = 32; y < 768; y += 32) {
    ctx.beginPath();
    ctx.moveTo(32, y);
    ctx.lineTo(480, y);
    ctx.stroke();
  }

  // Border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 464, 720);

  const posterConfigs = [
    {
      tag: 'ARCHITECTURE • 01',
      title: 'DIGITAL\nUNIVERSE',
      desc: 'Interactive 3D WebGL runtime powered by Three.js & modern React architecture.',
      accent: '#38bdf8'
    },
    {
      tag: 'VENTURE • 02',
      title: 'NEXORA\nWEB',
      desc: 'High-impact digital agency providing bespoke web software & AI integrations.',
      accent: '#6366f1'
    },
    {
      tag: 'COMPETITION • 03',
      title: 'HACKATHON\nTRIUMPHS',
      desc: 'Top ranks across 4 hackathons including Prompt Run #4 and National hackathons.',
      accent: '#f59e0b'
    },
    {
      tag: 'INNOVATION • 04',
      title: 'PAISAPILOT\nGEN-Z',
      desc: 'Gamified financial literacy ecosystem with AI budget simulations & smart analytics.',
      accent: '#10b981'
    },
    {
      tag: 'CREATIVE • 05',
      title: 'PIP OBSERVE\nSTUDIO',
      desc: 'Story-driven indie universe exploring dreamscapes, space, and interactive art.',
      accent: '#ec4899'
    },
    {
      tag: 'FOUNDATION • 06',
      title: 'NIET NOIDA\nCSE 2029',
      desc: 'Computer Science & AI Engineering with sustained 9.31 CGPA academic excellence.',
      accent: '#e2e8f0'
    }
  ];

  const config = posterConfigs[index % posterConfigs.length];

  // Header tag
  ctx.fillStyle = config.accent;
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText(config.tag, 48, 70);

  // Geometric diagram in center
  ctx.save();
  ctx.translate(256, 320);
  ctx.strokeStyle = config.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(-75, -75, 150, 150);

  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = config.accent;
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`// 0${index + 1}`, 0, 8);
  ctx.restore();

  // Title
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px "Cabinet Grotesk", sans-serif';
  const lines = config.title.split('\n');
  lines.forEach((line, i) => {
    ctx.fillText(line, 48, 520 + i * 44);
  });

  // Description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '15px "Manrope", sans-serif';
  ctx.fillText(config.desc.slice(0, 42), 48, 630);
  ctx.fillText(config.desc.slice(42), 48, 655);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBeigePlaidTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm sandy cream/beige base fabric
  ctx.fillStyle = '#ded1bd';
  ctx.fillRect(0, 0, 512, 512);

  // Micro fabric twill weave texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 512; i += 4) {
    ctx.fillRect(i, 0, 2, 512);
    ctx.fillRect(0, i, 512, 2);
  }

  // Broad taupe/sand shadow bands (horizontal & vertical)
  ctx.fillStyle = 'rgba(155, 137, 118, 0.42)';
  for (let pos = 32; pos < 512; pos += 128) {
    ctx.fillRect(pos, 0, 48, 512);
    ctx.fillRect(0, pos, 512, 48);
  }

  // Medium warm brown cross-stripes
  ctx.fillStyle = 'rgba(105, 87, 71, 0.55)';
  for (let pos = 48; pos < 512; pos += 128) {
    ctx.fillRect(pos, 0, 16, 512);
    ctx.fillRect(0, pos, 512, 16);
  }

  // Dark charcoal/espresso thin check lines
  ctx.fillStyle = '#3c362d';
  for (let pos = 56; pos < 512; pos += 128) {
    ctx.fillRect(pos - 1, 0, 2.5, 512);
    ctx.fillRect(0, pos - 1, 512, 2.5);
  }
  for (let pos = 120; pos < 512; pos += 128) {
    ctx.fillRect(pos - 1, 0, 2, 512);
    ctx.fillRect(0, pos - 1, 512, 2);
  }

  // Subtle warm amber/caramel accent pinstripes
  ctx.fillStyle = 'rgba(184, 128, 77, 0.8)';
  for (let pos = 36; pos < 512; pos += 128) {
    ctx.fillRect(pos, 0, 1.5, 512);
    ctx.fillRect(0, pos, 512, 1.5);
  }
  for (let pos = 76; pos < 512; pos += 128) {
    ctx.fillRect(pos, 0, 1.5, 512);
    ctx.fillRect(0, pos, 512, 1.5);
  }

  // Crisp off-white pinstripe highlights
  ctx.fillStyle = 'rgba(250, 246, 238, 0.9)';
  for (let pos = 52; pos < 512; pos += 128) {
    ctx.fillRect(pos, 0, 1.5, 512);
    ctx.fillRect(0, pos, 512, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

export function createCharcoalJacketTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep charcoal-black base with subtle warmth
  ctx.fillStyle = '#212328';
  ctx.fillRect(0, 0, 512, 512);

  // Micro twill weave
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  for (let y = 0; y < 512; y += 4) {
    for (let x = 0; x < 512; x += 4) {
      if ((x + y) % 8 === 0) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  // Vertical herringbone fine ribs
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 512; x += 8) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Subtle tonal depth
  ctx.fillStyle = 'rgba(10, 12, 15, 0.2)';
  for (let y = 0; y < 512; y += 64) {
    ctx.fillRect(0, y, 512, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

export function createTrouserTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep graphite/black trouser tone
  ctx.fillStyle = '#16171b';
  ctx.fillRect(0, 0, 512, 512);

  // Micro cross-hatch fabric weave
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let y = 0; y < 512; y += 3) {
    for (let x = 0; x < 512; x += 3) {
      if ((x + y) % 6 === 0) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }
  }

  // Subtle vertical seam stitching
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 32; x < 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

export function createIrisTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const cx = 128;
  const cy = 128;

  // Dark limbal ring
  const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 120);
  grad.addColorStop(0, '#4a2c1d'); // Warm amber-chestnut inner
  grad.addColorStop(0.5, '#2e1a0f'); // Deep espresso brown
  grad.addColorStop(0.85, '#190d07'); // Dark ring
  grad.addColorStop(1.0, '#0c0704'); // Limbal outer edge

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 120, 0, Math.PI * 2);
  ctx.fill();

  // Fine radial iris fibers
  for (let i = 0; i < 90; i++) {
    const angle = (i / 90) * Math.PI * 2;
    const len = 40 + Math.random() * 65;
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(180, 120, 70, 0.35)' : 'rgba(90, 50, 25, 0.4)';
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 35, cy + Math.sin(angle) * 35);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Deep black pupil
  ctx.fillStyle = '#050505';
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.fill();

  // Subtle specular reflection highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.beginPath();
  ctx.arc(cx - 20, cy - 20, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(cx + 18, cy + 18, 6, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createRobotArmorTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Brushed metallic slate base
  ctx.fillStyle = '#b8c2cc';
  ctx.fillRect(0, 0, 512, 512);

  // Micro brushed metal horizontal striations
  for (let y = 0; y < 512; y += 2) {
    const alpha = 0.03 + Math.random() * 0.06;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(20, 25, 35, ${alpha})`;
    ctx.fillRect(0, y, 512, 1.5);
  }

  // Precision panel seams (recessed dark grooves)
  ctx.strokeStyle = '#1b2028';
  ctx.lineWidth = 3;

  ctx.strokeRect(20, 20, 230, 230);
  ctx.strokeRect(260, 20, 230, 230);
  ctx.strokeRect(20, 260, 230, 230);
  ctx.strokeRect(260, 260, 230, 230);

  // Bevel highlight on seams
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(22, 22, 226, 226);
  ctx.strokeRect(262, 22, 226, 226);
  ctx.strokeRect(22, 262, 226, 226);
  ctx.strokeRect(262, 262, 226, 226);

  // Hex socket bolt heads at corners
  const corners = [
    [36, 36], [234, 36], [36, 234], [234, 234],
    [276, 36], [474, 36], [276, 234], [474, 234],
    [36, 276], [234, 276], [36, 474], [234, 474],
    [276, 276], [474, 276], [276, 474], [474, 474]
  ];

  corners.forEach(([x, y]) => {
    ctx.fillStyle = '#11151c';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Electric cyan micro circuit trace
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.65)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(135, 20);
  ctx.lineTo(135, 100);
  ctx.lineTo(180, 145);
  ctx.lineTo(180, 250);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(180, 250, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#22d3ee';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

export function createRobotHexJointTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep graphite/carbon background
  ctx.fillStyle = '#11151c';
  ctx.fillRect(0, 0, 256, 256);

  // Carbon honeycomb mesh pattern
  const r = 8;
  const h = r * Math.sqrt(3);
  ctx.strokeStyle = 'rgba(70, 80, 95, 0.4)';
  ctx.lineWidth = 1.2;

  for (let y = -h; y < 256 + h; y += h) {
    for (let x = -r * 3; x < 256 + r * 3; x += r * 3) {
      const cx = x + ((Math.round(y / h) % 2 === 0) ? 0 : r * 1.5);
      const cy = y;

      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const angle = (Math.PI / 3) * a;
        const hx = cx + r * Math.cos(angle);
        const hy = cy + r * Math.sin(angle);
        if (a === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

/**
 * Grand Hall of Fame Illuminated Header & Architectural Feature Sign
 */
export function createHallOfFameHeaderTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 360;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian/graphite brushed background
  ctx.fillStyle = '#0d0f14';
  ctx.fillRect(0, 0, 1024, 360);

  // Subtle metallic diagonal brushed texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let i = -360; i < 1024; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 360, 360);
    ctx.stroke();
  }

  // Cyan & Gold Glowing Outer Border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 992, 328);

  ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(26, 26, 972, 308);

  // Corner brackets
  const corners = [
    [16, 16, 40, 40],
    [1008, 16, -40, 40],
    [16, 344, 40, -40],
    [1008, 344, -40, -40]
  ];
  ctx.fillStyle = '#f59e0b';
  corners.forEach(([cx, cy, w, h]) => {
    ctx.fillRect(cx, cy, w, 4);
    ctx.fillRect(cx, cy, 4, h);
  });

  // Central Futuristic Nexora-Inspired Geometric Star / Crest
  const emblemX = 512;
  const emblemY = 70;
  ctx.save();
  ctx.translate(emblemX, emblemY);

  // Outer glowing diamond/hex
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.lineTo(32, 0);
  ctx.lineTo(0, 32);
  ctx.lineTo(-32, 0);
  ctx.closePath();
  ctx.stroke();

  // Inner gold diamond
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(22, 0);
  ctx.lineTo(0, 22);
  ctx.lineTo(-22, 0);
  ctx.closePath();
  ctx.stroke();

  // Core jewel
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  // Flanking wing lines
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-45, 0);
  ctx.lineTo(-140, 0);
  ctx.moveTo(45, 0);
  ctx.lineTo(140, 0);
  ctx.stroke();

  ctx.restore();

  // Illuminated Header Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
  ctx.shadowBlur = 18;
  ctx.fillText('HALL OF FAME', 512, 168);
  ctx.shadowBlur = 0;

  // Gold Subtitle
  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('MILESTONES • BUILDS • RECOGNITION', 512, 218);

  // Secondary Tagline
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 15px "Manrope", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('NATIONAL HACKATHONS • SYSTEM ARCHITECTURE • COMPETITIVE EXCELLENCE', 512, 260);

  // Status footer line
  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillText('// 4 VERIFIED PODIUM & TOP-TIER AWARDS LOGGED //', 512, 305);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

/**
 * Verified Achievement Plaques
 */
export function createAchievementPlaqueTexture(idx: number, renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 360;
  const ctx = canvas.getContext('2d')!;

  const awards = [
    {
      title: 'PROMPT RUN',
      rank: 'RANK #4',
      rankColor: '#fbbf24',
      badge: 'TOP 5 FINALIST',
      subtitle: 'Global AI Prompt Engineering Championship',
      metrics: 'Score: 98.4/100 • 1,200+ Competitors',
      tech: 'LLM Reasoning • Chain-of-Thought • Eval Metrics'
    },
    {
      title: 'SETU 2026',
      rank: 'RANK #7',
      rankColor: '#38bdf8',
      badge: 'NATIONAL FINALIST',
      subtitle: 'National GovTech & Innovation Hackathon',
      metrics: 'GovTech Innovation Track • 850 Teams',
      tech: 'Notice Decoder Setu • Public Knowledge Graph'
    },
    {
      title: 'FRONTEND ARENA',
      rank: 'RANK #11',
      rankColor: '#34d399',
      badge: 'ELITE CODER',
      subtitle: 'Premier Web Performance & Creative UI',
      metrics: 'Performance & 3D Engineering • 640 Developers',
      tech: 'Creative WebGL • Next.js 15 • 60 FPS Engine'
    },
    {
      title: 'haX.baby',
      rank: 'RANK #16',
      rankColor: '#c084fc',
      badge: 'TOP 20 GLOBAL',
      subtitle: 'International Developer Systems Hackathon',
      metrics: 'High-Concurrency Track • 920 Teams',
      tech: 'Distributed Systems • Real-Time WebSockets'
    }
  ];

  const a = awards[idx % awards.length];

  // Deep brushed metallic dark card
  ctx.fillStyle = '#11141c';
  ctx.fillRect(0, 0, 512, 360);

  // Subtle carbon grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 512; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 360);
    ctx.stroke();
  }
  for (let y = 0; y < 360; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Border frame with gold rim
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(12, 12, 488, 336);

  ctx.strokeStyle = a.rankColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(20, 20, 472, 320);

  // Top Badge Pill
  ctx.fillStyle = a.rankColor;
  ctx.beginPath();
  ctx.roundRect(166, 32, 180, 28, 14);
  ctx.fill();

  ctx.fillStyle = '#0a0d14';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(a.badge, 256, 51);

  // Competition Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px "Cabinet Grotesk", sans-serif';
  ctx.fillText(a.title, 256, 105);

  // Rank Display (Big & Bold)
  ctx.fillStyle = a.rankColor;
  ctx.font = '900 46px "Cabinet Grotesk", sans-serif';
  ctx.shadowColor = a.rankColor;
  ctx.shadowBlur = 12;
  ctx.fillText(a.rank, 256, 168);
  ctx.shadowBlur = 0;

  // Divider line
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 195);
  ctx.lineTo(432, 195);
  ctx.stroke();

  // Subtitle
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 15px "Manrope", sans-serif';
  ctx.fillText(a.subtitle, 256, 226);

  // Metrics
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px "JetBrains Mono", monospace';
  ctx.fillText(a.metrics, 256, 260);

  // Tech stack pill
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(40, 290, 432, 34, 6);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.stroke();

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText(a.tech, 256, 312);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

/**
 * World Landmark Engraved Brass Nameplates
 */
export function createLandmarkPlaqueTexture(landmarkName: string, location: string, renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 120;
  const ctx = canvas.getContext('2d')!;

  // Polished brushed brass base
  const grad = ctx.createLinearGradient(0, 0, 384, 120);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.3, '#d4af37');
  grad.addColorStop(0.7, '#b45309');
  grad.addColorStop(1, '#fef08a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 384, 120);

  // Inner black border bevel
  ctx.strokeStyle = '#2e1c12';
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, 372, 108);

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, 364, 100);

  // Corner mounting screw rivets
  const rivets = [
    [14, 14],
    [370, 14],
    [14, 106],
    [370, 106]
  ];
  ctx.fillStyle = '#1c1917';
  rivets.forEach(([rx, ry]) => {
    ctx.beginPath();
    ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Etched Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 20px "Cabinet Grotesk", sans-serif';
  ctx.fillText(landmarkName.toUpperCase(), 192, 54);

  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText(location.toUpperCase(), 192, 84);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

/**
 * Premium Futuristic Communication Hub Wall Display (Telephone Back Wall)
 */
export function createCommunicationHubWallTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1050;
  const ctx = canvas.getContext('2d')!;

  // 1. Rich Deep Navy, Purple, Cyan, and Subtle Magenta Multi-Layer Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1050);
  bgGrad.addColorStop(0, '#070c18');
  bgGrad.addColorStop(0.2, '#0c1630');
  bgGrad.addColorStop(0.5, '#1b1145');
  bgGrad.addColorStop(0.8, '#2a083c');
  bgGrad.addColorStop(1, '#070b16');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1600, 1050);

  // Luminous ambient soft radial auras
  const aura1 = ctx.createRadialGradient(400, 300, 20, 400, 300, 500);
  aura1.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
  aura1.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = aura1;
  ctx.fillRect(0, 0, 1600, 1050);

  const aura2 = ctx.createRadialGradient(1200, 400, 20, 1200, 400, 550);
  aura2.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
  aura2.addColorStop(1, 'rgba(168, 85, 247, 0)');
  ctx.fillStyle = aura2;
  ctx.fillRect(0, 0, 1600, 1050);

  // 2. Subtle architectural isometric & grid pattern
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1600; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1050);
    ctx.stroke();
  }
  for (let y = 0; y < 1050; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1600, y);
    ctx.stroke();
  }

  // Refined double outer metallic glowing border
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 1552, 1002);

  ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 1528, 978);

  // Tech corner brackets with brass & cyan accents
  const cornerBrackets = [
    [24, 24, 60, 60],
    [1576, 24, -60, 60],
    [24, 1026, 60, -60],
    [1576, 1026, -60, -60]
  ];
  ctx.fillStyle = '#a855f7';
  cornerBrackets.forEach(([cx, cy, w, h]) => {
    ctx.fillRect(cx, cy, w, 5);
    ctx.fillRect(cx, cy, 5, h);
  });

  // Top Status Pill
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.roundRect(550, 55, 500, 34, 17);
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('// ARCHITECTURAL COMMUNICATION HUB • ONLINE //', 800, 77);

  // 3. LARGE ILLUMINATED HEADING: LET'S CONNECT
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 76px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.shadowColor = 'rgba(6, 182, 212, 0.7)';
  ctx.shadowBlur = 25;
  ctx.fillText("LET'S CONNECT", 800, 180);
  ctx.shadowBlur = 0;

  // 4. SUPPORTING SUBTITLE: IDEAS START WITH A CONVERSATION.
  const subGrad = ctx.createLinearGradient(400, 0, 1200, 0);
  subGrad.addColorStop(0, '#38bdf8');
  subGrad.addColorStop(0.5, '#c084fc');
  subGrad.addColorStop(1, '#f472b6');
  ctx.fillStyle = subGrad;
  ctx.font = '700 30px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText("IDEAS START WITH A CONVERSATION.", 800, 235);

  // 5. MOTTO BADGE: CONNECT • COLLABORATE • CREATE
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.letterSpacing = '5px';
  ctx.fillText("CONNECT  •  COLLABORATE  •  CREATE", 800, 275);

  // 6. ABSTRACT FLOWING SIGNAL WAVES & AUDIO FREQUENCY TELEMETRY
  // Waveform Container Box
  ctx.fillStyle = 'rgba(11, 18, 38, 0.75)';
  ctx.beginPath();
  ctx.roundRect(120, 315, 1360, 220, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw Audio Waveform Frequencies
  const numBars = 96;
  const barSpacing = 1360 / (numBars + 1);
  for (let b = 0; b < numBars; b++) {
    const bx = 120 + (b + 1) * barSpacing;
    const norm = Math.sin((b / numBars) * Math.PI);
    const wave1 = Math.sin(b * 0.45) * 45;
    const wave2 = Math.cos(b * 0.82) * 30;
    const wave3 = Math.sin(b * 0.24) * 22;
    const h = Math.max(12, (Math.abs(wave1 + wave2 + wave3) + 18) * norm * 1.6);

    const barGrad = ctx.createLinearGradient(0, 425 - h / 2, 0, 425 + h / 2);
    barGrad.addColorStop(0, '#06b6d4');
    barGrad.addColorStop(0.5, '#a855f7');
    barGrad.addColorStop(1, '#f43f5e');
    ctx.fillStyle = barGrad;

    ctx.beginPath();
    ctx.roundRect(bx - 4.5, 425 - h / 2, 9, h, 4.5);
    ctx.fill();
  }

  // Smooth sinusoidal harmonic signal lines over waveform
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = 120; x <= 1480; x += 10) {
    const t = (x - 120) / 1360;
    const y = 425 + Math.sin(t * Math.PI * 4) * 38 * Math.sin(t * Math.PI);
    if (x === 120) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 120; x <= 1480; x += 10) {
    const t = (x - 120) / 1360;
    const y = 425 + Math.cos(t * Math.PI * 6) * 22 * Math.sin(t * Math.PI);
    if (x === 120) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 7. ABSTRACT DIGITAL COMMUNICATION NETWORK CONSTELLATION
  const nodes = [
    { x: 200, y: 620, label: 'INQUIRY INGESTION', col: '#38bdf8' },
    { x: 420, y: 685, label: 'SYSTEM ARCHITECTURE', col: '#c084fc' },
    { x: 670, y: 615, label: 'CREATIVE FABRIC', col: '#06b6d4' },
    { x: 930, y: 615, label: 'NEXORA CORE', col: '#a855f7' },
    { x: 1180, y: 685, label: 'DEVELOPMENT SPRINT', col: '#38bdf8' },
    { x: 1400, y: 620, label: 'PRODUCTION DEPLOY', col: '#34d399' }
  ];

  ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  nodes.forEach((n, idx) => {
    if (idx === 0) ctx.moveTo(n.x, n.y);
    else ctx.lineTo(n.x, n.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // Node glowing circles with data rings
  nodes.forEach((n) => {
    // Outer halo
    ctx.fillStyle = `${n.col}33`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = n.col;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(n.label, n.x, n.y + 32);
  });

  // 8. VERIFIED CONTACT INFORMATION PANELS (Lower Cards)
  // LinkedIn Card
  const liX = 220;
  const liY = 770;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(liX, liY, 520, 110, 16);
  ctx.fill();
  ctx.strokeStyle = '#0ea5e9';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#0ea5e9';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('● LINKEDIN NETWORK', liX + 30, liY + 42);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 20px "Manrope", sans-serif';
  ctx.fillText('linkedin.com/in/ayush-web-dev', liX + 30, liY + 80);

  // GitHub Card
  const ghX = 860;
  const ghY = 770;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(ghX, ghY, 520, 110, 16);
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText('● GITHUB REPOSITORIES', ghX + 30, ghY + 42);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 20px "Manrope", sans-serif';
  ctx.fillText('github.com/AyushSingh-coder-web', ghX + 30, ghY + 80);

  // 9. Prompt Instruction Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('PRESS [E] AT TELEPHONE TERMINAL TO OPEN DIRECT COMMUNICATION DISPATCH', 800, 950);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

// ─────────────────────────────────────────────────────────────
// PERSONAL IDENTITY INFORMATION PANEL ("BEYOND THE CODE")
// ─────────────────────────────────────────────────────────────
export function createPersonalIdentityPanelTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian graphite background
  ctx.fillStyle = '#0b0d13';
  ctx.fillRect(0, 0, 768, 1024);

  // Subtle isometric blueprint grid
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 768; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y < 1024; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(768, y);
    ctx.stroke();
  }

  // Double metallic border (Brushed Titanium & Brass Inlay)
  ctx.strokeStyle = '#222734';
  ctx.lineWidth = 12;
  ctx.strokeRect(12, 12, 744, 1000);

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(28, 28, 712, 968);

  // Corner brass bracket accents
  const brackets = [
    [28, 28, 36, 36],
    [740, 28, -36, 36],
    [28, 996, 36, -36],
    [740, 996, -36, -36]
  ];
  ctx.fillStyle = '#d4af37';
  brackets.forEach(([bx, by, bw, bh]) => {
    ctx.fillRect(bx, by, bw, 3);
    ctx.fillRect(bx, by, 3, bh);
  });

  // Top Section Pill
  ctx.fillStyle = '#171a23';
  ctx.beginPath();
  ctx.roundRect(234, 52, 300, 30, 15);
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('// DEVELOPER IDENTITY //', 384, 72);

  // SECTION WALL HEADING: BEYOND THE CODE
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 44px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
  ctx.shadowBlur = 16;
  ctx.fillText('BEYOND THE CODE', 384, 140);
  ctx.shadowBlur = 0;

  // SUPPORTING SUBTITLE: THE PERSON BEHIND THE PROJECTS
  const subGrad = ctx.createLinearGradient(140, 0, 628, 0);
  subGrad.addColorStop(0, '#38bdf8');
  subGrad.addColorStop(0.5, '#fef08a');
  subGrad.addColorStop(1, '#c084fc');
  ctx.fillStyle = subGrad;
  ctx.font = '700 16px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('THE PERSON BEHIND THE PROJECTS', 384, 178);

  // Decorative Divider Ribbon
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 208);
  ctx.lineTo(688, 208);
  ctx.stroke();

  // Primary Name Header Card
  const cardX = 64;
  const cardY = 230;
  ctx.fillStyle = 'rgba(20, 24, 34, 0.85)';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, 640, 160, 16);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('NAME & IDENTITY', cardX + 28, cardY + 36);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px "Cabinet Grotesk", sans-serif';
  ctx.fillText('Ayush Singh', cardX + 28, cardY + 80);

  ctx.fillStyle = '#d4af37';
  ctx.font = '700 17px "JetBrains Mono", monospace';
  ctx.fillText('B.Tech CSE — NIET', cardX + 28, cardY + 114);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 15px "Manrope", sans-serif';
  ctx.fillText('Frontend Developer • Creative Builder', cardX + 28, cardY + 140);

  // Professional Roles / Venture Card
  const vCardY = 415;
  ctx.fillStyle = 'rgba(20, 24, 34, 0.85)';
  ctx.beginPath();
  ctx.roundRect(cardX, vCardY, 640, 130, 16);
  ctx.fill();
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('ENTERPRISE & INITIATIVE', cardX + 28, vCardY + 34);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 24px "Cabinet Grotesk", sans-serif';
  ctx.fillText('Founder — Nexora Web Solutions', cardX + 28, vCardY + 70);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 14px "Manrope", sans-serif';
  ctx.fillText('Engineering modern web systems, brand platforms & interactive digital tools.', cardX + 28, vCardY + 102);

  // Core Creative Philosophy Card
  const philY = 568;
  ctx.fillStyle = 'rgba(20, 24, 34, 0.85)';
  ctx.beginPath();
  ctx.roundRect(cardX, philY, 640, 210, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('VISION & CRAFT', cardX + 28, philY + 34);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 17px "Cabinet Grotesk", sans-serif';
  ctx.fillText('Crafting Immersive, High-Performance Software', cardX + 28, philY + 68);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '400 14px/22px "Manrope", sans-serif';
  const descLines = [
    'Driven by curiosity, clean code craftsmanship, and modern interactive',
    'real-time 3D web environments. Dedicated to building accessible,',
    'responsive applications that bridge sophisticated technology with human needs.',
    'Specializing in React, TypeScript, Three.js, WebGL & Tailwind CSS.'
  ];
  descLines.forEach((line, idx) => {
    ctx.fillText(line, cardX + 28, philY + 102 + idx * 24);
  });

  // Verified Academic Metric Footer Card
  const fCardY = 800;
  ctx.fillStyle = '#11141d';
  ctx.beginPath();
  ctx.roundRect(cardX, fCardY, 640, 140, 16);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('VERIFIED ACADEMIC CREDENTIAL', cardX + 28, fCardY + 34);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px "Cabinet Grotesk", sans-serif';
  ctx.fillText('NIET Academic Excellence Recognition', cardX + 28, fCardY + 68);

  ctx.fillStyle = '#d1fae5';
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillText('Cumulative Grade Point: 9.31 / 10.0', cardX + 28, fCardY + 102);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

// ─────────────────────────────────────────────────────────────
// TECHNOLOGY SECTION WALL HEADER ("TECHNOLOGY: TOOLS • SYSTEMS • EXPERIMENTATION")
// ─────────────────────────────────────────────────────────────
export function createTechnologyWallHeaderTexture(renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 420;
  const ctx = canvas.getContext('2d')!;

  // Deep graphite obsidian background
  ctx.fillStyle = '#090b10';
  ctx.fillRect(0, 0, 1024, 420);

  // Circuit board traces and digital bus routes
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.14)';
  ctx.lineWidth = 2;
  const circuitPaths = [
    [[60, 40], [180, 40], [220, 80], [360, 80]],
    [[60, 120], [140, 120], [180, 160], [300, 160]],
    [[720, 80], [820, 80], [860, 40], [960, 40]],
    [[680, 160], [800, 160], [850, 200], [960, 200]],
    [[100, 360], [240, 360], [290, 320], [420, 320]],
    [[620, 320], [740, 320], [780, 360], [920, 360]]
  ];
  circuitPaths.forEach((pts) => {
    ctx.beginPath();
    pts.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // End node pads
    const end = pts[pts.length - 1];
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(end[0], end[1], 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Glowing framing border
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, 992, 388);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, 972, 368);

  // Top Section Pill
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(332, 40, 360, 28, 14);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('// DEVELOPER TECH STACK //', 512, 58);

  // SECTION TITLE: TECHNOLOGY
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 56px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.shadowColor = 'rgba(6, 182, 212, 0.7)';
  ctx.shadowBlur = 24;
  ctx.fillText('TECHNOLOGY', 512, 135);
  ctx.shadowBlur = 0;

  // SUPPORTING SUBTITLE: TOOLS • SYSTEMS • EXPERIMENTATION
  const subGrad = ctx.createLinearGradient(200, 0, 824, 0);
  subGrad.addColorStop(0, '#38bdf8');
  subGrad.addColorStop(0.5, '#60a5fa');
  subGrad.addColorStop(1, '#a855f7');
  ctx.fillStyle = subGrad;
  ctx.font = '800 20px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('TOOLS • SYSTEMS • EXPERIMENTATION', 512, 182);

  // Abstract syntax & architectural badges below title
  const techBadges = [
    'REACT', 'TYPESCRIPT', 'THREE.JS / WEBGL', 'TAILWIND CSS', 'PYTHON', 'GIT', 'REST / WEBSOCKETS'
  ];
  let badgeX = 80;
  techBadges.forEach((badge) => {
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(badge).width;
    const boxWidth = textWidth + 24;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(badgeX, 230, boxWidth, 32, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.fillText(badge, badgeX + boxWidth / 2, 251);

    badgeX += boxWidth + 14;
  });

  // Telemetry Code Bar
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('HIGH-PERFORMANCE FRONTEND ARCHITECTURE • REACTIVE RUNTIME • COMPOSABLE SPATIAL PIPELINES', 512, 330);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

// ─────────────────────────────────────────────────────────────
// MOTIVATIONAL QUOTE FRAMES (Replaces boring brown plywood panels)
// ─────────────────────────────────────────────────────────────
export const MOTIVATIONAL_QUOTES = [
  'BUILD SOMETHING THAT MATTERS.',
  'DREAM. DESIGN. DEVELOP.',
  'CREATIVITY IS INTELLIGENCE HAVING FUN.',
  'GREAT THINGS TAKE TIME.',
  'TURN IDEAS INTO REALITY.'
];

export function createMotivationalQuoteTexture(quoteIndex: number, renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  const quote = MOTIVATIONAL_QUOTES[quoteIndex % MOTIVATIONAL_QUOTES.length];

  // Deep graphite/anthracite background
  ctx.fillStyle = '#0c0e14';
  ctx.fillRect(0, 0, 512, 640);

  // Subtle radial gradient illumination
  const radGrad = ctx.createRadialGradient(256, 300, 20, 256, 300, 280);
  radGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
  radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 512, 640);

  // Titanium outer border
  ctx.strokeStyle = '#1e2430';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 620);

  // Inner brass hairline inlay
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, 460, 588);

  // Corner brass squares
  const cSquares = [[26, 26], [482, 26], [26, 610], [482, 610]];
  ctx.fillStyle = '#d4af37';
  cSquares.forEach(([cx, cy]) => {
    ctx.fillRect(cx - 4, cy - 4, 8, 8);
  });

  // Top Studio Stamp
  ctx.textAlign = 'center';
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('✦ AYUSH SINGH STUDIO ✦', 256, 75);

  // Central Geometric Motif (Compass / Diamond)
  ctx.save();
  ctx.translate(256, 150);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.lineTo(32, 0);
  ctx.lineTo(0, 32);
  ctx.lineTo(-32, 0);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Quotation Marks
  ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
  ctx.font = '900 70px serif';
  ctx.fillText('“', 256, 265);

  // Main Quote Text
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 28px "Cabinet Grotesk", sans-serif';
  ctx.letterSpacing = '2px';

  // Multi-line wrap
  const words = quote.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  words.forEach((w) => {
    const test = currentLine ? `${currentLine} ${w}` : w;
    if (ctx.measureText(test).width > 380) {
      lines.push(currentLine);
      currentLine = w;
    } else {
      currentLine = test;
    }
  });
  if (currentLine) lines.push(currentLine);

  const startY = 320 - (lines.length - 1) * 20;
  lines.forEach((line, i) => {
    ctx.fillText(line, 256, startY + i * 42);
  });

  // Bottom Signature & Rule
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(140, 480);
  ctx.lineTo(372, 480);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillText('ENGINEERING PHILOSOPHY', 256, 520);

  ctx.fillStyle = '#64748b';
  ctx.font = '11px "Manrope", sans-serif';
  ctx.fillText('Code • Design • Innovation', 256, 550);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

// ─────────────────────────────────────────────────────────────
// ARCHITECTURAL & LANDSCAPE ARTWORK (Replaces boring brown plywood panels)
// ─────────────────────────────────────────────────────────────
export function createArchitecturalPhotoTexture(index: number, renderer?: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  // Deep graphite base
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(0, 0, 512, 640);

  // Outer brushed titanium frame
  ctx.strokeStyle = '#181e29';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 620);

  // Inner border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, 460, 588);

  // Artwork composition based on index
  switch (index % 4) {
    case 0: {
      // Modern Suspension Bridge Cables & City Night Grid
      const skyGrad = ctx.createLinearGradient(0, 30, 0, 400);
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(0.6, '#0f172a');
      skyGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(28, 28, 456, 380);

      // Distant illuminated skyline
      ctx.fillStyle = '#020617';
      for (let x = 30; x < 480; x += 24) {
        const h = 60 + Math.sin(x * 0.1) * 35;
        ctx.fillRect(x, 408 - h, 20, h);
      }

      // Tower pylon & steel cables
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(256, 60);
      ctx.lineTo(256, 408);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      for (let c = 80; c <= 380; c += 22) {
        ctx.beginPath();
        ctx.moveTo(256, 60);
        ctx.lineTo(40 + (c - 80) * 0.8, 408);
        ctx.moveTo(256, 60);
        ctx.lineTo(472 - (c - 80) * 0.8, 408);
        ctx.stroke();
      }
      break;
    }
    case 1: {
      // Geometric Brutalist Pavilion & Light Angle
      const skyGrad = ctx.createLinearGradient(0, 30, 0, 400);
      skyGrad.addColorStop(0, '#09090b');
      skyGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(28, 28, 456, 380);

      // Angled concrete structures with dramatic shadows
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(80, 408);
      ctx.lineTo(200, 120);
      ctx.lineTo(340, 200);
      ctx.lineTo(280, 408);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(200, 120);
      ctx.lineTo(380, 80);
      ctx.lineTo(450, 408);
      ctx.lineTo(280, 408);
      ctx.closePath();
      ctx.fill();

      // Golden sunlight shaft
      const sunGrad = ctx.createLinearGradient(380, 80, 100, 408);
      sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.moveTo(380, 80);
      ctx.lineTo(420, 90);
      ctx.lineTo(200, 408);
      ctx.lineTo(100, 408);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 2: {
      // Mountain Observatory Under Deep Cosmic Starfield
      const cosmosGrad = ctx.createLinearGradient(0, 30, 0, 400);
      cosmosGrad.addColorStop(0, '#020617');
      cosmosGrad.addColorStop(0.5, '#2e1065');
      cosmosGrad.addColorStop(1, '#0369a1');
      ctx.fillStyle = cosmosGrad;
      ctx.fillRect(28, 28, 456, 380);

      // Starfield dots
      for (let s = 0; s < 120; s++) {
        const sx = 35 + ((s * 37) % 440);
        const sy = 35 + ((s * 23) % 320);
        ctx.fillStyle = s % 3 === 0 ? '#38bdf8' : '#ffffff';
        ctx.fillRect(sx, sy, s % 5 === 0 ? 2.5 : 1.5, s % 5 === 0 ? 2.5 : 1.5);
      }

      // Mountain ridge
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.moveTo(28, 408);
      ctx.lineTo(160, 290);
      ctx.lineTo(260, 330);
      ctx.lineTo(380, 260);
      ctx.lineTo(484, 408);
      ctx.closePath();
      ctx.fill();

      // Observatory dome
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(380, 260, 24, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(362, 260, 36, 14);
      break;
    }
    default: {
      // Cyberpunk Minimalist Neon Skyline
      const nightGrad = ctx.createLinearGradient(0, 30, 0, 400);
      nightGrad.addColorStop(0, '#050505');
      nightGrad.addColorStop(1, '#180e29');
      ctx.fillStyle = nightGrad;
      ctx.fillRect(28, 28, 456, 380);

      // Vertical neon light pillars
      [-80, -20, 40, 100, 160].forEach((ox, i) => {
        const pillarGrad = ctx.createLinearGradient(0, 100, 0, 408);
        pillarGrad.addColorStop(0, i % 2 === 0 ? '#06b6d4' : '#ec4899');
        pillarGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = pillarGrad;
        ctx.fillRect(256 + ox, 140 + Math.abs(ox), 8, 260);
      });
      break;
    }
  }

  // Artwork Plaque / Title Label Area (bottom of frame)
  ctx.fillStyle = '#0f121a';
  ctx.fillRect(28, 412, 456, 200);

  ctx.strokeStyle = '#222836';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 424, 432, 176);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('FINE ART ARCHIVE // INSTALLATION', 256, 456);

  const titles = [
    'METROPOLIS SUSPENSION • CABLE HARMONICS',
    'BRUTALIST EQUILIBRIUM • SOLAR ANGLES',
    'MIDNIGHT OBSERVATORY • COSMIC CHARTS',
    'CYBERNETIC HORIZON • OPTICAL ARRAYS'
  ];
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 16px "Cabinet Grotesk", sans-serif';
  ctx.fillText(titles[index % titles.length], 256, 492);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px "Manrope", sans-serif';
  ctx.fillText('Digital Fine Art Exhibition • Curated Architectural Series', 256, 524);

  ctx.fillStyle = '#d4af37';
  ctx.font = '600 11px "JetBrains Mono", monospace';
  ctx.fillText('AYUSH SINGH ARCHITECTURAL COLLECTION', 256, 560);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}
