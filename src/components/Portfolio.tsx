
import { usePortfolio } from '@/hooks/usePortfolio'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { urlFor } from '@/lib/image'
import { useState, useMemo, useCallback } from 'react'
import Lightbox from '@/components/Lightbox'
import { ChevronRight } from 'lucide-react'

const INITIAL_DISPLAY = 12  // 4x3 grid
const MAX_PORTFOLIO = 50

const Portfolio = () => {
  const allItems = usePortfolio()
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [showAll, setShowAll] = useState(false)
  
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxStart, setLightboxStart] = useState(0)

  const categories = useMemo(() => {
    if (!allItems.length) return []
    const allCategories = allItems.map(item => item.category).filter(Boolean) as string[]
    return ['All', ...Array.from(new Set(allCategories))]
  }, [allItems])

  const filteredItems = useMemo(() => {
    const filtered = activeFilter === 'All' 
      ? allItems 
      : allItems.filter(item => item.category === activeFilter)
    
    // Limit to max 50 items
    return filtered.slice(0, MAX_PORTFOLIO)
  }, [activeFilter, allItems])

  const displayedItems = useMemo(() => {
    return showAll ? filteredItems : filteredItems.slice(0, INITIAL_DISPLAY)
  }, [showAll, filteredItems])

  const hasMore = filteredItems.length > INITIAL_DISPLAY

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
        This category is empty. Try another one!
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
          {displayedItems.length > 0 ? (
            <AnimatePresence>
              {displayedItems.map((p) => (
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

        {/* Load More / Load Less Button */}
        {hasMore && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              onClick={() => {
                setShowAll(!showAll)
                // Reset filter when collapsing to avoid confusion
                if (showAll) setActiveFilter('All')
              }}
              variant="outline"
              size="lg"
              className="group border-cyan/30 hover:border-cyan hover:bg-cyan/10 transition-all duration-300"
            >
              {showAll ? 'Show Less' : `Load More (${filteredItems.length} items)`}
              <motion.div
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-5 h-5 ml-2 rotate-90" />
              </motion.div>
            </Button>
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
