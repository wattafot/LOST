import { memo, useEffect, useState } from 'react';
import { Tile } from '../types';
import { TilesetViewer } from './TilesetViewer';
import { loadTilesetAsync, getTilesetDefinition } from '../../utils/tileUtils';

interface TilePaletteProps {
  readonly selectedTile: Tile | null;
  readonly onTileSelect: (tile: Tile) => void;
}

const TilePalette = memo<TilePaletteProps>(({
  selectedTile,
  onTileSelect
}) => {
  const [tilesetDefinition, setTilesetDefinition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load the woods tileset on mount
  useEffect(() => {
    const loadTileset = async () => {
      setIsLoading(true);
      try {
        const tilesetPath = '/tilesets/free_pixel_16_woods.png';
        await loadTilesetAsync(tilesetPath, 16);
        const definition = getTilesetDefinition(tilesetPath);
        setTilesetDefinition(definition);
        console.log('🎯 Tileset loaded and definition set:', definition);
      } catch (error) {
        console.error('❌ Failed to load tileset:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTileset();
  }, []);


  return (
    <div className="w-80 min-w-0 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4">
        <h2 className="text-xl font-bold">Tile Palette</h2>
      </div>
      
      {/* Tileset Viewer */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading tileset...</div>
        ) : tilesetDefinition ? (
          <TilesetViewer
            tilesetPath={tilesetDefinition.imagePath}
            tileWidth={tilesetDefinition.tileSize}
            tileHeight={tilesetDefinition.tileSize}
            columns={tilesetDefinition.columns}
            rows={tilesetDefinition.rows}
            selectedFrameIndex={selectedTile?.frameIndex}
            onTileSelect={(frameIndex) => {
              // Create tile from frame index
              const col = frameIndex % tilesetDefinition.columns;
              const row = Math.floor(frameIndex / tilesetDefinition.columns);
              
              const tile: Tile = {
                id: `tile_${frameIndex}`,
                name: `Tile ${row}-${col}`,
                sprite: tilesetDefinition.imagePath,
                category: 'tiles',
                color: '#808080',
                frameWidth: tilesetDefinition.tileSize,
                frameHeight: tilesetDefinition.tileSize,
                frameIndex,
                tilesetPath: tilesetDefinition.imagePath
              };
              
              console.log('🎯 Selected tile:', tile);
              onTileSelect(tile);
            }}
          />
        ) : (
          <div className="text-center text-gray-400">Failed to load tileset</div>
        )}
      </div>
    </div>
  );
});

TilePalette.displayName = 'TilePalette';

export default TilePalette;