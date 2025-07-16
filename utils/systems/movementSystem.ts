import { GameState, PhaserSceneContext } from '@/types/game';
import { GAME_CONFIG, SPRITE_NAMES } from '../gameConstants';

export function handlePlayerMovement(gameState: GameState, scene: PhaserSceneContext): void {
  if (!gameState.player?.body || gameState.isDialogOpen) return;

  const { SPEED } = GAME_CONFIG.PLAYER;
  let velocityX = 0;
  let velocityY = 0;
  let isMoving = false;

  if (gameState.cursors?.left?.isDown || gameState.wasd?.A?.isDown) {
    velocityX = -SPEED;
    isMoving = true;
  }
  if (gameState.cursors?.right?.isDown || gameState.wasd?.D?.isDown) {
    velocityX = SPEED;
    isMoving = true;
  }
  if (gameState.cursors?.up?.isDown || gameState.wasd?.W?.isDown) {
    velocityY = -SPEED;
    isMoving = true;
  }
  if (gameState.cursors?.down?.isDown || gameState.wasd?.S?.isDown) {
    velocityY = SPEED;
    isMoving = true;
  }

  if (velocityX !== 0 && velocityY !== 0) {
    const normalizedSpeed = SPEED / Math.sqrt(2);
    velocityX = velocityX > 0 ? normalizedSpeed : -normalizedSpeed;
    velocityY = velocityY > 0 ? normalizedSpeed : -normalizedSpeed;
  }

  gameState.player.body.setVelocity(velocityX, velocityY);
  updatePlayerSprite(gameState, scene, isMoving);
}

function updatePlayerSprite(gameState: GameState, scene: PhaserSceneContext, isMoving: boolean): void {
  if (!gameState.player) return;

  if (isMoving) {
    const walkSpeed = 300;
    const walkFrame = Math.floor(scene.time.now / walkSpeed) % 2;
    const texture = walkFrame === 0 ? SPRITE_NAMES.PLAYER.WALK1 : SPRITE_NAMES.PLAYER.WALK2;
    gameState.player.setTexture?.(texture);
  } else {
    gameState.player.setTexture?.(SPRITE_NAMES.PLAYER.IDLE);
  }
}