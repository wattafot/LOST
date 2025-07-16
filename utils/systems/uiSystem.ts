import { GameState, GameObject, PhaserSceneContext, PhaserText, PhaserContainer } from '@/types/game';
import { GAME_CONFIG, COLORS } from '../gameConstants';

export function createDialogSystem(scene: PhaserSceneContext, npc: GameObject): {
  interactPrompt: PhaserText;
  dialogBox: PhaserContainer;
  namePopup: PhaserText;
} {
  const namePopup = createNamePopup(scene, npc);
  const interactPrompt = createInteractPrompt(scene, npc);
  const dialogBox = createDialogBox(scene);

  return { interactPrompt, dialogBox, namePopup };
}

export function handleNPCInteraction(gameState: GameState): void {
  if (!gameState.player || !gameState.npc || !gameState.interactPrompt || !gameState.namePopup) return;

  const distanceToNPC = calculateDistance(gameState.player, gameState.npc);
  const { INTERACTION_DISTANCE, NAME_POPUP_DISTANCE } = GAME_CONFIG.NPC;

  updateNamePopup(gameState, distanceToNPC, NAME_POPUP_DISTANCE);
  updateInteractionPrompt(gameState, distanceToNPC, INTERACTION_DISTANCE);
  handleDialogToggle(gameState);
  updateKeyState(gameState);
}

export function animateWater(waterTiles: GameObject[], scene: PhaserSceneContext): void {
  if (!waterTiles?.length) return;

  const SLOW_ANIMATION_SPEED = 800; // Slower, less annoying animation
  const waveFrame = Math.floor(scene.time.now / SLOW_ANIMATION_SPEED) % 3;
  
  // Use the correct sprite names from constants
  const waterTexture = ["water", "water2", "water3"][waveFrame];

  waterTiles.forEach(tile => tile.setTexture?.(waterTexture));
}

function createNamePopup(scene: PhaserSceneContext, npc: GameObject): PhaserText {
  const namePopup = scene.add.text(npc.x, npc.y - 40, "Frieder", {
    fontSize: "12px",
    color: COLORS.UI.TEXT_PRIMARY,
    backgroundColor: COLORS.UI.NAME_POPUP_BG,
    padding: { x: 6, y: 3 },
    fontFamily: "Arial, sans-serif",
  });
  namePopup.setOrigin?.(0.5);
  namePopup.setVisible?.(false);
  return namePopup;
}

function createInteractPrompt(scene: PhaserSceneContext, npc: GameObject): PhaserText {
  const interactPrompt = scene.add.text(npc.x, npc.y - 60, "Press F to talk", {
    fontSize: "14px",
    color: COLORS.UI.TEXT_PRIMARY,
    backgroundColor: COLORS.UI.INTERACT_BG,
    padding: { x: 8, y: 4 },
  });
  interactPrompt.setOrigin?.(0.5);
  interactPrompt.setVisible?.(false);
  return interactPrompt;
}

function createDialogBox(scene: PhaserSceneContext): PhaserContainer {
  const dialogBg = scene.add.graphics();
  dialogBg.fillStyle(COLORS.UI.DIALOG_BG, 1.0);
  dialogBg.fillRoundedRect(0, 0, 600, 120, 10);
  dialogBg.lineStyle(4, COLORS.UI.DIALOG_BORDER);
  dialogBg.strokeRoundedRect(0, 0, 600, 120, 10);

  const dialogText = scene.add.text(20, 20, "", {
    fontSize: "18px",
    color: COLORS.UI.TEXT_PRIMARY,
    fontFamily: "Arial, sans-serif",
    wordWrap: { width: 560 },
  });

  const closeText = scene.add.text(580, 10, "Press F to close", {
    fontSize: "12px",
    color: COLORS.UI.TEXT_SECONDARY,
  });
  closeText.setOrigin?.(1, 0);

  const dialogBox = scene.add.container(100, 450, [dialogBg, dialogText, closeText]);
  dialogBox.setVisible(false);
  return dialogBox;
}

function calculateDistance(obj1: GameObject, obj2: GameObject): number {
  return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}

function updateNamePopup(gameState: GameState, distance: number, maxDistance: number): void {
  const shouldShow = distance <= maxDistance && !gameState.isDialogOpen;
  gameState.namePopup?.setVisible?.(shouldShow);
}

function updateInteractionPrompt(gameState: GameState, distance: number, maxDistance: number): void {
  const shouldShow = distance <= maxDistance && !gameState.isDialogOpen;
  gameState.interactPrompt?.setVisible?.(shouldShow);

  if (shouldShow && gameState.fKey?.isDown && !gameState.fKey.wasDown) {
    openDialog(gameState);
  }
}

function handleDialogToggle(gameState: GameState): void {
  if (gameState.isDialogOpen && gameState.fKey?.isDown && !gameState.fKey.wasDown) {
    closeDialog(gameState);
  }
}

function updateKeyState(gameState: GameState): void {
  if (gameState.fKey) {
    gameState.fKey.wasDown = gameState.fKey.isDown;
  }
}

function openDialog(gameState: GameState): void {
  gameState.isDialogOpen = true;
  gameState.interactPrompt?.setVisible?.(false);
  gameState.namePopup?.setVisible?.(false);

  if (gameState.dialogBox?.list?.[1]) {
    const dialogText = gameState.dialogBox.list[1];
    dialogText.setText?.("Frieder: Du bist ein Gärtner");
  }

  gameState.dialogBox?.setVisible(true);

  if (gameState.fKey) {
    gameState.fKey.wasDown = true;
  }
}

function closeDialog(gameState: GameState): void {
  gameState.isDialogOpen = false;
  gameState.dialogBox?.setVisible(false);
}