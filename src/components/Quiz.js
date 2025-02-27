// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Quiz.css";
// import ExitIcon from "./images/Exit iconsvg.svg";
// import WizardIcon from "./images/Correct Potion.svg";
// import CorrectAnswerIcon from "./images/Correct check.svg";
// import WrongIcon from "./images/Wrong potion.svg";
// import WrongAnswerIcon from "./images/Wrong icon.svg";
// import HintIcon from "./images/Hint icon.svg"; // أيقونة التلميح

// const Quiz = () => {
//   const navigate = useNavigate();

//   const question = "What do computers understand?";
//   const options = [
//     "English and Arabic",
//     "Colors and shapes",
//     "0s and 1s",
//     "Funny sounds",
//   ];

//   const correctAnswer = "0s and 1s";
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isAnswered, setIsAnswered] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(null);

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//   };

//   const checkAnswer = () => {
//     if (selectedOption) {
//       const isCorrectAnswer = selectedOption === correctAnswer;
//       setIsCorrect(isCorrectAnswer);
//       setIsAnswered(true);
//     }
//   };

//   return (
//     <div className="quiz-container">
//       {/* زر الخروج */}
//       <button className="exit-button" onClick={() => navigate("/lessons")}>
//         <img src={ExitIcon} alt="Exit" className="exit-icon" />
//       </button>

//       {/* محتوى الاختبار */}
//       <div className="quiz-box">
//         <h1 className="quiz-header">Quiz 1: What is programming</h1>
//         <p className="quiz-question">{question}</p>

//         {/* خيارات الإجابة */}
//         <div className="quiz-options">
//           {options.map((option, index) => (
//             <button
//               key={index}
//               className={`option-button 
//                 ${selectedOption === option ? "selected" : ""} 
//                 ${isAnswered && option === correctAnswer ? "correct" : ""} 
//                 ${isAnswered && selectedOption === option && !isCorrect ? "wrong" : ""}`}
//               onClick={() => handleOptionClick(option)}
//               disabled={isAnswered}
//             >
//               {option}
//             </button>
//           ))}
//         </div>

//         {/* زر التحقق مع أيقونة التلميح */}
//         {!isAnswered ? (
//           <div className="quiz-footer">
//             <img src={HintIcon} alt="Hint" className="extra-icon" />
//             <button 
//               className="check-answer-button" 
//               onClick={checkAnswer} 
//               disabled={!selectedOption}
//             >
//               Check your answer
//             </button>
//           </div>
//         ) : (
//           <>
//             {isCorrect ? (
//               <div className="success-message">
//                 <img src={WizardIcon} alt="Wizard" className="wizard-icon" />
//                 <p className="congrats-text">Bravo, Young Wizard!</p>
//                 <div className="correct-answer-box">
//                   <img src={CorrectAnswerIcon} alt="Correct" className="correct-icon" />
//                   <p className="correct-text">Correct answer</p>
//                 </div>
//                 <button className="next-button" onClick={() => navigate("/next-question")}>
//                   Next
//                 </button>
//               </div>
//             ) : (
//               <div className="error-message">
//                 <img src={WrongIcon} alt="Wrong" className="wrong-icon" />
//                 <p className="error-text">Even the greatest wizards make mistakes</p>
//                 <div className="wrong-answer-box">
//                   <img src={WrongAnswerIcon} alt="Wrong" className="wrong-icon" />
//                   <p className="wrong-text">Wrong answer</p>
//                 </div>
//                 <button className="try-again-button" onClick={() => window.location.reload()}>
//                   Try Again
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Quiz;





//// last code


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Quiz.css";
// import ExitIcon from "./images/Exit iconsvg.svg";
// import WizardIcon from "./images/Correct Potion.svg";
// import CorrectAnswerIcon from "./images/Correct check.svg";
// import WrongIcon from "./images/Wrong potion.svg";
// import WrongAnswerIcon from "./images/Wrong icon.svg";
// import HintIcon from "./images/Hint icon.svg"; // أيقونة التلميح

// const Quiz = () => {
//   const navigate = useNavigate();

//   const question = "What do computers understand?";
//   const options = [
//     "English and Arabic",
//     "Colors and shapes",
//     "0s and 1s",
//     "Funny sounds",
//   ];
//   const correctAnswer = "0s and 1s";

//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isAnswered, setIsAnswered] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [hint, setHint] = useState(""); // حالة تخزين التلميح

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//   };

//   const checkAnswer = () => {
//     if (selectedOption) {
//       const isCorrectAnswer = selectedOption === correctAnswer;
//       setIsCorrect(isCorrectAnswer);
//       setIsAnswered(true);
//     }
//   };

//   const handleHintClick = () => {
//     setHint("Hint: Computers understand numbers (0s and 1s)."); // يمكنك استبداله بجلب البيانات من API
//   };

//   return (
//     <div className="quiz-container">
//       {/* زر الخروج */}
//       <button className="exit-button" onClick={() => navigate("/lessons")}>
//         <img src={ExitIcon} alt="Exit" className="exit-icon" />
//       </button>

//       {/* محتوى الاختبار */}
//       <div className="quiz-box">
//         <h1 className="quiz-header">Quiz 1: What is programming</h1>
//         <p className="quiz-question">{question}</p>

//         {/* خيارات الإجابة */}
//         <div className="quiz-options">
//           {options.map((option, index) => (
//             <button
//               key={index}
//               className={`option-button 
//                 ${selectedOption === option ? "selected" : ""} 
//                 ${isAnswered && option === correctAnswer ? "correct" : ""} 
//                 ${isAnswered && selectedOption === option && !isCorrect ? "wrong" : ""}`}
//               onClick={() => handleOptionClick(option)}
//               disabled={isAnswered}
//             >
//               {option}
//             </button>
//           ))}
//         </div>

