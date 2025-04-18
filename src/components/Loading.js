// import React from "react";
// import wizardImg from "./images/Pax.svg";

// const LoadingPage = () => {
//   return (
//       <div className="loading-container">
//         <p className="loading">Loading...</p>
//         {/* <img
//           src="https://media.giphy.com/media/y1ZBcOGOOtlpC/giphy.gif" // تقدر تغير اللينك لأي صورة تحبها
//           alt="Loading"
//           className="w-48 h-48 object-contain"
//         /> */}
//         <img src={wizardImg} alt="wizard" className="wizardImage" />
//       </div>
//   );
// };

// export default LoadingPage;

import React from "react";
import "./Loading.css"; // تأكدي إن اسم الملف ده هو اللي كتبتيه فعلاً
import PaxImg from "./images/PAXcharacter.svg";

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="loading-box">
        <p>Loading...</p>
        {/* <img
          src="https://media.giphy.com/media/y1ZBcOGOOtlpC/giphy.gif"
          alt="Loading"
        /> */}
        <img src={PaxImg} alt="wizard" className="wizardImage" />
      </div>
    </div>
  );
};

export default LoadingPage;
