import * as THREE from 'three';
import { createLandmarkPlaqueTexture } from '../utils/proceduralTextures';

/**
 * WORLD LANDMARK MINIATURE GALLERY
 * Entrance Gate Shelves & Credenza (Front Wall Right Section, Z = 9.92, X = +4.2)
 * 
 * Features 8 recognizable architectural landmarks:
 * 1. Eiffel Tower (Paris) — Dark forged iron lattice, arched base, double platforms, high spire
 * 2. Taj Mahal (Agra) — Luminous white marble, onion dome, 4 corner minarets, central iwan arches
 * 3. Qutub Minar (Delhi) — Tapering fluted sandstone tower with bracketed balconies and banded stages
 * 4. Leaning Tower of Pisa (Pisa) — 4.5-degree tilted cylinder with 6 tiered column arcades and belfry
 * 5. Statue of Liberty (NYC) — Patina copper draped figure, 7-ray radiate crown, raised torch, tablet
 * 6. Big Ben (London) — Gothic limestone tower, 4 illuminated clock dials, belfry, pinnacled spire
 * 7. Giza Pyramids (Egypt) — Trio of limestone pyramids with Khafre's preserved apex casing
 * 8. Roman Colosseum (Rome) — Travertine ellipse with 3 tiers of arcades, ruined outer wall, cavea steps
 * 
 * Plus curated decorative objects: modern skyscraper, desk globe, Möbius ribbon, folio books, glass prism, spacecraft
 */
