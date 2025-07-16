"use client";

import { useMemo } from 'react';
import { generateAvailableTiles } from '../utils/tileUtils';
import { useLevelEditor } from './hooks/useLevelEditor';
import TilePalette from './components/TilePalette';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';

export default function LevelEditor() {
  const {
    // State
    levelData,
    selectedTile,
    isDrawing,
    showGrid,
    activeCategory,
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
    setActiveCategory,
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

  // Memoize tiles to prevent unnecessary re-renders
  const availableTiles = useMemo(() => generateAvailableTiles(), []);

  // Memoize derived state
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Handlers
  const handleTilePlace = (x: number, y: number, tileId: string | null) => {
    placeTile(x, y, tileId);
  };

  const handleTileSelect = (tile: typeof availableTiles[0]) => {
    setSelectedTile(tile);
    setIsErasing(false);
  };

  const handleToggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Left Panel */}
      <TilePalette
        tiles={availableTiles}
        selectedTile={selectedTile}
        activeCategory={activeCategory}
        levelData={levelData}
        zoom={zoom}
        onTileSelect={handleTileSelect}
        onCategoryChange={setActiveCategory}
        onLevelDataChange={setLevelData}
        onZoomChange={setZoom}
      />

      {/* Center Panel */}
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
        />

        <Canvas
          levelData={levelData}
          tiles={availableTiles}
          showGrid={showGrid}
          zoom={zoom}
          isErasing={isErasing}
          selectedTile={selectedTile}
          onTilePlace={handleTilePlace}
          onDrawingStateChange={setIsDrawing}
        />
      </div>
    </div>
  );
}