import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CharacterController } from './Character';
import { StudioRoom } from './StudioRoom';
import { INTERACTIVE_ZONES } from '../data/portfolioData';
import { GraphicsQuality, InteractiveZone, ZoneId } from '../types/portfolio';
import { audioManager } from '../utils/audio';

// Pre-allocated scratch math vectors to eliminate per-frame GC allocations
const _vec3 = new THREE.Vector3();
const _camOffset = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _moveDir = new THREE.Vector3();

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  jump: boolean;
}

export class GameEngine {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public character: CharacterController;
  public room: StudioRoom;
  public isSoftwareGl: boolean = false;
  public container: HTMLElement;

  // Camera Orbit & Follow Parameters
  public cameraDistance = 3.6;
  public currentCameraDistance = 3.6;
  public cameraHeight = 1.65;
  public targetYaw = Math.PI; // Face towards -Z initially
  public currentYaw = Math.PI;
  public targetPitch = 0.24; // Slight elevation looking at character
  public currentPitch = 0.24;

  // Pointer Lock & Drag State
  public isPointerLocked: boolean = false;
  private isPointerDown: boolean = false;
  private prevPointerX: number = 0;
  private prevPointerY: number = 0;

  // Game Loop
  private animationFrameId: number = 0;
  private clock: THREE.Clock;
  private isRunning: boolean = true;
  public isPaused: boolean = false;

  // Movement Inputs
  public inputs: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jump: false
  };

  // Mobile virtual joystick vector (-1 to 1)
  public virtualJoystick = { x: 0, y: 0 };

  // Current interactive zone nearby
  public currentZone: InteractiveZone | null = null;
  public onZoneChange?: (zone: InteractiveZone | null) => void;
  public onMinimapUpdate?: (x: number, z: number, yaw: number) => void;
  public onPointerLockChange?: (locked: boolean) => void;

  // Jump physics
  private verticalVelocity: number = 0;
  private isGrounded: boolean = true;
  private moveDuration: number = 0;

  constructor(container: HTMLElement, quality: GraphicsQuality = 'high') {
    this.container = container;
    this.clock = new THREE.Clock();

    // 1. Software-WebGL Detection
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. WebGL Renderer Initialization
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl && quality !== 'low',
      powerPreference: 'high-performance'
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    const pixelRatio = this.isSoftwareGl ? 1 : quality === 'low' ? 1 : Math.min(window.devicePixelRatio, 2.0);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    if (!this.isSoftwareGl && quality !== 'low') {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } else {
      this.renderer.shadowMap.enabled = false;
    }

    container.appendChild(this.renderer.domElement);

    // 3. Scene & Studio PBR Environment
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x13151b);
    this.scene.fog = new THREE.Fog(0x13151b, 14, 30);

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      54,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );

    // 5. Studio Lighting Rig
    this.setupLighting(quality);

    // 6. Build High-Fidelity Room Architecture & Character Rig
    this.room = new StudioRoom(this.renderer);
    this.scene.add(this.room.group);

    this.character = new CharacterController();
    // Character starting location inside the corridor (0, 0, 20.5) facing -Z towards double gates
    this.character.mesh.position.set(0, 0, 20.5);
    this.character.mesh.rotation.y = Math.PI;
    this.character.rotationY = Math.PI;
    this.targetYaw = Math.PI;
    this.currentYaw = Math.PI;
    this.targetPitch = 0.18;
    this.currentPitch = 0.18;
    this.cameraDistance = 3.5;
    this.scene.add(this.character.mesh);

    // Initial camera position snap
    this.updateCamera(0.016, true);

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    // Attach Event Listeners (Pointer Lock + Mouse Drag + Touch)
    this.bindEvents();

    // Start Main Loop
    this.startLoop();
  }

  private setupLighting(quality: GraphicsQuality) {
    // 1. Sky/Ground fill
    const hemiLight = new THREE.HemisphereLight(0xfff6ed, 0x181c26, 0.75);
    this.scene.add(hemiLight);

    // 2. Sunlight Key Light through the large windows
    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.6);
    sunLight.position.set(9.5, 4.8, 1.2);
    sunLight.target.position.set(0, 1.0, 0);
    this.scene.add(sunLight);
    this.scene.add(sunLight.target);

    if (!this.isSoftwareGl && quality !== 'low') {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = quality === 'high' ? 2048 : 1024;
      sunLight.shadow.mapSize.height = quality === 'high' ? 2048 : 1024;
      sunLight.shadow.camera.near = 1.0;
      sunLight.shadow.camera.far = 22.0;
      sunLight.shadow.camera.left = -10.0;
      sunLight.shadow.camera.right = 10.0;
      sunLight.shadow.camera.top = 10.0;
      sunLight.shadow.camera.bottom = -10.0;
      sunLight.shadow.bias = -0.0004;
      sunLight.shadow.normalBias = 0.02;
    }

    // 3. Warm Desk Lamp Spotlight
    const deskSpot = new THREE.SpotLight(0xfef08a, 2.0, 7.0, Math.PI / 4, 0.45, 1.2);
    deskSpot.position.set(0, 3.8, -8.0);
    deskSpot.target.position.set(0, 0.8, -8.2);
    this.scene.add(deskSpot);
    this.scene.add(deskSpot.target);

    // 4. Technology Section Overhead Accent Spotlight & Fill
    const techSpot = new THREE.SpotLight(0x38bdf8, 2.8, 8.5, Math.PI / 3.4, 0.45, 1.3);
    techSpot.position.set(-4.8, 3.8, -1.5);
    techSpot.target.position.set(-6.88, 2.4, -1.5);
    this.scene.add(techSpot);
    this.scene.add(techSpot.target);

    const techLight = new THREE.PointLight(0x0284c7, 1.4, 6.0);
    techLight.position.set(-5.6, 2.6, -1.5);
    this.scene.add(techLight);

    // 4b. Personal / About Section "BEYOND THE CODE" Dedicated Portrait Spotlights
    // Cinematic overhead warm-white spotlight directly illuminating the portrait frame
    const portraitSpot = new THREE.SpotLight(0xfff7ed, 3.2, 8.5, Math.PI / 3.5, 0.4, 1.2);
    portraitSpot.position.set(-4.8, 3.8, 4.0);
    portraitSpot.target.position.set(-6.88, 2.5, 4.0);
    portraitSpot.castShadow = true;
    this.scene.add(portraitSpot);
    this.scene.add(portraitSpot.target);

    // Soft cyan/purple ambient fill rim for portrait
    const portraitRimCyan = new THREE.PointLight(0x22d3ee, 1.2, 5.0);
    portraitRimCyan.position.set(-6.2, 3.4, 3.2);
    this.scene.add(portraitRimCyan);

    const portraitRimPurple = new THREE.PointLight(0xa855f7, 1.1, 5.0);
    portraitRimPurple.position.set(-6.2, 1.6, 4.8);
    this.scene.add(portraitRimPurple);

    const nexoraLight = new THREE.PointLight(0x6366f1, 1.2, 5.5);
    nexoraLight.position.set(5.6, 2.6, -6.5);
    this.scene.add(nexoraLight);

    // 5. Grand Trophy Hall & Hall of Fame Lighting (Warm Gold & Cyan Accents)
    const trophySpot = new THREE.SpotLight(0xfbbf24, 2.8, 9.0, Math.PI / 3.5, 0.45, 1.3);
    trophySpot.position.set(5.0, 3.8, -1.5);
    trophySpot.target.position.set(6.8, 1.4, -1.5);
    this.scene.add(trophySpot);
    this.scene.add(trophySpot.target);

    const trophyCyanFill = new THREE.PointLight(0x06b6d4, 1.6, 6.5);
    trophyCyanFill.position.set(5.8, 3.4, -1.5);
    this.scene.add(trophyCyanFill);

    // 6. World Landmark Miniature Gallery Lighting (Entrance Gate Shelves)
    const landmarkSpot = new THREE.SpotLight(0xfef08a, 2.4, 8.0, Math.PI / 3.8, 0.45, 1.3);
    landmarkSpot.position.set(4.2, 3.8, 8.2);
    landmarkSpot.target.position.set(4.2, 1.8, 9.8);
    this.scene.add(landmarkSpot);
    this.scene.add(landmarkSpot.target);

    // 7. Vibrant Magenta/Purple Back Wall Art Installation Wash Light
    const artWallBacklight = new THREE.SpotLight(0xa855f7, 2.6, 11.0, Math.PI / 3.2, 0.6, 1.4);
    artWallBacklight.position.set(0, 3.9, -6.8);
    artWallBacklight.target.position.set(0, 3.2, -9.9);
    this.scene.add(artWallBacklight);
    this.scene.add(artWallBacklight.target);

    // 8. Electric Cyan Wall Rim Light
    const artWallCyanRim = new THREE.PointLight(0x06b6d4, 1.8, 9.0);
    artWallCyanRim.position.set(0, 4.6, -8.6);
    this.scene.add(artWallCyanRim);

    // 9. Warm Golden Bookshelf Showcase Light
    const bookshelfWarmLight = new THREE.SpotLight(0xfef08a, 1.6, 7.5, Math.PI / 4, 0.5, 1.5);
    bookshelfWarmLight.position.set(-5.0, 3.2, -5.5);
    bookshelfWarmLight.target.position.set(-6.6, 2.0, -5.5);
    this.scene.add(bookshelfWarmLight);
    this.scene.add(bookshelfWarmLight.target);

    // 10. Project Wall Focused Gallery Spotlight (Illuminating the Symmetrical Gallery Wall)
    const projectWallSpot = new THREE.SpotLight(0xfff7ed, 2.6, 9.0, Math.PI / 3.4, 0.45, 1.3);
    projectWallSpot.position.set(-4.2, 4.0, 6.8);
    projectWallSpot.target.position.set(-4.2, 2.2, 9.92);
    this.scene.add(projectWallSpot);
    this.scene.add(projectWallSpot.target);

    // 11. Communication Hub & Telephone Wall Lighting
    const contactPhoneSpot = new THREE.SpotLight(0xfef08a, 2.4, 7.5, Math.PI / 3.6, 0.45, 1.3);
    contactPhoneSpot.position.set(5.5, 3.2, 4.2);
    contactPhoneSpot.target.position.set(6.3, 0.8, 4.2);
    this.scene.add(contactPhoneSpot);
    this.scene.add(contactPhoneSpot.target);

    const contactPurpleWash = new THREE.PointLight(0xa855f7, 1.8, 6.5);
    contactPurpleWash.position.set(6.2, 3.0, 4.2);
    this.scene.add(contactPurpleWash);
  }

  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    // Pointer Lock & Mouse Look listeners
    this.container.addEventListener('click', this.handleContainerClick);
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
    document.addEventListener('pointerlockerror', this.handlePointerLockError);

    // Mouse drag fallback (and active pointer move)
    this.container.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);

    // Touch controls on mobile
    this.container.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd);
  }

  public requestPointerLock() {
    if (this.isPaused) return;
    try {
      const promise = this.container.requestPointerLock?.() as Promise<void> | undefined;
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {
          // Gracefully handle iframe restrictions; click-and-drag fallback is active
        });
      }
    } catch {
      // Graceful fallback
    }
  }

  public exitPointerLock() {
    if (document.pointerLockElement === this.container) {
      document.exitPointerLock?.();
    }
  }

  private handleContainerClick = () => {
    if (!this.isPaused && !this.isPointerLocked) {
      this.requestPointerLock();
    }
  };

  private handlePointerLockChange = () => {
    const isLocked = document.pointerLockElement === this.container;
    this.isPointerLocked = isLocked;
    if (this.onPointerLockChange) {
      this.onPointerLockChange(isLocked);
    }
  };

  private handlePointerLockError = () => {
    // If Pointer Lock API fails (e.g. sandbox without allow-pointer-lock), click-and-drag continues without interruption
    this.isPointerLocked = false;
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (this.isPaused) return;
    this.isPointerDown = true;
    this.prevPointerX = e.clientX;
    this.prevPointerY = e.clientY;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isPaused) return;

    if (this.isPointerLocked) {
      // Full Pointer Lock Mouse Look Mode
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      // Sensitivity tuning
      const sensitivity = 0.0026;
      this.targetYaw -= movementX * sensitivity;
      this.targetPitch = Math.max(-0.18, Math.min(1.05, this.targetPitch + movementY * sensitivity));
    } else if (this.isPointerDown) {
      // Click-and-Drag Fallback Mode
      const deltaX = e.clientX - this.prevPointerX;
      const deltaY = e.clientY - this.prevPointerY;
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;

      const dragSensitivity = 0.0045;
      this.targetYaw -= deltaX * dragSensitivity;
      this.targetPitch = Math.max(-0.18, Math.min(1.05, this.targetPitch + deltaY * dragSensitivity));
    }
  };

  private handleMouseUp = () => {
    this.isPointerDown = false;
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1 && !this.isPaused) {
      const touch = e.touches[0];
      // Only capture touch if it's on the right 60% of the screen (left 40% reserved for movement joystick)
      if (touch.clientX > window.innerWidth * 0.4) {
        this.isPointerDown = true;
        this.prevPointerX = touch.clientX;
        this.prevPointerY = touch.clientY;
      }
    }
  };

  private handleTouchMove = (e: TouchEvent) => {
    if (!this.isPointerDown || this.isPaused || e.touches.length === 0) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.prevPointerX;
    const deltaY = touch.clientY - this.prevPointerY;
    this.prevPointerX = touch.clientX;
    this.prevPointerY = touch.clientY;

    const touchSensitivity = 0.0055;
    this.targetYaw -= deltaX * touchSensitivity;
    this.targetPitch = Math.max(-0.18, Math.min(1.05, this.targetPitch + deltaY * touchSensitivity));
  };

  private handleTouchEnd = () => {
    this.isPointerDown = false;
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.inputs.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.inputs.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.inputs.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.inputs.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.inputs.sprint = true;
        break;
      case 'Space':
        if (this.isGrounded && !this.isPaused) {
          this.verticalVelocity = 5.2; // vertical jump impulse
          this.isGrounded = false;
        }
        break;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.inputs.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.inputs.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.inputs.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.inputs.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.inputs.sprint = false;
        break;
    }
  };

  public setPaused(paused: boolean) {
    this.isPaused = paused;
    if (paused) {
      this.exitPointerLock();
      this.inputs = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        sprint: false,
        jump: false
      };
      this.virtualJoystick = { x: 0, y: 0 };
    }
  }

  public teleportToZone(zoneId: ZoneId) {
    const zone = INTERACTIVE_ZONES.find((z) => z.id === zoneId);
    if (!zone) return;

    let targetX = zone.position[0];
    let targetZ = zone.position[2];

    if (zone.id === 'about' || zone.id === 'skills') {
      targetX = -4.8;
      this.character.rotationY = -Math.PI / 2;
    } else if (zone.id === 'projects') {
      targetZ = -5.8;
      this.character.rotationY = Math.PI;
    } else if (zone.id === 'achievements' || zone.id === 'nexora' || zone.id === 'contact') {
      targetX = 4.8;
      this.character.rotationY = Math.PI / 2;
    }

    this.character.mesh.position.set(targetX, 0, targetZ);
    this.character.mesh.rotation.y = this.character.rotationY;
    this.targetYaw = this.character.rotationY + Math.PI;
    this.currentYaw = this.targetYaw;
    this.updateCamera(0.016, true);
    audioManager.playInteract();
  }

  private updateMovement(delta: number) {
    if (this.isPaused) return;

    // Read keyboard + virtual joystick input
    let inputX = (this.inputs.right ? 1 : 0) - (this.inputs.left ? 1 : 0);
    let inputZ = (this.inputs.backward ? 1 : 0) - (this.inputs.forward ? 1 : 0);

    if (Math.abs(this.virtualJoystick.x) > 0.1 || Math.abs(this.virtualJoystick.y) > 0.1) {
      inputX += this.virtualJoystick.x;
      inputZ += this.virtualJoystick.y;
    }

    const hasInput = Math.abs(inputX) > 0.05 || Math.abs(inputZ) > 0.05;

    if (hasInput) {
      // True Camera-Relative Movement
      const camYaw = this.currentYaw;
      const sinYaw = Math.sin(camYaw);
      const cosYaw = Math.cos(camYaw);

      // Camera forward in X-Z: (-sinYaw, -cosYaw)
      // Camera right in X-Z:   (cosYaw, -sinYaw)
      _moveDir.set(
        inputX * cosYaw - inputZ * sinYaw,
        0,
        -inputX * sinYaw - inputZ * cosYaw
      ).normalize();

      const isSprinting = this.inputs.sprint;
      this.moveDuration += delta;
      const isRunning = isSprinting || this.moveDuration > 0.6;
      const speed = isSprinting ? 5.8 : isRunning ? 3.6 : 2.4;
      const moveDistance = speed * delta;

      const nextX = this.character.mesh.position.x + _moveDir.x * moveDistance;
      const nextZ = this.character.mesh.position.z + _moveDir.z * moveDistance;

      // Sliding collision response
      if (!this.room.checkCollision(nextX, nextZ)) {
        this.character.mesh.position.x = nextX;
        this.character.mesh.position.z = nextZ;
      } else if (!this.room.checkCollision(nextX, this.character.mesh.position.z)) {
        this.character.mesh.position.x = nextX;
      } else if (!this.room.checkCollision(this.character.mesh.position.x, nextZ)) {
        this.character.mesh.position.z = nextZ;
      }

      // Target character rotation facing movement direction
      const targetFacing = Math.atan2(_moveDir.x, _moveDir.z);
      this.character.update(delta, true, isRunning, isSprinting, targetFacing, !this.isGrounded, false);

      // Natural movement footstep cadence
      if (this.isGrounded) {
        audioManager.playFootstep();
      }
    } else {
      this.moveDuration = 0;
      let targetFacing = this.character.rotationY;
      const isInteracting = this.currentZone !== null;
      if (isInteracting && this.currentZone) {
        if (this.currentZone.id === 'projects' && this.character.mesh.position.z > 3.0) {
          // Standing in front of Project Gallery Wall (Z = 9.92), naturally face wall (+Z)
          targetFacing = 0;
        } else {
          const zoneDx = this.currentZone.position[0] - this.character.mesh.position.x;
          const zoneDz = this.currentZone.position[2] - this.character.mesh.position.z;
          targetFacing = Math.atan2(zoneDx, zoneDz);
        }
      }
      this.character.update(delta, false, false, false, targetFacing, !this.isGrounded, isInteracting);
    }

    // Jump gravity kinematics
    if (!this.isGrounded) {
      this.verticalVelocity -= 14.5 * delta;
      this.character.mesh.position.y += this.verticalVelocity * delta;

      if (this.character.mesh.position.y <= 0) {
        this.character.mesh.position.y = 0;
        this.verticalVelocity = 0;
        this.isGrounded = true;
        audioManager.playFootstep();
      }
    }

    // Automatic Double Entrance Gate Detection & Animation
    const charPos = this.character.mesh.position;
    const isNearGateFromCorridor = charPos.z >= 9.8 && charPos.z <= 16.5 && Math.abs(charPos.x) <= 1.8;
    const isNearGateFromRoom = charPos.z <= 10.2 && charPos.z >= 6.5 && Math.abs(charPos.x) <= 1.8;
    const shouldOpenGate = isNearGateFromCorridor || isNearGateFromRoom;

    const { stateChanged, opened } = this.room.updateDoors(delta, shouldOpenGate);
    if (stateChanged) {
      if (opened) {
        audioManager.playDoorOpen();
      } else {
        audioManager.playDoorClose();
      }
    }

    this.checkZoneProximity();

    if (this.onMinimapUpdate) {
      this.onMinimapUpdate(
        this.character.mesh.position.x,
        this.character.mesh.position.z,
        this.character.rotationY
      );
    }
  }

  public resetToCorridorIntro() {
    this.character.mesh.position.set(0, 0, 20.5);
    this.character.mesh.rotation.y = Math.PI;
    this.character.rotationY = Math.PI;
    this.targetYaw = Math.PI;
    this.currentYaw = Math.PI;
    this.targetPitch = 0.18;
    this.currentPitch = 0.18;
    this.cameraDistance = 3.5;
    this.updateCamera(0.016, true);
    this.room.updateDoors(0.1, false);
  }

  private checkZoneProximity() {
    const charPos = this.character.mesh.position;
    const isCurrentlyProjects = this.currentZone?.id === 'projects';

    // ─────────────────────────────────────────────────────────────
    // CRITICAL: DEDICATED PROJECT WALL TRIGGER VOLUME WITH HYSTERESIS
    // The Project Wall (Symmetrical Gallery Wall) is at X: -4.2, Z: 9.92 (width 4.8m, X in [-6.6, -1.8]).
    // The entrance gate is at X in [-1.5, 1.5], Z >= 9.8.
    // The entrance carpet is at X in [-1.2, 1.2], Z in [5.0, 9.6].
    // Corridor is at Z > 10.0.
    // Therefore, the player viewing area in front of the Project Wall is strictly:
    // X between -6.1 and -2.55 (at least 1.35m away from carpet edge at -1.2, completely clear of gate).
    // Z between 7.4 and 9.5 (strictly in front of wall, inside room).
    // With enter/exit hysteresis to eliminate boundary flicker:
    // ─────────────────────────────────────────────────────────────
    const inProjectsVolume = isCurrentlyProjects
      ? (charPos.x >= -6.35 && charPos.x <= -2.35 && charPos.z >= 7.1 && charPos.z <= 9.7)
      : (charPos.x >= -6.10 && charPos.x <= -2.55 && charPos.z >= 7.4 && charPos.z <= 9.5);

    let nextZone: InteractiveZone | null = null;

    if (inProjectsVolume) {
      nextZone = INTERACTIVE_ZONES.find((z) => z.id === 'projects') || null;
    } else {
      // Check other discrete zones (about, skills, achievements, nexora, contact).
      // Note: 'projects' is strictly excluded from radial checks so it NEVER activates near gate or carpet.
      let minDistance = Infinity;
      for (const zone of INTERACTIVE_ZONES) {
        if (zone.id === 'projects') continue;

        const dx = charPos.x - zone.position[0];
        const dz = charPos.z - zone.position[2];
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Hysteresis on discrete zones
        const effectiveRadius = (this.currentZone?.id === zone.id)
          ? zone.radius + 0.35
          : zone.radius;

        if (dist < effectiveRadius && dist < minDistance) {
          minDistance = dist;
          nextZone = zone;
        }
      }
    }

    if (nextZone !== this.currentZone) {
      this.currentZone = nextZone;
      if (this.onZoneChange) {
        this.onZoneChange(nextZone);
      }
    }
  }

  private updateCamera(delta: number, instant: boolean = false) {
    const charPos = this.character.mesh.position;

    // Smooth exponential damping on camera yaw and pitch
    if (instant) {
      this.currentYaw = this.targetYaw;
      this.currentPitch = this.targetPitch;
      this.currentCameraDistance = this.cameraDistance;
    } else {
      this.currentYaw = THREE.MathUtils.damp(this.currentYaw, this.targetYaw, 16, delta);
      this.currentPitch = THREE.MathUtils.damp(this.currentPitch, this.targetPitch, 16, delta);
    }

    const phi = this.currentPitch;
    const theta = this.currentYaw;
    const desiredDist = this.cameraDistance;

    _camOffset.set(
      desiredDist * Math.cos(phi) * Math.sin(theta),
      desiredDist * Math.sin(phi) + this.cameraHeight,
      desiredDist * Math.cos(phi) * Math.cos(theta)
    );

    _targetCamPos.copy(charPos).add(_camOffset);

    // Wall Occlusion Clamping (Aware of continuous Corridor and Main Studio Room)
    if (charPos.z > 9.8) {
      // In Corridor: width [-1.9, 1.9], length [10.0, 24.0], height 4.2m
      _targetCamPos.x = Math.max(-1.4, Math.min(1.4, _targetCamPos.x));
      _targetCamPos.z = Math.max(9.6, Math.min(23.6, _targetCamPos.z));
      _targetCamPos.y = Math.max(0.7, Math.min(3.8, _targetCamPos.y));
    } else {
      // In Main Studio: width [-7.0, 7.0], length [-10.0, 10.0], height 5.0m
      _targetCamPos.x = Math.max(-6.5, Math.min(6.5, _targetCamPos.x));
      _targetCamPos.z = Math.max(-9.5, Math.min(9.5, _targetCamPos.z));
      _targetCamPos.y = Math.max(0.7, Math.min(4.6, _targetCamPos.y));
    }

    if (instant) {
      this.camera.position.copy(_targetCamPos);
    } else {
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _targetCamPos.x, 14, delta);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _targetCamPos.y, 14, delta);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _targetCamPos.z, 14, delta);
    }

    // Look at character upper chest height (~1.35m)
    _vec3.copy(charPos).setY(charPos.y + 1.35);
    this.camera.lookAt(_vec3);
  }

  private startLoop() {
    let frameId = 0;

    const afterDraw = (cb: () => void) => {
      const gl = this.renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (!this.isRunning) return;

      const delta = Math.min(0.08, this.clock.getDelta());

      this.updateMovement(delta);
      this.updateCamera(delta);

      this.renderer.render(this.scene, this.camera);

      if (this.isSoftwareGl) {
        afterDraw(tick);
      } else {
        this.animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (this.isSoftwareGl) {
      afterDraw(tick);
    } else {
      this.animationFrameId = requestAnimationFrame(tick);
    }
  }

  public handleResize(width: number, height: number) {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
    clearTimeout(this.animationFrameId);

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);

    this.container.removeEventListener('click', this.handleContainerClick);
    this.container.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
    document.removeEventListener('pointerlockerror', this.handlePointerLockError);

    this.scene.clear();
    this.renderer.dispose();
  }
}
