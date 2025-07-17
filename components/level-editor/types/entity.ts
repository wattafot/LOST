// Entity System Types for LDtk-style level editor

export interface EntityField {
  id: string;
  name: string;
  type: 'string' | 'int' | 'float' | 'bool' | 'color' | 'enum' | 'point' | 'file';
  defaultValue?: any;
  min?: number;
  max?: number;
  enumValues?: string[];
  required?: boolean;
}

export interface EntityDefinition {
  id: string;
  name: string;
  color: string;
  width: number;
  height: number;
  resizable: boolean;
  keepAspectRatio: boolean;
  tileOpacity: number;
  fillOpacity: number;
  lineOpacity: number;
  hollow: boolean;
  tags: string[];
  fields: EntityField[];
  maxCount?: number; // Optional limit on instances
  showName: boolean;
  renderMode: 'Rectangle' | 'Ellipse' | 'Tile' | 'Cross';
  tilePath?: string; // For tile render mode
  tileRect?: { x: number; y: number; w: number; h: number }; // Tile source rect
}

export interface EntityInstance {
  id: string;
  definitionId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fieldValues: Record<string, any>;
  pivot: { x: number; y: number }; // 0-1 normalized coordinates
}

export interface EntityLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  gridSize: number;
  entities: EntityInstance[];
  autoLayerRuleGroups?: any[]; // For future auto-layer functionality
}

// Default entity definitions similar to LDtk
export const DEFAULT_ENTITY_DEFINITIONS: EntityDefinition[] = [
  {
    id: 'player_spawn',
    name: 'Player Spawn',
    color: '#00ff00',
    width: 16,
    height: 16,
    resizable: false,
    keepAspectRatio: true,
    tileOpacity: 1,
    fillOpacity: 1,
    lineOpacity: 1,
    hollow: false,
    tags: ['spawn', 'player'],
    fields: [
      {
        id: 'facing_direction',
        name: 'Facing Direction',
        type: 'enum',
        enumValues: ['left', 'right', 'up', 'down'],
        defaultValue: 'right',
        required: true
      }
    ],
    showName: true,
    renderMode: 'Rectangle'
  },
  {
    id: 'enemy_spawn',
    name: 'Enemy Spawn',
    color: '#ff0000',
    width: 16,
    height: 16,
    resizable: false,
    keepAspectRatio: true,
    tileOpacity: 1,
    fillOpacity: 0.7,
    lineOpacity: 1,
    hollow: false,
    tags: ['spawn', 'enemy'],
    fields: [
      {
        id: 'enemy_type',
        name: 'Enemy Type',
        type: 'enum',
        enumValues: ['goblin', 'orc', 'skeleton', 'dragon'],
        defaultValue: 'goblin',
        required: true
      },
      {
        id: 'health',
        name: 'Health',
        type: 'int',
        min: 1,
        max: 1000,
        defaultValue: 100,
        required: true
      },
      {
        id: 'patrol_distance',
        name: 'Patrol Distance',
        type: 'float',
        min: 0,
        max: 200,
        defaultValue: 50,
        required: false
      }
    ],
    showName: true,
    renderMode: 'Rectangle'
  },
  {
    id: 'item_pickup',
    name: 'Item Pickup',
    color: '#ffff00',
    width: 12,
    height: 12,
    resizable: false,
    keepAspectRatio: true,
    tileOpacity: 1,
    fillOpacity: 0.8,
    lineOpacity: 1,
    hollow: false,
    tags: ['item', 'pickup'],
    fields: [
      {
        id: 'item_type',
        name: 'Item Type',
        type: 'enum',
        enumValues: ['coin', 'health_potion', 'key', 'weapon', 'armor'],
        defaultValue: 'coin',
        required: true
      },
      {
        id: 'value',
        name: 'Value',
        type: 'int',
        min: 1,
        max: 9999,
        defaultValue: 10,
        required: true
      },
      {
        id: 'respawns',
        name: 'Respawns',
        type: 'bool',
        defaultValue: false,
        required: false
      }
    ],
    showName: true,
    renderMode: 'Ellipse'
  },
  {
    id: 'trigger_zone',
    name: 'Trigger Zone',
    color: '#0080ff',
    width: 32,
    height: 32,
    resizable: true,
    keepAspectRatio: false,
    tileOpacity: 0.3,
    fillOpacity: 0.3,
    lineOpacity: 1,
    hollow: true,
    tags: ['trigger', 'zone'],
    fields: [
      {
        id: 'trigger_type',
        name: 'Trigger Type',
        type: 'enum',
        enumValues: ['level_exit', 'cutscene', 'dialogue', 'save_point'],
        defaultValue: 'level_exit',
        required: true
      },
      {
        id: 'target_level',
        name: 'Target Level',
        type: 'string',
        defaultValue: '',
        required: false
      },
      {
        id: 'message',
        name: 'Message',
        type: 'string',
        defaultValue: '',
        required: false
      }
    ],
    showName: true,
    renderMode: 'Rectangle'
  }
];