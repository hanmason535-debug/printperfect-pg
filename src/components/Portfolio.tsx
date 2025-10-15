
import { usePortfolio } from '@/hooks/usePortfolio'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { urlFor } from '@/lib/image'
import { useState, useMemo, useEffect, useCallback } from 'react'
import Lightbox from '@/components/Lightbox'

type FilterValue = 'All' | 'Business Cards' | 'Brochures' | 'Banners' | 'Packaging' | 'Stationery'

const FILTERS: FilterValue[] = ['All', 'Business Cards', 'Brochures', 'Banners', 'Packaging', 'Stationery']
const PER_PAGE = 9

const Portfolio = () => {
  const allItems = usePortfolio()
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All')
  const [page, setPage] = useState(1)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxStart, setLightboxStart] = useState(0)

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
    setLightboxOpen(false)
  }, [activeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const startIndex = (page - 1) * PER_PAGE
  const pageItems = filteredItems.slice(startIndex, startIndex + PER_PAGE)

  const handleImageClick = useCallback((itemId: string) => {
    const idx = filteredItems.findIndex((x) => x._id === itemId)
    if (idx >= 0) {
      setLightboxStart(idx)
      setLightboxOpen(true)
    }
  }, [filteredItems])

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

        {/* Filter Tabs */}
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
              data-testid={`portfolio-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence>
            {pageItems.map((p) => (
              <motion.button
                key={p._id}
                type="button"
                data-testid={`portfolio-item-${p._id}`}
                className="group relative w-full overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                onClick={() => handleImageClick(p._id)}
              >
                <div className="aspect-square overflow-hidden">
                  {p.image && (
                    <motion.img
                      src={urlFor(p.image).width(600).height(600).fit('crop').url()}
                      alt={p.title || 'Portfolio item'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-xl font-bold mb-1">{p.title}</h3>
                  <p className="text-sm opacity-90">{p.category}</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
          {pageItems.length === 0 && (
            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No items available for "{activeFilter}".
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((prev) => Math.max(1, prev - 1))
                    }}
                    disabled={page === 1}
                    data-testid="portfolio-page-prev"
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(pageNum)
                      }}
                      isActive={page === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }}
                    disabled={page === totalPages}
                    data-testid="portfolio-page-next"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}

        {/* Lightbox */}
        <Lightbox
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          items={filteredItems}
          startIndex={lightboxStart}
        />
      </div>
    </section>
  )
}

export default Portfolio
