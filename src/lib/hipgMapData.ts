// ============================================================
// HIPG HAMBANTOTA INTERNATIONAL PORT - 3D DIGITAL TWIN GEOMETRY
// Mapped precisely to the official aerial yard masterplan
// Coordinate system: Normalized 0-1000 units (X: West→East, Z: North→South)
// 1 unit ≈ 1 meter in real-world scale
// ============================================================

export type YardCategory =
  | 'container'
  | 'roro'
  | 'feeder'
  | 'ro_ro_large'
  | 'customs'
  | 'service'
  | 'building'
  | 'berth'
  | 'water'
  | 'road';

export interface YardBlock {
  id: string;
  label: string;
  subLabel?: string;
  category: YardCategory;
  x: number; // center X
  z: number; // center Z
  width: number; // X dimension
  depth: number; // Z dimension
  color?: string;
  borderColor?: string;
  description?: string;
  capacity?: number;
  occupied?: number;
  type?: 'cars' | 'containers' | 'chassis' | 'building' | 'apron';
  containerBays?: string[];
  statusBadge?: string;
  isCustom?: boolean;
}

export interface Berth {
  id: string;
  name: string;
  label: string;
  length: number; // meters
  width: number;  // meters
  depthDraft: number; // meters draft
  x: number;
  z: number;
  orientation: 'horizontal' | 'vertical';
  currentVessel?: string;
  bollardsCount: number;
  quaysideColor?: string;
}

export interface ShipData {
  id: string;
  name: string;
  type: 'Pure Car & Truck Carrier (PCTC)' | 'Container Feeder' | 'Ro-Ro General Cargo' | 'Port Tug';
  berthId: string;
  length: number; // meters
  beam: number;   // meters (width)
  draft: number;  // meters
  x: number;
  z: number;
  heading: number; // degrees
  colorHull: string;
  colorSuperstructure: string;
  flag: string;
  imo: string;
  cargoDescription: string;
  vehiclesOnBoard?: number;
  containersOnBoard?: number;
  status: 'Discharging' | 'Loading' | 'Moored' | 'Standby';
}

export interface QuayCrane {
  id: string;
  name: string;
  x: number;
  z: number;
  rotation: number;
  type: 'sts' | 'jib';
  color: string;
  boomLength: number;
}

export interface RoadSegment {
  id: string;
  name: string;
  type: 'highway' | 'quay_apron' | 'primary' | 'secondary' | 'access';
  points: [number, number][]; // [x, z] coordinates
  widthMeters: number;        // width in meters
  lengthMeters: number;       // length in meters
  lanes: number;
  speedLimitKmH: number;
  oneWay?: boolean;
  flowDirection?: 'N' | 'S' | 'E' | 'W' | 'bidirectional';
  description?: string;
}

export interface LightPole {
  x: number;
  z: number;
  height: number;
  intensity: number;
  color: string;
}

// ─────────────────────────────────────────────────────────────
// QUAY CRANES (QCs - Ship-To-Shore & Mobile Harbor Cranes)
// ─────────────────────────────────────────────────────────────
export const QUAY_CRANES: QuayCrane[] = [
  // Heavy STS Gantry Container Cranes along Eastern Berths 01 & 02
  { id: 'QC_01', name: 'STS Gantry Crane QC-01', x: 948, z: 580, rotation: Math.PI / 2, type: 'sts', color: '#1e40af', boomLength: 42 },
  { id: 'QC_02', name: 'STS Gantry Crane QC-02', x: 948, z: 660, rotation: Math.PI / 2, type: 'sts', color: '#1e40af', boomLength: 42 },
  { id: 'QC_03', name: 'STS Gantry Crane QC-03', x: 948, z: 750, rotation: Math.PI / 2, type: 'sts', color: '#1e40af', boomLength: 42 },
  { id: 'QC_04', name: 'STS Gantry Crane QC-04', x: 948, z: 830, rotation: Math.PI / 2, type: 'sts', color: '#1e40af', boomLength: 42 },

  // Mobile Harbor Cranes / Jib Cranes at Berth 06 (visible in reference image beside Ramp 5W)
  { id: 'QC_06A', name: 'Quayside Jib Crane MHC-06A', x: 395, z: 442, rotation: 0, type: 'jib', color: '#f59e0b', boomLength: 28 },
  { id: 'QC_06B', name: 'Quayside Jib Crane MHC-06B', x: 420, z: 442, rotation: 0, type: 'jib', color: '#f59e0b', boomLength: 28 },
];

// ─────────────────────────────────────────────────────────────
// BERTHS (Exact Dimensions from HIPG Blueprint)
// ─────────────────────────────────────────────────────────────
export const BERTHS: Berth[] = [
  // North Quay Berths
  {
    id: 'B09',
    name: 'Berth 09 (North Basin)',
    label: 'Berth 09 (279.5m)',
    length: 279.5,
    width: 32,
    depthDraft: 14.5,
    x: 355,
    z: 255,
    orientation: 'horizontal',
    currentVessel: 'MV GLOVIS SUNRISE',
    bollardsCount: 16,
    quaysideColor: '#ffd166',
  },
  {
    id: 'B10',
    name: 'Berth 10 (North Basin)',
    label: 'Berth 10 (279.5m)',
    length: 279.5,
    width: 32,
    depthDraft: 14.5,
    x: 535,
    z: 255,
    orientation: 'horizontal',
    currentVessel: 'MV NYK ANDROMEDA LEADER',
    bollardsCount: 16,
    quaysideColor: '#ffd166',
  },
  {
    id: 'B11',
    name: 'Berth 11 (North Basin)',
    label: 'Berth 11 (279.5m)',
    length: 279.5,
    width: 32,
    depthDraft: 14.5,
    x: 715,
    z: 255,
    orientation: 'horizontal',
    currentVessel: 'MV GLOVIS CENTURY',
    bollardsCount: 16,
    quaysideColor: '#ffd166',
  },

  // Central Basin South Quay Berths
  {
    id: 'B06',
    name: 'Berth 06 (Quayside West)',
    label: 'Berth 06 (306m)',
    length: 306.0,
    width: 30,
    depthDraft: 15.0,
    x: 350,
    z: 435,
    orientation: 'horizontal',
    bollardsCount: 18,
    quaysideColor: '#4a90e2',
  },
  {
    id: 'B05W',
    name: 'Ro-Ro Ramp 5W',
    label: '5W Ramp (220m)',
    length: 220.0,
    width: 25,
    depthDraft: 14.0,
    x: 535,
    z: 450,
    orientation: 'horizontal',
    bollardsCount: 12,
    quaysideColor: '#e9c46a',
  },
  {
    id: 'B04W',
    name: 'Ro-Ro Ramp 4W',
    label: '4W Ramp (240m)',
    length: 240.0,
    width: 25,
    depthDraft: 14.0,
    x: 690,
    z: 450,
    orientation: 'horizontal',
    bollardsCount: 14,
    quaysideColor: '#e9c46a',
  },
  {
    id: 'B04',
    name: 'Berth 04',
    label: 'Berth 04 (287.2m)',
    length: 287.2,
    width: 32,
    depthDraft: 15.0,
    x: 755,
    z: 435,
    orientation: 'horizontal',
    bollardsCount: 16,
    quaysideColor: '#4a90e2',
  },
  {
    id: 'B03',
    name: 'Berth 03',
    label: 'Berth 03 (208m)',
    length: 208.0,
    width: 28,
    depthDraft: 13.0,
    x: 885,
    z: 455,
    orientation: 'vertical',
    bollardsCount: 12,
    quaysideColor: '#4a90e2',
  },

  // East Basin Berths
  {
    id: 'B02',
    name: 'Berth 02 (Eastern Deep Quay)',
    label: 'Berth 02 (300m)',
    length: 300.0,
    width: 35,
    depthDraft: 16.0,
    x: 940,
    z: 600,
    orientation: 'vertical',
    currentVessel: 'MV PACIFIC HIGHWAY',
    bollardsCount: 18,
    quaysideColor: '#50e3c2',
  },
  {
    id: 'B01',
    name: 'Berth 01 (Eastern Deep Quay)',
    label: 'Berth 01 (300m)',
    length: 300.0,
    width: 35,
    depthDraft: 16.0,
    x: 940,
    z: 780,
    orientation: 'vertical',
    bollardsCount: 18,
    quaysideColor: '#50e3c2',
  },
  {
    id: 'BSERV',
    name: 'Service Berth (CY01)',
    label: 'Service Berth (105m)',
    length: 105.0,
    width: 35,
    depthDraft: 8.5,
    x: 940,
    z: 910,
    orientation: 'vertical',
    bollardsCount: 8,
    quaysideColor: '#f77f00',
  },
];

