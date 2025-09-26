import { motion } from 'framer-motion';
import flexBannersImg from '@/assets/services/flex-banners.jpg';
import businessCardsImg from '@/assets/services/business-cards.jpg';
import foamBoardsImg from '@/assets/services/foam-boards.jpg';
import apparelImg from '@/assets/services/apparel.jpg';
import stickersLabelsImg from '@/assets/services/stickers-labels.jpg';
import rollLabelsImg from '@/assets/services/roll-labels.jpg';

const ServicesGrid = () => {
  const services = [
    {
      title: 'Flex Banners',
      image: flexBannersImg,
      description: 'High-quality flex banners for advertising and promotions'
    },
    {
      title: 'Signs & Banners',
      image: flexBannersImg,
      description: 'Professional signage solutions for businesses'
    },
    {
      title: 'Foam Boards',
      image: foamBoardsImg,
      description: 'Lightweight foam board displays and presentations'
    },
    {
      title: 'Apparel',
      image: apparelImg,
      description: 'Custom apparel printing with premium quality'
    },
    {
      title: 'Stickers & Labels',
      image: stickersLabelsImg,
      description: 'Custom stickers and labels in various finishes'
    },
    {
      title: 'Business Cards',
      image: businessCardsImg,
      description: 'Premium business cards with professional finishes'
    },
    {
      title: 'Roll Labels',
      image: rollLabelsImg,
      description: 'Industrial roll labels for products and packaging'
    },
    {
      title: 'Frame Signs',
      image: foamBoardsImg,
      description: 'Elegant framed signage for offices and retail'
    },
    {
      title: 'Retractable Banners',
      image: flexBannersImg,
      description: 'Portable retractable banner stands'
    },
    {
      title: 'Aluminum Boards',
      image: foamBoardsImg,
      description: 'Durable aluminum board displays'
    },
    {
      title: 'Magnetic Boards',
      image: foamBoardsImg,
      description: 'Magnetic display boards for easy mounting'
    },
    {
      title: 'PVC Boards',
      image: foamBoardsImg,
      description: 'Waterproof PVC board solutions'
    },
    {
      title: 'Gift & Décor',
      image: apparelImg,
      description: 'Custom gifts and decorative printing items'
    }
  ];

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
    <section id="services" className="py-20 bg-gradient-subtle">
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
            <span className="bg-gradient-cmyk bg-clip-text text-transparent ml-3">
              Services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From concept to completion, we offer comprehensive printing solutions 
            with unmatched quality and attention to detail.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="group relative overflow-hidden rounded-xl bg-card shadow-elevation hover:shadow-premium transition-all duration-300"
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* CMYK Border Glow on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan group-hover:shadow-cyan-glow transition-all duration-300 rounded-xl"></div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2 group-hover:text-cyan transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                
                {/* View Portfolio Samples Link */}
                <button
                  onClick={() => {
                    const portfolioSection = document.querySelector('#portfolio');
                    if (portfolioSection) {
                      portfolioSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 text-cyan hover:text-cyan-glow font-medium text-sm transition-all duration-300 flex items-center"
                >
                  View Portfolio Samples
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-cyan opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </motion.div>

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
            onClick={() => window.open('https://wa.me/919825123456?text=I need a custom printing solution. Can you help?', '_blank')}
          >
            Get Custom Quote
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesGrid;