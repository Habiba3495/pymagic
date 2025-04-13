import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lsidebar from "./Lsidebar";
import "./LessonSection.css";
import unitquizicon from "../components/images/unitquizicon.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import trackEvent from '../utils/trackEvent';

const LessonSection = () => {
  const { user } = useAuth();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDeniedLessons, setAccessDeniedLessons] = useState(new Set());
  const [accessDeniedUnits, setAccessDeniedUnits] = useState(new Set());
  const [nextSectionName, setNextSectionName] = useState("");
  const [prevSectionName, setPrevSectionName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [sectionId, setSectionId] = useState(user?.lastSectionId || 1);

  useEffect(() => {
    if (user?.id) {
      trackEvent(user.id, 'pageview', { 
        page: '/lessons',
        category: 'Navigation'
      });
    }

    const fetchData = async () => {
      try {        
        const response = await apiClient.get(`/sections/${sectionId}`);
        if (response.status !== 200) throw new Error("Failed to fetch data");
        
        setLessonData(response.data);
        
        trackEvent(user.id, 'lesson_data_loaded', {
          category: 'Lesson',
          label: 'Lesson Data Loaded',
          unit_count: response.data.units.length,
          lesson_count: response.data.units.reduce((sum, unit) => sum + unit.lessons.length, 0)
        });

        // Fetch next section name if available
        if (sectionId < response.data.sectionCount) {
          const nextResponse = await apiClient.get(`/sections/${sectionId + 1}`);
          if (nextResponse.data?.name) {
            setNextSectionName(nextResponse.data.name);
          }
        }

        // Fetch previous section name if available
        if (sectionId > 1) {
          const prevResponse = await apiClient.get(`/sections/${sectionId - 1}`);
          if (prevResponse.data?.name) {
            setPrevSectionName(prevResponse.data.name);
          }
        }
      } catch (error) {
        setError(error.message);
        trackEvent(user.id, 'lesson_data_error', {
          category: 'Error',
          label: 'Lesson Data Error',
          error: error.message
        });
        
        const dummyData = {
          name: "Default Section",
          sectionCount: 3,
          units: [
            { id: 1, name: "Default Unit 1", lessons: [{ id: 1, title: "Default Lesson 1.1" }, { id: 2, title: "Default Lesson 1.2" }] },
            { id: 2, name: "Default Unit 2", lessons: [{ id: 3, title: "Default Lesson 2.1" }, { id: 4, title: "Default Lesson 2.2" }] },
            { id: 3, name: "Default Unit 3", lessons: [{ id: 5, title: "Default Lesson 3.1" }, { id: 6, title: "Default Lesson 3.2" }] },
          ],
        };
        setLessonData(dummyData);
        setNextSectionName("Next Default Section");
        setPrevSectionName("Previous Default Section");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, sectionId]);

  const checkLessonAccess = async (lessonId) => {
    try {
      const response = await apiClient.get(`/api/quiz/check-access/${user.id}/${lessonId}`);
      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Access denied");
      }
      return true;
    } catch (error) {
      setAccessDeniedLessons((prev) => new Set(prev).add(lessonId));
      trackEvent(user.id, 'lesson_access_denied', {
        category: 'Access',
        label: 'Lesson Access Denied',
        lesson_id: lessonId,
        error: error.message
      });
      alert(error.message);
      return false;
    }
  };

  const checkUnitQuizAccess = async (unitId) => {
    try {
      const response = await apiClient.get(`/api/quiz/check-access/${user.id}/unit/${unitId}`);
      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Access denied");
      }
      return true;
    } catch (error) {
      setAccessDeniedUnits((prev) => new Set(prev).add(unitId));
      trackEvent(user.id, 'unit_quiz_access_denied', {
        category: 'Access',
        label: 'Unit Quiz Access Denied',
        unit_id: unitId,
        error: error.message
      });
      alert(error.message);
      return false;
    }
  };

  const handleLessonClick = async (unitId, lessonId, lessonNumber) => {
    trackEvent(user.id, 'lesson_clicked', {
      category: 'Navigation',
      label: 'Lesson Clicked',
      unit_id: unitId,
      lesson_id: lessonId,
      lesson_number: lessonNumber
    });

    const hasAccess = await checkLessonAccess(lessonId);
    if (hasAccess) {
      trackEvent(user.id, 'lesson_accessed', {
        category: 'Lesson',
        label: 'Lesson Accessed',
        unit_id: unitId,
        lesson_id: lessonId
      });
      navigate(`/lesson/${unitId}/${lessonId}`);
    }
  };

  const handleUnitQuizClick = async (unitId) => {
    trackEvent(user.id, 'unit_quiz_clicked', {
      category: 'Navigation',
      label: 'Unit Quiz Clicked',
      unit_id: unitId
    });

    const hasAccess = await checkUnitQuizAccess(unitId);
    if (hasAccess) {
      trackEvent(user.id, 'unit_quiz_accessed', {
        category: 'Quiz',
        label: 'Unit Quiz Accessed',
        unit_id: unitId
      });
      navigate(`/unit-quiz/${unitId}`);
    }
  };

  const getNextSection = () => {
    const nextId = sectionId + 1;
    setSectionId(nextId);
  };

  const getPreviousSection = () => {
    setSectionId(sectionId - 1);
  };

  if (loading) return <div className="loading-indicator">Loading lessons...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="lesson-container-div">
      <Lsidebar />
      <div className="l-content">
        {lessonData.units.map((unit) => {
          let globalIndex = 0;
          let isLeft = false;

          return (
            <div key={unit.id} className="unit-container">
              <div className="unit-header" style={{ backgroundColor: generateColor(unit.id) }}>
                <h3 className="unit-title">{unit.name}</h3>
              </div>
              <div className="lesson-list">
                {unit.lessons.map((lesson, index) => {
                  globalIndex++;
                  if (globalIndex % 5 === 1) isLeft = !isLeft;

                  const marginLeft = globalIndex % 5 === 2 || globalIndex % 5 === 4 ? "50px" : globalIndex % 5 === 3 ? "100px" : "0px";
                  const marginRight = globalIndex % 5 === 2 || globalIndex % 5 === 4 ? "50px" : globalIndex % 5 === 3 ? "100px" : "0px";
                  const margin = isLeft ? { marginLeft } : { marginRight };

                  let quizMargin = null;
                  if (index === unit.lessons.length - 1) {
                    globalIndex++;
                    if (globalIndex % 5 === 1) isLeft = !isLeft;
                    const quizMarginValue = globalIndex % 5 === 2 || globalIndex % 5 === 4 ? "50px" : globalIndex % 5 === 3 ? "100px" : "0px";
                    quizMargin = isLeft ? { marginLeft: quizMarginValue } : { marginRight: quizMarginValue };
                  }

                  const isActiveLesson = location.pathname === `/lesson/${unit.id}/${lesson.id}`;
                  const lessonQuiz = lesson.quizzes && lesson.quizzes.length > 0 ? lesson.quizzes[0] : null;
                  const isLessonPassed = lessonQuiz && lessonQuiz.is_passed;
                  const unitQuiz = unit.quizzes && unit.quizzes.length > 0 ? unit.quizzes[0] : null;
                  const isUnitQuizPassed = unitQuiz && unitQuiz.is_passed;
                  const isAccessDeniedLesson = accessDeniedLessons.has(lesson.id);
                  const isAccessDeniedUnit = accessDeniedUnits.has(unit.id);

                  return (
                    <React.Fragment key={lesson.id}>
                      <button
                        className={`lesson-button ${isActiveLesson ? "active-lesson" : ""} ${
                          isLessonPassed ? "passed-lesson" : ""
                        } ${isAccessDeniedLesson ? "disabled-lesson" : ""}`}
                        style={{
                          ...margin,
                          "--unit-color": isLessonPassed ? generateColor(unit.id) : "#B8B8D1",
                          cursor: isAccessDeniedLesson ? "not-allowed" : "pointer",
                        }}
                        onClick={() => handleLessonClick(unit.id, lesson.id, index + 1)}
                        disabled={isAccessDeniedLesson}
                      >
                        {index + 1}
                      </button>

                      {index === unit.lessons.length - 1 && (
                        <button
                          className={`unit-button ${isUnitQuizPassed ? "passed-unit" : ""} ${
                            isAccessDeniedUnit ? "disabled-unit" : ""
                          }`}
                          style={{
                            ...quizMargin,
                            "--unit-color": isUnitQuizPassed ? generateColor(unit.id) : "#B8B8D1",
                            cursor: isAccessDeniedUnit ? "not-allowed" : "pointer",
                          }}
                          onClick={() => handleUnitQuizClick(unit.id)}
                          disabled={isAccessDeniedUnit}
                        >
                          <img src={unitquizicon} alt="unitquiz" className="unitquizicon" />
                        </button>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="section-navigation">
          {sectionId !== 1 && (
            <div className="nav-button-wrapper">
              <button 
                onClick={() => getPreviousSection()}
                className="nav-button prev-button"
              >
                Previous: {prevSectionName}
              </button>
            </div>
          )}
          
          {lessonData.sectionCount !== sectionId && (
            <div className="nav-button-wrapper">
              <button 
                onClick={() => getNextSection()}
                className="nav-button next-button"
              >
                Next: {nextSectionName}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const generateColor = (id) => {
  const hue = (id * 137) % 360;
  return `hsl(${hue}, 70%, 45%)`;
};

export default LessonSection;