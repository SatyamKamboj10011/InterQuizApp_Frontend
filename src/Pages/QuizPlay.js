import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, ProgressBar, Alert, Badge } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

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
  background: ${(props) => {
    if (props.showfeedback === 'true' && props.selected === 'true') {
      return props.correct === 'true'
        ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        : 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)';
    }
    return 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)';
  }};
  color: ${(props) =>
    props.showfeedback === 'true' && props.selected === 'true' ? 'white' : '#2c3e50'};
  font-weight: 600;
  text-align: left;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.15);
  }
  &:disabled {
    opacity: ${(props) => (props.showfeedback === 'true' ? 1 : 0.7)};
  }
`;

const ResultCard = styled(Card)`
  border-radius: 20px;
  border: none;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
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
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    if (!userId || userRole !== 'PLAYER') {
      alert('Only logged-in players can access this page.');
      navigate('/');
    }

    axios.get(`http://localhost:8080/quiz/${id}`)
      .then((res) => {
        setQuiz(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Quiz not found.');
        navigate('/player');
      });
  }, [id, navigate]);

  useEffect(() => {
    if (showResult || loading) return;
    if (timeLeft === 0) {
      setTimerExpired(true);
      setShowResult(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult, loading]);

  const handleAnswerClick = (answer) => {
    if (timerExpired) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const currentQ = quiz.questions[currentQuestion];
    const isCorrect = answer === currentQ.correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);

    setAnswerHistory((prev) => [...prev, {
      question: currentQ.questionText,
      selectedAnswer: answer,
      correctAnswer: currentQ.correctAnswer,
      isCorrect
    }]);

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
    const userId = localStorage.getItem('userId');
    const payload = {
      player: { id: userId },
      quiz: { id: quiz.id },
      score,
      totalQuestions: quiz.questions.length,
      completedDate: new Date().toISOString().slice(0, 10),
      answerHistory: answerHistory.map((a) => ({
        question: a.question,
        selectedAnswer: a.selectedAnswer,
        correctAnswer: a.correctAnswer,
        isCorrect: a.isCorrect
      }))
    };
    try {
      await axios.post('http://localhost:8080/score/submit', payload);
    } catch (e) {
      setSaveError('Score save failed');
    } finally {
      setSavingScore(false);
    }
  };

  useEffect(() => {
    if (showResult && quiz) submitScore();
  }, [showResult]);

  if (loading) return <QuizContainer className="text-center py-5"><Spinner animation="border" /></QuizContainer>;
  if (!quiz) return <QuizContainer><Alert variant="danger">Quiz not found</Alert></QuizContainer>;

  if (showResult) return (
    <QuizContainer>
      <ResultCard>
        {timerExpired && <Alert variant="warning">⏰ Time's up! Quiz auto-submitted.</Alert>}
        <h2 className="text-center mb-4">Quiz Completed</h2>
        <p className="text-center">You scored <strong>{score}</strong> out of {quiz.questions.length}</p>
        {saveError && <Alert variant="danger">{saveError}</Alert>}

        <div className="mt-4">
          <h5 className="mb-3">Answer Breakdown</h5>
          {answerHistory.map((answer, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <strong>Q{index + 1}:</strong> {answer.question}<br />
                Your Answer: <strong className={answer.isCorrect ? "text-success" : "text-danger"}>
                  {answer.selectedAnswer}
                </strong><br />
                {!answer.isCorrect && (
                  <>Correct Answer: <strong className="text-success">{answer.correctAnswer}</strong></>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="text-center mt-4">
          <Button onClick={() => navigate('/player')} variant="primary">Back to Dashboard</Button>
        </div>
      </ResultCard>
    </QuizContainer>
  );

  const question = quiz.questions[currentQuestion];
  const options = [question.option1, question.option2, question.option3, question.option4].filter(Boolean);
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <QuizContainer>
      <QuizCard>
        <div className="quiz-header p-4 bg-primary text-white">
          <h2>{quiz.name}</h2>
        </div>
        <div className="p-4">
          <div className="d-flex justify-content-between mb-3">
            <span>Question {currentQuestion + 1}/{quiz.questions.length}</span>
            <Badge bg={timeLeft <= 10 ? 'danger' : 'success'}>⏱ {timeLeft}s</Badge>
            <span>Score: {score}</span>
          </div>
          <ProgressBar now={progress} variant="info" className="mb-4" />
          <AnimatePresence mode="wait">
            <QuestionCard>
              <h4 className="mb-4">{question.questionText}</h4>
              {options.map((option, i) => (
                <AnswerButton
                  key={i}
                  onClick={() => handleAnswerClick(option)}
                  disabled={showFeedback || timerExpired}
                  showfeedback={showFeedback.toString()}
                  selected={(selectedAnswer === option).toString()}
                  correct={(option === question.correctAnswer).toString()}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>{option}</span>
                  {showFeedback && selectedAnswer === option && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      {option === question.correctAnswer ? <FaCheck /> : <FaTimes />}
                    </motion.span>
                  )}
                </AnswerButton>
              ))}
            </QuestionCard>
          </AnimatePresence>
        </div>
      </QuizCard>
    </QuizContainer>
  );
};

export default PlayQuiz;
