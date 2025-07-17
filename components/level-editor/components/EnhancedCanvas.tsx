import { memo, useRef, useEffect, useCallback, useState } from 'react';
import { LevelData, Tile, GRID_SIZE, EntityDefinition, EntityInstance, EntityLayer } from '../types';
import EntityRenderer from './EntityRenderer';

interface EnhancedCanvasProps {
  readonly levelData: LevelData;
  readonly tiles: readonly Tile[];
  readonly showGrid: boolean;
  readonly zoom: number;
  readonly isErasing: boolean;
  readonly selectedTile: Tile | null;
  readonly onTilePlace: (x: number, y: number, tileId: string | null) => void;
  readonly onDrawingStateChange: (isDrawing: boolean) => void;
  
  // Entity-related props
  readonly isEntityMode: boolean;
  readonly entityDefinitions: readonly EntityDefinition[];
  readonly entityLayers: readonly EntityLayer[];
  readonly selectedEntityDefinition: EntityDefinition | null;
  readonly selectedEntityId: string | null;
  readonly hoveredEntityId: string | null;
  readonly selectedTool: 'select' | 'move' | 'duplicate' | 'delete';
  readonly onEntityPlace: (x: number, y: number, definitionId: string) => void;
  readonly onEntityClick: (entity: EntityInstance, layer: EntityLayer) => void;
  readonly onEntityMove: (entityId: string, x: number, y: number) => void;
  readonly onEntityMouseEnter: (entityId: string) => void;
  readonly onEntityMouseLeave: () => void;
}

const EnhancedCanvas = memo<EnhancedCanvasProps>(({
  levelData,
  tiles,
  showGrid,
  zoom,
  isErasing,
  selectedTile,
  onTilePlace,
  onDrawingStateChange,
  
  isEntityMode,
  entityDefinitions,
  entityLayers,
  selectedEntityDefinition,
  selectedEntityId,
  hoveredEntityId,
  selectedTool,
  onEntityPlace,
  onEntityClick,
  onEntityMove,
  onEntityMouseEnter,
  onEntityMouseLeave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
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
    
    if (isEntityMode) {
      // Entity mode - place entities at pixel coordinates
      const pixelX = Math.floor(canvasX / zoom);
      const pixelY = Math.floor(canvasY / zoom);
      
      if (pixelX >= 0 && pixelX < levelData.width * GRID_SIZE && 
          pixelY >= 0 && pixelY < levelData.height * GRID_SIZE) {
        
        if (selectedTool === 'select' && selectedEntityDefinition && buttonType === 'left') {
          onEntityPlace(pixelX, pixelY, selectedEntityDefinition.id);
        } else if (selectedTool === 'move' && selectedEntityId && buttonType === 'left') {
          onEntityMove(selectedEntityId, pixelX, pixelY);
        }
      }
    } else {
      // Tile mode - convert to grid coordinates
      const gridX = Math.floor(canvasX / (GRID_SIZE * zoom));
      const gridY = Math.floor(canvasY / (GRID_SIZE * zoom));
      
      if (gridX >= 0 && gridX < levelData.width && gridY >= 0 && gridY < levelData.height) {
        if (buttonType === 'right' || isErasing) {
          onTilePlace(gridX, gridY, null);
        } else if (selectedTile) {
          onTilePlace(gridX, gridY, selectedTile.id);
        }
      }
    }
  }, [
    levelData.width, 
    levelData.height, 
    zoom, 
    isErasing, 
    selectedTile, 
    onTilePlace,
    isEntityMode,
    selectedEntityDefinition,
    selectedTool,
    onEntityPlace,
    selectedEntityId,
    onEntityMove
  ]);

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
      const img = new Image();
      img.onload = () => {
        loadedImages.set(woodsTilesetPath, img);
        // Force re-render after image loads
        if (canvasRef.current) {
          const event = new Event('imageLoaded');
          canvasRef.current.dispatchEvent(event);
        }
      };
      img.onerror = () => {
        console.error('Failed to load woods tileset:', woodsTilesetPath);
      };
      img.src = woodsTilesetPath;
    }
    
    // Also load any other unique sprites from tiles
    const uniqueSprites = [...new Set(tiles.map(tile => tile.sprite))];
    uniqueSprites.forEach(spritePath => {
      if (!loadedImages.has(spritePath)) {
        const img = new Image();
        img.onload = () => {
          loadedImages.set(spritePath, img);
        };
        img.onerror = () => {
          console.error('Failed to load sprite:', spritePath);
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
      let tile = tiles.find(t => t.id === tileId);
      
      // If tile not found, try to generate it on-demand from woods tileset
      if (!tile) {
        const frameIndexMatch = tileId.match(/tile_(\d+)/);
        if (frameIndexMatch) {
          const frameIndex = parseInt(frameIndexMatch[1]);
          const woodsTilesetPath = '/tilesets/free_pixel_16_woods.png';
          
          // Create temporary tile definition
          tile = {
            id: tileId,
            name: `Tile ${Math.floor(frameIndex / 64)}-${frameIndex % 64}`,
            sprite: woodsTilesetPath,
            category: 'tiles',
            color: '#808080',
            frameWidth: 16,
            frameHeight: 16,
            frameIndex,
            tilesetPath: woodsTilesetPath
          };
        }
      }
      
      // Try to get image by tile ID first, then by sprite path
      let img = loadedImages.get(tileId);
      if (!img && tile?.sprite) {
        img = loadedImages.get(tile.sprite);
      }
      
      if (tile && img) {
        if (tile.frameWidth && tile.frameHeight) {
          // Handle sprite sheet/tileset
          const frameIndex = tile.frameIndex || 0;
          const framesPerRow = Math.floor(img.width / tile.frameWidth);
          const frameX = (frameIndex % framesPerRow) * tile.frameWidth;
          const frameY = Math.floor(frameIndex / framesPerRow) * tile.frameHeight;
          
          const renderWidth = GRID_SIZE * zoom;
          const renderHeight = GRID_SIZE * zoom;
          
          const scaleX = renderWidth / tile.frameWidth;
          const scaleY = renderHeight / tile.frameHeight;
          const scale = Math.min(scaleX, scaleY);
          const scaledWidth = tile.frameWidth * scale;
          const scaledHeight = tile.frameHeight * scale;
          
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
    <div className="flex-1 overflow-auto bg-gray-900 p-2 md:p-4 min-h-0 relative" ref={containerRef}>
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
      
      {/* Entity Renderer Overlay */}
      {isEntityMode && (
        <div className="absolute inset-0 p-2 md:p-4 pointer-events-none">
          <div className="relative w-full h-full">
            <EntityRenderer
              entityLayers={entityLayers}
              entityDefinitions={entityDefinitions}
              selectedEntityId={selectedEntityId}
              hoveredEntityId={hoveredEntityId}
              zoom={zoom}
              gridSize={GRID_SIZE}
              onEntityClick={onEntityClick}
              onEntityMouseEnter={onEntityMouseEnter}
              onEntityMouseLeave={onEntityMouseLeave}
            />
          </div>
        </div>
      )}
    </div>
  );
});

EnhancedCanvas.displayName = 'EnhancedCanvas';

export default EnhancedCanvas;