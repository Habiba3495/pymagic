// import React, { useEffect, useMemo, Component } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
// import { useAuth, AuthProvider } from "./context/AuthContext";
// import { ErrorProvider, useError } from "./context/ErrorContext";
// import { useTranslation } from "react-i18next";
// import HomePage from "./components/HomePage";
// import RegisterPage from "./components/RegisterPage";
// import LoginPage from "./components/LoginPage";
// import Lessons from "./components/LessonSection";
// import Flashcards from "./components/FlashcardSection";
// import Chatbot from "./components/ChatbotSection";
// import Profile from "./components/ProfileSection";
// import Game from "./components/GameSection";
// import Video from "./components/Video";
// import Quiz from "./components/Quiz";
// import QuizComplete from "./components/QuizComplete";
// import ReviewPage from "./components/ReviewPage";
// import UnitQuiz from "./components/UnitQuiz";
// import UnitQuizComplete from "./components/UnitQuizComplete";
// import ProgressReport from "./components/ProgressReport";
// import AchievementsPage from "./components/AchievementsPage";
// import AvatarCustomization from "./components/AvatarCustomization";
// import Setting from "./components/setting";
// import EditProfile from "./components/EditProfile";
// import VerifyEmail from "./components/VerifyEmail";
// import ResetPassword from "./components/ResetPassword";
// import PyMagicRunner from "./components/Pymagic_runnergame";
// import "./i18n";
// import ReactGA from 'react-ga4';
// import TrackPageViews from './components/TrackPageViews';
// import TrackEngagement from './components/TrackEngagement';
// import TrackInactivity from './components/TrackInactivity';
// import Loading from "./components/Loading";
// import RegisterFailed from "./components/RegisterFailed";

// ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, { debug_mode: true });

// class ErrorBoundary extends Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('ErrorBoundary caught error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <PyMagicRunner />;
//     }
//     return this.props.children;
//   }
// }

// const AppContent = () => {
//   const { user, logout } = useAuth();
//   const { error, clearError } = useError();
//   const { i18n } = useTranslation();
//   const location = useLocation();
//   const [isOffline, setIsOffline] = React.useState(!navigator.onLine);
//   const navigate = useNavigate(); // Add this

//   useEffect(() => {
//     const handleUnauthorized = () => {
//       logout(); // Clear the user state
//       navigate('/'); // Redirect to home page
//     };

//     window.addEventListener('unauthorized', handleUnauthorized);
//     return () => window.removeEventListener('unauthorized', handleUnauthorized);
//   }, [navigate]);

  

//   // useEffect(() => {
//   //   const handleOnline = () => setIsOffline(false);
//   //   const handleOffline = () => setIsOffline(true);

//   //   window.addEventListener('online', handleOnline);
//   //   window.addEventListener('offline', handleOffline);


    
//     // اختبار الاتصال بالـ backend
//   //   const checkBackend = async () => {
//   //     try {
//   //       await fetch('https://pymagicnodejs-production-dc27.up.railway.app/ping', { mode: 'no-cors' });
//   //     // await fetch('http://localhost:5000/ping', { mode: 'no-cors' });
//   //       setIsOffline(false);
//   //     } catch {
//   //       setIsOffline(true);
//   //     }
//   //   };

  
//   //   // const checkBackend = async () => {
//   //   //   try {
//   //   //     const response = await fetch('https://pymagicnodejs-production.up.railway.app/ping', {
//   //   //       method: 'GET',
//   //   //       credentials: 'include',
//   //   //       headers: {
//   //   //         'Accept': 'application/json',
//   //   //       },
//   //   //     });

//   //   //     if (response.ok) {
//   //   //       setIsOffline(false); // Server is reachable and responded with 200 OK
//   //   //     } else if (response.status === 401) {
//   //   //       setIsOffline(false); // Server is reachable, but user is unauthorized
//   //   //     } else {
//   //   //       setIsOffline(true); // Server responded with another error (e.g., 500)
//   //   //     }
//   //   //   } catch (error) {
//   //   //     setIsOffline(true); // Server is unreachable (e.g., network error)
//   //   //   }
//   //   // };

//   //   checkBackend();
//   //   const interval = setInterval(checkBackend, 5000); // فحص كل 5 ثواني

//   //   return () => {
//   //     window.removeEventListener('online', handleOnline);
//   //     window.removeEventListener('offline', handleOffline);
//   //     clearInterval(interval);
//   //   };
//   // }, []);

