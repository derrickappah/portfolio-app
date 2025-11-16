import React from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';

const Skills = () => {
  const { portfolioData, loading } = usePortfolio();
  
  if (loading || !portfolioData?.skills) {
    return null;
  }

  return (
    <section id="skills" className="section-padding">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="label" style={{ marginBottom: '24px' }}>
          MY EXPERTISE
        </div>

        <h2 className="title-big" style={{ marginBottom: '64px' }}>
          SKILLS & TECHNOLOGIES
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}
        >
          {(portfolioData.skills || []).map((skillGroup, index) => (
            <div
              key={index}
              className="card"
              style={{
                padding: '32px'
              }}
            >
              <div className="label" style={{ marginBottom: '24px', color: 'var(--accent-primary)' }}>
                {skillGroup.category}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {skillGroup.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    style={{
                      padding: '12px 16px',
                      background: 'var(--color-background)',
                      transition: 'all 0.2s ease',
                      cursor: 'default'
                    }}
                    className="text-body"
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'var(--accent-primary)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'var(--color-background)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
