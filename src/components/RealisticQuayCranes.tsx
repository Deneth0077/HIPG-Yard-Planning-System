// ============================================================
// HIPG SEAPORT 3D DIGITAL TWIN - ULTRA-REALISTIC STS QUAY CRANES
// Authentic Ship-to-Shore (STS) Container Gantry Cranes & Jib Cranes:
// - Heavy A-frame gantry portal structure with diagonal K/X-bracing
// - Multi-wheel rail travel bogies with yellow/black hazard chevrons
// - High lattice pylon tower, machinery house with HIPG port livery
// - Long outreach lattice truss boom with steel forestay suspension cables
// - Traversing motorized trolley & panoramic glass operator cabin
// - Telescopic 40ft/20ft container spreader with corner flippers
// - Active container hoisting, floodlights & aircraft warning beacons
// ============================================================

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { QUAY_CRANES, type QuayCrane } from '@/lib/hipgMapData';
import { useMapStore } from '@/lib/mapStore';
import { getWarningStripesTexture } from '@/lib/portMaterials';

const SCALE = 0.1;
function worldX(x: number) { return (x - 500) * SCALE; }
function worldZ(z: number) { return (z - 500) * SCALE; }
function worldW(w: number) { return w * SCALE; }

/**
 * 3D Structural Steel Tension Wire Cable
 */
function Cable({
  start,
  end,
  color = '#94a3b8',
  radius = 0.015,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  radius?: number;
}) {
  const vStart = useMemo(() => new THREE.Vector3(...start), [start]);
  const vEnd = useMemo(() => new THREE.Vector3(...end), [end]);
  const mid = useMemo(() => vStart.clone().add(vEnd).multiplyScalar(0.5), [vStart, vEnd]);
  const len = useMemo(() => Math.max(vStart.distanceTo(vEnd), 0.001), [vStart, vEnd]);
  const quat = useMemo(() => {
    const dir = vEnd.clone().sub(vStart).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  }, [vStart, vEnd]);

  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, len, 4]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

export function RealisticQuayCranes() {
  const { layers, timeOfDay } = useMapStore();
  const warningTex = useMemo(() => getWarningStripesTexture(), []);

  if (!layers.cranes) return null;

  return (
    <group position={[0, 0.1, 0]} name="Quayside_STS_Cranes">
      {QUAY_CRANES.map((qc, index) => (
        <group
          key={qc.id}
          position={[worldX(qc.x), 0, worldZ(qc.z)]}
          rotation={[0, qc.rotation, 0]}
        >
          {qc.type === 'sts' ? (
            <STSContainerGantryCrane
              crane={qc}
              index={index}
              warningTex={warningTex}
              timeOfDay={timeOfDay}
            />
          ) : (
            <LiebherrMobileHarborCrane
              crane={qc}
              index={index}
              warningTex={warningTex}
            />
          )}
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. SHIP-TO-SHORE (STS) CONTAINER GANTRY CRANE
// ─────────────────────────────────────────────────────────────

interface STSProps {
  crane: QuayCrane;
  index: number;
  warningTex: THREE.CanvasTexture;
  timeOfDay: string;
}

function STSContainerGantryCrane({ crane, index, warningTex, timeOfDay }: STSProps) {
  const beaconRef = useRef<THREE.PointLight>(null!);
  const beaconMeshRef = useRef<THREE.Mesh>(null!);

  // Flashing red aircraft warning beacon at top pylon
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flash = Math.sin(t * 3.5 + index) > 0.2 ? 1 : 0.05;
    if (beaconRef.current) beaconRef.current.intensity = flash * 1.5;
    if (beaconMeshRef.current) {
      (beaconMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flash * 2.0;
    }
  });

  const boomReach = worldW(crane.boomLength) * 0.95; // ~3.8 to 4.2 Three.js units
  const backReach = boomReach * 0.42;

  // Trolley positioning: index 0 and 2 over ship hold, index 1 and 3 closer to quay
  const trolleyPos = index % 2 === 0 ? boomReach * 0.65 : boomReach * 0.42;
  const hoistHeight = index % 2 === 0 ? 1.8 : 3.2;

  // Container colors on active hoist
  const hoistColors = ['#0e4d75', '#c77a1e', '#8a1a38', '#135338'];
  const activeBoxColor = hoistColors[index % hoistColors.length];

  const primaryBlue = '#1a437a'; // Classic ZPMC / HIPG Marine Blue
  const machineryWhite = '#f1f5f9';
  const cableColor = '#94a3b8';

  return (
    <group name={crane.name}>
      {/* ── 1. QUAYSIDE CRANE RAILS (Seaside & Landside embedded steel rails) ── */}
      {[-1.2, 1.2].map((railZ, ri) => (
        <group key={`rail-${ri}`} position={[0, 0.03, railZ]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.2, 0.06, 0.08]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Base tie plates */}
          {[-1.6, -0.8, 0, 0.8, 1.6].map((tx, ti) => (
            <mesh key={`tie-${ti}`} position={[tx, -0.01, 0]}>
              <boxGeometry args={[0.2, 0.03, 0.18]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── 2. GANTRY RAIL BOGIES (8-wheel rail trucks with yellow hazard chevrons) ── */}
      {[-1.15, 1.15].map((bx, i) =>
        [-1.2, 1.2].map((bz, j) => (
          <group key={`bogie-${i}-${j}`} position={[bx, 0.16, bz]}>
            {/* Bogie structural steel beam */}
            <mesh castShadow>
              <boxGeometry args={[0.85, 0.22, 0.28]} />
              <meshStandardMaterial color={primaryBlue} metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Front & rear hazard warning buffer skirts */}
            <mesh position={[0, -0.04, 0]}>
              <boxGeometry args={[0.9, 0.12, 0.3]} />
              <meshStandardMaterial map={warningTex} roughness={0.3} />
            </mesh>
            {/* Crane rail wheels */}
            {[-0.28, 0, 0.28].map((wx, wi) => (
              <mesh key={`wheel-${wi}`} position={[wx, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.07, 0.07, 0.26, 12]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
            {/* Storm anchor locking pin */}
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
              <meshStandardMaterial color="#eab308" metalness={0.8} />
            </mesh>
          </group>
        ))
      )}

      {/* ── 3. PORTAL GANTRY A-FRAME LEGS & SILL BEAMS ── */}
      {/* Lower sill beams connecting seaside/landside legs */}
      {[-1.2, 1.2].map((sz, si) => (
        <mesh key={`sill-${si}`} position={[0, 0.32, sz]} castShadow>
          <boxGeometry args={[2.4, 0.24, 0.26]} />
          <meshStandardMaterial color={primaryBlue} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* 4 Inward-slanted portal tubular legs */}
      {[
        { start: [-1.15, 0.28, -1.2], end: [-0.65, 3.2, -0.65] },
        { start: [1.15, 0.28, -1.2], end: [0.65, 3.2, -0.65] },
        { start: [-1.15, 0.28, 1.2], end: [-0.65, 3.2, 0.65] },
        { start: [1.15, 0.28, 1.2], end: [0.65, 3.2, 0.65] },
      ].map((leg, li) => {
        const vStart = new THREE.Vector3(...leg.start);
        const vEnd = new THREE.Vector3(...leg.end);
        const mid = vStart.clone().add(vEnd).multiplyScalar(0.5);
        const len = vStart.distanceTo(vEnd);
        const dir = vEnd.clone().sub(vStart).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

        return (
          <group key={`leg-${li}`} position={mid.toArray()} quaternion={quat}>
            <mesh castShadow>
              <boxGeometry args={[0.22, len, 0.22]} />
              <meshStandardMaterial color={primaryBlue} metalness={0.6} roughness={0.35} />
            </mesh>
            {/* White reflective service accent stripe */}
            <mesh position={[0, -len * 0.15, 0]}>
              <boxGeometry args={[0.23, 0.35, 0.23]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
          </group>
        );
      })}

      {/* Diagonal K-brace portal cross members between legs */}
      {[-1, 1].map((sideZ, zi) => (
        <group key={`kbrace-${zi}`} position={[0, 1.8, sideZ * 0.95]}>
          {/* Left diagonal */}
          <mesh rotation={[0, 0, 0.45]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 1.9, 6]} />
            <meshStandardMaterial color={primaryBlue} metalness={0.6} />
          </mesh>
          {/* Right diagonal */}
          <mesh rotation={[0, 0, -0.45]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 1.9, 6]} />
            <meshStandardMaterial color={primaryBlue} metalness={0.6} />
          </mesh>
          {/* Horizontal cross tie */}
          <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
            <meshStandardMaterial color={primaryBlue} />
          </mesh>
        </group>
      ))}

      {/* Safety Access Stairway / Ladder on seaside leg */}
      <mesh position={[0.72, 1.7, 0.9]}>
        <boxGeometry args={[0.08, 2.7, 0.14]} />
        <meshStandardMaterial color="#eab308" metalness={0.3} />
      </mesh>

      {/* ── 4. UPPER PORTAL GIRDER DECK & MACHINERY HOUSE ── */}
      {/* Heavy horizontal portal girder frame */}
      <mesh position={[0, 3.25, 0]} castShadow>
        <boxGeometry args={[1.9, 0.35, 1.7]} />
        <meshStandardMaterial color={primaryBlue} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Main Enclosed Machinery Room (Hoist, generator, electrical controls) */}
      <group position={[0, 4.05, -0.2]}>
        <mesh castShadow>
          <boxGeometry args={[1.65, 1.25, 1.45]} />
          <meshStandardMaterial color={machineryWhite} metalness={0.4} roughness={0.35} />
        </mesh>

        {/* Lower Blue Trim Skirt with Port Livery */}
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[1.67, 0.42, 1.47]} />
          <meshStandardMaterial color={primaryBlue} metalness={0.5} />
        </mesh>

        {/* Ventilation Louver Grilles */}
        {[-0.74, 0.74].map((lx, li) => (
          <mesh key={`louver-${li}`} position={[lx, 0.1, 0]}>
            <boxGeometry args={[0.03, 0.65, 0.95]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
        ))}

        {/* Roof Perimeter Safety Handrails */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[1.65, 0.18, 1.45]} />
          <meshStandardMaterial color="#eab308" wireframe />
        </mesh>

        {/* Top Auxiliary Maintenance Jib Crane */}
        <group position={[-0.45, 0.8, 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.45, 6]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
          <mesh position={[0.2, 0.22, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.55, 6]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
        </group>
      </group>

      {/* ── 5. APEX PYLON TOWER & SUSPENSION FORESTAYS ── */}
      {/* Dual A-Frame Pylon Apex */}
      <group position={[0, 5.5, 0]}>
        {[-0.55, 0.55].map((px, pi) => (
          <group key={`pylon-${pi}`} position={[px, 0, 0]}>
            {/* Front pylon leg */}
            <mesh position={[0, 0, 0.22]} rotation={[-0.22, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.07, 2.1, 6]} />
              <meshStandardMaterial color={primaryBlue} metalness={0.6} />
            </mesh>
            {/* Rear pylon leg */}
            <mesh position={[0, 0, -0.22]} rotation={[0.22, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.07, 2.1, 6]} />
              <meshStandardMaterial color={primaryBlue} metalness={0.6} />
            </mesh>
            {/* Top pylon apex cap */}
            <mesh position={[0, 1.05, 0]}>
              <boxGeometry args={[0.15, 0.22, 0.28]} />
              <meshStandardMaterial color={primaryBlue} />
            </mesh>
          </group>
        ))}

        {/* Pylon apex cross bar */}
        <mesh position={[0, 1.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 1.25, 6]} />
          <meshStandardMaterial color={primaryBlue} />
        </mesh>

        {/* Red Flashing Aviation Warning Beacon at apex */}
        <mesh ref={beaconMeshRef} position={[0, 1.24, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
        </mesh>
        <pointLight ref={beaconRef} position={[0, 1.24, 0]} color="#ef4444" distance={35} />

        {/* Steel Forestay Tension Cables to Outreach Boom */}
        {[-0.45, 0.45].map((cx, ci) => (
          <group key={`cable-front-${ci}`} position={[cx, 1.0, 0]}>
            {/* Forestay 1 (to mid boom) */}
            <Cable start={[0, 0, 0]} end={[0, -1.8, boomReach * 0.55]} color={cableColor} radius={0.014} />
            {/* Forestay 2 (to outer boom tip) */}
            <Cable start={[0, 0, 0]} end={[0, -1.8, boomReach * 0.92]} color={cableColor} radius={0.014} />
            {/* Backstay cable (to rear machinery counterweight) */}
            <Cable start={[0, 0, 0]} end={[0, -1.8, -backReach * 0.9]} color={cableColor} radius={0.014} />
          </group>
        ))}
      </group>

      {/* ── 6. OUTREACH LATTICE TRUSS BOOM (Extending over the vessel) ── */}
      <group position={[0, 3.45, 0]}>
        {/* Main twin girder boom beams extending forward */}
        {[-0.48, 0.48].map((gx, gi) => (
          <group key={`boom-girder-${gi}`} position={[gx, 0, boomReach / 2]}>
            {/* Bottom continuous chord */}
            <mesh position={[0, -0.16, 0]} castShadow>
              <boxGeometry args={[0.08, 0.1, boomReach]} />
              <meshStandardMaterial color={machineryWhite} metalness={0.4} />
            </mesh>
            {/* Top tapered chord */}
            <mesh position={[0, 0.18, 0]} castShadow>
              <boxGeometry args={[0.08, 0.08, boomReach]} />
              <meshStandardMaterial color={machineryWhite} metalness={0.4} />
            </mesh>
            {/* Diagonal lattice struts */}
            {Array.from({ length: 9 }).map((_, li) => {
              const lz = -boomReach / 2 + (li + 0.5) * (boomReach / 9);
              return (
                <mesh key={`strut-${li}`} position={[0, 0.01, lz]} rotation={[0.42 * (li % 2 === 0 ? 1 : -1), 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.42, 4]} />
                  <meshStandardMaterial color={primaryBlue} />
                </mesh>
              );
            })}
          </group>
        ))}

        {/* Boom tip sheave assembly with high-visibility red/white warning stripes */}
        <group position={[0, 0, boomReach]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.05, 0.38, 0.3]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <boxGeometry args={[1.07, 0.22, 0.04]} />
            <meshStandardMaterial map={warningTex} />
          </mesh>
          {/* Tip cable pulleys */}
          {[-0.32, 0.32].map((px, pi) => (
            <mesh key={`pulley-${pi}`} position={[px, 0.05, 0.1]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* ── REAR BACKREACH BOOM ── */}
        <group position={[0, 0, -backReach / 2]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.98, 0.36, backReach]} />
            <meshStandardMaterial color={primaryBlue} metalness={0.5} />
          </mesh>
          {/* Heavy concrete counterweight block at rear tip */}
          <mesh position={[0, -0.15, -backReach / 2]} castShadow>
            <boxGeometry args={[1.3, 0.65, 0.55]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
        </group>

        {/* Under-Boom LED Floodlight Bank (Illuminates container vessel deck) */}
        <group position={[0, -0.22, boomReach * 0.5]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.7, 0.08, 0.2]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {[-0.22, 0, 0.22].map((lx, li) => (
            <mesh key={`flood-${li}`} position={[lx, -0.04, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.03, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#e0f2fe"
                emissiveIntensity={timeOfDay === 'night' || timeOfDay === 'twilight' ? 3.0 : 0.8}
              />
            </mesh>
          ))}
          {/* Downward light pool cone onto ship hold */}
          <spotLight
            position={[0, -0.1, 0]}
            target-position={[0, -4.5, 0]}
            angle={0.65}
            penumbra={0.5}
            intensity={timeOfDay === 'night' ? 6.5 : timeOfDay === 'twilight' ? 4.5 : 1.5}
            color="#f0f9ff"
            distance={28}
          />
        </group>

        {/* ── 7. TRAVERSING TROLLEY & SUSPENDED OPERATOR CABIN ── */}
        <group position={[0, -0.22, trolleyPos]}>
          {/* Mobile trolley carriage frame */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.05, 0.16, 0.75]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.5} />
          </mesh>

          {/* Glazed Operator Cabin suspended below trolley */}
          <group position={[0.35, -0.55, 0.15]}>
            {/* Main cabin enclosure */}
            <mesh castShadow>
              <boxGeometry args={[0.38, 0.48, 0.52]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            {/* Floor-to-ceiling panoramic glass windows */}
            <mesh position={[0, -0.05, 0.18]}>
              <boxGeometry args={[0.34, 0.32, 0.18]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.65}
                roughness={0.1}
                transparent
                opacity={0.88}
              />
            </mesh>
            {/* Operator seat console outline inside */}
            <mesh position={[0, -0.08, 0]}>
              <boxGeometry args={[0.15, 0.18, 0.15]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </group>

          {/* 4 Steel Wire Hoist Cables hanging down to spreader */}
          {[-0.26, 0.26].map((hx, hi) =>
            [-0.22, 0.22].map((hz, hj) => (
              <Cable
                key={`hoist-${hi}-${hj}`}
                start={[hx, -0.08, hz]}
                end={[hx, -hoistHeight, hz]}
                color="#94a3b8"
                radius={0.012}
              />
            ))
          )}

          {/* ── 8. TELESCOPIC 40FT CONTAINER SPREADER ── */}
          <group position={[0, -hoistHeight, 0]}>
            {/* Central Spreader Headblock & Winch Sheaves */}
            <mesh position={[0, 0.12, 0]} castShadow>
              <boxGeometry args={[0.62, 0.14, 0.52]} />
              <meshStandardMaterial color="#eab308" metalness={0.5} />
            </mesh>

            {/* Telescopic Spreader Main Beam (Spanning 40ft length) */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.42, 0.12, 1.45]} />
              <meshStandardMaterial color="#eab308" metalness={0.5} />
            </mesh>

            {/* End twistlock beam frames */}
            {[-0.7, 0.7].map((ez, ei) => (
              <group key={`endbeam-${ei}`} position={[0, 0, ez]}>
                <mesh castShadow>
                  <boxGeometry args={[0.48, 0.14, 0.14]} />
                  <meshStandardMaterial color="#eab308" />
                </mesh>
                {/* 4 Corner Guidance Flippers (with yellow/black hazard chevrons) */}
                {[-0.22, 0.22].map((fx, fi) => (
                  <mesh key={`flipper-${fi}`} position={[fx, -0.1, 0]} rotation={[0, 0, fx > 0 ? 0.35 : -0.35]}>
                    <boxGeometry args={[0.05, 0.22, 0.12]} />
                    <meshStandardMaterial map={warningTex} />
                  </mesh>
                ))}
              </group>
            ))}

            {/* Actively Lowered 40ft Shipping Container on Crane */}
            {index % 2 === 0 && (
              <group position={[0, -0.42, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.46, 0.44, 1.42]} />
                  <meshStandardMaterial color={activeBoxColor} roughness={0.55} metalness={0.2} />
                </mesh>
                {/* 8 Steel corner castings */}
                {[-0.22, 0.22].map((cx, ci) =>
                  [-0.2, 0.2].map((cy, cj) =>
                    [-0.7, 0.7].map((cz, ck) => (
                      <mesh key={`corner-${ci}-${cj}-${ck}`} position={[cx, cy, cz]}>
                        <boxGeometry args={[0.045, 0.045, 0.045]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
                      </mesh>
                    ))
                  )
                )}
                {/* Shipping Carrier Identification Plate */}
                <mesh position={[0.235, 0, 0]}>
                  <boxGeometry args={[0.01, 0.16, 0.65]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.4} />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. LIEBHERR MOBILE HARBOR JIB CRANE (Berth 06)
// ─────────────────────────────────────────────────────────────

function LiebherrMobileHarborCrane({ crane, index, warningTex }: { crane: QuayCrane; index: number; warningTex: THREE.CanvasTexture }) {
  const boomAngle = 0.58; // ~33 degrees elevation

  return (
    <group name={crane.name}>
      {/* Heavy Rubber-Tired Multi-Axle Undercarriage Chassis */}
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.28, 1.7]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>

      {/* 4 Hydraulic Outrigger Stabilizers on Ground Support Pads */}
      {[
        [-0.75, 0.08, -0.75],
        [0.75, 0.08, -0.75],
        [-0.75, 0.08, 0.75],
        [0.75, 0.08, 0.75],
      ].map((pad, pi) => (
        <group key={`pad-${pi}`} position={[pad[0], pad[1], pad[2]]}>
          {/* Steel foundation plate */}
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 8]} />
            <meshStandardMaterial map={warningTex} />
          </mesh>
          {/* Diagonal hydraulic arm */}
          <mesh position={[-pad[0] * 0.25, 0.12, -pad[2] * 0.25]}>
            <boxGeometry args={[0.22, 0.14, 0.22]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      ))}

      {/* 8 Heavy Multi-Tire Sets */}
      {[-0.56, 0.56].map((tx, ti) =>
        [-0.6, -0.2, 0.2, 0.6].map((tz, tj) => (
          <mesh key={`tire-${ti}-${tj}`} position={[tx, 0.16, tz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.12, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* Slewing Ring & Central Heavy Cylindrical Tower Column */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.38, 1.5, 12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* Slewing Upper Superstructure & Operator Cab */}
      <group position={[0, 1.95, 0]}>
        {/* Machinery housing */}
        <mesh position={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.75, 0.68, 1.1]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>

        {/* Counterweight Block on Rear */}
        <mesh position={[0, 0, -0.9]} castShadow>
          <boxGeometry args={[0.85, 0.75, 0.45]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>

        {/* High-Visibility Tower Operator Glazed Capsule */}
        <group position={[0.42, 0.1, 0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.42, 0.45]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0.04, 0.05, 0.1]}>
            <boxGeometry args={[0.24, 0.28, 0.22]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.6}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>

        {/* Luffing Lattice Jib Boom */}
        <group position={[0, 0.25, 0.4]} rotation={[-boomAngle, 0, 0]}>
          {/* Main boom truss */}
          <mesh position={[0, 1.45, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.1, 2.9, 6]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.5} />
          </mesh>
          {/* Tip sheave */}
          <mesh position={[0, 2.95, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Hoist wire rope to cargo hook */}
          <Cable start={[0, 2.95, 0]} end={[0, 0.8, 0]} color="#94a3b8" radius={0.012} />
          {/* Heavy cargo hook / rotator block */}
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[0.14, 0.18, 0.14]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
