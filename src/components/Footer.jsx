import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/assets/nst-logo.png" alt="Newton School of Technology" className="footer-logo" />
            <p className="footer-description">
              Empowering the next generation of technology innovators through 
              project-based learning and industry-aligned curriculum.
            </p>
            <div className="footer-social">
              <a href="https://linkedin.com/school/nst" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://github.com/nst-tech" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://twitter.com/nst_tech" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="mailto:info@nst.edu" aria-label="Email">
                <FaEnvelope />
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-title">Explore</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Programs</h4>
              <ul>
                <li><a href="#">Full-Stack Development</a></li>
                <li><a href="#">Data Science</a></li>
                <li><a href="#">Cloud Engineering</a></li>
                <li><a href="#">Blockchain</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Newton School of Technology. All rights reserved.</p>
          <p>Made with ♥ by NST students</p>
        </div>
      </div>
    </footer>
  );
}