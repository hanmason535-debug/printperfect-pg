/**
 * Toast Notification Utilities
 * Centralized toast notification helpers for consistent UX
 */

import { toast } from 'sonner'

/**
 * Show a success toast notification
 * @param message - Success message to display
 * @param description - Optional detailed description
 */
export const showSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 4000,
  })
}

/**
 * Show an error toast notification
 * @param message - Error message to display
 * @param description - Optional detailed description
 */
export const showError = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 5000,
  })
}

/**
 * Show an info toast notification
 * @param message - Info message to display
 * @param description - Optional detailed description
 */
export const showInfo = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 3000,
  })
}

/**
 * Show a warning toast notification
 * @param message - Warning message to display
 * @param description - Optional detailed description
 */
export const showWarning = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    duration: 4000,
  })
}

/**
 * Show a loading toast notification
 * @param message - Loading message to display
 * @returns Toast ID for later dismissal
 */
export const showLoading = (message: string) => {
  return toast.loading(message)
}

/**
 * Dismiss a toast by ID
 * @param toastId - ID returned from showLoading or other toast methods
 */
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId)
}

/**
 * Show a promise-based toast with loading, success, and error states
 * @param promise - Promise to track
 * @param messages - Messages for each state
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: Error) => string)
  }
) => {
  return toast.promise(promise, messages)
}
