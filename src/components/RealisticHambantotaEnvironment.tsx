// ============================================================
// HIPG HAMBANTOTA INTERNATIONAL PORT - REGIONAL COASTAL DIGITAL TWIN
// Exact 1:1 Geographical Reconstruction Matching Google Satellite Map:
// 1. Vast Sri Lankan Mainland covering entire North, West & East
// 2. Inner Harbor Basin carved into the land around Central Yard
// 3. Karagan Lewaya diagonal rock dyke (North-East bund)
// 4. South Coastal Mainland (Gate 1, CGHW Highway, Mirijjawila)
// 5. Mirijjawila Bean-Shaped Breakwater Island & Hook (Starboard Green Lighthouse)
// 6. East Headland & Hambanthota Harbour Breakwater (Port Red Lighthouse)
// 7. Southern Deep-Water Entrance Channel flanked by both breakwaters
// 8. Rotala Wewa Wetland Lake & Southern Expressway Corridor Westward
// ============================================================

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  getMainlandTerrainTexture,
  getBeachSandTexture,
  getBreakwaterStoneTexture,
  getWaterFoamTexture,
  getConcretePavementTexture,
  getAsphaltTexture,
} from '@/lib/portMaterials';

const SCALE = 0.1;
function worldX(x: number) { return (x - 500) * SCALE; }
function worldZ(z: number) { return (z - 500) * SCALE; }
function worldW(w: number) { return w * SCALE; }
function worldD(d: number) { return d * SCALE; }

/**
 * Animated Coastal Wave Foam Breaking on Golden Sand Beach
 */
function BreakingSurfFoam({
  position,
  width,
  depth,
  rotation = [-Math.PI / 2, 0, 0],
}: {
  position: [number, number, number];
  width: number;
  depth: number;
  rotation?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const foamTex = useMemo(() => getWaterFoamTexture(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.z = position[2] + Math.sin(t * 1.4) * 0.12;
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 0.45 + Math.sin(t * 1.4) * 0.25;
  });

  return (
    <mesh ref={meshRef} rotation={rotation} position={position}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial
        map={foamTex}
        color="#e0f2fe"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/**
 * Breakwater Head Navigation Lighthouse with Flashing Marine Beacon
 */
function BreakwaterLighthouse({
  position,
  beaconColor,
  flashSpeed = 2.5,
  name,
}: {
  position: [number, number, number];
  beaconColor: string;
  flashSpeed?: number;
  name: string;
}) {
  const lightRef = useRef<THREE.PointLight>(null!);
  const lanternRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flash = Math.sin(t * flashSpeed) > 0.35 ? 1.0 : 0.08;
    if (lightRef.current) lightRef.current.intensity = flash * 3.5;
    if (lanternRef.current) {
      (lanternRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flash * 4.0;
    }
  });

  return (
    <group position={position} name={name}>
      {/* Heavy Concrete Octagonal Caisson Base */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 2.2, 0.8, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Main White Tapered Lighthouse Tower */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.9, 2.0, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* High-visibility daymark band (Red or Green) */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.73, 0.78, 0.6, 16]} />
        <meshStandardMaterial color={beaconColor} roughness={0.4} />
      </mesh>

      {/* Upper Gallery Catwalk */}
      <mesh position={[0, 2.85, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.08, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      <mesh position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.96, 0.96, 0.22, 16]} />
        <meshStandardMaterial color="#eab308" wireframe />
      </mesh>

      {/* Glass Lantern Housing with Marine Fresnel Optic */}
      <mesh ref={lanternRef} position={[0, 3.25, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.52, 12]} />
        <meshStandardMaterial
          color={beaconColor}
          emissive={beaconColor}
          emissiveIntensity={1.0}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Domed Lantern Roof & Lightning Rod */}
      <mesh position={[0, 3.65, 0]}>
        <sphereGeometry args={[0.48, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
      <mesh position={[0, 4.05, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>

      {/* Flashing Maritime Navigation Point Light */}
      <pointLight
        ref={lightRef}
        position={[0, 3.3, 0]}
        color={beaconColor}
        distance={30}
        decay={2}
      />
    </group>
  );
}

/**
 * Floating Maritime Navigation Channel Fairway Buoy
 */
function ChannelBuoy({
  position,
  color,
  flashSpeed = 2.0,
}: {
  position: [number, number, number];
  color: string;
  flashSpeed?: number;
}) {
  const buoyRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    if (!buoyRef.current) return;
    const t = clock.getElapsedTime();
    buoyRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.035;
    buoyRef.current.rotation.z = Math.cos(t * 1.2 + position[2]) * 0.06;
    buoyRef.current.rotation.x = Math.sin(t * 1.1 + position[0]) * 0.05;

    const flash = Math.sin(t * flashSpeed) > 0.6 ? 1 : 0.05;
    if (lightRef.current) lightRef.current.intensity = flash * 1.8;
  });

  return (
    <group ref={buoyRef} position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.22, 0.32, 0.5, 10]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.08, 0.18, 0.35, 6]} />
        <meshStandardMaterial color="#0f172a" wireframe />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.85, 0]} color={color} distance={12} decay={2} />
    </group>
  );
}

