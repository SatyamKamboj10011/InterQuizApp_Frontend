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
  ProgressBar,
} from "react-bootstrap";
import axios from "axios";
import { FaEye, FaArrowLeft, FaTrophy, FaChartLine } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

// ===== Styled Components =====
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
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background: ${(props) => {
    const percentage = (props.score / props.total) * 100;
    if (percentage >= 80) return "linear-gradient(135deg, #4caf50, #81c784)";
    if (percentage >= 60) return "linear-gradient(135deg, #ffeb3b, #ffc107)";
    return "linear-gradient(135deg, #f44336, #e57373)";
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
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  text-align: center;
  margin-top: 1rem;
`;

const ScoreHistory = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== Fetch Scores on Page Load =====
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

  const formatDate = (input) => {
    if (!input) return "Date Not Available";
  
    // Handle LocalDateTime array format [year, month, day, hour, minute]
    if (Array.isArray(input) && input.length >= 3) {
      try {
        // month - 1 because JS months are 0-indexed
        const [year, month, day, hour = 0, minute = 0] = input;
        const date = new Date(year, month - 1, day, hour, minute);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {
        console.error("Error parsing LocalDateTime array:", e);
        return "Invalid Date";
      }
    }
  
    // Handle ISO string format
    const parsed = new Date(input);
    return isNaN(parsed.getTime()) ? "Invalid Date" : parsed.toLocaleString();
  };
  
  
  

  // ===== View Score Details =====
  const viewScoreDetails = (scoreId) => {
    navigate(`/score-details/${playerId}/${scoreId}`);
  };

  // ===== Loading State =====
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Spinner animation="border" variant="primary" role="status" />
          <p className="mt-3 text-muted">Loading your score history...</p>
        </motion.div>
      </Container>
    );
  }

  // ===== Error State =====
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

  // ===== No Score Available =====
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

  // ===== Main Content =====
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* ===== Header Section ===== */}
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
              <p className="lead mb-0">Track your progress and see your scores</p>
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

      {/* ===== Score Cards Section ===== */}
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
                      {/* ===== Quiz Name ===== */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="text-dark mb-0">
                          {score?.quiz?.name}
                        </h5>
                        {/* ===== Score Badge ===== */}
                        <ScoreBadge
                          score={score.score}
                          total={score.totalQuestions}
                          className="ms-2"
                        >
                          {score.score}/{score.totalQuestions}
                        </ScoreBadge>
                      </div>

                      {/* ===== Progress Bar ===== */}
                      <ProgressBar
                        now={(score.score / score.totalQuestions) * 100}
                        label={`${Math.round(
                          (score.score / score.totalQuestions) * 100
                        )}%`}
                        variant={
                          (score.score / score.totalQuestions) * 100 >= 80
                            ? "success"
                            : (score.score / score.totalQuestions) * 100 >= 60
                            ? "warning"
                            : "danger"
                        }
                        className="mb-3"
                      />

                      {/* ===== Completed Date ===== */}
                      <p className="text-muted small mb-3">
  <strong>Completed:</strong>{" "}
  {score.completedDate
    ? formatDate(score.completedDate)
    : "Date Not Available"}
</p>



                      {/* ===== Score Display ===== */}
                      <ScoreDisplay>
                        {score.score}/{score.totalQuestions}
                      </ScoreDisplay>

                      {/* ===== View Details Button ===== */}
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
