import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';

const About = () => {
  const { portfolioData, loading } = usePortfolio();
  
  // Extract target numbers from portfolio data
  const yearsTarget = portfolioData?.about ? parseInt(portfolioData.about.yearsExperience || "1+") || 1 : 1;
  const projectsTarget = portfolioData?.about ? parseInt(portfolioData.about.projectsCompleted || "10+") || 10 : 10;
  const clientsTarget = portfolioData?.about ? parseInt(portfolioData.about.clientsSatisfied || "10+") || 10 : 10;
  
  // Initialize with 0, will be set to target values when data loads
  const [yearsCount, setYearsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    let timeoutId;
    let observer;
    let retryTimer;

    function setupObserver(el) {
      // Check if section is already visible
      const checkVisibility = () => {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          setIsVisible(true);
        }
      };

      // Check after component is fully rendered
      timeoutId = setTimeout(checkVisibility, 300);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      observer.observe(el);
    }

    const element = sectionRef.current;
    if (!element) {
      // Retry after a short delay if element not ready
      retryTimer = setTimeout(() => {
        const retryElement = sectionRef.current;
        if (retryElement) {
          setupObserver(retryElement);
        }
      }, 100);
    } else {
      setupObserver(element);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (retryTimer) clearTimeout(retryTimer);
      if (observer && sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []); // Only run once on mount

  // Set initial values when data loads
  useEffect(() => {
    if (portfolioData?.about && !hasAnimated) {
      // Set to target values initially so they show correctly
      setYearsCount(yearsTarget);
      setProjectsCount(projectsTarget);
      setClientsCount(clientsTarget);
    }
  }, [portfolioData, yearsTarget, projectsTarget, clientsTarget, hasAnimated]);

  // Animate when section becomes visible
  useEffect(() => {
    // Don't animate if data isn't ready or already animated
    if (!portfolioData?.about || hasAnimated) {
      return;
    }

    // If section is visible, start animation
    if (isVisible) {
      // Mark as animated immediately to prevent re-triggering
      setHasAnimated(true);

      // Start animation from 0
      setYearsCount(0);
      setProjectsCount(0);
      setClientsCount(0);

      // Animation settings
      const duration = 2000; // 2 seconds
      const steps = 60;
      const interval = duration / steps;

      const yearsIncrement = yearsTarget / steps;
      const projectsIncrement = projectsTarget / steps;
      const clientsIncrement = clientsTarget / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        
        // Update counts with smooth increment
        setYearsCount(Math.min(yearsTarget, Math.ceil(yearsIncrement * currentStep)));
        setProjectsCount(Math.min(projectsTarget, Math.ceil(projectsIncrement * currentStep)));
        setClientsCount(Math.min(clientsTarget, Math.ceil(clientsIncrement * currentStep)));

        // Complete animation
        if (currentStep >= steps) {
          clearInterval(timer);
          setYearsCount(yearsTarget);
          setProjectsCount(projectsTarget);
          setClientsCount(clientsTarget);
        }
      }, interval);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isVisible, portfolioData, yearsTarget, projectsTarget, clientsTarget, hasAnimated]);

  if (loading || !portfolioData?.about) {
    return null;
  }

  return (
    <section id="about" className="section-padding" style={{ background: 'var(--bg-white)' }} ref={sectionRef}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="label" style={{ marginBottom: '24px' }}>
          ABOUT ME
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}
        >
          <div>
            <h2 className="title-big" style={{ marginBottom: '24px' }}>
              {portfolioData.about.heading}
            </h2>
            <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {portfolioData.about.bio}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px'
            }}
          >
            <div
              className="card"
              style={{
                padding: '24px',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                {yearsCount}+
              </div>
              <div className="label-small">Years Experience</div>
            </div>

            <div
              className="card"
              style={{
                padding: '24px',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                {projectsCount}+
              </div>
              <div className="label-small">Projects Completed</div>
            </div>

            <div
              className="card"
              style={{
                padding: '24px',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                {clientsCount}+
              </div>
              <div className="label-small">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            #about > div > div:last-child {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default About;
