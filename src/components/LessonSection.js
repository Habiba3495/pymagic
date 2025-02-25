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



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lsidebar from "./Lsidebar";
import "./LessonSection.css";

const LessonUnit = ({ title, color, lessons, unitIndex }) => {
  const navigate = useNavigate();
  const [viewedLessons, setViewedLessons] = useState({});

  useEffect(() => {
    // 🔹 جلب الدروس المشاهدة من localStorage
    const savedViewedLessons = JSON.parse(localStorage.getItem("viewedLessons")) || {};
    setViewedLessons(savedViewedLessons);
  }, []);

  const handleLessonClick = (lessonIndex) => {
    const newViewedLessons = { ...viewedLessons, [`${unitIndex}-${lessonIndex}`]: true };
    setViewedLessons(newViewedLessons);
    localStorage.setItem("viewedLessons", JSON.stringify(newViewedLessons)); // ✅ حفظ البيانات محليًا

    navigate(`/lesson/${unitIndex + 1}/${lessonIndex + 1}`);
  };

  return (
    <div className="lesson-unit" style={{ backgroundColor: color }}>
      {title}
      <div className="lessons-container">
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className={`lesson-circle ${viewedLessons[`${unitIndex}-${index}`] ? "viewed" : ""}`}
            style={{
              "--unit-color": color, // ✅ تمرير اللون إلى CSS كمتغير
              backgroundColor: viewedLessons[`${unitIndex}-${index}`] ? color : "white",
              color: viewedLessons[`${unitIndex}-${index}`] ? "white" : "#6B21A8",
              border: `2px solid ${viewedLessons[`${unitIndex}-${index}`] ? color : "#ccc"}`,
            }}
            onClick={() => handleLessonClick(index)}
          >
            {index + 1} {/* ✅ استبدال النجمة برقم الدرس */}
          </div>
        ))}
      </div>
    </div>
  );
};

const LessonSection = () => {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/lessons");
        const data = await response.json();
        setUnits(data.units);
      } catch (error) {
        console.error("Error fetching data, using dummy data:", error);
        setUnits([
          {
            title: "Unit 1: Introduction to Programming",
            color: "#6B21A8",
            lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
          },
          {
            title: "Unit 2: Getting Started with Python",
            color: "#FBBF24",
            lessons: ["Lesson 1", "Lesson 2"],
          },
          {
            title: "Unit 3: Introducing Variables",
            color: "#0D9488",
            lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4"],
          },
        ]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page-container">
      <Lsidebar />
      <div className="content">
        {units.map((unit, index) => (
          <LessonUnit key={index} title={unit.title} color={unit.color} lessons={unit.lessons} unitIndex={index} />
        ))}
      </div>
    </div>
  );
};

export default LessonSection;
