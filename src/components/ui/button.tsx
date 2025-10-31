/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Button Component - Versatile Action Component
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview shadcn/ui Button component with custom CMYK-themed variants.
 * Built on Radix UI Slot for polymorphic composition.
 *
 * @description
 * **Variants** (11 total):
 * - `default`: Primary button with shadow
 * - `destructive`: Red error/delete actions
 * - `outline`: Bordered button with hover
 * - `secondary`: Secondary actions
 * - `ghost`: Minimal hover-only style
 * - `link`: Text link with underline
 *
 * **Custom CMYK Variants** (print-themed):
 * - `cyan`: Cyan glow effect with scale
 * - `magenta`: Magenta with scale animation
 * - `yellow`: Yellow with scale animation
 * - `whatsapp`: Green WhatsApp brand color
 * - `hero`: Gradient cyan effect
 * - `premium`: Gradient hero with premium shadow
 *
 * **Sizes** (6 total):
 * - `sm`: 36px height (compact)
 * - `default`: 40px height (standard)
 * - `lg`: 44px height (prominent)
 * - `xl`: 56px height (extra large)
 * - `hero`: 64px height (hero sections)
 * - `icon`: 40x40px (square icon buttons)
 *
 * **Features**:
 * - Polymorphic via asChild (can render as any element)
 * - Focus ring for accessibility
 * - Disabled state styling
 * - SVG child sizing
 * - Class Variance Authority (CVA) for type-safe variants
 *
 * @example
 * // Primary button
 * <Button>Click me</Button>
 *
 * @example
 * // WhatsApp styled button
 * <Button variant="whatsapp" size="lg">
 *   <MessageCircle /> Chat with us
 * </Button>
 *
 * @example
 * // Render as link
 * <Button asChild variant="link">
 *   <a href="/services">View Services</a>
 * </Button>
 *
 * @example
 * // Premium hero button
 * <Button variant="premium" size="hero">
 *   Get Started
 * </Button>
 *
 * @module components/ui/button
 * @see {@link https://ui.shadcn.com/docs/components/button} shadcn Button Docs
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevation transition-all duration-300',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // CMYK Hero Variants
        cyan: 'bg-cyan text-cyan-foreground hover:bg-cyan/90 shadow-cyan-glow hover:shadow-cyan-glow hover:scale-105 transition-all duration-300 font-semibold',
        whatsapp:
          'bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg',
        hero: 'bg-gradient-cyan text-white hover:scale-105 hover:shadow-premium transition-all duration-300 font-semibold border-0',
        premium:
          'bg-gradient-hero text-white hover:bg-primary-glow hover:scale-105 transition-all duration-300 font-semibold shadow-premium',
        magenta:
          'bg-magenta text-magenta-foreground hover:bg-magenta/90 hover:scale-105 transition-all duration-300 font-semibold',
        yellow:
          'bg-yellow text-yellow-foreground hover:bg-yellow/90 hover:scale-105 transition-all duration-300 font-semibold',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-14 rounded-lg px-12 text-lg',
        hero: 'h-16 rounded-xl px-16 text-lg font-heading',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
