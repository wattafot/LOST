import { PhaserSceneContext } from '@/types/game';
import { SPRITE_NAMES, COLORS } from '../gameConstants';

export function createParrotSprites(scene: PhaserSceneContext): void {
  createParrotFront(scene);
  createParrotLeft(scene);
  createParrotRight(scene);
  createParrotFrontFlap(scene);
  createParrotLeftFlap(scene);
  createParrotRightFlap(scene);
}

export function createSnakeSprite(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();

  graphics.fillStyle(COLORS.SNAKE.BODY);
  
  graphics.fillEllipse(6, 16, 8, 6);
  graphics.fillEllipse(10, 16, 7, 5);
  graphics.fillEllipse(14, 16, 7, 5);
  graphics.fillEllipse(18, 16, 7, 5);
  graphics.fillEllipse(22, 16, 7, 5);
  graphics.fillEllipse(26, 16, 7, 5);
  graphics.fillEllipse(30, 16, 6, 4);
  graphics.fillEllipse(34, 16, 5, 4);
  graphics.fillEllipse(38, 16, 4, 3);
  graphics.fillEllipse(42, 16, 3, 3);
  graphics.fillEllipse(45, 16, 2, 2);

  graphics.fillStyle(COLORS.SNAKE.PATTERN);
  graphics.fillEllipse(8, 16, 4, 2);
  graphics.fillEllipse(14, 16, 4, 2);
  graphics.fillEllipse(20, 16, 4, 2);
  graphics.fillEllipse(26, 16, 4, 2);
  graphics.fillEllipse(32, 16, 3, 2);
  graphics.fillEllipse(38, 16, 3, 2);
  graphics.fillEllipse(42, 16, 2, 1);

  graphics.fillStyle(COLORS.SNAKE.TONGUE);
  graphics.fillRect(2, 15, 3, 1);
  graphics.fillRect(1, 14, 1, 1);
  graphics.fillRect(1, 16, 1, 1);

  graphics.fillStyle(COLORS.SNAKE.EYES);
  graphics.fillCircle(5, 14, 1);
  graphics.fillCircle(7, 14, 1);
  graphics.fillStyle(COLORS.SNAKE.PUPILS);
  graphics.fillCircle(5, 14, 0.5);
  graphics.fillCircle(7, 14, 0.5);

  graphics.generateTexture(SPRITE_NAMES.SNAKE, 48, 32);
  graphics.destroy();
}

function createParrotBase(graphics: any, withFlapping: boolean = false): void {
  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(16, 20, 16, 24);

  graphics.fillStyle(COLORS.PARROT.HEAD);
  graphics.fillCircle(16, 12, 8);

  graphics.fillStyle(COLORS.PARROT.BEAK);
  graphics.fillEllipse(16, 16, 4, 6);
}

function createParrotFront(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  createParrotBase(graphics);

  graphics.fillStyle(COLORS.PARROT.WINGS);
  graphics.fillEllipse(10, 18, 10, 14);
  graphics.fillEllipse(22, 18, 10, 14);
  
  graphics.fillStyle(COLORS.PARROT.WINGS);
  graphics.fillEllipse(10, 18, 6, 10);
  graphics.fillEllipse(22, 18, 6, 10);

  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(16, 28, 6, 8);

  graphics.fillStyle(COLORS.PARROT.EYES);
  graphics.fillCircle(14, 10, 2);
  graphics.fillCircle(18, 10, 2);
  graphics.fillStyle(COLORS.PARROT.EYE_HIGHLIGHT);
  graphics.fillCircle(14, 9, 1);
  graphics.fillCircle(18, 9, 1);

  graphics.fillStyle(COLORS.PARROT.FEET);
  graphics.fillRect(12, 32, 2, 4);
  graphics.fillRect(20, 32, 2, 4);

  graphics.generateTexture(SPRITE_NAMES.PARROT.FRONT, 32, 36);
  graphics.destroy();
}

function createParrotLeft(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(16, 20, 20, 16);

  graphics.fillStyle(COLORS.PARROT.HEAD);
  graphics.fillCircle(12, 12, 8);

  graphics.fillStyle(COLORS.PARROT.BEAK);
  graphics.fillEllipse(6, 12, 8, 4);

  graphics.fillStyle(COLORS.PARROT.WINGS);
  graphics.fillEllipse(18, 16, 12, 20);
  graphics.fillEllipse(20, 16, 8, 16);

  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(26, 20, 8, 12);

  graphics.fillStyle(COLORS.PARROT.EYES);
  graphics.fillCircle(10, 10, 2);
  graphics.fillStyle(COLORS.PARROT.EYE_HIGHLIGHT);
  graphics.fillCircle(10, 9, 1);

  graphics.fillStyle(COLORS.PARROT.FEET);
  graphics.fillRect(14, 32, 2, 4);
  graphics.fillRect(18, 32, 2, 4);

  graphics.generateTexture(SPRITE_NAMES.PARROT.LEFT, 32, 36);
  graphics.destroy();
}

