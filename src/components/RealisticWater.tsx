// ============================================================
// HIPG SEAPORT 3D DIGITAL TWIN - AUTHENTIC DYNAMIC HARBOR BASIN
// Accurately sculpted to Sri Lanka Hambantota Port Satellite Map:
// - Inner North Basin (Between North Quay and Central Yard Berths 06-04)
// - Inner East Basin (Turning basin along Eastern Berths 01-02)
// - Southern Harbor Entrance Channel (Running South between coastal spits)
// - Open Indian Ocean (Vast oceanic depth South of the Breakwaters)
// - Karagan Lewaya Lagoon (North-East shallow wetland water)
// - Rotala Wewa Inland Lake (West Mirijjawila wetland)
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

  // Dynamic ocean swell & wave animations
  useFrame((_, delta) => {
    waveOffsetRef1.current += delta * 0.035;
    waveOffsetRef2.current -= delta * 0.022;

    if (normalMap1) {
      normalMap1.offset.set(waveOffsetRef1.current * 0.4, waveOffsetRef1.current * 0.25);
    }
    if (normalMap2) {
      normalMap2.offset.set(waveOffsetRef2.current * -0.3, waveOffsetRef2.current * 0.35);
    }
  });

  const isDay = timeOfDay === 'day';
  const isNight = timeOfDay === 'night';

  const oceanDeepColor = isDay ? '#0a3f66' : isNight ? '#072036' : '#083354';
  const basinColor = isDay ? '#0e557b' : isNight ? '#092d47' : '#0b4566';
  const lagoonColor = isDay ? '#114a60' : isNight ? '#0a2e3d' : '#0e3e52';
  const emissiveColor = isDay ? '#052338' : isNight ? '#031422' : '#041c2e';

  return (
    <group position={[0, 0.015, 0]} name="Dynamic_Harbor_Waters">
      {/* ── 1. Expansive Indian Ocean (South of the Breakwaters extending to Horizon) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(1100), -0.01, worldZ(2500)]}
        receiveShadow
      >
        <planeGeometry args={[3600, 1500, 32, 24]} />
        <meshStandardMaterial
          color={oceanDeepColor}
          emissive={emissiveColor}
          emissiveIntensity={0.65}
          roughness={0.08}
          metalness={0.08}
          normalMap={normalMap1}
          normalScale={new THREE.Vector2(0.35, 0.35)}
          transparent
          opacity={0.97}
        />
      </mesh>

      {/* ── 2. North Basin (Between North Quay Berths 09-11 and Central Yard Berths 06-04) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(660), 0.005, worldZ(348)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(960), worldD(185)]} />
        <meshStandardMaterial
          color={basinColor}
          emissive={emissiveColor}
          emissiveIntensity={0.8}
          roughness={0.06}
          metalness={0.06}
          normalMap={normalMap2}
          normalScale={new THREE.Vector2(0.4, 0.4)}
          transparent
          opacity={0.97}
        />
      </mesh>

      {/* ── 3. East Basin / Turning Basin (Along Eastern Berths 01 & 02) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(1120), 0.005, worldZ(600)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(324), worldD(460)]} />
        <meshStandardMaterial
          color={basinColor}
          emissive={emissiveColor}
          emissiveIntensity={0.85}
          roughness={0.07}
          metalness={0.06}
          normalMap={normalMap1}
          normalScale={new THREE.Vector2(0.35, 0.35)}
          transparent
          opacity={0.97}
        />
      </mesh>

      {/* ── 4. Southern Entrance Channel (Leading South between the Two Coastal Spits) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(1120), 0.005, worldZ(1300)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(324), worldD(940)]} />
        <meshStandardMaterial
          color={basinColor}
          emissive={emissiveColor}
          emissiveIntensity={0.85}
          roughness={0.07}
          metalness={0.06}
          normalMap={normalMap1}
          normalScale={new THREE.Vector2(0.35, 0.35)}
          transparent
          opacity={0.97}
        />
      </mesh>

      {/* ── 5. Karagan Lewaya Shallow Lagoon (North-East of the Port Basin) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(1550), 0.003, worldZ(320)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(600), worldD(450)]} />
        <meshStandardMaterial
          color={lagoonColor}
          emissive={emissiveColor}
          emissiveIntensity={0.5}
          roughness={0.12}
          metalness={0.04}
          normalMap={normalMap2}
          normalScale={new THREE.Vector2(0.2, 0.2)}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* ── 6. Rotala Wewa Wetland Lake (West of Central Yard in Mirijjawila) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(-120), 0.026, worldZ(580)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(180), worldD(220)]} />
        <meshStandardMaterial
          color={lagoonColor}
          emissive={emissiveColor}
          emissiveIntensity={0.5}
          roughness={0.12}
          metalness={0.04}
          normalMap={normalMap1}
          normalScale={new THREE.Vector2(0.2, 0.2)}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ── 7. Quayside Wave-Break Foam Skirts (Where waves lap against concrete caissons) ── */}
      {/* North Basin Foam Skirt */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(535), 0.012, worldZ(258)]}
      >
        <planeGeometry args={[worldW(840), 1.6]} />
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

      {/* Eastern Deep Quay (Berths 01-02) Sea Wall Foam Skirt along Ocean Edge (East of wall) */}
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
