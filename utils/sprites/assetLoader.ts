import { PhaserSceneContext } from '@/types/game';
import { SPRITE_NAMES } from '../gameConstants';

export function preloadSprites(scene: PhaserSceneContext): void {
  // Load terrain sprites
  scene.load.image(SPRITE_NAMES.TERRAIN.GRASS, '/sprites/tilesets/grass.png');
  scene.load.image(SPRITE_NAMES.TERRAIN.SAND, '/sprites/tilesets/floors/flooring.png'); // Using flooring for sand areas
  scene.load.image(SPRITE_NAMES.TERRAIN.DIRT, '/sprites/tilesets/floors/flooring.png');
  
  // Load water sprites - using individual water files
  scene.load.image(SPRITE_NAMES.WATER[0], '/sprites/tilesets/water1.png');
  scene.load.image(SPRITE_NAMES.WATER[1], '/sprites/tilesets/water2.png');
  scene.load.image(SPRITE_NAMES.WATER[2], '/sprites/tilesets/water3.png');
  
  // Load player sprite sheet (48x48 grid)
  scene.load.spritesheet(SPRITE_NAMES.PLAYER.IDLE, '/sprites/characters/player.png', {
    frameWidth: 48,
    frameHeight: 48
  });
  
  // Use same player sprite for walk animations
  scene.load.spritesheet(SPRITE_NAMES.PLAYER.WALK1, '/sprites/characters/player.png', {
    frameWidth: 48,
    frameHeight: 48
  });
  scene.load.spritesheet(SPRITE_NAMES.PLAYER.WALK2, '/sprites/characters/player.png', {
    frameWidth: 48,
    frameHeight: 48
  });
  
  // Load object sprites
  scene.load.image('chest', '/sprites/objects/chest_01.png');
  scene.load.image('rock_in_water', '/sprites/objects/rock_in_water_01.png');
  
  // Load additional sprites for level editor compatibility
  scene.load.image('fence', '/sprites/tilesets/fences.png');
  scene.load.image('rock', '/sprites/objects/rock_in_water_01.png');
  
  // Load NPC sprite (can use skeleton or another character)
  scene.load.spritesheet('npc', '/sprites/characters/skeleton.png', {
    frameWidth: 48,
    frameHeight: 48
  });
  
  // Note: BUSH, PLANE, and SUITCASE sprites are generated programmatically
  // in their respective sprite creation functions, so we don't preload them here
}