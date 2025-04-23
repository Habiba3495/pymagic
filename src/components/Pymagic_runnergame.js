// import { useEffect, useRef, useState } from "react";
// import './Pymagic_runnergame.css';
// import wizardImg from "./images/Pax.svg";
// import fireballImg from "./images/Fire.svg";
// import Plant from "./images/Plant.svg";
// import poison from "./images/poison.svg";
// import jumpSound from '../Sound/Cartoon-jump-sound-effect.mp3';
// import failSound from '../Sound/Trumpet-fail-sound.mp3';

// export default function PyMagicRunner() {
//   const [jumping, setJumping] = useState(false);
//   const [gameOver, setGameOver] = useState(false);
//   const wizardRef = useRef(null);
//   const obstacleRef = useRef(null);
//   const [time, setTime] = useState(0);
//   const [bestTime, setBestTime] = useState(() => {
//   const saved = localStorage.getItem("bestTime");

//   return saved ? parseInt(saved) : 0;
// });

// const jumpSoundEffect = useRef(new Audio(jumpSound));
// const failSoundEffect = useRef(new Audio(failSound));


// useEffect(() => {
//   let timer;
//   if (!gameOver) {
//     timer = setInterval(() => {
//       setTime((prev) => prev + 1);
//     }, 1000);
//   }
//   return () => clearInterval(timer);
// }, [gameOver]);
  
// useEffect(() => {
//   if (time > bestTime) {
//     setBestTime(time);
//     localStorage.setItem("bestTime", time);
//   }
// }, [time, bestTime]); 

// useEffect(() => {
//   const handleKeyPress = (e) => {
//     if (e.code === "Space") {
//       handleJump();
//     }
//   };
//   window.addEventListener("keydown", handleKeyPress);
//   return () => window.removeEventListener("keydown", handleKeyPress);
// }, [jumping]);

//   useEffect(() => {
//     let collisionCheck;
//     if (!gameOver) {
//       collisionCheck = setInterval(() => {
//         const wizard = wizardRef.current;
//         const obstacle = obstacleRef.current;

//         if (wizard && obstacle) {
//           const wizardRect = wizard.getBoundingClientRect();
//           const obstacleRect = obstacle.getBoundingClientRect();
          
//           if (
//             wizardRect.bottom - 10 > obstacleRect.top &&
//             wizardRect.top + 10 < obstacleRect.bottom &&
//             wizardRect.right - 20 > obstacleRect.left &&
//             wizardRect.left + 20 < obstacleRect.right
//           ) {
//             setGameOver(true);
//           }

//         }
//       }, 10);
//     }
//     return () => clearInterval(collisionCheck);
//   }, [gameOver]);

//   const handleJump = () => {
//     if (!jumping) {
//       jumpSoundEffect.current.currentTime = 0; // إعادة التشغيل من البداية
//       jumpSoundEffect.current.play();
  
//       setJumping(true);
//       setTimeout(() => setJumping(false), 600);
//     }
 
//   };
//   const restartGame = () => {
//     setGameOver(false);
//     setTime(0);
//     setJumping(false);
//     if (obstacleRef.current) {
//       obstacleRef.current.style.left = "100%"; // إعادة العائق إلى البداية
//     }
//   };

//   //gamrover sound
//   useEffect(() => {
//     if (gameOver) {
//       failSoundEffect.current.currentTime = 0;
//       failSoundEffect.current.play();
//     }
//   }, [gameOver]);
  

//   return (
// <div className="game-container" onClick={handleJump}>
//   {/* الخلفية المتحركة */}
//   {/* <div className="background-loop"></div> */}
//   <div className="background-loop">
//   <div></div>
//   <div></div>
// </div>

//   {/* باقي عناصر اللعبة */}
//   {gameOver && (
//     <div className="runoverlay">
//       <div className="game-over">
//         Game Over 🪄
//         <div className="time-display">Time: {time} seconds</div>
//         <div className="best-time-display">Best Time: {bestTime} seconds</div>
//         <button className="restart-button" onClick={restartGame}>Restart</button>
//       </div>
//     </div>
//   )}

//   <div className={`wizard ${jumping ? "jump" : ""}`} ref={wizardRef}
//     style={{ backgroundImage: `url(${wizardImg})` }}
//   ></div>

//   {!gameOver && (
//     <div className="obstacle" ref={obstacleRef}
//       style={{ backgroundImage: `url(${fireballImg})` }}
//     ></div>
//   )}
// </div>

//   );
// }

