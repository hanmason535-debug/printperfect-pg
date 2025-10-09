/**
 * WhyChooseUs.tsx
 * A section component that highlights the key features and benefits of the printing service.
 * 
 * Performance Optimizations:
 * - The component is wrapped in React.memo to prevent re-renders when parent components update.
 * - Static data (features, animation variants) is defined outside the component scope, so it is not
 *   recreated on every render. This is a simple but effective way to improve performance.
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, DollarSign, MapPin } from 'lucide-react';

// Animation variants defined outside component to prevent recreation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 }
};

// Features data defined outside component to prevent recreation
const features = [
    {
      icon: Clock,
      title: 'Fast Turnaround',
      description: '24-hour express service available',
      color: 'cyan'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Industry-leading printing standards',
      color: 'magenta'
    },
    {
      icon: DollarSign,
      title: 'Affordable Pricing',
      description: 'Competitive rates without compromise',
      color: 'yellow'
    },
    {
      icon: MapPin,
      title: 'Trusted Local Printer',
      description: 'Serving Ahmedabad with excellence',
      color: 'cyan'
    }
  ];

const WhyChooseUs = () => {
  return (
    <section className="py-12 bg-background border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center space-x-4 text-center sm:text-left"
              >
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                  ${feature.color === 'cyan' ? 'bg-cyan/10 text-cyan' : ''}
                  ${feature.color === 'magenta' ? 'bg-magenta/10 text-magenta' : ''}
                  ${feature.color === 'yellow' ? 'bg-yellow/10 text-yellow' : ''}
                `}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                {/* Content */}
                <div className="flex-grow">
                  <h3 className="font-heading font-semibold text-foreground text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

// Memoized for performance optimization
export default memo(WhyChooseUs);