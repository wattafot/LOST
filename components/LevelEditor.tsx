"use client";

import { useState, useRef, useEffect } from "react";
import { Save, Download, Upload, Trash2, Eye, EyeOff, Undo, Redo, Eraser, Mountain, Waves, Package, Sparkles, Users, Loader2 } from "lucide-react";

interface Tile {
  id: string;
  name: string;
  sprite: string;
  category: 'terrain' | 'objects' | 'water' | 'decorations' | 'characters';
  color: string; // Fallback color for display
  frameWidth?: number; // For sprite sheets
  frameHeight?: number; // For sprite sheets
  frameIndex?: number; // Which frame to display
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
  { id: 'flooring', name: 'Flooring', sprite: '/sprites/tilesets/floors/flooring.png', category: 'terrain', color: '#8B4513' },
  { id: 'carpet', name: 'Carpet', sprite: '/sprites/tilesets/floors/carpet.png', category: 'terrain', color: '#8B0000' },
  { id: 'wooden', name: 'Wooden Floor', sprite: '/sprites/tilesets/floors/wooden.png', category: 'terrain', color: '#DEB887' },
  
  // Water tiles
  { id: 'water1', name: 'Water 1', sprite: '/sprites/tilesets/water1.png', category: 'water', color: '#4682B4' },
  { id: 'water2', name: 'Water 2', sprite: '/sprites/tilesets/water2.png', category: 'water', color: '#5F9EA0' },
  { id: 'water3', name: 'Water 3', sprite: '/sprites/tilesets/water3.png', category: 'water', color: '#6495ED' },
  { id: 'water4', name: 'Water 4', sprite: '/sprites/tilesets/water4.png', category: 'water', color: '#87CEEB' },
  { id: 'water5', name: 'Water 5', sprite: '/sprites/tilesets/water5.png', category: 'water', color: '#20B2AA' },
  { id: 'water6', name: 'Water 6', sprite: '/sprites/tilesets/water6.png', category: 'water', color: '#48D1CC' },
  { id: 'water_decorations', name: 'Water Deco', sprite: '/sprites/tilesets/water_decorations.png', category: 'water', color: '#40E0D0' },
  { id: 'water_lillies', name: 'Water Lillies', sprite: '/sprites/tilesets/water_lillies.png', category: 'water', color: '#00CED1' },
  
  // Objects
  { id: 'chest1', name: 'Chest 1', sprite: '/sprites/objects/chest_01.png', category: 'objects', color: '#8B4513' },
  { id: 'chest2', name: 'Chest 2', sprite: '/sprites/objects/chest_02.png', category: 'objects', color: '#A0522D' },
  { id: 'rock1', name: 'Rock 1', sprite: '/sprites/objects/rock_in_water_01.png', category: 'objects', color: '#696969' },
  { id: 'rock2', name: 'Rock 2', sprite: '/sprites/objects/rock_in_water_02.png', category: 'objects', color: '#708090' },
  { id: 'rock3', name: 'Rock 3', sprite: '/sprites/objects/rock_in_water_03.png', category: 'objects', color: '#778899' },
  { id: 'rock4', name: 'Rock 4', sprite: '/sprites/objects/rock_in_water_04.png', category: 'objects', color: '#2F4F4F' },
  { id: 'rock5', name: 'Rock 5', sprite: '/sprites/objects/rock_in_water_05.png', category: 'objects', color: '#696969' },
  { id: 'rock6', name: 'Rock 6', sprite: '/sprites/objects/rock_in_water_06.png', category: 'objects', color: '#808080' },
  
