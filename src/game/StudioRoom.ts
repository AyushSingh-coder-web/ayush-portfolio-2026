import * as THREE from 'three';
import {
  createWoodFloorTexture,
  createRugTexture,
  createRunnerRugTexture,
  createCodeMonitorTexture,
  createLaptopScreenTexture,
  createPortraitArtworkTexture,
  createNexoraLogoTexture,
  createWelcomeSignTexture,
  createCertificateTexture,
  createRotaryDialTexture,
  createWindowSceneryTexture,
  createGalleryArtTexture,
  createMainIdentityTexture,
  createGateTransomTexture,
  createCorridorPosterTexture,
  createCommunicationHubWallTexture,
  createPersonalIdentityPanelTexture,
  createTechnologyWallHeaderTexture,
  createMotivationalQuoteTexture,
  createArchitecturalPhotoTexture
} from '../utils/proceduralTextures';
import { buildWorldLandmarkGallery } from './LandmarkGallery';
import { buildGrandTrophyHall } from './TrophyGallery';

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export class StudioRoom {
  public group: THREE.Group;
  public colliders: BoundingBox2D[] = [];
  public interactiveMeshes: { [key: string]: THREE.Object3D } = {};
  public animatedScreenMat?: THREE.MeshBasicMaterial;

  // Double Gate & Corridor State
  public leftDoorHinge!: THREE.Group;
  public rightDoorHinge!: THREE.Group;
  public doorStatusMesh?: THREE.Mesh;
  public doorStatusMat?: THREE.MeshBasicMaterial;
  public isGateOpen: boolean = false;
  public doorOpenRatio: number = 0;
  public targetDoorRatio: number = 0;
  public renderer?: THREE.WebGLRenderer;

  constructor(renderer?: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.group = new THREE.Group();
    this.buildRoomShell(renderer);
    this.buildCorridor(renderer);
    this.buildAutomaticDoubleGate();
    this.buildMainIdentityFocalWall();
    this.buildSymmetricalGalleryWall();
    this.buildSlattedAccentAndShelves();
    this.buildZone1AboutMe();
    this.buildZone2Skills();
    this.buildZone3Workstation();
    this.buildZone4Achievements();
    this.buildZone5Nexora();
    this.buildZone6Contact();
    this.buildLuxuryLounge();
    this.buildSecondaryDecor();
  }

  public checkCollision(x: number, z: number, radius = 0.35): boolean {
    const boundaryMargin = 0.45;

    // Dual-Zone Physical Boundary Check:
    // Z = 10.0 is the physical threshold plane between the Main Room (Z: -10 to 10) and Corridor (Z: 10 to 24)
    if (z > 10.0) {
      // 1. INSIDE CORRIDOR (X: -1.9 to 1.9, Z: 10.0 to 24.0)
      if (x - radius < -1.9 + boundaryMargin || x + radius > 1.9 - boundaryMargin) return true;
      if (z + radius > 24.0 - boundaryMargin) return true;

      // Approaching the double gate threshold at Z = 10 from corridor:
      if (z - radius < 10.0) {
        // If gate is closed or not open enough, or outside the 2.6m doorway opening:
        if (!this.isGateOpen || Math.abs(x) > 1.25) {
          return true;
        }
      }
    } else {
      // 2. INSIDE MAIN STUDIO ROOM (X: -7.0 to 7.0, Z: -10.0 to 10.0)
      if (x - radius < -7.0 + boundaryMargin || x + radius > 7.0 - boundaryMargin) return true;
      if (z - radius < -10.0 + boundaryMargin) return true;

      // Approaching the double gate threshold at Z = 10 from main room:
      if (z + radius > 10.0) {
        // If gate is closed or not open enough, or outside the 2.6m doorway opening:
        if (!this.isGateOpen || Math.abs(x) > 1.25) {
          return true;
        }
      }
    }

    // Check interior obstacle bounding boxes
    for (const b of this.colliders) {
      if (
        x + radius > b.minX &&
        x - radius < b.maxX &&
        z + radius > b.minZ &&
        z - radius < b.maxZ
      ) {
        return true;
      }
    }
    return false;
  }

  private addCollider(minX: number, maxX: number, minZ: number, maxZ: number) {
    this.colliders.push({ minX, maxX, minZ, maxZ });
  }

  private buildRoomShell(renderer?: THREE.WebGLRenderer) {
    const floorTexture = createWoodFloorTexture(renderer);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.32,
      metalness: 0.08
    });

    const wallPlasterMat = new THREE.MeshStandardMaterial({
      color: 0x22242b, // Sophisticated warm charcoal/slate architectural plaster (eliminates flat stark white)
      roughness: 0.88,
      metalness: 0.04
    });

    const charcoalSlatMat = new THREE.MeshStandardMaterial({
      color: 0x181a20, // acoustic slat paneling
      roughness: 0.75,
      metalness: 0.05
    });

    const darkWalnutMat = new THREE.MeshStandardMaterial({
      color: 0x362115, // rich walnut trim
      roughness: 0.4,
      metalness: 0.08
    });

    const brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c22, // Dark architectural luxury ceiling
      roughness: 0.9,
      metalness: 0.02
    });

    // 1. FLOOR
    const floorGeo = new THREE.PlaneGeometry(14, 20);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Floor Brass Inlay Perimeter Border (0.6m inside outer perimeter)
    const brassBorderPoints = [
      new THREE.Vector3(-6.4, 0.008, -9.4),
      new THREE.Vector3(6.4, 0.008, -9.4),
      new THREE.Vector3(6.4, 0.008, 9.4),
      new THREE.Vector3(-6.4, 0.008, 9.4),
      new THREE.Vector3(-6.4, 0.008, -9.4)
    ];
    const brassBorderGeo = new THREE.BufferGeometry().setFromPoints(brassBorderPoints);
    const brassBorderLine = new THREE.Line(
      brassBorderGeo,
      new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 2 })
    );
    this.group.add(brassBorderLine);

    // 2. MULTIPLE LUXURY RUGS
    // A. Workstation Zone Floor Inlay (Slightly Darker Architectural Walnut)
    const workstationFloorGeo = new THREE.PlaneGeometry(9.6, 3.6);
    const workstationFloorMat = new THREE.MeshStandardMaterial({
      color: 0x1f140e, // Rich dark espresso walnut
      roughness: 0.38,
      metalness: 0.06,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    const workstationFloor = new THREE.Mesh(workstationFloorGeo, workstationFloorMat);
    workstationFloor.rotation.x = -Math.PI / 2;
    workstationFloor.position.set(0, 0.006, -8.0);
    workstationFloor.receiveShadow = true;
    this.group.add(workstationFloor);

    // Cyan & Brass Inlay Transition Strips (demarcating workstation & central studio)
    const borderPoints = [
      new THREE.Vector3(-4.8, 0.009, -6.2),
      new THREE.Vector3(4.8, 0.009, -6.2),
      new THREE.Vector3(4.8, 0.009, -9.8),
      new THREE.Vector3(-4.8, 0.009, -9.8),
      new THREE.Vector3(-4.8, 0.009, -6.2)
    ];
    const borderLineGeo = new THREE.BufferGeometry().setFromPoints(borderPoints);
    const borderLine = new THREE.Line(
      borderLineGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })
    );
    this.group.add(borderLine);

    // B. Central Luxury Lounge Woven Rug (6.4m x 9.0m, dark graphite & bronze borders)
    const rugTexture = createRugTexture(renderer);
    const rugGeo = new THREE.PlaneGeometry(6.4, 9.0);
    const rugMat = new THREE.MeshStandardMaterial({
      map: rugTexture,
      roughness: 0.90,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.012, 0.5);
    rug.receiveShadow = true;
    this.group.add(rug);

    // B. Entrance Gallery Runner Rug (2.2m x 4.6m) leading from door to central lounge
    const runnerTexture = createRunnerRugTexture(renderer);
    const runnerGeo = new THREE.PlaneGeometry(2.2, 4.6);
    const runnerMat = new THREE.MeshStandardMaterial({
      map: runnerTexture,
      roughness: 0.92,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    const entranceRunner = new THREE.Mesh(runnerGeo, runnerMat);
    entranceRunner.rotation.x = -Math.PI / 2;
    entranceRunner.position.set(0, 0.017, 7.3);
    entranceRunner.receiveShadow = true;
    this.group.add(entranceRunner);

    // C. Reading / Bookshelf Corner Round Accent Rug (Diameter 2.6m)
    const roundRugGeo = new THREE.CircleGeometry(1.3, 32);
    const roundRugMat = new THREE.MeshStandardMaterial({
      color: 0x2b241e,
      roughness: 0.95,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    const roundRug = new THREE.Mesh(roundRugGeo, roundRugMat);
    roundRug.rotation.x = -Math.PI / 2;
    roundRug.position.set(-4.8, 0.017, -5.5);
    this.group.add(roundRug);

    // 3. BASEBOARDS, PILASTERS & WALL MOULDINGS
    const architecturalTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x141720, // Sleek brushed dark titanium/graphite (eliminates boring brown plywood)
      roughness: 0.45,
      metalness: 0.88
    });

    const skirtingH = 0.24;
    const sLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, skirtingH, 20), architecturalTitaniumMat);
    sLeft.position.set(-6.97, skirtingH / 2, 0);
    const sRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, skirtingH, 20), architecturalTitaniumMat);
    sRight.position.set(6.97, skirtingH / 2, 0);
    const sBack = new THREE.Mesh(new THREE.BoxGeometry(14, skirtingH, 0.06), architecturalTitaniumMat);
    sBack.position.set(0, skirtingH / 2, -9.97);
    const sFrontL = new THREE.Mesh(new THREE.BoxGeometry(5.8, skirtingH, 0.06), architecturalTitaniumMat);
    sFrontL.position.set(-4.1, skirtingH / 2, 9.97);
    const sFrontR = new THREE.Mesh(new THREE.BoxGeometry(5.8, skirtingH, 0.06), architecturalTitaniumMat);
    sFrontR.position.set(4.1, skirtingH / 2, 9.97);
    this.group.add(sLeft, sRight, sBack, sFrontL, sFrontR);

    // Architectural Corner Pilasters (4 corners of room)
    const cornerPositions = [
      [-6.85, -9.85],
      [6.85, -9.85],
      [-6.85, 9.85],
      [6.85, 9.85]
    ];
    cornerPositions.forEach(([cx, cz]) => {
      const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.0, 0.35), architecturalTitaniumMat);
      pilaster.position.set(cx, 2.5, cz);
      const capital = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.42), brassTrimMat);
      capital.position.set(cx, 4.85, cz);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.25, 0.42), brassTrimMat);
      base.position.set(cx, 0.125, cz);
      this.group.add(pilaster, capital, base);
    });

    // 4. PERIMETER DROP-SOFFIT CEILING & COVE LIGHTING
    const mainCeiling = new THREE.Mesh(new THREE.PlaneGeometry(14, 20), ceilingMat);
    mainCeiling.rotation.x = Math.PI / 2;
    mainCeiling.position.y = 5.0;
    this.group.add(mainCeiling);

    // Perimeter Drop Soffit (0.8m wide box drop ceiling around the room edges in titanium/graphite)
    const soffitH = 0.25;
    const soffitNorth = new THREE.Mesh(new THREE.BoxGeometry(14, soffitH, 1.0), architecturalTitaniumMat);
    soffitNorth.position.set(0, 4.88, -9.5);
    const soffitSouth = new THREE.Mesh(new THREE.BoxGeometry(14, soffitH, 1.0), architecturalTitaniumMat);
    soffitSouth.position.set(0, 4.88, 9.5);
    const soffitWest = new THREE.Mesh(new THREE.BoxGeometry(1.0, soffitH, 18), architecturalTitaniumMat);
    soffitWest.position.set(-6.5, 4.88, 0);
    const soffitEast = new THREE.Mesh(new THREE.BoxGeometry(1.0, soffitH, 18), architecturalTitaniumMat);
    soffitEast.position.set(6.5, 4.88, 0);
    this.group.add(soffitNorth, soffitSouth, soffitWest, soffitEast);

    // Warm Architectural Cove Light Ribbon Washing Walls
    const coveLightN = new THREE.Mesh(
      new THREE.BoxGeometry(13.6, 0.03, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xfff1d6 })
    );
    coveLightN.position.set(0, 4.74, -9.0);
    const coveLightS = new THREE.Mesh(
      new THREE.BoxGeometry(13.6, 0.03, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xfff1d6 })
    );
    coveLightS.position.set(0, 4.74, 9.0);
    const coveLightW = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.03, 17.6),
      new THREE.MeshBasicMaterial({ color: 0xfff1d6 })
    );
    coveLightW.position.set(-6.0, 4.74, 0);
    const coveLightE = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.03, 17.6),
      new THREE.MeshBasicMaterial({ color: 0xfff1d6 })
    );
    coveLightE.position.set(6.0, 4.74, 0);
    this.group.add(coveLightN, coveLightS, coveLightW, coveLightE);

    // Coffered Architectural Beams & Recessed Spotlights
    for (let bz = -7.5; bz <= 7.5; bz += 3.0) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.22, 0.28), architecturalTitaniumMat);
      beam.position.set(0, 4.89, bz);
      this.group.add(beam);

      // Recessed spotlights with brass bezels
      [-3.5, 0, 3.5].forEach((bx) => {
        const spotPuck = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.11, 0.08, 12),
          brassTrimMat
        );
        spotPuck.position.set(bx, 4.77, bz);
        this.group.add(spotPuck);
      });
    }

    // 5. FOUR COMPLETE WALLS WITH WAINSCOTING & ACOUSTIC PANELS
    // Back wall (Z = -10)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), wallPlasterMat);
    backWall.position.set(0, 2.5, -10);
    backWall.receiveShadow = true;
    this.group.add(backWall);

    // Left wall (X = -7)
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), wallPlasterMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-7, 2.5, 0);
    leftWall.receiveShadow = true;
    this.group.add(leftWall);

    // Front wall Left section (X: -7.0 to -1.5, width: 5.5m, center: -4.25)
    const frontWallLeft = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 5), wallPlasterMat);
    frontWallLeft.rotation.y = Math.PI;
    frontWallLeft.position.set(-4.25, 2.5, 10);
    frontWallLeft.receiveShadow = true;

    // Front wall Right section (X: 1.5 to 7.0, width: 5.5m, center: 4.25)
    const frontWallRight = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 5), wallPlasterMat);
    frontWallRight.rotation.y = Math.PI;
    frontWallRight.position.set(4.25, 2.5, 10);
    frontWallRight.receiveShadow = true;

    // Front wall Header section above portal (width 3.0m, height 1.6m, from Y=3.4 to 5.0, center Y=4.2)
    const frontWallHeader = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.6), wallPlasterMat);
    frontWallHeader.rotation.y = Math.PI;
    frontWallHeader.position.set(0, 4.2, 10);
    frontWallHeader.receiveShadow = true;
    this.group.add(frontWallLeft, frontWallRight, frontWallHeader);

    // Right wall (X = +7)
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), wallPlasterMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(7, 2.5, 0);
    rightWall.receiveShadow = true;
    this.group.add(rightWall);

    // ─────────────────────────────────────────────────────────────
    // CURATED FINE ART & MOTIVATIONAL EXHIBITION (Replaces empty brown panels)
    // ─────────────────────────────────────────────────────────────
    const artFrameMat = new THREE.MeshStandardMaterial({ color: 0x141720, metalness: 0.90, roughness: 0.22 });
    const artGlassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
      roughness: 0.04,
      metalness: 0.95,
      depthWrite: false
    });

    // Curated Wall Bays across Left and Right walls
    const galleryBays = [
      // Left Wall (X = -6.93, facing +X into room)
      { side: 'left', x: -6.93, z: -8.0, type: 'quote', quoteIdx: 0 }, // BUILD SOMETHING THAT MATTERS
      { side: 'left', x: -6.93, z: -3.7, type: 'photo', photoIdx: 0 }, // METROPOLIS SUSPENSION
      { side: 'left', x: -6.93, z: 0.8,  type: 'quote', quoteIdx: 1 }, // DREAM. DESIGN. DEVELOP.
      { side: 'left', x: -6.93, z: 7.0,  type: 'photo', photoIdx: 1 }, // BRUTALIST EQUILIBRIUM
      // Right Wall (X = +6.93, facing -X into room)
      { side: 'right', x: 6.93, z: -8.0, type: 'quote', quoteIdx: 2 }, // CREATIVITY IS INTELLIGENCE HAVING FUN
      { side: 'right', x: 6.93, z: -4.0, type: 'photo', photoIdx: 2 }, // MIDNIGHT OBSERVATORY
      { side: 'right', x: 6.93, z: 7.2,  type: 'quote', quoteIdx: 4 }, // TURN IDEAS INTO REALITY
      // Front Wall Right Section (Z = 9.94, X = 4.2, facing -Z into room)
      { side: 'front', x: 4.2,  z: 9.94, type: 'quote', quoteIdx: 3 }  // GREAT THINGS TAKE TIME
    ];

    galleryBays.forEach((bay) => {
      const artGroup = new THREE.Group();

      if (bay.side === 'left') {
        artGroup.position.set(bay.x, 2.65, bay.z);
        artGroup.rotation.y = Math.PI / 2;
      } else if (bay.side === 'right') {
        artGroup.position.set(bay.x, 2.65, bay.z);
        artGroup.rotation.y = -Math.PI / 2;
      } else {
        artGroup.position.set(bay.x, 2.65, bay.z);
        artGroup.rotation.y = Math.PI;
      }

      // Brushed Titanium Heavy Frame Casing
      const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(1.48, 1.84, 0.07), artFrameMat);
      outerFrame.castShadow = true;
      artGroup.add(outerFrame);

      // Polished Brass Inner Bezel
      const innerBezel = new THREE.Mesh(new THREE.BoxGeometry(1.36, 1.72, 0.08), brassTrimMat);
      artGroup.add(innerBezel);

      // Artwork Texture Plane
      const artTex = bay.type === 'quote'
        ? createMotivationalQuoteTexture(bay.quoteIdx!, this.renderer)
        : createArchitecturalPhotoTexture(bay.photoIdx!, this.renderer);

      const artPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.30, 1.66),
        new THREE.MeshBasicMaterial({ map: artTex })
      );
      artPlane.position.z = 0.042;
      artGroup.add(artPlane);

      // Glass Cover with subtle reflection
      const glassCover = new THREE.Mesh(new THREE.PlaneGeometry(1.30, 1.66), artGlassMat);
      glassCover.position.z = 0.045;
      artGroup.add(glassCover);

      // Slim Brass Picture Gallery Light mounted above frame
      const lampArm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.22), brassTrimMat);
      lampArm.position.set(0, 0.98, 0.11);
      const lampTube = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.95, 12), brassTrimMat);
      lampTube.rotation.z = Math.PI / 2;
      lampTube.position.set(0, 0.98, 0.22);
      const lampLed = new THREE.Mesh(
        new THREE.BoxGeometry(0.90, 0.012, 0.012),
        new THREE.MeshBasicMaterial({ color: 0xfff5ea })
      );
      lampLed.position.set(0, 0.965, 0.22);
      artGroup.add(lampArm, lampTube, lampLed);

      this.group.add(artGroup);
    });

    // 6. ARCHITECTURAL PORTAL JAMB TRIM (Connecting Studio & Corridor)
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 0, 10.0);

    // Left portal jamb
    const lJamb = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.4, 0.4), darkWalnutMat);
    lJamb.position.set(-1.5, 1.7, 0);
    // Right portal jamb
    const rJamb = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.4, 0.4), darkWalnutMat);
    rJamb.position.set(1.5, 1.7, 0);
    // Top portal lintel architrave
    const tLintel = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.25, 0.45), darkWalnutMat);
    tLintel.position.set(0, 3.45, 0);
    portalGroup.add(lJamb, rJamb, tLintel);

    // Brass accent reveal inlays
    const brassRevealL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 3.4, 0.42), brassTrimMat);
    brassRevealL.position.set(-1.38, 1.7, 0);
    const brassRevealR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 3.4, 0.42), brassTrimMat);
    brassRevealR.position.set(1.38, 1.7, 0);
    portalGroup.add(brassRevealL, brassRevealR);

    // Studio-side Sconces flanking portal
    [-1.85, 1.85].forEach((sx) => {
      const sconceArm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.16), darkWalnutMat);
      sconceArm.position.set(sx, 2.5, -0.08);
      const sconceShade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.12, 0.22, 12),
        new THREE.MeshStandardMaterial({ color: 0xfff5ea, roughness: 0.3 })
      );
      sconceShade.position.set(sx, 2.5, -0.18);
      portalGroup.add(sconceArm, sconceShade);
    });
    this.group.add(portalGroup);

    // 7. ARCHITECTURAL PANORAMIC WINDOWS (Right Wall, Z = 0.5 to 5.5)
    const winGroup = new THREE.Group();
    winGroup.position.set(6.94, 2.4, 1.2);
    winGroup.rotation.y = -Math.PI / 2;

    const metalFrameMat = new THREE.MeshStandardMaterial({ color: 0x1f242c, metalness: 0.85, roughness: 0.25 });
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.2, 0.16), metalFrameMat);
    winGroup.add(winFrame);

    const sceneryTex = createWindowSceneryTexture();
    const sceneryPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 3.4),
      new THREE.MeshBasicMaterial({ map: sceneryTex })
    );
    sceneryPlane.position.set(0, 0, -0.14);
    sceneryPlane.rotation.y = Math.PI;
    winGroup.add(sceneryPlane);

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.32,
      roughness: 0.05,
      metalness: 0.9,
      depthWrite: false
    });
    const glassPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 2.9), glassMat);
    glassPlane.position.set(0, 0, 0.02);
    winGroup.add(glassPlane);

    [-1.6, 0, 1.6].forEach((mx) => {
      const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.9, 0.09), metalFrameMat);
      vMullion.position.set(mx, 0, 0.04);
      winGroup.add(vMullion);
    });
    const hMullion = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.07, 0.09), metalFrameMat);
    hMullion.position.set(0, 0, 0.04);
    winGroup.add(hMullion);

    const curtainRod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 5.8, 12), brassTrimMat);
    curtainRod.rotation.z = Math.PI / 2;
    curtainRod.position.set(0, 1.7, 0.15);
    winGroup.add(curtainRod);

    const drapeMat = new THREE.MeshStandardMaterial({ color: 0x4a3b32, roughness: 0.95 });
    [-2.6, 2.6].forEach((cx) => {
      const drape = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.3, 0.16), drapeMat);
      drape.position.set(cx, -0.05, 0.14);
      winGroup.add(drape);
    });
    this.group.add(winGroup);
  }

  // 1. MAIN GRAND DIGITAL ART CENTERPIECE WALL (Back Wall, Z = -9.92, Above Workstation)
  private buildMainIdentityFocalWall() {
    const group = new THREE.Group();
    group.position.set(0, 3.15, -9.92);

    // Ultra-wide high-resolution digital art installation canvas (9.6m x 3.6m)
    const identityTex = createMainIdentityTexture();
    const signBoard = new THREE.Mesh(
      new THREE.PlaneGeometry(9.6, 3.6),
      new THREE.MeshBasicMaterial({ map: identityTex })
    );
    signBoard.position.set(0, 0, 0.02);
    group.add(signBoard);

    // Beveled Titanium & Electric Cyan Illuminated Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e2430, metalness: 0.92, roughness: 0.22 });
    const cyanTrimMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });

    // Outer frame bars
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(9.68, 0.08, 0.09), frameMat);
    topBar.position.set(0, 1.84, 0.04);
    const btmBar = new THREE.Mesh(new THREE.BoxGeometry(9.68, 0.08, 0.09), frameMat);
    btmBar.position.set(0, -1.84, 0.04);
    const lBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.76, 0.09), frameMat);
    lBar.position.set(-4.84, 0, 0.04);
    const rBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.76, 0.09), frameMat);
    rBar.position.set(4.84, 0, 0.04);
    group.add(topBar, btmBar, lBar, rBar);

    // Inner Glowing Cyan Bezel Line
    const topCyan = new THREE.Mesh(new THREE.BoxGeometry(9.62, 0.015, 0.02), cyanTrimMat);
    topCyan.position.set(0, 1.80, 0.05);
    const btmCyan = new THREE.Mesh(new THREE.BoxGeometry(9.62, 0.015, 0.02), cyanTrimMat);
    btmCyan.position.set(0, -1.80, 0.05);
    const lCyan = new THREE.Mesh(new THREE.BoxGeometry(0.015, 3.62, 0.02), cyanTrimMat);
    lCyan.position.set(-4.80, 0, 0.05);
    const rCyan = new THREE.Mesh(new THREE.BoxGeometry(0.015, 3.62, 0.02), cyanTrimMat);
    rCyan.position.set(4.80, 0, 0.05);
    group.add(topCyan, btmCyan, lCyan, rCyan);

    // Radiant Violet & Magenta Halo Ambient Glow Backlight
    const haloGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(10.2, 4.2),
      new THREE.MeshBasicMaterial({
        color: 0xc026d3,
        transparent: true,
        opacity: 0.40,
        depthWrite: false
      })
    );
    haloGlow.position.set(0, 0, -0.02);
    group.add(haloGlow);

    // Flanking Dark Walnut Acoustic Slat Wings with Vertical Warm LED Channels
    [-5.8, 5.8].forEach((wingX) => {
      const wingGroup = new THREE.Group();
      wingGroup.position.set(wingX, -0.2, 0);

      // Acoustic slatted panel
      const wingPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 4.6, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x161820, roughness: 0.85 })
      );
      wingGroup.add(wingPanel);

      // Walnut vertical slats with embedded cyan & gold LED strips
      for (let s = -0.65; s <= 0.65; s += 0.26) {
        const slat = new THREE.Mesh(
          new THREE.BoxGeometry(0.10, 4.6, 0.04),
          new THREE.MeshStandardMaterial({ color: 0x362115, roughness: 0.4 })
        );
        slat.position.set(s, 0, 0.04);
        wingGroup.add(slat);

        // LED channel
        const led = new THREE.Mesh(
          new THREE.BoxGeometry(0.018, 4.5, 0.01),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        led.position.set(s + 0.12, 0, 0.035);
        wingGroup.add(led);
      }
      group.add(wingGroup);
    });

    this.group.add(group);
  }

  // 2. SYMMETRICAL GALLERY WALL (Front Wall Left Section, Z = 9.92, X = -4.2)
  private buildSymmetricalGalleryWall() {
    const group = new THREE.Group();
    group.position.set(-4.2, 2.6, 9.92);
    group.rotation.y = Math.PI; // Face into the room towards -Z

    // Architectural Gallery Dark Walnut Backing Panel
    const backPanel = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 3.8, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.8 })
    );
    group.add(backPanel);

    // Gallery Title Header Plate
    const headerCanvas = document.createElement('canvas');
    headerCanvas.width = 600;
    headerCanvas.height = 100;
    const hCtx = headerCanvas.getContext('2d')!;
    hCtx.fillStyle = '#181a20';
    hCtx.fillRect(0, 0, 600, 100);
    hCtx.textAlign = 'center';
    hCtx.fillStyle = '#d4af37';
    hCtx.font = 'bold 24px "Cabinet Grotesk", sans-serif';
    hCtx.fillText('FEATURED PROJECTS & HONORS', 300, 45);
    hCtx.fillStyle = '#38bdf8';
    hCtx.font = '14px "JetBrains Mono", monospace';
    hCtx.fillText('PORTFOLIO EXHIBITION • 5 LIVE PROJECTS + HACKATHONS', 300, 75);
    const headerTex = new THREE.CanvasTexture(headerCanvas);
    headerTex.colorSpace = THREE.SRGBColorSpace;

    const headerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 0.6),
      new THREE.MeshBasicMaterial({ map: headerTex })
    );
    headerMesh.position.set(0, 1.55, 0.04);
    group.add(headerMesh);

    // 6-8 Large Black-Framed Wall Displays arranged in precise 2x3 Grid
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x101216, roughness: 0.25, metalness: 0.85 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.2 });
    const glassReflectionMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      roughness: 0.05,
      metalness: 0.9,
      depthWrite: false
    });

    const gridCols = [-1.4, 0, 1.4];
    const gridRows = [0.65, -0.65];

    let artIdx = 0;
    gridRows.forEach((gy) => {
      gridCols.forEach((gx) => {
        const frameGroup = new THREE.Group();
        frameGroup.position.set(gx, gy, 0.04);

        // Frame Moulding
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 0.06), frameMat);
        frame.castShadow = true;

        // Artwork Canvas
        const artTex = createGalleryArtTexture(artIdx);
        const artPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(1.08, 0.98),
          new THREE.MeshBasicMaterial({ map: artTex })
        );
        artPlane.position.z = 0.032;

        // Glass reflection cover
        const glassCover = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.98), glassReflectionMat);
        glassCover.position.z = 0.034;

        // Picture Light Fixture mounted above frame
        const picLightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8), brassMat);
        picLightArm.position.set(0, 0.62, 0.08);
        picLightArm.rotation.x = Math.PI / 3;
        const picLightHead = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 12), brassMat);
        picLightHead.position.set(0, 0.68, 0.14);
        picLightHead.rotation.z = Math.PI / 2;

        // Soft spotlight glow from picture light
        const bulb = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, 0.015, 0.02),
          new THREE.MeshBasicMaterial({ color: 0xffeedd })
        );
        bulb.position.set(0, 0.665, 0.14);

        frameGroup.add(frame, artPlane, glassCover, picLightArm, picLightHead, bulb);
        group.add(frameGroup);
        artIdx++;
      });
    });

    this.interactiveMeshes['projects'] = group;
    this.group.add(group);
  }

  // 3. VERTICAL WALNUT SLAT ACCENT WALL & WORLD LANDMARK MINIATURE GALLERY (Front Wall Right Section, Z = 9.92, X = +4.2)
  private buildSlattedAccentAndShelves() {
    const galleryGroup = buildWorldLandmarkGallery(this.renderer);
    this.group.add(galleryGroup);
    this.addCollider(4.2 - 2.15, 4.2 + 2.15, 9.92 - 0.95, 9.92);
  }

  // 4. ZONE 1: ABOUT ME — "BEYOND THE CODE" (Left Wall, X = -6.92, Z = 4.0)
  private buildZone1AboutMe() {
    const group = new THREE.Group();
    group.position.set(-6.92, 0, 4.0);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x141720, roughness: 0.25, metalness: 0.88 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.18 });
    const woodShelfMat = new THREE.MeshStandardMaterial({ color: 0x222632, roughness: 0.45, metalness: 0.3 });
    const glassReflectionMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
      roughness: 0.05,
      metalness: 0.95,
      depthWrite: false
    });

    // ─────────────────────────────────────────────────────────────
    // ARCHITECTURAL SECTION HEADER ("BEYOND THE CODE")
    // ─────────────────────────────────────────────────────────────
    const headerCanvas = document.createElement('canvas');
    headerCanvas.width = 800;
    headerCanvas.height = 140;
    const hCtx = headerCanvas.getContext('2d')!;
    hCtx.fillStyle = '#0f1218';
    hCtx.fillRect(0, 0, 800, 140);
    hCtx.strokeStyle = '#d4af37';
    hCtx.lineWidth = 3;
    hCtx.strokeRect(8, 8, 784, 124);
    hCtx.textAlign = 'center';
    hCtx.fillStyle = '#d4af37';
    hCtx.font = 'bold 13px "JetBrains Mono", monospace';
    hCtx.letterSpacing = '3px';
    hCtx.fillText('// PERSONAL IDENTITY //', 400, 36);
    hCtx.fillStyle = '#ffffff';
    hCtx.font = '900 36px "Cabinet Grotesk", sans-serif';
    hCtx.letterSpacing = '3px';
    hCtx.fillText('BEYOND THE CODE', 400, 82);
    hCtx.fillStyle = '#38bdf8';
    hCtx.font = '700 15px "Cabinet Grotesk", sans-serif';
    hCtx.letterSpacing = '2px';
    hCtx.fillText('THE PERSON BEHIND THE PROJECTS', 400, 114);

    const headerTex = new THREE.CanvasTexture(headerCanvas);
    headerTex.colorSpace = THREE.SRGBColorSpace;
    const headerPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 0.65),
      new THREE.MeshBasicMaterial({ map: headerTex })
    );
    headerPlane.rotation.y = Math.PI / 2;
    headerPlane.position.set(0.08, 3.85, -0.8);
    group.add(headerPlane);

    // ─────────────────────────────────────────────────────────────
    // USER'S ACTUAL IDENTITY PORTRAIT (Framed Museum Showcase)
    // Vertical 3:4 Aspect Ratio — STRICTLY 3D SCENE ONLY
    // ─────────────────────────────────────────────────────────────
    const portraitMat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide
    });

    const portraitTex = new THREE.TextureLoader().load(
      '/assets/aistudio/ayush-profile_acde6d66.jpeg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        portraitMat.map = tex;
        portraitMat.needsUpdate = true;
      }
    );
    portraitTex.colorSpace = THREE.SRGBColorSpace;
    portraitMat.map = portraitTex;

    // Dark Backing Panel behind the photo
    const portraitBacking = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 2.20, 1.70),
      new THREE.MeshStandardMaterial({ color: 0x08090d, roughness: 0.9 })
    );
    portraitBacking.position.set(0.02, 2.45, 0.1);
    portraitBacking.castShadow = true;
    group.add(portraitBacking);

    // Perimeter Graphite Frame Rails (Top, Bottom, Left, Right — never occluding the center)
    const frameRailTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.70), frameMat);
    frameRailTop.position.set(0.04, 2.45 + 1.04, 0.1);
    const frameRailBottom = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.70), frameMat);
    frameRailBottom.position.set(0.04, 2.45 - 1.04, 0.1);
    const frameRailLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.16, 0.08), frameMat);
    frameRailLeft.position.set(0.04, 2.45, 0.1 + 0.79);
    const frameRailRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.16, 0.08), frameMat);
    frameRailRight.position.set(0.04, 2.45, 0.1 - 0.79);
    group.add(frameRailTop, frameRailBottom, frameRailLeft, frameRailRight);

    // Polished Brass Inner Bevel Rails
    const brassRailTop = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.025, 1.56), brassMat);
    brassRailTop.position.set(0.05, 2.45 + 1.00, 0.1);
    const brassRailBottom = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.025, 1.56), brassMat);
    brassRailBottom.position.set(0.05, 2.45 - 1.00, 0.1);
    const brassRailLeft = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.02, 0.025), brassMat);
    brassRailLeft.position.set(0.05, 2.45, 0.1 + 0.76);
    const brassRailRight = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.02, 0.025), brassMat);
    brassRailRight.position.set(0.05, 2.45, 0.1 - 0.76);
    group.add(brassRailTop, brassRailBottom, brassRailLeft, brassRailRight);

    // Real Portrait Canvas (Vertical 3:4 Aspect Ratio: 1.50m wide in Z, 2.00m high in Y)
    // Positioned forward at X = 0.085 so it sits cleanly and proudly in front of the backplate
    const portraitCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(1.50, 2.00),
      portraitMat
    );
    portraitCanvas.rotation.y = Math.PI / 2;
    portraitCanvas.position.set(0.085, 2.45, 0.1);
    portraitCanvas.castShadow = true;
    portraitCanvas.receiveShadow = true;
    group.add(portraitCanvas);

    // Ambient Cyan/Purple Edge Accent Rims
    const cyanRim = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 2.20, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    cyanRim.position.set(0.06, 2.45, 0.1 - 0.86);
    const purpleRim = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 2.20, 0.02),
      new THREE.MeshBasicMaterial({ color: 0xa855f7 })
    );
    purpleRim.position.set(0.06, 2.45, 0.1 + 0.86);
    group.add(cyanRim, purpleRim);

    // Overhead Brass Picture Gallery Light
    const picArm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.28), brassMat);
    picArm.position.set(0.14, 3.62, 0.1);
    const picTube = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 12), brassMat);
    picTube.rotation.z = Math.PI / 2;
    picTube.position.set(0.24, 3.62, 0.1);
    const picLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.015, 1.35),
      new THREE.MeshBasicMaterial({ color: 0xfff7ed })
    );
    picLed.position.set(0.23, 3.60, 0.1);
    group.add(picArm, picTube, picLed);

    // Dedicated Warm-White Museum Spotlight pointing directly at the portrait
    const portraitSpot = new THREE.SpotLight(0xfff5e6, 2.5, 9.0, Math.PI / 3.5, 0.5, 1.2);
    portraitSpot.position.set(1.8, 3.8, 0.1);
    portraitSpot.target = portraitCanvas;
    group.add(portraitSpot);

    // ─────────────────────────────────────────────────────────────
    // INFORMATION PANEL BESIDE PORTRAIT
    // ─────────────────────────────────────────────────────────────
    const infoTex = createPersonalIdentityPanelTexture(this.renderer);
    const infoFrame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.06, 1.54), frameMat);
    infoFrame.position.set(0.05, 2.45, -1.8);
    infoFrame.castShadow = true;
    group.add(infoFrame);

    const infoBezel = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.94, 1.42), brassMat);
    infoBezel.position.set(0.052, 2.45, -1.8);
    group.add(infoBezel);

    const infoCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(1.38, 1.90),
      new THREE.MeshBasicMaterial({ map: infoTex })
    );
    infoCanvas.rotation.y = Math.PI / 2;
    infoCanvas.position.set(0.098, 2.45, -1.8);
    group.add(infoCanvas);

    // ─────────────────────────────────────────────────────────────
    // FLOATING GRAPHITE & WALNUT DISPLAY CREDENZA
    // ─────────────────────────────────────────────────────────────
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 3.8), woodShelfMat);
    shelf.position.set(0.24, 1.15, -0.85);
    shelf.castShadow = true;
    group.add(shelf);

    const shelfLip = new THREE.Mesh(new THREE.BoxGeometry(0.445, 0.02, 3.82), brassMat);
    shelfLip.position.set(0.24, 1.15, -0.85);
    group.add(shelfLip);

    const shelfLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.02, 3.7),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    shelfLed.position.set(0.08, 1.10, -0.85);
    group.add(shelfLed);

    // Curated Books on shelf
    const bookColors = [0x7f1d1d, 0x1e3a8a, 0x064e3b, 0x78350f, 0x4c1d95];
    bookColors.forEach((col, idx) => {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.28, 0.055),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.75 })
      );
      book.position.set(0.24, 1.33, -2.2 + idx * 0.07);
      book.rotation.y = Math.PI / 2;
      group.add(book);
    });

    // Brass Mantle Clock
    const clockBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.10, 0.05, 16),
      brassMat
    );
    clockBody.rotation.z = Math.PI / 2;
    clockBody.position.set(0.24, 1.28, -1.4);
    group.add(clockBody);

    // Sculpted ceramic succulent planter
    const planter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.07, 0.14, 12),
      new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.25 })
    );
    planter.position.set(0.24, 1.26, -0.7);
    const succulent = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.10),
      new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.85 })
    );
    succulent.position.set(0.24, 1.36, -0.7);
    group.add(planter, succulent);

    this.interactiveMeshes['about'] = portraitCanvas;
    this.group.add(group);
    this.addCollider(-7.0, -6.3, 1.8, 5.6);
  }

  // 5. ZONE 2: SKILLS: DEVELOPER TECHNOLOGY WALL (Left Wall, X = -6.92, Z = -1.5)
  private buildZone2Skills() {
    const group = new THREE.Group();
    group.position.set(-6.92, 0, -1.5);

    const metalFrameMat = new THREE.MeshStandardMaterial({ color: 0x141720, metalness: 0.88, roughness: 0.22 });
    const cyanLedMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    // ─────────────────────────────────────────────────────────────
    // GRAND ILLUMINATED TECHNOLOGY WALL HEADER
    // ─────────────────────────────────────────────────────────────
    const techHeaderTex = createTechnologyWallHeaderTexture(this.renderer);
    const techHeaderPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 1.45),
      new THREE.MeshBasicMaterial({ map: techHeaderTex })
    );
    techHeaderPlane.rotation.y = Math.PI / 2;
    techHeaderPlane.position.set(0.08, 3.82, 0);
    group.add(techHeaderPlane);

    // Outer framing casing with glowing cyan bezel
    const techHeaderFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.50, 3.66),
      metalFrameMat
    );
    techHeaderFrame.position.set(0.04, 3.82, 0);
    const techHeaderBezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 1.52, 3.68),
      cyanLedMat
    );
    techHeaderBezel.position.set(0.06, 3.82, 0);
    group.add(techHeaderFrame, techHeaderBezel);

    // ─────────────────────────────────────────────────────────────
    // DUAL CODE MONITOR / SYSTEM TELEMETRY DISPLAY
    // ─────────────────────────────────────────────────────────────
    const monitorTex = createCodeMonitorTexture();
    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.9, 3.4), metalFrameMat);
    screenFrame.position.set(0.045, 2.15, 0);
    screenFrame.castShadow = true;
    group.add(screenFrame);

    const screenMat = new THREE.MeshBasicMaterial({ map: monitorTex });
    this.animatedScreenMat = screenMat;
    const screenPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.26, 1.76), screenMat);
    screenPlane.rotation.y = Math.PI / 2;
    screenPlane.position.set(0.092, 2.15, 0);
    group.add(screenPlane);

    // Glowing Neon Edges
    const topGlow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 3.4), cyanLedMat);
    topGlow.position.set(0.07, 3.12, 0);
    const btmGlow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 3.4), new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
    btmGlow.position.set(0.07, 1.18, 0);
    group.add(topGlow, btmGlow);

    // 3D Technology Logo Sculptures on floating shelf
    const techShelf = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.06, 3.8),
      new THREE.MeshStandardMaterial({ color: 0x22242a, roughness: 0.4, metalness: 0.5 })
    );
    techShelf.position.set(0.22, 1.25, 0);
    techShelf.castShadow = true;
    group.add(techShelf);

    // React Atom
    const reactGroup = new THREE.Group();
    reactGroup.position.set(0.24, 1.45, -1.3);
    const reactCore = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshBasicMaterial({ color: 0x00d8ff }));
    reactGroup.add(reactCore);
    for (let r = 0; r < 3; r++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.12, 0.012, 8, 24),
        new THREE.MeshStandardMaterial({ color: 0x00d8ff, metalness: 0.9, roughness: 0.1 })
      );
      ring.rotation.set((r * Math.PI) / 3, 0, (r * Math.PI) / 4);
      reactGroup.add(ring);
    }
    group.add(reactGroup);

    // Three.js Icosahedron
    const threeMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.12, 0),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 })
    );
    threeMesh.position.set(0.24, 1.45, -0.45);
    group.add(threeMesh);

    // Python Ribbon
    const pythonGroup = new THREE.Group();
    pythonGroup.position.set(0.24, 1.45, 0.45);
    const py1 = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 8, 16, Math.PI * 1.5), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
    const py2 = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 8, 16, Math.PI * 1.5), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    py2.rotation.x = Math.PI;
    pythonGroup.add(py1, py2);
    group.add(pythonGroup);

    // Git Branch Sculpture
    const gitGroup = new THREE.Group();
    gitGroup.position.set(0.24, 1.45, 1.3);
    const gitTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), new THREE.MeshStandardMaterial({ color: 0xf05032 }));
    const gitNode1 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), new THREE.MeshBasicMaterial({ color: 0xf05032 }));
    gitNode1.position.y = 0.10;
    const gitBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), new THREE.MeshStandardMaterial({ color: 0xf05032 }));
    gitBranch.position.set(0.05, 0.03, 0);
    gitBranch.rotation.z = -Math.PI / 4;
    const gitNode2 = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), new THREE.MeshBasicMaterial({ color: 0xf05032 }));
    gitNode2.position.set(0.09, 0.08, 0);
    gitGroup.add(gitTrunk, gitNode1, gitBranch, gitNode2);
    group.add(gitGroup);

    this.interactiveMeshes['skills'] = screenFrame;
    this.group.add(group);
    this.addCollider(-7.0, -6.3, -3.6, 0.6);
  }

  // 6. ZONE 3: PROJECT SHOWCASE: DEVELOPER WORKSTATION (Back Wall, Z = -8.2, X = 0)
  private buildZone3Workstation() {
    const group = new THREE.Group();
    group.position.set(0, 0, -8.2);

    const darkWalnutMat = new THREE.MeshStandardMaterial({ color: 0x3a2215, roughness: 0.35, metalness: 0.08 });
    const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x1a1e24, roughness: 0.35, metalness: 0.9 });
    const aluminumMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.95, roughness: 0.2 });

    // Tabletop
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.09, 1.25), darkWalnutMat);
    tableTop.position.set(0, 0.76, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    group.add(tableTop);

    // Trestle legs
    [-1.45, 1.45].forEach((lx) => {
      const legVertical = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.72, 0.8), darkSteelMat);
      legVertical.position.set(lx, 0.36, 0);
      legVertical.castShadow = true;

      const legBase = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 1.1), darkSteelMat);
      legBase.position.set(lx, 0.025, 0);
      group.add(legVertical, legBase);
    });

    // Leather Desk Mat
    const matMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.008, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 0.88 })
    );
    matMesh.position.set(0, 0.81, 0.05);
    group.add(matMesh);

    // Ultrawide Curved Monitor
    const monGroup = new THREE.Group();
    monGroup.position.set(0, 0.81, -0.28);

    const monStandBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 0.26), darkSteelMat);
    const monStandArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.09), darkSteelMat);
    monStandArm.position.set(0, 0.25, -0.06);
    monGroup.add(monStandBase, monStandArm);

    const monHousing = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.65, 0.07), darkSteelMat);
    monHousing.position.set(0, 0.55, 0);
    monHousing.castShadow = true;
    monGroup.add(monHousing);

    const monitorTex = createCodeMonitorTexture();
    const monScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.64, 0.60), new THREE.MeshBasicMaterial({ map: monitorTex }));
    monScreen.position.set(0, 0.55, 0.038);
    monGroup.add(monScreen);

    // Backlight halo
    const monBacklight = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 0.75),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25, depthWrite: false })
    );
    monBacklight.position.set(0, 0.55, -0.05);
    monBacklight.rotation.y = Math.PI;
    monGroup.add(monBacklight);
    group.add(monGroup);

    // HERO INTERACTIVE LAPTOP
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-0.72, 0.814, 0.12);
    laptopGroup.rotation.y = 0.26;

    const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.018, 0.35), aluminumMat);
    lapBase.position.y = 0.009;
    lapBase.castShadow = true;
    laptopGroup.add(lapBase);

    const lapKeyboard = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.003, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.6 })
    );
    lapKeyboard.position.set(0, 0.019, -0.045);
    laptopGroup.add(lapKeyboard);

    const trackpad = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.002, 0.11),
      new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.25, metalness: 0.8 })
    );
    trackpad.position.set(0, 0.019, 0.095);
    laptopGroup.add(trackpad);

    const lapLidGroup = new THREE.Group();
    lapLidGroup.position.set(0, 0.018, -0.175);
    lapLidGroup.rotation.x = -0.36;

    const lapLid = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.35, 0.014), aluminumMat);
    lapLid.position.set(0, 0.175, 0);
    lapLid.castShadow = true;
    lapLidGroup.add(lapLid);

    const laptopTex = createLaptopScreenTexture();
    const lapScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.31), new THREE.MeshBasicMaterial({ map: laptopTex }));
    lapScreen.position.set(0, 0.175, 0.009);
    lapLidGroup.add(lapScreen);

    laptopGroup.add(lapLidGroup);
    group.add(laptopGroup);
    this.interactiveMeshes['projects'] = laptopGroup;

    // Keyboard & Mouse
    const kbMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.03, 0.19),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    );
    kbMesh.position.set(0.12, 0.825, 0.2);
    kbMesh.castShadow = true;
    group.add(kbMesh);

    const mouseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.085, 0.034, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 })
    );
    mouseMesh.position.set(0.58, 0.825, 0.2);
    group.add(mouseMesh);

    // Headphones on Curved Stand
    const hpGroup = new THREE.Group();
    hpGroup.position.set(1.25, 0.814, -0.15);
    const hpStand = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.34, 10), darkWalnutMat);
    hpStand.position.y = 0.17;
    const hpBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.025, 16), darkWalnutMat);
    hpBase.position.y = 0.012;
    const hpArch = new THREE.Mesh(
      new THREE.TorusGeometry(0.10, 0.022, 8, 16, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.85 })
    );
    hpArch.position.set(0, 0.31, 0);
    hpArch.rotation.z = Math.PI;
    hpGroup.add(hpStand, hpBase, hpArch);
    group.add(hpGroup);

    // Desk Lamp
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-1.3, 0.814, -0.22);
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.025, 16), darkSteelMat);
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.48, 8), darkSteelMat);
    lampStem.position.set(0.08, 0.24, 0);
    lampStem.rotation.z = -0.32;
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.18, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.35, side: THREE.DoubleSide })
    );
    lampShade.position.set(0.20, 0.44, 0);
    lampShade.rotation.z = 0.65;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    bulb.position.set(0.20, 0.41, 0);
    lampGroup.add(lampBase, lampStem, lampShade, bulb);
    group.add(lampGroup);

    // Ceramic Mug
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.042, 0.11, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
    );
    mug.position.set(0.72, 0.865, 0.34);
    group.add(mug);

    // Executive Chair
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, 0, 0.9);
    const chairFabric = new THREE.MeshStandardMaterial({ color: 0x1e222a, roughness: 0.85 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.11, 0.54), chairFabric);
    seat.position.y = 0.52;
    seat.castShadow = true;
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.68, 0.08), chairFabric);
    backrest.position.set(0, 0.85, 0.25);
    backrest.rotation.x = 0.08;
    backrest.castShadow = true;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.48, 12), darkSteelMat);
    post.position.y = 0.26;
    chairGroup.add(seat, backrest, post);

    for (let c = 0; c < 5; c++) {
      const angle = (c * Math.PI * 2) / 5;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.035, 0.04), darkSteelMat);
      leg.position.set(Math.cos(angle) * 0.16, 0.06, Math.sin(angle) * 0.16);
      leg.rotation.y = -angle;
      chairGroup.add(leg);
    }
    group.add(chairGroup);

    this.group.add(group);
    this.addCollider(-1.9, 1.9, -9.2, -7.3);
    this.addCollider(-0.45, 0.45, -7.5, -6.7);
  }

  // 7. ZONE 4: ACHIEVEMENTS: GRAND TROPHY HALL & HALL OF FAME (Right Wall, X = 6.92, Z = -1.5)
  private buildZone4Achievements() {
    const { group, interactiveMesh } = buildGrandTrophyHall(this.renderer);
    this.interactiveMeshes['achievements'] = interactiveMesh;
    this.group.add(group);
    this.addCollider(6.0, 7.0, -4.0, 1.0);
  }

  // 8. ZONE 5: NEXORA WEB SOLUTIONS: FOUNDER CORNER (Right Wall, X = 6.92, Z = -6.5)
  private buildZone5Nexora() {
    const group = new THREE.Group();
    group.position.set(6.92, 0, -6.5);

    const deskMat = new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.3, metalness: 0.8 });
    const darkWalnutMat = new THREE.MeshStandardMaterial({ color: 0x362115, roughness: 0.45 });

    // Backlit 3D Nexora Architectural Signboard
    const nexoraTex = createNexoraLogoTexture();
    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), new THREE.MeshBasicMaterial({ map: nexoraTex }));
    signBoard.rotation.y = -Math.PI / 2;
    signBoard.position.set(-0.04, 2.6, 0);
    group.add(signBoard);

    const glowRim = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.35, 2.65),
      new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.85, roughness: 0.2 })
    );
    glowRim.position.set(-0.02, 2.6, 0);
    group.add(glowRim);

    // Executive desk & dual client displays
    const nexoraDesk = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.76, 2.0), deskMat);
    nexoraDesk.position.set(-0.6, 0.38, 0);
    nexoraDesk.castShadow = true;
    group.add(nexoraDesk);

    [-0.45, 0.45].forEach((my) => {
      const mon = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.46, 0.72),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.9 })
      );
      mon.position.set(-0.6, 0.99, my);
      group.add(mon);

      const monScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.68, 0.42),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      monScreen.rotation.y = -Math.PI / 2;
      monScreen.position.set(-0.642, 0.99, my);
      group.add(monScreen);
    });

    const cardHolder = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.05, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    cardHolder.position.set(-0.55, 0.78, 0.75);
    group.add(cardHolder);

    const nexoraChair = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.68, 16), darkWalnutMat);
    nexoraChair.position.set(-1.35, 0.36, 0);
    group.add(nexoraChair);

    this.interactiveMeshes['nexora'] = signBoard;
    this.group.add(group);
    this.addCollider(5.9, 7.0, -7.8, -5.2);
  }

  // 9. ZONE 6: CONTACT: COMMUNICATION CORNER (Right Wall, X = 6.92, Z = 4.2)
  private buildZone6Contact() {
    const group = new THREE.Group();
    group.position.set(6.92, 0, 4.2);

    // Premium materials for telephone & console table
    const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x12151c, roughness: 0.22, metalness: 0.86 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.16 });
    const darkWalnutMat = new THREE.MeshStandardMaterial({ color: 0x1e2026, roughness: 0.35, metalness: 0.2 });
    const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

    // ─────────────────────────────────────────────────────────────
    // REFINED MODERN FLUTED PEDESTAL CONSOLE TABLE
    // ─────────────────────────────────────────────────────────────
    const tableGroup = new THREE.Group();
    tableGroup.position.set(-0.62, 0, 0);

    // Weighted brass base plate
    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.04, 24), brassMat);
    basePlate.position.y = 0.02;
    basePlate.castShadow = true;
    tableGroup.add(basePlate);

    // Fluted cylindrical pedestal column
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.72, 20), darkWalnutMat);
    column.position.y = 0.40;
    column.castShadow = true;
    tableGroup.add(column);

    // Brass accent rings on column
    [0.18, 0.40, 0.62].forEach((ry) => {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.025, 20), brassMat);
      ring.position.y = ry;
      tableGroup.add(ring);
    });

    // Dark walnut round beveled tabletop with polished brass trim
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.045, 32), darkWalnutMat);
    tableTop.position.y = 0.78;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;

    const tableEdgeBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.485, 0.485, 0.025, 32), brassMat);
    tableEdgeBezel.position.y = 0.78;
    tableGroup.add(tableTop, tableEdgeBezel);
    group.add(tableGroup);

    // ─────────────────────────────────────────────────────────────
    // REFINED OBSIDIAN / GUNMETAL ROTARY TELEPHONE
    // ─────────────────────────────────────────────────────────────
    const phoneGroup = new THREE.Group();
    phoneGroup.position.set(-0.62, 0.81, 0.04);

    // Sculpted beveled obsidian chassis
    const phoneBase = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.28), obsidianMat);
    phoneBase.position.y = 0.015;
    phoneBase.castShadow = true;

    const phonePyramid = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.08, 16), obsidianMat);
    phonePyramid.position.y = 0.065;
    phonePyramid.castShadow = true;

    // Subtle cyan rim ring beneath the dial
    const dialRimRing = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.005, 24), cyanGlowMat);
    dialRimRing.position.set(0, 0.105, 0.02);
    dialRimRing.rotation.x = -Math.PI / 3;

    // High-resolution rotary dial with illuminated cyan digits
    const dialTex = createRotaryDialTexture();
    const dial = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.17), new THREE.MeshBasicMaterial({ map: dialTex }));
    dial.rotation.x = -Math.PI / 3;
    dial.position.set(0, 0.11, 0.025);

    // Polished brass cradle forks
    const cradleBar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.02), brassMat);
    cradleBar.position.set(0, 0.13, -0.06);
    phoneGroup.add(phoneBase, phonePyramid, dialRimRing, dial, cradleBar);

    [-0.075, 0.075].forEach((cx) => {
      const cradleFork = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 12), brassMat);
      cradleFork.position.set(cx, 0.16, -0.06);
      const forkTip = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 8), brassMat);
      forkTip.position.set(cx, 0.19, -0.06);
      phoneGroup.add(cradleFork, forkTip);
    });

    // Sleek obsidian & brass handset
    const handset = new THREE.Group();
    handset.position.set(0, 0.195, -0.06);

    const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.036, 0.04, 16), obsidianMat);
    ear.position.set(-0.13, 0, 0);
    const earBrassRing = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.01, 16), brassMat);
    earBrassRing.position.set(-0.13, 0.015, 0);

    const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.036, 0.04, 16), obsidianMat);
    mouth.position.set(0.13, 0, 0);
    const mouthBrassRing = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.01, 16), brassMat);
    mouthBrassRing.position.set(0.13, 0.015, 0);

    const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.24, 12), obsidianMat);
    handleBar.rotation.z = Math.PI / 2;
    handset.add(ear, earBrassRing, mouth, mouthBrassRing, handleBar);
    phoneGroup.add(handset);

    // Coiled cord connecting handset to chassis
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, 0.04, -0.06),
      new THREE.Vector3(0.15, 0.02, 0.01),
      new THREE.Vector3(0.12, 0.01, 0.10),
      new THREE.Vector3(0.04, 0.03, 0.02)
    ]);
    const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 24, 0.007, 6, false), obsidianMat);
    phoneGroup.add(cordMesh);

    // Dedicated overhead soft cyan/warm spotlight casting museum light onto the phone
    const phoneSpot = new THREE.SpotLight(0xa5f3fc, 2.0, 5.0, Math.PI / 5, 0.6, 1.5);
    phoneSpot.position.set(-0.62, 2.6, 0.1);
    phoneSpot.target = phoneBase;
    group.add(phoneSpot);

    group.add(phoneGroup);

    // ─────────────────────────────────────────────────────────────
    // ARCHITECTURAL COMMUNICATION HUB FEATURE WALL (Behind Telephone)
    // Completely replaces plain black panel with grand framed digital art installation
    // ─────────────────────────────────────────────────────────────
    const commWallGroup = new THREE.Group();
    commWallGroup.position.set(0, 0, 0);

    const casingMat = new THREE.MeshStandardMaterial({ color: 0x141822, metalness: 0.88, roughness: 0.22 });

    // Grand High-Definition Illuminated Communication Artwork (3.60m wide in Z x 2.40m tall in Y)
    const commTex = createCommunicationHubWallTexture(this.renderer);
    const commDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(3.60, 2.40),
      new THREE.MeshBasicMaterial({ map: commTex, side: THREE.DoubleSide })
    );
    commDisplay.rotation.y = -Math.PI / 2;
    commDisplay.position.set(-0.065, 2.45, 0);
    commWallGroup.add(commDisplay);

    // Perimeter Graphite Metallic Frame Rails (Top, Bottom, Left, Right)
    const commRailTop = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 3.76), casingMat);
    commRailTop.position.set(-0.04, 2.45 + 1.22, 0);
    const commRailBottom = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 3.76), casingMat);
    commRailBottom.position.set(-0.04, 2.45 - 1.22, 0);
    const commRailLeft = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.50, 0.07), casingMat);
    commRailLeft.position.set(-0.04, 2.45, 1.84);
    const commRailRight = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.50, 0.07), casingMat);
    commRailRight.position.set(-0.04, 2.45, -1.84);
    commWallGroup.add(commRailTop, commRailBottom, commRailLeft, commRailRight);

    // Polished Brushed Brass Inner Bezel Rails
    const commBrassTop = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 3.64), brassMat);
    commBrassTop.position.set(-0.05, 2.45 + 1.19, 0);
    const commBrassBottom = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 3.64), brassMat);
    commBrassBottom.position.set(-0.05, 2.45 - 1.19, 0);
    const commBrassLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.38, 0.025), brassMat);
    commBrassLeft.position.set(-0.05, 2.45, 1.80);
    const commBrassRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.38, 0.025), brassMat);
    commBrassRight.position.set(-0.05, 2.45, -1.80);
    commWallGroup.add(commBrassTop, commBrassBottom, commBrassLeft, commBrassRight);

    // Subtle Cyan & Purple LED Halo Edge Rims
    const cyanHaloTop = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.02, 3.76), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    cyanHaloTop.position.set(-0.025, 2.45 + 1.25, 0);
    const purpleHaloBottom = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.02, 3.76), new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
    purpleHaloBottom.position.set(-0.025, 2.45 - 1.25, 0);
    const cyanHaloLeft = new THREE.Mesh(new THREE.BoxGeometry(0.015, 2.50, 0.02), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    cyanHaloLeft.position.set(-0.025, 2.45, 1.87);
    const purpleHaloRight = new THREE.Mesh(new THREE.BoxGeometry(0.015, 2.50, 0.02), new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
    purpleHaloRight.position.set(-0.025, 2.45, -1.87);
    commWallGroup.add(cyanHaloTop, purpleHaloBottom, cyanHaloLeft, purpleHaloRight);

    // Dual Overhead Brass Picture Gallery Lights
    [-0.9, 0.9].forEach((zPos) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.26), brassMat);
      arm.position.set(-0.16, 3.74, zPos);
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 12), brassMat);
      tube.rotation.z = Math.PI / 2;
      tube.position.set(-0.26, 3.74, zPos);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.015, 1.05), new THREE.MeshBasicMaterial({ color: 0xfff7ed }));
      led.position.set(-0.25, 3.72, zPos);
      commWallGroup.add(arm, tube, led);

      // Warm overhead spotlights illuminating the artwork
      const spot = new THREE.SpotLight(0xfff7ed, 2.2, 6.5, Math.PI / 3.5, 0.5, 1.2);
      spot.position.set(-1.4, 3.8, zPos);
      spot.target = commDisplay;
      commWallGroup.add(spot);
    });

    group.add(commWallGroup);

    this.interactiveMeshes['contact'] = phoneGroup;
    this.group.add(group);
    this.addCollider(5.8, 7.0, 2.8, 5.6);
  }

  // 10. LUXURY CENTRAL LOUNGE SUITE (Sofa, Accent Chairs, 2-Tier Coffee Table, Side Tables, Stools)
  private buildLuxuryLounge() {
    const lounge = new THREE.Group();
    lounge.position.set(0, 0, 1.8);

    const sofaFabricMat = new THREE.MeshStandardMaterial({
      color: 0x1e2430, // Premium dark navy/charcoal bouclé
      roughness: 0.85,
      metalness: 0.05
    });

    const chairFabricMat = new THREE.MeshStandardMaterial({
      color: 0x2e3544,
      roughness: 0.85
    });

    const darkWalnutMat = new THREE.MeshStandardMaterial({
      color: 0x362115,
      roughness: 0.4
    });

    const blackMarbleMat = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.15,
      metalness: 0.2
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18
    });

    // A. PREMIUM THREE-SEATER SOFA (Width 2.6m) facing North toward Workstation
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(0, 0, 1.4);

    // Seat cushion
    const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.24, 0.85), sofaFabricMat);
    sofaSeat.position.y = 0.38;
    sofaSeat.castShadow = true;
    sofaGroup.add(sofaSeat);

    // Backrest
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.58, 0.22), sofaFabricMat);
    sofaBack.position.set(0, 0.72, 0.36);
    sofaBack.castShadow = true;
    sofaGroup.add(sofaBack);

    // Left and Right Arms
    [-1.25, 1.25].forEach((ax) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.54, 0.92), sofaFabricMat);
      arm.position.set(ax, 0.52, 0.02);
      arm.castShadow = true;
      sofaGroup.add(arm);
    });

    // Sofa Tapered Walnut Legs
    [[-1.1, -0.3], [1.1, -0.3], [-1.1, 0.35], [1.1, 0.35]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.016, 0.28, 8), darkWalnutMat);
      leg.position.set(lx, 0.14, lz);
      sofaGroup.add(leg);
    });

    // 2 Lumbar Throw Pillows on Sofa
    [-0.7, 0.7].forEach((px) => {
      const pillow = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.26, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x926c48, roughness: 0.8 })
      );
      pillow.position.set(px, 0.54, 0.22);
      pillow.rotation.x = -0.15;
      sofaGroup.add(pillow);
    });
    lounge.add(sofaGroup);
    this.addCollider(-1.4, 1.4, 1.8 + 0.8, 1.8 + 2.0);

    // B. TWO DESIGNER ACCENT CLUB CHAIRS angled toward the table
    [-1.85, 1.85].forEach((cx, idx) => {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(cx, 0, 0);
      chairGroup.rotation.y = idx === 0 ? Math.PI / 2.5 : -Math.PI / 2.5;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.18, 0.72), chairFabricMat);
      seat.position.y = 0.38;
      seat.castShadow = true;
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.58, 0.16), chairFabricMat);
      back.position.set(0, 0.68, 0.32);
      back.castShadow = true;
      chairGroup.add(seat, back);

      [[-0.34, -0.28], [0.34, -0.28], [-0.34, 0.28], [0.34, 0.28]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.016, 0.32, 8), darkWalnutMat);
        leg.position.set(lx, 0.16, lz);
        chairGroup.add(leg);
      });
      lounge.add(chairGroup);
      this.addCollider(cx - 0.55, cx + 0.55, 1.8 - 0.55, 1.8 + 0.55);
    });

    // C. DUAL-TIER LUXURY COFFEE TABLE (Walnut lower tier + Black Marble upper tier)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, 0, 0);

    // Upper marble tier
    const topTier = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.04, 28), blackMarbleMat);
    topTier.position.set(0, 0.38, 0);
    topTier.castShadow = true;
    tableGroup.add(topTier);

    // Lower walnut tier
    const lowerTier = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.035, 24), darkWalnutMat);
    lowerTier.position.set(0.35, 0.22, 0.2);
    tableGroup.add(lowerTier);

    // Brass table legs
    for (let l = 0; l < 4; l++) {
      const angle = (l * Math.PI * 2) / 4;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.36, 8), brassMat);
      leg.position.set(Math.cos(angle) * 0.52, 0.18, Math.sin(angle) * 0.52);
      tableGroup.add(leg);
    }

    // Props on coffee table: Hardcover design monographs & ceramic bowl
    const mag1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.015, 0.32),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 })
    );
    mag1.position.set(-0.15, 0.41, 0.05);
    const mag2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.015, 0.28),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.6 })
    );
    mag2.position.set(-0.12, 0.425, 0.08);
    mag2.rotation.y = 0.2;
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.08, 0.06, 16),
      brassMat
    );
    bowl.position.set(0.22, 0.43, -0.1);
    tableGroup.add(mag1, mag2, bowl);
    lounge.add(tableGroup);
    this.addCollider(-0.75, 0.75, 1.8 - 0.75, 1.8 + 0.75);

    // D. SIDE TABLES WITH CERAMIC LAMPS on both sides of sofa
    [-1.65, 1.65].forEach((sx) => {
      const sTable = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.52, 16), darkWalnutMat);
      sTable.position.set(sx, 0.26, 1.4);
      sTable.castShadow = true;

      // Table lamp
      const lampBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.11, 0.22, 12),
        new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.2 })
      );
      lampBase.position.set(sx, 0.63, 1.4);
      const lampShade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 0.18, 16, 1, true),
        new THREE.MeshStandardMaterial({ color: 0xfff7ed, roughness: 0.9, side: THREE.DoubleSide })
      );
      lampShade.position.set(sx, 0.82, 1.4);
      lounge.add(sTable, lampBase, lampShade);
      this.addCollider(sx - 0.35, sx + 0.35, 1.8 + 1.4 - 0.35, 1.8 + 1.4 + 0.35);
    });

    // E. TWO UPHOLSTERED ROUND OTTOMANS / STOOLS
    [-0.65, 0.65].forEach((ox) => {
      const stool = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.34, 16),
        new THREE.MeshStandardMaterial({ color: 0x926c48, roughness: 0.85 })
      );
      stool.position.set(ox, 0.17, -0.9);
      stool.castShadow = true;
      lounge.add(stool);
      this.addCollider(ox - 0.3, ox + 0.3, 1.8 - 0.9 - 0.3, 1.8 - 0.9 + 0.3);
    });

    // F. MODERN SCULPTURAL CHANDELIER (Suspended over central lounge from ceiling y=5.0)
    const chDrop = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.6, 8), brassMat);
    chDrop.position.set(0, 4.2, 0);
    const chRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.022, 8, 32), brassMat);
    chRing1.rotation.x = Math.PI / 2;
    chRing1.position.set(0, 3.4, 0);
    const chRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 8, 24), brassMat);
    chRing2.rotation.x = Math.PI / 2;
    chRing2.position.set(0, 3.25, 0);

    const chLight1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.008, 6, 32),
      new THREE.MeshBasicMaterial({ color: 0xfff3d6 })
    );
    chLight1.rotation.x = Math.PI / 2;
    chLight1.position.set(0, 3.4, 0);

    const chLight2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.008, 6, 24),
      new THREE.MeshBasicMaterial({ color: 0xfff3d6 })
    );
    chLight2.rotation.x = Math.PI / 2;
    chLight2.position.set(0, 3.25, 0);
    lounge.add(chDrop, chRing1, chRing2, chLight1, chLight2);

    this.group.add(lounge);
  }

  // 11. SECONDARY DECOR & ENVIRONMENTAL STORYTELLING (Eliminating All Empty Corners)
  private buildSecondaryDecor() {
    const darkWalnutMat = new THREE.MeshStandardMaterial({ color: 0x362115, roughness: 0.5 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.18 });

    // 1. OVERSIZED MECHANICAL KEYBOARD KEYCAP SCULPTURE on Museum Pedestal (X = -2.8, Z = -5.0)
    const keyGroup = new THREE.Group();
    keyGroup.position.set(-2.8, 0, -5.0);

    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.9, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x14161b, roughness: 0.25, metalness: 0.85 })
    );
    plinth.position.y = 0.45;
    plinth.castShadow = true;
    keyGroup.add(plinth);

    // Sculpted giant mechanical keycap (slanted sides, dished top)
    const keyCapGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.20, 4);
    const keyCapMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9, // Electric developer cyan
      roughness: 0.25,
      metalness: 0.15
    });
    const keyCap = new THREE.Mesh(keyCapGeo, keyCapMat);
    keyCap.position.y = 1.0;
    keyCap.rotation.y = Math.PI / 4;
    keyGroup.add(keyCap);

    // Glowing key legend texture
    const keyCanvas = document.createElement('canvas');
    keyCanvas.width = 256;
    keyCanvas.height = 256;
    const kCtx = keyCanvas.getContext('2d')!;
    kCtx.fillStyle = '#0ea5e9';
    kCtx.fillRect(0, 0, 256, 256);
    kCtx.fillStyle = '#ffffff';
    kCtx.textAlign = 'center';
    kCtx.textBaseline = 'middle';
    kCtx.font = 'bold 110px "JetBrains Mono", monospace';
    kCtx.fillText('</>', 128, 128);
    const keyTex = new THREE.CanvasTexture(keyCanvas);
    keyTex.colorSpace = THREE.SRGBColorSpace;

    const legendPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.28),
      new THREE.MeshBasicMaterial({ map: keyTex })
    );
    legendPlane.rotation.x = -Math.PI / 2;
    legendPlane.position.y = 1.102;
    keyGroup.add(legendPlane);

    this.group.add(keyGroup);
    this.addCollider(-3.2, -2.4, -5.4, -4.6);

    // 2. LUXURY BRASS CELESTIAL ASTROLABE / GLOBE on Tripod Pedestal (X = 2.8, Z = -5.0)
    const globeGroup = new THREE.Group();
    globeGroup.position.set(2.8, 0, -5.0);

    const tripodBase = new THREE.Group();
    for (let t = 0; t < 3; t++) {
      const angle = (t * Math.PI * 2) / 3;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.015, 0.95, 8), darkWalnutMat);
      leg.position.set(Math.cos(angle) * 0.25, 0.45, Math.sin(angle) * 0.25);
      leg.rotation.x = 0.15;
      leg.rotation.y = -angle;
      tripodBase.add(leg);
    }
    globeGroup.add(tripodBase);

    // Brass armillary rings & celestial sphere
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.016, 8, 24), brassMat);
    ring1.position.y = 1.12;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.014, 8, 24), brassMat);
    ring2.position.y = 1.12;
    ring2.rotation.x = Math.PI / 3;
    const centerGlobe = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.6 })
    );
    centerGlobe.position.y = 1.12;
    globeGroup.add(ring1, ring2, centerGlobe);

    this.group.add(globeGroup);
    this.addCollider(2.4, 3.2, -5.4, -4.6);

    // 3. CURATED DESIGNER ARCHITECTURAL BOOKSHELF (Left Wall, Z = -5.5)
    const bookshelf = new THREE.Group();
    bookshelf.position.set(-6.6, 0, -5.5);

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdde4ec, metalness: 0.95, roughness: 0.15 });

    // Open-back dark walnut architectural frame with side risers
    const sideRiserGeo = new THREE.BoxGeometry(0.48, 3.6, 0.06);
    const leftRiser = new THREE.Mesh(sideRiserGeo, darkWalnutMat);
    leftRiser.position.set(0, 1.8, -0.95);
    leftRiser.castShadow = true;
    const rightRiser = new THREE.Mesh(sideRiserGeo, darkWalnutMat);
    rightRiser.position.set(0, 1.8, 0.95);
    rightRiser.castShadow = true;
    bookshelf.add(leftRiser, rightRiser);

    // 5 Solid Dark Walnut Shelves with Warm LED Underglow
    const shelfLevels = [0.15, 0.85, 1.65, 2.45, 3.25];
    shelfLevels.forEach((sy) => {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.045, 1.9), darkWalnutMat);
      plank.position.set(0, sy, 0);
      plank.castShadow = true;
      plank.receiveShadow = true;

      // Concealed Warm LED Strip beneath shelf
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.012, 1.8),
        new THREE.MeshBasicMaterial({ color: 0xfef3c7 })
      );
      led.position.set(0.12, sy - 0.026, 0);
      bookshelf.add(plank, led);
    });

    // Top Header Board
    const topCap = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.06, 2.0), darkWalnutMat);
    topCap.position.set(0, 3.62, 0);
    bookshelf.add(topCap);

    // ── SHELF 1 (y=0.15): Heavy CS & Systems Architecture Reference Books ──
    const shelf1Books = [
      { w: 0.055, h: 0.32, col: 0x991b1b, t: 'TYPESCRIPT' },
      { w: 0.065, h: 0.35, col: 0x1e3a8a, t: 'ALGORITHMS' },
      { w: 0.045, h: 0.28, col: 0x065f46, t: 'DISTRIBUTED' },
      { w: 0.075, h: 0.34, col: 0x4338ca, t: 'SYSTEMS ARCH' },
      { w: 0.050, h: 0.30, col: 0xd97706, t: 'THREE.JS / WEBGL' },
      { w: 0.060, h: 0.33, col: 0x334155, t: 'AI & NEURAL NETS' }
    ];

    let bookZ = -0.75;
    shelf1Books.forEach((b) => {
      const bookMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, b.h, b.w),
        new THREE.MeshStandardMaterial({ color: b.col, roughness: 0.75 })
      );
      bookMesh.position.set(0.04, 0.17 + b.h / 2, bookZ + b.w / 2);
      bookMesh.castShadow = true;
      bookshelf.add(bookMesh);
      bookZ += b.w + 0.018;
    });

    // ── SHELF 2 (y=0.85): Miniature Globe on Brass Gimbal + Leaning Design Books ──
    // Miniature Globe
    const globeStand = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8), brassMat);
    globeStand.position.set(0.06, 0.95, -0.55);
    const globeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16), brassMat);
    globeBase.position.set(0.06, 0.88, -0.55);
    const globeGimbal = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.010, 8, 20), brassMat);
    globeGimbal.position.set(0.06, 1.05, -0.55);
    globeGimbal.rotation.y = Math.PI / 4;
    const miniGlobeSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.5 })
    );
    miniGlobeSphere.position.set(0.06, 1.05, -0.55);
    bookshelf.add(globeStand, globeBase, globeGimbal, miniGlobeSphere);

    // Leaning Design Books on Shelf 2
    for (let db = 0; db < 4; db++) {
      const dBook = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.28, 0.048),
        new THREE.MeshStandardMaterial({ color: [0xc026d3, 0x0284c7, 0x059669, 0xf59e0b][db], roughness: 0.7 })
      );
      dBook.position.set(0.05, 1.02, 0.10 + db * 0.06);
      dBook.rotation.z = db === 3 ? 0.22 : 0;
      bookshelf.add(dBook);
    }

    // Heavy Geometric Brass Bookend
    const bookEnd = new THREE.Mesh(new THREE.DodecahedronGeometry(0.065), brassMat);
    bookEnd.position.set(0.06, 0.94, 0.38);
    bookshelf.add(bookEnd);

    // ── SHELF 3 (y=1.65): Miniature Robot Collectible & Glass Prism Octahedron ──
    const miniRobot = new THREE.Group();
    miniRobot.position.set(0.06, 1.68, -0.45);
    const rBody = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.07), chromeMat);
    rBody.position.y = 0.12;
    const rHead = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 0.065), chromeMat);
    rHead.position.y = 0.22;
    const rVisor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.015), new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
    rVisor.position.set(0, 0.22, 0.035);
    const rLegs = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, 0.05), darkWalnutMat);
    rLegs.position.y = 0.04;
    miniRobot.add(rBody, rHead, rVisor, rLegs);
    bookshelf.add(miniRobot);

    // Glass Prism Octahedron
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1,
      ior: 1.55
    });
    const prism = new THREE.Mesh(new THREE.OctahedronGeometry(0.085), prismMat);
    prism.position.set(0.06, 1.76, 0.25);
    bookshelf.add(prism);

    // ── SHELF 4 (y=2.45): Tech Competition Awards & Trophies ──
    const awardCup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.02, 0.16, 12), brassMat);
    awardCup.position.set(0.06, 2.58, -0.35);
    const cupBase = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.035, 0.09), darkWalnutMat);
    cupBase.position.set(0.06, 2.49, -0.35);
    bookshelf.add(awardCup, cupBase);

    const setuObelisk = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.22, 4), chromeMat);
    setuObelisk.position.set(0.06, 2.58, 0.35);
    bookshelf.add(setuObelisk);

    // ── SHELF 5 (Top, y=3.25): Succulent Ceramic Planter & Polished Sphere ──
    const potMat = new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.3 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.10, 16), potMat);
    pot.position.set(0.06, 3.32, -0.45);
    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.08), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 }));
    foliage.position.set(0.06, 3.42, -0.45);
    bookshelf.add(pot, foliage);

    const brassSphere = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), brassMat);
    brassSphere.position.set(0.06, 3.34, 0.35);
    bookshelf.add(brassSphere);

    this.group.add(bookshelf);
    this.addCollider(-7.0, -6.1, -6.6, -4.4);

    // 4. CORNER PLANTERS WITH TALL FICUS / KENTIA PALMS (Eliminating Corner Emptiness)
    const plantLocations = [
      { x: -6.0, z: -9.0 },
      { x: 6.0, z: -9.0 },
      { x: -6.0, z: 8.8 }
    ];

    plantLocations.forEach((loc) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(loc.x, 0, loc.z);

      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.26, 0.68, 16),
        new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 0.35 })
      );
      pot.position.y = 0.34;
      pot.castShadow = true;
      pGroup.add(pot);

      // Gold rim
      const potRim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.02, 8, 24), brassMat);
      potRim.rotation.x = Math.PI / 2;
      potRim.position.y = 0.68;
      pGroup.add(potRim);

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.065, 1.8, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 })
      );
      stem.position.y = 1.35;
      pGroup.add(stem);

      for (let l = 0; l < 14; l++) {
        const leaf = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, 0.018, 0.26),
          new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.85 })
        );
        const ly = 0.95 + l * 0.16;
        const angle = (l * Math.PI * 2) / 5.2;
        leaf.position.set(Math.cos(angle) * 0.25, ly, Math.sin(angle) * 0.25);
        leaf.rotation.set(0.35, angle, -0.25);
        leaf.castShadow = true;
        pGroup.add(leaf);
      }
      this.group.add(pGroup);
      this.addCollider(loc.x - 0.55, loc.x + 0.55, loc.z - 0.55, loc.z + 0.55);
    });

    // 5. ARCHITECTURAL ARC FLOOR LAMP (X = -2.7, Z = 2.2)
    const arcLamp = new THREE.Group();
    arcLamp.position.set(-2.7, 0, 2.2);

    const fBase = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 16), brassMat);
    fBase.position.y = 0.025;

    // Curved sweeping pole
    const arcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1.6, 0),
      new THREE.Vector3(0.3, 2.3, 0),
      new THREE.Vector3(0.9, 2.5, 0)
    ]);
    const poleGeo = new THREE.TubeGeometry(arcCurve, 20, 0.02, 8, false);
    const poleMesh = new THREE.Mesh(poleGeo, brassMat);

    const fShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.32, 0.32, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9, side: THREE.DoubleSide })
    );
    fShade.position.set(0.9, 2.3, 0);

    const fBulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffedd5 }));
    fBulb.position.set(0.9, 2.3, 0);

    arcLamp.add(fBase, poleMesh, fShade, fBulb);
    this.group.add(arcLamp);
    this.addCollider(-3.0, -2.4, 1.9, 2.5);
  }

  // 12. CONTINUOUS LUXURY ENTRANCE CORRIDOR (Z = 10.0 to 24.0, X = -1.9 to 1.9, Y = 0 to 4.2)
  private buildCorridor(renderer?: THREE.WebGLRenderer) {
    const corridorGroup = new THREE.Group();

    const floorTexture = createWoodFloorTexture(renderer);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.32,
      metalness: 0.08
    });

    const wallPlasterMat = new THREE.MeshStandardMaterial({
      color: 0x1b1d24, // Warm luxury dark slate plaster
      roughness: 0.88,
      metalness: 0.04
    });

    const darkWalnutMat = new THREE.MeshStandardMaterial({
      color: 0x362115,
      roughness: 0.4,
      metalness: 0.08
    });

    const brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x14161c,
      roughness: 0.9
    });

    // 1. CORRIDOR FLOOR (Seamlessly connects to room floor at Z = 10)
    const floorGeo = new THREE.PlaneGeometry(3.8, 14.0);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, 17.0);
    floorMesh.receiveShadow = true;
    corridorGroup.add(floorMesh);

    // Ceremonial Runner Rug along corridor (Z = 10.5 to 23.5)
    const runnerTexture = createRunnerRugTexture(renderer);
    const runnerGeo = new THREE.PlaneGeometry(2.0, 13.0);
    const runnerMat = new THREE.MeshStandardMaterial({
      map: runnerTexture,
      roughness: 0.92,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    const runnerMesh = new THREE.Mesh(runnerGeo, runnerMat);
    runnerMesh.rotation.x = -Math.PI / 2;
    runnerMesh.position.set(0, 0.015, 17.0);
    runnerMesh.receiveShadow = true;
    corridorGroup.add(runnerMesh);

    // Linear warm LED floor ribbon channels flanking the runner rug
    [-1.75, 1.75].forEach((lx) => {
      const ledFloorRibbon = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.012, 13.8),
        new THREE.MeshBasicMaterial({ color: 0xffedd5 })
      );
      ledFloorRibbon.position.set(lx, 0.006, 17.0);
      corridorGroup.add(ledFloorRibbon);
    });

    // Baseboards along corridor
    const skirtingH = 0.22;
    const skirtL = new THREE.Mesh(new THREE.BoxGeometry(0.06, skirtingH, 14.0), darkWalnutMat);
    skirtL.position.set(-1.87, skirtingH / 2, 17.0);
    const skirtR = new THREE.Mesh(new THREE.BoxGeometry(0.06, skirtingH, 14.0), darkWalnutMat);
    skirtR.position.set(1.87, skirtingH / 2, 17.0);
    const skirtBack = new THREE.Mesh(new THREE.BoxGeometry(3.8, skirtingH, 0.06), darkWalnutMat);
    skirtBack.position.set(0, skirtingH / 2, 23.97);
    corridorGroup.add(skirtL, skirtR, skirtBack);

    // 2. CORRIDOR CEILING & COFFERED BEAMS (Y = 4.2)
    const ceilGeo = new THREE.PlaneGeometry(3.8, 14.0);
    const ceilMesh = new THREE.Mesh(ceilGeo, ceilingMat);
    ceilMesh.rotation.x = Math.PI / 2;
    ceilMesh.position.set(0, 4.2, 17.0);
    corridorGroup.add(ceilMesh);

    // Cross beams with recessed puck spotlights
    [12.0, 15.0, 18.0, 21.0, 23.5].forEach((bz) => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.2, 0.25), darkWalnutMat);
      beam.position.set(0, 4.1, bz);
      corridorGroup.add(beam);

      // Recessed brass spotlight
      const spotPuck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 0.06, 12),
        brassTrimMat
      );
      spotPuck.position.set(0, 3.98, bz);

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffedd5 })
      );
      bulb.position.set(0, 3.96, bz);
      corridorGroup.add(spotPuck, bulb);
    });

    // 3. LEFT & RIGHT CORRIDOR WALLS (Vertical Acoustic Walnut Slats + Embedded LEDs)
    [-1.9, 1.9].forEach((wx, sideIdx) => {
      const wallMesh = new THREE.Mesh(new THREE.PlaneGeometry(14.0, 4.2), wallPlasterMat);
      wallMesh.rotation.y = sideIdx === 0 ? Math.PI / 2 : -Math.PI / 2;
      wallMesh.position.set(wx, 2.1, 17.0);
      wallMesh.receiveShadow = true;
      corridorGroup.add(wallMesh);

      // Vertical acoustic walnut slats with concealed warm LED channels
      for (let sz = 10.6; sz <= 23.4; sz += 0.35) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.05, 4.15, 0.12), darkWalnutMat);
        slat.position.set(sideIdx === 0 ? -1.86 : 1.86, 2.1, sz);
        corridorGroup.add(slat);

        if (Math.round((sz - 10.6) / 0.35) % 3 === 0) {
          const ledStrip = new THREE.Mesh(
            new THREE.BoxGeometry(0.015, 3.8, 0.02),
            new THREE.MeshBasicMaterial({ color: 0xffe6c2 })
          );
          ledStrip.position.set(sideIdx === 0 ? -1.85 : 1.85, 2.1, sz + 0.16);
          corridorGroup.add(ledStrip);
        }
      }

      // Architectural brass dual-cone wall sconces
      [13.0, 16.0, 19.0, 22.0].forEach((sz) => {
        const sconceArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.06), darkWalnutMat);
        sconceArm.position.set(sideIdx === 0 ? -1.82 : 1.82, 2.3, sz);
        const sconceCone = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.10, 0.28, 12),
          brassTrimMat
        );
        sconceCone.position.set(sideIdx === 0 ? -1.74 : 1.74, 2.3, sz);
        const sLight = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xfff0dd })
        );
        sLight.position.set(sideIdx === 0 ? -1.74 : 1.74, 2.3, sz);
        corridorGroup.add(sconceArm, sconceCone, sLight);
      });
    });

    // 4. FRAMED GALLERY ARTWORK DISPLAYS ALONG CORRIDOR WALLS
    // 3 Posters on Left Wall, 3 Posters on Right Wall
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x121418, roughness: 0.3, metalness: 0.85 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.05,
      metalness: 0.9,
      depthWrite: false
    });

    const posterPositions = [
      { x: -1.86, z: 14.5, rotY: Math.PI / 2, idx: 0 },
      { x: -1.86, z: 17.5, rotY: Math.PI / 2, idx: 1 },
      { x: -1.86, z: 20.5, rotY: Math.PI / 2, idx: 2 },
      { x: 1.86, z: 14.5, rotY: -Math.PI / 2, idx: 3 },
      { x: 1.86, z: 17.5, rotY: -Math.PI / 2, idx: 4 },
      { x: 1.86, z: 20.5, rotY: -Math.PI / 2, idx: 5 }
    ];

    posterPositions.forEach((pos) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(pos.x, 2.3, pos.z);
      pGroup.rotation.y = pos.rotY;

      // Frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.8, 0.06), frameMat);
      frame.castShadow = true;

      // Canvas poster
      const posterTex = createCorridorPosterTexture(pos.idx);
      const posterMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.18, 1.68),
        new THREE.MeshBasicMaterial({ map: posterTex })
      );
      posterMesh.position.z = 0.032;

      // Glass reflection
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 1.68), glassMat);
      glass.position.z = 0.034;

      // Overhead slim brass picture light
      const picArm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8), brassTrimMat);
      picArm.position.set(0, 0.96, 0.08);
      picArm.rotation.x = Math.PI / 3;
      const picHead = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 12), brassTrimMat);
      picHead.position.set(0, 1.02, 0.14);
      picHead.rotation.z = Math.PI / 2;
      const picBulb = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.015, 0.02),
        new THREE.MeshBasicMaterial({ color: 0xffeedd })
      );
      picBulb.position.set(0, 1.01, 0.14);

      pGroup.add(frame, posterMesh, glass, picArm, picHead, picBulb);
      corridorGroup.add(pGroup);
    });

    // 5. CORRIDOR BACK WALL (Z = 24.0, Starting Point Background)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 4.2), wallPlasterMat);
    backWall.position.set(0, 2.1, 24.0);
    backWall.rotation.y = Math.PI;
    corridorGroup.add(backWall);

    // Architectural Layered Wood & Brass Feature on Back Wall
    const backPanel = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 3.6, 0.08),
      darkWalnutMat
    );
    backPanel.position.set(0, 2.1, 23.94);
    corridorGroup.add(backPanel);

    // Transom identity header plate on back wall
    const plaqueCanvas = document.createElement('canvas');
    plaqueCanvas.width = 512;
    plaqueCanvas.height = 160;
    const pCtx = plaqueCanvas.getContext('2d')!;
    pCtx.fillStyle = '#101218';
    pCtx.fillRect(0, 0, 512, 160);
    pCtx.strokeStyle = '#d4af37';
    pCtx.lineWidth = 4;
    pCtx.strokeRect(10, 10, 492, 140);
    pCtx.textAlign = 'center';
    pCtx.fillStyle = '#ffffff';
    pCtx.font = 'bold 26px "Cabinet Grotesk", sans-serif';
    pCtx.fillText('AYUSH SINGH', 256, 55);
    pCtx.fillStyle = '#38bdf8';
    pCtx.font = 'bold 16px "Cabinet Grotesk", sans-serif';
    pCtx.fillText('THE DIGITAL UNIVERSE', 256, 88);
    pCtx.fillStyle = '#f59e0b';
    pCtx.font = '12px "JetBrains Mono", monospace';
    pCtx.fillText('// SECTOR 00 • ENTRY VESTIBULE //', 256, 120);
    const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
    plaqueTex.colorSpace = THREE.SRGBColorSpace;

    const plaqueMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.75),
      new THREE.MeshBasicMaterial({ map: plaqueTex })
    );
    plaqueMesh.rotation.y = Math.PI;
    plaqueMesh.position.set(0, 2.6, 23.88);
    corridorGroup.add(plaqueMesh);

    // Flanking decorative potted plants on pedestals at corridor entry
    [-1.3, 1.3].forEach((px) => {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.4), darkWalnutMat);
      plinth.position.set(px, 0.4, 23.5);
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.35, 12), brassTrimMat);
      pot.position.set(px, 0.95, 23.5);
      const plant = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.2),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
      );
      plant.position.set(px, 1.2, 23.5);
      corridorGroup.add(plinth, pot, plant);
      this.addCollider(px - 0.3, px + 0.3, 23.1, 23.9);
    });

    this.group.add(corridorGroup);
  }

  // 13. AUTOMATIC DOUBLE ENTRANCE GATE AT THRESHOLD (Z = 10.0)
  private buildAutomaticDoubleGate() {
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 10.0);

    const darkWalnutMat = new THREE.MeshStandardMaterial({
      color: 0x2e1a10,
      roughness: 0.4,
      metalness: 0.1
    });

    const bronzeFrameMat = new THREE.MeshStandardMaterial({
      color: 0x16181f,
      metalness: 0.85,
      roughness: 0.25
    });

    const brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18
    });

    const frostedGlassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
      roughness: 0.2,
      metalness: 0.8
    });

    // 1. MASTER PORTAL CASING & LINTEL
    const casingL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 3.4, 0.35), bronzeFrameMat);
    casingL.position.set(-1.42, 1.7, 0);
    const casingR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 3.4, 0.35), bronzeFrameMat);
    casingR.position.set(1.42, 1.7, 0);
    const casingTop = new THREE.Mesh(new THREE.BoxGeometry(3.08, 0.28, 0.35), bronzeFrameMat);
    casingTop.position.set(0, 3.4, 0);
    gateGroup.add(casingL, casingR, casingTop);

    // Transom identity header plate facing the corridor (+Z)
    const transomTex = createGateTransomTexture();
    const transomSign = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 0.7),
      new THREE.MeshBasicMaterial({ map: transomTex })
    );
    transomSign.position.set(0, 3.82, 0.18);
    gateGroup.add(transomSign);

    // Studio-side Welcome Header facing into main room (-Z)
    const welcomeTex = createWelcomeSignTexture();
    const studioWelcomeSign = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 0.7),
      new THREE.MeshBasicMaterial({ map: welcomeTex })
    );
    studioWelcomeSign.position.set(0, 3.82, -0.18);
    studioWelcomeSign.rotation.y = Math.PI;
    gateGroup.add(studioWelcomeSign);

    // 2. STATUS INDICATOR LIGHT BAR (Above the door seam at Y = 3.25)
    // Amber = Closed, Emerald/Cyan = Access Granted / Open
    this.doorStatusMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const statusLightBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.05, 0.06),
      this.doorStatusMat
    );
    statusLightBar.position.set(0, 3.26, 0.18);
    this.doorStatusMesh = statusLightBar;
    gateGroup.add(statusLightBar);

    // 3. ARTICULATED LEFT DOOR ASSEMBLY (Hinge at X = -1.35, Z = 10.0)
    this.leftDoorHinge = new THREE.Group();
    this.leftDoorHinge.position.set(-1.35, 0, 0);

    // Left Door Panel (width 1.34m, height 3.12m, thickness 0.08m)
    // Local center at x = +0.67 so that its outer edge aligns with hinge at x = 0
    const lPanelGroup = new THREE.Group();
    lPanelGroup.position.set(0.67, 1.56, 0);

    const lPanelMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.34, 3.12, 0.08),
      darkWalnutMat
    );
    lPanelMesh.castShadow = true;
    lPanelMesh.receiveShadow = true;

    // Brass perimeter border trim
    const lBorder = new THREE.Mesh(
      new THREE.BoxGeometry(1.36, 3.14, 0.02),
      brassTrimMat
    );
    lBorder.position.z = 0.042;

    // Vertical frosted glass vision slit with subtle cyan glow
    const lGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 2.2, 0.09),
      frostedGlassMat
    );
    lGlass.position.set(0.35, 0.05, 0);

    // Vertical polished brass pull handles on both sides
    const lHandleFront = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 1.2, 12),
      brassTrimMat
    );
    lHandleFront.position.set(0.55, -0.1, 0.08);
    const lHandleBack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 1.2, 12),
      brassTrimMat
    );
    lHandleBack.position.set(0.55, -0.1, -0.08);

    lPanelGroup.add(lPanelMesh, lBorder, lGlass, lHandleFront, lHandleBack);
    this.leftDoorHinge.add(lPanelGroup);
    gateGroup.add(this.leftDoorHinge);

    // 4. ARTICULATED RIGHT DOOR ASSEMBLY (Hinge at X = +1.35, Z = 10.0)
    this.rightDoorHinge = new THREE.Group();
    this.rightDoorHinge.position.set(1.35, 0, 0);

    // Right Door Panel (width 1.34m, height 3.12m, thickness 0.08m)
    // Local center at x = -0.67 so that its outer edge aligns with hinge at x = 0
    const rPanelGroup = new THREE.Group();
    rPanelGroup.position.set(-0.67, 1.56, 0);

    const rPanelMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.34, 3.12, 0.08),
      darkWalnutMat
    );
    rPanelMesh.castShadow = true;
    rPanelMesh.receiveShadow = true;

    // Brass perimeter border trim
    const rBorder = new THREE.Mesh(
      new THREE.BoxGeometry(1.36, 3.14, 0.02),
      brassTrimMat
    );
    rBorder.position.z = 0.042;

    // Vertical frosted glass vision slit
    const rGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 2.2, 0.09),
      frostedGlassMat
    );
    rGlass.position.set(-0.35, 0.05, 0);

    // Vertical polished brass pull handles
    const rHandleFront = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 1.2, 12),
      brassTrimMat
    );
    rHandleFront.position.set(-0.55, -0.1, 0.08);
    const rHandleBack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 1.2, 12),
      brassTrimMat
    );
    rHandleBack.position.set(-0.55, -0.1, -0.08);

    rPanelGroup.add(rPanelMesh, rBorder, rGlass, rHandleFront, rHandleBack);
    this.rightDoorHinge.add(rPanelGroup);
    gateGroup.add(this.rightDoorHinge);

    this.group.add(gateGroup);
  }

  /**
   * Synchronously animates both door panels around their respective hinges
   * Returns whether a state transition occurred (for triggering sound effects)
   */
  public updateDoors(delta: number, shouldOpen: boolean): { stateChanged: boolean; opened: boolean } {
    this.targetDoorRatio = shouldOpen ? 1.0 : 0.0;
    const prevRatio = this.doorOpenRatio;

    // Smooth mechanical damping
    this.doorOpenRatio = THREE.MathUtils.damp(this.doorOpenRatio, this.targetDoorRatio, 3.2, delta);

    // Max rotation is ~85 degrees (Math.PI * 0.47)
    const maxAngle = Math.PI * 0.47;

    // Left door swings inward towards studio wall (-Z / -X)
    this.leftDoorHinge.rotation.y = this.doorOpenRatio * maxAngle;
    // Right door swings inward towards studio wall (-Z / +X)
    this.rightDoorHinge.rotation.y = -this.doorOpenRatio * maxAngle;

    // Interpolate status indicator light color (amber -> emerald)
    if (this.doorStatusMat) {
      this.doorStatusMat.color.lerpColors(
        new THREE.Color(0xf59e0b), // Amber (Standby / Closed)
        new THREE.Color(0x10b981), // Emerald (Access Granted / Open)
        this.doorOpenRatio
      );
    }

    const wasOpen = this.isGateOpen;
    this.isGateOpen = this.doorOpenRatio > 0.25;

    let stateChanged = false;
    let opened = false;

    if (!wasOpen && this.isGateOpen) {
      stateChanged = true;
      opened = true;
    } else if (wasOpen && !this.isGateOpen && this.doorOpenRatio < 0.15) {
      stateChanged = true;
      opened = false;
    }

    return { stateChanged, opened };
  }
}
