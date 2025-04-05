import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookIcon from "./images/Score icon.svg";
import pointsIcon from "./images/points.svg";
import "./QuizComplete.css";
import apiClient from '../services';

const QuizComplete = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(state?.quizData || null);
  const [loading, setLoading] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState("Keep going, wizard!");

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!quizData) {
        const storedAnswers = localStorage.getItem("quizAnswers");
        if (storedAnswers) {
          const answers = JSON.parse(storedAnswers);
          const score = answers.filter(ans => ans.isCorrect).length;
          const newQuizData = {
            score: score,
            answers: answers,
            earned_points: score * 10,
            is_passed: score >= (answers.length / 2),
            id: state?.quizId,
          };
          setQuizData(newQuizData);

          // Fetch motivational message after setting quizData
          await fetchMotivationalMessage(score, answers.length);
        }
      } else {
        // Fetch motivational message if quizData already exists
        await fetchMotivationalMessage(quizData.score, quizData.answers.length);
      }
    };

    fetchQuizData();
  }, [quizData, state]);

  const fetchMotivationalMessage = async (score, total) => {
    try {
      // Get the user's language (this could come from a context, localStorage, or browser settings)
      const language = navigator.language || 'en'; // Use browser language as an example

      const response = await apiClient.get('/api/motivation', {
        params: { score, total }, // Send both score and total
        headers: {
          'Accept-Language': language, // Send language in the header
        },
      });

      if (response.data.success) {
        setMotivationalMessage(response.data.message);
      } else {
        console.error("Failed to fetch motivational message:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching motivational message:", error);
      setMotivationalMessage("Keep going, wizard!"); // Fallback message
    }
  };

  if (!quizData) return <div>Loading...</div>;

  const handleReview = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/quiz/review/${quizData.id || state?.quizId}`);
      
      if (response.status !== 200) {
        throw new Error("Failed to fetch review data");
      }
  
      const data = response.data;
  
      if (data.success) {
        navigate("/quiz-review", { state: { quizData: data.reviewData } });
      } else {
        navigate("/quiz-review", { state: { quizData: createFallbackReviewData(quizData) } });
      }
    } catch (error) {
      console.error("Error fetching review data:", error);
      navigate("/quiz-review", { state: { quizData: createFallbackReviewData(quizData) } });
    } finally {
      setLoading(false);
    }
  };

  const createFallbackReviewData = (quizData) => ({
    score: quizData.score || 0,
    total_questions: quizData.answers.length || 0,
    earned_points: quizData.earned_points || 0,
    is_passed: quizData.is_passed || false,
    answers: quizData.answers.map(answer => ({
      question_id: answer.question_id || 1,
      question: answer.question || "Question not available",
      options: answer.options || [],
      correct_answer: answer.correct_answer || "Answer not available",
      user_answer: answer.user_answer || "No answer provided",
      isCorrect: answer.isCorrect || false,
    })),
  });

  return (
    <div className="quizcomplete">
      <div className="quiz-complete-container">
        <img src={bookIcon} alt="Book Icon" className="book" />
        <h1 className="title">Lesson Completed!</h1>
        <div className="score-points">
          <div className="score-container">
            <div className="score-circle">
              <p>{quizData.score} / {quizData.answers.length}</p>
            </div>
            <p className="motivation-text">{motivationalMessage}</p>
          </div>
          <div className="points-container">
            <img src={pointsIcon} alt="Points Icon" className="points-icon" />
            <p className="points-text">{quizData.earned_points} Points Earned</p>
          </div>
        </div>
        <div className="buttons-container">
          <button 
            className="review-btn" 
            onClick={handleReview}
            disabled={loading}
          >
            {loading ? "Loading..." : "Review"}
          </button>
          <button 
            className="continue-btn" 
            onClick={() => navigate("/lessons")}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizComplete;