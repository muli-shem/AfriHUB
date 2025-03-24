import React from "react";
import { motion } from "framer-motion"; // For animations
import "../styles/LandingPage.scss"; // Ensure the path is correct

// Import images and icons
import heroImage from "../assets/images/kenyaflag.png";
import educationIcon from "../assets/images/education icon.png";
import healthIcon from "../assets/images/healthrighticon.png";
import equalityIcon from "../assets/images/equality.png"
import privacyIcon from "../assets/images/Privacy.png"
import laborIcon from "../assets/images/Labour.png"
import environmentIcon from "../assets/images/EnnvironIcon.png"
import informationIcon from "../assets/images/information.png"
import expressionIcon from "../assets/images/expression.png"
import housingIcon from "../assets/images/housing.png"
import governanceIcon from "../assets/images/governance.png"
import movementIcon from "../assets/images/movement.png"
import janeDoeAvatar from "../assets/images/image.png";
import johnSmithAvatar from "../assets/images/image.png";
import ctaVideo from "../assets/images/ctmvideo.mp4";
import twitterIcon from "../assets/images/Xlogo.png";
import facebookIcon from "../assets/images/facebook.png";
import instagramIcon from "../assets/images/instagram.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <Navbar/>
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome to AfriVoice Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Empowering citizens, enhancing democracy, and fostering communication.
          </motion.p>
          <div className="button-container">
            <motion.button
              className="cta-button" 
              onClick={() => navigate("/register")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <motion.button
              className="cta-button login-button" 
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </div>
        </div>
      </section>

      {/* Constitutional Rights Section */}
      <section className="constitutional-rights">
  <h2>Know Your Constitutional Rights</h2>
  <div className="rights-grid">
    {[
      {
        title: "Right to Education",
        description:
          "Every child has the right to free and compulsory basic education, as well as access to affordable secondary and higher education opportunities.",
        reference: "Article 43(1)(f), Article 53(1)(b)",
        icon: educationIcon,
      },
      {
        title: "Right to Health",
        description:
          "Everyone has the right to the highest attainable standard of health, including health care services, clean water, and sanitation.",
        reference: "Article 43(1)(a)",
        icon: healthIcon,
      },
      {
        title: "Equality and Freedom from Discrimination",
        description:
          "All individuals are equal before the law and have the right to equal protection and benefit of the law without discrimination.",
        reference: "Article 27",
        icon: equalityIcon,
      },
      {
        title: "Right to Privacy",
        description:
          "Everyone has the right to privacy, which includes the right not to have their personal information unnecessarily disclosed.",
        reference: "Article 31",
        icon: privacyIcon,
      },
      {
        title: "Right to Fair Labour Practices",
        description:
          "Every worker has the right to fair remuneration, reasonable working conditions, and freedom from forced labor or discrimination.",
        reference: "Article 41",
        icon: laborIcon,
      },
      {
        title: "Right to a Clean and Healthy Environment",
        description:
          "Everyone has the right to live in a clean and healthy environment, which must be protected for current and future generations.",
        reference: "Article 42",
        icon: environmentIcon,
      },
      {
        title: "Right to Access Information",
        description:
          "Every person has the right to access information held by the state or another person that is necessary for the exercise or protection of a right.",
        reference: "Article 35",
        icon: informationIcon,
      },
      {
        title: "Freedom of Expression",
        description:
          "Every individual has the right to freedom of expression, including seeking, receiving, and imparting information or ideas.",
        reference: "Article 33",
        icon: expressionIcon,
      },
      {
        title: "Right to Housing",
        description:
          "Every person has the right to accessible and adequate housing and to reasonable standards of sanitation.",
        reference: "Article 43(1)(b)",
        icon: housingIcon,
      },
      {
        title: "Right to Participate in Governance",
        description:
          "Every citizen has the right to free, fair, and regular elections for any elective public body or office.",
        reference: "Article 38(2)",
        icon: governanceIcon,
      },
      {
        title: "Freedom of Movement",
        description:
          "Every citizen has the right to move freely throughout Kenya and to reside anywhere within its borders.",
        reference: "Article 39",
        icon: movementIcon,
      },        
            // Add more rights here...
          ].map((right, index) => (
            <motion.div
              className="card"
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img src={right.icon} alt={right.title} className="right-icon" />
              <h3>{right.title}</h3>
              <p>{right.description}</p>
              <span className="reference">({right.reference})</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          {[
            {
              name: "Jane Doe",
              feedback:
                "AfriVoice Hub has transformed how we interact with our leaders. It's empowering and truly revolutionary!",
              avatar: janeDoeAvatar,
            },
            {
              name: "John Smith",
              feedback:
                "Through this platform, I learned about my rights and how to hold our leaders accountable. Highly recommended!",
              avatar: johnSmithAvatar,
            },
            // Add more testimonials here...
          ].map((testimonial, index) => (
            <motion.div
              className="testimonial-card"
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="testimonial-avatar"
              />
              <p>"{testimonial.feedback}"</p>
              <h4>- {testimonial.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <video autoPlay loop muted className="cta-video">
          <source src={ctaVideo} type="video/mp4" />
        </video>
        <div className="cta-content">
          <h2>Join the Movement</h2>
          <p>Sign up today and be part of the change.</p>
          <motion.button
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="social-links">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={twitterIcon} alt="Twitter" className="social-icon" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" className="social-icon" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" className="social-icon" />
          </a>
        </div>
        <p>&copy; 2023 AfriVoice Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;