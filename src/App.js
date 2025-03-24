import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import 'bootstrap/dist/css/bootstrap.min.css';
import AttendantManagement from './AttendantManagement';
import HomePage from './Home';
import AdminDashboard from './components/AdminDashboard';
import PlayerDashboard from './components/PlayerDashboard';
import QuizPlay from './Pages/QuizPlay';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/player" element={<PlayerDashboard />} />
        <Route path="/play/:quizId" element={<QuizPlay />} />

      </Routes>
    </Router>
  );
}

export default App;
