import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? 'rgba(242, 242, 242, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(35, 35, 35, 0.1)' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Link to="/" className="header-logo" style={{ textDecoration: 'none' }}>
            DA
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', gap: '8px' }} className="desktop-nav">
            <button onClick={() => scrollToSection('about')} className="nav-link" style={{ background: 'none', border: 'none' }}>
              About
            </button>
            <button onClick={() => scrollToSection('skills')} className="nav-link" style={{ background: 'none', border: 'none' }}>
              Skills
            </button>
            <button onClick={() => scrollToSection('projects')} className="nav-link" style={{ background: 'none', border: 'none' }}>
              Projects
            </button>
            <button onClick={() => scrollToSection('contact')} className="nav-link" style={{ background: 'none', border: 'none' }}>
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'none'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          background: 'var(--bg-white)',
          borderBottom: '1px solid var(--border-light)',
          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: mobileMenuOpen ? 1 : 0,
          transition: 'all 0.3s ease',
          zIndex: 999,
          display: 'none'
        }}
      >
        <nav style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button onClick={() => scrollToSection('about')} className="nav-link" style={{ background: 'none', border: 'none', textAlign: 'left' }}>
            About
          </button>
          <button onClick={() => scrollToSection('skills')} className="nav-link" style={{ background: 'none', border: 'none', textAlign: 'left' }}>
            Skills
          </button>
          <button onClick={() => scrollToSection('projects')} className="nav-link" style={{ background: 'none', border: 'none', textAlign: 'left' }}>
            Projects
          </button>
          <button onClick={() => scrollToSection('contact')} className="nav-link" style={{ background: 'none', border: 'none', textAlign: 'left' }}>
            Contact
          </button>
        </nav>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .desktop-nav {
              display: none !important;
            }
            .mobile-menu-btn {
              display: block !important;
            }
            .mobile-menu {
              display: block !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Header;
