import { useState } from 'react';
import { projects } from '../constants/projects';
import ProjectCard from './ProjectCard';

export default function Projects({ preview = false }) {
  const [filter, setFilter] = useState('all');
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.tags.includes(filter));
  
  const allTags = ['all', ...new Set(projects.flatMap(project => project.tags))];
  
  return (
    <section className="section" id="projects">
      <div className="container">
        <h2 className="section-title">Student Projects</h2>
        
        {!preview && (
          <div className="project-filters">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`filter-btn ${filter === tag ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        
        <div className="projects-grid">
          {(preview ? projects.slice(0, 3) : filteredProjects).map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        {preview && (
          <div className="text-center mt-8">
            <a href="#projects" className="btn btn-primary">
              View All Projects
            </a>
          </div>
        )}
      </div>
    </section>
  );
}