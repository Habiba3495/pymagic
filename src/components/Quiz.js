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
    const [answers, setAnswers] = useState([]); 
    const userId = 1; 

    useEffect(() => {
        // const fetchQuestions = async () => {
        //     try {
        //         const response = await fetch(`http://localhost:5000/api/quiz/lesson/${lessonId}`);
        //         if (!response.ok) {
        //             throw new Error("Failed to fetch questions");
        //         }
        //         const data = await response.json();
        //         setQuestions(data.questions);
        //     } catch (error) {
        //         console.error("Error fetching quiz questions:", error);
        //         // Default questions in case of API failure
        //         setQuestions([
        //             {
        //                 id: 1,
        //                 question: "What is Python?",
        //                 options: ["A snake", "A programming language", "A type of coffee", "A car brand"],
        //                 correct_answer: "A programming language",
        //                 hint: "It's widely used in software development."
        //             },
        //             {
        //                 id: 2,
        //                 question: "What does HTML stand for?",
        //                 options: ["Hyper Text Markup Language", "High Tech Machine Learning", "Home Tool Machine Language", "Hyperlink and Text Management Language"],
        //                 correct_answer: "Hyper Text Markup Language",
        //                 hint: "It's used to structure web pages."
        //             },
        //             { id: 3,
        //                  question: "Which company developed JavaScript?", 
        //                  options: ["Microsoft", "Netscape", "Apple", "Google"], 
        //                  correct_answer: "Netscape",
        //                   hint: "It was a big browser company in the 90s." },
        //             { id: 4, question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style Syntax", "Computer Style System", "Code Styling Structure"], correct_answer: "Cascading Style Sheets", hint: "It is used for styling web pages." },
        //             { id: 5, question: "Which programming language is known as the 'mother of all languages'?", options: ["C", "Python", "Java", "Assembly"], correct_answer: "C", hint: "It's the foundation of many modern languages." },
        //             { id: 6, question: "Which HTML tag is used to create a hyperlink?", options: ["<a>", "<link>", "<href>", "<url>"], correct_answer: "<a>", hint: "It stands for 'anchor' tag." },
        //             { id: 7, question: "What does API stand for?", options: ["Application Programming Interface", "Advanced Python Integration", "Automated Process Implementation", "Apple Product Interface"], correct_answer: "Application Programming Interface", hint: "It allows different software systems to communicate." },
        //             { id: 8, question: "Which symbol is used for comments in Python?", options: ["//", "#", "/* */", "--"], correct_answer: "#", hint: "It starts with a hash symbol." },
        //             { id: 9, question: "What is the default file extension for Python scripts?", options: [".java", ".py", ".js", ".cpp"], correct_answer: ".py", hint: "It contains only two letters." },
        //             { id: 10, question: "Which JavaScript keyword is used to declare a variable?", options: ["let", "var", "const", "All of the above"], correct_answer: "All of the above", hint: "There are multiple ways to declare variables." },
        //             { id: 11, question: "Which of the following is NOT a programming language?", options: ["Java", "HTML", "Python", "C++"], correct_answer: "HTML", hint: "It is used to structure web pages, not for programming logic." },
        //             { id: 12, question: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java System Online Network", "Jumbo Syntax of Numbers", "None of the above"], correct_answer: "JavaScript Object Notation", hint: "It's a lightweight data format." },
        //             { id: 13, question: "Which of these is NOT a JavaScript framework?", options: ["React", "Angular", "Vue", "Django"], correct_answer: "Django", hint: "It's a Python framework." },
        //             { id: 14, question: "What is the main purpose of Git?", options: ["Operating System", "Version Control", "Programming Language", "Database"], correct_answer: "Version Control", hint: "It tracks code changes over time." },
        //             { id: 15, question: "Which SQL command is used to retrieve data?", options: ["SELECT", "INSERT", "UPDATE", "DELETE"], correct_answer: "SELECT", hint: "It extracts data from tables." },
        //         ]);
        //     }
        // };
        
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/quiz/lesson/${lessonId}?limit=10`);
                if (!response.ok) {
                    throw new Error("Failed to fetch questions");
                }
                const data = await response.json();
                setQuestions(data.questions);
            } catch (error) {
                console.error("Error fetching quiz questions:", error);
        
                // 15 سؤال افتراضي
                const defaultQuestions = [
                    { id: 1, question: "What is Python?", options: ["A snake", "A programming language", "A coffee", "A car brand"], correct_answer: "A programming language", hint: "It's used in software development." },
                    { id: 2, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Machine Learning", "Home Tool Machine Language", "Hyperlink and Text Management Language"], correct_answer: "Hyper Text Markup Language", hint: "It's used to structure web pages." },
                    { id: 3, question: "Which company developed JavaScript?", options: ["Microsoft", "Netscape", "Apple", "Google"], correct_answer: "Netscape", hint: "It was a big browser company in the 90s." },
                    { id: 4, question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style Syntax", "Computer Style System", "Code Styling Structure"], correct_answer: "Cascading Style Sheets", hint: "It is used for styling web pages." },
                    { id: 5, question: "Which programming language is known as the 'mother of all languages'?", options: ["C", "Python", "Java", "Assembly"], correct_answer: "C", hint: "It's the foundation of many modern languages." },
                    { id: 6, question: "Which HTML tag is used to create a hyperlink?", options: ["<a>", "<link>", "<href>", "<url>"], correct_answer: "<a>", hint: "It stands for 'anchor' tag." },
                    { id: 7, question: "What does API stand for?", options: ["Application Programming Interface", "Advanced Python Integration", "Automated Process Implementation", "Apple Product Interface"], correct_answer: "Application Programming Interface", hint: "It allows different software systems to communicate." },
                    { id: 8, question: "Which symbol is used for comments in Python?", options: ["//", "#", "/* */", "--"], correct_answer: "#", hint: "It starts with a hash symbol." },
                    { id: 9, question: "What is the default file extension for Python scripts?", options: [".java", ".py", ".js", ".cpp"], correct_answer: ".py", hint: "It contains only two letters." },
                    { id: 10, question: "Which JavaScript keyword is used to declare a variable?", options: ["let", "var", "const", "All of the above"], correct_answer: "All of the above", hint: "There are multiple ways to declare variables." },
                    { id: 11, question: "Which of the following is NOT a programming language?", options: ["Java", "HTML", "Python", "C++"], correct_answer: "HTML", hint: "It is used to structure web pages, not for programming logic." },
                    { id: 12, question: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java System Online Network", "Jumbo Syntax of Numbers", "None of the above"], correct_answer: "JavaScript Object Notation", hint: "It's a lightweight data format." },
                    { id: 13, question: "Which of these is NOT a JavaScript framework?", options: ["React", "Angular", "Vue", "Django"], correct_answer: "Django", hint: "It's a Python framework." },
                    { id: 14, question: "What is the main purpose of Git?", options: ["Operating System", "Version Control", "Programming Language", "Database"], correct_answer: "Version Control", hint: "It tracks code changes over time." },
                    { id: 15, question: "Which SQL command is used to retrieve data?", options: ["SELECT", "INSERT", "UPDATE", "DELETE"], correct_answer: "SELECT", hint: "It extracts data from tables." },
                ];
        
                // خلط الأسئلة واختيار 10 منها بشكل عشوائي
                const shuffledQuestions = defaultQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
        
                setQuestions(shuffledQuestions);
            }
        };
        
        fetchQuestions();
    }, [lessonId]); 

    // const handleOptionClick = (option) => {
    //     setSelectedOption(option);
    // };
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsAnswered(false); // إعادة التهيئة عند تغيير الخيار
        setIsCorrect(null); 
        setHint(""); 
        setMotivationMessage("");
    };
    
    // const checkAnswer = () => {
    //     if (selectedOption) {
    //         const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
    //         setIsCorrect(isCorrectAnswer);
    //         setIsAnswered(true);

    //         // تخزين الإجابة مؤقتًا
    //         const newAnswer = {
    //             question_id: questions[currentQuestionIndex].id,
    //             selected_answer: selectedOption,
    //             is_correct: isCorrectAnswer,
    //         };
    //         setAnswers([...answers, newAnswer]);

    //         // إظهار رسالة التحفيز
    //         setMotivationMessage(isCorrectAnswer ? "Correct! Well done!" : "Incorrect. Try again!");
    //     }
    // };

    const checkAnswer = () => {
        if (selectedOption) {
            const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
            setIsCorrect(isCorrectAnswer);
            setIsAnswered(true);
    
            const newAnswer = {
                question_id: questions[currentQuestionIndex].id,
                selected_answer: selectedOption,
                is_correct: isCorrectAnswer,
            };
    
            // تحديث الإجابات في الحالة
            const updatedAnswers = [...answers, newAnswer];
            setAnswers(updatedAnswers);
    
            // حفظ الإجابات في Local Storage
            localStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));
    
            setMotivationMessage(isCorrectAnswer ? "Correct! Well done!" : "Incorrect. Try again!");
        }
    };
     
    // const handleNextQuestion = async () => {
    //     if (currentQuestionIndex < questions.length - 1) {
    //         setCurrentQuestionIndex(currentQuestionIndex + 1);
    //         setSelectedOption(null);
    //         setIsAnswered(false);
    //         setIsCorrect(null);
    //         setHint("");
    //         setMotivationMessage("");
    //     } else {
    //         // إرسال جميع الإجابات عند الانتهاء من الاختبار
    //         try {
    //             const response = await fetch('http://localhost:5000/api/quiz/submit', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     user_id: 1, // change to dynamic user ID
    //                     lesson_id: lessonId, 
    //                     answers: answers,
    //                 }),
    //             });

    //             const data = await response.json();
    //             if (data.success) {
    //                 navigate("/quiz-complete", {
    //                     state: { quizData: data }, // Pass the entire response data
    //                 });
    //             } else {
    //                 console.error("Error submitting quiz:", data.message);
    //             }
    //         } catch (error) {
    //             console.error("Error submitting quiz:", error);
    //         }
    //     }
    // };


    // const handleNextQuestion = async () => {
    //     if (currentQuestionIndex < questions.length - 1) {
    //         setCurrentQuestionIndex(currentQuestionIndex + 1);
    //         setSelectedOption(null);
    //         setIsAnswered(false);
    //         setIsCorrect(null);
    //         setHint("");
    //         setMotivationMessage("");
    //     } else {
    //         if (!userId) {
    //             navigate("/login");
    //             return;
    //         }
    //         try {
    //             console.log("Submitting quiz with answers:", answers); // Debug log
    //             const response = await fetch('http://localhost:5000/api/quiz/submit', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     user_id: userId,
    //                     lesson_id: lessonId,
    //                     answers: answers,
    //                 }),
    //             });
    
    //             const data = await response.json();
    //             console.log("Quiz submission response:", data); // Debug log
    //             if (data.success) {
    //                 navigate("/quiz-complete", {
    //                     state: { quizData: data },
    //                 });
    //             } else {
    //                 console.error("Error submitting quiz:", data.message);
    //             }
    //         } catch (error) {
    //             console.error("Error submitting quiz:", error);
    //         }
    //     }
    // };
    // const handleNextQuestion = async () => {
    //     if (currentQuestionIndex < questions.length - 1) {
    //         setCurrentQuestionIndex(currentQuestionIndex + 1);
    //         setSelectedOption(null);
    //         setIsAnswered(false);
    //         setIsCorrect(null);
    //         setHint("");
    //         setMotivationMessage("");
    //     } else {
    //         if (!userId) {
    //             navigate("/login");
    //             return;
    //         }
    
    //         try {
    //             console.log("Submitting quiz with answers:", answers); // Debug log
    
    //             const response = await fetch('http://localhost:5000/api/quiz/submit', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     user_id: userId,
    //                     lesson_id: lessonId,
    //                     answers: answers,
    //                 }),
    //             });
    
    //             const data = await response.json();
    //             console.log("Quiz submission response:", data); // Debug log
    
    //             if (data.success) {
    //                 navigate("/quiz-complete", {
    //                     state: { quizData: data },
    //                 });
    //             } else {
    //                 console.error("Error submitting quiz:", data.message);
    //                 // لو حصلت مشكلة في الـ API، ينتقل مباشرة لصفحة quiz-complete بدون بيانات
    //                 navigate("/quiz-complete");
    //             }
    //         } catch (error) {
    //             console.error("Error submitting quiz:", error);
    //             // لو السيرفر مش شغال، ينتقل مباشرة إلى صفحة quiz-complete بدون إرسال بيانات
    //             navigate("/quiz-complete");
    //         }
    //     }
    // };
    
    const handleNextQuestion = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setIsCorrect(null);
            setHint("");
            setMotivationMessage("");
        } else {
            // حفظ الإجابات في Local Storage قبل الإرسال
            localStorage.setItem("quizAnswers", JSON.stringify(answers));
    
            if (!userId) {
                navigate("/login");
                return;
            }
    
            try {
                console.log("Submitting quiz with answers:", answers); // Debug log
    
                const response = await fetch('http://localhost:5000/api/quiz/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        lesson_id: lessonId,
                        answers: answers,
                    }),
                });
    
                const data = await response.json();
                console.log("Quiz submission response:", data); // Debug log
    
                if (data.success) {
                    navigate("/quiz-complete", {
                        state: { quizData: data },
                    });
                } else {
                    console.error("Error submitting quiz:", data.message);
                    navigate("/quiz-complete");
                }
            } catch (error) {
                console.error("Error submitting quiz:", error);
                navigate("/quiz-complete");
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
                          className={`check-answer-button ${selectedOption ? "selected" : ""}`}
                          onClick={checkAnswer}
                         disabled={!selectedOption}
>                        Check your answer
                        </button>

                    </div>
                ) : (
                    <>
                        {isCorrect ? (
                            // <div className="success-message">
                            //     <img src={WizardIcon} alt="Wizard" className="wizard-icon" />
                            //     <p className="congrats-text">{motivationMessage}</p>
                            //     <div className="correct-answer-box">
                            //         <img src={CorrectAnswerIcon} alt="Correct" className="correct-icon" />
                            //         <p className="correct-text">Correct answer</p>
                            //     </div>
                            //     <button className="next-button" onClick={handleNextQuestion}>
                            //         Next
                            //     </button>
                            // </div>
                            <div className="result-container">
                            <img src={WizardIcon} alt="Wizard" className="icon" />
                            <p className="message">{motivationMessage}</p>
                            <img src={CorrectAnswerIcon} alt="Correct" className="icon" />
                            <p className="correct-message">Correct answer</p>
                            <button className="next-button" onClick={handleNextQuestion}>
                             Next
                             </button>
                            </div>

                        ) : (
                            // <div className="error-message">
                            //     <img src={WrongIcon} alt="Wrong" className="wrong-icon" />
                            //     <p className="error-text">{motivationMessage}</p>
                            //     <div className="wrong-answer-box">
                            //         <img src={WrongAnswerIcon} alt="Wrong" className="wrong-icon" />
                            //         <p className="wrong-text">Wrong answer</p>
                            //     </div>
                            //     <button className="next-button" onClick={handleNextQuestion}>
                            //         Next
                            //     </button>
                            // </div>
                            <div className="result-container">
                            <img src={WrongIcon} alt="Wrong" className="icon" />
                            <p className="message">{motivationMessage}</p>
                            <img src={WrongAnswerIcon} alt="Wrong" className="icon" />
                            <p className="wrong-message">Wrong answer</p>
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