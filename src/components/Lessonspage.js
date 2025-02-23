import React, { useState } from "react";
import "./Lessonspage.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./images/logo.svg";
import l from "./images/Lessons outline.svg"
import cb from "./images/Chatbot outline.svg"
import fc from "./images/Flashcard outline.svg"
import p from "./images/Profile outline.svg"
import g from "./images/Game outline.svg"

const Sidebar = () => {
  const navigate = useNavigate();
  

  return (
    <div className="sidebar">
      <h1 className="title">
        <img src={logo} className="logo" alt="PyMagic Logo" />
      </h1>
      <nav>
      <ul className="menu">
        <li>
          <button onClick={() => navigate("/lessons")} className="menu-button">
            <img src={l} alt="Lessons" className="menu-icon" />
            Lessons
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/flashcards")} className="menu-button">
            <img src={fc} alt="Flash Cards" className="menu-icon" />
            Flash Cards
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/game")} className="menu-button">
            <img src={g} alt="Game" className="menu-icon" />
            Game
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/chatbot")} className="menu-button">
            <img src={cb} alt="chatbot" className="menu-icon" />
            chatbot
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/profile")} className="menu-button">
            <img src={p} alt="profile" className="menu-icon" />
            profile
          </button>
        </li>
      </ul>
      </nav>
    </div>
  );
};

const LessonUnit = ({ title, color }) => {
  return <div className={`lesson-unit ${color}`}>{title}</div>;
};

const Lessonspage = () => {
  return (
    <div className="page-container">
      <Sidebar />
      <div className="content">
        <LessonUnit title="Unit 1: Introduction to Programming" color="purple" />
        <LessonUnit title="Unit 2: Getting Started with Python" color="yellow" />
        <LessonUnit title="Unit 3: Introducing Variables" color="teal" />
      </div>
    </div>
  );
};

export default Lessonspage;

