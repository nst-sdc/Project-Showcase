import { FiArrowRight } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content animate-fade-in">
        <h1 className="hero-title">
          <span className="text-accent">Newton School</span> of Technology
        </h1>
        <p className="hero-subtitle">
          Where innovation meets education. Discover groundbreaking projects from our talented students.
        </p>
        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary">
            Explore Projects <FiArrowRight />
          </a>
          <a href="#contact" className="btn btn-outline">
            Hire Talent
          </a>
        </div>
      </div>
    </section>
  );
}
