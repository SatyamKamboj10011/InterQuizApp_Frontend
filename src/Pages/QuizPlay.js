import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, ProgressBar, Alert, Badge } from 'react-bootstrap';
import { FaTrophy, FaHome, FaCheck, FaTimes, FaArrowRight, FaQuestionCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Styled components
const QuizContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 2rem 0;
`;

const QuizCard = styled(Card)`
  border-radius: 20px;
  border: none;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const QuestionCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const AnswerButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 12px;
  background: ${props => {
    if (props.showfeedback === 'true' && props.selected === 'true') {
      return props.correct === 'true' 
        ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' 
        : 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)';
    }
    return 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)';
  }};
  color: ${props => props.showfeedback === 'true' && props.selected === 'true' ? 'white' : '#2c3e50'};
  font-weight: 600;
  text-align: left;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: ${props => props.showfeedback === 'true' ? 1 : 0.7};
  }
`;

const ResultCard = styled(Card)`
  border-radius: 20px;
  border: none;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
`;

const AnswerItem = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  background: ${props => props.correct ? 'rgba(102, 187, 106, 0.1)' : 'rgba(239, 83, 80, 0.1)'};
  border-left: 4px solid ${props => props.correct ? '#66bb6a' : '#ef5350'};
`;

const PlayQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingScore, setSavingScore] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!userName || !userId) {
      alert('Please log in to play the quiz');
      navigate('/');
      return;
    }

    if (userRole !== 'PLAYER') {
      alert('Only players can play quizzes. Please log in with a player account.');
      navigate('/');
      return;
    }

    axios
      .get(`http://localhost:8080/quiz/${id}`)
      .then((res) => {
        const quizData = res.data;
        setQuiz(quizData);
        setLoading(false);
      })
      .catch(() => {
        alert('Quiz not found.');
        navigate('/player');
      });
  }, [id, navigate]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === quiz.questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setAnswerHistory((prev) => [
      ...prev,
      {
        question: quiz.questions[currentQuestion].questionText,
        selectedAnswer: answer,
        correctAnswer: quiz.questions[currentQuestion].correctAnswer,
        isCorrect,
      },
    ]);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const submitScore = async () => {
    setSavingScore(true);
    setSaveError(null);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/');
        return;
      }

      const finalScore = answerHistory.filter((answer) => answer.isCorrect).length;

      const payload = {
        player: { id: userId },
        quiz: { id: quiz.id },
        score: finalScore,
        totalQuestions: quiz.questions.length,
        completedDate: new Date().toISOString().slice(0, 10),
        answerHistory: answerHistory.map((answer) => ({
          question: answer.question,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: answer.correctAnswer,
          isCorrect: answer.isCorrect,
        })),
      };

      const response = await axios.post('http://localhost:8080/score/submit', payload, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });
      console.log('Score and answer history saved successfully:', response.data);
      return true;
    } catch (error) {
      console.error('Failed to save score:', error);
      setSaveError('Failed to save score. Please try again.');
      return false;
    } finally {
      setSavingScore(false);
    }
  };

  useEffect(() => {
    if (showResult && quiz && score !== null) {
      submitScore();
    }
  }, [showResult]);

  if (loading) {
    return (
      <QuizContainer className="d-flex justify-content-center align-items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
        </motion.div>
      </QuizContainer>
    );
  }

  if (!quiz) {
    return (
      <QuizContainer className="d-flex justify-content-center align-items-center">
        <Alert variant="danger" className="text-center rounded-lg shadow-sm">
          Quiz not found. Please try another quiz.
        </Alert>
      </QuizContainer>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    return (
      <QuizContainer>
        <ResultCard>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <FaTrophy className="text-warning" size={60} />
            <h2 className="mt-3">Quiz Completed!</h2>
            <p className="lead">Here's how you did:</p>
          </motion.div>

          {savingScore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-4"
            >
              <Spinner animation="border" variant="primary" className="me-2" />
              <span>Saving your results...</span>
            </motion.div>
          )}

          {saveError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Alert variant="danger">{saveError}</Alert>
            </motion.div>
          )}

          <div className="text-center mb-5">
            <h1 className="display-3 mb-3">
              <Badge bg={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'danger'}>
                {score}/{quiz.questions.length}
              </Badge>
            </h1>
            <ProgressBar 
              now={percentage} 
              label={`${percentage}%`}
              variant={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'danger'}
              className="mb-3"
              style={{ height: '20px' }}
            />
            <h4>
              {percentage >= 80 ? 'Excellent!' : 
               percentage >= 60 ? 'Good job!' : 
               percentage >= 40 ? 'Not bad!' : 'Keep practicing!'}
            </h4>
          </div>

          <h4 className="mb-4 d-flex align-items-center">
            <FaQuestionCircle className="me-2 text-primary" />
            Answer Breakdown
          </h4>

          <div className="answer-summary">
            {answerHistory.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AnswerItem correct={answer.isCorrect}>
                  <p className="fw-bold">Question {index + 1}: {answer.question}</p>
                  <p>Your answer: <strong>{answer.selectedAnswer}</strong></p>
                  {!answer.isCorrect && (
                    <p>Correct answer: <strong className="text-success">{answer.correctAnswer}</strong></p>
                  )}
                  <div className="text-end">
                    {answer.isCorrect ? (
                      <Badge bg="success">Correct</Badge>
                    ) : (
                      <Badge bg="danger">Incorrect</Badge>
                    )}
                  </div>
                </AnswerItem>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Button 
              variant="primary" 
              onClick={() => navigate('/player')} 
              size="lg"
              className="rounded-pill px-4"
            >
              <FaHome className="me-2" />
              Return to Dashboard
            </Button>
          </div>
        </ResultCard>
      </QuizContainer>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <QuizContainer>
      <QuizCard>
        <div className="quiz-header p-4 bg-primary text-white">
          <h1 className="mb-0">{quiz.name}</h1>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span className="fw-bold">Score: {score}</span>
            </div>
            <ProgressBar 
              now={progress} 
              variant="primary" 
              style={{ height: '10px' }}
            />
          </div>

          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="mb-4">{question.questionText}</h4>
              
              <div className="options-grid">
                {[question.option1, question.option2, question.option3, question.option4].map((option, index) => (
                  <AnswerButton
                    key={index}
                    onClick={() => handleAnswerClick(option)}
                    disabled={showFeedback}
                    showfeedback={showFeedback.toString()}
                    selected={(selectedAnswer === option).toString()}
                    correct={(option === question.correctAnswer).toString()}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{option}</span>
                    {showFeedback && selectedAnswer === option && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ms-2"
                      >
                        {option === question.correctAnswer ? (
                          <FaCheck size={18} />
                        ) : (
                          <FaTimes size={18} />
                        )}
                      </motion.span>
                    )}
                  </AnswerButton>
                ))}
              </div>
            </QuestionCard>
          </AnimatePresence>
        </div>
      </QuizCard>
    </QuizContainer>
  );
};

export default PlayQuiz;