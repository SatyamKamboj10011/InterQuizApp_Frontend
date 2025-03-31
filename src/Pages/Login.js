import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/user/login', formData);
      const user = res.data;
      localStorage.setItem('userName', user.username);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/player');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay" />
      
      <Container className="login-container">
        <motion.div 
          className="login-illustration"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="https://img.freepik.com/free-vector/computer-login-concept-illustration_114360-23872.jpg?ga=GA1.1.1660175624.1730518241&semt=ais_hybrid" 
            alt="Quiz Illustration" 
            className="illustration-image"
          />
        </motion.div>

        <motion.div 
          className="login-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="login-card">
            <div className="login-header">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FaUserCircle size={50} className="text-primary mb-3" />
              </motion.div>
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Please sign in to continue</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="danger">{error}</Alert>
              </motion.div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label>Email Address</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaEnvelope />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaLock />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Form.Group>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit"
                  className="login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>

              <div className="register-link">
                Don't have an account?{' '}
                <motion.a 
                  href="/registration"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create one now
                </motion.a>
              </div>
            </Form>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default Login;
