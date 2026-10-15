// ============================================================
// HIPG HAMBANTOTA INTERNATIONAL PORT - 3D REALISTIC DIGITAL TWIN
// High-realism industrial seaport environment:
// - Authentic PBR materials (weathered asphalt, concrete, caissons)
// - Real ISO corrugated shipping containers with doors and markings
// - Realistic RoRo vehicle fleet (passenger cars, SUVs, vans, trucks)
// - Concrete quay walls, Yokohama pneumatic fenders & bollards
// - Moored PCTC vessels with deployed stern ramps to Berths 5W & 4W
// - Cinematic blue-hour port lighting & high-mast floodlights
// - 100% WebGL-native rendering (zero React 19 DOM portal unmount errors)
// ============================================================

'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';
import {
  BERTHS,
  ROADS,
  JUNCTIONS,
  ZEBRA_CROSSINGS,
  TREE_CLUSTERS,
  QUAY_CRANES,
  CATEGORY_META,
  type YardBlock,
} from '@/lib/hipgMapData';
import { useMapStore } from '@/lib/mapStore';
import {
  getAsphaltTexture,
  getConcretePavementTexture,
} from '@/lib/portMaterials';
import {
  RealisticRoRoFleet,
  RealisticContainerStacks,
  RealisticQuayInfrastructure,
  RealisticPortFleet,
  RealisticHighMastLighting,
} from '@/components/RealisticPortElements';
import { RealisticWater } from '@/components/RealisticWater';
import { RealisticQuayCranes } from '@/components/RealisticQuayCranes';
import { RealisticHambantotaEnvironment } from '@/components/RealisticHambantotaEnvironment';

// Scale factor: 1000 map units -> 100 Three.js scene units
const SCALE = 0.1;

function worldX(x: number) { return (x - 500) * SCALE; }
function worldZ(z: number) { return (z - 500) * SCALE; }
function worldW(w: number) { return w * SCALE; }
function worldD(d: number) { return d * SCALE; }

function mapX(wx: number) { return wx / SCALE + 500; }
function mapZ(wz: number) { return wz / SCALE + 500; }



// ─────────────────────────────────────────────────────────────
// 2. Industrial Port Ground & Interactive Drawing Plane
// ─────────────────────────────────────────────────────────────
function RealisticPortGround() {
  const asphaltTex = useMemo(() => getAsphaltTexture(), []);
  const concreteTex = useMemo(() => getConcretePavementTexture(), []);

  return (
    <group position={[0, 0, 0]} name="Port_Ground_Surfaces">
      {/* Main Terminal Heavy-Duty Asphalt Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(500), 0.02, worldZ(550)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(940), worldD(920)]} />
        <meshStandardMaterial
          map={asphaltTex}
          roughness={0.78}
          metalness={0.15}
        />
      </mesh>

      {/* Top Left Container Terminal Concrete Stacking Pad */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(185), 0.035, worldZ(230)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(160), worldD(440)]} />
        <meshStandardMaterial
          map={concreteTex}
          roughness={0.82}
          metalness={0.12}
        />
      </mesh>

      {/* Eastern Deep Quay Concrete Apron (Seamlessly connecting East road to Berth 01-02 & CY01 pier edge) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(920), 0.038, worldZ(695)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(80), worldD(540)]} />
        <meshStandardMaterial
          map={concreteTex}
          roughness={0.72}
          metalness={0.15}
        />
      </mesh>

      {/* Top Right Landscape Park (Natural organic lawn) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(730), 0.035, worldZ(100)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(240), worldD(170)]} />
        <meshStandardMaterial
          color="#163824"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* South-West Landscape Buffer around Customs Yard */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(390), 0.035, worldZ(820)]}
        receiveShadow
      >
        <planeGeometry args={[worldW(220), worldD(260)]} />
        <meshStandardMaterial
          color="#153622"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Roads Network with Authentic Pavement Markings
// ─────────────────────────────────────────────────────────────
function RealisticRoadsNetwork() {
  const { layers, selectRoad, selectedRoadId, showDimensions } = useMapStore();
  const asphaltTex = useMemo(() => getAsphaltTexture(), []);

  if (!layers.roads) return null;

  return (
    <group position={[0, 0.05, 0]} name="Roads_Network">
      {ROADS.map((road) => {
        const p1 = road.points[0];
        const p2 = road.points[1];
        const cx = (p1[0] + p2[0]) / 2;
        const cz = (p1[1] + p2[1]) / 2;
        const dx = p2[0] - p1[0];
        const dz = p2[1] - p1[1];
        const len = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);
        const isSelected = selectedRoadId === road.id;
        const halfW = worldW(road.widthMeters) / 2;

        return (
          <group
            key={road.id}
            position={[worldX(cx), 0, worldZ(cz)]}
            rotation={[0, angle, 0]}
            onClick={(e) => {
              if (useMapStore.getState().isDrawingMode) return;
              e.stopPropagation();
              selectRoad(road.id);
            }}
          >
            {/* Asphalt Surface */}
            <mesh receiveShadow>
              <boxGeometry args={[worldW(road.widthMeters), 0.03, worldD(len)]} />
              <meshStandardMaterial
                map={asphaltTex}
                color={isSelected ? '#253e60' : '#222830'}
                roughness={0.7}
                metalness={0.15}
              />
            </mesh>

            {/* Left Painted Road Edge Line */}
            <mesh position={[-halfW + 0.06, 0.022, 0]}>
              <boxGeometry args={[0.07, 0.01, worldD(len)]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
            </mesh>
            {/* Right Painted Road Edge Line */}
            <mesh position={[halfW - 0.06, 0.022, 0]}>
              <boxGeometry args={[0.07, 0.01, worldD(len)]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
            </mesh>

            {/* Center Dashed Lane Divider */}
            {road.lanes >= 2 && (
              <mesh position={[0, 0.022, 0]}>
                <boxGeometry args={[0.06, 0.01, worldD(len) * 0.96]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
              </mesh>
            )}

            {/* Road Name Stenciled on Asphalt */}
            {layers.labels && road.name && road.id !== 'ROAD_BY2' && (
              <Text
                position={[0, 0.08, 0]}
                rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                fontSize={Math.max(0.24, worldW(road.widthMeters) * 0.16)}
                color={isSelected ? '#38bdf8' : '#94a3b8'}
                outlineWidth={0.02}
                outlineColor="#090d16"
              >
                {road.name}
              </Text>
            )}

            {/* In-Scene 3D Dimensions (Zero DOM nodes, 100% WebGL) */}
            {showDimensions && isSelected && (
              <Text
                position={[0, 0.4, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.5}
                color="#00f5d4"
                outlineWidth={0.05}
                outlineColor="#020b14"
              >
                {`W: ${road.widthMeters}m · L: ${road.lengthMeters}m`}
              </Text>
            )}
          </group>
        );
      })}

      {/* Stenciled "BY2" Highway Corridor Markings */}
      <BY2HighwayStencils />

      {/* Road Junctions and Connection Aprons */}
      <RealisticJunctions />

      {/* Weathered Pedestrian Crosswalks */}
      <RealisticZebraCrossings />
    </group>
  );
}

function BY2HighwayStencils() {
  const { layers } = useMapStore();
  if (!layers.labels) return null;

  const positions = [120, 280, 480, 620];
  return (
    <group position={[worldX(55), 0.08, 0]}>
      {positions.map((zPos, i) => (
        <group key={i} position={[0, 0, worldZ(zPos)]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
          <Text
            fontSize={1.4}
            color="#fef08a"
            outlineWidth={0.04}
            outlineColor="#111827"
            font="/fonts/arial.ttf"
          >
            BY2
          </Text>
        </group>
      ))}
    </group>
  );
}

function RealisticJunctions() {
  return (
    <group position={[0, 0.06, 0]}>
      {JUNCTIONS.map((j) => (
        <group key={j.id} position={[worldX(j.x), 0, worldZ(j.z)]}>
          <mesh receiveShadow>
            <cylinderGeometry args={[worldW(14), worldW(14), 0.02, 24]} />
            <meshStandardMaterial color="#1e252d" roughness={0.7} metalness={0.15} />
          </mesh>
          {j.hasTargetMarker && (
            <group position={[0, 0.02, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.9, 1.15, 32]} />
                <meshStandardMaterial color="#ef4444" roughness={0.3} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.5, 0.12]} />
                <meshStandardMaterial color="#ef4444" roughness={0.3} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.12, 2.5]} />
                <meshStandardMaterial color="#ef4444" roughness={0.3} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

function RealisticZebraCrossings() {
  return (
    <group position={[0, 0.07, 0]}>
      {ZEBRA_CROSSINGS.map((zc) => {
        const stripeCount = 6;
        const pw = worldW(zc.width);
        const pl = worldD(zc.length);

        return (
          <group
            key={zc.id}
            position={[worldX(zc.x), 0, worldZ(zc.z)]}
            rotation={[0, zc.rotation, 0]}
          >
            {Array.from({ length: stripeCount }).map((_, idx) => {
              const offX = -pw / 2 + (idx + 0.5) * (pw / stripeCount);
              return (
                <mesh key={idx} position={[offX, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[(pw / stripeCount) * 0.65, pl]} />
                  <meshStandardMaterial color="#f1f5f9" roughness={0.45} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Berth Wharfs & Operational Quay Aprons
// ─────────────────────────────────────────────────────────────
function RealisticBerths() {
  const { layers, selectBerth, selectedBerthId, showDimensions } = useMapStore();
  const concreteTex = useMemo(() => getConcretePavementTexture(), []);

  if (!layers.berths) return null;

  return (
    <group position={[0, 0.07, 0]} name="Berth_Aprons">
      {BERTHS.map((berth) => {
        const isSelected = selectedBerthId === berth.id;
        const pw = worldW(berth.length);
        const pd = worldD(berth.width);

        const widthArg = berth.orientation === 'horizontal' ? pw : pd;
        const depthArg = berth.orientation === 'horizontal' ? pd : pw;

        return (
          <group
            key={berth.id}
            position={[worldX(berth.x), 0.1, worldZ(berth.z)]}
            onClick={(e) => {
              if (useMapStore.getState().isDrawingMode) return;
              e.stopPropagation();
              selectBerth(berth.id);
            }}
          >
            {/* Reinforced Concrete Berth Deck Slab */}
            <mesh receiveShadow>
              <boxGeometry args={[widthArg, 0.2, depthArg]} />
              <meshStandardMaterial
                map={concreteTex}
                color={isSelected ? '#314e7a' : '#424f60'}
                roughness={0.7}
                metalness={0.2}
              />
            </mesh>

            {/* Quayside Safety Yellow Warning Strip */}
            <mesh
              position={[
                berth.orientation === 'vertical' ? widthArg / 2 - 0.08 : 0,
                0.11,
                berth.orientation === 'vertical' ? 0 : depthArg / 2 - 0.06,
              ]}
            >
              <boxGeometry
                args={[
                  berth.orientation === 'vertical' ? 0.16 : widthArg,
                  0.02,
                  berth.orientation === 'vertical' ? depthArg : 0.16,
                ]}
              />
              <meshStandardMaterial color="#eab308" roughness={0.35} />
            </mesh>

            {/* Stenciled Berth Name on Concrete Apron */}
            {layers.labels && (
              <Text
                position={[0, 0.22, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={Math.min(widthArg, depthArg) * 0.24}
                color={isSelected ? '#ffffff' : '#94a3b8'}
                outlineWidth={0.02}
                outlineColor="#0f172a"
                textAlign="center"
              >
                {berth.label}
              </Text>
            )}

            {/* In-Scene 3D Dimensions */}
            {showDimensions && isSelected && (
              <Text
                position={[0, 0.5, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.65}
                color="#60a5fa"
                outlineWidth={0.06}
                outlineColor="#020b14"
              >
                {`⚓ ${berth.length}m × ${berth.width}m (Draft: ${berth.depthDraft}m)`}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}



// ─────────────────────────────────────────────────────────────
// 6. Yard Blocks with Realistic Concrete Slabs & Selection
// ─────────────────────────────────────────────────────────────
function RealisticYardBlocks() {
  const {
    yardBlocks,
    layers,
    selectBlock,
    selectedBlockId,
    hoveredBlockId,
    hoverBlock,
  } = useMapStore();

  const concreteTex = useMemo(() => getConcretePavementTexture(), []);
  const asphaltTex = useMemo(() => getAsphaltTexture(), []);

  return (
    <group position={[0, 0.06, 0]} name="Yard_Blocks_Layer">
      {yardBlocks.map((block) => {
        const isSelected = selectedBlockId === block.id;
        const isHovered = hoveredBlockId === block.id;
        const meta = CATEGORY_META[block.category] || CATEGORY_META.roro;
        const pw = worldW(block.width);
        const pd = worldD(block.depth);
        const isBuilding = block.category === 'building';
        const h = isBuilding ? 1.6 : 0.14;

        const isContainer = block.category === 'container';
        const matTex = isContainer ? concreteTex : asphaltTex;

        return (
          <group
            key={block.id}
            position={[worldX(block.x), h / 2, worldZ(block.z)]}
            onClick={(e) => {
              if (useMapStore.getState().isDrawingMode) return;
              e.stopPropagation();
              selectBlock(isSelected ? null : block.id);
            }}
            onPointerEnter={(e) => {
              if (useMapStore.getState().isDrawingMode) return;
              e.stopPropagation();
              hoverBlock(block.id);
            }}
            onPointerLeave={() => hoverBlock(null)}
          >
            {/* Base Block Solid Surface */}
            <mesh receiveShadow castShadow={isBuilding}>
              <boxGeometry args={[pw, h, pd]} />
              <meshStandardMaterial
                map={isBuilding ? undefined : matTex}
                color={
                  isBuilding
                    ? '#334155'
                    : isSelected
                    ? '#2c4a75'
                    : isHovered
                    ? '#263b58'
                    : block.color || meta.color
                }
                roughness={isBuilding ? 0.4 : 0.75}
                metalness={isBuilding ? 0.3 : 0.15}
              />
            </mesh>

            {/* Industrial Painted Safety Perimeter */}
            {layers.boundaries && !isBuilding && (
              <mesh position={[0, h / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[pw * 0.99, pd * 0.99]} />
                <meshBasicMaterial visible={false} />
                <lineSegments position={[0, 0, 0]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(pw * 0.99, 0.01, pd * 0.99)]} />
                  <lineBasicMaterial
                    color={isSelected ? '#38bdf8' : isHovered ? '#fde047' : '#94a3b8'}
                    linewidth={1}
                  />
                </lineSegments>
              </mesh>
            )}

            {/* Legible Industrial Stenciled Block Label */}
            {layers.labels && block.label && (
              <Text
                position={[0, h / 2 + 0.16, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={Math.min(pw, pd) * 0.2}
                color={isSelected ? '#ffffff' : '#f1f5f9'}
                outlineWidth={0.03}
                outlineColor="#090d16"
                textAlign="center"
                maxWidth={pw * 0.95}
              >
                {block.label}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. Coastal Landscaping & Natural Greenery
// ─────────────────────────────────────────────────────────────
function RealisticLandscapeTrees() {
  const { layers } = useMapStore();
  if (!layers.trees) return null;

  return (
    <group position={[0, 0.04, 0]} name="Greenery_Clusters">
      {TREE_CLUSTERS.map((tree, i) => (
        <group
          key={i}
          position={[worldX(tree.x), 0, worldZ(tree.z)]}
          scale={[tree.scale, tree.scale, tree.scale]}
        >
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.11, 0.9, 6]} />
            <meshStandardMaterial color="#3b2b1d" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
            <sphereGeometry args={[0.75, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#1b4332' : '#2d6a4f'} roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.6, 0]} castShadow>
            <sphereGeometry args={[0.55, 7, 7]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. Atmospheric Sky Dome & Maritime Lighting (Blue-Hour Port)
// ─────────────────────────────────────────────────────────────
function BlueHourSkyDome({ timeOfDay }: { timeOfDay: 'twilight' | 'night' | 'day' }) {
  const isDay = timeOfDay === 'day';
  const isNight = timeOfDay === 'night';

  const uniforms = useMemo(() => {
    return {
      topColor: {
        value: new THREE.Color(
          isDay ? '#1d54a6' : isNight ? '#030712' : '#0b1d3a'
        ),
      },
      bottomColor: {
        value: new THREE.Color(
          isDay ? '#93c5fd' : isNight ? '#0b1626' : '#203a5c'
        ),
      },
      offset: { value: 16.0 },
      exponent: { value: 0.68 },
    };
  }, [isDay, isNight]);

  useEffect(() => {
    uniforms.topColor.value.set(
      isDay ? '#1d54a6' : isNight ? '#030712' : '#0b1d3a'
    );
    uniforms.bottomColor.value.set(
      isDay ? '#93c5fd' : isNight ? '#0b1626' : '#203a5c'
    );
  }, [isDay, isNight, uniforms]);

  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[600, 32, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
          }
        `}
      />
    </mesh>
  );
}

function RealisticPortEnvironment() {
  const { timeOfDay } = useMapStore();
  const isDay = timeOfDay === 'day';
  const isNight = timeOfDay === 'night';
  const isTwilight = timeOfDay === 'twilight';

  const fogColor = isDay ? '#729ec4' : isNight ? '#040d1a' : '#0d2238';
  const ambientColor = isDay ? '#b8d8f8' : isNight ? '#223852' : '#5278a0';
  const ambientIntensity = isDay ? 1.4 : isNight ? 0.6 : 0.95;
  const sunColor = isDay ? '#fffdf0' : isNight ? '#a5c4e8' : '#fed7aa';
  const sunIntensity = isDay ? 2.5 : isNight ? 0.65 : 1.8;
  const sunPos: [number, number, number] = isDay ? [80, 100, 60] : isNight ? [60, 50, 40] : [90, 35, 55];

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 180, 850]} />

      <ambientLight color={ambientColor} intensity={ambientIntensity} />
      <hemisphereLight
        args={[
          isDay ? '#bae6fd' : '#7dd3fc',
          isDay ? '#0f2942' : '#081726',
          isDay ? 0.9 : 0.55,
        ]}
      />
      <directionalLight
        position={sunPos}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={400}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-70, 50, -60]} intensity={isDay ? 0.75 : 0.45} color="#38bdf8" />

      <BlueHourSkyDome timeOfDay={timeOfDay} />

      {(isTwilight || isNight) && (
        <Stars
          radius={300}
          depth={80}
          count={isNight ? 3500 : 1800}
          factor={isNight ? 4.5 : 3.0}
          saturation={0.4}
          fade
          speed={0.8}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. Camera Rig (Elevated Isometric Overview & Smooth Interaction)
// ─────────────────────────────────────────────────────────────
function RealisticCameraRig() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const {
    viewMode,
    cameraTarget,
    setCameraTarget,
    isRotating,
    selectedBlockId,
    yardBlocks,
  } = useMapStore();

  const isLerping = useRef(false);
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef<THREE.Vector3 | null>(null);

  const defaultIsoPos = useMemo(() => new THREE.Vector3(-68, 72, 78), []);
  const defaultIsoTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useEffect(() => {
    if (viewMode === '2d-top') {
      camera.position.set(0, 115, 0);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.maxPolarAngle = 0.05;
        controlsRef.current.minPolarAngle = 0;
        controlsRef.current.enableRotate = false;
        controlsRef.current.update();
      }
    } else {
      camera.position.copy(defaultIsoPos);
      camera.lookAt(defaultIsoTarget);
      if (controlsRef.current) {
        controlsRef.current.target.copy(defaultIsoTarget);
        controlsRef.current.maxPolarAngle = Math.PI / 2.08;
        controlsRef.current.minPolarAngle = 0.05;
        controlsRef.current.enableRotate = true;
        controlsRef.current.update();
      }
    }
  }, [viewMode, camera, defaultIsoPos, defaultIsoTarget]);

  useEffect(() => {
    if (cameraTarget) {
      const [tx, ty, tz] = cameraTarget;
      const wx = worldX(tx);
      const wz = worldZ(tz);
      targetLookAt.current.set(wx, ty, wz);

      const selBlock = selectedBlockId
        ? yardBlocks.find((b) => b.id === selectedBlockId)
        : null;

      if (viewMode !== '2d-top') {
        if (selBlock) {
          const span = Math.max(worldW(selBlock.width), worldD(selBlock.depth));
          const dist = Math.max(span * 1.6 + 10, 24);
          targetCamPos.current = new THREE.Vector3(
            wx - dist * 0.65,
            dist * 0.72,
            wz + dist * 0.65
          );
        } else {
          const offset = camera.position.clone().sub(targetLookAt.current);
          const dist = Math.min(Math.max(offset.length(), 20), 45);
          offset.normalize().multiplyScalar(dist);
          offset.y = Math.max(16, Math.abs(offset.y));
          targetCamPos.current = targetLookAt.current.clone().add(offset);
        }
      } else {
        targetCamPos.current = new THREE.Vector3(wx, 100, wz);
      }
      isLerping.current = true;
    }
  }, [cameraTarget, selectedBlockId, yardBlocks, viewMode, camera]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onStart = () => {
      if (isLerping.current) {
        isLerping.current = false;
        targetCamPos.current = null;
        setCameraTarget(null);
      }
    };

    controls.addEventListener('start', onStart);
    return () => controls.removeEventListener('start', onStart);
  }, [setCameraTarget]);

  useFrame(() => {
    if (!controlsRef.current) return;

    if (isRotating) {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 0.8;
    } else {
      controlsRef.current.autoRotate = false;
    }

    if (isLerping.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.08);
      if (targetCamPos.current) {
        camera.position.lerp(targetCamPos.current, 0.08);
      }
      controlsRef.current.update();

      const distTarget = controlsRef.current.target.distanceTo(targetLookAt.current);
      const distCam = targetCamPos.current ? camera.position.distanceTo(targetCamPos.current) : 0;
      if (distTarget < 0.08 && distCam < 0.15) {
        isLerping.current = false;
        targetCamPos.current = null;
        setCameraTarget(null);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      screenSpacePanning={true}
      panSpeed={1.2}
      rotateSpeed={0.8}
      zoomSpeed={1.2}
      minDistance={2.5}
      maxDistance={320}
      maxPolarAngle={Math.PI / 2.08}
      minPolarAngle={0.02}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// 10. Main Realistic YardMap3D Component
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// 10. Interactive Yard Placement Ghost Preview & Click-to-Place
// ─────────────────────────────────────────────────────────────
function InteractiveYardPlacer() {
  const {
    isDrawingMode,
    setPendingNewYardPos,
    setCreateYardModalOpen,
    setDrawingMode,
  } = useMapStore();
  const [hoverPos, setHoverPos] = useState<[number, number] | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  if (!isDrawingMode) return null;

  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    if (e.point) {
      const mx = Math.round(mapX(e.point.x));
      const mz = Math.round(mapZ(e.point.z));
      const clampedX = Math.max(30, Math.min(970, mx));
      const clampedZ = Math.max(30, Math.min(970, mz));
      setHoverPos([clampedX, clampedZ]);
    }
  };

  const triggerPlacement = (point: THREE.Vector3) => {
    const mx = Math.round(mapX(point.x));
    const mz = Math.round(mapZ(point.z));
    const clampedX = Math.max(30, Math.min(970, mx));
    const clampedZ = Math.max(30, Math.min(970, mz));
    setPendingNewYardPos([clampedX, clampedZ]);
    setDrawingMode(false);
    setCreateYardModalOpen(true);
  };

  const handlePointerDown = (e: any) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: any) => {
    if (!pointerStartRef.current) return;
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    pointerStartRef.current = null;
    // Tolerates small hand shake (< 10px), ignores actual OrbitControls panning/rotating
    if (dx < 10 && dy < 10 && e.point) {
      e.stopPropagation();
      triggerPlacement(e.point);
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (e.point) {
      triggerPlacement(e.point);
    }
  };

  const wx = hoverPos ? worldX(hoverPos[0]) : 0;
  const wz = hoverPos ? worldZ(hoverPos[1]) : 0;

  return (
    <group name="Interactive_Yard_Placer" renderOrder={9999}>
      {/* Elevated High-Priority Interactive Receiver Plane for Cursor Raycasting */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[worldX(500), 0.35, worldZ(500)]}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
      >
        <planeGeometry args={[3000, 3000]} />
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
      </mesh>

      {/* Holographic 3D Yard Preview following Cursor */}
      {hoverPos && (
        <group position={[wx, 0.4, wz]}>
          {/* Glowing Green Footprint Area (Default 120m x 60m preview) */}
          <mesh receiveShadow>
            <boxGeometry args={[worldW(120), 0.2, worldD(60)]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={0.8}
              transparent
              opacity={0.45}
              roughness={0.2}
            />
          </mesh>

          {/* High-visibility Pulsing Border */}
          <lineSegments position={[0, 0.12, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(worldW(120), 0.05, worldD(60))]} />
            <lineBasicMaterial color="#34d399" linewidth={3} />
          </lineSegments>

          {/* Center Target Bullseye */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
            <ringGeometry args={[0.8, 1.4, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#10b981" emissiveIntensity={1.5} />
          </mesh>

          {/* 3D Floating Location Label */}
          <Text
            position={[0, 3.5, 0]}
            fontSize={1.4}
            color="#ffffff"
            outlineWidth={0.1}
            outlineColor="#064e3b"
            textAlign="center"
          >
            {`📍 NEW YARD LOCATION\nX: ${hoverPos[0]}m | Z: ${hoverPos[1]}m\n[CLICK TO CONFIRM]`}
          </Text>
        </group>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 11. Main Realistic YardMap3D Component
// ─────────────────────────────────────────────────────────────
export default function YardMap3D() {
  const setCameraTarget = useMapStore((s) => s.setCameraTarget);
  const yardBlocks = useMapStore((s) => s.yardBlocks);

  const handleSceneDoubleClick = (e: any) => {
    e.stopPropagation();
    if (e.point) {
      const mx = mapX(e.point.x);
      const mz = mapZ(e.point.z);
      setCameraTarget([mx, Math.max(0, e.point.y), mz]);
    }
  };

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: [-68, 72, 78], fov: 38, near: 0.1, far: 1200 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
        style={{
          background: 'radial-gradient(ellipse at bottom, #0d2238 0%, #081729 60%, #030a14 100%)',
        }}
        onPointerMissed={() => {
          useMapStore.getState().selectBlock(null);
          useMapStore.getState().selectBerth(null);
          useMapStore.getState().selectRoad(null);
          useMapStore.getState().selectShip(null);
        }}
      >
        <group onDoubleClick={handleSceneDoubleClick}>
          {/* Blue-Hour Sky & Port Lighting */}
          <RealisticPortEnvironment />

          {/* Deep Navy Harbor Water */}
          <RealisticWater />

          {/* Authentic Hambantota Regional Mainland & Breakwaters */}
          <RealisticHambantotaEnvironment />

          {/* Weathered Port Ground & Asphalt */}
          <RealisticPortGround />

          {/* Road Network with Painted Lane Markings */}
          <RealisticRoadsNetwork />

          {/* Concrete Berth Aprons & Coping */}
          <RealisticBerths />

          {/* Quayside Caisson Walls, Rubber Fenders & Mooring Bollards */}
          <RealisticQuayInfrastructure />

          {/* STS Container Gantry Cranes & Jib Cranes */}
          <RealisticQuayCranes />

          {/* Moored Commercial Ships with Deployed RoRo Stern Ramps */}
          <RealisticPortFleet />

          {/* Yard Storage Blocks with Concrete Slabs & Stenciled Labels */}
          <RealisticYardBlocks />

          {/* Detailed RoRo Vehicle Fleet (Passenger Cars, SUVs, Vans) */}
          <RealisticRoRoFleet yardBlocks={yardBlocks} />

          {/* ISO Shipping Container Stacks (Corrugated Steel) */}
          <RealisticContainerStacks yardBlocks={yardBlocks} />

          {/* Green Landscaping & Buffer Trees */}
          <RealisticLandscapeTrees />

          {/* High-Mast Floodlight Towers with Warm Light Pools */}
          <RealisticHighMastLighting />

          {/* Interactive Yard Placement Ghost Preview & Click-to-Place */}
          <InteractiveYardPlacer />
        </group>

        {/* Professional Isometric Camera Rig */}
        <RealisticCameraRig />
      </Canvas>
    </div>
  );
}
