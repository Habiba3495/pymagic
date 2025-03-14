// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import Lsidebar from "./Lsidebar";
// import "./LessonSection.css";
// import unitquizicon from "../components/images/unitquizicon.svg";

// const LessonSection = () => {
//   const [lessonData, setLessonData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [watchedLessons, setWatchedLessons] = useState(new Set());
//   const location = useLocation();
//   const [openedQuizzes, setOpenedQuizzes] = useState(new Set());

//   // دالة توليد اللون بناءً على id الوحدة
//   const generateColor = (id) => {
//     const hue = (id * 137) % 360; // توزيع الألوان بالتساوي
//     return `hsl(${hue}, 70%, 45%)`; // استخدام HSL لتوليد لون فريد
//   };

//   useEffect(() => {
//     const storedLessons =
//       JSON.parse(localStorage.getItem("watchedLessons")) || [];
//     setWatchedLessons(new Set(storedLessons));

//     const storedQuizzes =
//       JSON.parse(localStorage.getItem("openedQuizzes")) || [];
//     setOpenedQuizzes(new Set(storedQuizzes));
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/sections/1");
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();
//         setLessonData(data);
//       } catch (error) {
//         setError(error.message);
//         setLessonData({
//           units: [
//             {
//               id: 1,
//               name: "Default Unit 1",
//               lessons: [
//                 { id: 1, name: "Default Lesson 1.1" },
//                 { id: 2, name: "Default Lesson 1.2" },
//               ],
//             },
//             {
//               id: 2,
//               name: "Default Unit 2",
//               lessons: [
//                 { id: 3, name: "Default Lesson 2.1" },
//                 { id: 4, name: "Default Lesson 2.2" },
//               ],
//             },
//             {
//               id: 3,
//               name: "Default Unit 3",
//               lessons: [
//                 { id: 5, name: "Default Lesson 3.1" },
//                 { id: 6, name: "Default Lesson 3.2" },
//               ],
//             },
//           ],
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const markLessonAsWatched = (lessonId) => {
//     const updatedLessons = new Set(watchedLessons);
//     updatedLessons.add(lessonId);
//     setWatchedLessons(updatedLessons);
//     localStorage.setItem("watchedLessons", JSON.stringify([...updatedLessons]));
//   };

//   const markQuizAsOpened = (unitId) => {
//     const updatedQuizzes = new Set(openedQuizzes);
//     updatedQuizzes.add(unitId);
//     setOpenedQuizzes(updatedQuizzes);
//     localStorage.setItem("openedQuizzes", JSON.stringify([...updatedQuizzes]));
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   return (
//     <div className="lesson-container-div">
//       <Lsidebar />
//       <div className="l-content">
//         {(() => {
//           let globalIndex = 0;
//           let isLeft = false;

//           return lessonData.units.map((unit) => (
//             <div key={unit.id} className="unit-container">
//               <div
//                 className="unit-header"
//                 style={{ backgroundColor: generateColor(unit.id) }}
//               >
//                 <h3 className="unit-title">{unit.name}</h3>
//               </div>
//               <div className="lesson-list">
//                 {unit.lessons.map((lesson, index) => {
//                   globalIndex++;
//                   if (globalIndex % 5 === 1) {
//                     isLeft = !isLeft;
//                   }

//                   const marginLeft =
//                     globalIndex % 5 === 2 || globalIndex % 5 === 4
//                       ? "50px"
//                       : globalIndex % 5 === 3
//                       ? "100px"
//                       : "0px";
//                   const marginRight =
//                     globalIndex % 5 === 2 || globalIndex % 5 === 4
//                       ? "50px"
//                       : globalIndex % 5 === 3
//                       ? "100px"
//                       : "0px";
//                   let margin = isLeft ? { marginLeft } : { marginRight };

//                   let quiz_margin = null;
//                   if (index === unit.lessons.length - 1) {
//                     globalIndex++;
//                     if (globalIndex % 5 === 1) {
//                       isLeft = !isLeft;
//                     }
//                     const quiz_margin_value =
//                       globalIndex % 5 === 2 || globalIndex % 5 === 4
//                         ? "50px"
//                         : globalIndex % 5 === 3
//                         ? "100px"
//                         : "0px";
//                     quiz_margin = isLeft
//                       ? { marginLeft: quiz_margin_value }
//                       : { marginRight: quiz_margin_value };
//                   }

//                   const isActiveLesson =
//                     location.pathname === `/lesson/${unit.id}/${lesson.id}`;
//                   const isWatched = watchedLessons.has(lesson.id);
//                   const isQuizOpened = openedQuizzes.has(unit.id);

//                   return (
//                     <React.Fragment key={lesson.id}>
//                       {/* <Link
//                         to={`/lesson/${unit.id}/${lesson.id}`}
//                         className={`lesson-button ${isActiveLesson ? "active-lesson" : ""} ${isWatched ? "watched-lesson" : ""}`}
//                         // style={margin}
//                         // style={{
//                         //   ...margin,
//                         //   backgroundColor: isWatched ? generateColor(unit.id) : "initial",
//                         // }}
//                         style={{
//                           ...margin,
//                           backgroundColor: isWatched ? generateColor(unit.id) : "initial",
//                         }}
                        
                        
//                         onClick={() => markLessonAsWatched(lesson.id)}
//                       >
//                         {index + 1}
//                       </Link> */}
//                       <Link
//                         to={`/lesson/${unit.id}/${lesson.id}`}
//                         className={`lesson-button ${
//                           isActiveLesson ? "active-lesson" : ""
//                         } ${isWatched ? "watched-lesson" : ""}`}
//                         style={{
//                           ...margin,
//                           "--unit-color": isWatched
//                             ? generateColor(unit.id)
//                             : "initial",
//                         }}
//                         onClick={() => markLessonAsWatched(lesson.id)}
//                       >
//                         {index + 1}
//                       </Link>

//                       {index === unit.lessons.length - 1 && (
//                         //   <Link
//                         //   to={`/unit-quiz/${unit.id}`}
//                         //   className={`lesson-button ${isQuizOpened ? "watched-lesson" : ""}`}
//                         //   style={quiz_margin}
//                         //   onClick={() => markQuizAsOpened(unit.id)}
//                         //   >
//                         //   <img src={unitquizicon} alt="unitquiz" className="unitquizicon" />
//                         //  </Link>
//                         <Link
//                           to={`/unit-quiz/${unit.id}`}
//                           className={`unit-button ${
//                             isQuizOpened ? "watched-unit" : ""
//                           }`}
//                           style={{
//                             ...quiz_margin,
//                             backgroundColor: isQuizOpened
//                               ? generateColor(unit.id)
//                               : "#B8B8D1", // يحدد اللون حسب الحالة
//                           }}
//                           onClick={() => markQuizAsOpened(unit.id)}
//                         >
//                           <img
//                             src={unitquizicon}
//                             alt="unitquiz"
//                             className="unitquizicon"
//                           />
//                         </Link>
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </div>
//             </div>
//           ));
//         })()}
//       </div>
//     </div>
//   );
// };

// export default LessonSection;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lsidebar from "./Lsidebar";
import "./LessonSection.css";
import unitquizicon from "../components/images/unitquizicon.svg";
import { useAuth } from '../context/AuthContext';//1

const LessonSection = () => {
  const { user } = useAuth();//2
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchedLessons, setWatchedLessons] = useState(new Set());
  const [openedQuizzes, setOpenedQuizzes] = useState(new Set());
  const [accessDeniedLessons, setAccessDeniedLessons] = useState(new Set()); // Track lessons with denied access
  const [accessDeniedUnits, setAccessDeniedUnits] = useState(new Set()); // Track units with denied quiz access
  const location = useLocation();
  const navigate = useNavigate();

  // Assume user_id is stored in localStorage (replace with your auth mechanism)
  const userId = user.id//3

  // Generate color based on unit ID
  const generateColor = (id) => {
    const hue = (id * 137) % 360;
    return `hsl(${hue}, 70%, 45%)`;
  };

  // Fetch initial watched lessons and quizzes from localStorage
  useEffect(() => {
    const storedLessons = JSON.parse(localStorage.getItem("watchedLessons")) || [];
    setWatchedLessons(new Set(storedLessons));

    const storedQuizzes = JSON.parse(localStorage.getItem("openedQuizzes")) || [];
    setOpenedQuizzes(new Set(storedQuizzes));
  }, []);

  // Fetch lesson data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/sections/1", {
          credentials: "include", // يسمح بإرسال الكوكيز
        });
        console.log(response);
        
                if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setLessonData(data);
      } catch (error) {
        setError(error.message);
        setLessonData({
          units: [
            { id: 1, name: "Default Unit 1", lessons: [{ id: 1, name: "Default Lesson 1.1" }, { id: 2, name: "Default Lesson 1.2" }] },
            { id: 2, name: "Default Unit 2", lessons: [{ id: 3, name: "Default Lesson 2.1" }, { id: 4, name: "Default Lesson 2.2" }] },
            { id: 3, name: "Default Unit 3", lessons: [{ id: 5, name: "Default Lesson 3.1" }, { id: 6, name: "Default Lesson 3.2" }] },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to check lesson access via API
  const checkLessonAccess = async (lessonId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz/check-access/${userId}/${lessonId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // يسمح بإرسال الكوكيز

      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Access denied");
      }
      return true; // Access granted
    } catch (error) {
      setAccessDeniedLessons((prev) => new Set(prev).add(lessonId)); // Mark lesson as denied
      alert(error.message); // Show feedback to user
      return false; // Access denied
    }
  };

  // Function to check unit quiz access via API
  const checkUnitQuizAccess = async (unitId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz/check-access/${userId}/unit/${unitId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // يسمح بإرسال الكوكيز
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Access denied");
      }
      return true; // Access granted
    } catch (error) {
      setAccessDeniedUnits((prev) => new Set(prev).add(unitId)); // Mark unit quiz as denied
      alert(error.message); // Show feedback to user
      return false; // Access denied
    }
  };

  // Mark lesson as watched
  const markLessonAsWatched = (lessonId) => {
    const updatedLessons = new Set(watchedLessons);
    updatedLessons.add(lessonId);
    setWatchedLessons(updatedLessons);
    localStorage.setItem("watchedLessons", JSON.stringify([...updatedLessons]));
  };

  // Mark quiz as opened
  const markQuizAsOpened = (unitId) => {
    const updatedQuizzes = new Set(openedQuizzes);
    updatedQuizzes.add(unitId);
    setOpenedQuizzes(updatedQuizzes);
    localStorage.setItem("openedQuizzes", JSON.stringify([...updatedQuizzes]));
  };

  // Handle lesson click with access check
  const handleLessonClick = async (unitId, lessonId) => {
    const hasAccess = await checkLessonAccess(lessonId);
    if (hasAccess) {
      markLessonAsWatched(lessonId);
      navigate(`/lesson/${unitId}/${lessonId}`); // Navigate if access granted
    }
  };

  // Handle unit quiz click with access check
  const handleUnitQuizClick = async (unitId) => {
    const hasAccess = await checkUnitQuizAccess(unitId);
    if (hasAccess) {
      markQuizAsOpened(unitId);
      navigate(`/unit-quiz/${unitId}`); // Navigate if access granted
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
                  const isWatched = watchedLessons.has(lesson.id);
                  const isQuizOpened = openedQuizzes.has(unit.id);
                  const isAccessDeniedLesson = accessDeniedLessons.has(lesson.id);
                  const isAccessDeniedUnit = accessDeniedUnits.has(unit.id);

                  return (
                    <React.Fragment key={lesson.id}>
                      <button
                        className={`lesson-button ${isActiveLesson ? "active-lesson" : ""} ${
                          isWatched ? "watched-lesson" : ""
                        } ${isAccessDeniedLesson ? "disabled-lesson" : ""}`}
                        style={{
                          ...margin,
                          "--unit-color": isWatched ? generateColor(unit.id) : "initial",
                          cursor: isAccessDeniedLesson ? "not-allowed" : "pointer",
                        }}
                        onClick={() => handleLessonClick(unit.id, lesson.id)}
                        disabled={isAccessDeniedLesson} // Disable button if access denied
                      >
                        {index + 1}
                      </button>

                      {index === unit.lessons.length - 1 && (
                        <button
                          className={`unit-button ${isQuizOpened ? "watched-unit" : ""} ${
                            isAccessDeniedUnit ? "disabled-unit" : ""
                          }`}
                          style={{
                            ...quizMargin,
                            backgroundColor: isQuizOpened ? generateColor(unit.id) : "#B8B8D1",
                            cursor: isAccessDeniedUnit ? "not-allowed" : "pointer",
                          }}
                          onClick={() => handleUnitQuizClick(unit.id)}
                          disabled={isAccessDeniedUnit} // Disable button if access denied
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





