import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import * as Dialog from "@radix-ui/react-dialog"
import FocusTrap from "focus-trap-react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { urlFor } from "@/lib/image"
import type { PortfolioItem } from "@/types/cms"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  items: PortfolioItem[]
  startIndex: number
}

export default function Lightbox({ open, onOpenChange, items, startIndex }: Props) {
  const [index, setIndex] = useState(startIndex)
  const reduceMotion = useReducedMotion()
  const

imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (open) setIndex((i) => Math.min(Math.max(0, i), Math.max(0, items.length - 1)))
  }, [items.length, open])

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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && current && (
          <Dialog.Portal forceMount>
            <FocusTrap
              active
              focusTrapOptions={{
                initialFocus: false,
                allowOutsideClick: true,
                preventScroll: true
              }}
            >
              <div
                data-testid="lightbox"
                className="fixed inset-0 z-[999] flex items-center justify-center"
              >
                {/* Backdrop */}
                <motion.div
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => onOpenChange(false)}
                />

                {/* Stage */}
                <motion.div
                  role="dialog"
                  aria-label={current?.title ?? "Image viewer"}
                  className="relative z-10 w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="relative mx-auto my-8 max-h-[90vh] max-w-[92vw]">
                    {imgSrc && (
                      <img
                        ref={imgRef}
                        src={imgSrc}
                        alt={current?.title || "Portfolio image"}
                        className="max-h-[85vh] max-w-[90vw] object-contain select-none rounded-lg shadow-2xl"
                        draggable={false}
                      />
                    )}
                    {(current?.title || current?.description) && (
                      <div className="mt-3 rounded-md bg-black/60 px-3 py-2 text-white text-center">
                        {current?.title && (
                          <h3 className="text-base font-semibold">{current.title}</h3>
                        )}
                        {current?.description && (
                          <p className="mt-1 text-sm opacity-90">{current.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Controls */}
                <button
                  data-testid="lightbox-close"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 z-20 rounded-full bg-black/50 p-2 text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>

                {items.length > 1 && (
                  <>
                    <button
                      data-testid="lightbox-prev"
                      onClick={prev}
                      aria-label="Previous"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/50 p-2 text-white/80 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </button>
                    <button
                      data-testid="lightbox-next"
                      onClick={next}
                      aria-label="Next"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/50 p-2 text-white/80 hover:text-white transition-colors"
                    >
                      <ChevronRight className="h-8 w-8" />
                    </button>
                  </>
                )}
              </div>
            </FocusTrap>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
