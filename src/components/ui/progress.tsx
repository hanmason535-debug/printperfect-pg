/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Progress Component - Progress Bar Indicator
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview shadcn/ui Progress component for showing completion status.
 * Built on Radix UI Progress primitive with smooth transitions.
 *
 * @description
 * **Purpose**:
 * - Show upload/download progress
 * - Display task completion
 * - Provide visual feedback for async operations
 * - Improve perceived performance
 *
 * **Features**:
 * - Radix UI Progress primitive (ARIA compliant)
 * - Smooth transitions (transition-all)
 * - Percentage-based value (0-100)
 * - Customizable via createForwardRef helper
 * - Background track + foreground indicator
 *
 * **Styling**:
 * - Height: 16px (h-4)
 * - Rounded: full (rounded-full)
 * - Track: secondary color
 * - Indicator: primary color
 *
 * **Accessibility**:
 * - ARIA role="progressbar"
 * - aria-valuenow, aria-valuemin, aria-valuemax
 * - Announced to screen readers
 *
 * @example
 * // Basic usage (50% complete)
 * <Progress value={50} />
 *
 * @example
 * // File upload progress
 * const [uploadProgress, setUploadProgress] = useState(0)
 * <div className="space-y-2">
 *   <Label>Uploading...</Label>
 *   <Progress value={uploadProgress} />
 *   <p className="text-sm">{uploadProgress}%</p>
 * </div>
 *
 * @example
 * // Indeterminate (no value)
 * <Progress /> // Shows empty state
 *
 * @example
 * // Custom styling
 * <Progress
 *   value={75}
 *   className="h-2 w-full bg-slate-200"
 * />
 *
 * @module components/ui/progress
 * @see {@link https://ui.shadcn.com/docs/components/progress} shadcn Progress Docs
 * @see {@link https://www.radix-ui.com/docs/primitives/components/progress} Radix Progress
 */

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn, createForwardRef } from '@/lib/utils';

const Progress = createForwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>('Progress', ({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));

export { Progress };
