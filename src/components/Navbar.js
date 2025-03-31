import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('Navbar - User:', user); // Debug log

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/home" className="brand-logo">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="d-flex align-items-center"
          >
            <FaGraduationCap className="brand-icon" />
            <span className="brand-text">QuizMaster</span>
          </motion.div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/home" 
                  className={`nav-link ${isActive('/home') ? 'active' : ''}`}
                >
                  Home
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/player" 
                  className={`nav-link ${isActive('/player') ? 'active' : ''}`}
                >
                  Play Quiz
                </Nav.Link>
                {(user.role === 'admin' || user.role === 'ADMIN') && (
                  <Nav.Link 
                    as={Link} 
                    to="/admin" 
                    className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                  >
                    Create Quiz
                  </Nav.Link>
                )}
                <Nav.Link 
                  as={Link} 
                  to="/leaderboard" 
                  className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
                >
                  Leaderboard
                </Nav.Link>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
   <Nav.Link
  as={Link}
  to={`/score-history/${user?.id}`} // ✅ Updated to link to player's score history
  className={`nav-link ${
    isActive(`/score-history/${user?.id}`) ? "active" : ""
  }`}
>
  Score History
</Nav.Link>





                  <Nav.Link 
                    as={Link} 
                    to="/profile" 
                    className="profile-link"
                  >
                    <FaUserCircle className="profile-icon" />
                    Profile
                  </Nav.Link>
                </motion.div>
                <Button 
                  variant="link" 
                  className="logout-button"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="logout-icon" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/registration" 
                  className={`nav-link ${isActive('/registration') ? 'active' : ''}`}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 