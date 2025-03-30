import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lsidebar from "./Lsidebar";
import "./LessonSection.css";
import unitquizicon from "../components/images/unitquizicon.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';

const LessonSection = () => {
  const { user } = useAuth();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDeniedLessons, setAccessDeniedLessons] = useState(new Set());
  const [accessDeniedUnits, setAccessDeniedUnits] = useState(new Set());
  const location = useLocation();
  const navigate = useNavigate();

  const userId = user.id;

  const generateColor = (id) => {
    const hue = (id * 137) % 360;
    return `hsl(${hue}, 70%, 45%)`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/sections/1");
        if (response.status !== 200) throw new Error("Failed to fetch data");
        setLessonData(response.data);
      } catch (error) {
        setError(error.message);
        setLessonData({
          units: [
            { id: 1, name: "Default Unit 1", lessons: [{ id: 1, title: "Default Lesson 1.1" }, { id: 2, title: "Default Lesson 1.2" }] },
            { id: 2, name: "Default Unit 2", lessons: [{ id: 3, title: "Default Lesson 2.1" }, { id: 4, title: "Default Lesson 2.2" }] },
            { id: 3, name: "Default Unit 3", lessons: [{ id: 5, title: "Default Lesson 3.1" }, { id: 6, title: "Default Lesson 3.2" }] },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const checkLessonAccess = async (lessonId) => {
    try {
      const response = await apiClient.get(`/api/quiz/check-access/${userId}/${lessonId}`);
      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Access denied");
      }
      return true;
    } catch (error) {
      setAccessDeniedLessons((prev) => new Set(prev).add(lessonId));
      alert(error.message);
      return false;
    }
  };

  const checkUnitQuizAccess = async (unitId) => {
    try {
      const response = await apiClient.get(`/api/quiz/check-access/${userId}/unit/${unitId}`);
      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Access denied");
      }
      return true;
    } catch (error) {
      setAccessDeniedUnits((prev) => new Set(prev).add(unitId));
      alert(error.message);
      return false;
    }
  };

  const handleLessonClick = async (unitId, lessonId) => {
    const hasAccess = await checkLessonAccess(lessonId);
    if (hasAccess) {
      navigate(`/lesson/${unitId}/${lessonId}`);
    }
  };

  const handleUnitQuizClick = async (unitId) => {
    const hasAccess = await checkUnitQuizAccess(unitId);
    if (hasAccess) {
      navigate(`/unit-quiz/${unitId}`);
    }
  };

  if (loading) return <div>Loading...</div>;

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
                        onClick={() => handleLessonClick(unit.id, lesson.id)}
                        disabled={isAccessDeniedLesson}
                      >
                        {index + 1} {/* Display lesson number within the unit */}
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
      </div>
    </div>
  );
};

export default LessonSection;