import { memo } from 'react';
import { EntityDefinition, EntityInstance, EntityLayer } from '../types/entity';

interface EntityRendererProps {
  readonly entityLayers: readonly EntityLayer[];
  readonly entityDefinitions: readonly EntityDefinition[];
  readonly selectedEntityId: string | null;
  readonly hoveredEntityId: string | null;
  readonly zoom: number;
  readonly gridSize: number;
  readonly onEntityClick: (entity: EntityInstance, layer: EntityLayer) => void;
  readonly onEntityMouseEnter: (entityId: string) => void;
  readonly onEntityMouseLeave: () => void;
}

const EntityRenderer = memo<EntityRendererProps>(({
  entityLayers,
  entityDefinitions,
  selectedEntityId,
  hoveredEntityId,
  zoom,
  gridSize,
  onEntityClick,
  onEntityMouseEnter,
  onEntityMouseLeave
}) => {
  const getEntityDefinition = (definitionId: string): EntityDefinition | null => {
    return entityDefinitions.find(def => def.id === definitionId) || null;
  };

  const renderEntity = (entity: EntityInstance, layer: EntityLayer) => {
    const definition = getEntityDefinition(entity.definitionId);
    if (!definition) return null;

    const isSelected = selectedEntityId === entity.id;
    const isHovered = hoveredEntityId === entity.id;
    
    // Calculate render properties
    const opacity = layer.opacity * (layer.visible ? 1 : 0.3);
    const fillColor = definition.color;
    const strokeColor = definition.color;
    const fillOpacity = definition.fillOpacity * opacity;
    const lineOpacity = definition.lineOpacity * opacity;
    
    // Position and size
    const x = entity.x * zoom;
    const y = entity.y * zoom;
    const width = entity.width * zoom;
    const height = entity.height * zoom;
    
    // Selection/hover styling
    const borderStyle = isSelected 
      ? '3px solid #00ff00' 
      : isHovered 
        ? '2px solid #ffff00' 
        : `${lineOpacity > 0 ? Math.max(1, 2 * zoom) : 0}px solid ${strokeColor}`;

    const entityStyle: React.CSSProperties = {
      position: 'absolute',
      left: x,
      top: y,
      width: width,
      height: height,
      cursor: layer.locked ? 'default' : 'pointer',
      pointerEvents: layer.visible ? 'auto' : 'none',
      border: borderStyle,
      zIndex: 10 + entityLayers.indexOf(layer)
    };

    // Render based on render mode
    let entityContent: React.ReactNode = null;
    
    switch (definition.renderMode) {
      case 'Rectangle':
        entityStyle.backgroundColor = fillOpacity > 0 ? `${fillColor}${Math.round(fillOpacity * 255).toString(16).padStart(2, '0')}` : 'transparent';
        if (definition.hollow) {
          entityStyle.backgroundColor = 'transparent';
        }
        break;
        
      case 'Ellipse':
        entityStyle.borderRadius = '50%';
        entityStyle.backgroundColor = fillOpacity > 0 ? `${fillColor}${Math.round(fillOpacity * 255).toString(16).padStart(2, '0')}` : 'transparent';
        if (definition.hollow) {
          entityStyle.backgroundColor = 'transparent';
        }
        break;
        
      case 'Cross':
        entityStyle.backgroundColor = 'transparent';
        entityStyle.border = 'none';
        entityContent = (
          <div className="relative w-full h-full">
            {/* Horizontal line */}
            <div 
              className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2"
              style={{
                height: Math.max(1, 2 * zoom),
                backgroundColor: fillColor,
                opacity: fillOpacity
              }}
            />
            {/* Vertical line */}
            <div 
              className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: Math.max(1, 2 * zoom),
                backgroundColor: fillColor,
                opacity: fillOpacity
              }}
            />
            {/* Selection/hover border for cross */}
            {(isSelected || isHovered) && (
              <div
                className="absolute inset-0 border-2 border-dashed pointer-events-none"
                style={{
                  borderColor: isSelected ? '#00ff00' : '#ffff00'
                }}
              />
            )}
          </div>
        );
        break;
        
      case 'Tile':
        if (definition.tilePath && definition.tileRect) {
          entityStyle.backgroundImage = `url(${definition.tilePath})`;
          entityStyle.backgroundPosition = `-${definition.tileRect.x}px -${definition.tileRect.y}px`;
          entityStyle.backgroundSize = `${definition.tileRect.w}px ${definition.tileRect.h}px`;
          entityStyle.backgroundRepeat = 'no-repeat';
          entityStyle.imageRendering = 'pixelated';
        } else {
          entityStyle.backgroundColor = fillOpacity > 0 ? `${fillColor}${Math.round(fillOpacity * 255).toString(16).padStart(2, '0')}` : 'transparent';
        }
        break;
    }

    return (
      <div
        key={entity.id}
        style={entityStyle}
        onClick={() => !layer.locked && onEntityClick(entity, layer)}
        onMouseEnter={() => onEntityMouseEnter(entity.id)}
        onMouseLeave={onEntityMouseLeave}
        title={`${definition.name} (${entity.x}, ${entity.y})`}
      >
        {entityContent}
        
        {/* Entity name label */}
        {definition.showName && zoom >= 0.5 && (
          <div
            className="absolute -top-6 left-0 text-xs font-medium bg-black bg-opacity-75 text-white px-1 rounded pointer-events-none whitespace-nowrap"
            style={{
              fontSize: Math.max(8, 10 * zoom),
              opacity: opacity
            }}
          >
            {definition.name}
          </div>
        )}
        
        {/* Resize handles for selected resizable entities */}
        {isSelected && definition.resizable && !layer.locked && zoom >= 0.75 && (
          <>
            {/* Corner resize handles */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-500 border border-green-400 cursor-nw-resize" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 border border-green-400 cursor-ne-resize" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-500 border border-green-400 cursor-sw-resize" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 border border-green-400 cursor-se-resize" />
            
            {/* Edge resize handles */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 border border-green-400 cursor-n-resize" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 border border-green-400 cursor-s-resize" />
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 border border-green-400 cursor-w-resize" />
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 border border-green-400 cursor-e-resize" />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {entityLayers.map((layer) => (
        <div key={layer.id} className="absolute inset-0 pointer-events-none">
          {layer.entities.map((entity) => renderEntity(entity, layer))}
        </div>
      ))}
    </div>
  );
});

EntityRenderer.displayName = 'EntityRenderer';

export default EntityRenderer;