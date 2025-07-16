import { GameState, PhaserSceneContext, FKey } from '@/types/game';

export function initializeControls(scene: PhaserSceneContext, gameState: GameState): void {
  if (!scene.input?.keyboard) return;

  gameState.cursors = scene.input.keyboard.createCursorKeys();
  gameState.wasd = scene.input.keyboard.addKeys("W,S,A,D");
  gameState.fKey = scene.input.keyboard.addKey("F") as FKey;

  if (gameState.fKey) {
    gameState.fKey.wasDown = false;
  }
}