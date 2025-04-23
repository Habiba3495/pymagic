// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "./UnitQuiz.css";
// import ExitIcon from "./images/Exit iconsvg.svg";
// import WizardIcon from "./images/Correct Potion.svg";
// import CorrectAnswerIcon from "./images/Correct check.svg";
// import WrongIcon from "./images/Wrong potion.svg";
// import WrongAnswerIcon from "./images/Wrong icon.svg";
// import HintIcon from "./images/Hint icon.svg";
// import { useAuth } from '../context/AuthContext';
// import apiClient from '../services';
// import { useTranslation } from "react-i18next";
// import ReactGA from 'react-ga4';
// import trackEvent from '../utils/trackEvent';
// import PyMagicRunner from './Pymagic_runnergame';
// import correctSound from '../Sound/correct3-95630.mp3';
// import wrongSound from '../Sound/wronganswer-37702.mp3';

// const UnitQuiz = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { unitId } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isAnswered, setIsAnswered] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [hint, setHint] = useState("");
//   const [motivationMessage, setMotivationMessage] = useState("");
//   const [answers, setAnswers] = useState([]);
//   const userId = user?.id;
//   const { t } = useTranslation();
//   const correctSoundEffect = new Audio(correctSound);
//   const wrongSoundEffect = new Audio(wrongSound);

//   useEffect(() => {
//     if (unitId) {
//       ReactGA.send({ hitType: 'pageview', page: `/quiz/${unitId}` });
//       trackEvent(userId, 'pageview', { page: `/quiz/${unitId}` });
//     }
    
//     trackEvent(userId, 'unit_quiz_started', {
//       category: 'UnitQuiz',
//       label: `Unit ${unitId}`
//     });

//     const fetchQuestions = async () => {
//       try {
//         const response = await apiClient.get(`/api/quiz/unit/${userId}/${unitId}`);
//         if (response.status !== 200) {
//           throw new Error("Failed to fetch questions");
//         }
//         const data = response.data;
//         setQuestions(data.questions || []);
//       } catch (error) {
//         console.error("Error fetching unit quiz questions:", error);
//         const defaultQuestions = [
//           { id: 1, question: "What is a computer?", options: ["A machine", "A book", "A food", "A drink"], correct_answer: "A machine", hint: "It processes data." },
//           // ... بقية الأسئلة الافتراضية
//         ];
//         setQuestions(defaultQuestions);
//       }
//     };

//     fetchQuestions();
//   }, [unitId, userId]);

//   useEffect(() => {
//     const startTime = Date.now();
//     return () => {
//       const duration = Math.floor((Date.now() - startTime) / 1000);
//       trackEvent(userId, 'time_spent', {
//         category: 'UnitQuiz',
//         label: `Unit ${unitId}`
//       }, duration);
//     };
//   }, [unitId, userId]);

//   useEffect(() => {
//     let questionStartTime = Date.now();
//     return () => {
//       const duration = Math.floor((Date.now() - questionStartTime) / 1000);
//       trackEvent(userId, 'question_time_spent', {
//         category: 'UnitQuiz',
//         label: `Question ${questions[currentQuestionIndex]?.id} - Unit ${unitId}`
//       }, duration);
//       questionStartTime = Date.now();
//     };
//   }, [currentQuestionIndex, unitId, userId, questions]);

//   useEffect(() => {
//     let timeout;
//     const resetTimeout = () => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         trackEvent(userId, 'inactive', {
//           category: 'UnitQuiz',
//           label: `Unit ${unitId} - Question ${currentQuestionIndex + 1}`,
//           value: 30
//         }, 30);
//       }, 30000);
//     };

//     window.addEventListener('mousemove', resetTimeout);
//     window.addEventListener('keydown', resetTimeout);
//     resetTimeout();

//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener('mousemove', resetTimeout);
//       window.removeEventListener('keydown', resetTimeout);
//     };
//   }, [unitId, currentQuestionIndex, userId]);

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//     setIsAnswered(false);
//     setIsCorrect(null);
//     setHint("");
//     setMotivationMessage("");

//     trackEvent(userId, 'option_clicked', {
//       category: 'UnitQuiz',
//       label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`,
//       value: option
//     });
//   };

//   const checkAnswer = () => {
//     if (selectedOption) {
//       const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
//       setIsCorrect(isCorrectAnswer);
//       setIsAnswered(true);

//       const newAnswer = {
//         question_id: questions[currentQuestionIndex].id,
//         user_answer: selectedOption,
//         is_correct: isCorrectAnswer,
//       };

//       const updatedAnswers = [...answers, newAnswer];
//       setAnswers(updatedAnswers);

//       localStorage.setItem("unitQuizAnswers", JSON.stringify(updatedAnswers));

//       setMotivationMessage(isCorrectAnswer ? "Correct! Well done!" : "Incorrect. Try again!");

//       trackEvent(userId, isCorrectAnswer ? 'answer_correct' : 'answer_incorrect', {
//         category: 'UnitQuiz',
//         label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
//       });
//     }
//   };

//   const handleNextQuestion = async () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       trackEvent(userId, 'next_question', {
//         category: 'UnitQuiz',
//         label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
//       });

//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//       setSelectedOption(null);
//       setIsAnswered(false);
//       setIsCorrect(null);
//       setHint("");
//       setMotivationMessage("");
//     } else {
//       const validAnswers = answers.filter((answer) => answer.user_answer !== undefined);
//       localStorage.setItem("unitQuizAnswers", JSON.stringify(validAnswers));

//       const score = validAnswers.filter(a => a.is_correct).length / validAnswers.length * 100;
//       trackEvent(userId, 'unit_quiz_completed', {
//         category: 'UnitQuiz',
//         label: `Unit ${unitId}`,
//         value: Math.round(score)
//       });

//       if (!userId) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await apiClient.post("/api/quiz/unit/submit", {
//           user_id: userId,
//           unit_id: unitId,
//           answers: validAnswers,
//         });

//         const data = response.data;
//         if (data.success) {
//           navigate("/unit-quiz-complete", {
//             state: {
//               quizData: data,
//               studentQuizId: data.student_quiz_id,
//               total_user_points: data.total_user_points,
//               achievements: data.achievements || [],
//             },
//           });
//         } else {
//           console.error("Error submitting unit quiz:", data.message);
//           navigate("/unit-quiz-complete");
//         }
//       } catch (error) {
//         console.error("Error submitting unit quiz:", error);
//         navigate("/unit-quiz-complete");
//       }
//     }
//   };

//   const handleHintClick = () => {
//     setHint(questions[currentQuestionIndex].hint);
//     trackEvent(userId, 'hint_used', {
//       category: 'UnitQuiz',
//       label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
//     });
//   };

//   const handleExit = () => {
//     trackEvent(userId, 'exit_unit_quiz', {
//       category: 'UnitQuiz',
//       label: `Unit ${unitId} - Question ${currentQuestionIndex + 1}`
//     });
//     navigate("/lessons");
//   };

//   if (questions.length === 0) {
//     return <div>Loading...</div>;
//   }

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div className="quiz-container">
//       <button className="exit-button" onClick={handleExit}>
//         <img src={ExitIcon} alt="Exit" className="exit-icon" />
//       </button>

//       <div className="quiz-box">
//         <h1 className="quiz-header">{t("quiz")} {t("unit")} {unitId}</h1>
//         <p className="quiz-question">{currentQuestion.question}</p>

