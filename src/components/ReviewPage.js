import React, { useEffect, useState } from "react"; // Added useEffect and useState
import { useLocation, useNavigate } from "react-router-dom";
import "./ReviewPage.css"; // Assuming you have a CSS file for styling


function ReviewPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [quizData, setQuizData] = useState(location.state?.quizData || null); // Use state if available

    // Check localStorage for quiz data if not passed via state
    useEffect(() => {
        if (!location.state?.quizData) {
            const storedQuizData = localStorage.getItem("quizData");
            if (storedQuizData) {
                setQuizData(JSON.parse(storedQuizData));
            }
        }
    }, [location.state]);


    // Function to handle navigation and clear quiz data
    const handleNavigation = (path) => {
        localStorage.removeItem("quizData"); // Clear quiz data
        navigate(path); // Navigate to the specified path
    };

    const { score, earned_points, is_passed, answers } = quizData || {};

    if (!quizData) {
        return (
            <div className="review-page">
                <h1>No Quiz Data Found</h1>
                <p>Please complete a quiz to view your results.</p>
                <button onClick={() => navigate("/lessons")}>Go to Lessons</button>
            </div>
        );
    }

    return (////////////////
        <div className="review-page">
            <h1>Quiz Review</h1>
            <h2>Your Score: {score}/10</h2>
            <h2>Earned Points: {earned_points}</h2>
            <h2>Passed: {is_passed ? "Yes" : "No"}</h2>

            <div className="answers-list">
                {answers.map((answer, index) => (
                    <div key={index} className="answer-item">
                        <p><strong>Question ID:</strong> {answer.question_id}</p>
                        <p><strong>Your Answer:</strong> {answer.selected_answer}</p>
                        <p><strong>Correct Answer:</strong> {answer.correct_answer}</p>
                        <p><strong>Feedback:</strong> {answer.motivation_message}</p>
                        <hr />
                    </div>
                ))}
            </div>

            <button onClick={() => handleNavigation("/lessons")}>Go to Lessons</button>
            <button onClick={() => handleNavigation("/progress-report")}>Check Progress Report</button>
        </div>
    );
};

export default ReviewPage;
