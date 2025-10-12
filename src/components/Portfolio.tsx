import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { urlFor } from '@/lib/image'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

const FILTERS = ['All', 'Business Cards', 'Banners', 'Apparel', 'Stickers'] as const
const PER_PAGE = 9

type FilterValue = (typeof FILTERS)[number]

const Portfolio = () => {
  const allItems = usePortfolio()
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All')
  const [page, setPage] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const normalizedItems = useMemo(
    () =>
      allItems.map((item) => ({
        ...item,
        category: item.category ?? '',
        categorySlugs: item.categorySlugs ?? []
      })),
    [allItems]
  )

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') {
      return normalizedItems
    }

    const targetLabel = activeFilter.toLowerCase()
    const targetSlug = activeFilter.toLowerCase().replace(/\s+/g, '-')

    return normalizedItems.filter((item) => {
      const categoryName = item.category?.toLowerCase() ?? ''
      const slugs = item.categorySlugs.map((slug) => slug.toLowerCase())
      return categoryName === targetLabel || slugs.includes(targetSlug)
    })
  }, [activeFilter, normalizedItems])

  useEffect(() => {
    setPage(1)
  }, [activeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const startIndex = (page - 1) * PER_PAGE
  const pageItems = filteredItems.slice(startIndex, startIndex + PER_PAGE)

  const openLightbox = useCallback(
    (globalIndex: number) => {
      setCurrentImageIndex(globalIndex)
      setLightboxOpen(true)
      document.body.style.overflow = 'hidden'
    },
    []
  )

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }, [])

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const count = filteredItems.length || 1
      return (prev + 1) % count
    })
  }, [filteredItems.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const count = filteredItems.length || 1
      return (prev - 1 + count) % count
    })
  }, [filteredItems.length])

  useEffect(() => {
    if (!lightboxOpen) {
      document.body.style.overflow = 'unset'
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [closeLightbox, lightboxOpen, nextImage, prevImage])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  const currentLightboxItem = filteredItems[currentImageIndex]
  const lightboxImageUrl = currentLightboxItem?.image ? urlFor(currentLightboxItem.image).width(1200).url() : ''

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Our
            <span className="bg-gradient-cmyk bg-clip-text text-transparent ml-3">
              Portfolio
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of premium print work showcasing quality,
            creativity, and attention to detail across all our services.
          </p>
        </motion.div>

        {/* Filter Tabs with ARIA roles for accessibility */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          role="tablist"
          aria-label="Portfolio filter"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {FILTERS.map((category) => (
            <motion.button
              key={category}
              role="tab"
              aria-selected={activeFilter === category}
              aria-controls="portfolio-grid"
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-gradient-cyan text-white shadow-cyan-glow'
                  : 'bg-card text-muted-foreground hover:text-cyan hover:bg-accent'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          id="portfolio-grid"
          role="tabpanel"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {pageItems.map((item, index) => {
            const imageUrl = item.image ? urlFor(item.image).width(800).url() : ''

            return (
              <motion.div
                key={item._id ?? `${item.title}-${startIndex + index}`}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative overflow-hidden rounded-xl shadow-elevation bg-card hover:shadow-premium transition-all duration-300"
              >
                {/* Portfolio Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBpZD0icmVjdDE2OTUiIGZpbGw9IiNGM0Y0RjYiLz4KPHRleHQgeD0iMTUwIiB5PSIxMDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGlkPSJ0ZXh0MTY5NyIgZmlsbD0iIzk5QjlBMyIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXNpemU9IjE0Ij5JbWFnZSBLbm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4='
                    }}
                    onClick={() => openLightbox(startIndex + index)}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-100 opacity-90"></div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-heading font-semibold text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {item.description}
                    </p>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-cyan-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                    {item.category}
                  </div>
                </div>

                {/* CMYK Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-accent group-hover:shadow-cyan-glow transition-all duration-300 rounded-xl"></div>
              </motion.div>
            )
          })}
        </motion.div>

        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    onClick={(event) => {
                      event.preventDefault()
                      if (page > 1) {
                        setPage(page - 1)
                      }
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === page}
                      onClick={(event) => {
                        event.preventDefault()
                        setPage(pageNumber)
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                    onClick={(event) => {
                      event.preventDefault()
                      if (page < totalPages) {
                        setPage(page + 1)
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-6 text-lg">
            Ready to bring your ideas to life with premium printing?
          </p>
          <motion.button
            className="bg-gradient-cyan text-white px-8 py-4 rounded-full font-semibold shadow-cyan-glow hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            onClick={() =>
              window.open('https://wa.me/919377476343?text=I would like to discuss my printing project', '_blank')
            }
          >
            Start Your Project
          </motion.button>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxOpen && filteredItems.length > 0 && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-60 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Arrows */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 z-60 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 z-60 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}

              {/* Image Container */}
              <motion.div
                className="relative max-w-[90vw] max-h-[90vh] mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(event) => event.stopPropagation()}
              >
                {/* Loading placeholder */}
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />

                {lightboxImageUrl ? (
                  <img
                    src={lightboxImageUrl}
                    sizes="(max-width: 768px) 90vw, 80vw"
                    alt={currentLightboxItem?.title ?? 'Portfolio item'}
                    className="relative z-10 w-full h-full object-contain rounded-lg shadow-2xl"
                    loading="lazy"
                    onLoad={(event) => {
                      const placeholder = event.currentTarget.previousElementSibling as HTMLElement
                      if (placeholder) placeholder.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="relative z-10 w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm font-medium rounded-lg">
                    Image coming soon
                  </div>
                )}

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  <h3 className="text-white font-heading font-semibold text-xl mb-2">
                    {currentLightboxItem?.title}
                  </h3>
                  <p className="text-white/90">
                    {currentLightboxItem?.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Portfolio
