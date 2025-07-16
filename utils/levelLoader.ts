import { GameObject, PhaserGroup, Position, PhaserSceneContext } from '@/types/game';
import { GAME_CONFIG, SPRITE_NAMES } from './gameConstants';

export interface LevelData {
  mapWidth: number;
  mapHeight: number;
  tileSize: number;
  tiles: { [key: string]: string }; // position key -> tile id
  metadata: {
    name: string;
    description: string;
    created: Date;
    modified: Date;
  };
}

// Map tile IDs to sprite names
const TILE_TO_SPRITE_MAP: { [key: string]: string } = {
  'grass': SPRITE_NAMES.TERRAIN.GRASS,
  'sand': SPRITE_NAMES.TERRAIN.SAND,
  'dirt': SPRITE_NAMES.TERRAIN.DIRT,
  'water1': SPRITE_NAMES.WATER[0],
  'water2': SPRITE_NAMES.WATER[1],
  'water3': SPRITE_NAMES.WATER[2],
  'chest': 'chest',
  'rock': 'rock_in_water',
  'fence': 'fence',
};

// Map tile IDs to types
const TILE_TYPES: { [key: string]: 'terrain' | 'water' | 'object' } = {
  'grass': 'terrain',
  'sand': 'terrain',
  'dirt': 'terrain',
  'water1': 'water',
  'water2': 'water',
  'water3': 'water',
  'chest': 'object',
  'rock': 'object',
  'fence': 'object',
};

export function loadCustomLevel(
  scene: PhaserSceneContext,
  collisionLayer: PhaserGroup,
  levelData: LevelData
): { waterTiles: GameObject[] } {
  const waterTiles: GameObject[] = [];
  const tileSize = levelData.tileSize;

  // Clear existing map (if needed)
  // This would be called when switching levels

  // Place tiles based on level data
  Object.entries(levelData.tiles).forEach(([posKey, tileId]) => {
    const [x, y] = posKey.split(',').map(Number);
    const spriteName = TILE_TO_SPRITE_MAP[tileId];
    const tileType = TILE_TYPES[tileId];
    
    if (!spriteName) {
      console.warn(`Unknown tile ID: ${tileId}`);
      return;
    }

    // Calculate pixel position
    const pixelX = x * tileSize;
    const pixelY = y * tileSize;

    // Create the tile sprite
    const tileSprite = scene.add.image(pixelX, pixelY, spriteName);
    tileSprite.setOrigin?.(0, 0);

    // Handle different tile types
    if (tileType === 'water') {
      waterTiles.push(tileSprite);
      
      // Add water collision
      const waterCollision = scene.physics.add.sprite(
        pixelX + tileSize/2,
        pixelY + tileSize/2,
        spriteName
      );
      waterCollision.setVisible?.(false);
      waterCollision.body?.setSize(tileSize, tileSize);
      waterCollision.body?.setImmovable(true);
      collisionLayer.add(waterCollision);
    } else if (tileType === 'object') {
      // Add object collision
      const objectCollision = scene.physics.add.sprite(
        pixelX + tileSize/2,
        pixelY + tileSize/2,
        spriteName
      );
      objectCollision.setVisible?.(false);
      objectCollision.body?.setSize(tileSize, tileSize);
      objectCollision.body?.setImmovable(true);
      collisionLayer.add(objectCollision);
    }
  });

  return { waterTiles };
}

// Default level data for fallback
export const DEFAULT_LEVEL: LevelData = {
  mapWidth: GAME_CONFIG.MAP.WIDTH,
  mapHeight: GAME_CONFIG.MAP.HEIGHT,
  tileSize: GAME_CONFIG.MAP.TILE_SIZE,
  tiles: {},
  metadata: {
    name: 'Default Level',
    description: 'The default crash site level',
    created: new Date(),
    modified: new Date(),
  }
};

// Load level from localStorage
export function loadLevelFromStorage(levelName: string): LevelData | null {
  try {
    const stored = localStorage.getItem(`level_${levelName}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading level from storage:', error);
    return null;
  }
}

// Save level to localStorage
export function saveLevelToStorage(levelName: string, levelData: LevelData): void {
  try {
    localStorage.setItem(`level_${levelName}`, JSON.stringify(levelData));
  } catch (error) {
    console.error('Error saving level to storage:', error);
  }
}

// Get list of saved levels
export function getSavedLevels(): string[] {
  const levels: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('level_')) {
      levels.push(key.replace('level_', ''));
    }
  }
  return levels;
}