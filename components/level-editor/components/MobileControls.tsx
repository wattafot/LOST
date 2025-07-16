import { memo } from 'react';
import { Menu, Grid3X3, Eraser, Undo, Redo } from 'lucide-react';
import { Tile } from '../types';

interface MobileControlsProps {
  readonly selectedTile: Tile | null;
  readonly isErasing: boolean;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly isTilePaletteOpen: boolean;
  readonly isMobileMenuOpen: boolean;
  readonly onToggleTilePalette: () => void;
  readonly onToggleMobileMenu: () => void;
  readonly onToggleEraser: () => void;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
}

const MobileControls = memo<MobileControlsProps>(({
  selectedTile,
  isErasing,
  canUndo,
  canRedo,
  isTilePaletteOpen,
  isMobileMenuOpen,
  onToggleTilePalette,
  onToggleMobileMenu,
  onToggleEraser,
  onUndo,
  onRedo
}) => {
  return (
    <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700 px-3 py-2">
      <div className="flex items-center gap-3">
        {/* All buttons aligned to left */}
        
        {/* Tile Palette Toggle */}
        <button
          onClick={onToggleTilePalette}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            isTilePaletteOpen
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
          }`}
          aria-label="Toggle tile palette"
        >
          <Grid3X3 size={18} />
        </button>

        {/* Selected Tile Preview */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
            {selectedTile ? (
              <div 
                className="w-6 h-6 rounded"
                style={{ backgroundColor: selectedTile.color }}
                title={selectedTile.name}
              />
            ) : (
              <span className="text-gray-500 text-xs">?</span>
            )}
          </div>
          {selectedTile && (
            <span className="text-xs text-gray-400 max-w-20 truncate">
              {selectedTile.name}
            </span>
          )}
        </div>

        {/* Eraser */}
        <button
          onClick={onToggleEraser}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            isErasing
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
          }`}
          aria-label="Toggle eraser"
        >
          <Eraser size={18} />
        </button>

        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            canUndo
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
          aria-label="Undo"
        >
          <Undo size={18} />
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            canRedo
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
          aria-label="Redo"
        >
          <Redo size={18} />
        </button>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Menu */}
        <button
          onClick={onToggleMobileMenu}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            isMobileMenuOpen
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
          }`}
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>
      </div>
    </div>
  );
});

MobileControls.displayName = 'MobileControls';

export default MobileControls;