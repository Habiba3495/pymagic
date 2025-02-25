// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./components/HomePage";
// import RegisterPage from "./components/RegisterPage"; // تأكد من وجود هذا الملف
// import LoginPage from "./components/LoginPage";
// import Lessons from "./components/LessonSection";
// import Flashcards from "./components/FlashcardSection";
// import Chatbot from "./components/ChatbotSection";
// import Profile from "./components/ProfileSection";
// import Game from "./components/GameSection";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/Login" element={<LoginPage />} />
//         <Route path="/lessons" element={<Lessons />} />
//         <Route path="/Flashcards" element={<Flashcards />} />
//         <Route path="/Chatbot" element={<Chatbot />} />
//         <Route path="/Profile" element={<Profile />} />
//         <Route path="/Game" element={<Game />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import Lessons from "./components/LessonSection";
import Flashcards from "./components/FlashcardSection";
import Chatbot from "./components/ChatbotSection";
import Profile from "./components/ProfileSection";
import Game from "./components/GameSection";
import Video from "./components/Video"; // 📌 إضافة صفحة الفيديو
import Quiz from "./components/Quiz";  // 📌 إضافة صفحة الاختبار (يجب إنشاؤها)

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/Flashcards" element={<Flashcards />} />
        <Route path="/Chatbot" element={<Chatbot />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Game" element={<Game />} />
        <Route path="/lesson/:unitId/:lessonId" element={<Video />} /> {/* 📌 مسار الفيديو */}
        <Route path="/quiz/:unitId/:lessonId" element={<Quiz />} />   📌 مسار الاختبار
      </Routes>
    </Router>
  );
};

export default App;
