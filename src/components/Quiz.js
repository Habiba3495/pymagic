
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Quiz.css";
// import ExitIcon from "./images/Exit iconsvg.svg";
// import WizardIcon from "./images/Correct Potion.svg";
// import CorrectAnswerIcon from "./images/Correct check.svg";
// import WrongIcon from "./images/Wrong potion.svg";
// import WrongAnswerIcon from "./images/Wrong icon.svg";
// import HintIcon from "./images/Hint icon.svg";

// const Quiz = () => {
//     const navigate = useNavigate();
//     const [questions, setQuestions] = useState([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [isAnswered, setIsAnswered] = useState(false);
//     const [isCorrect, setIsCorrect] = useState(null);
//     const [hint, setHint] = useState("");
//     const [motivationMessage, setMotivationMessage] = useState("");

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             const response = await fetch('http://localhost:5000/api/quiz/lesson/1');
//             const data = await response.json();
//             setQuestions(data.questions);
//         };

//         fetchQuestions();
//     }, []);

//     const handleOptionClick = (option) => {
//         setSelectedOption(option);
//     };

//     const checkAnswer = async () => {
//         if (selectedOption) {
//             const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
//             setIsCorrect(isCorrectAnswer);
//             setIsAnswered(true);

//             // Send the answer to the backend to get the motivation message
//             const response = await fetch('http://localhost:5000/api/quiz/submit', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     user_id: 1, // Replace with actual user ID
//                     lesson_id: 1, // Replace with actual lesson ID
//                     answers: [{
//                         question_id: questions[currentQuestionIndex].id,
//                         selected_answer: selectedOption
//                     }]
//                 }),
//             });

//             const data = await response.json();
//             // Set the motivation message from the backend response
//             setMotivationMessage(data.answers[0].motivation_message);
//         }
//     };

//     const handleNextQuestion = () => {
//         if (currentQuestionIndex < questions.length - 1) {
//             setCurrentQuestionIndex(currentQuestionIndex + 1);
//             setSelectedOption(null);
//             setIsAnswered(false);
//             setIsCorrect(null);
//             setHint("");
//             setMotivationMessage("");
//         } else {
//             navigate("/quiz-complete");
//         }
//     };

//     const handleHintClick = () => {
//         setHint(questions[currentQuestionIndex].hint);
//     };

//     if (questions.length === 0) {
//         return <div>Loading...</div>;
//     }

//     const currentQuestion = questions[currentQuestionIndex];

//     return (
//         <div className="quiz-container">
//             <button className="exit-button" onClick={() => navigate("/lessons")}>
//                 <img src={ExitIcon} alt="Exit" className="exit-icon" />
//             </button>

//             <div className="quiz-box">
//                 <h1 className="quiz-header">Quiz 1: What is programming</h1>
//                 <p className="quiz-question">{currentQuestion.question}</p>

//                 <div className="quiz-options">
//                     {currentQuestion.options.map((option, index) => (
//                         <button
//                             key={index}
//                             className={`option-button 
//                                 ${selectedOption === option ? "selected" : ""} 
//                                 ${isAnswered && option === currentQuestion.correct_answer ? "correct" : ""} 
//                                 ${isAnswered && selectedOption === option && !isCorrect ? "wrong" : ""}`}
//                             onClick={() => handleOptionClick(option)}
//                             disabled={isAnswered}
//                         >
//                             {option}
//                         </button>
//                     ))}
//                 </div>

//                 {!isAnswered ? (
//                     <div className="quiz-footer">
//                         <img
//                             src={HintIcon}
//                             alt="Hint"
//                             className="extra-icon"
//                             onClick={handleHintClick}
//                         />
//                         <button
//                             className="check-answer-button"
//                             onClick={checkAnswer}
//                             disabled={!selectedOption}
//                         >
//                             Check your answer
//                         </button>
//                     </div>
//                 ) : (
//                     <>
//                         {isCorrect ? (
//                             <div className="success-message">
//                                 <img src={WizardIcon} alt="Wizard" className="wizard-icon" />
//                                 <p className="congrats-text">{motivationMessage}</p> {/* Use motivation message here */}
//                                 <div className="correct-answer-box">
//                                     <img src={CorrectAnswerIcon} alt="Correct" className="correct-icon" />
//                                     <p className="correct-text">Correct answer</p>
//                                 </div>
//                                 <button className="next-button" onClick={handleNextQuestion}>
//                                     Next
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="error-message">
//                                 <img src={WrongIcon} alt="Wrong" className="wrong-icon" />
//                                 <p className="error-text">{motivationMessage}</p> {/* Use motivation message here */}
//                                 <div className="wrong-answer-box">
//                                     <img src={WrongAnswerIcon} alt="Wrong" className="wrong-icon" />
//                                     <p className="wrong-text">Wrong answer</p>
//                                 </div>
//                                 {/* <button className="try-again-button" onClick={() => window.location.reload()}>
//                                     Try Again
//                                 </button> */}
//                                 <button className="next-button" onClick={handleNextQuestion}>
//                                     Next
//                                 </button>
//                             </div>
//                         )}
//                     </>
//                 )}

//                 {hint && <p className="hint-text">{hint}</p>}
//             </div>
//         </div>
//     );
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
            try {
                const response = await fetch('http://localhost:5000/api/quiz/lesson/1');
                if (!response.ok) {
                    throw new Error("Failed to fetch questions");
                }
                const data = await response.json();
                setQuestions(data.questions);
            } catch (error) {
                console.error("Error fetching quiz questions:", error);
                // Default questions in case of API failure
                setQuestions([
                    {
                        id: 1,
                        question: "What is Python?",
                        options: ["A snake", "A programming language", "A type of coffee", "A car brand"],
                        correct_answer: "A programming language",
                        hint: "It's widely used in software development."
                    },
                    {
                        id: 2,
                        question: "What does HTML stand for?",
                        options: ["Hyper Text Markup Language", "High Tech Machine Learning", "Home Tool Machine Language", "Hyperlink and Text Management Language"],
                        correct_answer: "Hyper Text Markup Language",
                        hint: "It's used to structure web pages."
                    }
                ]);
            }
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

            try {
                const response = await fetch('http://localhost:5000/api/quiz/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: 1,
                        lesson_id: 1,
                        answers: [{
                            question_id: questions[currentQuestionIndex].id,
                            selected_answer: selectedOption
                        }]
                    }),
                });

                const data = await response.json();
                setMotivationMessage(data.answers?.[0]?.motivation_message || "Good attempt! Keep going!");
            } catch (error) {
                console.error("Error submitting answer:", error);
                setMotivationMessage("Great effort! Keep practicing!");
            }
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
                                <p className="congrats-text">{motivationMessage}</p>
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
                                <p className="error-text">{motivationMessage}</p>
                                <div className="wrong-answer-box">
                                    <img src={WrongAnswerIcon} alt="Wrong" className="wrong-icon" />
                                    <p className="wrong-text">Wrong answer</p>
                                </div>
                                <button className="next-button" onClick={handleNextQuestion}>
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {hint && <p className="hint-text"><p>Hint:</p>{hint}</p>}
            </div>
        </div>
    );
};

export default Quiz;
