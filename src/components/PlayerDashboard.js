import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Tabs,
  Tab,
  Button,
  Spinner,
  Alert,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaPlay,
  FaCalendarAlt,
  FaExclamationCircle,
  FaLock,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const DashboardContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 2rem 0;
`;

const QuizCard = styled(Card)`
  border-radius: 15px;
  border: none;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  }
`;

const QuizHeader = styled(Card.Header)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LikeButton = styled(Button)`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${(props) => (props.liked ? "#ffc107" : "#fff")};
  font-size: 1.5rem;

  &:hover {
    transform: scale(1.2);
    transition: all 0.2s ease;
  }
`;

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const [likedQuizzes, setLikedQuizzes] = useState({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:8080/quiz/all");
        if (Array.isArray(res.data)) {
          const allQuizzes = res.data.map((quiz) => ({
            ...quiz,
            startDate: quiz.startDate ? new Date(quiz.startDate) : null,
            endDate: quiz.endDate ? new Date(quiz.endDate) : null,
          }));
          setQuizzes(allQuizzes);
          filterQuizzes(allQuizzes);
          fetchLikedQuizzes();
        } else {
          throw new Error("Invalid quiz data");
        }
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filterQuizzes = (allQuizzes) => {
    const now = new Date();

    const active = allQuizzes.filter(
      (q) => q.startDate && q.endDate && q.startDate <= now && q.endDate >= now
    );

    const upcoming = allQuizzes.filter(
      (q) => q.startDate && q.startDate > now
    );

    const past = allQuizzes.filter(
      (q) => q.endDate && q.endDate < now
    );

    setActiveQuizzes(active);
    setUpcomingQuizzes(upcoming);
    setPastQuizzes(past);
  };

  const fetchLikedQuizzes = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`http://localhost:8080/user/${userId}/likes`);
      const likedIds = res.data || [];
      const map = {};
      likedIds.forEach((id) => (map[id] = true));
      setLikedQuizzes(map);
    } catch (err) {
      console.error("Failed to fetch likes:", err);
    }
  };

  const toggleLikeQuiz = async (quizId) => {
    try {
      const userId = localStorage.getItem("userId");
      const isLiked = likedQuizzes[quizId];
      const url = `http://localhost:8080/user/${userId}/likes/${quizId}`;
      if (isLiked) {
        await axios.delete(url);
      } else {
        await axios.post(url);
      }
      setLikedQuizzes((prev) => ({ ...prev, [quizId]: !isLiked }));
    } catch (err) {
      console.error("Toggle like failed:", err);
    }
  };

  const handlePlayQuiz = (quiz) => {
    const now = new Date();
    if (quiz.startDate && quiz.startDate > now) {
      alert("This quiz isn't available yet.");
      return;
    }
    navigate(`/play/${quiz.id}`);
  };

  const renderQuizList = (list, label) => {
    if (list.length === 0) {
      return (
        <Alert variant="info" className="text-center">
          <FaExclamationCircle className="me-2" />
          No {label} quizzes available.
        </Alert>
      );
    }

    return list.map((quiz) => (
      <QuizCard key={quiz.id}>
        <QuizHeader>
          <h5>{quiz.name}</h5>
          <LikeButton
            onClick={() => toggleLikeQuiz(quiz.id)}
            liked={likedQuizzes[quiz.id]}
          >
            {likedQuizzes[quiz.id] ? <FaStar /> : <FaRegStar />}
          </LikeButton>
        </QuizHeader>
        <Card.Body>
          <p className="text-muted mb-1">
            <FaCalendarAlt className="me-2" />
            Start: {quiz.startDate ? quiz.startDate.toLocaleString() : "N/A"}
          </p>
          <p className="text-muted mb-3">
            <FaCalendarAlt className="me-2" />
            End: {quiz.endDate ? quiz.endDate.toLocaleString() : "N/A"}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <Badge bg="info">{quiz.difficulty}</Badge>
            <Button
              variant="primary"
              className="rounded-pill"
              onClick={() => handlePlayQuiz(quiz)}
              disabled={quiz.startDate > new Date()}
            >
              <FaPlay className="me-2" />
              Play Now
            </Button>
          </div>
        </Card.Body>
      </QuizCard>
    ));
  };

  const likedQuizList = quizzes.filter((q) => likedQuizzes[q.id]);

  if (loading)
    return (
      <DashboardContainer className="text-center">
        <Spinner animation="border" />
        <p>Loading quizzes...</p>
      </DashboardContainer>
    );

  if (error)
    return (
      <DashboardContainer className="text-center">
        <Alert variant="danger">{error}</Alert>
      </DashboardContainer>
    );

  return (
    <DashboardContainer>
      <Tabs defaultActiveKey="active" className="mb-4" justify>
        <Tab eventKey="active" title="🏆 Active Quizzes">
          {renderQuizList(activeQuizzes, "active")}
        </Tab>
        <Tab eventKey="upcoming" title="🕓 Upcoming Quizzes">
          {renderQuizList(upcomingQuizzes, "upcoming")}
        </Tab>
        <Tab eventKey="past" title="📚 Past Quizzes">
          {renderQuizList(pastQuizzes, "past")}
        </Tab>
        <Tab eventKey="liked" title="⭐ Liked Quizzes">
          {renderQuizList(likedQuizList, "liked")}
        </Tab>
      </Tabs>
    </DashboardContainer>
  );
};

export default PlayerDashboard;
