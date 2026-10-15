// ============================================================
// HIPG HAMBANTOTA INTERNATIONAL PORT - REGIONAL COASTAL DIGITAL TWIN
// Exact 1:1 Geographical Reconstruction Matching Google Satellite Map:
// 1. Central Ro-Ro & Container Yard nestled in the inland harbor
// 2. North Basin & East Turning Basin encircling the yard
// 3. Karagan Lewaya Diagonal Dyke (North-East bund)
// 4. South Coastal Mainland (Gate 1, CGHW Highway, Mirijjawila)
// 5. Mirijjawila Crescent Beach & Iconic Curved South Breakwater (with Starboard Green Lighthouse)
// 6. East Headland & Hambanthota Harbour Breakwater (with Port Red Lighthouse)
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
          1. SOUTH MAINLAND (Directly below Yard: Gate 1, CGHW Hwy, Mirijjawila)
          Spanning z: 920 to 1600, x: -400 to 958
          ───────────────────────────────────────────────────────────── */}
      <group name="South_Coastal_Mainland">
        {/* Main South Coastal Plains Landmass */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(279), 0.022, worldZ(1260)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(1358), worldD(680)]} />
          <meshStandardMaterial map={terrainTex} roughness={0.9} metalness={0.05} />
        </mesh>

        {/* CGHW Highway (Colombo - Galle - Hambantota - Wellawaya Highway) */}
        {/* Running across south mainland towards Mirijjawila Beach */}
        <mesh
          position={[worldX(260), 0.038, worldZ(1420)]}
          rotation={[0, -0.06, 0]}
          receiveShadow
        >
          <boxGeometry args={[worldW(1300), 0.03, worldD(22)]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Gate 01 Roundabout & Access Feeder Road */}
        <group position={[worldX(280), 0.036, worldZ(1050)]}>
          {/* Roundabout Asphalt Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[worldW(14), worldW(32), 32]} />
            <meshStandardMaterial map={asphaltTex} roughness={0.7} />
          </mesh>
          {/* Central Landscaped Garden Island */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[worldW(13.8), 24]} />
            <meshStandardMaterial color="#1b4d24" roughness={0.9} />
          </mesh>
          {/* Gate 1 Access Road connecting Roundabout to Yard Gate 01 */}
          <mesh position={[-worldW(50), 0, -worldD(60)]} rotation={[0, 0.45, 0]} receiveShadow>
            <boxGeometry args={[worldW(20), 0.02, worldD(120)]} />
            <meshStandardMaterial map={asphaltTex} />
          </mesh>
        </group>

        {/* Mirijjawila Crescent Sandy Beach (Along z: 1560 to 1640) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(450), 0.025, worldZ(1590)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(700), worldD(100)]} />
          <meshStandardMaterial map={sandTex} roughness={0.85} />
        </mesh>

        {/* Surf Foam Breaking on Mirijjawila Beach */}
        <BreakingSurfFoam
          position={[worldX(450), 0.028, worldZ(1640)]}
          width={worldW(700)}
          depth={2.8}
        />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. ICONIC CURVED SOUTH-WEST BREAKWATER (Mirijjawila Hook)
          Sweeping in a large arc from (worldX(750), worldZ(1580))
          down to (worldX(1020), worldZ(1820)) into the Indian Ocean
          ───────────────────────────────────────────────────────────── */}
      <group name="Mirijjawila_Curved_South_Breakwater">
        {/* Curved Rock Armor Breakwater Segments */}
        {[
          { x: 730, z: 1610, rot: 0.12, len: 140, w: 55 },
          { x: 790, z: 1680, rot: 0.55, len: 150, w: 58 },
          { x: 860, z: 1740, rot: 0.92, len: 150, w: 60 },
          { x: 940, z: 1785, rot: 1.25, len: 160, w: 62 },
          { x: 1020, z: 1810, rot: 1.57, len: 170, w: 65 },
        ].map((seg, si) => (
          <group key={`c-break-${si}`} position={[worldX(seg.x), 0.32, worldZ(seg.z)]} rotation={[0, seg.rot, 0]}>
            {/* Heavy Riprap Granite Armor Stone Spine */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[worldW(seg.w), 1.0, worldD(seg.len)]} />
              <meshStandardMaterial map={rockTex} roughness={0.85} />
            </mesh>
            {/* Concrete Maintenance Crown Road */}
            <mesh position={[0, 0.55, 0]} receiveShadow>
              <boxGeometry args={[worldW(seg.w * 0.42), 0.14, worldD(seg.len)]} />
              <meshStandardMaterial map={concreteTex} roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Breakwater Head (Round Promontory at tip) */}
        <mesh position={[worldX(1100), 0.35, worldZ(1810)]} castShadow receiveShadow>
          <cylinderGeometry args={[2.8, 3.8, 1.2, 16]} />
          <meshStandardMaterial map={rockTex} roughness={0.85} />
        </mesh>

        {/* STARBOARD LIGHTHOUSE (Green Flashing Beacon on South Breakwater Head) */}
        <BreakwaterLighthouse
          position={[worldX(1100), 0.95, worldZ(1810)]}
          beaconColor="#22c55e"
          flashSpeed={2.8}
          name="South_Breakwater_Starboard_Lighthouse"
        />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. EAST HEADLAND & HAMBANTHOTA HARBOUR BREAKWATER
          East of the entrance channel (x: 1282 to 2200, z: 480 to 1650)
          ───────────────────────────────────────────────────────────── */}
      <group name="East_Headland_Hambanthota">
        {/* East Mainland Promontory */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(1741), 0.022, worldZ(1050)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(918), worldD(1200)]} />
          <meshStandardMaterial map={terrainTex} roughness={0.9} metalness={0.05} />
        </mesh>

        {/* Tangalle - Hambantota Coastal Road */}
        <mesh
          position={[worldX(1550), 0.038, worldZ(1050)]}
          rotation={[0, 0.22, 0]}
          receiveShadow
        >
          <boxGeometry args={[worldW(20), 0.03, worldD(1100)]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.7} />
        </mesh>

        {/* East Breakwater (Hook-shaped rock arm guarding channel entrance) */}
        <group name="East_Harbour_Breakwater">
          <mesh
            position={[worldX(1240), 0.35, worldZ(1620)]}
            rotation={[0, -0.42, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[worldW(58), 1.0, worldD(280)]} />
            <meshStandardMaterial map={rockTex} roughness={0.85} />
          </mesh>

          {/* East Breakwater Head */}
          <mesh position={[worldX(1180), 0.35, worldZ(1720)]} castShadow receiveShadow>
            <cylinderGeometry args={[2.5, 3.4, 1.2, 16]} />
            <meshStandardMaterial map={rockTex} roughness={0.85} />
          </mesh>

          {/* PORT LIGHTHOUSE (Red Flashing Beacon on East Breakwater Head) */}
          <BreakwaterLighthouse
            position={[worldX(1180), 0.95, worldZ(1720)]}
            beaconColor="#ef4444"
            flashSpeed={2.8}
            name="East_Breakwater_Port_Lighthouse"
          />
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. KARAGAN LEWAYA DIAGONAL DYKE & LAGOON (North-East Bund)
          Cutting diagonally from (1140, 250) down to (1380, 480)
          ───────────────────────────────────────────────────────────── */}
      <group name="Karagan_Lewaya_Bund">
        {/* Diagonal Rock Armor Embankment */}
        <mesh
          position={[worldX(1260), 0.45, worldZ(365)]}
          rotation={[0, -0.785, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[worldW(36), 1.2, worldD(340)]} />
          <meshStandardMaterial map={rockTex} roughness={0.8} />
        </mesh>
        {/* Crown Patrol Road on Dyke */}
        <mesh
          position={[worldX(1260), 1.06, worldZ(365)]}
          rotation={[0, -0.785, 0]}
          receiveShadow
        >
          <boxGeometry args={[worldW(16), 0.08, worldD(336)]} />
          <meshStandardMaterial map={asphaltTex} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. NORTH MAINLAND & BY4 MARITIME OPERATIONS HILL
          North of North Basin (z < 255)
          ───────────────────────────────────────────────────────────── */}
      <group name="North_Mainland_Hinterland">
        {/* Expansive North Hinterland Landmass */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(500), 0.022, worldZ(-450)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(1900), worldD(1400)]} />
          <meshStandardMaterial map={terrainTex} roughness={0.9} metalness={0.05} />
        </mesh>

        {/* BY4 Administration Promontory Hill */}
        <group position={[worldX(760), 0, worldZ(80)]}>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[worldW(160), worldW(240), 1.8, 16]} />
            <meshStandardMaterial map={terrainTex} roughness={0.85} />
          </mesh>

          {/* HIPG Port Headquarters Complex */}
          <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[worldW(85), 0.75, worldD(65)]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.1} />
          </mesh>

          {/* VTMS Marine Radar Tower with Aviation Beacon */}
          <group position={[worldW(55), 1.8, -worldD(20)]}>
            <mesh position={[0, 2.2, 0]}>
              <cylinderGeometry args={[0.08, 0.35, 4.4, 4]} />
              <meshStandardMaterial color="#dc2626" wireframe />
            </mesh>
            <mesh position={[0, 4.4, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.08, 8]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 4.6, 0]}>
              <boxGeometry args={[0.9, 0.14, 0.06]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 4.8, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
            </mesh>
            <pointLight position={[0, 4.8, 0]} color="#ef4444" distance={15} decay={2} />
          </group>

          {/* Marine Bunker Terminal Oil Storage Tanks */}
          {[-worldW(70), -worldW(110)].map((tx, ti) => (
            <group key={`oil-tank-${ti}`} position={[tx, 0.9, worldD(20)]}>
              <mesh position={[0, 0.9, 0]} castShadow>
                <cylinderGeometry args={[1.6, 1.6, 1.8, 24]} />
                <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.3} />
              </mesh>
              <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[3.8, 0.3, 3.8]} />
                <meshStandardMaterial color="#475569" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          6. WEST MAINLAND & ROTALA WEWA LAKE
          Extending West (x: -1600 to 30, z: 0 to 1600)
          ───────────────────────────────────────────────────────────── */}
      <group name="West_Mainland_Plains">
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[worldX(-785), 0.022, worldZ(700)]}
          receiveShadow
        >
          <planeGeometry args={[worldW(1630), worldD(1800)]} />
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

        {/* Western Port Security Boundary Wall */}
        <mesh position={[worldX(25), 0.5, worldZ(480)]} castShadow>
          <boxGeometry args={[0.25, 0.95, worldD(920)]} />
          <meshStandardMaterial map={concreteTex} roughness={0.8} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          7. HARBOR ENTRANCE FAIRWAY NAVIGATION BUOYS
          Bobbing in the deep channel mouth outside the breakwaters
          ───────────────────────────────────────────────────────────── */}
      <group name="Channel_Navigation_Buoys">
        <ChannelBuoy position={[worldX(1060), 0.05, worldZ(1920)]} color="#22c55e" flashSpeed={2.2} />
        <ChannelBuoy position={[worldX(1080), 0.05, worldZ(1620)]} color="#22c55e" flashSpeed={2.2} />
        <ChannelBuoy position={[worldX(1160), 0.05, worldZ(1920)]} color="#ef4444" flashSpeed={2.2} />
        <ChannelBuoy position={[worldX(1140), 0.05, worldZ(1620)]} color="#ef4444" flashSpeed={2.2} />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          8. TROPICAL PALM TREES & DRY-ZONE NATURE
          ───────────────────────────────────────────────────────────── */}
      <group name="Regional_Vegetation">
        {/* Mirijjawila Beach Palms */}
        <CoastalPalmTreeCluster x={280} z={1570} count={7} />
        <CoastalPalmTreeCluster x={480} z={1560} count={9} />
        <CoastalPalmTreeCluster x={680} z={1570} count={8} />

        {/* South Land Scrub Clusters */}
        <CoastalPalmTreeCluster x={120} z={1250} count={6} />
        <CoastalPalmTreeCluster x={360} z={1320} count={7} />
        <CoastalPalmTreeCluster x={650} z={1280} count={6} />

        {/* East Headland Palms */}
        <CoastalPalmTreeCluster x={1450} z={1480} count={8} />
        <CoastalPalmTreeCluster x={1680} z={1350} count={9} />

        {/* North BY4 Hill Palms */}
        <CoastalPalmTreeCluster x={680} z={70} count={6} />
        <CoastalPalmTreeCluster x={850} z={80} count={7} />
      </group>
    </group>
  );
}
