import { create } from 'zustand';
import {
  YARD_BLOCKS,
  DEMO_OCCUPANCY,
  type YardBlock,
} from '@/lib/hipgMapData';

export type ViewMode = '3d-isometric' | '2d-top';
export type LayerKey =
  | 'labels'
  | 'roads'
  | 'boundaries'
  | 'containers'
  | 'vehicles'
  | 'berths'
  | 'ships'
  | 'cranes'
  | 'dimensions'
  | 'trees'
  | 'lights';

export interface YardOccupancyItem {
  capacity: number;
  occupied: number;
  status: 'nominal' | 'warning' | 'critical';
}

interface MapState {
  yardBlocks: YardBlock[];
  yardOccupancy: Record<string, YardOccupancyItem>;
  selectedBlockId: string | null;
  hoveredBlockId: string | null;
  selectedRoadId: string | null;
  selectedBerthId: string | null;
  selectedShipId: string | null;
  viewMode: ViewMode;
  layers: Record<LayerKey, boolean>;
  searchQuery: string;
  cameraTarget: [number, number, number] | null;
  isRotating: boolean;
  showDimensions: boolean;
  timeOfDay: 'twilight' | 'night' | 'day';
  isLoggedIn: boolean;

  // Dynamic yard creation & editing state
  isDrawingMode: boolean;
  pendingNewYardPos: [number, number] | null;
  isCreateYardModalOpen: boolean;
  isEditYardModalOpen: boolean;
  editingBlockId: string | null;

  // Actions
  selectBlock: (id: string | null) => void;
  hoverBlock: (id: string | null) => void;
  selectRoad: (id: string | null) => void;
  selectBerth: (id: string | null) => void;
  selectShip: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleLayer: (layer: LayerKey) => void;
  setSearchQuery: (q: string) => void;
  setCameraTarget: (target: [number, number, number] | null) => void;
  setRotating: (v: boolean) => void;
  toggleDimensions: () => void;
  setTimeOfDay: (tod: 'twilight' | 'night' | 'day') => void;
  setLoggedIn: (v: boolean) => void;
  resetCamera: () => void;
  fitEntireYard: () => void;
  focusRoRoYard: () => void;
  focusBerths: () => void;
  focusContainers: () => void;

  // Yard block management
  addYardBlock: (block: YardBlock, initialOccupancy?: YardOccupancyItem) => void;
  updateYardCapacity: (
    id: string,
    capacity: number,
    occupied: number,
    status?: 'nominal' | 'warning' | 'critical',
    label?: string,
    x?: number,
    z?: number,
    width?: number,
    depth?: number
  ) => void;
  deleteYardBlock: (id: string) => void;
  setDrawingMode: (v: boolean) => void;
  setPendingNewYardPos: (pos: [number, number] | null) => void;
  setCreateYardModalOpen: (v: boolean) => void;
  setEditYardModalOpen: (v: boolean) => void;
  setEditingBlockId: (id: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  yardBlocks: [...YARD_BLOCKS],
  yardOccupancy: { ...DEMO_OCCUPANCY },
  selectedBlockId: null,
  hoveredBlockId: null,
  selectedRoadId: null,
  selectedBerthId: null,
  selectedShipId: null,
  viewMode: '3d-isometric',
  layers: {
    labels: true,
    roads: true,
    boundaries: true,
    containers: true,
    vehicles: true,
    berths: true,
    ships: true,
    cranes: true,
    dimensions: true,
    trees: true,
    lights: true,
  },
  searchQuery: '',
  cameraTarget: null,
  isRotating: false,
  showDimensions: true,
  timeOfDay: 'twilight',
  isLoggedIn: true,

  isDrawingMode: false,
  pendingNewYardPos: null,
  isCreateYardModalOpen: false,
  isEditYardModalOpen: false,
  editingBlockId: null,

  selectBlock: (id) =>
    set((state) => {
      const block = id ? state.yardBlocks.find((b) => b.id === id) : null;
      return {
        selectedBlockId: id,
        selectedRoadId: null,
        selectedBerthId: null,
        selectedShipId: null,
        cameraTarget: block ? [block.x, 0, block.z] : state.cameraTarget,
      };
    }),
  hoverBlock: (id) => set({ hoveredBlockId: id }),
  selectRoad: (id) =>
    set({
      selectedRoadId: id,
      selectedBlockId: null,
      selectedBerthId: null,
      selectedShipId: null,
    }),
  selectBerth: (id) =>
    set({
      selectedBerthId: id,
      selectedBlockId: null,
      selectedRoadId: null,
      selectedShipId: null,
    }),
  selectShip: (id) =>
    set({
      selectedShipId: id,
      selectedBlockId: null,
      selectedRoadId: null,
      selectedBerthId: null,
    }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setRotating: (v) => set({ isRotating: v }),
  toggleDimensions: () =>
    set((state) => ({
      showDimensions: !state.showDimensions,
      layers: { ...state.layers, dimensions: !state.layers.dimensions },
    })),
  setTimeOfDay: (tod) => set({ timeOfDay: tod }),
  setLoggedIn: (v) => set({ isLoggedIn: v }),
  resetCamera: () =>
    set({
      cameraTarget: null,
      selectedBlockId: null,
      selectedRoadId: null,
      selectedBerthId: null,
      selectedShipId: null,
    }),
  fitEntireYard: () =>
    set({
      cameraTarget: [500, 0, 500],
      selectedBlockId: null,
    }),
  focusRoRoYard: () => set({ cameraTarget: [450, 0, 680], selectedBlockId: null }),
  focusBerths: () => set({ cameraTarget: [820, 0, 480], selectedBlockId: null }),
  focusContainers: () => set({ cameraTarget: [540, 0, 480], selectedBlockId: null }),

  addYardBlock: (block, initialOccupancy) =>
    set((state) => ({
      yardBlocks: [block, ...state.yardBlocks],
      yardOccupancy: {
        ...state.yardOccupancy,
        [block.id]: initialOccupancy || {
          capacity: block.capacity || 500,
          occupied: block.occupied || 150,
          status: 'nominal',
        },
      },
      selectedBlockId: block.id,
      cameraTarget: [block.x, 0, block.z],
      isDrawingMode: false,
      pendingNewYardPos: null,
      isCreateYardModalOpen: false,
    })),

  updateYardCapacity: (id, capacity, occupied, status, label, x, z, width, depth) =>
    set((state) => {
      const calcStatus =
        status ||
        (occupied / capacity >= 0.85
          ? 'critical'
          : occupied / capacity >= 0.65
          ? 'warning'
          : 'nominal');

      const updatedBlocks = state.yardBlocks.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            capacity,
            occupied,
            label: label || b.label,
            ...(x !== undefined ? { x } : {}),
            ...(z !== undefined ? { z } : {}),
            ...(width !== undefined ? { width } : {}),
            ...(depth !== undefined ? { depth } : {}),
          };
        }
        return b;
      });

      const updatedBlock = updatedBlocks.find((b) => b.id === id);

      return {
        yardBlocks: updatedBlocks,
        yardOccupancy: {
          ...state.yardOccupancy,
          [id]: {
            capacity,
            occupied,
            status: calcStatus,
          },
        },
        cameraTarget: updatedBlock ? [updatedBlock.x, 0, updatedBlock.z] : state.cameraTarget,
        isEditYardModalOpen: false,
        editingBlockId: null,
      };
    }),

  deleteYardBlock: (id) =>
    set((state) => {
      const { [id]: _, ...remainingOcc } = state.yardOccupancy;
      return {
        yardBlocks: state.yardBlocks.filter((b) => b.id !== id),
        yardOccupancy: remainingOcc,
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
      };
    }),

  setDrawingMode: (v) =>
    set((state) => ({
      isDrawingMode: v,
      pendingNewYardPos: v ? null : state.pendingNewYardPos,
    })),
  setPendingNewYardPos: (pos) => set({ pendingNewYardPos: pos }),
  setCreateYardModalOpen: (v) => set({ isCreateYardModalOpen: v }),
  setEditYardModalOpen: (v) => set({ isEditYardModalOpen: v }),
  setEditingBlockId: (id) => set({ editingBlockId: id }),
}));
