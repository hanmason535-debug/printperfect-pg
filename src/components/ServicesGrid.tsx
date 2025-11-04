/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ServicesGrid Component - Service Catalog with WhatsApp Integration
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Grid display of printing services with click-to-contact via
 * WhatsApp, lazy loading, and smooth animations.
 *
 * @description
 * The ServicesGrid component displays available printing services:
 *
 * **Data Fetching**:
 * - Fetches services from Sanity CMS via useServices hook
 * - React Query for automatic caching and background updates
 * - Handles loading, error, and empty states
 *
 * **Display & Layout**:
 * - Responsive 3-column grid (1 mobile, 2 tablet, 3 desktop)
 * - Lazy loading: Shows 9 services initially, expandable to 25 max
 * - Each card shows image, title, description
 * - Optimized WebP images (800x600px, 85% quality)
 *
 * **WhatsApp Integration**:
 * - Click any service card to open WhatsApp with pre-filled message
 * - Message includes service name for context
 * - Opens in new tab/window
 *
 * **Interactions**:
 * - Hover effects: lift card, glow shadow, show portfolio link
 * - Keyboard navigation (Enter/Space to trigger WhatsApp)
 * - "View Portfolio Samples" link scrolls to portfolio section
 * - Stagger animation for smooth card appearance
 *
 * **Performance**:
 * - Priority loading for first 3 services (above fold)
 * - Lazy loading for remaining services
 * - AnimatePresence for smooth item transitions
 * - Skeleton loading placeholders
 *
 * @see {@link https://wa.me/} WhatsApp Click-to-Chat API
 * @see {@link https://www.sanity.io/} Sanity CMS
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useServices } from '@/hooks/useServices'
import { urlFor } from '@/lib/image'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { ServicesSkeleton } from '@/components/SkeletonLoader'
import { OptimizedImage } from '@/components/OptimizedImage'

const INITIAL_DISPLAY = 9 // 3x3 grid
const MAX_SERVICES = 25

/**
 * ServicesGrid
 *
 * Displays available services in a responsive grid with animations and WhatsApp integration.
 *
 * Features:
 * - Fetches services from Sanity CMS using `useServices` hook
 * - Displays up to 12 services in a responsive grid (1 col mobile → 4 cols desktop)
 * - Hover effects with image zoom and glow shadows (CMYK colors)
 * - Click handler sends inquiry message via WhatsApp
 * - Link to view portfolio samples for each service
 * - "Get Custom Quote" CTA at bottom
 * - Smooth staggered animations via Framer Motion
 * - Empty state message if no services available
 * - Optimized image URLs from Sanity (800px width)
 *
 * State:
 * - Services array fetched from `useServices()` hook
 * - No local state used
 *
 * No props required.
 */
const ServicesGrid = () => {
  const { data: services = [], isLoading, error } = useServices()
  const [showAll, setShowAll] = useState(false)

  const limitedServices = services.slice(0, MAX_SERVICES)
  const displayedServices = showAll ? limitedServices : limitedServices.slice(0, INITIAL_DISPLAY)
  const hasMore = limitedServices.length > INITIAL_DISPLAY

  /**
   * handleServiceClick
   *
   * Opens WhatsApp with pre-filled message about the selected service.
   * Message format: "Hi, I'm interested in [service name] printing. Can you share details?"
   *
   * @param serviceName - Name of the service
   */
  const handleServiceClick = (serviceName: string) => {
    const message = encodeURIComponent(
      `Hi, I'm interested in ${serviceName} printing. Can you share details?`
    );
    window.open(`https://wa.me/919377476343?text=${message}`, '_blank');
  };

  // Framer Motion animation variants for grid container and cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1] as any,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const renderSkeletons = () =>
    Array.from({ length: INITIAL_DISPLAY }).map((_, i) => (
      <div key={i} className="rounded-xl bg-card shadow-elevation transition-all duration-300">
        <Skeleton className="h-48 w-full rounded-t-xl" />
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    ))

  const renderEmptyState = () => (
    <div className="col-span-full text-center py-16">
      <h3 className="text-2xl font-semibold text-foreground mb-2">No Services Available</h3>
      <p className="text-muted-foreground">Please check back soon to see what we offer.</p>
    </div>
  )

  const renderErrorState = () => (
    <div className="col-span-full text-center py-16">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-500/10 rounded-full">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">Failed to Load Services</h3>
      <p className="text-muted-foreground mb-4">
        {error?.message || 'An error occurred while loading services.'}
      </p>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        className="border-cyan/30 hover:border-cyan hover:bg-cyan/10"
      >
        Try Again
      </Button>
    </div>
  )

  return (
    <section id="services" data-testid="services-section" className="py-20 bg-gradient-subtle">
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
            Our Premium
            <span className="bg-gradient-cmyk bg-clip-text text-transparent ml-3">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From concept to completion, we offer comprehensive printing solutions with unmatched
            quality and attention to detail.
          </p>
        </motion.div>

        {/* Services Grid */}
        <>
          {isLoading ? (
            <ServicesSkeleton count={INITIAL_DISPLAY} />
          ) : error ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">{renderErrorState()}</div>
          ) : displayedServices.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <AnimatePresence mode="popLayout">
                {displayedServices.map((service, index) => {
                  const imageUrl = service.image
                    ? urlFor(service.image).width(800).height(600).format('webp').quality(85).url()
                    : ''
                  const description = service.description ?? ''

                  return (
                    <motion.article
                      key={service._id ?? index}
                      data-testid={`services-card-${service._id ?? index}`}
                      variants={itemVariants}
                      layout
                      whileHover={{
                        y: -10,
                        boxShadow: '0 20px 40px rgba(0, 191, 255, 0.3)',
                        transition: { duration: 0.3 },
                      }}
                      className="group relative overflow-hidden rounded-xl bg-card shadow-elevation hover:shadow-premium transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-cyan focus-within:ring-offset-2"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleServiceClick(service.title)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleServiceClick(service.title)
                        }
                      }}
                      aria-label={`${service.title} - Click to contact us via WhatsApp about this service`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <OptimizedImage
                          src={imageUrl}
                          alt={`${service.title} printing service`}
                          className="h-48 transition-transform duration-300 group-hover:scale-110"
                          priority={index < 3}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div
                          className="absolute inset-0 border-2 border-transparent group-hover:border-cyan group-hover:shadow-cyan-glow transition-all duration-300 rounded-t-xl"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-2 group-hover:text-cyan transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{description}</p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const portfolioSection = document.querySelector('#portfolio')
                            if (portfolioSection) portfolioSection.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className="opacity-0 group-hover:opacity-100 text-cyan hover:text-cyan-glow font-medium text-sm transition-all duration-300 flex items-center"
                          aria-label={`View portfolio samples for ${service.title}`}
                        >
                          View Portfolio Samples
                          <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="absolute inset-0 bg-gradient-cyan opacity-0 group-hover:opacity-10 transition-opacity duration-300" aria-hidden />
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">{renderEmptyState()}</div>
          )}
        </>

        {hasMore && (
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
            <Button onClick={() => setShowAll(!showAll)} variant="outline" size="lg" className="group border-cyan/30 hover:border-cyan hover:bg-cyan/10 transition-all duration-300">
              {showAll ? 'View Less Services' : `View All Services (${limitedServices.length})`}
              <motion.div animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronRight className="w-5 h-5 ml-2 rotate-90" />
              </motion.div>
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-6">
            Don't see what you're looking for? We specialize in custom solutions.
          </p>
          <motion.button
            className="inline-flex items-center text-cyan hover:text-cyan-glow font-semibold transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            onClick={() =>
              window.open(
                'https://wa.me/919377476343?text=I need a custom printing solution. Can you help?',
                '_blank'
              )
            }
          >
            Get Custom Quote
            <ChevronRight className="w-5 h-5 ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesGrid;
