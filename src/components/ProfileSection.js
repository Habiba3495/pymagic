import React, { useEffect, useState } from "react";
import "./ProfileSection.css";
import Lsidebar from "./Lsidebar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Add useTranslation
import points from "./images/points.svg"; // Points icon for progress
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import { FiLogOut } from 'react-icons/fi'; // Using react-icons for the logout icon

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Add useTranslation hook
  const [userProfile, setUserProfile] = useState({ name: "", points: 0 });
  const [progressData, setProgressData] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // Define default assets as a constant for reuse
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
        // setProgressData([
        //   { id: 1, score: 1, total_questions: 10, unit_id: "1", earned_points: 7 },
        //   { id: 2, score: 1, total_questions: 10, unit_id: "1", earned_points: 5 },
        //   { id: 3, score: 2, total_questions: 10, unit_id: "1", earned_points: 20 },
        // ]);
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
        // setAchievements([
        //   { id: 1, title: t("achievementSpellbookScholar"), image: "./images/spellbook_scholar.svg" },
        //   { id: 2, title: t("achievementDailyDedication"), image: "./images/daily_dedication.svg" },
        //   { id: 3, title: t("achievementTreasureHunter"), image: "./images/treasure_hunter.svg" },
        // ]);
      }
    };

    const fetchAvatarPreferences = async () => {
      try {
        const response = await apiClient.get(`/user-preferences/${userId}`);
        if (response.data) {
          // Merge backend response with defaults to avoid null values
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
          // If no preferences exist (new user), explicitly set the default assets
          setEquippedAssets(defaultAssets);
        }
      } catch (error) {
        console.error("Error fetching avatar preferences:", error);
        // In case of an error, fall back to default assets
        setEquippedAssets(defaultAssets);
      }
    };

    fetchUserProfile();
    fetchProgressData();
    fetchAchievements();
    fetchAvatarPreferences();
  }, [userId, t]); // Add t as a dependency to re-fetch if language changes

  const handleLogout = async () => {
    try {
      logout();
      navigate('/HomePage');
    } catch (error) {
      console.error("Error logging out:", error);
      logout();
      navigate('/HomePage');
    }
  };

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
      <button className="logout-button" onClick={handleLogout}>
        <FiLogOut size={24} />
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
            <button className="edit-button" onClick={() => navigate("/profile/avatar")}>
              {t("profileEdit")}
            </button>
          </div>
          <div className="profile-name-container">
            <h2 className="profile-name">{userProfile.name}</h2>
            <p className="profile-points">
              <img src={points} alt="points icon" className="userpointstow" /> 
              {userProfile.points} {t("profilePoints")}
            </p>
          </div>
        </div>

        <div className="section achievements">
          <h3 className="section-title">{t("profileAchievements")}</h3>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                {achievement.image && <img src={`http://localhost:5000${achievement.image}`} alt={achievement.title} className="achievement-image" />}
                <p className="achievement-title">{achievement.title}</p>
              </div>
            ))}
          </div>
          <button className="view-all-button" onClick={() => navigate("/achievements")}>
            {t("profileViewAll")}
          </button>
        </div>

        <div className="section progress-report">
          <h3 className="section-title">{t("profileProgressReport")}</h3>
          <div className="progress-grid">
            {progressData.map((quiz) => (
              <div key={quiz.id} className="progress-card">
                <div className="pscore-circle">
                  {quiz.score} / {quiz.total_questions}
                </div>
                <p className="lesson-info">
                {quiz.lesson_id && quiz.lesson_number
                  ? `${t("unit")} ${quiz.unit_id}, ${t("lesson")} ${quiz.lesson_number}`
                  : `${t("unit")} ${quiz.unit_id}`}
              </p>
                <p className="points-earned">
                  <img src={points} alt="points icon" className="points" />{" "}
                  {quiz.earned_points} {t("profilePointsEarned")}
                </p>
              </div>
            ))}
          </div>
          <button
            className="view-all-button"
            onClick={() => navigate(`/progress-report/${userId}`)}
          >
            {t("profileViewAll")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;