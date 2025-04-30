import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReviewPage.css";
import { useTranslation } from "react-i18next";
import { useAuth } from '../context/AuthContext';
import trackEvent from '../utils/trackEvent';

const ReviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { quizData } = state || {};
  const { t } = useTranslation();
  const { user } = useAuth();

  // Track page view and quiz review access
  useEffect(() => {
    if (!user || !user.id) {
      console.log('No user, skipping pageview and quiz_review_accessed tracking');
      navigate('/login');
      return;
    }

    trackEvent(user.id, 'pageview', {
      page: '/quiz-review',
      category: 'Navigation',
    }, user).catch((error) => {
      console.error('Failed to track pageview:', error);
    });

    if (quizData) {
      trackEvent(user.id, 'quiz_review_accessed', {
        category: 'Quiz',
        label: 'Quiz Review Page',
        score: quizData.score,
        total_questions: quizData.answers?.length || 0,
        is_passed: quizData.is_passed || false,
      }, user).catch((error) => {
        console.error('Failed to track quiz_review_accessed:', error);
      });
    }
  }, [user, quizData, navigate]);

  const handleProgressReportClick = () => {
    if (!user || !user.id) {
      console.log('No user, skipping progress_report_navigated tracking');
      navigate('/login');
      return;
    }

    trackEvent(user.id, 'progress_report_navigated', {
      category: 'Navigation',
      label: 'From Quiz Review',
    }, user).catch((error) => {
      console.error('Failed to track progress_report_navigated:', error);
    });
    navigate("/progress-report/1");
  };

  const handleLessonsClick = () => {
    if (!user || !user.id) {
      console.log('No user, skipping lessons_navigated tracking');
      navigate('/login');
      return;
    }

    trackEvent(user.id, 'lessons_navigated', {
      category: 'Navigation',
      label: 'From Quiz Review',
    }, user).catch((error) => {
      console.error('Failed to track lessons_navigated:', error);
    });
    navigate("/lessons");
  };

  const handleQuestionReview = (questionId, questionIndex) => {
    if (!user || !user.id) {
      console.log('No user, skipping question_reviewed tracking');
      return;
    }

    trackEvent(user.id, 'question_reviewed', {
      category: 'Quiz',
      label: 'Question Review',
      question_id: questionId,
      question_index: questionIndex + 1,
    }, user).catch((error) => {
      console.error('Failed to track question_reviewed:', error);
    });
  };

  if (!quizData) {
    if (user?.id) {
      trackEvent(user.id, 'quiz_review_error', {
        category: 'Error',
        label: 'Missing Quiz Data',
      }, user).catch((error) => {
        console.error('Failed to track quiz_review_error:', error);
      });
    }
    return (
      <div className="quiz-review-container">
        <p>{t("noQuizDataAvailable")}</p>
        <button onClick={handleProgressReportClick}>{t("goToProgressReport")}</button>
      </div>
    );
  }

  if (!quizData.answers || quizData.answers.length === 0) {
    if (user?.id) {
      trackEvent(user.id, 'quiz_review_error', {
        category: 'Error',
        label: 'Empty Quiz Answers',
      }, user).catch((error) => {
        console.error('Failed to track quiz_review_error:', error);
      });
    }
    return (
      <div className="quiz-review-container">
        <p>{t("noAnswersAvailable")}</p>
        <button onClick={handleProgressReportClick}>{t("goToProgressReport")}</button>
      </div>
    );
  }

  return (
    <div className="quiz-review-container">
      <div className="quiz-box-review">
        <h1 className="Reviewheader">{t("review.quizReview")}</h1>
        {quizData.answers.map((answer, index) => (
          <div
            key={`question-${answer.question_id}-${index}`} // Ensure unique keys
            className="question-box"
            onClick={() => handleQuestionReview(answer.question_id, index)}
          >
            <p className="question-text">{index + 1}. {answer.question}</p>
            <div className="options-container">
              {answer.options?.map((option, idx) => (
                <div
                  key={`option-${answer.question_id}-${idx}`} // Unique key for options
                  className={`option ${answer.user_answer === option ? 'user-answer' : ''} ${
                    answer.correct_answer === option ? 'correct-answer' : ''
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="buttons-container">
          <button className="pbutton" onClick={handleProgressReportClick}>
            {t("review.goToProgressReport")}
          </button>
          <button className="lbutton" onClick={handleLessonsClick}>
            {t("review.goToLessons")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;