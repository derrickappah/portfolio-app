import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

const Footer = () => {
  const { portfolioData, loading } = usePortfolio();
  
  if (loading || !portfolioData) {
    return null;
  }

  return (
    <footer
      style={{
        background: 'var(--bg-white)',
        borderTop: '1px solid var(--border-light)',
        padding: '48px 24px'
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px'
        }}
      >
        {/* Brand Section */}
        <div>
          <div className="header-logo" style={{ marginBottom: '16px' }}>
            DA
          </div>
          <p className="text-body" style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Full-Stack Web Developer specializing in modern web technologies.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a
              href={portfolioData.social.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-primary)',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Github size={20} />
            </a>
            <a
              href={portfolioData.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-primary)',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Linkedin size={20} />
            </a>
            <a
              href={portfolioData.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-primary)',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="label" style={{ marginBottom: '16px' }}>
            Quick Links
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="#about" className="text-body" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>
              About
            </a>
            <a href="#skills" className="text-body" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>
              Skills
            </a>
            <a href="#projects" className="text-body" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>
              Projects
            </a>
            <a href="#contact" className="text-body" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>
              Contact
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <div className="label" style={{ marginBottom: '16px' }}>
            Get in Touch
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a
              href={`mailto:${portfolioData.contact.email}`}
              className="text-body"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'color 0.2s ease'
              }}
            >
              <Mail size={16} />
              {portfolioData.contact.email}
            </a>
            <p className="text-body" style={{ color: 'var(--text-secondary)', margin: 0 }}>
              {portfolioData.contact.location}
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '48px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid var(--border-light)',
          textAlign: 'center'
        }}
      >
        <p className="label-small" style={{ margin: 0 }}>
          © {new Date().getFullYear()} Derrick Appah. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
