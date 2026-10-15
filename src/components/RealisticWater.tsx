// ============================================================
// HIPG SEAPORT 3D DIGITAL TWIN - SATELLITE-ACCURATE HARBOR BASIN
// Reconstructed 1:1 to Google Satellite Imagery:
// - Inland artificial lagoon basin contour wrapping North & East of yard
// - Narrowing entrance channel leading South
// - Vast Indian Ocean ONLY at the South (below the breakwaters)
// - Karagan Lewaya dark wetland lagoon (North-East)
// - Rotala Wewa inland lake (West)
// ============================================================

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getWaterNormalTexture, getWaterFoamTexture } from '@/lib/portMaterials';
import { useMapStore } from '@/lib/mapStore';

const SCALE = 0.1;
function worldX(x: number) { return (x - 500) * SCALE; }
function worldZ(z: number) { return (z - 500) * SCALE; }
function worldW(w: number) { return w * SCALE; }
function worldD(d: number) { return d * SCALE; }

export function RealisticWater() {
  const { timeOfDay } = useMapStore();
  const normalMap1 = useMemo(() => getWaterNormalTexture(), []);
  const normalMap2 = useMemo(() => getWaterNormalTexture().clone(), []);
  const foamTex = useMemo(() => getWaterFoamTexture(), []);

  const waveOffsetRef1 = useRef(0);
  const waveOffsetRef2 = useRef(0);

  // Dynamic ocean wave chop and surface currents
  useFrame((_, delta) => {
    waveOffsetRef1.current += delta * 0.035;
    waveOffsetRef2.current -= delta * 0.022;

    if (normalMap1) {
      normalMap1.offset.set(waveOffsetRef1.current * 0.35, waveOffsetRef1.current * 0.2);
    }
    if (normalMap2) {
      normalMap2.offset.set(waveOffsetRef2.current * -0.25, waveOffsetRef2.current * 0.3);
    }
  });

  const isDay = timeOfDay === 'day';
  const isNight = timeOfDay === 'night';

  const oceanDeepColor = isDay ? '#093a5e' : isNight ? '#061c30' : '#072e4c';
  const basinColor = isDay ? '#0d4e72' : isNight ? '#082940' : '#0a3f5e';
  const lagoonColor = isDay ? '#0f3847' : isNight ? '#08212b' : '#0c2e3b';
  const emissiveColor = isDay ? '#041e30' : isNight ? '#02101a' : '#031726';

  // 1:1 Satellite Contour Shape of Hambantota Inner Harbor Basin & Channel
  const basinGeometry = useMemo(() => {
    const s = new THREE.Shape();
    // In Three.js: with rotation=[-PI/2, 0, 0], (X, Y) maps to (X, 0, -Y).
    // Therefore to place a point at (worldX(x), worldZ(z)), pass (worldX(x), -worldZ(z)).
    const pt = (x: number, z: number) => [worldX(x), -worldZ(z)] as const;

    const [x0, y0] = pt(180, 240);
    s.moveTo(x0, y0);

    // North Quay top quayside
    s.lineTo(...pt(1100, 240));
    // Phase 2 North basin step
    s.lineTo(...pt(1100, 180));
    s.lineTo(...pt(1180, 180));
    s.lineTo(...pt(1180, 240));

    // Karagan Lewaya diagonal dyke edge
    s.lineTo(...pt(1380, 340));
    s.lineTo(...pt(1620, 620));

    // East Basin eastern shoreline (Hambantota headland bank)
    s.lineTo(...pt(1560, 900));
    s.lineTo(...pt(1520, 1180));
    s.lineTo(...pt(1550, 1420));
    s.lineTo(...pt(1580, 1580)); // East breakwater root

    // Open out into Indian Ocean at the south
    s.lineTo(...pt(1580, 1850));
    s.lineTo(...pt(850, 1850)); // Channel mouth between breakwaters

    // Up the West channel bank (Mirijjawila peninsula shore)
    s.lineTo(...pt(850, 1600));
    s.lineTo(...pt(1160, 1400));
    s.lineTo(...pt(1120, 1150));
    s.lineTo(...pt(1020, 960));

    // Along our Central Yard's East Quayside (Berths 01-02, Service Berth)
    s.lineTo(...pt(958, 920));
    s.lineTo(...pt(958, 440));

    // Along our Central Yard's North Quayside (Berths 06-04)
    s.lineTo(...pt(260, 440));

    // West Quay
    s.lineTo(...pt(180, 440));
    s.closePath();

    return new THREE.ShapeGeometry(s);
  }, []);

  return (
    <group position={[0, 0.015, 0]} name="Dynamic_Harbor_Waters">
      {/* ── 1. The Authentic Inner Basin & Channel (Sculpted to Satellite Imagery) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        geometry={basinGeometry}
        receiveShadow
      >
        <meshStandardMaterial
          color={basinColor}
          emissive={emissiveColor}
          emissiveIntensity={0.8}
          roughness={0.06}
          metalness={0.06}
          normalMap={normalMap1}
          normalScale={new THREE.Vector2(0.35, 0.35)}
          transparent
          opacity={0.98}
        />
      </mesh>

      {/* ── 2. Open Indian Ocean (STRICTLY at the South, below the Coastline & Breakwaters) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(500), -0.01, worldZ(2600)]}
        receiveShadow
      >
        <planeGeometry args={[4500, 1600, 32, 24]} />
        <meshStandardMaterial
          color={oceanDeepColor}
          emissive={emissiveColor}
          emissiveIntensity={0.65}
          roughness={0.08}
          metalness={0.08}
          normalMap={normalMap2}
          normalScale={new THREE.Vector2(0.4, 0.4)}
          transparent
          opacity={0.98}
        />
      </mesh>

      {/* ── 3. Karagan Lewaya Salt Pan Lagoon (North-East of the Port) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(1650), 0.003, worldZ(280)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(700), worldD(500)]} />
        <meshStandardMaterial
          color={lagoonColor}
          emissive={emissiveColor}
          emissiveIntensity={0.45}
          roughness={0.15}
          metalness={0.02}
          normalMap={normalMap2}
          normalScale={new THREE.Vector2(0.18, 0.18)}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* ── 4. Rotala Wewa Inland Lake (West of Port in Mirijjawila) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(-130), 0.026, worldZ(580)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(180), worldD(220)]} />
        <meshStandardMaterial
          color={lagoonColor}
          emissive={emissiveColor}
          emissiveIntensity={0.45}
          roughness={0.15}
          metalness={0.02}
          normalMap={normalMap1}
          normalScale={new THREE.Vector2(0.18, 0.18)}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ── 5. Quayside Wave-Break Foam Skirts ── */}
      {/* North Basin Foam Skirt */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(640), 0.012, worldZ(258)]}
      >
        <planeGeometry args={[worldW(880), 1.6]} />
        <meshStandardMaterial
          map={foamTex}
          color="#dbeafe"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Central Basin South Quay Foam Skirt (Berths 06-04) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(570), 0.012, worldZ(437)]}
      >
        <planeGeometry args={[worldW(740), 1.6]} />
        <meshStandardMaterial
          map={foamTex}
          color="#dbeafe"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Eastern Deep Quay (Berths 01-02) Sea Wall Foam Skirt (East of wall) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(958.8), 0.012, worldZ(690)]}
      >
        <planeGeometry args={[1.2, worldD(580)]} />
        <meshStandardMaterial
          map={foamTex}
          color="#dbeafe"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
