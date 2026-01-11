import React, { useState, useRef, useCallback } from 'react';

// Initial bin data
const initialBins = [
  {
    id: 'BIN_001',
    name: 'Entrance Gate',
    fillLevel: 75,
    weight: 8.5,
    status: 'warning',
    position: { top: '35%', left: '45%' }
  },
  {
    id: 'BIN_002',
    name: 'Cafeteria',
    fillLevel: 45,
    weight: 5.2,
    status: 'normal',
    position: { top: '55%', left: '30%' }
  },
  {
    id: 'BIN_003',
    name: 'Library',
    fillLevel: 90,
    weight: 12.1,
    status: 'critical',
    position: { top: '65%', left: '55%' }
  }
];

type Bin = typeof initialBins[0];

const MapWidget: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [bins, setBins] = useState<Bin[]>(initialBins);
  const [editMode, setEditMode] = useState(false);
  const [draggingBinId, setDraggingBinId] = useState<string | null>(null);

  const dragStart = useRef({ x: 0, y: 0 });
  const positionStart = useRef({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const minZoom = 0.5;
  const maxZoom = 3;
  const zoomStep = 0.25;

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - zoomStep, minZoom));
  };

  const handleResetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Map drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Ignore if clicking on controls or bin markers in edit mode
    if ((e.target as HTMLElement).closest('button')) return;
    if ((e.target as HTMLElement).closest('[data-bin-marker]') && editMode) return;

    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    positionStart.current = { x: position.x, y: position.y };
  }, [position, editMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Handle bin dragging
    if (draggingBinId && mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setBins(prev => prev.map(bin =>
        bin.id === draggingBinId
          ? { ...bin, position: { top: `${Math.max(0, Math.min(100, y))}%`, left: `${Math.max(0, Math.min(100, x))}%` } }
          : bin
      ));
      return;
    }

    // Handle map dragging
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    setPosition({
      x: positionStart.current.x + deltaX,
      y: positionStart.current.y + deltaY
    });
  }, [isDragging, draggingBinId]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggingBinId(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setDraggingBinId(null);
  }, []);

  // Bin marker drag handler
  const handleBinMouseDown = useCallback((e: React.MouseEvent, binId: string) => {
    if (!editMode) return;
    e.stopPropagation();
    setDraggingBinId(binId);
  }, [editMode]);

  const getMarkerColor = (status: string) => {
    if (status === 'critical') return 'bg-red-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="lg:col-span-2 glass-widget glass-glow rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Campus Map</h2>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400">Normal (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400">Warning (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400">Critical (1)</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className={`flex-1 relative bg-white min-h-[400px] overflow-hidden ${draggingBinId ? 'cursor-grabbing' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Zoomable Container */}
        <div
          className={`absolute inset-0 origin-center ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
        >
          {/* Campus Map Image */}
          <img
            src="/campus-map.png"
            alt="Campus Map"
            className="absolute inset-0 w-full h-full object-contain bg-white"
          />

          {/* Bin Markers Overlay */}
          <div className="absolute inset-0">
            <div className="relative w-full h-full">
              {/* Bin Markers */}
              {bins.map((bin) => (
                <div
                  key={bin.id}
                  data-bin-marker
                  className={`absolute group ${editMode ? 'cursor-move' : 'cursor-pointer'} ${draggingBinId === bin.id ? 'z-50' : ''}`}
                  style={{
                    ...bin.position,
                    transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                    transformOrigin: 'center center'
                  }}
                  onMouseDown={(e) => handleBinMouseDown(e, bin.id)}
                >
                  {/* Marker */}
                  <div className={`w-6 h-6 ${getMarkerColor(bin.status)} rounded-full border-2 ${editMode ? 'border-blue-400 ring-2 ring-blue-400/50' : 'border-white'} shadow-lg ${draggingBinId === bin.id ? 'scale-125' : ''} ${editMode ? '' : 'pulse-ring'} transition-transform`}></div>

                  {/* Tooltip on hover */}
                  <div className="absolute left-8 top-0 bg-slate-800 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
                    <div className="font-bold">{bin.name}</div>
                    <div className="text-slate-300">{bin.id}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span>Fill: {bin.fillLevel}%</span>
                      <span>•</span>
                      <span>Weight: {bin.weight}kg</span>
                    </div>
                    {editMode && <div className="mt-1 text-blue-300 text-[10px]">Drag to move</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-lg ${editMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-surface-light dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            title={editMode ? 'Exit edit mode' : 'Edit bin locations'}
          >
            <span className={`material-symbols-outlined ${editMode ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>edit_location_alt</span>
          </button>
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

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 shadow-lg z-20">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Bin List Below Map */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 max-h-48 overflow-y-auto">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Bin Status</h3>
        <div className="space-y-2">
          {bins.map((bin) => (
            <div
              key={bin.id}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 ${getMarkerColor(bin.status)} rounded-full`}></div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{bin.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{bin.id}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900 dark:text-white">{bin.fillLevel}%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{bin.weight} kg</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        .pulse-ring {
          animation: pulse-ring 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default MapWidget;