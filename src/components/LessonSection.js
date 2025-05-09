import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./LessonSection.css";
import unitquizicon from "../components/images/unitquizicon.svg";
import { useAuth } from '../context/AuthContext';
import { useError } from '../context/ErrorContext';
import apiClient from '../services';
import trackEvent from '../utils/trackEvent';
import Loading from "./Loading.js";
import { useTranslation } from "react-i18next";

const LessonSection = () => {
  const { user } = useAuth();
  const { setBackendError } = useError();
  const location = useLocation();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDeniedLessons, setAccessDeniedLessons] = useState(new Set());
  const [accessDeniedUnits, setAccessDeniedUnits] = useState(new Set());
  const [nextSectionName, setNextSectionName] = useState("");
  const [prevSectionName, setPrevSectionName] = useState("");
  const navigate = useNavigate();
  const [sectionId, setSectionId] = useState(user?.lastSectionId || 1);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const { t } = useTranslation();
  const lastSectionId = useRef(null);

  useEffect(() => {
    if (!user || !user.id) {
      console.log('No user, skipping fetch data');
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(`/sections/${sectionId}`);
        if (response.status !== 200) throw new Error("Failed to fetch section data");

        const sectionData = response.data;
        setLessonData(sectionData);
        setPrevSectionName(sectionData.prevSectionName || "");
        setNextSectionName(sectionData.nextSectionName || "");

        const eventKey = `lesson_data_loaded-${user.id}-${sectionId}`;
        const trackedEvents = JSON.parse(sessionStorage.getItem('trackedEvents') || '{}');

        if (
          lastSectionId.current !== sectionId &&
          sectionData.units?.length > 0 &&
          !trackedEvents[eventKey]
        ) {
          console.log('Sending lesson_data_loaded event for sectionId:', sectionId);
          await trackEvent(user.id, 'lesson_data_loaded', {
            category: 'Lessons',
            label: 'Lesson Data Loaded',
            section_id: sectionId,
            unit_count: sectionData.units.length,
            lesson_count: sectionData.units.reduce(
              (sum, unit) => sum + (unit.lessons?.length || 0),
              0
            ),
          }, user).catch((error) => {
            console.error('Failed to track lesson_data_loaded:', error);
          });

          trackedEvents[eventKey] = true;
          sessionStorage.setItem('trackedEvents', JSON.stringify(trackedEvents));
          lastSectionId.current = sectionId;
        }
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        if (error.message === 'No internet connection' || error.status >= 500) {
          setBackendError(error.message, error.status || null);
        }
        if (user && user.id) {
          console.log('Sending lesson_data_error event');
          await trackEvent(user.id, 'lesson_data_error', {
            category: 'Error',
            label: 'Lesson Data Error',
            error: error.message
          }, user).catch((error) => {
            console.error('Failed to track lesson_data_error:', error);
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, sectionId, navigate, t, setBackendError]);

  const checkLessonAccess = async (lessonId) => {
    try {
      if (!user || !user.id) {
        console.log('No user, skipping lesson access check');
        return false;
      }

      const response = await apiClient.get(`/api/quiz/check-access/lesson/${user.id}/${lessonId}`);
      console.log(`API response for lesson_id=${lessonId}:`, response.data);
      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Access denied");
      }
      return true;
    } catch (error) {
      console.log(`Lesson access error: lesson_id=${lessonId}, message=${error.message}`);
      setAccessDeniedLessons((prev) => new Set(prev).add(lessonId));
      if (error.message === 'No internet connection' || error.status >= 500) {
        setBackendError(error.message, error.status || null);
      }
      if (user && user.id) {
        console.log('Sending lesson_access_denied event');
        await trackEvent(user.id, 'lesson_access_denied', {
          category: 'Access',
          label: 'Lesson Access Denied',
          lesson_id: lessonId,
          error: error.message
        }, user).catch((error) => {
          console.error('Failed to track lesson_access_denied:', error);
        });
      }

      setPopupMessage(lessonId === 1
        ? t("lesson.FirstLessonAccessError")
        : t("lesson.Unlocklessons"));
      setPopupVisible(true);
      return false;
    }
  };

  const checkUnitQuizAccess = async (unitId) => {
    try {
      if (!user || !user.id) {
        console.log('No user, skipping unit quiz access check');
        return false;
      }

      const response = await apiClient.get(`/api/quiz/check-access/unit/${user.id}/${unitId}`);
      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Access denied");
      }
      return true;
    } catch (error) {
      setAccessDeniedUnits((prev) => new Set(prev).add(unitId));
      if (error.message === 'No internet connection' || error.status >= 500) {
        setBackendError(error.message, error.status || null);
      }
      if (user && user.id) {
        console.log('Sending unit_quiz_access_denied event');
        await trackEvent(user.id, 'unit_quiz_access_denied', {
          category: 'Access',
          label: 'Unit Quiz Access Denied',
          unit_id: unitId,
          error: error.message
        }, user).catch((error) => {
          console.error('Failed to track unit_quiz_access_denied:', error);
        });
      }
      setPopupMessage(t("lesson.Unlockunitquiz"));
      setPopupVisible(true);
      return false;
    }
  };

  const checkNextSectionAccess = async () => {
    try {
      if (!user || !user.id) {
        console.log('No user, skipping next section access check');
        return false;
      }

      const response = await apiClient.get(`/sections/check-next-section-access/${user.id}/${sectionId}`);
      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Access denied to next section");
      }
      return true;
    } catch (error) {
      console.log(`Next section access error: section_id=${sectionId}, message=${error.message}`);
      if (error.message === 'No internet connection' || error.status >= 500) {
        setBackendError(error.message, error.status || null);
      }
      if (user && user.id) {
        console.log('Sending next_section_access_denied event');
        await trackEvent(user.id, 'next_section_access_denied', {
          category: 'Access',
          label: 'Next Section Access Denied',
          section_id: sectionId,
          error: error.message
        }, user).catch((error) => {
          console.error('Failed to track next_section_access_denied:', error);
        });
      }
      setPopupMessage(t("lesson.UnlockNextSection"));
      setPopupVisible(true);
      return false;
    }
  };

  const handleLessonClick = async (unitId, lessonId, lessonNumber) => {
    if (!user || !user.id) {
      console.log('No user, skipping lesson tracking');
      navigate('/login');
      return;
    }

    console.log('Sending lesson_clicked event');
    await trackEvent(user.id, 'lesson_clicked', {
      category: 'Navigation',
      label: 'Lesson Clicked',
      unit_id: unitId,
      lesson_id: lessonId,
      lesson_number: lessonNumber
    }, user).catch((error) => {
      console.error('Failed to track lesson_clicked:', error);
    });

    const hasAccess = await checkLessonAccess(lessonId);
    if (hasAccess) {
      console.log('Sending lesson_accessed event');
      await trackEvent(user.id, 'lesson_accessed', {
        category: 'Lesson',
        label: 'Lesson Accessed',
        unit_id: unitId,
        lesson_id: lessonId
      }, user).catch((error) => {
        console.error('Failed to track lesson_accessed:', error);
      });
      navigate(`/lesson/${unitId}/${lessonId}`);
    }
  };

  const handleUnitQuizClick = async (unitId) => {
    if (!user || !user.id) {
      console.log('No user, skipping unit quiz tracking');
      navigate('/login');
      return;
    }

    console.log('Sending unit_quiz_clicked event');
    await trackEvent(user.id, 'unit_quiz_clicked', {
      category: 'Navigation',
      label: 'Unit Quiz Clicked',
      unit_id: unitId
    }, user).catch((error) => {
      console.error('Failed to track unit_quiz_clicked:', error);
    });

    const hasAccess = await checkUnitQuizAccess(unitId);
    if (hasAccess) {
      console.log('Sending unit_quiz_accessed event');
      await trackEvent(user.id, 'unit_quiz_accessed', {
        category: 'Quiz',
        label: 'Unit Quiz Accessed',
        unit_id: unitId
      }, user).catch((error) => {
        console.error('Failed to track unit_quiz_accessed:', error);
      });
      navigate(`/unit-quiz/${unitId}`);
    }
  };

  const getNextSection = async () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    const hasAccess = await checkNextSectionAccess();
    if (hasAccess) {
      const nextId = sectionId + 1;
      setSectionId(nextId);
      console.log('Sending next_section_clicked event');
      await trackEvent(user.id, 'next_section_clicked', {
        category: 'Navigation',
        label: 'Next Section',
        section_id: nextId
      }, user).catch((error) => {
        console.error('Failed to track next_section_clicked:', error);
      });
    }
  };

  const getPreviousSection = () => {
    const prevId = sectionId - 1;
    setSectionId(prevId);
    if (user && user.id) {
      console.log('Sending previous_section_clicked event');
      trackEvent(user.id, 'previous_section_clicked', {
        category: 'Navigation',
        label: 'Previous Section',
        section_id: prevId
      }, user).catch((error) => {
        console.error('Failed to track previous_section_clicked:', error);
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="lesson-container-div">
      <Sidebar />
      <div className="l-content">
        {lessonData.units.map((unit) => {
          let globalIndex = 0;
          let isLeft = false;

          return (
            <div key={unit.id} className="lesson-unit-container">
              <div className="lesson-unit-header" style={{ backgroundColor: generateColor(unit.id) }}>
                <p className="lesson-unit-title">{unit.name}</p>
              </div>
              <div className="lesson-list">
                {unit.lessons
                  .sort((a, b) => a.id - b.id)
                  .map((lesson, index) => {
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
                {t("lesson.Previous")}: {prevSectionName}
              </button>
            </div>
          )}

          {lessonData.sectionCount !== sectionId && (
            <div className="nav-button-wrapper">
              <button
                onClick={getNextSection}
                className="nav-button next-button"
              >
                {t("lesson.Next")}: {nextSectionName}
              </button>
            </div>
          )}
        </div>
      </div>

      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button className="popup-close-btn" onClick={() => setPopupVisible(false)}>
              {t("lesson.Ok")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const generateColor = (id) => {
  const colors = [
    "#5B287C",
    "#FFC145",
    "#1F82A3",
    "#2B4858",
  ];
  return colors[(id - 1) % colors.length];
};

export default LessonSection;