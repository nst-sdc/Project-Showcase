import { useRef, useState, useEffect } from 'react';
import './Projects.css';
import f1 from "../assets/f1.png";
import f2 from "../assets/f2.png";
import f3 from "../assets/f3.png";
import f4 from "../assets/f4.png";
import f5 from "../assets/f5.png";
import f6 from "../assets/f6.png"
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';


const featuredProjects = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'A cutting-edge personal portfolio with 3D elements',
    image: f1,
    tags: ['frontend', '3D'],
    technologies: ['React', 'Three.js', 'Framer Motion'],
    student: 'John Doe',
    cohort: 'Batch 1',
    githubUrl: '#',
    liveUrl: '#'
  },
  {
    id: 2,
    title: 'AI Blog Generator',
    description: 'Automated blog content generation with GPT-3.5',
    image: f2,
    tags: ['AI', 'fullstack'],
    technologies: ['Next.js', 'OpenAI', 'Node.js'],
    student: 'John Doe',
    cohort: 'Batch 2',
    githubUrl: '#',
    liveUrl: '#'
  },
  {
    id: 3,
    title: 'AR E-commerce',
    description: 'Try products in augmented reality before buying',
    image: f3,
    tags: ['AR', 'mobile'],
    technologies: ['React Native', 'ARKit', 'Firebase'],
    student: 'John Doe',
    cohort: 'Batch 3',
    githubUrl: '#',
    liveUrl: '#'
  },
  {
    id: 4,
    title: 'Blockchain Wallet',
    description: 'Secure cryptocurrency wallet with NFT support',
    image: f4,
    tags: ['blockchain', 'web3'],
    technologies: ['Ethereum', 'Solidity', 'AI'],
    student: 'John Doe',
    cohort: 'Batch 4',
    githubUrl: '#',
    liveUrl: '#'
  },
  {
    id: 5,
    title: 'Metaverse Platform',
    description: 'Virtual world with real-time avatar interactions',
    image: f5,
    tags: ['VR', 'social','AI'],
    technologies: ['Unity', 'WebRTC', 'Node.js'],
    student: 'John Doe',
    cohort: 'Batch 5',
    githubUrl: '#',
    liveUrl: '#'
  },
  {
    id: 6,
    title: 'Building With AI',
    description: 'A world that grows with AI',
    image: f6,
    tags: ['VR', 'social','AI'],
    technologies: ['Unity', 'WebRTC', 'Node.js'],
    student: 'John Doe',
    cohort: 'Batch 6',
    githubUrl: '#',
    liveUrl: '#'
  }
];
const projectCategories = [
  {
    name: "Trending Now",
    projects: [...featuredProjects].reverse()
  },
  {
    name: "AI/ML Projects",
    projects: featuredProjects.filter(p => p.tags.includes('AI'))
  },
  {
    name: "All Projects",
    projects: [...featuredProjects]
  }
];

