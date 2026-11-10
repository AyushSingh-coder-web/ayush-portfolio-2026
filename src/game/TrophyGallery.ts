import * as THREE from 'three';
import {
  createHallOfFameHeaderTexture,
  createAchievementPlaqueTexture
} from '../utils/proceduralTextures';

export interface TrophyHallResult {
  group: THREE.Group;
  interactiveMesh: THREE.Object3D;
}

/**
 * GRAND TROPHY HALL & HALL OF FAME
 * Right Wall (Zone 4 Achievements: X = 6.92, Z = -1.5)
 * 
 * Features:
 * - 10 distinct, large-scale, composite 3D trophies (championship cup, silver obelisk, crystal rhombus,
 *   golden star, abstract Möbius ribbon, titanium/gold pylon, victory wings, crystal medallion,
 *   silver/gold urn, geometric glass monoliths)
 * - Stepped multi-level architectural showcase in dark walnut, brushed graphite, and brass with LED underglow
 * - Grand Hall of Fame feature wall with metallic paneling, illuminated header, central Nexora emblem,
 *   vertical LED strips, and 4 verified achievement plaques (Prompt Run #4, Setu 2026 #7, Frontend Arena #11, haX.baby #16)
 */
export function buildGrandTrophyHall(renderer?: THREE.WebGLRenderer): TrophyHallResult {
  const root = new THREE.Group();
  root.position.set(6.92, 0, -1.5);

  // Shared Master Materials
  const darkWalnutMat = new THREE.MeshStandardMaterial({ color: 0x2e1a10, roughness: 0.4, metalness: 0.1 });
  const graphiteMat = new THREE.MeshStandardMaterial({ color: 0x16181f, roughness: 0.35, metalness: 0.88 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
  const titaniumBlackMat = new THREE.MeshStandardMaterial({ color: 0x181a20, metalness: 0.9, roughness: 0.25 });
  const warmLedMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
  const goldLedMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const cyanLedMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });

  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xeff6ff,
    transmission: 0.92,
    opacity: 0.95,
    transparent: true,
    roughness: 0.05,
    metalness: 0.1,
    ior: 1.58,
    thickness: 1.2
  });

  const cyanCrystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transmission: 0.85,
    opacity: 0.9,
    transparent: true,
    roughness: 0.08,
    metalness: 0.2,
    ior: 1.52
  });

  // ─────────────────────────────────────────────────────────────
  // 1. HALL OF FAME ARCHITECTURAL WALL BACKDROP (X = 0, facing -X into room)
  // ─────────────────────────────────────────────────────────────
  const wallGroup = new THREE.Group();
  wallGroup.position.set(0, 0, 0);

  // Large metallic feature wall panel (5.4m wide x 4.6m high)
  const wallBackdrop = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 4.6, 5.4),
    new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.82, metalness: 0.2 })
  );
  wallBackdrop.position.set(-0.04, 2.3, 0);
  wallGroup.add(wallBackdrop);

  // Architectural graphite grid panels
  for (let z = -2.4; z <= 2.4; z += 1.2) {
    const gridRib = new THREE.Mesh(new THREE.BoxGeometry(0.09, 4.5, 0.04), graphiteMat);
    gridRib.position.set(-0.04, 2.3, z);
    wallGroup.add(gridRib);
  }

  // Vertical LED strips accenting each bay
  [-1.8, -0.6, 0.6, 1.8].forEach((z) => {
    const vLed = new THREE.Mesh(new THREE.BoxGeometry(0.012, 4.4, 0.02), goldLedMat);
    vLed.position.set(-0.09, 2.3, z);
    wallGroup.add(vLed);
  });

  // Grand Hall of Fame Illuminated Header Signboard (Top Center)
  const headerTex = createHallOfFameHeaderTexture(renderer);
  const headerMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 1.3),
    new THREE.MeshBasicMaterial({ map: headerTex })
  );
  headerMesh.rotation.y = -Math.PI / 2;
  headerMesh.position.set(-0.10, 3.75, 0);
  wallGroup.add(headerMesh);

  // Header Frame Casing with Cyan Accent Lighting
  const headerFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 1.36, 4.46),
    new THREE.MeshStandardMaterial({ color: 0x1e2430, metalness: 0.85, roughness: 0.25 })
  );
  headerFrame.position.set(-0.08, 3.75, 0);

  const headerCyanBezel = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 1.38, 4.48),
    cyanLedMat
  );
  headerCyanBezel.position.set(-0.095, 3.75, 0);
  wallGroup.add(headerFrame, headerCyanBezel);

  // ─────────────────────────────────────────────────────────────
  // 2. FOUR VERIFIED ACHIEVEMENT PLAQUES ON WALL (Left & Right Flanks)
  // ─────────────────────────────────────────────────────────────
  // 2 Plaques on Left Flank (Z = -1.9, Z = -1.25), 2 Plaques on Right Flank (Z = +1.25, Z = +1.9)
  const plaqueConfigs = [
    { z: -1.9, y: 2.3, idx: 0 }, // PROMPT RUN #4
    { z: -1.0, y: 2.3, idx: 1 }, // SETU 2026 #7
    { z: 1.0, y: 2.3, idx: 2 },  // FRONTEND ARENA #11
    { z: 1.9, y: 2.3, idx: 3 }   // haX.baby #16
  ];

  plaqueConfigs.forEach((cfg) => {
    const pGroup = new THREE.Group();
    pGroup.position.set(-0.11, cfg.y, cfg.z);

    // Frame
    const pFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.76, 0.94),
      new THREE.MeshStandardMaterial({ color: 0x1a1e26, metalness: 0.9, roughness: 0.2 })
    );
    // Gold inner bevel
    const pGoldBezel = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.74, 0.92), goldMat);
    pGoldBezel.position.x = -0.01;

    // Plaque Texture
    const pTex = createAchievementPlaqueTexture(cfg.idx, renderer);
    const pMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.88, 0.70),
      new THREE.MeshBasicMaterial({ map: pTex })
    );
    pMesh.rotation.y = -Math.PI / 2;
    pMesh.position.x = -0.022;

    // Glass reflection overlay
    const pGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.88, 0.70),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
        roughness: 0.05,
        metalness: 0.95,
        depthWrite: false
      })
    );
    pGlass.rotation.y = -Math.PI / 2;
    pGlass.position.x = -0.024;

    pGroup.add(pFrame, pGoldBezel, pMesh, pGlass);
    wallGroup.add(pGroup);
  });

  root.add(wallGroup);

  // ─────────────────────────────────────────────────────────────
  // 3. GRAND MULTI-TIERED SHOWCASE PEDESTAL PLATFORM
  // ─────────────────────────────────────────────────────────────
  const baseShowcase = new THREE.Group();
  baseShowcase.position.set(-0.55, 0, 0);

  // Main Low Credenza Base (4.8m wide x 0.85m deep x 0.65m high)
  const mainBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 4.8), darkWalnutMat);
  mainBase.position.y = 0.325;
  mainBase.castShadow = true;
  mainBase.receiveShadow = true;

  // Graphite Plinth Footer
  const baseFooter = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.06, 4.84), graphiteMat);
  baseFooter.position.y = 0.03;

  // Polished Brass Top Inlay Border
  const baseTopBrass = new THREE.Mesh(new THREE.BoxGeometry(0.87, 0.02, 4.82), goldMat);
  baseTopBrass.position.y = 0.65;

  // Warm LED Floor Wash beneath the credenza
  const floorLed = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.015, 4.7), warmLedMat);
  floorLed.position.y = 0.01;

  baseShowcase.add(mainBase, baseFooter, baseTopBrass, floorLed);

  // Stepped Elevated Display Podiums on Top of the Base (Y = 0.65 to 1.15)
  // Center Grand Podium: Elevated to Y = 0.85
  const centerPodium = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.22, 1.1),
    titaniumBlackMat
  );
  centerPodium.position.set(0, 0.76, 0);
  const centerPodiumRim = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.015, 1.12), goldMat);
  centerPodiumRim.position.set(0, 0.87, 0);
  baseShowcase.add(centerPodium, centerPodiumRim);

  // Mid-Left & Mid-Right Tier Podiums (Y = 0.76)
  [-1.3, 1.3].forEach((pz) => {
    const tier = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.12, 1.05), graphiteMat);
    tier.position.set(0, 0.71, pz);
    const tierRim = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.012, 1.07), goldMat);
    tierRim.position.set(0, 0.77, pz);
    baseShowcase.add(tier, tierRim);
  });

  // Upper Floating Tempered Glass Shelf (Y = 1.65, Length 4.6m)
  const upperShelf = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.025, 4.6),
    crystalMat
  );
  upperShelf.position.set(0, 1.65, 0);

  // Brass Front Rail & Concealed LED Underglow
  const shelfBrassRail = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.025, 4.62), goldMat);
  shelfBrassRail.position.set(-0.28, 1.65, 0);
  const shelfLed = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.012, 4.5), goldLedMat);
  shelfLed.position.set(-0.15, 1.635, 0);
  baseShowcase.add(upperShelf, shelfBrassRail, shelfLed);

  // Architectural Vitrine Overhead Canopy (Y = 2.95) with Focused Spotlights
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 4.8), darkWalnutMat);
  canopy.position.set(0, 2.95, 0);

  // 6 Recessed Brass Downlight Puck Spotlights in Canopy
  [-1.8, -1.1, -0.4, 0.4, 1.1, 1.8].forEach((sz) => {
    const puck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.065, 0.03, 12), goldMat);
    puck.position.set(-0.1, 2.88, sz);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), goldLedMat);
    bulb.position.set(-0.1, 2.87, sz);
    baseShowcase.add(puck, bulb);
  });

  // Flanking Slender Bronze Architectural Pillars
  [-2.35, 2.35].forEach((pz) => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.3, 0.08), graphiteMat);
    pillar.position.set(-0.38, 1.8, pz);
    const pCap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.12), goldMat);
    pCap.position.set(-0.38, 2.93, pz);
    const pBase = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.12), goldMat);
    pBase.position.set(-0.38, 0.67, pz);
    baseShowcase.add(pillar, pCap, pBase);
  });

  root.add(baseShowcase);

  // Helper for trophy pedestal plinths
  function createTrophyBase(width: number, depth: number, height: number, material: THREE.Material = titaniumBlackMat): THREE.Group {
    const bGroup = new THREE.Group();
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    bMesh.position.y = height / 2;
    bMesh.castShadow = true;
    const rim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.015, 0.01, depth + 0.015), goldMat);
    rim.position.y = height;
    bGroup.add(bMesh, rim);
    return bGroup;
  }

  // ─────────────────────────────────────────────────────────────
  // 4. THE 10 LARGE DIVERSE PHYSICAL TROPHIES
  // ─────────────────────────────────────────────────────────────

  // ═════════════════════════════════════════════════════════════
  // TROPHY 1: GRAND GOLDEN CHAMPIONSHIP CUP (Premier Centerpiece)
  // Center Podium (X = -0.55, Y = 0.88, Z = 0)
  // ═════════════════════════════════════════════════════════════
  const t1 = new THREE.Group();
  t1.position.set(-0.55, 0.88, 0);

  // Multi-tier stepped black obsidian & gold pedestal
  const t1Base1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.36), titaniumBlackMat);
  t1Base1.position.y = 0.03;
  const t1GoldPlinth = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.32), goldMat);
  t1GoldPlinth.position.y = 0.07;
  const t1Base2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.07, 0.28), titaniumBlackMat);
  t1Base2.position.y = 0.115;
  t1.add(t1Base1, t1GoldPlinth, t1Base2);

  // Engraved gold achievement plaque on pedestal front face
  const t1Plaque = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.04), goldMat);
  t1Plaque.rotation.y = -Math.PI / 2;
  t1Plaque.position.set(-0.142, 0.115, 0);
  t1.add(t1Plaque);

  // Fluted baluster foot and decorative collar
  const t1Foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.05, 20), goldMat);
  t1Foot.position.y = 0.175;
  const t1Stem = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.052, 0.14, 16), goldMat);
  t1Stem.position.y = 0.265;
  const t1Collar = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 8, 20), goldMat);
  t1Collar.position.y = 0.335;
  t1.add(t1Foot, t1Stem, t1Collar);

  // Deep spherical chalice bowl
  const t1Bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.07, 0.26, 24), goldMat);
  t1Bowl.position.y = 0.46;
  t1Bowl.castShadow = true;
  const t1BowlRim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.014, 8, 28), goldMat);
  t1BowlRim.position.y = 0.59;
  t1.add(t1Bowl, t1BowlRim);

  // Two Sweeping High-Arching Curved Filigree Handles
  [-1, 1].forEach((dir) => {
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.39, dir * 0.10),
      new THREE.Vector3(0, 0.46, dir * 0.26),
      new THREE.Vector3(0, 0.61, dir * 0.25),
      new THREE.Vector3(0, 0.58, dir * 0.17)
    ]);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 20, 0.016, 8, false);
    const handleMesh = new THREE.Mesh(handleGeo, goldMat);
    t1.add(handleMesh);
  });

  // Domed Victory Lid & Crowning 8-Pointed Star Finial
  const t1Lid = new THREE.Mesh(new THREE.SphereGeometry(0.175, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2.2), goldMat);
  t1Lid.position.y = 0.59;
  const t1LidKnob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), goldMat);
  t1LidKnob.position.y = 0.69;
  const t1Star = new THREE.Mesh(new THREE.OctahedronGeometry(0.055), goldMat);
  t1Star.position.y = 0.76;
  t1Star.rotation.y = Math.PI / 4;
  t1.add(t1Lid, t1LidKnob, t1Star);

  root.add(t1);

  // ═════════════════════════════════════════════════════════════
  // TROPHY 2: ELEGANT SILVER STREAMLINED OBELISK TROPHY
  // Mid-Left Tier (X = -0.55, Y = 0.78, Z = -1.3)
  // ═════════════════════════════════════════════════════════════
  const t2 = new THREE.Group();
  t2.position.set(-0.55, 0.78, -1.3);

  const t2Base = createTrophyBase(0.28, 0.28, 0.09, graphiteMat);
  t2.add(t2Base);

  // Tapering faceted 4-sided mirror-silver obelisk
  const t2Pillar = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.52, 4), silverMat);
  t2Pillar.position.y = 0.35;
  t2Pillar.rotation.y = Math.PI / 4;
  t2Pillar.castShadow = true;

  // Interlocking polished chrome chevron blades spiraling up
  for (let c = 0; c < 3; c++) {
    const chev = new THREE.Mesh(new THREE.TorusGeometry(0.075 - c * 0.015, 0.009, 6, 4), silverMat);
    chev.position.y = 0.22 + c * 0.12;
    chev.rotation.x = Math.PI / 4;
    chev.rotation.y = (c * Math.PI) / 3;
    t2.add(chev);
  }

  // High-shine rhodium silver sphere finial
  const t2Sphere = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), silverMat);
  t2Sphere.position.y = 0.63;
  t2.add(t2Pillar, t2Sphere);

  root.add(t2);

  // ═════════════════════════════════════════════════════════════
  // TROPHY 3: TRANSPARENT MONOLITHIC CRYSTAL AWARD
  // Mid-Right Tier (X = -0.55, Y = 0.78, Z = +1.3)
  // ═════════════════════════════════════════════════════════════
  const t3 = new THREE.Group();
  t3.position.set(-0.55, 0.78, 1.3);

  const t3Base = createTrophyBase(0.28, 0.28, 0.08, titaniumBlackMat);
  t3.add(t3Base);

  // Tall monolithic beveled crystal rhombus with transmission & refraction
  const t3Crystal = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.54, 6), crystalMat);
  t3Crystal.position.y = 0.35;
  t3Crystal.castShadow = true;

  // Internal laser-etched geometric fractal core
  const t3Core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.045),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  t3Core.position.y = 0.32;

  // Gold floating accent ring
  const t3Ring = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.012, 8, 24), goldMat);
  t3Ring.position.y = 0.32;
  t3Ring.rotation.x = Math.PI / 3.5;

  t3.add(t3Crystal, t3Core, t3Ring);
  root.add(t3);

  // ═════════════════════════════════════════════════════════════
  // TROPHY 4: MULTI-POINT GOLDEN STARBURST AWARD
  // Lower Left Bay (X = -0.55, Y = 0.67, Z = -2.0)
  // ═════════════════════════════════════════════════════════════
  const t4 = new THREE.Group();
  t4.position.set(-0.55, 0.67, -2.0);

  const t4Base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.08, 16), titaniumBlackMat);
  t4Base.position.y = 0.04;
  const t4BaseRim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.01, 8, 20), goldMat);
  t4BaseRim.position.y = 0.08;
  t4.add(t4Base, t4BaseRim);

  // Sweeping brass spiral riser
  const spiralCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.08, 0),
    new THREE.Vector3(0.03, 0.18, 0.03),
    new THREE.Vector3(-0.03, 0.28, -0.03),
    new THREE.Vector3(0, 0.38, 0)
  ]);
  const spiralMesh = new THREE.Mesh(new THREE.TubeGeometry(spiralCurve, 20, 0.015, 8, false), goldMat);
  t4.add(spiralMesh);

  // Bold 3D extruded multi-pointed golden star
  const t4Star = new THREE.Mesh(new THREE.DodecahedronGeometry(0.095), goldMat);
  t4Star.position.y = 0.44;
  t4Star.scale.set(1.0, 1.2, 0.4);
  t4Star.castShadow = true;
  t4.add(t4Star);

  root.add(t4);

  // ═════════════════════════════════════════════════════════════
  // TROPHY 5: FUTURISTIC ABSTRACT MÖBIUS SCULPTURE
  // Lower Right Bay (X = -0.55, Y = 0.67, Z = +2.0)
  // ═════════════════════════════════════════════════════════════
  const t5 = new THREE.Group();
  t5.position.set(-0.55, 0.67, 2.0);

  const t5Base = createTrophyBase(0.24, 0.24, 0.08, darkWalnutMat);
  t5.add(t5Base);

  // Continuous sweeping metallic ribbon in high-gloss blue-titanium
  const t5Mat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    metalness: 0.95,
    roughness: 0.15
  });
  const mobiusTorus1 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 12, 32), t5Mat);
  mobiusTorus1.position.y = 0.28;
  mobiusTorus1.rotation.set(0.6, 0.4, 0);

  const mobiusTorus2 = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.018, 12, 32), goldMat);
  mobiusTorus2.position.y = 0.28;
  mobiusTorus2.rotation.set(-0.4, -0.6, 0);

  // Floating chrome core
  const t5Core = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), silverMat);
  t5Core.position.y = 0.28;

  t5.add(mobiusTorus1, mobiusTorus2, t5Core);
  root.add(t5);

  // ═════════════════════════════════════════════════════════════
  // TROPHY 6: TALL BLACK TITANIUM AND GOLD MONOLITH
  // Upper Shelf Left (X = -0.55, Y = 1.68, Z = -1.6)
  // ═════════════════════════════════════════════════════════════
  const t6 = new THREE.Group();
  t6.position.set(-0.55, 1.68, -1.6);

  const t6Base = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.06, 0.20), titaniumBlackMat);
  t6Base.position.y = 0.03;
  t6.add(t6Base);

  // Monolithic tall triangular pylon in matte black titanium
  const t6Pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.065, 0.38, 3), titaniumBlackMat);
  t6Pylon.position.y = 0.22;
  t6Pylon.castShadow = true;

  // Inlaid vertical luminous gold channels
  const t6GoldSpine = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.36, 0.015), goldMat);
  t6GoldSpine.position.set(0, 0.22, 0.035);
  const t6GoldCap = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.06, 3), goldMat);
  t6GoldCap.position.y = 0.44;

  t6.add(t6Pylon, t6GoldSpine, t6GoldCap);
  root.add(t6);

  // ═════════════════════════════════════════════════════════════
  // TROPHY 7: WING-INSPIRED METALLIC TROPHY (Victory Wings)
  // Upper Shelf Right (X = -0.55, Y = 1.68, Z = +1.6)
  // ═════════════════════════════════════════════════════════════
  const t7 = new THREE.Group();
  t7.position.set(-0.55, 1.68, 1.6);

  const t7Base = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.11, 0.06, 16), graphiteMat);
  t7Base.position.y = 0.03;
  t7.add(t7Base);

  // Pair of sweeping curved sculpted wing blades in lustrous warm gold
  [-1, 1].forEach((dir) => {
    const wingCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.06, dir * 0.02),
      new THREE.Vector3(0, 0.16, dir * 0.07),
      new THREE.Vector3(0, 0.30, dir * 0.11),
      new THREE.Vector3(0, 0.42, dir * 0.09)
    ]);
    const wingMesh = new THREE.Mesh(new THREE.TubeGeometry(wingCurve, 16, 0.016, 8, false), goldMat);
    wingMesh.scale.set(1.0, 1.0, 0.4);
    t7.add(wingMesh);
  });

  // Central golden flame torch nestled between the wingtips
  const t7Torch = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.16, 8), goldMat);
  t7Torch.position.y = 0.20;
  const t7Flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b })
  );
  t7Flame.position.y = 0.30;

  t7.add(t7Torch, t7Flame);
  root.add(t7);

  // ═════════════════════════════════════════════════════════════
  // TROPHY 8: PREMIUM CIRCULAR CRYSTAL MEDALLION
  // Upper Shelf Center (X = -0.55, Y = 1.68, Z = 0)
  // ═════════════════════════════════════════════════════════════
  const t8 = new THREE.Group();
  t8.position.set(-0.55, 1.68, 0);

  const t8Base = createTrophyBase(0.24, 0.18, 0.06, darkWalnutMat);
  t8.add(t8Base);

  // Brass cradle bracket
  const t8Bracket = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.12, 0.18), goldMat);
  t8Bracket.position.set(0, 0.10, 0);
  t8.add(t8Bracket);

  // Large circular beveled crystal medallion
  const t8Disc = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.022, 32), crystalMat);
  t8Disc.rotation.z = Math.PI / 2;
  t8Disc.position.y = 0.24;
  t8Disc.castShadow = true;

  // Concentric frosted gold center emblem
  const t8Emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.026, 16), goldMat);
  t8Emblem.rotation.z = Math.PI / 2;
  t8Emblem.position.y = 0.24;

  const t8StarCenter = new THREE.Mesh(new THREE.OctahedronGeometry(0.035), cyanLedMat);
  t8StarCenter.position.y = 0.24;

  t8.add(t8Disc, t8Emblem, t8StarCenter);
  root.add(t8);

  // ═════════════════════════════════════════════════════════════
  // TROPHY 9: DUAL-TONE SILVER & GOLD ACHIEVEMENT CUP
  // Upper Shelf Mid-Left (X = -0.55, Y = 1.68, Z = -0.8)
  // ═════════════════════════════════════════════════════════════
  const t9 = new THREE.Group();
  t9.position.set(-0.55, 1.68, -0.8);

  const t9Base = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.10, 0.05, 16), titaniumBlackMat);
  t9Base.position.y = 0.025;
  const t9BaseRing = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.008, 8, 20), goldMat);
  t9BaseRing.position.y = 0.05;
  t9.add(t9Base, t9BaseRing);

  // Fluted gold foot & stem
  const t9Stem = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.045, 0.10, 12), goldMat);
  t9Stem.position.y = 0.10;
  t9.add(t9Stem);

  // High-polish mirror silver urn body with gold rim
  const t9Cup = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.045, 0.18, 20), silverMat);
  t9Cup.position.y = 0.22;
  const t9GoldLip = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.010, 8, 24), goldMat);
  t9GoldLip.position.y = 0.31;
  t9.add(t9Cup, t9GoldLip);

  // Dual braided handles
  [-1, 1].forEach((dir) => {
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 6, 16, Math.PI * 1.3), goldMat);
    handle.position.set(0, 0.24, dir * 0.11);
    handle.rotation.x = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
    t9.add(handle);
  });
  root.add(t9);

  // ═════════════════════════════════════════════════════════════
  // TROPHY 10: UNIQUE GEOMETRIC GLASS MONOLITHS
  // Upper Shelf Mid-Right (X = -0.55, Y = 1.68, Z = +0.8)
  // ═════════════════════════════════════════════════════════════
  const t10 = new THREE.Group();
  t10.position.set(-0.55, 1.68, 0.8);

  const t10Base = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.18), goldMat);
  t10Base.position.y = 0.02;
  t10.add(t10Base);

  // Trio of staggered crystalline glass monoliths
  const monoHeights = [0.28, 0.36, 0.22];
  const monoPositions = [-0.05, 0, 0.05];
  monoHeights.forEach((mh, idx) => {
    const mono = new THREE.Mesh(new THREE.BoxGeometry(0.045, mh, 0.045), cyanCrystalMat);
    mono.position.set(0, 0.04 + mh / 2, monoPositions[idx]);
    mono.rotation.y = (idx * Math.PI) / 6;
    mono.castShadow = true;
    t10.add(mono);
  });
  root.add(t10);

  return {
    group: root,
    interactiveMesh: mainBase
  };
}
