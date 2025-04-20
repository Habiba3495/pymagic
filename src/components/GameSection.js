// import React, { useState, useEffect, useRef, useCallback } from "react";
// import Lsidebar from "./Lsidebar";
// import "./GameSection.css";
// import { useTranslation } from "react-i18next";
// import { FaExpand, FaCompress } from "react-icons/fa";

// const GameSection = () => {
//   const { t } = useTranslation();
//   const [gameLoaded, setGameLoaded] = useState(false);
//   const [pyodide, setPyodide] = useState(null);
//   const [unityReady, setUnityReady] = useState(false);
//   const [bridgeReady, setBridgeReady] = useState(false);
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [loadingStatus, setLoadingStatus] = useState("");
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const canvasRef = useRef(null);
//   const gameContainerRef = useRef(null);
//   const pendingCodeRef = useRef(null);
//   const unityInstanceRef = useRef(null);
//   const isMountedRef = useRef(false);

//   // Handle code received from Unity game
//   const handleCodeFromGame = useCallback((code) => {
//     console.log("Received code from Unity:", code);
//     if (pyodide) {
//       handleRunCode(code);
//     } else {
//       pendingCodeRef.current = code;
//       console.log("Pyodide not ready, storing code for later execution");
//     }
//   }, [pyodide]);

//   // Load Pyodide for Python execution
//   useEffect(() => {
//     isMountedRef.current = true;
    
//     const loadPyodide = async () => {
//       try {
//         setLoadingStatus(t("loadingPyodide"));
//         console.log("Starting Pyodide load...");
        
//         if (!window.pyodide) {
//           window.pyodide = await window.loadPyodide({
//             indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
//           });
//           await window.pyodide.loadPackage("micropip");
//         }
        
//         if (isMountedRef.current) {
//           setPyodide(window.pyodide);
//           setLoadingStatus(t("pyodideLoaded"));
//           console.log("Pyodide fully initialized");
          
//           if (pendingCodeRef.current) {
//             console.log("Executing pending code:", pendingCodeRef.current);
//             handleRunCode(pendingCodeRef.current);
//             pendingCodeRef.current = null;
//           }
//         }
//       } catch (error) {
//         console.error("Pyodide loading failed:", error);
//         if (isMountedRef.current) {
//           setLoadingStatus(t("pyodideLoadError"));
//         }
//       }
//     };

//     if (!pyodide) {
//       loadPyodide();
//     }

//     return () => {
//       isMountedRef.current = false;
//     };
//   }, [t, pyodide]);

//   // Check for Unity bridge readiness
//   useEffect(() => {
//     const checkBridgeReady = () => {
//       if (window.unityBridgeLoaded) {
//         setBridgeReady(true);
//         console.log("Unity bridge is ready");
        
//         if (window.registerReactCallback) {
//           window.registerReactCallback(handleCodeFromGame);
//           console.log("React callback registered with Unity bridge");
//         } else {
//           console.error("registerReactCallback not found");
//         }
//       } else {
//         setTimeout(checkBridgeReady, 100);
//       }
//     };

//     if (gameLoaded) {
//       checkBridgeReady();
//     }
//   }, [gameLoaded, handleCodeFromGame]);

//   // Load Unity game
//   useEffect(() => {
//     const loadUnity = async () => {
//       if (!canvasRef.current || unityInstanceRef.current) return;

//       try {
//         setLoadingStatus(t("loadingUnity"));
//         setLoadingProgress(30);

//         // Check WebGL support
//         const canvas = document.createElement("canvas");
//         const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
//         if (!gl) {
//           throw new Error(t("webglNotSupported"));
//         }

//         // Load Unity loader
//         const script = document.createElement("script");
//         script.src = "/Build/Build.loader.js";
//         script.async = true;
        
//         script.onload = async () => {
//           setLoadingProgress(60);
//           console.log("Unity loader script loaded");
          
//           if (!window.createUnityInstance) {
//             throw new Error("createUnityInstance not found");
//           }

//           try {
//             const instance = await window.createUnityInstance(
//               canvasRef.current,
//               {
//                 dataUrl: "/Build/Build.data",
//                 frameworkUrl: "/Build/Build.framework.js",
//                 codeUrl: "/Build/Build.wasm",
//                 streamingAssetsUrl: "StreamingAssets",
//                 companyName: "YourCompany",
//                 productName: "PixelArtGame",
//                 productVersion: "1.0",
//               },
//               (progress) => {
//                 setLoadingProgress(60 + Math.round(progress * 40));
//               }
//             );

//             unityInstanceRef.current = instance;
//             window.unityInstance = instance;
            
//             if (window.unityBridge?.setUnityInstance) {
//               window.unityBridge.setUnityInstance(instance);
//             }

//             setUnityReady(true);
//             setLoadingProgress(100);
//             setLoadingStatus(t("unityReady"));
//             console.log("Unity instance fully loaded");
//           } catch (error) {
//             console.error("Unity instance creation failed:", error);
//             setLoadingStatus(t("unityLoadError"));
//           }
//         };

//         script.onerror = () => {
//           throw new Error("Failed to load Unity loader script");
//         };

//         document.body.appendChild(script);
//       } catch (error) {
//         console.error("Unity loading failed:", error);
//         setLoadingStatus(error.message);
//       }
//     };

//     if (gameLoaded && bridgeReady && !unityInstanceRef.current) {
//       loadUnity();
//     }

