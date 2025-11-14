import React from 'react';
import { portfolioData } from '../mock';

const About = () => {
  return (
    <section id="about" className="section-padding" style={{ background: 'var(--bg-white)' }}>
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
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  marginBottom: '8px'
                }}
              >
                {portfolioData.about.yearsExperience}
              </div>
              <div className="label-small">Years Experience</div>
            </div>

            <div
              className="card"
              style={{
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  marginBottom: '8px'
                }}
              >
                {portfolioData.about.projectsCompleted}
              </div>
              <div className="label-small">Projects Completed</div>
            </div>

            <div
              className="card"
              style={{
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  marginBottom: '8px'
                }}
              >
                {portfolioData.about.clientsSatisfied}
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
