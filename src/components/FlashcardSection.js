import React, { useState, useEffect } from "react";
import Lsidebar from "./Lsidebar";
import "./FlashcardSection.css";
import cardBack from "./images/Flashcard_black.svg";
import cardFront from "./images/Flashcard_color.svg";
import apiClient from '../services';
import { useAuth } from '../context/AuthContext';

const FlashCardSection = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/sections/1/flashcards'); //section not var
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
                  flashCard: lesson.flashCard,
                })),
              })),
            },
          ];
          setSections(transformedSections);
  
          const savedFlippedCards = JSON.parse(localStorage.getItem("flippedCards"));
          if (savedFlippedCards) {
            setFlippedCards(savedFlippedCards);
          } else {
            const initialFlippedCards = transformedSections.reduce((acc, section) => {
              section.units.forEach((unit) => {
                acc[unit.unitId] = Array(unit.flashcards.length).fill(false);
              });
              return acc;
            }, {});
            setFlippedCards(initialFlippedCards);
          }
        } else {
          setDefaultData();
        }
      } catch (error) {
        setDefaultData();
      }
    };
  
    fetchData();
  }, []);

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
              { lessonId: 1, lessonName: "Lesson 1", flashCard: "This is a default flashcard 1." },
              { lessonId: 2, lessonName: "Lesson 2", flashCard: "This is a default flashcard 2." },
            ],
          },
          {
            unitId: 2,
            unitName: "Unit 2: default 2",
            flashcards: [
              { lessonId: 3, lessonName: "Lesson 3", flashCard: "This is a default flashcard 3." },
              { lessonId: 4, lessonName: "Lesson 4", flashCard: "This is a default flashcard 4." },
            ],
          },
        ],
      },
    ];

    setSections(defaultSections);

    const savedFlippedCards = JSON.parse(localStorage.getItem("flippedCards"));
    if (savedFlippedCards) {
      setFlippedCards(savedFlippedCards);
    } else {
      const initialFlippedCards = defaultSections.reduce((acc, section) => {
        section.units.forEach((unit) => {
          acc[unit.unitId] = Array(unit.flashcards.length).fill(false);
        });
        return acc;
      }, {});
      setFlippedCards(initialFlippedCards);
    }
  };

  const handleCardClick = async (unitId, index) => {
    const flashcard = findFlashcard(unitId, index);
    const lessonId = flashcard.lessonId;
  
    try {
      const response = await apiClient.get(
        `/sections/flashcard-access/${user.id}/${lessonId}`
      );
      const data = response.data; // Access the response data
  
      if (!data.accessGranted) {
        setErrorMessage(data.message);
        return; // Do not flip the card or open the modal
      }
  
      // If access is granted, proceed with flipping the card and opening the modal
      setFlippedCards((prev) => {
        const newFlippedCards = {
          ...prev,
          [unitId]: prev[unitId].map((val, i) => (i === index ? !val : val)),
        };
        localStorage.setItem("flippedCards", JSON.stringify(newFlippedCards));
        return newFlippedCards;
      });
  
      setSelectedCard({ unitId, index });
      setModalOpen(true);
      setErrorMessage(null); // Clear any previous error message
    } catch (error) {
      console.error("Error checking flashcard access:", error);
      setErrorMessage("An error occurred while checking access.");
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

  return (
    <div className="page-container">
      <Lsidebar />

      <div className="content" style={{ marginLeft: "250px" }}>
        <div className="fheader"></div>

        {sections.map((section) =>
          section.units.map((unit) => (
            <div key={unit.unitId} className="section-container">
              <h2 className="section-title">{unit.unitName}</h2>
              <div className="cards-container">
                {unit.flashcards.map((card, index) => (
                  <img
                    key={index}
                    src={flippedCards[unit.unitId]?.[index] ? cardFront : cardBack}
                    alt="Flash Card"
                    className={`flashcard ${flippedCards[unit.unitId]?.[index] ? "flipped" : ""}`}
                    onClick={() => handleCardClick(unit.unitId, index)}
                  />
                ))}
              </div>
            </div>
          ))
        )}

{errorMessage && (
  <div className="Emodal-overlay">
    <div className="Emodal-window">
      <button className="Eclose-button" onClick={() => setErrorMessage(null)}>
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
              <button className="close-button" onClick={() => setModalOpen(false)}>
                ✖
              </button>
              <h2 className="modal-title">
                {findFlashcard(selectedCard.unitId, selectedCard.index)?.lessonName}
              </h2>
              <p className="modal-text">
                {findFlashcard(selectedCard.unitId, selectedCard.index)?.flashCard}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashCardSection;