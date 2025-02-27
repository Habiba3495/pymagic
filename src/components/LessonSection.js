// import React from "react";
// import Lsidebar from "./Lsidebar"; // استيراد الشريط الجانبي
// import "./LessonSection.css";

// const LessonUnit = ({ title, color }) => {
//   return <div className={`lesson-unit ${color}`}>{title}</div>;
// };

// const LessonSection = () => {
//   return (
//     <div className="page-container">
//       <Lsidebar />  {/* الشريط الجانبي */}

//       <div className="content">
//         <LessonUnit title="Unit 1: Introduction to Programming" color="purple" />
//         <LessonUnit title="Unit 2: Getting Started with Python" color="yellow" />
//         <LessonUnit title="Unit 3: Introducing Variables" color="teal" />
//       </div>
//     </div>
//   );
// };

// export default LessonSection;





// import React, { useState, useEffect } from "react";
// import Lsidebar from "./Lsidebar"; // الشريط الجانبي
// import "./LessonSection.css";

// const LessonUnit = ({ title, color, lessons }) => {
//   const [viewedLessons, setViewedLessons] = useState({});

//   const handleLessonClick = (index) => {
//     setViewedLessons((prev) => ({
//       ...prev,
//       [index]: true, // تعيين أن الدرس تمت مشاهدته
//     }));
//   };

