import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import businessCardsImg from '@/assets/services/business-cards.jpg';
import flexBannersImg from '@/assets/services/flex-banners.jpg';
import apparelImg from '@/assets/services/apparel.jpg';
import stickersLabelsImg from '@/assets/services/stickers-labels.jpg';
import foamBoardsImg from '@/assets/services/foam-boards.jpg';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const portfolioItems = [
    {
      id: 1,
      title: 'Matte Finish Business Cards',
      description: 'Premium 300 GSM stock with matte finish',
      category: 'Business Cards',
      image: businessCardsImg
    },
    {
      id: 2,
      title: 'Flex Banner — XYZ Company',
      description: 'Large format outdoor advertising banner',
      category: 'Banners',
      image: flexBannersImg
    },
    {
      id: 3,
      title: 'Custom Printed T-Shirt',
      description: 'High-quality DTG printing on premium cotton',
      category: 'Apparel',
      image: apparelImg
    },
    {
      id: 4,
      title: 'Vinyl Stickers & Labels',
      description: 'Waterproof vinyl with UV-resistant printing',
      category: 'Stickers',
      image: stickersLabelsImg
    },
    {
      id: 5,
      title: 'Event Foam Board Display',
      description: 'Lightweight foam core with full-color graphics',
      category: 'Banners',
      image: foamBoardsImg
    },
    {
      id: 6,
      title: 'Corporate Stationery Set',
      description: 'Letterheads, envelopes, and business cards',
      category: 'Business Cards',
      image: businessCardsImg
    },
    {
      id: 7,
      title: 'Custom Hoodie Print',
      description: 'Screen printing on premium fleece',
      category: 'Apparel',
      image: apparelImg
    },
    {
      id: 8,
      title: 'Product Label Design',
      description: 'High-gloss labels with brand colors',
      category: 'Stickers',
      image: stickersLabelsImg
    },
    {
      id: 9,
      title: 'Trade Show Banner',
      description: 'Retractable banner stand with graphics',
      category: 'Banners',
      image: flexBannersImg
    }
  ];

  const filterCategories = ['All', 'Business Cards', 'Banners', 'Apparel', 'Stickers'];

  const filteredItems = activeFilter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

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

  const openLightbox = (index: number) => {
    const filteredIndex = filteredItems.findIndex(item => item.id === filteredItems[index].id);
    setCurrentImageIndex(filteredIndex);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  useState(() => {
    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  });

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {filterCategories.map((category) => (
            <motion.button
              key={category}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          key={activeFilter} // Re-animate when filter changes
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-xl bg-card shadow-elevation hover:shadow-premium transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(filteredItems.indexOf(item))}
            >
              {/* Portfolio Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
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
          ))}
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
                  src={filteredItems[currentImageIndex]?.image}
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

export default Portfolio;