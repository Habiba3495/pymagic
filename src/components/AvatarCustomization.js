
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AvatarCustomization.css";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';


const AvatarCustomization = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [ownedAssets, setOwnedAssets] = useState([]);
  const [equippedAssets, setEquippedAssets] = useState({
    face: "/assets/faces/boy_face_1.svg",
    brow: "/assets/brows/brows_1.svg",
    eye: "/assets/eyes/eyes_1.svg",
    hairstyle: "/assets/hairstyles/hairstyles_1.svg",
    lip: "/assets/lips/lips_1.svg",
    nose: "/assets/nose/nose_1.svg",
    headdress: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("face");
  const userId = user.id; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, ownedAssetsRes, preferencesRes] = await Promise.all([
          apiClient.get("/assets"),
          apiClient.get(`/user/${userId}/owned-assets`),
          apiClient.get(`/user-preferences/${userId}`),
        ]);

        // Add null checks
        setAssets(assetsRes?.data || []);
        setOwnedAssets(ownedAssetsRes?.data || []);

        console.log(assetsRes.data);
        
        

        if (preferencesRes.data) {
          setEquippedAssets({
            face: preferencesRes.data.face ,
            brow: preferencesRes.data.brow ,
            eye: preferencesRes.data.eye ,
            hairstyle: preferencesRes.data.hairstyle ,
            lip: preferencesRes.data.lip ,
            nose: preferencesRes.data.nose ,
            headdress: preferencesRes.data.headdress,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
      
      // Correctly access response data
      if (response.data.success) {
        setOwnedAssets((prev) => [
          ...prev, 
          response.data.asset
        ]);
        setMessage("Item purchased!");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error purchasing item");
    }
  };

  const handleEquip = (imageUrl, type) => {
    setEquippedAssets((prev) => ({ ...prev, [type]: imageUrl }));
  };

  const handleUnequip = (type) => {
    setEquippedAssets((prev) => ({ ...prev, [type]: null }));
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

  // if (loading) return <p>Loading...</p>;

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
        <div className="user-info">
          <span className="username">{user.name}</span>
          <span className="points">
            <img src="/icons/coin.svg" alt="coin" />
            {user.earned_points} points
          </span>
        </div>
        {/* <div className="edit-avatar-banner">Edit Avatar</div> */}
      </div>

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

      <div className="avatar-preview">
        <div style={{ position: "relative", width: "240px", height: "400px", margin: "0 auto" }}>
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

      <div className="asset-section">
        <h2>{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}s</h2>
        <div className="asset-grid">
          {assets
            .filter((asset) => asset.type === selectedTab)
            .map((asset) => (
              <div key={asset.id} className="asset-card">
                <img src={asset.image_url} alt={asset.name} />
                <p>{asset.name}</p>
                {ownedAssets.some((owned) => asset.price !== 0 && owned.id === asset.id) ? (
                  <span className="owned-label">Owned</span>
                ) : (
                  asset.price > 0 ?
                  <div>
                    <p>Price: {asset.price} points</p>
                    <button
                      onClick={() =>
                        handlePurchase(asset.id, asset.price, asset.image_url, asset.type)
                      }
                    >
                      Buy
                    </button>
                  </div>
                  : null
                )}
                { (ownedAssets.some((owned) => owned.id === asset.id) ||  asset.price === 0 ) && (
                  <button onClick={() => handleEquip(asset.image_url, asset.type)}>Equip</button>
                )}
                {equippedAssets[asset.type] === asset.image_url && (
                  <button onClick={() => handleUnequip(asset.type)}>Unequip</button>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="cancel-button">Cancel</button>
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AvatarCustomization;