import { useEffect, useRef, useState } from "react";
import './Pymagic_runnergame.css';
import wizardImg from "./images/Pax.svg";
import fireballImg from "./images/Fire.svg";
import Plant from "./images/Plant.svg";
import poison from "./images/poison.svg";
import jumpSound from '../Sound/Cartoon-jump-sound-effect.mp3';
import failSound from '../Sound/Trumpet-fail-sound.mp3';

export default function PyMagicRunner() {
  const [jumping, setJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const wizardRef = useRef(null);
  const obstacleRef = useRef(null);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem("bestTime");
    return saved ? parseInt(saved) : 0;
  });
  const [currentObstacle, setCurrentObstacle] = useState(fireballImg);
  const [obstacleKey, setObstacleKey] = useState(0); // لتجنب مشاكل الـ animation
  const [showObstacle, setShowObstacle] = useState(true);


  const jumpSoundEffect = useRef(new Audio(jumpSound));
  const failSoundEffect = useRef(new Audio(failSound));

  const obstacles = [fireballImg, Plant, poison];

  const generateNewObstacle = () => {
    const randomIndex = Math.floor(Math.random() * obstacles.length);
    setCurrentObstacle(obstacles[randomIndex]);
    setObstacleKey(prev => prev + 1); // تغيير المفتاح لإعادة تشغيل الـ animation
  };

  useEffect(() => {
    generateNewObstacle();
  }, []);

  const handleAnimationEnd = () => {
    if (!gameOver) {
      generateNewObstacle();
    }
  };

  useEffect(() => {
    let timer;
    if (!gameOver) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameOver]);
  
  useEffect(() => {
    if (time > bestTime) {
      setBestTime(time);
      localStorage.setItem("bestTime", time);
    }
  }, [time, bestTime]);

  // useEffect(() => {
  //   const handleKeyPress = (e) => {
  //     if (e.code === "Space") {
  //       handleJump();
  //     }
  //   };
  //   window.addEventListener("keydown", handleKeyPress);
  //   return () => window.removeEventListener("keydown", handleKeyPress);
  // }, [jumping]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
  

  useEffect(() => {
    let collisionCheck;
    if (!gameOver) {
      collisionCheck = setInterval(() => {
        const wizard = wizardRef.current;
        const obstacle = obstacleRef.current;

        if (wizard && obstacle) {
          const wizardRect = wizard.getBoundingClientRect();
          const obstacleRect = obstacle.getBoundingClientRect();
          
          if (
            wizardRect.bottom - 10 > obstacleRect.top &&
            wizardRect.top + 10 < obstacleRect.bottom &&
            wizardRect.right - 20 > obstacleRect.left &&
            wizardRect.left + 20 < obstacleRect.right
          ) {
            setGameOver(true);
          }
        }
      }, 10);
    }
    return () => clearInterval(collisionCheck);
  }, [gameOver]);

  const handleJump = () => {
    if (!jumping && !gameOver) {
      jumpSoundEffect.current.currentTime = 0;
      jumpSoundEffect.current.play();
      setJumping(true);
      setTimeout(() => setJumping(false), 600);
    }
  };

  // const restartGame = () => {
  //   setGameOver(false);
  //   setTime(0);
  //   setJumping(false);
  //   generateNewObstacle();
  // };

  const restartGame = () => {
    setGameOver(false);
    setTime(0);
    setJumping(false);
    setShowObstacle(false); // أخفي العائق مؤقتًا
  
    setTimeout(() => {
      generateNewObstacle();
      setShowObstacle(true); // أظهر العائق من جديد
    }, 50); // ممكن تزيد التأخير لو لسه في delay، مثلاً 100ms
  };
  
  useEffect(() => {
    if (gameOver) {
      failSoundEffect.current.currentTime = 0;
      failSoundEffect.current.play();
    }
  }, [gameOver]);

  return (
    <div className="game-container" onClick={handleJump}>
      <div className="background-loop">
        <div></div>
        <div></div>
      </div>

      {gameOver && (
        <div className="runoverlay">
          <div className="game-over">
            Game Over 🪄
            <div className="time-display">Time: {time} seconds</div>
            <div className="best-time-display">Best Time: {bestTime} seconds</div>
            <button className="restart-button" onClick={restartGame}>Restart</button>
          </div>
        </div>
      )}

      <div className={`wizard ${jumping ? "jump" : ""}`} ref={wizardRef}
        style={{ backgroundImage: `url(${wizardImg})` }}
      ></div>
{/* 
      {!gameOver && (
        <div 
          key={obstacleKey} // مهم لإعادة تشغيل الـ animation
          className="obstacle" 
          ref={obstacleRef}
          style={{ 
            backgroundImage: `url(${currentObstacle})`,
          }}
          onAnimationEnd={handleAnimationEnd}
        ></div>
      )} */}

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