import { useEffect, useRef } from 'react';

interface TilesetDebuggerProps {
  imagePath: string;
  tileWidth: number;
  tileHeight: number;
}

export const TilesetDebugger = ({ imagePath, tileWidth, tileHeight }: TilesetDebuggerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const columns = Math.floor(img.width / tileWidth);
      const rows = Math.floor(img.height / tileHeight);
      
      console.log(`=== TILESET DEBUG: ${imagePath} ===`);
      console.log(`Image size: ${img.width}x${img.height}`);
      console.log(`Tile size: ${tileWidth}x${tileHeight}`);
      console.log(`Grid: ${columns}x${rows} = ${columns * rows} tiles`);
      
      // Set canvas to show the original image with grid overlay
      canvas.width = img.width * 2; // Scale up for visibility
      canvas.height = img.height * 2;
      
      // Draw the original image scaled up
      ctx.drawImage(img, 0, 0, img.width * 2, img.height * 2);
      
      // Draw grid overlay
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      
      for (let x = 0; x <= columns; x++) {
        ctx.beginPath();
        ctx.moveTo(x * tileWidth * 2, 0);
        ctx.lineTo(x * tileWidth * 2, img.height * 2);
        ctx.stroke();
      }
      
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * tileHeight * 2);
        ctx.lineTo(img.width * 2, y * tileHeight * 2);
        ctx.stroke();
      }
      
      // Draw tile numbers
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const tileIndex = row * columns + col;
          const x = (col * tileWidth + tileWidth / 2) * 2;
          const y = (row * tileHeight + tileHeight / 2) * 2;
          
          ctx.fillStyle = '#000000';
          ctx.fillText(tileIndex.toString(), x + 1, y + 1);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(tileIndex.toString(), x, y);
        }
      }
    };

    img.src = imagePath;
  }, [imagePath, tileWidth, tileHeight]);

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h3 className="text-lg font-bold mb-2">Tileset Debugger: {imagePath}</h3>
      <canvas ref={canvasRef} className="border border-white" />
    </div>
  );
};