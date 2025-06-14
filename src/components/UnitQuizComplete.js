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

const UnitQuizComplete = () => {
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
  const [newRewards, setNewRewards] = useState([]);
  const [showRewardsPopup, setShowRewardsPopup] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    trackEvent(user.id, 'pageview', {
      page: '/unit-quiz-complete',
      category: 'Navigation',
    }, user).catch((error) => {
      console.error('Failed to track pageview:', error);
    });

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
            unit_id: state?.quizData?.unit_id,
          };
          setQuizData(newQuizData);
          setStudentQuizId(storedQuizId);
          await fetchMotivationalMessage(score, answers.length);

          trackEvent(user.id, 'quiz_completed', {
            category: 'Quiz',
            label: 'Local Storage Unit Quiz',
            value: score,
            total_questions: answers.length,
            is_passed: newQuizData.is_passed,
            earned_points: newQuizData.earned_points,
          }, user).catch((error) => {
            console.error('Failed to track quiz_completed:', error);
          });
        } else if (user?.id && state?.quizData?.unit_id) {
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
              setStudentQuizId(latestQuiz.id);
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

        trackEvent(user.id, 'quiz_completed', {
          category: 'Quiz',
          label: 'Unit Quiz',
          value: quizData.score,
          total_questions: quizData.total_questions || quizData.answers.length,
          is_passed: quizData.is_passed,
          earned_points: quizData.earned_points,
        }, user).catch((error) => {
          console.error('Failed to track quiz_completed:', error);
        });
      }

      setNewRewards(quizData?.achievements || []);
    };

    fetchQuizData();
  }, [quizData, studentQuizId, state, user, navigate]);

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

  const checkExistingFeedback = async (quizId) => {
    if (!user || !user.id) {
      console.log('No user, skipping feedback check');
      return false;
    }

    try {
      const response = await apiClient.get(`/api/feedback/check/${quizId}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking for existing feedback:', error);
      return false;
    }
  };

  const handleReviewClick = async () => {
    if (!user || !user.id) {
      console.log('No user, skipping quiz_review_initiated tracking');
      navigate('/login');
      return;
    }

    trackEvent(user.id, 'quiz_review_initiated', {
      category: 'Quiz',
      label: 'Review button clicked',
    }, user).catch((error) => {
      console.error('Failed to track quiz_review_initiated:', error);
    });

    if (!studentQuizId) {
      console.error('Student quiz ID is missing');
      alert(t('missingQuizId', { defaultValue: 'Unable to proceed: Quiz ID is missing.' }));
      navigate('/lessons');
      return;
    }

    const hasFeedback = await checkExistingFeedback(studentQuizId);
    if (hasFeedback) {
      performReview();
    } else {
      setNextAction('review');
      setShowFeedbackModal(true);
    }
  };

  const handleContinueClick = async () => {
    if (!user || !user.id) {
      console.log('No user, skipping quiz_continue_clicked tracking');
      navigate('/login');
      return;
    }

    trackEvent(user.id, 'quiz_continue_clicked', {
      category: 'Navigation',
      label: 'Continue button clicked',
    }, user).catch((error) => {
      console.error('Failed to track quiz_continue_clicked:', error);
    });

    if (!studentQuizId) {
      console.error('Student quiz ID is missing');
      alert(t('missingQuizId', { defaultValue: 'Unable to proceed: Quiz ID is missing.' }));
      navigate('/lessons');
      return;
    }

    const hasFeedback = await checkExistingFeedback(studentQuizId);
    if (hasFeedback) {
      navigate("/lessons");
    } else {
      setNextAction('continue');
      setShowFeedbackModal(true);
    }
  };

  const proceedAfterFeedback = () => {
    if (newRewards.length > 0) {
      setShowRewardsPopup(true);
      if (user?.id) {
        trackEvent(user.id, 'new_rewards_popup_shown', {
          category: 'Achievements',
          label: 'New Rewards Popup',
          reward_count: newRewards.length,
        }, user).catch((error) => {
          console.error('Failed to track new_rewards_popup_shown:', error);
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

  const performReview = async () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

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
        trackEvent(user.id, 'quiz_review_accessed', {
          category: 'Quiz',
          label: 'Review Data Loaded',
          question_count: data.reviewData?.answers?.length || 0,
        }, user).catch((error) => {
          console.error('Failed to track quiz_review_accessed:', error);
        });
        navigate('/quiz-review', { state: { quizData: data.reviewData } });
      } else {
        navigate('/quiz-review', { state: { quizData: createFallbackReviewData(quizData) } });
      }
    } catch (error) {
      console.error('Error fetching review data:', error);
      trackEvent(user.id, 'quiz_review_error', {
        category: 'Error',
        label: 'Review Data Error',
        error: error.message,
      }, user).catch((error) => {
        console.error('Failed to track quiz_review_error:', error);
      });
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
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (!feedbackScore || isNaN(feedbackScore)) {
      setErrorMessage(t("quizcomplete.selectFeedbackScore")); 
      return;
    }

    let currentStudentQuizId = studentQuizId || localStorage.getItem('lastStudentQuizId');
    if (!currentStudentQuizId && user?.id && quizData?.unit_id) {
      try {
        const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
        const latestQuiz = response.data.progress.find(
          (quiz) => quiz.unit_id === quizData.unit_id && !quiz.lesson_id
        );
        if (latestQuiz) {
          currentStudentQuizId = latestQuiz.id;
          setStudentQuizId(latestQuiz.id);
        } else {
          console.error(
            'No matching quiz found in progress data for unit_id:',
            quizData.unit_id
          );
          alert(
            t('missingQuizId', {
              defaultValue: 'Unable to submit feedback: Quiz ID is missing. Redirecting to lessons.',
            })
          );
          trackEvent(user.id, 'quiz_feedback_error', {
            category: 'Error',
            label: 'Missing Student Quiz ID',
          }, user).catch((error) => {
            console.error('Failed to track quiz_feedback_error:', error);
          });
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
        trackEvent(user.id, 'quiz_feedback_error', {
          category: 'Error',
          label: 'Feedback Submission Error',
          error: error.message,
        }, user).catch((error) => {
          console.error('Failed to track quiz_feedback_error:', error);
        });
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
      trackEvent(user.id, 'quiz_feedback_error', {
        category: 'Error',
        label: 'Missing Student Quiz ID',
      }, user).catch((error) => {
        console.error('Failed to track quiz_feedback_error:', error);
      });
      navigate('/lessons');
      return;
    }

    const userId = user?.id;
    const payload = {
      user_id: userId,
      student_quiz_id: currentStudentQuizId,
      feedback_score: Number(feedbackScore),
      comment: feedbackComment || '',
    };

    try {
      trackEvent(userId, 'quiz_feedback_submitted', {
        category: 'Feedback',
        label: 'Feedback Submitted',
        value: Number(feedbackScore),
        comment_length: feedbackComment.length,
        has_comment: feedbackComment.length > 0,
        next_action: nextAction,
      }, user).catch((error) => {
        console.error('Failed to track quiz_feedback_submitted:', error);
      });

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
      trackEvent(user.id, 'quiz_feedback_error', {
        category: 'Error',
        label: 'Feedback Submission Error',
        error: error.response?.data?.message || error.message,
      }, user).catch((error) => {
        console.error('Failed to track quiz_feedback_error:', error);
      });
      setShowFeedbackModal(false);
      proceedAfterFeedback();
    }
  };

  const skipFeedback = () => {
    if (!user || !user.id) {
      console.log('No user, skipping quiz_feedback_skipped tracking');
      setShowFeedbackModal(false);
      proceedAfterFeedback();
      return;
    }

    trackEvent(user.id, 'quiz_feedback_skipped', {
      category: 'Feedback',
      label: 'Feedback Skipped',
      next_action: nextAction,
    }, user).catch((error) => {
      console.error('Failed to track quiz_feedback_skipped:', error);
    });
    setShowFeedbackModal(false);
    proceedAfterFeedback();
  };

  const closeRewardsPopupAndProceed = () => {
    if (!user || !user.id) {
      console.log('No user, skipping new_rewards_popup_closed tracking');
      setShowRewardsPopup(false);
      if (nextAction === 'review') {
        performReview();
      } else {
        navigate("/lessons");
      }
      return;
    }

    trackEvent(user.id, 'new_rewards_popup_closed', {
      category: 'Achievements',
      label: 'New Rewards Popup Closed',
      next_action: nextAction,
    }, user).catch((error) => {
      console.error('Failed to track new_rewards_popup_closed:', error);
    });
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
        <h1 className="title">{t("unitcomplete.profileUnitCompletedGeneric")}</h1>
        <div className="score-points">
          <div className="score-container">
            <div className="score-circle">
              <p>{quizData.score} / {quizData.total_questions || quizData.answers.length}</p>
            </div>
            <p className="motivation-text">{motivationalMessage}</p>
          </div>
          <div className="points-container">
            <img src={pointsIcon} alt="Points Icon" className="points-icon" />
            <p className="points-text">{quizData.earned_points} {t("unitcomplete.profilePointsEarned")}</p>
          </div>
        </div>
        <div className="buttons-container">
          <button 
            className="review-btn" 
            onClick={handleReviewClick}
            disabled={loading}
          >
            {t("unitcomplete.review")}
          </button>
          <button 
            className="continue-btn" 
            onClick={handleContinueClick}
          >
            {t("unitcomplete.continue")}
          </button>
        </div>
      </div>

      {showFeedbackModal && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <p>{t("unitcomplete.feedback.feedbackTitle")}</p>
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
                        value: score,
                      }, user).catch((error) => {
                        console.error('Failed to track quiz_feedback_score_selected:', error);
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
              placeholder={t("unitcomplete.feedback.feedbackCommentPlaceholder")}
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              rows="4"
            />
            <div className="feedback-buttons">
              <button onClick={skipFeedback} className="skip-btn">
                {t("unitcomplete.feedback.skip")}
              </button>
              <button onClick={submitFeedback} className="submit-btn">
                {t("unitcomplete.feedback.submit")}
              </button>
              {errorMessage && (
              <div className="alert-popup-overlay">
              <div className="alert-popup-content">
             <span className="alert-popup-close" onClick={() => setErrorMessage("")}>×</span>
             {errorMessage}
            </div>
            </div>
            )}
            </div>
          </div>
        </div>
      )}

      {showRewardsPopup && (
        <div className="rewards-popup-overlay">
          <div className="rewards-popup">
            <p>
              {t("quizcomplete.reward.newRewardsTitle")}
            </p>
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
            <div className="reward-animation">
              {[...Array(15)].map((_, i) => (
                <span
                  key={i}
                  className="reward-animation-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  🎉
                </span>
              ))}
            </div>
            <button
              onClick={closeRewardsPopupAndProceed}
              className="reward-button"
            >
              {t("continue", { defaultValue: "Continue" })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitQuizComplete;