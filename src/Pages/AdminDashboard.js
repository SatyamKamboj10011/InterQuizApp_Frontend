import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
  Spinner,
  Alert,
  Card,
  Badge,
} from "react-bootstrap";
import {
  FaTrash,
  FaPlus,
  FaEye,
  FaCheck,
  FaEdit,
  FaUserCog,
  FaCalendarAlt,
  FaChartLine,
  FaLayerGroup,
  FaUsers,
  FaQuestionCircle,
  FaChartPie,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// ========= API BASE URL ==========
const API_URL = "http://localhost:8080";
const TRIVIA_API = "https://opentdb.com/api_category.php";

// ========= ILLUSTRATIONS =========
const ILLUSTRATIONS = {
  admin: "https://cdn-icons-png.flaticon.com/512/2206/2206368.png",
  noQuizzes: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png",
  noUsers: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
  noQuestions: "https://cdn-icons-png.flaticon.com/512/4076/4076472.png",
  stats: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
  success: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  error: "https://cdn-icons-png.flaticon.com/512/564/564619.png"
};

// ========= STYLED COMPONENTS =========
const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  padding-bottom: 3rem;
`;

const GradientCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  background: white;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
  }
`;

const StatCard = styled(GradientCard)`
  border-left: 5px solid ${props => 
    props.variant === 'primary' ? '#4e73df' : 
    props.variant === 'success' ? '#1cc88a' : 
    '#36b9cc'};
`;

const HeaderCard = styled(GradientCard)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
`;

const StyledTable = styled(Table)`
  border-radius: 15px;
  overflow: hidden;
  
  thead {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    th {
      border-bottom: 2px solid #dee2e6;
      font-weight: 600;
      color: #495057;
    }
  }
  
  tbody tr {
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(0, 123, 255, 0.05) !important;
    }
  }
