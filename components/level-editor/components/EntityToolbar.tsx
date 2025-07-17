import { memo } from 'react';
import { Mouse, Move, Copy, Trash2, Edit3, Layers, Settings, Eye, EyeOff } from 'lucide-react';
import { EntityDefinition, EntityLayer } from '../types/entity';

interface EntityToolbarProps {
  readonly isEntityMode: boolean;
  readonly selectedEntityDefinition: EntityDefinition | null;
  readonly selectedLayerId: string | null;
  readonly selectedEntityId: string | null;
  readonly entityLayers: readonly EntityLayer[];
  readonly onToggleEntityMode: () => void;
  readonly onSelectTool: (tool: 'select' | 'move' | 'duplicate' | 'delete') => void;
  readonly onOpenDefinitionManager: () => void;
  readonly onOpenLayerManager: () => void;
  readonly onEditSelectedEntity: () => void;
  readonly onToggleLayerVisibility: (layerId: string) => void;
  readonly onClearAllEntities: () => void;
  readonly selectedTool: 'select' | 'move' | 'duplicate' | 'delete';
}

const EntityToolbar = memo<EntityToolbarProps>(({
  isEntityMode,
  selectedEntityDefinition,
  selectedLayerId,
  selectedEntityId,
  entityLayers,
  onToggleEntityMode,
  onSelectTool,
  onOpenDefinitionManager,
  onOpenLayerManager,
  onEditSelectedEntity,
  onToggleLayerVisibility,
  onClearAllEntities,
  selectedTool
}) => {
  const selectedLayer = entityLayers.find(layer => layer.id === selectedLayerId);
  const totalEntities = entityLayers.reduce((sum, layer) => sum + layer.entities.length, 0);

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 h-12 flex items-center gap-4">
      {/* Tool Icons Only */}
      <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onSelectTool('select')}
              className={`p-2 rounded transition-colors ${
                selectedTool === 'select'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
              title="Select Tool (Place & Select entities)"
            >
              <Mouse size={16} />
            </button>
            
            <button
              onClick={() => onSelectTool('move')}
              className={`p-2 rounded transition-colors ${
                selectedTool === 'move'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
              title="Move Tool"
            >
              <Move size={16} />
            </button>
            
            <button
              onClick={() => onSelectTool('duplicate')}
              className={`p-2 rounded transition-colors ${
                selectedTool === 'duplicate'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
              title="Duplicate Tool"
            >
              <Copy size={16} />
            </button>
            
            <button
              onClick={() => onSelectTool('delete')}
              className={`p-2 rounded transition-colors ${
                selectedTool === 'delete'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
              title="Delete Tool"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Current Entity Type (if placing) */}
          {selectedEntityDefinition && (
            <>
              <div className="h-4 w-px bg-gray-600" />
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="w-3 h-3 rounded border border-gray-400 flex-shrink-0"
                  style={{ backgroundColor: selectedEntityDefinition.color }}
                />
                <span className="text-sm text-white font-medium whitespace-nowrap">
                  {selectedEntityDefinition.name}
                </span>
              </div>
            </>
          )}

          {/* Management Buttons */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            {totalEntities > 0 && (
              <button
                onClick={onClearAllEntities}
                className="p-2 bg-red-700 rounded hover:bg-red-600 transition-colors text-red-300 hover:text-red-200"
                title="Clear All Entities"
              >
                <Trash2 size={16} />
              </button>
            )}
            
            <button
              onClick={onOpenLayerManager}
              className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
              title="Manage Layers"
            >
              <Layers size={16} />
            </button>
            
            <button
              onClick={onOpenDefinitionManager}
              className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
              title="Manage Entity Definitions"
            >
              <Settings size={16} />
            </button>
          </div>
    </div>
  );
});

EntityToolbar.displayName = 'EntityToolbar';

export default EntityToolbar;