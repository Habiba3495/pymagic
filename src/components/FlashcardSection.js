


// import React, { useState } from "react";
// import Lsidebar from "./Lsidebar"; 
// import "./FlashcardSection.css"; 
// import cardBack from "./images/Flashcard_black.svg";  // صورة البطاقة المغلقة
// import cardFront from "./images/Flashcard_color.svg"; // صورة البطاقة المفتوحة

// const FlashCardSection = () => {
//     const [flippedCards, setFlippedCards] = useState(Array(12).fill(false));

//     const handleCardClick = (index) => {
//         setFlippedCards((prev) => {
//             const newFlipped = [...prev];
//             newFlipped[index] = !newFlipped[index]; // تغيير حالة البطاقة
//             return newFlipped;
//         });
//     };

//     return (
//         <div className="page-container">
//             <Lsidebar />  {/* الشريط الجانبي */}

//             <div className="content">
//                 <div className="fheader">Flash Cards</div>
//                 <div className="cards-container">
//                     {flippedCards.map((isFlipped, index) => (
//                         <img
//                             key={index}
//                             src={isFlipped ? cardFront : cardBack}
//                             alt="Flash Card"
//                             className={`flashcard ${isFlipped ? "flipped" : ""}`}
//                             onClick={() => handleCardClick(index)}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FlashCardSection;


// import React, { useState, useEffect } from "react";
// import Lsidebar from "./Lsidebar";
// import "./FlashcardSection.css";
// import cardBack from "./images/Flashcard_black.svg";  
// import cardFront from "./images/Flashcard_color.svg"; 

// const FlashCardSection = () => {
//     const [flashcards, setFlashcards] = useState([]);  // لتخزين الفلاش كارد من الـ API
//     const [flippedCards, setFlippedCards] = useState([]);  // لتخزين حالة كل كارد (مفتوح/مغلق)

//     useEffect(() => {
//         // جلب البيانات من API عند تحميل المكون
//         fetch("https://your-api-url.com/flashcards") // استبدل بعنوان الـ API الخاص بك
//             .then((response) => response.json())
//             .then((data) => {
//                 setFlashcards(data);  // حفظ البيانات في state
//                 setFlippedCards(Array(data.length).fill(false));  // تعيين حالة كل كارد كمغلق في البداية
//             })
//             .catch((error) => console.error("Error fetching flashcards:", error));
//     }, []);

//     const handleCardClick = (index) => {
//         setFlippedCards((prev) => {
//             const newFlipped = [...prev];
//             newFlipped[index] = !newFlipped[index]; 
//             return newFlipped;
//         });
//     };

//     return (
//         <div className="page-container">
//             <Lsidebar />  

//             <div className="content">
//                 <div className="header">Flash Cards</div>
//                 <div className="cards-container">
//                     {flashcards.map((card, index) => (
//                         <img
//                             key={card.id} // استخدام id من قاعدة البيانات
//                             src={flippedCards[index] ? cardFront : cardBack}
//                             alt={card.term} // عرض المصطلح من قاعدة البيانات
//                             className={`flashcard ${flippedCards[index] ? "flipped" : ""}`}
//                             onClick={() => handleCardClick(index)}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FlashCardSection;


// import React, { useState, useEffect } from "react";
// import Lsidebar from "./Lsidebar"; 
// import "./FlashcardSection.css"; 
// import cardBack from "./images/Flashcard_black.svg";  
// import cardFront from "./images/Flashcard_color.svg";  

// const FlashCardSection = () => {
//     const [flashcards, setFlashcards] = useState([]);
//     const [flippedCards, setFlippedCards] = useState(Array(12).fill(false));
//     const [selectedCard, setSelectedCard] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     // جلب البيانات من الـ API
//     useEffect(() => {
//         fetch("https://api.example.com/flashcards")  // ضع رابط API الصحيح هنا
//             .then((response) => response.json())
//             .then((data) => {
//                 if (Array.isArray(data) && data.length > 0) {
//                     setFlashcards(data);
//                 } else {
//                     setFlashcards(new Array(12).fill({ title: "Lesson", description: "No data available." }));
//                 }
//             })
//             .catch(() => {
//                 setFlashcards(new Array(12).fill({ title: "Lesson", description: "No data available." }));
//             });
//     }, []);

//     // عند الضغط على أي كارد، يتم قلبه وفتح النافذة
//     const handleCardClick = (index) => {
//         setFlippedCards((prev) => {
//             const newFlipped = [...prev];
//             newFlipped[index] = true; // جعل البطاقة مفتوحة
//             return newFlipped;
//         });

//         setSelectedCard(index);
//         setModalOpen(true);
//     };

//     return (
//         <div className="page-container">
//             <Lsidebar />

//             <div className="content">
//                 <div className="fheader">Flash Cards</div>
//                 <div className="cards-container">
//                     {flashcards.map((_, index) => (
//                         <img
//                             key={index}
//                             src={flippedCards[index] ? cardFront : cardBack} 
//                             alt="Flash Card"
//                             className={`flashcard ${flippedCards[index] ? "flipped" : ""}`}
//                             onClick={() => handleCardClick(index)}
//                         />
//                     ))}
//                 </div>
//             </div>

//             {/* ✅ النافذة المنبثقة بتصميم مطابق للصورة */}
//             {modalOpen && selectedCard !== null && (
//                 <div className="modal-overlay">
//                     <div className="modal-window">
//                         <button className="close-button" onClick={() => setModalOpen(false)}>✖️</button>
//                         <h2 className="modal-title"> {flashcards[selectedCard].title} </h2>
//                         <p className="modal-text"> {flashcards[selectedCard].description} </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FlashCardSection;


// import React, { useState, useEffect } from "react";
// import Lsidebar from "./Lsidebar";
// import "./FlashcardSection.css";
// import cardBack from "./images/Flashcard_black.svg";
// import cardFront from "./images/Flashcard_color.svg";

// const FlashCardSection = () => {
//     const [flashcards, setFlashcards] = useState([]);
//     const [flippedCards, setFlippedCards] = useState(Array(12).fill(false));
//     const [selectedCard, setSelectedCard] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     useEffect(() => {
//         fetch("http://localhost:5000/sections/1/flashcards")
//             .then((response) => response.json())
//             .then((data) => {
//                 if (data.flashcards && data.flashcards.length > 0) {
//                     setFlashcards(data.flashcards);
//                 } else {
//                     setFlashcards(new Array(12).fill({ lessonName: "Lesson", flashCard: "No data available." }));
//                 }
//             })
//             .catch(() => {
//                 setFlashcards(new Array(12).fill({ lessonName: "Lesson", flashCard: "No data available." }));
//             });
//     }, []);

//     const handleCardClick = (index) => {
//         setFlippedCards((prev) => {
//             const newFlipped = [...prev];
//             newFlipped[index] = true;
//             return newFlipped;
//         });

//         setSelectedCard(index);
//         setModalOpen(true);
//     };

//     return (
//         <div className="page-container">
//             <Lsidebar />

//             <div className="content">
//                 <div className="fheader">Flash Cards</div>
//                 <div className="cards-container">
//                     {flashcards.map((card, index) => (
//                         <img
//                             key={index}
//                             src={flippedCards[index] ? cardFront : cardBack}
//                             alt="Flash Card"
//                             className={`flashcard ${flippedCards[index] ? "flipped" : ""}`}
//                             onClick={() => handleCardClick(index)}
//                         />
//                     ))}
//                 </div>
//             </div>

//             {modalOpen && selectedCard !== null && (
//                 <div className="modal-overlay">
//                     <div className="modal-window">
//                         <button className="close-button" onClick={() => setModalOpen(false)}>✖</button>
//                         <h2 className="modal-title">{flashcards[selectedCard].lessonName}</h2>
//                         <p className="modal-text">{flashcards[selectedCard].flashCard}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FlashCardSection;


// import React, { useState, useEffect } from "react";
// import Lsidebar from "./Lsidebar";
// import "./FlashcardSection.css";
// import cardBack from "./images/Flashcard_black.svg";
// import cardFront from "./images/Flashcard_color.svg";

// const FlashCardSection = () => {
//     const [sections, setSections] = useState([]);
//     const [flippedCards, setFlippedCards] = useState({});
//     const [selectedCard, setSelectedCard] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     useEffect(() => {
//         fetch("http://localhost:5000/sections/1/flashcards")
//             .then((response) => response.json())
//             .then((data) => {
//                 if (data.units && data.units.length > 0) {
//                     // Transform units into a section-like structure
//                     const transformedSections = [
//                         {
//                             id: data.sectionId,
//                             name: `Section ${data.sectionId}`, // Adjust name as needed based on your data
//                             units: data.units.map(unit => ({
//                                 unitId: unit.unitId,
//                                 unitName: unit.unitName,
//                                 flashcards: unit.lessons.map(lesson => ({
//                                     lessonId: lesson.lessonId,
//                                     lessonName: lesson.lessonName,
//                                     flashCard: lesson.flashCard
//                                 }))
//                             }))
//                         }
//                     ];
//                     setSections(transformedSections);
//                     // Initialize flippedCards for each unit's flashcards
//                     const initialFlippedCards = transformedSections.reduce((acc, section) => {
//                         section.units.forEach(unit => {
//                             acc[unit.unitId] = Array(unit.flashcards.length).fill(false);
//                         });
//                         return acc;
//                     }, {});
//                     setFlippedCards(initialFlippedCards);
//                 } else {
//                     setDefaultData();
//                 }
//             })
//             .catch(() => {
//                 setDefaultData();
//             });
//     }, []);

