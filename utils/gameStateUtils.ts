import { GameState } from '@/types/game';
import { GAME_CONFIG } from './gameConstants';

export function createInitialGameState(): GameState {
  return {
    player: null,
    npc: null,
    cursors: null,
    wasd: null,
    fKey: null,
    collisionLayer: null,
    waterTiles: [],
    interactPrompt: null,
    dialogBox: null,
    namePopup: null,
    parrot: null,
    snake: null,
    palmTreePositions: [],
    parrotState: {
      currentTreeIndex: 0,
      targetTreeIndex: 1,
      isFlying: false,
      restStartTime: 0,
      restDuration: GAME_CONFIG.PARROT.REST_DURATION.MIN,
    },
    isDialogOpen: false,
  };
}