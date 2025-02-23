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
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage"; // تأكد من وجود هذا الملف
import LoginPage from "./components/LoginPage";
import LessonsPage from "./components/Lessonspage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
