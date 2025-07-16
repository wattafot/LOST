// Debug utility to help determine correct tileset dimensions
export function createTilesetDebugger() {
  if (typeof window === 'undefined') return null;
  
  const img = new Image();
  img.src = '/tilesets/First Asset pack.png';
  
  img.onload = () => {
    console.log('=== TILESET DEBUG INFO ===');
    console.log(`Image dimensions: ${img.width}x${img.height} pixels`);
    
    // Test different tile sizes
    const testSizes = [16, 24, 32, 48, 64];
    
    testSizes.forEach(size => {
      const cols = Math.floor(img.width / size);
      const rows = Math.floor(img.height / size);
      const remainder_w = img.width % size;
      const remainder_h = img.height % size;
      
      console.log(`${size}x${size}: ${cols}x${rows} grid, remainder: ${remainder_w}x${remainder_h}`);
    });
    
    // Looking at the grass tiles specifically (right side of image)
    // If the grass tiles are in the right 1/3 of the image
    const grassWidth = Math.floor(img.width / 3);
    console.log(`\nGrass section width: ${grassWidth} pixels`);
    console.log('If grass has 4 columns:', grassWidth / 4, 'pixels per tile');
    console.log('If grass has 3 columns:', grassWidth / 3, 'pixels per tile');
    console.log('If grass has 2 columns:', grassWidth / 2, 'pixels per tile');
  };
  
  return img;
}