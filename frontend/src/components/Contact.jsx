import React, { useState } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { submitContactForm } from '../services/supabaseService';

const Contact = () => {
  const { portfolioData, loading } = usePortfolio();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formData);
      
      if (result.success) {
        // Show visual success indicator
        setShowSuccess(true);
        
        toast({
          title: 'Message Sent!',
          description: 'Thank you for reaching out. I\'ll get back to you soon.',
          duration: 5000
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        duration: 5000,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !portfolioData?.contact) {
    return null;
  }

  return (
    <section id="contact" className="section-padding">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="label" style={{ marginBottom: '24px' }}>
          GET IN TOUCH
        </div>

        <h2 className="title-big" style={{ marginBottom: '64px' }}>
          {portfolioData.contact.heading}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px'
          }}
        >
          {/* Contact Info */}
          <div>
            <p className="text-body" style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.8 }}>
              {portfolioData.contact.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Mail size={24} color="var(--accent-primary)" />
                <div>
                  <div className="label-small" style={{ marginBottom: '4px' }}>
                    EMAIL
                  </div>
                  <a
                    href={`mailto:${portfolioData.contact.email}`}
                    className="text-body"
                    style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                  >
                    {portfolioData.contact.email}
                  </a>
                </div>
              </div>

              <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <MapPin size={24} color="var(--accent-primary)" />
                <div>
                  <div className="label-small" style={{ marginBottom: '4px' }}>
                    LOCATION
                  </div>
                  <p className="text-body" style={{ margin: 0 }}>
                    {portfolioData.contact.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card" style={{ padding: '32px', position: 'relative' }}>
            {/* Success Message Overlay */}
            {showSuccess && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.98)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  padding: '32px',
                  animation: 'fadeIn 0.3s ease-in',
                  borderRadius: '4px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'scaleIn 0.5s ease-out',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <CheckCircle size={48} color="white" strokeWidth={2.5} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: 0
                    }}
                  >
                    Message Sent!
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '16px',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      maxWidth: '300px',
                      lineHeight: 1.6
                    }}
                  >
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label className="label-small" style={{ display: 'block', marginBottom: '8px' }}>
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-light)',
                    borderRadius: 0,
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    background: 'var(--color-background)',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-light)')}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="label-small" style={{ display: 'block', marginBottom: '8px' }}>
                  YOUR EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-light)',
                    borderRadius: 0,
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    background: 'var(--color-background)',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-light)')}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="label-small" style={{ display: 'block', marginBottom: '8px' }}>
                  SUBJECT *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-light)',
                    borderRadius: 0,
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    background: 'var(--color-background)',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-light)')}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="label-small" style={{ display: 'block', marginBottom: '8px' }}>
                  MESSAGE *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-light)',
                    borderRadius: 0,
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    background: 'var(--color-background)',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-light)')}
                />
              </div>

              <button
                type="submit"
                className="btn-accent"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
