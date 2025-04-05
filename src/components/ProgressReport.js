import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProgressReport.css";
import Exit from "./images/Exit iconsvg.svg";
import points from "./images/points.svg";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next"; // Add useTranslation

import apiClient from '../services';

const ProgressReport = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const navigate = useNavigate();
  const userId = user.id;
  const { t } = useTranslation(); // Add useTranslation hook

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await apiClient.get(`/api/quiz/progress/${userId}`);
        
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
        console.error("Error fetching progress, using dummy data:", error);
        setProgressData([
          {
            id: 1,
            lesson_id: "1",
            unit_id: "1",
            lesson_number: 1,
            score: 7,
            total_questions: 10,
            earned_points: 70,
            is_passed: true,
          },
          {
            id: 2,
            unit_id: "2",
            score: 5,
            total_questions: 10,
            earned_points: 50,
            is_passed: false,
          },
          {
            id: 3,
            lesson_id: "3",
            unit_id: "3",
            lesson_number: 2,
            score: 9,
            total_questions: 10,
            earned_points: 90,
            is_passed: true,
          },
        ]);
      }
    };
  
    fetchProgress();
  }, [userId]);

  const handleCardClick = (quiz) => {
    const quizData = {
      score: quiz.score || 0,
      answers: Array(quiz.total_questions || 10)
        .fill()
        .map((_, i) => ({
          isCorrect: i < (quiz.score || 0),
        })),
      earned_points: quiz.earned_points || 0,
      is_passed: quiz.is_passed || false,
      id: quiz.id,
    };

    if (quiz.lesson_id) {
      navigate("/quiz-complete", { state: { quizData } });
    } else if (quiz.unit_id) {
      navigate("/unit-quiz-complete", { state: { quizData } });
    }
  };

  return (
    <div className="progress-report-bg">
      <button className="back-button" onClick={() => navigate("/profile")}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>
      <div className="progress-report-container">
        <div className="progress-report-header">{t("profileProgressReport")}</div>
        <div className="progress-cards">
          {progressData.map((quiz) => (
            <div
              key={quiz.id}
              className="progress-card"
              onClick={() => handleCardClick(quiz)}
            >
              <div className="pscore-circle">
                {quiz.score} / {quiz.total_questions}
              </div>
              <p className="lesson-info">
                {quiz.lesson_id && quiz.lesson_number
                  ? `Unit ${quiz.unit_id}, Lesson ${quiz.lesson_number}`
                  : `Unit ${quiz.unit_id}`}
              </p>
              <p className="points-earned">
                <img src={points} alt="points icon" className="points" />{" "}
                {quiz.earned_points} points earned
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressReport;