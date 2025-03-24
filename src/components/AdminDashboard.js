import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Table, Modal, Card, Spinner, Alert } from 'react-bootstrap';

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    difficulty: '',
    creator: ''
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = () => {
    setLoading(true);
    axios.get('http://localhost:8080/quiz/all')
      .then(res => {
        if (Array.isArray(res.data)) {
          setQuizzes(res.data);
        } else {
          setError("Unexpected response format");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch quizzes. Please make sure the backend is running.");
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending payload to backend:", formData);

    if (!formData.name || !formData.category || !formData.difficulty || !formData.creator) {
      alert('All fields are required');
      return;
    }

    axios.post('http://localhost:8080/quiz/generateQuestions',formData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        setFormData({ name: '', category: '', difficulty: '', creator: '' });
        fetchQuizzes();
      })
      .catch(err => {
        console.error("while creating the new quiz", err);
        setError("Failed to create quiz. Please check server logs.");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      axios.delete(`http://localhost:8080/quiz/${id}`)
        .then(() => fetchQuizzes())
        .catch(err => {
          console.error(err);
          setError("Failed to delete quiz.");
        });
    }
  };

  return (
    <Container fluid className="py-5 bg-light min-vh-100">
      <Row className="mb-4 text-center">
        <Col>
          <h1 className="display-4 text-primary fw-bold">🎓 Admin Dashboard</h1>
          <p className="lead text-muted">Create, View, and Manage Quiz Tournaments</p>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="text-center">{error}</Alert>}

      <Row className="mb-5 justify-content-center">
        <Col md={10}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h3 className="text-center text-primary mb-4">➕ Create Quiz Tournament</h3>
              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>👤 Creator</Form.Label>
                      <Form.Control
                        type="text"
                        name="creator"
                        value={formData.creator}
                        onChange={handleInputChange}
                        placeholder="Enter Creator Name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>📝 Quiz Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter Quiz Name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>📚 Category</Form.Label>
                      <Form.Control
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Enter Category"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>⚙️ Difficulty</Form.Label>
                      <Form.Control
                        type="text"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        placeholder="Enter Difficulty"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-center mt-4">
                  <Button type="submit" variant="primary" size="lg">Create Quiz</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h3 className="text-center text-success mb-4">📋 Quiz List</h3>
              {loading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Difficulty</th>
                      <th>Creator</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map(q => (
                      <tr key={q.id}>
                        <td>
                          <Button variant="link" onClick={() => { setSelectedQuiz(q); setShowDetails(true); }}>
                            {q.name}
                          </Button>
                        </td>
                        <td>{q.category}</td>
                        <td>{q.difficulty}</td>
                        <td>{q.creator || 'N/A'}</td>
                        <td>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(q.id)}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Quiz Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuiz?.questions && selectedQuiz.questions.length > 0 ? (
            selectedQuiz.questions.map((q, idx) => (
              <Card key={idx} className="mb-3">
                <Card.Body>
                  <h5>Q{idx + 1}: {q.questionText}</h5>
                  <ul>
                    <li>{q.option1}</li>
                    <li>{q.option2}</li>
                    <li>{q.option3}</li>
                  </ul>
                  <p className="text-success">✅ Correct: {q.correctAnswer}</p>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-muted text-center">No questions found for this quiz.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
