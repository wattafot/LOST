import React, { useRef, useEffect, useState } from 'react';

interface TilesetViewerProps {
  tilesetPath: string;
  tileWidth: number;
  tileHeight: number;
  columns: number;
  rows: number;
  onTileSelect: (frameIndex: number) => void;
  selectedFrameIndex?: number;
}

export const TilesetViewer: React.FC<TilesetViewerProps> = ({
  tilesetPath,
  tileWidth,
  tileHeight,
  columns,
  rows,
  onTileSelect,
  selectedFrameIndex
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      
      // Set canvas size
      canvas.width = columns * tileWidth;
      canvas.height = rows * tileHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the tileset
      ctx.drawImage(img, 0, 0);
      
      // Draw grid lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let i = 0; i <= columns; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tileWidth, 0);
        ctx.lineTo(i * tileWidth, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * tileHeight);
        ctx.lineTo(canvas.width, i * tileHeight);
        ctx.stroke();
      }
      
      // Highlight selected tile
      if (selectedFrameIndex !== undefined) {
        const col = selectedFrameIndex % columns;
        const row = Math.floor(selectedFrameIndex / columns);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
      }
      
      // Highlight hovered tile
      if (hoveredIndex !== null) {
        const col = hoveredIndex % columns;
        const row = Math.floor(hoveredIndex / columns);
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
      }
    };
    
    img.onerror = () => {
      console.error('Failed to load tileset:', tilesetPath);
    };
    
    img.src = tilesetPath;
  }, [tilesetPath, tileWidth, tileHeight, columns, rows, selectedFrameIndex, hoveredIndex]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const rect = canvas.getBoundingClientRect();
    
    // Calculate relative position within canvas
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    
    // Get canvas actual size vs display size for proper scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Apply scaling to get canvas pixel coordinates
    const canvasX = relativeX * scaleX;
    const canvasY = relativeY * scaleY;
    
    // Convert to grid coordinates
    const col = Math.floor(canvasX / tileWidth);
    const row = Math.floor(canvasY / tileHeight);
    
    if (col >= 0 && col < columns && row >= 0 && row < rows) {
      const frameIndex = row * columns + col;
      onTileSelect(frameIndex);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const rect = canvas.getBoundingClientRect();
    
    // Calculate relative position within canvas
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    
    // Get canvas actual size vs display size for proper scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Apply scaling to get canvas pixel coordinates
    const canvasX = relativeX * scaleX;
    const canvasY = relativeY * scaleY;
    
    // Convert to grid coordinates
    const col = Math.floor(canvasX / tileWidth);
    const row = Math.floor(canvasY / tileHeight);
    
    if (col >= 0 && col < columns && row >= 0 && row < rows) {
      const frameIndex = row * columns + col;
      setHoveredIndex(frameIndex);
    } else {
      setHoveredIndex(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    
    // Calculate relative position within canvas
    const relativeX = touch.clientX - rect.left;
    const relativeY = touch.clientY - rect.top;
    
    // Get canvas actual size vs display size for proper scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Apply scaling to get canvas pixel coordinates
    const canvasX = relativeX * scaleX;
    const canvasY = relativeY * scaleY;
    
    // Convert to grid coordinates
    const col = Math.floor(canvasX / tileWidth);
    const row = Math.floor(canvasY / tileHeight);
    
    if (col >= 0 && col < columns && row >= 0 && row < rows) {
      const frameIndex = row * columns + col;
      onTileSelect(frameIndex);
    }
  };

  return (
    <div className="p-2 bg-gray-800 rounded">
      <h3 className="text-sm font-semibold mb-2 text-white">
        Tileset Grid ({columns}x{rows}) - {isMobile ? 'Tap' : 'Click'} to select tiles
      </h3>
      <div className="border border-gray-600 inline-block">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
          onTouchStart={handleCanvasTouchStart} // Add touch support
          className="cursor-crosshair block touch-manipulation"
          style={{
            imageRendering: 'pixelated',
            maxWidth: isMobile ? '90vw' : '400px',
            maxHeight: isMobile ? '60vh' : '400px',
            width: isMobile ? '90vw' : '100%',
            minWidth: isMobile ? '320px' : '300px',
            minHeight: isMobile ? '240px' : '200px'
          }}
        />
      </div>
      {hoveredIndex !== null && (
        <div className="mt-2 text-xs text-gray-300">
          Frame {hoveredIndex} (Row {Math.floor(hoveredIndex / columns)}, Col {hoveredIndex % columns})
        </div>
      )}
    </div>
  );
};