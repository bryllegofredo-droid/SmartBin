import React, { useState, useRef, useCallback } from 'react';
import { BinWithStatus } from '@/types';

interface MapWidgetProps {
  bins: BinWithStatus[];
}

const MapWidget: React.FC<MapWidgetProps> = ({ bins }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [binsState, setBinsState] = useState<BinWithStatus[]>(bins);

  // Sync props to state when props change
  React.useEffect(() => {
    setBinsState(bins);
  }, [bins]);

  // Dragging state for bins
  const [draggingBinId, setDraggingBinId] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const positionStart = useRef({ x: 0, y: 0 });

  const minZoom = 0.5;
  const maxZoom = 3;
  const zoomStep = 0.25;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - zoomStep, minZoom));
  const handleResetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // --- Map Pan Logic ---
  const handleMapMouseDown = useCallback((e: React.MouseEvent) => {
    if (draggingBinId) return;
    if ((e.target as HTMLElement).closest('button')) return;
    if (editMode && (e.target as HTMLElement).closest('[data-bin-marker]')) return;

    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    positionStart.current = { x: position.x, y: position.y };
  }, [position, editMode, draggingBinId]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // 1. Handle Bin Dragging
    if (draggingBinId && mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left - position.x) / zoom;
      const relY = (e.clientY - rect.top - position.y) / zoom;

      const percentX = Math.max(0, Math.min(100, (relX / rect.width) * 100));
      const percentY = Math.max(0, Math.min(100, (relY / rect.height) * 100));

      setBinsState(prev => prev.map(b =>
        b.id === draggingBinId
          ? { ...b, position: { x: percentX, y: percentY } }
          : b
      ));
      return;
    }

    // 2. Handle Map Panning
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    setPosition({
      x: positionStart.current.x + deltaX,
      y: positionStart.current.y + deltaY
    });
  }, [isDragging, draggingBinId, position, zoom]);

  const handleMouseUp = useCallback(async () => {
    if (draggingBinId) {
      const bin = binsState.find(b => b.id === draggingBinId);
      if (bin && bin.position) {
        try {
          const { binService } = await import('@/services/binService');
          await binService.updateBinLocation(bin.id, bin.position);
          console.log('Bin location updated');
        } catch (err) {
          console.error('Failed to save bin location', err);
        }
      }
      setDraggingBinId(null);
    }
    setIsDragging(false);
  }, [draggingBinId, binsState]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setDraggingBinId(null);
  }, []);

  const handleMarkerMouseDown = (e: React.MouseEvent, binId: string) => {
    if (!editMode) return;
    e.preventDefault();
    setDraggingBinId(binId);
  };

  const getMarkerColor = (status: string) => {
    if (status?.toLowerCase() === 'critical') return 'bg-red-500';
    if (status?.toLowerCase() === 'warning') return 'bg-orange-500';
    return 'bg-green-500';
  };

  const formatLastUpdated = (timestamp: number) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-widget glass-glow rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Campus Map</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{editMode ? 'Drag pins to move' : ''}</span>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${editMode ? 'bg-primary text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-[16px]">{editMode ? 'check' : 'edit_location'}</span>
            {editMode ? 'Done' : 'Edit Pins'}
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className={`flex-1 relative bg-white min-h-[600px] overflow-hidden ${draggingBinId ? 'cursor-grabbing' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMapMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`absolute inset-0 origin-center ${isDragging || draggingBinId ? '' : 'transition-transform duration-300 ease-out'}`}
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
        >
          <img
            src="/campus-map.png"
            alt="Campus Map"
            className="absolute inset-0 w-full h-full object-contain bg-white select-none pointer-events-none"
            draggable={false}
          />

          {/* Bin Markers */}
          {binsState.map((bin) => {
            const pos = bin.position || { x: 50, y: 50 };

            return (
              <div
                key={bin.id}
                data-bin-marker
                onMouseDown={(e) => handleMarkerMouseDown(e, bin.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${editMode ? 'cursor-move hover:scale-110' : 'cursor-pointer'} transition-transform z-10`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) scale(${1 / zoom})`
                }}
              >
                <div className={`relative group`}>
                  {bin.status?.toLowerCase() === 'critical' && (
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                  )}

                  <div className={`w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center ${getMarkerColor(bin.status)}`}>
                    <span className="material-symbols-outlined text-white text-[14px]">delete</span>
                  </div>

                  {/* Enriched Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity p-2 text-xs">
                    <div className="font-bold border-b border-slate-600 pb-1 mb-1 flex justify-between">
                      <span>{bin.assignedID}</span>
                      <span className="uppercase text-[10px] bg-slate-700 px-1 rounded">{bin.status}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fill Level:</span>
                        <span className={`font-mono ${bin.fillLevel >= 90 ? 'text-red-400' : 'text-blue-300'}`}>{bin.fillLevel}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Weight:</span>
                        <span className="font-mono text-slate-200">{bin.weight} kg</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-700 pt-1 mt-1">
                        <span className="text-slate-500 text-[10px]">Updated:</span>
                        <span className="text-slate-400 text-[10px]">{formatLastUpdated(bin.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button
            onClick={handleResetView}
            className="w-10 h-10 bg-surface-light dark:bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-lg"
            title="Reset view"
          >
            <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">my_location</span>
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= maxZoom}
            className="w-10 h-10 bg-surface-light dark:bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom in"
          >
            <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">add</span>
          </button>
          <button
            onClick={handleZoomOut}
            disabled={zoom <= minZoom}
            className="w-10 h-10 bg-surface-light dark:bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom out"
          >
            <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">remove</span>
          </button>
        </div>
      </div>

      {/* Bin List Below Map */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 max-h-48 overflow-y-auto">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Bin Status</h3>
        <div className="space-y-2">
          {bins.length === 0 ? (
            <p className="text-sm text-slate-500">No bins found.</p>
          ) : (
            bins.map((bin) => (
              <div
                key={bin.id}
                className="grid grid-cols-4 items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-3 h-3 flex-shrink-0 ${getMarkerColor(bin.status)} rounded-full`}></div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{bin.assignedID}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{bin.macID}</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="block text-[10px]">Fill</span>
                    <span className={`font-bold ${bin.fillLevel > 80 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>{bin.fillLevel}%</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="block text-[10px]">Weight</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{bin.weight}kg</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize truncate max-w-full">
                    {bin.status}
                  </span>
                </div>
              </div>
            )))}
        </div>
      </div>
    </div>
  );
};
export default MapWidget;