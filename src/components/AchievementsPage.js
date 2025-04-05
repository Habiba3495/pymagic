import React, { useEffect, useState } from "react";
import "./AchievementsPage.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Add useTranslation
import Exit from "./images/Exit iconsvg.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';

const AchievementsPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = user.id;
  const { t } = useTranslation(); // Add useTranslation hook

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching achievements for userId:", userId);  

        const response = await apiClient.get(`/api/achievements/${userId}`);  
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = response.data;
  
        if (data.success) {
          setAchievements(data.achievements || []); // Ensure achievements is an array
        } else {
          throw new Error(data.message || "Failed to load achievements");
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError(error.message);  
        setAchievements([
          {
            id: 1,
            title: "Spellbook Scholar",
            description: "Unlocked at 50 points",
            image: `${apiClient.defaults.baseURL}/images/spellbook_scholar.svg`,
          },
          {
            id: 2,
            title: "Daily Dedication",
            description: "Unlocked at 70 points",
            image: `${apiClient.defaults.baseURL}/images/daily_dedication.svg`,
          },
          {
            id: 3,
            title: "Treasure Hunter",
            description: "Unlocked at 100 points",
            image: `${apiClient.defaults.baseURL}/images/treasure_hunter.svg`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAchievements();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading achievements...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="achievements-bg">
      <button className="back-button" onClick={() => navigate("/profile")}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>
      <div className="achievements-container">
        <h1 className="achievements-header">{t("profileAchievements")}</h1>
        <div className="achievements-grid">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                {achievement.image && (
                  <img
                    src={achievement.image.startsWith("http") ? achievement.image : `${apiClient.defaults.baseURL}${achievement.image}`}
                    alt={achievement.title}
                    className="achievement-image"
                    onError={(e) => {
                      console.error("Image failed to load:", {
                        src: e.target.src,
                        status: e.target.status || "Unknown",
                        error: e
                      });
                      e.target.src = "https://via.placeholder.com/50"; // Fallback placeholder
                      e.target.alt = `${achievement.title} (Image not found)`;
                    }}
                    onLoad={(e) => console.log("Image loaded successfully:", e.target.src)} // Debug successful loads
                    loading="lazy" // Lazy load images for performance
                    crossOrigin="anonymous" // Ensure CORS for images
                  />
                )}
                <p className="achievement-title">{achievement.title}</p>
              </div>
            ))
          ) : (
            <p className="no-achievements">No achievements yet. Earn points to unlock rewards!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;