//   useEffect(() => {
//   const handleOnline = () => setIsOffline(false);
//   const handleOffline = () => setIsOffline(true);

//   window.addEventListener('online', handleOnline);
//   window.addEventListener('offline', handleOffline);

//   const checkBackend = async () => {
//     try {
//       const response = await fetch('https://pymagicnodejs-production-dc27.up.railway.app/ping', {
//         method: 'GET',
//         mode: 'cors', // استخدم cors بدلاً من no-cors
//         credentials: 'include', // أرسل ملفات تعريف الارتباط
//         headers: {
//           'Accept': 'application/json',
//         },
//       });
//       console.log('Ping response:', response.status); // سجل الاستجابة
//       setIsOffline(!response.ok);
//     } catch (err) {
//       console.error('Ping failed:', err);
//       setIsOffline(true);
//     }
//   };

//   checkBackend();
//   const interval = setInterval(checkBackend, 5000);

//   return () => {
//     window.removeEventListener('online', handleOnline);
//     window.removeEventListener('offline', handleOffline);
//     clearInterval(interval);
//   };
// }, []);

//   useEffect(() => {
//     const dir = i18n.language === "ar" ? "rtl" : "ltr";
//     const lang = i18n.language;
//     document.documentElement.setAttribute("dir", dir);
//     document.documentElement.setAttribute("lang", lang);
//   }, [i18n.language]);

