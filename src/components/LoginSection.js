import React from "react";
import "./LoginSection.css";
import { useNavigate } from "react-router-dom";

const LoginSection = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    navigate("/lessons"); // توجيه المستخدم للصفحة المطلوبة
  };

  return (
    <section className="Login-section">
      <div className="Lform-container">
        <form onSubmit={handleSubmit}> {/* استدعاء handleSubmit عند الإرسال */}
          <label>User Name</label>
          <input type="text" placeholder="Name" />

          <label>Password</label>
          <input type="password" placeholder="Password" />

          <button className="Lbutton" type="submit">Log In</button> {/* لم نعد بحاجة إلى onClick هنا */}
        </form>
      </div>
    </section>
  );
};

export default LoginSection;