//     return () => {
//       if (unityInstanceRef.current) {
//         try {
//           unityInstanceRef.current.Quit().then(() => {
//             console.log("Unity instance successfully quit");
//             unityInstanceRef.current = null;
//             window.unityInstance = null;
//           });
//         } catch (error) {
//           console.error("Error quitting Unity instance:", error);
//         }
//       }
//     };
//   }, [gameLoaded, bridgeReady, t]);

//   // Handle running Python code
//   const handleRunCode = async (code) => {
//     if (!pyodide) {
//       console.warn("Pyodide not ready - code not executed");
//       return;
//     }

//     console.log("Executing Python code:", code);
//     setLoadingStatus(t("executingCode"));

//     try {
//       await pyodide.runPythonAsync(`
//         import sys
//         import io
//         sys.stdout = io.StringIO()
//       `);

//       await pyodide.runPythonAsync(code);
      
//       const output = pyodide.runPython("sys.stdout.getvalue()").trim();
      
//       await pyodide.runPythonAsync("sys.stdout = sys.__stdout__");

//       console.log("Python execution result:", output);
//       sendResultToUnity(output || t("noOutput"));
//       setLoadingStatus("");
//     } catch (error) {
//       console.error("Python execution error:", error);
//       sendResultToUnity(`${t("error")}: ${error.message}`);
//       setLoadingStatus(t("executionError"));
//     }
//   };

//   // Send result back to Unity
//   const sendResultToUnity = useCallback((result) => {
//     if (!unityInstanceRef.current) {
//       console.warn("Unity instance not ready - result not sent");
//       return;
//     }

//     try {
//       console.log("Sending to Unity:", result);
//       unityInstanceRef.current.SendMessage(
//         "PythonPuzzleManager", 
//         "ReceivePythonOutput", 
//         result.toString()
//       );
//     } catch (error) {
//       console.error("Failed to send result to Unity:", error);
//     }
//   }, []);

//   // Toggle fullscreen mode
//   const toggleFullScreen = useCallback(() => {
//     if (!gameContainerRef.current) return;

//     if (!isFullScreen) {
//       if (gameContainerRef.current.requestFullscreen) {
//         gameContainerRef.current.requestFullscreen();
//       } else if (gameContainerRef.current.webkitRequestFullscreen) {
//         gameContainerRef.current.webkitRequestFullscreen();
//       } else if (gameContainerRef.current.msRequestFullscreen) {
//         gameContainerRef.current.msRequestFullscreen();
//       }
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       } else if (document.webkitExitFullscreen) {
//         document.webkitExitFullscreen();
//       } else if (document.msExitFullscreen) {
//         document.msExitFullscreen();
//       }
//     }
//   }, [isFullScreen]);

//   // Listen for fullscreen changes
//   useEffect(() => {
//     const handleFullScreenChange = () => {
//       setIsFullScreen(!!document.fullscreenElement);
//     };

//     document.addEventListener('fullscreenchange', handleFullScreenChange);
//     document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
//     document.addEventListener('msfullscreenchange', handleFullScreenChange);

//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullScreenChange);
//       document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
//       document.removeEventListener('msfullscreenchange', handleFullScreenChange);
//     };
//   }, []);

//   const startGame = () => {
//     if (unityInstanceRef.current) {
//       unityInstanceRef.current.Quit().then(() => {
//         unityInstanceRef.current = null;
//         window.unityInstance = null;
//         setGameLoaded(true);
//       });
//     } else {
//       setGameLoaded(true);
//     }
//     setLoadingStatus(t("preparingGame"));
//     console.log("Game initialization started");
//   };

//   return (
//     <div className="Gpagecontainer">
//       <Lsidebar />
//       <div className="game-background">
//         <div className="game-door">
//           {!gameLoaded ? (
//             <button className="start-game-btn" onClick={startGame}>
//               {t("gamebutton") || "Start Game"}
//             </button>
//           ) : (
//             <div className="unity-game-container" ref={gameContainerRef}>
//               {(!unityReady || loadingStatus) && (
//                 <div className="unity-loading-overlay">
//                   <div className="loading-progress-bar">
//                     <div
//                       className="progress-fill"
//                       style={{ width: `${loadingProgress}%` }}
//                     ></div>
//                   </div>
//                   <div className="loading-status">
//                     {loadingStatus || t("loading")}
//                   </div>
//                 </div>
//               )}
//               {unityReady && (
//                 <button 
//                   className="fullscreen-btn"
//                   onClick={toggleFullScreen}
//                   title={isFullScreen ? t("exitFullscreen") : t("enterFullscreen")}
//                 >
//                   {isFullScreen ? <FaCompress /> : <FaExpand />}
//                 </button>
//               )}
//               <canvas
//                 id="unity-canvas"
//                 ref={canvasRef}
//                 style={{
//                   width: "960px",
//                   height: "600px",
//                   background: "#000",
//                   display: unityReady ? "block" : "none",
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GameSection;

import React, { useState } from "react";
import Lsidebar from "./Sidebar";
import "./GameSection.css";
import { useTranslation } from "react-i18next";
import GamePage from "./GamePage"; // استيراد مكون الصفحة الجديدة

const GameSection = () => {
  const { t } = useTranslation();
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="Gpagecontainer">
      <Lsidebar />
      <div className="game-background">
        <div className="game-door">
          {!gameStarted ? (
            <button className="start-game-btn" onClick={startGame}>
              {t("gamebutton")}
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