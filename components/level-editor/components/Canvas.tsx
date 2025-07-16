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

  // Handle canvas interactions with improved coordinate calculation
  const handleCanvasInteraction = useCallback((clientX: number, clientY: number, buttonType: 'left' | 'right' = 'left') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Calculate relative position within canvas
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;
    
    // Get canvas actual size vs display size for proper scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Apply scaling to get canvas pixel coordinates
    const canvasX = relativeX * scaleX;
    const canvasY = relativeY * scaleY;
    
    // Convert to grid coordinates
    const gridX = Math.floor(canvasX / (GRID_SIZE * zoom));
    const gridY = Math.floor(canvasY / (GRID_SIZE * zoom));
    
    if (gridX >= 0 && gridX < levelData.width && gridY >= 0 && gridY < levelData.height) {
      if (buttonType === 'right' || isErasing) {
        onTilePlace(gridX, gridY, null);
      } else if (selectedTile) {
        onTilePlace(gridX, gridY, selectedTile.id);
      }
    }
  }, [levelData.width, levelData.height, zoom, isErasing, selectedTile, onTilePlace]);

  // Handle mouse clicks
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const buttonType = e.button === 2 ? 'right' : 'left';
    handleCanvasInteraction(e.clientX, e.clientY, buttonType);
  }, [handleCanvasInteraction]);

  // Preload tileset images for canvas rendering
  useEffect(() => {
    const loadedImages = loadedImagesRef.current;
    
    // Always ensure the woods tileset is loaded
    const woodsTilesetPath = '/tilesets/free_pixel_16_woods.png';
    if (!loadedImages.has(woodsTilesetPath)) {
      console.log('🔄 Loading woods tileset:', woodsTilesetPath);
      const img = new Image();
      img.onload = () => {
        console.log('✅ Woods tileset loaded successfully:', img.width, 'x', img.height);
        loadedImages.set(woodsTilesetPath, img);
        // Force re-render after image loads
        if (canvasRef.current) {
          const event = new Event('imageLoaded');
          canvasRef.current.dispatchEvent(event);
        }
      };
      img.onerror = () => {
        console.error('❌ Failed to load woods tileset:', woodsTilesetPath);
      };
      img.src = woodsTilesetPath;
    }
    
    // Also load any other unique sprites from tiles
    const uniqueSprites = [...new Set(tiles.map(tile => tile.sprite))];
    uniqueSprites.forEach(spritePath => {
      if (!loadedImages.has(spritePath)) {
        console.log('🔄 Loading sprite:', spritePath);
        const img = new Image();
        img.onload = () => {
          console.log('✅ Sprite loaded:', spritePath);
          loadedImages.set(spritePath, img);
        };
        img.onerror = () => {
          console.error('❌ Failed to load sprite:', spritePath);
        };
        img.src = spritePath;
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
    const canvasWidth = levelData.width * GRID_SIZE * zoom;
    const canvasHeight = levelData.height * GRID_SIZE * zoom;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // On smaller screens, we need to scale the canvas display size while keeping the internal resolution
    const containerWidth = canvas.parentElement?.clientWidth || canvasWidth;
    const maxDisplayWidth = Math.min(containerWidth - 32, canvasWidth); // 32px for padding
    const displayScale = maxDisplayWidth / canvasWidth;
    
    if (displayScale < 1) {
      canvas.style.width = `${maxDisplayWidth}px`;
      canvas.style.height = `${canvasHeight * displayScale}px`;
    } else {
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
    }
    
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
      
      // Try to get image by tile ID first, then by sprite path
      let img = loadedImages.get(tileId);
      if (!img && tile?.sprite) {
        img = loadedImages.get(tile.sprite);
      }
      
      console.log(`🎨 CANVAS RENDER DEBUG - Tile ${tileId}:`, {
        tileFound: !!tile,
        imgFound: !!img,
        sprite: tile?.sprite,
        frameIndex: tile?.frameIndex,
        loadedImagesKeys: Array.from(loadedImages.keys())
      });
      
      if (tile && img) {
        if (tile.frameWidth && tile.frameHeight) {
          // Handle sprite sheet/tileset
          const frameIndex = tile.frameIndex || 0;
          // Calculate frames per row based on image width and tile width
          const framesPerRow = Math.floor(img.width / tile.frameWidth);
          const frameX = (frameIndex % framesPerRow) * tile.frameWidth;
          const frameY = Math.floor(frameIndex / framesPerRow) * tile.frameHeight;
          
          // Debug logging (remove in production)
          console.log(`🎨 CANVAS DEBUG - Drawing tile ${tile.name}:`, {
            frameIndex,
            frameX,
            frameY,
            frameWidth: tile.frameWidth,
            frameHeight: tile.frameHeight,
            imgWidth: img.width,
            imgHeight: img.height,
            position: { x, y }
          });
          
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

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    onDrawingStateChange(true);
    const touch = e.touches[0];
    if (touch) {
      handleCanvasInteraction(touch.clientX, touch.clientY, 'left');
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleCanvasInteraction(touch.clientX, touch.clientY, 'left');
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    onDrawingStateChange(false);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-900 p-2 md:p-4 min-h-0">
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => e.preventDefault()}
        className="border border-gray-600 cursor-crosshair touch-manipulation max-w-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;