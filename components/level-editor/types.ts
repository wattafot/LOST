export interface Tile {
  readonly id: string;
  readonly name: string;
  readonly sprite: string;
  readonly category: TileCategory;
  readonly color: string;
  readonly frameWidth?: number;
  readonly frameHeight?: number;
  readonly frameIndex?: number;
  readonly tilesetPath?: string;
}

export type TileCategory = 'terrain' | 'objects' | 'water' | 'decorations' | 'characters' | 'tilesets';

export interface LevelData {
  readonly width: number;
  readonly height: number;
  readonly tileSize: number;
  readonly tiles: Record<string, string>;
  readonly metadata: LevelMetadata;
}

export interface LevelMetadata {
  readonly name: string;
  readonly description: string;
  readonly created: Date;
  readonly modified: Date;
}

export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface LevelEditorState {
  readonly levelData: LevelData;
  readonly selectedTile: Tile | null;
  readonly isDrawing: boolean;
  readonly showGrid: boolean;
  readonly activeCategory: TileCategory;
  readonly zoom: number;
  readonly history: ReadonlyArray<LevelData>;
  readonly historyIndex: number;
  readonly isErasing: boolean;
  readonly mounted: boolean;
}

export interface LevelEditorActions {
  setLevelData: (data: LevelData | ((prev: LevelData) => LevelData)) => void;
  setSelectedTile: (tile: Tile | null) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setShowGrid: (showGrid: boolean) => void;
  setActiveCategory: (category: TileCategory) => void;
  setZoom: (zoom: number) => void;
  setIsErasing: (isErasing: boolean) => void;
  placeTile: (x: number, y: number, tileId: string | null) => void;
  undo: () => void;
  redo: () => void;
  clearLevel: () => void;
  saveLevel: () => void;
  loadLevel: (file: File) => Promise<void>;
  exportToGameFormat: () => void;
}

export const GRID_SIZE = 32;
export const DEFAULT_LEVEL_WIDTH = 25;
export const DEFAULT_LEVEL_HEIGHT = 19;
export const MAX_HISTORY_SIZE = 50;