//   useEffect(() => {
//     ReactGA.set({ userId: user?.id || 'anonymous' });
//   }, [user]);

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       window.gtag('event', 'app_closed', {
//         category: 'Session',
//         action: 'app_closed',
//         label: window.location.pathname,
//         custom_user_id: user?.id,
//       });
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, [user]);

//   const noTrackingPages = useMemo(() => [
//     '/', '/login', '/register', '/registerfailed', 
//     '/verify-email', '/reset-password'
//   ], []);

//   const shouldTrack = useMemo(() => 
//     user?.id && !noTrackingPages.includes(location.pathname.toLowerCase())
//   , [user, location.pathname, noTrackingPages]);

//   const noErrorBoundaryPages = useMemo(() => [
//     '/login', '/register', '/verify-email', '/reset-password', '/registerfailed'
//   ], []);

//   const useErrorBoundary = !noErrorBoundaryPages.includes(location.pathname.toLowerCase());

//   // إظهار اللعبة لما الـ backend يقف
//   if (isOffline) {
//     return <PyMagicRunner />;
//   }

//   if (error) {
//     return (
//       <div style={{ textAlign: 'center', padding: '20px' }}>
//         <h1>Error</h1>
//         <p>{error.message}</p>
//         <button onClick={() => clearError()}>
//           Clear Error
//         </button>
//       </div>
//     );
//   }

//   const routes = (
//     <Routes>
//       <Route path="/" element={user ? <Navigate to="/lessons" /> : <HomePage />} />
//       <Route path="/register" element={user ? <Navigate to="/lessons" /> : <RegisterPage />} />
//       <Route path="/registerfailed" element={user ? <Navigate to="/lessons" /> : <RegisterFailed />} />
//       <Route path="/login" element={user ? <Navigate to="/lessons" /> : <LoginPage />} />
//       <Route path="/verify-email" element={user ? <Navigate to="/lessons" /> : <VerifyEmail />} />
//       <Route path="/reset-password" element={user ? <Navigate to="/lessons" /> : <ResetPassword />} />

//       {user ? (
//         <>
//           <Route path="/lessons" element={<Lessons />} />
//           <Route path="/flashcards" element={<Flashcards />} />
//           <Route path="/chatbot" element={<Chatbot />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/editprofile" element={<EditProfile />} />
//           <Route path="/game" element={<Game />} />
//           <Route path="/lesson/:unitId/:lessonId" element={<Video />} />
//           <Route path="/quiz/:unitId/:lessonId" element={<Quiz />} />
//           <Route path="/quiz-complete" element={<QuizComplete />} />
//           <Route path="/unit-quiz/:unitId" element={<UnitQuiz />} />
//           <Route path="/unit-quiz-complete" element={<UnitQuizComplete />} />
//           <Route path="/quiz-review" element={<ReviewPage />} />
//           <Route path="/progress-report/:user_id" element={<ProgressReport />} />
//           <Route path="/achievements" element={<AchievementsPage />} />
//           <Route path="/profile/avatar" element={<AvatarCustomization />} />
//           <Route path="/setting" element={<Setting />} />
//           <Route path="/loading" element={<Loading />} />
//         </>
//       ) : (
//         <Route path="*" element={<Navigate to="/" replace />} />
//       )}
//     </Routes>
//   );

//   return (
//     <>
//       {shouldTrack && (
//         <>
//           <TrackPageViews userId={user.id} user={user} />
//           <TrackEngagement userId={user.id} user={user} />
//           <TrackInactivity userId={user.id} user={user} />
//         </>
//       )}
      
//       {useErrorBoundary ? (
//         <ErrorBoundary>
//           {routes}
//         </ErrorBoundary>
//       ) : (
//         routes
//       )}
//     </>
//   );
// };

// const App = () => (
//   <Router>
//     <ErrorProvider>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </ErrorProvider>
//   </Router>
// );

// export default App;


import React, { useEffect, useMemo, Component } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { ErrorProvider, useError } from "./context/ErrorContext";
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
import PyMagicRunner from "./components/Pymagic_runnergame";
import "./i18n";
import ReactGA from 'react-ga4';
import TrackPageViews from './components/TrackPageViews';
import TrackEngagement from './components/TrackEngagement';
import TrackInactivity from './components/TrackInactivity';
import Loading from "./components/Loading";
import RegisterFailed from "./components/RegisterFailed";

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, { debug_mode: true });

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <PyMagicRunner />;
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const { user, logout } = useAuth();
  const { error, clearError } = useError();
  const { i18n } = useTranslation();
  const location = useLocation();
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      logout(); // Clear the user state
      navigate('/'); // Redirect to home page
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkBackend = async () => {
      try {
        const response = await fetch('https://pymagicnodejs-production-dc27.up.railway.app/ping', {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });
        console.log('Ping response:', response.status);
        setIsOffline(!response.ok);
        // If user is logged in and ping is successful, ensure redirect to /lessons
        if (response.ok && user && location.pathname === '/') {
          navigate('/lessons', { replace: true });
        }
      } catch (err) {
        console.error('Ping failed:', err);
        setIsOffline(true);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    const lang = i18n.language;
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [i18n.language]);

  useEffect(() => {
    ReactGA.set({ userId: user?.id || 'anonymous' });
  }, [user]);

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

  const noTrackingPages = useMemo(() => [
    '/', '/login', '/register', '/registerfailed',
    '/verify-email', '/reset-password'
  ], []);

  const shouldTrack = useMemo(() =>
    user?.id && !noTrackingPages.includes(location.pathname.toLowerCase())
  , [user, location.pathname, noTrackingPages]);

  const noErrorBoundaryPages = useMemo(() => [
    '/login', '/register', '/verify-email', '/reset-password', '/registerfailed'
  ], []);

  const useErrorBoundary = !noErrorBoundaryPages.includes(location.pathname.toLowerCase());

  if (isOffline) {
    return <PyMagicRunner />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Error</h1>
        <p>{error.message}</p>
        <button onClick={() => clearError()}>
          Clear Error
        </button>
      </div>
    );
  }

  const routes = (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/lessons" /> : <HomePage />} />
      <Route path="/register" element={user ? <Navigate to="/lessons" /> : <RegisterPage />} />
      <Route path="/registerfailed" element={user ? <Navigate to="/lessons" /> : <RegisterFailed />} />
      <Route path="/login" element={user ? <Navigate to="/lessons" /> : <LoginPage />} />
      <Route path="/verify-email" element={user ? <Navigate to="/lessons" /> : <VerifyEmail />} />
      <Route path="/reset-password" element={user ? <Navigate to="/lessons" /> : <ResetPassword />} />
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
  );

  return (
    <>
      {shouldTrack && (
        <>
          <TrackPageViews userId={user.id} user={user} />
          <TrackEngagement userId={user.id} user={user} />
          <TrackInactivity userId={user.id} user={user} />
        </>
      )}
      {useErrorBoundary ? (
        <ErrorBoundary>
          {routes}
        </ErrorBoundary>
      ) : (
        routes
      )}
    </>
  );
};

const App = () => (
  <Router>
    <ErrorProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorProvider>
  </Router>
);

export default App;