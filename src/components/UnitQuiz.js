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
// import points from "./images/points.svg";
// import Loading from "./Loading.js"; 

// const UnitQuiz = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { unitId } = useParams();
//   const { t } = useTranslation();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isAnswered, setIsAnswered] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [hint, setHint] = useState("");
//   const [motivationMessage, setMotivationMessage] = useState("");
//   const [answers, setAnswers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const userId = user?.id;
//   const correctSoundEffect = new Audio(correctSound);
//   const wrongSoundEffect = new Audio(wrongSound);

//   useEffect(() => {
//     if (!user || !userId) {
//       console.log('No user, redirecting to login');
//       navigate('/login');
//       return;
//     }

//     if (unitId) {
//       ReactGA.send({ hitType: 'pageview', page: `/quiz/${unitId}` });
//       trackEvent(userId, 'pageview', { page: `/quiz/${unitId}` }, user).catch((error) => {
//         console.error('Failed to track pageview:', error);
//       });
//     }
    
//     trackEvent(userId, 'unit_quiz_started', {
//       category: 'UnitQuiz',
//       label: `Unit ${unitId}`
//     }, user).catch((error) => {
//       console.error('Failed to track unit_quiz_started:', error);
//     });

//     const fetchQuestions = async () => {
//       setIsLoading(true);
//       try {
//         const response = await apiClient.get(`/api/quiz/unit/${userId}/${unitId}`);
//         if (response.status !== 200) {
//           throw new Error("Failed to fetch questions");
//         }
//         if (response.data.success) {
//           setQuestions(response.data.questions || []);
//           if (!response.data.questions || response.data.questions.length === 0) {
//             console.log(`No questions available for unit ${unitId}`);
//           }
//         } else {
//           throw new Error(response.data.message || "Failed to fetch questions");
//         }
//       } catch (error) {
//         console.error("Error fetching unit quiz questions:", error);
//         setQuestions([]);
//         trackEvent(userId, 'fetch_unit_quiz_questions_error', {
//           category: 'Error',
//           label: 'Unit Quiz Questions Fetch Error',
//           error: error.message,
//         }, user).catch((trackError) => {
//           console.error('Failed to track fetch_unit_quiz_questions_error:', trackError);
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [unitId, userId, user, navigate]);

//   useEffect(() => {
//     if (!user || !userId) return;

//     const startTime = Date.now();
//     return () => {
//       const duration = Math.floor((Date.now() - startTime) / 1000);
//       trackEvent(userId, 'time_spent', {
//         category: 'UnitQuiz',
//         label: `Unit ${unitId}`
//       }, user, duration).catch((error) => {
//         console.error('Failed to track time_spent:', error);
//       });
//     };
//   }, [unitId, userId, user]);

//   useEffect(() => {
//     if (!user || !userId) return;

//     let questionStartTime = Date.now();
//     return () => {
//       const duration = Math.floor((Date.now() - questionStartTime) / 1000);
//       trackEvent(userId, 'question_time_spent', {
//         category: 'UnitQuiz',
//         label: `Question ${questions[currentQuestionIndex]?.id} - Unit ${unitId}`
//       }, user, duration).catch((error) => {
//         console.error('Failed to track question_time_spent:', error);
//       });
//     };
//   }, [currentQuestionIndex, unitId, userId, questions, user]);

//   useEffect(() => {
//     if (!user || !userId) return;

//     let timeout;
//     const resetTimeout = () => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         trackEvent(userId, 'inactive', {
//           category: 'UnitQuiz',
//           label: `Unit ${unitId} - Question ${currentQuestionIndex + 1}`,
//           value: 30
//         }, user, 30).catch((error) => {
//           console.error('Failed to track inactive:', error);
//         });
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
//   }, [unitId, currentQuestionIndex, userId, user]);

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
//     }, user).catch((error) => {
//       console.error('Failed to track option_clicked:', error);
//     });
//   };

//   const checkAnswer = () => {
//     if (!selectedOption) return;

//     const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
//     setIsCorrect(isCorrectAnswer);
//     setIsAnswered(true);

//     if (isCorrectAnswer) {
//       correctSoundEffect.play().catch((error) => {
//         console.error("Error playing correct sound:", error);
//       });

