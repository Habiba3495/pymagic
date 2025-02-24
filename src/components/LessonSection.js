// import React from "react";
// import "./Lessonspage.css";
// import Sidebar from "./Lsidebar"; // Import the Sidebar component

// const LessonUnit = ({ title, color }) => {
//   return <div className={Lesson-unit ${color}}>{title}</div>;
// };

// const LessonsSection = () => {
//   return (
//     <div className="page-container">
//       <Sidebar />
//       <div className="content">
//         <LessonUnit title="Unit 1: Introduction to Programming" color="purple" />
//         <LessonUnit title="Unit 2: Getting Started with Python" color="yellow" />
//         <LessonUnit title="Unit 3: Introducing Variables" color="teal" />
//       </div>
//     </div>
//   );
// };

// export default LessonSection;

// import React from "react";
// // استيراد الشريط الجانبي
// import "./LessonSection.css";

// const LessonUnit = ({ title, color }) => {
//   return <div className={`lesson-unit ${color}`}>{title}</div>;
// };

// const LessonSection = () => {
//   return (
//     <div className="page-container">

//       <div className="content">
//         <LessonUnit title="Unit 1: Introduction to Programming" color="purple" />
//         <LessonUnit title="Unit 2: Getting Started with Python" color="yellow" />
//         <LessonUnit title="Unit 3: Introducing Variables" color="teal" />
//       </div>
//     </div>
//   );
// };

// export default LessonSection;

import React from "react";
import Lsidebar from "./Lsidebar"; // استيراد الشريط الجانبي
import "./LessonSection.css";

const LessonUnit = ({ title, color }) => {
  return <div className={`lesson-unit ${color}`}>{title}</div>;
};

const LessonSection = () => {
  return (
    <div className="page-container">
      <Lsidebar />  {/* الشريط الجانبي */}

      <div className="content">
        <LessonUnit title="Unit 1: Introduction to Programming" color="purple" />
        <LessonUnit title="Unit 2: Getting Started with Python" color="yellow" />
        <LessonUnit title="Unit 3: Introducing Variables" color="teal" />
      </div>
    </div>
  );
};

export default LessonSection;

