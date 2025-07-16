import { PhaserSceneContext } from '@/types/game';

export function createPalmTreeSprites(scene: PhaserSceneContext): void {
  createPalmTreeVariant1(scene);
  createPalmTreeVariant2(scene);
  createPalmTreeVariant3(scene);
}

// Classic palm tree - 8-bit pixel art style
function createPalmTreeVariant1(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  // Grass base - pixel perfect
  graphics.fillStyle(0x32CD32); // Bright green
  graphics.fillRect(0, 56, 64, 8);
  
  // Trunk - brown pixel blocks with horizontal segments
  graphics.fillStyle(0x8B4513); // Brown trunk
  graphics.fillRect(28, 16, 8, 40);
  
  // Trunk segments (darker brown horizontal lines)
  graphics.fillStyle(0x654321);
  graphics.fillRect(28, 20, 8, 2);
  graphics.fillRect(28, 28, 8, 2);
  graphics.fillRect(28, 36, 8, 2);
  graphics.fillRect(28, 44, 8, 2);
  graphics.fillRect(28, 52, 8, 2);
  
  // Palm fronds - pixel art style with blocky edges
  graphics.fillStyle(0x228B22); // Dark green base
  
  // Main fronds radiating from center - chunky pixel style
  // Top frond
  graphics.fillRect(20, 8, 24, 4);
  graphics.fillRect(24, 4, 16, 4);
  graphics.fillRect(28, 0, 8, 4);
  
  // Right frond
  graphics.fillRect(44, 12, 16, 4);
  graphics.fillRect(52, 8, 8, 4);
  graphics.fillRect(56, 4, 4, 4);
  
  // Bottom-right frond
  graphics.fillRect(40, 20, 16, 4);
  graphics.fillRect(48, 24, 8, 4);
  
  // Bottom frond
  graphics.fillRect(24, 24, 16, 4);
  graphics.fillRect(28, 28, 8, 4);
  
  // Bottom-left frond
  graphics.fillRect(8, 20, 16, 4);
  graphics.fillRect(8, 24, 8, 4);
  
  // Left frond
  graphics.fillRect(4, 12, 16, 4);
  graphics.fillRect(4, 8, 8, 4);
  graphics.fillRect(0, 4, 4, 4);
  
  // Top-left frond
  graphics.fillRect(8, 8, 16, 4);
  graphics.fillRect(12, 4, 8, 4);
  
  // Top-right frond
  graphics.fillRect(40, 8, 16, 4);
  graphics.fillRect(44, 4, 8, 4);
  
  // Lighter green highlights on fronds
  graphics.fillStyle(0x32CD32);
  graphics.fillRect(24, 6, 16, 2);
  graphics.fillRect(46, 10, 8, 2);
  graphics.fillRect(26, 26, 12, 2);
  graphics.fillRect(10, 22, 8, 2);
  graphics.fillRect(10, 10, 8, 2);
  
  graphics.generateTexture("palm_tree_1", 64, 64);
  graphics.destroy();
}

// Curved palm tree - leaning pixel art style
function createPalmTreeVariant2(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  // Grass base
  graphics.fillStyle(0x32CD32);
  graphics.fillRect(0, 56, 64, 8);
  
  // Curved trunk - pixel blocks forming a curve
  graphics.fillStyle(0x8B4513);
  graphics.fillRect(24, 48, 8, 8);   // Base
  graphics.fillRect(28, 40, 8, 8);   // Lean starts
  graphics.fillRect(32, 32, 8, 8);   // More lean
  graphics.fillRect(36, 24, 8, 8);   // Peak lean
  graphics.fillRect(40, 16, 8, 8);   // Top
  
  // Trunk segments on curved trunk
  graphics.fillStyle(0x654321);
  graphics.fillRect(24, 50, 8, 2);
  graphics.fillRect(28, 42, 8, 2);
  graphics.fillRect(32, 34, 8, 2);
  graphics.fillRect(36, 26, 8, 2);
  graphics.fillRect(40, 18, 8, 2);
  
  // Palm fronds adapted to leaning trunk position
  graphics.fillStyle(0x228B22);
  
  // Asymmetric fronds following the lean
  // Top frond
  graphics.fillRect(36, 4, 20, 4);
  graphics.fillRect(40, 0, 12, 4);
  
  // Strong right fronds (direction of lean)
  graphics.fillRect(52, 8, 12, 4);
  graphics.fillRect(56, 12, 8, 4);
  graphics.fillRect(60, 16, 4, 4);
  
  // Right-down frond
  graphics.fillRect(48, 20, 12, 4);
  graphics.fillRect(52, 24, 8, 4);
  
  // Bottom frond
  graphics.fillRect(36, 28, 16, 4);
  graphics.fillRect(40, 32, 8, 4);
  
  // Shorter left fronds (opposite to lean)
  graphics.fillRect(20, 20, 12, 4);
  graphics.fillRect(16, 24, 8, 4);
  
  // Left frond
  graphics.fillRect(16, 12, 12, 4);
  graphics.fillRect(12, 8, 8, 4);
  
  // Top-left frond
  graphics.fillRect(24, 8, 12, 4);
  graphics.fillRect(28, 4, 8, 4);
  
  // Highlights
  graphics.fillStyle(0x32CD32);
  graphics.fillRect(38, 6, 16, 2);
  graphics.fillRect(54, 10, 6, 2);
  graphics.fillRect(38, 30, 12, 2);
  graphics.fillRect(22, 22, 6, 2);
  
  graphics.generateTexture("palm_tree_2", 64, 64);
  graphics.destroy();
}

// Small young palm tree - compact pixel art
function createPalmTreeVariant3(scene: PhaserSceneContext): void {
  const graphics = scene.add.graphics();
  
  // Grass base
  graphics.fillStyle(0x32CD32);
  graphics.fillRect(0, 56, 64, 8);
  
  // Short trunk
  graphics.fillStyle(0x8B4513);
  graphics.fillRect(28, 32, 8, 24);
  
  // Trunk segments
  graphics.fillStyle(0x654321);
  graphics.fillRect(28, 36, 8, 2);
  graphics.fillRect(28, 44, 8, 2);
  graphics.fillRect(28, 52, 8, 2);
  
  // Smaller, more compact fronds
  graphics.fillStyle(0x32CD32); // Brighter green for young tree
  
  // Compact fronds - smaller pixel blocks
  // Top frond
  graphics.fillRect(24, 20, 16, 4);
  graphics.fillRect(28, 16, 8, 4);
  
  // Right fronds
  graphics.fillRect(40, 24, 12, 4);
  graphics.fillRect(44, 28, 8, 4);
  
  // Bottom-right
  graphics.fillRect(36, 32, 12, 4);
  
  // Bottom
  graphics.fillRect(28, 36, 8, 4);
  
  // Left fronds
  graphics.fillRect(12, 24, 12, 4);
  graphics.fillRect(12, 28, 8, 4);
  
  // Bottom-left
  graphics.fillRect(16, 32, 12, 4);
  
  // Top-left and top-right
  graphics.fillRect(20, 20, 8, 4);
  graphics.fillRect(36, 20, 8, 4);
  
  // Darker green base for contrast
  graphics.fillStyle(0x228B22);
  graphics.fillRect(26, 22, 12, 2);
  graphics.fillRect(30, 18, 4, 2);
  graphics.fillRect(18, 26, 6, 2);
  graphics.fillRect(40, 26, 6, 2);
  
  graphics.generateTexture("palm_tree_3", 64, 64);
  graphics.destroy();
}