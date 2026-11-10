import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameCanvas, GameCanvasHandle } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { IntroScreen } from './components/IntroScreen';
import { QuickPortfolio } from './components/QuickPortfolio';
import { AboutModal } from './components/modals/AboutModal';
import { SkillsModal } from './components/modals/SkillsModal';
import { ProjectsModal } from './components/modals/ProjectsModal';
import { AchievementsModal } from './components/modals/AchievementsModal';
import { NexoraModal } from './components/modals/NexoraModal';
import { ContactModal } from './components/modals/ContactModal';
import { PauseModal } from './components/modals/PauseModal';
import { GraphicsQuality, InteractiveZone, ZoneId } from './types/portfolio';
import { audioManager } from './utils/audio';

type GameMode = 'intro' | 'playing' | '2d';
type ModalType = ZoneId | 'pause' | null;

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>('intro');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [currentZone, setCurrentZone] = useState<InteractiveZone | null>(null);
  const [visitedZones, setVisitedZones] = useState<Set<ZoneId>>(new Set());
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 20.5, yaw: Math.PI });
  const [soundMuted, setSoundMuted] = useState(false);
  const [graphicsQuality, setGraphicsQuality] = useState<GraphicsQuality>('high');

  const [isPointerLocked, setIsPointerLocked] = useState(false);

  const canvasRef = useRef<GameCanvasHandle>(null);

  // Synchronize pause state with canvas engine
  useEffect(() => {
    const isPaused = activeModal !== null || gameMode !== 'playing';
    canvasRef.current?.setPaused(isPaused);
  }, [activeModal, gameMode]);

  // Handle Global Keyboard Shortcuts (E for interact, ESC for pause/close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing inside text fields
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'KeyE') {
        if (!activeModal && currentZone && gameMode === 'playing') {
          handleOpenZoneModal(currentZone.id);
        }
      } else if (e.code === 'Escape') {
        if (activeModal) {
          audioManager.playClick();
          setActiveModal(null);
        } else if (gameMode === 'playing') {
          audioManager.playClick();
          setActiveModal('pause');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, currentZone, gameMode]);

  const handleOpenZoneModal = (zoneId: ZoneId) => {
    audioManager.playInteract();
    setVisitedZones((prev) => new Set([...prev, zoneId]));
    setActiveModal(zoneId);
  };

  const handleTeleportToZone = (zoneId: ZoneId) => {
    canvasRef.current?.teleportToZone(zoneId);
    setVisitedZones((prev) => new Set([...prev, zoneId]));
  };

  const handleToggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    audioManager.setMuted(nextMuted);
    if (!nextMuted) {
      audioManager.startAmbient();
    }
  };

  const handleStartStoryPlay = useCallback(() => {
    canvasRef.current?.startCorridorIntro();
    setGameMode('playing');
  }, []);

  const handleOpenConnect = useCallback(() => {
    audioManager.playClick();
    setActiveModal('contact');
  }, []);

  const handleZoneChange = useCallback((zone: InteractiveZone | null) => {
    setCurrentZone(zone);
    if (zone) {
      setVisitedZones((prev) => new Set([...prev, zone.id]));
    }
  }, []);

  const handleMinimapUpdate = useCallback((x: number, z: number, yaw: number) => {
    setPlayerPos({ x, z, yaw });
  }, []);

  const handleJoystickMove = useCallback((x: number, z: number) => {
    canvasRef.current?.setJoystick(x, z);
  }, []);

  const handleRequestPointerLock = useCallback(() => {
    canvasRef.current?.requestPointerLock();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 select-none">
      {/* 2D Portfolio Alternative View */}
      {gameMode === '2d' && (
        <QuickPortfolio
          onReturnTo3D={() => {
            setGameMode('playing');
          }}
        />
      )}

      {/* Intro Cinematic Screen */}
      {gameMode === 'intro' && (
        <IntroScreen
          onEnter3D={() => setGameMode('playing')}
          onStartStoryPlay={handleStartStoryPlay}
          onOpenConnect={handleOpenConnect}
          onEnter2D={() => setGameMode('2d')}
          soundMuted={soundMuted}
          onToggleSound={handleToggleSound}
          graphicsQuality={graphicsQuality}
          onChangeGraphicsQuality={setGraphicsQuality}
        />
      )}

      {/* 3D WebGL Canvas Layer (Always rendered when in playing or modal mode for smooth performance) */}
      {gameMode !== '2d' && (
        <>
          <GameCanvas
            ref={canvasRef}
            graphicsQuality={graphicsQuality}
            onZoneChange={handleZoneChange}
            onMinimapUpdate={handleMinimapUpdate}
            onPointerLockChange={setIsPointerLocked}
          />

          {/* Interactive HUD Layer */}
          {gameMode === 'playing' && (
            <HUD
              currentZone={currentZone}
              visitedZones={visitedZones}
              playerPos={playerPos}
              isPointerLocked={isPointerLocked}
              onRequestPointerLock={handleRequestPointerLock}
              onInteract={() => {
                if (currentZone) handleOpenZoneModal(currentZone.id);
              }}
              onPause={() => setActiveModal('pause')}
              onTeleport={handleTeleportToZone}
              onSwitchTo2D={() => setGameMode('2d')}
              onStartStoryPlay={handleStartStoryPlay}
              onOpenConnect={handleOpenConnect}
              soundMuted={soundMuted}
              onToggleSound={handleToggleSound}
              onJoystickMove={handleJoystickMove}
            />
          )}

          {/* Zone Modals */}
          {activeModal === 'about' && (
            <AboutModal
              onClose={() => setActiveModal(null)}
              onNavigateToZone={(zid) => {
                handleTeleportToZone(zid);
                handleOpenZoneModal(zid);
              }}
            />
          )}

          {activeModal === 'skills' && (
            <SkillsModal
              onClose={() => setActiveModal(null)}
              onNavigateToZone={(zid) => {
                handleTeleportToZone(zid);
                handleOpenZoneModal(zid);
              }}
            />
          )}

          {activeModal === 'projects' && (
            <ProjectsModal
              onClose={() => setActiveModal(null)}
              onNavigateToZone={(zid) => {
                handleTeleportToZone(zid);
                handleOpenZoneModal(zid);
              }}
            />
          )}

          {activeModal === 'achievements' && (
            <AchievementsModal
              onClose={() => setActiveModal(null)}
              onNavigateToZone={(zid) => {
                handleTeleportToZone(zid);
                handleOpenZoneModal(zid);
              }}
            />
          )}

          {activeModal === 'nexora' && (
            <NexoraModal
              onClose={() => setActiveModal(null)}
              onNavigateToContact={() => {
                handleTeleportToZone('contact');
                handleOpenZoneModal('contact');
              }}
            />
          )}

          {activeModal === 'contact' && (
            <ContactModal onClose={() => setActiveModal(null)} />
          )}

          {activeModal === 'pause' && (
            <PauseModal
              onResume={() => setActiveModal(null)}
              onTeleport={handleTeleportToZone}
              onSwitchTo2D={() => {
                setActiveModal(null);
                setGameMode('2d');
              }}
              soundMuted={soundMuted}
              onToggleSound={handleToggleSound}
              graphicsQuality={graphicsQuality}
              onChangeGraphicsQuality={setGraphicsQuality}
            />
          )}
        </>
      )}
    </div>
  );
}
