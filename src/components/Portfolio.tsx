/**
 * Portfolio.tsx
 * Displays a grid of portfolio items with filtering and a lightbox for detailed viewing.
 * Data is fetched dynamically from Sanity CMS.
 */
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { client } from '@/sanity/client';

// --- Type Definition for Sanity Data ---
interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  // The srcSet can be constructed if you have image metadata or use Sanity's image pipeline
  srcSet?: string; 
}

// --- Static Data Definitions ---
// By defining these outside the component, we prevent them from being recreated on every render.

// Categories for filtering the portfolio.
const filterCategories = ['All', 'Business Cards', 'Banners', 'Apparel', 'Stickers'];

// Animation variants for Framer Motion.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};


// --- Component Definition ---

const Portfolio = () => {
  // --- State Management ---
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "portfolioItem"]{
          _id,
          title,
          description,
          category,
          "imageUrl": image.asset->url
        }`;
        const data = await client.fetch<PortfolioItem[]>(query);
        setPortfolioItems(data);
      } catch (error) {
        console.error("Failed to fetch portfolio items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioItems();
  }, []);

  // --- Derived State ---
  // useMemo ensures that filtering only re-runs when the activeFilter changes.
  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') {
      return portfolioItems;
    }
    return portfolioItems.filter(item => item.category === activeFilter);
  }, [activeFilter]);

  // --- Event Handlers ---
  // useCallback memoizes these functions so they aren't recreated on every render.

  // Opens the lightbox, sets the correct image, and disables body scroll.
  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  // Closes the lightbox and re-enables body scroll.
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  // Navigates to the next image in the lightbox.
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  // Navigates to the previous image in the lightbox.
  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

  // Handles keyboard navigation for the lightbox.
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  }, [closeLightbox, nextImage, prevImage]);

  // --- Side Effects ---
  // Attaches and cleans up the keyboard event listener for the lightbox.
  useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxOpen, handleKeyDown]);

  // --- Render Logic ---
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
          {filterCategories.map((category) => (
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
          key={activeFilter} // Re-animate when filter changes
        >
          {loading ? (
            <p className="text-center col-span-full text-muted-foreground">Loading portfolio...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center col-span-full text-muted-foreground">No items to display for this category.</p>
          ) : (
            filteredItems.map((item, index) => (
            <motion.div
              key={item._id}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-xl bg-card shadow-elevation hover:shadow-premium transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              {/* Portfolio Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.imageUrl}
                  // srcSet={item.srcSet} // You can build this with Sanity's image pipeline
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy" // Performance: lazy load images
                  onError={(e) => {
                    // Fallback for broken images
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkEwIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPHN2Zz4=';
                  }}
                />
                
                {/* Text Overlay - Always visible at bottom */}
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
            ))
          )}
        </motion.div>

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
            onClick={() => window.open('https://wa.me/919377476343?text=I would like to discuss my printing project', '_blank')}
          >
            Start Your Project
          </motion.button>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxOpen && (
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
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 z-60 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
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
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Loading placeholder */}
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                
                <img
                  src={filteredItems[currentImageIndex]?.imageUrl}
                  // srcSet={filteredItems[currentImageIndex]?.srcSet}
                  sizes="(max-width: 768px) 90vw, 80vw"
                  alt={filteredItems[currentImageIndex]?.title}
                  className="relative z-10 w-full h-full object-contain rounded-lg shadow-2xl"
                  loading="lazy"
                  onLoad={(e) => {
                    // Hide placeholder when image loads
                    const placeholder = e.currentTarget.previousElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'none';
                  }}
                />
                
                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  <h3 className="text-white font-heading font-semibold text-xl mb-2">
                    {filteredItems[currentImageIndex]?.title}
                  </h3>
                  <p className="text-white/90">
                    {filteredItems[currentImageIndex]?.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Memoize the component to prevent re-renders if props haven't changed.
export default memo(Portfolio);