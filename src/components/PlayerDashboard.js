import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';

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

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4 text-primary fw-bold">🎮 Player Dashboard</h1>
      <p className="text-center text-muted mb-5">Explore and play available quiz tournaments!</p>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : quizzes.length === 0 ? (
        <Alert variant="info" className="text-center">No active quizzes found.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} className="g-4">
          {quizzes.map((quiz) => (
            <Col key={quiz.id}>
              <Card className="h-100 shadow-lg border-0">
                <Card.Body>
                  <Card.Title className="text-primary">{quiz.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{quiz.category} | {quiz.difficulty}</Card.Subtitle>
                  <Card.Text>
                    <strong>Creator:</strong> {quiz.creator || 'N/A'}<br />
                    <strong>Start Date:</strong> {quiz.startDate || 'Not set'}<br />
                    <strong>End Date:</strong> {quiz.endDate || 'Not set'}
                  </Card.Text>
                  <Link to={`/play/${quiz.id}`}>
                    <Button variant="success" className="w-100">▶️ Play Quiz</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
