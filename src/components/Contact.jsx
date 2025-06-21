export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <h2 className="section-title">Contact Our Students</h2>
        <div className="contact-container">
          <div className="contact-info">
            <h3 className="contact-subtitle">Get in Touch</h3>
            <p className="contact-text">
              Interested in hiring our students or learning more about their projects? 
              Fill out the form and we'll connect you with the right candidates.
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <h4>Email</h4>
                <p>talent@nst.edu</p>
              </div>
              <div className="contact-item">
                <h4>Phone</h4>
                <p>(555) 123-4567</p>
              </div>
              <div className="contact-item">
                <h4>Location</h4>
                <p>San Francisco, CA</p>
              </div>
            </div>
          </div>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input type="text" id="company" name="company" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}