/**
 * HeroSection.tsx
 *
 * Main hero banner section featuring a full-screen background image with animated overlays,
 * headline/subheadline, CTAs, trust indicators, and scroll indicator.
 *
 * Features:
 * - Full-screen responsive layout with background image
 * - Animated CMYK-colored floating elements
 * - Main headline with gradient text "Solutions"
 * - Subheadline with key value proposition
 * - Two CTA buttons: "Upload File" and "WhatsApp Us"
 * - Trust indicators: happy clients, express service, quality badge
 * - Animated scroll-down indicator
 * - Gradient overlays for text readability
 *
 * Performance Optimizations:
 * - Background image uses `loading="eager"` and `decoding="async"` for LCP optimization
 * - Image is preloaded in index.html for faster discovery
 * - Framer Motion animations with viewport detection for smooth 60fps rendering
 * - Floating elements use loop animations (no heavy computations)
 *
 * Props:
 * - `onUploadClick`: callback fired when "Upload File" button is clicked
 */
import { Button } from '@/components/ui/button';
import { Upload, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBackground from '@/assets/hero-bg.jpg';
import { CONTACT } from '@/config/constants';

interface HeroSectionProps {
  onUploadClick: () => void;
}

const HeroSection = ({ onUploadClick }: HeroSectionProps) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image - Using an img tag for LCP optimization */}
      {/* `fetchPriority="high"` and `loading="eager"` tell the browser to prioritize this image. */}
      {/* `decoding="async"` allows the browser to decode the image off the main thread. */}
      <img
        src={heroBackground}
        alt="Abstract background with CMYK colors"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      {/* Gradient overlay to improve text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Animated background overlay for visual effect */}
      <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>

      {/* Floating CMYK elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-cyan rounded-full opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 bg-magenta rounded-lg opacity-20"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-12 h-12 bg-yellow rounded-full opacity-30"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Headline */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Premium Printing
            <br />
            <span className="bg-gradient-cmyk bg-clip-text text-transparent">Solutions</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Your trusted print partner in Ahmedabad for premium quality and fast turnarounds. From
            banners to business cards, we deliver excellence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button variant="cyan" size="hero" onClick={onUploadClick} className="w-full sm:w-auto">
              <Upload className="w-6 h-6" />
              Upload File
            </Button>

            <Button
              variant="whatsapp"
              size="hero"
              onClick={() =>
                window.open(
                  `https://wa.me/${CONTACT.phoneRaw}?text=Hi! I need help with printing services.`,
                  '_blank'
                )
              }
              className="w-full sm:w-auto"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp Us
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan rounded-full"></div>
              <span className="text-sm font-medium">500+ Happy Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-magenta rounded-full"></div>
              <span className="text-sm font-medium">24hr Express Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow rounded-full"></div>
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
