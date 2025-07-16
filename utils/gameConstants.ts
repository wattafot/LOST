export const GAME_CONFIG = {
  CANVAS: {
    WIDTH: 800,
    HEIGHT: 600,
    BACKGROUND_COLOR: "#2c3e50",
  },
  PHYSICS: {
    GRAVITY: { x: 0, y: 0 },
    DEBUG: false,
  },
  PLAYER: {
    SPEED: 160,
    START_X: 400,
    START_Y: 320,
  },
  NPC: {
    START_X: 200,
    START_Y: 350,
    INTERACTION_DISTANCE: 60,
    NAME_POPUP_DISTANCE: 80,
  },
  PARROT: {
    SPEED: 80,
    SCALE: 0.7,
    WING_FLAP_SPEED: 200,
    REST_DURATION: { MIN: 1000, MAX: 3000 },
    TREE_OFFSET_Y: -50,
  },
  SNAKE: {
    SPEED: 25,
    START_X: 200,
    START_Y: 100,
    SLITHER_CYCLE_DURATION: 8000,
    WAVE_AMPLITUDE: 40,
    WAVE_FREQUENCY: 4,
    BASE_Y: 120,
    MOVEMENT_RANGE: 400,
  },
  WATER: {
    ANIMATION_SPEED: 400,
    FRAME_COUNT: 3,
  },
  MAP: {
    WIDTH: 25,
    HEIGHT: 19,
    TILE_SIZE: 32,
  },
  SUITCASE: {
    SPAWN_INTERVAL: { MIN: 30000, MAX: 60000 }, // 30-60 seconds
    INTERACTION_DISTANCE: 50,
    MAX_ACTIVE: 3,
  },
} as const;

export const SPRITE_NAMES = {
  PLAYER: {
    IDLE: "player_idle",
    WALK1: "player_walk1",
    WALK2: "player_walk2",
  },
  PARROT: {
    FRONT: "parrot_front",
    LEFT: "parrot_left",
    RIGHT: "parrot_right",
    FRONT_FLAP: "parrot_front_flap",
    LEFT_FLAP: "parrot_left_flap",
    RIGHT_FLAP: "parrot_right_flap",
  },
  SNAKE: "snake",
  NPC: "npc",
  WATER: ["water", "water2", "water3"],
  TERRAIN: {
    GRASS: "grass",
    SAND: "sand",
    DIRT: "dirt",
  },
  OBJECTS: {
    PALM_TREE_1: "palm_tree_1",
    PALM_TREE_2: "palm_tree_2", 
    PALM_TREE_3: "palm_tree_3",
    BUSH: "bush",
    PLANE: "plane",
    SUITCASE: "suitcase",
  },
} as const;

export const COLORS = {
  PARROT: {
    BODY: 0x228b22,
    HEAD: 0x32cd32,
    WINGS: 0x006400,
    BEAK: 0xffa500,
    FEET: 0xffff00,
    EYES: 0x000000,
    EYE_HIGHLIGHT: 0xffffff,
  },
  SNAKE: {
    BODY: 0x8b7355,
    PATTERN: 0x654321,
    TONGUE: 0xff0000,
    EYES: 0xffff00,
    PUPILS: 0x000000,
  },
  UI: {
    DIALOG_BG: 0x2c2c2c,
    DIALOG_BORDER: 0x4a5568,
    NAME_POPUP_BG: "#1a202c",
    TEXT_PRIMARY: "#ffffff",
    TEXT_SECONDARY: "#a0aec0",
    INTERACT_BG: "#000000",
  },
} as const;