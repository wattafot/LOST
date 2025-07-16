import { Tile } from '../level-editor/types';
import { detectTilesetDefinition, generateTilesFromDefinition } from '@/utils/autoTilesetDetector';

// Cache for tileset definitions
const tilesetDefinitions = new Map();

// Generate tiles using automatic detection - LDtk style
export const generateAvailableTilesSync = (): readonly Tile[] => {
  // For now, return empty array - will be populated by async loading
  return Object.freeze([]);
};

export const loadTilesetAsync = async (imagePath: string, tileSize: number = 16): Promise<readonly Tile[]> => {
  try {
    console.log(`🔄 Loading tileset: ${imagePath}`);
    
    // Check cache first
    if (tilesetDefinitions.has(imagePath)) {
      const definition = tilesetDefinitions.get(imagePath);
      return Object.freeze(generateTilesFromDefinition(definition));
    }
    
    // Auto-detect tileset definition
    const definition = await detectTilesetDefinition(imagePath, tileSize);
    
    // Cache the definition
    tilesetDefinitions.set(imagePath, definition);
    
    // Generate tiles from definition
    const tiles = generateTilesFromDefinition(definition);
    
    console.log(`✅ Loaded ${tiles.length} tiles from ${definition.columns}x${definition.rows} tileset`);
    
    return Object.freeze(tiles);
  } catch (error) {
    console.error('❌ Failed to load tileset:', error);
    return Object.freeze([]);
  }
};

// Get tileset definition for a loaded tileset
export const getTilesetDefinition = (imagePath: string) => {
  return tilesetDefinitions.get(imagePath);
};