`;

const ActionButton = styled(Button)`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% !important;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const AdminDashboard = () => {
  // ========== STATE MANAGEMENT ==========
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // Quiz Modal States
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    name: "",
    category: "",
    difficulty: "Easy",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  // User Modal States
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ========== DATA FETCHING ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, userRes, categoryRes] = await Promise.all([
          axios.get(`${API_URL}/quiz/all`),
          axios.get(`${API_URL}/user/all`),
          axios.get(TRIVIA_API),
        ]);

        setQuizzes(quizRes?.data || []);
        setUsers(userRes?.data || []);
        setCategories(categoryRes?.data?.trivia_categories || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ========== QUIZ FUNCTIONS ==========
  const createQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/quiz/generateQuestions`, newQuiz);
      setSuccess("Quiz created successfully!");
      setShowQuizModal(false);
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
    }
  };

  const deleteQuiz = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await axios.delete(`${API_URL}/quiz/${id}`);
        setQuizzes(quizzes?.filter((q) => q.id !== id) || []);
        setSuccess("Quiz deleted successfully!");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete quiz");
      }
    }
  };

  const handleViewQuestions = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/quiz/${id}`);
      setQuizQuestions(response.data.questions || []);
      setShowQuestionsModal(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuizQuestions([]);
    }
  };

  // ========== USER FUNCTIONS ==========
  const updateUser = async () => {
    try {
      await axios.put(`${API_URL}/user/${editingUser?.id}`, editingUser);
      setSuccess("User updated successfully!");
      setShowUserModal(false);
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/user/${id}`);
        setUsers(users?.filter((u) => u.id !== id) || []);
        setSuccess("User deleted successfully!");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  // ========== REFRESH DATA ==========
  const refreshData = async () => {
    try {
      const quizRes = await axios.get(`${API_URL}/quiz/all`);
      setQuizzes(quizRes?.data || []);

      const userRes = await axios.get(`${API_URL}/user/all`);
      setUsers(userRes?.data || []);
    } catch (err) {
      setError("Failed to refresh data");
    }
  };

  // ========== UI COMPONENTS ==========
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
          </motion.div>
          <h4 className="text-primary">Loading Dashboard...</h4>
          <LazyLoadImage
            src={ILLUSTRATIONS.stats}
            alt="Loading"
            effect="blur"
            width="150"
            className="mt-4"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <DashboardContainer>
      {/* Main Content */}
      <Container className="py-5">
        {/* ===== HEADER ===== */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <HeaderCard className="p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h1 className="display-5 fw-bold mb-3">
                  <FaUserCog className="me-3" /> Admin Dashboard
                </h1>
                <p className="lead mb-0 opacity-75">
                  Manage quizzes, users, and analytics with ease
                </p>
              </Col>
              <Col md={4} className="text-md-end">
                <LazyLoadImage
                  src={ILLUSTRATIONS.admin}
                  alt="Admin"
                  effect="blur"
                  width="120"
                  className="img-fluid"
                />
              </Col>
            </Row>
          </HeaderCard>
        </motion.div>

        {/* ===== ALERTS ===== */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <Alert 
                variant="danger" 
                onClose={() => setError(null)} 
                dismissible
                className="rounded-pill shadow-sm"
              >
                <div className="d-flex align-items-center">
                  <LazyLoadImage
                    src={ILLUSTRATIONS.error}
                    alt="Error"
                    effect="blur"
                    width="24"
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    {error}
                  </div>
                </div>
              </Alert>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <Alert 
                variant="success" 
                onClose={() => setSuccess("")} 
                dismissible
                className="rounded-pill shadow-sm"
              >
                <div className="d-flex align-items-center">
                  <LazyLoadImage
                    src={ILLUSTRATIONS.success}
                    alt="Success"
                    effect="blur"
                    width="24"
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    {success}
                  </div>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== STATS CARDS ===== */}
        <Row className="mb-5 g-4">
          <Col md={4}>
            <motion.div 
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StatCard variant="primary" className="h-100">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                      <FaChartPie className="text-primary fs-3" />
                    </div>
                    <div>
                      <h3 className="mb-0 text-primary">{quizzes?.length || 0}</h3>
                      <small className="text-muted">Total Quizzes</small>
                    </div>
                  </div>
                </Card.Body>
              </StatCard>
            </motion.div>
          </Col>
          <Col md={4}>
            <motion.div 
              whileHover={{ y: -5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <StatCard variant="success" className="h-100">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                      <FaUsers className="text-success fs-3" />
                    </div>
                    <div>
                      <h3 className="mb-0 text-success">{users?.length || 0}</h3>
                      <small className="text-muted">Total Users</small>
                    </div>
                  </div>
                </Card.Body>
              </StatCard>
            </motion.div>
          </Col>
          <Col md={4}>
            <motion.div 
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StatCard variant="info" className="h-100">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                      <FaLayerGroup className="text-info fs-3" />
                    </div>
                    <div>
                      <h3 className="mb-0 text-info">{categories?.length || 0}</h3>
                      <small className="text-muted">Quiz Categories</small>
                    </div>
                  </div>
                </Card.Body>
              </StatCard>
            </motion.div>
          </Col>
        </Row>

        {/* ===== QUIZ MANAGEMENT ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <GradientCard>
            <Card.Header className="bg-white border-bottom-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-primary">
                  <FaLayerGroup className="me-2" /> Quiz Management
                </h5>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => setShowQuizModal(true)}
                  className="rounded-pill px-3 d-flex align-items-center"
                >
                  <FaPlus className="me-1" /> New Quiz
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {quizzes?.length > 0 ? (
                <div className="table-responsive">
                  <StyledTable hover className="mb-0">
                    <thead>
                      <tr>
                        <th className="ps-4">ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Difficulty</th>
                        <th className="text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.map((quiz) => (
                        <motion.tr 
                          key={quiz.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: 'rgba(0, 123, 255, 0.05)' }}
                        >
                          <td className="ps-4">{quiz.id}</td>
                          <td>
                            <strong>{quiz.name}</strong>
                          </td>
                          <td>{quiz.category}</td>
                          <td>
                            <Badge
                              pill
                              className="px-3 py-2"
                              bg={
                                quiz.difficulty === "Easy"
                                  ? "success"
                                  : quiz.difficulty === "Medium"
                                  ? "warning"
                                  : "danger"
                              }
                            >
                              {quiz.difficulty}
                            </Badge>
                          </td>
                          <td className="text-end pe-4">
                            <ActionButton
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewQuestions(quiz.id)}
                              className="me-2"
                            >
                              <FaEye />
                            </ActionButton>
                            <ActionButton
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteQuiz(quiz.id)}
                            >
                              <FaTrash />
                            </ActionButton>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </StyledTable>
                </div>
              ) : (
                <div className="p-5 text-center">
                  <LazyLoadImage
                    src={ILLUSTRATIONS.noQuizzes}
                    alt="No quizzes"
                    effect="blur"
                    width="150"
                    className="mb-4"
                  />
                  <h5 className="text-muted mb-3">No quizzes available yet</h5>
                  <p className="text-muted mb-4">Create your first quiz to get started</p>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => setShowQuizModal(true)}
                    className="rounded-pill px-4 d-flex align-items-center mx-auto"
                  >
                    <FaPlus className="me-1" /> Create Quiz
                  </Button>
                </div>
              )}
            </Card.Body>
          </GradientCard>
        </motion.div>

        {/* ===== USER MANAGEMENT ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5"
        >
          <GradientCard>
            <Card.Header className="bg-white border-bottom-0 py-3">
              <h5 className="mb-0 fw-bold text-success">
                <FaUserCog className="me-2" /> User Management
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {users?.length > 0 ? (
                <div className="table-responsive">
                  <StyledTable hover className="mb-0">
                    <thead>
                      <tr>
                        <th className="ps-4">ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th className="text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <motion.tr 
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: 'rgba(40, 167, 69, 0.05)' }}
                        >
                          <td className="ps-4">{user.id}</td>
                          <td>
                            <strong>{user.username}</strong>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <Badge 
                              pill 
                              className="px-3 py-2"
                              bg={user.role === "ADMIN" ? "dark" : "primary"}
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="text-end pe-4">
                            <ActionButton
                              variant="outline-success"
                              size="sm"
                              className="me-2"
                              onClick={() => {
                                setEditingUser(user);
                                setShowUserModal(true);
                              }}
                            >
                              <FaEdit />
                            </ActionButton>
                            <ActionButton
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                            >
                              <FaTrash />
                            </ActionButton>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </StyledTable>
                </div>
              ) : (
                <div className="p-5 text-center">
                  <LazyLoadImage
                    src={ILLUSTRATIONS.noUsers}
                    alt="No users"
                    effect="blur"
                    width="150"
                    className="mb-4"
                  />
                  <h5 className="text-muted mb-3">No users available</h5>
                  <p className="text-muted">Users will appear here once registered</p>
                </div>
              )}
            </Card.Body>
          </GradientCard>
        </motion.div>

        {/* ===== QUIZ CREATION MODAL ===== */}
        <Modal 
          show={showQuizModal} 
          onHide={() => setShowQuizModal(false)}
          centered
          backdrop="static"
          size="lg"
        >
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title className="d-flex align-items-center">
              <FaPlus className="me-2" /> Create New Quiz
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={createQuiz}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-muted d-flex align-items-center">
                      <FaLayerGroup className="me-2" /> Quiz Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={newQuiz.name}
                      onChange={(e) => setNewQuiz({ ...newQuiz, name: e.target.value })}
                      placeholder="Enter quiz name"
                      required
                      className="py-2 rounded-3"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-muted d-flex align-items-center">
                      <FaChartLine className="me-2" /> Difficulty
                    </Form.Label>
                    <Form.Select
                      value={newQuiz.difficulty}
                      onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
                      required
                      className="py-2 rounded-3"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-muted d-flex align-items-center">
                  <FaQuestionCircle className="me-2" /> Category
                </Form.Label>
                <Form.Select
                  value={newQuiz.category}
                  onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                  required
                  className="py-2 rounded-3"
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-muted d-flex align-items-center">
                      <FaCalendarAlt className="me-2" /> Start Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={newQuiz.startDate}
                      onChange={(e) => setNewQuiz({ ...newQuiz, startDate: e.target.value })}
                      required
                      className="py-2 rounded-3"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-muted d-flex align-items-center">
                      <FaCalendarAlt className="me-2" /> End Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={newQuiz.endDate}
                      onChange={(e) => setNewQuiz({ ...newQuiz, endDate: e.target.value })}
                      required
                      className="py-2 rounded-3"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-grid gap-2 mt-4">
                <Button 
                  variant="primary" 
                  type="submit"
                  className="rounded-pill py-2 fw-bold"
                >
                  Create Quiz
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* ===== VIEW QUESTIONS MODAL ===== */}
        <Modal 
          show={showQuestionsModal} 
          onHide={() => setShowQuestionsModal(false)} 
          size="lg"
          centered
        >
          <Modal.Header closeButton className="bg-info text-white">
            <Modal.Title className="d-flex align-items-center">
              <FaEye className="me-2" /> Quiz Questions
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {quizQuestions?.length === 0 ? (
              <div className="text-center py-5">
                <LazyLoadImage
                  src={ILLUSTRATIONS.noQuestions}
                  alt="No questions"
                  effect="blur"
                  width="150"
                  className="mb-4"
                />
                <h5 className="text-muted">No questions available for this quiz</h5>
              </div>
            ) : (
              quizQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="mb-4"
                >
                  <Card className="border-0 shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-start">
                        <Badge 
                          pill 
                          bg="primary" 
                          className="me-3 flex-shrink-0 d-flex align-items-center justify-content-center"
                          style={{ width: '36px', height: '36px' }}
                        >
                          {index + 1}
                        </Badge>
                        <div className="flex-grow-1">
                          <h5 className="text-primary mb-3">{question?.questionText || question.question}</h5>
                          <div className="row g-3">
                            {[question.option1, question.option2, question.option3, question.option4]
                              .filter(Boolean)
                              .map((option, i) => (
                                <Col md={6} key={i}>
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-3 rounded ${
                                      option === question.correctAnswer 
                                        ? "bg-success text-white" 
                                        : "bg-light"
                                    }`}
                                  >
                                    <div className="d-flex align-items-center">
                                      {option}
                                      {option === question.correctAnswer && (
                                        <FaCheck className="ms-2" />
                                      )}
                                    </div>
                                  </motion.div>
                                </Col>
                              ))}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))
            )}
          </Modal.Body>
        </Modal>

        {/* ===== USER EDIT MODAL ===== */}
        <Modal
          show={showUserModal}
          onHide={() => setShowUserModal(false)}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title className="d-flex align-items-center">
              <FaEdit className="me-2" /> Edit User
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingUser && (
              <Form>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted">Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingUser.username || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, username: e.target.value })
                    }
                    className="py-2 rounded-3"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted">Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={editingUser.email || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="py-2 rounded-3"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted">Role</Form.Label>
                  <Form.Select
                    value={editingUser.role || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                    className="py-2 rounded-3"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="PLAYER">Player</option>
                  </Form.Select>
                </Form.Group>
                <div className="d-grid gap-2 mt-4">
                  <Button
                    variant="success"
                    onClick={updateUser}
                    className="rounded-pill py-2 fw-bold"
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </DashboardContainer>
  );
};

export default AdminDashboard;