//     const setDefaultData = () => {
//         const defaultSections = [
//             {
//                 id: 1,
//                 name: "Default Section 1",
//                 units: [
//                     {
//                         unitId: 1,
//                         unitName: "Unit 1: Basics",
//                         flashcards: [
//                             { lessonId: 1, lessonName: "Lesson 1", flashCard: "This is a default flashcard 1." },
//                             { lessonId: 2, lessonName: "Lesson 2", flashCard: "This is a default flashcard 2." }
//                         ]
//                     },
//                     {
//                         unitId: 2,
//                         unitName: "Unit 2: Advanced",
//                         flashcards: [
//                             { lessonId: 3, lessonName: "Lesson 3", flashCard: "This is a default flashcard 3." },
//                             { lessonId: 4, lessonName: "Lesson 4", flashCard: "This is a default flashcard 4." }
//                         ]
//                     }
//                 ]
//             }
//         ];
    
//         setSections(defaultSections);
//         const initialFlippedCards = defaultSections.reduce((acc, section) => {
//             section.units.forEach(unit => {
//                 acc[unit.unitId] = Array(unit.flashcards.length).fill(false);
//             });
//             return acc;
//         }, {});
//         setFlippedCards(initialFlippedCards);
//     };
    

//     const handleCardClick = (unitId, index) => {
//         setFlippedCards((prev) => ({
//             ...prev,
//             [unitId]: prev[unitId].map((val, i) => (i === index ? !val : val))
//         }));

//         setSelectedCard({ unitId, index });
//         setModalOpen(true);
//     };

//     const findFlashcard = (unitId, index) => {
//         for (const section of sections) {
//             for (const unit of section.units) {
//                 if (unit.unitId === unitId) {
//                     return unit.flashcards[index];
//                 }
//             }
//         }
//         return null;
//     };

//     return (
//         <div className="page-container">
//             <Lsidebar />

//             <div className="content" style={{ marginLeft: "250px" }}>
//                 <div className="fheader"></div>

//                 {sections.map((section) =>
//                     section.units.map((unit) => (
//                         <div key={unit.unitId} className="section-container">
//                             <h2 className="section-title">{unit.unitName}</h2>
//                             <div className="cards-container">
//                                 {unit.flashcards.map((card, index) => (
//                                     <img
//                                         key={index}
//                                         src={flippedCards[unit.unitId]?.[index] ? cardFront : cardBack}
//                                         alt="Flash Card"
//                                         className={`flashcard ${flippedCards[unit.unitId]?.[index] ? "flipped" : ""}`}
//                                         onClick={() => handleCardClick(unit.unitId, index)}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {modalOpen && selectedCard !== null && (
//                 <div className="modal-overlay">
//                     <div className="modal-window">
//                         <button className="close-button" onClick={() => setModalOpen(false)}>✖</button>
//                         <h2 className="modal-title">
//                             {findFlashcard(selectedCard.unitId, selectedCard.index)?.lessonName}
//                         </h2>
//                         <p className="modal-text">
//                             {findFlashcard(selectedCard.unitId, selectedCard.index)?.flashCard}
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FlashCardSection;








// import React, { useState, useEffect } from "react";
// import Lsidebar from "./Lsidebar";
// import "./FlashcardSection.css";
// import cardBack from "./images/Flashcard_black.svg";
// import cardFront from "./images/Flashcard_color.svg";

// const FlashCardSection = () => {
//     const [sections, setSections] = useState([]);
//     const [flippedCards, setFlippedCards] = useState({});
//     const [selectedCard, setSelectedCard] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);


//     useEffect(() => {
//         fetch("http://localhost:5000/sections/1/flashcards")
//             .then((response) => response.json())
//             .then((data) => {
//                 if (data.units && data.units.length > 0) {
//                     const transformedSections = [
//                         {
//                             id: data.sectionId,
//                             name: `Section ${data.sectionId}`,
//                             units: data.units.map(unit => ({
//                                 unitId: unit.unitId,
//                                 unitName: unit.unitName,
//                                 flashcards: unit.lessons.map(lesson => ({
//                                     lessonId: lesson.lessonId,
//                                     lessonName: lesson.lessonName,
//                                     flashCard: lesson.flashCard
//                                 }))
//                             }))
//                         }
//                     ];
//                     setSections(transformedSections);
    
