import { useEffect, useRef, useState } from "react";
import './Pymagic_runnergame.css';
import wizardImg from "./images/Pax.svg";
import fireballImg from "./images/Fire.svg";
import plantImg from "./images/Plant.svg";
import poisonImg from "./images/poison.svg";
import jumpSound from '../Sound/Cartoon-jump-sound-effect.mp3';
import failSound from '../Sound/Trumpet-fail-sound.mp3';
import { useTranslation } from 'react-i18next';

export default function PyMagicRunner() {
  const { t } = useTranslation();
  const [jumping, setJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem("bestTime");
    return saved ? parseInt(saved) : 0;
  });
  const [currentObstacle, setCurrentObstacle] = useState(fireballImg);
  const [obstacleKey, setObstacleKey] = useState(0);
  const [showObstacle] = useState(true);
  const wizardRef = useRef(null);
  const obstacleRef = useRef(null);
  const jumpSoundEffect = useRef(new Audio(jumpSound));
  const failSoundEffect = useRef(new Audio(failSound));
  const obstacles = [fireballImg, plantImg, poisonImg];
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const markInteracted = () => setHasInteracted(true);
    window.addEventListener("keydown", markInteracted);
    window.addEventListener("click", markInteracted);
    return () => {
      window.removeEventListener("keydown", markInteracted);
      window.removeEventListener("click", markInteracted);
    };
  }, []);

  const generateNewObstacle = () => {
    if (!isMounted.current) return;
    const randomIndex = Math.floor(Math.random() * obstacles.length);
    setCurrentObstacle(obstacles[randomIndex]);
    setObstacleKey(prev => prev + 1);
  };

  useEffect(() => {
    generateNewObstacle();
  }, []);

  const handleAnimationEnd = () => {
    if (!gameOver && isMounted.current) {
      generateNewObstacle();
    }
  };

  useEffect(() => {
    let timer;
    if (!gameOver && isMounted.current) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (time > bestTime && isMounted.current) {
      setBestTime(time);
      localStorage.setItem("bestTime", time);
    }
  }, [time, bestTime]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space" && !gameOver) {
        handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver]);

  useEffect(() => {
    let collisionCheck;
    if (!gameOver && isMounted.current) {
      collisionCheck = setInterval(() => {
        const wizard = wizardRef.current;
        const obstacle = obstacleRef.current;

        if (wizard && obstacle) {
          const wizardRect = wizard.getBoundingClientRect();
          const obstacleRect = obstacleRef.current.getBoundingClientRect();

          if (
            wizardRect.bottom - 10 > obstacleRect.top &&
            wizardRect.top + 10 < obstacleRect.bottom &&
            wizardRect.right - 20 > obstacleRect.left &&
            wizardRect.left + 20 < obstacleRect.right
          ) {
            if (isMounted.current) {
              setGameOver(true);
            }
          }
        }
      }, 10);
    }
    return () => clearInterval(collisionCheck);
  }, [gameOver]);

  const handleJump = () => {
    if (!jumping && !gameOver && isMounted.current) {
      jumpSoundEffect.current.currentTime = 0;
      jumpSoundEffect.current.play().catch((err) => console.warn('Error playing sound:', err));
      setJumping(true);
      setTimeout(() => {
        if (isMounted.current) {
          setJumping(false);
        }
      }, 600);
    }
  };

  const restartGame = () => {
    if (!isMounted.current) return;
    window.location.reload();
  };

  useEffect(() => {
    if (gameOver && hasInteracted && isMounted.current) {
      failSoundEffect.current.currentTime = 0;
      failSoundEffect.current.play().catch((err) => console.warn('Error playing sound:', err));
    }
  }, [gameOver, hasInteracted]);

  return (
    <div className="game-container" onClick={handleJump}>
      <div className={`background-loop ${gameOver ? "background-paused" : ""}`}>
        <div></div>
        <div></div>
      </div>

      {gameOver && (
        <div className="runoverlay">
          <div className="game-over">
            {t('gameOver')} 🪄
            <div className="time-display">{t('time')}: {time} {t('seconds')}</div>
            <div className="best-time-display">{t('bestTime')}: {bestTime} {t('seconds')}</div>
            <button className="restart-button" onClick={restartGame}>
              {t('restart')}
            </button>
          </div>
        </div>
      )}

      <div
        className={`wizard ${jumping ? "jump" : ""}`}
        ref={wizardRef}
        style={{ backgroundImage: `url(${wizardImg})` }}
      ></div>

      {!gameOver && showObstacle && (
        <div
          key={obstacleKey}
          className="obstacle"
          ref={obstacleRef}
          style={{ backgroundImage: `url(${currentObstacle})` }}
          onAnimationEnd={handleAnimationEnd}
        ></div>
      )}
    </div>
  );
}