import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as React from "react";

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
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * createForwardRef
 *
 * Generic helper to create React.forwardRef components with full type safety.
 * Reduces boilerplate and provides proper typing for ref and props.
 *
 * Usage:
 * ```
 * const Input = createForwardRef<HTMLInputElement, { placeholder: string }>(
 *   "Input",
 *   (props, ref) => <input ref={ref} {...props} />
 * )
 * ```
 *
 * @template T - The type of the forwarded ref (e.g., HTMLInputElement)
 * @template P - Props interface (default: {})
 * @param displayName - Display name for debugging (shown in React DevTools)
 * @param render - Render function receiving props and ref
 * @returns A React component with properly typed forwardRef
 */
export function createForwardRef<T, P = {}>(
  displayName: string,
  render: (
    props: P & React.RefAttributes<T>,
    ref: React.Ref<T>
  ) => React.ReactElement | null
) {
  const Component = React.forwardRef<T, P & React.RefAttributes<T>>(render as any);
  Component.displayName = displayName;
  return Component;
}

