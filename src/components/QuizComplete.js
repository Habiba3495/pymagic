// // import React, { useEffect, useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import bookIcon from "./images/Score icon.svg";
// // import pointsIcon from "./images/points.svg";
// // import "./QuizComplete.css";
// // import apiClient from '../services';
// // import { useTranslation } from "react-i18next";
// // import { useAuth } from '../context/AuthContext';
// // import trackEvent from '../utils/trackEvent';

// // const QuizComplete = () => {
// //   const { state } = useLocation();
// //   const navigate = useNavigate();
// //   const [quizData, setQuizData] = useState(state?.quizData || null);
// //   const [loading, setLoading] = useState(false);
// //   const [motivationalMessage, setMotivationalMessage] = useState("Keep going, wizard!");
// //   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
// //   const [feedbackScore, setFeedbackScore] = useState(null);
// //   const [feedbackComment, setFeedbackComment] = useState("");
// //   const [nextAction, setNextAction] = useState(null); // 'review' or 'continue'
// //   const { t } = useTranslation();
// //   const { user } = useAuth();

// //   useEffect(() => {
// //     if (user?.id) {
// //       trackEvent(user.id, 'pageview', { 
// //         page: '/quiz-complete',
// //         category: 'Navigation'
// //       });
// //     }

// //     const fetchQuizData = async () => {
// //       if (!quizData) {
// //         const storedAnswers = localStorage.getItem("quizAnswers");
// //         if (storedAnswers) {
// //           const answers = JSON.parse(storedAnswers);
// //           const score = answers.filter(ans => ans.is_correct).length;
// //           const newQuizData = {
// //             score: score,
// //             answers: answers,
// //             earned_points: score * 10,
// //             is_passed: score >= (answers.length / 2),
// //           };
// //           setQuizData(newQuizData);
// //           await fetchMotivationalMessage(score, answers.length);
          
// //           if (user?.id) {
// //             trackEvent(user.id, 'quiz_completed', {
// //               category: 'Quiz',
// //               label: 'Local Storage Quiz',
// //               value: score,
// //               total_questions: answers.length,
// //               is_passed: newQuizData.is_passed,
// //               earned_points: newQuizData.earned_points
// //             });
// //           }
// //         }
// //       } else {
// //         await fetchMotivationalMessage(quizData.score, quizData.total_questions || quizData.answers.length);
        
// //         if (user?.id) {
// //           trackEvent(user.id, 'quiz_completed', {
// //             category: 'Quiz',
// //             label: 'Lesson Quiz',
// //             value: quizData.score,
// //             total_questions: quizData.total_questions || quizData.answers.length,
// //             is_passed: quizData.is_passed,
// //             earned_points: quizData.earned_points
// //           });
// //         }
// //       }
// //     };

// //     fetchQuizData();
// //   }, [quizData, state, user]);

// //   const fetchMotivationalMessage = async (score, total) => {
// //     try {
// //       const language = navigator.language || 'en';
// //       const response = await apiClient.get('/api/motivation', {
// //         params: { score, total },
// //         headers: { 'Accept-Language': language },
// //       });

// //       if (response.data.success) {
// //         setMotivationalMessage(response.data.message);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching motivational message:", error);
// //       setMotivationalMessage("Keep going, wizard!");
// //     }
// //   };

// //   const handleReviewClick = () => {
// //     setNextAction('review');
// //     setShowFeedbackModal(true);
    
// //     if (user?.id) {
// //       trackEvent(user.id, 'quiz_review_initiated', {
// //         category: 'Quiz',
// //         label: 'Review Button Clicked'
// //       });
// //     }
// //   };

// //   const handleContinueClick = () => {
// //     setNextAction('continue');
// //     setShowFeedbackModal(true);
    
// //     if (user?.id) {
// //       trackEvent(user.id, 'quiz_continue_clicked', {
// //         category: 'Navigation',
// //         label: 'Continue Button Clicked'
// //       });
// //     }
// //   };

// //   const proceedAfterFeedback = () => {
// //     if (nextAction === 'review') {
// //       performReview();
// //     } else {
// //       navigate("/lessons");
// //     }
// //   };

