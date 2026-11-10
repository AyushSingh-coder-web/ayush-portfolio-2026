import * as THREE from 'three';
import { audioManager } from '../utils/audio';
import {
  createRobotArmorTexture,
  createRobotHexJointTexture
} from '../utils/proceduralTextures';

/**
 * PREMIUM FUTURISTIC HUMANOID ROBOT PLAYER CHARACTER
 * Ayush Singh — The Digital Universe
 * 
 * - Original robotic explorer protagonist (height ~1.88m, athletic & lean mechanical build)
 * - PBR Materials: Brushed silver (#B8C2CC), dark graphite (#252B35), near-black (#11151C), electric cyan (#22D3EE)
 * - Head: Sleek angular helmet, dual cyan glowing optics / visor bar, temple mechanisms, segmented jaw
 * - Torso: Layered chest armor, geometric pulsing energy core, segmented abdominal rings, spinal column
 * - Limbs: Ball-and-socket shoulders/hips, cylindrical knee/elbow hinges, 5-finger mechanical hands, robotic boots
 * - Rigging: Upright humanoid posture, controlled joint limits (knees bend strictly forward)
 * - States: IDLE (pulsing core, balanced stance), WALK, RUN, SPRINT, JUMP, FALL, LAND, TURN, INTERACT
 */

export class CharacterController {
  public mesh: THREE.Group;
  public position: THREE.Vector3;
  public rotationY: number = 0;
  public isMoving: boolean = false;
  public isRunning: boolean = false;
  public isSprinting: boolean = false;
  public isJumping: boolean = false;
  public isInteracting: boolean = false;

  // Hierarchical Skeletal Rig
  private hips: THREE.Group;
  private spine: THREE.Group;
  private chest: THREE.Group;
  private neck: THREE.Group;
  private head: THREE.Group;

  // Upper Limbs
  private leftShoulder: THREE.Group;
  private leftUpperArm: THREE.Group;
  private leftForearm: THREE.Group;
  private leftHand: THREE.Group;

  private rightShoulder: THREE.Group;
  private rightUpperArm: THREE.Group;
  private rightForearm: THREE.Group;
  private rightHand: THREE.Group;

  // Lower Limbs
  private leftHipJoint: THREE.Group;
  private leftThigh: THREE.Group;
  private leftCalf: THREE.Group;
  private leftFoot: THREE.Group;

  private rightHipJoint: THREE.Group;
  private rightThigh: THREE.Group;
  private rightCalf: THREE.Group;
  private rightFoot: THREE.Group;

  // Contact shadow
  private contactShadow: THREE.Mesh;

  // Emissive dynamic pulsing materials
  private energyMaterials: THREE.MeshStandardMaterial[] = [];

  // Kinematic Clocks & Blending Weights
  private animClock: number = 0;
  private walkWeight: number = 0;
  private runWeight: number = 0;
  private sprintWeight: number = 0;
  private jumpWeight: number = 0;
  private interactWeight: number = 0;
  private landingImpulse: number = 0;
  private lastFootstepPhase: number = 0;
  private wasAirborne: boolean = false;

