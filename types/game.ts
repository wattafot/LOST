export interface GameObject {
  x: number;
  y: number;
  body?: {
    setVelocity: (x: number, y?: number) => void;
    setVelocityX: (x: number) => void;
    setVelocityY: (y: number) => void;
    setImmovable: (immovable: boolean) => void;
    setSize: (width: number, height: number) => void;
  };
  setTexture?: (texture: string) => void;
  setCollideWorldBounds?: (collide: boolean) => void;
  setVisible?: (visible: boolean) => void;
  setScale?: (scale: number) => void;
  setRotation?: (rotation: number) => void;
  setOrigin?: (x: number, y?: number) => GameObject;
}

export interface PhaserKeys {
  left?: { isDown: boolean };
  right?: { isDown: boolean };
  up?: { isDown: boolean };
  down?: { isDown: boolean };
  A?: { isDown: boolean };
  D?: { isDown: boolean };
  W?: { isDown: boolean };
  S?: { isDown: boolean };
}

export interface FKey {
  isDown: boolean;
  wasDown: boolean;
}

export interface PhaserText {
  x: number;
  y: number;
  setText?: (text: string) => void;
  setVisible?: (visible: boolean) => void;
  setOrigin?: (x: number, y?: number) => PhaserText;
}

export interface PhaserContainer {
  setVisible: (visible: boolean) => void;
  list: PhaserText[];
}

export interface PhaserScene {
  add: {
    graphics: () => PhaserGraphics;
    sprite: (x: number, y: number, texture: string) => GameObject;
    image: (x: number, y: number, texture: string) => GameObject;
    text: (x: number, y: number, text: string, style: Record<string, unknown>) => PhaserText;
    container: (x: number, y: number, children: unknown[]) => PhaserContainer;
  };
  physics: {
    add: {
      sprite: (x: number, y: number, texture: string) => GameObject;
      staticGroup: () => PhaserGroup;
      collider: (obj1: GameObject | PhaserGroup, obj2: GameObject | PhaserGroup) => void;
    };
  };
  input?: {
    keyboard?: {
      createCursorKeys: () => PhaserKeys;
      addKeys: (keys: string) => PhaserKeys;
      addKey: (key: string) => FKey;
    };
  };
  time: {
    now: number;
  };
  load: {
    image: (key: string, path: string) => void;
    spritesheet: (key: string, path: string, config: { frameWidth: number; frameHeight: number }) => void;
  };
  anims: {
    create: (config: {
      key: string;
      frames: unknown[];
      frameRate: number;
      repeat: number;
    }) => void;
    generateFrameNumbers: (key: string, config: { start: number; end: number }) => unknown[];
  };
}

export interface PhaserSceneContext extends PhaserScene {
  // This extends PhaserScene for use in Phaser function contexts
}

export interface PhaserGraphics {
  fillStyle: (color: number, alpha?: number) => void;
  fillRect: (x: number, y: number, width: number, height: number) => void;
  fillCircle: (x: number, y: number, radius: number) => void;
  fillEllipse: (x: number, y: number, width: number, height: number) => void;
  lineStyle: (width: number, color: number, alpha?: number) => void;
  strokeRoundedRect: (x: number, y: number, width: number, height: number, radius: number) => void;
  fillRoundedRect: (x: number, y: number, width: number, height: number, radius: number) => void;
  generateTexture: (key: string, width: number, height: number) => void;
  destroy: () => void;
}

export interface PhaserGroup {
  add: (obj: GameObject) => void;
}

export interface Position {
  x: number;
  y: number;
  scale?: number;
  variant?: string;
}

export interface Suitcase {
  id: string;
  sprite: GameObject;
  position: Position;
  isWashingUp: boolean;
  targetPosition: Position;
  washUpStartTime: number;
}

export interface GameState {
  player: GameObject | null;
  npc: GameObject | null;
  cursors: PhaserKeys | null;
  wasd: PhaserKeys | null;
  fKey: FKey | null;
  collisionLayer: PhaserGroup | null;
  waterTiles: GameObject[];
  interactPrompt: PhaserText | null;
  dialogBox: PhaserContainer | null;
  namePopup: PhaserText | null;
  parrot: GameObject | null;
  snake: GameObject | null;
  parrotState: {
    currentTreeIndex: number;
    targetTreeIndex: number;
    isFlying: boolean;
    restStartTime: number;
    restDuration: number;
  };
  isDialogOpen: boolean;
  suitcases: Suitcase[];
  suitcaseSpawnState: {
    lastSpawnTime: number;
    nextSpawnTime: number;
  };
  suitcaseInteractPrompt: PhaserText | null;
  feedbackText: PhaserText | null;
}