// //   const performReview = async () => {
// //     setLoading(true);
// //     try {
// //       const studentQuizId = state?.studentQuizId;
// //       if (!studentQuizId) {
// //         throw new Error("Student Quiz ID is missing for review");
// //       }
      
// //       const response = await apiClient.get(`/api/quiz/review/${studentQuizId}`);
// //       if (response.status !== 200) {
// //         throw new Error("Failed to fetch review data");
// //       }

// //       const data = response.data;
// //       if (data.success) {
// //         if (user?.id) {
// //           trackEvent(user.id, 'quiz_review_accessed', {
// //             category: 'Quiz',
// //             label: 'Review Data Loaded',
// //             question_count: data.reviewData?.answers?.length || 0
// //           });
// //         }
// //         navigate("/quiz-review", { state: { quizData: data.reviewData } });
// //       } else {
// //         navigate("/quiz-review", { state: { quizData: createFallbackReviewData(quizData) } });
// //       }
// //     } catch (error) {
// //       console.error("Error fetching review data:", error);
// //       if (user?.id) {
// //         trackEvent(user.id, 'quiz_review_error', {
// //           category: 'Error',
// //           label: 'Review Data Error',
// //           error: error.message
// //         });
// //       }
// //       navigate("/quiz-review", { state: { quizData: createFallbackReviewData(quizData) } });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const createFallbackReviewData = (quizData) => ({
// //     score: quizData.score || 0,
// //     total_questions: quizData.total_questions || quizData.answers?.length || 0,
// //     earned_points: quizData.earned_points || 0,
// //     is_passed: quizData.is_passed || false,
// //     answers: (quizData.answers || []).map(answer => ({
// //       question_id: answer.question_id || 1,
// //       question: answer.question || "Question not available",
// //       options: answer.options || [],
// //       correct_answer: answer.correct_answer || "Answer not available",
// //       user_answer: answer.user_answer || answer.selected_answer || "No answer provided",
// //       isCorrect: answer.is_correct || false,
// //     })),
// //   });

// //   const submitFeedback = async () => {
// //     if (!feedbackScore) {
// //       alert("Please select a feedback score!");
// //       return;
// //     }

// //     const studentQuizId = state?.studentQuizId;
// //     if (!studentQuizId) {
// //       alert("Student Quiz ID is missing. Please try again.");
// //       console.error("Student Quiz ID is undefined.");
// //       navigate("/lessons");
// //       return;
// //     }

// //     const userId = user?.id;
// //     if (!userId) {
// //       console.error("User is not authenticated");
// //       navigate("/login");
// //       return;
// //     }

// //     try {
// //       trackEvent(userId, 'quiz_feedback_submitted', {
// //         category: 'Feedback',
// //         label: 'Quiz Feedback Submitted',
// //         value: feedbackScore,
// //         comment_length: feedbackComment.length,
// //         has_comment: feedbackComment.length > 0,
// //         next_action: nextAction // Track whether this was before review or continue
// //       });

// //       const response = await apiClient.post('/api/feedback/submit', {
// //         user_id: userId,
// //         student_quiz_id: studentQuizId,
// //         feedback_score: feedbackScore,
// //         comment: feedbackComment || '',
// //       });

// //       if (response.data.success) {
// //         setShowFeedbackModal(false);
// //         proceedAfterFeedback();
// //       } else {
// //         console.error("Failed to submit feedback:", response.data.message);
// //         proceedAfterFeedback();
// //       }
// //     } catch (error) {
// //       if (user?.id) {
// //         trackEvent(user.id, 'quiz_feedback_error', {
// //           category: 'Error',
// //           label: 'Feedback Submission Error',
// //           error: error.response?.data?.message || error.message
// //         });
// //       }
// //       proceedAfterFeedback();
// //     }
// //   };

// //   const skipFeedback = () => {
// //     if (user?.id) {
// //       trackEvent(user.id, 'quiz_feedback_skipped', {
// //         category: 'Feedback',
// //         label: 'Feedback Skipped',
// //         next_action: nextAction
// //       });
// //     }
// //     setShowFeedbackModal(false);
// //     proceedAfterFeedback();
// //   };

// //   if (!quizData) return <div>Loading...</div>;

