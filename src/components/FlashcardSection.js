import React, { useState, useEffect } from "react";
import Lsidebar from "./Lsidebar";
import "./FlashcardSection.css";
import cardBack from "./images/Flashcard_black.svg";
import cardFront from "./images/Flashcard_color.svg";
import apiClient from "../services";
import { useAuth } from "../context/AuthContext";
import trackEvent from '../utils/trackEvent';

const FlashCardSection = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sectionId, setSectionId] = useState(user?.lastSectionId || 1);
  const [sectionCount, setSectionCount] = useState(1);
  

  useEffect(() => {
    // Track page view
    if (user?.id) {
      trackEvent(user.id, 'pageview', { 
        page: '/flashcards',
        category: 'Navigation'
      });
    }

    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/sections/${sectionId}/flashcards`);
        const data = response.data;

        if (data.units && data.units.length > 0) {
          const transformedSections = [
            {
              id: data.sectionId,
              name: `Section ${data.sectionId}`,
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
            },
          ];
            
          setSections(transformedSections);
          setSectionCount(data.sectionCount);

          
          // Track successful data load
          trackEvent(user.id, 'flashcards_loaded', {
            category: 'Flashcards',
            label: 'Flashcards Data Loaded',
            section_count: 1,
            unit_count: data.units.length,
            flashcard_count: data.units.reduce((sum, unit) => sum + unit.lessons.length, 0)
          });
        } else {
          setDefaultData();
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        // Track data fetch error
        trackEvent(user.id, 'flashcards_error', {
          category: 'Error',
          label: 'Flashcards Data Error',
          error: error.message
        });
        setDefaultData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user , sectionId]);

  const setDefaultData = () => {
    const defaultSections = [
      {
        id: 1,
        name: "Default Section 1",
        units: [
          {
            unitId: 1,
            unitName: "Unit 1: default 1",
            flashcards: [
              {
                lessonId: 1,
                lessonName: "Lesson 1",
                lessonNumber: 1,
                flashCard: "This is a default flashcard 1.",
                isPassed: false,
              },
              {
                lessonId: 2,
                lessonName: "Lesson 2",
                lessonNumber: 2,
                flashCard: "This is a default flashcard 2.",
                isPassed: false,
              },
            ],
          },
          {
            unitId: 2,
            unitName: "Unit 2: default 2",
            flashcards: [
              {
                lessonId: 3,
                lessonName: "Lesson 3",
                lessonNumber: 1,
                flashCard: "This is a default flashcard 3.",
                isPassed: false,
              },
              {
                lessonId: 4,
                lessonName: "Lesson 4",
                lessonNumber: 2,
                flashCard: "This is a default flashcard 4.",
                isPassed: false,
              },
            ],
          },
        ],
      },
    ];

    setSections(defaultSections);
    // Track dummy data usage
    trackEvent(user.id, 'flashcards_dummy_data', {
      category: 'Fallback',
      label: 'Using Default Flashcards Data'
    });
  };

  const handleCardClick = async (unitId, index) => {
    const flashcard = findFlashcard(unitId, index);
    
    // Track flashcard click attempt
    trackEvent(user.id, 'flashcard_clicked', {
      category: 'Flashcards',
      label: 'Flashcard Clicked',
      unit_id: unitId,
      lesson_id: flashcard.lessonId,
      lesson_number: flashcard.lessonNumber,
      is_passed: flashcard.isPassed
    });

    try {
      const response = await apiClient.get(
        `/sections/flashcard-access/${user.id}/${flashcard.lessonId}`
      );
      const data = response.data;

      if (!data.accessGranted) {
        setErrorMessage(data.message);
        // Track access denied
        trackEvent(user.id, 'flashcard_access_denied', {
          category: 'Access',
          label: 'Flashcard Access Denied',
          unit_id: unitId,
          lesson_id: flashcard.lessonId,
          reason: data.message
        });
        return;
      }

      setSelectedCard({ unitId, index });
      setModalOpen(true);
      setErrorMessage(null);
      
      // Track successful flashcard access
      trackEvent(user.id, 'flashcard_accessed', {
        category: 'Flashcards',
        label: 'Flashcard Viewed',
        unit_id: unitId,
        lesson_id: flashcard.lessonId,
        lesson_name: flashcard.lessonName
      });
    } catch (error) {
      console.error("Error checking flashcard access:", error);
      setErrorMessage("An error occurred while checking access.");
      // Track access check error
      trackEvent(user.id, 'flashcard_access_error', {
        category: 'Error',
        label: 'Access Check Error',
        error: error.message
      });
    }
  };

  const findFlashcard = (unitId, index) => {
    for (const section of sections) {
      for (const unit of section.units) {
        if (unit.unitId === unitId) {
          return unit.flashcards[index];
        }
      }
    }
    return null;
  };

  const handleModalClose = () => {
    // Track modal close
    if (selectedCard) {
      const flashcard = findFlashcard(selectedCard.unitId, selectedCard.index);
      trackEvent(user.id, 'flashcard_modal_closed', {
        category: 'Flashcards',
        label: 'Flashcard Modal Closed',
        unit_id: selectedCard.unitId,
        lesson_id: flashcard?.lessonId,
        duration: flashcard?.viewDuration || 0
      });
    }
    setModalOpen(false);
  };

  const getNextSection = () => {
    setSectionId(sectionId + 1);
  };

  const getPreviousSection = () => {
    setSectionId(sectionId - 1);
  };

  if (loading) {
    return (
      <div className="page-container">
        <Lsidebar />
        <div className="content">
          <div className="loading-indicator">Loading flashcards...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Lsidebar />
      <div className="content">
        <div className="fheader"></div>

        {sections.map((section) =>
          section.units.map((unit) => (
            <div key={unit.unitId} className="section-container">
              <h2 className="section-title">{unit.unitName}</h2>
              <div className="cards-container">
                {unit.flashcards.map((card, index) => (
                  <div key={index} className="flashcard-wrapper">
                    <span className="lesson-number">{card.lessonNumber}</span>
                    <img
                      src={card.isPassed ? cardFront : cardBack}
                      alt="Flash Card"
                      className={`flashcard ${card.isPassed ? "passed" : ""}`}
                      onClick={() => handleCardClick(unit.unitId, index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {errorMessage && (
          <div className="Emodal-overlay">
            <div className="Emodal-window">
              <button
                className="Eclose-button"
                onClick={() => {
                  trackEvent(user.id, 'error_modal_closed', {
                    category: 'UI',
                    label: 'Error Modal Closed'
                  });
                  setErrorMessage(null);
                }}
              >
                ✖
              </button>
              <h2 className="Emodal-title">Error</h2>
              <p className="Emodal-text">{errorMessage}</p>
            </div>
          </div>
        )}

        {modalOpen && selectedCard !== null && (
          <div className="modal-overlay">
            <div className="modal-window">
              <button
                className="close-button"
                onClick={handleModalClose}
              >
                ✖
              </button>
              <h2 className="modal-title">
                {
                  findFlashcard(selectedCard.unitId, selectedCard.index)
                    ?.lessonName
                }
              </h2>
              <p className="modal-text">
                {
                  findFlashcard(selectedCard.unitId, selectedCard.index)
                    ?.flashCard
                }
              </p>
            </div>
          </div>
        )}
        <div>

          {sectionCount !== sectionId && (
            <button onClick={() => getNextSection()} >Next</button>
          )}

          {sectionId !== 1 && (
            <button onClick={() => getPreviousSection()}>Previous</button>
          )}

        </div>
      </div>
    </div>
  );
};

export default FlashCardSection;