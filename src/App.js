import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import "./i18n"; // Import your i18n configuration
import ReactGA from 'react-ga4';
import TrackPageViews from './components/TrackPageViews';
import TrackEngagement from './components/TrackEngagement';
import TrackInactivity from './components/TrackInactivity';
import Loading from "./components/Loading";
import RegisterFailed from "./components/RegisterFailed";

ReactGA.initialize('G-W0C0ZKC21L');

const App = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();

  

  useEffect(() => {
    document.documentElement.setAttribute("dir", i18n.language === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", i18n.language);
  }, [i18n.language]);

  useEffect(() => { //// To identify Breakpoints (where users leave the app, close pages, or stop interacting):
    const handleBeforeUnload = () => {
      ReactGA.event({
        category: 'Session',
        action: 'app_closed',
        label: window.location.pathname,
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <Router>
      <TrackPageViews />
      <TrackEngagement />
      <TrackInactivity />
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
          path="/RegisterFailed"
          element={user ? <Navigate to="/RegisterFailed" replace /> : <RegisterFailed />}
        />
                <Route
          path="/Login"
          element={user ? <Navigate to="/lessons" replace /> : <LoginPage />}
        />
        {user ? (
          <>

            <Route path="/lessons" element={<Lessons />} />
            <Route path="/Flashcards" element={<Flashcards />} />
            <Route path="/Chatbot" element={<Chatbot />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/EditProfile" element={<EditProfile />} />
            <Route path="/Game" element={<Game />} />
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
            <Route path="/Loading" element={<Loading />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;