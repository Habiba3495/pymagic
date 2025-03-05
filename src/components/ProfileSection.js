// // import React, { useEffect, useState } from "react";
// // import "./ProfileSection.css";
// // import Lsidebar from "./Lsidebar";
// // import { useNavigate } from "react-router-dom";

// // const ProfilePage = () => {
// //   const navigate = useNavigate();
// //   const [userProfile, setUserProfile] = useState({ name: "", points: 0 }); // State to store user data
// //   const userId = 1; // Replace with dynamic user ID from auth context or props

// //   useEffect(() => {
// //     const fetchUserProfile = async () => {
// //       try {
// //         const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
// //         if (!response.ok) throw new Error("Failed to fetch user profile");
// //         const data = await response.json();
// //         if (data.success) {
// //           setUserProfile({
// //             name: data.user.name,
// //             points: data.user.points
// //           });
// //         } else {
// //           throw new Error(data.message || "Failed to load user profile");
// //         }
// //       } catch (error) {
// //         console.error("Error fetching user profile:", error);
// //         // Optionally, set default or error state here
// //         setUserProfile({ name: "Unknown User", points: 0 });
// //       }
// //     };

// //     fetchUserProfile();
// //   }, [userId]); // Re-fetch if userId changes

// //   return (
// //     <div className="profile-container">
// //       <div className="sidebar-container">
// //         <Lsidebar active="Profile" />
// //       </div>
// //       <div className="profile-header">
// //         <div className="profile-avatar-container">
// //           <div className="profile-avatar">
// //             <span className="avatar-icon">🧙‍♂️</span>
// //           </div>
// //           <button className="edit-button">Edit</button>
// //         </div>
// //         <div className="profile-name-container">
// //           <h2 className="profile-name">{userProfile.name}</h2>
// //           <p className="profile-points">✨ {userProfile.points} points</p>
// //         </div>
// //       </div>

// //       {/* Achievements Section (Partial) */}
// //       <div className="section achievements">
// //         <h3 className="section-title">Achievements</h3>
// //         <div className="achievements-grid">
// //           <div className="achievement-card">
// //             <p className="achievement-title">Spellbook Scholar</p>
// //             <p className="achievement-description">Completed all lessons in a chapter</p>
// //           </div>
// //           <div className="achievement-card">
// //             <p className="achievement-title">Daily Dedication</p>
// //             <p className="achievement-description">Completed lessons for 5 days in a row</p>
// //           </div>
// //           <div className="achievement-card">
// //             <p className="achievement-title">Treasure Hunter</p>
// //             <p className="achievement-description">Unlocked the first treasure chest</p>
// //           </div>
// //         </div>
// //         <button className="view-all-button" onClick={() => navigate("/achievements")}>
// //           View All
// //         </button>
// //       </div>

// //       {/* Progress Report Section */}
// //       <div className="section progress-report">
// //         <h3 className="section-title">Progress Report</h3>
// //         <div className="progress-grid">
// //           <div className="progress-card">
// //             <p className="progress-score">9/10</p>
// //             <p className="progress-description">Unit 2, Lesson 4 completed</p>
// //           </div>
// //           <div className="progress-card">
// //             <p className="progress-score">10/10</p>
// //             <p className="progress-description">Unit 2, Lesson 3 completed</p>
// //           </div>
// //           <div className="progress-card">
// //             <p className="progress-score">7/10</p>
// //             <p className="progress-description">Unit 2, Lesson 2 completed</p>
// //           </div>
// //         </div>
// //         <button className="view-all-button" onClick={() => navigate("/progress-report/1")}>
// //           View All
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;


// import React, { useEffect, useState } from "react";
// import "./ProfileSection.css";
// import Lsidebar from "./Lsidebar";
// import { useNavigate } from "react-router-dom";

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const [userProfile, setUserProfile] = useState({ name: "", points: 0 }); // For user data
//   const [progressData, setProgressData] = useState([]); // For progress report data
//   const userId = 1; // Replace with dynamic user ID from auth context or props

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
//         if (!response.ok) throw new Error("Failed to fetch user profile");
//         const data = await response.json();
//         if (data.success) {
//           setUserProfile({
//             name: data.user.name,
//             points: data.user.points
//           });
//         } else {
//           throw new Error(data.message || "Failed to load user profile");
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         setUserProfile({ name: "Unknown User", points: 0 });
//       }
//     };

//     const fetchProgressData = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/quiz/progress/${userId}`);
//         if (!response.ok) throw new Error("Failed to fetch progress data");
//         const data = await response.json();
//         if (data.success && data.progress.length > 0) {
//           // Take only the first 3 items (or however many you want to show in the partial view)
//           setProgressData(data.progress.slice(0, 3));
//         } else {
//           throw new Error("No progress data available");
//         }
//       } catch (error) {
//         console.error("Error fetching progress data, using dummy data:", error);
//         // Dummy data matching your current design
//         setProgressData([
//           { score: 9, total_questions: 10, lesson_id: "2.4" },
//           { score: 10, total_questions: 10, lesson_id: "2.3" },
//           { score: 7, total_questions: 10, lesson_id: "2.2" },
//         ]);
//       }
//     };

//     fetchUserProfile();
//     fetchProgressData();
//   }, [userId]);

//   return (
//     <div className="profile-container">
//       <div className="sidebar-container">
//         <Lsidebar active="Profile" />
//       </div>
//       <div className="profile-header">
//         <div className="profile-avatar-container">
//           <div className="profile-avatar">
//             <span className="avatar-icon">🧙‍♂️</span>
//           </div>
//           <button className="edit-button">Edit</button>
//         </div>
//         <div className="profile-name-container">
//           <h2 className="profile-name">{userProfile.name}</h2>
//           <p className="profile-points">✨ {userProfile.points} points</p>
//         </div>
//       </div>

//       {/* Achievements Section (Partial) - Keep as is for now */}
//       <div className="section achievements">
//         <h3 className="section-title">Achievements</h3>
//         <div className="achievements-grid">
//           <div className="achievement-card">
//             <p className="achievement-title">Spellbook Scholar</p>
//             <p className="achievement-description">Completed all lessons in a chapter</p>
//           </div>
//           <div className="achievement-card">
//             <p className="achievement-title">Daily Dedication</p>
//             <p className="achievement-description">Completed lessons for 5 days in a row</p>
//           </div>
//           <div className="achievement-card">
//             <p className="achievement-title">Treasure Hunter</p>
//             <p className="achievement-description">Unlocked the first treasure chest</p>
//           </div>
//         </div>
//         <button className="view-all-button" onClick={() => navigate("/achievements")}>
//           View All
//         </button>
//       </div>

//       {/* Progress Report Section (Partial) */}
//       <div className="section progress-report">
//         <h3 className="section-title">Progress Report</h3>
//         <div className="progress-grid">
//           {progressData.map((progress, index) => (
//             <div key={index} className="progress-card">
//               <p className="progress-score">
//                 {progress.score}/{progress.total_questions}
//               </p>
//               <p className="progress-description">
//                 {progress.lesson_id
//                   ? `Unit ${progress.lesson_id.split(".")[0]}, Lesson ${progress.lesson_id.split(".")[1]} completed`
//                   : `Unit ${progress.unit_id} completed`}
//               </p>
//             </div>
//           ))}
//         </div>
//         <button
//           className="view-all-button"
//           onClick={() => navigate(`/progress-report/${userId}`)}
//         >
//           View All
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


// import React, { useEffect, useState } from "react";
// import "./ProfileSection.css";
// import Lsidebar from "./Lsidebar";
// import { useNavigate } from "react-router-dom";
// import points from "./images/points.svg"; // Import the points icon (ensure this path is correct)

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const [userProfile, setUserProfile] = useState({ name: "", points: 0 }); // For user data
//   const [progressData, setProgressData] = useState([]); // For progress report data
//   const userId = 1; // Replace with dynamic user ID from auth context or props

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
//         if (!response.ok) throw new Error("Failed to fetch user profile");
//         const data = await response.json();
//         if (data.success) {
//           setUserProfile({
//             name: data.user.name,
//             points: data.user.points
//           });
//         } else {
//           throw new Error(data.message || "Failed to load user profile");
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         setUserProfile({ name: "Unknown User", points: 0 });
//       }
//     };

//     const fetchProgressData = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/quiz/progress/${userId}`);
//         if (!response.ok) throw new Error("Failed to fetch progress data");
//         const data = await response.json();
//         if (data.success && data.progress.length > 0) {
//           // Take only the first 3 items (matching your screenshot)
//           setProgressData(data.progress.slice(0, 3));
//         } else {
//           throw new Error("No progress data available");
//         }
//       } catch (error) {
//         console.error("Error fetching progress data, using dummy data:", error);
//         // Dummy data matching your design (3 cards, Unit 1, scores, and points)
//         setProgressData([
//           { id: 1, score: 1, total_questions: 10, unit_id: "1", earned_points: 7 },
//           { id: 2, score: 1, total_questions: 10, unit_id: "1", earned_points: 5 },
//           { id: 3, score: 2, total_questions: 10, unit_id: "1", earned_points: 20 },
//         ]);
//       }
//     };

//     fetchUserProfile();
//     fetchProgressData();
//   }, [userId]);

//   return (
//     <div className="profile-container">
//       <div className="sidebar-container">
//         <Lsidebar active="Profile" />
//       </div>
//       <div className="profile-header">
//         <div className="profile-avatar-container">
//           <div className="profile-avatar">
//             <span className="avatar-icon">🧙‍♂️</span>
//           </div>
//           <button className="edit-button">Edit</button>
//         </div>
//         <div className="profile-name-container">
//           <h2 className="profile-name">{userProfile.name}</h2>
//           <p className="profile-points">✨ {userProfile.points} points</p>
//         </div>
//       </div>

//       {/* Achievements Section (Partial) - Keep as is for now */}
//       <div className="section achievements">
//         <h3 className="section-title">Achievements</h3>
//         <div className="achievements-grid">
//           <div className="achievement-card">
//             <p className="achievement-title">Spellbook Scholar</p>
//             <p className="achievement-description">Completed all lessons in a chapter</p>
//           </div>
//           <div className="achievement-card">
//             <p className="achievement-title">Daily Dedication</p>
//             <p className="achievement-description">Completed lessons for 5 days in a row</p>
//           </div>
//           <div className="achievement-card">
//             <p className="achievement-title">Treasure Hunter</p>
//             <p className="achievement-description">Unlocked the first treasure chest</p>
//           </div>
//         </div>
//         <button className="view-all-button" onClick={() => navigate("/achievements")}>
//           View All
//         </button>
//       </div>

//       {/* Progress Report Section (Partial) - Matching your screenshot and ProgressReport card layout */}
//       <div className="section progress-report">
//         <h3 className="section-title">Progress Report</h3>
//         <div className="progress-grid">
//           {progressData.map((quiz) => (
//             <div key={quiz.id} className="progress-card">
//               <div className="pscore-circle">
//                 {quiz.score} / {quiz.total_questions}
//               </div>
//               <p className="lesson-info">
//                 {quiz.unit_id ? `Unit ${quiz.unit_id} completed` : "Unit completed"}
//               </p>
//               <p className="points-earned">
//                 <img src={points} alt="points icon" className="points" />{" "}
//                 {quiz.earned_points} points earned
//               </p>
//             </div>
//           ))}
//         </div>
//         <button
//           className="view-all-button"
//           onClick={() => navigate(`/progress-report/${userId}`)}
//         >
//           View All
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


// import React, { useEffect, useState } from "react";
// import "./ProfileSection.css";
// import Lsidebar from "./Lsidebar";
// import { useNavigate } from "react-router-dom";
// import points from "./images/points.svg"; // Import the points icon (ensure this path is correct)

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const [userProfile, setUserProfile] = useState({ name: "", points: 0 }); // For user data
//   const [progressData, setProgressData] = useState([]); // For progress report data
//   const userId = 1; // Replace with dynamic user ID from auth context or props

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
//         if (!response.ok) throw new Error("Failed to fetch user profile");
//         const data = await response.json();
//         if (data.success) {
//           setUserProfile({
//             name: data.user.name,
//             points: data.user.points
//           });
//         } else {
//           throw new Error(data.message || "Failed to load user profile");
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         setUserProfile({ name: "Unknown User", points: 0 });
//       }
//     };

//     const fetchProgressData = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/quiz/progress/${userId}`);
//         if (!response.ok) throw new Error("Failed to fetch progress data");
//         const data = await response.json();
//         if (data.success && data.progress.length > 0) {
//           // Take only the first 3 items (matching your screenshot)
//           setProgressData(data.progress.slice(0, 3));
//         } else {
//           throw new Error("No progress data available");
//         }
//       } catch (error) {
//         console.error("Error fetching progress data, using dummy data:", error);
//         // Dummy data matching your design (3 cards, Unit 1, scores, and points)
//         setProgressData([
//           { id: 1, score: 1, total_questions: 10, unit_id: "1", earned_points: 7 },
//           { id: 2, score: 1, total_questions: 10, unit_id: "1", earned_points: 5 },
//           { id: 3, score: 2, total_questions: 10, unit_id: "1", earned_points: 20 },
//         ]);
//       }
//     };

//     fetchUserProfile();
//     fetchProgressData();
//   }, [userId]);

//   return (
//     <div className="profile-container">
//       <div className="sidebar-container">
//         <Lsidebar active="Profile" />
//       </div>
//       <div className="profile-header">
//         <div className="profile-avatar-container">
//           <div className="profile-avatar">
//             <span className="avatar-icon">🧙‍♂️</span>
//           </div>
//           <button className="edit-button">Edit</button>
//         </div>
//         <div className="profile-name-container">
//           <h2 className="profile-name">{userProfile.name}</h2>
//           <p className="profile-points">✨ {userProfile.points} points</p>
//         </div>
//       </div>

//       {/* Achievements Section (Partial) - Keep as is for now */}
//       <div className="section achievements">
//         <h3 className="section-title">Achievements</h3>
//         <div className="achievements-grid">
//           <div className="achievement-card">
//             <p className="achievement-title">Spellbook Scholar</p>
//             <p className="achievement-description">Completed all lessons in a chapter</p>
//           </div>
//           <div className="achievement-card">
//             <p className="achievement-title">Daily Dedication</p>
//             <p className="achievement-description">Completed lessons for 5 days in a row</p>
//           </div>
//           <div className="achievement-card">
//             <p className="achievement-title">Treasure Hunter</p>
//             <p className="achievement-description">Unlocked the first treasure chest</p>
//           </div>
//         </div>
//         <button className="view-all-button" onClick={() => navigate("/achievements")}>
//           View All
//         </button>
//       </div>

//       {/* Progress Report Section (Partial) - Matching your screenshot and ProgressReport card layout */}
//       <div className="section progress-report">
//         <h3 className="section-title">Progress Report</h3>
//         <div className="progress-grid">
//           {progressData.map((quiz) => (
//             <div key={quiz.id} className="progress-card">
//               <div className="pscore-circle">
//                 {quiz.score} / {quiz.total_questions}
//               </div>
//               <p className="lesson-info">
//                 {quiz.unit_id ? `Unit ${quiz.unit_id} completed` : "Unit completed"}
//               </p>
//               <p className="points-earned">
//                 <img src={points} alt="points icon" className="points" />{" "}
//                 {quiz.earned_points} points earned
//               </p>
//             </div>
//           ))}
//         </div>
//         <button
//           className="view-all-button"
//           onClick={() => navigate(`/progress-report/${userId}`)}
//         >
//           View All
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;



import React, { useEffect, useState } from "react";
import "./ProfileSection.css";
import Lsidebar from "./Lsidebar";
import { useNavigate } from "react-router-dom";
import points from "./images/points.svg"; // Points icon for progress

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({ name: "", points: 0 }); // For user data
  const [progressData, setProgressData] = useState([]); // For progress report data
  const [achievements, setAchievements] = useState([]); // For achievements data
  const userId = 1; // Replace with dynamic user ID from auth context or props

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        if (data.success) {
          setUserProfile({
            name: data.user.name,
            points: data.user.points
          });
        } else {
          throw new Error(data.message || "Failed to load user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({ name: "Unknown User", points: 0 });
      }
    };

    const fetchProgressData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quiz/progress/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch progress data");
        const data = await response.json();
        if (data.success && data.progress.length > 0) {
          setProgressData(data.progress.slice(0, 3));
        } else {
          throw new Error("No progress data available");
        }
      } catch (error) {
        console.error("Error fetching progress data, using dummy data:", error);
        setProgressData([
          { id: 1, score: 1, total_questions: 10, unit_id: "1", earned_points: 7 },
          { id: 2, score: 1, total_questions: 10, unit_id: "1", earned_points: 5 },
          { id: 3, score: 2, total_questions: 10, unit_id: "1", earned_points: 20 },
        ]);
      }
    };

    const fetchAchievements = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/achievements/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch achievements");
        const data = await response.json();
        if (data.success) {
          setAchievements(data.achievements.slice(0, 3)); // Show only 3 achievements in profile
        } else {
          throw new Error(data.message || "Failed to load achievements");
        }
      } catch (error) {
        console.error("Error fetching achievements, using dummy data:", error);
        setAchievements([
          { id: 1, title: "Spellbook Scholar",  image: "./images/spellbook_scholar.svg" },
          { id: 2, title: "Daily Dedication", image: "./images/daily_dedication.svg" },
          { id: 3, title: "Treasure Hunter",  image: "./images/treasure_hunter.svg" },
        ]);
      }
    };

    fetchUserProfile();
    fetchProgressData();
    fetchAchievements();
  }, [userId]);

  return (
    <div className="profile-container">
      <div className="sidebar-container">
        <Lsidebar active="Profile" />
      </div>
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            <span className="avatar-icon">🧙‍♂️</span>
          </div>
          <button className="edit-button">Edit</button>
        </div>
        <div className="profile-name-container">
          <h2 className="profile-name">{userProfile.name}</h2>
          <p className="profile-points">✨ {userProfile.points} points</p>
        </div>
      </div>

      {/* Achievements Section (Partial) */}
      <div className="section achievements">
        <h3 className="section-title">Achievements</h3>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="achievement-card">
              {achievement.image && <img src={`http://localhost:5000${achievement.image}`} alt={achievement.title} className="achievement-image" />}
              <p className="achievement-title">{achievement.title}</p>
              <p className="achievement-description">{achievement.description}</p>
            </div>
          ))}
        </div>
        <button className="view-all-button" onClick={() => navigate("/achievements")}>
          View All
        </button>
      </div>

      {/* Progress Report Section (Partial) */}
      <div className="section progress-report">
        <h3 className="section-title">Progress Report</h3>
        <div className="progress-grid">
          {progressData.map((quiz) => (
            <div key={quiz.id} className="progress-card">
              <div className="pscore-circle">
                {quiz.score} / {quiz.total_questions}
              </div>
              <p className="lesson-info">
                {quiz.unit_id ? `Unit ${quiz.unit_id} completed` : "Unit completed"}
              </p>
              <p className="points-earned">
                <img src={points} alt="points icon" className="points" />{" "}
                {quiz.earned_points} points earned
              </p>
            </div>
          ))}
        </div>
        <button
          className="view-all-button"
          onClick={() => navigate(`/progress-report/${userId}`)}
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;