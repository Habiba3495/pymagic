import React, { useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTranslation } from "react-i18next";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import Lessons from "./components/LessonSection";
import Flashcards from "./components/FlashcardSection";
import Chatbot from "./components/ChatbotSection";
import Profile from "./components/ProfileSection";
import Game from "./components/GameSection";
import Video from "./components/Video";
import Quiz from "./components/Quiz";
import QuizComplete from "./components/QuizComplete";
import ReviewPage from "./components/ReviewPage";
import UnitQuiz from "./components/UnitQuiz";
import UnitQuizComplete from "./components/UnitQuizComplete";
import ProgressReport from "./components/ProgressReport";
import AchievementsPage from "./components/AchievementsPage";
import AvatarCustomization from "./components/AvatarCustomization";
import Setting from "./components/setting";
import EditProfile from "./components/EditProfile";
import VerifyEmail from "./components/VerifyEmail";
import ResetPassword from "./components/ResetPassword";
import "./i18n";
import ReactGA from 'react-ga4';
import TrackPageViews from './components/TrackPageViews';
import TrackEngagement from './components/TrackEngagement';
import TrackInactivity from './components/TrackInactivity';
import Loading from "./components/Loading";
import RegisterFailed from "./components/RegisterFailed";

ReactGA.initialize('G-W0C0ZKC21L', { debug_mode: true });

const AppContent = () => {
  const { user, loading } = useAuth();
  const { i18n } = useTranslation();
  const location = useLocation();

  // تحسين إدارة اللغة
  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    const lang = i18n.language;
    
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [i18n.language]);

  // تحسين تتبع المستخدم
  useEffect(() => {
    ReactGA.set({ userId: user?.id || 'anonymous' });
  }, [user]);

  // إدارة حدث إغلاق التطبيق
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.gtag('event', 'app_closed', {
        category: 'Session',
        action: 'app_closed',
        label: window.location.pathname,
        custom_user_id: user?.id,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user]);

  // تحسين التحكم في التتبع
  const noTrackingPages = useMemo(() => [
    '/', '/login', '/register', '/registerfailed', 
    '/verify-email', '/reset-password'
  ], []);

  const shouldTrack = useMemo(() => 
    user?.id && !noTrackingPages.includes(location.pathname.toLowerCase())
  , [user, location.pathname, noTrackingPages]);

  if (loading) return <Loading />;

  return (
    <>
      {shouldTrack && (
        <>
          <TrackPageViews userId={user.id} user={user} />
          <TrackEngagement userId={user.id} user={user} />
          <TrackInactivity userId={user.id} user={user} />
        </>
      )}
      
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/lessons" replace /> : <HomePage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/lessons" replace /> : <RegisterPage />}
        />
        <Route
          path="/registerfailed"
          element={user ? <Navigate to="/lessons" replace /> : <RegisterFailed />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/lessons" replace /> : <LoginPage />}
        />
        <Route
          path="/verify-email"
          element={user ? <Navigate to="/lessons" replace /> : <VerifyEmail />}
        />
        <Route
          path="/reset-password"
          element={user ? <Navigate to="/lessons" replace /> : <ResetPassword />}
        />
        {user ? (
          <>
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/game" element={<Game />} />
            <Route path="/lesson/:unitId/:lessonId" element={<Video />} />
            <Route path="/quiz/:unitId/:lessonId" element={<Quiz />} />
            <Route path="/quiz-complete" element={<QuizComplete />} />
            <Route path="/unit-quiz/:unitId" element={<UnitQuiz />} />
            <Route path="/unit-quiz-complete" element={<UnitQuizComplete />} />
            <Route path="/quiz-review" element={<ReviewPage />} />
            <Route path="/progress-report/:user_id" element={<ProgressReport />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/profile/avatar" element={<AvatarCustomization />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/loading" element={<Loading />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;