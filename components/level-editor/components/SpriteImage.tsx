import { useState, useEffect, useRef, memo } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Tile } from '../types';

interface SpriteImageProps {
  readonly tile: Tile;
  readonly size?: number;
}

const SpriteImage = memo<SpriteImageProps>(({ tile, size = 32 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset states when tile changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [tile.id]);

  // Handle sprite sheet loading
  useEffect(() => {
    if (!tile.frameWidth || !tile.frameHeight) {
      setIsLoading(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const img = new Image();
    img.onload = () => {
      const frameIndex = tile.frameIndex || 0;
      const framesPerRow = Math.floor(img.width / tile.frameWidth!);
      const frameX = (frameIndex % framesPerRow) * tile.frameWidth!;
      const frameY = Math.floor(frameIndex / framesPerRow) * tile.frameHeight!;

      ctx.clearRect(0, 0, size, size);
      
      // Calculate scaling to fit the tile properly in the preview
      const scaleX = size / tile.frameWidth!;
      const scaleY = size / tile.frameHeight!;
      const scale = Math.min(scaleX, scaleY);
      
      const scaledWidth = tile.frameWidth! * scale;
      const scaledHeight = tile.frameHeight! * scale;
      
      // Center the tile in the preview
      const offsetX = (size - scaledWidth) / 2;
      const offsetY = (size - scaledHeight) / 2;
      
      ctx.drawImage(
        img,
        frameX, frameY, tile.frameWidth!, tile.frameHeight!,
        offsetX, offsetY, scaledWidth, scaledHeight
      );
      setIsLoading(false);
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };

    img.src = tile.sprite;
  }, [tile, size]);

  // Skip the tileset name-only display - all tiles should show sprites now

  // Sprite sheets - use canvas
  if (tile.frameWidth && tile.frameHeight) {
    if (isLoading) {
      return (
        <div 
          className="flex items-center justify-center bg-gray-700 border border-gray-600 rounded"
          style={{ width: size, height: size }}
        >
          <Loader2 size={size / 3} className="animate-spin text-gray-400" />
        </div>
      );
    }

    if (hasError) {
      return (
        <div 
          className="flex items-center justify-center bg-gray-700 border border-gray-600 rounded text-gray-300 text-xs"
          style={{ width: size, height: size }}
        >
          {tile.name.slice(0, 3)}
        </div>
      );
    }

    return <canvas ref={canvasRef} width={size} height={size} className="rounded" />;
  }

  // Regular images
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 border border-gray-600 rounded z-10">
          <Loader2 size={size / 3} className="animate-spin text-gray-400" />
        </div>
      )}
      <Image
        src={tile.sprite}
        alt={tile.name}
        width={size}
        height={size}
        className="rounded border border-gray-600"
        style={{ 
          objectFit: 'cover',
          display: hasError ? 'none' : 'block'
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        unoptimized // Since these are game assets, disable optimization
      />
      {hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-700 border border-gray-600 rounded text-gray-300 text-xs"
        >
          {tile.name.slice(0, 3)}
        </div>
      )}
    </div>
  );
});

SpriteImage.displayName = 'SpriteImage';

export default SpriteImage;