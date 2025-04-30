import React, { useState, useEffect } from "react";
import Lsidebar from "./Sidebar";
import "./FlashcardSection.css";
import cardBack from "./images/Flashcard_black.svg";
import cardFront from "./images/Flashcard_color.svg";
import apiClient from "../services";
import { useAuth } from "../context/AuthContext";
import trackEvent from "../utils/trackEvent";
import PyMagicRunner from "./Pymagic_runnergame";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading.js"; 

const FlashCardSection = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    trackEvent(user.id, "pageview", {
      page: "/flashcards",
      category: "Navigation",
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/sections/${sectionId}/flashcards`);
        if (response.status !== 200) throw new Error("Failed to fetch flashcard data");

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

        trackEvent(user.id, "flashcards_loaded", {
          category: "Flashcards",
          label: "Flashcards Data Loaded",
          section_count: data.sectionCount || 1,
          unit_count: data.units.length,
          flashcard_count: data.units.reduce(
            (sum, unit) => sum + unit.lessons.length,
            0
          ),
        });
      } catch (error) {
        setError(error.message);
        trackEvent(user.id, "flashcards_error", {
          category: "Error",
          label: "Flashcards Data Error",
          error: error.message,
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
  }, [user, sectionId, navigate]);

  const handleFlashcardClick = async (unitId, flashcard) => {
    trackEvent(user.id, "flashcard_clicked", {
      category: "Flashcards",
      label: "Flashcard Clicked",
      unit_id: unitId,
      lesson_id: flashcard.lessonId,
      lesson_number: flashcard.lessonNumber,
      is_passed: flashcard.isPassed,
    });

    try {
      const response = await apiClient.get(
        `/sections/flashcard-access/${user.id}/${flashcard.lessonId}`
      );
      const data = response.data;

      if (!data.accessGranted) {
        setAccessDeniedFlashcards((prev) => new Set(prev).add(flashcard.lessonId));
        setPopupMessage(data.message);
        setPopupVisible(true);
        trackEvent(user.id, "flashcard_access_denied", {
          category: "Access",
          label: "Flashcard Access Denied",
          unit_id: unitId,
          lesson_id: flashcard.lessonId,
          reason: data.message,
        });
        return;
      }

      setSelectedCard({ unitId, flashcard });
      setModalOpen(true);
      trackEvent(user.id, "flashcard_accessed", {
        category: "Flashcards",
        label: "Flashcard Viewed",
        unit_id: unitId,
        lesson_id: flashcard.lessonId,
        lesson_name: flashcard.lessonName,
      });
    } catch (error) {
      console.error("Error checking flashcard access:", error);
      setPopupMessage(t("flashcard.accessError"));
      setPopupVisible(true);
      trackEvent(user.id, "flashcard_access_error", {
        category: "Error",
        label: "Access Check Error",
        error: error.message,
      });
    }
  };

  const handleModalClose = () => {
    if (selectedCard) {
      trackEvent(user.id, "flashcard_modal_closed", {
        category: "Flashcards",
        label: "Flashcard Modal Closed",
        unit_id: selectedCard.unitId,
        lesson_id: selectedCard.flashcard.lessonId,
      });
    }
    setModalOpen(false);
    setSelectedCard(null);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    setPopupMessage("");
    trackEvent(user.id, "popup_closed", {
      category: "UI",
      label: "Access Denied Popup Closed",
    });
  };

  const handlePrevSection = () => {
    if (sectionId > 1) {
      setSectionId(sectionId - 1);
      setAccessDeniedFlashcards(new Set()); // Reset access restrictions
      trackEvent(user.id, "previous_section_clicked", {
        category: "Navigation",
        label: "Previous Section",
        section_id: sectionId - 1,
      });
    }
  };

  const handleNextSection = () => {
    if (sectionId < sectionCount) {
      setSectionId(sectionId + 1);
      setAccessDeniedFlashcards(new Set()); // Reset access restrictions
      trackEvent(user.id, "next_section_clicked", {
        category: "Navigation",
        label: "Next Section",
        section_id: sectionId + 1,
      });
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flashcard-page-container">
        <Lsidebar />
        <div className="flashcard-content">
          <div className="error-message">{t("error")}: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-page-container">
      <Lsidebar />
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