import { memo, useMemo } from 'react';
import { Mountain, Waves, Package, Sparkles, Users, Grid3X3 } from 'lucide-react';
import { Tile, TileCategory, LevelData } from '../types';
import SpriteImage from './SpriteImage';

interface TilePaletteProps {
  readonly tiles: readonly Tile[];
  readonly selectedTile: Tile | null;
  readonly activeCategory: TileCategory;
  readonly levelData: LevelData;
  readonly zoom: number;
  readonly onTileSelect: (tile: Tile) => void;
  readonly onCategoryChange: (category: TileCategory) => void;
  readonly onLevelDataChange: (data: LevelData | ((prev: LevelData) => LevelData)) => void;
  readonly onZoomChange: (zoom: number) => void;
}

const TilePalette = memo<TilePaletteProps>(({
  tiles,
  selectedTile,
  activeCategory,
  levelData,
  zoom,
  onTileSelect,
  onCategoryChange,
  onLevelDataChange,
  onZoomChange
}) => {
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(tiles.map(tile => tile.category))];
    return uniqueCategories.sort();
  }, [tiles]);

  const tilesByCategory = useMemo(() => {
    return tiles.filter(tile => tile.category === activeCategory);
  }, [tiles, activeCategory]);

  const getCategoryIcon = (category: TileCategory) => {
    switch (category) {
      case 'terrain': return <Mountain size={16} />;
      case 'water': return <Waves size={16} />;
      case 'objects': return <Package size={16} />;
      case 'decorations': return <Sparkles size={16} />;
      case 'characters': return <Users size={16} />;
      case 'tilesets': return <Grid3X3 size={16} />;
      default: return <Package size={16} />;
    }
  };

  const handleNameChange = (name: string) => {
    onLevelDataChange(prev => ({
      ...prev,
      metadata: { ...prev.metadata, name }
    }));
  };

  return (
    <div className="w-80 min-w-0 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Tile Palette</h2>
      </div>
      
      {/* Category Selection */}
      <div className="flex-shrink-0 border-b border-gray-700 p-3">
        <div className="grid grid-cols-3 gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`p-2 rounded border-2 transition-all text-sm font-medium capitalize ${
                activeCategory === category
                  ? 'border-blue-500 bg-blue-600 bg-opacity-20 text-white'
                  : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="text-gray-300">
                  {getCategoryIcon(category)}
                </div>
                <div className="text-xs">{category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Tile Grid - Takes remaining space and scrolls */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="grid grid-cols-2 gap-3">
          {tilesByCategory.map(tile => (
            <button
              key={tile.id}
              onClick={() => onTileSelect(tile)}
              className={`p-3 rounded border-2 transition-all ${
                selectedTile?.id === tile.id
                  ? 'border-blue-500 bg-blue-600 bg-opacity-20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="w-full h-16 rounded mb-2 flex items-center justify-center bg-gray-800">
                <SpriteImage tile={tile} size={48} />
              </div>
              <div className="text-xs text-center text-white font-medium">{tile.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

TilePalette.displayName = 'TilePalette';

export default TilePalette;