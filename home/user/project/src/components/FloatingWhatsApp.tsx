
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Store all timer IDs for proper cleanup
    let outerTimer: ReturnType<typeof setTimeout> | null = null;
    let tooltipShowTimer: ReturnType<typeof setTimeout> | null = null;
    let tooltipHideTimer: ReturnType<typeof setTimeout> | null = null;

    // Show the button after 2 seconds
    outerTimer = setTimeout(() => {
      setIsVisible(true);
      
      // Show tooltip for 3 seconds after the button appears
      tooltipShowTimer = setTimeout(() => {
        setShowTooltip(true);
        
        tooltipHideTimer = setTimeout(() => {
          setShowTooltip(false);
        }, 3000);
      }, 500);
    }, 2000);

    // Cleanup function - clear ALL timers
    return () => {
      if (outerTimer) clearTimeout(outerTimer);
      if (tooltipShowTimer) clearTimeout(tooltipShowTimer);
      if (tooltipHideTimer) clearTimeout(tooltipHideTimer);
    };
  }, []);

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
              type: "spring", 
              stiffness: 260, 
              damping: 20 
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
                  "0 4px 8px rgba(34, 197, 94, 0.3)",
                  "0 6px 16px rgba(34, 197, 94, 0.4)",
                  "0 4px 8px rgba(34, 197, 94, 0.3)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <MessageCircle className="w-8 h-8" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingWhatsApp;
