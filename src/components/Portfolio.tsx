
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
import { Skeleton } from '@/components/ui/skeleton'
import { urlFor } from '@/lib/image'
import { useState, useMemo, useEffect, useCallback } from 'react'
import Lightbox from '@/components/Lightbox'

const PER_PAGE = 9

const Portfolio = () => {
  const { data: allItems, loading, error } = usePortfolio()
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [page, setPage] = useState(1)
  
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxStart, setLightboxStart] = useState(0)

  const categories = useMemo(() => {
    if (loading || !allItems.length) return []
    const allCategories = allItems.map(item => item.category).filter(Boolean) as string[]
    return ['All', ...Array.from(new Set(allCategories))]
  }, [allItems, loading])

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') {
      return allItems
    }
    return allItems.filter(item => item.category === activeFilter)
  }, [activeFilter, allItems])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE))

  useEffect(() => {
    setPage(1)
  }, [activeFilter])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const startIndex = (page - 1) * PER_PAGE
  const pageItems = filteredItems.slice(startIndex, startIndex + PER_PAGE)

  const handleImageClick = useCallback((itemId: string) => {
    const idx = filteredItems.findIndex((x) => x._id === itemId)
    setLightboxStart(Math.max(0, idx))
    setLightboxOpen(true)
  }, [filteredItems])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  const renderSkeletons = () => (
    Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="aspect-square rounded-xl" />
    ))
  );

  const renderEmptyState = () => (
    <div className="col-span-full text-center py-16" data-testid="portfolio-empty">
      <h3 className="text-2xl font-semibold text-foreground mb-2">No Items Found</h3>
      <p className="text-muted-foreground">
        {error ? "We're having trouble loading our portfolio. Please try again later." : "This category is empty. Try another one!"}
      </p>
    </div>
  );

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
        {categories.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            role="tablist"
            aria-label="Portfolio filter"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
                role="tab"
                aria-selected={activeFilter === category}
                aria-controls="portfolio-grid"
                onClick={() => setActiveFilter(category)}
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
        )}

        {/* Portfolio Grid */}
        <motion.div
          id="portfolio-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            renderSkeletons()
          ) : pageItems.length > 0 ? (
            <AnimatePresence>
              {pageItems.map((p) => (
                <motion.article
                  key={p._id}
                  data-testid={`portfolio-item-${p._id}`}
                  layout
                  className="group relative overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ y: -10 }}
                  onClick={() => handleImageClick(p._id)}
                >
                  <div className="aspect-square overflow-hidden">
                    {p.image && (
                      <motion.img
                        src={urlFor(p.image).width(600).height(600).fit('crop').url()}
                        alt={p.title || 'Portfolio item'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <h3 className="text-xl font-bold mb-1">{p.title}</h3>
                    <p className="text-sm opacity-90">{p.category}</p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          ) : (
            renderEmptyState()
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((p) => Math.max(1, p - 1))
                    }}
                    aria-disabled={page === 1}
                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
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
                      setPage((p) => Math.min(totalPages, p + 1))
                    }}
                    aria-disabled={page === totalPages}
                    className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
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
