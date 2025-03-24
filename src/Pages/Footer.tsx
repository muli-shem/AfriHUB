import React from "react";
import "../styles/Footer.scss"; // Ensure the path is correct

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Quick Links Section */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/register">Register</a>
            </li>
          </ul>
        </div>

        {/* Contact Information Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li>📧 Email: info@afrivoice.com</li>
            <li>📞 Phone: +254 700 123 456</li>
            <li>📍 Address: 123 AfriVoice Street, Nairobi, Kenya</li>
          </ul>
        </div>

        {/* Social Media Links Section */}
        <div className="footer-section">
          <h3>Follow Us</h3>
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
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>© 2023 AfriVoice. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;