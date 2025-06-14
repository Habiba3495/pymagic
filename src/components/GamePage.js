import React, { useState, useEffect, useRef, useCallback } from "react";
import "./GamePage.css";
import { useTranslation } from "react-i18next";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import { useNavigate } from "react-router-dom";
import trackEvent from '../utils/trackEvent';

const GamePage = ({ onExit }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pyodide, setPyodide] = useState(null);
  const [unityReady, setUnityReady] = useState(false);
  const [bridgeReady, setBridgeReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const canvasRef = useRef(null);
  const gameContainerRef = useRef(null);
  const pendingCodeRef = useRef(null);
  const unityInstanceRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!user || !user.id) {
      console.error("User not authenticated, redirecting to login...");
      alert(t("game.notAuthenticated"));
      navigate("/login");
      return;
    }
  }, [user, navigate, t]);

  const handleCodeFromGame = useCallback(
    (code) => {
      console.log("Received code from Unity:", code);
      if (pyodide) {
        handleRunCode(code);
      } else {
        pendingCodeRef.current = code;
        console.log("Pyodide not ready, storing code for later execution");
      }
    },
    [pyodide]
  );

  const handlePointsFromGame = useCallback(
    async (points) => {
      console.log("Received points from Unity:", points);
      const pointsInt = parseInt(points, 10);
      if (isNaN(pointsInt)) {
        console.error("Invalid points value received from Unity:", points);
        alert(t("game.invalidPoints"));
        return;
      }
      if (user && user.id) {
        try {
          await apiClient.post("/api/users/update-points", {
            userId: user.id,
            points: pointsInt,
          });
          console.log("Points sent to backend successfully");
          trackEvent(user.id, 'points_updated', {
            category: 'Game',
            label: 'Points Updated Successfully',
            value: pointsInt,
          }, user).catch((error) => {
            console.error('Failed to track points_updated:', error);
          });
        } catch (error) {
          console.error("Error sending points to backend:", error);
          alert(
            t("game.pointsUpdateFailed") +
            (error.response?.data?.error || error.message)
          );
          trackEvent(user.id, 'points_update_error', {
            category: 'Error',
            label: 'Points Update Failed',
            error: error.message,
          }, user).catch((error) => {
            console.error('Failed to track points_update_error:', error);
          });
        }
      }
    },
    [user, t]
  );

  useEffect(() => {
    isMountedRef.current = true;

    const loadPyodide = async () => {
      try {
        console.log("Starting Pyodide load...");
        if (!window.pyodide) {
          window.pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
          });
          await window.pyodide.loadPackage("micropip");
        }

        if (isMountedRef.current) {
          setPyodide(window.pyodide);
          console.log("Pyodide fully initialized");
          if (user?.id) {
            trackEvent(user.id, 'pyodide_loaded', {
              category: 'Game',
              label: 'Pyodide Loaded Successfully',
            }, user).catch((error) => {
              console.error('Failed to track pyodide_loaded:', error);
            });
          }

          if (pendingCodeRef.current) {
            console.log("Executing pending code:", pendingCodeRef.current);
            handleRunCode(pendingCodeRef.current);
            pendingCodeRef.current = null;
          }
        }
      } catch (error) {
        console.error("Pyodide loading failed:", error);
        if (isMountedRef.current) {
          setError(t("game.pyodideLoadError"));
          if (user?.id) {
            trackEvent(user.id, 'pyodide_load_error', {
              category: 'Error',
              label: 'Pyodide Load Failed',
              error: error.message,
            }, user).catch((error) => {
              console.error('Failed to track pyodide_load_error:', error);
            });
          }
        }
      }
    };

    if (!pyodide && !error) {
      loadPyodide();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [pyodide, t, user, error]);

  useEffect(() => {
    let timeout;
    const checkBridgeReady = () => {
      if (window.unityBridgeLoaded) {
        setBridgeReady(true);
        console.log("Unity bridge is ready");
        if (user?.id) {
          trackEvent(user.id, 'unity_bridge_ready', {
            category: 'Game',
            label: 'Unity Bridge Ready',
          }, user).catch((error) => {
            console.error('Failed to track unity_bridge_ready:', error);
          });
        }

        if (window.registerReactCallback) {
          window.registerReactCallback(handleCodeFromGame);
          console.log("React callback registered with Unity bridge");
        } else {
          console.error("registerReactCallback not found");
        }

        if (window.registerPointsCallback) {
          window.registerPointsCallback(handlePointsFromGame);
          console.log("Points callback registered with Unity bridge");
        } else {
          console.error("registerPointsCallback not found");
        }
      } else {
        timeout = setTimeout(checkBridgeReady, 100);
      }
    };

    checkBridgeReady();

    const failTimeout = setTimeout(() => {
      if (!window.unityBridgeLoaded) {
        console.error("Unity bridge failed to load after 10 seconds.");
        setError(t("game.unityBridgeLoadError"));
        if (user?.id) {
          trackEvent(user.id, 'unity_bridge_load_error', {
            category: 'Error',
            label: 'Unity Bridge Load Failed',
          }, user).catch((error) => {
            console.error('Failed to track unity_bridge_load_error:', error);
          });
        }
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(failTimeout);
    };
  }, [handleCodeFromGame, handlePointsFromGame, t, user]);

  useEffect(() => {
    const loadUnity = async () => {
      if (!canvasRef.current || unityInstanceRef.current) return;

      try {
        setLoadingProgress(30);

        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        if (!gl) {
          throw new Error(t("game.webglNotSupported"));
        }

        const script = document.createElement("script");
        script.src = "/Build/Build.loader.js";
        script.async = true;

        script.onload = async () => {
          setLoadingProgress(60);
          console.log("Unity loader script loaded");

          if (!window.createUnityInstance) {
            throw new Error("createUnityInstance not found");
          }

          try {
            const instance = await window.createUnityInstance(
              canvasRef.current,
              {
                dataUrl: "/Build/Build.data",
                frameworkUrl: "/Build/Build.framework.js",
                codeUrl: "/Build/Build.wasm",
                streamingAssetsUrl: "StreamingAssets",
                companyName: "YourCompany",
                productName: "PixelArtGame",
                productVersion: "1.0",
              },
              (progress) => {
                setLoadingProgress(60 + Math.round(progress * 40));
              }
            );

            unityInstanceRef.current = instance;
            window.unityInstance = instance;

            if (window.unityBridge?.setUnityInstance) {
              window.unityBridge.setUnityInstance(instance);
            }

            setUnityReady(true);
            setLoadingProgress(100);
            console.log("Unity instance fully loaded");
            if (user?.id) {
              trackEvent(user.id, 'game_loaded', {
                category: 'Game',
                label: 'Unity Game Loaded Successfully',
              }, user).catch((error) => {
                console.error('Failed to track game_loaded:', error);
              });
            }
          } catch (error) {
            console.error("Unity instance creation failed:", error);
            throw error;
          }
        };

        script.onerror = () => {
          throw new Error("Failed to load Unity loader script");
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error("Unity loading failed:", error);
        setError(t("game.unityLoadError"));
        if (user?.id) {
          trackEvent(user.id, 'unity_load_error', {
            category: 'Error',
            label: 'Unity Load Failed',
            error: error.message,
          }, user).catch((error) => {
            console.error('Failed to track unity_load_error:', error);
          });
        }
      }
    };

    if (bridgeReady && !unityInstanceRef.current && !error) {
      loadUnity();
    }

    return () => {
      if (unityInstanceRef.current) {
        try {
          unityInstanceRef.current.Quit().then(() => {
            console.log("Unity instance successfully quit");
            unityInstanceRef.current = null;
            window.unityInstance = null;
          });
        } catch (error) {
          console.error("Error quitting Unity instance:", error);
        }
      }
    };
  }, [bridgeReady, t, user, error]);

  const handleRunCode = async (code) => {
    if (!pyodide) {
      console.warn("Pyodide not ready - code not executed");
      return;
    }

    console.log("Executing | Python code:", code);

    try {
      await pyodide.runPythonAsync(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);

      await pyodide.runPythonAsync(code);

      const output = pyodide.runPython("sys.stdout.getvalue()").trim();

      await pyodide.runPythonAsync("sys.stdout = sys.__stdout__");

      console.log("Python execution result:", output);
      sendResultToUnity(output || t("game.noOutput"));
    } catch (error) {
      console.error("Python execution error:", error);
      sendResultToUnity(`${t("error")}: ${error.message}`);
      if (user?.id) {
        trackEvent(user.id, 'code_execution_error', {
          category: 'Error',
          label: 'Python Code Execution Failed',
          error: error.message,
        }, user).catch((error) => {
          console.error('Failed to track code_execution_error:', error);
        });
      }
    }
  };

  const sendResultToUnity = useCallback(
    (result) => {
      if (!unityInstanceRef.current) {
        console.warn("Unity instance not ready - result not sent");
        return;
      }

      try {
        console.log("Sending to Unity:", result);
        unityInstanceRef.current.SendMessage(
          "PythonPuzzleManager",
          "ReceivePythonOutput",
          result.toString()
        );
      } catch (error) {
        console.error("Failed to send result to Unity:", error);
        if (user?.id) {
          trackEvent(user.id, 'send_to_unity_error', {
            category: 'Error',
            label: 'Send Result to Unity Failed',
            error: error.message,
          }, user).catch((error) => {
            console.error('Failed to track send_to_unity_error:', error);
          });
        }
      }
    },
    [user]
  );

  const toggleFullScreen = useCallback(() => {
    if (!gameContainerRef.current) return;

    if (!isFullScreen) {
      if (gameContainerRef.current.requestFullscreen) {
        gameContainerRef.current.requestFullscreen();
      } else if (gameContainerRef.current.webkitRequestFullscreen) {
        gameContainerRef.current.webkitRequestFullscreen();
      } else if (gameContainerRef.current.msRequestFullscreen) {
        gameContainerRef.current.msRequestFullscreen();
      }
      if (user?.id) {
        trackEvent(user.id, 'fullscreen_enabled', {
          category: 'Game',
          label: 'Fullscreen Enabled',
        }, user).catch((error) => {
          console.error('Failed to track fullscreen_enabled:', error);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      if (user?.id) {
        trackEvent(user.id, 'fullscreen_disabled', {
          category: 'Game',
          label: 'Fullscreen Disabled',
        }, user).catch((error) => {
          console.error('Failed to track fullscreen_disabled:', error);
        });
      }
    }
  }, [isFullScreen, user]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("msfullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("msfullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Ensure canvas takes full container size
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="unity-game-container" ref={gameContainerRef}>
      <button className="exit-game-btn" onClick={() => {
        if (user?.id) {
          trackEvent(user.id, 'exit_game_clicked', {
            category: 'Game',
            label: 'Exit Game Button Clicked',
          }, user).catch((error) => {
            console.error('Failed to track exit_game_clicked:', error);
          });
        }
        onExit();
      }}>
        {t("game.exitGame") || "Exit Game"}
      </button>

      {!unityReady && (
        <div className="unity-loading-overlay">
          <div className="loading-progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <canvas id="unity-canvas" ref={canvasRef} />
    </div>
  );
};

export default GamePage;