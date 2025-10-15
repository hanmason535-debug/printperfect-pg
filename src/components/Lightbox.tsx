import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { urlFor } from "@/lib/image"
import type { PortfolioItem } from "@/types/cms"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  items: PortfolioItem[]           // filtered set (in display order)
  startIndex: number               // index of clicked card within filtered set
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export default function Lightbox({ open, onOpenChange, items, startIndex }: Props) {
  const [index, setIndex] = useState(startIndex)
  const [hoverNext, setHoverNext] = useState(false)
  const [nudgeActive, setNudgeActive] = useState(false)
  const reduceMotion = useReducedMotion()
  const imgRef = useRef<HTMLImageElement | null>(null)
  const nudgeTimeoutRef = useRef<number | null>(null)
  const [arrowPos, setArrowPos] = useState(() => {
    if (typeof window === "undefined") {
      return { left: 96, right: 96, midY: 360 }
    }
    const width = window.innerWidth
    const height = window.innerHeight
    return {
      left: Math.max(24, width * 0.2),
      right: Math.min(width - 24, width * 0.8),
      midY: clamp(height / 2, 80, height - 80)
    }
  })

  const measureArrows = useCallback(() => {
    if (typeof window === "undefined") return
    const width = window.innerWidth
    const height = window.innerHeight
    const fallback = {
      left: Math.max(24, width * 0.2),
      right: Math.min(width - 24, width * 0.8),
      midY: clamp(height / 2, 80, height - 80)
    }

    if (!imgRef.current) {
      setArrowPos(fallback)
      return
    }

    const rect = imgRef.current.getBoundingClientRect()
    const pad = 24
    const left = clamp(rect.left - pad, 24, width / 2)
    const right = clamp(rect.right + pad, width / 2, width - 24)
    const midY = clamp(rect.top + rect.height / 2, 80, height - 80)
    setArrowPos({ left, right, midY })
  }, [])

  // keep index valid if items change while open
  useEffect(() => {
    if (open) setIndex((i) => Math.min(Math.max(0, i), Math.max(0, items.length - 1)))
  }, [items.length, open])

  // reset to the clicked item when opening
  useEffect(() => {
    if (open) setIndex(startIndex)
  }, [open, startIndex])

  const prev = useCallback(() => {
    if (!items.length) return
    setIndex((i) => (i - 1 + items.length) % items.length)
  }, [items.length])

  const next = useCallback(() => {
    if (!items.length) return
    setIndex((i) => (i + 1) % items.length)
  }, [items.length])

  // keyboard: esc closes; arrows navigate
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
      else if (e.key === "ArrowRight") next()
      else if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange, next, prev])

  // position controls when lightbox/image changes
  useLayoutEffect(() => {
    if (!open) return
    measureArrows()
  }, [open, index, measureArrows])

  useEffect(() => {
    if (!open) return
    const handler = () => measureArrows()
    window.addEventListener("resize", handler)
    window.addEventListener("orientationchange", handler)
    return () => {
      window.removeEventListener("resize", handler)
      window.removeEventListener("orientationchange", handler)
    }
  }, [open, measureArrows])

  // preload neighbors
  useEffect(() => {
    if (!items.length) return
    for (const offset of [-1, 1]) {
      const idx = (index + offset + items.length) % items.length
      const it = items[idx]
      if (!it?.image) continue
      const src = urlFor(it.image).width(1600).format("webp").url()
      const im = new Image()
      im.src = src
    }
  }, [index, items])

  const current = items[index]
  const imgSrc = useMemo(() => {
    if (!current?.image) return ""
    return urlFor(current.image).width(1600).format("webp").url()
  }, [current])

  // gentle nudge on the Next button every 5s (disabled on hover / reduce-motion)
  useEffect(() => {
    if (!open || reduceMotion) return
    const interval = window.setInterval(() => {
      if (hoverNext) return
      setNudgeActive(true)
      if (nudgeTimeoutRef.current) window.clearTimeout(nudgeTimeoutRef.current)
      nudgeTimeoutRef.current = window.setTimeout(() => {
        setNudgeActive(false)
        nudgeTimeoutRef.current = null
      }, 600)
    }, 5000)

    return () => {
      window.clearInterval(interval)
      if (nudgeTimeoutRef.current) {
        window.clearTimeout(nudgeTimeoutRef.current)
        nudgeTimeoutRef.current = null
      }
      setNudgeActive(false)
    }
  }, [open, hoverNext, reduceMotion])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent
            className="p-0 border-0 bg-transparent shadow-none [&_[data-radix-dialog-close]]:hidden"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Accessible name/description for the dialog */}
            <DialogTitle className="sr-only">{current?.title ?? "Image viewer"}</DialogTitle>
            {current?.description && (
              <DialogDescription className="sr-only">{current.description}</DialogDescription>
            )}
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Stage (image + caption) */}
            <motion.div
              data-testid="lightbox-stage"
              className="fixed inset-0 z-[950] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="relative mx-4 my-8 max-h-[90vh] max-w-[92vw]">
                {imgSrc && (
                  <img
                    ref={imgRef}
                    onLoad={measureArrows}
                    src={imgSrc}
                    alt={current?.title || "Portfolio image"}
                    className="max-h-[80vh] max-w-[92vw] object-contain select-none rounded-2xl"
                    draggable={false}
                  />
                )}

                {(current?.title || current?.description) && (
                  <div className="mt-3 rounded-md bg-black/60 px-3 py-2 text-white">
                    {current?.title && <h3 className="text-sm font-medium">{current.title}</h3>}
                    {current?.description && (
                      <p className="mt-1 text-xs opacity-90">{current.description}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* OUTSIDE controls (always above) */}
            {/* Close (top-right) */}
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              data-testid="lightbox-close"
              className="fixed right-6 top-6 z-[1000] rounded-full bg-black/55 hover:bg-black/65 backdrop-blur px-4 py-4 text-white ring-1 ring-white/20 shadow-lg transition focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Prev (left outside) */}
            {items.length > 1 && (
              <button
                onClick={prev}
                aria-label="Previous"
                data-testid="lightbox-prev"
                style={{ left: `${arrowPos.left}px`, top: `${arrowPos.midY}px` }}
                className="fixed z-[1000] -translate-x-full -translate-y-1/2 rounded-full bg-black/55 hover:bg-black/65 backdrop-blur px-4 py-4 text-white ring-1 ring-white/20 shadow-lg transition focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <ChevronLeft className="h-9 w-9" />
              </button>
            )}

            {/* Next (right outside) with gentle nudge */}
            {items.length > 1 && (
              <motion.button
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
                onClick={next}
                aria-label="Next"
                data-testid="lightbox-next"
                style={{ left: `${arrowPos.right}px`, top: `${arrowPos.midY}px` }}
                className="fixed z-[1000] -translate-y-1/2 rounded-full bg-black/55 hover:bg-black/65 backdrop-blur px-4 py-4 text-white ring-1 ring-white/20 shadow-lg transition focus:outline-none focus:ring-2 focus:ring-white/40"
                animate={
                  reduceMotion || hoverNext || !nudgeActive
                    ? { x: 0, scale: 1 }
                    : { x: [0, 6, 0], scale: [1, 1.04, 1], transition: { duration: 0.6, ease: "easeInOut" } }
                }
              >
                <ChevronRight className="h-9 w-9" />
              </motion.button>
            )}
            <style>
              {`
                :where(button[data-testid="lightbox-prev"], button[data-testid="lightbox-next"], button[data-testid="lightbox-close"]) {
                  transition: background-color 0.2s ease, transform 0.2s ease;
                }
              `}
            </style>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
