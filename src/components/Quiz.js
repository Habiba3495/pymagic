// <img src={points} alt="points icon" className="question points" />
import PyMagicRunner from './Pymagic_runnergame'; // تأكد من المسار الصحيح للملف
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Quiz.css";
import ExitIcon from "./images/Exit iconsvg.svg";
import WizardIcon from "./images/Correct Potion.svg";
import CorrectAnswerIcon from "./images/Correct check.svg";
import WrongIcon from "./images/Wrong potion.svg";
import WrongAnswerIcon from "./images/Wrong icon.svg";
import HintIcon from "./images/Hint icon.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import { useTranslation } from "react-i18next";
import trackEvent from '../utils/trackEvent';
import correctSound from '../Sound/correct3-95630.mp3';
import wrongSound from '../Sound/wronganswer-37702.mp3';
import points from "./images/points.svg";

const Quiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { unitId, lessonId } = useParams(); // Added unitId
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
  const userId = user?.id;
  const correctSoundEffect = new Audio(correctSound);
  const wrongSoundEffect = new Audio(wrongSound);

  //Fetching Questions
  useEffect(() => {
    trackEvent(userId, 'pageview', { page: `/quiz/${unitId}/${lessonId}` });
    trackEvent(userId, 'quiz_started', {
      category: "Quiz",
      label: `Unit ${unitId} - Lesson ${lessonId}`
    });
  
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/api/quiz/lesson/${lessonId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch questions");
        }
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        setQuestions([]); // null to display PyMagicRunner
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchQuestions();
  }, [lessonId, unitId, userId]);

  // Track time per question
  useEffect(() => {
    let questionStartTime = Date.now();
    return () => {
      const duration = Math.floor((Date.now() - questionStartTime) / 1000);
      if (questions[currentQuestionIndex]?.id) {
        trackEvent(userId, 'question_time_spent', {
          category: 'Quiz',
          label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId} - Lesson ${lessonId}` // Updated label
        }, duration);
      }
    };
  }, [currentQuestionIndex, lessonId, unitId, userId, questions]); // Added unitId

  // Track inactivity
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        trackEvent(userId, 'inactive', {
          category: 'Quiz',
          label: `Unit ${unitId} - Lesson ${lessonId} - Question ${currentQuestionIndex + 1}`, // Updated label
          value: 30  //30 sec
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
  }, [lessonId, unitId, currentQuestionIndex, userId]); // Added unitId

 //Handle Option Click
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsAnswered(false);
    setIsCorrect(null);
    setHint("");
    setMotivationMessage("");

    trackEvent(userId, 'option_clicked', {
      category: 'Quiz',
      label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId} - Lesson ${lessonId}`, // Updated label
      value: option
    });
  };

 //Check Answer and what to do if correct or wrong

  // const checkAnswer = () => {
  //   if (!selectedOption) return;

  //   const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
  //   setIsCorrect(isCorrectAnswer);
  //   setIsAnswered(true);

  const checkAnswer = () => {
    if (!selectedOption) return;
  
    const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
    setIsCorrect(isCorrectAnswer);
    setIsAnswered(true);
  
    // تشغيل التأثيرات الحركية والصوت
    if (isCorrectAnswer) {
      // تشغيل صوت الإجابة الصحيحة
      const correctSoundEffect = new Audio(correctSound);
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
      const wrongSoundEffect = new Audio(wrongSound);
      wrongSoundEffect.play().catch((error) => {
        console.error("Error playing wrong sound:", error);
      });
  
      // اهتزاز الصندوق عند الإجابة الخاطئة
      document.querySelector('.quiz-box').classList.add('wrong-animation');
      setTimeout(() => {
        document.querySelector('.quiz-box').classList.remove('wrong-animation');
      }, 500);
    }
  
    const newAnswer = {
      question_id: questions[currentQuestionIndex].id,
      selected_answer: selectedOption,
      is_correct: isCorrectAnswer,
    };
  
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    localStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));
  
    setMotivationMessage(isCorrectAnswer ? "Correct! Well done!" : "Incorrect. Try again!");
  
    trackEvent(userId, isCorrectAnswer ? 'answer_correct' : 'answer_incorrect', {
      category: 'Quiz',
      label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId} - Lesson ${lessonId}`
    });
  };


   // next quastion
  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      trackEvent(userId, 'next_question', {
        category: 'Quiz',
        label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId} - Lesson ${lessonId}` // Updated label
      });

      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setHint("");
      setMotivationMessage("");
    } else {
      const score = answers.filter(a => a.is_correct).length / answers.length * 100;
      trackEvent(userId, 'quiz_completed', {
        category: 'Quiz',
        label: `Unit ${unitId} - Lesson ${lessonId}`, // Updated label
        value: Math.round(score)
      });

      localStorage.setItem("quizAnswers", JSON.stringify(answers));

      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await apiClient.post('/api/quiz/submit', {
          user_id: userId,
          lesson_id: lessonId,
          unit_id: unitId, // Added unit_id
          answers: answers,
        });

        const data = response.data;
        if (data.success) {
          navigate("/quiz-complete", {
            state: {
              quizData: data,
              studentQuizId: data.student_quiz_id,
              total_user_points: data.total_user_points,
              achievements: data.achievements || [],
            },
          });
        } else {
          console.error("Error submitting quiz:", data.message);
          navigate("/quiz-complete", { state: { quizData: data } });
        }
      } catch (error) {
        console.error("Error submitting quiz:", error);
        navigate("/quiz-complete");
      }
    }
  };
 
  //hint
  const handleHintClick = () => {
    setHint(questions[currentQuestionIndex].hint);
    trackEvent(userId, 'hint_used', {
      category: 'Quiz',
      label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId} - Lesson ${lessonId}` // Updated label
    });
  };

  //exit quiz
  const handleExit = () => {
    trackEvent(userId, 'exit_quiz', {
      category: 'Quiz',
      label: `Unit ${unitId} - Lesson ${lessonId} - Question ${currentQuestionIndex + 1}` // Updated label
    });
    navigate("/lessons");
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (isLoading) {
    return <div className="quiz-loading">Loading quiz questions...</div>;
  }
 

  // ////////// hn8erha
  // if (isLoading) {
  //   // عند تحميل الأسئلة، يظهر PyMagicRunner
  //   return <PyMagicRunner />;
  // }
  

  // if (questions.length === 0) {
  //   return <div className="quiz-error">No questions available for this quiz.</div>;
  // }

  if (questions.length === 0) {
    // عند تحميل الأسئلة، يظهر PyMagicRunner
    return <PyMagicRunner />;
  }
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="background-animation"></div> {/* عنصر الخلفية الجديد */}
      <button className="exit-button" onClick={handleExit}>
        <img src={ExitIcon} alt="Exit" className="exit-icon" />
      </button>
  
      <div className="quiz-box">
        <h1 className="quiz-header">
          {t("quiz")} {t("unit")} {unitId} - {t("lesson")} {lessonId}
        </h1>
        
        <p className="quiz-question">{currentQuestion.question}</p>
  
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-button 
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
          <div className="quiz-footer">
            <img
              src={HintIcon}
              alt="Hint"
              className="extra-icon"
              onClick={handleHintClick}
            />
            <button
              className={`check-answer-button ${selectedOption ? "selected" : ""}`}
              onClick={checkAnswer}
              disabled={!selectedOption}
            >
              {t("checkAnswer")}
            </button>
          </div>
        ) : (
          <>
            {isCorrect ? (
              <div className="result-container">
                <img src={WizardIcon} alt="Wizard" className="icon" />
                <p className="message">{motivationMessage}</p>
                <img src={CorrectAnswerIcon} alt="Correct" className="icon" />
                <p className="correct-message">{t("correctAnswer")}</p>
                <button className="next-button" onClick={handleNextQuestion}>
                  {t("next")}
                </button>
              </div>
            ) : (
              <div className="result-container">
                <img src={WrongIcon} alt="Wrong" className="icon" />
                <p className="message">{motivationMessage}</p>
                <img src={WrongAnswerIcon} alt="Wrong" className="icon" />
                <p className="wrong-message">{t("wrongAnswer")}</p>
                <button className="next-button" onClick={handleNextQuestion}>
                  {t("next")}
                </button>
              </div>
            )}
          </>
        )}
  
        {hint && <p className="hint-text"><span>Hint:</span> {hint}</p>}
      </div>
    </div>
  );
  
};

export default Quiz;