import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCrown, FaMedal, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/leaderboard');
        setLeaderboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaCrown className="rank-icon gold" />;
      case 2:
        return <FaMedal className="rank-icon silver" />;
      case 3:
        return <FaMedal className="rank-icon bronze" />;
      default:
        return <span className="rank-number">{rank}</span>;
    }
  };

  return (
    <div className="leaderboard-container">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="leaderboard-header">
                <FaTrophy className="trophy-icon" />
                <h1>Global Leaderboard</h1>
                <p>Top Quiz Masters Worldwide</p>
              </div>

              <div className="leaderboard-card">
                {loading ? (
                  <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <Table hover className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                        <th>Quizzes</th>
                        <th>Win Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((player, index) => (
                        <motion.tr
                          key={player.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={index < 3 ? 'top-player' : ''}
                        >
                          <td>
                            <div className="rank-cell">
                              {getRankIcon(index + 1)}
                            </div>
                          </td>
                          <td>
                            <div className="player-cell">
                              <img 
                                src={player.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + player.name}
                                alt="avatar"
                                className="player-avatar"
                              />
                              <span className="player-name">{player.name}</span>
                            </div>
                          </td>
                          <td>
                            <div className="score-cell">
                              <span className="score-value">{player.totalScore}</span>
                              <span className="score-label">pts</span>
                            </div>
                          </td>
                          <td>{player.quizzesTaken}</td>
                          <td>
                            <div className="win-rate">
                              {((player.quizzesWon / player.quizzesTaken) * 100).toFixed(1)}%
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default Leaderboard; 