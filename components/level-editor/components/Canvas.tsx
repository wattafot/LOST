import { memo, useRef, useEffect, useCallback } from 'react';
import { LevelData, Tile, GRID_SIZE } from '../types';

interface CanvasProps {
  readonly levelData: LevelData;
  readonly tiles: readonly Tile[];
  readonly showGrid: boolean;
  readonly zoom: number;
  readonly isErasing: boolean;
  readonly selectedTile: Tile | null;
  readonly onTilePlace: (x: number, y: number, tileId: string | null) => void;
  readonly onDrawingStateChange: (isDrawing: boolean) => void;
}

const Canvas = memo<CanvasProps>(({
  levelData,
  tiles,
  showGrid,
  zoom,
  isErasing,
  selectedTile,
  onTilePlace,
  onDrawingStateChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Convert tile key to grid position
  const keyToPosition = useCallback((key: string) => {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  }, []);

  // Handle canvas interactions
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (GRID_SIZE * zoom));
    const y = Math.floor((e.clientY - rect.top) / (GRID_SIZE * zoom));
    
    if (x >= 0 && x < levelData.width && y >= 0 && y < levelData.height) {
      if (e.button === 2 || isErasing) {
        onTilePlace(x, y, null);
      } else if (selectedTile) {
        onTilePlace(x, y, selectedTile.id);
      }
    }
  }, [levelData.width, levelData.height, zoom, isErasing, selectedTile, onTilePlace]);

  // Preload images for canvas rendering
  useEffect(() => {
    const loadedImages = loadedImagesRef.current;
    
    tiles.forEach(tile => {
      if (!loadedImages.has(tile.id)) {
        const img = new Image();
        img.onload = () => {
          loadedImages.set(tile.id, img);
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
            fallbackCtx.fillText(tile.name.charAt(0), GRID_SIZE / 2, GRID_SIZE / 2 + 4);
          }
          const fallbackImg = new Image();
          fallbackImg.src = fallbackCanvas.toDataURL();
          loadedImages.set(tile.id, fallbackImg);
        };
        img.src = tile.sprite;
      }
    });
  }, [tiles]);

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
    const loadedImages = loadedImagesRef.current;
    Object.entries(levelData.tiles).forEach(([key, tileId]) => {
      const { x, y } = keyToPosition(key);
      const tile = tiles.find(t => t.id === tileId);
      const img = loadedImages.get(tileId);
      
      if (tile && img) {
        if (tile.frameWidth && tile.frameHeight) {
          // Handle sprite sheet/tileset
          const frameIndex = tile.frameIndex || 0;
          const framesPerRow = Math.floor(img.width / tile.frameWidth);
          const frameX = (frameIndex % framesPerRow) * tile.frameWidth;
          const frameY = Math.floor(frameIndex / framesPerRow) * tile.frameHeight;
          
          // For tilesets, we need to maintain aspect ratio and scale properly
          const renderWidth = GRID_SIZE * zoom;
          const renderHeight = GRID_SIZE * zoom;
          
          // If the tile is smaller than the grid, we need to scale it up
          // If the tile is larger than the grid, we need to scale it down
          const scaleX = renderWidth / tile.frameWidth;
          const scaleY = renderHeight / tile.frameHeight;
          
          // Use the smaller scale to maintain aspect ratio
          const scale = Math.min(scaleX, scaleY);
          const scaledWidth = tile.frameWidth * scale;
          const scaledHeight = tile.frameHeight * scale;
          
          // Center the tile in the grid cell
          const offsetX = (renderWidth - scaledWidth) / 2;
          const offsetY = (renderHeight - scaledHeight) / 2;
          
          ctx.drawImage(
            img,
            frameX, frameY, tile.frameWidth, tile.frameHeight,
            x * GRID_SIZE * zoom + offsetX,
            y * GRID_SIZE * zoom + offsetY,
            scaledWidth,
            scaledHeight
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
        // Fallback to colored rectangle
        ctx.fillStyle = tile.color;
        ctx.fillRect(
          x * GRID_SIZE * zoom,
          y * GRID_SIZE * zoom,
          GRID_SIZE * zoom,
          GRID_SIZE * zoom
        );
        
        // Add tile label
        ctx.fillStyle = '#ffffff';
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
  }, [levelData, showGrid, zoom, tiles, keyToPosition]);

  return (
    <div className="flex-1 overflow-auto bg-gray-900 p-4 min-h-0">
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => {
          onDrawingStateChange(true);
          handleCanvasClick(e);
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1) { // Left mouse button is pressed
            handleCanvasClick(e);
          }
        }}
        onMouseUp={() => onDrawingStateChange(false)}
        onMouseLeave={() => onDrawingStateChange(false)}
        onContextMenu={(e) => e.preventDefault()}
        className="border border-gray-600 cursor-crosshair"
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;