import { PhaserSceneContext } from '@/types/game';
import { SPRITE_NAMES } from '../gameConstants';

export function createPlayerSprites(scene: PhaserSceneContext): void {
  // Create player animations from the loaded sprite sheet
  createPlayerAnimations(scene);
}

function createPlayerAnimations(scene: PhaserSceneContext): void {
  // Create idle animation (rows 0-2, frames 0-5 per row)
  scene.anims.create({
    key: 'player_idle',
    frames: scene.anims.generateFrameNumbers(SPRITE_NAMES.PLAYER.IDLE, { start: 0, end: 5 }),
    frameRate: 6,
    repeat: -1
  });
  
  // Create walk animation (rows 3-5, frames 0-5 per row)
  scene.anims.create({
    key: 'player_walk',
    frames: scene.anims.generateFrameNumbers(SPRITE_NAMES.PLAYER.WALK1, { start: 18, end: 23 }),
    frameRate: 10,
    repeat: -1
  });
}