// // // import React, { useEffect, useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import "./ProgressReport.css";
// // // import Exit from "./images/Exit iconsvg.svg";
// // // import points from "./images/points.svg";
// // // import { useAuth } from '../context/AuthContext';
// // // import { useTranslation } from "react-i18next";
// // // import apiClient from '../services';
// // // import trackEvent from '../utils/trackEvent';
// // // import Loading from "./Loading.js"; 

// // // const ProgressReport = () => {
// // //   const { user } = useAuth();
// // //   const [progressData, setProgressData] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const navigate = useNavigate();
// // //   const { t } = useTranslation();

// // //   // useEffect(() => {
// // //   //   // Track page view
// // //   //   if (user?.id) {
// // //   //     trackEvent(user.id, 'pageview', { 
// // //   //       page: '/progress-report',
// // //   //       category: 'Navigation'
// // //   //     });
// // //   //   }

// // //   //   const fetchProgress = async () => {
// // //   //     setLoading(true);
// // //   //     try {
// // //   //       const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
        
// // //   //       if (response.status !== 200) {
// // //   //         throw new Error("Failed to fetch progress");
// // //   //       }
  
// // //   //       const data = response.data;
  
// // //   //       if (data.success && data.progress.length > 0) {
// // //   //         setProgressData(data.progress);
// // //   //         // Track successful progress report load
// // //   //         trackEvent(user.id, 'progress_report_loaded', {
// // //   //           category: 'Progress',
// // //   //           label: 'Progress Data Loaded',
// // //   //           quiz_count: data.progress.length
// // //   //         });
// // //   //       } else {
// // //   //         throw new Error("No progress data available");
// // //   //       }
// // //   //     } catch (error) {
// // //   //       console.error("Error fetching progress, using dummy data:", error);
// // //   //       // Track progress report error
// // //   //       trackEvent(user.id, 'progress_report_error', {
// // //   //         category: 'Error',
// // //   //         label: 'Progress Data Error',
// // //   //         error: error.message
// // //   //       });
        
// // //   //       // Track dummy data usage
// // //   //       trackEvent(user.id, 'progress_report_dummy_data', {
// // //   //         category: 'Fallback',
// // //   //         label: 'Using Dummy Data'
// // //   //       });
// // //   //     } finally {
// // //   //       setLoading(false);
// // //   //     }
// // //   //   };
  
// // //   //   fetchProgress();
// // //   // }, [user]);

// // //   useEffect(() => {
// // //     const fetchProgress = async () => {
// // //       setLoading(true); // بداية التحميل
// // //       try {
// // //         const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
// // //         if (response.status !== 200) {
// // //           throw new Error("Failed to fetch progress");
// // //         }
// // //         const data = response.data;
// // //         if (data.success && data.progress.length > 0) {
// // //           setProgressData(data.progress); // تعيين البيانات المسترجعة
// // //         } else {
// // //           throw new Error("No progress data available");
// // //         }
// // //       } catch (error) {
// // //         setError(error.message); // التعامل مع الفشل
// // //       } finally {
// // //         setLoading(false); // إنهاء التحميل
// // //       }
// // //     };
// // //     fetchProgress();
// // //   }, [user]);
  

// // //   const handleCardClick = (quiz) => {
// // //     // Track quiz selection from progress report
// // //     trackEvent(user.id, 'quiz_selected_from_progress', {
// // //       category: 'Progress',
// // //       label: 'Quiz Selected',
// // //       quiz_id: quiz.id,
// // //       quiz_type: quiz.lesson_id ? 'Lesson Quiz' : 'Unit Quiz',
// // //       score: quiz.score,
// // //       is_passed: quiz.is_passed
// // //     });

// // //     const quizData = {
// // //       score: quiz.score || 0,
// // //       answers: Array(quiz.total_questions || 10)
// // //         .fill()
// // //         .map((_, i) => ({
// // //           isCorrect: i < (quiz.score || 0),
// // //         })),
// // //       earned_points: quiz.earned_points || 0,
// // //       is_passed: quiz.is_passed || false,
// // //       id: quiz.id,
// // //     };

// // //     if (quiz.lesson_id) {
// // //       navigate("/quiz-complete", { state: { quizData } });
// // //     } else if (quiz.unit_id) {
// // //       navigate("/unit-quiz-complete", { state: { quizData } });
// // //     }
// // //   };

