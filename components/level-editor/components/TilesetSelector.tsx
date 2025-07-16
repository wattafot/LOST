import { memo, useState, useEffect } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

export interface TilesetOption {
  id: string;
  name: string;
  path: string;
  isBuiltIn: boolean;
}

interface TilesetSelectorProps {
  readonly availableTilesets: readonly TilesetOption[];
  readonly selectedTilesetId: string;
  readonly onTilesetSelect: (tilesetId: string) => void;
  readonly onTilesetAdd: (path: string, name: string) => void;
  readonly onTilesetRemove: (tilesetId: string) => void;
}

const TilesetSelector = memo<TilesetSelectorProps>(({
  availableTilesets,
  selectedTilesetId,
  onTilesetSelect,
  onTilesetAdd,
  onTilesetRemove
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTilesetPath, setNewTilesetPath] = useState('');
  const [newTilesetName, setNewTilesetName] = useState('');

  const selectedTileset = availableTilesets.find(t => t.id === selectedTilesetId);

  const handleAddTileset = () => {
    if (newTilesetPath.trim() && newTilesetName.trim()) {
      onTilesetAdd(newTilesetPath.trim(), newTilesetName.trim());
      setNewTilesetPath('');
      setNewTilesetName('');
      setShowAddForm(false);
    }
  };

  const handleRemoveTileset = (e: React.MouseEvent, tilesetId: string) => {
    e.stopPropagation();
    onTilesetRemove(tilesetId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
      setShowAddForm(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full">
      {/* Current Selection */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-700 rounded border border-gray-600 text-white hover:border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
      >
        <span className="text-sm truncate">
          {selectedTileset?.name || 'Select Tileset'}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
          {/* Existing Tilesets */}
          {availableTilesets.map((tileset) => (
            <div
              key={tileset.id}
              className={`flex items-center justify-between px-3 py-2 hover:bg-gray-600 cursor-pointer ${
                tileset.id === selectedTilesetId ? 'bg-blue-600 bg-opacity-20' : ''
              }`}
              onClick={() => {
                onTilesetSelect(tileset.id);
                setIsOpen(false);
              }}
            >
              <span className="text-sm text-white truncate flex-1">
                {tileset.name}
              </span>
              {!tileset.isBuiltIn && (
                <button
                  onClick={(e) => handleRemoveTileset(e, tileset.id)}
                  className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-red-600 hover:bg-opacity-20 rounded"
                  title="Remove tileset"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}

          {/* Add New Tileset */}
          <div className="border-t border-gray-600 mt-1">
            {!showAddForm ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddForm(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-400 hover:bg-gray-600 transition-colors"
              >
                <Plus size={14} />
                Add Tileset
              </button>
            ) : (
              <div className="p-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  placeholder="Tileset name"
                  value={newTilesetName}
                  onChange={(e) => setNewTilesetName(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-gray-600 rounded border border-gray-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="/tilesets/your-tileset.png"
                  value={newTilesetPath}
                  onChange={(e) => setNewTilesetPath(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-gray-600 rounded border border-gray-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTileset}
                    disabled={!newTilesetPath.trim() || !newTilesetName.trim()}
                    className="flex-1 px-3 py-1 text-sm bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTilesetPath('');
                      setNewTilesetName('');
                    }}
                    className="flex-1 px-3 py-1 text-sm bg-gray-600 rounded hover:bg-gray-500 text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

TilesetSelector.displayName = 'TilesetSelector';

export default TilesetSelector;