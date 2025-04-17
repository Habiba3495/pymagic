// import { useEffect, useRef, useState } from "react";
// import './Pymagic_runnergame.css';
// import wizardImg from "./images/Pax.svg";
// import fireballImg from "./images/Fire.svg";
// // import groundImg from "./images/error_bg.svg";
// import bgImg from "./images/error_bg.svg";

// export default function PyMagicRunner() {
//   const [jumping, setJumping] = useState(false);
//   const [gameOver, setGameOver] = useState(false);
//   const wizardRef = useRef(null);
//   const obstacleRef = useRef(null);

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
//             wizardRect.bottom > obstacleRect.top &&
//             wizardRect.top < obstacleRect.bottom &&
//             wizardRect.right > obstacleRect.left &&
//             wizardRect.left < obstacleRect.right
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
//       setJumping(true);
//       setTimeout(() => setJumping(false), 600);
//     }
//   };

//   return (
//     <div
//       className="game-container"
//       onClick={handleJump}
//       style={{ backgroundImage: `url(${bgImg})` }}
//     >
//       {gameOver && <div className="game-over">Game Over 🪄</div>}
//       <div
//         className={`wizard ${jumping ? "jump" : ""}`}
//         ref={wizardRef}
//         style={{ backgroundImage: `url(${wizardImg})` }}
//       ></div>
//       <div
//         className={`obstacle ${gameOver ? "stopped" : ""}`}
//         ref={obstacleRef}
//         style={{ backgroundImage: `url(${fireballImg})` }}
//       ></div>
//       {/* <div className="ground" style={{ backgroundImage: `url(${groundImg})` }}></div> */}
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import './Pymagic_runnergame.css';
import wizardImg from "./images/Pax.svg";
import bgImg from "./images/error_bg.svg";
import fireballImg from "./images/Fire.svg";

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

useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.code === "Space") {
      handleJump();
    }
  };
  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, [jumping]);

  useEffect(() => {
    let collisionCheck;
    if (!gameOver) {
      collisionCheck = setInterval(() => {
        const wizard = wizardRef.current;
        const obstacle = obstacleRef.current;

        if (wizard && obstacle) {
          const wizardRect = wizard.getBoundingClientRect();
          const obstacleRect = obstacle.getBoundingClientRect();

          // if (
          //   wizardRect.bottom > obstacleRect.top &&
          //   wizardRect.top < obstacleRect.bottom &&
          //   wizardRect.right > obstacleRect.left &&
          //   wizardRect.left < obstacleRect.right
          // ) {
          //   setGameOver(true);
          // }
          // if (
          //   wizardRect.bottom > obstacleRect.top &&
          //   wizardRect.top < obstacleRect.bottom &&
          //   wizardRect.right > obstacleRect.left &&
          //   wizardRect.left < obstacleRect.right
          // ) {
          //   setGameOver(true);
          //   if (time > bestTime) {
          //     setBestTime(time);
          //     localStorage.setItem("bestTime", time);
          //   }
          // }
          
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
    if (!jumping) {
      setJumping(true);
      setTimeout(() => setJumping(false), 600);
    }
  };
  const restartGame = () => {
    setGameOver(false);
    setTime(0);
    setJumping(false);
    if (obstacleRef.current) {
      obstacleRef.current.style.left = "100%"; // إعادة العائق إلى البداية
    }
  };

  return (
    <div className="game-container" onClick={handleJump}
    style={{
      backgroundImage: `url(${bgImg})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      {/* {gameOver && <div className="game-over">Game Over 🪄</div>} */}
      {/* {gameOver && (
      <div className="game-over">
      Game Over 🪄
      <div className="time-display">Time: {time} seconds</div>
     </div>
      )} */}

{gameOver && (
  <div className="runoverlay">
    <div className="game-over">
      Game Over 🪄
      <div className="time-display">Time: {time} seconds</div>
      <div className="best-time-display">Best Time: {bestTime} seconds</div>
      {/* <button className="restart-button" onClick={() => window.location.reload()}>
        Restart
      </button> */}
     <button className="restart-button" onClick={restartGame}>Restart</button>

    </div>
  </div>
)}


      <div
        className={`wizard ${jumping ? "jump" : ""}`}
        ref={wizardRef}
        style={{
          backgroundImage: `url(${wizardImg})`,
        }}
      ></div>
      {/* <div
        className={`obstacle ${gameOver ? "stopped" : ""}`}
        ref={obstacleRef}
        style={{
          backgroundImage: `url(${fireballImg})`,
        }}
      ></div> */}
      {!gameOver && (
      <div
      className="obstacle"
      ref={obstacleRef}
      style={{ backgroundImage: `url(${fireballImg})` }}
      ></div>
    )}

      {/* <div className="ground"></div> */}
    </div>
  );
}
