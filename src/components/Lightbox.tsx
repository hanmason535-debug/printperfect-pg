
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { urlFor } from "@/lib/image"
import type { PortfolioItem } from "@/types/cms"

interface LightboxProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  items: PortfolioItem[]
  startIndex: number
}

export default function Lightbox({ open, onOpenChange, items, startIndex }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Keep index in bounds if filter set changes while open
  useEffect(() => {
    if (open && items.length > 0) {
      setIndex((i) => Math.min(Math.max(0, i), items.length - 1))
    }
  }, [items.length, open])

  // Reset to clicked item when (re)opened
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

  // Keyboard controls: Esc closes; arrows navigate
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

  // Preload adjacent images for smooth navigation
  useEffect(() => {
    if (!items.length || !open) return
    const preload = (idx: number) => {
      const item = items[idx]
      if (!item?.image) return
      const src = urlFor(item.image).width(1600).format("webp").url()
      const img = new Image()
      img.src = src
    }
    preload((index + 1) % items.length)
    preload((index - 1 + items.length) % items.length)
  }, [index, items, open])

  const current = items[index]
  const imgSrc = useMemo(() => {
    if (!current?.image) return ""
    return urlFor(current.image).width(1600).format("webp").url()
  }, [current])

  // LQIP (Low Quality Image Placeholder) for smooth loading
  const lqipSrc = useMemo(() => {
    if (!current?.image) return ""
    return urlFor(current.image).width(24).blur(50).url()
  }, [current])

  if (!open || !current) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent
            className="p-0 border-0 bg-transparent shadow-none max-w-none w-full h-full"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onEscapeKeyDown={() => onOpenChange(false)}
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
            />

            {/* Main Stage */}
            <motion.div
              role="dialog"
              aria-label={current.title || "Image viewer"}
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => {
                // Close only if clicking the backdrop, not the image
                if (e.target === e.currentTarget) {
                  onOpenChange(false)
                }
              }}
            >
              {/* Click zones for prev/next on large screens */}
              {items.length > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    onClick={(e) => {
                      e.stopPropagation()
                      prev()
                    }}
                    className="hidden md:block absolute left-0 top-0 h-full w-1/5 cursor-w-resize focus:outline-none hover:bg-white/5 transition-colors"
                    tabIndex={-1}
                  />
                  <button
                    aria-label="Next image"
                    onClick={(e) => {
                      e.stopPropagation()
                      next()
                    }}
                    className="hidden md:block absolute right-0 top-0 h-full w-1/5 cursor-e-resize focus:outline-none hover:bg-white/5 transition-colors"
                    tabIndex={-1}
                  />
                </>
              )}

              {/* Image Container */}
              <div className="relative mx-4 my-8 max-h-[90vh] max-w-[92vw]">
                {/* LQIP Background */}
                {lqipSrc && (
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-50"
                    style={{ backgroundImage: `url(${lqipSrc})` }}
                  />
                )}

                {/* Main Image */}
                {imgSrc && (
                  <motion.img
                    key={index}
                    ref={imgRef}
                    src={imgSrc}
                    alt={current.title || "Portfolio image"}
                    className="relative max-h-[80vh] max-w-[92vw] object-contain select-none rounded-lg shadow-2xl"
                    draggable={false}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                {/* Close Button */}
                <button
                  onClick={() => onOpenChange(false)}
                  aria-label="Close lightbox"
                  className="absolute -right-2 -top-2 rounded-full bg-black/80 hover:bg-black/90 p-2.5 text-white shadow-lg transition-all hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Navigation Arrows */}
                {items.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prev()
                      }}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/80 hover:bg-black/90 p-2.5 text-white shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        next()
                      }}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/80 hover:bg-black/90 p-2.5 text-white shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {items.length > 1 && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-3 py-1 text-xs text-white">
                    {index + 1} / {items.length}
                  </div>
                )}

                {/* Caption Footer */}
                {(current.title || current.description) && (
                  <motion.div
                    className="mt-3 rounded-lg bg-black/80 backdrop-blur-sm px-4 py-3 text-white shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {current.title && (
                      <h3 className="text-sm font-semibold font-heading">{current.title}</h3>
                    )}
                    {current.description && (
                      <p className="mt-1 text-xs opacity-90 leading-relaxed">{current.description}</p>
                    )}
                    {current.category && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-cyan-accent/20 text-cyan-accent text-xs rounded-full">
                        {current.category}
                      </span>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
