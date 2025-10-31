/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Label Component - Form Label
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview shadcn/ui Label component for form field labels.
 * Built on Radix UI Label primitive for accessibility.
 *
 * @description
 * **Purpose**:
 * - Associate labels with form inputs (htmlFor / id)
 * - Improve accessibility (screen readers)
 * - Provide click targets (clicking label focuses input)
 * - Disabled state styling via peer selector
 *
 * **Features**:
 * - Radix UI Label primitive (proper ARIA attributes)
 * - Peer-disabled support (peer-disabled:opacity-70)
 * - Small, medium font weight
 * - Leading-none (tight line height)
 *
 * **Styling**:
 * - Font size: small (text-sm)
 * - Font weight: medium
 * - Color: Inherits from theme
 *
 * **Accessibility**:
 * - Associates with input via htmlFor prop
 * - Announces to screen readers
 * - Clicking label focuses associated input
 *
 * @example
 * // Basic usage with Input
 * <div className="space-y-2">
 *   <Label htmlFor="email">Email Address</Label>
 *   <Input id="email" type="email" />
 * </div>
 *
 * @example
 * // With required indicator
 * <Label htmlFor="name">
 *   Name <span className="text-destructive">*</span>
 * </Label>
 *
 * @example
 * // With disabled input
 * <div className="peer">
 *   <Input id="disabled" disabled />
 * </div>
 * <Label htmlFor="disabled">Disabled Field</Label>
 *
 * @module components/ui/label
 * @see {@link https://ui.shadcn.com/docs/components/label} shadcn Label Docs
 * @see {@link https://www.radix-ui.com/docs/primitives/components/label} Radix Label
 */

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
