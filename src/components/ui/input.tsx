/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Input Component - Form Input Field
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview shadcn/ui Input component for text fields.
 * Styled wrapper around native HTML input element.
 *
 * @description
 * **Features**:
 * - All native input types supported (text, email, file, etc.)
 * - Focus ring for accessibility (ring-2)
 * - Disabled state styling (opacity-50, cursor-not-allowed)
 * - File input styling (file:* selectors)
 * - Placeholder styling (placeholder:text-muted-foreground)
 * - Responsive text sizing (text-base on mobile, text-sm on desktop)
 *
 * **Common Types**:
 * - text: Standard text input
 * - email: Email validation
 * - password: Masked input
 * - file: File upload
 * - number: Numeric input
 * - tel: Phone number
 *
 * **Styling**:
 * - Height: 40px (h-10)
 * - Border: 1px input color
 * - Rounded: medium (rounded-md)
 * - Padding: 12px horizontal, 8px vertical
 *
 * @example
 * // Basic text input
 * <Input type="text" placeholder="Enter your name" />
 *
 * @example
 * // Email input with ref
 * const emailRef = useRef<HTMLInputElement>(null)
 * <Input ref={emailRef} type="email" placeholder="Email" />
 *
 * @example
 * // File upload
 * <Input
 *   type="file"
 *   accept="image/*"
 *   onChange={(e) => handleFileChange(e.target.files)}
 * />
 *
 * @example
 * // With label (accessibility)
 * <div>
 *   <Label htmlFor="name">Name</Label>
 *   <Input id="name" type="text" />
 * </div>
 *
 * @module components/ui/input
 * @see {@link https://ui.shadcn.com/docs/components/input} shadcn Input Docs
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
