import { GameObject, PhaserGroup, Position, PhaserSceneContext } from '@/types/game';
import { GAME_CONFIG, SPRITE_NAMES } from './gameConstants';

export function createCrashSiteMap(scene: PhaserSceneContext, collisionLayer: PhaserGroup): { 
  waterTiles: GameObject[], 
  palmTreePositions: Position[] 
} {
  const { WIDTH: mapWidth, HEIGHT: mapHeight, TILE_SIZE: tileSize } = GAME_CONFIG.MAP;
  const waterTiles: GameObject[] = [];

  // Grass/jungle area (top part of island)
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < 8; y++) {
      scene.add.image(x * tileSize, y * tileSize, SPRITE_NAMES.TERRAIN.GRASS).setOrigin?.(0, 0);
    }
  }

  // Add dirt road going north through the grass section (thinner)
  const roadCenterX = 12; // Center of the map (around x=12)

  for (let y = 0; y < 8; y++) {
    // Through the entire grass section
    // Make road only 2 tiles wide (center tile and one adjacent)
    scene.add
      .image(roadCenterX * tileSize, y * tileSize, SPRITE_NAMES.TERRAIN.DIRT)
      .setOrigin?.(0, 0);
    scene.add
      .image((roadCenterX + 1) * tileSize, y * tileSize, SPRITE_NAMES.TERRAIN.DIRT)
      .setOrigin?.(0, 0);
  }

  // Beach area in the middle
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 8; y < 16; y++) {
      scene.add.image(x * tileSize, y * tileSize, SPRITE_NAMES.TERRAIN.SAND).setOrigin?.(0, 0);
    }
  }

  // Ocean (bottom) - impassable water with animation
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 16; y < mapHeight; y++) {
      const waterTile = scene.add
        .image(x * tileSize, y * tileSize, SPRITE_NAMES.WATER[0]);
      waterTile.setOrigin?.(0, 0);
      waterTiles.push(waterTile);
      // Add water collision
      const waterCollision = scene.physics.add.sprite(
        x * tileSize + 16,
        y * tileSize + 16,
        SPRITE_NAMES.WATER[0]
      );
      waterCollision.setVisible?.(false);
      waterCollision.body?.setImmovable(true);
      collisionLayer.add(waterCollision);
    }
  }

  // Add plane wreckage
  addPlaneWreckage(scene, collisionLayer);

  // Add vegetation
  const palmTreePositions = addPalmTrees(scene, collisionLayer);
  addBushes(scene, collisionLayer);

  return { waterTiles, palmTreePositions };
}

function addPlaneWreckage(scene: PhaserSceneContext, collisionLayer: PhaserGroup) {
  // Add plane wreckage on the beach - main attraction! (positioned lower)
  const planeX = 300;
  const planeY = 380; // Moved down from 280 to 380
  scene.add.image(planeX, planeY, SPRITE_NAMES.OBJECTS.PLANE);
  
  // Add collision for plane wreckage
  const planeCollision = scene.physics.add.sprite(planeX, planeY, SPRITE_NAMES.OBJECTS.PLANE);
  planeCollision.setVisible?.(false);
  planeCollision.body?.setImmovable(true);
  planeCollision.body?.setSize(220, 80); // Set collision size to match the massive plane
  collisionLayer.add(planeCollision);

  // Add more plane pieces scattered around (positioned lower)
  const planePiece1 = scene.add.image(500, 450, SPRITE_NAMES.OBJECTS.PLANE);
  planePiece1.setScale?.(0.5);
  planePiece1.setRotation?.(0.5);
  const planePiece1Collision = scene.physics.add.sprite(500, 450, SPRITE_NAMES.OBJECTS.PLANE);
  planePiece1Collision.setVisible?.(false);
  planePiece1Collision.setScale?.(0.5);
  planePiece1Collision.body?.setSize(110, 40); // Half the size of main plane collision
  planePiece1Collision.body?.setImmovable(true);
  collisionLayer.add(planePiece1Collision);
}

function addPalmTrees(scene: PhaserSceneContext, collisionLayer: PhaserGroup): Position[] {
  // Palm tree positions with variety in types and scales
  const palmPositions: Position[] = [
    // Left side of road - using different palm tree variants
    { x: 100, y: 100, scale: 1.1, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_1 },
    { x: 200, y: 60, scale: 0.9, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_3 },
    { x: 320, y: 120, scale: 1.2, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_2 },
    { x: 150, y: 180, scale: 1.0, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_1 },
    { x: 280, y: 40, scale: 0.8, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_3 },
    { x: 80, y: 160, scale: 0.9, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_2 },
    { x: 240, y: 140, scale: 0.7, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_3 },

    // Right side of road - mixed variants for natural look
    { x: 480, y: 140, scale: 1.0, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_2 },
    { x: 600, y: 80, scale: 0.8, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_1 },
    { x: 720, y: 160, scale: 0.9, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_3 },
    { x: 540, y: 50, scale: 0.85, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_1 },
    { x: 680, y: 120, scale: 1.05, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_2 },
    { x: 580, y: 180, scale: 1.1, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_1 },
    { x: 750, y: 100, scale: 1.15, variant: SPRITE_NAMES.OBJECTS.PALM_TREE_2 },
  ];

  palmPositions.forEach((pos) => {
    const variant = pos.variant || SPRITE_NAMES.OBJECTS.PALM_TREE_1;
    const palm = scene.add.image(pos.x, pos.y, variant);
    palm.setScale?.(pos.scale || 1.0);

    // Create collision sprite at the base of the tree
    const palmCollision = scene.physics.add.sprite(pos.x, pos.y + 64, variant);
    palmCollision.setVisible?.(false);
    palmCollision.body?.setSize(32, 32);
    palmCollision.body?.setImmovable(true);
    collisionLayer.add(palmCollision);
  });

  return palmPositions;
}

function addBushes(scene: PhaserSceneContext, collisionLayer: PhaserGroup): void {
  const bushPositions: Position[] = [
    { x: 130, y: 80 },
    { x: 170, y: 120 },
    { x: 260, y: 90 },
    { x: 110, y: 140 },
    { x: 300, y: 80 },
    { x: 190, y: 160 },
    { x: 250, y: 170 },
    { x: 340, y: 160 },
    { x: 460, y: 110 },
    { x: 620, y: 60 },
    { x: 700, y: 140 },
    { x: 520, y: 90 },
    { x: 660, y: 100 },
    { x: 600, y: 160 },
    { x: 730, y: 130 },
    { x: 560, y: 150 },
  ];

  bushPositions.forEach((pos) => {
    const bush = scene.add.image(pos.x, pos.y, SPRITE_NAMES.OBJECTS.BUSH);
    bush.setScale?.(0.5 + Math.random() * 0.4);

    if (Math.random() > 0.6) {
      const bushCollision = scene.physics.add.sprite(pos.x, pos.y, SPRITE_NAMES.OBJECTS.BUSH);
      bushCollision.setVisible?.(false);
      bushCollision.body?.setSize(12, 12);
      bushCollision.body?.setImmovable(true);
      collisionLayer.add(bushCollision);
    }
  });
}