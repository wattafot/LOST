import { Tile } from '../level-editor/types';
import { generateTilesetTiles } from '@/utils/tilesetSlicing';

// Generate all available tiles including tilesets
export const generateAvailableTiles = (): readonly Tile[] => {
  const baseTiles: Tile[] = [
    // Terrain tiles
    { id: 'grass', name: 'Grass', sprite: '/sprites/tilesets/grass.png', category: 'terrain', color: '#32CD32' },
    { id: 'flooring', name: 'Flooring', sprite: '/sprites/tilesets/floors/flooring.png', category: 'terrain', color: '#8B4513' },
    { id: 'carpet', name: 'Carpet', sprite: '/sprites/tilesets/floors/carpet.png', category: 'terrain', color: '#8B0000' },
    { id: 'wooden', name: 'Wooden Floor', sprite: '/sprites/tilesets/floors/wooden.png', category: 'terrain', color: '#DEB887' },
    
    // Water tiles
    { id: 'water1', name: 'Water 1', sprite: '/sprites/tilesets/water1.png', category: 'water', color: '#4682B4' },
    { id: 'water2', name: 'Water 2', sprite: '/sprites/tilesets/water2.png', category: 'water', color: '#5F9EA0' },
    { id: 'water3', name: 'Water 3', sprite: '/sprites/tilesets/water3.png', category: 'water', color: '#6495ED' },
    { id: 'water4', name: 'Water 4', sprite: '/sprites/tilesets/water4.png', category: 'water', color: '#87CEEB' },
    { id: 'water5', name: 'Water 5', sprite: '/sprites/tilesets/water5.png', category: 'water', color: '#20B2AA' },
    { id: 'water6', name: 'Water 6', sprite: '/sprites/tilesets/water6.png', category: 'water', color: '#48D1CC' },
    { id: 'water_decorations', name: 'Water Deco', sprite: '/sprites/tilesets/water_decorations.png', category: 'water', color: '#40E0D0' },
    { id: 'water_lillies', name: 'Water Lillies', sprite: '/sprites/tilesets/water_lillies.png', category: 'water', color: '#00CED1' },
    
    // Objects
    { id: 'chest1', name: 'Chest 1', sprite: '/sprites/objects/chest_01.png', category: 'objects', color: '#8B4513' },
    { id: 'chest2', name: 'Chest 2', sprite: '/sprites/objects/chest_02.png', category: 'objects', color: '#A0522D' },
    { id: 'rock1', name: 'Rock 1', sprite: '/sprites/objects/rock_in_water_01.png', category: 'objects', color: '#696969' },
    { id: 'rock2', name: 'Rock 2', sprite: '/sprites/objects/rock_in_water_02.png', category: 'objects', color: '#708090' },
    { id: 'rock3', name: 'Rock 3', sprite: '/sprites/objects/rock_in_water_03.png', category: 'objects', color: '#778899' },
    { id: 'rock4', name: 'Rock 4', sprite: '/sprites/objects/rock_in_water_04.png', category: 'objects', color: '#2F4F4F' },
    { id: 'rock5', name: 'Rock 5', sprite: '/sprites/objects/rock_in_water_05.png', category: 'objects', color: '#696969' },
    { id: 'rock6', name: 'Rock 6', sprite: '/sprites/objects/rock_in_water_06.png', category: 'objects', color: '#808080' },
    
    // Decorations
    { id: 'fence', name: 'Fence', sprite: '/sprites/tilesets/fences.png', category: 'decorations', color: '#8B4513' },
    { id: 'walls', name: 'Walls', sprite: '/sprites/tilesets/walls/walls.png', category: 'decorations', color: '#A0522D' },
    { id: 'wooden_door', name: 'Wooden Door', sprite: '/sprites/tilesets/walls/wooden_door.png', category: 'decorations', color: '#DEB887' },
    { id: 'wooden_door_b', name: 'Wooden Door B', sprite: '/sprites/tilesets/walls/wooden_door_b.png', category: 'decorations', color: '#D2691E' },
    { id: 'decor_8x8', name: 'Small Decor', sprite: '/sprites/tilesets/decor_8x8.png', category: 'decorations', color: '#228B22' },
    { id: 'dust_particles', name: 'Dust Particles', sprite: '/sprites/particles/dust_particles_01.png', category: 'decorations', color: '#F5DEB3' },
    
    // Characters
    { id: 'player', name: 'Player', sprite: '/sprites/characters/player.png', category: 'characters', color: '#FFA500', frameWidth: 48, frameHeight: 48, frameIndex: 0 },
    { id: 'skeleton', name: 'Skeleton', sprite: '/sprites/characters/skeleton.png', category: 'characters', color: '#F5F5DC', frameWidth: 48, frameHeight: 48, frameIndex: 0 },
    { id: 'skeleton_swordless', name: 'Skeleton (No Sword)', sprite: '/sprites/characters/skeleton_swordless.png', category: 'characters', color: '#DCDCDC', frameWidth: 48, frameHeight: 48, frameIndex: 0 },
    { id: 'slime', name: 'Slime', sprite: '/sprites/characters/slime.png', category: 'characters', color: '#32CD32', frameWidth: 32, frameHeight: 32, frameIndex: 0 },
  ];
  
  // Add tileset tiles
  const tilesetTiles = generateTilesetTiles().map(tile => ({
    ...tile,
    category: tile.category as 'tilesets'
  }));
  
  return Object.freeze([...baseTiles, ...tilesetTiles]);
};