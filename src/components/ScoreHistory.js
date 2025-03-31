// src/components/ScoreHistory.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Button,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import { FaEye, FaArrowLeft, FaTrophy, FaChartLine } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

// Styled components for custom styling
const StyledCard = styled(Card)`
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ScoreBadge = styled(Badge)`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background: ${props => {
    const percentage = (props.score / props.total) * 100;
    if (percentage >= 80) return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    if (percentage >= 60) return 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
    return 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)';
  }};
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 20px 20px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ScoreDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  text-align: center;
  margin: 1rem 0;
`;

const ScoreHistory = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/score/player/${playerId}`
        );

        console.log("API Response:", response.data);

        const data = Array.isArray(response.data) ? response.data : [];
        setScores(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching scores:", error);
        setError("Failed to load score history. Please try again later.");
        setLoading(false);
      }
    };

    fetchScores();
  }, [playerId]);

  const viewScoreDetails = (scoreId) => {
    navigate(`/score-details/${playerId}/${scoreId}`);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading your score history...</p>
        </motion.div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="danger" className="rounded-lg shadow-sm">
            <FaChartLine className="me-2" />
            {error}
          </Alert>
          <Button
            variant="outline-primary"
            className="mt-3"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </motion.div>
      </Container>
    );
  }

  if (!Array.isArray(scores) || scores.length === 0) {
    return (
      <Container className="text-center mt-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="info" className="rounded-lg shadow-sm">
            <FaTrophy className="me-2" />
            No score history available yet. Complete some quizzes to see your progress!
          </Alert>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate("/player")}
          >
            <FaArrowLeft className="me-2" />
            Back to Dashboard
          </Button>
        </motion.div>
      </Container>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <HeaderSection>
        <Container>
          <Row className="align-items-center">
            <Col>
              <motion.h2 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-3"
              >
                <FaChartLine className="me-3" />
                Your Performance History
              </motion.h2>
              <p className="lead mb-0">
                Track your progress and see your scores
              </p>
            </Col>
            <Col className="text-end">
              <Button
                variant="light"
                onClick={() => navigate("/player")}
                className="rounded-pill px-4"
              >
                <FaArrowLeft className="me-2" />
                Back to Dashboard
              </Button>
            </Col>
          </Row>
        </Container>
      </HeaderSection>

      <Container className="my-5">
        <AnimatePresence>
          <Row>
            {scores.map((score, index) => (
              <Col md={6} lg={4} key={score.id} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  className="h-100"
                >
                  <StyledCard className="h-100">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="text-dark mb-0">{score.quiz.quizName}</h5>
                        <ScoreBadge 
                          score={score.score} 
                          total={score.totalQuestions}
                          className="ms-2"
                        >
                          {score.score}/{score.totalQuestions}
                        </ScoreBadge>
                      </div>
                      
                      <div className="progress mb-3" style={{ height: '8px' }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ 
                            width: `${(score.score / score.totalQuestions) * 100}%` 
                          }}
                          aria-valuenow={score.score}
                          aria-valuemin="0"
                          aria-valuemax={score.totalQuestions}
                        ></div>
                      </div>
                      
                      <p className="text-muted small mb-3">
                        <strong>Completed:</strong>{" "}
                        {new Date(score.completedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      
                      <ScoreDisplay>
                        {score.score}/{score.totalQuestions}
                      </ScoreDisplay>
                      
                      <Button
                        variant="primary"
                        onClick={() => viewScoreDetails(score.id)}
                        className="mt-auto rounded-pill"
                        size="sm"
                      >
                        <FaEye className="me-2" />
                        View Detailed Results
                      </Button>
                    </Card.Body>
                  </StyledCard>
                </motion.div>
              </Col>
            ))}
          </Row>
        </AnimatePresence>
      </Container>
    </motion.div>
  );
};

export default ScoreHistory;