/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Skeleton Component - Loading State Placeholder
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview shadcn/ui Skeleton component for loading states.
 * Provides animated placeholder while content is fetching.
 *
 * @description
 * **Purpose**:
 * - Show loading placeholders during data fetch
 * - Maintain layout stability (prevent shift)
 * - Improve perceived performance
 * - Reduce layout cumulative shift (CLS)
 *
 * **Features**:
 * - Pulse animation (animate-pulse)
 * - Rounded corners (rounded-md)
 * - Muted background color
 * - Fully customizable via className
 *
 * **Common Patterns**:
 * - Card skeletons: w-full h-64
 * - Text skeletons: h-4 w-3/4
 * - Avatar skeletons: h-12 w-12 rounded-full
 * - Grid layouts: 3x3 or 3x4 skeletons
 *
 * @example
 * // Card skeleton (Portfolio/ServicesGrid)
 * <Skeleton className="h-64 w-full" />
 *
 * @example
 * // Text line skeleton
 * <div className="space-y-2">
 *   <Skeleton className="h-4 w-full" />
 *   <Skeleton className="h-4 w-3/4" />
 * </div>
 *
 * @example
 * // Avatar skeleton
 * <Skeleton className="h-12 w-12 rounded-full" />
 *
 * @example
 * // Grid of skeletons
 * <div className="grid grid-cols-3 gap-4">
 *   {Array.from({ length: 9 }).map((_, i) => (
 *     <Skeleton key={i} className="h-48 w-full" />
 *   ))}
 * </div>
 *
 * @module components/ui/skeleton
 * @see {@link https://ui.shadcn.com/docs/components/skeleton} shadcn Skeleton Docs
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

export { Skeleton };
