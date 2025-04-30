import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lsidebar from "./Sidebar.js";
import "./LessonSection.css";
import unitquizicon from "../components/images/unitquizicon.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import trackEvent from '../utils/trackEvent';
import PyMagicRunner from "./Pymagic_runnergame.js"; 
import Loading from "./Loading.js"; 
import { useTranslation } from "react-i18next";

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
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.id) {
      trackEvent(user.id, 'pageview', { 
        page: '/lessons',
        category: 'Navigation'
      });
    }
  
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Fetch section data (includes prevSectionName and nextSectionName)
        const response = await apiClient.get(`/sections/${sectionId}`);
        if (response.status !== 200) throw new Error("Failed to fetch section data");
  
        const sectionData = response.data;
        setLessonData(sectionData);
        setPrevSectionName(sectionData.prevSectionName || ""); // Set previous section name
        setNextSectionName(sectionData.nextSectionName || ""); // Set next section name
  
  
      } catch (error) {
        setError(error.message);
        trackEvent(user.id, 'lesson_data_error', {
          category: 'Error',
          label: 'Lesson Data Error',
          error: error.message
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [user, sectionId]);

  const checkLessonAccess = async (lessonId) => {
    try {
      const response = await apiClient.get(`/api/quiz/check-access/lesson/${user.id}/${lessonId}`);
      console.log(`API response for lesson_id=${lessonId}:`, response.data);
      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Access denied");
      }
      return true;
    } catch (error) {
      console.log(`Lesson access error: lesson_id=${lessonId}, message=${error.message}`);
      setAccessDeniedLessons((prev) => new Set(prev).add(lessonId));
      trackEvent(user.id, 'lesson_access_denied', {
        category: 'Access',
        label: 'Lesson Access Denied',
        lesson_id: lessonId,
        error: error.message
      });
      // setPopupMessage(lessonId === 1
      //   ? t("FirstLessonAccessError")
      //   : error.message || t("lesson.Unlocklessons"));
      // setPopupVisible(true);
      // return false;

      setPopupMessage(lessonId === 1
        ? t("FirstLessonAccessError")
        : t("lesson.Unlocklessons"));
      setPopupVisible(true);
      return false;
    }
  };
  
  const checkUnitQuizAccess = async (unitId) => {
    try {
      const response = await apiClient.get(`/api/quiz/check-access/unit/${user.id}/${unitId}`);
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
      setPopupMessage(t("lesson.Unlockunitquiz"));
      setPopupVisible(true);
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

  ///////////////////// Photo in loading 

  if (loading) return <Loading />;
  if (error) return <PyMagicRunner />;

  return (
    <div className="lesson-container-div">
      <Lsidebar />
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
                {t("lesson.Previous")}: {prevSectionName}
              </button>
            </div>
          )}
          
          {lessonData.sectionCount !== sectionId && (
            <div className="nav-button-wrapper">
              <button 
                onClick={() => getNextSection()}
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