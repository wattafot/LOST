import { memo, useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Lock, Unlock, Move3D } from 'lucide-react';
import { EntityLayer } from '../types/entity';

interface EntityLayerManagerProps {
  readonly entityLayers: readonly EntityLayer[];
  readonly selectedLayerId: string | null;
  readonly onLayerAdd: (layer: Omit<EntityLayer, 'id'>) => void;
  readonly onLayerEdit: (layer: EntityLayer) => void;
  readonly onLayerDelete: (layerId: string) => void;
  readonly onLayerSelect: (layerId: string | null) => void;
  readonly onLayerToggleVisibility: (layerId: string) => void;
  readonly onLayerToggleLock: (layerId: string) => void;
  readonly onLayerReorder: (fromIndex: number, toIndex: number) => void;
}

const EntityLayerManager = memo<EntityLayerManagerProps>(({
  entityLayers,
  selectedLayerId,
  onLayerAdd,
  onLayerEdit,
  onLayerDelete,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerReorder
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingLayer, setEditingLayer] = useState<EntityLayer | null>(null);
  const [newLayer, setNewLayer] = useState({
    name: '',
    gridSize: 16,
    opacity: 1
  });

  const handleCreateLayer = () => {
    if (!newLayer.name.trim()) return;

    const layer: Omit<EntityLayer, 'id'> = {
      name: newLayer.name.trim(),
      visible: true,
      locked: false,
      opacity: newLayer.opacity,
      gridSize: newLayer.gridSize,
      entities: []
    };

    onLayerAdd(layer);
    setNewLayer({ name: '', gridSize: 16, opacity: 1 });
    setIsCreating(false);
  };

  const handleEditLayer = () => {
    if (!editingLayer || !newLayer.name.trim()) return;

    const updatedLayer: EntityLayer = {
      ...editingLayer,
      name: newLayer.name.trim(),
      gridSize: newLayer.gridSize,
      opacity: newLayer.opacity
    };

    onLayerEdit(updatedLayer);
    setEditingLayer(null);
    setNewLayer({ name: '', gridSize: 16, opacity: 1 });
  };

  const startEdit = (layer: EntityLayer) => {
    setEditingLayer(layer);
    setNewLayer({
      name: layer.name,
      gridSize: layer.gridSize,
      opacity: layer.opacity
    });
  };

  const cancelEdit = () => {
    setEditingLayer(null);
    setIsCreating(false);
    setNewLayer({ name: '', gridSize: 16, opacity: 1 });
  };

  return (
    <div className="w-full h-full bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white">Entity Layers</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors text-white text-sm"
          >
            <Plus size={16} />
            Add Layer
          </button>
        </div>
        <p className="text-sm text-gray-400">
          Organize entities into layers for better level structure
        </p>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto">
        {entityLayers.map((layer, index) => (
          <div 
            key={layer.id} 
            className={`border-b border-gray-700 p-4 hover:bg-gray-750 transition-colors ${
              selectedLayerId === layer.id ? 'bg-blue-600 bg-opacity-20 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onLayerSelect(selectedLayerId === layer.id ? null : layer.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    <Move3D size={16} className="text-gray-500 cursor-grab" />
                  </div>
                  
                  <h3 className="font-semibold text-white">{layer.name}</h3>
                  
                  <span className="text-xs text-gray-400 px-2 py-1 bg-gray-700 rounded">
                    {layer.entities.length} entities
                  </span>
                </div>
                
                <div className="text-sm text-gray-400 ml-5">
                  Grid: {layer.gridSize}px • Opacity: {Math.round(layer.opacity * 100)}%
                </div>
              </div>

              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => onLayerToggleVisibility(layer.id)}
                  className={`p-2 rounded transition-colors ${
                    layer.visible 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                      : 'text-red-400 hover:text-red-300 hover:bg-red-600 hover:bg-opacity-20'
                  }`}
                  title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                >
                  {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                
                <button
                  onClick={() => onLayerToggleLock(layer.id)}
                  className={`p-2 rounded transition-colors ${
                    layer.locked 
                      ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-600 hover:bg-opacity-20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-600'
                  }`}
                  title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                >
                  {layer.locked ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
                
                <button
                  onClick={() => startEdit(layer)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                  title="Edit Layer"
                >
                  <Edit3 size={16} />
                </button>
                
                <button
                  onClick={() => onLayerDelete(layer.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600 hover:bg-opacity-20 rounded transition-colors"
                  title="Delete Layer"
                  disabled={entityLayers.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {entityLayers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">
              <Plus size={48} className="mx-auto opacity-50" />
            </div>
            <p className="text-lg mb-2">No Entity Layers</p>
            <p className="text-sm">Create your first entity layer to organize entities</p>
          </div>
        )}
      </div>

      {/* Create/Edit Layer Modal */}
      {(isCreating || editingLayer) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingLayer ? 'Edit Layer' : 'Create Entity Layer'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Layer Name
                </label>
                <input
                  type="text"
                  value={newLayer.name}
                  onChange={(e) => setNewLayer(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Entity layer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Grid Size: {newLayer.gridSize}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="64"
                  step="8"
                  value={newLayer.gridSize}
                  onChange={(e) => setNewLayer(prev => ({ ...prev, gridSize: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>8px</span>
                  <span>32px</span>
                  <span>64px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Opacity: {Math.round(newLayer.opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={newLayer.opacity}
                  onChange={(e) => setNewLayer(prev => ({ ...prev, opacity: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingLayer ? handleEditLayer : handleCreateLayer}
                disabled={!newLayer.name.trim()}
                className="flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                {editingLayer ? 'Update' : 'Create'}
              </button>
              <button
                onClick={cancelEdit}
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

EntityLayerManager.displayName = 'EntityLayerManager';

export default EntityLayerManager;