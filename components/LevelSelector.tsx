"use client";

import { useState } from "react";
import { Upload, Play, Trash2 } from "lucide-react";

interface Level {
  name: string;
  description: string;
  width: number;
  height: number;
  tileCount: number;
  created: Date;
  modified: Date;
}

interface LevelSelectorProps {
  onLevelSelect: (levelData: any) => void;
  onClose: () => void;
}

export default function LevelSelector({ onLevelSelect, onClose }: LevelSelectorProps) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load custom level from file
  const loadLevelFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const levelData = JSON.parse(e.target?.result as string);
          
          // Validate level data
          if (!levelData.mapWidth || !levelData.mapHeight || !levelData.tiles) {
            alert('Invalid level file format');
            return;
          }

          onLevelSelect(levelData);
          onClose();
        } catch {
          alert('Error loading level file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Load default level
  const loadDefaultLevel = () => {
    const defaultLevel = {
      mapWidth: 25,
      mapHeight: 19,
      tileSize: 32,
      tiles: {
        // Create a simple default level with some grass and water
        "5,5": "grass",
        "6,5": "grass",
        "7,5": "grass",
        "5,6": "grass",
        "6,6": "grass",
        "7,6": "grass",
        "10,10": "water1",
        "11,10": "water1",
        "12,10": "water1",
        "10,11": "water1",
        "11,11": "water1",
        "12,11": "water1",
        "15,8": "chest",
        "20,12": "rock",
      },
      metadata: {
        name: "Default Level",
        description: "A simple test level",
        created: new Date(),
        modified: new Date(),
      }
    };
    onLevelSelect(defaultLevel);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Load Custom Level</h2>
        
        <div className="space-y-4">
          <div className="text-gray-300 text-sm">
            Choose a level to load into the game. You can create custom levels using the Level Editor.
          </div>
          
          {/* Load from file */}
          <button
            onClick={loadLevelFromFile}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Upload size={20} />
            Load Level from File
          </button>
          
          {/* Load default level */}
          <button
            onClick={loadDefaultLevel}
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Play size={20} />
            Load Sample Level
          </button>
          
          {/* Level Editor Link */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Need to create a level?</p>
            <a
              href="/level-editor"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Open Level Editor
            </a>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}