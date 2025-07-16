import { memo, useRef } from 'react';
import { Save, Download, Upload, Trash2, Eye, EyeOff, Undo, Redo, Eraser } from 'lucide-react';
import { LevelData } from '../types';

interface ToolbarProps {
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly isErasing: boolean;
  readonly showGrid: boolean;
  readonly levelData: LevelData;
  readonly zoom: number;
  readonly onSave: () => void;
  readonly onLoad: (file: File) => Promise<void>;
  readonly onExport: () => void;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
  readonly onToggleEraser: () => void;
  readonly onToggleGrid: () => void;
  readonly onClear: () => void;
  readonly onLevelDataChange: (data: LevelData | ((prev: LevelData) => LevelData)) => void;
  readonly onZoomChange: (zoom: number) => void;
}

const Toolbar = memo<ToolbarProps>(({
  canUndo,
  canRedo,
  isErasing,
  showGrid,
  levelData,
  zoom,
  onSave,
  onLoad,
  onExport,
  onUndo,
  onRedo,
  onToggleEraser,
  onToggleGrid,
  onClear,
  onLevelDataChange,
  onZoomChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await onLoad(file);
      } catch (error) {
        alert('Error loading level file');
      }
    }
    // Reset the input value to allow loading the same file again
    event.target.value = '';
  };

  const handleNameChange = (name: string) => {
    onLevelDataChange(prev => ({
      ...prev,
      metadata: { ...prev.metadata, name }
    }));
  };

  const handleSizeChange = (width: number, height: number) => {
    onLevelDataChange(prev => ({
      ...prev,
      width: Math.max(10, Math.min(50, width)),
      height: Math.max(10, Math.min(50, height))
    }));
  };

  return (
    <>
      <div className="bg-gray-800 border-b border-gray-700 p-3">
        <div className="flex items-center gap-4">
          {/* Level Name */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-300">Name:</label>
            <input
              type="text"
              value={levelData.metadata.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-32 px-2 py-1 text-sm bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Level Size */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-300">Size:</label>
            <input
              type="number"
              min="10"
              max="50"
              value={levelData.width}
              onChange={(e) => handleSizeChange(Number(e.target.value), levelData.height)}
              className="w-16 px-2 py-1 text-sm bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-400">×</span>
            <input
              type="number"
              min="10"
              max="50"
              value={levelData.height}
              onChange={(e) => handleSizeChange(levelData.width, Number(e.target.value))}
              className="w-16 px-2 py-1 text-sm bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-300">Zoom:</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-400 w-12">{zoom.toFixed(1)}x</span>
          </div>

          <div className="h-4 w-px bg-gray-600"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-green-600 rounded hover:bg-green-700 transition-colors"
            >
              <Save size={14} />
              Save
            </button>
            
            <button
              onClick={handleLoadClick}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              <Upload size={14} />
              Load
            </button>
            
            <button
              onClick={onExport}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-purple-600 rounded hover:bg-purple-700 transition-colors"
            >
              <Download size={14} />
              Export
            </button>
          </div>
          
          <div className="h-4 w-px bg-gray-600"></div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Undo"
            >
              <Undo size={14} />
            </button>
            
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Redo"
            >
              <Redo size={14} />
            </button>
            
            <button
              onClick={onToggleEraser}
              className={`flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${
                isErasing 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={isErasing ? 'Disable Eraser' : 'Enable Eraser'}
            >
              <Eraser size={14} />
            </button>

            <button
              onClick={onToggleGrid}
              className={`flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${
                showGrid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={showGrid ? 'Hide Grid' : 'Show Grid'}
            >
              {showGrid ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>
          
          <div className="ml-auto text-sm text-gray-400">
            Tiles: {Object.keys(levelData.tiles).length}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
});

Toolbar.displayName = 'Toolbar';

export default Toolbar;