//         <div className="quiz-options">
//           {currentQuestion.options.map((option, index) => (
//             <button
//               key={index}
//               className={`option-button 
//                 ${selectedOption === option ? "selected" : ""} 
//                 ${isAnswered && option === currentQuestion.correct_answer ? "correct" : ""} 
//                 ${isAnswered && selectedOption === option && !isCorrect ? "wrong" : ""}`}
//               onClick={() => handleOptionClick(option)}
//               disabled={isAnswered}
//             >
//               {option}
//             </button>
//           ))}
//         </div>

//         {!isAnswered ? (
//           <div className="quiz-footer">
//             <img
//               src={HintIcon}
//               alt="Hint"
//               className="extra-icon"
//               onClick={handleHintClick}
//             />
//             <button
//               className={`check-answer-button ${selectedOption ? "selected" : ""}`}
//               onClick={checkAnswer}
//               disabled={!selectedOption}
//             >
//               {t("checkAnswer")}
//             </button>
//           </div>
//         ) : (
//           <>
//             {isCorrect ? (
//               <div className="result-container">
//                 <img src={WizardIcon} alt="Wizard" className="icon" />
//                 <p className="message">{motivationMessage}</p>
//                 <img src={CorrectAnswerIcon} alt="Correct" className="icon" />
//                 <p className="correct-message">{t("correctAnswer")}</p>
//                 <button className="next-button" onClick={handleNextQuestion}>
//                   {t("next")}
//                 </button>
//               </div>
//             ) : (
//               <div className="result-container">
//                 <img src={WrongIcon} alt="Wrong" className="icon" />
//                 <p className="message">{motivationMessage}</p>
//                 <img src={WrongAnswerIcon} alt="Wrong" className="icon" />
//                 <p className="wrong-message">{t("wrongAnswer")}</p>
//                 <button className="next-button" onClick={handleNextQuestion}>
//                   {t("next")}
//                 </button>
//               </div>
//             )}
//           </>
//         )}

//         {hint && (
//           <p className="hint-text">
//             <p>Hint:</p>
//             {hint}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UnitQuiz;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UnitQuiz.css";
import ExitIcon from "./images/Exit iconsvg.svg";
import WizardIcon from "./images/Correct Potion.svg";
import CorrectAnswerIcon from "./images/Correct check.svg";
import WrongIcon from "./images/Wrong potion.svg";
import WrongAnswerIcon from "./images/Wrong icon.svg";
import HintIcon from "./images/Hint icon.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import { useTranslation } from "react-i18next";
import ReactGA from 'react-ga4';
import trackEvent from '../utils/trackEvent';
import PyMagicRunner from './Pymagic_runnergame'; // استيراد PyMagicRunner
import correctSound from '../Sound/correct3-95630.mp3'; // استيراد صوت الإجابة الصحيحة
import wrongSound from '../Sound/wronganswer-37702.mp3'; // استيراد صوت الإجابة الخاطئة
import points from "./images/points.svg";


const UnitQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { unitId } = useParams();
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hint, setHint] = useState("");
  const [motivationMessage, setMotivationMessage] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // إضافة isLoading
  const userId = user?.id;

  // تعريف كائنات الصوت
  const correctSoundEffect = new Audio(correctSound);
  const wrongSoundEffect = new Audio(wrongSound);

  useEffect(() => {
    if (unitId) {
      ReactGA.send({ hitType: 'pageview', page: `/quiz/${unitId}` });
      trackEvent(userId, 'pageview', { page: `/quiz/${unitId}` });
    }
    
    trackEvent(userId, 'unit_quiz_started', {
      category: 'UnitQuiz',
      label: `Unit ${unitId}`
    });

    const fetchQuestions = async () => {
      setIsLoading(true); // بدء التحميل
      try {
        const response = await apiClient.get(`/api/quiz/unit/${userId}/${unitId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch questions");
        }
        const data = response.data;
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Error fetching unit quiz questions:", error);
        setQuestions([]); // إرجاع قائمة فاضية بدل الأسئلة الافتراضية
      } finally {
        setIsLoading(false); // إنهاء التحميل
      }
    };

    fetchQuestions();
  }, [unitId, userId]);

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      trackEvent(userId, 'time_spent', {
        category: 'UnitQuiz',
        label: `Unit ${unitId}`
      }, duration);
    };
  }, [unitId, userId]);

  useEffect(() => {
    let questionStartTime = Date.now();
    return () => {
      const duration = Math.floor((Date.now() - questionStartTime) / 1000);
      trackEvent(userId, 'question_time_spent', {
        category: 'UnitQuiz',
        label: `Question ${questions[currentQuestionIndex]?.id} - Unit ${unitId}`
      }, duration);
    };
  }, [currentQuestionIndex, unitId, userId, questions]);

  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        trackEvent(userId, 'inactive', {
          category: 'UnitQuiz',
          label: `Unit ${unitId} - Question ${currentQuestionIndex + 1}`,
          value: 30
        }, 30);
      }, 30000);
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    resetTimeout();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
    };
  }, [unitId, currentQuestionIndex, userId]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsAnswered(false);
    setIsCorrect(null);
    setHint("");
    setMotivationMessage("");

    trackEvent(userId, 'option_clicked', {
      category: 'UnitQuiz',
      label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`,
      value: option
    });
  };

  const checkAnswer = () => {
    if (!selectedOption) return;

    const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
    setIsCorrect(isCorrectAnswer);
    setIsAnswered(true);

    // تشغيل التأثيرات الحركية والصوت
    if (isCorrectAnswer) {
      // تشغيل صوت الإجابة الصحيحة
      correctSoundEffect.play().catch((error) => {
        console.error("Error playing correct sound:", error);
      });

      // تفعيل الرسوم المتحركة الخلفية
      const background = document.querySelector('.background-animation');
      background.classList.add('correct-animation');
      // إنشاء الرموز التعبيرية ديناميكيًا
      const emojis = ['👏', '🎉'];
      for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('animation-particle');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = `${Math.random() * 100}%`; // توزيع عشوائي أفقيًا
        particle.style.animationDelay = `${Math.random() * 1}s`; // تأخير عشوائي
        background.appendChild(particle);
      }
      // إزالة الرموز بعد انتهاء الأنيميشن
      setTimeout(() => {
        background.innerHTML = '';
        background.classList.remove('correct-animation');
      }, 4000); // مدة 4 ثوانٍ
    } else {
      // تشغيل صوت الإجابة الخاطئة
      wrongSoundEffect.play().catch((error) => {
        console.error("Error playing wrong sound:", error);
      });

      // اهتزاز الصندوق عند الإجابة الخاطئة
      document.querySelector('.unit-quiz-box').classList.add('wrong-animation');
      setTimeout(() => {
        document.querySelector('.unit-quiz-box').classList.remove('wrong-animation');
      }, 500);
    }

    const newAnswer = {
      question_id: questions[currentQuestionIndex].id,
      user_answer: selectedOption,
      is_correct: isCorrectAnswer,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    localStorage.setItem("unitQuizAnswers", JSON.stringify(updatedAnswers));

    setMotivationMessage(isCorrectAnswer ? "Correct! Well done!" : "Incorrect. Try again!");

    trackEvent(userId, isCorrectAnswer ? 'answer_correct' : 'answer_incorrect', {
      category: 'UnitQuiz',
      label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
    });
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      trackEvent(userId, 'next_question', {
        category: 'UnitQuiz',
        label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
      });

      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setHint("");
      setMotivationMessage("");
    } else {
      const validAnswers = answers.filter((answer) => answer.user_answer !== undefined);
      localStorage.setItem("unitQuizAnswers", JSON.stringify(validAnswers));

      const score = validAnswers.filter(a => a.is_correct).length / validAnswers.length * 100;
      trackEvent(userId, 'unit_quiz_completed', {
        category: 'UnitQuiz',
        label: `Unit ${unitId}`,
        value: Math.round(score)
      });

      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await apiClient.post("/api/quiz/unit/submit", {
          user_id: userId,
          unit_id: unitId,
          answers: validAnswers,
        });

        const data = response.data;
        if (data.success) {
          navigate("/unit-quiz-complete", {
            state: {
              quizData: data,
              studentQuizId: data.student_quiz_id,
              total_user_points: data.total_user_points,
              achievements: data.achievements || [],
            },
          });
        } else {
          console.error("Error submitting unit quiz:", data.message);
          navigate("/unit-quiz-complete");
        }
      } catch (error) {
        console.error("Error submitting unit quiz:", error);
        navigate("/unit-quiz-complete");
      }
    }
  };

  const handleHintClick = () => {
    setHint(questions[currentQuestionIndex].hint);
    trackEvent(userId, 'hint_used', {
      category: 'UnitQuiz',
      label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
    });
  };

  const handleExit = () => {
    trackEvent(userId, 'exit_unit_quiz', {
      category: 'UnitQuiz',
      label: `Unit ${unitId} - Question ${currentQuestionIndex + 1}`
    });
    navigate("/lessons");
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (questions.length === 0) {
    return <PyMagicRunner />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="unit-quiz-container">
      <div className="background-animation"></div> {/* إضافة عنصر الخلفية للأنيميشن */}
      <button className="unit-exit-button" onClick={handleExit}>
        <img src={ExitIcon} alt="Exit" className="unit-exit-icon" />
      </button>

      <div className="unit-quiz-box">
        <h1 className="unit-quiz-header">{t("quiz.quiz")} {t("unit")} {unitId}</h1>
        
        <div className="quiz-points">
           {t("question")} {currentQuestionIndex + 1} / {questions.length}
          <span className='qestion-points'>
          {currentQuestion.points}
          <img src={points} alt="points icon" className="userpointstow" />
          </span>
           </div>

        <p className="unit-quiz-question">{currentQuestion.question}</p>

        <div className="unit-quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`unit-option-button 
                ${selectedOption === option ? "selected" : ""} 
                ${isAnswered && option === currentQuestion.correct_answer ? "correct" : ""} 
                ${isAnswered && selectedOption === option && !isCorrect ? "wrong" : ""}`}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered}
            >
              {option}
            </button>
          ))}
        </div>

        {!isAnswered ? (
          <div className="unit-quiz-footer">
            <img
              src={HintIcon}
              alt="Hint"
              className="unit-extra-icon"
              onClick={handleHintClick}
            />
            <button
              className={`unit-check-answer-button ${selectedOption ? "selected" : ""}`}
              onClick={checkAnswer}
              disabled={!selectedOption}
            >
              {t("checkAnswer")}
            </button>
          </div>
        ) : (
          <>
            {isCorrect ? (
              <div className="unit-result-container">
                <img src={WizardIcon} alt="Wizard" className="unit-icon" />
                <p className="unit-message">{motivationMessage}</p>
                <img src={CorrectAnswerIcon} alt="Correct" className="unit-icon" />
                <p className="unit-correct-message">{t("correctAnswer")}</p>
                <button className="unit-next-button" onClick={handleNextQuestion}>
                  {t("next")}
                </button>
              </div>
            ) : (
              <div className="unit-result-container">
                <img src={WrongIcon} alt="Wrong" className="unit-icon" />
                <p className="unit-message">{motivationMessage}</p>
                <img src={WrongAnswerIcon} alt="Wrong" className="unit-icon" />
                <p className="unit-wrong-message">{t("wrongAnswer")}</p>
                <button className="unit-next-button" onClick={handleNextQuestion}>
                  {t("next")}
                </button>
              </div>
            )}
          </>
        )}

        {hint && (
          <p className="unit-hint-text">
            <span>Hint:</span> {hint}
          </p>
        )}
      </div>
    </div>
  );
};

export default UnitQuiz;
