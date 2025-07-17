import { memo, useState } from 'react';
import { Plus, Edit3, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { EntityDefinition, EntityField } from '../types/entity';

interface EntityDefinitionManagerProps {
  readonly entityDefinitions: readonly EntityDefinition[];
  readonly onEntityDefinitionAdd: (definition: EntityDefinition) => void;
  readonly onEntityDefinitionEdit: (definition: EntityDefinition) => void;
  readonly onEntityDefinitionDelete: (id: string) => void;
  readonly onEntityDefinitionDuplicate: (definition: EntityDefinition) => void;
}

const EntityDefinitionManager = memo<EntityDefinitionManagerProps>(({
  entityDefinitions,
  onEntityDefinitionAdd,
  onEntityDefinitionEdit,
  onEntityDefinitionDelete,
  onEntityDefinitionDuplicate
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingDefinition, setEditingDefinition] = useState<EntityDefinition | null>(null);
  const [newDefinition, setNewDefinition] = useState<Partial<EntityDefinition>>({
    name: '',
    color: '#ff0000',
    width: 16,
    height: 16,
    resizable: false,
    keepAspectRatio: true,
    tileOpacity: 1,
    fillOpacity: 1,
    lineOpacity: 1,
    hollow: false,
    tags: [],
    fields: [],
    showName: true,
    renderMode: 'Rectangle'
  });

  const handleCreateDefinition = () => {
    if (!newDefinition.name?.trim()) return;

    const definition: EntityDefinition = {
      id: `entity_${Date.now()}`,
      name: newDefinition.name.trim(),
      color: newDefinition.color || '#ff0000',
      width: newDefinition.width || 16,
      height: newDefinition.height || 16,
      resizable: newDefinition.resizable || false,
      keepAspectRatio: newDefinition.keepAspectRatio ?? true,
      tileOpacity: newDefinition.tileOpacity || 1,
      fillOpacity: newDefinition.fillOpacity || 1,
      lineOpacity: newDefinition.lineOpacity || 1,
      hollow: newDefinition.hollow || false,
      tags: newDefinition.tags || [],
      fields: newDefinition.fields || [],
      showName: newDefinition.showName ?? true,
      renderMode: newDefinition.renderMode || 'Rectangle'
    };

    onEntityDefinitionAdd(definition);
    setNewDefinition({
      name: '',
      color: '#ff0000',
      width: 16,
      height: 16,
      resizable: false,
      keepAspectRatio: true,
      tileOpacity: 1,
      fillOpacity: 1,
      lineOpacity: 1,
      hollow: false,
      tags: [],
      fields: [],
      showName: true,
      renderMode: 'Rectangle'
    });
    setIsCreating(false);
  };

  const handleDuplicate = (definition: EntityDefinition) => {
    const duplicated: EntityDefinition = {
      ...definition,
      id: `entity_${Date.now()}`,
      name: `${definition.name} Copy`
    };
    onEntityDefinitionDuplicate(duplicated);
  };

  return (
    <div className="w-full h-full bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white">Entity Definitions</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors text-white text-sm"
          >
            <Plus size={16} />
            Add Entity
          </button>
        </div>
        <p className="text-sm text-gray-400">
          Define entity types that can be placed in your levels
        </p>
      </div>

      {/* Entity Definition List */}
      <div className="flex-1 overflow-y-auto">
        {entityDefinitions.map((definition) => (
          <div key={definition.id} className="border-b border-gray-700 p-4 hover:bg-gray-750">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-4 h-4 rounded border border-gray-500"
                    style={{ backgroundColor: definition.color }}
                  />
                  <h3 className="font-semibold text-white">{definition.name}</h3>
                  <span className="text-xs text-gray-400 px-2 py-1 bg-gray-700 rounded">
                    {definition.renderMode}
                  </span>
                </div>
                
                <div className="text-sm text-gray-400 mb-2">
                  Size: {definition.width}×{definition.height}px
                  {definition.resizable && ' (Resizable)'}
                </div>

                {definition.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {definition.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-blue-600 bg-opacity-20 text-blue-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {definition.fields.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Fields: {definition.fields.map(f => f.name).join(', ')}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => setEditingDefinition(definition)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                  title="Edit Definition"
                >
                  <Edit3 size={16} />
                </button>
                
                <button
                  onClick={() => handleDuplicate(definition)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                  title="Duplicate Definition"
                >
                  <Copy size={16} />
                </button>
                
                <button
                  onClick={() => onEntityDefinitionDelete(definition.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600 hover:bg-opacity-20 rounded transition-colors"
                  title="Delete Definition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {entityDefinitions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">
              <Plus size={48} className="mx-auto opacity-50" />
            </div>
            <p className="text-lg mb-2">No Entity Definitions</p>
            <p className="text-sm">Create your first entity definition to get started</p>
          </div>
        )}
      </div>

      {/* Create Entity Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Create Entity Definition</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newDefinition.name || ''}
                  onChange={(e) => setNewDefinition(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Entity name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={newDefinition.color || '#ff0000'}
                  onChange={(e) => setNewDefinition(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 bg-gray-700 border border-gray-600 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Width
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="512"
                    value={newDefinition.width || 16}
                    onChange={(e) => setNewDefinition(prev => ({ ...prev, width: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Height
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="512"
                    value={newDefinition.height || 16}
                    onChange={(e) => setNewDefinition(prev => ({ ...prev, height: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Render Mode
                </label>
                <select
                  value={newDefinition.renderMode || 'Rectangle'}
                  onChange={(e) => setNewDefinition(prev => ({ ...prev, renderMode: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Rectangle">Rectangle</option>
                  <option value="Ellipse">Ellipse</option>
                  <option value="Cross">Cross</option>
                  <option value="Tile">Tile</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={newDefinition.resizable || false}
                    onChange={(e) => setNewDefinition(prev => ({ ...prev, resizable: e.target.checked }))}
                    className="rounded"
                  />
                  Resizable
                </label>
                
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={newDefinition.hollow || false}
                    onChange={(e) => setNewDefinition(prev => ({ ...prev, hollow: e.target.checked }))}
                    className="rounded"
                  />
                  Hollow
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateDefinition}
                disabled={!newDefinition.name?.trim()}
                className="flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewDefinition({
                    name: '',
                    color: '#ff0000',
                    width: 16,
                    height: 16,
                    resizable: false,
                    keepAspectRatio: true,
                    tileOpacity: 1,
                    fillOpacity: 1,
                    lineOpacity: 1,
                    hollow: false,
                    tags: [],
                    fields: [],
                    showName: true,
                    renderMode: 'Rectangle'
                  });
                }}
                className="flex-1 px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

EntityDefinitionManager.displayName = 'EntityDefinitionManager';

export default EntityDefinitionManager;