import React, { useState, useEffect } from "react";
import "./AvatarCustomization.css";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import { useNavigate } from "react-router-dom";
import points from "./images/points.svg";

const AvatarCustomization = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [ownedAssets, setOwnedAssets] = useState([]);
  
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
  const [userPoints, setUserPoints] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("face");
  const userId = user.id;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);


  const handleBuyClick = (asset) => {
    setSelectedAsset(asset);
    setShowConfirmation(true);
  };
 
  const confirmPurchase = () => {
    if (selectedAsset) {
      handlePurchase(selectedAsset.id, selectedAsset.price, selectedAsset.image_url, selectedAsset.type);
    }
    setShowConfirmation(false); // إغلاق النافذة بعد الشراء
  };
 
  const cancelPurchase = () => {
    setShowConfirmation(false);
    setSelectedAsset(null);
  };
  
  useEffect(() => {
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

        // If preferences exist, merge them with defaults to ensure no null values
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
          // If no preferences exist (new user), explicitly set the default assets
          setEquippedAssets(defaultAssets);
        }

        if (userProfileRes.data.success) {
          setUserPoints(userProfileRes.data.user.points || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // In case of an error, ensure defaults are applied
        setEquippedAssets(defaultAssets);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handlePurchase = async (assetId, price, imageUrl, type) => {
    if (ownedAssets.some((asset) => asset.id === assetId)) {
      setMessage("You already own this item!");
      return;
    }

    try {
      const response = await apiClient.post("/buy", { userId, assetId });

      if (response.data.success) {
        setOwnedAssets((prev) => [...prev, response.data.asset]);
        setUserPoints(response.data.updatedPoints);
        setMessage("Item purchased successfully!");
      } else {
        setMessage(response.data.message || "Error purchasing item");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error purchasing item");
    }
  };

  const handleEquip = (imageUrl, type) => {
    setEquippedAssets((prev) => ({ ...prev, [type]: imageUrl }));
  };

  const handleUnequip = (type) => {
    setEquippedAssets((prev) => ({ ...prev, [type]: defaultAssets[type] || null }));
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
        setMessage("Successfully saved!");
      })
      .catch((error) => {
        setMessage("Error saving preferences");
        console.error("Error saving preferences:", error);
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
    { type: "face", icon: "person.svg" },
    { type: "hairstyle", icon: "comb.svg" },
    { type: "headdress", icon: "hat.svg" },
    { type: "brow", icon: "brow.svg" },
    { type: "eye", icon: "eye.svg" },
    { type: "lip", icon: "lip.svg" },
    { type: "nose", icon: "nose.svg" },
  ];
  
  return (
    
    <div className="avatar-customization-container">
      <div className="Aheader">
     
          <span className="username">{user.name}</span>
          <img src={points} alt="points icon" className="userpoints" />
          <span  className="user_points" > {userPoints}  points</span>
         
        </div>
    

  <div className="main-content">

<div className="asset-section">
  {/* شريط الاختيار */}
  <div className="Anavigation-tabs">
    {assetTypes.map(({ type, icon }) => (
      <button
        key={type}
        onClick={() => setSelectedTab(type)}
        className={selectedTab === type ? "active" : ""}
      >
        <img src={`/icons/${icon}`} alt={type} />
      </button>
    ))}
  </div>


  <h2 className="assetoptionname">{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}s</h2>
  <div className="asset-content">

    <div className="asset-grid">
      {assets
        .filter((asset) => asset.type === selectedTab)
        .map((asset) => (
          <div key={asset.id} className="asset-card">
            <img src={asset.image_url} alt={asset.name} />
            {ownedAssets.some((owned) => asset.price !== 0 && owned.id === asset.id) ? (
              <span className="owned-label">OWNED</span>
            ) : asset.price > 0 ? (
              <div>
                <p className="pointsname"><img src={points} alt="points icon" className="userpointstow" /> {asset.price} points</p>
                <button className="buy_button" onClick={() => handleBuyClick(asset)}>
                 Buy
                </button>

              </div>
            ) : null}
            {(ownedAssets.some((owned) => owned.id === asset.id) || asset.price === 0) && (
              <button onClick={() => handleEquip(asset.image_url, asset.type)}>Equip</button>
            )}
            {equippedAssets[asset.type] === asset.image_url && (
              <button onClick={() => handleUnequip(asset.type)}>Unequip</button>
            )}
          </div>
        ))}
    </div>
  </div>
</div>
    
        <div className="avatar-preview">
        
          <div style={{ position: "relative", width: "300px", height: "350px", margin: "0 auto" }}>
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
        </div>
        </div>
  
      <div className="action-buttons">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    
      {message && <p>{message}</p>}

      {showConfirmation && (
         <div className="confirmation-modal-overlay">
  <div className="confirmation-modal">
    <p>Are you sure you want to buy this item for {selectedAsset.price} points?</p>
    <button onClick={confirmPurchase}>Yes</button>
    <button onClick={cancelPurchase}>No</button>
  </div>
  </div>
)}

    </div>
  );

};

export default AvatarCustomization;