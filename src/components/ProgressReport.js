// src/components/ProgressReport.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import "./ProgressReport.css"; // You can create this CSS file for styling

const ProgressReport = () => {
  const navigate = useNavigate();
//   const { user } = useAuth(); // Get authenticated user from AuthContext
  const { user_id } = useParams(); // Get user_id from URL (optional, for testing)
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = 1?.id || user_id || null; // Use authenticated user ID or URL param  =======================================

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Redirect to login if no user is authenticated
      return;
    }

    const fetchProgress = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quiz/progress/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch progress data");
        const data = await response.json();
        setProgressData(data.progress || []);
      } catch (error) {
        console.error("Error fetching progress:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, navigate]);

  const handleScoreClick = (quiz) => {
    if (quiz.type === "lesson" && quiz.lesson_id) {
      // Simulate fetching the full quiz data (you might need to enhance the back-end to return more details)
      const quizData = {
        success: true,
        score: quiz.score,
        earned_points: quiz.earned_points,
        is_passed: quiz.is_passed,
        answers: [] // You can enhance this by fetching individual answers if needed
      };
      navigate("/quiz-complete", { state: { quizData } });
    } else if (quiz.type === "unit" && quiz.unit_id) {
      const quizData = {
        success: true,
        score: quiz.score,
        earned_points: quiz.earned_points,
        is_passed: quiz.is_passed,
        answers: [] // You can enhance this by fetching individual answers if needed
      };
      navigate("/unit-quiz-complete", { state: { quizData } });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="progress-report-container">
      <h1>Progress Report</h1>
      {progressData.length === 0 ? (
        <p>No quiz results found.</p>
      ) : (
        <table className="progress-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>ID</th>
              <th>Score</th>
              <th>Points Earned</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {progressData.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.type === "lesson" ? "Lesson" : "Unit"}</td>
                <td>{quiz.type === "lesson" ? quiz.lesson_id : quiz.unit_id}</td>
                <td 
                  onClick={() => handleScoreClick(quiz)}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                >
                  {quiz.score}
                </td>
                <td>{quiz.earned_points}</td>
                <td>{quiz.is_passed ? "Passed" : "Failed"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => navigate("/lessons")}>Back to Lessons</button>
    </div>
  );
};

export default ProgressReport;