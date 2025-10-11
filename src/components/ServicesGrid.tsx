/**
 * ServicesGrid.tsx
 * Displays a grid of the company's services, fetched from Sanity.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { client, urlFor } from '@/sanity/client';
import * as Icons from 'lucide-react';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// --- Type Definition for Sanity Data ---
interface Service {
  _id: string;
  title: string;
  description: string;
  image?: SanityImageSource;
  iconName: string; // Assuming you store the name of a lucide-react icon
}

// --- Dynamic Icon Component ---
// A helper component to render a Lucide icon based on a string name.
const DynamicIcon = ({ name, ...props }: { name: string } & Icons.LucideProps) => {
  // Find the icon component from the imported lucide-react library
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    return <Icons.Printer {...props} />; // Return a default icon if not found
  }

  return <IconComponent {...props} />;
};

const ServicesGrid = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "service"] | order(priority asc, _createdAt desc) {
          _id,
          title,
          description,
          image,
          iconName
        }`;
        const data = await client.fetch<Service[]>(query);
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We offer a wide range of printing services to meet all your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-center col-span-full text-muted-foreground">Loading services...</p>
          ) : services.length === 0 ? (
            <p className="text-center col-span-full text-muted-foreground">No services to display.</p>
          ) : (
            services.map((service) => {
              const imageUrl = service.image
                ? urlFor(service.image).width(400).format('webp').url()
                : null;

              return (
                <motion.div
                  key={service._id}
                  className="bg-card rounded-xl shadow-elevation hover:shadow-premium transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-muted text-muted-foreground text-sm font-medium">
                      Image coming soon
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-heading text-foreground mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
