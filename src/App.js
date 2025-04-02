import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Homepage from './Pages/Home';
import AdminDashboard from './Pages/AdminDashboard';
import PlayerDashboard from './components/PlayerDashboard';
import QuizPlay from './Pages/QuizPlay';
import Login from './Pages/Login';
import Register from './Pages/Register';
import NavigationBar from './components/Navbar';
import Leaderboard from './Pages/Leaderboard';
import Profile from './Pages/Profile';
import './App.css';
import ScoreHistory from './components/ScoreHistory';
import ScoreDetails from './components/ScoreDetails';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import EditProfile from './components/EditProfile';
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('ProtectedRoute - User:', user); // Debug log
  
  if (!user) {
    console.log('ProtectedRoute - No user found, redirecting to login'); // Debug log
    return <Navigate to="/" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute - User role not allowed:', user.role); // Debug log
    return <Navigate to="/home" />;
  }

  return children;
};

function App() {
  // Check if user is on login or register page
  const isAuthPage = window.location.pathname === '/' || window.location.pathname === '/registration';

  return (
    <Router>
      {!isAuthPage && <NavigationBar />}
      <div className={!isAuthPage ? 'page-container' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Register />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
<Route path="/edit-profile/:id" element={<EditProfile />} />
          {/* Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/player" 
            element={
              <ProtectedRoute>
                <PlayerDashboard />
             
              </ProtectedRoute>
            } 
          />
          <Route 
  path="/score-history/:playerId" 
  element={
    <ProtectedRoute>
      <ScoreHistory />
    </ProtectedRoute>
  }
/>
          <Route 
            path="/score-details/:playerId/:scoreId" 
            element={
              <ProtectedRoute>
               <ScoreDetails/>
             
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/play/:id" 
            element={
              <ProtectedRoute>
                <QuizPlay />
              
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:username" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
