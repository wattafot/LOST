// Debug utility to analyze tileset dimensions
export function analyzeTileset(imagePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      console.log(`=== TILESET ANALYSIS: ${imagePath} ===`);
      console.log(`Image dimensions: ${img.width}x${img.height}`);
      
      // Test different tile sizes
      const possibleTileSizes = [16, 32, 48, 64, 96, 128];
      
      console.log('Possible tile configurations:');
      possibleTileSizes.forEach(size => {
        const columns = Math.floor(img.width / size);
        const rows = Math.floor(img.height / size);
        const totalTiles = columns * rows;
        
        if (columns > 0 && rows > 0) {
          console.log(`  ${size}x${size} tiles: ${columns}x${rows} grid = ${totalTiles} tiles`);
        }
      });
      
      console.log('===============================');
      resolve();
    };
    img.onerror = reject;
    img.src = imagePath;
  });
}

// Analyze both tilesets
export async function analyzeAllTilesets(): Promise<void> {
  try {
    await analyzeTileset('/tilesets/First Asset pack.png');
    await analyzeTileset('/tilesets/free_pixel_16_woods.png');
  } catch (error) {
    console.error('Error analyzing tilesets:', error);
  }
}