// ─────────────────────────────────────────────────────────────
// SHIPS MOORED IN HARBOR (Correct orientations and sleek proportions)
// ─────────────────────────────────────────────────────────────
export const SHIPS: ShipData[] = [
  {
    id: 'SHIP_09',
    name: 'MV GLOVIS SUNRISE',
    type: 'Pure Car & Truck Carrier (PCTC)',
    berthId: 'B09',
    length: 199.9,
    beam: 32.2,
    draft: 8.8,
    x: 355,
    z: 286,
    heading: 0, // Horizontal along Berth 09 quayside
    colorHull: '#0b3558', // Signature Hyundai Glovis Navy Blue
    colorSuperstructure: '#f8fafc',
    flag: 'Panama (PA)',
    imo: 'IMO 9632064',
    cargoDescription: '6,500 CEU Hyundai Glovis Car Carrier - Discharging Korean SUVs',
    vehiclesOnBoard: 2140,
    status: 'Discharging',
  },
  {
    id: 'SHIP_10',
    name: 'MV NYK ANDROMEDA LEADER',
    type: 'Pure Car & Truck Carrier (PCTC)',
    berthId: 'B10',
    length: 199.9,
    beam: 32.2,
    draft: 8.5,
    x: 535,
    z: 286,
    heading: 0, // Horizontal along Berth 10 quayside
    colorHull: '#09213d', // Signature NYK Line Royal Navy Blue
    colorSuperstructure: '#f8fafc',
    flag: 'Japan (JP)',
    imo: 'IMO 9314430',
    cargoDescription: '6,000 CEU NYK Line Ro-Ro Carrier - Electric Sedans & Machinery',
    vehiclesOnBoard: 1620,
    status: 'Discharging',
  },
  {
    id: 'SHIP_11',
    name: 'MV GLOVIS CENTURY',
    type: 'Pure Car & Truck Carrier (PCTC)',
    berthId: 'B11',
    length: 199.9,
    beam: 32.2,
    draft: 9.0,
    x: 715,
    z: 286,
    heading: 0, // Horizontal along Berth 11 quayside
    colorHull: '#0b3558', // Signature Hyundai Glovis Navy Blue
    colorSuperstructure: '#f8fafc',
    flag: 'Korea (KR)',
    imo: 'IMO 9598282',
    cargoDescription: '6,500 CEU Hyundai Glovis Ro-Ro Vessel - High & Heavy Plant',
    vehiclesOnBoard: 3100,
    status: 'Loading',
  },
  {
    id: 'SHIP_02',
    name: 'MV PACIFIC HIGHWAY',
    type: 'Ro-Ro General Cargo',
    berthId: 'B02',
    length: 175,
    beam: 25,
    draft: 8.2,
    x: 974,
    z: 590,
    heading: 90, // Vertical along Berth 02 seaside quay
    colorHull: '#131b28',
    colorSuperstructure: '#f8fafc',
    flag: 'Japan (JP)',
    imo: 'IMO 9524023',
    cargoDescription: '1,500 Vehicles & Containerized Spare Parts',
    vehiclesOnBoard: 890,
    status: 'Moored',
  },
  {
    id: 'SHIP_TUG',
    name: 'HIPG RAVANA 01',
    type: 'Port Tug',
    berthId: 'BSERV',
    length: 32,
    beam: 11,
    draft: 4.5,
    x: 968,
    z: 910,
    heading: 90, // Vertical along Service Berth seaside quay
    colorHull: '#b91c1c',
    colorSuperstructure: '#f8fafc',
    flag: 'Sri Lanka (LK)',
    imo: 'IMO 9821450',
    cargoDescription: 'Harbor Tugboat - 70T Bollard Pull',
    status: 'Standby',
  },
];


// ─────────────────────────────────────────────────────────────
// COMPLETE YARD BLOCKS
// ─────────────────────────────────────────────────────────────
export const YARD_BLOCKS: YardBlock[] = [
  // ── 1. Top-Left Container Yard (BY3 / C01-C09 / Feeder B-C / B01-B06 / Feeder A-B / A01-A06) ──
  {
    id: 'BY3_HEADER',
    label: 'BY3',
    subLabel: 'Buffer Yard 3 Terminal',
    category: 'service',
    x: 185,
    z: 22,
    width: 140,
    depth: 18,
    color: '#ff6b35',
    borderColor: '#ff6b35',
    description: 'Upper Perimeter Buffer & Access Zone BY3',
    statusBadge: 'ACTIVE',
    type: 'apron',
    capacity: 0,
    occupied: 0,
  },
  {
    id: 'CONT_K01_C09_C01',
    label: 'K01 | C09–C01',
    subLabel: 'High-Density Container Stack',
    category: 'container',
    x: 185,
    z: 130,
    width: 140,
    depth: 170,
    color: '#0d5c46',
    borderColor: '#00f5d4',
    description: '10 Stacking Bays: K01, C09, C08, C07, C06, C05, C04, C03, C02, C01',
    capacity: 1850,
    occupied: 1480,
    type: 'containers',
    containerBays: ['K01', 'C09', 'C08', 'C07', 'C06', 'C05', 'C04', 'C03', 'C02', 'C01'],
  },
  {
    id: 'FEEDER_BC',
    label: 'Feeder B-C',
    subLabel: 'Staging Corridor B-C',
    category: 'feeder',
    x: 185,
    z: 228,
    width: 140,
    depth: 14,
    color: '#f9c74f',
    borderColor: '#f9c74f',
    description: 'Intermediate RoRo/Container Feeder Transfer Lane B-C',
    type: 'apron',
    capacity: 500,
    occupied: 320,
  },
  {
    id: 'CONT_B01_B06',
    label: 'B06–B01',
    subLabel: 'Feeder Staging Blocks',
    category: 'container',
    x: 185,
    z: 280,
    width: 140,
    depth: 80,
    color: '#1b4332',
    borderColor: '#52b788',
    description: '6 Stacking Bays: B06, B05, B04, B03, B02, B01',
    capacity: 1100,
    occupied: 870,
    type: 'containers',
    containerBays: ['B06', 'B05', 'B04', 'B03', 'B02', 'B01'],
  },
  {
    id: 'FEEDER_AB',
    label: 'Feeder A-B',
    subLabel: 'Staging Corridor A-B',
    category: 'feeder',
    x: 185,
    z: 335,
    width: 140,
    depth: 14,
    color: '#f9c74f',
    borderColor: '#f9c74f',
    description: 'Intermediate RoRo/Container Feeder Transfer Lane A-B',
    type: 'apron',
    capacity: 500,
    occupied: 280,
  },
  {
    id: 'CONT_A01_A06',
    label: 'A06–A01',
    subLabel: 'Import/Export Yard A',
    category: 'container',
    x: 185,
    z: 390,
    width: 140,
    depth: 80,
    color: '#7f4f24',
    borderColor: '#e76f51',
    description: '6 Multi-Color Stacking Bays: A06, A05, A04, A03, A02, A01',
    capacity: 1100,
    occupied: 960,
    type: 'containers',
    containerBays: ['A06', 'A05', 'A04', 'A03', 'A02', 'A01'],
  },

  // ── 2. Top-Right Green Park & BY4 Administration Building ──
  {
    id: 'BY4_HQ',
    label: 'BY4',
    subLabel: 'Port Administration & Command HQ',
    category: 'building',
    x: 710,
    z: 85,
    width: 120,
    depth: 60,
    color: '#2b3a4a',
    borderColor: '#00d4ff',
    description: 'HIPG Port Operating Headquarters & Marine Traffic Control Tower (BY4)',
    type: 'building',
    capacity: 0,
    occupied: 0,
  },

  // ── 3. Central Basin Quayside Aprons (09W, 10W, 11W, 5W, 4W) ──
  {
    id: 'APRON_09W',
    label: '09W',
    subLabel: 'North Quayside Apron 09W',
    category: 'service',
    x: 355,
    z: 255,
    width: 170,
    depth: 18,
    color: '#e0a96d',
    borderColor: '#ffd166',
    type: 'apron',
    capacity: 350,
    occupied: 180,
  },
  {
    id: 'APRON_10W',
    label: '10W',
    subLabel: 'North Quayside Apron 10W',
    category: 'service',
    x: 535,
    z: 255,
    width: 170,
    depth: 18,
    color: '#e0a96d',
    borderColor: '#ffd166',
    type: 'apron',
    capacity: 350,
    occupied: 120,
  },
  {
    id: 'APRON_11W',
    label: '11W',
    subLabel: 'North Quayside Apron 11W',
    category: 'service',
    x: 715,
    z: 255,
    width: 170,
    depth: 18,
    color: '#e0a96d',
    borderColor: '#ffd166',
    type: 'apron',
    capacity: 350,
    occupied: 240,
  },
  {
    id: 'RAMP_5W_L',
    label: 'Ramp',
    subLabel: 'Ro-Ro Stern Ramp 5W West',
    category: 'service',
    x: 440,
    z: 450,
    width: 40,
    depth: 16,
    color: '#c9184a',
    borderColor: '#ff4d6d',
    type: 'apron',
    capacity: 50,
    occupied: 20,
  },
  {
    id: 'APRON_5W',
    label: '5W',
    subLabel: 'Central Ro-Ro Apron 5W',
    category: 'service',
    x: 535,
    z: 450,
    width: 130,
    depth: 16,
    color: '#ffd166',
    borderColor: '#ffb703',
    type: 'apron',
    capacity: 220,
    occupied: 140,
  },
  {
    id: 'RAMP_5W_R',
    label: 'Ramp',
    subLabel: 'Ro-Ro Stern Ramp 5W East',
    category: 'service',
    x: 630,
    z: 450,
    width: 40,
    depth: 16,
    color: '#c9184a',
    borderColor: '#ff4d6d',
    type: 'apron',
    capacity: 50,
    occupied: 25,
  },
  {
    id: 'APRON_4W',
    label: '4W',
    subLabel: 'Central Ro-Ro Apron 4W',
    category: 'service',
    x: 730,
    z: 450,
    width: 140,
    depth: 16,
    color: '#ffd166',
    borderColor: '#ffb703',
    type: 'apron',
    capacity: 250,
    occupied: 180,
  },

  // ── 4. Main Upper Ro-Ro Car Yards (04A, 03A, 02A, 01A) ──
  {
    id: 'RORO_04A',
    label: '04A',
    subLabel: 'Ro-Ro Vehicle Staging Yard 04A',
    category: 'roro',
    x: 185,
    z: 510,
    width: 135,
    depth: 90,
    color: '#1a2230',
    borderColor: '#06d6a0',
    description: 'Ro-Ro Automobile Block 04A — 1,250 Automobile Staging Bays',
    capacity: 1250,
    occupied: 1100,
    type: 'cars',
  },
  {
    id: 'STRIP_03A_04A',
    label: '03A / 04A',
    subLabel: 'Buffer Strip 03A/04A',
    category: 'service',
    x: 260,
    z: 510,
    width: 16,
    depth: 90,
    color: '#f9c74f',
    borderColor: '#f9c74f',
    type: 'apron',
    capacity: 120,
    occupied: 80,
  },
  {
    id: 'RORO_03A',
    label: '03A',
    subLabel: 'Primary Ro-Ro Vehicle Yard 03A',
    category: 'roro',
    x: 360,
    z: 510,
    width: 160,
    depth: 90,
    color: '#1a2230',
    borderColor: '#06d6a0',
    description: 'High-Capacity Vehicle Export/Import Staging 03A',
    capacity: 1800,
    occupied: 1540,
    type: 'cars',
  },
  {
    id: 'RORO_02A',
    label: '02A',
    subLabel: 'Primary Ro-Ro Vehicle Yard 02A',
    category: 'roro',
    x: 540,
    z: 510,
    width: 175,
    depth: 90,
    color: '#1a2230',
    borderColor: '#06d6a0',
    description: 'Vehicle Staging 02A with Dedicated CHSE Chassis Handling Zone',
    capacity: 1950,
    occupied: 1680,
    type: 'cars',
  },
  {
    id: 'ZONE_CHSE',
    label: 'CHSE',
    subLabel: 'Cargo Handling Staging Equipment',
    category: 'service',
    x: 640,
    z: 540,
    width: 28,
    depth: 26,
    color: '#2d6a4f',
    borderColor: '#52b788',
    description: 'Chassis & Ramp Tractor Parking Pad CHSE',
    type: 'chassis',
    capacity: 80,
    occupied: 45,
  },
  {
    id: 'RORO_01A',
    label: '01A',
    subLabel: 'Ro-Ro Vehicle Yard 01A',
    category: 'roro',
    x: 760,
    z: 485,
    width: 165,
    depth: 45,
    color: '#1a2230',
    borderColor: '#ef476f',
    description: 'Vehicle Staging Block 01A (Red Neon Safety Perimeter)',
    capacity: 980,
    occupied: 820,
    type: 'cars',
  },

  // ── 5. Container Stacks Below Car Lots (L04, M04, L03, M03, L02, M02, H01, H02, L01, M01) ──
  {
    id: 'CONT_L04',
    label: 'L04',
    subLabel: 'L04 (LDN - Loaded)',
    category: 'container',
    x: 185,
    z: 600,
    width: 135,
    depth: 28,
    color: '#1d3557',
    borderColor: '#457b9d',
    description: 'Block L04 Loaded Container Stack (Blue Units)',
    capacity: 450,
    occupied: 380,
    type: 'containers',
  },
  {
    id: 'CONT_M04',
    label: 'M04',
    subLabel: 'M04 (DOG / MTY - Damage/Empty)',
    category: 'container',
    x: 185,
    z: 635,
    width: 135,
    depth: 28,
    color: '#7f4f24',
    borderColor: '#e76f51',
    description: 'Block M04 Empty & Damaged Containers (Orange/Brown Units)',
    capacity: 450,
    occupied: 320,
    type: 'containers',
  },
  {
    id: 'CONT_L03',
    label: 'L03',
    subLabel: 'L03 (LDN - Loaded)',
    category: 'container',
    x: 360,
    z: 600,
    width: 160,
    depth: 28,
    color: '#1d3557',
    borderColor: '#457b9d',
    description: 'Block L03 Double-Tier Loaded Container Stack',
    capacity: 550,
    occupied: 490,
    type: 'containers',
  },
  {
    id: 'CONT_M03',
    label: 'M03',
    subLabel: 'M03 (LDN - Loaded)',
    category: 'container',
    x: 360,
    z: 635,
    width: 160,
    depth: 28,
    color: '#1d3557',
    borderColor: '#457b9d',
    description: 'Block M03 Double-Tier Loaded Container Stack',
    capacity: 550,
    occupied: 460,
    type: 'containers',
  },
  {
    id: 'CONT_L02',
    label: 'L02',
    subLabel: 'L02 (LDN - Loaded)',
    category: 'container',
    x: 540,
    z: 600,
    width: 175,
    depth: 28,
    color: '#1d3557',
    borderColor: '#457b9d',
    description: 'Block L02 Double-Tier Loaded Container Stack',
    capacity: 600,
    occupied: 540,
    type: 'containers',
  },
  {
    id: 'CONT_M02',
    label: 'M02',
    subLabel: 'M02 (LDN - Loaded)',
    category: 'container',
    x: 540,
    z: 635,
    width: 175,
    depth: 28,
    color: '#1d3557',
    borderColor: '#457b9d',
    description: 'Block M02 Double-Tier Loaded Container Stack',
    capacity: 600,
    occupied: 520,
    type: 'containers',
  },
  {
    id: 'CONT_H01',
    label: 'H01',
    subLabel: 'H01 (LDN)',
    category: 'container',
    x: 760,
    z: 530,
    width: 165,
    depth: 22,
    color: '#1d3557',
    borderColor: '#457b9d',
    description: 'Block H01 Loaded Container Stack',
    capacity: 400,
    occupied: 370,
    type: 'containers',
  },
  {
    id: 'CONT_H02',
    label: 'H02',
    subLabel: 'H02 (LDN)',
    category: 'container',
    x: 760,
    z: 558,
    width: 165,
    depth: 22,
    color: '#1d3557',
    borderColor: '#457b9d',
    description: 'Block H02 Loaded Container Stack',
    capacity: 400,
    occupied: 350,
    type: 'containers',
  },
  {
    id: 'CONT_L01',
    label: 'L01',
    subLabel: 'L01 (LDN)',
    category: 'container',
    x: 760,
    z: 600,
    width: 165,
    depth: 28,
    color: '#1d3557',
    borderColor: '#457b9d',
    description: 'Block L01 Loaded Container Stack',
    capacity: 550,
    occupied: 510,
    type: 'containers',
  },
  {
    id: 'CONT_M01',
    label: 'M01',
    subLabel: 'M01 (LDN)',
    category: 'container',
    x: 760,
    z: 635,
    width: 165,
    depth: 28,
    color: '#1d3557',
    borderColor: '#457b9d',
    description: 'Block M01 Loaded Container Stack',
    capacity: 550,
    occupied: 480,
    type: 'containers',
  },

  // ── 6. South-East Ro-Ro Yards (02C, 02D, 01C, 01D, 01E, 01F, 01G, CY01) ──
  {
    id: 'RORO_02C',
    label: '02C',
    subLabel: 'Ro-Ro Vehicle Yard 02C',
    category: 'roro',
    x: 580,
    z: 715,
    width: 140,
    depth: 40,
    color: '#1a2230',
    borderColor: '#06d6a0',
    description: 'Ro-Ro Vehicle Staging Block 02C',
    capacity: 750,
    occupied: 620,
    type: 'cars',
  },
  {
    id: 'RORO_02D',
    label: '02D',
    subLabel: 'Ro-Ro Vehicle Yard 02D',
    category: 'roro',
    x: 580,
    z: 765,
    width: 140,
    depth: 40,
    color: '#1a2230',
    borderColor: '#ef476f',
    description: 'Ro-Ro Vehicle Staging Block 02D (Red Border)',
    capacity: 750,
    occupied: 690,
    type: 'cars',
  },
  {
    id: 'RORO_01C',
    label: '01C',
    subLabel: 'Ro-Ro Vehicle Yard 01C',
    category: 'roro',
    x: 770,
    z: 715,
    width: 155,
    depth: 40,
    color: '#1a2230',
    borderColor: '#ef476f',
    description: 'Ro-Ro Vehicle Staging Block 01C',
    capacity: 850,
    occupied: 780,
    type: 'cars',
  },
  {
    id: 'RORO_01D',
    label: '01D',
    subLabel: 'Ro-Ro Vehicle Yard 01D',
    category: 'roro',
    x: 770,
    z: 765,
    width: 155,
    depth: 40,
    color: '#1a2230',
    borderColor: '#ef476f',
    description: 'Ro-Ro Vehicle Staging Block 01D',
    capacity: 850,
    occupied: 740,
    type: 'cars',
  },
  {
    id: 'RORO_01E',
    label: '01E',
    subLabel: 'Ro-Ro Vehicle Yard 01E',
    category: 'roro',
    x: 800,
    z: 818,
    width: 155,
    depth: 26,
    color: '#1a2230',
    borderColor: '#ef476f',
    description: 'Ro-Ro Vehicle Staging Block 01E',
    capacity: 520,
    occupied: 460,
    type: 'cars',
  },
  {
    id: 'RORO_01F',
    label: '01F',
    subLabel: 'Ro-Ro Vehicle Yard 01F',
    category: 'roro',
    x: 800,
    z: 855,
    width: 155,
    depth: 26,
    color: '#1a2230',
    borderColor: '#ef476f',
    description: 'Ro-Ro Vehicle Staging Block 01F',
    capacity: 520,
    occupied: 490,
    type: 'cars',
  },
  {
    id: 'RORO_01G',
    label: '01G',
    subLabel: 'Ro-Ro Vehicle Yard 01G',
    category: 'roro',
    x: 800,
    z: 895,
    width: 155,
    depth: 26,
    color: '#1a2230',
    borderColor: '#ef476f',
    description: 'Ro-Ro Vehicle Staging Block 01G',
    capacity: 520,
    occupied: 440,
    type: 'cars',
  },
  {
    id: 'APRON_CY01',
    label: 'CY01',
    subLabel: 'Service Quayside Apron CY01',
    category: 'service',
    x: 915,
    z: 895,
    width: 32,
    depth: 30,
    color: '#f77f00',
    borderColor: '#fcbf49',
    type: 'apron',
    capacity: 60,
    occupied: 25,
  },

  // ── 7. South-West Zone: New Customs Inspection Yard (Near the gate 01) ──
  {
    id: 'CUSTOMS_INSPECTION_YARD',
    label: 'New Customs\nInspection Yard\n(Near the gate 01)',
    subLabel: 'Sri Lanka Customs Port Inspection Yard',
    category: 'customs',
    x: 205,
    z: 840,
    width: 140,
    depth: 160,
    color: '#1e2d3b',
    borderColor: '#e63946',
    description: 'Enclosed High-Security Customs Inspection & Clearance Staging (Near Gate 01)',
    capacity: 800,
    occupied: 580,
    type: 'cars',
  },
  {
    id: 'WORKSHOP_SHEDS',
    label: 'Gate 01 Workshop',
    subLabel: 'Tractor Repair & Terminal Facility',
    category: 'service',
    x: 65,
    z: 750,
    width: 45,
    depth: 110,
    color: '#34495e',
    borderColor: '#7f8c8d',
    type: 'building',
    capacity: 0,
    occupied: 0,
  },
];

// ─────────────────────────────────────────────────────────────
// ROAD JUNCTIONS & INTERCHANGES (Matching Reference Image)
// ─────────────────────────────────────────────────────────────
export interface JunctionNode {
  id: string;
  name: string;
  x: number;
  z: number;
  type: 'crossroad' | 't_junction' | 'interchange' | 'gate' | 'quay_ramp';
  hasTargetMarker: boolean; // Circular target icon (⨁) as seen in image
  markerColor?: string;
  description: string;
}

export interface ZebraCrossing {
  id: string;
  x: number;
  z: number;
  rotation: number;
  width: number;
  length: number;
}

export const JUNCTIONS: JunctionNode[] = [
  // 1. Top-Left Interchange (Beside Berth 09 with Red ⨁ Circle in image)
  {
    id: 'J_NORTH_GATE',
    name: 'J-01: Container / North Quay Interchange',
    x: 260,
    z: 245,
    type: 'interchange',
    hasTargetMarker: true,
    markerColor: '#ef4444',
    description: 'Major junction connecting Container Yard BY3 and North Quay 09W with Red Crosshair ⨁',
  },
  // 2. Feeder B-C West Junction
  {
    id: 'J_FEEDER_BC',
    name: 'J-02: Feeder B-C Corridor Junction',
    x: 260,
    z: 228,
    type: 't_junction',
    hasTargetMarker: false,
    description: 'Internal transfer junction for Feeder B-C and High-Density Container Stack C01-C09',
  },
  // 3. Feeder A-B West Junction
  {
    id: 'J_FEEDER_AB',
    name: 'J-03: Feeder A-B Corridor Junction',
    x: 260,
    z: 335,
    type: 't_junction',
    hasTargetMarker: false,
    description: 'Internal transfer junction for Feeder A-B connecting B-Stack and A-Stack bays',
  },
  // 4. Berth 06 Western Dock Junction
  {
    id: 'J_BERTH_06',
    name: 'J-04: Berth 06 West Junction',
    x: 260,
    z: 442,
    type: 't_junction',
    hasTargetMarker: false,
    description: 'Quayside dock access junction between Yard 04A and Berth 06 mobile crane staging',
  },
  // 5. Ramp 5W Central Quayside Junction
  {
    id: 'J_RAMP_5W_NORTH',
    name: 'J-05: Ramp 5W North Interchange',
    x: 455,
    z: 442,
    type: 'quay_ramp',
    hasTargetMarker: false,
    description: 'Vessel discharge feeder point for Ro-Ro Stern Ramp 5W',
  },
  // 6. Ramp 4W Central Quayside Junction
  {
    id: 'J_RAMP_4W_NORTH',
    name: 'J-06: Ramp 4W North Interchange',
    x: 670,
    z: 442,
    type: 'quay_ramp',
    hasTargetMarker: false,
    description: 'Vessel discharge feeder point for Ro-Ro Stern Ramp 4W',
  },
  // 7. Eastern Dock Corner Junction (Berth 03 / Berth 02)
  {
    id: 'J_EAST_CORNER',
    name: 'J-07: East Quayside Corner',
    x: 885,
    z: 442,
    type: 't_junction',
    hasTargetMarker: false,
    description: 'Corner connecting Central Basin Quay to Eastern Deep-Sea Berth Road',
  },
  // 8. Western Mid-Yard Crossroad (Between 04A and 03A)
  {
    id: 'J_MID_04_03',
    name: 'J-08: West Ro-Ro Transverse Crossroad',
    x: 260,
    z: 560,
    type: 'crossroad',
    hasTargetMarker: false,
    description: 'Four-way crossroad between Yard 04A, Strip 03A/04A, Yard 03A, and Container Block L04',
  },
  // 9. Mid-Yard 5W Crossroad (Between 03A and 02A)
  {
    id: 'J_MID_5W',
    name: 'J-09: Central Ro-Ro Crossroad (5W / LM)',
    x: 455,
    z: 560,
    type: 'crossroad',
    hasTargetMarker: false,
    description: 'Four-way crossroad between Yard 03A, 02A and Container Aisle L03/L02',
  },
  // 10. Mid-Yard 4W Crossroad (Between 02A and 01A)
  {
    id: 'J_MID_4W',
    name: 'J-10: East Ro-Ro Crossroad (4W / LM)',
    x: 670,
    z: 560,
    type: 'crossroad',
    hasTargetMarker: false,
    description: 'Four-way crossroad between Yard 02A, 01A, CHSE and Container Aisle L02/L01',
  },
  // 11. Mid-Yard Eastern Terminal Point
  {
    id: 'J_MID_EAST',
    name: 'J-11: East Transverse Ro-Ro Terminal',
    x: 885,
    z: 560,
    type: 't_junction',
    hasTargetMarker: false,
    description: 'Connecting transverse logistics road directly to Eastern Deep-Sea Quay Road (Berth 02)',
  },
  // 12. Western South Corner (South of M04)
  {
    id: 'J_WEST_SOUTH_CORNER',
    name: 'J-12: South-West Container Perimeter Junction',
    x: 260,
    z: 670,
    type: 'crossroad',
    hasTargetMarker: false,
    description: 'Connecting western corridor to Southern Ring Road and M04 Empty container yard',
  },
  // 13. South 5W Major Crossroad (Amber Illuminated Node with Red ⨁ Circle in image)
  {
    id: 'J_SOUTH_5W',
    name: 'J-13: South 5W Logistics Crossroad',
    x: 455,
    z: 670,
    type: 'crossroad',
    hasTargetMarker: true,
    markerColor: '#f59e0b',
    description: 'Primary illuminated arterial crossroad connecting 5W Corridor to Southern Ring Road and Yard 02C (Red Target ⨁)',
  },
  // 14. South 4W Major Crossroad (Amber Illuminated Node with Red ⨁ Circle in image)
  {
    id: 'J_SOUTH_4W',
    name: 'J-14: South 4W Logistics Crossroad',
    x: 670,
    z: 670,
    type: 'crossroad',
    hasTargetMarker: true,
    markerColor: '#f59e0b',
    description: 'Primary illuminated arterial crossroad between Yard 02D and Yard 01C (Red Target ⨁)',
  },
  // 15. East-South Corner Junction (Red ⨁ Circle near Berth 01 / 01D in image)
  {
    id: 'J_EAST_SOUTH_CORNER',
    name: 'J-15: East Quay / South Ring Junction',
    x: 885,
    z: 670,
    type: 't_junction',
    hasTargetMarker: true,
    markerColor: '#ef4444',
    description: 'Major intersection connecting South Ring Road to Eastern Berth Quay Road (Red Target ⨁)',
  },
  // 16. Eastern Berth 01 Quayside Crosshair (Red ⨁ in image)
  {
    id: 'J_EAST_BERTH_01',
    name: 'J-16: Eastern Berth 01 Gantry Apron',
    x: 885,
    z: 750,
    type: 't_junction',
    hasTargetMarker: true,
    markerColor: '#ef4444',
    description: 'Quayside gantry crane waypoint alongside Berth 01 (Red Target ⨁)',
  },
  // 17. South-East 01G Yard Corner (Red ⨁ Circle in image)
  {
    id: 'J_EAST_01G_CORNER',
    name: 'J-17: Yard 01G East Buffer Junction',
    x: 885,
    z: 860,
    type: 't_junction',
    hasTargetMarker: true,
    markerColor: '#ef4444',
    description: 'Access junction connecting Yard 01F/01G perimeter to Deep-Sea Quay (Red Target ⨁)',
  },
  // 18. Service Berth / CY01 Apron Junction (Glowing Orange/Red ⨁ Circle in image)
  {
    id: 'J_SERVICE_BERTH',
    name: 'J-18: Service Berth CY01 Access',
    x: 885,
    z: 910,
    type: 't_junction',
    hasTargetMarker: true,
    markerColor: '#f97316',
    description: 'Access terminal junction for Service Berth (105m) and Quayside Apron CY01 (Red Target ⨁)',
  },
  // 19. Main Gate 01 Interchange (West Entrance)
  {
    id: 'J_GATE_01',
    name: 'J-19: Gate 01 Main Security Interchange',
    x: 110,
    z: 670,
    type: 'gate',
    hasTargetMarker: false,
    description: 'Main port vehicular entrance connecting Highway BY2, Workshops, and Customs Yard',
  },
  // 20. Customs Inspection Yard North Entrance
  {
    id: 'J_CUSTOMS_GATE',
    name: 'J-20: Customs Yard Security Gate',
    x: 110,
    z: 750,
    type: 'gate',
    hasTargetMarker: false,
    description: 'Checkpost and security boom gate entering New Customs Inspection Yard',
  },
  // 21. Customs Yard North-East Corner
  {
    id: 'J_CUSTOMS_NE',
    name: 'J-21: Customs Yard North-East Corner',
    x: 280,
    z: 750,
    type: 't_junction',
    hasTargetMarker: false,
    description: 'Turn corner connecting northern access road to eastern perimeter lane of Customs Yard',
  },
  // 22. Customs Yard South-East Corner
  {
    id: 'J_CUSTOMS_SE',
    name: 'J-22: Customs Yard South-East Corner',
    x: 280,
    z: 930,
    type: 't_junction',
    hasTargetMarker: false,
    description: 'Intersection connecting eastern customs lane to southern garden perimeter avenue',
  },
  // 23. South 02CD Aisle Junction
  {
    id: 'J_02CD_SOUTH',
    name: 'J-23: Yard 02C/02D Staging Junction',
    x: 670,
    z: 790,
    type: 't_junction',
    hasTargetMarker: false,
    description: 'Internal feeder junction separating Ro-Ro blocks 02C/02D from 01C/01D',
  },
  // 24. South 01G Western Turn
  {
    id: 'J_01G_SW',
    name: 'J-24: Yard 01G South-West Corner',
    x: 710,
    z: 920,
    type: 't_junction',
    hasTargetMarker: false,
    description: 'Turn junction connecting west staging lane to southern perimeter of block 01G',
  },
  // 25. BY4 Hill Ascent Branch
  {
    id: 'J_BY4_HILL',
    name: 'J-25: BY4 Hill Ascent Junction',
    x: 640,
    z: 245,
    type: 't_junction',
    hasTargetMarker: false,
    description: 'Branch off North Quay road ascending the landscaped forest hill to BY4 HQ',
  },
  // 26. BY4 Port HQ Plaza
  {
    id: 'J_BY4_HQ',
    name: 'J-26: BY4 Port Administration Plaza',
    x: 710,
    z: 120,
    type: 'interchange',
    hasTargetMarker: false,
    description: 'Administrative building forecourt, VIP parking, and Marine Traffic Tower apron',
  },
];

export const ZEBRA_CROSSINGS: ZebraCrossing[] = [
  // Highway BY2 Crosswalk
  { id: 'ZC_BY2', x: 55, z: 670, rotation: 0, width: 28, length: 6 },
  // Gate 01 Security Crosswalk
  { id: 'ZC_GATE01', x: 110, z: 660, rotation: Math.PI / 2, width: 18, length: 5 },
  // North Gate Interchange Crosswalk
  { id: 'ZC_NORTH_GATE', x: 260, z: 235, rotation: 0, width: 22, length: 5 },
  // Ramp 5W North Crosswalk
  { id: 'ZC_RAMP_5W', x: 455, z: 452, rotation: Math.PI / 2, width: 20, length: 5 },
  // Ramp 4W North Crosswalk
  { id: 'ZC_RAMP_4W', x: 670, z: 452, rotation: Math.PI / 2, width: 20, length: 5 },
  // Mid 5W Crosswalk
  { id: 'ZC_MID_5W', x: 455, z: 570, rotation: Math.PI / 2, width: 18, length: 5 },
  // Mid 4W Crosswalk
  { id: 'ZC_MID_4W', x: 670, z: 570, rotation: Math.PI / 2, width: 18, length: 5 },
  // South 5W Crosswalk
  { id: 'ZC_SOUTH_5W', x: 455, z: 660, rotation: 0, width: 22, length: 5 },
  // South 4W Crosswalk
  { id: 'ZC_SOUTH_4W', x: 670, z: 660, rotation: 0, width: 22, length: 5 },
  // Customs Yard Entrance Crosswalk
  { id: 'ZC_CUSTOMS', x: 195, z: 750, rotation: Math.PI / 2, width: 18, length: 5 },
  // Eastern Berth 02 Crosswalk
  { id: 'ZC_EAST_BERTH02', x: 885, z: 600, rotation: 0, width: 24, length: 5 },
  // Eastern Berth 01 Crosswalk
  { id: 'ZC_EAST_BERTH01', x: 885, z: 760, rotation: 0, width: 24, length: 5 },
  // Service Berth CY01 Crosswalk
  { id: 'ZC_CY01', x: 885, z: 900, rotation: 0, width: 20, length: 5 },
];