/**
 * Tropical Coastal Palm Tree Cluster
 */
function CoastalPalmTreeCluster({ x, z, count = 5 }: { x: number; z: number; count?: number }) {
  const palmTransforms = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      ox: (Math.random() - 0.5) * 6,
      oz: (Math.random() - 0.5) * 6,
      h: 2.2 + Math.random() * 1.4,
      rotY: Math.random() * Math.PI * 2,
      lean: (Math.random() - 0.5) * 0.25,
    }));
  }, [count]);

  return (
    <group position={[worldX(x), 0.04, worldZ(z)]}>
      {palmTransforms.map((p, i) => (
        <group key={`palm-${i}`} position={[p.ox, 0, p.oz]} rotation={[p.lean, p.rotY, p.lean * 0.5]}>
          <mesh position={[0, p.h / 2, 0]}>
            <cylinderGeometry args={[0.07, 0.14, p.h, 6]} />
            <meshStandardMaterial color="#57422f" roughness={0.9} />
          </mesh>
          <group position={[0, p.h, 0]}>
            {[0, 1, 2, 3, 4, 5, 6].map((fi) => (
              <mesh
                key={`frond-${fi}`}
                position={[0, -0.05, 0]}
                rotation={[0.45, (fi * Math.PI * 2) / 7, -0.2]}
              >
                <coneGeometry args={[0.55, 1.4, 4]} />
                <meshStandardMaterial color="#2d5a27" roughness={0.7} />
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  );
}

export function RealisticHambantotaEnvironment() {
  const terrainTex = useMemo(() => getMainlandTerrainTexture(), []);
  const sandTex = useMemo(() => getBeachSandTexture(), []);
  const rockTex = useMemo(() => getBreakwaterStoneTexture(), []);
  const concreteTex = useMemo(() => getConcretePavementTexture(), []);
  const asphaltTex = useMemo(() => getAsphaltTexture(), []);

  return (
    <group name="Hambantota_Satellite_Environment">
      {/* ─────────────────────────────────────────────────────────────
          1. NORTH MAINLAND (Covering the entire upper horizon)
          Spans z: 240 north to -2200, x: -2200 to 2800
          ───────────────────────────────────────────────────────────── */}
      <group name="North_Mainland_Continent">
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(300), 0.02, worldZ(-980)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(5000), worldD(2440)]} />
          <meshStandardMaterial map={terrainTex} roughness={0.9} metalness={0.05} />
        </mesh>

        {/* North Quay Concrete Apron (Berths 09-11 running along z: 240, x: 180 to 1100) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(640), 0.038, worldZ(225)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(920), worldD(30)]} />
          <meshStandardMaterial map={concreteTex} roughness={0.7} />
        </mesh>

        {/* West Container/RoRo Yard Extension (Vertical strip extending North on top-left) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(220), 0.038, worldZ(-40)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(80), worldD(500)]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.75} />
        </mesh>

        {/* BY4 Administration Promontory Hill & HQ */}
        <group position={[worldX(760), 0, worldZ(80)]}>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[worldW(160), worldW(240), 1.8, 16]} />
            <meshStandardMaterial map={terrainTex} roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[worldW(85), 0.75, worldD(65)]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.1} />
          </mesh>
          {/* VTMS Radar Tower with Red Aviation Beacon */}
          <group position={[worldW(55), 1.8, -worldD(20)]}>
            <mesh position={[0, 2.2, 0]}>
              <cylinderGeometry args={[0.08, 0.35, 4.4, 4]} />
              <meshStandardMaterial color="#dc2626" wireframe />
            </mesh>
            <mesh position={[0, 4.4, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.08, 8]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 4.8, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
            </mesh>
            <pointLight position={[0, 4.8, 0]} color="#ef4444" distance={15} decay={2} />
          </group>
          {/* Oil Storage Tanks */}
          {[-worldW(70), -worldW(110)].map((tx, ti) => (
            <mesh key={`tank-${ti}`} position={[tx, 1.8, worldD(20)]} castShadow>
              <cylinderGeometry args={[1.6, 1.6, 1.8, 20]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.3} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. WEST MAINLAND (Covering the entire left horizon)
          Spans x: 260 west to -2200, z: 240 to 1680
          ───────────────────────────────────────────────────────────── */}
      <group name="West_Mainland_Plains">
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(-970), 0.02, worldZ(960)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(2460), worldD(1440)]} />
          <meshStandardMaterial map={terrainTex} roughness={0.9} metalness={0.05} />
        </mesh>

        {/* Southern Expressway Corridor Extending Westward */}
        <mesh position={[worldX(-600), 0.038, worldZ(910)]} receiveShadow>
          <boxGeometry args={[worldW(1260), 0.03, worldD(34)]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.65} metalness={0.2} />
        </mesh>
        <mesh position={[worldX(-600), 0.08, worldZ(910)]}>
          <boxGeometry args={[worldW(1260), 0.12, 0.15]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>

        {/* West Port Security Boundary Wall */}
        <mesh position={[worldX(25), 0.5, worldZ(680)]} castShadow>
          <boxGeometry args={[0.25, 0.95, worldD(520)]} />
          <meshStandardMaterial map={concreteTex} roughness={0.8} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. SOUTH MAINLAND (Directly below Yard: Gate 1, CGHW Hwy, Mirijjawila)
          Spanning z: 920 to 1640, x: -400 to 1020
          ───────────────────────────────────────────────────────────── */}
      <group name="South_Coastal_Mainland">
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(310), 0.022, worldZ(1280)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(1420), worldD(720)]} />
          <meshStandardMaterial map={terrainTex} roughness={0.9} metalness={0.05} />
        </mesh>

        {/* CGHW Highway (Colombo - Galle - Hambantota - Wellawaya Highway) */}
        <mesh
          position={[worldX(260), 0.038, worldZ(1420)]}
          rotation={[0, -0.06, 0]}
          receiveShadow
        >
          <boxGeometry args={[worldW(1300), 0.03, worldD(22)]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Gate 01 Roundabout & Access Roads */}
        <group position={[worldX(280), 0.036, worldZ(1050)]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[worldW(14), worldW(32), 32]} />
            <meshStandardMaterial map={asphaltTex} roughness={0.7} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[worldW(13.8), 24]} />
            <meshStandardMaterial color="#1b4d24" roughness={0.9} />
          </mesh>
          <mesh position={[-worldW(50), 0, -worldD(60)]} rotation={[0, 0.45, 0]} receiveShadow>
            <boxGeometry args={[worldW(20), 0.02, worldD(120)]} />
            <meshStandardMaterial map={asphaltTex} />
          </mesh>
        </group>

        {/* Western Straight Beach Coastline (Facing Indian Ocean along z: 1640 - 1700) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(-200), 0.024, worldZ(1670)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(1600), worldD(60)]} />
          <meshStandardMaterial map={sandTex} roughness={0.85} />
        </mesh>

        {/* Breaking Surf Foam along Western Beach */}
        <BreakingSurfFoam
          position={[worldX(-200), 0.028, worldZ(1700)]}
          width={worldW(1600)}
          depth={2.6}
        />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. MIRIJJAWILA BEAN-SHAPED BREAKWATER ISLAND & HOOK
          Located at x: 650 to 1350, z: 1680 to 1920
          Matches the distinctive island peninsula in Google Satellite Map
          ───────────────────────────────────────────────────────────── */}
      <group name="Mirijjawila_Breakwater_Island">
        {/* Elongated Bean-Shaped Island Core (Sandy Scrub Interior) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(880), 0.08, worldZ(1760)]}
          receiveShadow
        >
          <cylinderGeometry args={[worldW(160), worldW(190), 0.35, 24]} />
          <meshStandardMaterial map={terrainTex} roughness={0.85} />
        </mesh>

        {/* Seaward Curved Rock Armor Seawall (Sweeping around southern arc) */}
        {[
          { x: 680, z: 1720, rot: -0.55, len: 140, w: 42 },
          { x: 750, z: 1800, rot: -0.15, len: 150, w: 45 },
          { x: 840, z: 1850, rot: 0.25, len: 160, w: 48 },
          { x: 950, z: 1870, rot: 0.65, len: 160, w: 50 },
          { x: 1060, z: 1850, rot: 1.15, len: 150, w: 50 },
        ].map((seg, si) => (
          <group key={`island-seawall-${si}`} position={[worldX(seg.x), 0.32, worldZ(seg.z)]} rotation={[0, seg.rot, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[worldW(seg.w), 1.0, worldD(seg.len)]} />
              <meshStandardMaterial map={rockTex} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.55, 0]} receiveShadow>
              <boxGeometry args={[worldW(seg.w * 0.4), 0.12, worldD(seg.len)]} />
              <meshStandardMaterial map={concreteTex} roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Straight Eastward Breakwater Extension Arm */}
        <group position={[worldX(1180), 0.32, worldZ(1820)]} rotation={[0, 1.45, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[worldW(48), 1.0, worldD(220)]} />
            <meshStandardMaterial map={rockTex} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.55, 0]} receiveShadow>
            <boxGeometry args={[worldW(22), 0.12, worldD(220)]} />
            <meshStandardMaterial map={concreteTex} roughness={0.7} />
          </mesh>
        </group>

        {/* Breakwater Head (Seaward Tip) */}
        <mesh position={[worldX(1280), 0.35, worldZ(1800)]} castShadow receiveShadow>
          <cylinderGeometry args={[2.8, 3.8, 1.2, 16]} />
          <meshStandardMaterial map={rockTex} roughness={0.85} />
        </mesh>

        {/* STARBOARD LIGHTHOUSE (Green Flashing Beacon on South Breakwater Head) */}
        <BreakwaterLighthouse
          position={[worldX(1280), 0.95, worldZ(1800)]}
          beaconColor="#22c55e"
          flashSpeed={2.8}
          name="South_Breakwater_Starboard_Lighthouse"
        />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. EAST HEADLAND & HAMBANTHOTA TOWN PROMONTORY
          Spans x: 1550 east to 2800, z: 550 to 1650
          ───────────────────────────────────────────────────────────── */}
      <group name="East_Headland_Hambanthota">
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(2175), 0.02, worldZ(1100)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(1250), worldD(1100)]} />
          <meshStandardMaterial map={terrainTex} roughness={0.9} metalness={0.05} />
        </mesh>

        {/* Tangalle - Hambantota Coastal Highway */}
        <mesh
          position={[worldX(1850), 0.038, worldZ(1100)]}
          rotation={[0, 0.24, 0]}
          receiveShadow
        >
          <boxGeometry args={[worldW(20), 0.03, worldD(1000)]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.7} />
        </mesh>

        {/* East Breakwater (Hook-shaped rock mole guarding entrance from East) */}
        <group name="East_Harbour_Breakwater">
          <mesh
            position={[worldX(1520), 0.35, worldZ(1620)]}
            rotation={[0, -0.45, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[worldW(55), 1.0, worldD(260)]} />
            <meshStandardMaterial map={rockTex} roughness={0.85} />
          </mesh>

          {/* East Breakwater Head */}
          <mesh position={[worldX(1420), 0.35, worldZ(1720)]} castShadow receiveShadow>
            <cylinderGeometry args={[2.5, 3.4, 1.2, 16]} />
            <meshStandardMaterial map={rockTex} roughness={0.85} />
          </mesh>

          {/* PORT LIGHTHOUSE (Red Flashing Beacon on East Breakwater Head) */}
          <BreakwaterLighthouse
            position={[worldX(1420), 0.95, worldZ(1720)]}
            beaconColor="#ef4444"
            flashSpeed={2.8}
            name="East_Breakwater_Port_Lighthouse"
          />
        </group>

        {/* Eastern Straight Coastline & Sandy Beaches */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(2150), 0.024, worldZ(1600)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(1200), worldD(50)]} />
          <meshStandardMaterial map={sandTex} roughness={0.85} />
        </mesh>
        <BreakingSurfFoam
          position={[worldX(2150), 0.028, worldZ(1625)]}
          width={worldW(1200)}
          depth={2.5}
        />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          6. KARAGAN LEWAYA DIAGONAL DYKE (North-East Bund)
          Cutting diagonally from (1140, 240) down to (1620, 620)
          ───────────────────────────────────────────────────────────── */}
      <group name="Karagan_Lewaya_Bund">
        <mesh
          position={[worldX(1380), 0.45, worldZ(430)]}
          rotation={[0, -0.68, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[worldW(36), 1.2, worldD(420)]} />
          <meshStandardMaterial map={rockTex} roughness={0.8} />
        </mesh>
        <mesh
          position={[worldX(1380), 1.06, worldZ(430)]}
          rotation={[0, -0.68, 0]}
          receiveShadow
        >
          <boxGeometry args={[worldW(16), 0.08, worldD(416)]} />
          <meshStandardMaterial map={asphaltTex} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          7. HARBOR ENTRANCE FAIRWAY NAVIGATION BUOYS
          Deep-water channel entrance between the two breakwaters
          ───────────────────────────────────────────────────────────── */}
      <group name="Channel_Navigation_Buoys">
        <ChannelBuoy position={[worldX(1320), 0.05, worldZ(1920)]} color="#22c55e" flashSpeed={2.2} />
        <ChannelBuoy position={[worldX(1310), 0.05, worldZ(1680)]} color="#22c55e" flashSpeed={2.2} />
        <ChannelBuoy position={[worldX(1420), 0.05, worldZ(1920)]} color="#ef4444" flashSpeed={2.2} />
        <ChannelBuoy position={[worldX(1390), 0.05, worldZ(1680)]} color="#ef4444" flashSpeed={2.2} />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          8. TROPICAL PALM TREES & COASTAL FLORA
          ───────────────────────────────────────────────────────────── */}
      <group name="Regional_Vegetation">
        {/* Mirijjawila Beach Palms */}
        <CoastalPalmTreeCluster x={280} z={1620} count={8} />
        <CoastalPalmTreeCluster x={480} z={1610} count={9} />
        <CoastalPalmTreeCluster x={-120} z={1630} count={8} />

        {/* South Land Settlements */}
        <CoastalPalmTreeCluster x={120} z={1250} count={7} />
        <CoastalPalmTreeCluster x={460} z={1320} count={8} />
        <CoastalPalmTreeCluster x={650} z={1280} count={7} />

        {/* East Headland Village Palms */}
        <CoastalPalmTreeCluster x={1650} z={1380} count={9} />
        <CoastalPalmTreeCluster x={1920} z={1250} count={10} />

        {/* North BY4 Hill Palms */}
        <CoastalPalmTreeCluster x={680} z={70} count={6} />
        <CoastalPalmTreeCluster x={850} z={80} count={7} />
      </group>
    </group>
  );
}
