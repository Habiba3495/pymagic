

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UnitQuiz.css";
import ExitIcon from "./images/Exit iconsvg.svg";
import WizardIcon from "./images/Correct Potion.svg";
import CorrectAnswerIcon from "./images/Correct check.svg";
import WrongIcon from "./images/Wrong potion.svg";
import WrongAnswerIcon from "./images/Wrong icon.svg";
import HintIcon from "./images/Hint icon.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';

const UnitQuiz = () => {
  const { user } = useAuth();//2
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
  const userId = user.id; 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await apiClient.get(`/api/quiz/unit/${userId}/${unitId}`);
        
        if (response.status !== 200) {
          throw new Error("Failed to fetch questions");
        }
  
        const data = response.data;
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Error fetching unit quiz questions:", error);
        const defaultQuestions = [
          { id: 1, question: "What is a computer?", options: ["A machine", "A book", "A food", "A drink"], correct_answer: "A machine", hint: "It processes data." },
          { id: 2, question: "What is Python?", options: ["A snake", "A programming language", "A coffee", "A car brand"], correct_answer: "A programming language", hint: "It's used in software development." },
          { id: 3, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Machine Learning", "Home Tool Machine Language", "Hyperlink and Text Management Language"], correct_answer: "Hyper Text Markup Language", hint: "It's used to structure web pages." },
          { id: 4, question: "What is the purpose of a CPU?", options: ["Store data", "Process instructions", "Display graphics", "Connect to the internet"], correct_answer: "Process instructions", hint: "It's the brain of the computer." },
          { id: 5, question: "What is binary code made of?", options: ["Letters and numbers", "0s and 1s", "Symbols", "Colors"], correct_answer: "0s and 1s", hint: "It’s the foundation of digital data." },
        ];
        setQuestions(defaultQuestions);
      }
    };
  
    fetchQuestions();
  }, [unitId, userId]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsAnswered(false);
    setIsCorrect(null);
    setHint("");
    setMotivationMessage("");
  };

  const checkAnswer = () => {
    if (selectedOption) {
      const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
      setIsCorrect(isCorrectAnswer);
      setIsAnswered(true);

      const newAnswer = {
        question_id: questions[currentQuestionIndex].id,
        user_answer: selectedOption,
        is_correct: isCorrectAnswer,
      };

      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      localStorage.setItem("unitQuizAnswers", JSON.stringify(updatedAnswers));

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
      // Filter out invalid answers
      const validAnswers = answers.filter((answer) => answer.user_answer !== undefined);
      localStorage.setItem("unitQuizAnswers", JSON.stringify(validAnswers));
  
      if (!userId) {
        navigate("/login");
        return;
      }
  
      try {
        console.log("Submitting unit quiz with answers:", validAnswers);
  
        const response = await apiClient.post("/api/quiz/unit/submit", {
          user_id: userId,
          unit_id: unitId,
          answers: validAnswers,
        });
  
        const data = response.data;
        console.log("Unit quiz submission response:", data);
  
        if (data.success) {
          navigate("/unit-quiz-complete", {
            state: {
              quizData: data,
              total_user_points: data.total_user_points,
              achievements: data.achievements || [],
            },
          });
        } else {
          console.error("Error submitting unit quiz:", data.message);
          navigate("/unit-quiz-complete");
        }
      } catch (error) {
        console.error("Error submitting unit quiz:", error);
        navigate("/unit-quiz-complete");
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
            >
              Check answer
            </button>
          </div>
        ) : (
          <>
            {isCorrect ? (
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

        {hint && (
          <p className="hint-text">
            <p>Hint:</p>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
};

export default UnitQuiz;