// ─────────────────────────────────────────────────────────────
// COMPLETE INTERCONNECTED ROADS & HIGHWAYS
// ─────────────────────────────────────────────────────────────
export const ROADS: RoadSegment[] = [
  // 1. West Expressway BY2 (Full North-to-South Heavy Transport Corridor)
  {
    id: 'ROAD_BY2',
    name: 'BY2 Express Highway',
    type: 'highway',
    points: [
      [55, 20],
      [55, 930],
    ],
    widthMeters: 32,
    lengthMeters: 910,
    lanes: 4,
    speedLimitKmH: 50,
    flowDirection: 'bidirectional',
    description: 'West Terminal Heavy Truck Access Corridor BY2 with safety barriers and LED streetlights',
  },

  // 2. BY3 Upper North Perimeter Access Road
  {
    id: 'ROAD_BY3_NORTH',
    name: 'BY3 North Perimeter Road',
    type: 'access',
    points: [
      [55, 22],
      [260, 22],
    ],
    widthMeters: 18,
    lengthMeters: 205,
    lanes: 2,
    speedLimitKmH: 25,
    flowDirection: 'E',
    description: 'Northern boundary road encircling Container Yard BY3 and Stacking Bay K01',
  },

  // 3. Feeder B-C Intermediate Staging Lane
  {
    id: 'ROAD_FEEDER_BC',
    name: 'Feeder B-C Transfer Corridor',
    type: 'secondary',
    points: [
      [55, 228],
      [260, 228],
    ],
    widthMeters: 18,
    lengthMeters: 205,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'E',
    description: 'Direct feeder transfer lane between C-Stack bays and B-Stack staging blocks',
  },

  // 4. Feeder A-B Intermediate Staging Lane
  {
    id: 'ROAD_FEEDER_AB',
    name: 'Feeder A-B Transfer Corridor',
    type: 'secondary',
    points: [
      [55, 335],
      [260, 335],
    ],
    widthMeters: 18,
    lengthMeters: 205,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'E',
    description: 'Direct feeder transfer lane between B-Stack and A-Stack container staging blocks',
  },

  // 5. North Quayside Apron Road (09W–11W)
  {
    id: 'ROAD_NORTH_QUAY',
    name: 'North Quayside Apron (09W–11W)',
    type: 'quay_apron',
    points: [
      [260, 245],
      [885, 245],
    ],
    widthMeters: 36,
    lengthMeters: 625,
    lanes: 4,
    speedLimitKmH: 30,
    flowDirection: 'E',
    description: 'Primary heavy equipment and vessel discharge apron alongside Berths 09, 10, 11',
  },

  // 6. BY4 Hill Ascent Driveway
  {
    id: 'ROAD_BY4_ASCENT',
    name: 'BY4 Hill Ascent Driveway',
    type: 'access',
    points: [
      [640, 245],
      [710, 120],
    ],
    widthMeters: 16,
    lengthMeters: 143,
    lanes: 2,
    speedLimitKmH: 25,
    flowDirection: 'bidirectional',
    description: 'Access driveway winding through landscaped forest hill up to BY4 Port HQ',
  },

  // 7. BY4 Headquarters Administration Loop
  {
    id: 'ROAD_BY4_LOOP',
    name: 'BY4 Headquarters Garden Loop',
    type: 'access',
    points: [
      [640, 120],
      [780, 120],
    ],
    widthMeters: 16,
    lengthMeters: 140,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'bidirectional',
    description: 'Access driveway circling the landscaped gardens and BY4 administrative complex',
  },

  // 8. West Container Spine Road
  {
    id: 'ROAD_CONTAINER_SPINE',
    name: 'Container Terminal Access Road',
    type: 'primary',
    points: [
      [260, 22],
      [260, 442],
    ],
    widthMeters: 24,
    lengthMeters: 420,
    lanes: 3,
    speedLimitKmH: 30,
    flowDirection: 'S',
    description: 'Container transfer spine connecting BY3 Stacking bays to Quayside Berth 06',
  },

  // 9. Central Basin Quayside Dock Road (Berths 06, 5W, 4W, 04)
  {
    id: 'ROAD_CENTRAL_QUAY',
    name: 'Central Basin Quayside Road (06–04)',
    type: 'quay_apron',
    points: [
      [260, 442],
      [885, 442],
    ],
    widthMeters: 28,
    lengthMeters: 625,
    lanes: 3,
    speedLimitKmH: 25,
    flowDirection: 'E',
    description: 'Ro-Ro discharge apron servicing Ramps 5W, 4W and Berth 04',
  },

  // 10. Ramp 5W Quayside Discharge Feed
  {
    id: 'ROAD_RAMP_5W_FEED',
    name: 'Ramp 5W Vessel Feed Lane',
    type: 'access',
    points: [
      [455, 420],
      [455, 442],
    ],
    widthMeters: 20,
    lengthMeters: 22,
    lanes: 2,
    speedLimitKmH: 15,
    flowDirection: 'S',
    description: 'Ro-Ro stern ramp direct discharge connection to 5W central quayside',
  },

  // 11. Ramp 4W Quayside Discharge Feed
  {
    id: 'ROAD_RAMP_4W_FEED',
    name: 'Ramp 4W Vessel Feed Lane',
    type: 'access',
    points: [
      [670, 420],
      [670, 442],
    ],
    widthMeters: 20,
    lengthMeters: 22,
    lanes: 2,
    speedLimitKmH: 15,
    flowDirection: 'S',
    description: 'Ro-Ro stern ramp direct discharge connection to 4W central quayside',
  },

  // 12. Western Ro-Ro Aisle (Between Yard 04A and Yard 03A)
  {
    id: 'ROAD_WEST_RORO_AISLE',
    name: 'West Ro-Ro Aisle (04A / 03A)',
    type: 'primary',
    points: [
      [260, 442],
      [260, 670],
    ],
    widthMeters: 22,
    lengthMeters: 228,
    lanes: 2,
    speedLimitKmH: 25,
    flowDirection: 'S',
    description: 'Internal Ro-Ro vehicle staging lane passing between Yard 04A, Strip 03A/04A, and Yard 03A',
  },

  // 13. Ro-Ro Central Boulevard (Ramp 5W North-South Corridor)
  {
    id: 'ROAD_5W_BOULEVARD',
    name: 'Ro-Ro Central Boulevard (5W Corridor)',
    type: 'primary',
    points: [
      [455, 442],
      [455, 670],
    ],
    widthMeters: 22,
    lengthMeters: 228,
    lanes: 2,
    speedLimitKmH: 25,
    flowDirection: 'S',
    description: 'Primary vehicle transfer artery from Ramp 5W passing between Yards 03A, 02A and L03/L02',
  },

  // 14. Ro-Ro Feeder Boulevard (Ramp 4W North-South Corridor)
  {
    id: 'ROAD_4W_BOULEVARD',
    name: 'Ro-Ro Feeder Boulevard (4W Corridor)',
    type: 'primary',
    points: [
      [670, 442],
      [670, 670],
    ],
    widthMeters: 22,
    lengthMeters: 228,
    lanes: 2,
    speedLimitKmH: 25,
    flowDirection: 'S',
    description: 'Vehicle transfer artery from Ramp 4W passing between Yards 02A, 01A and L02/L01',
  },

  // 15. Eastern Deep-Sea Berth Road (Along Berths 03, 02, 01, Service Berth)
  {
    id: 'ROAD_EAST_BERTH',
    name: 'East Deep-Sea Berth Road (02–01)',
    type: 'primary',
    points: [
      [885, 442],
      [885, 930],
    ],
    widthMeters: 26,
    lengthMeters: 488,
    lanes: 3,
    speedLimitKmH: 30,
    flowDirection: 'S',
    description: 'Quayside transit road running along Eastern Berths 03, 02, 01, and Service Berth with QC Rail Line',
  },

  // 16. Transverse Logistics Lane 1 (Between Car Yards 04A-01A and Container Stacks L04-M01)
  {
    id: 'ROAD_MID_AISLE_1',
    name: 'Transverse Logistics Lane (RoRo/Container)',
    type: 'secondary',
    points: [
      [110, 560],
      [885, 560],
    ],
    widthMeters: 20,
    lengthMeters: 775,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'E',
    description: 'Internal shunter road with illuminated green directional flow markings',
  },

  // 17. Transverse Logistics Lane 2 (Between L-blocks and M-blocks)
  {
    id: 'ROAD_MID_AISLE_2',
    name: 'Container Shunter Aisle (L/M Internal)',
    type: 'secondary',
    points: [
      [110, 618],
      [885, 618],
    ],
    widthMeters: 18,
    lengthMeters: 775,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'E',
    description: 'Internal transfer aisle between loaded (LDN) and empty (DOG/MTY) container bays',
  },

  // 18. South Yard Arterial Ring Road (Main East-West Highway connecting Gate 01 to East Berth)
  {
    id: 'ROAD_SOUTH_RING',
    name: 'South Yard Perimeter Ring Road',
    type: 'primary',
    points: [
      [110, 670],
      [885, 670],
    ],
    widthMeters: 24,
    lengthMeters: 775,
    lanes: 3,
    speedLimitKmH: 30,
    flowDirection: 'bidirectional',
    description: 'Perimeter arterial road connecting Gate 01, Workshops, South 5W/4W Crossroads, and Eastern Berths',
  },

  // 19. South-East Internal Staging Lane (Separating 02C/02D from 01C/01D)
  {
    id: 'ROAD_02_01_CONNECTOR',
    name: 'South-East Staging Connector (02/01)',
    type: 'secondary',
    points: [
      [670, 670],
      [670, 790],
    ],
    widthMeters: 18,
    lengthMeters: 120,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'S',
    description: 'Internal road between Ro-Ro blocks 02C/02D and 01C/01D',
  },

  // 20. South 02CD Aisle Loop Lane
  {
    id: 'ROAD_02CD_LOOP',
    name: 'Yard 02CD South Loop Lane',
    type: 'secondary',
    points: [
      [500, 790],
      [670, 790],
    ],
    widthMeters: 18,
    lengthMeters: 170,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'E',
    description: 'Southern access lane serving Ro-Ro vehicle yards 02C and 02D',
  },

  // 21. West Staging Lane of 01E, 01F, 01G
  {
    id: 'ROAD_01C_01G_WEST',
    name: 'Yard 01E–01G West Access Lane',
    type: 'secondary',
    points: [
      [710, 790],
      [710, 920],
    ],
    widthMeters: 18,
    lengthMeters: 130,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'S',
    description: 'Staging lane west of tiered vehicle blocks 01E, 01F, 01G',
  },

  // 22. South Perimeter Lane of 01G (Connecting to CY01)
  {
    id: 'ROAD_01G_SOUTH',
    name: 'Yard 01G South Access Lane',
    type: 'secondary',
    points: [
      [710, 920],
      [885, 920],
    ],
    widthMeters: 18,
    lengthMeters: 175,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'E',
    description: 'Southernmost perimeter road of block 01G connecting to CY01 and Service Berth',
  },

  // 23. Gate 01 & Customs Main Avenue (West Boundary Corridor)
  {
    id: 'ROAD_CUSTOMS_WEST',
    name: 'Gate 01 & Customs Security Avenue',
    type: 'primary',
    points: [
      [110, 670],
      [110, 930],
    ],
    widthMeters: 22,
    lengthMeters: 260,
    lanes: 2,
    speedLimitKmH: 25,
    flowDirection: 'S',
    description: 'Heavy security corridor from Gate 01 along the west side of Customs Inspection Yard',
  },

  // 24. Customs Inspection Yard North Entrance Road
  {
    id: 'ROAD_CUSTOMS_NORTH',
    name: 'Customs Yard North Access Road',
    type: 'secondary',
    points: [
      [110, 750],
      [280, 750],
    ],
    widthMeters: 18,
    lengthMeters: 170,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'E',
    description: 'Security entrance road from Gate 01 into New Customs Inspection Yard',
  },

  // 25. Customs Inspection Yard East Perimeter Road
  {
    id: 'ROAD_CUSTOMS_EAST',
    name: 'Customs Yard East Perimeter Road',
    type: 'secondary',
    points: [
      [280, 750],
      [280, 930],
    ],
    widthMeters: 18,
    lengthMeters: 180,
    lanes: 2,
    speedLimitKmH: 20,
    flowDirection: 'S',
    description: 'Eastern boundary road of New Customs Inspection Yard',
  },

  // 26. Customs Yard South Loop & Landscape Boulevard
  {
    id: 'ROAD_CUSTOMS_SOUTH',
    name: 'South Terminal Perimeter Avenue',
    type: 'secondary',
    points: [
      [110, 930],
      [500, 930],
    ],
    widthMeters: 20,
    lengthMeters: 390,
    lanes: 2,
    speedLimitKmH: 25,
    flowDirection: 'E',
    description: 'Southernmost boundary road circling Customs Yard and landscaped gardens',
  },
];

