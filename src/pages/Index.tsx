import { useState, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesGrid from '@/components/ServicesGrid';
import WhyChooseUs from '@/components/WhyChooseUs';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

// Lazy load FileUploadModal for code splitting
const FileUploadModal = lazy(() => import('@/components/FileUploadModal'));

const Index = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section id="home">
        <HeroSection onUploadClick={() => setIsUploadModalOpen(true)} />
      </section>
      
      {/* Services Grid */}
      <ServicesGrid />
      
      {/* Why Choose Us */}
      <WhyChooseUs />
      
      {/* Portfolio */}
      <Portfolio />
      
      {/* Contact & Footer */}
      <Contact />
      
      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />
      
      {/* File Upload Modal - Lazy loaded with Suspense */}
      <Suspense fallback={null}>
        <FileUploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
        />
      </Suspense>
    </div>
  );
};

export default Index;
