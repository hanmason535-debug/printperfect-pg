/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Portfolio Component - Portfolio Gallery with Filtering & Lightbox
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Interactive portfolio gallery showcasing completed print work
 * with category filtering, lazy loading, and lightbox image viewer.
 *
 * @description
 * The Portfolio component is a comprehensive image gallery that:
 *
 * **Data Fetching**:
 * - Fetches portfolio items from Sanity CMS via usePortfolio hook
 * - Uses React Query for caching and automatic refetching
 * - Handles loading, error, and empty states gracefully
 *
 * **Filtering & Display**:
 * - Category-based filtering (All, Banners, Business Cards, etc.)
 * - Lazy loading: Shows 12 items initially, "Load More" for rest
 * - Maximum 50 items to prevent performance issues
 * - Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
 *
 * **Image Optimization**:
 * - WebP format with 85% quality via Sanity CDN
 * - 600x600px cropped thumbnails for consistent grid
 * - Priority loading for first 6 images (above the fold)
 * - Lazy loading for images below the fold
 *
 * **Interactions**:
 * - Click any image to open fullscreen lightbox
 * - Keyboard navigation support (Enter/Space to open)
 * - Smooth animations using Framer Motion
 * - Hover effects with scale and shadow transitions
 *
 * **Lightbox Integration**:
 * - Fullscreen image viewer with prev/next navigation
 * - Keyboard controls (arrow keys, ESC to close)
 * - Image preloading for smooth transitions
 * - Displays title and category for each image
 *
 * **Accessibility**:
 * - ARIA labels for screen readers
 * - Keyboard navigation support
 * - Focus management for interactive elements
 * - Semantic HTML (article, button, role="tablist")
 *
 * **Performance**:
 * - useMemo for expensive filtering operations
 * - useCallback for stable event handlers
 * - AnimatePresence for smooth item transitions
 * - Skeleton loading states during data fetch
 *
 * @see {@link https://www.sanity.io/docs/image-url} Sanity Image URLs
 * @see {@link https://www.framer.com/motion/} Framer Motion Animations
 */

import { usePortfolio } from '@/hooks/usePortfolio';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { urlFor } from '@/lib/image';
import { useState, useMemo, useCallback } from 'react';
import Lightbox from '@/components/Lightbox';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { PortfolioSkeleton } from '@/components/SkeletonLoader';
import { OptimizedImage } from '@/components/OptimizedImage';

/**
 * Number of portfolio items to display initially (4x3 grid)
 * Provides good balance between content preview and page performance
 */
const INITIAL_DISPLAY = 12; // 4x3 grid

/**
 * Maximum number of portfolio items to display
 * Prevents performance degradation with very large datasets
 */
const MAX_PORTFOLIO = 50;

/**
 * Portfolio gallery component
 *
 * @component
 * @returns {JSX.Element} Portfolio section with filtering and lightbox viewer
 *
 * @example
 * // Usage in a page:
 * <Portfolio />
 */
const Portfolio = () => {
  // ─── Data Fetching ────────────────────────────────────────────────────────

  /**
   * Fetch portfolio data from Sanity CMS
   * React Query handles caching, refetching, and background updates
   */
  const { data: allItems = [], isLoading, error } = usePortfolio();

  // ─── State Management ─────────────────────────────────────────────────────

  /**
   * Active category filter
   * "All" shows all items, other values filter by category
   */
  const [activeFilter, setActiveFilter] = useState<string>('All');

  /**
   * Controls whether to show all items or just initial subset
   * Toggled by "Load More" / "Show Less" button
   */
  const [showAll, setShowAll] = useState(false);

  /**
   * Controls lightbox visibility
   */
  const [lightboxOpen, setLightboxOpen] = useState(false);

  /**
   * Index of the image to start lightbox at
   * Set when user clicks an image
   */
  const [lightboxStart, setLightboxStart] = useState(0);

  // ─── Computed Values ──────────────────────────────────────────────────────

  /**
   * Extract unique categories from portfolio items
   *
   * @returns {string[]} Array of category names with "All" prepended
   *
   * @description
   * - Filters out null/undefined categories
   * - Removes duplicates using Set
   * - Prepends "All" option for showing all items
   * - Memoized to avoid recalculation on every render
   */
  const categories = useMemo(() => {
    if (!allItems.length) return [];
    const allCategories = allItems.map((item) => item.category).filter(Boolean) as string[];
    return ['All', ...Array.from(new Set(allCategories))];
  }, [allItems]);

  /**
   * Filter items by active category and limit to maximum
   *
   * @returns {PortfolioItem[]} Filtered portfolio items (max 50)
   *
   * @description
   * - Returns all items if "All" filter is active
   * - Filters by category for specific categories
   * - Limits to MAX_PORTFOLIO (50) items for performance
   * - Memoized to prevent unnecessary filtering
   */
  const filteredItems = useMemo(() => {
    const filtered =
      activeFilter === 'All' ? allItems : allItems.filter((item) => item.category === activeFilter);

    // Limit to max 50 items to prevent performance issues
    return filtered.slice(0, MAX_PORTFOLIO);
  }, [activeFilter, allItems]);

  /**
   * Items to actually display on screen
   *
   * @returns {PortfolioItem[]} Visible portfolio items
   *
   * @description
   * - Shows all filtered items if showAll is true
   * - Shows only first INITIAL_DISPLAY (12) items otherwise
   * - Memoized to prevent unnecessary recalculation
   */
  const displayedItems = useMemo(() => {
    return showAll ? filteredItems : filteredItems.slice(0, INITIAL_DISPLAY);
  }, [showAll, filteredItems]);

  /**
   * Whether there are more items to show beyond initial display
   * Controls visibility of "Load More" button
   */
  const hasMore = filteredItems.length > INITIAL_DISPLAY;

  // ─── Event Handlers ───────────────────────────────────────────────────────

  /**
   * Handle image click to open lightbox
   *
   * @param {string} itemId - Unique ID of the clicked portfolio item
   *
   * @description
   * - Finds the index of the clicked item in filtered array
   * - Sets lightbox start index to clicked item's position
   * - Opens the lightbox dialog
   * - Error handling for invalid item IDs
   */
  const handleImageClick = useCallback(
    (itemId: string) => {
      try {
        const idx = filteredItems.findIndex((x) => x._id === itemId);
        if (idx !== -1) {
          setLightboxStart(idx);
          setLightboxOpen(true);
        } else {
          console.warn('[Portfolio] Item not found:', itemId);
        }
      } catch (err) {
        console.error('[Portfolio] Error clicking item:', err);
      }
    },
    [filteredItems]
  );

  // ─── Animation Variants ───────────────────────────────────────────────────

  /**
   * Container animation: stagger children for smooth cascade effect
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 100ms delay between each child animation
        delayChildren: 0.2, // 200ms delay before first child animates
      },
    },
  };

  /**
   * Item animation: fade in from below
   */
  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Start 30px below, invisible
    visible: { opacity: 1, y: 0 }, // End at normal position, fully visible
  };

  // ─── Render Helpers ───────────────────────────────────────────────────────

  /**
   * Render skeleton loading placeholders
   * Shown while portfolio data is being fetched
   */
  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="aspect-square rounded-xl" />
    ));

  /**
   * Render empty state message
   * Shown when filtered category has no items
   */
  const renderEmptyState = () => (
    <div className="col-span-full text-center py-16" data-testid="portfolio-empty">
      <h3 className="text-2xl font-semibold text-foreground mb-2">No Items Found</h3>
      <p className="text-muted-foreground">This category is empty. Try another one!</p>
    </div>
  );

  /**
   * Render error state with retry button
   * Shown when portfolio data fetch fails
   */
  const renderErrorState = () => (
    <div className="col-span-full text-center py-16">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-500/10 rounded-full">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">Failed to Load Portfolio</h3>
      <p className="text-muted-foreground mb-4">
        {error?.message || 'An error occurred while loading portfolio items.'}
      </p>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        className="border-cyan/30 hover:border-cyan hover:bg-cyan/10"
      >
        Try Again
      </Button>
    </div>
  );

  // ─── Component Render ─────────────────────────────────────────────────────

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* ─── Section Header ───────────────────────────────────────────────── */}

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Our
            <span className="bg-gradient-cmyk bg-clip-text text-transparent ml-3">Portfolio</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of premium print work showcasing quality, creativity, and
            attention to detail across all our services.
          </p>
        </motion.div>

        {/* ─── Filter Tabs ──────────────────────────────────────────────────── */}

        {/**
         * Category filter buttons
         * - Rendered as tab list for accessibility
         * - Only shown when categories exist
         * - Active filter highlighted with primary color
         * - Smooth hover and tap animations
         */}
        {categories.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            role="tablist"
            aria-label="Filter portfolio by category"
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
                aria-label={`Filter portfolio by ${category}`}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 ${
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

        {/* ─── Portfolio Grid ───────────────────────────────────────────────── */}

        {/**
         * Main portfolio grid with conditional rendering:
         * - Skeleton placeholders while loading
         * - Error state with retry button on fetch failure
         * - Grid of portfolio items when data available
         * - Empty state when filtered category has no items
         */}
        <>
          {isLoading ? (
            <PortfolioSkeleton count={INITIAL_DISPLAY} />
          ) : error ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderErrorState()}
            </div>
          ) : displayedItems.length > 0 ? (
            <motion.div
              id="portfolio-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {displayedItems.map((p, index) => (
                  <motion.article
                    key={p._id}
                    data-testid={`portfolio-item-${p._id}`}
                    layout
                    className="group relative overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-cyan focus-within:ring-offset-2"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover={{ y: -10 }}
                    onClick={() => handleImageClick(p._id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleImageClick(p._id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${p.title} - ${p.category} in lightbox`}
                  >
                    {/* Portfolio Image */}
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
                      {p.image ? (
                        <OptimizedImage
                          src={urlFor(p.image)
                            .width(600)
                            .height(600)
                            .fit('crop')
                            .format('webp')
                            .quality(85)
                            .url()}
                          alt={`${p.title} - ${p.category} portfolio sample`}
                          className="transition-transform duration-500 group-hover:scale-110"
                          priority={index < 6} // Prioritize first 6 images (2 rows above fold)
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <div className="text-center text-white/40">
                            <div className="text-4xl mb-2" aria-hidden="true">
                              📷
                            </div>
                            <div className="text-xs">Image unavailable</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hover Overlay Gradient */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-hidden="true"
                    />

                    {/* Title and Category (shown on hover) */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-1">{p.title}</h3>
                      <p className="text-sm opacity-90">{p.category}</p>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderEmptyState()}
            </div>
          )}
        </>

        {/* ─── Load More / Show Less Button ─────────────────────────────────── */}

        {/**
         * Load More button
         * - Only shown when more items exist beyond initial display
         * - Toggles between "Load More" and "Show Less"
         * - Resets filter to "All" when collapsing (UX improvement)
         * - Animated chevron icon rotates 180° when expanded
         */}
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
                setShowAll(!showAll);
                // Reset filter when collapsing to avoid confusion
                if (showAll) setActiveFilter('All');
              }}
              variant="outline"
              size="lg"
              className="group border-cyan/30 hover:border-cyan hover:bg-cyan/10 transition-all duration-300"
            >
              {showAll ? 'Show Less' : `Load More (${filteredItems.length} items)`}
              <motion.div animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronRight className="w-5 h-5 ml-2 rotate-90" />
              </motion.div>
            </Button>
          </motion.div>
        )}

        {/* ─── Lightbox Image Viewer ────────────────────────────────────────── */}

        {/**
         * Fullscreen image lightbox
         * - Opens when user clicks a portfolio item
         * - Displays filtered items (respects active category filter)
         * - Starts at clicked image index
         * - Supports keyboard navigation (arrows, ESC)
         * - Preloads adjacent images for smooth transitions
         */}
        <Lightbox
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          items={filteredItems}
          startIndex={lightboxStart}
        />
      </div>
    </section>
  );
};

export default Portfolio;
