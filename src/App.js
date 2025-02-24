/*
import React from "react";
import HomePage from "./components/HomePage";

function App() {
  return <HomePage />;
}

export default App;
*/
/*
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage"; // ✅ تأكد من المسار الصحيح

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
*/


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage"; // تأكد من وجود هذا الملف
import LoginPage from "./components/LoginPage";
import Lessons from "./components/LessonSection";
import Flashcards from "./components/FlashcardSection";
import Chatbot from "./components/ChatbotSection";
import Profile from "./components/ProfileSection";
import Game from "./components/GameSection";

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
      </Routes>
    </Router>
  );
};

export default App;
