import { PhaserSceneContext } from '@/types/game';
import { SPRITE_NAMES } from '../gameConstants';

export function preloadSprites(scene: PhaserSceneContext): void {
  // Load working tileset
  scene.load.image('woods_tileset', '/tilesets/free_pixel_16_woods.png');
  
  // Load terrain sprites from woods tileset (16x16)
  scene.load.spritesheet(SPRITE_NAMES.TERRAIN.GRASS, '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  scene.load.spritesheet(SPRITE_NAMES.TERRAIN.SAND, '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  scene.load.spritesheet(SPRITE_NAMES.TERRAIN.DIRT, '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  // Load water sprites from woods tileset
  scene.load.spritesheet(SPRITE_NAMES.WATER[0], '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  scene.load.spritesheet(SPRITE_NAMES.WATER[1], '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  scene.load.spritesheet(SPRITE_NAMES.WATER[2], '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  // Create sprites for player and characters from woods tileset
  scene.load.spritesheet(SPRITE_NAMES.PLAYER.IDLE, '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  scene.load.spritesheet(SPRITE_NAMES.PLAYER.WALK1, '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  scene.load.spritesheet(SPRITE_NAMES.PLAYER.WALK2, '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  // Load object sprites from woods tileset
  scene.load.spritesheet('chest', '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  scene.load.spritesheet('rock_in_water', '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  scene.load.spritesheet('fence', '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  scene.load.spritesheet('rock', '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  // Load NPC sprite from woods tileset
  scene.load.spritesheet('npc', '/tilesets/free_pixel_16_woods.png', {
    frameWidth: 16,
    frameHeight: 16
  });
  
  // Note: BUSH, PLANE, and SUITCASE sprites are generated programmatically
  // in their respective sprite creation functions, so we don't preload them here
}