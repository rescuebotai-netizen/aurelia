import React from 'react';

// Generates a deterministic SVG QR matrix based on text input with finder patterns
export const QRCodeSVG: React.FC<{
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
}> = ({ value, size = 120, fgColor = '#292722', bgColor = 'transparent', className = '' }) => {
  // Simple deterministic 25x25 matrix generator with valid QR finder patterns
  const matrixSize = 25;
  const matrix: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

  // Add 3 corner finder patterns (7x7 with 3x3 core)
  const addFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInnerCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[startY + r][startX + c] = isOuterBorder || isInnerCore;
      }
    }
  };

  addFinder(0, 0); // Top-left
  addFinder(matrixSize - 7, 0); // Top-right
  addFinder(0, matrixSize - 7); // Bottom-left

  // Timing lines
  for (let i = 8; i < matrixSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Hash the value deterministically for the interior data modules
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  // Fill data cells avoiding finders
  let seed = Math.abs(hash);
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= matrixSize - 8;
      const inBottomLeft = r >= matrixSize - 8 && c < 8;
      const inCenterLogo = r >= 10 && r <= 14 && c >= 10 && c <= 14;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inCenterLogo) {
        if (r === 6 || c === 6) continue; // timing pattern line
        seed = (seed * 9301 + 49297) % 233280;
        matrix[r][c] = seed / 233280 > 0.48;
      }
    }
  }

  const cellSize = size / matrixSize;

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill={bgColor}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {matrix.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fgColor}
                rx={cellSize * 0.25}
              />
            );
          })
        )}
      </svg>
      {/* Center luxury monogram dot */}
      <div
        className="absolute inset-0 m-auto flex items-center justify-center rounded-sm bg-white shadow-xs border border-[#B59A72]/40"
        style={{ width: size * 0.24, height: size * 0.24 }}
      >
        <span className="font-editorial text-[9px] font-bold text-[#8C6D45] tracking-tighter">
          AU
        </span>
      </div>
    </div>
  );
};
