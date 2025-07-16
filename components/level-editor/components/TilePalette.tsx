import { memo, useEffect, useState, useRef } from 'react';
import { Tile } from '../types';
import { TilesetViewer } from './TilesetViewer';
import { loadTilesetAsync, getTilesetDefinition } from '../../utils/tileUtils';
import TilesetSelector, { TilesetOption } from './TilesetSelector';

interface TilePaletteProps {
  readonly selectedTile: Tile | null;
  readonly onTileSelect: (tile: Tile) => void;
}

const TilePalette = memo<TilePaletteProps>(({
  selectedTile,
  onTileSelect
}) => {
  const [tilesetDefinition, setTilesetDefinition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableTilesets, setAvailableTilesets] = useState<TilesetOption[]>([]);
  const [selectedTilesetId, setSelectedTilesetId] = useState('woods');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load tilesets from localStorage on mount
  useEffect(() => {
    const defaultTilesets: TilesetOption[] = [
      {
        id: 'woods',
        name: 'Woods Tileset',
        path: '/tilesets/free_pixel_16_woods.png',
        isBuiltIn: true
      }
    ];

    try {
      const savedTilesets = localStorage.getItem('levelEditor_tilesets');
      const savedSelectedId = localStorage.getItem('levelEditor_selectedTileset');
      
      if (savedTilesets) {
        const parsedTilesets = JSON.parse(savedTilesets);
        setAvailableTilesets([...defaultTilesets, ...parsedTilesets]);
      } else {
        setAvailableTilesets(defaultTilesets);
      }

      if (savedSelectedId) {
        setSelectedTilesetId(savedSelectedId);
      }
    } catch (error) {
      console.error('Failed to load saved tilesets:', error);
      setAvailableTilesets(defaultTilesets);
    }
  }, []);

  // Save tilesets to localStorage whenever they change
  useEffect(() => {
    const customTilesets = availableTilesets.filter(t => !t.isBuiltIn);
    if (customTilesets.length > 0) {
      localStorage.setItem('levelEditor_tilesets', JSON.stringify(customTilesets));
    }
    localStorage.setItem('levelEditor_selectedTileset', selectedTilesetId);
  }, [availableTilesets, selectedTilesetId]);
  
  // Load tileset when selection changes
  useEffect(() => {
    const loadTileset = async () => {
      setIsLoading(true);
      try {
        const selectedTilesetOption = availableTilesets.find(t => t.id === selectedTilesetId);
        if (!selectedTilesetOption) {
          console.warn('Selected tileset not found:', selectedTilesetId);
          return;
        }
        
        const tilesetPath = selectedTilesetOption.path;
        await loadTilesetAsync(tilesetPath, 16);
        const definition = getTilesetDefinition(tilesetPath);
        setTilesetDefinition(definition);
      } catch (error) {
        console.error('❌ Failed to load tileset:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTileset();
  }, [selectedTilesetId, availableTilesets]);
  
  const handleTilesetAdd = (path: string, name: string) => {
    const newId = `tileset_${Date.now()}`;
    const newTileset: TilesetOption = {
      id: newId,
      name,
      path,
      isBuiltIn: false
    };
    
    setAvailableTilesets(prev => [...prev, newTileset]);
    setSelectedTilesetId(newId);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      
      // Convert file to base64 for persistence
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        handleTilesetAdd(base64Data, fileName);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input
    event.target.value = '';
  };

  const handleAddTilesetClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleTilesetRemove = (tilesetId: string) => {
    const tilesetToRemove = availableTilesets.find(t => t.id === tilesetId);
    if (!tilesetToRemove || tilesetToRemove.isBuiltIn) {
      return; // Can't remove built-in tilesets
    }
    
    // No need to revoke URLs for base64 data, but keep for backwards compatibility
    if (tilesetToRemove.path.startsWith('blob:')) {
      URL.revokeObjectURL(tilesetToRemove.path);
    }
    
    setAvailableTilesets(prev => prev.filter(t => t.id !== tilesetId));
    
    // If the removed tileset was selected, switch to the first available
    if (selectedTilesetId === tilesetId) {
      const remainingTilesets = availableTilesets.filter(t => t.id !== tilesetId);
      if (remainingTilesets.length > 0) {
        setSelectedTilesetId(remainingTilesets[0].id);
      }
    }
  };


  return (
    <div className="w-96 min-w-0 bg-gray-800 border-r border-gray-700 flex flex-col h-full lg:w-96 w-full">
      {/* Header - Hidden on mobile when in overlay */}
      <div className="flex-shrink-0 p-4 lg:block hidden">
        <h2 className="text-xl font-bold mb-3">Tile Palette</h2>
        
        {/* Tileset Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Tileset:
            </label>
            <button
              onClick={handleAddTilesetClick}
              className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-700 transition-colors text-white"
            >
              + Add Tileset
            </button>
          </div>
          <TilesetSelector
            availableTilesets={availableTilesets}
            selectedTilesetId={selectedTilesetId}
            onTilesetSelect={setSelectedTilesetId}
            onTilesetAdd={handleTilesetAdd}
            onTilesetRemove={handleTilesetRemove}
          />
        </div>
      </div>
      
      {/* Mobile Tileset Selector - Only shown on mobile when in overlay */}
      <div className="flex-shrink-0 p-4 lg:hidden block">
        <h2 className="text-xl font-bold mb-3">Tile Palette</h2>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Tileset:
            </label>
            <button
              onClick={handleAddTilesetClick}
              className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-700 transition-colors text-white"
            >
              + Add Tileset
            </button>
          </div>
          <TilesetSelector
            availableTilesets={availableTilesets}
            selectedTilesetId={selectedTilesetId}
            onTilesetSelect={setSelectedTilesetId}
            onTilesetAdd={handleTilesetAdd}
            onTilesetRemove={handleTilesetRemove}
          />
        </div>
      </div>
      
      {/* Tileset Viewer */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0 flex items-center justify-center">
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
              
              onTileSelect(tile);
            }}
          />
        ) : (
          <div className="text-center text-gray-400">Failed to load tileset</div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
});

TilePalette.displayName = 'TilePalette';

export default TilePalette;