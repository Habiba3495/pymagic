import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProgressReport.css"; // Ensure this CSS file exists

const ProgressReport = () => {
  const [progressData, setProgressData] = useState([]);
  const navigate = useNavigate();
  const userId = 1; // Hardcoded for now; replace with dynamic user ID in a real app

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quiz/progress/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch progress");
        const data = await response.json();
        if (data.success) {
          setProgressData(data.progress);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [userId]);

  const handleCardClick = (quiz) => {
    const quizData = {
      score: quiz.score || 0,
      answers: Array(quiz.total_questions || 10).fill().map((_, i) => ({
        isCorrect: i < (quiz.score || 0),
      })),
      earned_points: quiz.earned_points || 0,
      is_passed: quiz.is_passed || false,
      id: quiz.id, // Pass the quiz ID
    };
  
    if (quiz.lesson_id) {
      navigate("/quiz-complete", { state: { quizData } });
    } else if (quiz.unit_id) {
      navigate("/unit-quiz-complete", { state: { quizData } });
    }
  };

  return (
    <div className="progress-report-container">
      <div className="progress-report-header">Progress Report</div>
      <div className="progress-cards">
        {progressData.map((quiz) => (
          <div
            key={quiz.id}
            className="progress-card"
            onClick={() => handleCardClick(quiz)}
          >
            <div className="pscore-circle">
              {quiz.score || 0} / {quiz.total_questions || 10}
            </div>
            <p className="lesson-info">
              {quiz.lesson_id 
                ? `Unit ${quiz.lesson_id.split('.')[0] || 'Unknown'}, Lesson ${quiz.lesson_id.split('.')[1] || 'Unknown'}`
                : quiz.unit_id 
                  ? `Unit ${quiz.unit_id}`
                  : 'Unknown Quiz'}
            </p>
            <p className="points-earned">
              <span role="img" aria-label="points">✨</span> {quiz.earned_points || 0} points earned
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressReport;