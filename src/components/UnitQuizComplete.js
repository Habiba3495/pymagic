// src/components/UnitQuizComplete.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UnitQuizComplete = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { quizData } = state || {};

    console.log("Quiz Data in UnitQuizComplete:", quizData); // Debug log

    if (!quizData) return <div>No quiz data available</div>;

    return (
        <div className="quiz-complete-container">
            <h1>Unit Quiz Completed!</h1>
            <p>Score: {quizData.score} / {quizData.answers.length}</p>
            <p>Points Earned: {quizData.earned_points}</p>
            <p>Status: {quizData.is_passed ? "Passed" : "Failed"}</p>
            <button onClick={() => navigate("/lessons")}>Back to Lessons</button>
            <button onClick={() => navigate("/quiz-review", { state: { quizData } })}>Review</button>
        </div>
    );
};

export default UnitQuizComplete;