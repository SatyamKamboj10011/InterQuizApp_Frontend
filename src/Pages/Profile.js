// src/components/Profile.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge,
  Button,
  ListGroup,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendarAlt,
  FaClock,
  FaChartBar,
  FaTrophy,
  FaEdit,
  FaTasks,
  FaStar,
  FaMapMarkerAlt,
  FaBirthdayCake,
} from "react-icons/fa";
import styled, { keyframes } from "styled-components";

// === Animations ===
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// === Styled Components ===
const ProfileContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 3rem 0;
`;

const ProfileCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  border: none;
`;

const AvatarContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 5px;
  margin: 0 auto 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid white;
  color: #667eea;
  font-size: 60px;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
`;

const SectionTitle = styled.h5`
  color: #4a4a4a;
  font-weight: 600;
  margin-bottom: 1.2rem;
  position: relative;
  padding-bottom: 0.5rem;
  font-size: 1.1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #667eea, #764ba2);
    border-radius: 3px;
  }

  svg {
    color: #667eea;
    margin-right: 0.5rem;
  }
`;

const StatCard = styled(Card)`
  border: none;
  border-radius: 12px;
  text-align: center;
  padding: 1.5rem 0.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  h6 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0.5rem 0;
    color: #4a4a4a;
  }

  p {
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

const EditButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
`;

const ListItem = styled(ListGroup.Item)`
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
  display: flex;
  align-items: center;

  strong {
    font-weight: 600;
    color: #4a4a4a;
    min-width: 100px;
    display: inline-block;
  }

  svg {
    margin-right: 0.8rem;
    color: #667eea;
  }
`;

const LikedQuizBadge = styled(Badge)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 500;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  animation: ${pulse} 2s infinite;
`;

const ProfileSidebar = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingSpinner = styled(Spinner)`
  width: 3rem;
  height: 3rem;
  margin: 2rem auto;
  display: block;
  color: #667eea;
`;

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `http://localhost:8080/user/${username}`;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data && res.data.id) {
          setProfile(res.data);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <ProfileContainer className="d-flex justify-content-center align-items-center">
        <div className="text-center">
          <LoadingSpinner animation="border" />
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="danger" className="text-center rounded-lg">
              {error}
            </Alert>
          </Col>
        </Row>
      </ProfileContainer>
    );
  }

  const {
    id,
    username: name,
    email,
    role,
    profile_picture,
    age,
    address,
    joinDate,
    lastLogin,
    quizzesTaken,
    avgScore,
    likedQuizId = [],
  } = profile;

  return (
    <ProfileContainer>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <ProfileCard className="mb-4">
            <Row>
              <Col md={4}>
                <ProfileSidebar>
                  <AvatarContainer>
                    {profile_picture ? (
                      <AvatarImage src={profile_picture} alt={name} />
                    ) : (
                      <DefaultAvatar><FaUser /></DefaultAvatar>
                    )}
                  </AvatarContainer>
                  <h3 className="mb-2">{name}</h3>
                  <Badge
                    bg={role === "ADMIN" ? "danger" : "primary"}
                    className="mb-3 px-3 py-2"
                  >
                    <FaUserTag className="me-2" />
                    {role.toUpperCase()}
                  </Badge>
                  <p className="text-muted small">User ID: {id}</p>

                  {/* ✅ Edit Profile Button for All Roles */}
                  <EditButton onClick={() => navigate(`/edit-profile/${id}`)}>
                    <FaEdit className="me-2" />
                    Edit Profile
                  </EditButton>
                </ProfileSidebar>
              </Col>
              <Col md={8} className="p-4">
                <SectionTitle><FaEnvelope /> Contact Info</SectionTitle>
                <ListGroup variant="flush">
                  <ListItem><FaEnvelope /><strong>Email:</strong> {email}</ListItem>
                  <ListItem><FaBirthdayCake /><strong>Age:</strong> {age || "N/A"}</ListItem>
                  <ListItem><FaMapMarkerAlt /><strong>Address:</strong> {address || "N/A"}</ListItem>
                  <ListItem><FaCalendarAlt /><strong>Joined:</strong> {joinDate}</ListItem>
                  <ListItem><FaClock /><strong>Last Login:</strong> {lastLogin}</ListItem>
                </ListGroup>

                <SectionTitle className="mt-4"><FaChartBar /> Stats</SectionTitle>
                <Row>
                  <Col md={6}>
                    <StatCard>
                      <FaTasks size={30} className="text-success" />
                      <h6>{quizzesTaken || 0}</h6>
                      <p>Quizzes Taken</p>
                    </StatCard>
                  </Col>
                  <Col md={6}>
                    <StatCard>
                      <FaTrophy size={30} className="text-warning" />
                      <h6>{avgScore || 0}%</h6>
                      <p>Average Score</p>
                    </StatCard>
                  </Col>
                </Row>

                <SectionTitle className="mt-4"><FaStar /> Liked Quizzes</SectionTitle>
                <div className="d-flex flex-wrap">
                  {likedQuizId.length > 0 ? (
                    likedQuizId.map((quizId, index) => (
                      <LikedQuizBadge key={index}>Quiz #{quizId}</LikedQuizBadge>
                    ))
                  ) : (
                    <p className="text-muted">No liked quizzes yet.</p>
                  )}
                </div>
              </Col>
            </Row>
          </ProfileCard>
        </Col>
      </Row>
    </ProfileContainer>
  );
};

export default Profile;