// //   return (
// //     <div className="quizcomplete">
// //       <div className="quiz-complete-container">
// //         <img src={bookIcon} alt="Book Icon" className="book" />
// //         <h1 className="title">{t("lessonQuizCompleted")}</h1>
// //         <div className="score-points">
// //           <div className="score-container">
// //             <div className="score-circle">
// //               <p>{quizData.score} / {quizData.total_questions || quizData.answers.length}</p>
// //             </div>
// //             <p className="motivation-text">{motivationalMessage}</p>
// //           </div>
// //           <div className="points-container">
// //             <img src={pointsIcon} alt="Points Icon" className="points-icon" />
// //             <p className="points-text">{quizData.earned_points} {t("profilePointsEarned")}</p>
// //           </div>
// //         </div>
// //         <div className="buttons-container">
// //           <button 
// //             className="review-btn" 
// //             onClick={handleReviewClick}
// //             disabled={loading}
// //           >
// //             {t("review")}
// //           </button>
// //           <button 
// //             className="continue-btn" 
// //             onClick={handleContinueClick}
// //           >
// //             {t("continue")}
// //           </button>
// //         </div>
// //       </div>

// //       {showFeedbackModal && (
// //         <div className="feedback-modal-overlay">
// //           <div className="feedback-modal">
// //             <p>{t("feedbackTitle", { defaultValue: "How was your experience?" })}</p>
// //             <div className="emoji-container">
// //               {[1, 2, 3, 4, 5].map(score => (
// //                 <span
// //                   key={score}
// //                   className={`emoji ${feedbackScore === score ? 'selected' : ''}`}
// //                   onClick={() => {
// //                     setFeedbackScore(score);
// //                     if (user?.id) {
// //                       trackEvent(user.id, 'quiz_feedback_score_selected', {
// //                         category: 'Feedback',
// //                         label: 'Feedback Score Selected',
// //                         value: score
// //                       });
// //                     }
// //                   }}
// //                 >
// //                   {score === 1 && "😢"}
// //                   {score === 2 && "🙁"}
// //                   {score === 3 && "😐"}
// //                   {score === 4 && "😊"}
// //                   {score === 5 && "😍"}
// //                 </span>
// //               ))}
// //             </div>
// //             <textarea
// //               className="feedback-comment"
// //               placeholder={t("feedbackCommentPlaceholder", { defaultValue: "Add your comment here..." })}
// //               value={feedbackComment}
// //               onChange={(e) => setFeedbackComment(e.target.value)}
// //               rows="4"
// //             />
// //             <div className="feedback-buttons">
// //               <button onClick={skipFeedback} className="skip-btn">
// //                 {t("skip", { defaultValue: "Skip" })}
// //               </button>
// //               <button onClick={submitFeedback} className="submit-btn">
// //                 {t("submit", { defaultValue: "Submit" })}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default QuizComplete;

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import bookIcon from "./images/Score icon.svg";
// import pointsIcon from "./images/points.svg";
// import "./QuizComplete.css";
// import apiClient from '../services';
// import { useTranslation } from "react-i18next";
// import { useAuth } from '../context/AuthContext';
// import trackEvent from '../utils/trackEvent';
// import PyMagicRunner from './Pymagic_runnergame'; 

// const QuizComplete = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [quizData, setQuizData] = useState(state?.quizData || null);
//   const [loading, setLoading] = useState(false);
//   const [motivationalMessage, setMotivationalMessage] = useState("Keep going, wizard!");
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [feedbackScore, setFeedbackScore] = useState(null);
//   const [feedbackComment, setFeedbackComment] = useState("");
//   const [nextAction, setNextAction] = useState(null); // 'review' or 'continue'
//   const [showAlertPopup, setShowAlertPopup] = useState(false); // ستايت للبوب أب
//   const [alertMessage, setAlertMessage] = useState(""); // رسالة البوب أب
//   const { t } = useTranslation();
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user?.id) {
//       trackEvent(user.id, 'pageview', { 
//         page: '/quiz-complete',
//         category: 'Navigation'
//       });
//     }

//     const fetchQuizData = async () => {
//       if (!quizData) {
//         const storedAnswers = localStorage.getItem("quizAnswers");
//         if (storedAnswers) {
//           const answers = JSON.parse(storedAnswers);
//           const score = answers.filter(ans => ans.is_correct).length;
//           const newQuizData = {
//             score: score,
//             answers: answers,
//             earned_points: score * 10,
//             is_passed: score >= (answers.length / 2),
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
//               earned_points: newQuizData.earned_points
//             });
//           }
//         }
//       } else {
//         await fetchMotivationalMessage(quizData.score, quizData.total_questions || quizData.answers.length);
        
//         if (user?.id) {
//           trackEvent(user.id, 'quiz_completed', {
//             category: 'Quiz',
//             label: 'Lesson Quiz',
//             value: quizData.score,
//             total_questions: quizData.total_questions || quizData.answers.length,
//             is_passed: quizData.is_passed,
//             earned_points: quizData.earned_points
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
//       const studentQuizId = state?.studentQuizId;
//       if (!studentQuizId) {
//         throw new Error("Student Quiz ID is missing for review");
//       }
      
//       const response = await apiClient.get(`/api/quiz/review/${studentQuizId}`);
//       if (response.status !== 200) {
//         return <PyMagicRunner />;
//       }

//       const data = response.data;
//       if (data.success) {
//         if (user?.id) {
//           trackEvent(user.id, 'quiz_review_accessed', {
//             category: 'Quiz',
//             label: 'Review Data Loaded',
//             question_count: data.reviewData?.answers?.length || 0
//           });
//         }
//         navigate("/quiz-review", { state: { quizData: data.reviewData } });
//       } else {
//         navigate("/quiz-review", { state: { quizData: createFallbackReviewData(quizData) } });
//       }
//     } catch (error) {
//       console.error("Error fetching review data:", error);
//       if (user?.id) {
//         trackEvent(user.id, 'quiz_review_error', {
//           category: 'Error',
//           label: 'Review Data Error',
//           error: error.message
//         });
//       }
//       navigate("/quiz-review", { state: { quizData: createFallbackReviewData(quizData) } });
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
//       user_answer: answer.user_answer || answer.selected_answer || "No answer provided",
//       isCorrect: answer.is_correct || false,
//     })),
//   });

//   const submitFeedback = async () => {
//     if (!feedbackScore) {
//       setAlertMessage( t('alertMessage'));
//       setShowAlertPopup(true); // إظهار البوب أب
//       return;
//     }

//     const studentQuizId = state?.studentQuizId;
//     if (!studentQuizId) {
//       setAlertMessage(t('missingQuizId', { defaultValue: 'معرف الكويز غير موجود. من فضلك حاولي مرة أخرى.' }));
//       setShowAlertPopup(true); // إظهار البوب أب
//       console.error("Student Quiz ID is undefined.");
//       navigate("/lessons");
//       return;
//     }

//     const userId = user?.id;
//     if (!userId) {
//       console.error("User is not authenticated");
//       navigate("/login");
//       return;
//     }

//     try {
//       trackEvent(userId, 'quiz_feedback_submitted', {
//         category: 'Feedback',
//         label: 'Quiz Feedback Submitted',
//         value: feedbackScore,
//         comment_length: feedbackComment.length,
//         has_comment: feedbackComment.length > 0,
//         next_action: nextAction
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
//         console.error("Failed to submit feedback:", response.data.message);
//         proceedAfterFeedback();
//       }
//     } catch (error) {
//       if (user?.id) {
//         trackEvent(user.id, 'quiz_feedback_error', {
//           category: 'Error',
//           label: 'Feedback Submission Error',
//           error: error.response?.data?.message || error.message
//         });
//       }
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
//         <h1 className="title">{t("lessonQuizCompleted")}</h1>
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
//             <p>{t("feedbackTitle", { defaultValue: "How was your experience?" })}</p>
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

//       {showAlertPopup && (
//         <div className="alert-popup-overlay" onClick={() => setShowAlertPopup(false)}>
//           <div className="alert-popup-content" onClick={(e) => e.stopPropagation()}>
//             <span className="alert-popup-close" onClick={() => setShowAlertPopup(false)}>
//               ×
//             </span>
//             <p >{setAlertMessage}</p>
//             {/* <button
//               className="alert-popup-button"
//               onClick={() => setShowAlertPopup(false)}
//             >
//               {t('ok', { defaultValue: 'موافق' })}
//             </button> */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizComplete;


// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import bookIcon from "./images/Score icon.svg";
// import pointsIcon from "./images/points.svg";
// import "./QuizComplete.css";
// import apiClient from '../services';
// import { useTranslation } from "react-i18next";
// import { useAuth } from '../context/AuthContext';
// import trackEvent from '../utils/trackEvent';
// import PyMagicRunner from './Pymagic_runnergame'; 

// const QuizComplete = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [quizData, setQuizData] = useState(state?.quizData || null);
//   const [loading, setLoading] = useState(false);
//   const [motivationalMessage, setMotivationalMessage] = useState("Keep going, wizard!");
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [feedbackScore, setFeedbackScore] = useState(null);
//   const [feedbackComment, setFeedbackComment] = useState("");
//   const [nextAction, setNextAction] = useState(null); // 'review' or 'continue'
//   const [showAlertPopup, setShowAlertPopup] = useState(false); // ستايت للبوب أب
//   const [alertMessage, setAlertMessage] = useState(""); // رسالة البوب أب
//   const { t } = useTranslation();
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user?.id) {
//       trackEvent(user.id, 'pageview', { 
//         page: '/quiz-complete',
//         category: 'Navigation'
//       });
//     }

//     const fetchQuizData = async () => {
//       if (!quizData) {
//         const storedAnswers = localStorage.getItem("quizAnswers");
//         if (storedAnswers) {
//           const answers = JSON.parse(storedAnswers);
//           const score = answers.filter(ans => ans.is_correct).length;
//           const newQuizData = {
//             score: score,
//             answers: answers,
//             earned_points: score * 10,
//             is_passed: score >= (answers.length / 2),
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
//               earned_points: newQuizData.earned_points
//             });
//           }
//         }
//       } else {
//         await fetchMotivationalMessage(quizData.score, quizData.total_questions || quizData.answers.length);
        
//         if (user?.id) {
//           trackEvent(user.id, 'quiz_completed', {
//             category: 'Quiz',
//             label: 'Lesson Quiz',
//             value: quizData.score,
//             total_questions: quizData.total_questions || quizData.answers.length,
//             is_passed: quizData.is_passed,
//             earned_points: quizData.earned_points
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
//       const studentQuizId = quizData.studentQuizId; // Use quizData.studentQuizId
//       if (!studentQuizId) {
//         throw new Error("Student Quiz ID is missing for review");
//       }
      
//       const response = await apiClient.get(`/api/quiz/review/${studentQuizId}`);
//       if (response.status !== 200) {
//         throw new Error("Failed to fetch review data");
//       }
  
//       const data = response.data;
//       if (data.success) {
//         if (user?.id) {
//           trackEvent(user.id, 'quiz_review_accessed', {
//             category: 'Quiz',
//             label: 'Review Data Loaded',
//             question_count: data.reviewData?.answers?.length || 0
//           });
//         }
//         navigate("/quiz-review", { state: { quizData: data.reviewData } });
//       } else {
//         navigate("/quiz-review", { state: { quizData: createFallbackReviewData(quizData) } });
//       }
//     } catch (error) {
//       console.error("Error fetching review data:", error);
//       if (user?.id) {
//         trackEvent(user.id, 'quiz_review_error', {
//           category: 'Error',
//           label: 'Review Data Error',
//           error: error.message
//         });
//       }
//       navigate("/quiz-review", { state: { quizData: createFallbackReviewData(quizData) } });
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
//       user_answer: answer.user_answer || answer.selected_answer || "No answer provided",
//       isCorrect: answer.is_correct || false,
//     })),
//   });

// // QuizComplete.js
// const submitFeedback = async () => {
//   if (!feedbackScore) {
//     setAlertMessage(t('selectFeedbackScore', { defaultValue: 'select Feedback Score '}));
//     setShowAlertPopup(true);
//     return;
//   }

//   const studentQuizId = quizData.studentQuizId; // Use quizData.studentQuizId
//   if (!studentQuizId) {
//     setAlertMessage(t('missingQuizId', { defaultValue: 'معرف الكويز غير موجود. من فضلك حاولي مرة أخرى.' }));
//     setShowAlertPopup(true);
//     console.error("Student Quiz ID is undefined.");
//     navigate("/lessons");
//     return;
//   }

//   const userId = user?.id;
//   if (!userId) {
//     console.error("User is not authenticated");
//     navigate("/login");
//     return;
//   }

//   try {
//     trackEvent(userId, 'quiz_feedback_submitted', {
//       category: 'Feedback',
//       label: 'Quiz Feedback Submitted',
//       value: feedbackScore,
//       comment_length: feedbackComment.length,
//       has_comment: feedbackComment.length > 0,
//       next_action: nextAction
//     });

//     const response = await apiClient.post('/api/feedback/submit', {
//       user_id: userId,
//       student_quiz_id: studentQuizId,
//       feedback_score: feedbackScore,
//       comment: feedbackComment || '',
//     });

//     if (response.data.success) {
//       setShowFeedbackModal(false);
//       proceedAfterFeedback();
//     } else {
//       console.error("Failed to submit feedback:", response.data.message);
//       proceedAfterFeedback();
//     }
//   } catch (error) {
//     if (user?.id) {
//       trackEvent(user.id, 'quiz_feedback_error', {
//         category: 'Error',
//         label: 'Feedback Submission Error',
//         error: error.response?.data?.message || error.message
//       });
//     }
//     proceedAfterFeedback();
//   }
// };

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
//         <h1 className="title">{t("lessonQuizCompleted")}</h1>
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
//             <p>{t("feedbackTitle", { defaultValue: "How was your experience?" })}</p>
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

//       {showAlertPopup && (
//         <div className="alert-popup-overlay" onClick={() => setShowAlertPopup(false)}>
//           <div className="alert-popup-content" onClick={(e) => e.stopPropagation()}>
//             <span className="alert-popup-close" onClick={() => setShowAlertPopup(false)}>
//               ×
//             </span>
//             <p>{alertMessage}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizComplete;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookIcon from "./images/Score icon.svg";
import pointsIcon from "./images/points.svg";
import "./QuizComplete.css";
import apiClient from '../services';
import { useTranslation } from "react-i18next";
import { useAuth } from '../context/AuthContext';
import trackEvent from '../utils/trackEvent';

const QuizComplete = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(state?.quizData || null);
  const [studentQuizId, setStudentQuizId] = useState(state?.studentQuizId || null);
  const [loading, setLoading] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState("Keep going, wizard!");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [nextAction, setNextAction] = useState(null);
  const { t } = useTranslation();
  const { user } = useAuth();

  // Track page view on component mount
  useEffect(() => {
    if (user?.id) {
      trackEvent(user.id, 'pageview', {
        page: '/quiz-complete',
        category: 'Navigation',
      });
    }

    const fetchQuizData = async () => {
      if (!quizData || !studentQuizId) {
        const storedAnswers = localStorage.getItem('quizAnswers');
        const storedQuizId = localStorage.getItem('lastStudentQuizId');
        if (storedAnswers && storedQuizId) {
          const answers = JSON.parse(storedAnswers);
          const score = answers.filter((ans) => ans.is_correct).length;
          const newQuizData = {
            score: score,
            answers: answers,
            earned_points: score * 10,
            is_passed: score >= answers.length / 2,
            unit_id: state?.quizData?.unit_id,
            lesson_id: state?.quizData?.lesson_id,
            studentQuizId: storedQuizId,
            total_questions: answers.length,
          };
          setQuizData(newQuizData);
          setStudentQuizId(storedQuizId);
          await fetchMotivationalMessage(score, answers.length);

          if (user?.id) {
            trackEvent(user.id, 'quiz_completed', {
              category: 'Quiz',
              label: 'Local Storage Quiz',
              value: score,
              total_questions: answers.length,
              is_passed: newQuizData.is_passed,
              earned_points: newQuizData.earned_points,
            });
          }
        } else if (user?.id && state?.quizData?.unit_id && state?.quizData?.lesson_id) {
          try {
            const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
            const latestQuiz = response.data.progress.find(
              (quiz) =>
                quiz.unit_id === state.quizData.unit_id &&
                quiz.lesson_id === state.quizData.lesson_id
            );
            if (latestQuiz) {
              const newQuizData = {
                ...state.quizData,
                score: latestQuiz.score,
                earned_points: latestQuiz.earned_points,
                is_passed: latestQuiz.is_passed,
                answers: latestQuiz.questions || state.quizData.answers,
                studentQuizId: latestQuiz.id,
                total_questions: latestQuiz.total_questions || state.quizData.answers.length,
              };
              setQuizData(newQuizData);
              setStudentQuizId(latestQuiz.id);
              localStorage.setItem('lastStudentQuizId', latestQuiz.id);
              await fetchMotivationalMessage(latestQuiz.score, latestQuiz.total_questions || state.quizData.answers.length);

              if (user?.id) {
                trackEvent(user.id, 'quiz_completed', {
                  category: 'Quiz',
                  label: 'API Fetched Quiz',
                  value: latestQuiz.score,
                  total_questions: latestQuiz.total_questions || state.quizData.answers.length,
                  is_passed: latestQuiz.is_passed,
                  earned_points: latestQuiz.earned_points,
                });
              }
            } else {
              console.error('No matching quiz found in progress data for unit_id:', state.quizData.unit_id, 'lesson_id:', state.quizData.lesson_id);
              setQuizData(state.quizData);
              setStudentQuizId(state.studentQuizId || storedQuizId);
            }
          } catch (error) {
            console.error('Error fetching latest quiz:', error);
            setQuizData(state.quizData);
            setStudentQuizId(state.studentQuizId || storedQuizId);
          }
        } else {
          console.error('Missing required data to fetch quiz: user_id or unit_id/lesson_id');
          setQuizData(state.quizData);
          setStudentQuizId(state.studentQuizId || storedQuizId);
        }
      } else {
        await fetchMotivationalMessage(quizData.score, quizData.total_questions || quizData.answers.length);

        if (user?.id) {
          trackEvent(user.id, 'quiz_completed', {
            category: 'Quiz',
            label: 'State Quiz',
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

  // Fetch motivational message based on score
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

  // Handle Review button click
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

  // Proceed after feedback submission or skip
  const proceedAfterFeedback = () => {
    if (nextAction === 'review') {
      performReview();
    } else {
      navigate("/lessons");
    }
  };

  // Perform quiz review
  const performReview = async () => {
    setLoading(true);
    try {
      if (!studentQuizId) {
        throw new Error('Student quiz ID is missing');
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
            label: 'Review data loaded',
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
          label: 'Error in review data',
          error: error.message,
        });
      }
      navigate('/quiz-review', { state: { quizData: createFallbackReviewData(quizData) } });
    } finally {
      setLoading(false);
    }
  };

  // Create fallback review data if API fails
  const createFallbackReviewData = (quizData) => ({
    score: quizData.score || 0,
    total_questions: quizData.total_questions || quizData.answers?.length || 0,
    earned_points: quizData.earned_points || 0,
    is_passed: quizData.is_passed || false,
    answers: (quizData.answers || []).map((answer) => ({
      question_id: answer.question_id || 1,
      question: answer.question || "Question not available",
      options: answer.options || [],
      correct_answer: answer.correct_answer || "Answer not available",
      user_answer: answer.user_answer || "No answer provided",
      isCorrect: answer.isCorrect || false,
    })),
  });

  // Submit feedback
  const submitFeedback = async () => {
    if (!feedbackScore || isNaN(feedbackScore)) {
      alert(t('selectFeedbackScore', { defaultValue: 'Please select a valid feedback score!' }));
      return;
    }

    let currentStudentQuizId = studentQuizId || localStorage.getItem('lastStudentQuizId');
    if (!currentStudentQuizId && user?.id && quizData?.unit_id && quizData?.lesson_id) {
      try {
        const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
        const latestQuiz = response.data.progress.find(
          (quiz) =>
            quiz.unit_id === quizData.unit_id &&
            quiz.lesson_id === quizData.lesson_id
        );
        if (latestQuiz) {
          currentStudentQuizId = latestQuiz.id;
          setStudentQuizId(latestQuiz.id);
          // localStorage.setItem('lastStudentQuizId', latestQuiz.id);
        } else {
          console.error(
            'No matching quiz found in progress data for unit_id:',
            quizData.unit_id,
            'lesson_id:',
            quizData.lesson_id
          );
          alert(
            t('missingQuizId', {
              defaultValue: 'Unable to submit feedback: Quiz ID is missing. Redirecting to lessons.',
            })
          );
          if (user?.id) {
            trackEvent(user.id, 'quiz_feedback_error', {
              category: 'Error',
              label: 'Missing Student Quiz ID',
            });
          }
          navigate('/lessons');
          return;
        }
      } catch (error) {
        console.error('Error fetching latest quiz for feedback:', error);
        alert(
          t('missingQuizId', {
            defaultValue: 'Unable to submit feedback: Quiz ID is missing. Redirecting to lessons.',
          })
        );
        if (user?.id) {
          trackEvent(user.id, 'quiz_feedback_error', {
            category: 'Error',
            label: 'Feedback Submission Error',
            error: error.message,
          });
        }
        navigate('/lessons');
        return;
      }
    }

    if (!currentStudentQuizId) {
      alert(
        t('missingQuizId', {
          defaultValue: 'Unable to submit feedback: Quiz ID is missing. Redirecting to lessons.',
        })
      );
      console.error('Student Quiz ID is undefined.');
      if (user?.id) {
        trackEvent(user.id, 'quiz_feedback_error', {
          category: 'Error',
          label: 'Missing Student Quiz ID',
        });
      }
      navigate('/lessons');
      return;
    }

    const userId = user?.id;
    if (!userId) {
      console.error('User is not authenticated');
      navigate('/login');
      return;
    }

    const payload = {
      user_id: userId,
      student_quiz_id: currentStudentQuizId,
      feedback_score: Number(feedbackScore),
      comment: feedbackComment || '',
    };

    try {
      console.log('Submitting feedback with payload:', payload);
      if (user?.id) {
        trackEvent(user.id, 'quiz_feedback_submitted', {
          category: 'Feedback',
          label: 'Feedback Submitted',
          value: Number(feedbackScore),
          comment_length: feedbackComment.length,
          has_comment: feedbackComment.length > 0,
          next_action: nextAction,
        });
      }

      const response = await apiClient.post('/api/feedback/submit', payload);

      if (response.data.success) {
        console.log('Feedback submitted successfully:', response.data);
        setShowFeedbackModal(false);
        proceedAfterFeedback();
      } else {
        console.error('Failed to submit feedback:', response.data.message);
        if (response.data.message === 'Feedback already submitted for this quiz attempt') {
          alert(t('feedbackAlreadySubmitted', { defaultValue: 'You have already submitted feedback for this quiz.' }));
        } else {
          alert(t('feedbackError', { defaultValue: `Failed to submit feedback: ${response.data.message}` }));
        }
        setShowFeedbackModal(false);
        proceedAfterFeedback();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error.response?.data || error.message);
      if (error.response?.data?.message === 'Feedback already submitted for this quiz attempt') {
        alert(t('feedbackAlreadySubmitted', { defaultValue: 'You have already submitted feedback for this quiz.' }));
      } else {
        alert(
          t('feedbackError', {
            defaultValue: `Failed to submit feedback: ${error.response?.data?.message || error.message}`,
          })
        );
      }
      if (user?.id) {
        trackEvent(user.id, 'quiz_feedback_error', {
          category: 'Error',
          label: 'Feedback Submission Error',
          error: error.response?.data?.message || error.message,
        });
      }
      setShowFeedbackModal(false);
      proceedAfterFeedback();
    }
  };

  // Skip feedback
  const skipFeedback = () => {
    if (user?.id) {
      trackEvent(user.id, 'quiz_feedback_skipped', {
        category: 'Feedback',
        label: 'Feedback Skipped',
        next_action: nextAction,
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
        <h1 className="title">{t("profileLessonCompletedGeneric")}</h1>
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
          <button className="review-btn" onClick={handleReviewClick} disabled={loading}>
            {t("review")}
          </button>
          <button className="continue-btn" onClick={handleContinueClick}>
            {t("continue")}
          </button>
        </div>
      </div>

      {showFeedbackModal && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <h3>{t("feedbackTitle", { defaultValue: "How was your experience?" })}</h3>
            <div className="emoji-container">
              {[1, 2, 3, 4, 5].map((score) => (
                <span
                  key={score}
                  className={`emoji ${feedbackScore === score ? 'selected' : ''}`}
                  onClick={() => {
                    setFeedbackScore(score);
                    if (user?.id) {
                      trackEvent(user.id, 'quiz_feedback_score_selected', {
                        category: 'Feedback',
                        label: 'Feedback Score Selected',
                        value: score,
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

export default QuizComplete;