import React, { useEffect, useState } from "react";
import "./AchievementsPage.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Exit from "./images/Exit iconsvg.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import trackEvent from '../utils/trackEvent';
import Loading from "./Loading.js"; 
import PyMagicRunner from "./Pymagic_runnergame.js"; 

const AchievementsPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();


   useEffect(() => {
   if (achievements.length === 0 && user?.id) {
    trackEvent(user.id, 'empty_achievements_viewed', {
      category: 'Achievements',
      label: 'No Achievements Yet'
     });
    }
    }, [achievements, user]);

  useEffect(() => {
    // Track page view
    if (user?.id) {
      trackEvent(user.id, 'pageview', { 
        page: '/achievements',
        category: 'Navigation'
      });
    }

    const fetchAchievements = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/api/achievements/${user.id}`);  
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = response.data;
  
        if (data.success) {
          setAchievements(data.achievements || []);
          // Track successful achievements load
          trackEvent(user.id, 'achievements_loaded', {
            category: 'Achievements',
            label: 'Achievements Data Loaded',
            count: data.achievements?.length || 0
          });
        } else {
          throw new Error(data.message || "Failed to load achievements");
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError(error.message);    
      } finally {
        setLoading(false);
      }
    };
  
    fetchAchievements();
  }, [user]);

  const handleBackClick = () => {
    // Track back button click
    trackEvent(user.id, 'back_button_clicked', {
      category: 'Navigation',
      label: 'Back to Profile'
    });
    navigate("/profile");
  };

  const handleAchievementClick = (achievement) => {
    // Track achievement click
    trackEvent(user.id, 'achievement_clicked', {
      category: 'Achievements',
      label: 'Achievement Viewed',
      achievement_id: achievement.id,
      achievement_title: achievement.title
    });
  };
  ///////////
  if (loading) return <Loading />;
    
if (error) return <PyMagicRunner />;

  return (
    <div className="achievements-bg">
      <button className="back-button" onClick={handleBackClick}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>
      <div className="achievements-container">
        <p className="achievements-header">{t("achivement.profileAchievements")}</p>
        <div className="achievements-grid">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="achievement-card"
                onClick={() => handleAchievementClick(achievement)}
              >
                {achievement.image && (
                  <img
                    src={achievement.image.startsWith("http") ? achievement.image : `${apiClient.defaults.baseURL}${achievement.image}`}
                    alt={achievement.title}
                    className="achievement-image"
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      e.target.src = "https://via.placeholder.com/50";
                      e.target.alt = `${achievement.title} (Image not found)`;
                      // Track image load error
                      // trackEvent(user.id, 'image_load_error', {
                      //   category: 'Error',
                      //   label: 'Achievement Image Error',
                      //   achievement_id: achievement.id,
                      //   image_url: e.target.src
                      // });
                    }}
                    onLoad={() => {
                      // Track successful image load
                      // trackEvent(user.id, 'image_loaded', {
                      //   category: 'Achievements',
                      //   label: 'Achievement Image Loaded',
                      //   achievement_id: achievement.id
                      // });
                    }}
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                )}
                <div className="achievement-details">
                  <p className="achievement-title">{achievement.title}</p>
                  {achievement.description && (
                    <p className="achievement-description">{achievement.description}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="ano-achievements-wrapper">
            <div className="ano-achievements">
              <p>{t("achivement.noAchievementsYet")}</p>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;