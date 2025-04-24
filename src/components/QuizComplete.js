import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookIcon from "./images/Score icon.svg";
import pointsIcon from "./images/points.svg";
import "./QuizComplete.css";
import apiClient from '../services';
import { useTranslation } from "react-i18next";
import { useAuth } from '../context/AuthContext';
import trackEvent from '../utils/trackEvent';
import Loading from "./Loading.js"; 

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
  const [newRewards, setNewRewards] = useState([]); // حالة جديدة للمكافآت
  const [showRewardsPopup, setShowRewardsPopup] = useState(false); // حالة للتحكم في النافذة المنبثقة
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

      // استخراج المكافآت الجديدة من quizData
      setNewRewards(quizData?.achievements || []);
      console.log("New Rewards", quizData.achievements);
      
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
    if (newRewards.length > 0) {
      setShowRewardsPopup(true);
      if (user?.id) {
        trackEvent(user.id, 'new_rewards_popup_shown', {
          category: 'Achievements',
          label: 'New Rewards Popup',
          reward_count: newRewards.length,
        });
      }
    } else {
      if (nextAction === 'review') {
        performReview();
      } else {
        navigate("/lessons");
      }
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
      alert(t("quizcomplete.selectFeedbackScore"));
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

  // دالة لإغلاق النافذة المنبثقة والانتقال
  const closeRewardsPopupAndProceed = () => {
    if (user?.id) {
      trackEvent(user.id, 'new_rewards_popup_closed', {
        category: 'Achievements',
        label: 'New Rewards Popup Closed',
        next_action: nextAction,
      });
    }
    setShowRewardsPopup(false);
    if (nextAction === 'review') {
      performReview();
    } else {
      navigate("/lessons");
    }
  };

  if (!quizData) return <Loading />;

  return (
    <div className="quizcomplete">
      <div className="quiz-complete-container">
        <img src={bookIcon} alt="Book Icon" className="book" />
        <h1 className="title">{t("quizcomplete.LessonCompleted")}</h1>
        <div className="score-points">
          <div className="score-container">
            <div className="score-circle">
              <p>
                {quizData.score} /{" "}
                {quizData.total_questions || quizData.answers.length}
              </p>
            </div>
            <p className="motivation-text">{motivationalMessage}</p>
          </div>
          <div className="points-container">
            <img src={pointsIcon} alt="Points Icon" className="points-icon" />
            <p className="points-text">
              {quizData.earned_points} {t("quizcomplete.profilePointsEarned")}
            </p>
          </div>
        </div>
        <div className="buttons-container">
          <button
            className="review-btn"
            onClick={handleReviewClick}
            disabled={loading}
          >
            {t("quizcomplete.review")}
          </button>
          <button className="continue-btn" onClick={handleContinueClick}>
            {t("quizcomplete.continue")}
          </button>
        </div>
      </div>

      {showFeedbackModal && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <h3>{t("quizcomplete.feedback.feedbackTitle")}</h3>
            <div className="emoji-container">
              {[1, 2, 3, 4, 5].map((score) => (
                <span
                  key={score}
                  className={`emoji ${
                    feedbackScore === score ? "selected" : ""
                  }`}
                  onClick={() => {
                    setFeedbackScore(score);
                    if (user?.id) {
                      trackEvent(user.id, "quiz_feedback_score_selected", {
                        category: "Feedback",
                        label: "Feedback Score Selected",
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
              placeholder={t(
                "quizcomplete.feedback.feedbackCommentPlaceholder"
              )}
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              rows="4"
            />
            <div className="feedback-buttons">
              <button onClick={skipFeedback} className="skip-btn">
                {t("quizcomplete.feedback.skip")}
              </button>
              <button onClick={submitFeedback} className="submit-btn">
                {t("quizcomplete.feedback.submit")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRewardsPopup && (
        // <div className="rewards-popup-overlay">
        //   <div className="rewards-popup">
        //     <h3>{t("newRewardsTitle", { defaultValue: "New Rewards Unlocked!" })}</h3>
        //     <div className="rewards-list">
        //       {newRewards.map((reward) => (
        //         <div key={reward.id} className="reward-item">
        // <img
        //   src={
        //     reward.image.startsWith("http")
        //       ? reward.image
        //       : `${apiClient.defaults.baseURL}${reward.image}`
        //   }
        //   alt={reward.title}
        //   className="reward-image"
        //   onError={(e) => {
        //     e.target.src = "https://via.placeholder.com/50";
        //     e.target.alt = `${reward.title} (Image not found)`;
        //   }}
        // />
        //           <p>{reward.title}</p>
        //         </div>
        //       ))}
        //     </div>
        // <button onClick={closeRewardsPopupAndProceed} className="reward-button">
        //   {t("continue", { defaultValue: "Continue" })}
        // </button>
        //   </div>
        // </div>

        <div className="rewards-popup-overlay">
          <div className="rewards-popup">
            <h3>
              {t("quizcomplete.reward.newRewardsTitle")}
            </h3>
            <div className="rewards-list">
              {newRewards.map((reward) => (
                <div key={reward.id} className="reward-item">
                  <img
                    src={
                      reward.image.startsWith("http")
                        ? reward.image
                        : `${apiClient.defaults.baseURL}${reward.image}`
                    }
                    alt={reward.title}
                    className="reward-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50";
                      e.target.alt = `${reward.title} (Image not found)`;
                    }}
                  />
                  <p>{reward.title}</p>
                </div>
              ))}
            </div>
            {/* حاوية الرسوم المتحركة */}
            <div className="reward-animation">
              {[...Array(15)].map((_, i) => (
                <span
                  key={i}
                  className="reward-animation-particle"
                  style={{
                    left: `${Math.random() * 100}%`, // موقع عشوائي أفقيًا
                    animationDelay: `${Math.random() * 2}s`, // تأخير عشوائي
                  }}
                >
                  🎉 {/* يمكنك تغيير الرمز التعبيري */}
                </span>
              ))}
            </div>
            <button
              onClick={closeRewardsPopupAndProceed}
              className="reward-button"
            >
              {t("quizcomplete.reward.continue", { defaultValue: "Continue" })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComplete;