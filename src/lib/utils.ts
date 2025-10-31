/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Utility Functions - Common Helpers & Type-Safe Utilities
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Common utility functions used throughout the application,
 * including className merging and React component helpers.
 *
 * @description
 * This file exports utility functions for:
 *
 * **cn() Function**:
 * - Merges Tailwind CSS classes intelligently
 * - Resolves conflicts (e.g., "p-4 p-2" → "p-2")
 * - Handles conditional classes
 * - Combines clsx and tailwind-merge
 *
 * **createForwardRef() Helper**:
 * - Type-safe wrapper for React.forwardRef
 * - Reduces boilerplate code
 * - Automatically sets displayName
 * - Used for UI component library
 *
 * @module lib/utils
 * @see {@link https://github.com/dcastil/tailwind-merge} tailwind-merge
 * @see {@link https://github.com/lukeed/clsx} clsx
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as React from 'react';

/**
 * Merge Tailwind CSS classes with intelligent conflict resolution
 *
 * @function cn
 * @param {...ClassValue[]} inputs - Class names, objects, or arrays to merge
 * @returns {string} Merged className string with conflicts resolved
 *
 * @description
 * The `cn` function combines multiple className inputs and resolves Tailwind conflicts:
 *
 * **How it works**:
 * 1. `clsx()` combines all inputs (handles conditionals, arrays, objects)
 * 2. `twMerge()` resolves Tailwind conflicts (last class wins)
 *
 * **Conflict Resolution**:
 * - "px-4 px-2" → "px-2" (padding-x conflict)
 * - "text-sm text-lg" → "text-lg" (font-size conflict)
 * - "bg-red-500 bg-blue-500" → "bg-blue-500" (background color conflict)
 *
 * **Conditional Classes**:
 * - Handles objects: `{ 'active': isActive }`
 * - Handles arrays: `['base', condition && 'extra']`
 * - Filters out falsy values automatically
 *
 * @example
 * // Basic usage
 * cn('px-4 py-2', 'text-white')
 * // → "px-4 py-2 text-white"
 *
 * @example
 * // Conflict resolution
 * cn('px-4', 'px-2')
 * // → "px-2"
 *
 * @example
 * // Conditional classes
 * cn('base-class', isActive && 'active-class', {
 *   'hover-class': canHover,
 *   'disabled-class': isDisabled
 * })
 *
 * @example
 * // Common component pattern
 * function Button({ className, variant }) {
 *   return (
 *     <button
 *       className={cn(
 *         'px-4 py-2 rounded',
 *         variant === 'primary' && 'bg-blue-500',
 *         variant === 'secondary' && 'bg-gray-500',
 *         className
 *       )}
 *     />
 *   )
 * }
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Create a type-safe forwardRef component with automatic displayName
 *
 * @function createForwardRef
 * @template T - The ref type (e.g., HTMLDivElement, HTMLButtonElement)
 * @template P - The props type (default: empty object)
 *
 * @param {string} displayName - Component name for React DevTools
 * @param {Function} render - Render function (props, ref) => ReactElement
 * @returns {React.ForwardRefExoticComponent<P>} ForwardRef component
 *
 * @description
 * Generic helper to reduce boilerplate when creating forwardRef components.
 *
 * **Benefits**:
 * - Type safety for both props and ref
 * - Automatic displayName setting (helps with debugging)
 * - Reduces repetitive typing
 * - Used extensively in shadcn/ui components
 *
 * **Type Parameters**:
 * - `T`: Type of the DOM element (HTMLButtonElement, HTMLDivElement, etc.)
 * - `P`: Type of component props (your custom prop interface)
 *
 * @example
 * // Without helper (verbose)
 * const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 *   (props, ref) => <button ref={ref} {...props} />
 * )
 * Button.displayName = 'Button'
 *
 * @example
 * // With helper (concise)
 * const Button = createForwardRef<HTMLButtonElement, ButtonProps>(
 *   'Button',
 *   (props, ref) => <button ref={ref} {...props} />
 * )
 *
 * @example
 * // Full example with custom props
 * interface CardProps {
 *   title: string
 *   variant?: 'default' | 'outline'
 * }
 *
 * const Card = createForwardRef<HTMLDivElement, CardProps>(
 *   'Card',
 *   ({ title, variant = 'default', ...props }, ref) => (
 *     <div
 *       ref={ref}
 *       className={cn('card', `card-${variant}`)}
 *       {...props}
 *     >
 *       <h3>{title}</h3>
 *     </div>
 *   )
 * )
 */
export function createForwardRef<T, P = object>(
  displayName: string,
  render: (props: P & React.RefAttributes<T>, ref: React.Ref<T>) => React.ReactElement | null
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = React.forwardRef<T, P & React.RefAttributes<T>>(render as any);
  Component.displayName = displayName;
  return Component;
}
