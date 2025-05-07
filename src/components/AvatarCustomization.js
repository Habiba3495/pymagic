import React, { useState, useEffect } from "react";
import "./AvatarCustomization.css";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import { useNavigate } from "react-router-dom";
import points from "./images/points.svg";
import { useTranslation } from "react-i18next";
import trackEvent from '../utils/trackEvent';
import Exit from "./images/Exit iconsvg.svg";
import Loading from "./Loading.js"; 

import FacesIcon from "./images/faces.svg";
import HairstylesIcon from "./images/hairstyles.svg";
import Headdress from "./images/headdress.svg";
import BrowsIcon from "./images/brows.svg";
import EyesIcon from "./images/eyes.svg";
import LipsIcon from "./images/lips.svg";
import NoseIcon from "./images/nose.svg";

const AvatarCustomization = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [ownedAssets, setOwnedAssets] = useState([]);
  const { t } = useTranslation();
  const defaultAssets = {
    face: "/assets/faces/boy_face_1.svg",
    brow: "/assets/brows/brows_1.svg",
    eye: "/assets/eyes/eyes_1.svg",
    hairstyle: "/assets/hairstyles/hairstyles_1.svg",
    lip: "/assets/lips/lips_1.svg",
    headdress: null,
  };
  const [equippedAssets, setEquippedAssets] = useState(defaultAssets);
  const [userPoints, setUserPoints] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("hairstyle");
  const userId = user?.id;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);

  useEffect(() => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (!user || !user.id) return;

    trackEvent(userId, 'pageview', { page: `/profile/avatar/${userId}` }, user).catch((error) => {
      console.error('Failed to track pageview:', error);
    });
    
    trackEvent(userId, 'customization_loaded', {
      category: 'AvatarCustomization',
      label: `User ${userId}`
    }, user).catch((error) => {
      console.error('Failed to track customization_loaded:', error);
    });

    const fetchData = async () => {
      try {
        const [assetsRes, ownedAssetsRes, preferencesRes, userProfileRes] = await Promise.all([
          apiClient.get("/assets"),
          apiClient.get(`/user/${userId}/owned-assets`),
          apiClient.get(`/user-preferences/${userId}`),
          apiClient.get(`/api/users/profile/${userId}`),
        ]);

        setAssets(assetsRes?.data || []);
        setOwnedAssets(ownedAssetsRes?.data || []);

        if (preferencesRes.data) {
          setEquippedAssets({
            face: defaultAssets.face,
            brow: preferencesRes.data.brow || defaultAssets.brow,
            eye: preferencesRes.data.eye || defaultAssets.eye,
            hairstyle: preferencesRes.data.hairstyle || defaultAssets.hairstyle,
            lip: preferencesRes.data.lip || defaultAssets.lip,
            headdress: preferencesRes.data.headdress || defaultAssets.headdress,
          });
        } else {
          setEquippedAssets(defaultAssets);
        }

        if (userProfileRes.data.success) {
          setUserPoints(userProfileRes.data.user.points || 0);
        }
      } catch (error) {
        console.error(t("fetchError"), error);
        setEquippedAssets(defaultAssets);
        trackEvent(userId, 'fetch_data_error', {
          category: 'Error',
          label: 'Avatar Customization Data Fetch Error',
          error: error.message,
        }, user).catch((error) => {
          console.error('Failed to track fetch_data_error:', error);
        });
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
        category: 'AvatarCustomization',
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
          category: 'AvatarCustomization',
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

  const handleBuyClick = (asset) => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    setSelectedAsset(asset);
    setShowConfirmation(true);
    trackEvent(userId, 'buy_clicked', {
      category: 'AvatarCustomization',
      label: `${asset.type} - ${asset.id} - User ${userId}`,
      value: asset.price
    }, user).catch((error) => {
      console.error('Failed to track buy_clicked:', error);
    });
  };

  const confirmPurchase = () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (selectedAsset) {
      handlePurchase(selectedAsset.id, selectedAsset.price, selectedAsset.image_url, selectedAsset.type);
      trackEvent(userId, 'purchase_confirmed', {
        category: 'AvatarCustomization',
        label: `${selectedAsset.type} - ${selectedAsset.id} - User ${userId}`,
        value: selectedAsset.price
      }, user).catch((error) => {
        console.error('Failed to track purchase_confirmed:', error);
      });
    }
    setShowConfirmation(false);
  };

  const cancelPurchase = () => {
    setShowConfirmation(false);
    setSelectedAsset(null);
  };

  const handlePurchase = async (assetId, price, imageUrl, type) => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (ownedAssets.some((asset) => asset.id === assetId)) {
      setMessage(t("alreadyOwned"));
      return;
    }

    try {
      const response = await apiClient.post("/buy", { userId, assetId });

      if (response.data.success) {
        setOwnedAssets((prev) => [...prev, response.data.asset]);
        setUserPoints(response.data.updatedPoints);
        setMessage(t("purchaseSuccess"));
        trackEvent(userId, 'purchase_success', {
          category: 'AvatarCustomization',
          label: `${type} - ${assetId} - User ${userId}`,
          value: price,
        }, user).catch((error) => {
          console.error('Failed to track purchase_success:', error);
        });
      } else {
        setMessage(response.data.message || t("purchaseError"));
        trackEvent(userId, 'purchase_failed', {
          category: 'Error',
          label: 'Purchase Failed',
          error: response.data.message || t("purchaseError"),
        }, user).catch((error) => {
          console.error('Failed to track purchase_failed:', error);
        });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || t("purchaseError"));
      trackEvent(userId, 'purchase_failed', {
        category: 'Error',
        label: 'Purchase Failed',
        error: error.response?.data?.message || error.message,
      }, user).catch((error) => {
        console.error('Failed to track purchase_failed:', error);
      });
    }
  };

  const handleEquip = (imageUrl, type) => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    setEquippedAssets((prev) => ({ ...prev, [type]: imageUrl }));

    const asset = assets.find((a) => a.image_url === imageUrl);
    const isOwned = asset && (asset.price === 0 || ownedAssets.some((owned) => owned.image_url === imageUrl));

    trackEvent(userId, isOwned ? 'asset_equipped' : 'asset_tried', {
      category: 'AvatarCustomization',
      label: `${type} - ${asset?.id || 'unknown'} - User ${userId}`,
      value: asset?.price || 0
    }, user).catch((error) => {
      console.error(`Failed to track ${isOwned ? 'asset_equipped' : 'asset_tried'}:`, error);
    });
  };

  const handleUnequip = (type) => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    setEquippedAssets((prev) => ({ ...prev, [type]: defaultAssets[type] || null }));
    trackEvent(userId, 'asset_unequipped', {
      category: 'AvatarCustomization',
      label: `${type} - User ${userId}`
    }, user).catch((error) => {
      console.error('Failed to track asset_unequipped:', error);
    });
  };

  const handleSave = async () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return false;
    }

    const equippedAssetUrls = [
      equippedAssets.brow,
      equippedAssets.eye,
      equippedAssets.hairstyle,
      equippedAssets.lip,
      equippedAssets.headdress,
    ].filter(Boolean);

    const isValid = equippedAssetUrls.every((url) => {
      const asset = assets.find((a) => a.image_url === url);
      if (!asset) return true;
      return asset.price === 0 || ownedAssets.some((owned) => owned.image_url === url);
    });

    if (!isValid) {
      setMessage(t("avatr.mustPurchaseAssetFirst"));
      trackEvent(userId, 'save_failed_non_owned_asset', {
        category: 'Error',
        label: 'Attempted to save non-owned asset',
      }, user).catch((error) => {
        console.error('Failed to track save_failed_non_owned_asset:', error);
      });
      return false;
    }

    try {
      const response = await apiClient.post("/save-preferences", {
        userId,
        brow: equippedAssets.brow,
        eye: equippedAssets.eye,
        hairstyle: equippedAssets.hairstyle,
        lip: equippedAssets.lip,
        headdress: equippedAssets.headdress,
      });
      setMessage(t("SuccessfullySaved!"));
      trackEvent(userId, 'preferences_saved', {
        category: 'AvatarCustomization',
        label: `User ${userId}`
      }, user).catch((error) => {
        console.error('Failed to track preferences_saved:', error);
      });
      return true;
    } catch (error) {
      setMessage(t("saveError"));
      console.error(t("saveError"), error);
      trackEvent(userId, 'preferences_save_error', {
        category: 'Error',
        label: 'Preferences Save Error',
        error: error.message,
      }, user).catch((error) => {
        console.error('Failed to track preferences_save_error:', error);
      });
      return false;
    }
  };

  const handleBackClick = () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (
      equippedAssets.brow ||
      equippedAssets.eye ||
      equippedAssets.hairstyle ||
      equippedAssets.lip ||
      equippedAssets.headdress
    ) {
      setShowBackConfirmation(true);
    } else {
      navigate("/profile");
    }
  };

  const confirmBackSave = async () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    const saveSuccessful = await handleSave();
    if (saveSuccessful) {
      setShowBackConfirmation(false);
      navigate("/profile");
    }
  };

  const cancelBackSave = () => {
    setShowBackConfirmation(false);
    navigate("/profile");
  };

  const getStyleForType = (type, imageUrl) => {
    switch (type) {
      case "face":
        return { position: "absolute", top: "0", left: "0", width: "300px", zIndex: 0 };
      case "eye":
        return { position: "absolute", top: "121px", left: "62px", width: "176px", zIndex: 2 };
      case "brow":
        return { position: "absolute", top: "90px", left: "51px", width: "197px", zIndex: 3 };
      case "hairstyle":
        if (imageUrl === "/assets/hairstyles/hairstyles_15.svg") {
          return {
            position: "absolute",
            top: "-50px",
            left: "-46px",
            width: "388px",
            zIndex: 4
          };
        }
        if (imageUrl === "/assets/hairstyles/hairstyles_13.svg") {
          return {
            position: "absolute",
            top: "-68px",
            left: "-18px",
            width: "330px",
            zIndex: 4
          };
        }
        if (imageUrl === "/assets/hairstyles/hairstyles_14.svg") {
          return {
            position: "absolute",
            top: "-91px",
            left: "-13px",
            width: "351px",
            zIndex: 4
          };
        }
        if (imageUrl === "/assets/hairstyles/hairstyles_16.svg") {
          return {
            position: "absolute",
            top: "-147px",
            left: "4px",
            width: "263px",
            zIndex: 4
          };
        }
        return {
          position: "absolute",
          top: "-69px",
          left: "-3px",
          width: "303px",
          zIndex: 4
        };
      case "lip":
        return { position: "absolute", top: "226px", left: "103px", width: "93px", zIndex: 2 };
      case "headdress":
        return { position: "absolute", top: "-265px", left: "-36px", width: "380px", zIndex: 5 };
      default:
        return {};
    }
  };

  const assetTypes = [
    { type: "hairstyle", icon: HairstylesIcon },
    { type: "headdress", icon: Headdress },
    { type: "brow", icon: BrowsIcon },
    { type: "eye", icon: EyesIcon },
    { type: "lip", icon: LipsIcon },
  ];

  if (loading) return <Loading />;

  return (
    <div className="avatar-customization-container">
      <button className="back-button" onClick={handleBackClick}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>

      <div className="Aheader">
        <span className="username">{user.name}</span>
        <img src={points} alt={t("avatr.pointsIcon")} className="userpoints" />
        <span className="user_points">
          {userPoints} {t("avatr.points")}
        </span>
      </div>

      <div className="main-content">
        <div className="avatar-preview">
          <div style={{ position: "relative", width: "100%", maxWidth: "300px", aspectRatio: "6 / 7", margin: "0 0 40px 0" }}>
            {equippedAssets.face && (
              <img
                src={equippedAssets.face}
                alt={t("faceAlt")}
                style={getStyleForType("face", equippedAssets.face)}
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
                    alt={t(`${type}Alt`)}
                    style={getStyleForType(type, equippedAssets[type])}
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
        </div>
        <div className="asset-section">
          <div className="Anavigation-tabs">
            {assetTypes.map(({ type, icon }) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedTab(type);
                  if (user?.id) {
                    trackEvent(userId, "tab_switched", {
                      category: "AvatarCustomization",
                      label: `${type} - User ${userId}`,
                    }, user).catch((error) => {
                      console.error('Failed to track tab_switched:', error);
                    });
                  }
                }}
                className={selectedTab === type ? "active" : ""}
              >
                <img src={icon} alt={t(`${type}Icon`)} className="nav-icon" />
              </button>
            ))}
          </div>

          <p className="assetoptionname">
            {selectedTab === "headdress" ? t("avatr.headdresses") : t(`${selectedTab}s`)}
          </p>
          <div className="asset-content">
            <div className="asset-grid">
              {assets
                .filter((asset) => asset.type === selectedTab)
                .map((asset) => (
                  <div key={asset.id} className="asset-card">
                    <img
                      src={asset.image_url}
                      alt={asset.name}
                      onClick={() => handleEquip(asset.image_url, asset.type)}
                      style={{ cursor: "pointer" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50";
                        e.target.alt = `${asset.name} (Image not found)`;
                      }}
                    />
                    {ownedAssets.some((owned) => asset.price !== 0 && owned.id === asset.id) ? (
                      <span className="owned-label">{t("avatr.owned")}</span>
                    ) : asset.price > 0 ? (
                      <div>
                        <p className="pointsname">
                          <img src={points} alt={t("pointsIcon")} className="userpointstow" />
                          {asset.price} {t("avatr.points")}
                        </p>
                        <button className="buy_button" onClick={() => handleBuyClick(asset)}>
                          {t("avatr.buy")}
                        </button>
                      </div>
                    ) : null}
                    {(ownedAssets.some((owned) => owned.id === asset.id) || asset.price === 0) && (
                      <button onClick={() => handleEquip(asset.image_url, asset.type)}>
                        {t("avatr.equip")}
                      </button>
                    )}
                    {equippedAssets[asset.type] === asset.image_url && (
                      <button onClick={() => handleUnequip(asset.type)}>
                        {t("avatr.unequip")}
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="save-button" onClick={handleSave}>
          {t("avatr.save")}
        </button>
      </div>

      {showBackConfirmation && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal">
            <p>{t("avatr.confirmSaveBeforeExit")}</p>
            <button onClick={confirmBackSave}>{t("avatr.yes")}</button>
            <button onClick={cancelBackSave}>{t("avatr.no")}</button>
          </div>
        </div>
      )}

      {message && (
        <div className="message-modal_overlay">
          <div className="message-modal">
            <p>{message}</p>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal">
            <p>{t("avatr.confirmPurchase", { price: selectedAsset.price })}</p>
            <button onClick={confirmPurchase}>{t("avatr.yes")}</button>
            <button onClick={cancelPurchase}>{t("avatr.no")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarCustomization;