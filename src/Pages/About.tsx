import React from "react";
import "../styles/About.scss"; // Ensure the path is correct
import Navbar from "../components/Navbar";

const About: React.FC = () => {
  return (
    <div className="about-page">
      <Navbar/>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>About AfriVoice</h1>
          <p>
            Empowering communities through civic education, leadership, and
            advocacy. Join us in building a better future for Africa.
          </p>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="mission-vision">
        <div className="mission">
          <div className="icon">🎯</div>
          <h2>Our Mission</h2>
          <p>
            To empower individuals and communities with the knowledge and tools
            to actively participate in governance and civic processes.
          </p>
        </div>
        <div className="vision">
          <div className="icon">🌍</div>
          <h2>Our Vision</h2>
          <p>
            A continent where every voice is heard, and every citizen is engaged
            in shaping their future.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src="/path/to/team-member1.jpg" alt="Team Member 1" />
            <h3>John Doe</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <img src="/path/to/team-member2.jpg" alt="Team Member 2" />
            <h3>Jane Smith</h3>
            <p>Head of Operations</p>
          </div>
          <div className="team-member">
            <img src="/path/to/team-member3.jpg" alt="Team Member 3" />
            <h3>Alice Johnson</h3>
            <p>Lead Developer</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value">
            <div className="icon">💡</div>
            <h3>Innovation</h3>
            <p>We embrace creativity and technology to drive change.</p>
          </div>
          <div className="value">
            <div className="icon">🤝</div>
            <h3>Collaboration</h3>
            <p>We believe in the power of working together.</p>
          </div>
          <div className="value">
            <div className="icon">🌱</div>
            <h3>Sustainability</h3>
            <p>We are committed to long-term, impactful solutions.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Join Us in Making a Difference</h2>
        <p>
          Whether you're a volunteer, donor, or partner, your support helps us
          empower communities across Africa.
        </p>
        <button className="cta-button">Get Involved</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
        <p>© 2023 AfriVoice. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;