// // //   const handleBackClick = () => {
// // //     // Track back button click
// // //     trackEvent(user.id, 'back_button_clicked', {
// // //       category: 'Navigation',
// // //       label: 'Back to Profile'
// // //     });
// // //     navigate("/profile");
// // //   };

// // //   return (
// // //     <div className="progress-report-bg">
// // //       <button className="back-button" onClick={handleBackClick}>
// // //         <img src={Exit} alt="Back" className="back-icon" />
// // //       </button>
// // //       <div className="progress-report-container">
// // //         <div className="progress-report-header">{t("profileProgressReport")}</div>
// // //         {loading ? (
// // //           <Loading />
// // //         ) : (
// // //           <div className="progress-cards">
// // //             {progressData.map((quiz) => (
// // //               <div
// // //                 key={quiz.id}
// // //                 className={`progress-card ${quiz.is_passed ? 'passed' : 'failed'}`}
// // //                 onClick={() => handleCardClick(quiz)}
// // //               >
// // //                 <div className="pscore-circle">
// // //                   {quiz.score} / {quiz.total_questions}
// // //                 </div>
// // //                 <p className="lesson-info">
// // //                   {quiz.lesson_id && quiz.lesson_number
// // //                     ? `${t("unit")} ${quiz.unit_id}, ${t("lesson")} ${quiz.lesson_number}`
// // //                     : `${t("unit")} ${quiz.unit_id}`}
// // //                 </p>
// // //                 <div className="points-earned">
// // //                   <img src={points} alt="points icon" className="points" />
// // //                   {quiz.earned_points} {t("profilePointsEarned")}
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ProgressReport;

// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import "./ProgressReport.css";
// // import Exit from "./images/Exit iconsvg.svg";
// // import points from "./images/points.svg";
// // import { useAuth } from '../context/AuthContext';
// // import { useTranslation } from "react-i18next";
// // import apiClient from '../services';
// // import trackEvent from '../utils/trackEvent';
// // import Loading from "./Loading.js"; 
// // import PyMagicRunner from "./Pymagic_runnergame.js"; 


// // const ProgressReport = () => {
// //   const { user } = useAuth();
// //   const [progressData, setProgressData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(""); // إضافة حالة الخطأ
// //   const navigate = useNavigate();
// //   const { t } = useTranslation();

// //   useEffect(() => {
// //     const fetchProgress = async () => {
// //       setLoading(true); // بداية التحميل
// //       setError(""); // إعادة تعيين الخطأ قبل البدء في جلب البيانات
// //       try {
// //         const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
// //         if (response.status !== 200) {
// //           throw new Error("Failed to fetch progress");
// //         }
// //         const data = response.data;
// //         if (data.success && data.progress.length > 0) {
// //           setProgressData(data.progress); // تعيين البيانات المسترجعة
// //         } else {
// //           throw new Error("No progress data available");
// //         }
// //       } catch (error) {
// //         setError(error.message); // التعامل مع الفشل
// //       } finally {
// //         setLoading(false); // إنهاء التحميل
// //       }
// //     };
// //     fetchProgress();
// //   }, [user]);

// //   const handleCardClick = (quiz) => {
// //     // Track quiz selection from progress report
// //     trackEvent(user.id, 'quiz_selected_from_progress', {
// //       category: 'Progress',
// //       label: 'Quiz Selected',
// //       quiz_id: quiz.id,
// //       quiz_type: quiz.lesson_id ? 'Lesson Quiz' : 'Unit Quiz',
// //       score: quiz.score,
// //       is_passed: quiz.is_passed
// //     });

// //     const quizData = {
// //       score: quiz.score || 0,
// //       answers: Array(quiz.total_questions || 10)
// //         .fill()
// //         .map((_, i) => ({
// //           isCorrect: i < (quiz.score || 0),
// //         })),
// //       earned_points: quiz.earned_points || 0,
// //       is_passed: quiz.is_passed || false,
// //       id: quiz.id,
// //     };

// //     if (quiz.lesson_id) {
// //       navigate("/quiz-complete", { state: { quizData } });
// //     } else if (quiz.unit_id) {
// //       navigate("/unit-quiz-complete", { state: { quizData } });
// //     }
// //   };

