"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { GameState, PhaserSceneContext } from "@/types/game";
import { 
  createPlayerSprites,
  createParrotSprites,
  createSnakeSprite,
  createTerrainTextures,
  createWaterTextures,
  createObjectSprites,
  createNPCSprite
} from "@/utils/sprites";
import { createCrashSiteMap } from "@/utils/mapCreator";
import {
  handlePlayerMovement,
  createAnimals,
  animateAnimals,
  createDialogSystem,
  handleNPCInteraction,
  animateWater,
  initializeControls
} from "@/utils/systems";
import { createInitialGameState } from "@/utils/gameStateUtils";
import { GAME_CONFIG } from "@/utils/gameConstants";

let gameState: GameState = createInitialGameState();

function GameComponent() {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<{ destroy: (removeCanvas: boolean, noReturn?: boolean) => void } | null>(null);

  useEffect(() => {
    let mounted = true;

    const initGame = async () => {
      if (typeof window !== "undefined" && gameRef.current && mounted) {
        gameState = createInitialGameState();

        // Dynamic import of Phaser only on client side
        const Phaser = await import("phaser");

        const config = {
          type: Phaser.CANVAS,
          width: GAME_CONFIG.CANVAS.WIDTH,
          height: GAME_CONFIG.CANVAS.HEIGHT,
          parent: gameRef.current,
          backgroundColor: GAME_CONFIG.CANVAS.BACKGROUND_COLOR,
          physics: {
            default: "arcade",
            arcade: {
              gravity: GAME_CONFIG.PHYSICS.GRAVITY,
              debug: GAME_CONFIG.PHYSICS.DEBUG,
            },
          },
          scene: {
            preload: function () {
              if (mounted) preload.call(this as unknown as PhaserSceneContext);
            },
            create: function () {
              if (mounted) create.call(this as unknown as PhaserSceneContext);
            },
            update: function () {
              if (mounted) update.call(this as unknown as PhaserSceneContext);
            },
          },
        };

        // Initialize Phaser game only if component is still mounted
        if (mounted) {
          phaserGameRef.current = new Phaser.Game(config);
        }
      }
    };

    initGame().catch(console.error);

    // Cleanup function
    return () => {
      mounted = false;
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
      gameState = createInitialGameState();
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          LOST Island Adventure
        </h2>
        <p className="text-gray-300">Use WASD or Arrow Keys to move</p>
      </div>
      <div
        ref={gameRef}
        className="border-2 border-gray-600 rounded-lg overflow-hidden"
      />
    </div>
  );
}

// Export with dynamic import to disable SSR
export default dynamic(() => Promise.resolve(GameComponent), {
  ssr: false,
});

function preload(this: PhaserSceneContext) {
  createPlayerSprites(this);
  createNPCSprite(this);
  createTerrainTextures(this);
  createWaterTextures(this);
  createObjectSprites(this);
  createParrotSprites(this);
  createSnakeSprite(this);
}

function create(this: PhaserSceneContext) {
  try {
    gameState.collisionLayer = this.physics.add.staticGroup();

    const mapResult = createCrashSiteMap(this as PhaserSceneContext, gameState.collisionLayer!);
    gameState.waterTiles = mapResult.waterTiles;
    gameState.palmTreePositions = mapResult.palmTreePositions;

    gameState.player = this.physics.add.sprite(
      GAME_CONFIG.PLAYER.START_X, 
      GAME_CONFIG.PLAYER.START_Y, 
      "player_idle"
    );
    gameState.player.setCollideWorldBounds?.(true);

    gameState.npc = this.physics.add.sprite(
      GAME_CONFIG.NPC.START_X, 
      GAME_CONFIG.NPC.START_Y, 
      "npc"
    );
    gameState.npc.setCollideWorldBounds?.(true);
    gameState.npc.body?.setImmovable(true);

    if (gameState.collisionLayer) {
      this.physics.add.collider(gameState.player, gameState.collisionLayer);
      this.physics.add.collider(gameState.player, gameState.npc);
    }

    initializeControls(this, gameState);

    if (gameState.npc) {
      const dialogSystem = createDialogSystem(this, gameState.npc);
      gameState.interactPrompt = dialogSystem.interactPrompt;
      gameState.dialogBox = dialogSystem.dialogBox;
      gameState.namePopup = dialogSystem.namePopup;
    }

    createAnimals(this, gameState);
  } catch (error) {
    console.error("Error in create function:", error);
  }
}

function update(this: PhaserSceneContext) {
  try {
    if (!gameState.player?.body) return;

    handlePlayerMovement(gameState, this);
    handleNPCInteraction(gameState);
    
    if (Array.isArray(gameState.waterTiles)) {
      animateWater(gameState.waterTiles, this);
    }
    
    animateAnimals(gameState, this);
  } catch (error) {
    console.error("Error in update function:", error);
  }
}