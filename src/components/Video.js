import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Video.css";
import Exit from "./images/Exit iconsvg.svg";
import apiClient from '../services';
import { useTranslation } from "react-i18next";
import { useAuth } from '../context/AuthContext';
import ReactGA from 'react-ga4';
import trackEvent from '../utils/trackEvent';
import PyMagicRunner from './Pymagic_runnergame'; 
import Loading from "./Loading.js"; 

const Video = () => {
  const { unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unitColor] = useState("#5B287C");
  const { t } = useTranslation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: `/video/${unitId}/${lessonId}` });
    const fetchLessonData = async () => {
      try {
        const response = await apiClient.get(`/api/lessons/${lessonId}`);
        if (response.status !== 200) {
          throw new Error(`Failed to fetch lesson data: ${response.status} ${response.statusText}`);
        }
        setLessonData(response.data.lesson);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonData();
  }, [lessonId, unitId]);

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      if (!userId) return; // Skip if no userId
      const duration = Math.floor((Date.now() - startTime) / 1000);
      trackEvent(userId, 'time_spent', {
        category: 'Video',
        label: `Unit ${unitId} - Lesson ${lessonId}`,
      }, duration);
    };
  }, [unitId, lessonId, userId]);

  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!userId) return; // Skip if no userId
        trackEvent(userId, 'inactive', {
          category: 'Video',
          label: `Unit ${unitId} - Lesson ${lessonId}`,
        }, 30);
      }, 30000);
    };
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    resetTimeout();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
    };
  }, [unitId, lessonId, userId]);

  const handlePlay = () => {
    if (!userId) return; // Skip if no userId
    trackEvent(userId, 'video_started', {
      category: 'Video',
      label: `Unit ${unitId} - Lesson ${lessonId}`,
    });
  };

  const handleVideoEnd = () => {
    if (!userId) return; // Skip if no userId
    trackEvent(userId, 'video_completed', {
      category: 'Video',
      label: `Unit ${unitId} - Lesson ${lessonId}`,
    });
  };

  const handleExit = () => {
    if (!userId) return; // Skip if no userId
    trackEvent(userId, 'exit_video', {
      category: 'Video',
      label: `Unit ${unitId} - Lesson ${lessonId}`,
    });
    navigate("/lessons");
  };

  const handleStartQuiz = () => {
    if (!userId) return; // Skip if no userId
    trackEvent(userId, 'start_quiz_clicked', {
      category: 'Video',
      label: `Unit ${unitId} - Lesson ${lessonId}`,
    });
    navigate(`/quiz/${unitId}/${lessonId}`);
  };

  return (
    <div className="lesson-container">
      <button className="back-button" onClick={handleExit}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>

      <div className="vlesson-content">
        <h1 className="lesson-header" style={{ backgroundColor: unitColor }}>
          {t("video.unit")} {unitId} - {lessonData?.title || `Lesson ${lessonId}`}
        </h1>

        <div className="video-container">
          {/* {loading ? (
            <p>Loading video...</p>
          ) : error ? (
            <>
              <p>Error: {error}</p>
              <video controls onPlay={handlePlay} onEnded={handleVideoEnd}>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </> */}
            {loading ? (
              <Loading />
             ) : error ? (
             <>
              <p>Error: {error}</p>
              <PyMagicRunner />
               </>
              ) : lessonData?.video_url ? (
            <video controls onPlay={handlePlay} onEnded={handleVideoEnd}>
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
              <video controls onPlay={handlePlay} onEnded={handleVideoEnd}>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </>
          )}
        </div>

        <button className="quiz-button" onClick={handleStartQuiz}>
          {t("video.startQuiz")}
        </button>
      </div>
    </div>
  );
};

export default Video;