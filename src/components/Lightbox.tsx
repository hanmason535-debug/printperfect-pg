import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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

export default function Lightbox({ open, onOpenChange, items, startIndex }: Props) {
  const [index, setIndex] = useState(startIndex)
  const [hoverNext, setHoverNext] = useState(false)
  const [nudgeTick, setNudgeTick] = useState(0)
  const reduceMotion = useReducedMotion()
  const imgRef = useRef<HTMLImageElement | null>(null)

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

  // preload neighbors
  useEffect(() => {
    if (!items.length) return
    const preload = (idx: number) => {
      const it = items[idx]
      if (!it?.image) return
      const src = urlFor(it.image).width(1600).format("webp").url()
      const im = new Image()
      im.src = src
    }
    preload((index + 1) % items.length)
    preload((index - 1 + items.length) % items.length)
  }, [index, items])

  const current = items[index]
  const imgSrc = useMemo(() => {
    if (!current?.image) return ""
    return urlFor(current.image).width(1600).format("webp").url()
  }, [current])

  // gentle nudge on the Next button every 4s (disabled on hover / reduce-motion)
  useEffect(() => {
    if (!open || reduceMotion) return
    const id = setInterval(() => {
      if (!hoverNext) setNudgeTick((t) => t + 1)
    }, 4000)
    return () => clearInterval(id)
  }, [open, hoverNext, reduceMotion])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent
            className="p-0 border-0 bg-transparent shadow-none"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Accessible name/description for the dialog */}
            <DialogTitle className="sr-only">{current?.title ?? "Image viewer"}</DialogTitle>
            {current?.description && (
              <DialogDescription className="sr-only">{current.description}</DialogDescription>
            )}
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Stage (image + caption) */}
            <motion.div
              className="fixed inset-0 z-[95] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="relative mx-4 my-8 max-h-[90vh] max-w-[92vw]">
                {imgSrc && (
                  <img
                    ref={imgRef}
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
              className="fixed right-5 top-5 z-[100] rounded-full bg-black/55 hover:bg-black/65 backdrop-blur px-3 py-3 text-white ring-1 ring-white/20 shadow-lg transition"
            >
              <X className="h-7 w-7" />
            </button>

            {/* Prev (left outside) */}
            {items.length > 1 && (
              <button
                onClick={prev}
                aria-label="Previous"
                className="fixed left-6 top-1/2 z-[100] -translate-y-1/2 rounded-full bg-black/55 hover:bg-black/65 backdrop-blur px-3.5 py-3.5 text-white ring-1 ring-white/20 shadow-lg transition"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            {/* Next (right outside) with gentle nudge */}
            {items.length > 1 && (
              <motion.button
                key={nudgeTick} // re-triggers nudge animation
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
                onClick={next}
                aria-label="Next"
                className="fixed right-6 top-1/2 z-[100] -translate-y-1/2 rounded-full bg-black/55 hover:bg-black/65 backdrop-blur px-3.5 py-3.5 text-white ring-1 ring-white/20 shadow-lg transition"
                animate={
                  reduceMotion || hoverNext
                    ? { x: 0, scale: 1 }
                    : { x: [0, 6, 0], scale: [1, 1.02, 1], transition: { duration: 0.6, ease: "easeInOut" } }
                }
              >
                <ChevronRight className="h-8 w-8" />
              </motion.button>
            )}
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