// //   const handleBackClick = () => {
// //     // Track back button click
// //     trackEvent(user.id, 'back_button_clicked', {
// //       category: 'Navigation',
// //       label: 'Back to Profile'
// //     });
// //     navigate("/profile");
// //   };

// //   return (
// //     <div className="progress-report-bg">
// //       <button className="back-button" onClick={handleBackClick}>
// //         <img src={Exit} alt="Back" className="back-icon" />
// //       </button>
// //       <div className="progress-report-container">
// //         <div className="progress-report-header">{t("profileProgressReport")}</div>
// //         {loading ? (
// //           <Loading />
// //         ) : error ? (
// //          <PyMagicRunner />
// //         ) : (
// //           <div className="progress-cards">
// //             {progressData.map((quiz) => (
// //               <div
// //                 key={quiz.id}
// //                 className={`progress-card ${quiz.is_passed ? 'passed' : 'failed'}`}
// //                 onClick={() => handleCardClick(quiz)}
// //               >
// //                 <div className="pscore-circle">
// //                   {quiz.score} / {quiz.total_questions}
// //                 </div>
// //                 <p className="lesson-info">
// //                   {quiz.lesson_id && quiz.lesson_number
// //                     ? `${t("unit")} ${quiz.unit_id}, ${t("lesson")} ${quiz.lesson_number}`
// //                     : `${t("unit")} ${quiz.unit_id}`}
// //                 </p>
// //                 <div className="points-earned">
// //                   <img src={points} alt="points icon" className="points" />
// //                   {quiz.earned_points} {t("profilePointsEarned")}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProgressReport;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./ProgressReport.css";
// import Exit from "./images/Exit iconsvg.svg";
// import points from "./images/points.svg";
// import { useAuth } from '../context/AuthContext';
// import { useTranslation } from "react-i18next";
// import apiClient from '../services';
// import trackEvent from '../utils/trackEvent';
// import Loading from "./Loading.js"; 
// import PyMagicRunner from "./Pymagic_runnergame.js";  // استيراد PyMagicRunner

