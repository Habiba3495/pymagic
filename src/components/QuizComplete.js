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
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const QuizComplete = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();
//     const { quizData } = state || {};

//     if (!quizData) return <div>No quiz data available</div>;

//     return (
//         <div className="quiz-complete-container">
//             <h1>Quiz Completed!</h1>
//             <p>Score: {quizData.score} / {quizData.answers.length}</p>
//             <p>Points Earned: {quizData.earned_points}</p>
//             <p>Status: {quizData.is_passed ? "Passed" : "Failed"}</p>
//             <button onClick={() => navigate("/lessons")}>Back to Lessons</button>
//             <button onClick={() => navigate("/quiz-review", { state: { quizData } })}>Review</button>
//         </div>
//     );
// };

// export default QuizComplete;

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import book from "./images/Score icon.svg";
// import "./QuizComplete.css";


// const QuizComplete = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();
//     const [quizData, setQuizData] = useState(state?.quizData || null);

//     useEffect(() => {
//         // إذا لم يتم استلام البيانات من الـ state، نحاول استرجاعها من localStorage
//         if (!quizData) {
//             const storedAnswers = localStorage.getItem("quizAnswers");
//             if (storedAnswers) {
//                 const answers = JSON.parse(storedAnswers);
//                 // حساب النتيجة يدويًا (إذا لم يتم استلامها من السيرفر)
//                 const score = answers.filter(ans => ans.isCorrect).length;
//                 setQuizData({
//                     score: score,
//                     answers: answers,
//                     earned_points: score * 10, // مثال على حساب النقاط
//                     is_passed: score >= (answers.length / 2), // إذا تجاوز نصف الإجابات يعتبر ناجحًا
//                 });
//             }
//         }
//     }, [quizData]);

//     if (!quizData) return <div>No quiz data available</div>;

//     return (
//        <div className="quizcomplete">
//        <div className="quiz-complete-container">
//             <img src={book} alt={book} className="book"/>
//             <h1>Quiz Completed!</h1>
//             <p>Score: {quizData.score} / {quizData.answers.length}</p>
//             <p>Points Earned: {quizData.earned_points}</p>
//             <p>Status: {quizData.is_passed ? "Passed" : "Failed"}</p>
//             <button onClick={() => navigate("/lessons")}>Back to Lessons</button>
//             <button onClick={() => navigate("/quiz-review", { state: { quizData } })}>Review</button>
//         </div>
//         </div>
//     );
// };

// export default QuizComplete;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookIcon from "./images/Score icon.svg"; // أيقونة الكتاب
import pointsIcon from "./images/points.svg"; // أيقونة الـ Earned Points
import "./QuizComplete.css";

const QuizComplete = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState(state?.quizData || null);

    useEffect(() => {
        if (!quizData) {
            const storedAnswers = localStorage.getItem("quizAnswers");
            if (storedAnswers) {
                const answers = JSON.parse(storedAnswers);
                const score = answers.filter(ans => ans.isCorrect).length;
                setQuizData({
                    score: score,
                    answers: answers,
                    earned_points: score * 10, // نقاط مكتسبة (كمثال)
                    is_passed: score >= (answers.length / 2),
                });
            }
        }
    }, [quizData]);

    if (!quizData) return <div>No quiz data available</div>;

    return (
        <div className="quizcomplete">
            <div className="quiz-complete-container">
                {/* أيقونة الكتاب */}
                <img src={bookIcon} alt="Book Icon" className="book" />

                <h1 className="title">Lesson Completed!</h1>
                 <div className="score-points">
                {/* حاوية الـ Score */}
                <div className="score-container">
                    <div className="score-circle">
                        <p>{quizData.score} / {quizData.answers.length}</p>
                    </div>
                    <p className="motivation-text">Keep going, wizard!</p>
                </div>

                {/* حاوية النقاط المكتسبة */}
                <div className="points-container">
                    <img src={pointsIcon} alt="Points Icon" className="points-icon" />
                    <p className="points-text">{quizData.earned_points} Points Earned</p>
                </div>
                </div>
                {/* الأزرار */}
                <div className="buttons-container">
                    <button className="review-btn" onClick={() => navigate("/quiz-review", { state: { quizData } })}>
                        Review
                    </button>
                    <button className="continue-btn" onClick={() => navigate("/lessons")}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizComplete;
