
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReviewPage.css";
import { useTranslation } from "react-i18next"; // Add useTranslation

const ReviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { quizData } = state || {};
  const { t } = useTranslation(); // Add useTranslation hook

  if (!quizData) {
    return (
      <div className="quiz-review-container">
        <p>No quiz data available. Please go back and try again.</p>
        <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
      </div>
    );
  }

  if (!quizData.answers || quizData.answers.length === 0) {
    return (
      <div className="quiz-review-container">
        <p>No answers available for review. Please check your quiz submission or contact support.</p>
        <button onClick={() => navigate("/progress-report/1")}>Back to Progress Report</button>
      </div>
    );
  }

  return (
    <div className="quiz-review-container">
      <div className="quiz-box-review">
      <h1 className="Reviewheader"> {t("quizReview")}</h1>
        {quizData.answers.map((answer, index) => (
          <div key={answer.question_id || index} className="question-box">
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
        <button className="pbutton" onClick={() => navigate("/progress-report/1")}>{t("goToPrpgressReport")}</button>
        <button className="lbutton" onClick={() => navigate("/lessons")}>{t("goToLessons")}</button>
      </div>
      </div>
    </div>
  );
};

export default ReviewPage;