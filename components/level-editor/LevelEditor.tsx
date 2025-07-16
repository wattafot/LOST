"use client";

import { useState, useCallback } from 'react';
import { useLevelEditor } from './hooks/useLevelEditor';
import TilePalette from './components/TilePalette';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';

export default function LevelEditor() {
  const {
    // State
    levelData,
    selectedTile,
    isDrawing: _isDrawing,
    showGrid,
    zoom,
    history,
    historyIndex,
    isErasing,
    mounted: _mounted,
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
  const [dynamicTiles, setDynamicTiles] = useState([]);

  // Derived state
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Handlers
  const handleTilePlace = (x: number, y: number, tileId: string | null) => {
    placeTile(x, y, tileId);
  };

  const handleTileSelect = useCallback((tile) => {
    console.log('🎯 LEVEL EDITOR - Tile selected:', tile);
    
    // Add tile to dynamic tiles if not exists
    setDynamicTiles(prev => {
      const exists = prev.find(t => t.id === tile.id);
      if (!exists) {
        console.log('➕ Adding tile to dynamic tiles:', tile.id);
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
    <div className="flex h-full w-full bg-gray-900 text-white overflow-hidden">
      {/* Left Panel */}
      <TilePalette
        selectedTile={selectedTile}
        onTileSelect={handleTileSelect}
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
  );
}