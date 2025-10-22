
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

type FilterValue = string
const PER_PAGE = 9

/**
 * Portfolio
 *
 * Displays a filterable, paginated portfolio grid with animated items and a lightbox viewer.
 *
 * Features:
 * - Dynamic category filter tabs with item counts
 * - 9-item per page pagination
 * - Responsive grid layout (1 col mobile → 3 cols desktop)
 * - Smooth Framer Motion animations and transitions
 * - Lightbox modal for viewing full-size images
 * - Keyboard navigation support (via Lightbox)
 * - Full accessibility support (ARIA labels, keyboard focus)
 *
 * State:
 * - `activeFilter`: currently selected category filter (default: 'All')
 * - `page`: current pagination page
 * - `lightboxOpen`: whether the lightbox modal is visible
 * - `lightboxStart`: starting index for lightbox gallery
 *
 * Memoized computations:
 * - `normalizedItems`: ensures all items have category and categorySlugs fields
 * - `availableCategories`: extracts unique categories from items, sorted alphabetically
 * - `categoryCounts`: counts items per category
 * - `filteredItems`: filters items based on activeFilter
 *
 * Side effects:
 * - Auto-resets page to 1 when filter changes
 * - Closes lightbox if filtered items become empty
 * - Keeps pagination bounds in sync with item count
 */
const Portfolio = () => {
  // Fetch all portfolio items from CMS
  const allItems = usePortfolio()
  
  // Track the active category filter and current page
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All')
  const [page, setPage] = useState(1)

  // Lightbox state for image gallery modal
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

  // Extract unique, sorted category names from all items
  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>()
    normalizedItems.forEach((item) => {
      const category = item.category?.trim()
      if (category) {
        categorySet.add(category)
      }
    })
    return Array.from(categorySet).sort((a, b) => a.localeCompare(b))
  }, [normalizedItems])

  // Build a map of category → item count (including total for 'All')
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: normalizedItems.length
    }

    availableCategories.forEach((category) => {
      counts[category] = normalizedItems.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      ).length
    })

    return counts
  }, [normalizedItems, availableCategories])

  const filters = useMemo(
    () => (['All', ...availableCategories] as FilterValue[]),
    [availableCategories]
  )

  // Ensure activeFilter is always valid (fallback to 'All' if categories change)
  useEffect(() => {
    if (!filters.includes(activeFilter)) {
      setActiveFilter(filters[0] ?? 'All')
    }
  }, [filters, activeFilter])

  // Filter items by active category, supporting both label and slug matching
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

  // Reset pagination to page 1 when filter changes
  useEffect(() => {
    setPage(1)
  }, [activeFilter])

  // Calculate total pages and ensure current page is within bounds [1, totalPages]
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE))
  const currentPage = Math.min(Math.max(page, 1), totalPages)

  // Sync page state if it falls out of bounds (e.g., after filter change)
  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage)
    }
  }, [page, currentPage])

  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * PER_PAGE
  const pageItems = filteredItems.slice(startIndex, startIndex + PER_PAGE)

  const filteredCount = filteredItems.length

  // Sync lightbox start index with filtered item count and close if no items remain
  useEffect(() => {
    if (filteredCount === 0) {
      setLightboxStart(0)
      if (lightboxOpen) {
        setLightboxOpen(false)
      }
      return
    }

    setLightboxStart((prev) => (prev >= filteredCount ? filteredCount - 1 : prev))
  }, [filteredCount, lightboxOpen])

  /**
   * handleImageClick
   * 
   * Opens the lightbox modal and sets the starting index to the clicked item.
   * Finds the index of the clicked item in the filtered list.
   * 
   * @param itemId - The portfolio item ID to display
   */
  const handleImageClick = useCallback(
    (itemId: string) => {
      const idx = filteredItems.findIndex((x) => x._id === itemId)
      if (idx >= 0) {
        setLightboxStart(idx)
        setLightboxOpen(true)
      }
    },
    [filteredItems]
  )

  // Framer Motion animation variants for container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Stagger item animations by 100ms
      }
    }
  }

  // Individual item animation: fade in and slide up from 30px below
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="portfolio" data-testid="portfolio-section" className="py-20 bg-background">
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
          {filters.map((category) => {
            const sanitized = category.toLowerCase().replace(/\s+/g, '-')
            const isAll = category === 'All'
            const count = categoryCounts[category] ?? 0
            const isDisabled = !isAll && count === 0
            const label = `${category} (${count})`

            return (
              <motion.button
                key={category}
                role="tab"
                aria-selected={activeFilter === category}
                aria-controls="portfolio-grid"
                aria-label={`${category} (${count} items)`}
                title={isDisabled ? 'No items in this category' : `View ${category}`}
                onClick={() => {
                  if (!isDisabled) {
                    setActiveFilter(category)
                  }
                }}
                data-testid={`portfolio-filter-${sanitized}`}
                data-test-id={`filter-${sanitized}`}
                disabled={isDisabled}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : isDisabled
                    ? 'bg-secondary/60 text-secondary-foreground/70 cursor-not-allowed'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
              >
                {label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          data-testid="portfolio-grid"
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
            <motion.div
              data-testid="portfolio-empty"
              className="col-span-full py-12 text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg font-semibold mb-2">No portfolio items found for "{activeFilter}".</p>
              <p className="text-sm">Try selecting a different category or check back soon for new work!</p>
            </motion.div>
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
                      setPage(Math.max(1, currentPage - 1))
                    }}
                    disabled={currentPage === 1}
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
                      isActive={currentPage === pageNum}
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
                      setPage(Math.min(totalPages, currentPage + 1))
                    }}
                    disabled={currentPage === totalPages}
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
