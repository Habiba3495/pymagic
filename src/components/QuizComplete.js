// import React, { useEffect, useState } from "react";

// import { useLocation, useNavigate } from "react-router-dom";

// import "./QuizComplete.css";

// const QuizComplete = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [quizData, setQuizData] = useState(location.state?.quizData || null); // Use state if available

//     // Check localStorage for quiz data if not passed via state
//     useEffect(() => {
//         if (!location.state?.quizData) {
//             const storedQuizData = localStorage.getItem("quizData");
//             if (storedQuizData) {
//                 setQuizData(JSON.parse(storedQuizData));
//             }
//         }
//     }, [location.state]);

//     // Destructure the data for easier use
//     const { score, earned_points, is_passed } = quizData || {};

//     if (!quizData) {
//         return (
//             <div className="quiz-complete-container">
//                 <h1>No Quiz Data Found</h1>
//                 <p>Please complete a quiz to view your results.</p>
//                 <button onClick={() => navigate("/lessons")}>Go to Lessons</button>
//             </div>
//         );
//     }
    
//     const handleReview = () => {
//         // Navigate to the review page and pass quizData as state
//         navigate("/review", { state: { quizData } });
//     };

//     return (////////////////
//         <div className="quiz-complete-container">
//             <h1>Lesson Completed!</h1>
//             <h2>is passed :  {is_passed ? "Yes" : "No"} </h2>
//             <div className="score-display">
//                 <p>{score}/10</p> {/* Display the score */}
//             </div>
//             <p className="motivation-text">Keep going, wizard!</p>
//             <div className="points-earned">
//                 <p>{earned_points} Points earned</p> {/* Display earned points */}
//             </div>

//             <button onClick={handleReview}>Review Answers</button>

//             <button className="continue-button" onClick={() => navigate("/lessons")}>
//                 Continue
//             </button>
//         </div>
//     );
// };

// export default QuizComplete;

// src/components/QuizComplete.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuizComplete = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { quizData } = state || {};

    if (!quizData) return <div>No quiz data available</div>;

    return (
        <div className="quiz-complete-container">
            <h1>Quiz Completed!</h1>
            <p>Score: {quizData.score} / {quizData.answers.length}</p>
            <p>Points Earned: {quizData.earned_points}</p>
            <p>Status: {quizData.is_passed ? "Passed" : "Failed"}</p>
            <button onClick={() => navigate("/lessons")}>Back to Lessons</button>
            <button onClick={() => navigate("/quiz-review", { state: { quizData } })}>Review</button>
        </div>
    );
};

export default QuizComplete;

