


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


import React, { useState, useEffect } from "react";
import Lsidebar from "./Lsidebar";
import "./FlashcardSection.css";
import cardBack from "./images/Flashcard_black.svg";
import cardFront from "./images/Flashcard_color.svg";

const FlashCardSection = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [flippedCards, setFlippedCards] = useState(Array(12).fill(false));
    const [selectedCard, setSelectedCard] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/sections/1/flashcards")
            .then((response) => response.json())
            .then((data) => {
                if (data.flashcards && data.flashcards.length > 0) {
                    setFlashcards(data.flashcards);
                } else {
                    setFlashcards(new Array(12).fill({ lessonName: "Lesson", flashCard: "No data available." }));
                }
            })
            .catch(() => {
                setFlashcards(new Array(12).fill({ lessonName: "Lesson", flashCard: "No data available." }));
            });
    }, []);

    const handleCardClick = (index) => {
        setFlippedCards((prev) => {
            const newFlipped = [...prev];
            newFlipped[index] = true;
            return newFlipped;
        });

        setSelectedCard(index);
        setModalOpen(true);
    };

    return (
        <div className="page-container">
            <Lsidebar />

            <div className="content">
                <div className="fheader">Flash Cards</div>
                <div className="cards-container">
                    {flashcards.map((card, index) => (
                        <img
                            key={index}
                            src={flippedCards[index] ? cardFront : cardBack}
                            alt="Flash Card"
                            className={`flashcard ${flippedCards[index] ? "flipped" : ""}`}
                            onClick={() => handleCardClick(index)}
                        />
                    ))}
                </div>
            </div>

            {modalOpen && selectedCard !== null && (
                <div className="modal-overlay">
                    <div className="modal-window">
                        <button className="close-button" onClick={() => setModalOpen(false)}>✖</button>
                        <h2 className="modal-title">{flashcards[selectedCard].lessonName}</h2>
                        <p className="modal-text">{flashcards[selectedCard].flashCard}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashCardSection;