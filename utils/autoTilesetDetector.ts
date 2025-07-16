// Automatic tileset detection similar to LDtk approach
export interface TilesetDefinition {
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
  tileSize: number;
  columns: number;
  rows: number;
  padding: number;
  spacing: number;
}

export async function detectTilesetDefinition(
  imagePath: string, 
  expectedTileSize: number = 16
): Promise<TilesetDefinition> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      console.log(`📏 Auto-detecting tileset: ${imagePath}`);
      console.log(`📐 Image dimensions: ${img.width}x${img.height}`);
      
      // Calculate grid dimensions based on tile size
      const columns = Math.floor(img.width / expectedTileSize);
      const rows = Math.floor(img.height / expectedTileSize);
      
      const definition: TilesetDefinition = {
        imagePath,
        imageWidth: img.width,
        imageHeight: img.height,
        tileSize: expectedTileSize,
        columns,
        rows,
        padding: 0,
        spacing: 0
      };
      
      console.log(`🎯 Detected tileset grid: ${columns}x${rows} tiles`);
      console.log(`📊 Definition:`, definition);
      
      resolve(definition);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load tileset: ${imagePath}`));
    };
    
    img.src = imagePath;
  });
}

export function getTileSourceCoordinates(
  tileIndex: number, 
  definition: TilesetDefinition
): { x: number; y: number; width: number; height: number } {
  const col = tileIndex % definition.columns;
  const row = Math.floor(tileIndex / definition.columns);
  
  return {
    x: col * (definition.tileSize + definition.spacing) + definition.padding,
    y: row * (definition.tileSize + definition.spacing) + definition.padding,
    width: definition.tileSize,
    height: definition.tileSize
  };
}

export function generateTilesFromDefinition(definition: TilesetDefinition) {
  const tiles = [];
  const totalTiles = definition.columns * definition.rows;
  
  for (let i = 0; i < totalTiles; i++) {
    const col = i % definition.columns;
    const row = Math.floor(i / definition.columns);
    
    tiles.push({
      id: `tile_${i}`,
      name: `Tile ${row}-${col}`,
      sprite: definition.imagePath,
      category: 'tiles' as const, // Simple single category for all tiles
      color: '#808080',
      frameWidth: definition.tileSize,
      frameHeight: definition.tileSize,
      frameIndex: i,
      tilesetPath: definition.imagePath
    });
  }
  
  return tiles;
}