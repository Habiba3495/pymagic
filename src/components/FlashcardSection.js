import React, { useState, useEffect } from "react";
import Lsidebar from "./Sidebar";
import "./FlashcardSection.css";
import cardBack from "./images/Flashcard_black.svg";
import cardFront from "./images/Flashcard_color.svg";
import apiClient from "../services";
import { useAuth } from "../context/AuthContext";
import trackEvent from '../utils/trackEvent';
import PyMagicRunner from './Pymagic_runnergame'; 

const FlashCardSection = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sectionId, setSectionId] = useState(user?.lastSectionId && user.lastSectionId > 0 ? user.lastSectionId : 1);
  const [sectionCount, setSectionCount] = useState(1);
  const [nextSectionName, setNextSectionName] = useState("");
  const [prevSectionName, setPrevSectionName] = useState(""); // Initial state
  const [isFetchingPrevSection, setIsFetchingPrevSection] = useState(false); // Track fetching state

  useEffect(() => {
    if (user?.id) {
      trackEvent(user.id, 'pageview', { 
        page: '/flashcards',
        category: 'Navigation'
      });
    }

    const fetchData = async () => {
      try {
        setLoading(true); // Ensure loading state is set
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
          setSectionCount(data.sectionCount || 2);

          trackEvent(user.id, 'flashcards_loaded', {
            category: 'Flashcards',
            label: 'Flashcards Data Loaded',
            section_count: data.sectionCount || 2,
            unit_count: data.units.length,
            flashcard_count: data.units.reduce((sum, unit) => sum + unit.lessons.length, 0)
          });

          // Fetch next section name
          if (sectionId < (data.sectionCount || 2)) {
            try {
              const nextResponse = await apiClient.get(`/sections/${sectionId + 1}`);
              setNextSectionName(nextResponse.data?.name || `Section ${sectionId + 1}`);
            } catch (error) {
              console.error("Error fetching next section:", error);
              setNextSectionName(`Section ${sectionId + 1}`);
            }
          } else {
            setNextSectionName("");
          }


          if (sectionId > 1) {
            try {
              const prevResponse = await apiClient.get(`/sections/${sectionId - 1}`);
              // Check if the name is nested differently in the response
              const prevName = prevResponse.data?.name || prevResponse.data?.section?.name || `Section ${sectionId - 1}`;
              setPrevSectionName(prevName);
            } catch (error) {
              console.error("Error fetching previous section:", error);
              setPrevSectionName(`Section ${sectionId - 1}`);
            }
          } else {
            setPrevSectionName("");
          }

          // Fetch previous section name
          if (sectionId > 1) {
            setIsFetchingPrevSection(true); // Indicate fetching is in progress
            try {
              const prevResponse = await apiClient.get(`/sections/${sectionId - 1}`);
              console.log("Previous section response:", prevResponse.data); // Add this

              const prevName = prevResponse.data?.name || `Section ${sectionId - 1}`;
              setPrevSectionName(prevName);
            } catch (error) {
              console.error("Error fetching previous section:", error);
              setPrevSectionName(`Section ${sectionId - 1}`); // Fallback to default name
            } finally {
              setIsFetchingPrevSection(false); // Fetching complete
            }
          } else {
            setPrevSectionName(""); // No previous section if sectionId is 1
            setIsFetchingPrevSection(false);
          }
        } else {
          setSections([]);
          setSectionCount(2);
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        trackEvent(user.id, 'flashcards_error', {
          category: 'Error',
          label: 'Flashcards Data Error',
          error: error.message
        });
        setSections([]);
        setSectionCount(2);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, sectionId]);

  const handleCardClick = async (unitId, index) => {
    const flashcard = findFlashcard(unitId, index);
    
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
    if (sectionId < sectionCount) {
      setSectionId(sectionId + 1);
      trackEvent(user.id, 'next_section_clicked', {
        category: 'Navigation',
        label: 'Next Section',
        section_id: sectionId + 1
      });
    }
  };

  const getPreviousSection = () => {
    if (sectionId > 1) {
      setSectionId(sectionId - 1);
      trackEvent(user.id, 'previous_section_clicked', {
        category: 'Navigation',
        label: 'Previous Section',
        section_id: sectionId - 1
      });
    }
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

        {sections.length > 0 ? (
          sections.map((section) =>
            section.units.map((unit) => (
              <div key={unit.unitId} className="section-container">
                <h2 className="sectiontitle">{unit.unitName}</h2>
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
          )
        ) : (
          <PyMagicRunner />
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

        <div className="Fsection-navigation">
          {sectionId > 1 && (
            <div className="Fnav-button-wrapper">
              <button 
                onClick={() => getPreviousSection()}
                className="Fnav-button Fnext-button"
                disabled={isFetchingPrevSection} // Disable while fetching
              >
                Previous: {prevSectionName || `Section ${sectionId - 1}`}
              </button>
            </div>
          )}
          
          {sectionId < sectionCount && (
            <div className="Fnav-button-wrapper">
              <button 
                onClick={() => getNextSection()}
                className="Fnav-button Fnext-button"
              >
                Next: {nextSectionName}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashCardSection;