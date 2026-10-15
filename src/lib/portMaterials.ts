// ============================================================
// HIPG INDUSTRIAL PORT DIGITAL TWIN - PBR TEXTURES & MATERIALS
// High-fidelity procedural textures generated via HTML5 Canvas
// High performance, zero external asset dependencies, instant load
// ============================================================

import * as THREE from 'three';

// Cache generated textures to prevent re-creation
const textureCache = new Map<string, THREE.Texture>();

/**
 * Creates a weathered industrial port asphalt texture.
 * Features realistic dark aggregate speckles, subtle micro-roughness,
 * tire scrub marks, oil drip stains, and concrete/asphalt grain.
 */
export function getAsphaltTexture(): THREE.CanvasTexture {
  const cacheKey = 'asphalt_diffuse';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base weathered dark asphalt color
  ctx.fillStyle = '#1e242d';
  ctx.fillRect(0, 0, size, size);

  // Micro-aggregate mineral specks (subtle stone grain)
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 28;
    const speckle = Math.random() > 0.985 ? (Math.random() > 0.5 ? 40 : -30) : 0;
    data[i] = Math.min(255, Math.max(0, data[i] + noise + speckle));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise + speckle));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + speckle));
  }
  ctx.putImageData(imgData, 0, 0);

  // Faint tire scrub and traffic wear patches
  ctx.strokeStyle = 'rgba(15, 18, 24, 0.45)';
  ctx.lineWidth = 14;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    const y = Math.random() * size;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(size * 0.3, y + (Math.random() - 0.5) * 30, size * 0.7, y + (Math.random() - 0.5) * 30, size, y);
    ctx.stroke();
  }

  // Subtle oil drip spots in vehicle corridors
  for (let i = 0; i < 8; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    const grad = ctx.createRadialGradient(rx, ry, 2, rx, ry, 12 + Math.random() * 16);
    grad.addColorStop(0, 'rgba(10, 12, 16, 0.5)');
    grad.addColorStop(1, 'rgba(10, 12, 16, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.anisotropy = 8;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates heavy-duty seaport concrete pavement texture.
 * Features precast concrete slabs, chamfered expansion joints,
 * subtle mottling, tire scuffs, and weathered surface texture.
 */
export function getConcretePavementTexture(): THREE.CanvasTexture {
  const cacheKey = 'concrete_pavement';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base industrial seaport concrete (muted cool grey)
  ctx.fillStyle = '#3a4452';
  ctx.fillRect(0, 0, size, size);

  // Surface mineral noise
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 20;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Slab grid expansion joints (precast modular concrete pavers)
  ctx.strokeStyle = '#202630';
  ctx.lineWidth = 3;
  const step = size / 4; // 4x4 slab grid per tile
  for (let x = 0; x <= size; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Soft chamfer highlight along joint edges
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  for (let x = 1.5; x <= size; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 1.5; y <= size; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Subtle tyre braking wear marks
  ctx.fillStyle = 'rgba(20, 25, 32, 0.28)';
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * (size - 80);
    const y = Math.random() * (size - 30);
    ctx.fillRect(x, y, 70, 16);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.anisotropy = 8;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates heavy-duty marine quay wall caisson texture.
 * Features vertical concrete casting seams, tide marks, water line staining,
 * algae discoloration at bottom, and rubber fender scuffs.
 */
export function getQuayWallTexture(): THREE.CanvasTexture {
  const cacheKey = 'quay_wall';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base weathered marine reinforced concrete
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, '#525d6c'); // Top quay coping
  grad.addColorStop(0.5, '#3e4856'); // Mid tidal zone
  grad.addColorStop(0.85, '#25353d'); // High tide wet mark
  grad.addColorStop(1.0, '#162828'); // Marine algae / barnacle zone
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Vertical formwork seams every 64px
  ctx.strokeStyle = '#222a34';
  ctx.lineWidth = 3;
  for (let x = 0; x <= size; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }

  // Horizontal tide line streak
  ctx.fillStyle = 'rgba(15, 25, 28, 0.45)';
  ctx.fillRect(0, size * 0.72, size, 22);

  // Subtle vertical water drip stains
  ctx.strokeStyle = 'rgba(20, 28, 35, 0.35)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 14; i++) {
    const x = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size * (0.6 + Math.random() * 0.35));
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(16, 1);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates corrugated steel side texture for ISO shipping containers.
 * Features realistic vertical stamped corrugations with light/shadow relief,
 * top & bottom rail weld seams, corner casting details, and subtle paint wear.
 */
export function getContainerCorrugatedTexture(colorHex: string = '#0e4d75'): THREE.CanvasTexture {
  const cacheKey = `cont_side_${colorHex}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base container color
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, width, height);

  // Vertical corrugation flutes (ribs)
  const ribWidth = 16;
  for (let x = 24; x < width - 24; x += ribWidth) {
    // Ridge highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.fillRect(x, 14, ribWidth * 0.35, height - 28);
    // Valley shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.fillRect(x + ribWidth * 0.5, 14, ribWidth * 0.45, height - 28);
  }

  // Top structural rail (heavy steel box section)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.fillRect(0, 0, width, 14);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(0, 12, width, 2);

  // Bottom structural sill rail
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(0, height - 16, width, 16);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(0, height - 16, width, 2);

  // End corner posts
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, 24, height);
  ctx.fillRect(width - 24, 0, 24, height);

  // Subtle industrial grime and weathering along bottom edge
  const grimeGrad = ctx.createLinearGradient(0, height - 40, 0, height);
  grimeGrad.addColorStop(0, 'rgba(30, 25, 20, 0)');
  grimeGrad.addColorStop(1, 'rgba(30, 25, 20, 0.45)');
  ctx.fillStyle = grimeGrad;
  ctx.fillRect(0, height - 40, width, 40);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates rear door texture for ISO shipping containers.
 * Features dual swinging doors, two vertical locking rods per door,
 * locking handles, CSC safety approval plate, and serial numbers.
 */
export function getContainerDoorTexture(colorHex: string = '#0e4d75'): THREE.CanvasTexture {
  const cacheKey = `cont_door_${colorHex}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base door panel
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, size, size);

  // Heavy steel door perimeter frame
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.fillRect(0, 0, size, 12); // Top
  ctx.fillRect(0, size - 14, size, 14); // Bottom
  ctx.fillRect(0, 0, 14, size); // Left post
  ctx.fillRect(size - 14, 0, 14, size); // Right post
  ctx.fillRect(size / 2 - 3, 0, 6, size); // Center door seam

  // 4 Vertical Steel Locking Bars (2 per door)
  const barPositions = [size * 0.2, size * 0.35, size * 0.65, size * 0.8];
  barPositions.forEach((bx) => {
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(bx - 4, 10, 8, size - 22);
    // Steel rod
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bx - 2, 10, 4, size - 22);
    // Rod brackets (top, middle, bottom)
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx - 6, 20, 12, 10);
    ctx.fillRect(bx - 6, size / 2 - 5, 12, 10);
    ctx.fillRect(bx - 6, size - 32, 12, 10);
    // Locking handle in middle
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bx - 2, size / 2, 14, 4);
  });

  // CSC Safety Approval Plate (White metal placard on left door)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(24, 40, 46, 26);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.strokeRect(24, 40, 46, 26);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(27, 44, 40, 2);
  ctx.fillRect(27, 49, 36, 2);
  ctx.fillRect(27, 54, 38, 2);
  ctx.fillRect(27, 59, 28, 2);

  // Container Identification Number (Right door top)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('HIPU 829104', size * 0.52, 38);
  ctx.font = '7px monospace';
  ctx.fillText('45G1  MAX.WT', size * 0.52, 50);
  ctx.fillText('30,480 KG', size * 0.52, 60);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates ocean surface water normal map for dynamic Three.js reflections.
 */
export function getWaterNormalTexture(): THREE.CanvasTexture {
  const cacheKey = 'water_normal';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Generate smooth procedural wave normals
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const wave1 = Math.sin(x * 0.12) * Math.cos(y * 0.12);
      const wave2 = Math.sin((x + y) * 0.08) * 0.5;
      const wave3 = Math.cos((x - y) * 0.16) * 0.25;
      const nx = (wave1 + wave2 + wave3) * 0.35;
      const ny = (wave2 - wave1 + wave3) * 0.35;

      data[idx] = Math.floor((nx * 0.5 + 0.5) * 255); // Red (X normal)
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255); // Green (Y normal)
      data[idx + 2] = 235; // Blue (Z normal facing up)
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(32, 32);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Realistic industrial container palette with authentic maritime carrier colors
 */
export const INDUSTRIAL_CONTAINER_COLORS = [
  '#0e4d75', // Maersk Ocean Blue
  '#b93b22', // Hapag-Lloyd Orange-Red
  '#135338', // Evergreen Dark Pine
  '#1b2d4f', // CMA CGM Deep Navy
  '#3d454f', // K-Line Industrial Slate Grey
  '#c77a1e', // MSC Amber Ochre
  '#8a1a38', // ONE Magenta Crimson
  '#2d3b48', // Yang Ming Charcoal
  '#d5dbe2', // Weathered Freight White
];

/**
 * Realistic RoRo passenger & commercial vehicle palette
 */
export const RORO_VEHICLE_COLORS = [
  '#f8fafc', // Polar White (Most popular export car color)
  '#f1f5f9', // Pearl White Metallic
  '#cbd5e1', // Silver Metallic
  '#94a3b8', // Titanium Grey
  '#475569', // Granite Metallic
  '#1e293b', // Deep Midnight Black
  '#1e3a8a', // Pacific Blue Metallic
  '#991b1b', // Garnet Red Metallic
  '#b45309', // Bronze / Amber Gold
];

/**
 * Creates 45-degree yellow and black industrial safety warning hazard stripes.
 */
export function getWarningStripesTexture(): THREE.CanvasTexture {
  const cacheKey = 'warning_stripes';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#eab308'; // Safety yellow
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#111827'; // Dark charcoal
  const stripeWidth = 16;
  ctx.beginPath();
  for (let x = -size; x < size * 2; x += stripeWidth * 2) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripeWidth, 0);
    ctx.lineTo(x + stripeWidth + size, size);
    ctx.lineTo(x + size, size);
    ctx.closePath();
  }
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates procedural sea foam and wake caustics texture.
 */
export function getWaterFoamTexture(): THREE.CanvasTexture {
  const cacheKey = 'water_foam';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(255, 255, 255, 0)';
  ctx.fillRect(0, 0, size, size);

  // Generate lacy cellular water foam patterns
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 2 + Math.random() * 8;
    const alpha = 0.2 + Math.random() * 0.55;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(235, 248, 255, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    if (Math.random() > 0.6) {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates authentic Hyundai GLOVIS car carrier hull texture with
 * signature Glovis Deep Blue bottom, Cyan accent line, White upper hull,
 * and bold "GLOVIS" brand livery typography.
 */
export function getGlovisHullTexture(): THREE.CanvasTexture {
  const cacheKey = 'glovis_hull';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const w = 1024;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // 1. Lower 65% Glovis Deep Marine Blue
  ctx.fillStyle = '#0b3558';
  ctx.fillRect(0, 0, w, h);

  // 2. Upper 35% Pure White Freeboard
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h * 0.36);

  // 3. Signature Glovis Cyan/Sky Blue Accent Stripe
  ctx.fillStyle = '#00a8e8';
  ctx.fillRect(0, h * 0.36, w, 8);

  // 4. Subtle internal car deck weld lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 1.5;
  for (let y = h * 0.48; y < h; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 5. Ventilation intake louvers along upper car decks
  ctx.fillStyle = '#1e293b';
  for (let x = 60; x < w - 60; x += 36) {
    if (x > 340 && x < 680) continue; // Leave center clear for large GLOVIS logo
    for (let row = 0; row < 2; row++) {
      ctx.fillRect(x, h * 0.12 + row * 16, 20, 10);
    }
  }

  // 6. Prominent Bold White "GLOVIS" Livery Typography
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 88px "Arial Black", "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.fillText('G L O V I S', w * 0.5, h * 0.68);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates authentic NYK Line (Nippon Yusen Kaisha) car carrier hull texture with
 * deep NYK Royal Navy Blue, crisp white upper topsides, and bold "NYK LINE" branding.
 */
export function getNykHullTexture(): THREE.CanvasTexture {
  const cacheKey = 'nyk_hull';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const w = 1024;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // 1. Lower 65% NYK Deep Royal Blue
  ctx.fillStyle = '#09213d';
  ctx.fillRect(0, 0, w, h);

  // 2. Upper 35% Crisp Polar White
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h * 0.35);

  // 3. Thin separator line
  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(0, h * 0.35, w, 4);

  // 4. Ventilation intake louvers along car decks
  ctx.fillStyle = '#1e293b';
  for (let x = 70; x < w - 70; x += 38) {
    if (x > 320 && x < 700) continue; // Clear for NYK LINE logo
    for (let row = 0; row < 2; row++) {
      ctx.fillRect(x, h * 0.12 + row * 16, 22, 10);
    }
  }

  // 5. Bold Crisp "NYK LINE" Livery
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 82px "Arial Black", "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 6;
  ctx.fillText('N Y K   L I N E', w * 0.5, h * 0.68);

  // NYK Two Red Square Bars Brand Mark beside logo
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(w * 0.18, h * 0.58, 48, 14);
  ctx.fillRect(w * 0.18, h * 0.72, 48, 14);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates authentic NYK Line "Ni-biki" (two red bands on white) signature funnel texture.
 */
export function getNykFunnelTexture(): THREE.CanvasTexture {
  const cacheKey = 'nyk_funnel';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // White funnel body
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, size, size);

  // Top exhaust soot cap
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, size, 42);

  // Two iconic NYK horizontal red bands (Ni-biki)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 95, size, 32);
  ctx.fillRect(0, 150, size, 32);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates authentic Hyundai GLOVIS blue & cyan corporate funnel texture.
 */
export function getGlovisFunnelTexture(): THREE.CanvasTexture {
  const cacheKey = 'glovis_funnel';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Glovis deep blue funnel body
  ctx.fillStyle = '#0b3558';
  ctx.fillRect(0, 0, size, size);

  // Top exhaust soot cap
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, size, 42);

  // Center white & Glovis cyan corporate stripe
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 95, size, 48);

  ctx.fillStyle = '#00a8e8';
  ctx.fillRect(0, 112, size, 14);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}