//                     // استرجاع flippedCards من Local Storage إذا كانت موجودة
//                     const savedFlippedCards = JSON.parse(localStorage.getItem("flippedCards"));
//                     if (savedFlippedCards) {
//                         setFlippedCards(savedFlippedCards);
//                     } else {
//                         // تهيئة flippedCards إذا لم تكن موجودة
//                         const initialFlippedCards = transformedSections.reduce((acc, section) => {
//                             section.units.forEach(unit => {
//                                 acc[unit.unitId] = Array(unit.flashcards.length).fill(false);
//                             });
//                             return acc;
//                         }, {});
//                         setFlippedCards(initialFlippedCards);
//                     }
//                 } else {
//                     setDefaultData();
//                 }
//             })
//             .catch(() => {
//                 setDefaultData();
//             });
//     }, []);


//     const setDefaultData = () => {
//         const defaultSections = [
//             {
//                 id: 1,
//                 name: "Default Section 1",
//                 units: [
//                     {
//                         unitId: 1,
//                         unitName: "Unit 1: default 1",
//                         flashcards: [
//                             { lessonId: 1, lessonName: "Lesson 1", flashCard: "This is a default flashcard 1." },
//                             { lessonId: 2, lessonName: "Lesson 2", flashCard: "This is a default flashcard 2." }
//                         ]
//                     },
//                     {
//                         unitId: 2,
//                         unitName: "Unit 2: default 2",
//                         flashcards: [
//                             { lessonId: 3, lessonName: "Lesson 3", flashCard: "This is a default flashcard 3." },
//                             { lessonId: 4, lessonName: "Lesson 4", flashCard: "This is a default flashcard 4." }
//                         ]
//                     }
//                 ]
//             }
//         ];
    
//         setSections(defaultSections);
    
//         // استرجاع flippedCards من Local Storage إذا كانت موجودة
//         const savedFlippedCards = JSON.parse(localStorage.getItem("flippedCards"));
//         if (savedFlippedCards) {
//             setFlippedCards(savedFlippedCards);
//         } else {
//             const initialFlippedCards = defaultSections.reduce((acc, section) => {
//                 section.units.forEach(unit => {
//                     acc[unit.unitId] = Array(unit.flashcards.length).fill(false);
//                 });
//                 return acc;
//             }, {});
//             setFlippedCards(initialFlippedCards);
//         }
//     };
    
//     const handleCardClick = (unitId, index) => {
//         setFlippedCards((prev) => {
//             const newFlippedCards = {
//                 ...prev,
//                 [unitId]: prev[unitId].map((val, i) => (i === index ? !val : val))
//             };
//             // حفظ الحالة الجديدة في Local Storage
//             localStorage.setItem("flippedCards", JSON.stringify(newFlippedCards));
//             return newFlippedCards;
//         });
    
//         setSelectedCard({ unitId, index });
//         setModalOpen(true);
//     };

//     const findFlashcard = (unitId, index) => {
//         for (const section of sections) {
//             for (const unit of section.units) {
//                 if (unit.unitId === unitId) {
//                     return unit.flashcards[index];
//                 }
//             }
//         }
//         return null;
//     };

//     return (
//         <div className="page-container">
//             <Lsidebar />

//             <div className="content" style={{ marginLeft: "250px" }}>
//                 <div className="fheader"></div>

//                 {sections.map((section) =>
//                     section.units.map((unit) => (
//                         <div key={unit.unitId} className="section-container">
//                             <h2 className="section-title">{unit.unitName}</h2>
//                             <div className="cards-container">
//                                 {unit.flashcards.map((card, index) => (
//                                     <img
//                                         key={index}
//                                         src={flippedCards[unit.unitId]?.[index] ? cardFront : cardBack}
//                                         alt="Flash Card"
//                                         className={`flashcard ${flippedCards[unit.unitId]?.[index] ? "flipped" : ""}`}
//                                         onClick={() => handleCardClick(unit.unitId, index)}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {modalOpen && selectedCard !== null && (
//                 <div className="modal-overlay">
//                     <div className="modal-window">
//                         <button className="close-button" onClick={() => setModalOpen(false)}>✖</button>
//                         <h2 className="modal-title">
//                             {findFlashcard(selectedCard.unitId, selectedCard.index)?.lessonName}
//                         </h2>
//                         <p className="modal-text">
//                             {findFlashcard(selectedCard.unitId, selectedCard.index)?.flashCard}
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FlashCardSection;





import React, { useState, useEffect } from "react";
import Lsidebar from "./Lsidebar";
import "./FlashcardSection.css";
import cardBack from "./images/Flashcard_black.svg";
import cardFront from "./images/Flashcard_color.svg";

const FlashCardSection = () => {
  const [sections, setSections] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Assume user_id is available (e.g., from auth context or props)
  const userId = 1; // Replace with actual user ID from your auth system

  useEffect(() => {
    fetch("http://localhost:5000/sections/1/flashcards")
      .then((response) => response.json())
      .then((data) => {
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
      })
      .catch(() => {
        setDefaultData();
      });
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
      const response = await fetch(
        `http://localhost:5000/sections/flashcard-access/${userId}/${lessonId}`
      );
      const data = await response.json();

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