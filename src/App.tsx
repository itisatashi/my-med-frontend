import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Welcome and Auth components
import WelcomePage from './components/welcome/WelcomePage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// Main components
import MedicationReminder from './components/medication/MedicationReminder';
import ChatInterface from './components/chat/ChatInterface';
import ConsultationHistory from './components/consultation/ConsultationHistory';
import EnhancedDoctorsDirectory from './components/consultation/EnhancedDoctorsDirectory';
import Analytics from './components/consultation/Analytics';
import Dashboard from './components/Dashboard';
import AppLayout from './components/layout/AppLayout';

import './App.css';

// Config is handled by individual components as needed

/**
 * Main App component with routing
 */
const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

/**
 * App content with authentication state and routing
 */
const AppContent: React.FC = () => {
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: 'var(--background)'
      }}>
        <CircularProgress size={48} sx={{ color: 'var(--primary-color)', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Загрузка приложения...
        </Typography>
      </Box>
    );
  }

  // If user is already authenticated, show main app with nested routes
  if (isAuthenticated) {
    return (
      <Routes>
        {/* Main application layout with navigation */}
        <Route 
          element={<AppLayout 
            toggleDarkMode={() => {}} 
            darkMode={window.matchMedia('(prefers-color-scheme: dark)').matches}
          />}
        >
          {/* Home route (Medication Reminder) */}
          <Route path="/" element={<MedicationReminder />} />
          
          {/* Main feature routes */}
          <Route path="/medications" element={<MedicationReminder />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/consult" element={<EnhancedDoctorsDirectory />} />
          <Route path="/history" element={<ConsultationHistory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Dashboard />} />
          
          {/* Legacy route for backward compatibility */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  
  // If not authenticated, show welcome page, login or signup screens
  return (
    <Routes>
      {/* Welcome Page - Main landing page */}
      <Route path="/" element={<WelcomePage />} />
      
      {/* Login Route - Direct authentication page */}
      <Route 
        path="/login" 
        element={
          authView === 'login' ? (
            <Login 
              onLoginSuccess={() => {}} 
              onNavigateToSignup={() => setAuthView('signup')} 
            />
          ) : (
            <Signup 
              onSignupSuccess={() => setAuthView('login')} 
              onNavigateToLogin={() => setAuthView('login')} 
            />
          )
        } 
      />
      
      {/* Dedicated Signup Route */}
      <Route 
        path="/signup" 
        element={
          <Signup 
            onSignupSuccess={() => setAuthView('login')} 
            onNavigateToLogin={() => setAuthView('login')} 
          />
        } 
      />
      
      {/* Fallback route redirects to welcome page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
