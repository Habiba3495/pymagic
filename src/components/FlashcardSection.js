import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar"; // تأكدي إن الاسم والمسار صح
import "./FlashcardSection.css";
import cardBack from "./images/Flashcard_black.svg";
import cardFront from "./images/Flashcard_color.svg";
import apiClient from "../services";
import { useAuth } from "../context/AuthContext";
import trackEvent from "../utils/trackEvent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading.js";

const FlashCardSection = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [flashcardData, setFlashcardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDeniedFlashcards, setAccessDeniedFlashcards] = useState(new Set());
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [sectionId, setSectionId] = useState(
    user?.lastSectionId && user.lastSectionId > 0 ? user.lastSectionId : 1
  );
  const [sectionCount, setSectionCount] = useState(1);
  const [nextSectionName, setNextSectionName] = useState("");
  const [prevSectionName, setPrevSectionName] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const lastSectionId = useRef(null);

  useEffect(() => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/sections/${sectionId}/flashcards`);
        if (response.status !== 200) throw new Error(t("flashcard.fetchError"));

        const data = response.data;
        setFlashcardData({
          id: data.sectionId,
          name: data.sectionName,
          units: data.units.map((unit) => ({
            unitId: unit.unitId,
            unitName: unit.unitName,
            flashcards: unit.lessons.map((lesson) => ({
              lessonId: lesson.lessonId,
              lessonName: lesson.lessonName,
              lessonNumber: lesson.lessonNumber,
              flashCard: lesson.flashCard,
              isPassed: lesson.isPassed,
            })),
          })),
        });
        setSectionCount(data.sectionCount || 1);
        setPrevSectionName(data.prevSectionName || "");
        setNextSectionName(data.nextSectionName || "");

        // فحص لو الـ event اتبعت قبل كده في الـ session
        const eventKey = `flashcards_loaded-${user.id}-${sectionId}`;
        const trackedEvents = JSON.parse(sessionStorage.getItem('trackedEvents') || '{}');

        if (
          lastSectionId.current !== sectionId &&
          data.units?.length > 0 &&
          !trackedEvents[eventKey]
        ) {
          console.log('Sending flashcards_loaded event for sectionId:', sectionId);
          await trackEvent(user.id, "flashcards_loaded", {
            category: "Flashcards",
            label: "Flashcards Data Loaded",
            section_id: sectionId,
            unit_count: data.units.length,
            flashcard_count: data.units.reduce(
              (sum, unit) => sum + (unit.lessons?.length || 0),
              0
            ),
          }, user).catch((error) => {
            console.error('Failed to track flashcards_loaded:', error);
          });

          // تحديث sessionStorage
          trackedEvents[eventKey] = true;
          sessionStorage.setItem('trackedEvents', JSON.stringify(trackedEvents));
          lastSectionId.current = sectionId;
        }
      } catch (error) {
        setError(error.message || t("flashcard.fetchError"));
        console.log('Sending flashcards_error event');
        await trackEvent(user.id, "flashcards_error", {
          category: "Error",
          label: "Flashcards Data Error",
          error: error.message,
        }, user).catch((error) => {
          console.error('Failed to track flashcards_error:', error);
        });
        setFlashcardData(null);
        setSectionCount(1);
        setPrevSectionName("");
        setNextSectionName("");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id, sectionId, navigate, t]);

  // const handleFlashcardClick = async (unitId, flashcard) => {
  //   if (!user || !user.id) {
  //     console.log('No user, redirecting to login');
  //     navigate('/login');
  //     return;
  //   }

  //   console.log('Sending flashcard_clicked event');
  //   await trackEvent(user.id, "flashcard_clicked", {
  //     category: "Flashcards",
  //     label: "Flashcard Clicked",
  //     unit_id: unitId,
  //     lesson_id: flashcard.lessonId,
  //     lesson_number: flashcard.lessonNumber,
  //     is_passed: flashcard.isPassed,
  //   }, user).catch((error) => {
  //     console.error('Failed to track flashcard_clicked:', error);
  //   });

  //   try {
  //     const response = await apiClient.get(
  //       `/sections/flashcard-access/${user.id}/${flashcard.lessonId}`
  //     );
  //     const data = response.data;

  //     if (!data.accessGranted) {
  //       setAccessDeniedFlashcards((prev) => new Set(prev).add(flashcard.lessonId));
  //       setPopupMessage(data.message || t("flashcard.accessDenied"));
  //       setPopupVisible(true);
  //       console.log('Sending flashcard_access_denied event');
  //       await trackEvent(user.id, "flashcard_access_denied", {
  //         category: "Access",
  //         label: "Flashcard Access Denied",
  //         unit_id: unitId,
  //         lesson_id: flashcard.lessonId,
  //         reason: data.message,
  //       }, user).catch((error) => {
  //         console.error('Failed to track flashcard_access_denied:', error);
  //       });
  //       return;
  //     }

  //     setSelectedCard({ unitId, flashcard });
  //     setModalOpen(true);
  //     console.log('Sending flashcard_accessed event');
  //     await trackEvent(user.id, "flashcard_accessed", {
  //       category: "Flashcards",
  //       label: "Flashcard Viewed",
  //       unit_id: unitId,
  //       lesson_id: flashcard.lessonId,
  //       lesson_name: flashcard.lessonName,
  //     }, user).catch((error) => {
  //       console.error('Failed to track flashcard_accessed:', error);
  //     });
  //   } catch (error) {
  //     console.error("Error checking flashcard access:", error);
  //     setPopupMessage(error.message || t("flashcard.accessError"));
  //     setPopupVisible(true);
  //     console.log('Sending flashcard_access_error event');
  //     await trackEvent(user.id, "flashcard_access_error", {
  //       category: "Error",
  //       label: "Access Check Error",
  //       error: error.message,
  //     }, user).catch((error) => {
  //       console.error('Failed to track flashcard_access_error:', error);
  //     });
  //   }
  // };

  const handleFlashcardClick = async (unitId, flashcard) => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }
  
    console.log('Sending flashcard_clicked event');
    await trackEvent(user.id, "flashcard_clicked", {
      category: "Flashcards",
      label: "Flashcard Clicked",
      unit_id: unitId,
      lesson_id: flashcard.lessonId,
      lesson_number: flashcard.lessonNumber,
      is_passed: flashcard.isPassed,
    }, user).catch((error) => {
      console.error('Failed to track flashcard_clicked:', error);
    });
  
    try {
      const response = await apiClient.get(
        `/sections/flashcard-access/${user.id}/${flashcard.lessonId}`
      );
      const data = response.data;
  
      if (!data.accessGranted) {
        setAccessDeniedFlashcards((prev) => new Set(prev).add(flashcard.lessonId));
        // Use the translated accessError message
        setPopupMessage(t("flashcard.accessError"));
        setPopupVisible(true);
        console.log('Sending flashcard_access_denied event');
        await trackEvent(user.id, "flashcard_access_denied", {
          category: "Access",
          label: "Flashcard Access Denied",
          unit_id: unitId,
          lesson_id: flashcard.lessonId,
          reason: data.message,
        }, user).catch((error) => {
          console.error('Failed to track flashcard_access_denied:', error);
        });
        return;
      }
  
      setSelectedCard({ unitId, flashcard });
      setModalOpen(true);
      console.log('Sending flashcard_accessed event');
      await trackEvent(user.id, "flashcard_accessed", {
        category: "Flashcards",
        label: "Flashcard Viewed",
        unit_id: unitId,
        lesson_id: flashcard.lessonId,
        lesson_name: flashcard.lessonName,
      }, user).catch((error) => {
        console.error('Failed to track flashcard_accessed:', error);
      });
    } catch (error) {
      console.error("Error checking flashcard access:", error);
      // Check if the error is due to 403 status and use translated message
      if (error.response?.status === 200) {
        setAccessDeniedFlashcards((prev) => new Set(prev).add(flashcard.lessonId));
        setPopupMessage(t("flashcard.accessError"));
        setPopupVisible(true);
        console.log('Sending flashcard_access_denied event');
        await trackEvent(user.id, "flashcard_access_denied", {
          category: "Access",
          label: "Flashcard Access Denied",
          unit_id: unitId,
          lesson_id: flashcard.lessonId,
          reason: error.response?.data?.message || 'Access denied',
        }, user).catch((error) => {
          console.error('Failed to track flashcard_access_denied:', error);
        });
      } else {
        // Handle other errors
        setPopupMessage(error.response?.data?.message || t("flashcard.accessError"));
        setPopupVisible(true);
        console.log('Sending flashcard_access_error event');
        await trackEvent(user.id, "flashcard_access_error", {
          category: "Error",
          label: "Access Check Error",
          error: error.response?.data?.message || error.message,
        }, user).catch((error) => {
          console.error('Failed to track flashcard_access_error:', error);
        });
      }
    }
  };
  const handleModalClose = () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (selectedCard) {
      console.log('Sending flashcard_modal_closed event');
      trackEvent(user.id, "flashcard_modal_closed", {
        category: "Flashcards",
        label: "Flashcard Modal Closed",
        unit_id: selectedCard.unitId,
        lesson_id: selectedCard.flashcard.lessonId,
      }, user).catch((error) => {
        console.error('Failed to track flashcard_modal_closed:', error);
      });
    }
    setModalOpen(false);
    setSelectedCard(null);
  };

  const handlePopupClose = () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    setPopupVisible(false);
    setPopupMessage("");
    console.log('Sending popup_closed event');
    trackEvent(user.id, "popup_closed", {
      category: "UI",
      label: "Access Denied Popup Closed",
    }, user).catch((error) => {
      console.error('Failed to track popup_closed:', error);
    });
  };

  const handlePrevSection = () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (sectionId > 1) {
      setSectionId(sectionId - 1);
      setAccessDeniedFlashcards(new Set());
      console.log('Sending previous_section_clicked event');
      trackEvent(user.id, "previous_section_clicked", {
        category: "Navigation",
        label: "Previous Section",
        section_id: sectionId - 1,
      }, user).catch((error) => {
        console.error('Failed to track previous_section_clicked:', error);
      });
    }
  };

  const handleNextSection = () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (sectionId < sectionCount) {
      setSectionId(sectionId + 1);
      setAccessDeniedFlashcards(new Set());
      console.log('Sending next_section_clicked event');
      trackEvent(user.id, "next_section_clicked", {
        category: "Navigation",
        label: "Next Section",
        section_id: sectionId + 1,
      }, user).catch((error) => {
        console.error('Failed to track next_section_clicked:', error);
      });
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flashcard-page-container">
        <Sidebar />
        <div className="flashcard-content">
          <div className="error-message">{t("error")}: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-page-container">
      <Sidebar />
      <div className="flashcard-content">
        {flashcardData?.units?.length > 0 ? (
          flashcardData.units.map((unit) => (
            <div key={unit.unitId} className="unit-container">
              <h2 className="unit-title">{unit.unitName}</h2>
              <div className="flashcards-container">
                {unit.flashcards.map((flashcard) => (
                  <div
                    key={flashcard.lessonId}
                    className={`flashcard-wrapper ${
                      accessDeniedFlashcards.has(flashcard.lessonId) ? "denied" : ""
                    }`}
                  >
                    <img
                      src={flashcard.isPassed ? cardFront : cardBack}
                      alt="Flash Card"
                      className={`flashcard ${flashcard.isPassed ? "passed" : ""}`}
                      onClick={() => handleFlashcardClick(unit.unitId, flashcard)}
                    />
                    <span className="lesson-number">{flashcard.lessonNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-flashcards">{t("flashcard.noFlashcardsAvailable")}</div>
        )}

        <div className="section-navigation">
          {prevSectionName && (
            <button
              onClick={handlePrevSection}
              className="nav-button prev-button"
            >
              {t("flashcard.previous")}: {prevSectionName}
            </button>
          )}
          {nextSectionName && (
            <button
              onClick={handleNextSection}
              className="nav-button next-button"
            >
              {t("flashcard.next")}: {nextSectionName}
            </button>
          )}
        </div>

        {popupVisible && (
          <div className="popup-overlay">
            <div className="popup-window">
              <button className="popup-close-button" onClick={handlePopupClose}>
                ✖
              </button>
              <p className="popup-text">{popupMessage}</p>
            </div>
          </div>
        )}

        {modalOpen && selectedCard && (
          <div className="modal-overlay">
            <div className="modal-window">
              <button className="modal-close-button" onClick={handleModalClose}>
                ✖
              </button>
              <div className="modal-flashcard-wrapper">
                <span className="modal-lesson-number">{selectedCard.flashcard.lessonNumber}</span>
                <img
                  src={selectedCard.flashcard.isPassed ? cardFront : cardBack}
                  alt="Flash Card"
                  className="modal-flashcard"
                />
              </div>
              <h2 className="modal-title">{selectedCard.flashcard.lessonName}</h2>
              <div
                className="modal-text"
                dangerouslySetInnerHTML={{ __html: selectedCard.flashcard.flashCard }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashCardSection;