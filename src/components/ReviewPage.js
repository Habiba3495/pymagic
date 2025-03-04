// import React, { useEffect, useState } from "react"; // Added useEffect and useState
// import { useLocation, useNavigate } from "react-router-dom";
// import "./ReviewPage.css"; // Assuming you have a CSS file for styling


// function ReviewPage() {
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


//     // Function to handle navigation and clear quiz data
//     const handleNavigation = (path) => {
//         localStorage.removeItem("quizData"); // Clear quiz data
//         navigate(path); // Navigate to the specified path
//     };

//     const { score, earned_points, is_passed, answers } = quizData || {};

//     if (!quizData) {
//         return (
//             <div className="review-page">
//                 <h1>No Quiz Data Found</h1>
//                 <p>Please complete a quiz to view your results.</p>
//                 <button onClick={() => navigate("/lessons")}>Go to Lessons</button>
//             </div>
//         );
//     }

//     return (////////////////
//         <div className="review-page">
//             <h1>Quiz Review</h1>
//             <h2>Your Score: {score}/10</h2>
//             <h2>Earned Points: {earned_points}</h2>
//             <h2>Passed: {is_passed ? "Yes" : "No"}</h2>

//             <div className="answers-list">
//                 {answers.map((answer, index) => (
//                     <div key={index} className="answer-item">
//                         <p><strong>Question ID:</strong> {answer.question_id}</p>
//                         <p><strong>Your Answer:</strong> {answer.selected_answer}</p>
//                         <p><strong>Correct Answer:</strong> {answer.correct_answer}</p>
//                         <p><strong>Feedback:</strong> {answer.motivation_message}</p>
//                         <hr />
//                     </div>
//                 ))}
//             </div>

//             <button onClick={() => handleNavigation("/lessons")}>Go to Lessons</button>
//             <button onClick={() => handleNavigation("/progress-report")}>Check Progress Report</button>
//         </div>
//     );
// };

// export default ReviewPage;


/// last one
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./ReviewPage.css"; // Create this CSS file for styling

// const ReviewPage = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();
//     const { quizData } = state || {};

//     console.log("Quiz Data in QuizReview:", quizData); // Debug log

//     if (!quizData) {
//         return <div>No quiz data available. Please go back and try again.</div>;
//     }

//     if (!quizData.answers || quizData.answers.length === 0) {
//         return <div>No answers available for review. Please check your quiz submission.</div>;
//     }

//     return (
//         <div className="quiz-review-container">
//             <h1>Quiz Review: What is Programming</h1>
//             <div className="quiz-box">
//                 {quizData.answers.map((answer, index) => (
//                     <div key={answer.question_id} className="question-box">
//                         <p className="question-text">{index + 1}. {answer.question}</p>
//                         <div className="options-container">
//                             {answer.options.map((option, idx) => (
//                                 <div
//                                     key={idx}
//                                     className={`option ${option === answer.correct_answer ? 'correct' : ''} ${option === answer.user_answer ? 'user-answer' : ''}`}
//                                 >
//                                     {option}
//                                     {option === answer.correct_answer && <span className="correct-indicator"> (Correct)</span>}
//                                     {option === answer.user_answer && option !== answer.correct_answer && <span className="wrong-indicator"> (Your Answer - Incorrect)</span>}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ))}
    //         </div>
    //         <button onClick={() => navigate("/lessons")}>Go to Lessons</button>
    //         <button onClick={() => navigate("/progress-report/1")}>Check Progress Report</button> {/* Use static userId */}        </div>
    // );
// };

// export default ReviewPage;



// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./ReviewPage.css"; // Ensure this CSS file exists

// const ReviewPage = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();
//     const { quizData } = state || {};

//     console.log("Quiz Data in ReviewPage:", quizData); // Debug log to inspect data

//     // Check if quizData or quizData.answers is undefined or invalid
//     if (!quizData) {
//         return (
//             <div className="quiz-review-container">
//                 <p>No quiz data available. Please go back and try again.</p>
//                 <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
//             </div>
//         );
//     }

//     if (!quizData.answers || quizData.answers.length === 0 || !quizData.answers[0]?.question_id) {
//         return (
//             <div className="quiz-review-container">
//                 <p>No answers available for review. Please check your quiz submission or contact support.</p>
//                 <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
//             </div>
//         );
//     }

//     return (
//         <div className="quiz-review-container">
//             <h1>Quiz Review: What is Programming</h1>
//             <div className="quiz-box">
//                 {quizData.answers.map((answer, index) => (
//                     <div key={answer.question_id || index} className="question-box">
//                         <p className="question-text">{index + 1}. {answer.question || `Question ${index + 1}`}</p>
//                         <div className="options-container">
//                             {answer.options?.map((option, idx) => (
//                                 <div
//                                     key={idx}
//                                     className={`option ${option === answer.correct_answer ? 'correct' : ''} ${option === answer.user_answer ? 'user-answer' : ''}`}
//                                 >
//                                     {option}
//                                     {option === answer.correct_answer && <span className="correct-indicator"> (Correct)</span>}
//                                     {option === answer.user_answer && option !== answer.correct_answer && <span className="wrong-indicator"> (Your Answer - Incorrect)</span>}
//                                 </div>
//                             )) || <p>No options available for this question.</p>}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {/* <div className="buttons-container">
//                 <button onClick={() => navigate("/lessons")}>Go to Lessons</button>
//                 <button onClick={() => navigate("/progress-report/1")}>Check Progress Report</button>
//             </div> */}
//             <button onClick={() => navigate("/lessons")}>Go to Lessons</button>
//             <button onClick={() => navigate("/progress-report/1")}>Check Progress Report</button> {/* Use static userId */}   
    
//         </div>
//     );
// };

// export default ReviewPage;


// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./ReviewPage.css";

// const ReviewPage = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { quizData } = state || {};

//   console.log("Quiz Data in ReviewPage:", quizData);

//   if (!quizData) {
//     return (
//       <div className="quiz-review-container">
//         <p>No quiz data available. Please go back and try again.</p>
//         <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
//       </div>
//     );
//   }

//   if (!quizData.answers || quizData.answers.length === 0) {
//     return (
//       <div className="quiz-review-container">
//         <p>No answers available for review. Please check your quiz submission or contact support.</p>
//         <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
//       </div>
//     );
//   }

//   return (
//     <div className="quiz-review-container">
//       <h1>Quiz Review: What is Programming</h1>
//       <div className="quiz-box">
//         {quizData.answers.map((answer, index) => (
//           <div key={answer.question_id || index} className="question-box">
//             <p className="question-text">{index + 1}. {answer.question || `Question ${index + 1}`}</p>
//             <div className="options-container">
//               {answer.options?.map((option, idx) => (
//                 <div key={idx} className="option">
//                   {option}
//                 </div>
//               )) || <p>No options available for this question.</p>}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="buttons-container">
//       <button onClick={() => navigate("/lessons")}>Go to Lessons</button>
//       <button onClick={() => navigate("/progress-report/1")}>Check Progress Report</button> {/* Use static userId */}
//       </div>
//     </div>
//   );
// };

// export default ReviewPage;


// ReviewPage.js (ensure it’s up to date)
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./ReviewPage.css";

// const ReviewPage = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { quizData } = state || {};

//   console.log("Quiz Data in ReviewPage:", quizData);

//   if (!quizData) {
//     return (
//       <div className="quiz-review-container">
//         <p>No quiz data available. Please go back and try again.</p>
//         <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
//       </div>
//     );
//   }

//   if (!quizData.answers || quizData.answers.length === 0) {
//     return (
//       <div className="quiz-review-container">
//         <p>No answers available for review. Please check your quiz submission or contact support.</p>
//         <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
//       </div>
//     );
//   }

//   return (
//     <div className="quiz-review-container">
//       <h1>Quiz Review: What is Programming</h1>
//       <div className="quiz-box">
//         {quizData.answers.map((answer, index) => (
//           <div key={answer.question_id || index} className="question-box">
//             <p className="question-text">{index + 1}. {answer.question || `Question ${index + 1}`}</p>
//             <div className="options-container">
//               {answer.options?.map((option, idx) => (
//                 <div key={idx} className="option">
//                   {option}
//                 </div>
//               )) || <p>No options available for this question.</p>}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="buttons-container">
//         <button onClick={() => navigate("/lessons")}>Go to Lessons</button>
//         <button onClick={() => navigate("/progress-report/1")}>Check Progress Report</button>
//       </div>
//     </div>
//   );
// };

// export default ReviewPage;




// src/components/ReviewPage.js
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./ReviewPage.css";

// const ReviewPage = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { quizData } = state || {};

//   if (!quizData) {
//     return (
//       <div className="quiz-review-container">
//         <p>No quiz data available. Please go back and try again.</p>
//         <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
//       </div>
//     );
//   }

//   if (!quizData.answers || quizData.answers.length === 0) {
//     return (
//       <div className="quiz-review-container">
//         <p>No answers available for review. Please check your quiz submission or contact support.</p>
//         <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
//       </div>
//     );
//   }

//   return (
//     <div className="quiz-review-container">
//       <h1>Quiz Review: {quizData.answers[0]?.question || "Quiz Review"}</h1>
//       <div className="quiz-box">
//         {quizData.answers.map((answer, index) => (
//           <div key={answer.question_id || index} className="question-box">
//             <p className="question-text">{index + 1}. {answer.question}</p>
//             <div className="options-container">
//               {answer.options?.map((option, idx) => (
//                 <div
//                   key={idx}
//                   className={`option ${answer.user_answer === option ? 'user-answer' : ''} ${
//                     answer.correct_answer === option ? 'correct-answer' : ''
//                   }`}
//                 >
//                   {option}
//                 </div>
//               ))}
//               <p>User Answer: {answer.user_answer || 'No answer provided'}</p>
//               <p>Correct Answer: {answer.correct_answer}</p>
//               <p>Correct? {answer.isCorrect ? 'Yes' : 'No'}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="buttons-container">
//         <button onClick={() => navigate("/lessons")}>Go to Lessons</button>
//         <button onClick={() => navigate("/progress-report/1")}>Check Progress Report</button>
//       </div>
//     </div>
//   );
// };

// export default ReviewPage;


// src/components/ReviewPage.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReviewPage.css";

const ReviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { quizData } = state || {};

  if (!quizData) {
    return (
      <div className="quiz-review-container">
        <p>No quiz data available. Please go back and try again.</p>
        <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
      </div>
    );
  }

  if (!quizData.answers || quizData.answers.length === 0) {
    return (
      <div className="quiz-review-container">
        <p>No answers available for review. Please check your quiz submission or contact support.</p>
        <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
      </div>
    );
  }

  return (
    <div className="quiz-review-container">
      <h1>Quiz {quizData.answers[0]?.question_id || 1}: {quizData.answers[0]?.question || "Quiz Review"}</h1>
      <div className="quiz-box">
        {quizData.answers.map((answer, index) => (
          <div key={answer.question_id || index} className="question-box">
            <p className="question-text">{index + 1}. {answer.question}</p>
            <div className="options-container">
              {answer.options?.map((option, idx) => (
                <div
                  key={idx}
                  className={`option ${answer.user_answer === option ? 'user-answer' : ''} ${
                    answer.correct_answer === option ? 'correct-answer' : ''
                  }`}
                >
                  {option}
                </div>
              ))}
              <p>User Answer: {answer.user_answer || 'No answer provided'}</p>
              <p>Correct Answer: {answer.correct_answer}</p>
              <p>Correct? {answer.isCorrect ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="buttons-container">
        <button className="rbutton" onClick={() => navigate("/lessons")}>Go to Lessons</button>
        <button className="rbutton" onClick={() => navigate("/progress-report/1")}>Check Progress Report</button>
      </div>
    </div>
  );
};

export default ReviewPage;