export type ZoneId = 'about' | 'skills' | 'projects' | 'achievements' | 'nexora' | 'contact' | 'entrance';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  achievement?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  highlightColor: string;
  status: string;
}

export interface AchievementItem {
  id: string;
  event: string;
  rank: string;
  project: string;
  details: string;
  category: 'Hackathon' | 'Competition' | 'Recognition';
  scoreOrMetric?: string;
  badgeColor: string;
  trophyType: 'gold' | 'silver' | 'bronze' | 'award';
}

export interface SkillCategory {
  name: string;
  description: string;
  skills: {
    name: string;
    level: string;
    icon: string;
    description: string;
    useCase: string;
  }[];
}

export interface InteractiveZone {
  id: ZoneId;
  name: string;
  title: string;
  subtitle: string;
  position: [number, number, number]; // [x, y, z]
  radius: number;
  prompt: string;
  cameraTarget: [number, number, number];
}

export type GraphicsQuality = 'low' | 'medium' | 'high';
