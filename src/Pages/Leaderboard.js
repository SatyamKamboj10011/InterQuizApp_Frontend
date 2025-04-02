import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Card,
  Badge,
  ButtonGroup,
  Button,
  Form,
} from "react-bootstrap";
import { 
  FaCrown, 
  FaUser, 
  FaMedal, 
  FaTrophy,
  FaSyncAlt,
  FaSearch,
  FaChartLine,
  FaCalendarAlt
} from "react-icons/fa";
import styled, { keyframes } from "styled-components";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const LeaderboardContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 3rem 0;
`;

const LeaderboardCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border: none;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  position: relative;
`;

const Title = styled.h2`
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
`;

const LeaderboardTable = styled(Table)`
  margin-bottom: 0;
  
  thead th {
    background: #f8f9fa;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    border-bottom-width: 2px;
  }
  
  tbody tr {
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(102, 126, 234, 0.05);
    }
  }
`;

const RankCell = styled.td`
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const PlayerCell = styled.td`
  font-weight: 500;
`;

const ScoreBadge = styled(Badge)`
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  background: ${props => {
    if (props.rank === 0) return "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)";
    if (props.rank === 1) return "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)";
    if (props.rank === 2) return "linear-gradient(135deg, #CD7F32 0%, #A67C52 100%)";
    return "#28a745";
  }};
  color: ${props => props.rank <= 2 ? "#fff" : "inherit"};
  border-radius: 50px;
`;

const LoadingSpinner = styled(Spinner)`
  width: 3rem;
  height: 3rem;
  margin: 2rem auto;
  display: block;
  color: #667eea;
`;

const RefreshButton = styled(Button)`
  animation: ${pulse} 2s infinite;
`;

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`http://localhost:8080/score/leaderboard?range=${timeRange}`);
      setLeaderboard(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leaderboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const handleRefresh = () => {
    fetchLeaderboard();
  };

  const renderRankIcon = (rank) => {
    if (rank === 0) return <FaCrown className="text-warning" />;
    if (rank === 1) return <FaMedal className="text-secondary" />;
    if (rank === 2) return <FaMedal className="text-danger" />;
    return <span>{rank + 1}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
  
    try {
      let isoString = dateString;
  
      // If missing seconds, add ":00"
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(isoString)) {
        isoString += ":00";
      }
  
      // Add 'Z' to force UTC if no timezone is present
      if (!isoString.endsWith("Z")) {
        isoString += "Z";
      }
  
      const date = new Date(isoString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
  
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };
  
  
  
  
  
  

  const filteredLeaderboard = leaderboard.filter(entry => 
    entry.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.quizName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LeaderboardContainer>
      <LeaderboardCard>
        <Header>
          <Title>
            <FaTrophy /> Quiz Leaderboard
          </Title>
          <p className="mb-0">Top performers across all quizzes</p>
        </Header>

        <Controls>
          <ButtonGroup>
            <Button 
              variant={timeRange === "daily" ? "primary" : "outline-primary"}
              onClick={() => setTimeRange("daily")}
            >
              Daily
            </Button>
            <Button 
              variant={timeRange === "weekly" ? "primary" : "outline-primary"}
              onClick={() => setTimeRange("weekly")}
            >
              Weekly
            </Button>
            <Button 
              variant={timeRange === "monthly" ? "primary" : "outline-primary"}
              onClick={() => setTimeRange("monthly")}
            >
              Monthly
            </Button>
            <Button 
              variant={timeRange === "all" ? "primary" : "outline-primary"}
              onClick={() => setTimeRange("all")}
            >
              All Time
            </Button>
          </ButtonGroup>

          <div className="d-flex" style={{ width: "300px" }}>
            <Form.Control
              type="text"
              placeholder="Search players or quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-secondary">
              <FaSearch />
            </Button>
          </div>

          <RefreshButton 
            variant="outline-primary" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <FaSyncAlt className={loading ? "spin" : ""} />
          </RefreshButton>
        </Controls>

        {loading ? (
          <div className="text-center py-4">
            <LoadingSpinner animation="border" />
            <p className="text-muted mt-2">Loading leaderboard data...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="m-4 text-center">
            {error}
          </Alert>
        ) : (
          <div className="table-responsive">
            <LeaderboardTable hover responsive>
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Rank</th>
                  <th>Player</th>
                  <th>Quiz</th>
                  <th style={{ width: "120px" }}>Score</th>
                  <th style={{ width: "120px" }}>
                    <FaCalendarAlt className="me-1" />
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.length > 0 ? (
                  filteredLeaderboard.map((entry, index) => (
                    <tr key={`${index}-${entry.playerName}-${entry.quizName}-${entry.completedDate}`}>



                      <RankCell>
                        {renderRankIcon(index)}
                      </RankCell>
                      <PlayerCell>
                        <FaUser className="me-2 text-muted" />
                        {entry.playerName}
                      </PlayerCell>
                      <td>
                        <Badge bg="info" className="text-uppercase">
                          {entry.quizName}
                        </Badge>
                      </td>
                      <td>
                        <ScoreBadge rank={index}>
                          {entry.score}%
                        </ScoreBadge>
                      </td>
                      <td className="text-muted">
  {formatDate(entry.completedDate)}
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      <FaChartLine size={32} className="mb-2" />
                      <p>No records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </LeaderboardTable>
          </div>
        )}
      </LeaderboardCard>
    </LeaderboardContainer>
  );
};

export default Leaderboard;