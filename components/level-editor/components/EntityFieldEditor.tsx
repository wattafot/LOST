import { memo, useState, useCallback } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { EntityDefinition, EntityInstance, EntityField } from '../types/entity';

interface EntityFieldEditorProps {
  readonly entity: EntityInstance;
  readonly definition: EntityDefinition;
  readonly onUpdateEntity: (entityId: string, updates: Partial<EntityInstance>) => void;
  readonly onClose: () => void;
}

const EntityFieldEditor = memo<EntityFieldEditorProps>(({
  entity,
  definition,
  onUpdateEntity,
  onClose
}) => {
  const [fieldValues, setFieldValues] = useState<Record<string, any>>(entity.fieldValues || {});
  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFieldValues(prev => {
      const newValues = { ...prev, [fieldId]: value };
      setHasChanges(true);
      return newValues;
    });
  }, []);

  const handleSave = useCallback(() => {
    onUpdateEntity(entity.id, { fieldValues });
    setHasChanges(false);
    onClose();
  }, [entity.id, fieldValues, onUpdateEntity, onClose]);

  const handleReset = useCallback(() => {
    setFieldValues(entity.fieldValues || {});
    setHasChanges(false);
  }, [entity.fieldValues]);

  const renderFieldInput = (field: EntityField) => {
    const currentValue = fieldValues[field.id] ?? field.defaultValue;
    
    const baseInputClasses = "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
    
    switch (field.type) {
      case 'string':
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseInputClasses}
            placeholder={field.defaultValue || ''}
          />
        );
        
      case 'int':
        return (
          <input
            type="number"
            value={currentValue || 0}
            onChange={(e) => handleFieldChange(field.id, parseInt(e.target.value) || 0)}
            min={field.min}
            max={field.max}
            step="1"
            className={baseInputClasses}
          />
        );
        
      case 'float':
        return (
          <input
            type="number"
            value={currentValue || 0}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || 0)}
            min={field.min}
            max={field.max}
            step="0.1"
            className={baseInputClasses}
          />
        );
        
      case 'bool':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentValue || false}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300">
              {currentValue ? 'True' : 'False'}
            </span>
          </label>
        );
        
      case 'color':
        return (
          <div className="flex gap-2">
            <input
              type="color"
              value={currentValue || field.defaultValue || '#ffffff'}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-12 h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
            />
            <input
              type="text"
              value={currentValue || field.defaultValue || '#ffffff'}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="#ffffff"
            />
          </div>
        );
        
      case 'enum':
        return (
          <select
            value={currentValue || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseInputClasses}
          >
            {field.enumValues?.map((enumValue) => (
              <option key={enumValue} value={enumValue}>
                {enumValue}
              </option>
            ))}
          </select>
        );
        
      case 'point':
        const pointValue = currentValue || { x: 0, y: 0 };
        return (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">X</label>
              <input
                type="number"
                value={pointValue.x || 0}
                onChange={(e) => handleFieldChange(field.id, { 
                  ...pointValue, 
                  x: parseInt(e.target.value) || 0 
                })}
                className={baseInputClasses}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Y</label>
              <input
                type="number"
                value={pointValue.y || 0}
                onChange={(e) => handleFieldChange(field.id, { 
                  ...pointValue, 
                  y: parseInt(e.target.value) || 0 
                })}
                className={baseInputClasses}
              />
            </div>
          </div>
        );
        
      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={currentValue || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={baseInputClasses}
              placeholder="Enter file path..."
            />
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    handleFieldChange(field.id, file.name);
                  }
                };
                input.click();
              }}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white hover:bg-gray-500 transition-colors text-sm"
            >
              Browse Files
            </button>
          </div>
        );
        
      default:
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseInputClasses}
            placeholder={field.defaultValue || ''}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-800 border border-gray-600 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded border border-gray-400"
              style={{ backgroundColor: definition.color }}
            />
            <div>
              <h2 className="text-lg font-bold text-white">{definition.name}</h2>
              <p className="text-sm text-gray-400">
                Entity at ({entity.x}, {entity.y})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto p-4">
          {definition.fields.length > 0 ? (
            <div className="space-y-6">
              {definition.fields.map((field) => (
                <div key={field.id}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">
                      {field.name}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <span className="text-xs text-gray-500 uppercase">
                      {field.type}
                    </span>
                  </div>
                  
                  {renderFieldInput(field)}
                  
                  {/* Field constraints info */}
                  {(field.min !== undefined || field.max !== undefined) && (
                    <div className="text-xs text-gray-500 mt-1">
                      {field.min !== undefined && field.max !== undefined
                        ? `Range: ${field.min} - ${field.max}`
                        : field.min !== undefined
                        ? `Min: ${field.min}`
                        : `Max: ${field.max}`
                      }
                    </div>
                  )}
                  
                  {field.type === 'enum' && field.enumValues && (
                    <div className="text-xs text-gray-500 mt-1">
                      Options: {field.enumValues.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg mb-2">No Fields</p>
              <p className="text-sm">This entity type has no configurable fields</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors text-white text-sm"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

EntityFieldEditor.displayName = 'EntityFieldEditor';

export default EntityFieldEditor;