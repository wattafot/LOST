"use client";

import { useState, useCallback } from 'react';
import { Tile } from './types';
import { useLevelEditor } from './hooks/useLevelEditor';
import TilePalette from './components/TilePalette';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import MobileControls from './components/MobileControls';

export default function LevelEditor() {
  const {
    // State
    levelData,
    selectedTile,
    isDrawing,
    showGrid,
    zoom,
    history,
    historyIndex,
    isErasing,
    mounted,
    // Actions
    setLevelData,
    setSelectedTile,
    setIsDrawing,
    setShowGrid,
    setZoom,
    setIsErasing,
    placeTile,
    undo,
    redo,
    clearLevel,
    saveLevel,
    loadLevel,
    exportToGameFormat,
  } = useLevelEditor();

  // State for dynamic tiles (includes tiles created from tileset viewer)
  const [dynamicTiles, setDynamicTiles] = useState<Tile[]>([]);
  
  // Mobile UI state
  const [isTilePaletteOpen, setIsTilePaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derived state
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Handlers
  const handleTilePlace = (x: number, y: number, tileId: string | null) => {
    placeTile(x, y, tileId);
  };

  const handleTileSelect = useCallback((tile: Tile) => {
    // Add tile to dynamic tiles if not exists
    setDynamicTiles(prev => {
      const exists = prev.find(t => t.id === tile.id);
      if (!exists) {
        return [...prev, tile];
      }
      return prev;
    });
    
    setSelectedTile(tile);
    setIsErasing(false);
  }, [setSelectedTile, setIsErasing]);

  const handleToggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
  };

  return (
    <div className="flex h-full w-full bg-gray-900 text-white overflow-hidden relative">
      {/* Desktop Layout - Hidden on Mobile */}
      <div className="hidden lg:flex h-full w-full">
        {/* Left Panel - Desktop */}
        <TilePalette
          selectedTile={selectedTile}
          onTileSelect={handleTileSelect}
        />

        {/* Center Panel - Desktop */}
        <div className="flex-1 flex flex-col min-h-0">
          <Toolbar
            canUndo={canUndo}
            canRedo={canRedo}
            isErasing={isErasing}
            showGrid={showGrid}
            levelData={levelData}
            zoom={zoom}
            onSave={saveLevel}
            onLoad={loadLevel}
            onExport={exportToGameFormat}
            onUndo={undo}
            onRedo={redo}
            onToggleEraser={handleToggleEraser}
            onToggleGrid={handleToggleGrid}
            onClear={clearLevel}
            onLevelDataChange={setLevelData}
            onZoomChange={setZoom}
            isMobile={false}
          />

          <Canvas
            levelData={levelData}
            tiles={dynamicTiles}
            showGrid={showGrid}
            zoom={zoom}
            isErasing={isErasing}
            selectedTile={selectedTile}
            onTilePlace={handleTilePlace}
            onDrawingStateChange={setIsDrawing}
          />
        </div>
      </div>

      {/* Mobile Layout - Shown only on Mobile */}
      <div className="flex lg:hidden h-full w-full flex-col">
        {/* Mobile Controls */}
        <MobileControls
          selectedTile={selectedTile}
          isErasing={isErasing}
          canUndo={canUndo}
          canRedo={canRedo}
          isTilePaletteOpen={isTilePaletteOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleTilePalette={() => setIsTilePaletteOpen(!isTilePaletteOpen)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onToggleEraser={handleToggleEraser}
          onUndo={undo}
          onRedo={redo}
        />

        {/* Mobile Canvas */}
        <div className="flex-1 relative">
          <Canvas
            levelData={levelData}
            tiles={dynamicTiles}
            showGrid={showGrid}
            zoom={zoom}
            isErasing={isErasing}
            selectedTile={selectedTile}
            onTilePlace={handleTilePlace}
            onDrawingStateChange={setIsDrawing}
          />
        </div>

        {/* Mobile Tile Palette Overlay - Fullscreen */}
        {isTilePaletteOpen && (
          <div className="absolute inset-0 z-50 bg-gray-900 lg:hidden flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
              <h3 className="text-lg font-semibold text-white">Select Tiles</h3>
              <button
                onClick={() => setIsTilePaletteOpen(false)}
                className="text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* Fullscreen Tile Palette */}
            <div className="flex-1 overflow-hidden bg-gray-800">
              <TilePalette
                selectedTile={selectedTile}
                onTileSelect={(tile) => {
                  handleTileSelect(tile);
                  setIsTilePaletteOpen(false); // Close after selection
                }}
              />
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 z-40 bg-black bg-opacity-50 lg:hidden">
            <div className="absolute top-0 left-0 right-0 bg-gray-800">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Level Settings</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
              <div className="p-4 space-y-4">
                <Toolbar
                  canUndo={canUndo}
                  canRedo={canRedo}
                  isErasing={isErasing}
                  showGrid={showGrid}
                  levelData={levelData}
                  zoom={zoom}
                  onSave={saveLevel}
                  onLoad={loadLevel}
                  onExport={exportToGameFormat}
                  onUndo={undo}
                  onRedo={redo}
                  onToggleEraser={handleToggleEraser}
                  onToggleGrid={handleToggleGrid}
                  onClear={clearLevel}
                  onLevelDataChange={setLevelData}
                  onZoomChange={setZoom}
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}