  constructor() {
    this.mesh = new THREE.Group();
    this.position = this.mesh.position;
    this.mesh.castShadow = true;

    // ─────────────────────────────────────────────────────────────
    // 1. PREMIUM METALLIC PBR MATERIALS PALETTE
    // ─────────────────────────────────────────────────────────────
    // Primary Armor: Brushed Silver (#B8C2CC)
    const armorTex = createRobotArmorTexture();
    const primarySilverMat = new THREE.MeshStandardMaterial({
      map: armorTex,
      color: 0xb8c2cc,
      metalness: 0.88,
      roughness: 0.26
    });

    // Secondary Armor: Dark Graphite (#252B35)
    const secondaryGraphiteMat = new THREE.MeshStandardMaterial({
      color: 0x252b35,
      metalness: 0.82,
      roughness: 0.35
    });

    // Deep Mechanical Framework & Joints: Near Black (#11151C)
    const jointTex = createRobotHexJointTexture();
    const deepMechMat = new THREE.MeshStandardMaterial({
      map: jointTex,
      color: 0x11151c,
      metalness: 0.70,
      roughness: 0.48
    });

    // High-Polished Chrome Trim
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xdde4ec,
      metalness: 0.95,
      roughness: 0.15
    });

    // Energy Illumination: Electric Cyan (#22D3EE)
    const cyanEnergyMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: new THREE.Color(0x22d3ee),
      emissiveIntensity: 2.2,
      roughness: 0.20,
      metalness: 0.30
    });
    this.energyMaterials.push(cyanEnergyMat);

    // Glowing Optical Sensor Mat: Bright Cyan-Blue
    const visorGlowMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: new THREE.Color(0x22d3ee),
      emissiveIntensity: 2.8,
      roughness: 0.10,
      metalness: 0.20
    });
    this.energyMaterials.push(visorGlowMat);

    // ─────────────────────────────────────────────────────────────
    // 2. ROOT HIPS & PELVIC FRAMEWORK (Height ~1.88m, Leg ratio ~52%)
    // ─────────────────────────────────────────────────────────────
    this.hips = new THREE.Group();
    this.hips.position.y = 0.98; // Pelvis joint center
    this.mesh.add(this.hips);

    // Central Pelvic Chassis Box
    const pelvisChassisGeo = new THREE.BoxGeometry(0.18, 0.14, 0.15);
    const pelvisChassis = new THREE.Mesh(pelvisChassisGeo, secondaryGraphiteMat);
    pelvisChassis.position.y = -0.01;
    pelvisChassis.castShadow = true;
    this.hips.add(pelvisChassis);

    // Front Pelvic Groin Armor Plate (Beveled trapezoid shape)
    const groinPlateGeo = new THREE.CylinderGeometry(0.09, 0.06, 0.13, 6);
    const groinPlate = new THREE.Mesh(groinPlateGeo, primarySilverMat);
    groinPlate.rotation.y = Math.PI / 6;
    groinPlate.position.set(0, -0.02, 0.075);
    groinPlate.castShadow = true;
    this.hips.add(groinPlate);

    // Lateral Hip Armor Plates with mechanical pivot discs
    [-0.105, 0.105].forEach((hx) => {
      const hipPlateGeo = new THREE.BoxGeometry(0.045, 0.12, 0.14);
      const hipPlate = new THREE.Mesh(hipPlateGeo, primarySilverMat);
      hipPlate.position.set(hx, -0.01, 0);
      this.hips.add(hipPlate);

      // Spherical Hip Joint Servo Housing
      const hipJointHousingGeo = new THREE.SphereGeometry(0.045, 12, 10);
      const hipJointHousing = new THREE.Mesh(hipJointHousingGeo, deepMechMat);
      hipJointHousing.position.set(hx, -0.07, 0);
      this.hips.add(hipJointHousing);

      // Cyan hip status indicator
      const hipLightGeo = new THREE.BoxGeometry(0.010, 0.040, 0.025);
      const hipLight = new THREE.Mesh(hipLightGeo, cyanEnergyMat);
      hipLight.position.set(hx > 0 ? hx + 0.022 : hx - 0.022, 0, 0.02);
      this.hips.add(hipLight);
    });

    // ─────────────────────────────────────────────────────────────
    // 3. ARTICULATED ABDOMEN & STREAMLINED WAIST
    // ─────────────────────────────────────────────────────────────
    this.spine = new THREE.Group();
    this.spine.position.y = 0.08;
    this.hips.add(this.spine);

    // 3 Interlocking Abdominal Segment Rings (flexible spine)
    for (let s = 0; s < 3; s++) {
      const ringGeo = new THREE.CylinderGeometry(0.125 - s * 0.005, 0.130 - s * 0.005, 0.042, 10);
      const ringMesh = new THREE.Mesh(ringGeo, secondaryGraphiteMat);
      ringMesh.position.y = 0.028 + s * 0.048;
      ringMesh.castShadow = true;
      this.spine.add(ringMesh);

      // Front metallic core plate for each segment
      const plateGeo = new THREE.BoxGeometry(0.09, 0.035, 0.025);
      const plateMesh = new THREE.Mesh(plateGeo, primarySilverMat);
      plateMesh.position.set(0, 0.028 + s * 0.048, 0.070);
      this.spine.add(plateMesh);
    }

    // Dual Hydraulic Spine Actuator Rods (connecting hips to chest)
    [-0.065, 0.065].forEach((rx) => {
      const rodGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8);
      const rod = new THREE.Mesh(rodGeo, chromeMat);
      rod.position.set(rx, 0.08, -0.055);
      this.spine.add(rod);
    });

    // ─────────────────────────────────────────────────────────────
    // 4. BROAD SCULPTED CHEST & BLUE ENERGY REACTOR CORE
    // ─────────────────────────────────────────────────────────────
    this.chest = new THREE.Group();
    this.chest.position.y = 0.18;
    this.spine.add(this.chest);

    // Main Torso Core Block
    const chestCoreGeo = new THREE.BoxGeometry(0.28, 0.24, 0.18);
    const chestCore = new THREE.Mesh(chestCoreGeo, secondaryGraphiteMat);
    chestCore.position.y = 0.12;
    chestCore.castShadow = true;
    this.chest.add(chestCore);

    // Sculpted Left & Right Pectoral Armor Plates (Brushed Silver)
    [-0.085, 0.085].forEach((px) => {
      const pecGeo = new THREE.BoxGeometry(0.115, 0.16, 0.04);
      const pec = new THREE.Mesh(pecGeo, primarySilverMat);
      pec.position.set(px, 0.14, 0.098);
      pec.rotation.set(0.12, px > 0 ? -0.15 : 0.15, 0);
      pec.castShadow = true;
      this.chest.add(pec);

      // Precision beveled accent strip
      const stripGeo = new THREE.BoxGeometry(0.09, 0.018, 0.015);
      const strip = new THREE.Mesh(stripGeo, chromeMat);
      strip.position.set(px, 0.20, 0.118);
      strip.rotation.set(0.12, px > 0 ? -0.15 : 0.15, 0);
      this.chest.add(strip);
    });

    // Central Geometric Blue Energy Core (Hexagonal Arc Reactor)
    const coreHousingGeo = new THREE.CylinderGeometry(0.048, 0.052, 0.035, 6);
    const coreHousing = new THREE.Mesh(coreHousingGeo, deepMechMat);
    coreHousing.rotation.x = Math.PI / 2;
    coreHousing.position.set(0, 0.135, 0.098);
    this.chest.add(coreHousing);

    // Inner Glowing Cyan Core Crystal
    const coreCrystalGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.04, 6);
    const coreCrystal = new THREE.Mesh(coreCrystalGeo, cyanEnergyMat);
    coreCrystal.rotation.x = Math.PI / 2;
    coreCrystal.position.set(0, 0.135, 0.106);
    this.chest.add(coreCrystal);

    // Glowing energy conduit lines radiating from the core
    [-0.05, 0.05].forEach((lx) => {
      const conduitGeo = new THREE.BoxGeometry(0.035, 0.008, 0.015);
      const conduit = new THREE.Mesh(conduitGeo, cyanEnergyMat);
      conduit.position.set(lx, 0.135, 0.102);
      this.chest.add(conduit);
    });

    // Detailed Back Spinal Column & Armor
    for (let v = 0; v < 5; v++) {
      const vertebraGeo = new THREE.BoxGeometry(0.065, 0.032, 0.04);
      const vertebra = new THREE.Mesh(vertebraGeo, primarySilverMat);
      vertebra.position.set(0, 0.04 + v * 0.048, -0.098);
      this.chest.add(vertebra);
    }

    // Dual Back Energy Channels
    [-0.045, 0.045].forEach((bx) => {
      const backConduitGeo = new THREE.BoxGeometry(0.012, 0.22, 0.012);
      const backConduit = new THREE.Mesh(backConduitGeo, cyanEnergyMat);
      backConduit.position.set(bx, 0.14, -0.095);
      this.chest.add(backConduit);
    });

    // Shoulder Blade Armor Panels (Left & Right)
    [-0.10, 0.10].forEach((sx) => {
      const bladeGeo = new THREE.BoxGeometry(0.09, 0.16, 0.025);
      const blade = new THREE.Mesh(bladeGeo, secondaryGraphiteMat);
      blade.position.set(sx, 0.15, -0.090);
      blade.rotation.set(-0.10, sx > 0 ? 0.14 : -0.14, 0);
      this.chest.add(blade);
    });

    // Clavicle Structural Bar
    const clavicleGeo = new THREE.BoxGeometry(0.42, 0.045, 0.10);
    const clavicle = new THREE.Mesh(clavicleGeo, primarySilverMat);
    clavicle.position.set(0, 0.23, 0.01);
    this.chest.add(clavicle);

    // ─────────────────────────────────────────────────────────────
    // 5. MECHANICAL NECK & FUTURISTIC ROBOT HEAD
    // ─────────────────────────────────────────────────────────────
    this.neck = new THREE.Group();
    this.neck.position.set(0, 0.26, 0);
    this.chest.add(this.neck);

    // Articulated Neck Cylinder with hydraulic rings
    const neckBaseGeo = new THREE.CylinderGeometry(0.060, 0.072, 0.095, 12);
    const neckBase = new THREE.Mesh(neckBaseGeo, deepMechMat);
    neckBase.position.y = 0.045;
    neckBase.castShadow = true;
    this.neck.add(neckBase);

    // Chrome hydraulic neck support pistons
    [-0.035, 0.035].forEach((nx) => {
      const pistonGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.08, 8);
      const piston = new THREE.Mesh(pistonGeo, chromeMat);
      piston.position.set(nx, 0.045, -0.025);
      this.neck.add(piston);
    });

    this.head = new THREE.Group();
    this.head.position.set(0, 0.095, 0.015);
    this.neck.add(this.head);

    // Sleek Angular Helmet Outer Shell (Graphite)
    const headCraniumGeo = new THREE.BoxGeometry(0.17, 0.19, 0.20);
    const headCranium = new THREE.Mesh(headCraniumGeo, secondaryGraphiteMat);
    headCranium.position.set(0, 0.09, -0.01);
    headCranium.castShadow = true;
    this.head.add(headCranium);

    // Brushed Silver Forehead & Crown Brow Armor Plating
    const browPlateGeo = new THREE.BoxGeometry(0.165, 0.065, 0.12);
    const browPlate = new THREE.Mesh(browPlateGeo, primarySilverMat);
    browPlate.position.set(0, 0.155, 0.035);
    browPlate.rotation.x = -0.18;
    this.head.add(browPlate);

    // Crest Fin atop Helmet
    const crestFinGeo = new THREE.BoxGeometry(0.024, 0.045, 0.18);
    const crestFin = new THREE.Mesh(crestFinGeo, chromeMat);
    crestFin.position.set(0, 0.195, -0.02);
    this.head.add(crestFin);

    // Cyan Forehead Status Light
    const foreLightGeo = new THREE.BoxGeometry(0.012, 0.012, 0.05);
    const foreLight = new THREE.Mesh(foreLightGeo, cyanEnergyMat);
    foreLight.position.set(0, 0.18, 0.05);
    this.head.add(foreLight);

    // ── STRIKING ELECTRIC-BLUE GLOWING OPTICAL VISOR & SENSORS ──
    // Recessed Black Sensor Housing
    const visorRecessGeo = new THREE.BoxGeometry(0.145, 0.042, 0.035);
    const visorRecess = new THREE.Mesh(visorRecessGeo, deepMechMat);
    visorRecess.position.set(0, 0.095, 0.092);
    this.head.add(visorRecess);

    // Dual Geometric Glowing Cyan Eyes
    [-0.042, 0.042].forEach((eyeX) => {
      const eyeGeo = new THREE.BoxGeometry(0.038, 0.024, 0.025);
      const eyeMesh = new THREE.Mesh(eyeGeo, visorGlowMat);
      eyeMesh.position.set(eyeX, 0.095, 0.104);
      this.head.add(eyeMesh);

      // Angled eye eyebrow brow trim
      const trimGeo = new THREE.BoxGeometry(0.042, 0.008, 0.028);
      const trimMesh = new THREE.Mesh(trimGeo, primarySilverMat);
      trimMesh.position.set(eyeX, 0.112, 0.106);
      trimMesh.rotation.z = eyeX > 0 ? -0.12 : 0.12;
      this.head.add(trimMesh);
    });

    // Central Visor Bridging Conduit
    const visorBridgeGeo = new THREE.BoxGeometry(0.018, 0.012, 0.022);
    const visorBridge = new THREE.Mesh(visorBridgeGeo, cyanEnergyMat);
    visorBridge.position.set(0, 0.095, 0.105);
    this.head.add(visorBridge);

    // Segmented Mechanical Jaw & Chin Plate
    const jawChassisGeo = new THREE.BoxGeometry(0.13, 0.075, 0.15);
    const jawChassis = new THREE.Mesh(jawChassisGeo, secondaryGraphiteMat);
    jawChassis.position.set(0, 0.025, 0.035);
    jawChassis.rotation.x = 0.22;
    this.head.add(jawChassis);

    // Angular Brushed Silver Chin Guard
    const chinGuardGeo = new THREE.BoxGeometry(0.085, 0.045, 0.045);
    const chinGuard = new THREE.Mesh(chinGuardGeo, primarySilverMat);
    chinGuard.position.set(0, 0.015, 0.092);
    chinGuard.rotation.x = -0.15;
    this.head.add(chinGuard);

    // Dark Intake Vent Grill Slots on lower face
    for (let g = 0; g < 3; g++) {
      const ventGeo = new THREE.BoxGeometry(0.055, 0.006, 0.015);
      const vent = new THREE.Mesh(ventGeo, deepMechMat);
      vent.position.set(0, 0.038 + g * 0.012, 0.098);
      this.head.add(vent);
    }

    // Temple Pivot Mechanisms & Cyan Side Channels
    [-0.092, 0.092].forEach((tx) => {
      const templeDiscGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.025, 12);
      const templeDisc = new THREE.Mesh(templeDiscGeo, primarySilverMat);
      templeDisc.rotation.z = Math.PI / 2;
      templeDisc.position.set(tx, 0.090, 0);
      this.head.add(templeDisc);

      const templeCenterGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.028, 8);
      const templeCenter = new THREE.Mesh(templeCenterGeo, deepMechMat);
      templeCenter.rotation.z = Math.PI / 2;
      templeCenter.position.set(tx, 0.090, 0);
      this.head.add(templeCenter);

      // Cyan Temple Status Glow
      const templeGlowGeo = new THREE.BoxGeometry(0.008, 0.028, 0.012);
      const templeGlow = new THREE.Mesh(templeGlowGeo, cyanEnergyMat);
      templeGlow.position.set(tx > 0 ? tx + 0.014 : tx - 0.014, 0.090, -0.02);
      this.head.add(templeGlow);
    });

    // ─────────────────────────────────────────────────────────────
    // 6. SHOULDERS, ARMS & 5-FINGER ARTICULATED MECHANICAL HANDS
    // ─────────────────────────────────────────────────────────────
    // Helper function to build 5-finger articulated mechanical hand
    const buildMechanicalHand = (isLeft: boolean) => {
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.22, 0);

      // Mechanical Palm Chassis (Graphite with silver backplate)
      const palmChassisGeo = new THREE.BoxGeometry(0.068, 0.075, 0.028);
      const palmChassis = new THREE.Mesh(palmChassisGeo, secondaryGraphiteMat);
      palmChassis.position.y = -0.038;
      palmChassis.castShadow = true;
      handGroup.add(palmChassis);

      // Silver Dorsal Hand Armor Shield
      const dorsalShieldGeo = new THREE.BoxGeometry(0.064, 0.062, 0.012);
      const dorsalShield = new THREE.Mesh(dorsalShieldGeo, primarySilverMat);
      dorsalShield.position.set(0, -0.035, -0.015);
      handGroup.add(dorsalShield);

      // Cyan power indicator on back of hand
      const handLedGeo = new THREE.BoxGeometry(0.018, 0.018, 0.014);
      const handLed = new THREE.Mesh(handLedGeo, cyanEnergyMat);
      handLed.position.set(0, -0.035, -0.016);
      handGroup.add(handLed);

      // Opposable Mechanical Thumb (Separate pivot with 2 segments)
      const thumbGroup = new THREE.Group();
      thumbGroup.position.set(isLeft ? 0.040 : -0.040, -0.022, 0.010);
      thumbGroup.rotation.z = isLeft ? -0.42 : 0.42;
      thumbGroup.rotation.y = isLeft ? 0.32 : -0.32;

      // Thumb Swivel Servo
      const thumbServoGeo = new THREE.SphereGeometry(0.011, 8, 8);
      const thumbServo = new THREE.Mesh(thumbServoGeo, deepMechMat);
      thumbGroup.add(thumbServo);

      // Thumb Proximal Phalanx
      const thumbProxGeo = new THREE.BoxGeometry(0.016, 0.030, 0.014);
      const thumbProx = new THREE.Mesh(thumbProxGeo, primarySilverMat);
      thumbProx.position.y = -0.016;
      thumbGroup.add(thumbProx);

      // Thumb Distal Phalanx & Tip
      const thumbDistGeo = new THREE.BoxGeometry(0.014, 0.024, 0.012);
      const thumbDist = new THREE.Mesh(thumbDistGeo, secondaryGraphiteMat);
      thumbDist.position.set(0, -0.038, 0.004);
      thumbDist.rotation.x = 0.20;
      thumbGroup.add(thumbDist);
      handGroup.add(thumbGroup);

      // 4 Articulated Mechanical Fingers (Index, Middle, Ring, Pinky)
      const fingerData = [
        { name: 'index', len: 0.050, x: isLeft ? 0.023 : -0.023 },
        { name: 'middle', len: 0.056, x: isLeft ? 0.0075 : -0.0075 },
        { name: 'ring', len: 0.050, x: isLeft ? -0.0075 : 0.0075 },
        { name: 'pinky', len: 0.042, x: isLeft ? -0.023 : 0.023 }
      ];

      fingerData.forEach((f) => {
        const fGroup = new THREE.Group();
        fGroup.position.set(f.x, -0.075, 0);

        // Knuckle Joint Disc
        const knuckleGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.014, 8);
        const knuckle = new THREE.Mesh(knuckleGeo, deepMechMat);
        knuckle.rotation.z = Math.PI / 2;
        fGroup.add(knuckle);

        // Proximal Phalanx
        const proxLen = f.len * 0.45;
        const proxGeo = new THREE.BoxGeometry(0.013, proxLen, 0.014);
        const proxMesh = new THREE.Mesh(proxGeo, primarySilverMat);
        proxMesh.position.y = -proxLen * 0.5;
        fGroup.add(proxMesh);

        // Middle Phalanx
        const midLen = f.len * 0.32;
        const midGeo = new THREE.BoxGeometry(0.011, midLen, 0.012);
        const midMesh = new THREE.Mesh(midGeo, secondaryGraphiteMat);
        midMesh.position.set(0, -proxLen - midLen * 0.45, 0.003);
        midMesh.rotation.x = 0.16;
        fGroup.add(midMesh);

        // Distal Phalanx / Fingertip
        const distLen = f.len * 0.23;
        const distGeo = new THREE.BoxGeometry(0.009, distLen, 0.010);
        const distMesh = new THREE.Mesh(distGeo, deepMechMat);
        distMesh.position.set(0, -proxLen - midLen - distLen * 0.45, 0.008);
        distMesh.rotation.x = 0.28;
        fGroup.add(distMesh);

        handGroup.add(fGroup);
      });

      return handGroup;
    };

    // Helper function to build full robotic arm
    const buildRoboticArm = (isLeft: boolean) => {
      const armGroup = new THREE.Group();

      // Broad Angular Shoulder Pauldron
      const pauldronGeo = new THREE.BoxGeometry(0.12, 0.10, 0.14);
      const pauldron = new THREE.Mesh(pauldronGeo, primarySilverMat);
      pauldron.position.set(0, 0.02, 0);
      pauldron.rotation.z = isLeft ? 0.12 : -0.12;
      pauldron.castShadow = true;
      armGroup.add(pauldron);

      // Pauldron Cyan Energy Trim Line
      const pTrimGeo = new THREE.BoxGeometry(0.125, 0.012, 0.145);
      const pTrim = new THREE.Mesh(pTrimGeo, cyanEnergyMat);
      pTrim.position.set(0, -0.01, 0);
      armGroup.add(pTrim);

      // Spherical Shoulder Ball Joint Servo
      const ballJointGeo = new THREE.SphereGeometry(0.055, 12, 10);
      const ballJoint = new THREE.Mesh(ballJointGeo, deepMechMat);
      ballJoint.position.set(0, -0.03, 0);
      armGroup.add(ballJoint);

      // Upper Arm / Bicep Mechanical Assembly
      const upperArm = new THREE.Group();
      upperArm.position.set(0, -0.05, 0);

      // Upper Arm Core Chassis
      const bicepChassisGeo = new THREE.CylinderGeometry(0.054, 0.048, 0.22, 10);
      const bicepChassis = new THREE.Mesh(bicepChassisGeo, secondaryGraphiteMat);
      bicepChassis.position.y = -0.11;
      bicepChassis.castShadow = true;
      upperArm.add(bicepChassis);

      // Outer Brushed Silver Bicep Armor Plate
      const bicepArmorGeo = new THREE.BoxGeometry(0.045, 0.18, 0.08);
      const bicepArmor = new THREE.Mesh(bicepArmorGeo, primarySilverMat);
      bicepArmor.position.set(isLeft ? -0.038 : 0.038, -0.10, 0);
      upperArm.add(bicepArmor);

      // Chrome Hydraulic Strut on Upper Arm
      const strutGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.18, 8);
      const strut = new THREE.Mesh(strutGeo, chromeMat);
      strut.position.set(0, -0.10, 0.042);
      upperArm.add(strut);

      // Elbow Hinge Joint Mechanism
      const elbowJointGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.08, 12);
      const elbowJoint = new THREE.Mesh(elbowJointGeo, deepMechMat);
      elbowJoint.rotation.z = Math.PI / 2;
      elbowJoint.position.set(0, -0.22, 0);
      upperArm.add(elbowJoint);

      // Elbow Cyan Indicator Cap
      [-0.042, 0.042].forEach((ex) => {
        const capGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.006, 8);
        const cap = new THREE.Mesh(capGeo, cyanEnergyMat);
        cap.rotation.z = Math.PI / 2;
        cap.position.set(ex, -0.22, 0);
        upperArm.add(cap);
      });

      // Forearm Assembly
      const forearm = new THREE.Group();
      forearm.position.set(0, -0.22, 0);

      // Tapered Forearm Chassis (Graphite & Silver)
      const forearmChassisGeo = new THREE.CylinderGeometry(0.052, 0.042, 0.22, 10);
      const forearmChassis = new THREE.Mesh(forearmChassisGeo, secondaryGraphiteMat);
      forearmChassis.position.y = -0.11;
      forearmChassis.castShadow = true;
      forearm.add(forearmChassis);

      // Forearm Dorsal Armor Shield (Silver)
      const forearmShieldGeo = new THREE.BoxGeometry(0.065, 0.17, 0.035);
      const forearmShield = new THREE.Mesh(forearmShieldGeo, primarySilverMat);
      forearmShield.position.set(0, -0.10, -0.035);
      forearm.add(forearmShield);

      // Cyan Illuminated Circuit Conduit down Forearm
      const conduitGeo = new THREE.BoxGeometry(0.008, 0.14, 0.008);
      const conduit = new THREE.Mesh(conduitGeo, cyanEnergyMat);
      conduit.position.set(0, -0.10, -0.048);
      forearm.add(conduit);

      // Circular Wrist Servo Ring
      const wristRingGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.028, 12);
      const wristRing = new THREE.Mesh(wristRingGeo, deepMechMat);
      wristRing.position.y = -0.20;
      forearm.add(wristRing);

      // Attach 5-Finger Hand
      const hand = buildMechanicalHand(isLeft);
      forearm.add(hand);

      upperArm.add(forearm);
      armGroup.add(upperArm);

      return { armGroup, upperArm, forearm, hand };
    };

    // Build Left Arm Assembly
    this.leftShoulder = new THREE.Group();
    this.leftShoulder.position.set(-0.26, 0.21, 0);
    this.chest.add(this.leftShoulder);

    const leftArmComponents = buildRoboticArm(true);
    this.leftShoulder.add(leftArmComponents.armGroup);
    this.leftUpperArm = leftArmComponents.upperArm;
    this.leftForearm = leftArmComponents.forearm;
    this.leftHand = leftArmComponents.hand;

    // Build Right Arm Assembly
    this.rightShoulder = new THREE.Group();
    this.rightShoulder.position.set(0.26, 0.21, 0);
    this.chest.add(this.rightShoulder);

    const rightArmComponents = buildRoboticArm(false);
    this.rightShoulder.add(rightArmComponents.armGroup);
    this.rightUpperArm = rightArmComponents.upperArm;
    this.rightForearm = rightArmComponents.forearm;
    this.rightHand = rightArmComponents.hand;

    // ─────────────────────────────────────────────────────────────
    // 7. LEGS, KNEE JOINTS & FUTURISTIC ROBOTIC BOOTS
    // ─────────────────────────────────────────────────────────────
    // Helper function to build futuristic robotic boot
    const buildRoboticBoot = (isLeft: boolean) => {
      const bootGroup = new THREE.Group();
      bootGroup.position.set(0, -0.45, 0.04);

      // Stable Metallic Sole Base
      const soleGeo = new THREE.BoxGeometry(0.124, 0.035, 0.265);
      const sole = new THREE.Mesh(soleGeo, secondaryGraphiteMat);
      sole.position.y = 0.018;
      sole.castShadow = true;
      bootGroup.add(sole);

      // Dark Rubberized Ground Tread Bottom
      const treadGeo = new THREE.BoxGeometry(0.128, 0.015, 0.270);
      const tread = new THREE.Mesh(treadGeo, deepMechMat);
      tread.position.y = -0.006;
      bootGroup.add(tread);

      // Reinforced Brushed Silver Toe Cap Armor
      const toeCapGeo = new THREE.BoxGeometry(0.118, 0.065, 0.11);
      const toeCap = new THREE.Mesh(toeCapGeo, primarySilverMat);
      toeCap.position.set(0, 0.045, 0.082);
      bootGroup.add(toeCap);

      // Heel Counter Armor & Rear Stabilizer
      const heelGeo = new THREE.BoxGeometry(0.116, 0.075, 0.095);
      const heel = new THREE.Mesh(heelGeo, secondaryGraphiteMat);
      heel.position.set(0, 0.052, -0.085);
      bootGroup.add(heel);

      // Cylindrical Ankle Joint Assembly
      const ankleJointGeo = new THREE.CylinderGeometry(0.044, 0.044, 0.11, 10);
      const ankleJoint = new THREE.Mesh(ankleJointGeo, deepMechMat);
      ankleJoint.rotation.z = Math.PI / 2;
      ankleJoint.position.set(0, 0.088, -0.02);
      bootGroup.add(ankleJoint);

      // Cyan Lateral Boot Illumination Strip
      [-0.064, 0.064].forEach((sx) => {
        const stripGeo = new THREE.BoxGeometry(0.006, 0.015, 0.14);
        const strip = new THREE.Mesh(stripGeo, cyanEnergyMat);
        strip.position.set(sx, 0.025, 0.02);
        bootGroup.add(strip);
      });

      return bootGroup;
    };

    // Helper function to build full mechanical leg
    const buildRoboticLeg = (isLeft: boolean) => {
      const hipJoint = new THREE.Group();
      hipJoint.position.set(isLeft ? -0.115 : 0.115, -0.08, 0);

      // Thigh Assembly
      const thigh = new THREE.Group();

      // Thigh Internal Chassis (Graphite)
      const thighChassisGeo = new THREE.CylinderGeometry(0.078, 0.064, 0.44, 12);
      const thighChassis = new THREE.Mesh(thighChassisGeo, secondaryGraphiteMat);
      thighChassis.position.y = -0.22;
      thighChassis.castShadow = true;
      thigh.add(thighChassis);

      // Front Brushed Silver Thigh Armor Plate
      const thighPlateGeo = new THREE.BoxGeometry(0.095, 0.36, 0.040);
      const thighPlate = new THREE.Mesh(thighPlateGeo, primarySilverMat);
      thighPlate.position.set(0, -0.21, 0.058);
      thighPlate.castShadow = true;
      thigh.add(thighPlate);

      // Cyan Power Line down Thigh
      const thighLineGeo = new THREE.BoxGeometry(0.008, 0.28, 0.012);
      const thighLine = new THREE.Mesh(thighLineGeo, cyanEnergyMat);
      thighLine.position.set(0, -0.21, 0.075);
      thigh.add(thighLine);

      // Lateral Armor Flange
      const lateralFlangeGeo = new THREE.BoxGeometry(0.032, 0.26, 0.095);
      const lateralFlange = new THREE.Mesh(lateralFlangeGeo, primarySilverMat);
      lateralFlange.position.set(isLeft ? -0.072 : 0.072, -0.20, 0);
      thigh.add(lateralFlange);

      // ── MECHANICAL KNEE JOINT ASSEMBLY (Strictly Forward Bending) ──
      const kneeGroup = new THREE.Group();
      kneeGroup.position.set(0, -0.44, 0);

      // Cylindrical Knee Axis Hinge Servo
      const kneeServoGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.115, 12);
      const kneeServo = new THREE.Mesh(kneeServoGeo, deepMechMat);
      kneeServo.rotation.z = Math.PI / 2;
      kneeGroup.add(kneeServo);

      // Chrome Knee Pivot Hub Discs
      [-0.060, 0.060].forEach((kx) => {
        const hubGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.008, 10);
        const hub = new THREE.Mesh(hubGeo, chromeMat);
        hub.rotation.z = Math.PI / 2;
        hub.position.set(kx, 0, 0);
        kneeGroup.add(hub);
      });

      // Protective Forward Knee Armor Shield (guards joint from impacts)
      const kneeCapGeo = new THREE.BoxGeometry(0.088, 0.11, 0.042);
      const kneeCap = new THREE.Mesh(kneeCapGeo, primarySilverMat);
      kneeCap.position.set(0, 0.015, 0.062);
      kneeCap.rotation.x = -0.12;
      kneeGroup.add(kneeCap);

      // Cyan Knee Sensor Dot
      const kneeDotGeo = new THREE.BoxGeometry(0.016, 0.016, 0.015);
      const kneeDot = new THREE.Mesh(kneeDotGeo, cyanEnergyMat);
      kneeDot.position.set(0, 0.015, 0.082);
      kneeGroup.add(kneeDot);

      // Lower Leg / Shin Assembly
      const calf = new THREE.Group();
      calf.position.set(0, -0.44, 0);

      // Shin Structural Column (Graphite)
      const shinChassisGeo = new THREE.CylinderGeometry(0.068, 0.052, 0.44, 12);
      const shinChassis = new THREE.Mesh(shinChassisGeo, secondaryGraphiteMat);
      shinChassis.position.y = -0.22;
      shinChassis.castShadow = true;
      calf.add(shinChassis);

      // Front Angular Shin Armor Plate (Silver)
      const shinPlateGeo = new THREE.BoxGeometry(0.088, 0.34, 0.042);
      const shinPlate = new THREE.Mesh(shinPlateGeo, primarySilverMat);
      shinPlate.position.set(0, -0.20, 0.052);
      shinPlate.rotation.x = 0.06;
      shinPlate.castShadow = true;
      calf.add(shinPlate);

      // Rear Calf Hydraulic Piston Cylinder
      const calfPistonGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.28, 8);
      const calfPiston = new THREE.Mesh(calfPistonGeo, chromeMat);
      calfPiston.position.set(0, -0.20, -0.048);
      calf.add(calfPiston);

      // Attach Robotic Boot
      const foot = buildRoboticBoot(isLeft);
      calf.add(foot);

      thigh.add(kneeGroup);
      thigh.add(calf);
      hipJoint.add(thigh);

      return { hipJoint, thigh, calf, foot };
    };

    // Left Leg Assembly
    const leftLegComponents = buildRoboticLeg(true);
    this.leftHipJoint = leftLegComponents.hipJoint;
    this.leftThigh = leftLegComponents.thigh;
    this.leftCalf = leftLegComponents.calf;
    this.leftFoot = leftLegComponents.foot;
    this.hips.add(this.leftHipJoint);

    // Right Leg Assembly
    const rightLegComponents = buildRoboticLeg(false);
    this.rightHipJoint = rightLegComponents.hipJoint;
    this.rightThigh = rightLegComponents.thigh;
    this.rightCalf = rightLegComponents.calf;
    this.rightFoot = rightLegComponents.foot;
    this.hips.add(this.rightHipJoint);

    // ─────────────────────────────────────────────────────────────
    // 8. GROUND CONTACT SHADOW
    // ─────────────────────────────────────────────────────────────
    const shadowGeo = new THREE.PlaneGeometry(1.1, 1.1);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 62);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.32)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });

    this.contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = 0.015;
    this.mesh.add(this.contactShadow);
  }

  /**
   * Kinematic Locomotion Rig Update Loop & State Machine
   * Supports 9 distinct animation states:
   * IDLE, WALK, RUN, SPRINT, JUMP, FALL, LAND, TURN, INTERACT
   * 
   * Strict posture rules:
   * - Spine maintains vertical alignment without random tilting
   * - Knees bend strictly forward (never backwards)
   * - Hips and shoulders stay level during normal standing
   * - Core energy pulses gently
   */
  public update(
    delta: number,
    isMoving: boolean,
    isRunning: boolean,
    isSprinting: boolean,
    targetRotationY: number,
    isAirborne: boolean = false,
    isInteracting: boolean = false
  ) {
    this.isMoving = isMoving;
    this.isRunning = isRunning;
    this.isSprinting = isSprinting;
    this.isJumping = isAirborne;
    this.isInteracting = isInteracting;

    // Detect Landing impact event
    if (this.wasAirborne && !isAirborne) {
      this.landingImpulse = 0.14; // Mechanical knee shock absorption
    }
    this.wasAirborne = isAirborne;

    // Decay landing compression smoothly
    if (this.landingImpulse > 0.001) {
      this.landingImpulse = THREE.MathUtils.damp(this.landingImpulse, 0, 14, delta);
    }

    // Smooth character rotation towards movement direction (no abrupt snapping or tilting)
    let diff = targetRotationY - this.rotationY;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    this.rotationY += diff * Math.min(1, delta * 12);
    this.mesh.rotation.y = this.rotationY;

    // Pulse energy core and illuminated visors
    this.animClock += delta;
    const pulseIntensity = 1.9 + Math.sin(this.animClock * 3.2) * 0.45;
    this.energyMaterials.forEach((mat) => {
      mat.emissiveIntensity = pulseIntensity;
    });

    // Animation state weights blending
    const targetWalk = isMoving && !isRunning && !isSprinting ? 1 : 0;
    const targetRun = isMoving && isRunning && !isSprinting ? 1 : 0;
    const targetSprint = isMoving && isSprinting ? 1 : 0;
    const targetJump = isAirborne ? 1 : 0;
    const targetInteract = isInteracting && !isMoving ? 1 : 0;

    this.walkWeight = THREE.MathUtils.damp(this.walkWeight, targetWalk, 8, delta);
    this.runWeight = THREE.MathUtils.damp(this.runWeight, targetRun, 8, delta);
    this.sprintWeight = THREE.MathUtils.damp(this.sprintWeight, targetSprint, 8, delta);
    this.jumpWeight = THREE.MathUtils.damp(this.jumpWeight, targetJump, 10, delta);
    this.interactWeight = THREE.MathUtils.damp(this.interactWeight, targetInteract, 6, delta);

    const speedRate = isSprinting ? 1.95 : isRunning ? 1.45 : 1.0;

    if (isMoving && !isAirborne) {
      const stepFreq = this.animClock * 7.5 * speedRate;

      // Primary Stride Kinematics
      const legAngleWalk = Math.sin(stepFreq) * 0.42;
      const legAngleRun = Math.sin(stepFreq) * 0.62;
      const legAngleSprint = Math.sin(stepFreq) * 0.80;

      let blendedLegAngle = legAngleWalk;
      if (this.sprintWeight > 0.01) {
        blendedLegAngle = THREE.MathUtils.lerp(legAngleWalk, legAngleSprint, this.sprintWeight);
      } else if (this.runWeight > 0.01) {
        blendedLegAngle = THREE.MathUtils.lerp(legAngleWalk, legAngleRun, this.runWeight);
      }

      this.leftThigh.rotation.x = blendedLegAngle;
      this.rightThigh.rotation.x = -blendedLegAngle;

      // Strict Knee Bend (Forward flex only, never backward!)
      const isFast = this.runWeight > 0.3 || this.sprintWeight > 0.3;
      const leftKnee = Math.max(0, -blendedLegAngle * (isFast ? 1.35 : 1.15)) + (isFast ? 0.15 : 0.06);
      const rightKnee = Math.max(0, blendedLegAngle * (isFast ? 1.35 : 1.15)) + (isFast ? 0.15 : 0.06);
      this.leftCalf.rotation.x = leftKnee;
      this.rightCalf.rotation.x = rightKnee;

      // Ankle / Boot flex (heel strike to toe push-off)
      this.leftFoot.rotation.x = blendedLegAngle * -0.50;
      this.rightFoot.rotation.x = -blendedLegAngle * -0.50;

      // Coordinated Opposing Arm Swing
      const armAngleWalk = -legAngleWalk * 0.85;
      const armAngleRun = -legAngleRun * 1.10;
      const armAngleSprint = -legAngleSprint * 1.30;

      let blendedArmAngle = armAngleWalk;
      if (this.sprintWeight > 0.01) {
        blendedArmAngle = THREE.MathUtils.lerp(armAngleWalk, armAngleSprint, this.sprintWeight);
      } else if (this.runWeight > 0.01) {
        blendedArmAngle = THREE.MathUtils.lerp(armAngleWalk, armAngleRun, this.runWeight);
      }

      this.leftUpperArm.rotation.x = blendedArmAngle;
      this.rightUpperArm.rotation.x = -blendedArmAngle;

      // Elbow flex (arms bent naturally during running/sprinting)
      const baseElbow = isSprinting ? 1.30 : isRunning ? 1.05 : 0.30;
      this.leftForearm.rotation.x = baseElbow + Math.sin(stepFreq) * 0.20;
      this.rightForearm.rotation.x = baseElbow - Math.sin(stepFreq) * 0.20;

      // Torso Dynamics (Stable upright spine with athletic lean during sprint)
      const forwardLean = isSprinting ? 0.32 : isRunning ? 0.14 : 0.04;
      this.spine.rotation.x = forwardLean;
      this.spine.rotation.y = Math.sin(stepFreq) * 0.04;
      this.chest.rotation.z = Math.cos(stepFreq) * 0.03;

      // Vertical oscillation & subtle lateral hip sway
      const bounceHeight = isSprinting ? 0.065 : isRunning ? 0.045 : 0.028;
      this.hips.position.y = 0.98 + Math.abs(Math.sin(stepFreq)) * bounceHeight - this.landingImpulse;
      this.hips.position.x = Math.sin(stepFreq * 0.5) * 0.015;

      // Head stabilizing balance facing forward
      this.head.rotation.x = -forwardLean * 0.60;
      this.head.rotation.y = -this.spine.rotation.y * 0.50;

      // Mechanical Footstep Audio Cadence
      const currentPhase = Math.sin(stepFreq);
      if (Math.abs(currentPhase) > 0.92 && Math.abs(this.lastFootstepPhase) <= 0.92) {
        audioManager.playFootstep();
      }
      this.lastFootstepPhase = currentPhase;
    } else if (!isAirborne) {
      if (this.interactWeight > 0.15) {
        // ─────────────────────────────────────────────────────────
        // INTERACTION STATE: Controlled Reaching toward Exhibit
        // ─────────────────────────────────────────────────────────
        const w = this.interactWeight;
        this.spine.rotation.x = THREE.MathUtils.damp(this.spine.rotation.x, 0.40 * w, 6, delta);
        this.chest.rotation.x = THREE.MathUtils.damp(this.chest.rotation.x, 0.10 * w, 6, delta);

        // Right arm extends forward with open mechanical hand
        this.rightUpperArm.rotation.x = THREE.MathUtils.damp(this.rightUpperArm.rotation.x, -1.20 * w, 6, delta);
        this.rightForearm.rotation.x = THREE.MathUtils.damp(this.rightForearm.rotation.x, 0.22 * w, 6, delta);
        this.rightHand.rotation.x = THREE.MathUtils.damp(this.rightHand.rotation.x, -0.25 * w, 6, delta);

        // Left arm balances back
        this.leftUpperArm.rotation.x = THREE.MathUtils.damp(this.leftUpperArm.rotation.x, 0.35 * w, 6, delta);
        this.leftForearm.rotation.x = THREE.MathUtils.damp(this.leftForearm.rotation.x, 0.55 * w, 6, delta);

        // Stable knee support
        this.leftThigh.rotation.x = THREE.MathUtils.damp(this.leftThigh.rotation.x, -0.12 * w, 6, delta);
        this.rightThigh.rotation.x = THREE.MathUtils.damp(this.rightThigh.rotation.x, -0.12 * w, 6, delta);
        this.leftCalf.rotation.x = THREE.MathUtils.damp(this.leftCalf.rotation.x, 0.16 * w, 6, delta);
        this.rightCalf.rotation.x = THREE.MathUtils.damp(this.rightCalf.rotation.x, 0.16 * w, 6, delta);

        // Head looks up at exhibit
        this.head.rotation.x = THREE.MathUtils.damp(this.head.rotation.x, -0.30 * w, 6, delta);
      } else {
        // ─────────────────────────────────────────────────────────
        // IDLE STATE: Perfectly Upright, Level Shoulders, Pulsing Core
        // ─────────────────────────────────────────────────────────
        const idlePulse = Math.sin(this.animClock * 1.6) * 0.008;
        const idleHeadScan = Math.sin(this.animClock * 0.45) * 0.025;

        // Upright vertical spine with shock absorber damping
        this.hips.position.y = THREE.MathUtils.damp(this.hips.position.y, 0.98 + idlePulse - this.landingImpulse, 6, delta);
        this.hips.position.x = THREE.MathUtils.damp(this.hips.position.x, 0, 5, delta);
        this.spine.rotation.x = THREE.MathUtils.damp(this.spine.rotation.x, 0, 6, delta);
        this.spine.rotation.y = THREE.MathUtils.damp(this.spine.rotation.y, 0, 6, delta);
        this.chest.rotation.z = THREE.MathUtils.damp(this.chest.rotation.z, 0, 6, delta);

        // Balanced stable legs with landing cushion
        this.leftThigh.rotation.x = THREE.MathUtils.damp(this.leftThigh.rotation.x, 0.03 - this.landingImpulse * 0.5, 6, delta);
        this.rightThigh.rotation.x = THREE.MathUtils.damp(this.rightThigh.rotation.x, -0.02 - this.landingImpulse * 0.5, 6, delta);
        this.leftCalf.rotation.x = THREE.MathUtils.damp(this.leftCalf.rotation.x, 0.05 + this.landingImpulse * 0.8, 6, delta);
        this.rightCalf.rotation.x = THREE.MathUtils.damp(this.rightCalf.rotation.x, 0.03 + this.landingImpulse * 0.8, 6, delta);
        this.leftFoot.rotation.x = THREE.MathUtils.damp(this.leftFoot.rotation.x, 0, 6, delta);
        this.rightFoot.rotation.x = THREE.MathUtils.damp(this.rightFoot.rotation.x, 0, 6, delta);

        // Arms hang naturally beside body with slight natural elbow bend
        this.leftUpperArm.rotation.x = THREE.MathUtils.damp(this.leftUpperArm.rotation.x, 0.05, 5, delta);
        this.leftUpperArm.rotation.z = THREE.MathUtils.damp(this.leftUpperArm.rotation.z, 0.06, 5, delta);
        this.leftForearm.rotation.x = THREE.MathUtils.damp(this.leftForearm.rotation.x, 0.22, 5, delta);

        this.rightUpperArm.rotation.x = THREE.MathUtils.damp(this.rightUpperArm.rotation.x, 0.05, 5, delta);
        this.rightUpperArm.rotation.z = THREE.MathUtils.damp(this.rightUpperArm.rotation.z, -0.06, 5, delta);
        this.rightForearm.rotation.x = THREE.MathUtils.damp(this.rightForearm.rotation.x, 0.22, 5, delta);

        // Gentle robotic head tracking
        this.head.rotation.x = THREE.MathUtils.damp(this.head.rotation.x, 0, 5, delta);
        this.head.rotation.y = THREE.MathUtils.damp(this.head.rotation.y, idleHeadScan, 4, delta);
      }
    } else {
      // ─────────────────────────────────────────────────────────
      // JUMP / FALL STATE: Balanced Airborne Posture
      // ─────────────────────────────────────────────────────────
      this.leftThigh.rotation.x = THREE.MathUtils.damp(this.leftThigh.rotation.x, 0.60, 8, delta);
      this.rightThigh.rotation.x = THREE.MathUtils.damp(this.rightThigh.rotation.x, 0.30, 8, delta);
      this.leftCalf.rotation.x = THREE.MathUtils.damp(this.leftCalf.rotation.x, 0.88, 8, delta);
      this.rightCalf.rotation.x = THREE.MathUtils.damp(this.rightCalf.rotation.x, 0.52, 8, delta);

      this.leftUpperArm.rotation.x = THREE.MathUtils.damp(this.leftUpperArm.rotation.x, -0.70, 8, delta);
      this.leftUpperArm.rotation.z = THREE.MathUtils.damp(this.leftUpperArm.rotation.z, 0.22, 8, delta);
      this.rightUpperArm.rotation.x = THREE.MathUtils.damp(this.rightUpperArm.rotation.x, -0.70, 8, delta);
      this.rightUpperArm.rotation.z = THREE.MathUtils.damp(this.rightUpperArm.rotation.z, -0.22, 8, delta);
      this.leftForearm.rotation.x = THREE.MathUtils.damp(this.leftForearm.rotation.x, 0.90, 8, delta);
      this.rightForearm.rotation.x = THREE.MathUtils.damp(this.rightForearm.rotation.x, 0.90, 8, delta);
    }

    // Dynamic ground contact shadow scaling & opacity based on jump height
    const heightAboveGround = this.mesh.position.y;
    const shadowScale = Math.max(0.4, 1.0 - heightAboveGround * 0.35);
    const shadowOpacity = Math.max(0.12, 0.72 - heightAboveGround * 0.4);
    this.contactShadow.scale.set(shadowScale, shadowScale, shadowScale);
    (this.contactShadow.material as THREE.MeshBasicMaterial).opacity = shadowOpacity;
  }
}
