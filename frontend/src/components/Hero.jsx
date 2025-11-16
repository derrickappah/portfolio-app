import React from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  const { portfolioData, loading } = usePortfolio();
  
  if (loading || !portfolioData?.hero) {
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-body">Loading...</div>
      </section>
    );
  }
  
  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '120px 24px 80px'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <div className="label" style={{ marginBottom: '24px', opacity: 0.7 }}>
          FULL-STACK DEVELOPER
        </div>

        <h1 className="hero-title" style={{ marginBottom: '32px' }}>
          {portfolioData.hero.name}
        </h1>

        <p className="text-big" style={{ marginBottom: '48px', maxWidth: '800px', margin: '0 auto 48px' }}>
          {portfolioData.hero.description}
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={scrollToProjects} className="btn-accent">
            {portfolioData.hero.cta}
          </button>
          <a href="#contact" className="btn-primary">
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite'
        }}
      >
        <ArrowDown size={24} color="var(--text-secondary)" />
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
