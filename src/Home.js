import React from "react";
import { Container, Row, Col, Button, Card, Navbar, Nav } from "react-bootstrap";
import { FaUserPlus, FaEdit, FaTrashAlt, FaUsers, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Attendant Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/manage">Manage Attendants</Nav.Link>
              <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Container fluid className="bg-primary text-white text-center py-5">
        <h1>Welcome to Attendant Management System</h1>
        <p className="lead">Effortlessly manage attendants with ease.</p>
        <Button variant="light" size="lg" as={Link} to="/manage" className="fw-bold">Get Started</Button>
      </Container>

      {/* Features Section */}
      <Container className="mt-5">
        <h2 className="text-center mb-4">Key Features</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="shadow text-center p-4">
              <FaUserPlus size={50} className="text-success mx-auto mb-3" />
              <Card.Title>Add Attendants</Card.Title>
              <Card.Text>Quickly register new attendants into the system.</Card.Text>
              <Button variant="success" as={Link} to="/manage">Add Now</Button>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="shadow text-center p-4">
              <FaEdit size={50} className="text-warning mx-auto mb-3" />
              <Card.Title>Edit & Update</Card.Title>
              <Card.Text>Modify attendant details anytime.</Card.Text>
              <Button variant="warning" as={Link} to="/manage">Edit Now</Button>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="shadow text-center p-4">
              <FaTrashAlt size={50} className="text-danger mx-auto mb-3" />
              <Card.Title>Delete Attendants</Card.Title>
              <Card.Text>Remove attendants securely.</Card.Text>
              <Button variant="danger" as={Link} to="/manage">Delete Now</Button>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="shadow text-center p-4">
              <FaUsers size={50} className="text-info mx-auto mb-3" />
              <Card.Title>View All Attendants</Card.Title>
              <Card.Text>Browse all registered attendants.</Card.Text>
              <Button variant="info" as={Link} to="/manage">View Now</Button>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="shadow text-center p-4">
              <FaChartBar size={50} className="text-primary mx-auto mb-3" />
              <Card.Title>Reports & Analytics</Card.Title>
              <Card.Text>Analyze and track performance.</Card.Text>
              <Button variant="primary" as={Link} to="/reports">View Reports</Button>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <Container fluid className="bg-dark text-white text-center py-3 mt-5">
        <p>&copy; {new Date().getFullYear()} Attendant Management System</p>
      </Container>
    </>
  );
}

export default HomePage;