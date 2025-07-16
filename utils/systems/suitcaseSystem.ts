import { GameState, PhaserSceneContext, Suitcase, Position, PhaserText } from '@/types/game';
import { GAME_CONFIG, SPRITE_NAMES, COLORS } from '../gameConstants';

export function initializeSuitcaseSystem(scene: PhaserSceneContext, gameState: GameState): void {
  const now = scene.time.now;
  gameState.suitcaseSpawnState.lastSpawnTime = now;
  gameState.suitcaseSpawnState.nextSpawnTime = now + getRandomSpawnInterval();
  
  // Create suitcase interaction prompt
  gameState.suitcaseInteractPrompt = scene.add.text(0, 0, "Untersuchen [F]", {
    fontSize: "14px",
    color: COLORS.UI.TEXT_PRIMARY,
    backgroundColor: COLORS.UI.INTERACT_BG,
    padding: { x: 8, y: 4 },
  });
  gameState.suitcaseInteractPrompt.setOrigin?.(0.5);
  gameState.suitcaseInteractPrompt.setVisible?.(false);
  
  // Create feedback text for interactions
  gameState.feedbackText = scene.add.text(GAME_CONFIG.CANVAS.WIDTH / 2, 50, "", {
    fontSize: "18px",
    color: COLORS.UI.TEXT_PRIMARY,
    backgroundColor: COLORS.UI.DIALOG_BG,
    padding: { x: 12, y: 6 },
    fontFamily: "Arial, sans-serif",
  });
  gameState.feedbackText.setOrigin?.(0.5);
  gameState.feedbackText.setVisible?.(false);
}

export function updateSuitcaseSystem(scene: PhaserSceneContext, gameState: GameState): void {
  const now = scene.time.now;
  
  // Check if it's time to spawn a new suitcase
  if (now >= gameState.suitcaseSpawnState.nextSpawnTime && 
      gameState.suitcases.length < GAME_CONFIG.SUITCASE.MAX_ACTIVE) {
    spawnSuitcase(scene, gameState);
    gameState.suitcaseSpawnState.lastSpawnTime = now;
    gameState.suitcaseSpawnState.nextSpawnTime = now + getRandomSpawnInterval();
  }
  
  // Update washing up animations
  updateWashUpAnimations(scene, gameState);
  
  // Handle suitcase interactions and visual indicators
  handleSuitcaseInteractions(gameState);
  updateSuitcaseVisualIndicators(gameState);
}

function spawnSuitcase(scene: PhaserSceneContext, gameState: GameState): void {
  const targetPosition = getRandomBeachShorePosition();
  const waterPosition = getWaterSpawnPosition(targetPosition);
  const suitcaseId = `suitcase_${Date.now()}_${Math.random()}`;
  
  const suitcaseSprite = scene.physics.add.sprite(
    waterPosition.x, 
    waterPosition.y, 
    SPRITE_NAMES.OBJECTS.SUITCASE
  );
  
  suitcaseSprite.setCollideWorldBounds?.(true);
  suitcaseSprite.body?.setImmovable(true);
  
  const suitcase: Suitcase = {
    id: suitcaseId,
    sprite: suitcaseSprite,
    position: waterPosition,
    isWashingUp: true,
    targetPosition: targetPosition,
    washUpStartTime: scene.time.now
  };
  
  gameState.suitcases.push(suitcase);
}

function getRandomBeachShorePosition(): Position {
  // Generate positions along the shore (border between sand and water)
  const shoreY = 16 * GAME_CONFIG.MAP.TILE_SIZE - 32; // Just above the water line
  const mapWidth = GAME_CONFIG.MAP.WIDTH * GAME_CONFIG.MAP.TILE_SIZE;
  
  // Avoid spawning too close to edges and in the middle road area
  const margin = 64;
  const roadStartX = 12 * GAME_CONFIG.MAP.TILE_SIZE;
  const roadEndX = 14 * GAME_CONFIG.MAP.TILE_SIZE;
  
  let x: number;
  do {
    x = margin + Math.random() * (mapWidth - 2 * margin);
  } while (x >= roadStartX - 32 && x <= roadEndX + 32); // Avoid the road area
  
  return { x, y: shoreY };
}

function getWaterSpawnPosition(targetPosition: Position): Position {
  // Spawn suitcase in the water, south of the target position
  return {
    x: targetPosition.x,
    y: targetPosition.y + 80 + Math.random() * 40 // Spawn 80-120 pixels south in water
  };
}

