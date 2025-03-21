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

  useEffect(() => {
    if (!quizData) {
      const storedAnswers = localStorage.getItem("quizAnswers");
      if (storedAnswers) {
        const answers = JSON.parse(storedAnswers);
        const score = answers.filter(ans => ans.isCorrect).length;
        setQuizData({
          score: score,
          answers: answers,
          earned_points: score * 10,
          is_passed: score >= (answers.length / 2),
          id: state?.quizId, // Ensure this is set
        });
      }
    }
  }, [quizData, state]);

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
        // If the backend returns success: false, navigate with fallback data
        navigate("/quiz-review", { state: { quizData: createFallbackReviewData(quizData) } });
      }
    } catch (error) {
      console.error("Error fetching review data:", error);
      // Navigate to review page with fallback data if fetch fails
      navigate("/quiz-review", { state: { quizData: createFallbackReviewData(quizData) } });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to create fallback review data using local quiz data
  const createFallbackReviewData = (quizData) => ({
    score: quizData.score || 0,
    total_questions: quizData.answers.length || 0,
    earned_points: quizData.earned_points || 0,
    is_passed: quizData.is_passed || false,
    answers: quizData.answers.map(answer => ({
      question_id: answer.question_id || 1, // Default or dynamic question ID if available
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
            <p className="motivation-text">Keep going, wizard!</p>
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