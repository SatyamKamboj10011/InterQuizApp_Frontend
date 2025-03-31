// src/components/ScoreDetails.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Table,
  Button,
  Badge,
  ProgressBar,
  Row,
  Col
} from "react-bootstrap";
import axios from "axios";
import { FaArrowLeft, FaCheck, FaTimes, FaChartBar, FaListAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

// Styled components
const StyledCard = styled(Card)`
  border-radius: 15px;
  overflow: hidden;
  border: none;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 20px 20px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled(Table)`
  border-radius: 10px;
  overflow: hidden;
  
  thead {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  tbody tr {
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
  
  .correct-row {
    background-color: rgba(102, 187, 106, 0.1);
  }
  
  .incorrect-row {
    background-color: rgba(239, 83, 80, 0.1);
  }
`;

const ScoreBadge = styled(Badge)`
  font-size: 1.1rem;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ScoreDetails = () => {
  const { playerId, scoreId } = useParams();
  const navigate = useNavigate();
  const [scoreDetails, setScoreDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScoreDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/score/details/${playerId}/${scoreId}`
        );

        console.log("API Response:", response.data);

        if (response.data) {
          setScoreDetails(response.data);
        } else {
          setError("No score details found for this quiz.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching score details:", error);
        setError("Failed to load score details. Please try again later.");
        setLoading(false);
      }
    };

    fetchScoreDetails();
  }, [playerId, scoreId]);

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
          <p className="mt-3 text-muted">Loading your detailed results...</p>
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
            <FaChartBar className="me-2" />
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

  if (!scoreDetails) {
    return (
      <Container className="text-center mt-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="info" className="rounded-lg shadow-sm">
            <FaListAlt className="me-2" />
            No score details available for this quiz attempt.
          </Alert>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate(`/score-history/${playerId}`)}
          >
            <FaArrowLeft className="me-2" />
            Back to Score History
          </Button>
        </motion.div>
      </Container>
    );
  }

  const percentage = Math.round((scoreDetails.score / scoreDetails.totalQuestions) * 100);

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
                <FaChartBar className="me-3" />
                Quiz Results Details
              </motion.h2>
              <p className="lead mb-0">
                Review your answers and performance
              </p>
            </Col>
            <Col className="text-end">
              <Button
                variant="light"
                onClick={() => navigate(`/score-history/${playerId}`)}
                className="rounded-pill px-4"
              >
                <FaArrowLeft className="me-2" />
                Back to History
              </Button>
            </Col>
          </Row>
        </Container>
      </HeaderSection>

      <Container className="my-5">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard className="mb-5">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={6}>
                    <h3 className="text-primary mb-3">
                      {scoreDetails.quiz.quizName}
                    </h3>
                    <p className="text-muted">
                      <strong>Completed:</strong>{" "}
                      {new Date(scoreDetails.completedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </Col>
                  <Col md={6} className="text-md-end">
                    <ScoreBadge className="mb-3">
                      {scoreDetails.score}/{scoreDetails.totalQuestions}
                    </ScoreBadge>
                    <ProgressBar
                      now={percentage}
                      label={`${percentage}%`}
                      variant={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'danger'}
                      className="mb-2"
                      style={{ height: '10px' }}
                    />
                    <small className="text-muted">
                      {scoreDetails.score} correct out of {scoreDetails.totalQuestions} questions
                    </small>
                  </Col>
                </Row>
              </Card.Body>
            </StyledCard>

            <h4 className="mb-4 d-flex align-items-center">
              <FaListAlt className="me-3 text-primary" />
              Answer Breakdown
            </h4>

            <StyledTable responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Your Answer</th>
                  <th>Correct Answer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scoreDetails.answerHistory.map((answer, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={answer.isCorrect ? 'correct-row' : 'incorrect-row'}
                  >
                    <td>{index + 1}</td>
                    <td>{answer.question}</td>
                    <td>
                      {answer.isCorrect ? (
                        <span className="text-success">{answer.selectedAnswer}</span>
                      ) : (
                        <span className="text-danger">{answer.selectedAnswer}</span>
                      )}
                    </td>
                    <td className="text-success font-weight-bold">{answer.correctAnswer}</td>
                    <td>
                      {answer.isCorrect ? (
                        <FaCheck className="text-success" size={20} />
                      ) : (
                        <FaTimes className="text-danger" size={20} />
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </StyledTable>

            <div className="text-center mt-5">
              <Button
                variant="primary"
                onClick={() => navigate(`/score-history/${playerId}`)}
                className="rounded-pill px-4"
                size="lg"
              >
                <FaArrowLeft className="me-2" />
                Return to Score History
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </motion.div>
  );
};

export default ScoreDetails;