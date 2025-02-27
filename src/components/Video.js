// import React, { useState, useEffect } from "react";
// import "./Video.css";

// const Video = () => {
//   const [videoUrl, setVideoUrl] = useState("");

//   useEffect(() => {
//     // ❗❗ جلب رابط الفيديو من الـ API أو وضع رابط وهمي مؤقتًا ❗❗
//     const fetchVideo = async () => {
//       try {
//         const response = await fetch("https://api.example.com/lesson-video"); // استبدليه بـ API حقيقي
//         const data = await response.json();
//         setVideoUrl(data.videoUrl);
//       } catch (error) {
//         console.error("Error fetching video, using dummy URL:", error);
//         setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4"); // فيديو وهمي للاختبار
//       }
//     };

//     fetchVideo();
//   }, []);

//   return (
//     <div className="lesson-container">
//       <div className="lesson-content">
//         <h1 className="lesson-header">Lesson 1: What is Programming</h1>
//         <div className="video-container">
//           {videoUrl ? (
//             <video controls>
//               <source src={videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           ) : (
//             <p>Loading video...</p>
//           )}
//         </div>
//         <button className="quiz-button">Start Quiz</button>
//       </div>
//     </div>
//   );
// };

// export default Video;




// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./Video.css";
// import Exit from "./images/Exit iconsvg.svg"

// const Video = () => {
//   const { unitId, lessonId } = useParams();
//   const navigate = useNavigate();
//   const [videoUrl, setVideoUrl] = useState("");

//   useEffect(() => {
//     const fetchVideo = async () => {
//       try {
//         const response = await fetch(`https://api.example.com/lesson-video/${unitId}/${lessonId}`);
//         const data = await response.json();
//         setVideoUrl(data.videoUrl);
//       } catch (error) {
//         console.error("Error fetching video, using dummy URL:", error);
//         setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
//       }
//     };

//     fetchVideo();
//   }, [unitId, lessonId]);

//   return (
//     <div className="lesson-container">
//       {/* 🔙 زر الرجوع إلى صفحة الدروس مع صورة */}
//       <button className="back-button" onClick={() => navigate("/lessons")}>
//         <img src={Exit} alt="Back" className="back-icon" />
//       </button>

//       <div className="lesson-content">
//         <h1 className="lesson-header">Unit {unitId} - Lesson {lessonId}</h1>
//         <div className="video-container">
//           {videoUrl ? (
//             <video controls>
//               <source src={videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           ) : (
//             <p>Loading video...</p>
//           )}
//         </div>
//         <button className="quiz-button" onClick={() => navigate(`/quiz/${unitId}/${lessonId}`)}>
//           Start Quiz
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Video;
  


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Video.css";
import Exit from "./images/Exit iconsvg.svg";

const Video = () => {
  const { unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState(null); // Store full lesson data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unitColor] = useState("#6B21A8"); // Default purple color

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch lesson data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("API Response:", data); // Log the full response to verify
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
        Unit {unitId} - {lessonData?.title || `Lesson ${lessonId}`}
      </h1>
        <div className="video-container">
          {loading ? (
            <p>Loading video...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : lessonData?.video_url ? ( // Use video_url from the lesson object
            <video controls>
              <source src={`http://localhost:5000${lessonData.video_url}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>No video available.</p>
          )}
        </div>
        <button className="quiz-button" onClick={() => navigate(`/quiz/${unitId}/${lessonId}`)}>
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Video;


// const dummyUnits = [
//     { id: 1, color: "#6B21A8" },
//     { id: 2, color: "#FBBF24" },
//     { id: 3, color: "#0D9488" }
//   ];
//   const unit = dummyUnits.find(u => u.id === parseInt(unitId));
//   if (unit) setUnitColor(unit.color);
  