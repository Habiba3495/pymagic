// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom"; // استيراد useParams
// import "./Quiz.css";
// import ExitIcon from "./images/Exit iconsvg.svg";
// import WizardIcon from "./images/Correct Potion.svg";
// import CorrectAnswerIcon from "./images/Correct check.svg";
// import WrongIcon from "./images/Wrong potion.svg";
// import WrongAnswerIcon from "./images/Wrong icon.svg";
// import HintIcon from "./images/Hint icon.svg";

// const Quiz = () => {
//     const navigate = useNavigate();
//     const { lessonId } = useParams(); // استخراج معرّف الدرس من الرابط
//     const [questions, setQuestions] = useState([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [isAnswered, setIsAnswered] = useState(false);
//     const [isCorrect, setIsCorrect] = useState(null);
//     const [hint, setHint] = useState("");
//     const [motivationMessage, setMotivationMessage] = useState("");

//     // useEffect(() => {
//     //     const fetchQuestions = async () => {
//     //         try {
//     //             const response = await fetch(`http://localhost:5000/api/quiz/lesson/${lessonId}`);
//     //             if (!response.ok) {
//     //                 throw new Error("Failed to fetch questions");
//     //             }
//     //             const data = await response.json();
//     //             setQuestions(data.questions);
//     //         } catch (error) {
//     //             console.error("Error fetching quiz questions:", error);
//     //             // Default questions in case of API failure
//     //             setQuestions([
//     //                 {
//     //                     id: 1,
//     //                     question: "What is Python?",
//     //                     options: ["A snake", "A programming language", "A type of coffee", "A car brand"],
//     //                     correct_answer: "A programming language",
//     //                     hint: "It's widely used in software development."
//     //                 },
//     //                 {
//     //                     id: 2,
//     //                     question: "What does HTML stand for?",
//     //                     options: ["Hyper Text Markup Language", "High Tech Machine Learning", "Home Tool Machine Language", "Hyperlink and Text Management Language"],
//     //                     correct_answer: "Hyper Text Markup Language",
//     //                     hint: "It's used to structure web pages."
//     //                 }
//     //             ]);
//     //         }
//     //     };

//     //     fetchQuestions();
//     // }, [lessonId]); // إعادة جلب الأسئلة عند تغيير lessonId

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 const response = await fetch(`http://localhost:5000/api/quiz/lesson/${lessonId}`);
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch questions");
//                 }
//                 const data = await response.json();
//                 setQuestions(data.questions);
//             } catch (error) {
//                 console.error("Error fetching quiz questions:", error);
//                 setQuestions([
//                     {
//                         id: 1,
//                         question: "What is Python?",
//                         options: ["A snake", "A programming language", "A type of coffee", "A car brand"],
//                         correct_answer: "A programming language",
//                         hint: "It's widely used in software development."
//                     },
//                     {
//                         id: 2,
//                         question: "Which data type is immutable in Python?",
//                         options: ["List", "Tuple", "Dictionary", "Set"],
//                         correct_answer: "Tuple",
//                         hint: "Once created, its elements cannot be changed."
//                     },
//                     {
//                         id: 3,
//                         question: "What keyword is used to define a function in Python?",
//                         options: ["define", "func", "def", "function"],
//                         correct_answer: "def",
//                         hint: "It starts the function definition."
//                     },
//                     {
//                         id: 4,
//                         question: "Which of the following is a loop structure in Python?",
//                         options: ["if", "while", "switch", "try"],
//                         correct_answer: "while",
//                         hint: "It executes as long as the condition remains true."
//                     },
//                     {
//                         id: 5,
//                         question: "How do you insert a comment in Python?",
//                         options: ["// This is a comment", "# This is a comment", "-- This is a comment", "/* This is a comment */"],
//                         correct_answer: "# This is a comment",
//                         hint: "It starts with a special symbol."
//                     }
//                 ]);
//             }
//         };
    
//         fetchQuestions();
//     }, [lessonId]);
    

//     const handleOptionClick = (option) => {
//         setSelectedOption(option);
//     };

//     // const checkAnswer = async () => {
//     //     if (selectedOption) {
//     //         const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
//     //         setIsCorrect(isCorrectAnswer);
//     //         setIsAnswered(true);

//     //         try {
//     //             const response = await fetch('http://localhost:5000/api/quiz/submit', {
//     //                 method: 'POST',
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                 },
//     //                 body: JSON.stringify({
//     //                     user_id: 1,
//     //                     lesson_id: lessonId, // استخدام lessonId ديناميكيًا
//     //                     answers: [{
//     //                         question_id: questions[currentQuestionIndex].id,
//     //                         selected_answer: selectedOption
//     //                     }]
//     //                 }),
//     //             });

//     const checkAnswer = async () => {  // ✅ تأكد أن الدالة async
//         if (selectedOption) {
//             const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
//             setIsCorrect(isCorrectAnswer);
//             setIsAnswered(true);
    
//             try {
//                 const response = await fetch('http://localhost:5000/api/quiz/submit', {  // ✅ await داخل دالة async
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         user_id: 1,
//                         lesson_id: lessonId, 
//                         answers: [{
//                             question_id: questions[currentQuestionIndex].id,
//                             selected_answer: selectedOption
//                         }]
//                     }),
//                 });
    
//                 const data = await response.json();
//                 setMotivationMessage(data.answers?.[0]?.motivation_message || "Good attempt! Keep going!");
//             } catch (error) {
//                 console.error("Error submitting answer:", error);
//                 setMotivationMessage("Great effort! Keep practicing!");
//             }
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
//                 <h1 className="quiz-header">Quiz {lessonId}: What is programming</h1> {/* عرض معرّف الدرس */}
//                 <p className="quiz-question">{currentQuestion.question}</p>

//                 {/* <div className="quiz-options">
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
//                 </div> */}

//                     {/* <div className="quiz-options">
//                     {currentQuestion.options.map((option, index) => (
//                         <button
//                             key={index}
//                             className={`option-button 
//                                 ${isAnswered && option === currentQuestion.correct_answer ? "correct" : ""} 
//                                 ${isAnswered && selectedOption === option && !isCorrect ? "wrong" : ""} 
//                                 ${selectedOption === option ? "selected" : ""}`}
//                            onClick={() => handleOptionClick(option)}
//                            disabled={isAnswered}
//                         >
//                            {option}
//                         </button>
//                     ))}
//                 </div> */}

//                 <div className="quiz-options">
//     {currentQuestion.options.map((option, index) => (
//         <button
//             key={index}
//             className={`option-button 
//                 ${selectedOption === option ? "selected" : ""} 
//                 ${isAnswered && option === currentQuestion.correct_answer ? "correct" : ""} 
//                 ${isAnswered && selectedOption === option && !isCorrect ? "wrong" : ""}`}
//             onClick={() => handleOptionClick(option)}
//             disabled={isAnswered}
//         >
//             {option}
//         </button>
//     ))}
// </div>


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
//                                 <p className="congrats-text">{motivationMessage}</p>
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
//                                 <p className="error-text">{motivationMessage}</p>
//                                 <div className="wrong-answer-box">
//                                     <img src={WrongAnswerIcon} alt="Wrong" className="wrong-icon" />
//                                     <p className="wrong-text">Wrong answer</p>
//                                 </div>
//                                 <button className="next-button" onClick={handleNextQuestion}>
//                                     Next
//                                 </button>
//                             </div>
//                         )}
//                     </>
//                 )}

//                 {hint && <p className="hint-text"><p>Hint:</p>{hint}</p>}
//             </div>
//         </div>
//     );
// };

// export default Quiz;


import React, { useState, useEffect } from "react";
import { useNavigate , useParams } from "react-router-dom";
import "./Quiz.css";
import ExitIcon from "./images/Exit iconsvg.svg";
import WizardIcon from "./images/Correct Potion.svg";
import CorrectAnswerIcon from "./images/Correct check.svg";
import WrongIcon from "./images/Wrong potion.svg";
import WrongAnswerIcon from "./images/Wrong icon.svg";
import HintIcon from "./images/Hint icon.svg";

const Quiz = () => {
    const navigate = useNavigate();
    const { lessonId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [hint, setHint] = useState("");
    const [motivationMessage, setMotivationMessage] = useState("");
    const [answers, setAnswers] = useState([]); // تخزين الإجابات مؤقتًا

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/quiz/lesson/${lessonId}`);
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
    }, [lessonId]); 

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const checkAnswer = () => {
        if (selectedOption) {
            const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
            setIsCorrect(isCorrectAnswer);
            setIsAnswered(true);

            // تخزين الإجابة مؤقتًا
            const newAnswer = {
                question_id: questions[currentQuestionIndex].id,
                selected_answer: selectedOption,
                is_correct: isCorrectAnswer,
            };
            setAnswers([...answers, newAnswer]);

            // إظهار رسالة التحفيز
            setMotivationMessage(isCorrectAnswer ? "Correct! Well done!" : "Incorrect. Try again!");
        }
    };

    const handleNextQuestion = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setIsCorrect(null);
            setHint("");
            setMotivationMessage("");
        } else {
            // إرسال جميع الإجابات عند الانتهاء من الاختبار
            try {
                const response = await fetch('http://localhost:5000/api/quiz/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: 1, // change to dynamic user ID
                        lesson_id: lessonId, 
                        answers: answers,
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    navigate("/quiz-complete");
                } else {
                    console.error("Error submitting quiz:", data.message);
                }
            } catch (error) {
                console.error("Error submitting quiz:", error);
            }
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