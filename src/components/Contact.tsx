import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CONTACT, SOCIAL_MEDIA, COMPANY } from '@/config/constants';
import { BorderBeam } from '@/components/magicui/border-beam';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '' // Security: Honeypot field to catch bots
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Security: Check honeypot field (should be empty)
    if (formData.honeypot) {
      console.log('Bot detected - honeypot filled');
      return;
    }

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error", 
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create WhatsApp message with form data
      const message = `Hello! I'm interested in your printing services.
      
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Message: ${formData.message}`;
      
      const whatsappUrl = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Message Sent!",
        description: "Your message has been forwarded to WhatsApp. We'll get back to you soon!",
      });
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '', honeypot: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              Contact 
               <span className="bg-gradient-cmyk bg-clip-text text-transparent ml-3">
                Us
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
              className="relative bg-card rounded-2xl p-8 shadow-elevation"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  Send us a Message
                </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Security: Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="website"
                  value={formData.honeypot}
                  onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.slice(0, 100) }))}
                    required
                    maxLength={100}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value.slice(0, 255) }))}
                    required
                    maxLength={255}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.slice(0, 15) }))}
                    maxLength={15}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value.slice(0, 1000) }))}
                    required
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan transition-colors resize-none"
                    placeholder="Tell us about your printing needs..."
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-cyan text-white py-4 rounded-lg font-semibold shadow-cyan-glow hover:shadow-lg transition-all duration-300 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message via WhatsApp'}
                </motion.button>
              </form>
              </div>
              
              {/* Animated Border Beam Effect */}
              <BorderBeam 
                size={250} 
                duration={12} 
                delay={9}
                colorFrom="#00bfff" 
                colorTo="#ff00ff"
              />
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
                    href={CONTACT.mapsUrl}
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
                        {CONTACT.address.line1}<br />
                        {CONTACT.address.line2}<br />
                        {CONTACT.address.line3}
                      </p>
                    </div>
                  </motion.a>
                  
                  <motion.a
                    href={`mailto:${CONTACT.email}`}
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
                      <p className="text-muted-foreground">{CONTACT.email}</p>
                    </div>
                  </motion.a>
                  
                  <motion.a
                    href={`tel:${CONTACT.phone}`}
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
                      <p className="text-muted-foreground">{CONTACT.phoneDisplay}</p>
                    </div>
                  </motion.a>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Business Hours</h4>
                      <p className="text-muted-foreground">{CONTACT.businessHours.weekdays}</p>
                      <p className="text-muted-foreground text-sm">{CONTACT.businessHours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Find Us</h4>
                <div className="rounded-lg overflow-hidden shadow-elevation">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.7727092166956!2d72.58748931481598!3d23.035063484940263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e85c4c4c4c4c5%3A0x1234567890abcdef!2s2%2C%20Chandrika%20Chamber%2C%20Mirzapur%20Rd%2C%20Mirzapur%2C%20Ahmedabad%2C%20Gujarat%20380001!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
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
                    href={SOCIAL_MEDIA.facebook}
                    aria-label="Follow us on Facebook"
                    className="bg-card p-3 rounded-lg text-muted-foreground hover:text-cyan hover:bg-cyan/10 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Facebook className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href={SOCIAL_MEDIA.instagram}
                    aria-label="Follow us on Instagram"
                    className="bg-card p-3 rounded-lg text-muted-foreground hover:text-magenta hover:bg-magenta/10 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Instagram className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href={SOCIAL_MEDIA.linkedin}
                    aria-label="Follow us on LinkedIn"
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
                  {COMPANY.name}
                </h3>
                <p className="text-xs text-muted-foreground -mt-1">
                  {COMPANY.tagline}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {COMPANY.description}
            </p>
            <p className="text-xs text-muted-foreground">
              Serving Ahmedabad since {COMPANY.foundedYear}
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
                <p>{CONTACT.phoneDisplay}</p>
                <p>{CONTACT.email}</p>
                <p>{CONTACT.businessHours.weekdays}</p>
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