//       const background = document.querySelector('.background-animation');
//       background.classList.add('correct-animation');
//       const emojis = ['👏', '🎉'];
//       for (let i = 0; i < 10; i++) {
//         const particle = document.createElement('div');
//         particle.classList.add('animation-particle');
//         particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
//         particle.style.left = `${Math.random() * 100}%`;
//         particle.style.animationDelay = `${Math.random() * 1}s`;
//         background.appendChild(particle);
//       }
//       setTimeout(() => {
//         background.innerHTML = '';
//         background.classList.remove('correct-animation');
//       }, 4000);
//     } else {
//       wrongSoundEffect.play().catch((error) => {
//         console.error("Error playing wrong sound:", error);
//       });

//       document.querySelector('.unit-quiz-box').classList.add('wrong-animation');
//       setTimeout(() => {
//         document.querySelector('.unit-quiz-box').classList.remove('wrong-animation');
//       }, 500);
//     }

//     const newAnswer = {
//       question_id: questions[currentQuestionIndex].id,
//       user_answer: selectedOption,
//       is_correct: isCorrectAnswer,
//     };

//     const updatedAnswers = [...answers, newAnswer];
//     setAnswers(updatedAnswers);

//     localStorage.setItem("unitQuizAnswers", JSON.stringify(updatedAnswers));

//     setMotivationMessage(isCorrectAnswer ? "Correct! Well done!" : "Incorrect. Try again!");

//     trackEvent(userId, isCorrectAnswer ? 'answer_correct' : 'answer_incorrect', {
//       category: 'UnitQuiz',
//       label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
//     }, user).catch((error) => {
//       console.error(`Failed to track ${isCorrectAnswer ? 'answer_correct' : 'answer_incorrect'}:`, error);
//     });
//   };

//   const handleNextQuestion = async () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       trackEvent(userId, 'next_question', {
//         category: 'UnitQuiz',
//         label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
//       }, user).catch((error) => {
//         console.error('Failed to track next_question:', error);
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
//       }, user).catch((error) => {
//         console.error('Failed to track unit_quiz_completed:', error);
//       });

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
//     }, user).catch((error) => {
//       console.error('Failed to track hint_used:', error);
//     });
//   };

//   const handleExit = () => {
//     trackEvent(userId, 'exit_unit_quiz', {
//       category: 'UnitQuiz',
//       label: `Unit ${unitId} - Question ${currentQuestionIndex + 1}`
//     }, user).catch((error) => {
//       console.error('Failed to track exit_unit_quiz:', error);
//     });
//     navigate("/lessons");
//   };

//   if (isLoading) {
//     return <Loading />;
//   }

//   if (questions.length === 0) {
//     return <PyMagicRunner />;
//   }

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div className="unit-quiz-container">
//       <div className="background-animation"></div>
//       <button className="unit-exit-button" onClick={handleExit}>
//         <img src={ExitIcon} alt="Exit" className="unit-exit-icon" />
//       </button>

//       <div className="unit-quiz-box">
//         <h1 className="unit-quiz-header">{t("quiz.quiz")} {t("quiz.unit")} {unitId}</h1>
        
//         <div className="quiz-points">
//           {t("quiz.question")} {currentQuestionIndex + 1} / {questions.length}
//           <span className='qestion-points'>
//             {currentQuestion.points}
//             <img src={points} alt="points icon" className="userpointstow" />
//           </span>
//         </div>

//         <p className="unit-quiz-question">{currentQuestion.question}</p>

//         <div className="unit-quiz-options">
//           {currentQuestion.options.map((option, index) => (
//             <button
//               key={index}
//               className={`unit-option-button 
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
//           <div className="unit-quiz-footer">
//             <img
//               src={HintIcon}
//               alt="Hint"
//               className="unit-extra-icon"
//               onClick={handleHintClick}
//             />
//             <button
//               className={`unit-check-answer-button ${selectedOption ? "selected" : ""}`}
//               onClick={checkAnswer}
//               disabled={!selectedOption}
//             >
//               {t("quiz.checkAnswer")}
//             </button>
//           </div>
//         ) : (
//           <>
//             {isCorrect ? (
//               <div className="unit-result-container">
//                 <img src={WizardIcon} alt="Wizard" className="unit-icon" />
//                 <p className="unit-message">{motivationMessage}</p>
//                 <img src={CorrectAnswerIcon} alt="Correct" className="unit-icon" />
//                 <p className="unit-correct-message">{t("quiz.correctAnswer")}</p>
//                 <button className="unit-next-button" onClick={handleNextQuestion}>
//                   {t("quiz.next")}
//                 </button>
//               </div>
//             ) : (
//               <div className="unit-result-container">
//                 <img src={WrongIcon} alt="Wrong" className="unit-icon" />
//                 <p className="unit-message">{motivationMessage}</p>
//                 <img src={WrongAnswerIcon} alt="Wrong" className="unit-icon" />
//                 <p className="unit-wrong-message">{t("quiz.wrongAnswer")}</p>
//                 <button className="unit-next-button" onClick={handleNextQuestion}>
//                   {t("quiz.next")}
//                 </button>
//               </div>
//             )}
//           </>
//         )}

