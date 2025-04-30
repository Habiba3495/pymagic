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
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
      if (response.status !== 200) {
        throw new Error(t("progress.fetchError"));
      }
      const data = response.data;
      if (data.success && data.progress.length > 0) {
        setProgressData(data.progress);
        trackEvent(user.id, 'progress_data_loaded', {
          category: 'Progress',
          label: 'Progress Data Loaded',
          progress_count: data.progress.length,
        }, user).catch((error) => {
          console.error('Failed to track progress_data_loaded:', error);
        });
      } else {
        throw new Error(t("progress.noProgress"));
      }
    } catch (error) {
      setError(error.message || t("progress.fetchError"));
      trackEvent(user.id, 'progress_data_error', {
        category: 'Error',
        label: 'Progress Data Fetch Error',
        error: error.message,
      }, user).catch((error) => {
        console.error('Failed to track progress_data_error:', error);
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate("/login");
      return;
    }

    trackEvent(user.id, 'pageview', {
      page: '/progress-report',
      category: 'Navigation',
    }, user).catch((error) => {
      console.error('Failed to track pageview:', error);
    });

    fetchProgress();
  }, [user, navigate, t]);

  const handleCardClick = async (quiz) => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    trackEvent(user.id, 'quiz_selected_from_progress', {
      category: 'Progress',
      label: 'Quiz Selected',
      quiz_id: quiz.id,
      quiz_type: quiz.lesson_id ? 'Lesson Quiz' : 'Unit Quiz',
      score: quiz.score,
      is_passed: quiz.is_passed,
    }, user).catch((error) => {
      console.error('Failed to track quiz_selected_from_progress:', error);
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
        trackEvent(user.id, 'invalid_quiz_error', {
          category: 'Error',
          label: 'Invalid Quiz Selected',
          quiz_id: quiz.id,
        }, user).catch((error) => {
          console.error('Failed to track invalid_quiz_error:', error);
        });
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
      trackEvent(user.id, 'quiz_validation_error', {
        category: 'Error',
        label: 'Quiz Validation Failed',
        error: error.message,
      }, user).catch((error) => {
        console.error('Failed to track quiz_validation_error:', error);
      });
    }
  };

  const handleBackClick = () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    trackEvent(user.id, 'back_button_clicked', {
      category: 'Navigation',
      label: 'Back to Profile'
    }, user).catch((error) => {
      console.error('Failed to track back_button_clicked:', error);
    });
    navigate("/profile");
  };

  if (loading) return <Loading />;

  if (error && error !== t("progress.noProgress")) {
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