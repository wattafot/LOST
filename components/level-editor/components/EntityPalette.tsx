import { memo, useState } from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { EntityDefinition, EntityLayer } from '../types/entity';

interface EntityPaletteProps {
  readonly entityDefinitions: readonly EntityDefinition[];
  readonly entityLayers: readonly EntityLayer[];
  readonly selectedEntityDefinition: EntityDefinition | null;
  readonly selectedLayerId: string | null;
  readonly onEntityDefinitionSelect: (definition: EntityDefinition | null) => void;
  readonly onLayerSelect: (layerId: string | null) => void;
  readonly onLayerToggleVisibility: (layerId: string) => void;
  readonly onOpenDefinitionManager: () => void;
}

const EntityPalette = memo<EntityPaletteProps>(({
  entityDefinitions,
  entityLayers,
  selectedEntityDefinition,
  selectedLayerId,
  onEntityDefinitionSelect,
  onLayerSelect,
  onLayerToggleVisibility,
  onOpenDefinitionManager
}) => {
  const [activeTab, setActiveTab] = useState<'entities' | 'layers'>('entities');

  const renderEntityPreview = (definition: EntityDefinition) => {
    const isSelected = selectedEntityDefinition?.id === definition.id;
    
    return (
      <button
        key={definition.id}
        onClick={() => {
          console.log('Entity palette clicked:', definition, 'isSelected:', isSelected);
          // Always select the definition, don't deselect on second click
          onEntityDefinitionSelect(definition);
        }}
        className={`w-full p-3 border-2 rounded-lg transition-all text-left ${
          isSelected
            ? 'border-blue-500 bg-blue-600 bg-opacity-20'
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            {/* Entity Preview */}
            <div
              className="w-8 h-8 border border-gray-400 flex items-center justify-center"
              style={{
                backgroundColor: definition.fillOpacity > 0 ? definition.color : 'transparent',
                borderColor: definition.color,
                borderWidth: definition.lineOpacity > 0 ? '2px' : '1px',
                borderRadius: definition.renderMode === 'Ellipse' ? '50%' : '0'
              }}
            >
              {definition.renderMode === 'Cross' && (
                <div className="relative w-full h-full">
                  <div 
                    className="absolute w-full h-0.5 top-1/2 transform -translate-y-1/2"
                    style={{ backgroundColor: definition.color }}
                  />
                  <div 
                    className="absolute h-full w-0.5 left-1/2 transform -translate-x-1/2"
                    style={{ backgroundColor: definition.color }}
                  />
                </div>
              )}
            </div>
            
            {/* Size indicator */}
            <div className="absolute -bottom-1 -right-1 text-xs bg-gray-800 border border-gray-600 rounded px-1 text-gray-300">
              {definition.width}×{definition.height}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate">{definition.name}</h4>
            <div className="text-xs text-gray-400">
              {definition.renderMode} • {definition.fields.length} fields
            </div>
          </div>
        </div>

        {/* Tags */}
        {definition.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {definition.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-blue-600 bg-opacity-20 text-blue-300 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {definition.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{definition.tags.length - 3}</span>
            )}
          </div>
        )}
      </button>
    );
  };

  const renderLayerItem = (layer: EntityLayer) => {
    const isSelected = selectedLayerId === layer.id;
    const entityCount = layer.entities.length;
    
    return (
      <div
        key={layer.id}
        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-600 bg-opacity-20'
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
        }`}
        onClick={() => onLayerSelect(isSelected ? null : layer.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-white truncate">{layer.name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{entityCount}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLayerToggleVisibility(layer.id);
              }}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title={layer.visible ? 'Hide Layer' : 'Show Layer'}
            >
              {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          Grid: {layer.gridSize}px • Opacity: {Math.round(layer.opacity * 100)}%
          {layer.locked && ' • Locked'}
        </div>
      </div>
    );
  };

  return (
    <div className="w-96 min-w-0 bg-gray-800 border-r border-gray-700 flex flex-col h-full lg:w-96 w-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white">Entities</h2>
          <button
            onClick={onOpenDefinitionManager}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors text-white text-sm"
          >
            <Settings size={16} />
            Manage
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border border-gray-600 rounded">
          <button
            onClick={() => setActiveTab('entities')}
            className={`flex-1 px-3 py-2 text-sm transition-colors ${
              activeTab === 'entities'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Entity Types
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex-1 px-3 py-2 text-sm transition-colors ${
              activeTab === 'layers'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Layers ({entityLayers.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'entities' ? (
          <div className="space-y-3">
            {entityDefinitions.length > 0 ? (
              entityDefinitions.map(renderEntityPreview)
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Settings size={48} className="mx-auto opacity-50 mb-4" />
                <p className="text-lg mb-2">No Entity Definitions</p>
                <p className="text-sm mb-4">Create entity definitions to place them in your levels</p>
                <button
                  onClick={onOpenDefinitionManager}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors text-white"
                >
                  Manage Entities
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {entityLayers.length > 0 ? (
              entityLayers.map(renderLayerItem)
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="mb-4">
                  <div className="w-12 h-12 mx-auto border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  </div>
                </div>
                <p className="text-lg mb-2">No Entity Layers</p>
                <p className="text-sm">Entity layers will appear here when created</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Entity Info */}
      {selectedEntityDefinition && (
        <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-750">
          <div className="text-sm">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded border"
                style={{ backgroundColor: selectedEntityDefinition.color }}
              />
              <span className="font-medium text-white">{selectedEntityDefinition.name}</span>
            </div>
            <div className="text-gray-400">
              Click on the canvas to place this entity
            </div>
            {selectedEntityDefinition.maxCount && (
              <div className="text-yellow-400 text-xs mt-1">
                Max instances: {selectedEntityDefinition.maxCount}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

EntityPalette.displayName = 'EntityPalette';

export default EntityPalette;