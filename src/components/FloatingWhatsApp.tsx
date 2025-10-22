/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FloatingWhatsApp Component - Fixed WhatsApp Contact Button
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Floating action button that opens WhatsApp chat with
 * pre-filled message, tooltips, and attention-grabbing animations.
 *
 * @description
 * The FloatingWhatsApp component provides quick access to WhatsApp chat:
 *
 * **Positioning & Visibility**:
 * - Fixed in bottom-right corner (z-index: 50)
 * - Appears after 2-second delay (doesn't distract initial page load)
 * - Always visible on scroll (sticky positioning)
 * - Responsive sizing (64x64px)
 *
 * **Animations**:
 * - Spring animation on appearance (bouncy entrance)
 * - Pulsing shadow effect (draws attention)
 * - Hover scale effect (1.05x larger)
 * - Tap scale effect (0.95x smaller for tactile feedback)
 * - Smooth transitions using Framer Motion
 *
 * **Tooltip**:
 * - Appears 500ms after button appears
 * - Displays "Chat with us on WhatsApp" message
 * - Auto-dismisses after 3 seconds
 * - Positioned above button with arrow pointer
 * - Animated fade-in/scale entrance
 *
 * **WhatsApp Integration**:
 * - Opens WhatsApp web/app in new tab
 * - Pre-filled message: "Hi! I'm interested in your printing services..."
 * - Phone number: 919377476343
 * - URL-encoded message for safe transmission
 *
 * **User Experience**:
 * - Clear labeling ("WhatsApp" text below icon)
 * - Green color matches WhatsApp brand
 * - Icon from lucide-react (MessageCircle)
 * - Accessible click target size (64x64px)
 *
 * **Cleanup**:
 * - Clears all timers on unmount (prevents memory leaks)
 * - Uses useRef for timer references (stable across renders)
 *
 * @component
 * @returns {JSX.Element} Floating WhatsApp button with tooltip
 *
 * @example
 * // Add to layout/page:
 * <FloatingWhatsApp />
 *
 * @see {@link https://wa.me/} WhatsApp Click-to-Chat API
 * @see {@link https://www.framer.com/motion/} Framer Motion
 */

import { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FloatingWhatsApp
 *
 * Fixed-position floating button for quick WhatsApp contact.
 *
 * Features:
 * - Appears after 2 seconds on page load with smooth spring animation
 * - Shows tooltip "Chat with us on WhatsApp" for 3 seconds after appearing
 * - Pulsing glow shadow animation to draw attention
 * - Click opens WhatsApp chat with pre-filled message
 * - Positioned bottom-right with z-index 50 to float above content
 * - Smooth scale animations on hover/tap
 * - Cleanup timers on unmount to prevent memory leaks
 *
 * No props required.
 */
const FloatingWhatsApp = () => {
  // Control button visibility and tooltip display
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Timer references for cleanup
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show button after delay and auto-hide tooltip
  useEffect(() => {
    // Show the button after 2 seconds of page load
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      // Show tooltip for 3 seconds after the button appears
      tooltipTimerRef.current = setTimeout(() => {
        setShowTooltip(true);
        // Auto-hide tooltip after 3 seconds
        hideTooltipTimerRef.current = setTimeout(() => setShowTooltip(false), 3000);
      }, 500);
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      if (hideTooltipTimerRef.current) clearTimeout(hideTooltipTimerRef.current);
    };
  }, []);

  /**
   * handleClick
   *
   * Opens WhatsApp with pre-filled inquiry message.
   */
  const handleClick = () => {
    const message = encodeURIComponent(
      "Hi! I'm interested in your printing services. Can you help me?"
    );
    window.open(`https://wa.me/919377476343?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* WhatsApp Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="relative"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  className="absolute bottom-full right-0 mb-2 bg-charcoal text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  Chat with us on WhatsApp
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-charcoal"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* WhatsApp Button */}
            <motion.button
              onClick={handleClick}
              className="relative w-16 h-16 bg-green-500 hover:bg-green-600 hover:shadow-lg text-white rounded-full shadow-md flex flex-col items-center justify-center transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 4px 8px rgba(34, 197, 94, 0.3)',
                  '0 6px 16px rgba(34, 197, 94, 0.4)',
                  '0 4px 8px rgba(34, 197, 94, 0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <MessageCircle className="w-5 h-5 mb-0.5" />
              <span className="text-xs font-medium leading-none">WhatsApp</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingWhatsApp;
