import { useState, useEffect, useCallback } from 'react';
import { LevelData, LevelEditorState, LevelEditorActions, Tile, DEFAULT_LEVEL_WIDTH, DEFAULT_LEVEL_HEIGHT, GRID_SIZE, MAX_HISTORY_SIZE } from '../types';

export const useLevelEditor = (): LevelEditorState & LevelEditorActions => {
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

  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<LevelData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isErasing, setIsErasing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize history and mounted state
  useEffect(() => {
    if (history.length === 0) {
      const initialHistory = [structuredClone(levelData)];
      setHistory(initialHistory);
      setHistoryIndex(0);
    }
    setMounted(true);
  }, [levelData, history.length]);

  // Position utilities
  const positionToKey = useCallback((x: number, y: number): string => `${x},${y}`, []);
  
  const keyToPosition = useCallback((key: string): { x: number; y: number } => {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  }, []);
  
  // Silence unused warning - this function is available for future use
  void keyToPosition;

  // History management
  const addToHistory = useCallback((newLevelData: LevelData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(structuredClone(newLevelData));
    
    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setHistory(newHistory);
  }, [history, historyIndex]);

  // Tile placement
  const placeTile = useCallback((x: number, y: number, tileId: string | null) => {
    if (x < 0 || x >= levelData.width || y < 0 || y >= levelData.height) return;
    
    const key = positionToKey(x, y);
    
    setLevelData(prev => {
      const newTiles = { ...prev.tiles };
      
      if (tileId) {
        newTiles[key] = tileId;
      } else {
        delete newTiles[key];
      }
      
      const newLevelData = {
        ...prev,
        tiles: newTiles,
        metadata: {
          ...prev.metadata,
          modified: new Date()
        }
      };
      
      addToHistory(prev);
      return newLevelData;
    });
  }, [levelData.width, levelData.height, positionToKey, addToHistory]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const historyEntry = history[newIndex];
      if (historyEntry) {
        setHistoryIndex(newIndex);
        setLevelData(historyEntry);
      }
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const historyEntry = history[newIndex];
      if (historyEntry) {
        setHistoryIndex(newIndex);
        setLevelData(historyEntry);
      }
    }
  }, [history, historyIndex]);

  // Level operations
  const clearLevel = useCallback(() => {
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
  }, []);

  const saveLevel = useCallback(() => {
    const dataStr = JSON.stringify(levelData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${levelData.metadata.name.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [levelData]);

  const loadLevel = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target?.result as string);
          setLevelData(loadedData);
          resolve();
        } catch (error) {
          console.error('Error loading level file:', error);
          reject(new Error('Error loading level file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }, []);

  const exportToGameFormat = useCallback(() => {
    const gameFormat = {
      mapWidth: levelData.width,
      mapHeight: levelData.height,
      tileSize: levelData.tileSize,
      tiles: levelData.tiles,
      metadata: levelData.metadata
    };
    
    const dataStr = JSON.stringify(gameFormat, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${levelData.metadata.name.replace(/\s+/g, '_')}_game.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [levelData]);

  return {
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
  };
};