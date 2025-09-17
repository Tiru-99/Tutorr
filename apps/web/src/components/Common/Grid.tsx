import { cn } from "@/lib/utils";
import { useId } from "react";

export function Grid({
  cellSize = 40,
  strokeWidth = 1,
  patternOffset = [0, 0],
  className,
}: {
  cellSize?: number;
  strokeWidth?: number;
  patternOffset?: [number, number];
  className?: string;
}) {
  const id = useId();

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 text-black/10", className)}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={`grid-${id}`}
          x={patternOffset[0] - 1}
          y={patternOffset[1] - 1}
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </pattern>

        {/* mask with radial gradient for blur */}
        <mask id={`mask-${id}`}>
          <radialGradient id={`fade-${id}`} cx="50%" cy="50%" r="45%" >
            <stop offset="80%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
          <rect width="100%" height="100%" fill={`url(#fade-${id})`} />
        </mask>
      </defs>

      {/* Apply mask */}
      <rect fill={`url(#grid-${id})`} width="100%" height="100%" mask={`url(#mask-${id})`} />
    </svg>

  );
}
