import React, { useState, useEffect } from "react";
import "./AvatarCustomization.css";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import { useNavigate } from "react-router-dom";
import points from "./images/points.svg";
import { useTranslation } from "react-i18next";
import trackEvent from '../utils/trackEvent';
import Exit from "./images/Exit iconsvg.svg";

// Import SVG icons as React components
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
    nose: "/assets/nose/nose_1.svg",
    headdress: null,
  };
  const [equippedAssets, setEquippedAssets] = useState(defaultAssets);
  const [userPoints, setUserPoints] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("face");
  const userId = user.id;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    // Track page view
    trackEvent(userId, 'pageview', { page: `/profile/avatar/${userId}` });
    
    // Track customization loaded event
    trackEvent(userId, 'customization_loaded', {
      category: 'AvatarCustomization',
      label: `User ${userId}`
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
            face: preferencesRes.data.face || defaultAssets.face,
            brow: preferencesRes.data.brow || defaultAssets.brow,
            eye: preferencesRes.data.eye || defaultAssets.eye,
            hairstyle: preferencesRes.data.hairstyle || defaultAssets.hairstyle,
            lip: preferencesRes.data.lip || defaultAssets.lip,
            nose: preferencesRes.data.nose || defaultAssets.nose,
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, t]);

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      trackEvent(userId, 'time_spent', {
        category: 'AvatarCustomization',
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
          category: 'AvatarCustomization',
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

  const handleBuyClick = (asset) => {
    setSelectedAsset(asset);
    setShowConfirmation(true);
    trackEvent(userId, 'buy_clicked', {
      category: 'AvatarCustomization',
      label: `${asset.type} - ${asset.id} - User ${userId}`,
      value: asset.price
    });
  };

  const confirmPurchase = () => {
    if (selectedAsset) {
      handlePurchase(selectedAsset.id, selectedAsset.price, selectedAsset.image_url, selectedAsset.type);
      trackEvent(userId, 'purchase_confirmed', {
        category: 'AvatarCustomization',
        label: `${selectedAsset.type} - ${selectedAsset.id} - User ${userId}`,
        value: selectedAsset.price
      });
    }
    setShowConfirmation(false);
  };

  const cancelPurchase = () => {
    setShowConfirmation(false);
    setSelectedAsset(null);
  };

  const handlePurchase = async (assetId, price, imageUrl, type) => {
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
      } else {
        setMessage(response.data.message || t("purchaseError"));
      }
    } catch (error) {
      setMessage(error.response?.data?.message || t("purchaseError"));
    }
  };

  const handleEquip = (imageUrl, type) => {
    setEquippedAssets((prev) => ({ ...prev, [type]: imageUrl }));
    trackEvent(userId, 'asset_equipped', {
      category: 'AvatarCustomization',
      label: `${type} - User ${userId}`
    });
  };

  const handleUnequip = (type) => {
    setEquippedAssets((prev) => ({ ...prev, [type]: defaultAssets[type] || null }));
    trackEvent(userId, 'asset_unequipped', {
      category: 'AvatarCustomization',
      label: `${type} - User ${userId}`
    });
  };

  const handleSave = () => {
    apiClient
      .post("/save-preferences", {
        userId,
        face: equippedAssets.face,
        brow: equippedAssets.brow,
        eye: equippedAssets.eye,
        hairstyle: equippedAssets.hairstyle,
        lip: equippedAssets.lip,
        nose: equippedAssets.nose,
        headdress: equippedAssets.headdress,
      })
      .then((response) => {
        setMessage(t("SuccessfullySaved!"));
        trackEvent(userId, 'preferences_saved', {
          category: 'AvatarCustomization',
          label: `User ${userId}`
        });
      })
      .catch((error) => {
        setMessage(t("saveError"));
        console.error(t("saveError"), error);
      });
  };

  const getStyleForType = (type) => {
    switch (type) {
      case "face":
        return { position: "absolute", top: "0", left: "0", width: "300px", zIndex: 0 };
      case "eye":
        return { position: "absolute", top: "121px", left: "64px", width: "176px", zIndex: 2 };
      case "brow":
        return { position: "absolute", top: "90px", left: "51px", width: "197px", zIndex: 3 };
      case "hairstyle":
        return { position: "absolute", top: "-69px", left: "-3px", width: "303px", zIndex: 4 };
      case "lip":
        return { position: "absolute", top: "226px", left: "103px", width: "93px", zIndex: 2 };
      case "nose":
        return { position: "absolute", top: "185px", left: "130px", width: "45px", zIndex: 1 };
      case "headdress":
        return { position: "absolute", top: "-80px", left: "-10px", width: "325px", zIndex: 5 };
      default:
        return {};
    }
  };

  const assetTypes = [
    { type: "face", icon: FacesIcon },
    { type: "hairstyle", icon: HairstylesIcon },
    { type: "headdress", icon: Headdress },
    { type: "brow", icon: BrowsIcon },
    { type: "eye", icon: EyesIcon },
    { type: "lip", icon: LipsIcon },
    { type: "nose", icon: NoseIcon },
  ];

  return (
    <div className="avatar-customization-container">
            <button className="back-button" onClick={() => navigate("/profile")}>
            <img src={Exit} alt="Back" className="back-icon" />
            </button>
      <div className="Aheader">
        <span className="username">{user.name}</span>
        <img src={points} alt={t("avatr.pointsIcon")} className="userpoints" />
        <span className="user_points">{userPoints} {t("avatr.points")}</span>
      </div>

      <div className="main-content">
        <div className="asset-section">
          <div className="Anavigation-tabs">
            {assetTypes.map(({ type, icon }) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedTab(type);
                  trackEvent(userId, 'tab_switched', {
                    category: 'AvatarCustomization',
                    label: `${type} - User ${userId}`
                  });
                }}
                className={selectedTab === type ? "active" : ""}
              >
                <img
                  src={icon}
                  alt={t(`${type}Icon`)}
                  className="nav-icon"
                />
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
                    <img src={asset.image_url} alt={asset.name} />
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

        <div className="avatar-preview">
          <div style={{ position: "relative", width: "300px", height: "350px", margin: "0 auto" }}>
            {equippedAssets.face && (
              <img src={equippedAssets.face} alt={t("faceAlt")} style={getStyleForType("face")} />
            )}
            {Object.keys(equippedAssets).map((type, index) => {
              if (type !== "face" && equippedAssets[type]) {
                return (
                  <img
                    key={index}
                    src={equippedAssets[type]}
                    alt={t(`${type}Alt`)}
                    style={getStyleForType(type)}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="save-button" onClick={handleSave}>
          {t("avatr.save")}
        </button>
      </div>

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