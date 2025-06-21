import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

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
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <img src="/assets/nst-logo.svg" alt="Newton School of Technology" className="logo-img" />
          <span className="logo-text">NST Showcase</span>
        </div>
        
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <button onClick={() => handleNavClick("home")}>Home</button>
          <button onClick={() => handleNavClick("projects")}>Projects</button>
          <button onClick={() => handleNavClick("about")}>About</button>
          <button onClick={() => handleNavClick("contact")}>Contact</button>
          <a 
            href="https://nst.edu" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline nav-cta"
          >
            Visit NST
          </a>
        </div>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}