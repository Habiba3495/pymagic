import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Video.css";
import Exit from "./images/Exit iconsvg.svg";
import apiClient from '../services';
import { useTranslation } from "react-i18next"; // Add useTranslation


const Video = () => {
  const { unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState(null); // Store full lesson data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unitColor] = useState("#6B21A8"); // Default purple color
  const { t } = useTranslation(); // Add useTranslation hook

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await apiClient.get(`/api/lessons/${lessonId}`);
  
        // Check if the response status is not OK (e.g., 404, 500)
        if (response.status !== 200) {
          throw new Error(`Failed to fetch lesson data: ${response.status} ${response.statusText}`);
        }
  
        // Access the response data directly
        const data = response.data;
        setLessonData(data.lesson); // Access the nested 'lesson' object
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLessonData();
  }, [lessonId]);

  return (
    <div className="lesson-container">
      <button className="back-button" onClick={() => navigate("/lessons")}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>

      <div className="vlesson-content">
        <h1 className="lesson-header" style={{ backgroundColor: unitColor }}>
        {t("unit")} {unitId} - {lessonData?.title || `Lesson ${lessonId}`}
        </h1>

        <div className="video-container">
          {loading ? (
            <p>Loading video...</p>
          ) : error ? (
            <>
              <p>Error: {error}</p>
              <video controls>
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>              
            </>
          ) : lessonData?.video_url ? ( // Use video_url from the lesson object
            <video controls>
              <source
                src={`${apiClient.defaults.baseURL}${lessonData.video_url}`}
                type="video/mp4"
                crossOrigin="use-credentials"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <>
              <p>No video available. Playing default video.</p>
              <video controls>
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </>
          )}
        </div>

        <button
          className="quiz-button"
          onClick={() => navigate(`/quiz/${unitId}/${lessonId}`)}
        >
          {t("startQuiz")}
        </button>
      </div>
    </div>
  );
};

export default Video;