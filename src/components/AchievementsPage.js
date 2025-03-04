import React, { useEffect, useState } from "react";
import "./AchievementsPage.css";
import { useNavigate } from "react-router-dom";

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const navigate = useNavigate();
  const userId = 1; // Replace with dynamic user ID from auth context

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/achievements/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch achievements");
        const data = await response.json();
        setAchievements(data.achievements || []);
      } catch (error) {
        console.error("Error fetching achievements, using dummy data:", error);
        setAchievements([
          { id: 1, title: "Spellbook Scholar", description: "Completed all lessons in a chapter" },
          { id: 2, title: "Daily Dedication", description: "Completed lessons for 5 days in a row" },
          { id: 3, title: "Treasure Hunter", description: "Unlocked the first treasure chest" },
          { id: 4, title: "Master Wizard", description: "Reached 500 points" },
        ]);
      }
    };

    fetchAchievements();
  }, [userId]);

  return (
    <div className="achievements-bg">
      <button className="back-button" onClick={() => navigate("/profile")}>
        <span>← Back</span>
      </button>
      <div className="achievements-container">
        <h1 className="achievements-header">Achievements</h1>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="achievement-card">
              <p className="achievement-title">{achievement.title}</p>
              <p className="achievement-description">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;