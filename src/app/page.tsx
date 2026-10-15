'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import {
  TopBar,
  LeftPanel,
  RightPanel,
  BottomPanel,
  OperatorLoginModal,
  CreateYardModal,
  EditYardModal,
} from '@/components/CommandCenter';
import LoadingScreen from '@/components/LoadingScreen';
import { useMapStore } from '@/lib/mapStore';
import {
  Ruler,
  Maximize2,
  RotateCcw,
  Layers,
  Plus,
  SlidersHorizontal,
  X,
  Target,
  Edit3,
} from 'lucide-react';
import { CATEGORY_META } from '@/lib/hipgMapData';

// Load 3D map as client-only (WebGL canvas)
const YardMap3D = dynamic(() => import('@/components/YardMap3D'), {
  ssr: false,
  loading: () => null,
});

export default function CommandCenterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [showPanels, setShowPanels] = useState(true);

  const {
    yardBlocks,
    yardOccupancy,
    selectedBlockId,
    hoveredBlockId,
    selectBlock,
    hoverBlock,
    setEditingBlockId,
    setEditYardModalOpen,
    isEditYardModalOpen,
    isCreateYardModalOpen,
    showDimensions,
    toggleDimensions,
    resetCamera,
    fitEntireYard,
    focusRoRoYard,
    focusBerths,
    focusContainers,
    viewMode,
    setViewMode,
    isDrawingMode,
    setDrawingMode,
    setCreateYardModalOpen,
    setCameraTarget,
  } = useMapStore();

  // Active block to display in the quick-action floating card
  const activeBlockId = selectedBlockId || (hoveredBlockId && !selectedBlockId ? hoveredBlockId : null);
  const activeBlock = activeBlockId ? yardBlocks.find((b) => b.id === activeBlockId) : null;
  const activeOcc = activeBlock ? yardOccupancy[activeBlock.id] : null;
  const activeMeta = activeBlock ? CATEGORY_META[activeBlock.category] || CATEGORY_META.roro : null;

  return (
    <main
      className="w-screen h-screen flex flex-col overflow-hidden bg-[#040810] select-none"
      id="hipg-command-center"
    >
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}

      {/* Operator Login Modal */}
      <OperatorLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Dynamic Yard Creation Modal */}
      <CreateYardModal />

      {/* Edit Yard Capacity Modal */}
      <EditYardModal />

      {/* Top Navigation Bar */}
      {showPanels && <TopBar onOpenLogin={() => setLoginModalOpen(true)} />}

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel — Yard, Berth, Ship & Road Navigator */}
        {showPanels && <LeftPanel />}

        {/* Center — 3D Map Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 relative canvas-container overflow-hidden">
            {/* Top Center Quick Action HUD */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#090f1a]/90 backdrop-blur-md border border-cyan-800/40 rounded-full px-3.5 py-1 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono text-cyan-300 font-bold tracking-wider">
                HIPG DIGITAL TWIN
              </span>
              <div className="w-px h-3.5 bg-cyan-800/60" />

              {/* Dimensions toggle */}
              <button
                onClick={toggleDimensions}
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 ${
                  showDimensions
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Toggle Road & Berth Dimensions"
              >
                <Ruler className="w-3 h-3" /> Dim: {showDimensions ? 'ON' : 'OFF'}
              </button>

              <div className="w-px h-3.5 bg-cyan-800/60" />

              {/* Add yard button */}
              <button
                onClick={() => {
                  setDrawingMode(!isDrawingMode);
                }}
                className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 ${
                  isDrawingMode
                    ? 'bg-emerald-500 text-slate-950 font-bold animate-pulse'
                    : 'text-cyan-400 hover:text-white'
                }`}
                title="Select a location on the 3D map to create a new yard"
              >
                <Plus className="w-3 h-3" /> {isDrawingMode ? 'Cancel Pick' : '+ Add Yard'}
              </button>

              <div className="w-px h-3.5 bg-cyan-800/60" />

              {/* Toggle Interface Panels Mode */}
              <button
                onClick={() => setShowPanels(!showPanels)}
                className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1.5 ${
                  showPanels
                    ? 'text-slate-400 hover:text-white'
                    : 'bg-blue-600 text-white font-bold'
                }`}
                title="Toggle Full 3D View or Management Panels"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{showPanels ? 'Full 3D' : 'Show Panels'}</span>
              </button>
            </div>

            {/* Drawing Mode Banner */}
            {isDrawingMode && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-[#091524]/95 backdrop-blur-md border border-emerald-400 text-emerald-300 font-bold px-4 py-2 rounded-2xl text-xs font-mono shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>📍 CLICK ANY LOCATION ON THE 3D MAP TO PLACE YARD</span>
                <button
                  onClick={() => setDrawingMode(false)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-600 transition-colors pointer-events-auto"
                >
                  Cancel (ESC)
                </button>
              </div>
            )}

            {/* Quick View Controls & Focus Zones Floating Badge */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#090f1a]/90 backdrop-blur-md border border-cyan-800/40 rounded-xl p-1.5 shadow-2xl">
              <button
                onClick={focusRoRoYard}
                className="px-2 py-1 rounded bg-slate-900/90 hover:bg-emerald-950 text-[10px] font-mono text-emerald-300 border border-emerald-900/60 hover:border-emerald-600 flex items-center gap-1 transition-all"
                title="Focus Camera on RoRo Vehicle Yard"
              >
                🚗 RoRo
              </button>
              <button
                onClick={focusBerths}
                className="px-2 py-1 rounded bg-slate-900/90 hover:bg-blue-950 text-[10px] font-mono text-blue-300 border border-blue-900/60 hover:border-blue-600 flex items-center gap-1 transition-all"
                title="Focus Camera on Berths & Moored Ships"
              >
                🚢 Berths
              </button>
              <button
                onClick={focusContainers}
                className="px-2 py-1 rounded bg-slate-900/90 hover:bg-cyan-950 text-[10px] font-mono text-cyan-300 border border-cyan-900/60 hover:border-cyan-600 flex items-center gap-1 transition-all"
                title="Focus Camera on Container Terminal"
              >
                📦 Cargo
              </button>

              <div className="w-px h-4 bg-cyan-800/40 mx-0.5" />

              <button
                onClick={() =>
                  setViewMode(viewMode === '3d-isometric' ? '2d-top' : '3d-isometric')
                }
                className="px-2 py-1 rounded bg-slate-900/80 hover:bg-cyan-950 text-[10px] font-mono text-cyan-300 border border-slate-800 hover:border-cyan-700 flex items-center gap-1 transition-all"
                title="Switch 3D / 2D View"
              >
                <Layers className="w-3 h-3" />
                {viewMode === '3d-isometric' ? '2D' : '3D'}
              </button>
              <button
                onClick={resetCamera}
                className="p-1.5 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                title="Reset Camera Overview"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={fitEntireYard}
                className="p-1.5 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                title="Fit Entire Terminal"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive Floating Capacity Card (Pure HTML DOM — 100% crash-free) */}
            {activeBlock && activeOcc && !isEditYardModalOpen && !isCreateYardModalOpen && (
              <div className="absolute bottom-12 left-4 z-30 bg-[#090f1a]/95 border border-cyan-400/80 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-xs font-mono text-cyan-300 backdrop-blur-md max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between gap-3 border-b border-cyan-900/40 pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: activeMeta?.glowColor || '#00d4ff' }}
                    />
                    <div>
                      <div className="font-bold text-white text-xs leading-none">
                        {activeBlock.label.replace('\n', ' ')}
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase mt-0.5">
                        {activeBlock.id} · {activeBlock.category}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      selectBlock(null);
                      hoverBlock(null);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Occupancy and Capacity Stats */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Occupancy Rate:</span>
                    <span className="font-bold text-white">
                      {Math.round((activeOcc.occupied / activeOcc.capacity) * 100)}%
                    </span>
                  </div>

                  {/* Utilization Progress Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        activeOcc.occupied / activeOcc.capacity >= 0.85
                          ? 'bg-rose-500'
                          : activeOcc.occupied / activeOcc.capacity >= 0.65
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((activeOcc.occupied / activeOcc.capacity) * 100))}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Occupied: <b className="text-white">{activeOcc.occupied}</b></span>
                    <span>Capacity: <b className="text-cyan-300">{activeOcc.capacity}</b></span>
                  </div>

                  <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex justify-between">
                    <span>Dim: {activeBlock.width}m × {activeBlock.depth}m</span>
                    <span>Area: {activeBlock.width * activeBlock.depth}m²</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-cyan-900/40">
                  <button
                    onClick={() => setCameraTarget([activeBlock.x, 0, activeBlock.z])}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 text-[10px] font-bold border border-cyan-700/50 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Target className="w-3 h-3 text-cyan-400" /> Focus
                  </button>
                  <button
                    onClick={() => {
                      setEditingBlockId(activeBlock.id);
                      setEditYardModalOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Edit3 className="w-3 h-3 text-slate-950" /> Edit Capacity
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Tip Floating Banner (Bottom Center) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:flex items-center gap-2 bg-[#090f1a]/85 backdrop-blur-md border border-cyan-800/30 rounded-full px-3.5 py-1 shadow-lg text-[9px] font-mono text-slate-300">
              <span className="text-cyan-400 font-bold">💡 Navigation:</span>
              <span>Click yard to inspect/edit capacity</span>
              <span className="text-slate-600">•</span>
              <span>Double-click spot to zoom</span>
              <span className="text-slate-600">•</span>
              <span>Right-click to pan</span>
            </div>

            {/* North Indicator */}
            <div className="absolute bottom-3 right-3 z-20 north-arrow bg-[#0a1120]/80 border border-blue-900/40 rounded px-2.5 py-1 text-cyan-400 text-xs font-mono font-bold shadow-md">
              ↑ N
            </div>

            {/* Realistic 3D WebGL Canvas */}
            <Suspense fallback={null}>
              <YardMap3D />
            </Suspense>
          </div>

          {/* Bottom Operations & Live Discharge Panel */}
          {showPanels && <BottomPanel />}
        </div>

        {/* Right Panel — Inspector & Capacity Management */}
        {showPanels && <RightPanel />}
      </div>
    </main>
  );
}
