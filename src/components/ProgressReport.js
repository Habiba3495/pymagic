import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProgressReport.css";
import Exit from "./images/Exit iconsvg.svg";
import points from "./images/points.svg";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";
import apiClient from '../services';
import trackEvent from '../utils/trackEvent';
import Loading from "./Loading.js"; 
import PyMagicRunner from "./Pymagic_runnergame.js"; 

const ProgressReport = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchProgress = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch progress");
      }
      const data = response.data;
      if (data.success && data.progress.length > 0) {
        setProgressData(data.progress);
      } else {
        throw new Error("No progress data available");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchProgress();
  }, [user, navigate]);

  const handleCardClick = async (quiz) => {
    trackEvent(user.id, 'quiz_selected_from_progress', {
      category: 'Progress',
      label: 'Quiz Selected',
      quiz_id: quiz.id,
      quiz_type: quiz.lesson_id ? 'Lesson Quiz' : 'Unit Quiz',
      score: quiz.score,
      is_passed: quiz.is_passed,
    });

    try {
      const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
      const validQuiz = response.data.progress.find(
        (progressQuiz) =>
          progressQuiz.id === quiz.id &&
          progressQuiz.unit_id === quiz.unit_id &&
          (progressQuiz.lesson_id === quiz.lesson_id || (!progressQuiz.lesson_id && !quiz.lesson_id))
      );

      if (!validQuiz) {
        console.error('Invalid or non-existent quiz:', quiz.id);
        alert(t('progress.invalidQuiz'));
        return;
      }

      const quizData = {
        score: validQuiz.score || 0,
        answers: Array(validQuiz.total_questions || 10)
          .fill()
          .map((_, i) => ({
            isCorrect: i < (validQuiz.score || 0),
          })),
        earned_points: validQuiz.earned_points || 0,
        is_passed: validQuiz.is_passed || false,
        studentQuizId: validQuiz.id,
        total_questions: validQuiz.total_questions || 10,
        unit_id: validQuiz.unit_id,
        lesson_id: validQuiz.lesson_id,
      };

      if (validQuiz.lesson_id) {
        navigate('/quiz-complete', { state: { quizData, studentQuizId: validQuiz.id } });
      } else if (validQuiz.unit_id) {
        navigate('/unit-quiz-complete', { state: { quizData, studentQuizId: validQuiz.id } });
      }
    } catch (error) {
      console.error('Error validating quiz:', error);
      alert(t('progress.errorLoadingQuiz'));
    }
  };

  const handleBackClick = () => {
    trackEvent(user.id, 'back_button_clicked', {
      category: 'Navigation',
      label: 'Back to Profile'
    });
    navigate("/profile");
  };

  if (loading) return <Loading />;

  if (error && error !== "No progress data available") {
    return (
      <div className="error-container">
        <p className="error-message">{t("progress.errorLoading")}</p>
        <button onClick={() => {
          setLoading(true);
          setError("");
          fetchProgress();
        }}>
          {t("progress.tryAgain")}
        </button>
        <PyMagicRunner />
      </div>
    );
  }

  return (
    <div className="progress-report-bg">
      <button className="back-button" onClick={handleBackClick}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>
      <div className="progress-report-container">
        <div className="progress-report-header">{t("progress.profileProgressReport")}</div>
        <div className="progress-cards">
          {progressData.length > 0 ? (
            progressData.map((quiz) => (
              <div
                key={quiz.id}
                className={`progress-card ${quiz.is_passed ? 'passed' : 'failed'}`}
                onClick={() => handleCardClick(quiz)}
              >
                <div className="pscore-circle">
                  {quiz.score} / {quiz.total_questions}
                </div>
                <p className="lesson-info">
                  {quiz.lesson_id && quiz.lesson_number
                    ? `${t("progress.unit")} ${quiz.unit_id}, ${t("progress.lesson")} ${quiz.lesson_number}`
                    : `${t("progress.unit")} ${quiz.unit_id}`}
                </p>
                <div className="points-earned">
                  <img src={points} alt="points icon" className="points" />
                  {quiz.earned_points} {t("progress.profilePointsEarned")}
                </div>
              </div>
            ))
          ) : (
            <p className="no-progress-message">
              {t("progress.noProgress")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressReport;