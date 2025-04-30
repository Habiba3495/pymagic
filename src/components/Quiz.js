import PyMagicRunner from './Pymagic_runnergame';
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
import Loading from "./Loading.js"; 

const Quiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { unitId, lessonId } = useParams();
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

  // Fetching Questions
  useEffect(() => {
    if (!user || !userId) {
      console.log('No user, skipping pageview and quiz_started tracking');
    } else {
      trackEvent(userId, 'pageview', { page: `/quiz/${unitId}/${lessonId}` }, user).catch((error) => {
        console.error('Failed to track pageview:', error);
      });
      trackEvent(userId, 'quiz_started', {
        category: "Quiz",
        label: `Unit ${unitId} - Lesson ${lessonId}`,
      }, user).catch((error) => {
        console.error('Failed to track quiz_started:', error);
      });
    }

    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        if (!user || !userId) {
          console.log('No user, skipping fetch questions');
          setIsLoading(false);
          return;
        }

        const response = await apiClient.get(`/api/quiz/lesson/${lessonId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch questions");
        }
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [lessonId, unitId, user, userId]);

  // Track time per question
  useEffect(() => {
    let questionStartTime = Date.now();
    return () => {
      if (!user || !userId) {
        console.log('No user, skipping question_time_spent tracking');
        return;
      }

      const duration = Math.floor((Date.now() - questionStartTime) / 1000);
      if (questions[currentQuestionIndex]?.id) {
        trackEvent(userId, 'question_time_spent', {
          category: 'Quiz',
          label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId} - Lesson ${lessonId}`,
        }, user, duration).catch((error) => {
          console.error('Failed to track question_time_spent:', error);
        });
      }
    };
  }, [currentQuestionIndex, lessonId, unitId, user, userId, questions]);

  // Track inactivity
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!user || !userId) {
          console.log('No user, skipping inactive tracking');
          return;
        }

        trackEvent(userId, 'inactive', {
          category: 'Quiz',
          label: `Unit ${unitId} - Lesson ${lessonId} - Question ${currentQuestionIndex + 1}`,
          value: 30,
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
  }, [lessonId, unitId, currentQuestionIndex, user, userId]);

  // Handle Option Click
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsAnswered(false);
    setIsCorrect(null);
    setHint("");
    setMotivationMessage("");

    if (!user || !userId) {
      console.log('No user, skipping option_clicked tracking');
      return;
    }

    trackEvent(userId, 'option_clicked', {
      category: 'Quiz',
      label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId} - Lesson ${lessonId}`,
      value: option,
    }, user).catch((error) => {
      console.error('Failed to track option_clicked:', error);
    });
  };

  // Check Answer and what to do if correct or wrong
  const checkAnswer = () => {
    if (!selectedOption) return;

    const isCorrectAnswer = selectedOption === questions[currentQuestionIndex].correct_answer;
    setIsCorrect(isCorrectAnswer);
    setIsAnswered(true);

    // Play animations and sounds
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

    if (!user || !userId) {
      console.log('No user, skipping answer tracking');
      return;
    }

    trackEvent(userId, isCorrectAnswer ? 'answer_correct' : 'answer_incorrect', {
      category: 'Quiz',
      label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId} - Lesson ${lessonId}`,
    }, user).catch((error) => {
      console.error(`Failed to track ${isCorrectAnswer ? 'answer_correct' : 'answer_incorrect'}:`, error);
    });
  };

  // Next Question
  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      if (user && userId) {
        trackEvent(userId, 'next_question', {
          category: 'Quiz',
          label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId} - Lesson ${lessonId}`,
        }, user).catch((error) => {
          console.error('Failed to track next_question:', error);
        });
      }

      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setHint("");
      setMotivationMessage("");
    } else {
      const score = answers.filter((a) => a.is_correct).length / answers.length * 100;
      if (user && userId) {
        trackEvent(userId, 'quiz_completed', {
          category: 'Quiz',
          label: `Unit ${unitId} - Lesson ${lessonId}`,
          value: Math.round(score),
        }, user).catch((error) => {
          console.error('Failed to track quiz_completed:', error);
        });
      }

      if (!user || !userId) {
        console.log('No user, redirecting to login');
        navigate("/login");
        return;
      }

      try {
        const response = await apiClient.post('/api/quiz/submit', {
          user_id: userId,
          lesson_id: lessonId,
          unit_id: unitId,
          answers: answers,
        });

        const data = response.data;
        if (data.success) {
          localStorage.removeItem('quizAnswers');
          localStorage.setItem('lastStudentQuizId', data.student_quiz_id);

          const enhancedQuizData = {
            ...data,
            unit_id: unitId,
            lesson_id: lessonId,
          };

          navigate("/quiz-complete", {
            state: {
              quizData: enhancedQuizData,
              studentQuizId: data.student_quiz_id,
              total_user_points: data.total_user_points,
              achievements: data.achievements || [],
            },
          });
        } else {
          console.error("Error submitting quiz:", data.message);
          navigate("/quiz-complete", {
            state: {
              quizData: { ...data, unit_id: unitId, lesson_id: lessonId },
              studentQuizId: data.student_quiz_id || null,
            },
          });
        }
      } catch (error) {
        console.error("Error submitting quiz:", error);
        navigate("/quiz-complete", {
          state: {
            quizData: {
              unit_id: unitId,
              lesson_id: lessonId,
              error: error.message,
            },
            studentQuizId: null,
          },
        });
      }
    }
  };

  // Hint
  const handleHintClick = () => {
    setHint(questions[currentQuestionIndex].hint);
    if (!user || !userId) {
      console.log('No user, skipping hint_used tracking');
      return;
    }

    trackEvent(userId, 'hint_used', {
      category: 'Quiz',
      label: `Question ${questions[currentQuestionIndex].id} - Unit ${unitId} - Lesson ${lessonId}`,
    }, user).catch((error) => {
      console.error('Failed to track hint_used:', error);
    });
  };

  // Exit Quiz
  const handleExit = () => {
    if (!user || !userId) {
      console.log('No user, skipping exit_quiz tracking');
      navigate("/lessons");
      return;
    }

    trackEvent(userId, 'exit_quiz', {
      category: 'Quiz',
      label: `Unit ${unitId} - Lesson ${lessonId} - Question ${currentQuestionIndex + 1}`,
    }, user).catch((error) => {
      console.error('Failed to track exit_quiz:', error);
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
    <div className="quiz-container">
      <div className="background-animation"></div>
      <button className="exit-button" onClick={handleExit}>
        <img src={ExitIcon} alt="Exit" className="exit-icon" />
      </button>

      <div className="quiz-box">
        <p className="quiz-header">
          {t("quiz.quiz")} {t("unit")} {unitId} - {t("quiz.lesson")} {lessonId}
        </p>

        <div className="quiz-points">
          {t("quiz.question")} {currentQuestionIndex + 1} / {questions.length}
          <span className='qestion-points'>
            {currentQuestion.points}
            <img src={points} alt="points icon" className="userpointstow" />
          </span>
        </div>

        <p className="quiz-question">{currentQuestion.question}</p>

        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`qoption-button 
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
              {t("quiz.checkAnswer")}
            </button>
          </div>
        ) : (
          <>
            {isCorrect ? (
              <div className="result-container">
                <img src={WizardIcon} alt="Wizard" className="icon" />
                <p className="message">{motivationMessage}</p>
                <img src={CorrectAnswerIcon} alt="Correct" className="icon" />
                <p className="correct-message">{t("quiz.correctAnswer")}</p>
                <button className="next-buttonc" onClick={handleNextQuestion}>
                  {t("quiz.next")}
                </button>
              </div>
            ) : (
              <div className="result-container">
                <img src={WrongIcon} alt="Wrong" className="icon" />
                <p className="message">{motivationMessage}</p>
                <img src={WrongAnswerIcon} alt="Wrong" className="icon" />
                <p className="wrong-message">{t("quiz.wrongAnswer")}</p>
                <button className="next-buttonw" onClick={handleNextQuestion}>
                  {t("quiz.next")}
                </button>
              </div>
            )}
          </>
        )}

        {hint && <p className="hint-text"><span>{t("quiz.Hint")}</span> {hint}</p>}
      </div>
    </div>
  );
};

export default Quiz;