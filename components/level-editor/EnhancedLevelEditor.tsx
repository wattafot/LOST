"use client";

import { useState, useCallback } from 'react';
import { Tile } from './types';
import { useLevelEditor } from './hooks/useLevelEditor';
import { useEntityEditor } from './hooks/useEntityEditor';
import TilePalette from './components/TilePalette';
import EntityPalette from './components/EntityPalette';
import Toolbar from './components/Toolbar';
import EntityToolbar from './components/EntityToolbar';
import EnhancedCanvas from './components/EnhancedCanvas';
import MobileControls from './components/MobileControls';
import EntityDefinitionManager from './components/EntityDefinitionManager';
import EntityLayerManager from './components/EntityLayerManager';
import EntityFieldEditor from './components/EntityFieldEditor';

export default function EnhancedLevelEditor() {
  const {
    // State
    levelData,
    selectedTile,
    isDrawing,
    showGrid,
    zoom,
    history,
    historyIndex,
    isErasing,
    mounted,
    // Actions
    setLevelData,
    setSelectedTile,
    setIsDrawing,
    setShowGrid,
    setZoom,
    setIsErasing,
    placeTile,
    undo,
    redo,
    clearLevel,
    saveLevel,
    loadLevel,
    exportToGameFormat,
  } = useLevelEditor();

  const {
    // Entity state
    entityDefinitions,
    entityLayers,
    selectedEntityDefinition,
    selectedLayerId,
    selectedEntityId,
    hoveredEntityId,
    isEntityMode,
    
    // Entity actions
    addEntityDefinition,
    editEntityDefinition,
    deleteEntityDefinition,
    duplicateEntityDefinition,
    addEntityLayer,
    editEntityLayer,
    deleteEntityLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    reorderLayers,
    addEntityInstance,
    deleteEntityInstance,
    clearAllEntities,
    updateEntityInstance,
    moveEntityInstance,
    resizeEntityInstance,
    selectEntity,
    selectEntityDefinition,
    selectLayer,
    setHoveredEntityId,
    setIsEntityMode,
    getEntityAtPosition,
    getSelectedLayer
  } = useEntityEditor();

  // State for dynamic tiles (includes tiles created from tileset viewer)
  const [dynamicTiles, setDynamicTiles] = useState<Tile[]>([]);
  
  // UI state
  const [isTilePaletteOpen, setIsTilePaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDefinitionManager, setShowDefinitionManager] = useState(false);
  const [showLayerManager, setShowLayerManager] = useState(false);
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<'select' | 'move' | 'duplicate' | 'delete'>('select');

  // Derived state
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Tile handlers
  const handleTilePlace = (x: number, y: number, tileId: string | null) => {
    placeTile(x, y, tileId);
  };

  const handleTileSelect = useCallback((tile: Tile) => {
    // Add tile to dynamic tiles if not exists
    setDynamicTiles(prev => {
      const exists = prev.find(t => t.id === tile.id);
      if (!exists) {
        return [...prev, tile];
      }
      return prev;
    });
    
    setSelectedTile(tile);
    setIsErasing(false);
    setIsEntityMode(false); // Switch to tile mode
  }, [setSelectedTile, setIsErasing, setIsEntityMode]);

  const handleToggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
  };

  // Entity handlers
  const handleEntityPlace = useCallback((x: number, y: number, definitionId: string) => {
    if (!selectedLayerId) {
      return;
    }
    
    const newEntity = addEntityInstance(x, y, definitionId, selectedLayerId);
    if (newEntity) {
      selectEntity(newEntity.id);
    }
  }, [selectedLayerId, addEntityInstance, selectEntity]);

  const handleEntityClick = useCallback((entity: any, layer: any) => {
    if (selectedTool === 'select') {
      selectEntity(entity.id);
    } else if (selectedTool === 'delete') {
      deleteEntityInstance(entity.id);
    } else if (selectedTool === 'duplicate') {
      // Duplicate entity at offset position
      const newEntity = addEntityInstance(
        entity.x + 16, 
        entity.y + 16, 
        entity.definitionId, 
        layer.id
      );
      if (newEntity) {
        selectEntity(newEntity.id);
      }
    }
  }, [selectedTool, selectEntity, deleteEntityInstance, addEntityInstance]);

  const handleEntityMove = useCallback((entityId: string, x: number, y: number) => {
    moveEntityInstance(entityId, x, y);
  }, [moveEntityInstance]);

  const handleToggleEntityMode = useCallback(() => {
    setIsEntityMode(!isEntityMode);
    if (!isEntityMode) {
      setSelectedTile(null); // Clear tile selection when entering entity mode
    }
  }, [isEntityMode, setIsEntityMode, setSelectedTile]);

  const handleEntityDefinitionSelect = useCallback((definition: any) => {
    selectEntityDefinition(definition);
    setIsEntityMode(true); // Switch to entity mode
  }, [selectEntityDefinition, setIsEntityMode]);

  const handleEditSelectedEntity = useCallback(() => {
    if (selectedEntityId) {
      setEditingEntityId(selectedEntityId);
    }
  }, [selectedEntityId]);

  const getEditingEntity = () => {
    if (!editingEntityId) return null;
    
    for (const layer of entityLayers) {
      const entity = layer.entities.find(e => e.id === editingEntityId);
      if (entity) {
        return entity;
      }
    }
    return null;
  };

  const getEditingEntityDefinition = () => {
    const entity = getEditingEntity();
    if (!entity) return null;
    
    return entityDefinitions.find(def => def.id === entity.definitionId) || null;
  };

  return (
    <div className="flex h-full w-full bg-gray-900 text-white overflow-hidden relative">
      {/* Desktop Layout - Hidden on Mobile */}
      <div className="hidden lg:flex h-full w-full">
        {/* Left Panel - Desktop */}
        {isEntityMode ? (
          <EntityPalette
            entityDefinitions={entityDefinitions}
            entityLayers={entityLayers}
            selectedEntityDefinition={selectedEntityDefinition}
            selectedLayerId={selectedLayerId}
            onEntityDefinitionSelect={handleEntityDefinitionSelect}
            onLayerSelect={selectLayer}
            onLayerToggleVisibility={toggleLayerVisibility}
            onOpenDefinitionManager={() => setShowDefinitionManager(true)}
          />
        ) : (
          <TilePalette
            selectedTile={selectedTile}
            onTileSelect={handleTileSelect}
          />
        )}

        {/* Center Panel - Desktop */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Combined Toolbar */}
          <div className="flex-shrink-0">
            <Toolbar
              canUndo={canUndo}
              canRedo={canRedo}
              isErasing={isErasing}
              showGrid={showGrid}
              levelData={levelData}
              zoom={zoom}
              onSave={saveLevel}
              onLoad={loadLevel}
              onExport={exportToGameFormat}
              onUndo={undo}
              onRedo={redo}
              onToggleEraser={handleToggleEraser}
              onToggleGrid={handleToggleGrid}
              onClear={clearLevel}
              onLevelDataChange={setLevelData}
              onZoomChange={setZoom}
              isMobile={false}
              isEntityMode={isEntityMode}
              onToggleEntityMode={handleToggleEntityMode}
              totalEntities={entityLayers.reduce((sum, layer) => sum + layer.entities.length, 0)}
            />
            
            {isEntityMode && (
              <EntityToolbar
                isEntityMode={isEntityMode}
                selectedEntityDefinition={selectedEntityDefinition}
                selectedLayerId={selectedLayerId}
                selectedEntityId={selectedEntityId}
                entityLayers={entityLayers}
                onToggleEntityMode={handleToggleEntityMode}
                onSelectTool={setSelectedTool}
                onOpenDefinitionManager={() => setShowDefinitionManager(true)}
                onOpenLayerManager={() => setShowLayerManager(true)}
                onEditSelectedEntity={handleEditSelectedEntity}
                onToggleLayerVisibility={toggleLayerVisibility}
                onClearAllEntities={clearAllEntities}
                selectedTool={selectedTool}
              />
            )}
          </div>

          <EnhancedCanvas
            levelData={levelData}
            tiles={dynamicTiles}
            showGrid={showGrid}
            zoom={zoom}
            isErasing={isErasing}
            selectedTile={selectedTile}
            onTilePlace={handleTilePlace}
            onDrawingStateChange={setIsDrawing}
            
            isEntityMode={isEntityMode}
            entityDefinitions={entityDefinitions}
            entityLayers={entityLayers}
            selectedEntityDefinition={selectedEntityDefinition}
            selectedEntityId={selectedEntityId}
            hoveredEntityId={hoveredEntityId}
            selectedTool={selectedTool}
            onEntityPlace={handleEntityPlace}
            onEntityClick={handleEntityClick}
            onEntityMove={handleEntityMove}
            onEntityMouseEnter={setHoveredEntityId}
            onEntityMouseLeave={() => setHoveredEntityId(null)}
          />
        </div>
      </div>

      {/* Mobile Layout - Shown only on Mobile */}
      <div className="flex lg:hidden h-full w-full flex-col">
        {/* Mobile Controls */}
        <MobileControls
          selectedTile={selectedTile}
          isErasing={isErasing}
          canUndo={canUndo}
          canRedo={canRedo}
          isTilePaletteOpen={isTilePaletteOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleTilePalette={() => setIsTilePaletteOpen(!isTilePaletteOpen)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onToggleEraser={handleToggleEraser}
          onUndo={undo}
          onRedo={redo}
        />

        {/* Mobile Canvas */}
        <div className="flex-1 relative">
          <EnhancedCanvas
            levelData={levelData}
            tiles={dynamicTiles}
            showGrid={showGrid}
            zoom={zoom}
            isErasing={isErasing}
            selectedTile={selectedTile}
            onTilePlace={handleTilePlace}
            onDrawingStateChange={setIsDrawing}
            
            isEntityMode={isEntityMode}
            entityDefinitions={entityDefinitions}
            entityLayers={entityLayers}
            selectedEntityDefinition={selectedEntityDefinition}
            selectedEntityId={selectedEntityId}
            hoveredEntityId={hoveredEntityId}
            selectedTool={selectedTool}
            onEntityPlace={handleEntityPlace}
            onEntityClick={handleEntityClick}
            onEntityMove={handleEntityMove}
            onEntityMouseEnter={setHoveredEntityId}
            onEntityMouseLeave={() => setHoveredEntityId(null)}
          />
        </div>

        {/* Mobile Tile Palette Overlay - Fullscreen */}
        {isTilePaletteOpen && (
          <div className="absolute inset-0 z-50 bg-gray-900 lg:hidden flex flex-col">
            <div className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
              <h3 className="text-lg font-semibold text-white">Select Tiles</h3>
              <button
                onClick={() => setIsTilePaletteOpen(false)}
                className="text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden bg-gray-800">
              <TilePalette
                selectedTile={selectedTile}
                onTileSelect={(tile) => {
                  handleTileSelect(tile);
                  setIsTilePaletteOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 z-40 bg-black bg-opacity-50 lg:hidden">
            <div className="absolute top-0 left-0 right-0 bg-gray-800">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Level Settings</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
              <div className="p-4 space-y-4">
                <Toolbar
                  canUndo={canUndo}
                  canRedo={canRedo}
                  isErasing={isErasing}
                  showGrid={showGrid}
                  levelData={levelData}
                  zoom={zoom}
                  onSave={saveLevel}
                  onLoad={loadLevel}
                  onExport={exportToGameFormat}
                  onUndo={undo}
                  onRedo={redo}
                  onToggleEraser={handleToggleEraser}
                  onToggleGrid={handleToggleGrid}
                  onClear={clearLevel}
                  onLevelDataChange={setLevelData}
                  onZoomChange={setZoom}
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Entity Definition Manager Modal */}
      {showDefinitionManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-gray-800 border border-gray-600 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Entity Definition Manager</h2>
              <button
                onClick={() => setShowDefinitionManager(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="h-96 overflow-hidden">
              <EntityDefinitionManager
                entityDefinitions={entityDefinitions}
                onEntityDefinitionAdd={addEntityDefinition}
                onEntityDefinitionEdit={editEntityDefinition}
                onEntityDefinitionDelete={deleteEntityDefinition}
                onEntityDefinitionDuplicate={duplicateEntityDefinition}
              />
            </div>
          </div>
        </div>
      )}

      {/* Entity Layer Manager Modal */}
      {showLayerManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-gray-800 border border-gray-600 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Entity Layer Manager</h2>
              <button
                onClick={() => setShowLayerManager(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="h-96 overflow-hidden">
              <EntityLayerManager
                entityLayers={entityLayers}
                selectedLayerId={selectedLayerId}
                onLayerAdd={addEntityLayer}
                onLayerEdit={editEntityLayer}
                onLayerDelete={deleteEntityLayer}
                onLayerSelect={selectLayer}
                onLayerToggleVisibility={toggleLayerVisibility}
                onLayerToggleLock={toggleLayerLock}
                onLayerReorder={reorderLayers}
              />
            </div>
          </div>
        </div>
      )}

      {/* Entity Field Editor Modal */}
      {editingEntityId && getEditingEntity() && getEditingEntityDefinition() && (
        <EntityFieldEditor
          entity={getEditingEntity()!}
          definition={getEditingEntityDefinition()!}
          onUpdateEntity={updateEntityInstance}
          onClose={() => setEditingEntityId(null)}
        />
      )}
    </div>
  );
}