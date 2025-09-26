import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create WhatsApp message with form data
    const message = `Hello! I'm interested in your printing services.
    
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Message: ${formData.message}`;
    
    const whatsappUrl = `https://wa.me/919377476343?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Contact Form Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              Get in 
              <span className="bg-gradient-cmyk bg-clip-text text-transparent ml-3">
                Touch
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to start your printing project? Contact us today for a free consultation 
              and discover how we can bring your vision to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="bg-card rounded-2xl p-8 shadow-elevation"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan transition-colors resize-none"
                    placeholder="Tell us about your printing needs..."
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="cyan"
                  className="w-full py-3 font-semibold"
                >
                  Send Message via WhatsApp
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <motion.a
                    href="https://maps.app.goo.gl/yt63M1mqnfSYL9he8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-4 group cursor-pointer"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-cyan text-white p-3 rounded-lg group-hover:shadow-cyan-glow transition-shadow duration-300">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-cyan transition-colors">
                        Visit Our Store
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        2, Chandrika Chamber, Mirzapur Rd,<br />
                        Opposite Jansatta Karyalay, Mirzapur,<br />
                        Ahmedabad, Gujarat 380001
                      </p>
                    </div>
                  </motion.a>
                  
                  <motion.a
                    href="mailto:parasgph@gmail.com"
                    className="flex items-start space-x-4 group cursor-pointer"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-magenta text-white p-3 rounded-lg group-hover:shadow-lg transition-shadow duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-magenta transition-colors">
                        Email Us
                      </h4>
                      <p className="text-muted-foreground">parasgph@gmail.com</p>
                    </div>
                  </motion.a>
                  
                  <motion.a
                    href="tel:+919377476343"
                    className="flex items-start space-x-4 group cursor-pointer"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-yellow text-yellow-foreground p-3 rounded-lg group-hover:shadow-lg transition-shadow duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-yellow transition-colors">
                        Call Us
                      </h4>
                      <p className="text-muted-foreground">+91 9377 476 343</p>
                    </div>
                  </motion.a>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Business Hours</h4>
                      <p className="text-muted-foreground">Mon – Sat: 9 AM – 7 PM</p>
                      <p className="text-muted-foreground text-sm">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Us Section */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Let's stay connected — follow Paras Graphics for design inspiration & updates.
                </p>
                <div className="flex space-x-4">
                  <motion.a
                    href="#"
                    className="bg-card p-3 rounded-lg text-muted-foreground hover:text-cyan hover:bg-cyan/10 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Facebook className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    className="bg-card p-3 rounded-lg text-muted-foreground hover:text-magenta hover:bg-magenta/10 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Instagram className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    className="bg-card p-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="border-t border-border pt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-cyan rounded-lg flex items-center justify-center text-white font-heading font-bold text-lg">
                  PG
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground">
                    Paras Graphics
                  </h3>
                  <p className="text-xs text-muted-foreground -mt-1">
                    Premium Printing
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Your trusted print partner in Ahmedabad for premium quality and fast turnarounds.
              </p>
              <p className="text-xs text-muted-foreground">
                Serving Ahmedabad since 1997
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const element = document.querySelector('#services');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block text-muted-foreground hover:text-cyan transition-colors text-sm"
                >
                  Services
                </button>
                <button
                  onClick={() => {
                    const element = document.querySelector('#portfolio');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block text-muted-foreground hover:text-cyan transition-colors text-sm"
                >
                  Portfolio
                </button>
                <a href="#" className="block text-muted-foreground hover:text-cyan transition-colors text-sm">
                  Upload File
                </a>
                <a href="#" className="block text-muted-foreground hover:text-cyan transition-colors text-sm">
                  My Projects
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>+91 9377 476 343</p>
                <p>parasgph@gmail.com</p>
                <p>Mon – Sat: 9 AM – 7 PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Paras Graphics, Ahmedabad. All rights reserved.
            </p>
          </div>
        </motion.footer>
      </div>
    </section>
  );
};

export default Contact;