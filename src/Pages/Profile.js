import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { username } = useParams(); // Get the username from URL params
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // API URL for fetching the user profile
  const API_URL = `http://localhost:8080/user/${username}`;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(API_URL);

        // Check if the response has data
        if (res.data && res.data.id) {
          setProfile(res.data);
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="profile-loading text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="profile-container">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="profile-container">
        <Alert variant="info">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="profile-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <FaUserCircle size={80} className="text-primary mb-3" />
              <h2 className="text-primary">{profile.username}</h2>
              <p className="text-muted">{profile.email}</p>
              <hr />
              <Row>
                <Col>
                  <h5 className="text-success">Role</h5>
                  <p>{profile.role}</p>
                </Col>
                <Col>
                  <h5 className="text-warning">User ID</h5>
                  <p>{profile.id}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
