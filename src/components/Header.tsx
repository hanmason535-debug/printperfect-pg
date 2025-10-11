/**
 * Header.tsx
 * Main navigation component of the application.
 * Implements a responsive header with desktop and mobile navigation,
 * contact buttons, and scroll-based styling.
 * 
 * Performance Optimizations:
 * - Component is memoized to prevent unnecessary re-renders
 * - Event handlers are memoized using useCallback
 * - Static data is defined outside the component
 * - Animations are optimized using motion.div with viewport detection
 */

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { CONTACT } from '@/config/constants';
import googleMapsIcon from '@/assets/google-maps.png';

// Static menu items defined outside component to prevent recreation on each render
const MENU_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
] as const;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Memoized handlers
  const handleWhatsAppClick = useCallback(() => {
    window.open(`https://wa.me/${CONTACT.phoneRaw}`, '_blank');
    setIsMenuOpen(false);
  }, []);

  const handlePhoneClick = useCallback(() => {
    window.open(`tel:${CONTACT.phone}`, '_blank');
    setIsMenuOpen(false);
  }, []);

  const handleMapsClick = useCallback(() => {
    window.open('https://maps.app.goo.gl/yt63M1mqnfSYL9he8', '_blank');
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Memoize scroll handler to prevent recreation on each render
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Memoize navigation click handler
  const handleNavClick = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md shadow-elevation' 
          : 'bg-black/60 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="w-10 h-10 bg-gradient-cyan rounded-lg flex items-center justify-center text-white font-heading font-bold text-lg">
              PG
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading font-bold text-white">
                Paras Graphics
              </h1>
              <p className="text-xs text-gray-300 -mt-1">
                Premium Printing
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-white hover:text-cyan-accent transition-colors duration-300 font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="whatsapp"
              size="sm"
              className="hidden sm:flex"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
            
            <Button
              variant="cyan"
              size="sm"
              className="hidden sm:flex"
              onClick={handlePhoneClick}
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>

            {/* Google Maps Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-10 w-10 p-1.5 hover:bg-white/10 transition-colors"
              onClick={handleMapsClick}
              title="Find us on Google Maps"
            >
              <img
                src={googleMapsIcon}
                alt="Find us on Google Maps"
                className="h-full w-full transition-transform hover:scale-110"
              />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:text-cyan-accent"
              onClick={handleMenuToggle}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md shadow-elevation border-t border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-4 p-4">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="text-white hover:text-cyan-accent transition-colors duration-300 font-medium py-2 text-left w-full"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex space-x-3 pt-2">
                <Button
                  variant="whatsapp"
                  size="sm"
                  className="flex-1"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="cyan"
                  size="sm"
                  className="flex-1"
                  onClick={handlePhoneClick}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

// Export memoized component
export default memo(Header);
