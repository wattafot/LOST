import { PhaserSceneContext } from '@/types/game';
import { SPRITE_NAMES } from '../gameConstants';

export function createTerrainTextures(scene: PhaserSceneContext): void {
  createGrassTexture(scene);
  createSandTexture(scene);
  createDirtTexture(scene);
}

export function createWaterTextures(scene: PhaserSceneContext): void {
  createWaterTexture(scene, SPRITE_NAMES.WATER[0]);
  createWaterTexture(scene, SPRITE_NAMES.WATER[1], 0.8);
  createWaterTexture(scene, SPRITE_NAMES.WATER[2], 1.2);
}

export function createObjectSprites(scene: PhaserSceneContext): void {
  createBushSprite(scene);
  createPlaneSprite(scene);
  createSuitcaseSprite(scene);
}

export function createNPCSprite(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  graphics.fillStyle(0xfdbcb4);
  graphics.fillEllipse(16, 12, 12, 14);
  
  graphics.fillStyle(0x654321);
  graphics.fillEllipse(16, 8, 14, 8);
  
  graphics.fillStyle(0xffffff);
  graphics.fillEllipse(13, 11, 3, 2);
  graphics.fillEllipse(19, 11, 3, 2);
  graphics.fillStyle(0x000000);
  graphics.fillCircle(13, 11, 1);
  graphics.fillCircle(19, 11, 1);
  
  graphics.fillStyle(0x8b4513);
  graphics.fillEllipse(16, 15, 3, 2);
  
  graphics.fillStyle(0x228b22);
  graphics.fillRect(11, 18, 10, 12);
  
  graphics.fillStyle(0xfdbcb4);
  graphics.fillRect(8, 20, 3, 8);
  graphics.fillRect(21, 20, 3, 8);
  
  graphics.fillStyle(0x8b4513);
  graphics.fillRect(12, 30, 3, 10);
  graphics.fillRect(17, 30, 3, 10);
  
  graphics.fillStyle(0x654321);
  graphics.fillRect(11, 40, 4, 3);
  graphics.fillRect(17, 40, 4, 3);
  
  graphics.generateTexture(SPRITE_NAMES.NPC, 32, 44);
  graphics.destroy();
}

function createGrassTexture(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x228b22);
  graphics.fillRect(0, 0, 32, 32);
  graphics.fillStyle(0x32cd32);
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 32;
    const y = Math.random() * 32;
    graphics.fillRect(x, y, 1, 2);
  }
  graphics.generateTexture(SPRITE_NAMES.TERRAIN.GRASS, 32, 32);
  graphics.destroy();
}

function createSandTexture(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0xf4a460);
  graphics.fillRect(0, 0, 32, 32);
  graphics.fillStyle(0xdaa520);
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 32;
    const y = Math.random() * 32;
    graphics.fillCircle(x, y, 1);
  }
  graphics.generateTexture(SPRITE_NAMES.TERRAIN.SAND, 32, 32);
  graphics.destroy();
}

function createDirtTexture(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x8b4513);
  graphics.fillRect(0, 0, 32, 32);
  graphics.fillStyle(0x654321);
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * 32;
    const y = Math.random() * 32;
    graphics.fillRect(x, y, 2, 1);
  }
  graphics.generateTexture(SPRITE_NAMES.TERRAIN.DIRT, 32, 32);
  graphics.destroy();
}

function createWaterTexture(scene: PhaserSceneContext, name: string, opacity: number = 1): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x4682b4, opacity);
  graphics.fillRect(0, 0, 32, 32);
  graphics.fillStyle(0x87ceeb, opacity * 0.7);
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * 32;
    const y = Math.random() * 32;
    graphics.fillCircle(x, y, 2);
  }
  graphics.generateTexture(name, 32, 32);
  graphics.destroy();
}


function createBushSprite(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x228b22);
  graphics.fillCircle(12, 12, 10);
  graphics.fillCircle(20, 10, 8);
  graphics.fillCircle(8, 18, 6);
  graphics.fillCircle(18, 20, 7);
  graphics.generateTexture(SPRITE_NAMES.OBJECTS.BUSH, 32, 32);
  graphics.destroy();
}

function createPlaneSprite(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  graphics.fillStyle(0xc0c0c0);
  graphics.fillEllipse(110, 40, 200, 60);
  
  graphics.fillStyle(0x87929e);
  graphics.fillEllipse(20, 40, 60, 25);
  graphics.fillEllipse(180, 35, 80, 20);
  
  graphics.fillStyle(0x708090);
  graphics.fillRect(40, 15, 140, 8);
  graphics.fillRect(80, 65, 60, 6);
  
  graphics.fillStyle(0x2c3e50);
  graphics.fillRect(150, 25, 20, 30);
  graphics.fillStyle(0x1a1a1a);
  graphics.fillRect(155, 20, 10, 10);
  
  graphics.fillStyle(0x85929e);
  graphics.fillRect(10, 10, 8, 12);
  graphics.fillRect(200, 75, 12, 8);
  graphics.fillRect(25, 75, 10, 6);
  
  graphics.generateTexture(SPRITE_NAMES.OBJECTS.PLANE, 220, 80);
  graphics.destroy();
}

function createSuitcaseSprite(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  // Main suitcase body (dark brown/leather color)
  graphics.fillStyle(0x654321);
  graphics.fillRoundedRect(2, 8, 28, 18, 2);
  
  // Suitcase handle (metallic)
  graphics.fillStyle(0x808080);
  graphics.fillRoundedRect(13, 4, 6, 6, 1);
  graphics.fillStyle(0x000000);
  graphics.fillRoundedRect(14, 5, 4, 4, 1);
  
  // Corner reinforcements (metallic corners)
  graphics.fillStyle(0x708090);
  graphics.fillRect(2, 8, 3, 3);
  graphics.fillRect(27, 8, 3, 3);
  graphics.fillRect(2, 23, 3, 3);
  graphics.fillRect(27, 23, 3, 3);
  
  // Locks/clasps
  graphics.fillStyle(0x2c2c2c);
  graphics.fillRect(8, 7, 2, 2);
  graphics.fillRect(22, 7, 2, 2);
  
  // Handle strap details
  graphics.fillStyle(0x4a3728);
  graphics.fillRect(6, 6, 2, 1);
  graphics.fillRect(24, 6, 2, 1);
  
  graphics.generateTexture(SPRITE_NAMES.OBJECTS.SUITCASE, 32, 32);
  graphics.destroy();
}