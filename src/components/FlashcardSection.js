


import React, { useState } from "react";
import Lsidebar from "./Lsidebar"; 
import "./FlashcardSection.css"; 
import cardBack from "./images/Flashcard_black.svg";  // صورة البطاقة المغلقة
import cardFront from "./images/Flashcard_color.svg"; // صورة البطاقة المفتوحة

const FlashCardSection = () => {
    const [flippedCards, setFlippedCards] = useState(Array(12).fill(false));

    const handleCardClick = (index) => {
        setFlippedCards((prev) => {
            const newFlipped = [...prev];
            newFlipped[index] = !newFlipped[index]; // تغيير حالة البطاقة
            return newFlipped;
        });
    };

    return (
        <div className="page-container">
            <Lsidebar />  {/* الشريط الجانبي */}

            <div className="content">
                <div className="fheader">Flash Cards</div>
                <div className="cards-container">
                    {flippedCards.map((isFlipped, index) => (
                        <img
                            key={index}
                            src={isFlipped ? cardFront : cardBack}
                            alt="Flash Card"
                            className={`flashcard ${isFlipped ? "flipped" : ""}`}
                            onClick={() => handleCardClick(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FlashCardSection;


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