export function buildWorldLandmarkGallery(renderer?: THREE.WebGLRenderer): THREE.Group {
  const root = new THREE.Group();
  root.position.set(4.2, 0, 9.92);
  root.rotation.y = Math.PI;

  // Shared Master Materials
  const darkWalnutMat = new THREE.MeshStandardMaterial({ color: 0x362115, roughness: 0.4, metalness: 0.08 });
  const graphiteMat = new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.35, metalness: 0.85 });
  const polishedBrassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.18 });
  const warmLedMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
  const cyanLedMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });

  // ─────────────────────────────────────────────────────────────
  // 1. ARCHITECTURAL WALL BACKDROP & ACOUSTIC VERTICAL SLATS
  // ─────────────────────────────────────────────────────────────
  const backPanel = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 5.0, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x13151b, roughness: 0.85 })
  );
  backPanel.position.set(0, 2.5, 0);
  root.add(backPanel);

  // Deep graphite vertical acoustic slats with tasteful walnut accents & LED strips
  for (let s = -2.25; s <= 2.25; s += 0.25) {
    const isWalnutAccent = Math.abs(Math.round(s * 4)) % 4 === 0;
    const slatMat = isWalnutAccent ? darkWalnutMat : graphiteMat;
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.10, 5.0, 0.04), slatMat);
    slat.position.set(s, 2.5, 0.04);
    root.add(slat);

    if (Math.round((s + 2.25) / 0.25) % 2 === 0) {
      const ledColor = isWalnutAccent ? 0xffe8cc : 0x06b6d4;
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.015, 4.8, 0.01),
        new THREE.MeshBasicMaterial({ color: ledColor })
      );
      led.position.set(s + 0.125, 2.5, 0.035);
      root.add(led);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. MID-CENTURY WALNUT CREDENZA (Base Showcase Surface)
  // ─────────────────────────────────────────────────────────────
  const credenza = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.88, 0.72), darkWalnutMat);
  credenza.position.set(0, 0.44, 0.42);
  credenza.castShadow = true;
  credenza.receiveShadow = true;

  // Credenza brass perimeter trim & plinth
  const credenzaPlinth = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.08, 0.68), graphiteMat);
  credenzaPlinth.position.set(0, 0.04, 0.42);
  const credenzaTopTrim = new THREE.Mesh(new THREE.BoxGeometry(4.24, 0.02, 0.74), polishedBrassMat);
  credenzaTopTrim.position.set(0, 0.88, 0.42);

  // Four tambour sliding door front panels with brass vertical pulls
  [-1.4, -0.47, 0.47, 1.4].forEach((dx) => {
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.72, 0.02), darkWalnutMat);
    door.position.set(dx, 0.46, 0.785);
    const pull = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 8), polishedBrassMat);
    pull.position.set(dx + (dx < 0 ? 0.35 : -0.35), 0.46, 0.805);
    root.add(door, pull);
  });
  root.add(credenza, credenzaPlinth, credenzaTopTrim);

  // ─────────────────────────────────────────────────────────────
  // 3. THREE FLOATING SHELVES WITH CONCEALED WARM LED LIGHTING
  // ─────────────────────────────────────────────────────────────
  const shelfHeights = [1.75, 2.55, 3.35];
  shelfHeights.forEach((sy) => {
    // Solid dark walnut floating plank
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.065, 0.42), darkWalnutMat);
    shelf.position.set(0, sy, 0.24);
    shelf.castShadow = true;
    shelf.receiveShadow = true;

    // Brass front lip trim
    const shelfLip = new THREE.Mesh(new THREE.BoxGeometry(4.22, 0.025, 0.015), polishedBrassMat);
    shelfLip.position.set(0, sy, 0.452);

    // Concealed LED underglow ribbon
    const underLed = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.012, 0.02), warmLedMat);
    underLed.position.set(0, sy - 0.035, 0.24);

    // Graphite cantilever wall brackets
    [-1.6, -0.6, 0.6, 1.6].forEach((bx) => {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.38), graphiteMat);
      bracket.position.set(bx, sy - 0.07, 0.22);
      root.add(bracket);
    });

    root.add(shelf, shelfLip, underLed);
  });

  // Helper: Create a dedicated museum display plinth with engraved brass nameplate
  function createDisplayPlinth(width: number, depth: number, height: number, landmarkName: string, location: string): THREE.Group {
    const pGroup = new THREE.Group();
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.3, metalness: 0.8 });
    const plinthMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), plinthMat);
    plinthMesh.position.y = height / 2;
    plinthMesh.castShadow = true;
    plinthMesh.receiveShadow = true;
    pGroup.add(plinthMesh);

    // Brass perimeter accent rim
    const rim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.015, 0.012, depth + 0.015), polishedBrassMat);
    rim.position.y = height;
    pGroup.add(rim);

    // Engraved brass nameplate attached to front face
    const plateTex = createLandmarkPlaqueTexture(landmarkName, location, renderer);
    const plateMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(Math.min(width * 0.85, 0.24), 0.045),
      new THREE.MeshBasicMaterial({ map: plateTex })
    );
    plateMesh.position.set(0, height * 0.55, depth / 2 + 0.002);
    pGroup.add(plateMesh);

    return pGroup;
  }

  // ─────────────────────────────────────────────────────────────
  // 4. LANDMARK 1: TAJ MAHAL (AGRA, INDIA)
  // Placed on Credenza Center-Left (X = -0.9, Y = 0.90, Z = 0.44)
  // ─────────────────────────────────────────────────────────────
  const tajGroup = new THREE.Group();
  tajGroup.position.set(-0.95, 0.89, 0.42);

  const whiteMarbleMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.22,
    metalness: 0.08
  });
  const marbleDetailMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.35,
    metalness: 0.05
  });

  const tajPlinth = createDisplayPlinth(0.44, 0.44, 0.04, 'Taj Mahal', 'Agra, India');
  tajGroup.add(tajPlinth);

  // Stepped square marble foundation terrace
  const tajTerrace = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.025, 0.38), whiteMarbleMat);
  tajTerrace.position.y = 0.052;
  tajGroup.add(tajTerrace);

  // Main octagonal tomb block (width 0.22, depth 0.22, height 0.16)
  const tombBody = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.22), whiteMarbleMat);
  tombBody.position.y = 0.145;
  tombBody.castShadow = true;
  tajGroup.add(tombBody);

  // Grand Recessed Pointed Arch (Iwan) on front facade
  const iwanFrame = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, 0.02), marbleDetailMat);
  iwanFrame.position.set(0, 0.14, 0.105);
  const iwanRecess = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.10, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 })
  );
  iwanRecess.position.set(0, 0.135, 0.11);
  tajGroup.add(iwanFrame, iwanRecess);

  // Central cylindrical drum
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.05, 16), whiteMarbleMat);
  drum.position.y = 0.25;
  tajGroup.add(drum);

  // Soaring bulbous onion dome
  const onionDome = new THREE.Mesh(new THREE.SphereGeometry(0.078, 18, 18), whiteMarbleMat);
  onionDome.position.y = 0.31;
  onionDome.scale.set(1.0, 1.25, 1.0);
  const tajFinial = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.012, 0.06, 8), polishedBrassMat);
  tajFinial.position.y = 0.42;
  tajGroup.add(onionDome, tajFinial);

  // 4 Side Chattris (Domed cupolas flanking the dome)
  [
    [-0.075, -0.075],
    [0.075, -0.075],
    [-0.075, 0.075],
    [0.075, 0.075]
  ].forEach(([cx, cz]) => {
    const chattriCol = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.04, 6), whiteMarbleMat);
    chattriCol.position.set(cx, 0.245, cz);
    const chattriDome = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), whiteMarbleMat);
    chattriDome.position.set(cx, 0.27, cz);
    tajGroup.add(chattriCol, chattriDome);
  });

  // 4 Freestanding Three-Tier Corner Minarets
  [
    [-0.165, -0.165],
    [0.165, -0.165],
    [-0.165, 0.165],
    [0.165, 0.165]
  ].forEach(([mx, mz]) => {
    const minaret = new THREE.Group();
    minaret.position.set(mx, 0.065, mz);

    // Multi-tier tapering shaft
    const shaft1 = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.016, 0.11, 10), whiteMarbleMat);
    shaft1.position.y = 0.055;
    const balcony1 = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.01, 10), marbleDetailMat);
    balcony1.position.y = 0.11;

    const shaft2 = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.012, 0.09, 10), whiteMarbleMat);
    shaft2.position.y = 0.155;
    const balcony2 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.008, 10), marbleDetailMat);
    balcony2.position.y = 0.20;

    const topCupola = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 8), whiteMarbleMat);
    topCupola.position.y = 0.22;
    const mFinial = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.004, 0.02, 6), polishedBrassMat);
    mFinial.position.y = 0.24;

    minaret.add(shaft1, balcony1, shaft2, balcony2, topCupola, mFinial);
    tajGroup.add(minaret);
  });
  root.add(tajGroup);

  // ─────────────────────────────────────────────────────────────
  // 5. LANDMARK 2: ROMAN COLOSSEUM (ROME, ITALY)
  // Placed on Credenza Center-Right (X = +0.95, Y = 0.89, Z = 0.42)
  // ─────────────────────────────────────────────────────────────
  const colosseumGroup = new THREE.Group();
  colosseumGroup.position.set(0.95, 0.89, 0.42);

  const travertineMat = new THREE.MeshStandardMaterial({
    color: 0xded2b9,
    roughness: 0.78,
    metalness: 0.08
  });
  const innerCaveaMat = new THREE.MeshStandardMaterial({
    color: 0xc8baa0,
    roughness: 0.85
  });

  const colPlinth = createDisplayPlinth(0.46, 0.38, 0.04, 'Colosseum', 'Rome, Italy');
  colosseumGroup.add(colPlinth);

  // Elliptical multi-tiered arena facade
  const colBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.03, 24), travertineMat);
  colBase.position.y = 0.055;
  colBase.scale.set(1.22, 1.0, 0.95);
  colosseumGroup.add(colBase);

  // Outer monumental arcaded wall (with characteristic broken rim)
  const numOuterPillars = 22;
  for (let p = 0; p < numOuterPillars; p++) {
    const angle = (p * Math.PI * 2) / numOuterPillars;
    // Broken silhouette: wall heights step down from 0.18m on the intact north side to 0.08m on south
    const heightFactor = Math.sin(angle) > -0.2 ? 1.0 : 0.52;
    const wallH = 0.17 * heightFactor;

    const px = Math.cos(angle) * 0.20 * 1.2;
    const pz = Math.sin(angle) * 0.20 * 0.95;

    const colPillar = new THREE.Mesh(new THREE.BoxGeometry(0.024, wallH, 0.03), travertineMat);
    colPillar.position.set(px, 0.07 + wallH / 2, pz);
    colPillar.rotation.y = -angle;
    colPillar.castShadow = true;

    // Cornice horizontal lintel connecting pillars
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.015, 0.025), travertineMat);
    lintel.position.set(px, 0.07 + wallH, pz);
    lintel.rotation.y = -angle;

    colosseumGroup.add(colPillar, lintel);
  }

  // Stepped inner spectator seating cavea
  for (let step = 0; step < 4; step++) {
    const radiusX = (0.15 - step * 0.028) * 1.2;
    const radiusZ = (0.15 - step * 0.028) * 0.95;
    const caveaRing = new THREE.Mesh(new THREE.CylinderGeometry(radiusX, radiusX, 0.022, 20), innerCaveaMat);
    caveaRing.position.y = 0.07 + step * 0.02;
    caveaRing.scale.set(1.0, 1.0, radiusZ / radiusX);
    colosseumGroup.add(caveaRing);
  }

  // Central hypogeum arena floor with subterranean wall ribs
  const arenaFloor = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.01, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 })
  );
  arenaFloor.position.set(0, 0.08, 0);
  colosseumGroup.add(arenaFloor);

  root.add(colosseumGroup);

  // ─────────────────────────────────────────────────────────────
  // 6. LANDMARK 3: EIFFEL TOWER (PARIS, FRANCE)
  // Placed on Shelf 1 Left (X = -1.2, Y = 1.75, Z = 0.24)
  // ─────────────────────────────────────────────────────────────
  const eiffelGroup = new THREE.Group();
  eiffelGroup.position.set(-1.25, 1.75, 0.24);

  const ironLatticeMat = new THREE.MeshStandardMaterial({
    color: 0x2e3540,
    metalness: 0.88,
    roughness: 0.35
  });

  const eiffelPlinth = createDisplayPlinth(0.32, 0.32, 0.035, 'Eiffel Tower', 'Paris, France');
  eiffelGroup.add(eiffelPlinth);

  // 4 Splayed curved lattice legs
  const legPositions = [
    [-0.10, -0.10, 0.25, -0.25],
    [0.10, -0.10, -0.25, -0.25],
    [-0.10, 0.10, 0.25, 0.25],
    [0.10, 0.10, -0.25, 0.25]
  ];
  legPositions.forEach(([lx, lz, rotX, rotZ]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.028, 0.18, 6), ironLatticeMat);
    leg.position.set(lx, 0.12, lz);
    leg.rotation.x = rotX;
    leg.rotation.z = rotZ;
    eiffelGroup.add(leg);
  });

  // Base decorative arch underneath
  const archRing = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.01, 6, 16, Math.PI), ironLatticeMat);
  archRing.position.set(0, 0.08, 0);
  eiffelGroup.add(archRing);

  // Platform 1 (First Deck with balustrade)
  const deck1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.18), ironLatticeMat);
  deck1.position.y = 0.20;
  eiffelGroup.add(deck1);

  // Middle tapering tower pyramid
  const midTower = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.16, 4), ironLatticeMat);
  midTower.position.y = 0.28;
  midTower.rotation.y = Math.PI / 4;
  eiffelGroup.add(midTower);

  // Platform 2 (Second Observation Deck)
  const deck2 = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.015, 0.11), ironLatticeMat);
  deck2.position.y = 0.36;
  eiffelGroup.add(deck2);

  // Slender soaring upper tower & needle spire
  const upperSpire = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.26, 4), ironLatticeMat);
  upperSpire.position.y = 0.49;
  upperSpire.rotation.y = Math.PI / 4;
  eiffelGroup.add(upperSpire);

  const domeCap = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), ironLatticeMat);
  domeCap.position.y = 0.62;
  const antennaNeedle = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.006, 0.12, 6), polishedBrassMat);
  antennaNeedle.position.y = 0.68;
  const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.005, 6, 6), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  beaconLight.position.y = 0.74;
  eiffelGroup.add(domeCap, antennaNeedle, beaconLight);

  root.add(eiffelGroup);

  // ─────────────────────────────────────────────────────────────
  // 7. LANDMARK 4: LEANING TOWER OF PISA (PISA, ITALY)
  // Placed on Shelf 1 Center (X = 0, Y = 1.75, Z = 0.24)
  // ─────────────────────────────────────────────────────────────
  const pisaGroup = new THREE.Group();
  pisaGroup.position.set(0, 1.75, 0.24);

  const pisaPlinth = createDisplayPlinth(0.28, 0.28, 0.035, 'Tower of Pisa', 'Pisa, Italy');
  pisaGroup.add(pisaPlinth);

  // Tilted assembly container: precisely tilted at ~4.5 degrees
  const tiltContainer = new THREE.Group();
  tiltContainer.position.set(0, 0.035, 0);
  tiltContainer.rotation.z = -0.078; // Authentic lean!

  const pisaMarbleMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.32,
    metalness: 0.1
  });

  // Base tier: solid cylinder with blind arches
  const pisaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.086, 0.08, 20), pisaMarbleMat);
  pisaBase.position.y = 0.04;
  tiltContainer.add(pisaBase);

  // 6 Open Columned Gallery Loggia levels
  for (let g = 0; g < 6; g++) {
    const gy = 0.08 + g * 0.048;
    // Inner wall cylinder
    const innerWall = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.048, 16), pisaMarbleMat);
    innerWall.position.y = gy + 0.024;
    tiltContainer.add(innerWall);

    // Outer colonnade: 12 slender pillars per gallery
    for (let c = 0; c < 12; c++) {
      const angle = (c * Math.PI * 2) / 12;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.046, 6), pisaMarbleMat);
      col.position.set(Math.cos(angle) * 0.078, gy + 0.023, Math.sin(angle) * 0.078);
      tiltContainer.add(col);
    }

    // Gallery floor cornice ring
    const cornice = new THREE.Mesh(new THREE.CylinderGeometry(0.084, 0.084, 0.008, 20), pisaMarbleMat);
    cornice.position.y = gy + 0.048;
    tiltContainer.add(cornice);
  }

  // Top Belfry (Bell Chamber)
  const belfry = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.06, 16), pisaMarbleMat);
  belfry.position.y = 0.40;
  const belfryBell = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.02, 8), polishedBrassMat);
  belfryBell.position.y = 0.40;
  tiltContainer.add(belfry, belfryBell);

  pisaGroup.add(tiltContainer);
  root.add(pisaGroup);

  // ─────────────────────────────────────────────────────────────
  // 8. LANDMARK 5: QUTUB MINAR (DELHI, INDIA)
  // Placed on Shelf 1 Right (X = +1.25, Y = 1.75, Z = 0.24)
  // ─────────────────────────────────────────────────────────────
  const qutubGroup = new THREE.Group();
  qutubGroup.position.set(1.25, 1.75, 0.24);

  const sandstoneRedMat = new THREE.MeshStandardMaterial({
    color: 0x9a3412,
    roughness: 0.85,
    metalness: 0.04
  });
  const marbleTopMat = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.4,
    metalness: 0.06
  });

  const qutubPlinth = createDisplayPlinth(0.28, 0.28, 0.035, 'Qutub Minar', 'Delhi, India');
  qutubGroup.add(qutubPlinth);

  // Stepped polygonal base
  const qBase = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.098, 0.04, 16), sandstoneRedMat);
  qBase.position.y = 0.055;
  qutubGroup.add(qBase);

  // Storey 1: Tapering fluted sandstone with alternating angular/round fluting
  const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.084, 0.16, 20), sandstoneRedMat);
  s1.position.y = 0.155;
  const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.072, 0.018, 20), sandstoneRedMat);
  b1.position.y = 0.24;
  qutubGroup.add(s1, b1);

  // Storey 2: Semicircular rounded flutings
  const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.066, 0.12, 16), sandstoneRedMat);
  s2.position.y = 0.31;
  const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.058, 0.015, 16), sandstoneRedMat);
  b2.position.y = 0.375;
  qutubGroup.add(s2, b2);

  // Storey 3: Angular flutings
  const s3 = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.052, 0.10, 14), sandstoneRedMat);
  s3.position.y = 0.43;
  const b3 = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.046, 0.012, 14), sandstoneRedMat);
  b3.position.y = 0.485;
  qutubGroup.add(s3, b3);

  // Storey 4 & 5: Banded white marble & red sandstone top stages
  const s4 = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.040, 0.08, 12), marbleTopMat);
  s4.position.y = 0.53;
  const s5 = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.030, 0.06, 12), sandstoneRedMat);
  s5.position.y = 0.60;
  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.020, 0.03, 8), marbleTopMat);
  lantern.position.y = 0.645;
  qutubGroup.add(s4, s5, lantern);

  root.add(qutubGroup);

  // ─────────────────────────────────────────────────────────────
  // 9. LANDMARK 6: BIG BEN / ELIZABETH TOWER (LONDON, UK)
  // Placed on Shelf 2 Left (X = -1.2, Y = 2.55, Z = 0.24)
  // ─────────────────────────────────────────────────────────────
  const bigBenGroup = new THREE.Group();
  bigBenGroup.position.set(-1.25, 2.55, 0.24);

  const limestoneMat = new THREE.MeshStandardMaterial({
    color: 0xd6c7a1,
    roughness: 0.62,
    metalness: 0.12
  });

  const benPlinth = createDisplayPlinth(0.26, 0.26, 0.035, 'Big Ben', 'London, UK');
  bigBenGroup.add(benPlinth);

  // Tower body with vertical buttresses
  const towerBody = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.28, 0.09), limestoneMat);
  towerBody.position.y = 0.175;
  bigBenGroup.add(towerBody);

  // 4 Corner Buttress Ribs
  [
    [-0.048, -0.048],
    [0.048, -0.048],
    [-0.048, 0.048],
    [0.048, 0.048]
  ].forEach(([bx, bz]) => {
    const buttress = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.28, 0.012), limestoneMat);
    buttress.position.set(bx, 0.175, bz);
    bigBenGroup.add(buttress);
  });

  // Clock Stage: 4 Protruding gables with circular clock faces
  const clockStage = new THREE.Mesh(new THREE.BoxGeometry(0.108, 0.08, 0.108), limestoneMat);
  clockStage.position.y = 0.355;
  bigBenGroup.add(clockStage);

  // 4 Illuminated Clock Dials
  const dialPositions = [
    { x: 0, z: 0.055, ry: 0 },
    { x: 0, z: -0.055, ry: Math.PI },
    { x: 0.055, z: 0, ry: Math.PI / 2 },
    { x: -0.055, z: 0, ry: -Math.PI / 2 }
  ];
  dialPositions.forEach((dp) => {
    const dial = new THREE.Mesh(
      new THREE.CircleGeometry(0.028, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    dial.position.set(dp.x, 0.355, dp.z);
    dial.rotation.y = dp.ry;

    // Outer gold dial bezel ring
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.003, 6, 16), polishedBrassMat);
    bezel.position.set(dp.x, 0.355, dp.z);
    bezel.rotation.y = dp.ry;

    // Clock hands
    const hand = new THREE.Mesh(
      new THREE.BoxGeometry(0.002, 0.02, 0.002),
      new THREE.MeshBasicMaterial({ color: 0x111111 })
    );
    hand.position.set(dp.x, 0.36, dp.z + (dp.z > 0 ? 0.002 : dp.z < 0 ? -0.002 : 0));
    bigBenGroup.add(dial, bezel, hand);
  });

  // Belfry level & Gothic Pyramidal Spire
  const belfryStage = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.05, 0.085), limestoneMat);
  belfryStage.position.y = 0.42;
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.18, 4), limestoneMat);
  spire.position.y = 0.535;
  spire.rotation.y = Math.PI / 4;
  const benSpireTop = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.006, 0.06, 6), polishedBrassMat);
  benSpireTop.position.y = 0.65;
  bigBenGroup.add(belfryStage, spire, benSpireTop);

  root.add(bigBenGroup);

  // ─────────────────────────────────────────────────────────────
  // 10. LANDMARK 7: STATUE OF LIBERTY (NEW YORK, USA)
  // Placed on Shelf 2 Center (X = 0, Y = 2.55, Z = 0.24)
  // ─────────────────────────────────────────────────────────────
  const libertyGroup = new THREE.Group();
  libertyGroup.position.set(0, 2.55, 0.24);

  const patinaCopperMat = new THREE.MeshStandardMaterial({
    color: 0x2dd4bf, // Iconic oxidized mint copper
    roughness: 0.68,
    metalness: 0.25
  });
  const granitePedestalMat = new THREE.MeshStandardMaterial({
    color: 0x78716c,
    roughness: 0.8
  });

  const libPlinth = createDisplayPlinth(0.26, 0.26, 0.035, 'Statue of Liberty', 'New York, USA');
  libertyGroup.add(libPlinth);

  // Fort Wood 11-Pointed Star Base
  const starBase = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.03, 11), granitePedestalMat);
  starBase.position.y = 0.05;
  libertyGroup.add(starBase);

  // Neoclassical Pedestal with classical cornices
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.08), granitePedestalMat);
  pedestal.position.y = 0.135;
  const pedBalcony = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.015, 0.095), granitePedestalMat);
  pedBalcony.position.y = 0.21;
  libertyGroup.add(pedestal, pedBalcony);

  // Draped Neoclassical Figure (Tunic & Robe)
  const figureBody = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.038, 0.16, 10), patinaCopperMat);
  figureBody.position.y = 0.295;
  figureBody.castShadow = true;

  // Head and 7-Ray Radiate Crown
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), patinaCopperMat);
  head.position.y = 0.385;

  for (let r = 0; r < 7; r++) {
    const rayAngle = -Math.PI / 2 + (r * Math.PI) / 6;
    const ray = new THREE.Mesh(new THREE.ConeGeometry(0.003, 0.02, 3), patinaCopperMat);
    ray.position.set(Math.cos(rayAngle) * 0.018, 0.395 + Math.sin(rayAngle) * 0.01, 0.004);
    ray.rotation.z = rayAngle - Math.PI / 2;
    libertyGroup.add(ray);
  }

  // Raised Right Arm Holding Golden Torch
  const torchArm = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.10, 6), patinaCopperMat);
  torchArm.position.set(0.028, 0.41, 0.01);
  torchArm.rotation.z = -0.35;

  const torchFlame = new THREE.Mesh(new THREE.ConeGeometry(0.009, 0.025, 6), polishedBrassMat);
  torchFlame.position.set(0.046, 0.47, 0.01);

  // Left Arm Holding Inscribed Tablet
  const tabletArm = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.028, 0.008), patinaCopperMat);
  tabletArm.position.set(-0.026, 0.32, 0.018);
  tabletArm.rotation.z = 0.2;

  libertyGroup.add(figureBody, head, torchArm, torchFlame, tabletArm);
  root.add(libertyGroup);

  // ─────────────────────────────────────────────────────────────
  // 11. LANDMARK 8: GIZA PYRAMIDS (GIZA, EGYPT)
  // Placed on Shelf 2 Right (X = +1.25, Y = 2.55, Z = 0.24)
  // ─────────────────────────────────────────────────────────────
  const pyramidGroup = new THREE.Group();
  pyramidGroup.position.set(1.25, 2.55, 0.24);

  const desertStoneMat = new THREE.MeshStandardMaterial({
    color: 0xd4a373,
    roughness: 0.88,
    metalness: 0.05
  });
  const turaLimestoneCapMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.35,
    metalness: 0.1
  });

  const pyrPlinth = createDisplayPlinth(0.38, 0.26, 0.035, 'Giza Pyramids', 'Giza, Egypt');
  pyramidGroup.add(pyrPlinth);

  // Desert Sand Base Plateau
  const sandBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.015, 0.22), desertStoneMat);
  sandBase.position.y = 0.042;
  pyramidGroup.add(sandBase);

  // 1. Great Pyramid of Khufu (Left)
  const khufu = new THREE.Mesh(new THREE.ConeGeometry(0.088, 0.13, 4), desertStoneMat);
  khufu.position.set(-0.08, 0.115, -0.02);
  khufu.rotation.y = Math.PI / 4;
  khufu.castShadow = true;

  // 2. Pyramid of Khafre (Center - with iconic preserved limestone cap at the apex!)
  const khafre = new THREE.Mesh(new THREE.ConeGeometry(0.082, 0.125, 4), desertStoneMat);
  khafre.position.set(0.04, 0.112, 0.01);
  khafre.rotation.y = Math.PI / 4;
  khafre.castShadow = true;

  const khafreCap = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.038, 4), turaLimestoneCapMat);
  khafreCap.position.set(0.04, 0.156, 0.01);
  khafreCap.rotation.y = Math.PI / 4;

  // 3. Pyramid of Menkaure (Right - smaller third pyramid)
  const menkaure = new THREE.Mesh(new THREE.ConeGeometry(0.052, 0.075, 4), desertStoneMat);
  menkaure.position.set(0.12, 0.088, 0.05);
  menkaure.rotation.y = Math.PI / 4;

  pyramidGroup.add(khufu, khafre, khafreCap, menkaure);
  root.add(pyramidGroup);

  // ─────────────────────────────────────────────────────────────
  // 12. CURATED MODERN ARTIFACTS ON TOP SHELF (Shelf 3, Y = 3.35)
  // ─────────────────────────────────────────────────────────────
  // A. Modern Glass & Steel Skyscraper Miniature (X = -1.2, Y = 3.35)
  const skyscraper = new THREE.Group();
  skyscraper.position.set(-1.25, 3.35, 0.24);

  const skyPlinth = createDisplayPlinth(0.24, 0.24, 0.03, 'Skyscraper Model', 'Modern Architecture');
  skyscraper.add(skyPlinth);

  const glassTowerMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transmission: 0.75,
    roughness: 0.1,
    metalness: 0.6,
    transparent: true,
    opacity: 0.85
  });
  const towerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.08), glassTowerMat);
  towerMesh.position.y = 0.19;
  const towerTruss = new THREE.Mesh(new THREE.BoxGeometry(0.084, 0.325, 0.084), graphiteMat);
  towerTruss.position.y = 0.19;
  // Slanted architectural cantilever crown
  const towerCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.04, 0.08, 4), polishedBrassMat);
  towerCrown.position.y = 0.39;
  towerCrown.rotation.y = Math.PI / 4;
  skyscraper.add(towerMesh, towerTruss, towerCrown);
  root.add(skyscraper);

  // B. Miniature Precision Desk Globe on Brass Gimbal (X = -0.4, Y = 3.35)
  const globeMini = new THREE.Group();
  globeMini.position.set(-0.4, 3.35, 0.24);
  const gBase = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 16), polishedBrassMat);
  gBase.position.y = 0.01;
  const gStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.14, 8), polishedBrassMat);
  gStem.position.y = 0.08;
  const gGimbal = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.009, 8, 20), polishedBrassMat);
  gGimbal.position.y = 0.16;
  gGimbal.rotation.y = Math.PI / 4;
  const gSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.35, metalness: 0.5 })
  );
  gSphere.position.y = 0.16;
  globeMini.add(gBase, gStem, gGimbal, gSphere);
  root.add(globeMini);

  // C. Optical Crystal Dispersion Prism (X = 0.4, Y = 3.35)
  const prismMini = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.075),
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transmission: 0.9,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95,
      ior: 1.6
    })
  );
  prismMini.position.set(0.4, 3.44, 0.24);
  root.add(prismMini);

  // D. Futuristic Aerospace Spacecraft Collectible (X = +1.25, Y = 3.35)
  const spacecraft = new THREE.Group();
  spacecraft.position.set(1.25, 3.35, 0.24);
  const sStand = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 12), graphiteMat);
  sStand.position.y = 0.01;
  const sRod = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.15, 8), polishedBrassMat);
  sRod.position.set(0, 0.085, 0);
  sRod.rotation.x = -0.2;

  const shipHull = new THREE.Mesh(
    new THREE.ConeGeometry(0.035, 0.16, 4),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 })
  );
  shipHull.position.set(0, 0.17, 0.02);
  shipHull.rotation.x = Math.PI / 2.3;
  const shipWings = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.005, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.8, roughness: 0.3 })
  );
  shipWings.position.set(0, 0.15, 0.03);
  spacecraft.add(sStand, sRod, shipHull, shipWings);
  root.add(spacecraft);

  // E. Architectural Leather Folios (*Vitruvius*, *Palladio*, *Bauhaus*)
  const folioColors = [0x78350f, 0x1e293b, 0x064e3b, 0x831843];
  folioColors.forEach((fc, idx) => {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.038, 0.22, 0.16),
      new THREE.MeshStandardMaterial({ color: fc, roughness: 0.75 })
    );
    book.position.set(-0.75 + idx * 0.045, 3.47, 0.24);
    root.add(book);
  });

  return root;
}
