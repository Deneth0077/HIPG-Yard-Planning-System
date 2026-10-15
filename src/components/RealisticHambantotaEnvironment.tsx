// ============================================================
// HIPG HAMBANTOTA INTERNATIONAL PORT - REGIONAL COASTAL DIGITAL TWIN
// Authentic Sri Lankan Southern Mainland & Indian Ocean Environment:
// - Sri Lankan Southern Mainland (Mirijjawila / Karagan Lewaya dry-zone coastal plains)
// - Southern Expressway E01 / Hambantota Port Access Highway Corridor
// - BY4 Maritime Headquarters Hill with VTMS Marine Radar Tower
// - Marine Bunker Fuel Oil Storage Tank Farm
// - West & East Granite Riprap Armor Breakwaters with Navigation Lighthouses
// - Starboard (Green) & Port (Red) Entrance Lighthouses with Flashing Beacons
// - Golden Sand Beaches with Breaking Ocean Surf & Coastal Palms
// - Moored Approach Channel Navigation Fairway Buoys
// ============================================================

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMapStore } from '@/lib/mapStore';
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
function BreakingSurfFoam({ position, width, depth }: { position: [number, number, number]; width: number; depth: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const foamTex = useMemo(() => getWaterFoamTexture(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle shoreline wave surge
    meshRef.current.position.z = position[2] + Math.sin(t * 1.4) * 0.15;
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 0.45 + Math.sin(t * 1.4) * 0.25;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial
        map={foamTex}
        color="#e0f2fe"
        transparent
        opacity={0.6}
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
    // Realistic maritime lighthouse flash: periodic bright pulse
    const flash = Math.sin(t * flashSpeed) > 0.4 ? 1.0 : 0.08;
    if (lightRef.current) lightRef.current.intensity = flash * 3.5;
    if (lanternRef.current) {
      (lanternRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flash * 4.0;
    }
  });

  return (
    <group position={position} name={name}>
      {/* Concrete circular octagonal caisson plinth */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 2.0, 0.8, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Main White Tapered Lighthouse Tower */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.85, 2.0, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* High-visibility daymark band (Red or Green) */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.71, 0.76, 0.55, 16]} />
        <meshStandardMaterial color={beaconColor} roughness={0.4} />
      </mesh>

      {/* Upper Gallery Catwalk with Safety Railing */}
      <mesh position={[0, 2.85, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.08, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      <mesh position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.22, 16]} />
        <meshStandardMaterial color="#eab308" wireframe />
      </mesh>

      {/* Glass Lantern Housing with Marine Fresnel Optic */}
      <mesh ref={lanternRef} position={[0, 3.25, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.5, 12]} />
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
        <sphereGeometry args={[0.45, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
      <mesh position={[0, 4.0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>

      {/* Flashing Maritime Navigation Point Light */}
      <pointLight
        ref={lightRef}
        position={[0, 3.3, 0]}
        color={beaconColor}
        distance={25}
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
    // Swell roll and bobbing
    buoyRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.035;
    buoyRef.current.rotation.z = Math.cos(t * 1.2 + position[2]) * 0.06;
    buoyRef.current.rotation.x = Math.sin(t * 1.1 + position[0]) * 0.05;

    const flash = Math.sin(t * flashSpeed) > 0.6 ? 1 : 0.05;
    if (lightRef.current) lightRef.current.intensity = flash * 1.8;
  });

  return (
    <group ref={buoyRef} position={position}>
      {/* Buoy Torpedo/Can Body */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.22, 0.32, 0.5, 10]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Top Lattice Tower & Radar Reflector */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.08, 0.18, 0.35, 6]} />
        <meshStandardMaterial color="#0f172a" wireframe />
      </mesh>
      {/* Solar Panel & Marine LED Beacon */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.85, 0]} color={color} distance={10} decay={2} />
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
          {/* Slender curved trunk */}
          <mesh position={[0, p.h / 2, 0]}>
            <cylinderGeometry args={[0.07, 0.14, p.h, 6]} />
            <meshStandardMaterial color="#57422f" roughness={0.9} />
          </mesh>
          {/* Palm Frond Crown */}
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
    <group name="Hambantota_Regional_Geography">
      {/* ─────────────────────────────────────────────────────────────
          1. SRI LANKAN MAINLAND (West, North & South-West Landmass)
          ───────────────────────────────────────────────────────────── */}
      {/* West Mainland (Mirijjawila Dry-Zone Plains extending West to Horizon) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(-700), 0.025, worldZ(550)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(1500), worldD(2400)]} />
        <meshStandardMaterial map={terrainTex} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* North Mainland & Hinterland (Behind North Basin extending North) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(500), 0.025, worldZ(-500)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(1100), worldD(1200)]} />
        <meshStandardMaterial map={terrainTex} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* South-West Inland Buffer (South of Gate 01) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(250), 0.025, worldZ(1350)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(600), worldD(800)]} />
        <meshStandardMaterial map={terrainTex} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          2. SOUTHERN EXPRESSWAY E01 / HAMBANTOTA PORT ACCESS HIGHWAY
          Winding Westward from Gate 01 into Mainland Sri Lanka
          ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0.04, 0]} name="Southern_Expressway_Corridor">
        {/* Main 4-Lane Divided Highway Asphalt */}
        <mesh position={[worldX(-450), 0, worldZ(910)]} receiveShadow>
          <boxGeometry args={[worldW(1000), 0.04, worldD(34)]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.65} metalness={0.2} />
        </mesh>

        {/* Center Concrete Crash Barrier / Median Divider */}
        <mesh position={[worldX(-450), 0.08, worldZ(910)]}>
          <boxGeometry args={[worldW(1000), 0.12, 0.15]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>

        {/* Highway Streetlight Poles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <group key={`hwy-light-${i}`} position={[worldX(10 - i * 85), 0, worldZ(910)]}>
            {/* Pole */}
            <mesh position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.03, 0.05, 1.8, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>
            {/* Dual Luminaire Mast Arms */}
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[0.08, 0.04, 0.6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>
            {[-0.26, 0.26].map((lz, li) => (
              <mesh key={`h-lamp-${li}`} position={[0, 1.76, lz]}>
                <boxGeometry args={[0.1, 0.04, 0.08]} />
                <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.2} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Overhead Highway Directional Gantry Sign */}
        <group position={[worldX(-120), 0, worldZ(910)]}>
          {/* Side Gantry Columns */}
          {[-worldD(16), worldD(16)].map((gz, gi) => (
            <mesh key={`gantry-col-${gi}`} position={[0, 1.3, gz]}>
              <cylinderGeometry args={[0.06, 0.08, 2.6, 6]} />
              <meshStandardMaterial color="#0284c7" metalness={0.8} />
            </mesh>
          ))}
          {/* Overhead Truss Beam */}
          <mesh position={[0, 2.45, 0]}>
            <boxGeometry args={[0.2, 0.25, worldD(34)]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} />
          </mesh>
          {/* Green Sri Lankan Highway Signboard */}
          <mesh position={[0, 2.45, -worldD(6)]}>
            <boxGeometry args={[0.06, 0.85, worldD(14)]} />
            <meshStandardMaterial color="#15803d" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. WEST PERIMETER SECURITY WALL & PATROL CORRIDOR
          ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0, 0]} name="Port_Security_Perimeter">
        {/* Continuous Concrete Security Boundary Wall */}
        <mesh position={[worldX(25), 0.5, worldZ(480)]} castShadow>
          <boxGeometry args={[0.25, 0.95, worldD(920)]} />
          <meshStandardMaterial map={concreteTex} roughness={0.8} />
        </mesh>
        {/* Barbed Wire Top Crown */}
        <mesh position={[worldX(25), 1.02, worldZ(480)]}>
          <boxGeometry args={[0.08, 0.12, worldD(920)]} />
          <meshStandardMaterial color="#64748b" wireframe />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. BY4 ADMINISTRATION HILL & VTMS RADAR TOWER
          Elevated prominence overlooking the harbor basin
          ───────────────────────────────────────────────────────────── */}
      <group position={[worldX(760), 0, worldZ(80)]} name="BY4_HQ_Maritime_Promontory">
        {/* Elevated Natural Grassy Hill Promontory */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[worldW(160), worldW(240), 1.8, 16]} />
          <meshStandardMaterial map={terrainTex} roughness={0.85} />
        </mesh>

        {/* HIPG Port Operations Headquarters Complex */}
        <group position={[0, 1.8, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[worldW(85), 0.75, worldD(65)]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.1} />
          </mesh>
          {/* Glass Panoramic Windows */}
          <mesh position={[0, 0.05, worldD(33)]}>
            <boxGeometry args={[worldW(80), 0.45, 0.05]} />
            <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
          </mesh>
        </group>

        {/* Steel Lattice Marine Radar / VTMS Communications Tower */}
        <group position={[worldW(55), 1.8, -worldD(20)]}>
          {/* Lattice Mast */}
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.08, 0.35, 4.4, 4]} />
            <meshStandardMaterial color="#dc2626" wireframe />
          </mesh>
          {/* Top Rotating Radar Scanner Platform */}
          <mesh position={[0, 4.4, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.08, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Radar Scanner Dish */}
          <mesh position={[0, 4.6, 0]}>
            <boxGeometry args={[0.9, 0.14, 0.06]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Flashing Red Aviation Obstruction Beacon */}
          <mesh position={[0, 4.8, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
          </mesh>
          <pointLight position={[0, 4.8, 0]} color="#ef4444" distance={15} decay={2} />
        </group>

        {/* Marine Bunker Terminal Oil Storage Tanks */}
        {[-worldW(70), -worldW(110)].map((tx, ti) => (
          <group key={`oil-tank-${ti}`} position={[tx, 0.9, worldD(20)]}>
            {/* White Cylindrical Fuel Tank */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[1.6, 1.6, 1.8, 24]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Safety Spill Bund Wall */}
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[3.8, 0.3, 3.8]} />
              <meshStandardMaterial color="#475569" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. NATURAL SOUTHERN COASTLINE & GOLDEN SAND BEACHES
          Where Sri Lanka meets the Indian Ocean outside the port
          ───────────────────────────────────────────────────────────── */}
      <group name="Southern_Coastline_Beaches">
        {/* Western Beach (West of Harbor Entrance from x = 120 to 740) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(440), 0.028, worldZ(990)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(640), worldD(70)]} />
          <meshStandardMaterial map={sandTex} roughness={0.85} />
        </mesh>

        {/* Western Surf Foam Breaking on Beach */}
        <BreakingSurfFoam
          position={[worldX(440), 0.032, worldZ(1022)]}
          width={worldW(640)}
          depth={2.5}
        />

        {/* Eastern Beach (East of Harbor Entrance from x = 1100 to 1700) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(1400), 0.028, worldZ(940)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(600), worldD(80)]} />
          <meshStandardMaterial map={sandTex} roughness={0.85} />
        </mesh>

        {/* Eastern Surf Foam Breaking on Beach */}
        <BreakingSurfFoam
          position={[worldX(1400), 0.032, worldZ(978)]}
          width={worldW(600)}
          depth={2.5}
        />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          6. HAMBANTOTA HARBOR BREAKWATERS (දියකඩන)
          Rock armor moles protecting the harbor basin from ocean swells
          ───────────────────────────────────────────────────────────── */}
      <group name="Hambantota_Port_Breakwaters">
        {/* ── WEST BREAKWATER (Curving South-East into the Indian Ocean) ── */}
        <group name="West_Breakwater">
          {/* Main Breakwater Riprap Rock Armor Spine */}
          <mesh
            position={[worldX(820), 0.35, worldZ(1160)]}
            rotation={[0, 0.42, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[worldW(75), 1.1, worldD(420)]} />
            <meshStandardMaterial map={rockTex} roughness={0.85} />
          </mesh>

          {/* Concrete Crown Roadway on Breakwater Spine */}
          <mesh
            position={[worldX(820), 0.95, worldZ(1160)]}
            rotation={[0, 0.42, 0]}
            receiveShadow
          >
            <boxGeometry args={[worldW(28), 0.15, worldD(410)]} />
            <meshStandardMaterial map={concreteTex} roughness={0.7} />
          </mesh>

          {/* West Breakwater Head (Seaward Promontory) */}
          <mesh position={[worldX(895), 0.4, worldZ(1320)]} castShadow receiveShadow>
            <cylinderGeometry args={[2.8, 3.8, 1.2, 16]} />
            <meshStandardMaterial map={rockTex} roughness={0.85} />
          </mesh>

          {/* STARBOARD LIGHTHOUSE (Green Flashing Beacon on West Breakwater Head) */}
          <BreakwaterLighthouse
            position={[worldX(895), 1.0, worldZ(1320)]}
            beaconColor="#22c55e"
            flashSpeed={2.8}
            name="West_Head_Starboard_Lighthouse"
          />
        </group>

        {/* ── EAST BREAKWATER (Guarding the Eastern Harbor Flank) ── */}
        <group name="East_Breakwater">
          {/* Main East Breakwater Rock Spine */}
          <mesh
            position={[worldX(1060), 0.35, worldZ(1120)]}
            rotation={[0, -0.32, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[worldW(65), 1.1, worldD(340)]} />
            <meshStandardMaterial map={rockTex} roughness={0.85} />
          </mesh>

          {/* Concrete Roadway on East Breakwater */}
          <mesh
            position={[worldX(1060), 0.95, worldZ(1120)]}
            rotation={[0, -0.32, 0]}
            receiveShadow
          >
            <boxGeometry args={[worldW(25), 0.15, worldD(330)]} />
            <meshStandardMaterial map={concreteTex} roughness={0.7} />
          </mesh>

          {/* East Breakwater Head */}
          <mesh position={[worldX(1025), 0.4, worldZ(1260)]} castShadow receiveShadow>
            <cylinderGeometry args={[2.5, 3.4, 1.2, 16]} />
            <meshStandardMaterial map={rockTex} roughness={0.85} />
          </mesh>

          {/* PORT LIGHTHOUSE (Red Flashing Beacon on East Breakwater Head) */}
          <BreakwaterLighthouse
            position={[worldX(1025), 1.0, worldZ(1260)]}
            beaconColor="#ef4444"
            flashSpeed={2.8}
            name="East_Head_Port_Lighthouse"
          />
        </group>

        {/* ── HARBOR ENTRANCE NAVIGATION FAIRWAY BUOYS ── */}
        {/* Starboard Green Buoys */}
        <ChannelBuoy position={[worldX(920), 0.05, worldZ(1440)]} color="#22c55e" flashSpeed={2.2} />
        <ChannelBuoy position={[worldX(945), 0.05, worldZ(1220)]} color="#22c55e" flashSpeed={2.2} />

        {/* Port Red Buoys */}
        <ChannelBuoy position={[worldX(1020), 0.05, worldZ(1440)]} color="#ef4444" flashSpeed={2.2} />
        <ChannelBuoy position={[worldX(995), 0.05, worldZ(1220)]} color="#ef4444" flashSpeed={2.2} />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          7. TROPICAL PALM TREES & COASTAL VEGETATION
          ───────────────────────────────────────────────────────────── */}
      <group name="Coastal_Flora">
        {/* Beach Palm Clusters */}
        <CoastalPalmTreeCluster x={280} z={970} count={6} />
        <CoastalPalmTreeCluster x={450} z={965} count={8} />
        <CoastalPalmTreeCluster x={620} z={970} count={6} />
        <CoastalPalmTreeCluster x={1250} z={920} count={7} />
        <CoastalPalmTreeCluster x={1480} z={910} count={8} />

        {/* Mainland Hill Clusters */}
        <CoastalPalmTreeCluster x={670} z={60} count={6} />
        <CoastalPalmTreeCluster x={860} z={70} count={7} />
        <CoastalPalmTreeCluster x={-150} z={820} count={9} />
      </group>
    </group>
  );
}
