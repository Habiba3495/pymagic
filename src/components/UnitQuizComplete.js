// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import bookIcon from "./images/Score icon.svg";
// import pointsIcon from "./images/points.svg";
// import "./QuizComplete.css";
// import apiClient from '../services';
// import { useTranslation } from "react-i18next";
// import { useAuth } from '../context/AuthContext';
// import trackEvent from '../utils/trackEvent';

// const UnitQuizComplete = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [quizData, setQuizData] = useState(state?.quizData || null);
//   const [loading, setLoading] = useState(false);
//   const [motivationalMessage, setMotivationalMessage] = useState("Keep going, wizard!");
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [feedbackScore, setFeedbackScore] = useState(null);
//   const [feedbackComment, setFeedbackComment] = useState("");
//   const [nextAction, setNextAction] = useState(null); // 'review' or 'continue'
//   const { t } = useTranslation();
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user?.id) {
//       trackEvent(user.id, 'pageview', {
//         page: '/unit-quiz-complete',
//         category: 'Navigation',
//       });
//     }
  
//     const fetchQuizData = async () => {
//       if (!quizData || !state?.studentQuizId) {
//         const storedAnswers = localStorage.getItem('quizAnswers');
//         const storedQuizId = localStorage.getItem('lastStudentQuizId');
//         if (storedAnswers && storedQuizId) {
//           const answers = JSON.parse(storedAnswers);
//           const score = answers.filter((ans) => ans.is_correct).length;
//           const newQuizData = {
//             score: score,
//             answers: answers,
//             earned_points: score * 10,
//             is_passed: score >= answers.length / 2,
//           };
//           setQuizData(newQuizData);
//           await fetchMotivationalMessage(score, answers.length);
  
//           if (user?.id) {
//             trackEvent(user.id, 'quiz_completed', {
//               category: 'Quiz',
//               label: 'Local Storage Quiz',
//               value: score,
//               total_questions: answers.length,
//               is_passed: newQuizData.is_passed,
//               earned_points: newQuizData.earned_points,
//             });
//           }
//         } else if (user?.id && state?.quizData?.unit_id) {
//           // Fetch the latest unit quiz for the user
//           try {
//             const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
//             const latestQuiz = response.data.progress.find(
//               (quiz) => quiz.unit_id === state.quizData.unit_id && !quiz.lesson_id
//             );
//             if (latestQuiz) {
//               setQuizData({
//                 ...state.quizData,
//                 studentQuizId: latestQuiz.id,
//               });
//               localStorage.setItem('lastStudentQuizId', latestQuiz.id);
//             }
//           } catch (error) {
//             console.error('Error fetching latest quiz:', error);
//           }
//         }
//       } else {
//         await fetchMotivationalMessage(quizData.score, quizData.total_questions || quizData.answers.length);
  
//         if (user?.id) {
//           trackEvent(user.id, 'quiz_completed', {
//             category: 'Quiz',
//             label: 'Unit Quiz',
//             value: quizData.score,
//             total_questions: quizData.total_questions || quizData.answers.length,
//             is_passed: quizData.is_passed,
//             earned_points: quizData.earned_points,
//           });
//         }
//       }
//     };
  
//     fetchQuizData();
//   }, [quizData, state, user]);

//   const fetchMotivationalMessage = async (score, total) => {
//     try {
//       const language = navigator.language || 'en';
//       const response = await apiClient.get('/api/motivation', {
//         params: { score, total },
//         headers: { 'Accept-Language': language },
//       });

//       if (response.data.success) {
//         setMotivationalMessage(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching motivational message:", error);
//       setMotivationalMessage("Keep going, wizard!");
//     }
//   };

//   const handleReviewClick = () => {
//     setNextAction('review');
//     setShowFeedbackModal(true);
    
//     if (user?.id) {
//       trackEvent(user.id, 'quiz_review_initiated', {
//         category: 'Quiz',
//         label: 'Review Button Clicked'
//       });
//     }
//   };

//   const handleContinueClick = () => {
//     setNextAction('continue');
//     setShowFeedbackModal(true);
    
//     if (user?.id) {
//       trackEvent(user.id, 'quiz_continue_clicked', {
//         category: 'Navigation',
//         label: 'Continue Button Clicked'
//       });
//     }
//   };

//   const proceedAfterFeedback = () => {
//     if (nextAction === 'review') {
//       performReview();
//     } else {
//       navigate("/lessons");
//     }
//   };

//   const performReview = async () => {
//     setLoading(true);
//     try {
//       let studentQuizId = state?.studentQuizId || localStorage.getItem('lastStudentQuizId');
//       if (!studentQuizId && user?.id && quizData?.unit_id) {
//         const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
//         const latestQuiz = response.data.progress.find(
//           (quiz) => quiz.unit_id === quizData.unit_id && !quiz.lesson_id
//         );
//         if (latestQuiz) {
//           studentQuizId = latestQuiz.id;
//           localStorage.setItem('lastStudentQuizId', latestQuiz.id);
//         }
//       }
  
//       if (!studentQuizId) {
//         throw new Error('Student Quiz ID is missing for review');
//       }
  
//       const response = await apiClient.get(`/api/quiz/review/${studentQuizId}`);
//       if (response.status !== 200) {
//         throw new Error('Failed to fetch review data');
//       }
  
//       const data = response.data;
//       if (data.success) {
//         if (user?.id) {
//           trackEvent(user.id, 'quiz_review_accessed', {
//             category: 'Quiz',
//             label: 'Review Data Loaded',
//             question_count: data.reviewData?.answers?.length || 0,
//           });
//         }
//         navigate('/quiz-review', { state: { quizData: data.reviewData } });
//       } else {
//         navigate('/quiz-review', { state: { quizData: createFallbackReviewData(quizData) } });
//       }
//     } catch (error) {
//       console.error('Error fetching review data:', error);
//       if (user?.id) {
//         trackEvent(user.id, 'quiz_review_error', {
//           category: 'Error',
//           label: 'Review Data Error',
//           error: error.message,
//         });
//       }
//       navigate('/quiz-review', { state: { quizData: createFallbackReviewData(quizData) } });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createFallbackReviewData = (quizData) => ({
//     score: quizData.score || 0,
//     total_questions: quizData.total_questions || quizData.answers?.length || 0,
//     earned_points: quizData.earned_points || 0,
//     is_passed: quizData.is_passed || false,
//     answers: (quizData.answers || []).map(answer => ({
//       question_id: answer.question_id || 1,
//       question: answer.question || "Question not available",
//       options: answer.options || [],
//       correct_answer: answer.correct_answer || "Answer not available",
//       user_answer: answer.user_answer || "No answer provided",
//       isCorrect: answer.isCorrect || false,
//     })),
//   });

//   const submitFeedback = async () => {
//     if (!feedbackScore) {
//       alert(t('selectFeedbackScore', { defaultValue: 'Please select a feedback score!' }));
//       return;
//     }
  
//     let studentQuizId = state?.studentQuizId || localStorage.getItem('lastStudentQuizId');
//     if (!studentQuizId && user?.id && quizData?.unit_id) {
//       try {
//         const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
//         const latestQuiz = response.data.progress.find(
//           (quiz) => quiz.unit_id === quizData.unit_id && !quiz.lesson_id
//         );
//         if (latestQuiz) {
//           studentQuizId = latestQuiz.id;
//           localStorage.setItem('lastStudentQuizId', latestQuiz.id);
//         }
//       } catch (error) {
//         console.error('Error fetching latest quiz for feedback:', error);
//       }
//     }
  
//     if (!studentQuizId) {
//       alert(t('missingQuizId', { defaultValue: 'Student Quiz ID is missing. Please try again.' }));
//       console.error('Student Quiz ID is undefined.');
//       navigate('/lessons');
//       return;
//     }
  
//     const userId = user?.id;
//     if (!userId) {
//       console.error('User is not authenticated');
//       navigate('/login');
//       return;
//     }
  
//     try {
//       trackEvent(userId, 'quiz_feedback_submitted', {
//         category: 'Feedback',
//         label: 'Quiz Feedback Submitted',
//         value: feedbackScore,
//         comment_length: feedbackComment.length,
//         has_comment: feedbackComment.length > 0,
//         next_action: nextAction,
//       });
  
//       const response = await apiClient.post('/api/feedback/submit', {
//         user_id: userId,
//         student_quiz_id: studentQuizId,
//         feedback_score: feedbackScore,
//         comment: feedbackComment || '',
//       });
  
//       if (response.data.success) {
//         setShowFeedbackModal(false);
//         proceedAfterFeedback();
//       } else {
//         console.error('Failed to submit feedback:', response.data.message);
//         proceedAfterFeedback();
//       }
//     } catch (error) {
//       if (user?.id) {
//         trackEvent(user.id, 'quiz_feedback_error', {
//           category: 'Error',
//           label: 'Feedback Submission Error',
//           error: error.response?.data?.message || error.message,
//         });
//       }
//       console.error('Error submitting feedback:', error);
//       proceedAfterFeedback();
//     }
//   };

//   const skipFeedback = () => {
//     if (user?.id) {
//       trackEvent(user.id, 'quiz_feedback_skipped', {
//         category: 'Feedback',
//         label: 'Feedback Skipped',
//         next_action: nextAction
//       });
//     }
//     setShowFeedbackModal(false);
//     proceedAfterFeedback();
//   };

//   if (!quizData) return <div>Loading...</div>;

//   return (
//     <div className="quizcomplete">
//       <div className="quiz-complete-container">
//         <img src={bookIcon} alt="Book Icon" className="book" />
//         <h1 className="title">{t("profileUnitCompletedGeneric")}</h1>
//         <div className="score-points">
//           <div className="score-container">
//             <div className="score-circle">
//               <p>{quizData.score} / {quizData.total_questions || quizData.answers.length}</p>
//             </div>
//             <p className="motivation-text">{motivationalMessage}</p>
//           </div>
//           <div className="points-container">
//             <img src={pointsIcon} alt="Points Icon" className="points-icon" />
//             <p className="points-text">{quizData.earned_points} {t("profilePointsEarned")}</p>
//           </div>
//         </div>
//         <div className="buttons-container">
//           <button 
//             className="review-btn" 
//             onClick={handleReviewClick}
//             disabled={loading}
//           >
//             {t("review")}
//           </button>
//           <button 
//             className="continue-btn" 
//             onClick={handleContinueClick}
//           >
//             {t("continue")}
//           </button>
//         </div>
//       </div>

//       {showFeedbackModal && (
//         <div className="feedback-modal-overlay">
//           <div className="feedback-modal">
//             <h3>{t("feedbackTitle", { defaultValue: "How was your experience?" })}</h3>
//             <div className="emoji-container">
//               {[1, 2, 3, 4, 5].map(score => (
//                 <span
//                   key={score}
//                   className={`emoji ${feedbackScore === score ? 'selected' : ''}`}
//                   onClick={() => {
//                     setFeedbackScore(score);
//                     if (user?.id) {
//                       trackEvent(user.id, 'quiz_feedback_score_selected', {
//                         category: 'Feedback',
//                         label: 'Feedback Score Selected',
//                         value: score
//                       });
//                     }
//                   }}
//                 >
//                   {score === 1 && "😢"}
//                   {score === 2 && "🙁"}
//                   {score === 3 && "😐"}
//                   {score === 4 && "😊"}
//                   {score === 5 && "😍"}
//                 </span>
//               ))}
//             </div>
//             <textarea
//               className="feedback-comment"
//               placeholder={t("feedbackCommentPlaceholder", { defaultValue: "Add your comment here..." })}
//               value={feedbackComment}
//               onChange={(e) => setFeedbackComment(e.target.value)}
//               rows="4"
//             />
//             <div className="feedback-buttons">
//               <button onClick={skipFeedback} className="skip-btn">
//                 {t("skip", { defaultValue: "Skip" })}
//               </button>
//               <button onClick={submitFeedback} className="submit-btn">
//                 {t("submit", { defaultValue: "Submit" })}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UnitQuizComplete;



import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookIcon from "./images/Score icon.svg";
import pointsIcon from "./images/points.svg";
import "./QuizComplete.css";
import apiClient from '../services';
import { useTranslation } from "react-i18next";
import { useAuth } from '../context/AuthContext';
import trackEvent from '../utils/trackEvent';

const UnitQuizComplete = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(state?.quizData || null);
  const [studentQuizId, setStudentQuizId] = useState(state?.studentQuizId || null); // New state for studentQuizId
  const [loading, setLoading] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState("Keep going, wizard!");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [nextAction, setNextAction] = useState(null); // 'review' or 'continue'
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      trackEvent(user.id, 'pageview', {
        page: '/unit-quiz-complete',
        category: 'Navigation',
      });
    }

    const fetchQuizData = async () => {
      if (!quizData || !studentQuizId) {
        const storedAnswers = localStorage.getItem('unitQuizAnswers');
        const storedQuizId = localStorage.getItem('lastStudentQuizId');
        if (storedAnswers && storedQuizId) {
          const answers = JSON.parse(storedAnswers);
          const score = answers.filter((ans) => ans.is_correct).length;
          const newQuizData = {
            score: score,
            answers: answers,
            earned_points: score * 10,
            is_passed: score >= answers.length / 2,
            unit_id: state?.quizData?.unit_id, // Ensure unit_id is preserved
          };
          setQuizData(newQuizData);
          setStudentQuizId(storedQuizId); // Set studentQuizId from localStorage
          await fetchMotivationalMessage(score, answers.length);

          if (user?.id) {
            trackEvent(user.id, 'quiz_completed', {
              category: 'Quiz',
              label: 'Local Storage Unit Quiz',
              value: score,
              total_questions: answers.length,
              is_passed: newQuizData.is_passed,
              earned_points: newQuizData.earned_points,
            });
          }
        } else if (user?.id && state?.quizData?.unit_id) {
          // Fetch the latest unit quiz for the user
          try {
            const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
            const latestQuiz = response.data.progress.find(
              (quiz) => quiz.unit_id === state.quizData.unit_id && !quiz.lesson_id
            );
            if (latestQuiz) {
              setQuizData({
                ...state.quizData,
                studentQuizId: latestQuiz.id,
              });
              setStudentQuizId(latestQuiz.id); // Set studentQuizId
              localStorage.setItem('lastStudentQuizId', latestQuiz.id);
            } else {
              console.error('No matching unit quiz found in progress data');
              setQuizData({
                ...state.quizData,
                studentQuizId: null,
              });
              setStudentQuizId(null);
            }
          } catch (error) {
            console.error('Error fetching latest quiz:', error);
            setQuizData({
              ...state.quizData,
              studentQuizId: null,
            });
            setStudentQuizId(null);
          }
        }
      } else {
        await fetchMotivationalMessage(quizData.score, quizData.total_questions || quizData.answers.length);

        if (user?.id) {
          trackEvent(user.id, 'quiz_completed', {
            category: 'Quiz',
            label: 'Unit Quiz',
            value: quizData.score,
            total_questions: quizData.total_questions || quizData.answers.length,
            is_passed: quizData.is_passed,
            earned_points: quizData.earned_points,
          });
        }
      }
    };

    fetchQuizData();
  }, [quizData, studentQuizId, state, user]);

  const fetchMotivationalMessage = async (score, total) => {
    try {
      const language = navigator.language || 'en';
      const response = await apiClient.get('/api/motivation', {
        params: { score, total },
        headers: { 'Accept-Language': language },
      });

      if (response.data.success) {
        setMotivationalMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching motivational message:", error);
      setMotivationalMessage("Keep going, wizard!");
    }
  };

   // Check if feedback already exists for the quiz
   const checkExistingFeedback = async (quizId) => {
    try {
      const response = await apiClient.get(`/api/feedback/check/${quizId}`);
      return response.data.exists; // Backend should return { exists: true/false }
    } catch (error) {
      console.error('Error checking for existing feedback:', error);
      return false; // Assume no feedback exists if there's an error
    }
  };

  const handleReviewClick = async () => {
    if (user?.id) {
      trackEvent(user.id, 'quiz_review_initiated', {
        category: 'Quiz',
        label: 'Review button clicked',
      });
    }

    if (!studentQuizId) {
      console.error('Student quiz ID is missing');
      alert('Unable to proceed: Quiz ID is missing.');
      navigate('/lessons');
      return;
    }

    const hasFeedback = await checkExistingFeedback(studentQuizId);
    if (hasFeedback) {
      // If feedback exists, go directly to review
      performReview();
    } else {
      // If no feedback, show feedback modal
      setNextAction('review');
      setShowFeedbackModal(true);
    }
  };

  // Handle Continue button click
  const handleContinueClick = async () => {
    if (user?.id) {
      trackEvent(user.id, 'quiz_continue_clicked', {
        category: 'Navigation',
        label: 'Continue button clicked',
      });
    }

    if (!studentQuizId) {
      console.error('Student quiz ID is missing');
      alert('Unable to proceed: Quiz ID is missing.');
      navigate('/lessons');
      return;
    }

    const hasFeedback = await checkExistingFeedback(studentQuizId);
    if (hasFeedback) {
      // If feedback exists, go directly to lessons
      navigate("/lessons");
    } else {
      // If no feedback, show feedback modal
      setNextAction('continue');
      setShowFeedbackModal(true);
    }
  };

  const proceedAfterFeedback = () => {
    if (nextAction === 'review') {
      performReview();
    } else {
      navigate("/lessons");
    }
  };

  const performReview = async () => {
    setLoading(true);
    try {
      if (!studentQuizId) {
        throw new Error('Student Quiz ID is missing for review');
      }

      const response = await apiClient.get(`/api/quiz/review/${studentQuizId}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch review data');
      }

      const data = response.data;
      if (data.success) {
        if (user?.id) {
          trackEvent(user.id, 'quiz_review_accessed', {
            category: 'Quiz',
            label: 'Review Data Loaded',
            question_count: data.reviewData?.answers?.length || 0,
          });
        }
        navigate('/quiz-review', { state: { quizData: data.reviewData } });
      } else {
        navigate('/quiz-review', { state: { quizData: createFallbackReviewData(quizData) } });
      }
    } catch (error) {
      console.error('Error fetching review data:', error);
      if (user?.id) {
        trackEvent(user.id, 'quiz_review_error', {
          category: 'Error',
          label: 'Review Data Error',
          error: error.message,
        });
      }
      navigate('/quiz-review', { state: { quizData: createFallbackReviewData(quizData) } });
    } finally {
      setLoading(false);
    }
  };

  const createFallbackReviewData = (quizData) => ({
    score: quizData.score || 0,
    total_questions: quizData.total_questions || quizData.answers?.length || 0,
    earned_points: quizData.earned_points || 0,
    is_passed: quizData.is_passed || false,
    answers: (quizData.answers || []).map(answer => ({
      question_id: answer.question_id || 1,
      question: answer.question || "Question not available",
      options: answer.options || [],
      correct_answer: answer.correct_answer || "Answer not available",
      user_answer: answer.user_answer || "No answer provided",
      isCorrect: answer.isCorrect || false,
    })),
  });

  const submitFeedback = async () => {
    if (!feedbackScore) {
      alert(t('selectFeedbackScore', { defaultValue: 'Please select a feedback score!' }));
      return;
    }

    let currentStudentQuizId = studentQuizId || localStorage.getItem('lastStudentQuizId');
    if (!currentStudentQuizId && user?.id && quizData?.unit_id) {
      try {
        const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
        const latestQuiz = response.data.progress.find(
          (quiz) => quiz.unit_id === quizData.unit_id &&
           !quiz.lesson_id
        );
        if (latestQuiz) {
          currentStudentQuizId = latestQuiz.id;
          setStudentQuizId(latestQuiz.id); // Update state
          // localStorage.setItem('lastStudentQuizId', latestQuiz.id);
        }
      } catch (error) {
        console.error('Error fetching latest quiz for feedback:', error);
      }
    }

    if (!currentStudentQuizId) {
      alert(t('missingQuizId', { defaultValue: 'Student Quiz ID is missing. Please try again.' }));
      console.error('Student Quiz ID is undefined.');
      navigate('/lessons');
      return;
    }

    const userId = user?.id;
    if (!userId) {
      console.error('User is not authenticated');
      navigate('/login');
      return;
    }

    try {
      trackEvent(userId, 'quiz_feedback_submitted', {
        category: 'Feedback',
        label: 'Quiz Feedback Submitted',
        value: feedbackScore,
        comment_length: feedbackComment.length,
        has_comment: feedbackComment.length > 0,
        next_action: nextAction,
      });

      const response = await apiClient.post('/api/feedback/submit', {
        user_id: userId,
        student_quiz_id: currentStudentQuizId,
        feedback_score: feedbackScore,
        comment: feedbackComment || '',
      });

      if (response.data.success) {
        setShowFeedbackModal(false);
        proceedAfterFeedback();
      } else {
        console.error('Failed to submit feedback:', response.data.message);
        proceedAfterFeedback();
      }
    } catch (error) {
      if (user?.id) {
        trackEvent(user.id, 'quiz_feedback_error', {
          category: 'Error',
          label: 'Feedback Submission Error',
          error: error.response?.data?.message || error.message,
        });
      }
      console.error('Error submitting feedback:', error);
      proceedAfterFeedback();
    }
  };

  const skipFeedback = () => {
    if (user?.id) {
      trackEvent(user.id, 'quiz_feedback_skipped', {
        category: 'Feedback',
        label: 'Feedback Skipped',
        next_action: nextAction
      });
    }
    setShowFeedbackModal(false);
    proceedAfterFeedback();
  };

  

  if (!quizData) return <div>Loading...</div>;

  return (
    <div className="quizcomplete">
      <div className="quiz-complete-container">
        <img src={bookIcon} alt="Book Icon" className="book" />
        <h1 className="title">{t("profileUnitCompletedGeneric")}</h1>
        <div className="score-points">
          <div className="score-container">
            <div className="score-circle">
              <p>{quizData.score} / {quizData.total_questions || quizData.answers.length}</p>
            </div>
            <p className="motivation-text">{motivationalMessage}</p>
          </div>
          <div className="points-container">
            <img src={pointsIcon} alt="Points Icon" className="points-icon" />
            <p className="points-text">{quizData.earned_points} {t("profilePointsEarned")}</p>
          </div>
        </div>
        <div className="buttons-container">
          <button 
            className="review-btn" 
            onClick={handleReviewClick}
            disabled={loading}
          >
            {t("review")}
          </button>
          <button 
            className="continue-btn" 
            onClick={handleContinueClick}
          >
            {t("continue")}
          </button>
        </div>
      </div>

      {showFeedbackModal && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <h3>{t("feedbackTitle", { defaultValue: "How was your experience?" })}</h3>
            <div className="emoji-container">
              {[1, 2, 3, 4, 5].map(score => (
                <span
                  key={score}
                  className={`emoji ${feedbackScore === score ? 'selected' : ''}`}
                  onClick={() => {
                    setFeedbackScore(score);
                    if (user?.id) {
                      trackEvent(user.id, 'quiz_feedback_score_selected', {
                        category: 'Feedback',
                        label: 'Feedback Score Selected',
                        value: score
                      });
                    }
                  }}
                >
                  {score === 1 && "😢"}
                  {score === 2 && "🙁"}
                  {score === 3 && "😐"}
                  {score === 4 && "😊"}
                  {score === 5 && "😍"}
                </span>
              ))}
            </div>
            <textarea
              className="feedback-comment"
              placeholder={t("feedbackCommentPlaceholder", { defaultValue: "Add your comment here..." })}
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              rows="4"
            />
            <div className="feedback-buttons">
              <button onClick={skipFeedback} className="skip-btn">
                {t("skip", { defaultValue: "Skip" })}
              </button>
              <button onClick={submitFeedback} className="submit-btn">
                {t("submit", { defaultValue: "Submit" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitQuizComplete;