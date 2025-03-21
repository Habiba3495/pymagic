
import React, { useEffect, useState } from "react";
import "./ProfileSection.css";
import Lsidebar from "./Lsidebar";
import { useNavigate } from "react-router-dom";
import points from "./images/points.svg"; // Points icon for progress
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';


const ProfilePage = () => {
  const { user } = useAuth();//2
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({ name: "", points: 0 }); // For user data
  const [progressData, setProgressData] = useState([]); // For progress report data
  const [achievements, setAchievements] = useState([]); // For achievements data
  const userId = user.id; 
  // Replace with dynamic user ID from auth context or props



  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(`/api/users/profile/${userId}`);
        if (response.status !== 200) throw new Error("Failed to fetch user profile");
        // const data = await response.json();
        if (response.data.success) {
          setUserProfile({
            name: response.data.user.name,
            points: response.data.user.points,
          });
        } else {
          throw new Error(response.data.message || "Failed to load user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({ name: "Unknown User", points: 0 });
      }
    };

    const fetchProgressData = async () => {
      try {
        const response = await apiClient.get(`/api/quiz/progress/${userId}`);
        if (response.status !== 200) throw new Error("Failed to fetch progress data");
        // const data = await response.json();
        if (response.data.success && response.data.progress.length > 0) {
          setProgressData(response.data.progress.slice(0, 3));
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
        const response = await apiClient.get(`/api/achievements/${userId}`);
        if (response.status !== 200) throw new Error("Failed to fetch achievements");
        // const data = await response.json();
        if (response.data.success) {
          setAchievements(response.data.achievements.slice(0, 3)); // Show only 3 achievements in profile
        } else {
          throw new Error(response.data.message || "Failed to load achievements");
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
      <div className="profile-content">
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
  </div>
  );
};

export default ProfilePage;