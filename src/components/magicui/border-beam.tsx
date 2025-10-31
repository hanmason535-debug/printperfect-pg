/**
 * BorderBeam Component
 * An animated border beam effect that creates a flowing light animation around elements
 * Fixed version that doesn't hide content
 */

import { cn } from '@/lib/utils';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  borderWidth = 2,
  colorFrom = '#00bfff',
  colorTo = '#ff00ff',
  delay = 0,
}: BorderBeamProps) => {
  return (
    <div
      style={
        {
          '--size': `${size}px`,
          '--duration': `${duration}s`,
          '--border-width': `${borderWidth}px`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--delay': `${delay}s`,
        } as React.CSSProperties
      }
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', className)}
    >
      <div
        className="absolute inset-0 animate-spin-slow opacity-75"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${colorFrom} 25%, ${colorTo} 50%, transparent 75%, transparent 100%)`,
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`,
          // Use mask to create border effect without covering content
          maskImage:
            'radial-gradient(circle, transparent 0%, transparent calc(100% - 3px), black calc(100% - 3px))',
          WebkitMaskImage:
            'radial-gradient(circle, transparent 0%, transparent calc(100% - 3px), black calc(100% - 3px))',
        }}
      />
    </div>
  );
};
