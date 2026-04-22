import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import pages
import Home from '../pages/home/Home';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Dashboard from '../pages/dashboard/Dashboard';
import Portfolio from '../pages/dashboard/Portfolio';
import Profile from '../pages/profile/Profile';
import Predictions from '../pages/predictions/Predictions';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/predictions"
          element={
            <ProtectedRoute>
              <Predictions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element = {
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
};

export default AppRoutes;
