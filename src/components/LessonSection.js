// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Lsidebar from "./Lsidebar";
// import "./LessonSection.css";

// const LessonPage = () => {
//   const [lessonData, setLessonData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sectionId, setSectionId] = useState(1); // State to track the current section ID

//   useEffect(() => {
//     // Fetch data from the API based on the current sectionId
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/sections/${sectionId}`); // Use sectionId state
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
//                 { id: 1, name: "Default Lesson 1" },
//                 { id: 2, name: "Default Lesson 2" },
//                 { id: 3, name: "Default Lesson 3" },
//                 { id: 4, name: "Default Lesson 4" },
//                 { id: 5, name: "Default Lesson 5" },
//                 { id: 6, name: "Default Lesson 6" },
//                 { id: 3, name: "Default Lesson 3" },
//                 { id: 3, name: "Default Lesson 3" },
//                 { id: 3, name: "Default Lesson 3" }
//               ]
//             }
//           ]
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [sectionId]); // Re-fetch data when sectionId changes

//   const handleNextSection = () => {
//     setSectionId((prevSectionId) => prevSectionId + 1); // Increment sectionId
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!lessonData) {
//     return <div>No data available</div>;
//   }

//   return (
//     <div className="lesson-container-div">
//       <Lsidebar />
//       <div className="lesson-content">
//         {(() => {
//           let globalIndex = 0; // Counter to track lesson index across all units
//           let isLeft = false;
//           return lessonData.units.map((unit) => (
//             <div key={unit.id} className="unit-container">
//               <div className="unit-header">
//                 <h3 className="unit-title">{unit.name}</h3>
//               </div>
//               <div className="lesson-list">
//                 {unit.lessons.map((lesson, index) => {
//                   globalIndex++; // Increment the global index
//                   if (globalIndex % 5 === 1) {
//                     isLeft = !isLeft;
//                   }

//                   const marginLeft = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
//                   const marginRight = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
//                   let margin = isLeft ? { marginLeft } : { marginRight };

//                   let quiz_margin = null;
//                   if (index === unit.lessons.length - 1) {
//                     globalIndex++;
//                     if (globalIndex % 5 === 1) {
//                       isLeft = !isLeft;
//                     }
//                     const quiz_margin_value = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
//                     quiz_margin = isLeft ? { marginLeft: quiz_margin_value } : { marginRight: quiz_margin_value };
//                   }
//                   return (
//                     <React.Fragment key={lesson.id}>
//                       <Link
//                         to={`/lesson/${unit.id}/${lesson.id}`} // Updated link format
//                         className="lesson-button"
//                         style={margin}
//                       >
//                         {lesson.id}
//                       </Link>

//                       {/* Add quiz link if this is the last lesson in the unit */}
//                       {index === unit.lessons.length - 1 && (
//                         <>
//                           <Link
//                             to={`/quiz/${unit.id}/${lesson.id}`}
//                             className="lesson-button"
//                             style={quiz_margin}
//                           >
//                             Quiz
//                           </Link>
                          
//                         </>
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </div>
//             </div>
//           ));
//         })()}

//         {/* Add the "Next Section" button after the lessons */}
//         <button onClick={handleNextSection} className="next-section-button">
//           Next Section
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LessonPage;


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Lsidebar from "./Lsidebar";
// import "./LessonSection.css";

// const LessonSection = () => {
//   const [lessonData, setLessonData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch data from the API
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/sections/1"); //1->section id 
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();
//         setLessonData(data);
//       } catch (error) {
//         setError(error.message);
//         // Default data in case of API failure
//         setLessonData({
//           units: [
//             {
//               id: 1,
//               name: "Default Unit",
//               lessons: [
//                 { id: 1, name: "Default Lesson 1" },
//                 { id: 2, name: "Default Lesson 2" }
//               ]
//             }
//           ]
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="lesson-container-div">
//       <Lsidebar />
//       <div className="l-content">
//         {(() => {
//           let globalIndex = 0; // Counter to track lesson index across all units
//           let isLeft = false;
//           return lessonData.units.map((unit) => (
//             <div key={unit.id} className="unit-container">
//               <div className="unit-header">
//                 <h3 className="unit-title">{unit.name}</h3>
//               </div>
//               <div className="lesson-list">
//                 {unit.lessons.map((lesson , index) => {
//                   globalIndex++; // Increment the global index
//                   if (globalIndex % 5 === 1) {
//                     isLeft = !isLeft;
//                   }

//                   const marginLeft = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
//                   const marginRight = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
//                   let margin = isLeft ? { marginLeft } : { marginRight };
                  
//                   let quiz_margin = null;
//                   if (index === unit.lessons.length - 1) {
//                     globalIndex++;
//                     if (globalIndex % 5 === 1) {
//                       isLeft = !isLeft;
//                     }
//                     const quiz_margin_value = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
//                     quiz_margin = isLeft ? { marginLeft: quiz_margin_value } : { marginRight: quiz_margin_value };
//                   }
//                   return (
//                     <React.Fragment key={lesson.id}>
//                     <Link
//                       to={`/lesson/${unit.id}/${lesson.id}`} // Updated link format
//                       className="lesson-button"
//                       style={margin}
//                     >
//                       {lesson.id}
//                     </Link>
                
//                       {/* Add quiz link if this is the last lesson in the unit */}
//                       {index === unit.lessons.length - 1 && (
//                         <>
//                           <Link
//                             to={`/quiz/${unit.id}/${lesson.id}`}
//                             className="lesson-button"
//                             style={ quiz_margin}
//                           >
//                             Quiz
//                           </Link>
//                         </>
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


// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import Lsidebar from "./Lsidebar";
// import "./LessonSection.css";

// const LessonSection = () => {
//   const [lessonData, setLessonData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     // Fetch data from the API
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/sections/1"); //1->section id 
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();
//         setLessonData(data);
//       }
//           catch (error) {
//             setError(error.message);
//             setLessonData({
//               units: [
//                 {
//                   id: 1,
//                   name: "Default Unit 1",
//                   lessons: [
//                     { id: 1, name: "Default Lesson 1.1" },
//                     { id: 2, name: "Default Lesson 1.2" }
//                   ]
//                 },
//                 {
//                   id: 2,
//                   name: "Default Unit 2",
//                   lessons: [
//                     { id: 3, name: "Default Lesson 2.1" },
//                     { id: 4, name: "Default Lesson 2.2" }
//                   ]
//                 },
//                 {
//                   id: 3,
//                   name: "Default Unit 3",
//                   lessons: [
//                     { id: 5, name: "Default Lesson 3.1" },
//                     { id: 6, name: "Default Lesson 3.2" }
//                   ]
//                 }
//               ]
//             });
//           }
//            finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="lesson-container-div">
//       <Lsidebar />
//       <div className="l-content">
//         {(() => {
//           let globalIndex = 0; // Counter to track lesson index across all units
//           let isLeft = false;
//           return lessonData.units.map((unit) => (
//             <div key={unit.id} className="unit-container">
//               <div className="unit-header">
//                 <h3 className="unit-title">{unit.name}</h3>
//               </div>
//               <div className="lesson-list">
//                 {unit.lessons.map((lesson , index) => {
//                   globalIndex++; // Increment the global index
//                   if (globalIndex % 5 === 1) {
//                     isLeft = !isLeft;
//                   }

//                   const marginLeft = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
//                   const marginRight = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
//                   let margin = isLeft ? { marginLeft } : { marginRight };
                  
//                   let quiz_margin = null;
//                   if (index === unit.lessons.length - 1) {
//                     globalIndex++;
//                     if (globalIndex % 5 === 1) {
//                       isLeft = !isLeft;
//                     }
//                     const quiz_margin_value = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
//                     quiz_margin = isLeft ? { marginLeft: quiz_margin_value } : { marginRight: quiz_margin_value };
//                   }

//                   const isActiveLesson = location.pathname === `/lesson/${unit.id}/${lesson.id}`;

//                   return (
//                     <React.Fragment key={lesson.id}>
//                     <Link
//                       to={`/lesson/${unit.id}/${lesson.id}`} // Updated link format
//                       className={`lesson-button ${isActiveLesson ? "active-lesson" : ""}`}
//                       style={margin}
//                     >
//                       {lesson.id}
//                     </Link>
                
//                       {/* Add quiz link if this is the last lesson in the unit */}
//                       {index === unit.lessons.length - 1 && (
//                         <>
//                           <Link
//                             to={`/quiz/${unit.id}/${lesson.id}`}
//                             className="lesson-button"
//                             style={ quiz_margin}
//                           >
//                             Quiz
//                           </Link>
//                         </>
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
import { Link, useLocation } from "react-router-dom";
import Lsidebar from "./Lsidebar";
import "./LessonSection.css";

const LessonSection = () => {
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchedLessons, setWatchedLessons] = useState(new Set());
  const location = useLocation();

  useEffect(() => {
    // تحميل الدروس التي تمت مشاهدتها من localStorage
    const storedLessons = JSON.parse(localStorage.getItem("watchedLessons")) || [];
    setWatchedLessons(new Set(storedLessons));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/sections/1");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setLessonData(data);
      } catch (error) {
        setError(error.message);
        setLessonData({
          units: [
            {
              id: 1,
              name: "Default Unit 1",
              lessons: [
                { id: 1, name: "Default Lesson 1.1" },
                { id: 2, name: "Default Lesson 1.2" }
              ]
            },
            {
              id: 2,
              name: "Default Unit 2",
              lessons: [
                { id: 3, name: "Default Lesson 2.1" },
                { id: 4, name: "Default Lesson 2.2" }
              ]
            },
            {
              id: 3,
              name: "Default Unit 3",
              lessons: [
                { id: 5, name: "Default Lesson 3.1" },
                { id: 6, name: "Default Lesson 3.2" }
              ]
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markLessonAsWatched = (lessonId) => {
    const updatedLessons = new Set(watchedLessons);
    updatedLessons.add(lessonId);
    setWatchedLessons(updatedLessons);
    localStorage.setItem("watchedLessons", JSON.stringify([...updatedLessons]));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lesson-container-div">
      <Lsidebar />
      <div className="l-content">
        {(() => {
          let globalIndex = 0;
          let isLeft = false;
          return lessonData.units.map((unit) => (
            <div key={unit.id} className="unit-container">
              <div className="unit-header">
                <h3 className="unit-title">{unit.name}</h3>
              </div>
              <div className="lesson-list">
                {unit.lessons.map((lesson, index) => {
                  globalIndex++;
                  if (globalIndex % 5 === 1) {
                    isLeft = !isLeft;
                  }

                  const marginLeft = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
                  const marginRight = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
                  let margin = isLeft ? { marginLeft } : { marginRight };

                  let quiz_margin = null;
                  if (index === unit.lessons.length - 1) {
                    globalIndex++;
                    if (globalIndex % 5 === 1) {
                      isLeft = !isLeft;
                    }
                    const quiz_margin_value = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
                    quiz_margin = isLeft ? { marginLeft: quiz_margin_value } : { marginRight: quiz_margin_value };
                  }

                  const isActiveLesson = location.pathname === `/lesson/${unit.id}/${lesson.id}`;
                  const isWatched = watchedLessons.has(lesson.id); // درس تمت مشاهدته؟

                  return (
                    <React.Fragment key={lesson.id}>
                      <Link
                        to={`/lesson/${unit.id}/${lesson.id}`}
                        className={`lesson-button ${isActiveLesson ? "active-lesson" : ""} ${isWatched ? "watched-lesson" : ""}`}
                        style={margin}
                        onClick={() => markLessonAsWatched(lesson.id)}
                      >
                        {index + 1}
                      </Link>

                      {index === unit.lessons.length - 1 && (
                        <Link
                          to={`/unit-quiz/${unit.id}`}
                          className="lesson-button"
                          style={quiz_margin}
                        >
                          Quiz
                        </Link>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

export default LessonSection;