function getRandomSpawnInterval(): number {
  const { MIN, MAX } = GAME_CONFIG.SUITCASE.SPAWN_INTERVAL;
  return MIN + Math.random() * (MAX - MIN);
}

function handleSuitcaseInteractions(gameState: GameState): void {
  if (!gameState.player || !gameState.fKey || gameState.isDialogOpen) return;
  
  // Check if F key was just pressed
  const fPressed = gameState.fKey.isDown && !gameState.fKey.wasDown;
  if (!fPressed) return;
  
  // Find the closest suitcase within interaction distance
  const closestSuitcase = findClosestSuitcase(gameState);
  if (closestSuitcase) {
    interactWithSuitcase(gameState, closestSuitcase);
  }
}

function findClosestSuitcase(gameState: GameState): Suitcase | null {
  if (!gameState.player) return null;
  
  let closestSuitcase: Suitcase | null = null;
  let closestDistance: number = GAME_CONFIG.SUITCASE.INTERACTION_DISTANCE;
  
  for (const suitcase of gameState.suitcases) {
    // Only consider suitcases that have finished washing up
    if (suitcase.isWashingUp) continue;
    
    const distance = Math.sqrt(
      Math.pow(gameState.player.x - suitcase.sprite.x, 2) + 
      Math.pow(gameState.player.y - suitcase.sprite.y, 2)
    );
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestSuitcase = suitcase;
    }
  }
  
  return closestSuitcase;
}

function interactWithSuitcase(gameState: GameState, suitcase: Suitcase): void {
  // Remove suitcase from the game
  suitcase.sprite.setVisible?.(false);
  if (gameState.collisionLayer) {
    // Note: In a real implementation, we'd need a way to remove from the collision layer
    // For now, we'll just make it invisible and non-interactive
  }
  
  // Remove from suitcases array
  gameState.suitcases = gameState.suitcases.filter(s => s.id !== suitcase.id);
  
  // Show feedback message
  showFeedbackMessage(gameState, "Du hast einen Koffer geöffnet!");
  
  // TODO: In Phase 2, this will open a loot modal instead
}

function showFeedbackMessage(gameState: GameState, message: string): void {
  if (!gameState.feedbackText) return;
  
  gameState.feedbackText.setText?.(message);
  gameState.feedbackText.setVisible?.(true);
  
  // Hide the message after 3 seconds
  setTimeout(() => {
    if (gameState.feedbackText) {
      gameState.feedbackText.setVisible?.(false);
    }
  }, 3000);
}

export function getInteractableSuitcase(gameState: GameState): Suitcase | null {
  return findClosestSuitcase(gameState);
}

function updateSuitcaseVisualIndicators(gameState: GameState): void {
  if (!gameState.player || !gameState.suitcaseInteractPrompt || gameState.isDialogOpen) return;
  
  const closestSuitcase = findClosestSuitcase(gameState);
  
  if (closestSuitcase) {
    // Position the prompt above the suitcase
    gameState.suitcaseInteractPrompt.x = closestSuitcase.sprite.x;
    gameState.suitcaseInteractPrompt.y = closestSuitcase.sprite.y - 40;
    gameState.suitcaseInteractPrompt.setVisible?.(true);
  } else {
    gameState.suitcaseInteractPrompt.setVisible?.(false);
  }
}

function updateWashUpAnimations(scene: PhaserSceneContext, gameState: GameState): void {
  const WASH_UP_DURATION = 4000; // 4 seconds to wash up
  
  gameState.suitcases.forEach(suitcase => {
    if (!suitcase.isWashingUp) return;
    
    const elapsed = scene.time.now - suitcase.washUpStartTime;
    const progress = Math.min(elapsed / WASH_UP_DURATION, 1);
    
    if (progress >= 1) {
      // Animation complete
      suitcase.isWashingUp = false;
      suitcase.sprite.x = suitcase.targetPosition.x;
      suitcase.sprite.y = suitcase.targetPosition.y;
      suitcase.position = suitcase.targetPosition;
      
      // Add to collision layer once it reaches shore
      if (gameState.collisionLayer) {
        gameState.collisionLayer.add(suitcase.sprite);
      }
    } else {
      // Smooth interpolation from water to shore
      const easeProgress = easeInOutCubic(progress);
      suitcase.sprite.x = lerp(suitcase.position.x, suitcase.targetPosition.x, easeProgress);
      suitcase.sprite.y = lerp(suitcase.position.y, suitcase.targetPosition.y, easeProgress);
    }
  });
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}