  // Decorations
  { id: 'fence', name: 'Fence', sprite: '/sprites/tilesets/fences.png', category: 'decorations', color: '#8B4513' },
  { id: 'walls', name: 'Walls', sprite: '/sprites/tilesets/walls/walls.png', category: 'decorations', color: '#A0522D' },
  { id: 'wooden_door', name: 'Wooden Door', sprite: '/sprites/tilesets/walls/wooden_door.png', category: 'decorations', color: '#DEB887' },
  { id: 'wooden_door_b', name: 'Wooden Door B', sprite: '/sprites/tilesets/walls/wooden_door_b.png', category: 'decorations', color: '#D2691E' },
  { id: 'decor_8x8', name: 'Small Decor', sprite: '/sprites/tilesets/decor_8x8.png', category: 'decorations', color: '#228B22' },
  { id: 'dust_particles', name: 'Dust Particles', sprite: '/sprites/particles/dust_particles_01.png', category: 'decorations', color: '#F5DEB3' },
  
  // Characters
  { id: 'player', name: 'Player', sprite: '/sprites/characters/player.png', category: 'characters', color: '#FFA500', frameWidth: 48, frameHeight: 48, frameIndex: 0 },
  { id: 'skeleton', name: 'Skeleton', sprite: '/sprites/characters/skeleton.png', category: 'characters', color: '#F5F5DC', frameWidth: 48, frameHeight: 48, frameIndex: 0 },
  { id: 'skeleton_swordless', name: 'Skeleton (No Sword)', sprite: '/sprites/characters/skeleton_swordless.png', category: 'characters', color: '#DCDCDC', frameWidth: 48, frameHeight: 48, frameIndex: 0 },
  { id: 'slime', name: 'Slime', sprite: '/sprites/characters/slime.png', category: 'characters', color: '#32CD32', frameWidth: 32, frameHeight: 32, frameIndex: 0 },
];

const GRID_SIZE = 32;
const DEFAULT_LEVEL_WIDTH = 25;
const DEFAULT_LEVEL_HEIGHT = 19;