export default function Projects() {
  const featuredRef = useRef(null);
  const categoryRefs = useRef([]);
  const heroRef = useRef(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Enable touchpad/touchscreen scrolling
  useEffect(() => {
    const rows = [featuredRef.current, ...categoryRefs.current].filter(Boolean);
    
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;
      e.preventDefault();
      e.currentTarget.scrollLeft += e.deltaY;
    };

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - e.currentTarget.offsetLeft);
      setScrollLeft(e.currentTarget.scrollLeft);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - e.currentTarget.offsetLeft;
      const walk = (x - startX) * 2;
      e.currentTarget.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    rows.forEach(row => {
      row.addEventListener('wheel', handleWheel, { passive: false });
      row.addEventListener('mousedown', handleMouseDown);
      row.addEventListener('mousemove', handleMouseMove);
      row.addEventListener('mouseup', handleMouseUp);
      row.addEventListener('mouseleave', handleMouseUp);
    });

    return () => {
      rows.forEach(row => {
        row?.removeEventListener('wheel', handleWheel);
        row?.removeEventListener('mousedown', handleMouseDown);
        row?.removeEventListener('mousemove', handleMouseMove);
        row?.removeEventListener('mouseup', handleMouseUp);
        row?.removeEventListener('mouseleave', handleMouseUp);
      });
    };
  }, [isDragging, startX, scrollLeft]);

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -500 : 500,
        behavior: 'smooth'
      });
    }
  };

  const scrollHero = (direction) => {
    const newIndex = direction === 'left' 
      ? (currentHeroIndex - 1 + featuredProjects.length) % featuredProjects.length
      : (currentHeroIndex + 1) % featuredProjects.length;
    
    setCurrentHeroIndex(newIndex);
  };

  const goToHeroSlide = (index) => {
    setCurrentHeroIndex(index);
  };

  return (
    <div className="main-container">
      {/* Hero Banner Carousel */}
      <div className="hero-carousel">
        <div 
          className="hero-slides"
          style={{ 
            transform: `translateX(-${currentHeroIndex * 100}%)`,
            transition: 'transform 0.5s ease'
          }}
        >
          {featuredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className="hero-banner" 
              style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%), url(${project.image})` }}
            >
              <div className="hero-content">
                <h1 className="hero-title">{project.title}</h1>
                <p className="hero-description">{project.description}</p>
                <div className="hero-buttons">
                  <button className="play-button">
                    <FaExternalLinkAlt /> View Project
                  </button>
                  <button className="info-button">
                    <FiUser /> Student Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Ultra Minimal Navigation Buttons */}
        <button 
          className="hero-nav-button left" 
          onClick={() => scrollHero('left')}
          aria-label="Previous project"
        >
          <FaChevronLeft />
        </button>
        <button 
          className="hero-nav-button right" 
          onClick={() => scrollHero('right')}
          aria-label="Next project"
        >
          <FaChevronRight />
        </button>
        
        {/* Nearly Invisible Dots */}
        <div className="hero-dots">
          {featuredProjects.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentHeroIndex ? 'active' : ''}`}
              onClick={() => goToHeroSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Projects Row */}
      <div className="row-container">
        <h2 className="row-title">Featured Projects</h2>
        <div className="scroll-container">
          <button className="scroll-button left" onClick={() => scroll(featuredRef, 'left')} aria-label="Scroll left">
            <FaChevronLeft />
          </button>
          <div 
            className={`projects-row ${isDragging ? 'grabbing' : ''}`} 
            ref={featuredRef}
          >
            {featuredProjects.map(project => (
              <div className="project-card featured" key={project.id}>
                <div className="card-image" style={{ backgroundImage: `url(${project.image})` }}></div>
                <div className="card-overlay">
                  <h3>{project.title}</h3>
                  <div className="card-actions">
                    <a href={project.githubUrl} aria-label="GitHub repository"><FaGithub /></a>
                    <a href={project.liveUrl} aria-label="Live demo"><FaExternalLinkAlt /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="scroll-button right" onClick={() => scroll(featuredRef, 'right')} aria-label="Scroll right">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Category Rows */}
      {projectCategories.map((category, index) => (
        <div className="row-container" key={category.name}>
          <h2 className="row-title">{category.name}</h2>
          <div className="scroll-container">
            <button className="scroll-button left" onClick={() => scroll(categoryRefs.current[index], 'left')} aria-label="Scroll left">
              <FaChevronLeft />
            </button>
            <div 
              className={`projects-row ${isDragging ? 'grabbing' : ''}`} 
              ref={el => categoryRefs.current[index] = el}
            >
              {category.projects.map(project => (
                <div className="project-card" key={project.id}>
                  <div className="card-image" style={{ backgroundImage: `url(${project.image})` }}></div>
                  <div className="card-overlay">
                    <h3>{project.title}</h3>
                    <div className="card-actions">
                      <a href={project.githubUrl} aria-label="GitHub repository"><FaGithub /></a>
                      <a href={project.liveUrl} aria-label="Live demo"><FaExternalLinkAlt /></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => scroll(categoryRefs.current[index], 'right')} aria-label="Scroll right">
              <FaChevronRight />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}