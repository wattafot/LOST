import { memo } from 'react';
import { LevelData, Tile } from '../types';

interface StatusBarProps {
  readonly levelData: LevelData;
  readonly selectedTile: Tile | null;
  readonly isErasing: boolean;
  readonly mounted: boolean;
}

const StatusBar = memo<StatusBarProps>(({
  levelData,
  selectedTile,
  isErasing,
  mounted
}) => {
  return (
    <div className="bg-gray-800 border-t border-gray-700 p-2">
      <div className="text-sm text-gray-400">
        Mode: {isErasing ? 'Erasing' : 'Drawing'} | 
        Selected: {selectedTile?.name || 'None'} | 
        {isErasing ? 'Click to erase tiles' : 'Left click to place, Right click to erase'} | 
        Modified: {mounted ? levelData.metadata.modified.toLocaleString() : 'Loading...'}
      </div>
    </div>
  );
});

StatusBar.displayName = 'StatusBar';

export default StatusBar;