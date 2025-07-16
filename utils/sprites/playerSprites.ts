import { PhaserSceneContext } from '@/types/game';
import { SPRITE_NAMES } from '../gameConstants';

export function createPlayerSprites(scene: PhaserSceneContext): void {
  createPlayerIdle(scene);
  createPlayerWalkFrames(scene);
}

function createPlayerIdle(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  graphics.fillStyle(0xfdbcb4);
  graphics.fillEllipse(16, 12, 12, 14);
  
  graphics.fillStyle(0x8b4513);
  graphics.fillEllipse(16, 8, 14, 8);
  
  graphics.fillStyle(0xffffff);
  graphics.fillEllipse(13, 11, 3, 2);
  graphics.fillEllipse(19, 11, 3, 2);
  graphics.fillStyle(0x000000);
  graphics.fillCircle(13, 11, 1);
  graphics.fillCircle(19, 11, 1);
  
  graphics.fillStyle(0x000000);
  graphics.fillEllipse(16, 15, 2, 1);
  
  graphics.fillStyle(0x3498db);
  graphics.fillRect(11, 18, 10, 12);
  
  graphics.fillStyle(0xfdbcb4);
  graphics.fillRect(8, 20, 3, 8);
  graphics.fillRect(21, 20, 3, 8);
  
  graphics.fillStyle(0x2c3e50);
  graphics.fillRect(12, 30, 3, 10);
  graphics.fillRect(17, 30, 3, 10);
  
  graphics.fillStyle(0x8b4513);
  graphics.fillRect(11, 40, 4, 3);
  graphics.fillRect(17, 40, 4, 3);
  
  graphics.generateTexture(SPRITE_NAMES.PLAYER.IDLE, 32, 44);
  graphics.destroy();
}

function createPlayerWalkFrames(scene: PhaserSceneContext): void {
  createWalkFrame1(scene);
  createWalkFrame2(scene);
}

function createWalkFrame1(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  graphics.fillStyle(0xfdbcb4);
  graphics.fillEllipse(16, 12, 12, 14);
  
  graphics.fillStyle(0x8b4513);
  graphics.fillEllipse(16, 8, 14, 8);
  
  graphics.fillStyle(0xffffff);
  graphics.fillEllipse(13, 11, 3, 2);
  graphics.fillEllipse(19, 11, 3, 2);
  graphics.fillStyle(0x000000);
  graphics.fillCircle(13, 11, 1);
  graphics.fillCircle(19, 11, 1);
  
  graphics.fillStyle(0x000000);
  graphics.fillEllipse(16, 15, 2, 1);
  
  graphics.fillStyle(0x3498db);
  graphics.fillRect(11, 18, 10, 12);
  
  graphics.fillStyle(0xfdbcb4);
  graphics.fillRect(9, 20, 3, 8);
  graphics.fillRect(20, 20, 3, 8);
  
  graphics.fillStyle(0x2c3e50);
  graphics.fillRect(11, 30, 3, 10);
  graphics.fillRect(18, 30, 3, 10);
  
  graphics.fillStyle(0x8b4513);
  graphics.fillRect(10, 40, 4, 3);
  graphics.fillRect(18, 40, 4, 3);
  
  graphics.generateTexture(SPRITE_NAMES.PLAYER.WALK1, 32, 44);
  graphics.destroy();
}

function createWalkFrame2(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  graphics.fillStyle(0xfdbcb4);
  graphics.fillEllipse(16, 12, 12, 14);
  
  graphics.fillStyle(0x8b4513);
  graphics.fillEllipse(16, 8, 14, 8);
  
  graphics.fillStyle(0xffffff);
  graphics.fillEllipse(13, 11, 3, 2);
  graphics.fillEllipse(19, 11, 3, 2);
  graphics.fillStyle(0x000000);
  graphics.fillCircle(13, 11, 1);
  graphics.fillCircle(19, 11, 1);
  
  graphics.fillStyle(0x000000);
  graphics.fillEllipse(16, 15, 2, 1);
  
  graphics.fillStyle(0x3498db);
  graphics.fillRect(11, 18, 10, 12);
  
  graphics.fillStyle(0xfdbcb4);
  graphics.fillRect(8, 20, 3, 8);
  graphics.fillRect(21, 20, 3, 8);
  
  graphics.fillStyle(0x2c3e50);
  graphics.fillRect(17, 30, 3, 10);
  graphics.fillRect(12, 30, 3, 10);
  
  graphics.fillStyle(0x8b4513);
  graphics.fillRect(17, 40, 4, 3);
  graphics.fillRect(11, 40, 4, 3);
  
  graphics.generateTexture(SPRITE_NAMES.PLAYER.WALK2, 32, 44);
  graphics.destroy();
}