// const ProgressReport = () => {
//   const { user } = useAuth();
//   const [progressData, setProgressData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(""); 
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   useEffect(() => {
//     const fetchProgress = async () => {
//       setLoading(true);
//       setError(""); 
//       try {
//         const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
//         if (response.status !== 200) {
//           throw new Error("Failed to fetch progress");
//         }
//         const data = response.data;
//         if (data.success && data.progress.length > 0) {
//           setProgressData(data.progress); 
//         } else {
//           throw new Error("No progress data available");
//         }
//       } catch (error) {
//         setError(error.message); 
//       } finally {
//         setLoading(false); 
//       }
//     };
//     fetchProgress();
//   }, [user]);

//   const handleCardClick = (quiz) => {
//     trackEvent(user.id, 'quiz_selected_from_progress', {
//       category: 'Progress',
//       label: 'Quiz Selected',
//       quiz_id: quiz.id,
//       quiz_type: quiz.lesson_id ? 'Lesson Quiz' : 'Unit Quiz',
//       score: quiz.score,
//       is_passed: quiz.is_passed
//     });

//     const quizData = {
//       score: quiz.score || 0,
//       answers: Array(quiz.total_questions || 10)
//         .fill()
//         .map((_, i) => ({
//           isCorrect: i < (quiz.score || 0),
//         })),
//       earned_points: quiz.earned_points || 0,
//       is_passed: quiz.is_passed || false,
//       id: quiz.id,
//     };

//     if (quiz.lesson_id) {
//       navigate("/quiz-complete", { state: { quizData } });
//     } else if (quiz.unit_id) {
//       navigate("/unit-quiz-complete", { state: { quizData } });
//     }
//   };

//   const handleBackClick = () => {
//     trackEvent(user.id, 'back_button_clicked', {
//       category: 'Navigation',
//       label: 'Back to Profile'
//     });
//     navigate("/profile");
//   };

//   return (
//     <div className="progress-report-bg">
//       <button className="back-button" onClick={handleBackClick}>
//         <img src={Exit} alt="Back" className="back-icon" />
//       </button>
//       <div className="progress-report-container">
//         <div className="progress-report-header">{t("profileProgressReport")}</div>
//         {loading ? (
//           <Loading />  
//         ) : error ? (
//           <PyMagicRunner /> 
//         ) : (
//           <div className="progress-cards">
//             {progressData.map((quiz) => (
//               <div
//                 key={quiz.id}
//                 className={`progress-card ${quiz.is_passed ? 'passed' : 'failed'}`}
//                 onClick={() => handleCardClick(quiz)}
//               >
//                 <div className="pscore-circle">
//                   {quiz.score} / {quiz.total_questions}
//                 </div>
//                 <p className="lesson-info">
//                   {quiz.lesson_id && quiz.lesson_number
//                     ? `${t("unit")} ${quiz.unit_id}, ${t("lesson")} ${quiz.lesson_number}`
//                     : `${t("unit")} ${quiz.unit_id}`}
//                 </p>
//                 <div className="points-earned">
//                   <img src={points} alt="points icon" className="points" />
//                   {quiz.earned_points} {t("profilePointsEarned")}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProgressReport;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProgressReport.css";
import Exit from "./images/Exit iconsvg.svg";
import points from "./images/points.svg";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";
import apiClient from '../services';
import trackEvent from '../utils/trackEvent';
import Loading from "./Loading.js"; 
import PyMagicRunner from "./Pymagic_runnergame.js"; 

const ProgressReport = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(""); 
      try {
        const response = await apiClient.get(`/api/quiz/progress/${user.id}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch progress");
        }
        const data = response.data;
        if (data.success && data.progress.length > 0) {
          setProgressData(data.progress); 
        } else {
          throw new Error("No progress data available");
        }
      } catch (error) {
        setError(error.message); 
      } finally {
        setLoading(false); 
      }
    };
    fetchProgress();
  }, [user]);

  const handleCardClick = (quiz) => {
    trackEvent(user.id, 'quiz_selected_from_progress', {
      category: 'Progress',
      label: 'Quiz Selected',
      quiz_id: quiz.id,
      quiz_type: quiz.lesson_id ? 'Lesson Quiz' : 'Unit Quiz',
      score: quiz.score,
      is_passed: quiz.is_passed
    });

    const quizData = {
      score: quiz.score || 0,
      answers: Array(quiz.total_questions || 10)
        .fill()
        .map((_, i) => ({
          isCorrect: i < (quiz.score || 0),
        })),
      earned_points: quiz.earned_points || 0,
      is_passed: quiz.is_passed || false,
      id: quiz.id,
    };

    if (quiz.lesson_id) {
      navigate("/quiz-complete", { state: { quizData } });
    } else if (quiz.unit_id) {
      navigate("/unit-quiz-complete", { state: { quizData } });
    }
  };

  const handleBackClick = () => {
    trackEvent(user.id, 'back_button_clicked', {
      category: 'Navigation',
      label: 'Back to Profile'
    });
    navigate("/profile");
  };

  // هنا نقوم بإظهار Loading أو PyMagicRunner خارج الـ return بناءً على الحالة
  if (loading) {
    return <Loading />; // يظهر Loading إذا كانت الحالة في تحميل
  }

  if (error) {
    return <PyMagicRunner />; // يظهر PyMagicRunner في حالة حدوث خطأ
  }

  return (
    <div className="progress-report-bg">
      <button className="back-button" onClick={handleBackClick}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>
      <div className="progress-report-container">
        <div className="progress-report-header">{t("profileProgressReport")}</div>
        <div className="progress-cards">
          {progressData.map((quiz) => (
            <div
              key={quiz.id}
              className={`progress-card ${quiz.is_passed ? 'passed' : 'failed'}`}
              onClick={() => handleCardClick(quiz)}
            >
              <div className="pscore-circle">
                {quiz.score} / {quiz.total_questions}
              </div>
              <p className="lesson-info">
                {quiz.lesson_id && quiz.lesson_number
                  ? `${t("unit")} ${quiz.unit_id}, ${t("lesson")} ${quiz.lesson_number}`
                  : `${t("unit")} ${quiz.unit_id}`}
              </p>
              <div className="points-earned">
                <img src={points} alt="points icon" className="points" />
                {quiz.earned_points} {t("profilePointsEarned")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressReport;
