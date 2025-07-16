"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { GameState, PhaserSceneContext } from "@/types/game";
import { 
  createPlayerSprites,
  createParrotSprites,
  createSnakeSprite,
  createObjectSprites
} from "@/utils/sprites";
import { preloadSprites } from "@/utils/sprites/assetLoader";
import { createCrashSiteMap } from "@/utils/mapCreator";
import {
  handlePlayerMovement,
  createAnimals,
  animateAnimals,
  createDialogSystem,
  handleNPCInteraction,
  animateWater,
  initializeControls,
  initializeSuitcaseSystem,
  updateSuitcaseSystem
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
          width: window.innerWidth,
          height: window.innerHeight - 200, // Account for header/footer
          parent: gameRef.current,
          backgroundColor: GAME_CONFIG.CANVAS.BACKGROUND_COLOR,
          scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: window.innerWidth,
            height: window.innerHeight - 200,
          },
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
    <div className="w-full h-screen flex flex-col">
      <div
        ref={gameRef}
        className="flex-1 w-full"
        style={{ minHeight: 'calc(100vh - 200px)' }}
      />
    </div>
  );
}

// Export with dynamic import to disable SSR
export default dynamic(() => Promise.resolve(GameComponent), {
  ssr: false,
});

function preload(this: PhaserSceneContext) {
  // Load real sprite assets
  preloadSprites(this);
  
  // Still create programmatically generated sprites for those we don't have assets for
  createParrotSprites(this);
  createSnakeSprite(this);
  createObjectSprites(this);
}

function create(this: PhaserSceneContext) {
  try {
    // Create player animations after assets are loaded
    createPlayerSprites(this);
    
    gameState.collisionLayer = this.physics.add.staticGroup();

    const mapResult = createCrashSiteMap(this as PhaserSceneContext, gameState.collisionLayer!);
    gameState.waterTiles = mapResult.waterTiles;

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
    
    // Initialize suitcase system
    initializeSuitcaseSystem(this, gameState);
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
    
    // Update suitcase system
    updateSuitcaseSystem(this, gameState);
  } catch (error) {
    console.error("Error in update function:", error);
  }
}