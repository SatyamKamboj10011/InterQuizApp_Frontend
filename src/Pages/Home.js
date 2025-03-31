import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrophy, FaBrain, FaFire, FaChevronDown, FaPlay, FaCog, FaGraduationCap, FaUsers, FaChartLine } from 'react-icons/fa';
import './Home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const scrollToFeatures = () => {
    document.querySelector('.features-section').scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="home-container">
      <Container>
        <motion.section 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              Elevate Your Knowledge
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Join thousands of learners worldwide in an immersive quiz experience. Challenge yourself, compete with others, and become a master of knowledge.
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              <Button 
                className="cta-button"
                onClick={() => navigate('/')}
              >
                <FaPlay className="me-2" /> Start Your Journey
              </Button>
            </motion.div>
            <motion.div className="hero-illustration">
              <img 
                src="https://illustrations.popsy.co/amber/genius.svg" 
                alt="Student Learning"
                className="hero-svg"
              />
            </motion.div>
          </div>
          <motion.div
            className="scroll-down"
            onClick={scrollToFeatures}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaChevronDown />
          </motion.div>
        </motion.section>

        <motion.section 
          className="features-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <motion.div 
                className="feature-card"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="https://illustrations.popsy.co/amber/taking-notes.svg"
                  alt="Dynamic Quizzes" 
                  className="feature-illustration"
                />
                <FaBrain className="feature-icon floating" />
                <h3 className="feature-title">Dynamic Quizzes</h3>
                <p className="feature-description">
                  Experience AI-powered quizzes that adapt to your skill level, offering personalized challenges across diverse topics.
                </p>
              </motion.div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <motion.div 
                className="feature-card"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="https://illustrations.popsy.co/amber/achievement.svg"
                  alt="Compete & Win" 
                  className="feature-illustration"
                />
                <FaTrophy className="feature-icon floating" />
                <h3 className="feature-title">Compete & Win</h3>
                <p className="feature-description">
                  Challenge players globally, climb the leaderboard, and earn prestigious achievements in real-time competitions.
                </p>
              </motion.div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <motion.div 
                className="feature-card"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="https://illustrations.popsy.co/amber/keynote-presentation.svg"
                  alt="Track Progress" 
                  className="feature-illustration"
                />
                <FaChartLine className="feature-icon floating" />
                <h3 className="feature-title">Track Progress</h3>
                <p className="feature-description">
                  Visualize your learning journey with detailed analytics, performance insights, and personalized improvement recommendations.
                </p>
              </motion.div>
            </Col>
          </Row>
        </motion.section>

        <motion.section 
          className="stats-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Row className="text-center my-5">
            <Col md={4}>
              <motion.div 
                className="stat-item"
                whileHover={{ scale: 1.05 }}
              >
                <FaUsers className="stat-icon" />
                <h2 className="stat-number">10,000+</h2>
                <p className="stat-label">Active Users</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div 
                className="stat-item"
                whileHover={{ scale: 1.05 }}
              >
                <FaGraduationCap className="stat-icon" />
                <h2 className="stat-number">500+</h2>
                <p className="stat-label">Quiz Topics</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div 
                className="stat-item"
                whileHover={{ scale: 1.05 }}
              >
                <FaFire className="stat-icon" />
                <h2 className="stat-number">1M+</h2>
                <p className="stat-label">Questions Answered</p>
              </motion.div>
            </Col>
          </Row>
        </motion.section>

        {user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="admin-section">
              <div className="admin-content">
                <img 
                  src="https://illustrations.popsy.co/amber/developer.svg"
                  alt="Admin Dashboard"
                  className="admin-illustration"
                />
                <FaCog className="admin-icon floating" />
                <h3>Admin Dashboard</h3>
                <p>Access powerful tools to manage quizzes, monitor user activity, and analyze platform performance</p>
                <Button 
                  className="admin-button"
                  onClick={() => navigate('/admin')}
                >
                  Access Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <footer className="footer">
          <p>Created with ❤️ by SATYAM KAMBOJ | © 2024 QuizMaster</p>
        </footer>
      </Container>
    </div>
  );
};

export default HomePage;
