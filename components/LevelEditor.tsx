"use client";

import { useState, useRef, useEffect } from "react";
import { Save, Download, Upload, Trash2, Eye, EyeOff } from "lucide-react";

interface Tile {
  id: string;
  name: string;
  sprite: string;
  category: 'terrain' | 'objects' | 'water' | 'decorations';
  color: string; // Fallback color for display
}

interface LevelData {
  width: number;
  height: number;
  tileSize: number;
  tiles: { [key: string]: string }; // position key -> tile id
  metadata: {
    name: string;
    description: string;
    created: Date;
    modified: Date;
  };
}

const AVAILABLE_TILES: Tile[] = [
  // Terrain tiles
  { id: 'grass', name: 'Grass', sprite: '/sprites/tilesets/grass.png', category: 'terrain', color: '#32CD32' },
  { id: 'sand', name: 'Sand', sprite: '/sprites/tilesets/floors/flooring.png', category: 'terrain', color: '#F4A460' },
  { id: 'dirt', name: 'Dirt', sprite: '/sprites/tilesets/floors/flooring.png', category: 'terrain', color: '#8B4513' },
  
  // Water tiles
  { id: 'water1', name: 'Water 1', sprite: '/sprites/tilesets/water1.png', category: 'water', color: '#4682B4' },
  { id: 'water2', name: 'Water 2', sprite: '/sprites/tilesets/water2.png', category: 'water', color: '#5F9EA0' },
  { id: 'water3', name: 'Water 3', sprite: '/sprites/tilesets/water3.png', category: 'water', color: '#6495ED' },
  
  // Objects
  { id: 'chest', name: 'Chest', sprite: '/sprites/objects/chest_01.png', category: 'objects', color: '#8B4513' },
  { id: 'rock', name: 'Rock', sprite: '/sprites/objects/rock_in_water_01.png', category: 'objects', color: '#696969' },
  
  // Decorations
  { id: 'fence', name: 'Fence', sprite: '/sprites/tilesets/fences.png', category: 'decorations', color: '#8B4513' },
];

const GRID_SIZE = 32;
const DEFAULT_LEVEL_WIDTH = 25;
const DEFAULT_LEVEL_HEIGHT = 19;

