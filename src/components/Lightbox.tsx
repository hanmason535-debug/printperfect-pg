/**
 * Lightbox - Fullscreen image viewer for portfolio items.
 * Supports keyboard navigation, image preloading, reduced-motion preference,
 * and accessible dialog semantics.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { urlFor } from '@/lib/image'
import type { PortfolioItem } from '@/types/cms'

type Props = {
  open: boolean
  onOpenChange: (value: boolean) => void
  items: PortfolioItem[]
  startIndex: number
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkEwIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPHN2Zz4='

const buildImageSrc = (item?: PortfolioItem) => {
  if (!item?.image) return ''
  return urlFor(item.image).width(1600).format('webp').url()
}

export default function Lightbox({ open, onOpenChange, items, startIndex }: Props) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(() => Math.max(0, Math.min(startIndex, Math.max(0, items.length - 1))))
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hoverNext, setHoverNext] = useState(false)
  const [nudgeTick, setNudgeTick] = useState(0)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const itemCount = items.length
  const current = itemCount > 0 ? items[Math.min(index, itemCount - 1)] : undefined
  const imageSrc = useMemo(() => buildImageSrc(current), [current])

  useEffect(() => {
    if (!open) return
    const idx = itemCount > 0 ? Math.min(Math.max(startIndex, 0), itemCount - 1) : 0
    setIndex(idx)
  }, [open, startIndex, itemCount])

  useEffect(() => {
    if (!open) return
    if (itemCount === 0) {
      setIndex(0)
      return
    }
    setIndex((v) => Math.min(Math.max(v, 0), itemCount - 1))
  }, [itemCount, open])

  useEffect(() => {
    setImageLoaded(false)
  }, [imageSrc])

  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  const prev = useCallback(() => {
    if (itemCount <= 1) return
    setIndex((v) => (v - 1 + itemCount) % itemCount)
  }, [itemCount])

  const next = useCallback(() => {
    if (itemCount <= 1) return
    setIndex((v) => (v + 1) % itemCount)
  }, [itemCount])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, close, next, prev])

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    if (itemCount < 2) return
    const preload = (t: number) => {
      const it = items[t]
      if (!it?.image) return
      const src = urlFor(it.image).width(1600).format('webp').url()
      const img = new Image()
      img.src = src
    }
    preload((index + 1) % itemCount)
    preload((index - 1 + itemCount) % itemCount)
  }, [index, itemCount, items, open])

  useEffect(() => {
    if (!open || reduceMotion) return
    const id = setInterval(() => {
      if (!hoverNext) setNudgeTick((t) => t + 1)
    }, 4000)
    return () => clearInterval(id)
  }, [open, hoverNext, reduceMotion])

  const showNavigation = itemCount > 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && current && (
          <DialogContent
            data-testid="lightbox"
            className="z-[999] p-0 border-0 bg-transparent shadow-none max-w-none w-full h-full"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogTitle className="sr-only">{current?.title ?? 'Image viewer'}</DialogTitle>
            {current?.description && (
              <DialogDescription className="sr-only">{current.description}</DialogDescription>
            )}

            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              onClick={close}
            />

            <motion.div
              key="stage"
              className="fixed inset-0 z-[950] flex items-center justify-center px-4 py-8"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              onClick={close}
            >
              <motion.div
                data-testid="lightbox-stage"
                className="relative mx-auto max-h-[90vh] max-w-[90vw] w-full pointer-events-auto"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative max-h-[90vh] overflow-hidden rounded-xl bg-black/20 shadow-2xl">
                  {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse rounded-xl bg-muted" />
                  )}
                  {imageSrc ? (
                    <img
                      ref={imgRef}
                      src={imageSrc}
                      alt={current?.title || 'Portfolio image'}
                      className="relative z-10 max-h-[90vh] w-full rounded-xl object-contain"
                      loading="lazy"
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE
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

            <button
              type="button"
              aria-label="Close"
              data-testid="lightbox-close"
              className="fixed right-6 top-6 z-[1000] rounded-full bg-white/15 px-4 py-4 text-white shadow-lg backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
              onClick={(e) => {
                e.stopPropagation()
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
                  onClick={(e) => {
                    e.stopPropagation()
                    prev()
                  }}
                >
                  <ChevronLeft className="h-9 w-9" />
                </button>

                <motion.button
                  type="button"
                  aria-label="Next"
                  data-testid="lightbox-next"
                  key={nudgeTick}
                  onMouseEnter={() => setHoverNext(true)}
                  onMouseLeave={() => setHoverNext(false)}
                  className="fixed right-6 top-1/2 z-[1000] -translate-y-1/2 rounded-full bg-white/15 px-4 py-4 text-white shadow-lg backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
                  onClick={(e) => {
                    e.stopPropagation()
                    next()
                  }}
                  animate={reduceMotion || hoverNext ? { x: 0, scale: 1 } : { x: [0, 6, 0], scale: [1, 1.02, 1], transition: { duration: 0.6 } }}
                >
                  <ChevronRight className="h-9 w-9" />
                </motion.button>
              </>
            )}
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
