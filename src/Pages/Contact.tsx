import React from "react";
import "../styles/Contact.scss"; // Ensure the path is correct
import Navbar from "../components/Navbar";

const Contact: React.FC = () => {
  return (
    <div className="contact-page">
      <Navbar/>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>
            We'd love to hear from you! Reach out to us for any inquiries,
            feedback, or collaborations.
          </p>
        </div>
      </section>

      {/* Contact Form and Information Section */}
      <section className="contact-content">
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} required />
            </div>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="info-item">
            <span className="icon">📧</span>
            <p>Email: info@afrivoice.com</p>
          </div>
          <div className="info-item">
            <span className="icon">📞</span>
            <p>Phone: +254 700 123 456</p>
          </div>
          <div className="info-item">
            <span className="icon">📍</span>
            <p>Address: 123 AfriVoice Street, Nairobi, Kenya</p>
          </div>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8085599999997!2d36.82115931475391!3d-1.286359835979925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d5b5f5b5f5%3A0x5f5f5f5f5f5f5f5f!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2023 AfriVoice. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;