// ─────────────────────────────────────────────────────────────
// HIGH-MAST LIGHTING TOWERS
// ─────────────────────────────────────────────────────────────
export const LIGHT_POLES: LightPole[] = [
  // Highway BY2 masts
  { x: 45, z: 80, height: 18, intensity: 1.8, color: '#ffb703' },
  { x: 45, z: 240, height: 18, intensity: 1.8, color: '#ffb703' },
  { x: 45, z: 420, height: 18, intensity: 1.8, color: '#ffb703' },
  { x: 45, z: 600, height: 18, intensity: 1.8, color: '#ffb703' },

  // Container yard BY3 masts
  { x: 120, z: 40, height: 22, intensity: 2.2, color: '#ffe49e' },
  { x: 260, z: 40, height: 22, intensity: 2.2, color: '#ffe49e' },
  { x: 120, z: 230, height: 22, intensity: 2.2, color: '#ffe49e' },
  { x: 260, z: 230, height: 22, intensity: 2.2, color: '#ffe49e' },
  { x: 120, z: 430, height: 22, intensity: 2.2, color: '#ffe49e' },
  { x: 260, z: 430, height: 22, intensity: 2.2, color: '#ffe49e' },

  // North Quay Berths 09-11
  { x: 300, z: 240, height: 24, intensity: 2.5, color: '#fff4cc' },
  { x: 480, z: 240, height: 24, intensity: 2.5, color: '#fff4cc' },
  { x: 660, z: 240, height: 24, intensity: 2.5, color: '#fff4cc' },
  { x: 800, z: 240, height: 24, intensity: 2.5, color: '#fff4cc' },

  // Central Basin Quay Berths 06-04
  { x: 300, z: 440, height: 24, intensity: 2.5, color: '#fff4cc' },
  { x: 470, z: 440, height: 24, intensity: 2.5, color: '#fff4cc' },
  { x: 620, z: 440, height: 24, intensity: 2.5, color: '#fff4cc' },
  { x: 780, z: 440, height: 24, intensity: 2.5, color: '#fff4cc' },

  // Central Ro-Ro yards
  { x: 450, z: 560, height: 20, intensity: 2.0, color: '#ffd166' },
  { x: 650, z: 560, height: 20, intensity: 2.0, color: '#ffd166' },
  { x: 860, z: 560, height: 20, intensity: 2.0, color: '#ffd166' },

  // South-East Ro-Ro yards
  { x: 680, z: 740, height: 20, intensity: 2.0, color: '#ffd166' },
  { x: 880, z: 740, height: 20, intensity: 2.0, color: '#ffd166' },
  { x: 880, z: 880, height: 20, intensity: 2.0, color: '#ffd166' },

  // Customs Yard & Park
  { x: 130, z: 760, height: 20, intensity: 2.0, color: '#ffe49e' },
  { x: 280, z: 760, height: 20, intensity: 2.0, color: '#ffe49e' },
  { x: 130, z: 920, height: 20, intensity: 2.0, color: '#ffe49e' },
  { x: 280, z: 920, height: 20, intensity: 2.0, color: '#ffe49e' },
];

// ─────────────────────────────────────────────────────────────
// TREE CLUSTERS (Landscape Gardens)
// ─────────────────────────────────────────────────────────────
export interface TreePosition {
  x: number;
  z: number;
  scale: number;
}

export const TREE_CLUSTERS: TreePosition[] = [
  // BY4 Park (Top Right)
  { x: 620, z: 50, scale: 1.1 }, { x: 635, z: 40, scale: 0.9 }, { x: 650, z: 65, scale: 1.3 },
  { x: 670, z: 35, scale: 1.0 }, { x: 685, z: 55, scale: 1.2 }, { x: 740, z: 40, scale: 1.1 },
  { x: 765, z: 35, scale: 1.4 }, { x: 790, z: 50, scale: 1.0 }, { x: 815, z: 65, scale: 1.2 },
  { x: 630, z: 100, scale: 1.2 }, { x: 645, z: 120, scale: 1.0 }, { x: 660, z: 140, scale: 1.3 },
  { x: 770, z: 110, scale: 1.1 }, { x: 790, z: 130, scale: 1.2 }, { x: 810, z: 110, scale: 1.0 },
  { x: 830, z: 130, scale: 1.3 }, { x: 840, z: 90, scale: 1.1 }, { x: 860, z: 70, scale: 1.2 },

  // South-West Park (Around Customs Yard)
  { x: 340, z: 710, scale: 1.2 }, { x: 360, z: 730, scale: 1.1 }, { x: 380, z: 705, scale: 1.3 },
  { x: 400, z: 735, scale: 1.0 }, { x: 420, z: 715, scale: 1.2 }, { x: 440, z: 740, scale: 1.1 },
  { x: 350, z: 780, scale: 1.3 }, { x: 375, z: 800, scale: 1.2 }, { x: 410, z: 790, scale: 1.0 },
  { x: 430, z: 820, scale: 1.2 }, { x: 360, z: 860, scale: 1.1 }, { x: 390, z: 880, scale: 1.4 },
  { x: 415, z: 865, scale: 1.2 }, { x: 440, z: 890, scale: 1.1 }, { x: 370, z: 920, scale: 1.0 },
  { x: 400, z: 935, scale: 1.3 }, { x: 430, z: 940, scale: 1.2 }, { x: 460, z: 920, scale: 1.1 },
  { x: 100, z: 690, scale: 1.0 }, { x: 120, z: 705, scale: 1.2 }, { x: 80, z: 880, scale: 1.1 },
];

// ─────────────────────────────────────────────────────────────
// METADATA & OPERATIONS
// ─────────────────────────────────────────────────────────────
export const CATEGORY_META: Record<YardCategory, { label: string; color: string; glowColor: string }> = {
  container:    { label: 'Container Terminal',   color: '#1d3557', glowColor: '#00d4ff' },
  roro:         { label: 'Ro-Ro Vehicle Yard',   color: '#1a2230', glowColor: '#06d6a0' },
  feeder:       { label: 'Feeder Transfer Yard', color: '#f9c74f', glowColor: '#ffd166' },
  ro_ro_large:  { label: 'Heavy Equipment Yard', color: '#7f4f24', glowColor: '#e76f51' },
  customs:      { label: 'Customs Inspection',   color: '#1e2d3b', glowColor: '#e63946' },
  service:      { label: 'Service & Aprons',     color: '#ffd166', glowColor: '#ffb703' },
  building:     { label: 'Terminal Facilities',   color: '#2b3a4a', glowColor: '#00b4d8' },
  berth:        { label: 'Deep Sea Berths',      color: '#4a90e2', glowColor: '#50e3c2' },
  water:        { label: 'Harbor Basin',         color: '#081726', glowColor: '#0077b6' },
  road:         { label: 'Logistics Highway',    color: '#111827', glowColor: '#48bb78' },
};

export const DEMO_OCCUPANCY: Record<string, { capacity: number; occupied: number; status: 'nominal' | 'warning' | 'critical' }> = {
  CONT_K01_C09_C01: { capacity: 1850, occupied: 1480, status: 'warning' },
  CONT_B01_B06:     { capacity: 1100, occupied: 870,  status: 'nominal' },
  CONT_A01_A06:     { capacity: 1100, occupied: 960,  status: 'critical' },
  RORO_04A:         { capacity: 1250, occupied: 1100, status: 'critical' },
  RORO_03A:         { capacity: 1800, occupied: 1540, status: 'warning' },
  RORO_02A:         { capacity: 1950, occupied: 1680, status: 'warning' },
  RORO_01A:         { capacity: 980,  occupied: 820,  status: 'warning' },
  CONT_L04:         { capacity: 450,  occupied: 380,  status: 'warning' },
  CONT_M04:         { capacity: 450,  occupied: 320,  status: 'nominal' },
  CONT_L03:         { capacity: 550,  occupied: 490,  status: 'critical' },
  CONT_M03:         { capacity: 550,  occupied: 460,  status: 'warning' },
  CONT_L02:         { capacity: 600,  occupied: 540,  status: 'critical' },
  CONT_M02:         { capacity: 600,  occupied: 520,  status: 'warning' },
  CONT_H01:         { capacity: 400,  occupied: 370,  status: 'critical' },
  CONT_H02:         { capacity: 400,  occupied: 350,  status: 'warning' },
  CONT_L01:         { capacity: 550,  occupied: 510,  status: 'critical' },
  CONT_M01:         { capacity: 550,  occupied: 480,  status: 'warning' },
  RORO_02C:         { capacity: 750,  occupied: 620,  status: 'warning' },
  RORO_02D:         { capacity: 750,  occupied: 690,  status: 'critical' },
  RORO_01C:         { capacity: 850,  occupied: 780,  status: 'critical' },
  RORO_01D:         { capacity: 850,  occupied: 740,  status: 'warning' },
  RORO_01E:         { capacity: 520,  occupied: 460,  status: 'warning' },
  RORO_01F:         { capacity: 520,  occupied: 490,  status: 'critical' },
  RORO_01G:         { capacity: 520,  occupied: 440,  status: 'nominal' },
  CUSTOMS_INSPECTION_YARD: { capacity: 800, occupied: 580, status: 'nominal' },
  FEEDER_BC:        { capacity: 500,  occupied: 320,  status: 'nominal' },
  FEEDER_AB:        { capacity: 500,  occupied: 280,  status: 'nominal' },
  ZONE_CHSE:        { capacity: 80,   occupied: 45,   status: 'nominal' },
  APRON_09W:        { capacity: 350,  occupied: 180,  status: 'nominal' },
  APRON_10W:        { capacity: 350,  occupied: 120,  status: 'nominal' },
  APRON_11W:        { capacity: 350,  occupied: 240,  status: 'nominal' },
  APRON_5W:         { capacity: 220,  occupied: 140,  status: 'nominal' },
  APRON_4W:         { capacity: 250,  occupied: 180,  status: 'nominal' },
  APRON_CY01:       { capacity: 60,   occupied: 25,   status: 'nominal' },
  STRIP_03A_04A:    { capacity: 120,  occupied: 80,   status: 'nominal' },
};

export const DEMO_ALERTS = [
  { id: 'ALT-1', type: 'critical', block: 'Berth 09', message: 'MV GLOVIS SUNRISE discharge rate at 180 cars/hr. Yard 04A near full (88%).' },
  { id: 'ALT-2', type: 'warning',  block: 'Customs Yard', message: 'Gate 01 scanner backlog — 42 units pending clearance inspection.' },
  { id: 'ALT-3', type: 'nominal',  block: 'Berth 11', message: 'MV HOEGH TARGET loading commences at 02:00. High-heavy gang standing by.' },
];

export const DEMO_INCOMING_VESSEL = {
  name: 'MV GLOVIS SUNRISE',
  eta: 'TODAY 21:30 (MOORED)',
  totalVehicles: 3450,
  vehicles: [
    { type: 'SUVs & Sedans', planned: 2400, processed: 1850, remaining: 550 },
    { type: 'Commercial Vans', planned: 650, processed: 480, remaining: 170 },
    { type: 'Heavy Equipment', planned: 400, processed: 180, remaining: 220 },
  ],
};

export const DEMO_OUTGOING = [
  { type: 'Transshipment Ro-Ro', planned: 1200, completed: 920, remaining: 280 },
  { type: 'Domestic Customs Gate 01', planned: 450, completed: 390, remaining: 60 },
  { type: 'Direct Rail Corridor', planned: 250, completed: 250, remaining: 0 },
];
