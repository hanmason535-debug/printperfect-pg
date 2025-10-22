import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { urlFor } from "@/lib/image"
import type { PortfolioItem } from "@/types/cms"

/**
 * Lightbox Props
 * 
 * @property open - Whether the lightbox is currently visible
 * @property onOpenChange - Callback to update lightbox visibility
 * @property items - Array of portfolio items to display (in gallery order)
 * @property startIndex - Initial item index when lightbox opens (default: 0)
 */
type Props = {
  open: boolean
  onOpenChange: (value: boolean) => void
  items: PortfolioItem[]
  startIndex: number
}

// SVG placeholder shown when image fails to load
const FALLBACK_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkEwIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPHN2Zz4="

/**
 * buildImageSrc
 * 
 * Constructs the Sanity image URL for display at 1600px width in WebP format.
 * Returns empty string if item or image is not available.
 * 
 * @param item - Portfolio item (optional)
 * @returns Full image URL or empty string
 */
const buildImageSrc = (item?: PortfolioItem) => {
  if (!item?.image) return ""
  return urlFor(item.image).width(1600).format("webp").url()
}

/**
 * Lightbox
 *
 * A full-screen modal image gallery viewer for portfolio items.
 *
 * Features:
 * - Smooth enter/exit animations with backdrop
 * - Previous/Next navigation with keyboard shortcuts (Arrow keys)
 * - ESC key to close
 * - Circular navigation (loops to opposite end)
 * - Image preloading for next/previous items
 * - Lazy loading with placeholder skeleton
 * - Fallback image on load failure
 * - Title and description overlay at bottom
 * - Prevents body scroll when open
 * - Full accessibility support
 * - No navigation controls when fewer than 2 items
 *
 * Props: see `Props` type above
 *
 * State:
 * - `index`: current position in items array
 * - `imageLoaded`: whether the current image has finished loading
 */
export default function Lightbox({ open, onOpenChange, items, startIndex }: Props) {
  const [index, setIndex] = useState(startIndex)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Derived state: current item and item count
  const itemCount = items.length
  const current = itemCount > 0 ? items[Math.min(index, itemCount - 1)] : undefined

  // Memoized image source URL for current item
  const imageSrc = useMemo(() => buildImageSrc(current), [current])

  // Sync index with startIndex when lightbox opens (ensuring bounds)
  useEffect(() => {
    if (!open) return
    const nextIndex = itemCount > 0 ? Math.min(Math.max(startIndex, 0), itemCount - 1) : 0
    setIndex(nextIndex)
  }, [open, startIndex, itemCount])

  // Ensure index stays within bounds when item count changes
  useEffect(() => {
    if (!open) return
    if (itemCount === 0) {
      setIndex(0)
      return
    }
    setIndex((value) => Math.min(Math.max(value, 0), itemCount - 1))
  }, [itemCount, open])

  // Reset image loaded state when image source changes (for loading skeleton)
  useEffect(() => {
    setImageLoaded(false)
  }, [imageSrc])

  /**
   * close
   * 
   * Closes the lightbox modal by calling onOpenChange(false).
   */
  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  /**
   * prev
   * 
   * Navigates to previous image in circular fashion.
   * No-op if fewer than 2 items.
   */
  const prev = useCallback(() => {
    if (itemCount <= 1) return
    setIndex((value) => (value - 1 + itemCount) % itemCount)
  }, [itemCount])

  /**
   * next
   * 
   * Navigates to next image in circular fashion.
   * No-op if fewer than 2 items.
   */
  const next = useCallback(() => {
    if (itemCount <= 1) return
    setIndex((value) => (value + 1) % itemCount)
  }, [itemCount])

  // Keyboard navigation: ESC to close, Arrow keys to navigate
  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
      else if (event.key === "ArrowRight") next()
      else if (event.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [close, next, open, prev])

  // Prevent body scroll when lightbox is open (and restore on close)
  useEffect(() => {
    if (!open) return
    if (typeof document === "undefined") return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Preload next and previous images for smoother navigation
  useEffect(() => {
    if (!open) return
    if (itemCount < 2) return
    const preload = (targetIndex: number) => {
      const item = items[targetIndex]
      if (!item?.image) return
      const src = urlFor(item.image).width(1600).format("webp").url()
      const img = new Image()
      img.src = src
    }
    preload((index + 1) % itemCount)
    preload((index - 1 + itemCount) % itemCount)
  }, [index, itemCount, items, open])

  // Show navigation controls only if gallery has multiple items
  const showNavigation = itemCount > 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent
            className="z-[999] p-0 border-0 bg-transparent shadow-none [&_[data-radix-dialog-close]]:hidden"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <DialogTitle className="sr-only">{current?.title ?? "Image viewer"}</DialogTitle>
            {current?.description && (
              <DialogDescription className="sr-only">{current.description}</DialogDescription>
            )}

            <AnimatePresence>
              <motion.div
                key="lightbox-backdrop"
                className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={close}
              />
            </AnimatePresence>

            <AnimatePresence>
              <motion.div
                key="lightbox-stage-wrapper"
                className="fixed inset-0 z-[950] flex items-center justify-center px-4 py-8"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onClick={close}
              >
                <motion.div
                  data-testid="lightbox-stage"
                  className="relative mx-auto max-h-[90vh] max-w-[90vw] w-full pointer-events-auto"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="relative max-h-[90vh] overflow-hidden rounded-xl bg-black/20 shadow-2xl">
                    {!imageLoaded && (
                      <div className="absolute inset-0 animate-pulse rounded-xl bg-muted" />
                    )}
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={current?.title || "Portfolio image"}
                        className="relative z-10 max-h-[90vh] w-full rounded-xl object-contain"
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE
                          setImageLoaded(true)
                        }}
                        draggable={false}
                      />
                    ) : (
                      <div className="relative z-10 flex h-[60vh] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                        Image unavailable
                      </div>
                    )}
                    {(current?.title || current?.description) && (
                      <div className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                        {current?.title && (
                          <h3 className="text-xl font-semibold text-white">{current.title}</h3>
                        )}
                        {current?.description && (
                          <p className="mt-2 text-sm text-white/90">{current.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              aria-label="Close"
              data-testid="lightbox-close"
              className="fixed right-6 top-6 z-[1000] rounded-full bg-white/15 px-4 py-4 text-white shadow-lg backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
              onClick={(event) => {
                event.stopPropagation()
                close()
              }}
            >
              <X className="h-8 w-8" />
            </button>

            {showNavigation && (
              <>
                <button
                  type="button"
                  aria-label="Previous"
                  data-testid="lightbox-prev"
                  className="fixed left-6 top-1/2 z-[1000] -translate-y-1/2 rounded-full bg-white/15 px-4 py-4 text-white shadow-lg backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
                  onClick={(event) => {
                    event.stopPropagation()
                    prev()
                  }}
                >
                  <ChevronLeft className="h-9 w-9" />
                </button>

                <button
                  type="button"
                  aria-label="Next"
                  data-testid="lightbox-next"
                  className="fixed right-6 top-1/2 z-[1000] -translate-y-1/2 rounded-full bg-white/15 px-4 py-4 text-white shadow-lg backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
                  onClick={(event) => {
                    event.stopPropagation()
                    next()
                  }}
                >
                  <ChevronRight className="h-9 w-9" />
                </button>
              </>
            )}
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
