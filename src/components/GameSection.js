import React, { useState, useEffect } from "react";
import Lsidebar from "./Sidebar";
import "./GameSection.css";
import { useTranslation } from "react-i18next";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import trackEvent from '../utils/trackEvent';
import GamePage from "./GamePage";

const GameSection = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const startGame = () => {
    if (user?.id) {
      trackEvent(user.id, 'start_game_clicked', {
        category: 'Game',
        label: 'Start Game Button Clicked',
      }, user).catch((error) => {
        console.error('Failed to track start_game_clicked:', error);
      });
    }
    setGameStarted(true);
  };

  return (
    <div className="Gpagecontainer">
      <Lsidebar />
      <div className="game-background">
        <div className="game-door">
          {!gameStarted ? (
            <button className="start-game-btn" onClick={startGame}>
              {t("game.gamebutton")}
            </button>
          ) : (
            <GamePage onExit={() => setGameStarted(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSection;