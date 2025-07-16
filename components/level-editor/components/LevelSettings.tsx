import { memo } from 'react';
import { LevelData } from '../types';

interface LevelSettingsProps {
  readonly levelData: LevelData;
  readonly zoom: number;
  readonly onLevelDataChange: (data: LevelData | ((prev: LevelData) => LevelData)) => void;
  readonly onZoomChange: (zoom: number) => void;
}

const LevelSettings = memo<LevelSettingsProps>(({
  levelData,
  zoom: _zoom,
  onLevelDataChange,
  onZoomChange: _onZoomChange
}) => {
  const handleSizeChange = (width: number, height: number) => {
    onLevelDataChange(prev => ({
      ...prev,
      width: Math.max(10, Math.min(50, width)),
      height: Math.max(10, Math.min(50, height))
    }));
  };

  return (
    <div className="border-t border-gray-700 p-4">
      <div className="space-y-4">
        {/* Level Dimensions */}
        <div>
          <label className="block text-sm font-medium mb-2">Level Size</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="10"
              max="50"
              value={levelData.width}
              onChange={(e) => handleSizeChange(Number(e.target.value), levelData.height)}
              className="w-20 p-2 bg-gray-700 rounded border border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-400">×</span>
            <input
              type="number"
              min="10"
              max="50"
              value={levelData.height}
              onChange={(e) => handleSizeChange(levelData.width, Number(e.target.value))}
              className="w-20 p-2 bg-gray-700 rounded border border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-400">tiles</span>
          </div>
        </div>

        {/* Level Stats */}
        <div className="pt-2 border-t border-gray-600">
          <div className="text-xs text-gray-400">
            <div>Tiles placed: {Object.keys(levelData.tiles).length}</div>
            <div>Last modified: {levelData.metadata.modified.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

LevelSettings.displayName = 'LevelSettings';

export default LevelSettings;