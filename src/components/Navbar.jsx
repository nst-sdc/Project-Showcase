import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

export default function Navbar({ onNavClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page) => {
    onNavClick(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#" className="logo" onClick={() => handleNavClick("home")}>
          <img src="/assets/nst-logo.png" alt="Newton School of Technology" className="logo-img" />
          <span className="logo-text">NST Showcase</span>
        </a>
        
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <button onClick={() => handleNavClick("home")}>Home</button>
          <button onClick={() => handleNavClick("projects")}>Projects</button>
          <button onClick={() => handleNavClick("about")}>About</button>
          <button onClick={() => handleNavClick("contact")}>Contact</button>
          <a 
            href="https://www.newtonschool.co/newton-school-of-technology-nst/home" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline nav-cta"
          >
            Visit NST <FiExternalLink size={14} />
          </a>
        </div>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
    </nav>
  );
}
