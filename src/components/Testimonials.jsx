import { testimonials } from '../constants/testimonials';

export default function Testimonials() {
  return (
    <section className="section testimonials-section">
      <div className="container">
        <h2 className="section-title">What Recruiters Say</h2>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">"{testimonial.content}"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}