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
=======
/**
 * cn
 *
 * Merges Tailwind CSS classes intelligently by combining clsx and twMerge.
 * Useful for composing conditional Tailwind classes while handling conflicts.
 *
 * Examples:
 * - `cn("px-2", condition && "px-4")` → resolves to `px-4` (later value wins)
 * - `cn("text-lg", isActive && "text-xl", isDisabled && "text-gray-500")`
 *
 * @param inputs - ClassValue items (strings, arrays, objects, etc.)
 * @returns Merged class string with conflicts resolved by twMerge
>>>>>>> ci/fix-autofix-sticky-comment
>>>>>>> ci/fix-autofix-sticky-comment
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * createForwardRef
 *
 * Generic helper to create React.forwardRef components with full type safety.
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

