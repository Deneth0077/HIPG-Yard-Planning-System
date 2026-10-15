// ============================================================
// HIPG SEAPORT 3D DIGITAL TWIN - DYNAMIC OCEAN & HARBOR BASINS
// High-fidelity maritime water surface:
// - Vibrant deep oceanic sapphire & tropical harbor turquoise depth
// - Dual-scrolling procedural wave normal maps for surface chop
// - Quayside caisson wave break & hull waterline foam skirts
// - Physically accurate dielectric Fresnel reflections & sun glints
// - Day/Twilight/Night ambient responsiveness (never pitch-black)
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

  // Animate dynamic ocean swells and wave chop
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

  // Adaptive maritime lighting & water body colors
  const isDay = timeOfDay === 'day';
  const isNight = timeOfDay === 'night';

  const oceanDeepColor = isDay ? '#0e4a75' : isNight ? '#08253d' : '#0b3d64';
  const basinColor = isDay ? '#10638b' : isNight ? '#0b3554' : '#0e557b';
  const emissiveColor = isDay ? '#072b44' : isNight ? '#041728' : '#052238';

  return (
    <group position={[0, 0.015, 0]} name="Dynamic_Harbor_Waters">
      {/* ── 1. Expansive Indian Ocean Surface (Extending to Horizon) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[3000, 3000, 32, 32]} />
        <meshStandardMaterial
          color={oceanDeepColor}
          emissive={emissiveColor}
          emissiveIntensity={0.65}
          roughness={0.08}
          metalness={0.08}
          normalMap={normalMap1}
          normalScale={new THREE.Vector2(0.35, 0.35)}
          transparent
          opacity={0.96}
        />
      </mesh>

      {/* ── 2. North Basin Channel (Along Berths 09, 10, 11) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(535), 0.005, worldZ(300)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(880), worldD(150)]} />
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

      {/* ── 3. Central Basin Channel (Between Berths 06-04 and Central Basin) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(570), 0.005, worldZ(390)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(720), worldD(110)]} />
        <meshStandardMaterial
          color={basinColor}
          emissive={emissiveColor}
          emissiveIntensity={0.8}
          roughness={0.06}
          metalness={0.06}
          normalMap={normalMap1}
          normalScale={new THREE.Vector2(0.35, 0.35)}
          transparent
          opacity={0.97}
        />
      </mesh>

      {/* ── 4. Eastern Deep-Sea Channel & Open Ocean (East of Berths 01 & 02) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(1258), 0.005, worldZ(690)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(600), worldD(800)]} />
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

      {/* ── 5. Quayside Wave-Break Foam Skirts (Where waves lap against concrete caissons) ── */}
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

      {/* Central Basin South Quay Foam Skirt */}
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