//         {/* زر التحقق وأيقونة التلميح */}
//         {!isAnswered ? (
//           <div className="quiz-footer">
//             <img
//               src={HintIcon}
//               alt="Hint"
//               className="extra-icon"
//               onClick={handleHintClick} // عند الضغط على التلميح
//             />
//             <button
//               className="check-answer-button"
//               onClick={checkAnswer}
//               disabled={!selectedOption}
//             >
//               Check your answer
//             </button>
//           </div>
//         ) : (
//           <>
//             {isCorrect ? (
//               <div className="success-message">
//                 <img src={WizardIcon} alt="Wizard" className="wizard-icon" />
//                 <p className="congrats-text">Bravo, Young Wizard!</p>
//                 <div className="correct-answer-box">
//                   <img src={CorrectAnswerIcon} alt="Correct" className="correct-icon" />
//                   <p className="correct-text">Correct answer</p>
//                 </div>
//                 <button className="next-button" onClick={() => navigate("/next-question")}>
//                   Next
//                 </button>
//               </div>
//             ) : (
//               <div className="error-message">
//                 <img src={WrongIcon} alt="Wrong" className="wrong-icon" />
//                 <p className="error-text">Even the greatest wizards make mistakes</p>
//                 <div className="wrong-answer-box">
//                   <img src={WrongAnswerIcon} alt="Wrong" className="wrong-icon" />
//                   <p className="wrong-text">Wrong answer</p>
//                 </div>
//                 <button className="try-again-button" onClick={() => window.location.reload()}>
//                   Try Again
//                 </button>
//               </div>
//             )}
//           </>
//         )}

//         {/* مكان عرض التلميح عند الضغط على الأيقونة */}
//         {hint && <p className="hint-text">{hint}</p>}
//       </div>
//     </div>
//   );
// };

// export default Quiz;







import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";
import ExitIcon from "./images/Exit iconsvg.svg";
import WizardIcon from "./images/Correct Potion.svg";
import CorrectAnswerIcon from "./images/Correct check.svg";
import WrongIcon from "./images/Wrong potion.svg";
import WrongAnswerIcon from "./images/Wrong icon.svg";
import HintIcon from "./images/Hint icon.svg";

const Quiz = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [hint, setHint] = useState("");
    const [motivationMessage, setMotivationMessage] = useState("");

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await fetch('http://localhost:5000/api/quiz/lesson/1');
            const data = await response.json();
            setQuestions(data.questions);
        };

        fetchQuestions();
    }, []);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const checkAnswer = async () => {
        if (selectedOption) {
            const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
            setIsCorrect(isCorrectAnswer);
            setIsAnswered(true);

            // Send the answer to the backend to get the motivation message
            const response = await fetch('http://localhost:5000/api/quiz/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 1, // Replace with actual user ID
                    lesson_id: 1, // Replace with actual lesson ID
                    answers: [{
                        question_id: questions[currentQuestionIndex].id,
                        selected_answer: selectedOption
                    }]
                }),
            });

            const data = await response.json();
            // Set the motivation message from the backend response
            setMotivationMessage(data.answers[0].motivation_message);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setIsCorrect(null);
            setHint("");
            setMotivationMessage("");
        } else {
            navigate("/quiz-complete");
        }
    };

    const handleHintClick = () => {
        setHint(questions[currentQuestionIndex].hint);
    };

    if (questions.length === 0) {
        return <div>Loading...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <button className="exit-button" onClick={() => navigate("/lessons")}>
                <img src={ExitIcon} alt="Exit" className="exit-icon" />
            </button>

            <div className="quiz-box">
                <h1 className="quiz-header">Quiz 1: What is programming</h1>
                <p className="quiz-question">{currentQuestion.question}</p>

                <div className="quiz-options">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button 
                                ${selectedOption === option ? "selected" : ""} 
                                ${isAnswered && option === currentQuestion.correct_answer ? "correct" : ""} 
                                ${isAnswered && selectedOption === option && !isCorrect ? "wrong" : ""}`}
                            onClick={() => handleOptionClick(option)}
                            disabled={isAnswered}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {!isAnswered ? (
                    <div className="quiz-footer">
                        <img
                            src={HintIcon}
                            alt="Hint"
                            className="extra-icon"
                            onClick={handleHintClick}
                        />
                        <button
                            className="check-answer-button"
                            onClick={checkAnswer}
                            disabled={!selectedOption}
                        >
                            Check your answer
                        </button>
                    </div>
                ) : (
                    <>
                        {isCorrect ? (
                            <div className="success-message">
                                <img src={WizardIcon} alt="Wizard" className="wizard-icon" />
                                <p className="congrats-text">{motivationMessage}</p> {/* Use motivation message here */}
                                <div className="correct-answer-box">
                                    <img src={CorrectAnswerIcon} alt="Correct" className="correct-icon" />
                                    <p className="correct-text">Correct answer</p>
                                </div>
                                <button className="next-button" onClick={handleNextQuestion}>
                                    Next
                                </button>
                            </div>
                        ) : (
                            <div className="error-message">
                                <img src={WrongIcon} alt="Wrong" className="wrong-icon" />
                                <p className="error-text">{motivationMessage}</p> {/* Use motivation message here */}
                                <div className="wrong-answer-box">
                                    <img src={WrongAnswerIcon} alt="Wrong" className="wrong-icon" />
                                    <p className="wrong-text">Wrong answer</p>
                                </div>
                                {/* <button className="try-again-button" onClick={() => window.location.reload()}>
                                    Try Again
                                </button> */}
                                <button className="next-button" onClick={handleNextQuestion}>
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {hint && <p className="hint-text">{hint}</p>}
            </div>
        </div>
    );
};

export default Quiz;