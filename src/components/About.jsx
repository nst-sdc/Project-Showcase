export default function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <h2 className="section-title">About NST Project Showcase</h2>
        
        <div className="about-content">
          <div className="about-text">
            <p>
              The Newton School of Technology Project Showcase is a curated collection of 
              exceptional work created by our students throughout their intensive program.
            </p>
            <p>
              Each project represents hundreds of hours of dedication, problem-solving, 
              and innovation across various technology domains. Our students tackle 
              real-world challenges using cutting-edge technologies and modern development 
              practices.
            </p>
            <h3 className="about-subtitle">Our Approach</h3>
            <p>
              At NST, we emphasize project-based learning where students build complete, 
              production-ready applications. Our curriculum focuses on:
            </p>
            <ul className="about-list">
              <li>Full-stack web development</li>
              <li>Modern frameworks and libraries</li>
              <li>Cloud computing and DevOps</li>
              <li>Data structures and algorithms</li>
              <li>Collaborative development practices</li>
            </ul>
          </div>
          
          <div className="about-image">
            <img 
              src="/assets/about-nst.jpg" 
              alt="Students working on projects at NST" 
              className="about-img"
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="stats-cards">
          <div className="stat-card">
            <h4>12 Weeks</h4>
            <p>Intensive program duration</p>
          </div>
          <div className="stat-card">
            <h4>4-6 Projects</h4>
            <p>Completed per student</p>
          </div>
          <div className="stat-card">
            <h4>100%</h4>
            <p>Hands-on coding</p>
          </div>
        </div>
      </div>
    </section>
  );
}