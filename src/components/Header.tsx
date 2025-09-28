import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

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
            {menuItems.map((item) => (
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
              onClick={() => window.open('https://wa.me/919377476343', '_blank')}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
            
            <Button
              variant="cyan"
              size="sm"
              className="hidden sm:flex"
              onClick={() => window.open('tel:+919377476343', '_blank')}
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>

            {/* Google Maps Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex w-10 h-10 text-white hover:text-cyan-accent"
              onClick={() => window.open('https://maps.app.goo.gl/yt63M1mqnfSYL9he8', '_blank')}
              title="Find us on Google Maps"
            >
              {/* Google Maps colorful pin icon */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                <circle cx="12" cy="9" r="2.5" fill="#FFFFFF"/>
                <path d="M12 6.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 10.38 9.5 9s1.12-2.5 2.5-2.5z" fill="#EA4335"/>
              </svg>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:text-cyan-accent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              {menuItems.map((item) => (
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
                  onClick={() => {
                    window.open('https://wa.me/919377476343', '_blank');
                    setIsMenuOpen(false);
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="cyan"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    window.open('tel:+919377476343', '_blank');
                    setIsMenuOpen(false);
                  }}
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

export default Header;