import React, { useState } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { ExternalLink, Filter } from 'lucide-react';

const Projects = () => {
  const { portfolioData, loading } = usePortfolio();
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Full-Stack', 'Frontend', 'Backend'];

  if (loading || !portfolioData?.projects) {
    return null;
  }

  const filteredProjects =
    filter === 'All'
      ? portfolioData.projects || []
      : (portfolioData.projects || []).filter((project) => project.category === filter);

  return (
    <section id="projects" className="section-padding" style={{ background: 'var(--bg-white)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="label" style={{ marginBottom: '24px' }}>
          SELECTED WORK
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '48px',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          <h2 className="title-big">PROJECTS</h2>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={16} style={{ marginRight: '8px', color: 'var(--text-secondary)' }} />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={filter === category ? 'btn-accent' : 'btn-primary'}
                style={{
                  padding: '8px 16px',
                  minHeight: 'auto',
                  fontSize: '11px'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '32px'
          }}
        >
          {filteredProjects.map((project) => (
            <div key={project.id} className="card">
              <div
                style={{
                  width: '100%',
                  height: '250px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'var(--color-background)'
                }}
              >
                {project.image && project.image.trim() !== '' ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--color-background)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <span className="text-body">No Image</span>
                  </div>
                )}
                {project.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'var(--accent-primary)',
                      padding: '6px 12px'
                    }}
                    className="label-small"
                  >
                    FEATURED
                  </div>
                )}
              </div>

              <div style={{ padding: '24px' }}>
                <div className="label-small" style={{ marginBottom: '8px' }}>
                  {project.category}
                </div>

                <h3 className="text-regular" style={{ marginBottom: '12px' }}>
                  {project.title}
                </h3>

                <p className="text-body" style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {project.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="label-small"
                      style={{
                        padding: '6px 12px',
                        background: 'var(--color-background)'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  View Project
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
              No projects found in this category.
            </p>
          </div>
        )}
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            #projects .title-big {
              margin-bottom: 16px;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Projects;
