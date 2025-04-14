// import { useEffect, useRef, useState } from "react";
// import './App.css';
// import wizardImg from './assets/wizard.gif';
// import fireballImg from './assets/fireball.gif';
// import groundImg from './assets/magic-ground.png';
// import bgImg from './assets/magic-bg.jpg';

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
//       <div className="ground" style={{ backgroundImage: `url(${groundImg})` }}></div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import './Pymagic_runnergame.css';

export default function PyMagicRunner() {

    const [jumping, setJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const wizardRef = useRef(null);
  const obstacleRef = useRef(null);

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
            wizardRect.bottom > obstacleRect.top &&
            wizardRect.top < obstacleRect.bottom &&
            wizardRect.right > obstacleRect.left &&
            wizardRect.left < obstacleRect.right
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

  return (
    <div className="game-container" onClick={handleJump}>
      {gameOver && <div className="game-over">Game Over 🪄</div>}
      <div
        className={`wizard ${jumping ? "jump" : ""}`}
        ref={wizardRef}
      ></div>
      <div
        className={`obstacle ${gameOver ? "stopped" : ""}`}
        ref={obstacleRef}
      ></div>
      <div className="ground"></div>
    </div>
  );
}
