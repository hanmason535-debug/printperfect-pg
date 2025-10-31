/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Dialog Component - Modal Dialog System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview shadcn/ui Dialog components for modals and overlays.
 * Built on Radix UI Dialog primitive with focus trapping and accessibility.
 *
 * @description
 * **Components**:
 * - Dialog: Root container (manages open state)
 * - DialogTrigger: Opens dialog when clicked
 * - DialogContent: Main dialog content with overlay
 * - DialogHeader: Title/description container
 * - DialogFooter: Action buttons container
 * - DialogTitle: Dialog heading (required for a11y)
 * - DialogDescription: Dialog description text
 * - DialogClose: Close button component
 *
 * **Features**:
 * - Focus trap (keyboard navigation contained)
 * - Backdrop overlay (dark semi-transparent)
 * - Escape key to close
 * - Backdrop click to close
 * - Smooth enter/exit animations
 * - ARIA compliant (role="dialog")
 * - Portal rendering (outside DOM hierarchy)
 *
 * **Animations**:
 * - Overlay: fade in/out
 * - Content: zoom + slide in/out
 * - Smooth 200ms transitions
 *
 * **Accessibility**:
 * - Auto-focus on open
 * - Focus returns on close
 * - Escape key handler
 * - ARIA dialog role
 * - Title announced by screen readers
 *
 * @example
 * // Basic dialog
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Dialog Title</DialogTitle>
 *       <DialogDescription>
 *         Dialog description here
 *       </DialogDescription>
 *     </DialogHeader>
 *     <div>Dialog content</div>
 *     <DialogFooter>
 *       <Button>Save</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 *
 * @example
 * // Controlled dialog
 * const [open, setOpen] = useState(false)
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogContent>
 *     <DialogTitle>Controlled</DialogTitle>
 *   </DialogContent>
 * </Dialog>
 *
 * @example
 * // With close button
 * <DialogContent>
 *   <DialogClose className="absolute top-4 right-4">
 *     <X className="h-4 w-4" />
 *   </DialogClose>
 *   <DialogTitle>Title</DialogTitle>
 * </DialogContent>
 *
 * @module components/ui/dialog
 * @see {@link https://ui.shadcn.com/docs/components/dialog} shadcn Dialog Docs
 * @see {@link https://www.radix-ui.com/docs/primitives/components/dialog} Radix Dialog
 */

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
