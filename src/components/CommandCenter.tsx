'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, ChevronDown, ChevronRight, MapPin, Layers, Navigation,
  RotateCcw, Maximize2, Grid3X3,
  Truck, Ship, Package, AlertTriangle, CheckCircle, Clock,
  Activity, Bell, User, Settings, Wifi, Eye, Sun, Moon, Compass,
  Anchor, Ruler, Sparkles, X, Shield, Lock, LogIn, Plus, Edit2, Trash2
} from 'lucide-react';
import {
  BERTHS,
  SHIPS,
  ROADS,
  QUAY_CRANES,
  DEMO_ALERTS,
  DEMO_INCOMING_VESSEL,
  DEMO_OUTGOING,
  CATEGORY_META,
  type YardCategory,
  type YardBlock,
} from '@/lib/hipgMapData';
import { useMapStore, type LayerKey } from '@/lib/mapStore';

// ─────────────────────────────────────────────────────────────
// 1. Top Bar (100% English)
// ─────────────────────────────────────────────────────────────
export function TopBar({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const {
    timeOfDay,
    setTimeOfDay,
    showDimensions,
    toggleDimensions,
    isRotating,
    setRotating,
    isDrawingMode,
    setDrawingMode,
    setCreateYardModalOpen,
  } = useMapStore();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hipg-topbar flex items-center justify-between px-3 sm:px-4 py-2 border-b border-blue-900/40 bg-[#080d14]/95 backdrop-blur-md z-40 select-none">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3">
        <div className="hipg-logo flex items-center gap-2 bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-700/40 rounded-lg px-2.5 py-1 shadow-md">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-400 flex items-center justify-center font-black text-xs text-slate-950 shadow-sm">
            HIPG
          </div>
          <div className="text-[9px] leading-tight text-slate-300 hidden md:block">
            <span className="font-bold text-white tracking-wider">HAMBANTOTA</span><br />
            INTERNATIONAL PORT
          </div>
        </div>

        <div className="w-px h-6 bg-blue-900/60 hidden sm:block" />

        <div>
          <div className="text-xs sm:text-sm font-bold text-white tracking-wider flex items-center gap-2">
            RORO &amp; TERMINAL 3D DIGITAL TWIN
            <span className="hidden xl:inline-block text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800 rounded px-1.5 py-0.2 font-mono">
              PRECISION MASTERPLAN
            </span>
          </div>
          <div className="text-[10px] text-cyan-400/80 font-mono flex items-center gap-2">
            <span>COORDINATE ACCURACY: ±0.1M</span>
            <span>•</span>
            <span className="text-emerald-400">FPS: 60 (INSTANCED)</span>
          </div>
        </div>
      </div>

      {/* Center Controls */}
      <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded px-3 py-1 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-white font-bold">{time}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{date}</span>
        </div>

        {/* Create Yard Button */}
        <button
          onClick={() => {
            setDrawingMode(!isDrawingMode);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-mono border transition-all ${
            isDrawingMode
              ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse'
              : 'bg-gradient-to-r from-blue-900/60 to-cyan-900/60 text-cyan-300 border-cyan-700/60 hover:border-cyan-400'
          }`}
          title="Click to select a location on the 3D map"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isDrawingMode ? 'Cancel Location Pick' : '+ Add Yard'}</span>
        </button>

        {/* Dimensions Toggle Button */}
        <button
          onClick={toggleDimensions}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
            showDimensions
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-[0_0_10px_rgba(0,212,255,0.2)]'
              : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Toggle Dimensions (Length & Width)"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Dimensions (L × W)</span>
        </button>

        <button
          onClick={() => setRotating(!isRotating)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border transition-all ${
            isRotating
              ? 'bg-blue-950 text-blue-300 border-blue-500'
              : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Auto-Rotate Camera"
        >
          <Compass className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{isRotating ? 'Rotating' : 'Auto Cam'}</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Time of Day Switch */}
        <div className="flex items-center bg-slate-900/70 border border-slate-800 rounded p-0.5">
          <button
            onClick={() => setTimeOfDay('twilight')}
            className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
              timeOfDay === 'twilight' ? 'bg-cyan-900 text-cyan-200 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Twilight Mode (Photo Reference)"
          >
            Twilight
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
              timeOfDay === 'night' ? 'bg-blue-900 text-blue-200 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Night Floodlights Mode"
          >
            <Moon className="w-3 h-3 inline" />
          </button>
          <button
            onClick={() => setTimeOfDay('day')}
            className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
              timeOfDay === 'day' ? 'bg-amber-900 text-amber-200 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Daylight Mode"
          >
            <Sun className="w-3 h-3 inline" />
          </button>
        </div>

        {/* System Online Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-700/40 rounded px-2.5 py-1 text-[11px] font-mono">
          <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400">ONLINE</span>
        </div>

        {/* Operator Profile Button */}
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-1.5 bg-slate-800/60 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-600 rounded px-2.5 py-1 text-slate-200 transition-all text-xs"
          title="Operator Login"
        >
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono hidden sm:block">Operator</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Left Panel: Yard Navigator & Vessel Fleet
// ─────────────────────────────────────────────────────────────
export function LeftPanel() {
  const {
    yardBlocks,
    yardOccupancy,
    searchQuery,
    setSearchQuery,
    selectBlock,
    selectBerth,
    selectShip,
    selectRoad,
    setCameraTarget,
    selectedBlockId,
    selectedBerthId,
    selectedShipId,
    selectedRoadId,
    setCreateYardModalOpen,
    setEditYardModalOpen,
    setEditingBlockId,
  } = useMapStore();

  const [tab, setTab] = useState<'yards' | 'berths' | 'ships' | 'roads'>('yards');

  const filteredBlocks = searchQuery
    ? yardBlocks.filter((b) =>
        b.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : yardBlocks;

  const filteredBerths = searchQuery
    ? BERTHS.filter((b) => b.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : BERTHS;

  const filteredShips = searchQuery
    ? SHIPS.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : SHIPS;

  const filteredRoads = searchQuery
    ? ROADS.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : ROADS;

  return (
    <div className="hipg-panel w-72 flex flex-col bg-[#090f1a]/95 border-r border-blue-900/30 text-xs overflow-hidden select-none">
      {/* Search Input & Add Button */}
      <div className="p-3 border-b border-blue-900/30 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Yard, Berth, Ship, Road…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#050a14] border border-blue-900/50 rounded text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
          />
        </div>
        <button
          onClick={() => setCreateYardModalOpen(true)}
          className="p-1.5 bg-cyan-900/60 hover:bg-cyan-600 border border-cyan-700/60 hover:border-cyan-400 rounded text-white transition-colors"
          title="Add New Yard"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-blue-900/30 bg-slate-950/40 text-[10px] font-mono">
        <button
          onClick={() => setTab('yards')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            tab === 'yards' ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Yards ({filteredBlocks.length})
        </button>
        <button
          onClick={() => setTab('berths')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            tab === 'berths' ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Berths ({filteredBerths.length})
        </button>
        <button
          onClick={() => setTab('ships')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            tab === 'ships' ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Ships ({filteredShips.length})
        </button>
        <button
          onClick={() => setTab('roads')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            tab === 'roads' ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Roads ({filteredRoads.length})
        </button>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {/* YARDS TAB */}
        {tab === 'yards' &&
          filteredBlocks.map((b) => {
            const isSel = selectedBlockId === b.id;
            const occ = yardOccupancy[b.id];
            const pct = occ ? Math.round((occ.occupied / occ.capacity) * 100) : null;

            return (
              <div
                key={b.id}
                onClick={() => {
                  selectBlock(b.id);
                  setCameraTarget([b.x, 0, b.z]);
                }}
                className={`w-full text-left p-2 rounded border transition-all cursor-pointer ${
                  isSel
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-md'
                    : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-xs">{b.label}</span>
                  <div className="flex items-center gap-1.5">
                    {pct !== null && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          pct >= 85
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : pct >= 65
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {pct}%
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBlockId(b.id);
                        setEditYardModalOpen(true);
                      }}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                      title="Edit Yard Capacity"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{b.subLabel || b.description}</div>
                <div className="text-[9px] font-mono text-cyan-400/80 mt-1 flex justify-between">
                  <span>W: {b.width}m × D: {b.depth}m ({b.width * b.depth}m²)</span>
                  {occ && <span className="text-slate-300">{occ.occupied}/{occ.capacity}</span>}
                </div>
              </div>
            );
          })}

        {/* BERTHS TAB */}
        {tab === 'berths' &&
          filteredBerths.map((berth) => {
            const isSel = selectedBerthId === berth.id;
            return (
              <button
                key={berth.id}
                onClick={() => {
                  selectBerth(berth.id);
                  setCameraTarget([berth.x, 0, berth.z]);
                }}
                className={`w-full text-left p-2 rounded border transition-all ${
                  isSel
                    ? 'bg-blue-950/70 border-blue-400 text-blue-200 shadow-md'
                    : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-xs">{berth.label}</span>
                  <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{berth.name}</div>
                <div className="text-[9px] font-mono text-cyan-300 mt-1 flex justify-between">
                  <span>Length: {berth.length}m · Width: {berth.width}m</span>
                  <span>Draft: {berth.depthDraft}m</span>
                </div>
                {berth.currentVessel && (
                  <div className="text-[9px] text-amber-300 font-mono mt-1 bg-amber-950/40 border border-amber-900/60 rounded px-1.5 py-0.5">
                    🚢 {berth.currentVessel}
                  </div>
                )}
              </button>
            );
          })}

        {/* SHIPS TAB */}
        {tab === 'ships' &&
          filteredShips.map((ship) => {
            const isSel = selectedShipId === ship.id;
            return (
              <button
                key={ship.id}
                onClick={() => {
                  selectShip(ship.id);
                  setCameraTarget([ship.x, 0, ship.z]);
                }}
                className={`w-full text-left p-2 rounded border transition-all ${
                  isSel
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-md'
                    : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-xs">🚢 {ship.name}</span>
                  <span className="text-[9px] bg-slate-800 text-slate-300 rounded px-1">{ship.status}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{ship.type}</div>
                <div className="text-[9px] font-mono text-slate-400 mt-1 flex justify-between">
                  <span>LOA: {ship.length}m (Beam {ship.beam}m)</span>
                  <span className="text-cyan-400">{ship.berthId}</span>
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5 truncate">{ship.cargoDescription}</div>
              </button>
            );
          })}

        {/* ROADS TAB */}
        {tab === 'roads' &&
          filteredRoads.map((road) => {
            const isSel = selectedRoadId === road.id;
            return (
              <button
                key={road.id}
                onClick={() => {
                  selectRoad(road.id);
                  const p = road.points[0];
                  setCameraTarget([p[0], 0, p[1]]);
                }}
                className={`w-full text-left p-2 rounded border transition-all ${
                  isSel
                    ? 'bg-teal-950/70 border-teal-400 text-teal-200 shadow-md'
                    : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-xs">{road.name}</span>
                  <span className="text-[9px] font-mono text-slate-400">{road.lanes} Lanes</span>
                </div>
                <div className="text-[9px] font-mono text-cyan-300 mt-1">
                  Width: {road.widthMeters}m · Length: {road.lengthMeters}m
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5 truncate">{road.description}</div>
              </button>
            );
          })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Right Panel: Inspector, Dimensions, Layer Toggles & Stats
// ─────────────────────────────────────────────────────────────
export function RightPanel() {
  const {
    yardBlocks,
    yardOccupancy,
    selectedBlockId,
    selectedBerthId,
    selectedShipId,
    selectedRoadId,
    viewMode,
    setViewMode,
    layers,
    toggleLayer,
    resetCamera,
    fitEntireYard,
    setEditYardModalOpen,
    setEditingBlockId,
    setCreateYardModalOpen,
  } = useMapStore();

  const selectedBlock = selectedBlockId ? yardBlocks.find((b) => b.id === selectedBlockId) : null;
  const selectedBerth = selectedBerthId ? BERTHS.find((b) => b.id === selectedBerthId) : null;
  const selectedShip = selectedShipId ? SHIPS.find((s) => s.id === selectedShipId) : null;
  const selectedRoad = selectedRoadId ? ROADS.find((r) => r.id === selectedRoadId) : null;

  const totalCap = Object.values(yardOccupancy).reduce((a, b) => a + b.capacity, 0);
  const totalOcc = Object.values(yardOccupancy).reduce((a, b) => a + b.occupied, 0);
  const totalPct = totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0;

  const LAYER_CONTROLS: { key: LayerKey; label: string; icon: React.ReactNode }[] = [
    { key: 'roads', label: 'Roads & Highways', icon: <Navigation className="w-3 h-3" /> },
    { key: 'dimensions', label: 'Dimensions (L × W)', icon: <Ruler className="w-3 h-3" /> },
    { key: 'berths', label: 'Berths & Quays', icon: <Anchor className="w-3 h-3" /> },
    { key: 'cranes', label: 'Quay Cranes (QCs)', icon: <Plus className="w-3 h-3" /> },
    { key: 'ships', label: 'Harbor Vessels', icon: <Ship className="w-3 h-3" /> },
    { key: 'vehicles', label: 'Instanced Cars (Ro-Ro)', icon: <Truck className="w-3 h-3" /> },
    { key: 'containers', label: 'Container Stacks', icon: <Package className="w-3 h-3" /> },
    { key: 'labels', label: 'Labels & Signage', icon: <Layers className="w-3 h-3" /> },
    { key: 'lights', label: 'Floodlight Masts', icon: <Sun className="w-3 h-3" /> },
    { key: 'trees', label: 'Park & Vegetation', icon: <Sparkles className="w-3 h-3" /> },
  ];

  return (
    <div className="hipg-panel w-72 flex flex-col bg-[#090f1a]/95 border-l border-blue-900/30 text-xs overflow-y-auto custom-scrollbar select-none">
      {/* Dynamic Inspector Header */}
      <div className="p-3 border-b border-blue-900/30 bg-slate-950/40">
        <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mb-1">
          {selectedBlock ? 'YARD BLOCK INSPECTOR' :
           selectedBerth ? 'BERTH SPECIFICATION' :
           selectedShip ? 'VESSEL SPECIFICATION' :
           selectedRoad ? 'ROADWAY SPECIFICATION' : 'TERMINAL OVERVIEW'}
        </div>

        {/* Selected Road Details */}
        {selectedRoad && (
          <div className="bg-teal-950/40 border border-teal-500/50 rounded-lg p-2.5 mt-2 space-y-1.5 font-mono">
            <div className="text-sm font-bold text-teal-300">{selectedRoad.name}</div>
            <div className="text-[11px] text-slate-300">{selectedRoad.description}</div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-teal-900/60 text-[10px]">
              <div>
                <span className="text-slate-400 block">Width:</span>
                <span className="text-teal-300 font-bold text-xs">{selectedRoad.widthMeters} m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Length:</span>
                <span className="text-teal-300 font-bold text-xs">{selectedRoad.lengthMeters} m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Lanes:</span>
                <span className="text-white font-bold">{selectedRoad.lanes} Lanes</span>
              </div>
              <div>
                <span className="text-slate-400 block">Speed Limit:</span>
                <span className="text-white font-bold">{selectedRoad.speedLimitKmH} km/h</span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Berth Details */}
        {selectedBerth && (
          <div className="bg-blue-950/40 border border-blue-500/50 rounded-lg p-2.5 mt-2 space-y-1.5 font-mono">
            <div className="text-sm font-bold text-blue-300">{selectedBerth.label}</div>
            <div className="text-[11px] text-slate-300">{selectedBerth.name}</div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-900/60 text-[10px]">
              <div>
                <span className="text-slate-400 block">Length:</span>
                <span className="text-blue-300 font-bold text-xs">{selectedBerth.length} m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Width:</span>
                <span className="text-blue-300 font-bold text-xs">{selectedBerth.width} m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Water Draft:</span>
                <span className="text-white font-bold">{selectedBerth.depthDraft} m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Bollards:</span>
                <span className="text-white font-bold">{selectedBerth.bollardsCount} Units</span>
              </div>
            </div>
            {selectedBerth.currentVessel && (
              <div className="mt-1 pt-1 border-t border-blue-900/60 text-[10px] text-amber-300">
                Moored Vessel: <span className="font-bold">{selectedBerth.currentVessel}</span>
              </div>
            )}
          </div>
        )}

        {/* Selected Ship Details */}
        {selectedShip && (
          <div className="bg-cyan-950/40 border border-cyan-500/50 rounded-lg p-2.5 mt-2 space-y-1.5 font-mono">
            <div className="text-sm font-bold text-cyan-300">🚢 {selectedShip.name}</div>
            <div className="text-[11px] text-slate-300">{selectedShip.type}</div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-cyan-900/60 text-[10px]">
              <div>
                <span className="text-slate-400 block">LOA (Length):</span>
                <span className="text-cyan-300 font-bold text-xs">{selectedShip.length} m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Beam (Width):</span>
                <span className="text-cyan-300 font-bold text-xs">{selectedShip.beam} m</span>
              </div>
              <div>
                <span className="text-slate-400 block">IMO:</span>
                <span className="text-white font-bold">{selectedShip.imo}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Flag:</span>
                <span className="text-white font-bold">{selectedShip.flag}</span>
              </div>
            </div>
            <div className="mt-1 text-[10px] text-emerald-300 bg-emerald-950/40 p-1 rounded">
              Cargo: {selectedShip.cargoDescription}
            </div>
          </div>
        )}

        {/* Selected Yard Block Details */}
        {selectedBlock && (
          <div className="bg-cyan-950/40 border border-cyan-500/50 rounded-lg p-2.5 mt-2 space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-white">{selectedBlock.label}</div>
              <button
                onClick={() => {
                  setEditingBlockId(selectedBlock.id);
                  setEditYardModalOpen(true);
                }}
                className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow"
              >
                <Edit2 className="w-3 h-3" /> Edit Capacity
              </button>
            </div>
            <div className="text-[11px] text-slate-300">{selectedBlock.subLabel || selectedBlock.description}</div>

            {yardOccupancy[selectedBlock.id] && (
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Occupancy:</span>
                  <span className="text-cyan-300 font-bold">
                    {yardOccupancy[selectedBlock.id].occupied} / {yardOccupancy[selectedBlock.id].capacity} (
                    {Math.round((yardOccupancy[selectedBlock.id].occupied / yardOccupancy[selectedBlock.id].capacity) * 100)}%)
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((yardOccupancy[selectedBlock.id].occupied / yardOccupancy[selectedBlock.id].capacity) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-cyan-900/60 text-[10px]">
              <div>
                <span className="text-slate-400 block">Width:</span>
                <span className="text-cyan-300 font-bold text-xs">{selectedBlock.width} m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Depth:</span>
                <span className="text-cyan-300 font-bold text-xs">{selectedBlock.depth} m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Area:</span>
                <span className="text-white font-bold">{selectedBlock.width * selectedBlock.depth} m²</span>
              </div>
              <div>
                <span className="text-slate-400 block">Category:</span>
                <span className="text-white font-bold">{CATEGORY_META[selectedBlock.category]?.label || 'General Yard'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Default Overview */}
        {!selectedBlock && !selectedBerth && !selectedShip && !selectedRoad && (
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">CAPACITY</span>
                <span className="text-cyan-400 font-bold text-sm">{totalCap.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">OCCUPIED</span>
                <span className="text-amber-400 font-bold text-sm">{totalOcc.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">RATE</span>
                <span className="text-emerald-400 font-bold text-sm">{totalPct}%</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded border border-slate-800/80">
              💡 Click on any Ship, Berth, Road or Yard to inspect dimensions and update live capacities.
            </div>
          </div>
        )}
      </div>

      {/* Camera View Switcher */}
      <div className="p-3 border-b border-blue-900/30">
        <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mb-2">CAMERA VIEW</div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setViewMode('3d-isometric')}
            className={`py-1.5 rounded text-[10px] font-mono border transition-all flex items-center justify-center gap-1 ${
              viewMode === '3d-isometric'
                ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200 font-bold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" /> 3D Isometric
          </button>
          <button
            onClick={() => setViewMode('2d-top')}
            className={`py-1.5 rounded text-[10px] font-mono border transition-all flex items-center justify-center gap-1 ${
              viewMode === '2d-top'
                ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200 font-bold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3 h-3" /> 2D Top Blueprint
          </button>
        </div>
        <div className="mt-1.5 flex gap-1">
          <button
            onClick={resetCamera}
            className="flex-1 py-1 rounded bg-slate-900/60 hover:bg-slate-800 text-[10px] text-slate-300 font-mono border border-slate-800 flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset View
          </button>
          <button
            onClick={fitEntireYard}
            className="flex-1 py-1 rounded bg-slate-900/60 hover:bg-slate-800 text-[10px] text-slate-300 font-mono border border-slate-800 flex items-center justify-center gap-1"
          >
            <Maximize2 className="w-3 h-3" /> Fit Terminal
          </button>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="p-3 border-b border-blue-900/30">
        <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mb-2 flex items-center justify-between">
          <span>SPATIAL LAYERS</span>
          <span className="text-slate-500 text-[9px]">TOGGLES</span>
        </div>
        <div className="space-y-1">
          {LAYER_CONTROLS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                <span className={layers[key] ? 'text-cyan-400' : 'text-slate-600'}>{icon}</span>
                <span>{label}</span>
              </div>
              <div
                className={`w-6 h-3 rounded-full relative transition-colors ${
                  layers[key] ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${
                    layers[key] ? 'left-3.5' : 'left-0.5'
                  }`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Bottom Panel: Operations & Live Vessel Discharge
// ─────────────────────────────────────────────────────────────
export function BottomPanel() {
  return (
    <div className="hipg-panel h-36 flex bg-[#080d14]/95 border-t border-blue-900/30 overflow-hidden select-none">
      {/* Vessel Discharge Pipeline */}
      <div className="flex-1 p-3 border-r border-blue-900/30 flex flex-col justify-between">
        <div className="text-[10px] text-cyan-400/90 font-mono uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <Ship className="w-3.5 h-3.5 text-cyan-400" />
            LIVE VESSEL DISCHARGE · MV GLOVIS SUNRISE (BERTH 09)
          </span>
          <span className="text-amber-400 bg-amber-950/60 border border-amber-800 px-1.5 py-0.2 rounded text-[9px]">
            DISCHARGE RATE: 180 CARS/HR
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 my-1 text-xs font-mono">
          {DEMO_INCOMING_VESSEL.vehicles.map((v) => {
            const pct = Math.round((v.processed / v.planned) * 100);
            return (
              <div key={v.type} className="bg-slate-900/60 border border-slate-800 rounded p-1.5">
                <div className="flex justify-between text-[10px] text-slate-300">
                  <span className="font-bold">{v.type}</span>
                  <span className="text-cyan-400">{pct}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                  <span>Done: {v.processed}</span>
                  <span>Rem: {v.remaining}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outgoing Gate 01 Clearance */}
      <div className="w-80 p-3 flex flex-col justify-between">
        <div className="text-[10px] text-cyan-400/90 font-mono uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            GATE 01 &amp; CUSTOMS INSPECTION YARD
          </span>
          <span className="text-emerald-400 text-[9px]">ACTIVE</span>
        </div>

        <div className="space-y-1.5 my-1 text-[10px] font-mono">
          {DEMO_OUTGOING.slice(0, 2).map((item) => (
            <div key={item.type} className="flex justify-between items-center bg-slate-900/40 p-1.5 rounded border border-slate-800">
              <span className="text-slate-300 truncate pr-2">{item.type}</span>
              <span className="text-emerald-400 font-bold">{item.completed}/{item.planned} Units</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Create New Yard Modal
// ─────────────────────────────────────────────────────────────
export function CreateYardModal() {
  const {
    isCreateYardModalOpen,
    setCreateYardModalOpen,
    pendingNewYardPos,
    addYardBlock,
    setDrawingMode,
  } = useMapStore();

  const [label, setLabel] = useState('YARD-NEW-01');
  const [category, setCategory] = useState<YardCategory>('roro');
  const [width, setWidth] = useState(120);
  const [depth, setDepth] = useState(60);
  const [capacity, setCapacity] = useState(600);
  const [occupied, setOccupied] = useState(150);
  const [posX, setPosX] = useState(pendingNewYardPos ? pendingNewYardPos[0] : 450);
  const [posZ, setPosZ] = useState(pendingNewYardPos ? pendingNewYardPos[1] : 680);

  useEffect(() => {
    if (pendingNewYardPos) {
      setPosX(Number(pendingNewYardPos[0]));
      setPosZ(Number(pendingNewYardPos[1]));
      setLabel(`YARD-${pendingNewYardPos[0]}-${pendingNewYardPos[1]}`);
    }
  }, [pendingNewYardPos, isCreateYardModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCreateYardModalOpen(false);
    };
    if (isCreateYardModalOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateYardModalOpen, setCreateYardModalOpen]);

  if (!isCreateYardModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CUSTOM_${Date.now()}`;
    const targetX = Number(posX);
    const targetZ = Number(posZ);
    const targetW = Number(width);
    const targetD = Number(depth);
    const targetCap = Number(capacity);
    const targetOcc = Number(occupied);

    const newBlock: YardBlock = {
      id: newId,
      label: label.trim() || `YARD-${targetX}-${targetZ}`,
      subLabel: `Custom ${CATEGORY_META[category]?.label || 'Yard'}`,
      category,
      x: targetX,
      z: targetZ,
      width: targetW,
      depth: targetD,
      capacity: targetCap,
      occupied: targetOcc,
      type: category === 'container' ? 'containers' : 'cars',
      borderColor: category === 'container' ? '#00d4ff' : '#06d6a0',
      isCustom: true,
    };

    addYardBlock(newBlock, {
      capacity: targetCap,
      occupied: targetOcc,
      status: targetOcc / targetCap >= 0.85 ? 'critical' : targetOcc / targetCap >= 0.65 ? 'warning' : 'nominal',
    });
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setCreateYardModalOpen(false);
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none animate-in fade-in duration-200"
    >
      <div className="bg-[#090f1a] border border-cyan-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,212,255,0.25)] font-mono">
        <div className="p-4 border-b border-blue-900/40 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-950/60">
              <Plus className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wider">CREATE NEW YARD AREA</div>
              <div className="text-[9px] text-cyan-400/80 font-mono">MAP SPATIAL DESIGNER · PRESS ESC TO CANCEL</div>
            </div>
          </div>
          <button
            onClick={() => setCreateYardModalOpen(false)}
            className="text-slate-400 hover:text-white hover:bg-slate-800/60 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Yard Name / Code</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
              placeholder="e.g. 05A, BY5, EXPORT-B"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as YardCategory)}
                className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
              >
                <option value="roro">Ro-Ro Vehicle Yard</option>
                <option value="container">Container Stacking</option>
                <option value="feeder">Feeder Staging</option>
                <option value="customs">Customs Clearance</option>
                <option value="service">Service & Apron</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
                min={1}
                className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Width (m)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                required
                min={20}
                max={400}
                className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Depth / Length (m)</label>
              <input
                type="number"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                required
                min={15}
                max={400}
                className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          {/* Interactive Location Picker Badge */}
          <div className="bg-slate-950/60 border border-blue-900/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Selected Location:</span>
              <span className="text-emerald-400 font-bold font-mono">
                X: {posX}m · Z: {posZ}m
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setCreateYardModalOpen(false);
                setDrawingMode(true);
              }}
              className="w-full py-1.5 px-3 rounded-md bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/60 hover:border-emerald-400 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Click Map to Pick New Location</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Center X Position (m)</label>
              <input
                type="number"
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                required
                min={50}
                max={950}
                className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Center Z Position (m)</label>
              <input
                type="number"
                value={posZ}
                onChange={(e) => setPosZ(Number(e.target.value))}
                required
                min={50}
                max={950}
                className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Initial Occupied Units</label>
            <input
              type="number"
              value={occupied}
              onChange={(e) => setOccupied(Number(e.target.value))}
              min={0}
              max={capacity}
              className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          <div className="flex gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => setCreateYardModalOpen(false)}
              className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Yard to 3D Map
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. Edit Yard Capacity Modal (Real-Time Update - Orderly & Clean)
// ─────────────────────────────────────────────────────────────
export function EditYardModal() {
  const {
    isEditYardModalOpen,
    setEditYardModalOpen,
    editingBlockId,
    yardBlocks,
    yardOccupancy,
    updateYardCapacity,
    deleteYardBlock,
  } = useMapStore();

  const block = yardBlocks.find((b) => b.id === editingBlockId);
  const occ = editingBlockId ? yardOccupancy[editingBlockId] : null;

  const [capacity, setCapacity] = useState(occ?.capacity || 1000);
  const [occupied, setOccupied] = useState(occ?.occupied || 500);
  const [label, setLabel] = useState(block?.label || '');
  const [status, setStatus] = useState<'nominal' | 'warning' | 'critical'>(occ?.status || 'nominal');
  const [posX, setPosX] = useState(block?.x || 500);
  const [posZ, setPosZ] = useState(block?.z || 500);
  const [width, setWidth] = useState(block?.width || 120);
  const [depth, setDepth] = useState(block?.depth || 60);

  useEffect(() => {
    if (block && occ) {
      setCapacity(occ.capacity);
      setOccupied(occ.occupied);
      setLabel(block.label);
      setStatus(occ.status);
      setPosX(block.x);
      setPosZ(block.z);
      setWidth(block.width);
      setDepth(block.depth);
    }
  }, [block, occ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditYardModalOpen(false);
    };
    if (isEditYardModalOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditYardModalOpen, setEditYardModalOpen]);

  if (!isEditYardModalOpen || !block) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateYardCapacity(
      block.id,
      Number(capacity),
      Number(occupied),
      status,
      label,
      Number(posX),
      Number(posZ),
      Number(width),
      Number(depth)
    );
  };

  const utilization = capacity > 0 ? Math.min(100, Math.round((occupied / capacity) * 100)) : 0;
  const statusColor =
    utilization >= 85 ? 'text-rose-400 bg-rose-500' :
    utilization >= 65 ? 'text-amber-400 bg-amber-400' : 'text-emerald-400 bg-emerald-400';

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setEditYardModalOpen(false);
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none animate-in fade-in duration-200"
    >
      <div className="bg-[#090f1a] border border-cyan-500/50 rounded-2xl w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(0,212,255,0.25)] font-mono">
        {/* Header */}
        <div className="p-4 border-b border-blue-900/40 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-950/60">
              <Edit2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wider">EDIT YARD CAPACITY</div>
              <div className="text-[9px] text-cyan-400/80 font-mono flex items-center gap-2">
                <span>{block.id}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[8px] text-slate-300 uppercase">
                  {block.category}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditYardModalOpen(false)}
            className="text-slate-400 hover:text-white hover:bg-slate-800/60 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Utilization Gauge */}
        <div className="px-5 pt-4 pb-2 bg-slate-950/40 border-b border-blue-900/30">
          <div className="flex items-center justify-between text-[10px] mb-1.5">
            <span className="text-slate-400 uppercase tracking-wider">Live Utilization Rate:</span>
            <span className={`font-bold ${statusColor.split(' ')[0]}`}>{utilization}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${statusColor.split(' ')[1]}`}
              style={{ width: `${utilization}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 mt-1">
            <span>Occupied: <b className="text-white">{occupied}</b></span>
            <span>Total Slots: <b className="text-cyan-300">{capacity}</b></span>
            <span>Free: <b className="text-slate-300">{Math.max(0, capacity - occupied)}</b></span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Yard Label / Code</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
                min={1}
                className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-bold text-cyan-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Occupied Units</label>
              <input
                type="number"
                value={occupied}
                onChange={(e) => setOccupied(Number(e.target.value))}
                required
                min={0}
                max={capacity}
                className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-bold text-amber-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status Condition</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#050a14] border border-blue-900/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
            >
              <option value="nominal">🟢 Nominal (&lt; 65% Capacity)</option>
              <option value="warning">🟡 Warning (65% - 85% Capacity)</option>
              <option value="critical">🔴 Critical (&gt; 85% Overload)</option>
            </select>
          </div>

          {/* Spatial Coordinates & Dimensions for Custom Yards */}
          {block.isCustom ? (
            <div className="bg-slate-950/60 border border-blue-900/50 rounded-lg p-3 space-y-2">
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Spatial Map Coordinates</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] text-slate-400 mb-0.5">X Position (m)</label>
                  <input
                    type="number"
                    value={posX}
                    onChange={(e) => setPosX(Number(e.target.value))}
                    min={20}
                    max={980}
                    className="w-full bg-[#050a14] border border-blue-900/60 rounded px-2.5 py-1 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 mb-0.5">Z Position (m)</label>
                  <input
                    type="number"
                    value={posZ}
                    onChange={(e) => setPosZ(Number(e.target.value))}
                    min={20}
                    max={980}
                    className="w-full bg-[#050a14] border border-blue-900/60 rounded px-2.5 py-1 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block text-[9px] text-slate-400 mb-0.5">Width (m)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min={20}
                    max={400}
                    className="w-full bg-[#050a14] border border-blue-900/60 rounded px-2.5 py-1 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 mb-0.5">Depth (m)</label>
                  <input
                    type="number"
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
                    min={20}
                    max={400}
                    className="w-full bg-[#050a14] border border-blue-900/60 rounded px-2.5 py-1 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 flex items-center justify-between">
              <span>Dimensions: <b>{block.width}m × {block.depth}m</b></span>
              <span>Area: <b className="text-cyan-400">{block.width * block.depth} m²</b></span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditYardModalOpen(false)}
              className="px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors font-bold text-xs"
            >
              Cancel
            </button>
            {block.isCustom && (
              <button
                type="button"
                onClick={() => {
                  deleteYardBlock(block.id);
                  setEditYardModalOpen(false);
                }}
                className="p-2.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors"
                title="Delete Custom Yard"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:brightness-110 active:scale-95 transition-all"
            >
              <CheckCircle className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. Operator Login Modal
// ─────────────────────────────────────────────────────────────
export function OperatorLoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [operatorId, setOperatorId] = useState('HIPG-OP-7749');
  const [role, setRole] = useState('Senior Yard Planner');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#090f1a] border border-cyan-500/50 rounded-2xl w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(0,212,255,0.2)]">
        <div className="p-4 border-b border-blue-900/40 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wider">HIPG TERMINAL ACCESS</div>
              <div className="text-[9px] text-cyan-400/80 font-mono">OPERATOR AUTHENTICATION</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleQuickLogin} className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Operator ID</label>
            <input
              type="text"
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              className="w-full bg-[#050a14] border border-blue-900/60 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Terminal Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#050a14] border border-blue-900/60 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            >
              <option>Senior Yard Planner</option>
              <option>Ro-Ro Vessel Superintendent</option>
              <option>Customs Liaison Officer</option>
              <option>Harbor Master Controller</option>
            </select>
          </div>

          <div className="bg-cyan-950/30 border border-cyan-800/40 rounded p-2.5 text-[10px] font-mono text-cyan-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Biometric credentials verified for Hambantota Port Zone 01.</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:brightness-110 active:scale-95 transition-all"
          >
            {success ? (
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle className="w-4 h-4" /> Authenticated!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <LogIn className="w-4 h-4" /> Enter Live Terminal
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