//   return (
//     <div className="lesson-unit" style={{ backgroundColor: color }}>
//       {title}
//       <div className="lessons-container">
//         {lessons.map((lesson, index) => (
//           <div
//             key={index}
//             className={`lesson-circle ${viewedLessons[index] ? "viewed" : ""}`}
//             style={viewedLessons[index] ? { backgroundColor: color } : {}}
//             onClick={() => handleLessonClick(index)}
//           >
//             ★
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const LessonSection = () => {
//   const [units, setUnits] = useState([]);

//   useEffect(() => {
//     fetch("https://api.example.com/lessons") // استبدلها بـ API حقيقي
//       .then((res) => res.json())
//       .then((data) => setUnits(data.units))
//       .catch((err) => console.error("Error fetching data:", err));
//   }, []);

//   return (
//     <div className="page-container">
//       <Lsidebar /> {/* الشريط الجانبي */}

//       <div className="content">
//         {units.map((unit, index) => (
//           <LessonUnit
//             key={index}
//             title={unit.title}
//             color={unit.color}
//             lessons={unit.lessons}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LessonSection;





// import React, { useState, useEffect } from "react";
// import Lsidebar from "./Lsidebar"; // الشريط الجانبي
// import "./LessonSection.css";

// const LessonUnit = ({ title, color, lessons }) => {
//   const [viewedLessons, setViewedLessons] = useState({});

//   const handleLessonClick = (index) => {
//     setViewedLessons((prev) => ({
//       ...prev,
//       [index]: true, // تعيين أن الدرس تمت مشاهدته
//     }));
//   };

//   return (
//     <div className="lesson-unit" style={{ backgroundColor: color }}>
//       {title}
//       <div className="lessons-container">
//         {lessons.map((lesson, index) => (
//           <div
//             key={index}
//             className={`lesson-circle ${viewedLessons[index] ? "viewed" : ""}`}
//             style={viewedLessons[index] ? { backgroundColor: color } : {}}
//             onClick={() => handleLessonClick(index)}
//           >
//             ★
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const LessonSection = () => {
//   const [units, setUnits] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://api.example.com/lessons"); // استبدلها لاحقًا بـ API حقيقي
//         const data = await response.json();
//         setUnits(data.units);
//       } catch (error) {
//         console.error("Error fetching data, using dummy data:", error);

//         // ❗❗ بيانات وهمية ❗❗
//         setUnits([
//           {
//             title: "Unit 1: Introduction to Programming",
//             color: "#6B21A8",
//             lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
//           },
//           {
//             title: "Unit 2: Getting Started with Python",
//             color: "#FBBF24",
//             lessons: ["Lesson 1", "Lesson 2"],
//           },
//           {
//             title: "Unit 3: Introducing Variables",
//             color: "#0D9488",
//             lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4"],
//           },
//         ]);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="page-container">
//       <Lsidebar /> {/* الشريط الجانبي */}

//       <div className="content">
//         {units.map((unit, index) => (
//           <LessonUnit
//             key={index}
//             title={unit.title}
//             color={unit.color}
//             lessons={unit.lessons}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LessonSection;





// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // 📌 استيراد useNavigate
// import Lsidebar from "./Lsidebar"; 
// import "./LessonSection.css";

// const LessonUnit = ({ title, color, lessons, unitIndex }) => {
//   const [viewedLessons, setViewedLessons] = useState({});
//   const navigate = useNavigate(); // 📌 التنقل بين الصفحات

//   const handleLessonClick = (lessonIndex) => {
//     setViewedLessons((prev) => ({ ...prev, [lessonIndex]: true }));
//     navigate(`/lesson/${unitIndex + 1}/${lessonIndex + 1}`); // 📌 الانتقال إلى صفحة الفيديو
//   };

//   return (
//     <div className="lesson-unit" style={{ backgroundColor: color }}>
//       {title}
//       <div className="lessons-container">
//         {lessons.map((lesson, index) => (
//           <div
//             key={index}
//             className={`lesson-circle ${viewedLessons[index] ? "viewed" : ""}`}
//             style={viewedLessons[index] ? { backgroundColor: color } : {}}
//             onClick={() => handleLessonClick(index)} // 📌 جعل الدرس قابل للضغط
//           >
//             ★
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const LessonSection = () => {
//   const [units, setUnits] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://api.example.com/lessons");
//         const data = await response.json();
//         setUnits(data.units);
//       } catch (error) {
//         console.error("Error fetching data, using dummy data:", error);

//         setUnits([
//           {
//             title: "Unit 1: Introduction to Programming",
//             color: "#6B21A8",
//             lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
//           },
//           {
//             title: "Unit 2: Getting Started with Python",
//             color: "#FBBF24",
//             lessons: ["Lesson 1", "Lesson 2"],
//           },
//           {
//             title: "Unit 3: Introducing Variables",
//             color: "#0D9488",
//             lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4"],
//           },
//         ]);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="page-container">
//       <Lsidebar />
//       <div className="content">
//         {units.map((unit, index) => (
//           <LessonUnit key={index} title={unit.title} color={unit.color} lessons={unit.lessons} unitIndex={index} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LessonSection;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Lsidebar from "./Lsidebar";
// import "./LessonSection.css";

// const LessonUnit = ({ title, color, lessons, unitIndex }) => {
//   const [viewedLessons, setViewedLessons] = useState({});
//   const navigate = useNavigate();

//   const handleLessonClick = (lessonIndex) => {
//     setViewedLessons((prev) => ({ ...prev, [lessonIndex]: true })); // ✅ تحديد أن الفيديو تمت مشاهدته
//     navigate(`/lesson/${unitIndex + 1}/${lessonIndex + 1}`);
//   };

//   return (
//     <div className="lesson-unit" style={{ backgroundColor: color }}>
//       {title}
//       <div className="lessons-container">
//         {lessons.map((lesson, index) => (
//           <div
//             key={index}
//             className={`lesson-circle ${viewedLessons[index] ? "viewed" : ""}`}
//             style={{
//               backgroundColor: viewedLessons[index] ? color : "pink", // ✅ لون الدائرة يصبح نفس لون الـ Unit عند المشاهدة
//               color: viewedLessons[index] ? "green" : "yellow",
//               border: `2px solid ${color}`,
//             }}
//             onClick={() => handleLessonClick(index)}
//           >
//             {index + 1} {/* ✅ رقم الدرس داخل الدائرة */}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const LessonSection = () => {
//   const [units, setUnits] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://api.example.com/lessons");
//         const data = await response.json();
//         setUnits(data.units);
//       } catch (error) {
//         console.error("Error fetching data, using dummy data:", error);
//         setUnits([
//           {
//             title: "Unit 1: Introduction to Programming",
//             color: "#6B21A8",
//             lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
//           },
//           {
//             title: "Unit 2: Getting Started with Python",
//             color: "#FBBF24",
//             lessons: ["Lesson 1", "Lesson 2"],
//           },
//           {
//             title: "Unit 3: Introducing Variables",
//             color: "#0D9488",
//             lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4"],
//           },
//         ]);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="page-container">
//       <Lsidebar />
//       <div className="content">
//         {units.map((unit, index) => (
//           <LessonUnit key={index} title={unit.title} color={unit.color} lessons={unit.lessons} unitIndex={index} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LessonSection;


/////////////////////


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Lsidebar from "./Lsidebar";
// import "./LessonSection.css";

// const LessonUnit = ({ title, color, lessons, unitIndex }) => {
//   const navigate = useNavigate();
//   const [viewedLessons, setViewedLessons] = useState({});

//   useEffect(() => {
//     // 🔹 جلب الدروس المشاهدة من localStorage
//     const savedViewedLessons = JSON.parse(localStorage.getItem("viewedLessons")) || {};
//     setViewedLessons(savedViewedLessons);
//   }, []);

//   const handleLessonClick = (lessonIndex) => {
//     const newViewedLessons = { ...viewedLessons, [`${unitIndex}-${lessonIndex}`]: true };
//     setViewedLessons(newViewedLessons);
//     localStorage.setItem("viewedLessons", JSON.stringify(newViewedLessons)); // ✅ حفظ البيانات محليًا

//     navigate(`/lesson/${unitIndex + 1}/${lessonIndex + 1}`);
//   };

//   return (
//     <div className="lesson-unit" style={{ backgroundColor: color }}>
//       {title}
//       <div className="lessons-container">
//         {lessons.map((lesson, index) => (
//           <div
//             key={index}
//             className={`lesson-circle ${viewedLessons[`${unitIndex}-${index}`] ? "viewed" : ""}`}
//             style={{
//               "--unit-color": color, // ✅ تمرير اللون إلى CSS كمتغير
//               backgroundColor: viewedLessons[`${unitIndex}-${index}`] ? color : "white",
//               color: viewedLessons[`${unitIndex}-${index}`] ? "white" : "#6B21A8",
//               border: `2px solid ${viewedLessons[`${unitIndex}-${index}`] ? color : "#ccc"}`,
//             }}
//             onClick={() => handleLessonClick(index)}
//           >
//             {index + 1} {/* ✅ استبدال النجمة برقم الدرس */}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const LessonSection = () => {
//   const [units, setUnits] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://api.example.com/lessons");
//         const data = await response.json();
//         setUnits(data.units);
//       } catch (error) {
//         console.error("Error fetching data, using dummy data:", error);
//         setUnits([
//           {
//             title: "Unit 1: Introduction to Programming",
//             color: "#6B21A8",
//             lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
//           },
//           {
//             title: "Unit 2: Getting Started with Python",
//             color: "#FBBF24",
//             lessons: ["Lesson 1", "Lesson 2"],
//           },
//           {
//             title: "Unit 3: Introducing Variables",
//             color: "#0D9488",
//             lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4"],
//           },
//         ]);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="page-container">
//       <Lsidebar />
//       <div className="content">
//         {units.map((unit, index) => (
//           <LessonUnit key={index} title={unit.title} color={unit.color} lessons={unit.lessons} unitIndex={index} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LessonSection;



import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Lsidebar from "./Lsidebar";
import "./LessonSection.css";

const LessonPage = () => {
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/sections/1"); //1->section id 
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setLessonData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!lessonData) {
    return <div>No data available</div>;
  }

  return (
    <div className="lesson-container-div">
      <Lsidebar />
      <div className="lesson-content">
        {(() => {
          let globalIndex = 0; // Counter to track lesson index across all units
          let isLeft = false;
          return lessonData.units.map((unit) => (
            <div key={unit.id} className="unit-container">
              <div className="unit-header">
                <h3 className="unit-title">{unit.name}</h3>
              </div>
              <div className="lesson-list">
                {unit.lessons.map((lesson , index) => {
                  globalIndex++; // Increment the global index
                  if (globalIndex % 5 === 1) {
                    isLeft = !isLeft;
                  }

                  const marginLeft = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
                  const marginRight = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
                  let margin = isLeft ? { marginLeft } : { marginRight };
                  
                  // let globalIndex = index +1;
                  let quiz_margin = null;
                  if (index === unit.lessons.length - 1) {
                    globalIndex++;
                    if (globalIndex % 5 === 1) {
                      isLeft = !isLeft;
                    }
                    const quiz_margin_value = (globalIndex % 5 === 2 || globalIndex % 5 === 4) ? "50px" : (globalIndex % 5 === 3 ? "100px" : "0px");
                    quiz_margin = isLeft ? { marginLeft: quiz_margin_value } : { marginRight: quiz_margin_value };
                  }
                  return (
                    <React.Fragment key={lesson.id}>
                    <Link
                      to={`/lesson/${unit.id}/${lesson.id}`} // Updated link format
                      className="lesson-button"
                      style={margin}
                    >
                      {lesson.id}
                    </Link>
                
                      {/* Add quiz link if this is the last lesson in the unit */}
                      {index === unit.lessons.length - 1 && (
                        <>
                          <Link
                            to={`/quiz/${unit.id}/${lesson.id}`}
                            className="lesson-button"
                            style={ quiz_margin}
                          >
                            Quiz
                          </Link>
                        </>
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

export default LessonPage;








