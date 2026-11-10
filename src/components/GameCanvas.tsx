import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { GameEngine } from '../game/GameEngine';
import { GraphicsQuality, InteractiveZone, ZoneId } from '../types/portfolio';

export interface GameCanvasHandle {
  teleportToZone: (zoneId: ZoneId) => void;
  setPaused: (paused: boolean) => void;
  setJoystick: (x: number, z: number) => void;
  requestPointerLock: () => void;
  startCorridorIntro: () => void;
}

interface GameCanvasProps {
  graphicsQuality: GraphicsQuality;
  onZoneChange: (zone: InteractiveZone | null) => void;
  onMinimapUpdate: (x: number, z: number, yaw: number) => void;
  onPointerLockChange?: (locked: boolean) => void;
  onCanvasClick?: () => void;
}

export const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  ({ graphicsQuality, onZoneChange, onMinimapUpdate, onPointerLockChange, onCanvasClick }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<GameEngine | null>(null);

    // Keep callbacks up to date in refs to avoid re-instantiating the WebGL engine
    const onZoneChangeRef = useRef(onZoneChange);
    onZoneChangeRef.current = onZoneChange;
    const onMinimapUpdateRef = useRef(onMinimapUpdate);
    onMinimapUpdateRef.current = onMinimapUpdate;
    const onPointerLockChangeRef = useRef(onPointerLockChange);
    onPointerLockChangeRef.current = onPointerLockChange;

    useImperativeHandle(ref, () => ({
      teleportToZone: (zoneId: ZoneId) => {
        engineRef.current?.teleportToZone(zoneId);
      },
      setPaused: (paused: boolean) => {
        engineRef.current?.setPaused(paused);
      },
      setJoystick: (x: number, z: number) => {
        if (engineRef.current) {
          engineRef.current.virtualJoystick = { x, y: z };
        }
      },
      requestPointerLock: () => {
        engineRef.current?.requestPointerLock();
      },
      startCorridorIntro: () => {
        engineRef.current?.resetToCorridorIntro();
      }
    }));

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const engine = new GameEngine(container, graphicsQuality);
      engineRef.current = engine;

      engine.onZoneChange = (zone) => {
        onZoneChangeRef.current(zone);
      };

      engine.onMinimapUpdate = (x, z, yaw) => {
        onMinimapUpdateRef.current(x, z, yaw);
      };

      engine.onPointerLockChange = (locked) => {
        onPointerLockChangeRef.current?.(locked);
      };

      const handleResize = () => {
        if (container && engineRef.current) {
          engineRef.current.handleResize(container.clientWidth, container.clientHeight);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        engine.dispose();
        engineRef.current = null;
        if (container.contains(engine.renderer.domElement)) {
          container.removeChild(engine.renderer.domElement);
        }
      };
    }, [graphicsQuality]);

    return (
      <div
        ref={mountRef}
        onClick={onCanvasClick}
        className="w-full h-full absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing outline-none"
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';
