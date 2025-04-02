import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  FloatingLabel,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaCamera,
  FaBirthdayCake,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./Register.css"; // Create/Register custom styles

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    profile_picture: "",
    age: "",
    address: "",
    role: "PLAYER",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/user/registration",
        formData
      );
      setSuccess("🎉 Registration successful! Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "❌ Registration failed. Please try again."
      );
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="register-page"
      style={{
        background: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "2rem 0",
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="shadow-lg border-0 overflow-hidden"
            style={{
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Row className="g-0">
              {/* Left Side - Illustration & Features */}
              <Col
                md={6}
                className="d-none d-md-flex justify-content-center align-items-center"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  padding: "3rem",
                  flexDirection: "column",
                  color: "white",
                }}
              >
                <motion.img
                  src="https://cdn.dribbble.com/users/1895247/screenshots/10161699/media/bf71ddaa9f3e693e88a0f78e28d4f7c8.png?resize=800x600&vertical=center"
                  alt="Join Us"
                  className="img-fluid mb-4"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: "100%", maxWidth: "400px" }}
                />
                <h2 className="fw-bold text-white mb-3">
                  Welcome to <span className="text-warning">QuizMaster!</span>
                </h2>
                <p className="text-light text-center">
                  Join us and explore a variety of exciting quizzes. Track your
                  progress, challenge friends, and climb the leaderboard!
                </p>
              </Col>

              {/* Right Side - Registration Form */}
              <Col md={6}>
                <Card.Body className="p-5">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="text-center mb-4">
                      <h3 className="fw-bold text-gradient-primary">
                        🎯 Create Your Account
                      </h3>
                      <p className="text-muted">Sign up and start your quiz journey</p>
                    </div>

                    {/* Alerts */}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Alert variant="success" className="text-center">
                          {success}
                        </Alert>
                      </motion.div>
                    )}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Alert variant="danger" className="text-center">
                          {error}
                        </Alert>
                      </motion.div>
                    )}

                    {/* Registration Form */}
                    <Form onSubmit={handleSubmit}>
                      <Row className="g-3">
                        <Col md={6}>
                          <FloatingLabel
                            controlId="username"
                            label={<><FaUser className="me-2" /> Username</>}
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              required
                              className="input-field"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
                          <FloatingLabel
                            controlId="email"
                            label={<><FaEnvelope className="me-2" /> Email</>}
                            className="mb-3"
                          >
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="input-field"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
                          <FloatingLabel
                            controlId="first_name"
                            label="First Name"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleChange}
                              required
                              className="input-field"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
                          <FloatingLabel
                            controlId="last_name"
                            label="Last Name"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleChange}
                              required
                              className="input-field"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
                          <FloatingLabel
                            controlId="password"
                            label={<><FaLock className="me-2" /> Password</>}
                            className="mb-3"
                          >
                            <Form.Control
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              className="input-field"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={6}>
                          <FloatingLabel
                            controlId="age"
                            label={<><FaBirthdayCake className="me-2" /> Age</>}
                            className="mb-3"
                          >
                            <Form.Control
                              type="number"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              required
                              className="input-field"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={12}>
                          <FloatingLabel
                            controlId="address"
                            label={<><FaMapMarkerAlt className="me-2" /> Address</>}
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                              className="input-field"
                            />
                          </FloatingLabel>
                        </Col>

                        <Col md={12}>
                          <FloatingLabel
                            controlId="profile_picture"
                            label={<><FaCamera className="me-2" /> Profile Picture URL</>}
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              name="profile_picture"
                              value={formData.profile_picture}
                              onChange={handleChange}
                              className="input-field"
                            />
                          </FloatingLabel>
                        </Col>
                      </Row>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4"
                      >
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-100 py-3 fw-bold shadow-sm"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Processing...
                            </>
                          ) : (
                            "🚀 Create Account"
                          )}
                        </Button>
                      </motion.div>

                      <div className="text-center mt-4">
                        <p className="text-muted">
                          Already a QuizMaster?{" "}
                          <a href="/" className="text-primary fw-bold">
                            Sign In
                          </a>
                        </p>
                      </div>
                    </Form>
                  </motion.div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default Register;
