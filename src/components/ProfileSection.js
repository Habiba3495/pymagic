import React, { useEffect, useState } from "react";
import "./ProfileSection.css";
import Lsidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import points from "./images/points.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import { FiSettings } from 'react-icons/fi';
import trackEvent from '../utils/trackEvent';

const ProfilePage = () => {
  const { user} = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState({ name: "", points: 0 });
  const [progressData, setProgressData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const defaultAssets = {
    face: "/assets/faces/boy_face_1.svg",
    brow: "/assets/brows/brows_1.svg",
    eye: "/assets/eyes/eyes_1.svg",
    hairstyle: "/assets/hairstyles/hairstyles_1.svg",
    lip: "/assets/lips/lips_1.svg",
    nose: "/assets/nose/nose_1.svg",
    headdress: null,
  };
  const [equippedAssets, setEquippedAssets] = useState(defaultAssets);
  const userId = user.id;

  useEffect(() => {
    // Track page view
    trackEvent(userId, 'pageview', { page: `/profile/${userId}` });
    
    // Track profile loaded event
    trackEvent(userId, 'profile_loaded', {
      category: 'Profile',
      label: `User ${userId}`
    });

    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(`/api/users/profile/${userId}`);
        if (response.status !== 200) throw new Error("Failed to fetch user profile");
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
        setUserProfile({ name: t("profileUnknownUser"), points: 0 });
      }
    };

    const fetchProgressData = async () => {
      try {
        const response = await apiClient.get(`/api/quiz/progress/${userId}`);
        if (response.status !== 200) throw new Error("Failed to fetch progress data");
        if (response.data.success && response.data.progress.length > 0) {
          setProgressData(response.data.progress.slice(0, 3));
        } else {
          throw new Error("No progress data available");
        }
      } catch (error) {
        console.error("Error fetching progress data, using dummy data:", error);
      }
    };

    const fetchAchievements = async () => {
      try {
        const response = await apiClient.get(`/api/achievements/${userId}`);
        if (response.status !== 200) throw new Error("Failed to fetch achievements");
        if (response.data.success) {
          setAchievements(response.data.achievements.slice(0, 3));
        } else {
          throw new Error(response.data.message || "Failed to load achievements");
        }
      } catch (error) {
        console.error("Error fetching achievements, using dummy data:", error);
      }
    };

    const fetchAvatarPreferences = async () => {
      try {
        const response = await apiClient.get(`/user-preferences/${userId}`);
        if (response.data) {
          setEquippedAssets({
            face: response.data.face || defaultAssets.face,
            brow: response.data.brow || defaultAssets.brow,
            eye: response.data.eye || defaultAssets.eye,
            hairstyle: response.data.hairstyle || defaultAssets.hairstyle,
            lip: response.data.lip || defaultAssets.lip,
            nose: response.data.nose || defaultAssets.nose,
            headdress: response.data.headdress || defaultAssets.headdress,
          });
        } else {
          setEquippedAssets(defaultAssets);
        }
      } catch (error) {
        console.error("Error fetching avatar preferences:", error);
        setEquippedAssets(defaultAssets);
      }
    };

    fetchUserProfile();
    fetchProgressData();
    fetchAchievements();
    fetchAvatarPreferences();
  }, [userId, t]);

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      trackEvent(userId, 'time_spent', {
        category: 'Profile',
        label: `User ${userId}`
      }, duration);
    };
  }, [userId]);

  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        trackEvent(userId, 'inactive', {
          category: 'Profile',
          label: `User ${userId}`,
          value: 30
        }, 30);
      }, 30000);
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    resetTimeout();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
    };
  }, [userId]);

  const getStyleForType = (type) => {
    switch (type) {
      case "face":
        return { position: "absolute", top: "0", left: "0", width: "150px", zIndex: 0 };
      case "eye":
        return { position: "absolute", top: "60px", left: "32px", width: "88px", zIndex: 2 };
      case "brow":
        return { position: "absolute", top: "45px", left: "25px", width: "98px", zIndex: 3 };
      case "hairstyle":
        return { position: "absolute", top: "-35px", left: "-2px", width: "152px", zIndex: 4 };
      case "lip":
        return { position: "absolute", top: "113px", left: "52px", width: "46px", zIndex: 2 };
      case "nose":
        return { position: "absolute", top: "92px", left: "65px", width: "22px", zIndex: 1 };
      case "headdress":
        return { position: "absolute", top: "-40px", left: "-5px", width: "162px", zIndex: 5 };
      default:
        return {};
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar-container">
        <Lsidebar active="Profile" />
      </div>

      <button
        className="settings-button"
        onClick={() => {
          trackEvent(userId, 'settings_clicked', {
            category: 'Profile',
            label: `User ${userId}`
          });
          navigate("/setting");
        }}
      >
        <FiSettings size={24} />
      </button>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <div className="profile-avatar" style={{ position: "relative", width: "150px", height: "200px" }}>
              {equippedAssets.face && (
                <img src={equippedAssets.face} alt="Equipped face" style={getStyleForType("face")} />
              )}
              {Object.keys(equippedAssets).map((type, index) => {
                if (type !== "face" && equippedAssets[type]) {
                  return (
                    <img
                      key={index}
                      src={equippedAssets[type]}
                      alt={`Equipped ${type}`}
                      style={getStyleForType(type)}
                    />
                  );
                }
                return null;
              })}
            </div>
            <button
              className="edit-button"
              onClick={() => {
                trackEvent(userId, 'edit_avatar_clicked', {
                  category: 'Profile',
                  label: `User ${userId}`
                });
                navigate("/profile/avatar");
              }}
            >
              {t("profile.profileEdit")}
            </button>
          </div>

          {/* //////gab between name and points */}
          <div className="profile-name-container">
            <h2 className="profile-name">{userProfile.name}</h2>
            <p className="profile-points">
              <img src={points} alt="points icon" className="userpointstow" />
              {userProfile.points} {t("profile.profilePoints")}
            </p>
          </div>
        </div>

        <div className="section achievements">
          <p className="section-title">{t("profile.profileAchievements")}</p>
          <div className="achievements-grid">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <div key={achievement.id} className="pachievement-card">
              {achievement.image && (
              <img
             src={`http://localhost:5000${achievement.image}`}
            alt={achievement.title}
           className="achievement-image"
           />
          )}
        <p className="achievement-title">{achievement.title}</p>
       </div>
            ))
          ):(
            <p className="no-achievements">{t("profile.noAchievementsYet")}</p>
          )}
        </div>

          <button
            className="view-all-button"
            onClick={() => {
              trackEvent(userId, 'view_all_achievements_clicked', {
                category: 'Profile',
                label: `User ${userId}`
              });
              navigate("/achievements");
            }}
          >
            {t("profile.profileViewAll")}
          </button>
        </div>

        <div className="section progress-report">
          <p className="section-title">{t("profile.profileProgressReport")}</p>
          <div className="progress-grid">
            {progressData.map((quiz) => (
              <div key={quiz.id} className="progress-card">
                <div className="pscore-circle">
                  {quiz.score} / {quiz.total_questions}
                </div>
                <p className="lesson-info">
                  {quiz.lesson_id && quiz.lesson_number
                    ? `${t("profile.unit")} ${quiz.unit_id}, ${t("profile.lesson")} ${quiz.lesson_number}`
                    : `${t("profile.unit")} ${quiz.unit_id}`}
                </p>
                <p className="points-earned">
                  <img src={points} alt="points icon" className="points" />
                  {quiz.earned_points} {t("profile.profilePointsEarned")}
                </p>
              </div>
            ))}
          </div>
          <button
            className="view-all-button"
            onClick={() => {
              trackEvent(userId, 'view_all_progress_clicked', {
                category: 'Profile',
                label: `User ${userId}`
              });
              navigate(`/progress-report/${userId}`);
            }}
          >
            {t("profile.profileViewAll")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;