function createParrotRight(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(16, 20, 20, 16);

  graphics.fillStyle(COLORS.PARROT.HEAD);
  graphics.fillCircle(20, 12, 8);

  graphics.fillStyle(COLORS.PARROT.BEAK);
  graphics.fillEllipse(26, 12, 8, 4);

  graphics.fillStyle(COLORS.PARROT.WINGS);
  graphics.fillEllipse(14, 16, 12, 20);
  graphics.fillEllipse(12, 16, 8, 16);

  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(6, 20, 8, 12);

  graphics.fillStyle(COLORS.PARROT.EYES);
  graphics.fillCircle(22, 10, 2);
  graphics.fillStyle(COLORS.PARROT.EYE_HIGHLIGHT);
  graphics.fillCircle(22, 9, 1);

  graphics.fillStyle(COLORS.PARROT.FEET);
  graphics.fillRect(12, 32, 2, 4);
  graphics.fillRect(16, 32, 2, 4);

  graphics.generateTexture(SPRITE_NAMES.PARROT.RIGHT, 32, 36);
  graphics.destroy();
}

function createParrotFrontFlap(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  createParrotBase(graphics);

  graphics.fillStyle(COLORS.PARROT.WINGS);
  graphics.fillEllipse(8, 14, 12, 16);
  graphics.fillEllipse(24, 14, 12, 16);
  
  graphics.fillStyle(COLORS.PARROT.WINGS);
  graphics.fillEllipse(8, 14, 8, 12);
  graphics.fillEllipse(24, 14, 8, 12);

  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(16, 28, 6, 8);

  graphics.fillStyle(COLORS.PARROT.EYES);
  graphics.fillCircle(14, 10, 2);
  graphics.fillCircle(18, 10, 2);
  graphics.fillStyle(COLORS.PARROT.EYE_HIGHLIGHT);
  graphics.fillCircle(14, 9, 1);
  graphics.fillCircle(18, 9, 1);

  graphics.fillStyle(COLORS.PARROT.FEET);
  graphics.fillRect(12, 32, 2, 4);
  graphics.fillRect(20, 32, 2, 4);

  graphics.generateTexture(SPRITE_NAMES.PARROT.FRONT_FLAP, 32, 36);
  graphics.destroy();
}

function createParrotLeftFlap(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(16, 20, 20, 16);

  graphics.fillStyle(COLORS.PARROT.HEAD);
  graphics.fillCircle(12, 12, 8);

  graphics.fillStyle(COLORS.PARROT.BEAK);
  graphics.fillEllipse(6, 12, 8, 4);

  graphics.fillStyle(COLORS.PARROT.WINGS);
  graphics.fillEllipse(18, 12, 14, 24);
  graphics.fillEllipse(20, 12, 10, 20);

  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(26, 20, 8, 12);

  graphics.fillStyle(COLORS.PARROT.EYES);
  graphics.fillCircle(10, 10, 2);
  graphics.fillStyle(COLORS.PARROT.EYE_HIGHLIGHT);
  graphics.fillCircle(10, 9, 1);

  graphics.fillStyle(COLORS.PARROT.FEET);
  graphics.fillRect(14, 32, 2, 4);
  graphics.fillRect(18, 32, 2, 4);

  graphics.generateTexture(SPRITE_NAMES.PARROT.LEFT_FLAP, 32, 36);
  graphics.destroy();
}

function createParrotRightFlap(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(16, 20, 20, 16);

  graphics.fillStyle(COLORS.PARROT.HEAD);
  graphics.fillCircle(20, 12, 8);

  graphics.fillStyle(COLORS.PARROT.BEAK);
  graphics.fillEllipse(26, 12, 8, 4);

  graphics.fillStyle(COLORS.PARROT.WINGS);
  graphics.fillEllipse(14, 12, 14, 24);
  graphics.fillEllipse(12, 12, 10, 20);

  graphics.fillStyle(COLORS.PARROT.BODY);
  graphics.fillEllipse(6, 20, 8, 12);

  graphics.fillStyle(COLORS.PARROT.EYES);
  graphics.fillCircle(22, 10, 2);
  graphics.fillStyle(COLORS.PARROT.EYE_HIGHLIGHT);
  graphics.fillCircle(22, 9, 1);

  graphics.fillStyle(COLORS.PARROT.FEET);
  graphics.fillRect(12, 32, 2, 4);
  graphics.fillRect(16, 32, 2, 4);

  graphics.generateTexture(SPRITE_NAMES.PARROT.RIGHT_FLAP, 32, 36);
  graphics.destroy();
}