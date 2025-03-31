import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Row, Col, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { FaCrown, FaPlay, FaTrophy, FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import './PlayerDashboard.css';

// Styled components
const HeroSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem 0;
  margin-bottom: 3rem;
  border-radius: 0 0 25px 25px;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const QuizCard = styled(Card)`
  border-radius: 15px;
  overflow: hidden;
  border: none;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const PlayButton = styled(Button)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
  }
`;

const DifficultyBadge = styled(Badge)`
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  text-transform: uppercase;
  font-weight: 600;

  &.easy {
    background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
    color: #2c3e50;
  }

  &.medium {
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    color: #2c3e50;
  }

  &.hard {
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    color: #2c3e50;
  }
`;

export default function PlayerDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get("http://localhost:8080/quiz/active")
      .then(res => {
        setQuizzes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load quizzes. Please try again later.");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <HeroSection>
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8} className="text-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <FaTrophy className="mb-3" size={48} />
                <h1 className="display-5 mb-3">Quiz Tournaments</h1>
                <p className="lead">
                  Test your knowledge and compete with others in these exciting challenges
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </HeroSection>

      <Container className="my-5">
        {loading ? (
          <div className="text-center my-5">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
            </motion.div>
            <p className="mt-3 text-muted">Loading available quizzes...</p>
          </div>
        ) : error ? (
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="danger" className="text-center rounded-lg shadow-sm">
                  {error}
                </Alert>
              </motion.div>
            </Col>
          </Row>
        ) : quizzes.length === 0 ? (
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Alert variant="info" className="text-center rounded-lg shadow-sm">
                  <FaTrophy className="me-2" />
                  No active quizzes available at the moment. Check back later!
                </Alert>
              </motion.div>
            </Col>
          </Row>
        ) : (
          <AnimatePresence>
            <Row xs={1} sm={2} lg={3} className="g-4">
              {quizzes.map((quiz, index) => (
                <Col key={quiz.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <QuizCard>
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <Card.Title className="mb-0 text-primary">
                            <FaCrown className="me-2" />
                            {quiz.name}
                          </Card.Title>
                          <DifficultyBadge className={quiz.difficulty.toLowerCase()}>
                            {quiz.difficulty}
                          </DifficultyBadge>
                        </div>

                        <Card.Subtitle className="mb-3 text-muted">
                          {quiz.category}
                        </Card.Subtitle>

                        <div className="quiz-info mb-4">
                          <p className="d-flex align-items-center">
                            <FaUserTie className="me-2 text-secondary" />
                            <span><strong>Creator:</strong> {quiz.creator || 'Anonymous'}</span>
                          </p>
                          <p className="d-flex align-items-center">
                            <FaCalendarAlt className="me-2 text-secondary" />
                            <span><strong>Starts:</strong> {formatDate(quiz.startDate)}</span>
                          </p>
                          <p className="d-flex align-items-center">
                            <FaCalendarAlt className="me-2 text-secondary" />
                            <span><strong>Ends:</strong> {formatDate(quiz.endDate)}</span>
                          </p>
                        </div>

                        <div className="mt-auto">
                          <Link to={`/play/${quiz.id}`} className="text-decoration-none">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <PlayButton className="w-100">
                                <FaPlay className="me-2" />
                                Start Challenge
                              </PlayButton>
                            </motion.div>
                          </Link>
                        </div>
                      </Card.Body>
                    </QuizCard>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </AnimatePresence>
        )}
      </Container>
    </motion.div>
  );
}