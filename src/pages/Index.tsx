/**
 * Index.tsx
 * The main entry point for the application's public-facing pages.
 * This component orchestrates the layout and rendering of various sections of the website.
 * 
 * Performance Optimizations:
 * - Implements lazy loading for several components (FileUploadModal, Portfolio, Contact, FloatingWhatsApp)
 *   to reduce the initial bundle size and improve page load performance.
 * - Uses React.Suspense to provide fallback UI while lazy-loaded components are being fetched.
 */
import { useState, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesGrid from '@/components/ServicesGrid';
import WhyChooseUs from '@/components/WhyChooseUs';

// Lazy load components for code splitting
// These components will only be loaded when they are needed, reducing initial bundle size.
const FileUploadModal = lazy(() => import('@/components/FileUploadModal'));
const Portfolio = lazy(() => import('@/components/Portfolio'));
const Contact = lazy(() => import('@/components/Contact'));
const FloatingWhatsApp = lazy(() => import('@/components/FloatingWhatsApp'));

const Index = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header component, always loaded */}
      <Header />
      
      {/* Hero Section component, always loaded */}
      <section id="home">
        <HeroSection onUploadClick={() => setIsUploadModalOpen(true)} />
      </section>
      
      {/* Services Grid component, always loaded */}
      <ServicesGrid />
      
      {/* Why Choose Us component, always loaded */}
      <WhyChooseUs />

      {/* Suspense boundary for lazy-loaded components below the fold */}
      {/* A simple loading message is displayed while these components are being fetched. */}
      <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
        {/* Portfolio section, lazy-loaded */}
        <Portfolio />
        
        {/* Contact and Footer section, lazy-loaded */}
        <Contact />
        
        {/* Floating WhatsApp button, lazy-loaded */}
        <FloatingWhatsApp />
      </Suspense>
      
      {/* File Upload Modal, lazy-loaded and only rendered when opened */}
      {/* Fallback is null as the modal is not visible until triggered. */}
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
