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
import Loading from "./Loading.js"; 

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState({ name: "", points: 0 });
  const [progressData, setProgressData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const userId = user?.id;

  useEffect(() => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate("/login");
      return;
    }

    trackEvent(userId, 'pageview', { page: `/profile/${userId}` }, user).catch((error) => {
      console.error('Failed to track pageview:', error);
    });
    trackEvent(userId, 'profile_loaded', {
      category: 'Profile',
      label: `User ${userId}`
    }, user).catch((error) => {
      console.error('Failed to track profile_loaded:', error);
    });

    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(`/api/users/profile/${userId}`);
        if (response.status !== 200) throw new Error(t("profile.fetchProfileError"));
        if (response.data.success) {
          setUserProfile({
            name: response.data.user.name,
            points: response.data.user.points,
          });
        } else {
          throw new Error(response.data.message || t("profile.fetchProfileError"));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({ name: t("profile.profileUnknownUser"), points: 0 });
        trackEvent(userId, 'fetch_profile_error', {
          category: 'Error',
          label: 'User Profile Fetch Error',
          error: error.message,
        }, user).catch((error) => {
          console.error('Failed to track fetch_profile_error:', error);
        });
      }
    };

    const fetchProgressData = async () => {
      try {
        const response = await apiClient.get(`/api/quiz/progress/${userId}`);
        if (response.status !== 200) throw new Error(t("profile.fetchProgressError"));
        if (response.data.success && response.data.progress.length > 0) {
          setProgressData(response.data.progress.slice(0, 3));
        } else {
          throw new Error(t("profile.noProgressYet"));
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
        trackEvent(userId, 'fetch_progress_error', {
          category: 'Error',
          label: 'Progress Data Fetch Error',
          error: error.message,
        }, user).catch((error) => {
          console.error('Failed to track fetch_progress_error:', error);
        });
      }
    };

    const fetchAchievements = async () => {
      try {
        const response = await apiClient.get(`/api/achievements/${userId}`);
        if (response.status !== 200) throw new Error(t("profile.fetchAchievementsError"));
        if (response.data.success) {
          setAchievements(response.data.achievements.slice(0, 3));
        } else {
          throw new Error(response.data.message || t("profile.fetchAchievementsError"));
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        trackEvent(userId, 'fetch_achievements_error', {
          category: 'Error',
          label: 'Achievements Fetch Error',
          error: error.message,
        }, user).catch((error) => {
          console.error('Failed to track fetch_achievements_error:', error);
        });
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
        trackEvent(userId, 'fetch_avatar_preferences_error', {
          category: 'Error',
          label: 'Avatar Preferences Fetch Error',
          error: error.message,
        }, user).catch((error) => {
          console.error('Failed to track fetch_avatar_preferences_error:', error);
        });
      }
    };

    const fetchData = async () => {
      try {
        await Promise.all([
          fetchUserProfile(),
          fetchProgressData(),
          fetchAchievements(),
          fetchAvatarPreferences(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userId, t, navigate]);

  useEffect(() => {
    if (!user || !user.id) return;

    const startTime = Date.now();
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      trackEvent(userId, 'time_spent', {
        category: 'Profile',
        label: `User ${userId}`,
        value: duration,
      }, user).catch((error) => {
        console.error('Failed to track time_spent:', error);
      });
    };
  }, [user, userId]);

  useEffect(() => {
    if (!user || !user.id) return;

    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        trackEvent(userId, 'inactive', {
          category: 'Profile',
          label: `User ${userId}`,
          value: 30
        }, user, 30).catch((error) => {
          console.error('Failed to track inactive:', error);
        });
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
  }, [user, userId]);

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

  if (loading) return <Loading />;

  return (
    <div className="profile-container">
      <div className="sidebar-container">
        <Lsidebar active="Profile" />
      </div>

      <button
        className="settings-button"
        onClick={() => {
          if (user?.id) {
            trackEvent(userId, 'settings_clicked', {
              category: 'Profile',
              label: `User ${userId}`
            }, user).catch((error) => {
              console.error('Failed to track settings_clicked:', error);
            });
          }
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
                <img
                  src={equippedAssets.face}
                  alt="Equipped face"
                  style={getStyleForType("face")}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/50";
                    e.target.alt = "Face (Image not found)";
                  }}
                />
              )}
              {Object.keys(equippedAssets).map((type, index) => {
                if (type !== "face" && equippedAssets[type]) {
                  return (
                    <img
                      key={index}
                      src={equippedAssets[type]}
                      alt={`Equipped ${type}`}
                      style={getStyleForType(type)}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50";
                        e.target.alt = `${type} (Image not found)`;
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>
            <button
              className="edit-button"
              onClick={() => {
                if (user?.id) {
                  trackEvent(userId, 'edit_avatar_clicked', {
                    category: 'Profile',
                    label: `User ${userId}`
                  }, user).catch((error) => {
                    console.error('Failed to track edit_avatar_clicked:', error);
                  });
                }
                navigate("/profile/avatar");
              }}
            >
              {t("profile.profileEdit")}
            </button>
          </div>

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
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50";
                        e.target.alt = `${achievement.title} (Image not found)`;
                      }}
                    />
                  )}
                  <p className="achievement-title">{achievement.title}</p>
                </div>
              ))
            ) : (
              <p className="no-achievements">{t("profile.noAchievementsYet")}</p>
            )}
          </div>

          <button
            className="view-all-button"
            onClick={() => {
              if (user?.id) {
                trackEvent(userId, 'view_all_achievements_clicked', {
                  category: 'Profile',
                  label: `User ${userId}`
                }, user).catch((error) => {
                  console.error('Failed to track view_all_achievements_clicked:', error);
                });
              }
              navigate("/achievements");
            }}
          >
            {t("profile.profileViewAll")}
          </button>
        </div>

        <div className="section progress-report">
          <p className="section-title">{t("profile.profileProgressReport")}</p>
          <div className="progress-grid">
            {progressData.length > 0 ? (
              progressData.map((quiz) => (
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
              ))
            ) : (
              <p className="no-progress">{t("profile.noProgressYet")}</p>
            )}
          </div>

          <button
            className="view-all-button"
            onClick={() => {
              if (user?.id) {
                trackEvent(userId, 'view_all_progress_clicked', {
                  category: 'Profile',
                  label: `User ${userId}`
                }, user).catch((error) => {
                  console.error('Failed to track view_all_progress_clicked:', error);
                });
              }
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