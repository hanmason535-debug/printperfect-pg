import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generic helper to create forwardRef components with type safety
 * Reduces boilerplate for React.forwardRef patterns
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