export default function LevelEditor() {
  const [levelData, setLevelData] = useState<LevelData>({
    width: DEFAULT_LEVEL_WIDTH,
    height: DEFAULT_LEVEL_HEIGHT,
    tileSize: GRID_SIZE,
    tiles: {},
    metadata: {
      name: 'Untitled Level',
      description: 'A new level',
      created: new Date(),
      modified: new Date(),
    }
  });
  
  const [selectedTile, setSelectedTile] = useState<Tile | null>(AVAILABLE_TILES[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('terrain');
  const [zoom, setZoom] = useState(1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get tiles by category
  const getTilesByCategory = (category: string) => {
    return AVAILABLE_TILES.filter(tile => tile.category === category);
  };
  
  // Get unique categories
  const categories = [...new Set(AVAILABLE_TILES.map(tile => tile.category))];
  
  // Convert grid position to tile key
  const positionToKey = (x: number, y: number) => `${x},${y}`;
  
  // Convert tile key to grid position
  const keyToPosition = (key: string) => {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  };
  
  // Place tile at position
  const placeTile = (x: number, y: number, tileId: string | null) => {
    const key = positionToKey(x, y);
    setLevelData(prev => ({
      ...prev,
      tiles: tileId ? { ...prev.tiles, [key]: tileId } : 
                     (() => {
                       const newTiles = { ...prev.tiles };
                       delete newTiles[key];
                       return newTiles;
                     })(),
      metadata: {
        ...prev.metadata,
        modified: new Date()
      }
    }));
  };
  
  // Handle canvas mouse events
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    handleCanvasClick(e);
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    handleCanvasClick(e);
  };
  
  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (GRID_SIZE * zoom));
    const y = Math.floor((e.clientY - rect.top) / (GRID_SIZE * zoom));
    
    if (x >= 0 && x < levelData.width && y >= 0 && y < levelData.height) {
      if (e.button === 2) { // Right click - erase
        placeTile(x, y, null);
      } else if (selectedTile) { // Left click - place
        placeTile(x, y, selectedTile.id);
      }
    }
  };
  
  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = levelData.width * GRID_SIZE * zoom;
    canvas.height = levelData.height * GRID_SIZE * zoom;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#34495e';
      ctx.lineWidth = 1;
      
      for (let x = 0; x <= levelData.width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * GRID_SIZE * zoom, 0);
        ctx.lineTo(x * GRID_SIZE * zoom, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= levelData.height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * GRID_SIZE * zoom);
        ctx.lineTo(canvas.width, y * GRID_SIZE * zoom);
        ctx.stroke();
      }
    }
    
    // Draw tiles
    Object.entries(levelData.tiles).forEach(([key, tileId]) => {
      const { x, y } = keyToPosition(key);
      const tile = AVAILABLE_TILES.find(t => t.id === tileId);
      
      if (tile) {
        ctx.fillStyle = tile.color;
        ctx.fillRect(
          x * GRID_SIZE * zoom,
          y * GRID_SIZE * zoom,
          GRID_SIZE * zoom,
          GRID_SIZE * zoom
        );
        
        // Add tile label
        ctx.fillStyle = 'white';
        ctx.font = `${8 * zoom}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(
          tile.name.charAt(0),
          (x + 0.5) * GRID_SIZE * zoom,
          (y + 0.6) * GRID_SIZE * zoom
        );
      }
    });
    
  }, [levelData, showGrid, zoom]);
  
  // Save level to JSON
  const saveLevel = () => {
    const dataStr = JSON.stringify(levelData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${levelData.metadata.name.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Load level from JSON
  const loadLevel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedData = JSON.parse(e.target?.result as string);
        setLevelData(loadedData);
      } catch {
        alert('Error loading level file');
      }
    };
    reader.readAsText(file);
  };
  
  // Clear level
  const clearLevel = () => {
    if (confirm('Are you sure you want to clear the level?')) {
      setLevelData(prev => ({
        ...prev,
        tiles: {},
        metadata: {
          ...prev.metadata,
          modified: new Date()
        }
      }));
    }
  };
  
  // Export to game format
  const exportToGameFormat = () => {
    const gameFormat = {
      mapWidth: levelData.width,
      mapHeight: levelData.height,
      tileSize: levelData.tileSize,
      tiles: levelData.tiles,
      metadata: levelData.metadata
    };
    
    const dataStr = JSON.stringify(gameFormat, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${levelData.metadata.name.replace(/\s+/g, '_')}_game.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Panel - Tile Palette */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold mb-2">Level Editor</h2>
          <input
            type="text"
            value={levelData.metadata.name}
            onChange={(e) => setLevelData(prev => ({
              ...prev,
              metadata: { ...prev.metadata, name: e.target.value }
            }))}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            placeholder="Level name"
          />
        </div>
        
        {/* Category Tabs */}
        <div className="flex border-b border-gray-700">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-1 p-2 text-sm font-medium capitalize ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Tile Palette */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-2">
            {getTilesByCategory(activeCategory).map(tile => (
              <button
                key={tile.id}
                onClick={() => setSelectedTile(tile)}
                className={`p-3 rounded border-2 transition-all ${
                  selectedTile?.id === tile.id
                    ? 'border-blue-500 bg-blue-600 bg-opacity-20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                style={{ backgroundColor: tile.color + '40' }}
              >
                <div className="w-full h-8 rounded mb-1" style={{ backgroundColor: tile.color }}></div>
                <div className="text-xs text-center">{tile.name}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Tools */}
        <div className="border-t border-gray-700 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">Zoom:</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm w-12">{zoom.toFixed(1)}x</span>
            </div>
            
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`w-full p-2 rounded flex items-center justify-center gap-2 ${
                showGrid ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              {showGrid ? <Eye size={16} /> : <EyeOff size={16} />}
              Grid
            </button>
            
            {/* Level Dimensions */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Level Size:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={levelData.width}
                  onChange={(e) => setLevelData(prev => ({
                    ...prev,
                    width: Number(e.target.value)
                  }))}
                  className="w-20 p-1 bg-gray-700 rounded border border-gray-600 text-white text-sm"
                />
                <span className="text-sm self-center">×</span>
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={levelData.height}
                  onChange={(e) => setLevelData(prev => ({
                    ...prev,
                    height: Number(e.target.value)
                  }))}
                  className="w-20 p-1 bg-gray-700 rounded border border-gray-600 text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Center Panel - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={saveLevel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              <Save size={16} />
              Save Level
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              <Upload size={16} />
              Load Level
            </button>
            
            <button
              onClick={exportToGameFormat}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
            >
              <Download size={16} />
              Export for Game
            </button>
            
            <button
              onClick={clearLevel}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              <Trash2 size={16} />
              Clear
            </button>
            
            <div className="ml-auto text-sm text-gray-400">
              Size: {levelData.width}x{levelData.height} | Tiles: {Object.keys(levelData.tiles).length}
            </div>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-900 p-4">
          <canvas
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onContextMenu={(e) => e.preventDefault()}
            className="border border-gray-600 cursor-crosshair"
          />
        </div>
        
        {/* Status Bar */}
        <div className="bg-gray-800 border-t border-gray-700 p-2">
          <div className="text-sm text-gray-400">
            Selected: {selectedTile?.name || 'None'} | 
            Left click to place, Right click to erase | 
            Modified: {levelData.metadata.modified.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={loadLevel}
        className="hidden"
      />
    </div>
  );
}