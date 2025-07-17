import { useState, useCallback, useEffect } from 'react';
import { EntityDefinition, EntityInstance, EntityLayer, DEFAULT_ENTITY_DEFINITIONS } from '../types/entity';

export const useEntityEditor = () => {
  // Entity system state
  const [entityDefinitions, setEntityDefinitions] = useState<EntityDefinition[]>(DEFAULT_ENTITY_DEFINITIONS);
  const [entityLayers, setEntityLayers] = useState<EntityLayer[]>([
    {
      id: 'default_entity_layer',
      name: 'Entities',
      visible: true,
      locked: false,
      opacity: 1,
      gridSize: 16,
      entities: []
    }
  ]);
  
  const [selectedEntityDefinition, setSelectedEntityDefinition] = useState<EntityDefinition | null>(null);
  
  // Debug entity definition selection
  useEffect(() => {
    console.log('selectedEntityDefinition state changed to:', selectedEntityDefinition);
  }, [selectedEntityDefinition]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('default_entity_layer');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);
  const [isEntityMode, setIsEntityMode] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedDefinitions = localStorage.getItem('levelEditor_entityDefinitions');
      const savedLayers = localStorage.getItem('levelEditor_entityLayers');
      
      if (savedDefinitions) {
        const parsed = JSON.parse(savedDefinitions);
        // Merge with defaults, ensuring defaults are always available
        const mergedDefinitions = [
          ...DEFAULT_ENTITY_DEFINITIONS,
          ...parsed.filter((def: EntityDefinition) => 
            !DEFAULT_ENTITY_DEFINITIONS.some(defaultDef => defaultDef.id === def.id)
          )
        ];
        setEntityDefinitions(mergedDefinitions);
      }
      
      if (savedLayers) {
        setEntityLayers(JSON.parse(savedLayers));
      }
    } catch (error) {
      console.error('Failed to load entity data:', error);
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    // Save custom definitions (exclude defaults)
    const customDefinitions = entityDefinitions.filter(def => 
      !DEFAULT_ENTITY_DEFINITIONS.some(defaultDef => defaultDef.id === def.id)
    );
    localStorage.setItem('levelEditor_entityDefinitions', JSON.stringify(customDefinitions));
  }, [entityDefinitions]);

  useEffect(() => {
    localStorage.setItem('levelEditor_entityLayers', JSON.stringify(entityLayers));
  }, [entityLayers]);

  // Entity Definition Management
  const addEntityDefinition = useCallback((definition: EntityDefinition) => {
    setEntityDefinitions(prev => [...prev, definition]);
  }, []);

  const editEntityDefinition = useCallback((definition: EntityDefinition) => {
    setEntityDefinitions(prev => 
      prev.map(def => def.id === definition.id ? definition : def)
    );
  }, []);

  const deleteEntityDefinition = useCallback((id: string) => {
    setEntityDefinitions(prev => prev.filter(def => def.id !== id));
    // Clear selection if deleted definition was selected
    if (selectedEntityDefinition?.id === id) {
      setSelectedEntityDefinition(null);
    }
    // Remove all entities of this type from all layers
    setEntityLayers(prev => 
      prev.map(layer => ({
        ...layer,
        entities: layer.entities.filter(entity => entity.definitionId !== id)
      }))
    );
  }, [selectedEntityDefinition?.id]);

  const duplicateEntityDefinition = useCallback((definition: EntityDefinition) => {
    addEntityDefinition(definition);
  }, [addEntityDefinition]);

  // Layer Management
  const addEntityLayer = useCallback((layer: Omit<EntityLayer, 'id'>) => {
    const newLayer: EntityLayer = {
      ...layer,
      id: `entity_layer_${Date.now()}`
    };
    setEntityLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  }, []);

  const editEntityLayer = useCallback((layer: EntityLayer) => {
    setEntityLayers(prev => 
      prev.map(l => l.id === layer.id ? layer : l)
    );
  }, []);

  const deleteEntityLayer = useCallback((layerId: string) => {
    setEntityLayers(prev => prev.filter(layer => layer.id !== layerId));
    // Clear selection if deleted layer was selected
    if (selectedLayerId === layerId) {
      const remainingLayers = entityLayers.filter(layer => layer.id !== layerId);
      setSelectedLayerId(remainingLayers.length > 0 ? remainingLayers[0].id : null);
    }
  }, [selectedLayerId, entityLayers]);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setEntityLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  }, []);

  const toggleLayerLock = useCallback((layerId: string) => {
    setEntityLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, locked: !layer.locked }
          : layer
      )
    );
  }, []);

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    setEntityLayers(prev => {
      const newLayers = [...prev];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      return newLayers;
    });
  }, []);

  // Entity Instance Management
  const addEntityInstance = useCallback((x: number, y: number, definitionId: string, layerId?: string) => {
    const targetLayerId = layerId || selectedLayerId;
    console.log('addEntityInstance:', { x, y, definitionId, targetLayerId, entityLayers });
    if (!targetLayerId) {
      console.log('No target layer ID');
      return null;
    }

    const definition = entityDefinitions.find(def => def.id === definitionId);
    if (!definition) {
      console.log('No definition found for:', definitionId);
      return null;
    }

    // Check max count constraint
    if (definition.maxCount) {
      const currentCount = entityLayers
        .flatMap(layer => layer.entities)
        .filter(entity => entity.definitionId === definitionId)
        .length;
      
      if (currentCount >= definition.maxCount) {
        return null; // Max count reached
      }
    }

    const newEntity: EntityInstance = {
      id: `entity_instance_${Date.now()}`,
      definitionId,
      x,
      y,
      width: definition.width,
      height: definition.height,
      fieldValues: definition.fields.reduce((acc, field) => {
        acc[field.id] = field.defaultValue;
        return acc;
      }, {} as Record<string, any>),
      pivot: { x: 0.5, y: 0.5 }
    };

    setEntityLayers(prev => 
      prev.map(layer => 
        layer.id === targetLayerId 
          ? { ...layer, entities: [...layer.entities, newEntity] }
          : layer
      )
    );

    return newEntity;
  }, [selectedLayerId, entityDefinitions, entityLayers]);

  const deleteEntityInstance = useCallback((entityId: string) => {
    setEntityLayers(prev => 
      prev.map(layer => ({
        ...layer,
        entities: layer.entities.filter(entity => entity.id !== entityId)
      }))
    );
    
    if (selectedEntityId === entityId) {
      setSelectedEntityId(null);
    }
  }, [selectedEntityId]);

  const clearAllEntities = useCallback(() => {
    if (confirm('Are you sure you want to clear all entities from all layers?')) {
      setEntityLayers(prev => 
        prev.map(layer => ({
          ...layer,
          entities: []
        }))
      );
      setSelectedEntityId(null);
    }
  }, []);

  const updateEntityInstance = useCallback((entityId: string, updates: Partial<EntityInstance>) => {
    setEntityLayers(prev => 
      prev.map(layer => ({
        ...layer,
        entities: layer.entities.map(entity => 
          entity.id === entityId 
            ? { ...entity, ...updates }
            : entity
        )
      }))
    );
  }, []);

  const moveEntityInstance = useCallback((entityId: string, x: number, y: number) => {
    updateEntityInstance(entityId, { x, y });
  }, [updateEntityInstance]);

  const resizeEntityInstance = useCallback((entityId: string, width: number, height: number) => {
    updateEntityInstance(entityId, { width, height });
  }, [updateEntityInstance]);

  // Selection Management
  const selectEntity = useCallback((entityId: string | null) => {
    setSelectedEntityId(entityId);
  }, []);

  const selectEntityDefinition = useCallback((definition: EntityDefinition | null) => {
    console.log('selectEntityDefinition called with:', definition);
    setSelectedEntityDefinition(definition);
  }, []);

  const selectLayer = useCallback((layerId: string | null) => {
    setSelectedLayerId(layerId);
  }, []);

  // Utility functions
  const getEntityAtPosition = useCallback((x: number, y: number): { entity: EntityInstance; layer: EntityLayer } | null => {
    // Check from top layer to bottom
    for (let i = entityLayers.length - 1; i >= 0; i--) {
      const layer = entityLayers[i];
      if (!layer.visible) continue;

      for (const entity of layer.entities) {
        if (x >= entity.x && x <= entity.x + entity.width &&
            y >= entity.y && y <= entity.y + entity.height) {
          return { entity, layer };
        }
      }
    }
    return null;
  }, [entityLayers]);

  const getSelectedLayer = useCallback((): EntityLayer | null => {
    return entityLayers.find(layer => layer.id === selectedLayerId) || null;
  }, [entityLayers, selectedLayerId]);

  return {
    // State
    entityDefinitions,
    entityLayers,
    selectedEntityDefinition,
    selectedLayerId,
    selectedEntityId,
    hoveredEntityId,
    isEntityMode,
    
    // Definition management
    addEntityDefinition,
    editEntityDefinition,
    deleteEntityDefinition,
    duplicateEntityDefinition,
    
    // Layer management
    addEntityLayer,
    editEntityLayer,
    deleteEntityLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    reorderLayers,
    
    // Instance management
    addEntityInstance,
    deleteEntityInstance,
    clearAllEntities,
    updateEntityInstance,
    moveEntityInstance,
    resizeEntityInstance,
    
    // Selection
    selectEntity,
    selectEntityDefinition,
    selectLayer,
    setHoveredEntityId,
    setIsEntityMode,
    
    // Utilities
    getEntityAtPosition,
    getSelectedLayer
  };
};