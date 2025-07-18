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
  readonly isMobile?: boolean;
  readonly isEntityMode?: boolean;
  readonly onToggleEntityMode?: () => void;
  readonly totalEntities?: number;
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
  onZoomChange,
  isMobile = false,
  isEntityMode = false,
  onToggleEntityMode,
  totalEntities = 0
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
        console.error('Error loading level file:', error);
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

  // Mobile layout - vertical stacking
  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {/* Level Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Level Name</label>
            <input
              type="text"
              value={levelData.metadata.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Level Size */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Level Size</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="10"
                max="50"
                value={levelData.width}
                onChange={(e) => handleSizeChange(Number(e.target.value), levelData.height)}
                className="flex-1 px-3 py-2 text-sm bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Width"
              />
              <span className="text-gray-400">×</span>
              <input
                type="number"
                min="10"
                max="50"
                value={levelData.height}
                onChange={(e) => handleSizeChange(levelData.width, Number(e.target.value))}
                className="flex-1 px-3 py-2 text-sm bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Height"
              />
            </div>
          </div>

          {/* Zoom */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Zoom: {zoom.toFixed(1)}x</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <button
                onClick={onToggleGrid}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  showGrid
                    ? 'border-blue-500 bg-blue-600 bg-opacity-20 text-white'
                    : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                }`}
              >
                {showGrid ? <Eye size={18} /> : <EyeOff size={18} />}
                <span className="text-sm font-medium">Grid</span>
              </button>
              
              <button
                onClick={onToggleEraser}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  isErasing
                    ? 'border-red-500 bg-red-600 bg-opacity-20 text-red-300'
                    : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                }`}
              >
                <Eraser size={18} />
                <span className="text-sm font-medium">Eraser</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all"
              >
                <Save size={18} />
                <span className="text-sm font-medium">Save</span>
              </button>

              <button
                onClick={handleLoadClick}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all"
              >
                <Upload size={18} />
                <span className="text-sm font-medium">Load</span>
              </button>

              <button
                onClick={onExport}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all"
              >
                <Download size={18} />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>

            <button
              onClick={onClear}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-600 hover:border-red-500 text-red-300 hover:text-red-200 transition-all"
            >
              <Trash2 size={18} />
              <span className="text-sm font-medium">Clear Level</span>
            </button>
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
  }

  // Desktop layout - horizontal
  return (
    <>
      <div className="bg-gray-800 border-b border-gray-700 px-2 py-2 h-[61px] flex items-center overflow-hidden">
        <div className="flex items-center gap-2 w-full h-full min-w-0">
          {/* Level Name */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <label className="text-xs font-medium text-gray-300">Name:</label>
            <input
              type="text"
              value={levelData.metadata.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-24 px-1 py-1 text-xs bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Level Size */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <label className="text-xs font-medium text-gray-300">Size:</label>
            <input
              type="number"
              min="10"
              max="50"
              value={levelData.width}
              onChange={(e) => handleSizeChange(Number(e.target.value), levelData.height)}
              className="w-12 px-1 py-1 text-xs bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-gray-400 text-xs">×</span>
            <input
              type="number"
              min="10"
              max="50"
              value={levelData.height}
              onChange={(e) => handleSizeChange(levelData.width, Number(e.target.value))}
              className="w-12 px-1 py-1 text-xs bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <label className="text-xs font-medium text-gray-300">Zoom:</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-gray-400 w-8 text-xs">{zoom.toFixed(1)}x</span>
          </div>

          <div className="h-4 w-px bg-gray-600"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={onSave}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-700 transition-colors"
            >
              <Save size={12} />
              Save
            </button>
            
            <button
              onClick={handleLoadClick}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              <Upload size={12} />
              Load
            </button>
            
            <button
              onClick={onExport}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 rounded hover:bg-purple-700 transition-colors"
            >
              <Download size={12} />
              Export
            </button>
          </div>
          
          <div className="h-6 w-px bg-gray-600"></div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1 text-xs bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Undo"
            >
              <Undo size={12} />
            </button>
            
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1 text-xs bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Redo"
            >
              <Redo size={12} />
            </button>
            
            <button
              onClick={onToggleEraser}
              className={`p-1 text-xs rounded transition-colors ${
                isErasing 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={isErasing ? 'Disable Eraser' : 'Enable Eraser'}
            >
              <Eraser size={12} />
            </button>

            <button
              onClick={onToggleGrid}
              className={`p-1 text-xs rounded transition-colors ${
                showGrid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={showGrid ? 'Hide Grid' : 'Show Grid'}
            >
              {showGrid ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            
            <button
              onClick={onClear}
              className="p-1 text-xs bg-red-600 rounded hover:bg-red-700 transition-colors"
              title="Clear Level"
            >
              <Trash2 size={12} />
            </button>
          </div>
          
          {/* Entity Mode Toggle */}
          {onToggleEntityMode && (
            <>
              <div className="h-6 w-px bg-gray-600"></div>
              <button
                onClick={onToggleEntityMode}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                  isEntityMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <div className="w-2 h-2 rounded border border-current flex-shrink-0" />
                Entity
                {totalEntities > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-1 py-0.5 ml-1 min-w-[14px] text-center">
                    {totalEntities}
                  </span>
                )}
              </button>
            </>
          )}
          
          <div className="ml-auto text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
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