//         {hint && (
//           <p className="unit-hint-text">
//             <span>{t("quiz.Hint")}</span> {hint}
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
import PyMagicRunner from './Pymagic_runnergame';
import correctSound from '../Sound/correct3-95630.mp3';
import wrongSound from '../Sound/wronganswer-37702.mp3';
import points from "./images/points.svg";
import Loading from "./Loading.js"; 

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
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // حالة جديدة لتتبع المعالجة
  const userId = user?.id;
  const correctSoundEffect = new Audio(correctSound);
  const wrongSoundEffect = new Audio(wrongSound);

  useEffect(() => {
    if (!user || !userId) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (unitId) {
      ReactGA.send({ hitType: 'pageview', page: `/quiz/${unitId}` });
      trackEvent(userId, 'pageview', { page: `/quiz/${unitId}` }, user).catch((error) => {
        console.error('Failed to track pageview:', error);
      });
    }
    
    trackEvent(userId, 'unit_quiz_started', {
      category: 'UnitQuiz',
      label: `Unit ${unitId}`
    }, user).catch((error) => {
      console.error('Failed to track unit_quiz_started:', error);
    });

    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/api/quiz/unit/${userId}/${unitId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch questions");
        }
        if (response.data.success) {
          setQuestions(response.data.questions || []);
          if (!response.data.questions || response.data.questions.length === 0) {
            console.log(`No questions available for unit ${unitId}`);
          }
        } else {
          throw new Error(response.data.message || "Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching unit quiz questions:", error);
        setQuestions([]);
        trackEvent(userId, 'fetch_unit_quiz_questions_error', {
          category: 'Error',
          label: 'Unit Quiz Questions Fetch Error',
          error: error.message,
        }, user).catch((trackError) => {
          console.error('Failed to track fetch_unit_quiz_questions_error:', trackError);
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [unitId, userId, user, navigate]);

  useEffect(() => {
    if (!user || !userId) return;

    const startTime = Date.now();
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      trackEvent(userId, 'time_spent', {
        category: 'UnitQuiz',
        label: `Unit ${unitId}`
      }, user, duration).catch((error) => {
        console.error('Failed to track time_spent:', error);
      });
    };
  }, [unitId, userId, user]);

  useEffect(() => {
    if (!user || !userId) return;

    let questionStartTime = Date.now();
    return () => {
      const duration = Math.floor((Date.now() - questionStartTime) / 1000);
      trackEvent(userId, 'question_time_spent', {
        category: 'UnitQuiz',
        label: `Question ${questions[currentQuestionIndex]?.id} - Unit ${unitId}`
      }, user, duration).catch((error) => {
        console.error('Failed to track question_time_spent:', error);
      });
    };
  }, [currentQuestionIndex, unitId, userId, questions, user]);

  useEffect(() => {
    if (!user || !userId) return;

    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        trackEvent(userId, 'inactive', {
          category: 'UnitQuiz',
          label: `Unit ${unitId} - Question ${currentQuestionIndex + 1}`,
          value: 30
        }, user, 30).catch((error) => {
          console.error('Failed to track inactive:', error);
        });
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
  }, [unitId, currentQuestionIndex, userId, user]);

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
    }, user).catch((error) => {
      console.error('Failed to track option_clicked:', error);
    });
  };

  const checkAnswer = async () => {
    if (!selectedOption || isProcessing) return;

    setIsProcessing(true);
    let isCorrectAnswer; // Define here to be accessible in catch
    try {
      isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
      setIsCorrect(isCorrectAnswer);
      setIsAnswered(true);

      if (isCorrectAnswer) {
        correctSoundEffect.play().catch((error) => {
          console.error("Error playing correct sound:", error);
        });

        const background = document.querySelector('.background-animation');
        background.classList.add('correct-animation');
        const emojis = ['👏', '🎉'];
        for (let i = 0; i < 10; i++) {
          const particle = document.createElement('div');
          particle.classList.add('animation-particle');
          particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 1}s`;
          background.appendChild(particle);
        }
        setTimeout(() => {
          background.innerHTML = '';
          background.classList.remove('correct-animation');
        }, 4000);
      } else {
        wrongSoundEffect.play().catch((error) => {
          console.error("Error playing wrong sound:", error);
        });

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

      await trackEvent(userId, isCorrectAnswer ? 'answer_correct' : 'answer_incorrect', {
        category: 'UnitQuiz',
        label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
      }, user);
    } catch (error) {
      console.error(`Failed to track ${isCorrectAnswer ? 'answer_correct' : 'answer_incorrect'}:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextQuestion = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (currentQuestionIndex < questions.length - 1) {
        await trackEvent(userId, 'next_question', {
          category: 'UnitQuiz',
          label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
        }, user);

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
        await trackEvent(userId, 'unit_quiz_completed', {
          category: 'UnitQuiz',
          label: `Unit ${unitId}`,
          value: Math.round(score)
        }, user);

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
      }
    } catch (error) {
      console.error("Error submitting unit quiz:", error);
      navigate("/unit-quiz-complete");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHintClick = () => {
    setHint(questions[currentQuestionIndex].hint);
    trackEvent(userId, 'hint_used', {
      category: 'UnitQuiz',
      label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId}`
    }, user).catch((error) => {
      console.error('Failed to track hint_used:', error);
    });
  };

  const handleExit = () => {
    trackEvent(userId, 'exit_unit_quiz', {
      category: 'UnitQuiz',
      label: `Unit ${unitId} - Question ${currentQuestionIndex + 1}`
    }, user).catch((error) => {
      console.error('Failed to track exit_unit_quiz:', error);
    });
    navigate("/lessons");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (questions.length === 0) {
    return <PyMagicRunner />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="unit-quiz-container">
      <div className="background-animation"></div>
      <button className="unit-exit-button" onClick={handleExit}>
        <img src={ExitIcon} alt="Exit" className="unit-exit-icon" />
      </button>

      <div className="unit-quiz-box">
        <h1 className="unit-quiz-header">{t("quiz.quiz")} {t("quiz.unit")} {unitId}</h1>
        
        <div className="quiz-points">
          {t("quiz.question")} {currentQuestionIndex + 1} / {questions.length}
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
              disabled={!selectedOption || isProcessing}
            >
              {t("quiz.checkAnswer")}
            </button>
          </div>
        ) : (
          <>
            {isCorrect ? (
              <div className="unit-result-container">
                <img src={WizardIcon} alt="Wizard" className="unit-icon" />
                <p className="unit-message">{motivationMessage}</p>
                <img src={CorrectAnswerIcon} alt="Correct" className="unit-icon" />
                <p className="unit-correct-message">{t("quiz.correctAnswer")}</p>
                <button
                  className="unit-next-button"
                  onClick={handleNextQuestion}
                  disabled={isProcessing}
                >
                  {t("quiz.next")}
                </button>
              </div>
            ) : (
              <div className="unit-result-container">
                <img src={WrongIcon} alt="Wrong" className="unit-icon" />
                <p className="unit-message">{motivationMessage}</p>
                <img src={WrongAnswerIcon} alt="Wrong" className="unit-icon" />
                <p className="unit-wrong-message">{t("quiz.wrongAnswer")}</p>
                <button
                  className="unit-next-button"
                  onClick={handleNextQuestion}
                  disabled={isProcessing}
                >
                  {t("quiz.next")}
                </button>
              </div>
            )}
          </>
        )}

        {hint && (
          <p className="unit-hint-text">
            <span>{t("quiz.Hint")}</span> {hint}
          </p>
        )}
      </div>
    </div>
  );
};

export default UnitQuiz;