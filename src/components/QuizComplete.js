import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookIcon from "./images/Score icon.svg";
import pointsIcon from "./images/points.svg";
import "./QuizComplete.css";
import apiClient from '../services';
import { useTranslation } from "react-i18next";
import { useAuth } from '../context/AuthContext'; // Add this import

const QuizComplete = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(state?.quizData || null);
  const [loading, setLoading] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState("Keep going, wizard!");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState(""); // New state for comment
  const { t } = useTranslation();
  const { user } = useAuth(); // Get authenticated user

  useEffect(() => {
    console.log("QuizComplete state:", state);
    const fetchQuizData = async () => {
      if (!quizData) {
        const storedAnswers = localStorage.getItem("quizAnswers");
        if (storedAnswers) {
          const answers = JSON.parse(storedAnswers);
          const score = answers.filter(ans => ans.is_correct).length;
          const newQuizData = {
            score: score,
            answers: answers,
            earned_points: score * 10,
            is_passed: score >= (answers.length / 2),
          };
          setQuizData(newQuizData);
          await fetchMotivationalMessage(score, answers.length);
        }
      } else {
        await fetchMotivationalMessage(quizData.score, quizData.total_questions || quizData.answers.length);
      }
    };

    fetchQuizData();
  }, [quizData, state]);

  const fetchMotivationalMessage = async (score, total) => {
    try {
      const language = navigator.language || 'en';
      const response = await apiClient.get('/api/motivation', {
        params: { score, total },
        headers: { 'Accept-Language': language },
      });

      if (response.data.success) {
        setMotivationalMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching motivational message:", error);
      setMotivationalMessage("Keep going, wizard!");
    }
  };

  const handleReview = async () => {
    setLoading(true);
    try {
      const studentQuizId = state?.studentQuizId;
      if (!studentQuizId) {
        throw new Error("Student Quiz ID is missing for review");
      }
      const response = await apiClient.get(`/api/quiz/review/${studentQuizId}`);
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
    total_questions: quizData.total_questions || quizData.answers?.length || 0,
    earned_points: quizData.earned_points || 0,
    is_passed: quizData.is_passed || false,
    answers: (quizData.answers || []).map(answer => ({
      question_id: answer.question_id || 1,
      question: answer.question || "Question not available",
      options: answer.options || [],
      correct_answer: answer.correct_answer || "Answer not available",
      user_answer: answer.user_answer || answer.selected_answer || "No answer provided",
      isCorrect: answer.is_correct || false,
    })),
  });

  const handleContinue = () => {
    setShowFeedbackModal(true);
  };

  const submitFeedback = async () => {
    if (!feedbackScore) {
      alert("Please select a feedback score!");
      return;
    }

    const studentQuizId = state?.studentQuizId;
    if (!studentQuizId) {
      alert("Student Quiz ID is missing. Please try again.");
      console.error("Student Quiz ID is undefined.", {
        stateStudentQuizId: state?.studentQuizId,
        quizData: quizData,
        fullState: state,
      });
      navigate("/lessons");
      return;
    }

    const userId = user?.id; // Use authenticated user ID
    if (!userId) {
      console.error("User is not authenticated");
      navigate("/login");
      return;
    }

    try {
      const response = await apiClient.post('/api/feedback/submit', {
        user_id: userId,
        student_quiz_id: studentQuizId,
        feedback_score: feedbackScore,
        comment: feedbackComment || '', // Include comment in payload
      });

      if (response.data.success) {
        setShowFeedbackModal(false);
        navigate("/lessons");
      } else {
        console.error("Failed to submit feedback:", response.data.message);
        navigate("/lessons");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error submitting feedback:", error.response.data); // Log server response
      } else {
        console.error("Error submitting feedback:", error.message);
      }
            navigate("/lessons");
    }
  };

  const skipFeedback = () => {
    setShowFeedbackModal(false);
    navigate("/lessons");
  };

  if (!quizData) return <div>Loading...</div>;

  return (
    <div className="quizcomplete">
      <div className="quiz-complete-container">
        <img src={bookIcon} alt="Book Icon" className="book" />
        <h1 className="title">{t("lessonQuizCompleted")}</h1>
        <div className="score-points">
          <div className="score-container">
            <div className="score-circle">
              <p>{quizData.score} / {quizData.total_questions || quizData.answers.length}</p>
            </div>
            <p className="motivation-text">{motivationalMessage}</p>
          </div>
          <div className="points-container">
            <img src={pointsIcon} alt="Points Icon" className="points-icon" />
            <p className="points-text">{quizData.earned_points} {t("profilePointsEarned")}</p>
          </div>
        </div>
        <div className="buttons-container">
          <button 
            className="review-btn" 
            onClick={handleReview}
            disabled={loading}
          >
            {t("review")}
          </button>
          <button 
            className="continue-btn" 
            onClick={handleContinue}
          >
            {t("continue")}
          </button>
        </div>
      </div>

      {showFeedbackModal && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <h3>{t("feedbackTitle", { defaultValue: "How was your experience ?" })}</h3>
            <div className="emoji-container">
              {[1, 2, 3, 4, 5].map(score => (
                <span
                  key={score}
                  className={`emoji ${feedbackScore === score ? 'selected' : ''}`}
                  onClick={() => setFeedbackScore(score)}
                >
                  {score === 1 && "😢"}
                  {score === 2 && "🙁"}
                  {score === 3 && "😐"}
                  {score === 4 && "😊"}
                  {score === 5 && "😍"}
                </span>
              ))}
            </div>
            <textarea
              className="feedback-comment"
              placeholder={t("feedbackCommentPlaceholder", { defaultValue: "Add your comment here..." })}
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              rows="4"
            />
            <div className="feedback-buttons">
              <button onClick={skipFeedback} className="skip-btn">
                {t("skip", { defaultValue: "Skip" })}
              </button>
              <button onClick={submitFeedback} className="submit-btn">
                {t("submit", { defaultValue: "Submit" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComplete;