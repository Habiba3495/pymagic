// src/components/UnitQuiz.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Quiz.css";
import ExitIcon from "./images/Exit iconsvg.svg";
import WizardIcon from "./images/Correct Potion.svg";
import CorrectAnswerIcon from "./images/Correct check.svg";
import WrongIcon from "./images/Wrong potion.svg";
import WrongAnswerIcon from "./images/Wrong icon.svg";
import HintIcon from "./images/Hint icon.svg";

const UnitQuiz = () => {
    const navigate = useNavigate();
    const { unitId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [hint, setHint] = useState("");
    const [motivationMessage, setMotivationMessage] = useState("");
    const [answers, setAnswers] = useState([]);
    
    const userId = 1; //// Replace with actual user authentication

    useEffect(() => {
        const fetchUnitQuestions = async () => {
            try {
                console.log(`Fetching unit quiz for unitId: ${unitId}, userId: ${userId}`);
                const response = await fetch(`http://localhost:5000/api/quiz/unit/${userId}/${unitId}`);
                if (!response.ok) throw new Error("Failed to fetch unit questions");
                const data = await response.json();
                console.log("Unit Quiz Data:", data);
                setQuestions(data.questions || []);
            } catch (error) {
                console.error("Error fetching unit quiz:", error);
                setQuestions([
                    {
                        id: 1,
                        question: "What is a computer?",
                        options: ["A machine", "A book", "A food", "A drink"],
                        correct_answer: "A machine",
                        hint: "It processes data."
                    }
                ]);
            }
        };
        fetchUnitQuestions();
    }, [unitId]);

    const handleOptionClick = (option) => setSelectedOption(option);

    const checkAnswer = () => {
        if (selectedOption) {
            const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
            setIsCorrect(isCorrectAnswer);
            setIsAnswered(true);

            const newAnswer = {
                question_id: questions[currentQuestionIndex].id,
                user_answer: selectedOption,
                is_correct: isCorrectAnswer
            };
            setAnswers([...answers, newAnswer]);
            setMotivationMessage(isCorrectAnswer ? "Great job!" : "Try again!");
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
            try {
                console.log("Submitting unit quiz with answers:", answers);
                const response = await fetch('http://localhost:5000/api/quiz/unit/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: userId,
                        unit_id: unitId,
                        answers: answers
                    })
                });
                const data = await response.json();
                console.log("Unit Quiz Submission Response:", data);
                if (data.success) {
                    navigate("/unit-quiz-complete", { state: { quizData: data } });
                } else {
                    console.error("Error submitting unit quiz:", data.message);
                }
            } catch (error) {
                console.error("Error submitting unit quiz:", error);
            }
        }
    };

    const handleHintClick = () => setHint(questions[currentQuestionIndex].hint);

    if (questions.length === 0) return <div>Loading...</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <button className="exit-button" onClick={() => navigate("/lessons")}>
                <img src={ExitIcon} alt="Exit" className="exit-icon" />
            </button>
            <div className="quiz-box">
                <h1 className="quiz-header">Unit {unitId} Quiz</h1>
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
                        <img src={HintIcon} alt="Hint" className="extra-icon" onClick={handleHintClick} />
                        <button className="check-answer-button" onClick={checkAnswer} disabled={!selectedOption}>
                            Check Answer
                        </button>
                    </div>
                ) : (
                    <div className={isCorrect ? "success-message" : "error-message"}>
                        <img src={isCorrect ? WizardIcon : WrongIcon} alt={isCorrect ? "Correct" : "Wrong"} />
                        <p>{motivationMessage}</p>
                        <div className={isCorrect ? "correct-answer-box" : "wrong-answer-box"}>
                            <img src={isCorrect ? CorrectAnswerIcon : WrongAnswerIcon} alt={isCorrect ? "Correct" : "Wrong"} />
                            <p>{isCorrect ? "Correct answer" : "Wrong answer"}</p>
                        </div>
                        <button className="next-button" onClick={handleNextQuestion}>
                            {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
                        </button>
                    </div>
                )}
                {hint && <p className="hint-text"><p>Hint:</p>{hint}</p>}
            </div>
        </div>
    );
};

export default UnitQuiz;