import { useState } from 'react';
import { motion } from 'framer-motion';
import businessCardsImg from '@/assets/services/business-cards.jpg';
import flexBannersImg from '@/assets/services/flex-banners.jpg';
import apparelImg from '@/assets/services/apparel.jpg';
import stickersLabelsImg from '@/assets/services/stickers-labels.jpg';
import foamBoardsImg from '@/assets/services/foam-boards.jpg';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');

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
              className="group relative overflow-hidden rounded-xl bg-card shadow-elevation hover:shadow-premium transition-all duration-300"
            >
              {/* Portfolio Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Overlay Text */}
                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white">
                    <h3 className="text-xl font-heading font-semibold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-cyan text-white px-3 py-1 rounded-full text-xs font-medium">
                  {item.category}
                </div>
              </div>

              {/* Card Content (visible by default) */}
              <div className="p-6 group-hover:opacity-0 transition-opacity duration-300">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>

              {/* CMYK Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan group-hover:shadow-cyan-glow transition-all duration-300 rounded-xl"></div>
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
      </div>
    </section>
  );
};

export default Portfolio;