// Sprite Image Component
const SpriteImage = ({ tile, size = 32 }: { tile: Tile; size?: number }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Reset states when tile changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [tile.id]);
  
  // For sprite sheets, we need to handle them differently
  if (tile.frameWidth && tile.frameHeight) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = size;
      canvas.height = size;
      
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, size, size);
        
        const frameIndex = tile.frameIndex || 0;
        const framesPerRow = Math.floor(img.width / tile.frameWidth!);
        const frameX = (frameIndex % framesPerRow) * tile.frameWidth!;
        const frameY = Math.floor(frameIndex / framesPerRow) * tile.frameHeight!;
        
        ctx.drawImage(
          img,
          frameX, frameY, tile.frameWidth!, tile.frameHeight!,
          0, 0, size, size
        );
        
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      
      img.src = tile.sprite;
    }, [tile, size]);
    
    if (isLoading) {
      return (
        <div 
          className="flex items-center justify-center bg-gray-700 border border-gray-600 rounded"
          style={{ width: size, height: size }}
        >
          <Loader2 size={size / 3} className="animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (hasError) {
      return (
        <div 
          className="flex items-center justify-center bg-gray-700 border border-gray-600 rounded text-gray-300 text-xs"
          style={{ width: size, height: size }}
        >
          {tile.name.slice(0, 3).toUpperCase()}
        </div>
      );
    }
    
    return <canvas ref={canvasRef} width={size} height={size} className="rounded" />;
  }
  
  // For regular images, use simple img tag
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-700 border border-gray-600 rounded"
        >
          <Loader2 size={size / 3} className="animate-spin text-gray-400" />
        </div>
      )}
      <img 
        src={tile.sprite}
        alt={tile.name}
        className="rounded border border-gray-600"
        style={{ 
          width: size, 
          height: size, 
          objectFit: 'cover',
          display: isLoading ? 'none' : 'block'
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      {hasError && !isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-700 border border-gray-600 rounded text-gray-300 text-xs"
        >
          {tile.name.slice(0, 3).toUpperCase()}
        </div>
      )}
    </div>
  );
};

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
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [selectedTile, setSelectedTile] = useState<Tile | null>(AVAILABLE_TILES[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('terrain');
  const [zoom, setZoom] = useState(1);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: HTMLImageElement }>({});
  const [history, setHistory] = useState<LevelData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Initialize history on component mount
  useEffect(() => {
    if (history.length === 0) {
      const initialHistory = [JSON.parse(JSON.stringify(levelData))];
      setHistory(initialHistory);
      setHistoryIndex(0);
    }
  }, [levelData, history.length]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get tiles by category
  const getTilesByCategory = (category: string) => {
    return AVAILABLE_TILES.filter(tile => tile.category === category);
  };
  
  // Get unique categories
  const categories = [...new Set(AVAILABLE_TILES.map(tile => tile.category))];
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'terrain': return <Mountain size={16} />;
      case 'water': return <Waves size={16} />;
      case 'objects': return <Package size={16} />;
      case 'decorations': return <Sparkles size={16} />;
      case 'characters': return <Users size={16} />;
      default: return <Package size={16} />;
    }
  };
  
  // Convert grid position to tile key
  const positionToKey = (x: number, y: number) => `${x},${y}`;
  
  // Convert tile key to grid position
  const keyToPosition = (key: string) => {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  };
  
  // Add to history for undo functionality
  const addToHistory = (newLevelData: LevelData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newLevelData)));
    
    // Keep only last 50 actions
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setHistory(newHistory);
  };
  
  // Place tile at position
  const placeTile = (x: number, y: number, tileId: string | null) => {
    const key = positionToKey(x, y);
    
    setLevelData(prev => {
      const newLevelData = {
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
      };
      
      // Add to history
      addToHistory(prev);
      
      return newLevelData;
    });
  };
  
  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const historyEntry = history[newIndex];
      if (historyEntry) {
        setHistoryIndex(newIndex);
        setLevelData(historyEntry);
      }
    }
  };
  
  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const historyEntry = history[newIndex];
      if (historyEntry) {
        setHistoryIndex(newIndex);
        setLevelData(historyEntry);
      }
    }
  };
  
  // Single tile delete mode
  const [isErasing, setIsErasing] = useState(false);
  
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
      if (e.button === 2 || isErasing) { // Right click or eraser mode - erase
        placeTile(x, y, null);
      } else if (selectedTile) { // Left click - place
        placeTile(x, y, selectedTile.id);
      }
    }
  };
  
  // Preload images for canvas rendering
  useEffect(() => {
    const imagesToLoad = AVAILABLE_TILES.filter(tile => 
      !loadedImages[tile.id]
    );
    
    if (imagesToLoad.length === 0) return;
    
    imagesToLoad.forEach(tile => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [tile.id]: img }));
      };
      img.onerror = () => {
        // Create a fallback colored canvas
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = GRID_SIZE;
        fallbackCanvas.height = GRID_SIZE;
        const fallbackCtx = fallbackCanvas.getContext('2d');
        if (fallbackCtx) {
          fallbackCtx.fillStyle = tile.color;
          fallbackCtx.fillRect(0, 0, GRID_SIZE, GRID_SIZE);
          fallbackCtx.fillStyle = 'white';
          fallbackCtx.font = '12px Arial';
          fallbackCtx.textAlign = 'center';
          fallbackCtx.fillText(tile.name.charAt(0), GRID_SIZE/2, GRID_SIZE/2 + 4);
        }
        const fallbackImg = new Image();
        fallbackImg.src = fallbackCanvas.toDataURL();
        setLoadedImages(prev => ({ ...prev, [tile.id]: fallbackImg }));
      };
      img.src = tile.sprite;
    });
  }, [loadedImages]);

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
      const img = loadedImages[tileId];
      
      if (tile && img) {
        if (tile.frameWidth && tile.frameHeight) {
          // Handle sprite sheet
          const frameIndex = tile.frameIndex || 0;
          const framesPerRow = Math.floor(img.width / tile.frameWidth);
          const frameX = (frameIndex % framesPerRow) * tile.frameWidth;
          const frameY = Math.floor(frameIndex / framesPerRow) * tile.frameHeight;
          
          ctx.drawImage(
            img,
            frameX, frameY, tile.frameWidth, tile.frameHeight,
            x * GRID_SIZE * zoom,
            y * GRID_SIZE * zoom,
            GRID_SIZE * zoom,
            GRID_SIZE * zoom
          );
        } else {
          // Handle regular image
          ctx.drawImage(
            img,
            x * GRID_SIZE * zoom,
            y * GRID_SIZE * zoom,
            GRID_SIZE * zoom,
            GRID_SIZE * zoom
          );
        }
      } else if (tile) {
        // Fallback to gray rectangle with text label
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(
          x * GRID_SIZE * zoom,
          y * GRID_SIZE * zoom,
          GRID_SIZE * zoom,
          GRID_SIZE * zoom
        );
        
        // Add border
        ctx.strokeStyle = '#718096';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          x * GRID_SIZE * zoom,
          y * GRID_SIZE * zoom,
          GRID_SIZE * zoom,
          GRID_SIZE * zoom
        );
        
        // Add tile label
        ctx.fillStyle = '#e2e8f0';
        ctx.font = `${Math.max(8, 8 * zoom)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          tile.name.slice(0, 3).toUpperCase(),
          (x + 0.5) * GRID_SIZE * zoom,
          (y + 0.5) * GRID_SIZE * zoom
        );
      }
    });
    
  }, [levelData, showGrid, zoom, loadedImages]);
  
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
        
        {/* Category Selection - Grid Layout */}
        <div className="border-b border-gray-700 p-3">
          <div className="grid grid-cols-3 gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`p-2 rounded border-2 transition-all text-sm font-medium capitalize ${
                  activeCategory === category
                    ? 'border-blue-500 bg-blue-600 bg-opacity-20 text-white'
                    : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-gray-300">
                    {getCategoryIcon(category)}
                  </div>
                  <div className="text-xs">{category}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Tile Palette */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {getTilesByCategory(activeCategory).map(tile => (
              <button
                key={tile.id}
                onClick={() => setSelectedTile(tile)}
                className={`p-3 rounded border-2 transition-all ${
                  selectedTile?.id === tile.id
                    ? 'border-blue-500 bg-blue-600 bg-opacity-20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="w-full h-16 rounded mb-2 flex items-center justify-center bg-gray-800">
                  <SpriteImage tile={tile} size={48} />
                </div>
                <div className="text-xs text-center text-white font-medium">{tile.name}</div>
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
        <div className="bg-gray-800 border-b border-gray-700 p-2">
          <div className="flex items-center gap-2">
            <button
              onClick={saveLevel}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-green-600 rounded hover:bg-green-700"
            >
              <Save size={14} />
              Save
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700"
            >
              <Upload size={14} />
              Load
            </button>
            
            <button
              onClick={exportToGameFormat}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-purple-600 rounded hover:bg-purple-700"
            >
              <Download size={14} />
              Export
            </button>
            
            <div className="h-4 w-px bg-gray-600"></div>
            
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Undo size={14} />
            </button>
            
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Redo size={14} />
            </button>
            
            <button
              onClick={() => setIsErasing(!isErasing)}
              className={`flex items-center gap-1 px-2 py-1 text-sm rounded ${
                isErasing 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              <Eraser size={14} />
            </button>
            
            <div className="h-4 w-px bg-gray-600"></div>
            
            <button
              onClick={clearLevel}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-red-600 rounded hover:bg-red-700"
            >
              <Trash2 size={14} />
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
            Mode: {isErasing ? 'Erasing' : 'Drawing'} | 
            Selected: {selectedTile?.name || 'None'} | 
            {isErasing ? 'Click to erase tiles' : 'Left click to place, Right click to erase'} | 
            Modified: {mounted ? levelData.metadata.modified.toLocaleString() : 'Loading...'}
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