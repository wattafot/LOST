interface TilesetConfig {
  imagePath: string;
  tileWidth: number;
  tileHeight: number;
  margin?: number;
  spacing?: number;
  columns?: number;
  rows?: number;
}

interface SlicedTile {
  id: string;
  name: string;
  sprite: string;
  category: 'tilesets';
  color: string;
  frameWidth: number;
  frameHeight: number;
  frameIndex: number;
  tilesetPath: string;
}

export function sliceTileset(config: TilesetConfig, category: 'tilesets', namePrefix: string): SlicedTile[] {
  const {
    imagePath,
    tileWidth,
    tileHeight,
    margin = 0,
    spacing = 0,
    columns,
    rows
  } = config;

  const tiles: SlicedTile[] = [];
  
  // Use the provided columns/rows
  const maxColumns = columns || 8;
  const maxRows = rows || 8;
  
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxColumns; col++) {
      const frameIndex = row * maxColumns + col;
      const tileId = `${namePrefix}_${row}_${col}`;
      
      tiles.push({
        id: tileId,
        name: `${namePrefix} ${row}-${col}`,
        sprite: imagePath,
        category,
        color: getDefaultColorForCategory(category),
        frameWidth: tileWidth,
        frameHeight: tileHeight,
        frameIndex,
        tilesetPath: imagePath
      });
    }
  }
  
  return tiles;
}

// Auto-detect tileset dimensions (for future use)
export function detectTilesetDimensions(imagePath: string, tileWidth: number, tileHeight: number): Promise<{columns: number, rows: number, imageWidth: number, imageHeight: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const columns = Math.floor(img.width / tileWidth);
      const rows = Math.floor(img.height / tileHeight);
      resolve({
        columns,
        rows,
        imageWidth: img.width,
        imageHeight: img.height
      });
    };
    img.onerror = reject;
    img.src = imagePath;
  });
}

function getDefaultColorForCategory(category: string): string {
  switch (category) {
    case 'terrain': return '#32CD32';
    case 'water': return '#4682B4';
    case 'objects': return '#8B4513';
    case 'decorations': return '#228B22';
    case 'characters': return '#FFA500';
    case 'tilesets': return '#9932CC';
    default: return '#808080';
  }
}

// Predefined tileset configurations
export const TILESET_CONFIGS: { [key: string]: TilesetConfig } = {
  firstAssetPack: {
    imagePath: '/tilesets/First Asset pack.png',
    tileWidth: 64, // Based on image analysis - appears to be 64x64 tiles
    tileHeight: 64,
    margin: 0,
    spacing: 0,
    columns: 6, // 6 columns based on the visible grid
    rows: 6  // 6 rows based on the visible grid
  },
  woodsTileset: {
    imagePath: '/tilesets/free_pixel_16_woods.png',
    tileWidth: 16, // Correct 16x16 pixel tiles as specified
    tileHeight: 16,
    margin: 0,
    spacing: 0,
    columns: 4, // 4 columns visible in the woods tileset
    rows: 3   // 3 rows visible in the woods tileset
  }
};

// Generate all tileset tiles
export function generateTilesetTiles(): SlicedTile[] {
  const allTiles: SlicedTile[] = [];
  
  // First Asset Pack
  allTiles.push(...sliceTileset(
    TILESET_CONFIGS.firstAssetPack,
    'tilesets',
    'Asset'
  ));
  
  // Woods Tileset
  allTiles.push(...sliceTileset(
    TILESET_CONFIGS.woodsTileset,
    'tilesets',
    'Woods'
  ));
  
  return allTiles;
}