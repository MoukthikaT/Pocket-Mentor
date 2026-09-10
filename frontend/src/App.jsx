import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import ConfusionDetector from './pages/ConfusionDetector';
import ExamReadiness from './pages/ExamReadiness';
import Achievements from './pages/Achievements';
import CreateStudy from './pages/CreateStudy';
import StudyMaterial from './pages/StudyMaterial';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import AIChallenge from './pages/AIChallenge';
import Graveyard from './pages/Graveyard';
import BossBattle from './pages/BossBattle';
import ProfileSetup from './pages/ProfileSetup';
import TeachFriend from './pages/TeachFriend';
import RescueMode from './pages/RescueMode';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/confusion" element={<ProtectedRoute><ConfusionDetector /></ProtectedRoute>} />
        <Route path="/readiness" element={<ProtectedRoute><ExamReadiness /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />

        <Route path="/create-study" element={<ProtectedRoute><CreateStudy /></ProtectedRoute>} />
        <Route path="/study-material/:packId?" element={<ProtectedRoute><StudyMaterial /></ProtectedRoute>} />
        <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/quiz-result" element={<ProtectedRoute><QuizResult /></ProtectedRoute>} />
        <Route path="/challenge" element={<ProtectedRoute><AIChallenge /></ProtectedRoute>} />
        <Route path="/graveyard" element={<ProtectedRoute><Graveyard /></ProtectedRoute>} />
        <Route path="/boss-battle" element={<ProtectedRoute><BossBattle /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/teach" element={<ProtectedRoute><TeachFriend /></ProtectedRoute>} />
        <Route path="/rescue" element={<ProtectedRoute><RescueMode /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
