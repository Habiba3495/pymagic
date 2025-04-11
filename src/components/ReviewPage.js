import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReviewPage.css";
import { useTranslation } from "react-i18next";
import { useAuth } from '../context/AuthContext'; // Import useAuth
import trackEvent from '../utils/trackEvent'; // Import trackEvent utility

const ReviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { quizData } = state || {};
  const { t } = useTranslation();
  const { user } = useAuth(); // Get authenticated user

  // Track page view and quiz review access
  useEffect(() => {
    if (user?.id) {
      // Track page view
      trackEvent(user.id, 'pageview', { 
        page: '/quiz-review',
        category: 'Navigation'
      });

      // Track quiz review access
      if (quizData) {
        trackEvent(user.id, 'quiz_review_accessed', {
          category: 'Quiz',
          label: 'Quiz Review Page',
          score: quizData.score,
          total_questions: quizData.answers?.length || 0,
          is_passed: quizData.is_passed || false
        });
      }
    }
  }, [user, quizData]);

  const handleProgressReportClick = () => {
    // Track progress report navigation
    if (user?.id) {
      trackEvent(user.id, 'progress_report_navigated', {
        category: 'Navigation',
        label: 'From Quiz Review'
      });
    }
    navigate("/progress-report/1");
  };

  const handleLessonsClick = () => {
    // Track lessons navigation
    if (user?.id) {
      trackEvent(user.id, 'lessons_navigated', {
        category: 'Navigation',
        label: 'From Quiz Review'
      });
    }
    navigate("/lessons");
  };

  const handleQuestionReview = (questionId, questionIndex) => {
    // Track when a user reviews a specific question
    if (user?.id) {
      trackEvent(user.id, 'question_reviewed', {
        category: 'Quiz',
        label: 'Question Review',
        question_id: questionId,
        question_index: questionIndex + 1
      });
    }
  };

  if (!quizData) {
    // Track missing quiz data error
    if (user?.id) {
      trackEvent(user.id, 'quiz_review_error', {
        category: 'Error',
        label: 'Missing Quiz Data'
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
    // Track empty answers error
    if (user?.id) {
      trackEvent(user.id, 'quiz_review_error', {
        category: 'Error',
        label: 'Empty Quiz Answers'
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
        <h1 className="Reviewheader">{t("quizReview")}</h1>
        {quizData.answers.map((answer, index) => (
          <div 
            key={answer.question_id || index} 
            className="question-box"
            onClick={() => handleQuestionReview(answer.question_id, index)}
          >
            <p className="question-text">{index + 1}. {answer.question}</p>
            <div className="options-container">
              {answer.options?.map((option, idx) => (
                <div
                  key={idx}
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
          <button 
            className="pbutton" 
            onClick={handleProgressReportClick}
          >
            {t("goToProgressReport")}
          </button>
          <button 
            className="lbutton" 
            onClick={handleLessonsClick}
          >
            {t("goToLessons")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;