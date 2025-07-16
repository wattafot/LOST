import { GameState, PhaserSceneContext } from '@/types/game';
import { GAME_CONFIG, SPRITE_NAMES } from '../gameConstants';

export function createAnimals(scene: PhaserSceneContext, gameState: GameState): void {
  // createParrot(scene, gameState); // Disabled until new palm trees are implemented
  createSnake(scene, gameState);
}

export function animateAnimals(gameState: GameState, scene: PhaserSceneContext): void {
  // animateParrot(gameState, scene); // Disabled until new palm trees are implemented
  animateSnake(gameState, scene);
}

function createParrot(scene: PhaserSceneContext, gameState: GameState): void {
  if (gameState.palmTreePositions.length === 0) return;

  const firstPalm = gameState.palmTreePositions[0];
  gameState.parrot = scene.physics.add.sprite(
    firstPalm.x, 
    firstPalm.y + GAME_CONFIG.PARROT.TREE_OFFSET_Y, 
    SPRITE_NAMES.PARROT.FRONT
  );
  gameState.parrot.setCollideWorldBounds?.(true);
  gameState.parrot.setScale?.(GAME_CONFIG.PARROT.SCALE);
}

function createSnake(scene: PhaserSceneContext, gameState: GameState): void {
  gameState.snake = scene.physics.add.sprite(
    GAME_CONFIG.SNAKE.START_X, 
    GAME_CONFIG.SNAKE.START_Y, 
    SPRITE_NAMES.SNAKE
  );
  gameState.snake.setCollideWorldBounds?.(true);
}

function animateParrot(gameState: GameState, scene: PhaserSceneContext): void {
  if (!gameState.parrot || gameState.palmTreePositions.length < 2) return;

  const { SPEED, WING_FLAP_SPEED, REST_DURATION } = GAME_CONFIG.PARROT;
  const time = scene.time.now;

  if (!gameState.parrotState.isFlying) {
    handleParrotResting(gameState, time, REST_DURATION);
  } else {
    handleParrotFlying(gameState, scene, time, SPEED, WING_FLAP_SPEED);
  }
}

function handleParrotResting(gameState: GameState, time: number, restDuration: typeof GAME_CONFIG.PARROT.REST_DURATION): void {
  gameState.parrot!.body?.setVelocity(0, 0);
  gameState.parrot!.setTexture?.(SPRITE_NAMES.PARROT.FRONT);

  if (gameState.parrotState.restStartTime === 0) {
    gameState.parrotState.restStartTime = time;
    gameState.parrotState.restDuration = restDuration.MIN + Math.random() * (restDuration.MAX - restDuration.MIN);
  } else if (time - gameState.parrotState.restStartTime > gameState.parrotState.restDuration) {
    startParrotFlight(gameState);
  }
}

function startParrotFlight(gameState: GameState): void {
  gameState.parrotState.isFlying = true;
  gameState.parrotState.restStartTime = 0;
  gameState.parrotState.currentTreeIndex = gameState.parrotState.targetTreeIndex;
  
  let nextIndex = Math.floor(Math.random() * gameState.palmTreePositions.length);
  while (nextIndex === gameState.parrotState.currentTreeIndex && gameState.palmTreePositions.length > 1) {
    nextIndex = Math.floor(Math.random() * gameState.palmTreePositions.length);
  }
  gameState.parrotState.targetTreeIndex = nextIndex;
}

function handleParrotFlying(gameState: GameState, scene: PhaserSceneContext, time: number, speed: number, wingFlapSpeed: number): void {
  const targetTree = gameState.palmTreePositions[gameState.parrotState.targetTreeIndex];
  const targetX = targetTree.x;
  const targetY = targetTree.y + GAME_CONFIG.PARROT.TREE_OFFSET_Y;

  const dx = targetX - gameState.parrot!.x;
  const dy = targetY - gameState.parrot!.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 15) {
    gameState.parrot!.body?.setVelocity(
      (dx / distance) * speed,
      (dy / distance) * speed
    );
    updateParrotSprite(gameState, time, dx, dy, wingFlapSpeed);
  } else {
    gameState.parrotState.isFlying = false;
    gameState.parrot!.body?.setVelocity(0, 0);
    gameState.parrot!.setTexture?.(SPRITE_NAMES.PARROT.FRONT);
  }
}

function updateParrotSprite(gameState: GameState, time: number, dx: number, dy: number, wingFlapSpeed: number): void {
  const isWingUp = Math.floor(time / wingFlapSpeed) % 2 === 0;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      gameState.parrot!.setTexture?.(isWingUp ? SPRITE_NAMES.PARROT.RIGHT_FLAP : SPRITE_NAMES.PARROT.RIGHT);
    } else {
      gameState.parrot!.setTexture?.(isWingUp ? SPRITE_NAMES.PARROT.LEFT_FLAP : SPRITE_NAMES.PARROT.LEFT);
    }
  } else {
    gameState.parrot!.setTexture?.(isWingUp ? SPRITE_NAMES.PARROT.FRONT_FLAP : SPRITE_NAMES.PARROT.FRONT);
  }
}

function animateSnake(gameState: GameState, scene: PhaserSceneContext): void {
  if (!gameState.snake) return;

  const { SPEED, SLITHER_CYCLE_DURATION, WAVE_AMPLITUDE, WAVE_FREQUENCY, BASE_Y, MOVEMENT_RANGE } = GAME_CONFIG.SNAKE;
  const time = scene.time.now;
  const slitherProgress = (time % SLITHER_CYCLE_DURATION) / SLITHER_CYCLE_DURATION;

  const baseX = 200 + slitherProgress * MOVEMENT_RANGE;
  const sineWave = Math.sin(slitherProgress * Math.PI * 2 * WAVE_FREQUENCY);
  const targetX = baseX;
  const targetY = BASE_Y + sineWave * WAVE_AMPLITUDE;

  const dx = targetX - gameState.snake.x;
  const dy = targetY - gameState.snake.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 1) {
    gameState.snake.body?.setVelocity(
      (dx / distance) * SPEED,
      (dy / distance) * SPEED
    );
    const angle = Math.atan2(dy, dx);
    gameState.snake.setRotation?.(angle);
  } else {
    gameState.snake.body?.setVelocity(0, 0);
  }
}